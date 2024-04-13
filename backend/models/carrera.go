package models

type Carrera struct {
	Facultad               string `json:"facultad"`
	Nombre                 string `json:"nombre_carrera"`
	Director               string `json:"director"`
	Duracion               int64  `json:"duracion"`
	EstudiantesRegistrados int64  `json:"estudiantes_registrados"`
}

type RelationEstudiaCarrera struct {
	Usuario  string `json:"usuario"`  // Usuario Nombre de usuario
	Carrera  string `json:"carrera"`  // Carrera Nombre de la carrera
	Apasiona bool   `json:"apasiona"` // Apasiona si al usuario le apasiona la carrera
	Activo   bool   `json:"activo"`   // Activo si el usuario está activo en la carrera
	Year     int64  `json:"year"`     // Year Año en el que el usuario ingresó a la carrera
}

type RelationLeInteresaCarrera struct {
	Usuario     string   `json:"usuario"`     // Usuario Nombre de usuario
	Carrera     string   `json:"carrera"`     // Carrera Nombre de la carrera
	Intereses   []string `json:"intereses"`   // Intereses Intereses del usuario en la carrera
	Recomendado bool     `json:"recomendado"` // Recomendado si al usuario le recomendaron la carrera
	Estudiara   bool     `json:"estudiara"`   // Estudiara si el usuario estudiará la carrera
}
