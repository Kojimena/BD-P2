package controllers

import (
	"backend/configs"
	"backend/models"
	"backend/responses"
	"github.com/gin-gonic/gin"
	"github.com/neo4j/neo4j-go-driver/v5/neo4j"
	"github.com/neo4j/neo4j-go-driver/v5/neo4j/dbtype"
	"net/http"
)

// GetTeams Obtiene todos los equipos
// @Summary Obtiene todos los equipos
// @Description Obtiene todos los equipos registrados en la base de datos
// @Tags Equipos
// @Accept json
// @Produce json
// @Success 200 {object} responses.TeamsResponse "Equipos obtenidos exitosamente"
// @Failure 500 {object} responses.ErrorResponse "Error al procesar la solicitud"
// @Router /teams/ [get]
func GetTeams(c *gin.Context) {
	session := configs.DB.NewSession(c, neo4j.SessionConfig{AccessMode: neo4j.AccessModeWrite})

	defer session.Close(c)

	// Consulta para obtener todos los equipos
	r, err := session.Run(
		c,
		"MATCH (t:Equipo) RETURN t",
		nil,
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, responses.ErrorResponse{
			Status:  http.StatusInternalServerError,
			Message: "Error al procesar la solicitud",
			Error:   err.Error(),
		})
		return
	}

	var teams []models.Equipo
	for r.Next(c) {
		vals := r.Record().Values[0].(neo4j.Node).Props

		team := models.Equipo{
			Nombre:               vals["Nombre"].(string),
			Deporte:              vals["Deporte"].(string),
			Pais:                 vals["País"].(string),
			Division:             vals["División"].(string),
			FechaEstablecimiento: vals["FechaDeEstablecimiento"].(dbtype.Date).Time(), // Convertir a tipo time.Time
		}

		teams = append(teams, team)
	}

	c.JSON(http.StatusOK, responses.TeamsResponse{
		Status:  http.StatusOK,
		Message: "Equipos obtenidos exitosamente",
		Teams:   teams,
	})
}
