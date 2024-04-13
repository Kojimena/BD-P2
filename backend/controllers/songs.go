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
	"time"
)

// GetSongs Obtiene todas las canciones
// @Summary Obtiene todas las canciones
// @Description Obtiene todas las canciones registradas en la base de datos
// @Tags Canciones
// @Accept json
// @Produce json
// @Success 200 {object} responses.SongsResponse "Canciones obtenidas exitosamente"
// @Failure 500 {object} responses.ErrorResponse "Error al procesar la solicitud"
// @Router /songs/ [get]
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

// NewSong Crea una nueva canción
// @Summary Crea una nueva canción
// @Description Crea una nueva canción en la base de datos
// @Tags Canciones
// @Accept json
// @Produce json
// @Param song body models.Cancion true "Datos de la canción a crear"
// @Success 201 {object} responses.StandardResponse "Canción creada exitosamente"
// @Failure 400 {object} responses.ErrorResponse "Error al procesar la solicitud"
// @Failure 500 {object} responses.ErrorResponse "Error al procesar la solicitud"
// @Router /songs/ [post]
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

// CreateRelationFavoriteSong Crea una relación de una persona con una canción favorita
// @Summary Crea una relación de una persona con una canción favorita
// @Description Crea una relación de (Persona)-[ES_FAVORITA]->(Cancion)
// @Tags Canciones
// @Accept json
// @Produce json
// @Param relation body models.RelationPersonaFavoritaCancion true "Relación de persona favorita canción"
// @Success 200 {object} responses.StandardResponse "Relación creada exitosamente"
// @Failure 400 {object} responses.ErrorResponse "Error al procesar la solicitud"
// @Failure 500 {object} responses.ErrorResponse "Error al procesar la solicitud"
// @Router /songs/favorite [post]
func CreateRelationFavoriteSong(c *gin.Context) {
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

	var relation models.RelationPersonaFavoritaCancion
	err := c.BindJSON(&relation)
	if err != nil {
		c.JSON(http.StatusBadRequest, responses.ErrorResponse{
			Status:  http.StatusBadRequest,
			Message: "Error al procesar la solicitud",
			Error:   err.Error(),
		})
		return
	}

	f, err := time.Parse(time.DateOnly, relation.Cuando)

	// create relation
	_, err = session.Run(c, "MATCH (p:Persona {Usuario: $usuario}), (s:Cancion {Nombre: $cancion}) CREATE (p)-[r:ES_FAVORITA {Cuando: $cuando, Como: $como, Frecuencia: $frecuencia}]->(s) RETURN r",
		map[string]interface{}{
			"usuario":    relation.Usuario,
			"cancion":    relation.Cancion,
			"cuando":     f,
			"como":       relation.Como,
			"frecuencia": relation.Frecuencia,
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

// CreateRelationLikesSong Crea una relación de una persona con una canción que le gusta
// @Summary Crea una relación de una persona con una canción que le gusta
// @Description Crea una relación de (Persona)-[LE_GUSTA]->(Cancion)
// @Tags Canciones
// @Accept json
// @Produce json
// @Param relation body models.RelationPersonaLeGustaCancion true "Relación de persona le gusta canción"
// @Success 200 {object} responses.StandardResponse "Relación creada exitosamente"
// @Failure 400 {object} responses.ErrorResponse "Error al procesar la solicitud"
// @Failure 500 {object} responses.ErrorResponse "Error al procesar la solicitud"
// @Router /songs/likes [post]
func CreateRelationLikesSong(c *gin.Context) {
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

	var relation models.RelationPersonaLeGustaCancion
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
	_, err = session.Run(c, "MATCH (p:Persona {Usuario: $usuario}), (s:Cancion {Nombre: $cancion}) CREATE (p)-[r:LE_GUSTA {Como: $como, Escucha: $escucha, MasArtista: $masArtista}]->(s) RETURN r",
		map[string]interface{}{
			"usuario":    relation.Usuario,
			"cancion":    relation.Cancion,
			"como":       relation.Como,
			"escucha":    relation.Escucha,
			"masArtista": relation.MasArtista,
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

// CreateRelationDislikesSong Crea una relación de una persona con una canción que no le gusta
// @Summary Crea una relación de una persona con una canción que no le gusta
// @Description Crea una relación de (Persona)-[NO_LE_GUSTA]->(Cancion)
// @Tags Canciones
// @Accept json
// @Produce json
// @Param relation body models.RelationPersonaNoLeGustaCancion true "Relación de persona no le gusta canción"
// @Success 200 {object} responses.StandardResponse "Relación creada exitosamente"
// @Failure 400 {object} responses.ErrorResponse "Error al procesar la solicitud"
// @Failure 500 {object} responses.ErrorResponse "Error al procesar la solicitud"
// @Router /songs/dislikes [post]
func CreateRelationDislikesSong(c *gin.Context) {
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

	var relation models.RelationPersonaNoLeGustaCancion
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
	_, err = session.Run(c, "MATCH (p:Persona {Usuario: $usuario}), (s:Cancion {Nombre: $cancion}) CREATE (p)-[r:NO_LE_GUSTA {Motivo: $motivo, Cambiar: $cambiar, Intensidad: $intensidad}]->(s) RETURN r",
		map[string]interface{}{
			"usuario":    relation.Usuario,
			"cancion":    relation.Cancion,
			"motivo":     relation.Motivo,
			"cambiar":    relation.Cambiar,
			"intensidad": relation.Intensidad,
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

type SetSongRemembersInput struct {
	Usuario    string `json:"usuario" binding:"required"`
	Cancion    string `json:"cancion" binding:"required"`
	MeRecuerda string `json:"me_recuerda_a" binding:"required"`
}

// SetSongNewProperty Establece una nueva propiedad a una relación de una persona con una canción
// @Summary Establece una nueva propiedad a una relación de una persona con una canción
// @Description Establece o actualiza una nueva propiedad a una relación de (Persona)-[ES_FAVORITA]->(Cancion). La propiedad es "MeRecuerda"
// @Tags Canciones
// @Accept json
// @Produce json
// @Param input body SetSongRemembersInput true "Datos de la relación a modificar"
// @Success 200 {object} responses.StandardResponse "Propiedad modificada exitosamente"
// @Failure 400 {object} responses.ErrorResponse "Error al procesar la solicitud"
// @Failure 500 {object} responses.ErrorResponse "Error al procesar la solicitud"
// @Router /songs/remembers [put]
func SetSongNewProperty(c *gin.Context) {
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

	var input SetSongRemembersInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, responses.ErrorResponse{
			Status:  http.StatusBadRequest,
			Message: "Error al procesar la solicitud",
			Error:   err.Error(),
		})
		return
	}

	_, err := session.Run(c,
		"MATCH (p:Persona {Usuario: $usuario})-[r:ES_FAVORITA]->(s:Cancion {Nombre: $cancion}) SET r.MeRecuerda = $me_recuerda_a RETURN r",
		map[string]interface{}{
			"cancion":       input.Cancion,
			"usuario":       input.Usuario,
			"me_recuerda_a": input.MeRecuerda,
		})

	if err != nil {
		c.JSON(http.StatusInternalServerError, responses.ErrorResponse{
			Status:  http.StatusInternalServerError,
			Message: "Error al procesar la solicitud",
			Error:   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, responses.StandardResponse{
		Status:  http.StatusOK,
		Message: "Propiedad modificada exitosamente",
		Data:    nil,
	})
}

type DeleteSongRememberPropertyInput struct {
	Usuario string `json:"usuario" binding:"required"`
	Cancion string `json:"cancion" binding:"required"`
}

// DeleteSongRememberProperty Elimina una propiedad de una relación de una persona con una canción
// @Summary Elimina una propiedad de una relación de una persona con una canción
// @Description Elimina una propiedad de una relación de (Persona)-[ES_FAVORITA]->(Cancion). La propiedad es "MeRecuerda"
// @Tags Canciones
// @Accept json
// @Produce json
// @Param input body DeleteSongRememberPropertyInput true "Datos de la relación a modificar"
// @Success 200 {object} responses.StandardResponse "Propiedad eliminada exitosamente"
// @Failure 400 {object} responses.ErrorResponse "Error al procesar la solicitud"
// @Failure 500 {object} responses.ErrorResponse "Error al procesar la solicitud"
// @Router /songs/remembers/remove [post]
func DeleteSongRememberProperty(c *gin.Context) {
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

	var input DeleteSongRememberPropertyInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, responses.ErrorResponse{
			Status:  http.StatusBadRequest,
			Message: "Error al procesar la solicitud",
			Error:   err.Error(),
		})
		return
	}

	_, err := session.Run(c,
		"MATCH (p:Persona {Usuario: $usuario})-[r:ES_FAVORITA]->(s:Cancion {Nombre: $cancion}) REMOVE r.MeRecuerda RETURN r",
		map[string]interface{}{
			"cancion": input.Cancion,
			"usuario": input.Usuario,
		})

	if err != nil {
		c.JSON(http.StatusInternalServerError, responses.ErrorResponse{
			Status:  http.StatusInternalServerError,
			Message: "Error al procesar la solicitud",
			Error:   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, responses.StandardResponse{
		Status:  http.StatusOK,
		Message: "Propiedad eliminada exitosamente",
		Data:    nil,
	})
}
