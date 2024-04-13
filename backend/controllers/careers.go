package controllers

import (
	"backend/configs"
	"backend/models"
	"backend/responses"
	"context"
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/neo4j/neo4j-go-driver/v5/neo4j"
	"github.com/neo4j/neo4j-go-driver/v5/neo4j/dbtype"
	"net/http"
)

// GetCareers Obtiene todas las carreras
// @Summary Obtiene todas las carreras
// @Description Obtiene todas las carreras de la base de datos
// @Tags Carreras
// @Accept json
// @Produce json
// @Success 200 {object} responses.CareerResponse "Carreras obtenidas exitosamente"
// @Failure 400 {object} responses.ErrorResponse "Error al procesar la solicitud"
// @Router /careers [get]
func GetCareers(c *gin.Context) {

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
		vals := r.Record().Values[0].(dbtype.Node).Props
		fmt.Println(vals)

		career := models.Carrera{
			Facultad:               vals["Facultad"].(string),
			Nombre:                 vals["Nombre"].(string),
			Director:               vals["Director"].(string),
			Duracion:               vals["Duracion"].(int64),
			EstudiantesRegistrados: vals["EstudiantesRegistrados"].(int64),
		}

		careers = append(careers, career)

	}

	c.JSON(http.StatusOK, responses.CareerResponse{
		Status:  http.StatusOK,
		Message: "Estudiante creado exitosamente",
		Careers: careers,
	})
}

// CreateRelationStudiesCareer Crea una relación de un estudiante con una carrera
// @Summary Crea una relación de un estudiante con una carrera
// @Description Crea una relación de (Estudiante)-[ESTUDIA]->(Carrera)
// @Tags Carreras
// @Accept json
// @Produce json
// @Param relation body models.RelationEstudiaCarrera true "Relación de estudia carrera"
// @Success 200 {object} responses.StandardResponse "Relación creada exitosamente"
// @Failure 400 {object} responses.ErrorResponse "Error al procesar la solicitud"
// @Router /careers/studies [post]
func CreateRelationStudiesCareer(c *gin.Context) {
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

	var relation models.RelationEstudiaCarrera
	err := c.BindJSON(&relation)
	if err != nil {
		c.JSON(http.StatusBadRequest, responses.ErrorResponse{
			Status:  http.StatusBadRequest,
			Message: "Error al procesar la solicitud",
			Error:   err.Error(),
		})
		return
	}

	// create relation
	_, err = session.Run(c, "MATCH (p:Persona {Usuario: $usuario}), (c:Carrera {Nombre: $carrera}) CREATE (p)-[r:ESTUDIA {Apasiona: $apasiona, Activo: $activo, Year: $year}]->(c) RETURN r", map[string]interface{}{
		"usuario":  relation.Usuario,
		"carrera":  relation.Carrera,
		"apasiona": relation.Apasiona,
		"activo":   relation.Activo,
		"year":     relation.Year,
	})

	if err != nil {
		c.JSON(http.StatusInternalServerError, responses.ErrorResponse{
			Status:  http.StatusInternalServerError,
			Message: "Error al crear la relación",
			Error:   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, responses.StandardResponse{
		Status:  http.StatusOK,
		Message: "Relación creada exitosamente",
		Data:    nil,
	})
}

// CreateRelationInterestsCareer Crea una relación de interés de un estudiante con una carrera
// @Summary Crea una relación de interés de un estudiante con una carrera
// @Description Crea una relación de (Estudiante)-[LE_INTERESA]->(Carrera)
// @Tags Carreras
// @Accept json
// @Produce json
// @Param relation body models.RelationLeInteresaCarrera true "Relación de interés de estudiante con carrera"
// @Success 200 {object} responses.StandardResponse "Relación creada exitosamente"
// @Failure 400 {object} responses.ErrorResponse "Error al procesar la solicitud"
// @Router /careers/interests [post]
func CreateRelationInterestsCareer(c *gin.Context) {
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

	var relation models.RelationLeInteresaCarrera
	err := c.BindJSON(&relation)
	if err != nil {
		c.JSON(http.StatusBadRequest, responses.ErrorResponse{
			Status:  http.StatusBadRequest,
			Message: "Error al procesar la solicitud",
			Error:   err.Error(),
		})
		return
	}

	// create relation
	_, err = session.Run(c, "MATCH (p:Persona {Usuario: $usuario}), (c:Carrera {Nombre: $carrera}) CREATE (p)-[r:LE_INTERESA {Intereses: $intereses, Recomendado: $recomendado, Estudiara: $estudiara}]->(c) RETURN r", map[string]interface{}{
		"usuario":     relation.Usuario,
		"carrera":     relation.Carrera,
		"intereses":   relation.Intereses,
		"recomendado": relation.Recomendado,
		"estudiara":   relation.Estudiara,
	})

	if err != nil {
		c.JSON(http.StatusInternalServerError, responses.ErrorResponse{
			Status:  http.StatusInternalServerError,
			Message: "Error al crear la relación",
			Error:   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, responses.StandardResponse{
		Status:  http.StatusOK,
		Message: "Relación creada exitosamente",
		Data:    nil,
	})
}
