package models

type Persona struct {
	Nombre          string   `json:"nombre" binding:"required"`
	Apellido        string   `json:"apellido" binding:"required"`
	FechaNacimiento string   `json:"fecha_nacimiento" binding:"required"` // Formato: YYYY-MM-DD
	Genero          string   `json:"genero" binding:"required"`
	Usuario         string   `json:"usuario" binding:"required"`
	Password        string   `json:"password" binding:"required"`
	Publicaciones   []string `json:"publicaciones"`
	Conexiones      []string `json:"conexiones"` // Conexiones usuarios
}

type Estudiante struct {
	Persona
	Carnet  string `json:"carnet" binding:"required"`
	Correo  string `json:"correo" binding:"required"`
	Parqueo bool   `json:"parqueo" binding:"required"`
	Foraneo bool   `json:"foraneo" binding:"required"`
	Colegio string `json:"colegio" binding:"required"`
}

type Profesor struct {
	Persona
	Code           string `json:"code" binding:"required"`
	CorreoProfesor string `json:"correo_profesor" binding:"required"`
	Departamento   string `json:"departamento" binding:"required"`
	Maestria       string `json:"maestria" binding:"required"`
	Jornada        string `json:"jornada" binding:"required"`
}

type ProfesorEstudiante struct {
	Persona
	Carnet         string `json:"carnet" binding:"required"`
	Correo         string `json:"correo" binding:"required"`
	Parqueo        bool   `json:"parqueo" binding:"required"`
	Foraneo        bool   `json:"foraneo" binding:"required"`
	Colegio        string `json:"colegio" binding:"required"`
	Code           string `json:"code" binding:"required"`
	CorreoProfesor string `json:"correo_profesor" binding:"required"`
	Departamento   string `json:"departamento" binding:"required"`
	Maestria       string `json:"maestria" binding:"required"`
	Jornada        string `json:"jornada"`
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
