package models

import "time"

type Cancion struct {
	Nombre           string    `json:"nombre" binding:"required"`
	Disco            string    `json:"disco" binding:"required"`
	FechaLanzamiento time.Time `json:"fecha_lanzamiento" binding:"required"`
	Duracion         float64   `json:"duracion" binding:"required"`
	Genero           string    `json:"genero" binding:"required"`
}

type RelationPersonaFavoritaCancion struct {
	Usuario    string `json:"usuario" binding:"required"`    // Usuario Nombre de usuario
	Cancion    string `json:"cancion" binding:"required"`    // Cancion Nombre de la cancion
	Cuando     string `json:"cuando" binding:"required"`     // Cuando Fecha en la que el usuario conoció la canción
	Como       string `json:"como" binding:"required"`       // Como Cómo la conoció
	Frecuencia string `json:"frecuencia" binding:"required"` // Frecuencia Frecuencia con la que se escucha
}

type RelationPersonaLeGustaCancion struct {
	Usuario    string `json:"usuario" binding:"required"`     // Usuario Nombre de usuario
	Cancion    string `json:"cancion" binding:"required"`     // Cancion Nombre de la cancion
	Como       string `json:"como" binding:"required"`        // Como Cómo la conoció
	Escucha    *bool  `json:"escucha" binding:"required"`     // Escucha seguido
	MasArtista *bool  `json:"mas_artista" binding:"required"` // Escucha más canciones del artista
}

type RelationPersonaNoLeGustaCancion struct {
	Usuario    string `json:"usuario" binding:"required"`    // Usuario Nombre de usuario
	Cancion    string `json:"cancion" binding:"required"`    // Cancion Nombre de la cancion
	Motivo     string `json:"motivo" binding:"required"`     // Motivo Motivo por el que no le gusta
	Cambiar    *bool  `json:"cambiar" binding:"required"`    // Cambiar de Opinión
	Intensidad int    `json:"intensidad" binding:"required"` // Intensidad de disgusto
}
