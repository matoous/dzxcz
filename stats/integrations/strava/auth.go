package strava

import (
	"context"
	"crypto/tls"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"net/http"
	"net/url"
	"os"
	"os/signal"
	"time"

	httptransport "github.com/go-openapi/runtime/client"
	"github.com/skratchdot/open-golang/open"
	"golang.org/x/oauth2"

	"github.com/matoous/sportstats/integrations/strava/client"
	"github.com/matoous/sportstats/integrations/strava/client/activities"
	"github.com/matoous/sportstats/integrations/strava/client/athletes"
)

func SaveProfile(ctx context.Context, tok *oauth2.Token) {
	athlete, err := client.Default.Athletes.GetLoggedInAthlete(&athletes.GetLoggedInAthleteParams{
		Context: ctx,
	}, httptransport.BearerToken(tok.AccessToken))
	if err != nil {
		panic(err)
	}
	data, err := athlete.Payload.MarshalJSON()
	if err != nil {
		panic(err)
	}
	if err := os.WriteFile("data/athlete.json", data, 0666); err != nil {
		panic(err)
	}

	stats, err := client.Default.Athletes.GetStats(&athletes.GetStatsParams{
		ID:      athlete.Payload.ID,
		Context: ctx,
	}, httptransport.BearerToken(tok.AccessToken))
	if err != nil {
		panic(err)
	}
	data, err = json.Marshal(stats.Payload)
	if err != nil {
		panic(err)
	}
	if err := os.WriteFile("data/stats.json", data, 0666); err != nil {
		panic(err)
	}

	zones, err := client.Default.Athletes.GetLoggedInAthleteZones(&athletes.GetLoggedInAthleteZonesParams{
		Context: ctx,
	}, httptransport.BearerToken(tok.AccessToken))
	if err != nil {
		panic(err)
	}
	data, err = json.Marshal(zones.Payload)
	if err != nil {
		panic(err)
	}
	if err := os.WriteFile("data/zones.json", data, 0666); err != nil {
		panic(err)
	}
}

func DownloadActivities(ctx context.Context, tok *oauth2.Token) {
	log.Println("Downloading activities")

	ctx, cancel := signal.NotifyContext(ctx, os.Interrupt)
	defer cancel()

	cnt := 0
	pageSize := int64(90)
	for page := int64(1); ; page++ {
		cnt++
		acs, err := client.Default.Activities.GetLoggedInAthleteActivities(&activities.GetLoggedInAthleteActivitiesParams{
			PerPage: &pageSize,
			Page:    &page,
			Context: ctx,
		}, httptransport.BearerToken(tok.AccessToken))
		if err != nil {
			panic(err)
		}
		for i := range acs.Payload {
			log.Printf("%d: %s\n", pageSize*page+int64(i), acs.Payload[i].Name)
			fName := fmt.Sprintf("data/activities/%d.json", acs.Payload[i].ID)
			if _, err := os.Stat(fName); !errors.Is(err, os.ErrNotExist) {
				continue
			}
			cnt++
			ac, err := client.Default.Activities.GetActivityByID(&activities.GetActivityByIDParams{
				ID:      acs.Payload[i].ID,
				Context: ctx,
			}, httptransport.BearerToken(tok.AccessToken))
			if err != nil {
				panic(err)
			}
			data, err := ac.Payload.MarshalJSON()
			if err != nil {
				panic(err)
			}
			if err := os.WriteFile(fName, data, 0666); err != nil {
				panic(err)
			}
			if cnt >= 95 {
				cnt = 0
				log.Println("Sleeping for 15 minutes")
				time.Sleep(15 * time.Minute)
			}
		}
	}
}

func Auth() (*oauth2.Token, error) {
	var token *oauth2.Token

	ctx := context.Background()
	conf := &oauth2.Config{
		ClientID:     "73821",
		ClientSecret: "af40e2ecb2ea928ec71d3a8b545d480e0cda1312",
		Scopes:       []string{"read_all,profile:read_all,activity:read_all"},
		Endpoint: oauth2.Endpoint{
			AuthURL:  "https://www.strava.com/api/v3/oauth/authorize",
			TokenURL: "https://www.strava.com/api/v3/oauth/token",
		},
		// my own callback URL
		RedirectURL: "http://localhost:8080/oauth/callback/strava",
	}

	// add transport for self-signed certificate to context
	tr := &http.Transport{
		TLSClientConfig: &tls.Config{InsecureSkipVerify: true},
	}
	sslcli := &http.Client{Transport: tr}
	ctx = context.WithValue(ctx, oauth2.HTTPClient, sslcli)

	// Redirect user to consent page to ask for permission
	// for the scopes specified above.
	authUrl := conf.AuthCodeURL("state", oauth2.AccessTypeOffline)

	open.Run(authUrl)

	stop := make(chan os.Signal)
	signal.Notify(stop, os.Interrupt)

	mux := http.NewServeMux()
	mux.HandleFunc("/oauth/callback/strava", func(w http.ResponseWriter, r *http.Request) {
		queryParts, _ := url.ParseQuery(r.URL.RawQuery)
		code := queryParts["code"][0]

		tok, err := conf.Exchange(ctx, code)
		if err != nil {
			log.Fatal(err)
		}
		token = tok

		w.Write([]byte("ok!"))

		stop <- os.Interrupt
	})

	srv := &http.Server{
		Addr:    ":8080",
		Handler: mux,
	}

	go func() {
		if err := srv.ListenAndServe(); err != nil {
			if err != http.ErrServerClosed {
				log.Fatal(err)
			}
		}
	}()

	<-stop

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := srv.Shutdown(ctx); err != nil {
		log.Fatal(err)
	}

	return token, nil
}
