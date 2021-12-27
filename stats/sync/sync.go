package sync

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"os"
	"path"
	"path/filepath"
	"strings"

	"github.com/matoous/sportstats/integrations/strava/models"
	"gopkg.in/yaml.v3"
)

func Activities() {
	files, err := ioutil.ReadDir("data/activities")
	if err != nil {
		panic(err)
	}

	for _, ff := range files {
		if ff.IsDir() {
			continue
		}

		f, err := os.Open(path.Join("data/activities", ff.Name()))
		if err != nil {
			panic(err)
		}

		fmt.Println(f.Name())
		var m models.DetailedActivity
		if err := json.NewDecoder(f).Decode(&m); err != nil {
			fmt.Printf("Issue with %s\n", f.Name())
			panic(err)
		}
		f.Close()

		fmt.Println(m.ID)
		data, err := yaml.Marshal(&map[string]interface{}{
			"title":  m.Name,
			"layout": "activity",
			"id":     fmt.Sprintf("%d", m.ID),
		})
		if err != nil {
			panic(err)
		}
		data = []byte(fmt.Sprintf("---\n%s\n---\n", data))

		name := fmt.Sprintf("%s.md", strings.TrimSuffix(filepath.Base(f.Name()), filepath.Ext(f.Name())))
		os.WriteFile(path.Join("content/activities", name), data, 0666)
	}
}
