package controllers

import (
	"backend/configs"
	"backend/models"
	"backend/responses"
	"context"
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

// NewTeam Crea un nuevo equipo
// @Summary Crea un nuevo equipo
// @Description Crea un nuevo equipo en la base de datos
// @Tags Equipos
// @Accept json
// @Produce json
// @Param team body models.Equipo true "Datos del equipo"
// @Success 201 {object} responses.StandardResponse "Equipo creado exitosamente"
// @Failure 400 {object} responses.ErrorResponse "Error al procesar la solicitud"
// @Failure 500 {object} responses.ErrorResponse "Error al procesar la solicitud"
// @Router /teams/ [post]
func NewTeam(c *gin.Context) {
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

	var team models.Equipo
	if err := c.ShouldBindJSON(&team); err != nil {
		c.JSON(http.StatusBadRequest, responses.ErrorResponse{
			Status:  http.StatusBadRequest,
			Message: "El cuerpo de la solicitud no es válido",
			Error:   err.Error(),
		})
		return
	}

	// Consulta para crear un nuevo equipo
	_, err := session.Run(
		c,
		"CREATE (t:Equipo {Nombre: $nombre, Deporte: $deporte, País: $pais, División: $division, FechaDeEstablecimiento: date($fechaEstablecimiento)})",
		map[string]interface{}{
			"nombre":               team.Nombre,
			"deporte":              team.Deporte,
			"pais":                 team.Pais,
			"division":             team.Division,
			"fechaEstablecimiento": team.FechaEstablecimiento.Format("2006-01-02"), // Convertir a string
		},
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, responses.ErrorResponse{
			Status:  http.StatusInternalServerError,
			Message: "Error al procesar la solicitud",
			Error:   err.Error(),
		})
		return
	}

	c.JSON(http.StatusCreated, responses.StandardResponse{
		Status:  http.StatusCreated,
		Message: "Equipo creado exitosamente",
		Data:    nil,
	})
}
