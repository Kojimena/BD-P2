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
// @Router /zodiacal-signs [get]
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
