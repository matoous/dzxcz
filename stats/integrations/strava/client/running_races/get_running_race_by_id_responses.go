// Code generated by go-swagger; DO NOT EDIT.

package running_races

// This file was generated by the swagger tool.
// Editing this file might prove futile when you re-run the swagger generate command

import (
	"context"
	"encoding/json"
	"fmt"
	"io"

	"github.com/go-openapi/errors"
	"github.com/go-openapi/runtime"
	"github.com/go-openapi/strfmt"
	"github.com/go-openapi/swag"
	"github.com/go-openapi/validate"

	"github.com/matoous/sportstats/integrations/strava/models"
)

// GetRunningRaceByIDReader is a Reader for the GetRunningRaceByID structure.
type GetRunningRaceByIDReader struct {
	formats strfmt.Registry
}

// ReadResponse reads a server response into the received o.
func (o *GetRunningRaceByIDReader) ReadResponse(response runtime.ClientResponse, consumer runtime.Consumer) (interface{}, error) {
	switch response.Code() {
	case 200:
		result := NewGetRunningRaceByIDOK()
		if err := result.readResponse(response, consumer, o.formats); err != nil {
			return nil, err
		}
		return result, nil
	default:
		result := NewGetRunningRaceByIDDefault(response.Code())
		if err := result.readResponse(response, consumer, o.formats); err != nil {
			return nil, err
		}
		if response.Code()/100 == 2 {
			return result, nil
		}
		return nil, result
	}
}

// NewGetRunningRaceByIDOK creates a GetRunningRaceByIDOK with default headers values
func NewGetRunningRaceByIDOK() *GetRunningRaceByIDOK {
	return &GetRunningRaceByIDOK{}
}

/* GetRunningRaceByIDOK describes a response with status code 200, with default header values.

Representation of a running race.
*/
type GetRunningRaceByIDOK struct {
	Payload *GetRunningRaceByIDOKBody
}

func (o *GetRunningRaceByIDOK) Error() string {
	return fmt.Sprintf("[GET /running_races/{id}][%d] getRunningRaceByIdOK  %+v", 200, o.Payload)
}
func (o *GetRunningRaceByIDOK) GetPayload() *GetRunningRaceByIDOKBody {
	return o.Payload
}

func (o *GetRunningRaceByIDOK) readResponse(response runtime.ClientResponse, consumer runtime.Consumer, formats strfmt.Registry) error {

	o.Payload = new(GetRunningRaceByIDOKBody)

	// response payload
	if err := consumer.Consume(response.Body(), o.Payload); err != nil && err != io.EOF {
		return err
	}

	return nil
}

// NewGetRunningRaceByIDDefault creates a GetRunningRaceByIDDefault with default headers values
func NewGetRunningRaceByIDDefault(code int) *GetRunningRaceByIDDefault {
	return &GetRunningRaceByIDDefault{
		_statusCode: code,
	}
}

/* GetRunningRaceByIDDefault describes a response with status code -1, with default header values.

Unexpected error.
*/
type GetRunningRaceByIDDefault struct {
	_statusCode int

	Payload *models.Fault
}

// Code gets the status code for the get running race by Id default response
func (o *GetRunningRaceByIDDefault) Code() int {
	return o._statusCode
}

func (o *GetRunningRaceByIDDefault) Error() string {
	return fmt.Sprintf("[GET /running_races/{id}][%d] getRunningRaceById default  %+v", o._statusCode, o.Payload)
}
func (o *GetRunningRaceByIDDefault) GetPayload() *models.Fault {
	return o.Payload
}

func (o *GetRunningRaceByIDDefault) readResponse(response runtime.ClientResponse, consumer runtime.Consumer, formats strfmt.Registry) error {

	o.Payload = new(models.Fault)

	// response payload
	if err := consumer.Consume(response.Body(), o.Payload); err != nil && err != io.EOF {
		return err
	}

	return nil
}

