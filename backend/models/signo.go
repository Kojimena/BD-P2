package models

type Signo struct {
	Nombre    string `json:"nombre"`
	Elemento  string `json:"elemento"`
	Planeta   string `json:"planeta"`
	Piedra    string `json:"piedra"`
	Metal     string `json:"metal"`
	DiaSemana string `json:"dia_semana"`
}

type RelationEsSigno struct {
	Signo          string `json:"signo"`          // Signo Nombre del signo zodiacal del usuario
	Usuario        string `json:"usuario"`        // Usuario Nombre de usuario
	Compatibilidad int    `json:"compatibilidad"` // Compatibilidad Nivel de compatibilidad del signo
	Influencia     bool   `json:"influencia"`     // Influencia del signo en la vida del usuario
	Compartir      bool   `json:"compartir"`      // Compartir si el usuario comparte signo con el signo
}
