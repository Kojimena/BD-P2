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
