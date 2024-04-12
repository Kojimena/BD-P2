package models

import "time"

type Cancion struct {
	Nombre           string    `json:"nombre"`
	Disco            string    `json:"disco"`
	FechaLanzamiento time.Time `json:"fecha_lanzamiento"`
	Duracion         float64   `json:"duracion"`
	Genero           string    `json:"genero"`
}
