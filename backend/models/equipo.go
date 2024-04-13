package models

import (
	"time"
)

type Equipo struct {
	Nombre               string    `json:"nombre" binding:"required"`
	Deporte              string    `json:"deporte" binding:"required"`
	Pais                 string    `json:"pais" binding:"required"`
	Division             string    `json:"division" binding:"required"`
	FechaEstablecimiento time.Time `json:"fecha_establecimiento" binding:"required"`
}

type RelationApoyaEquipo struct {
	Usuario      string `json:"usuario" binding:"required"`
	Equipo       string `json:"equipo" binding:"required"`
	Fecha        string `json:"fecha" binding:"required"` // Formato: "YYYY-MM-DD"
	PorQue       string `json:"por_que" binding:"required"`
	MiraPartidos bool   `json:"mira_partidos" binding:"required"`
}

type RelationRechazaEquipo struct {
	Usuario      string `json:"usuario" binding:"required"`
	Equipo       string `json:"equipo" binding:"required"`
	Fecha        string `json:"fecha" binding:"required"` // Formato: "YYYY-MM-DD"
	PorQue       string `json:"por_que" binding:"required"`
	MiraPartidos bool   `json:"mira_partidos" binding:"required"`
}
