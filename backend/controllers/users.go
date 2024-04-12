package controllers

import (
	"backend/configs"
	"backend/models"
	"backend/responses"
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/neo4j/neo4j-go-driver/v5/neo4j"
	"net/http"
)

// NewStudent Registra un nuevo estudiante
func NewStudent(c *gin.Context) {
	var student models.Estudiante

	if err := c.ShouldBindJSON(&student); err != nil {
		c.JSON(http.StatusBadRequest, responses.ErrorResponse{
			Status:  http.StatusBadRequest,
			Message: "Error al procesar la solicitud",
			Error:   err.Error(),
		})
		return
	}

	fmt.Println(student)
	// crear nodo Estudiante (con label Estudiante y Persona)

	session := configs.DB.NewSession(c, neo4j.SessionConfig{AccessMode: neo4j.AccessModeWrite})
	defer session.Close(c)

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

func GetCareers(c *gin.Context) {

	session := configs.DB.NewSession(c, neo4j.SessionConfig{AccessMode: neo4j.AccessModeWrite})

	defer session.Close(c)

	// get all careers
	r, err := session.Run(c, "MATCH (c:Carrera) RETURN c", nil)

	if err != nil {
		c.JSON(http.StatusInternalServerError, responses.ErrorResponse{
			Status:  http.StatusInternalServerError,
			Message: "Error al obtener las carreras",
			Error:   err.Error(),
		})
		return
	}

	var careers []models.Carrera
	for r.Next(c) {
		fmt.Println(r.Record())
	}

	c.JSON(http.StatusOK, responses.StandardResponse{
		Status:  http.StatusOK,
		Message: "Estudiante creado exitosamente",
		Data: map[string]interface{}{
			"careers": careers,
		},
	})
}
