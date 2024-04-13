package models

type Lugar struct {
	Nombre       string `json:"nombre"`
	Departamento string `json:"departamento"`
	Tipo         string `json:"tipo"`
	Direccion    string `json:"direccion"`
	Foto         string `json:"foto"`
}

type RelationVisitaLugar struct {
	Usuario   string `json:"usuario"`   // Usuario Nombre de usuario
	Lugar     string `json:"lugar"`     // Lugar Nombre del lugar
	Cuando    string `json:"cuando"`    // Cuando Fecha en la que el usuario visitó el lugar
	Rating    int    `json:"rating"`    // Rating Calificación del lugar por el usuario
	Categoria string `json:"categoria"` // Categoria Categoria del lugar
}

type RelationNoLeGustaLugar struct {
	Usuario   string `json:"usuario"`   // Usuario Nombre de usuario
	Lugar     string `json:"lugar"`     // Lugar Nombre del lugar
	Cuando    string `json:"cuando"`    // Cuando Fecha en la que el usuario visitó el lugar
	Rating    int    `json:"rating"`    // Rating Calificación del lugar por el usuario
	Categoria string `json:"categoria"` // Categoria Categoria del lugar
}
