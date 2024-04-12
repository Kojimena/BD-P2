package models

import (
	"time"
)

type Equipo struct {
	Nombre               string    `json:"nombre"`
	Deporte              string    `json:"deporte"`
	Pais                 string    `json:"pais"`
	Division             string    `json:"division"`
	FechaEstablecimiento time.Time `json:"fecha_establecimiento"`
}
