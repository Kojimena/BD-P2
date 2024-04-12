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

	r, err := session.Run(
		c,
		"CREATE (p:Persona:Estudiante {nombre: $nombre, apellido: $apellido, fecha_nacimiento: $fecha_nacimiento, genero: $genero, usuario: $usuario, password: $password, carnet: $carnet, correo: $correo, parqueo: $parqueo, foraneo: $foraneo, colegio: $colegio})",
		map[string]interface{}{
			"nombre":           student.Nombre,
			"apellido":         student.Apellido,
			"fecha_nacimiento": student.FechaNacimiento,
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

	r, err := session.Run(
		c,
		"CREATE (p:Persona:Profesor {nombre: $nombre, apellido: $apellido, fecha_nacimiento: $fecha_nacimiento, genero: $genero, usuario: $usuario, password: $password, code: $code, correo: $correo, departamento: $departamento, maestria: $maestria, jornada: $jornada})",
		map[string]interface{}{
			"nombre":           teacher.Nombre,
			"apellido":         teacher.Apellido,
			"fecha_nacimiento": teacher.FechaNacimiento,
			"genero":           teacher.Genero,
			"usuario":          teacher.Usuario,
			"password":         teacher.Password,
			"code":             teacher.Code,
			"correo":           teacher.Correo,
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
