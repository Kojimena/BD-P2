package models

type Carrera struct {
	Facultad               string `json:"facultad"`
	Nombre                 string `json:"nombre_carrera"`
	Director               string `json:"director"`
	Duracion               int64  `json:"duracion"`
	EstudiantesRegistrados int64  `json:"estudiantes_registrados"`
}
