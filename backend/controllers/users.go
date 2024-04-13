package controllers

import (
	"backend/configs"
	"backend/models"
	"backend/responses"
	"context"
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/neo4j/neo4j-go-driver/v5/neo4j"
	"net/http"
	"time"
)

// NewStudent Registra un nuevo estudiante
// @Summary Registra un nuevo estudiante
// @Description Registra un nuevo estudiante en la base de datos
// @Tags Estudiantes
// @Accept json
// @Produce json
// @Param student body models.Estudiante true "Estudiante a registrar"
// @Success 200 {object} responses.StandardResponse "Estudiante creado exitosamente"
// @Failure 400 {object} responses.ErrorResponse "Error al procesar la solicitud"
// @Router /users/student [post]
func NewStudent(c *gin.Context) {
	var student models.Estudiante

	if err := c.ShouldBindJSON(&student); err != nil {
		c.JSON(http.StatusBadRequest, responses.ErrorResponse{
			Status:  http.StatusBadRequest,
			Message: "El cuerpo de la solicitud no es válido",
			Error:   err.Error(),
		})
		return
	}

	fmt.Println(student)
	// crear nodo Estudiante (con label Estudiante y Persona)

	session := configs.DB.NewSession(c, neo4j.SessionConfig{AccessMode: neo4j.AccessModeWrite})
	defer func(session neo4j.SessionWithContext, ctx context.Context) {
		err := session.Close(ctx)
		if err != nil {
			c.JSON(http.StatusInternalServerError, responses.ErrorResponse{
				Status:  http.StatusInternalServerError,
				Message: "Error al cerrar la sesión",
				Error:   err.Error(),
			})
		}
	}(session, c)

	f, err := time.Parse(time.DateOnly, student.FechaNacimiento)
	if err != nil {
		c.JSON(http.StatusBadRequest, responses.ErrorResponse{
			Status:  http.StatusBadRequest,
			Message: "Error al procesar la fecha de nacimiento",
			Error:   err.Error(),
		})
		return
	}

	r, err := session.Run(
		c,
		"CREATE (p:Persona:Estudiante {Nombre: $nombre, Apellido: $apellido, FechaNacimiento: $fecha_nacimiento, Genero: $genero, Usuario: $usuario, Password: $password, Carnet: $carnet, Correo: $correo, Parqueo: $parqueo, Foraneo: $foraneo, Colegio: $colegio})",
		map[string]interface{}{
			"nombre":           student.Nombre,
			"apellido":         student.Apellido,
			"fecha_nacimiento": f,
			"genero":           student.Genero,
			"usuario":          student.Usuario,
			"password":         student.Password,
			"carnet":           student.Carnet,
			"correo":           student.Correo,
			"parqueo":          student.Parqueo,
			"foraneo":          student.Foraneo,
			"colegio":          student.Colegio,
		})

	if err != nil {
		c.JSON(http.StatusInternalServerError, responses.ErrorResponse{
			Status:  http.StatusInternalServerError,
			Message: "Error al crear el estudiante",
			Error:   err.Error(),
		})
		return
	}

	fmt.Println(r.Single(c))

	c.JSON(http.StatusOK, responses.StandardResponse{
		Status:  http.StatusOK,
		Message: "Estudiante creado exitosamente",
		Data:    nil,
	})
}

