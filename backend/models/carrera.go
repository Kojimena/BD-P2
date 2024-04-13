package models

type Carrera struct {
	Facultad               string `json:"facultad" binding:"required"`
	Nombre                 string `json:"nombre_carrera" binding:"required"`
	Director               string `json:"director" binding:"required"`
	Duracion               int64  `json:"duracion" binding:"required"`
	EstudiantesRegistrados int64  `json:"estudiantes_registrados" binding:"required"`
}

type RelationEstudiaCarrera struct {
	Usuario  string `json:"usuario" binding:"required"`  // Usuario Nombre de usuario
	Carrera  string `json:"carrera" binding:"required"`  // Carrera Nombre de la carrera
	Apasiona bool   `json:"apasiona" binding:"required"` // Apasiona si al usuario le apasiona la carrera
	Activo   bool   `json:"activo" binding:"required"`   // Activo si el usuario está activo en la carrera
	Year     int64  `json:"year" binding:"required"`     // Year Año en el que el usuario ingresó a la carrera
}

type RelationLeInteresaCarrera struct {
	Usuario     string   `json:"usuario" binding:"required"`     // Usuario Nombre de usuario
	Carrera     string   `json:"carrera" binding:"required"`     // Carrera Nombre de la carrera
	Intereses   []string `json:"intereses" binding:"required"`   // Intereses Intereses del usuario en la carrera
	Recomendado bool     `json:"recomendado" binding:"required"` // Recomendado si al usuario le recomendaron la carrera
	Estudiara   bool     `json:"estudiara" binding:"required"`   // Estudiara si el usuario estudiará la carrera
}
