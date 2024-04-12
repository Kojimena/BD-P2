package models

type Lugar struct {
	Nombre       string `json:"nombre"`
	Departamento string `json:"departamento"`
	Tipo         string `json:"tipo"`
	Direccion    string `json:"direccion"`
	Foto         string `json:"foto"`
}