// NewTeacher Registra un nuevo profesor
// @Summary Registra un nuevo profesor
// @Description Registra un nuevo profesor en la base de datos
// @Tags Profesores
// @Accept json
// @Produce json
// @Param teacher body models.Profesor true "Profesor a registrar"
// @Success 200 {object} responses.StandardResponse "Profesor creado exitosamente"
// @Failure 400 {object} responses.ErrorResponse "Error al procesar la solicitud"
// @Router /users/teacher [post]
func NewTeacher(c *gin.Context) {
	var teacher models.Profesor

	if err := c.ShouldBindJSON(&teacher); err != nil {
		c.JSON(http.StatusBadRequest, responses.ErrorResponse{
			Status:  http.StatusBadRequest,
			Message: "El cuerpo de la solicitud no es válido",
			Error:   err.Error(),
		})
		return
	}

	fmt.Println(teacher)
	// crear nodo Profesor (con label Profesor y Persona)

	session := configs.DB.NewSession(c, neo4j.SessionConfig{AccessMode: neo4j.AccessModeWrite})
	defer session.Close(c)

	f, _ := time.Parse(time.DateOnly, teacher.FechaNacimiento)

	r, err := session.Run(
		c,
		"CREATE (p:Persona:Profesor {Nombre: $nombre, Apellido: $apellido, FechaNacimiento: $fecha_nacimiento, Genero: $genero, Usuario: $usuario, Password: $password, Code: $code, CorreoProfesor: $correo, Departamento: $departamento, Maestria: $maestria, Jornada: $jornada})",
		map[string]interface{}{
			"nombre":           teacher.Nombre,
			"apellido":         teacher.Apellido,
			"fecha_nacimiento": f,
			"genero":           teacher.Genero,
			"usuario":          teacher.Usuario,
			"password":         teacher.Password,
			"code":             teacher.Code,
			"correo":           teacher.CorreoProfesor,
			"departamento":     teacher.Departamento,
			"maestria":         teacher.Maestria,
			"jornada":          teacher.Jornada,
		})

	if err != nil {
		c.JSON(http.StatusInternalServerError, responses.ErrorResponse{
			Status:  http.StatusInternalServerError,
			Message: "Error al crear el profesor",
			Error:   err.Error(),
		})
		return
	}

	fmt.Println(r.Single(c))

	c.JSON(http.StatusOK, responses.StandardResponse{
		Status:  http.StatusOK,
		Message: "Profesor creado exitosamente",
		Data:    nil,
	})
}

// NewProfesorStudent Registra un nuevo profesor y estudiante
// @Summary Registra un nuevo profesor y estudiante
// @Description Registra un nuevo profesor y estudiante en la base de datos
// @Tags Usuarios
// @Accept json
// @Produce json
// @Param profesor_student body models.ProfesorEstudiante true "Profesor y estudiante a registrar"
// @Success 200 {object} responses.StandardResponse "Profesor y estudiante creado exitosamente"
// @Failure 400 {object} responses.ErrorResponse "Error al procesar la solicitud"
// @Router /users/profesor-student [post]
func NewProfesorStudent(c *gin.Context) {
	var ps models.ProfesorEstudiante

	if err := c.ShouldBindJSON(&ps); err != nil {
		c.JSON(http.StatusBadRequest, responses.ErrorResponse{
			Status:  http.StatusBadRequest,
			Message: "El cuerpo de la solicitud no es válido",
			Error:   err.Error(),
		})
		return
	}

	fmt.Println(ps)
	// crear nodo Profesor (con label Profesor y Persona)

	session := configs.DB.NewSession(c, neo4j.SessionConfig{AccessMode: neo4j.AccessModeWrite})
	defer session.Close(c)

	f, _ := time.Parse(time.DateOnly, ps.FechaNacimiento)

	r, err := session.Run(
		c,
		"CREATE (p:Persona:Profesor:Estudiante {Nombre: $nombre, Apellido: $apellido, FechaNacimiento: $fecha_nacimiento, Genero: $genero, Usuario: $usuario, Password: $password, Code: $code, CorreoProfesor: $correo_profesor, Departamento: $departamento, Maestria: $maestria, Jornada: $jornada, Carnet: $carnet, Correo: $correo, Parqueo: $parqueo, Foraneo: $foraneo, Colegio: $colegio})",
		map[string]interface{}{
			"nombre":           ps.Nombre,
			"apellido":         ps.Apellido,
			"fecha_nacimiento": f,
			"genero":           ps.Genero,
			"usuario":          ps.Usuario,
			"password":         ps.Password,
			"code":             ps.Code,
			"correo_profesor":  ps.CorreoProfesor,
			"departamento":     ps.Departamento,
			"maestria":         ps.Maestria,
			"jornada":          ps.Jornada,
			"carnet":           ps.Carnet,
			"correo":           ps.Correo,
			"parqueo":          ps.Parqueo,
			"foraneo":          ps.Foraneo,
			"colegio":          ps.Colegio,
		})

	if err != nil {
		c.JSON(http.StatusInternalServerError, responses.ErrorResponse{
			Status:  http.StatusInternalServerError,
			Message: "Error al crear el profesor",
			Error:   err.Error(),
		})
		return
	}

	fmt.Println(r.Single(c))

	c.JSON(http.StatusOK, responses.StandardResponse{
		Status:  http.StatusOK,
		Message: "Profesor/Estudiante creado exitosamente",
		Data:    nil,
	})
}

