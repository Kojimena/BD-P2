package models

type Lugar struct {
	Nombre       string `json:"nombre" binding:"required"`
	Departamento string `json:"departamento" binding:"required"`
	Tipo         string `json:"tipo" binding:"required"`
	Direccion    string `json:"direccion" binding:"required"`
	Foto         string `json:"foto" binding:"required"`
}

type RelationVisitaLugar struct {
	Usuario   string `json:"usuario" binding:"required"`   // Usuario Nombre de usuario
	Lugar     string `json:"lugar" binding:"required"`     // Lugar Nombre del lugar
	Cuando    string `json:"cuando" binding:"required"`    // Cuando Fecha en la que el usuario visitó el lugar
	Rating    int    `json:"rating" binding:"required"`    // Rating Calificación del lugar por el usuario
	Categoria string `json:"categoria" binding:"required"` // Categoria Categoria del lugar
}

type RelationNoLeGustaLugar struct {
	Usuario   string `json:"usuario" binding:"required"`   // Usuario Nombre de usuario
	Lugar     string `json:"lugar" binding:"required"`     // Lugar Nombre del lugar
	Cuando    string `json:"cuando" binding:"required"`    // Cuando Fecha en la que el usuario visitó el lugar
	Rating    int    `json:"rating" binding:"required"`    // Rating Calificación del lugar por el usuario
	Categoria string `json:"categoria" binding:"required"` // Categoria Categoria del lugar
}
