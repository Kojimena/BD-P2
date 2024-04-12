package controllers

import (
	"backend/configs"
	"backend/models"
	"backend/responses"
	"github.com/gin-gonic/gin"
	"github.com/neo4j/neo4j-go-driver/v5/neo4j"
	"net/http"
)

func GetPlaces(c *gin.Context) {
	session := configs.DB.NewSession(c, neo4j.SessionConfig{AccessMode: neo4j.AccessModeWrite})

	defer session.Close(c)

	// Consulta para obtener todos los lugares
	r, err := session.Run(
		c,
		"MATCH (l:Lugar) RETURN l",
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

	var places []models.Lugar
	for r.Next(c) {
		vals := r.Record().Values[0].(neo4j.Node).Props

		place := models.Lugar{
			Nombre:       vals["Nombre"].(string),
			Departamento: vals["Departamento"].(string),
			Tipo:         vals["Tipo"].(string),
			Direccion:    vals["Dirección"].(string),
			Foto:         vals["Foto"].(string),
		}

		places = append(places, place)
	}

	c.JSON(http.StatusOK, responses.PlacesResponse{
		Status:  http.StatusOK,
		Message: "Lugares obtenidos exitosamente",
		Places:  places,
	})
}

func NewPlace(c *gin.Context) {
	session := configs.DB.NewSession(c, neo4j.SessionConfig{AccessMode: neo4j.AccessModeWrite})

	defer session.Close(c)

	// Bind de la estructura de lugar
	var place models.Lugar
	if err := c.BindJSON(&place); err != nil {
		c.JSON(http.StatusBadRequest, responses.ErrorResponse{
			Status:  http.StatusBadRequest,
			Message: "Error al procesar la solicitud",
			Error:   err.Error(),
		})
		return
	}

	// Consulta para crear un nuevo lugar
	_, err := session.Run(
		c,
		"CREATE (l:Lugar {Nombre: $Nombre, Departamento: $Departamento, Tipo: $Tipo, Dirección: $Dirección, Foto: $Foto}) RETURN l",
		map[string]interface{}{
			"Nombre":       place.Nombre,
			"Departamento": place.Departamento,
			"Tipo":         place.Tipo,
			"Dirección":    place.Direccion,
			"Foto":         place.Foto,
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
		Message: "Lugar creado exitosamente",
		Data:    map[string]interface{}{"place": place},
	})
}
