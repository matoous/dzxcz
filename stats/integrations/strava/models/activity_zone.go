// Code generated by go-swagger; DO NOT EDIT.

package models

// This file was generated by the swagger tool.
// Editing this file might prove futile when you re-run the swagger generate command

import (
	"context"
	"encoding/json"

	"github.com/go-openapi/errors"
	"github.com/go-openapi/strfmt"
	"github.com/go-openapi/swag"
	"github.com/go-openapi/validate"
)

// ActivityZone activity zone
//
// swagger:model activityZone
type ActivityZone struct {

	// custom zones
	CustomZones bool `json:"custom_zones,omitempty"`

	// distribution buckets
	DistributionBuckets TimedZoneDistribution `json:"distribution_buckets,omitempty"`

	// max
	Max int64 `json:"max,omitempty"`

	// points
	Points int64 `json:"points,omitempty"`

	// score
	Score int64 `json:"score,omitempty"`

	// sensor based
	SensorBased bool `json:"sensor_based,omitempty"`

	// type
	// Enum: [heartrate power]
	Type string `json:"type,omitempty"`
}

// Validate validates this activity zone
func (m *ActivityZone) Validate(formats strfmt.Registry) error {
	var res []error

	if err := m.validateDistributionBuckets(formats); err != nil {
		res = append(res, err)
	}

	if err := m.validateType(formats); err != nil {
		res = append(res, err)
	}

	if len(res) > 0 {
		return errors.CompositeValidationError(res...)
	}
	return nil
}

func (m *ActivityZone) validateDistributionBuckets(formats strfmt.Registry) error {
	if swag.IsZero(m.DistributionBuckets) { // not required
		return nil
	}

	if err := m.DistributionBuckets.Validate(formats); err != nil {
		if ve, ok := err.(*errors.Validation); ok {
			return ve.ValidateName("distribution_buckets")
		} else if ce, ok := err.(*errors.CompositeError); ok {
			return ce.ValidateName("distribution_buckets")
		}
		return err
	}

	return nil
}

var activityZoneTypeTypePropEnum []interface{}

func init() {
	var res []string
	if err := json.Unmarshal([]byte(`["heartrate","power"]`), &res); err != nil {
		panic(err)
	}
	for _, v := range res {
		activityZoneTypeTypePropEnum = append(activityZoneTypeTypePropEnum, v)
	}
}

const (

	// ActivityZoneTypeHeartrate captures enum value "heartrate"
	ActivityZoneTypeHeartrate string = "heartrate"

	// ActivityZoneTypePower captures enum value "power"
	ActivityZoneTypePower string = "power"
)

// prop value enum
func (m *ActivityZone) validateTypeEnum(path, location string, value string) error {
	if err := validate.EnumCase(path, location, value, activityZoneTypeTypePropEnum, true); err != nil {
		return err
	}
	return nil
}

func (m *ActivityZone) validateType(formats strfmt.Registry) error {
	if swag.IsZero(m.Type) { // not required
		return nil
	}

	// value enum
	if err := m.validateTypeEnum("type", "body", m.Type); err != nil {
		return err
	}

	return nil
}

// ContextValidate validate this activity zone based on the context it is used
func (m *ActivityZone) ContextValidate(ctx context.Context, formats strfmt.Registry) error {
	var res []error

	if err := m.contextValidateDistributionBuckets(ctx, formats); err != nil {
		res = append(res, err)
	}

	if len(res) > 0 {
		return errors.CompositeValidationError(res...)
	}
	return nil
}

func (m *ActivityZone) contextValidateDistributionBuckets(ctx context.Context, formats strfmt.Registry) error {

	if err := m.DistributionBuckets.ContextValidate(ctx, formats); err != nil {
		if ve, ok := err.(*errors.Validation); ok {
			return ve.ValidateName("distribution_buckets")
		} else if ce, ok := err.(*errors.CompositeError); ok {
			return ce.ValidateName("distribution_buckets")
		}
		return err
	}

	return nil
}

// MarshalBinary interface implementation
func (m *ActivityZone) MarshalBinary() ([]byte, error) {
	if m == nil {
		return nil, nil
	}
	return swag.WriteJSON(m)
}

// UnmarshalBinary interface implementation
func (m *ActivityZone) UnmarshalBinary(b []byte) error {
	var res ActivityZone
	if err := swag.ReadJSON(b, &res); err != nil {
		return err
	}
	*m = res
	return nil
}