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

// GetZodiacalSigns Obtiene todos los signos zodiacales
// @Summary Obtiene todos los signos zodiacales
// @Description Obtiene todos los signos zodiacales de la base de datos
// @Tags Signos Zodiacales
// @Accept json
// @Produce json
// @Success 200 {object} responses.ZodiacalSignResponse "Signos zodiacales obtenidos exitosamente"
// @Failure 400 {object} responses.ErrorResponse "Error al procesar la solicitud"
// @Router /signs [get]
func GetZodiacalSigns(c *gin.Context) {

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

	// get all zodiacal signs
	r, err := session.Run(c, "MATCH (z:SignoZodiacal) RETURN z", nil)

	if err != nil {
		c.JSON(http.StatusInternalServerError, responses.ErrorResponse{
			Status:  http.StatusInternalServerError,
			Message: "Error al obtener los signos zodiacales",
			Error:   err.Error(),
		})
		return
	}

	var zodiacalSigns []models.Signo
	for r.Next(c) {
		vals := r.Record().Values[0].(dbtype.Node).Props
		fmt.Println(vals)

		zodiacalSign := models.Signo{
			Nombre:    vals["Nombre"].(string),
			Elemento:  vals["Elemento"].(string),
			Planeta:   vals["Planeta"].(string),
			Piedra:    vals["Piedra"].(string),
			Metal:     vals["Metal"].(string),
			DiaSemana: vals["DiaDeLaSemana"].(string),
		}

		zodiacalSigns = append(zodiacalSigns, zodiacalSign)
	}

	c.JSON(http.StatusOK, responses.ZodiacalSignResponse{
		Status:  http.StatusOK,
		Message: "Signos zodiacales obtenidos exitosamente",
		Signs:   zodiacalSigns,
	})
}

// CreateRelationIsSign Crea una relación entre un usuario y un signo zodiacal
// @Summary Crea una relación entre un usuario y un signo zodiacal
// @Description Crea una relación entre un usuario y un signo zodiacal. La relación define de qué signo es el usuario, la compatibilidad, la influencia y si al usuario le gusta compartir su signo zodiacal
// @Tags Signos Zodiacales
// @Accept json
// @Produce json
// @Param relation body models.RelationEsSigno true "Relación a crear"
// @Success 200 {object} responses.StandardResponse "Relación ES_SIGNO creada exitosamente"
// @Failure 400 {object} responses.ErrorResponse "Error al procesar la solicitud"
// @Router /signs/relation [post]
func CreateRelationIsSign(c *gin.Context) {
	var relation models.RelationEsSigno

	if err := c.ShouldBindJSON(&relation); err != nil {
		c.JSON(http.StatusBadRequest, responses.ErrorResponse{
			Status:  http.StatusBadRequest,
			Message: "El cuerpo de la solicitud no es válido",
			Error:   err.Error(),
		})
		return
	}

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

	_, err := session.Run(
		c,
		"MATCH (p:Persona {Usuario: $usuario}), (s:SignoZodiacal {Nombre: $signo}) CREATE (p)-[r:ES_SIGNO {Compatibilidad: $compatibilidad, Influencia: $influencia, Compartir: $compartir}]->(s) RETURN r",
		map[string]interface{}{
			"usuario":        relation.Usuario,
			"signo":          relation.Signo,
			"compatibilidad": relation.Compatibilidad,
			"influencia":     relation.Influencia,
			"compartir":      relation.Compartir,
		})

	if err != nil {
		c.JSON(http.StatusInternalServerError, responses.ErrorResponse{
			Status:  http.StatusInternalServerError,
			Message: "Error al crear la relación ES_SIGNO",
			Error:   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, responses.StandardResponse{
		Status:  http.StatusOK,
		Message: "Relación ES_SIGNO creada exitosamente",
		Data:    nil,
	})
}