/*GetRunningRaceByIDOKBody get running race by ID o k body
swagger:model GetRunningRaceByIDOKBody
*/
type GetRunningRaceByIDOKBody struct {

	// The name of the city in which the race is taking place.
	City string `json:"city,omitempty"`

	// The name of the country in which the race is taking place.
	Country string `json:"country,omitempty"`

	// The race's distance, in meters.
	Distance float32 `json:"distance,omitempty"`

	// The unique identifier of this race.
	ID int64 `json:"id,omitempty"`

	// The unit system in which the race should be displayed.
	// Enum: [feet meters]
	MeasurementPreference string `json:"measurement_preference,omitempty"`

	// The name of this race.
	Name string `json:"name,omitempty"`

	// The set of routes that cover this race's course.
	RouteIds []int64 `json:"route_ids"`

	// The type of this race.
	RunningRaceType int64 `json:"running_race_type,omitempty"`

	// The time at which the race begins started in the local timezone.
	// Format: date-time
	StartDateLocal strfmt.DateTime `json:"start_date_local,omitempty"`

	// The name of the state or geographical region in which the race is taking place.
	State string `json:"state,omitempty"`

	// The vanity URL of this race on Strava.
	URL string `json:"url,omitempty"`

	// The URL of this race's website.
	WebsiteURL string `json:"website_url,omitempty"`
}

// Validate validates this get running race by ID o k body
func (o *GetRunningRaceByIDOKBody) Validate(formats strfmt.Registry) error {
	var res []error

	if err := o.validateMeasurementPreference(formats); err != nil {
		res = append(res, err)
	}

	if err := o.validateStartDateLocal(formats); err != nil {
		res = append(res, err)
	}

	if len(res) > 0 {
		return errors.CompositeValidationError(res...)
	}
	return nil
}

var getRunningRaceByIdOKBodyTypeMeasurementPreferencePropEnum []interface{}

func init() {
	var res []string
	if err := json.Unmarshal([]byte(`["feet","meters"]`), &res); err != nil {
		panic(err)
	}
	for _, v := range res {
		getRunningRaceByIdOKBodyTypeMeasurementPreferencePropEnum = append(getRunningRaceByIdOKBodyTypeMeasurementPreferencePropEnum, v)
	}
}

const (

	// GetRunningRaceByIDOKBodyMeasurementPreferenceFeet captures enum value "feet"
	GetRunningRaceByIDOKBodyMeasurementPreferenceFeet string = "feet"

	// GetRunningRaceByIDOKBodyMeasurementPreferenceMeters captures enum value "meters"
	GetRunningRaceByIDOKBodyMeasurementPreferenceMeters string = "meters"
)

// prop value enum
func (o *GetRunningRaceByIDOKBody) validateMeasurementPreferenceEnum(path, location string, value string) error {
	if err := validate.EnumCase(path, location, value, getRunningRaceByIdOKBodyTypeMeasurementPreferencePropEnum, true); err != nil {
		return err
	}
	return nil
}

func (o *GetRunningRaceByIDOKBody) validateMeasurementPreference(formats strfmt.Registry) error {
	if swag.IsZero(o.MeasurementPreference) { // not required
		return nil
	}

	// value enum
	if err := o.validateMeasurementPreferenceEnum("getRunningRaceByIdOK"+"."+"measurement_preference", "body", o.MeasurementPreference); err != nil {
		return err
	}

	return nil
}

func (o *GetRunningRaceByIDOKBody) validateStartDateLocal(formats strfmt.Registry) error {
	if swag.IsZero(o.StartDateLocal) { // not required
		return nil
	}

	if err := validate.FormatOf("getRunningRaceByIdOK"+"."+"start_date_local", "body", "date-time", o.StartDateLocal.String(), formats); err != nil {
		return err
	}

	return nil
}

// ContextValidate validates this get running race by ID o k body based on context it is used
func (o *GetRunningRaceByIDOKBody) ContextValidate(ctx context.Context, formats strfmt.Registry) error {
	return nil
}

// MarshalBinary interface implementation
func (o *GetRunningRaceByIDOKBody) MarshalBinary() ([]byte, error) {
	if o == nil {
		return nil, nil
	}
	return swag.WriteJSON(o)
}

// UnmarshalBinary interface implementation
func (o *GetRunningRaceByIDOKBody) UnmarshalBinary(b []byte) error {
	var res GetRunningRaceByIDOKBody
	if err := swag.ReadJSON(b, &res); err != nil {
		return err
	}
	*o = res
	return nil
}