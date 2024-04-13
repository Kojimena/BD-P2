package models

import "time"

type Cancion struct {
	Nombre           string    `json:"nombre"`
	Disco            string    `json:"disco"`
	FechaLanzamiento time.Time `json:"fecha_lanzamiento"`
	Duracion         float64   `json:"duracion"`
	Genero           string    `json:"genero"`
}

type RelationPersonaFavoritaCancion struct {
	Usuario    string `json:"usuario"`    // Usuario Nombre de usuario
	Cancion    string `json:"cancion"`    // Cancion Nombre de la cancion
	Cuando     string `json:"cuando"`     // Cuando Fecha en la que el usuario conoció la canción
	Como       string `json:"como"`       // Como Cómo la conoció
	Frecuencia string `json:"frecuencia"` // Frecuencia Frecuencia con la que se escucha
}

type RelationPersonaLeGustaCancion struct {
	Usuario    string `json:"usuario"`     // Usuario Nombre de usuario
	Cancion    string `json:"cancion"`     // Cancion Nombre de la cancion
	Como       string `json:"como"`        // Como Cómo la conoció
	Escucha    bool   `json:"escucha"`     // Escucha seguido
	MasArtista bool   `json:"mas_artista"` // Escucha más canciones del artista
}

type RelationPersonaNoLeGustaCancion struct {
	Usuario    string `json:"usuario"`    // Usuario Nombre de usuario
	Cancion    string `json:"cancion"`    // Cancion Nombre de la cancion
	Motivo     string `json:"motivo"`     // Motivo Motivo por el que no le gusta
	Cambiar    bool   `json:"cambiar"`    // Cambiar de Opinión
	Intensidad int    `json:"intensidad"` // Intensidad de disgusto
}