// GetUserDetails Obtiene los detalles de un usuario
// @Summary Obtiene los detalles de un usuario
// @Description Obtiene los detalles de un usuario dado su nombre de usuario
// @Tags Usuarios
// @Accept json
// @Produce json
// @Param username path string true "Nombre de usuario"
// @Success 200 {object} responses.StandardResponse "Datos del usuario obtenidos exitosamente"
// @Failure 400 {object} responses.ErrorResponse "Error al procesar la solicitud"
// @Failure 500 {object} responses.ErrorResponse "Error al procesar la solicitud"
// @Router /users/details/{username} [get]
func GetUserDetails(c *gin.Context) {
	user := c.Param("username")

	if user == "" {
		c.JSON(http.StatusBadRequest, responses.ErrorResponse{
			Status:  http.StatusBadRequest,
			Message: "El usuario no puede estar vacío",
			Error:   "El usuario no puede estar vacío",
		})
		return
	}

	session := configs.DB.NewSession(c, neo4j.SessionConfig{AccessMode: neo4j.AccessModeRead})

	defer session.Close(c)

	r, err := session.Run(
		c,
		"MATCH (p:Persona {Usuario: $usuario}) RETURN p",
		map[string]interface{}{
			"usuario": user,
		})

	if err != nil {
		c.JSON(http.StatusInternalServerError, responses.ErrorResponse{
			Status:  http.StatusInternalServerError,
			Message: "Error al obtener los datos del usuario",
			Error:   err.Error(),
		})
		return
	}

	var properties map[string]interface{}
	for r.Next(c) {
		properties = r.Record().Values[0].(neo4j.Node).Props
	}

	if properties == nil {
		c.JSON(http.StatusNotFound, responses.ErrorResponse{
			Status:  http.StatusNotFound,
			Message: "El usuario no existe",
			Error:   "El usuario no existe",
		})
		return
	}

	r, err = session.Run(
		c,
		"MATCH (p:Persona {Usuario: $usuario})-[r:ES_FAVORITA]-(m) return m,r",
		map[string]interface{}{
			"usuario": user,
		})

	if err != nil {
		c.JSON(http.StatusInternalServerError, responses.ErrorResponse{
			Status:  http.StatusInternalServerError,
			Message: "Error al obtener los datos del usuario",
			Error:   err.Error(),
		})
		return
	}

	var relations []map[string]interface{}
	for r.Next(c) {
		nodeTo := r.Record().Values[0].(neo4j.Node)
		rel := r.Record().Values[1].(neo4j.Relationship)

		relations = append(relations, map[string]interface{}{
			nodeTo.Labels[0]: nodeTo.Props,
			rel.Type:         rel.Props,
		})
	}

	c.JSON(http.StatusOK, responses.StandardResponse{
		Status:  http.StatusOK,
		Message: "Datos del usuario obtenidos exitosamente",
		Data: map[string]interface{}{
			"properties": properties,
			"relations":  relations,
		},
	})
}

type SignInDetails struct {
	Usuario  string `json:"usuario" binding:"required"`
	Password string `json:"password" binding:"required"`
}

// Login Autentica un usuario
// @Summary Autentica un usuario
// @Description Autentica un usuario dado su nombre de usuario y contraseña
// @Tags Usuarios
// @Accept json
// @Produce json
// @Param login body SignInDetails true "Detalles de inicio de sesión"
// @Success 200 {object} responses.StandardResponse "Usuario autenticado exitosamente"
// @Failure 400 {object} responses.ErrorResponse "Error al procesar la solicitud"
// @Failure 404 {object} responses.ErrorResponse "El usuario no existe"
// @Failure 500 {object} responses.ErrorResponse "Error al procesar la solicitud"
// @Router /users/login [post]
func Login(c *gin.Context) {
	var sd SignInDetails

	if err := c.ShouldBindJSON(&sd); err != nil {
		c.JSON(http.StatusBadRequest, responses.ErrorResponse{
			Status:  http.StatusBadRequest,
			Message: "El cuerpo de la solicitud no es válido",
			Error:   err.Error(),
		})
		return
	}

	session := configs.DB.NewSession(c, neo4j.SessionConfig{AccessMode: neo4j.AccessModeRead})

	defer session.Close(c)

	r, err := session.Run(
		c,
		"MATCH (p:Persona {Usuario: $usuario, Password: $password}) RETURN p",
		map[string]interface{}{
			"usuario":  sd.Usuario,
			"password": sd.Password,
		})

	if err != nil {
		c.JSON(http.StatusInternalServerError, responses.ErrorResponse{
			Status:  http.StatusInternalServerError,
			Message: "Error al obtener los datos del usuario",
			Error:   err.Error(),
		})
		return
	}

	var labels []string
	for r.Next(c) {
		node := r.Record().Values[0].(neo4j.Node)

		labels = node.Labels
	}

	if len(labels) == 0 {
		c.JSON(http.StatusNotFound, responses.ErrorResponse{
			Status:  http.StatusNotFound,
			Message: "El usuario no existe",
			Error:   "El usuario no existe",
		})
		return
	}

	c.JSON(http.StatusOK, responses.StandardResponse{
		Status:  http.StatusOK,
		Message: "Usuario autenticado exitosamente",
		Data: map[string]interface{}{
			"labels": labels,
		},
	})
}

