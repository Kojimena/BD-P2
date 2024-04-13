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

type RelationApoyaEquipo struct {
	Usuario      string `json:"usuario"`
	Equipo       string `json:"equipo"`
	Fecha        string `json:"fecha"` // Formato: "YYYY-MM-DD"
	PorQue       string `json:"por_que"`
	MiraPartidos bool   `json:"mira_partidos"`
}

type RelationRechazaEquipo struct {
	Usuario      string `json:"usuario"`
	Equipo       string `json:"equipo"`
	Fecha        string `json:"fecha"` // Formato: "YYYY-MM-DD"
	PorQue       string `json:"por_que"`
	MiraPartidos bool   `json:"mira_partidos"`
}
