package models

type Persona struct {
	Nombre          string `json:"nombre"`
	Apellido        string `json:"apellido"`
	FechaNacimiento string `json:"fecha_nacimiento"`
	Genero          string `json:"genero"`
	Usuario         string `json:"usuario"`
	Password        string `json:"password"`
}

type Estudiante struct {
	Persona
	Carnet  string `json:"carnet"`
	Correo  string `json:"correo"`
	Parqueo bool   `json:"parqueo"`
	Foraneo bool   `json:"foraneo"`
	Colegio string `json:"colegio"`
}

type Profesor struct {
	Persona
	Code         string `json:"code"`
	Correo       string `json:"correo"`
	Departamento string `json:"departamento"`
	Maestria     string `json:"maestria"`
	Jornada      string `json:"jornada"`
}

// Ejemplo
var student = Estudiante{
	Persona: Persona{
		Nombre:          "Juan",
		Apellido:        "Perez",
		FechaNacimiento: "1990-01-01",
		Genero:          "M",
		Usuario:         "juanperez",
		Password:        "123456",
	},
	Carnet:  "201800000",
	Correo:  "jperez@gmail.com",
	Parqueo: true,
	Foraneo: false,
	Colegio: "Colegio San Juan",
}
