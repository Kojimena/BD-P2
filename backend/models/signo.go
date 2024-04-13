package models

type Signo struct {
	Nombre    string `json:"nombre" binding:"required"`
	Elemento  string `json:"elemento" binding:"required"`
	Planeta   string `json:"planeta" binding:"required"`
	Piedra    string `json:"piedra" binding:"required"`
	Metal     string `json:"metal" binding:"required"`
	DiaSemana string `json:"dia_semana" binding:"required"`
}

type RelationEsSigno struct {
	Signo          string `json:"signo" binding:"required"`          // Signo Nombre del signo zodiacal del usuario
	Usuario        string `json:"usuario" binding:"required"`        // Usuario Nombre de usuario
	Compatibilidad int    `json:"compatibilidad" binding:"required"` // Compatibilidad Nivel de compatibilidad del signo
	Influencia     *bool  `json:"influencia" binding:"required"`     // Influencia del signo en la vida del usuario
	Compartir      *bool  `json:"compartir" binding:"required"`      // Compartir si el usuario comparte signo con el signo
}