type NewPublicationInput struct {
	Usuario   string `json:"usuario" binding:"required"`
	Contenido string `json:"contenido" binding:"required"`
}

// NewPublication Crea una nueva publicación
// @Summary Crea una nueva publicación
// @Description Crea una nueva publicación para un usuario. Si el usuario no tiene publicaciones, se crea la propiedad Publicaciones, de lo contrario, se actualiza la propiedad Publicaciones
// @Tags Publicaciones
// @Accept json
// @Produce json
// @Param publication body NewPublicationInput true "Publicación a crear"
// @Success 200 {object} responses.StandardResponse "Publicación creada exitosamente"
// @Failure 400 {object} responses.ErrorResponse "Error al procesar la solicitud"
// @Failure 404 {object} responses.ErrorResponse "El usuario no existe"
// @Failure 500 {object} responses.ErrorResponse "Error al procesar la solicitud"
// @Router /users/post [post]
func NewPublication(c *gin.Context) {
	var np NewPublicationInput

	if err := c.ShouldBindJSON(&np); err != nil {
		c.JSON(http.StatusBadRequest, responses.ErrorResponse{
			Status:  http.StatusBadRequest,
			Message: "El cuerpo de la solicitud no es válido",
			Error:   err.Error(),
		})
		return
	}

	session := configs.DB.NewSession(c, neo4j.SessionConfig{AccessMode: neo4j.AccessModeWrite})

	defer session.Close(c)

	var usuario models.Persona
	var hasPublications = false

	r, err := session.Run(
		c,
		"MATCH (p:Persona {Usuario: $usuario}) RETURN p",
		map[string]interface{}{
			"usuario": np.Usuario,
		})

	if err != nil {
		c.JSON(http.StatusInternalServerError, responses.ErrorResponse{
			Status:  http.StatusInternalServerError,
			Message: "Error al obtener los datos del usuario",
			Error:   err.Error(),
		})
		return
	}

	for r.Next(c) {
		vals := r.Record().Values[0].(neo4j.Node).Props

		usuario = models.Persona{
			Usuario: vals["Usuario"].(string),
		}

		if vals["Publicaciones"] != nil {
			hasPublications = true
		}
	}

	if usuario.Usuario == "" {
		c.JSON(http.StatusNotFound, responses.ErrorResponse{
			Status:  http.StatusNotFound,
			Message: "El usuario no existe",
			Error:   "El usuario no existe",
		})
		return
	}

	if !hasPublications {
		_, err = session.Run(
			c,
			"MATCH (p:Persona {Usuario: $usuario}) SET p.Publicaciones = [$contenido]",
			map[string]interface{}{
				"usuario":   np.Usuario,
				"contenido": np.Contenido,
			})
	} else {
		_, err = session.Run(
			c,
			"MATCH (p:Persona {Usuario: $usuario}) SET p.Publicaciones = p.Publicaciones + $contenido",
			map[string]interface{}{
				"usuario":   np.Usuario,
				"contenido": np.Contenido,
			})
	}

	if err != nil {
		c.JSON(http.StatusInternalServerError, responses.ErrorResponse{
			Status:  http.StatusInternalServerError,
			Message: "Error al crear la publicación",
			Error:   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, responses.StandardResponse{
		Status:  http.StatusOK,
		Message: "Publicación creada exitosamente",
		Data:    nil,
	})
}
