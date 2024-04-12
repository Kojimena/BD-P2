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

func GetSongs(c *gin.Context) {
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

	// Consulta para obtener todas las canciones
	r, err := session.Run(
		c,
		"MATCH (s:Cancion) RETURN s",
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

	var songs []models.Cancion
	for r.Next(c) {
		vals := r.Record().Values[0].(neo4j.Node).Props

		song := models.Cancion{
			Nombre:           vals["Nombre"].(string),
			Disco:            vals["Disco"].(string),
			FechaLanzamiento: vals["FechaDeLanzamiento"].(dbtype.Date).Time(),
			Duracion:         vals["Duracion"].(float64),
			Genero:           vals["Genero"].(string),
		}

		songs = append(songs, song)
	}

	c.JSON(http.StatusOK, responses.SongsResponse{
		Status:  http.StatusOK,
		Message: "Canciones obtenidas exitosamente",
		Songs:   songs,
	})
}

func NewSong(c *gin.Context) {
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

	var song models.Cancion
	if err := c.ShouldBindJSON(&song); err != nil {
		c.JSON(http.StatusBadRequest, responses.ErrorResponse{
			Status:  http.StatusBadRequest,
			Message: "Error al procesar la solicitud",
			Error:   err.Error(),
		})
		return
	}

	// Consulta para crear una nueva canción
	_, err := session.Run(
		c,
		"CREATE (s:Cancion {Nombre: $nombre, Disco: $disco, FechaDeLanzamiento: $fechaLanzamiento, Duracion: $duracion, Genero: $genero}) RETURN s",
		map[string]interface{}{
			"nombre":           song.Nombre,
			"disco":            song.Disco,
			"fechaLanzamiento": song.FechaLanzamiento,
			"duracion":         song.Duracion,
			"genero":           song.Genero,
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
		Message: "Canción creada exitosamente",
		Data:    map[string]interface{}{"song": song},
	})
}
