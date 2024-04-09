package models

type Carrera struct {
	Facultad               string  `json:"facultad"`
	Nombre                 string  `json:"nombre_carrera"`
	Director               string  `json:"director"`
	Duracion               float64 `json:"duracion"`
	EstudiantesRegistrados int     `json:"estudiantes_registrados"`
}
