package controllers

import (
	"backend/configs"
	"backend/models"
	"backend/responses"
	"context"
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/neo4j/neo4j-go-driver/v5/neo4j"
	"net/http"
)

type TagUsersInput struct {
	Users []string `json:"users" binding:"required"` // Usuarios a etiquetar
	Tag   string   `json:"tag" binding:"required"`   // Propiedad a crear
	Value bool     `json:"value" binding:"required"` // Valor de la propiedad
}

// TagUsers crea una propiedad en los nodos de los usuarios
// @Summary Etiquetar usuarios
// @Description Etiquetar multiples usuarios con una propiedad
// @Tags Admin
// @Accept json
// @Produce json
// @Param input body TagUsersInput true "Usuarios y etiqueta"
// @Success 200 {object} responses.StandardResponse
// @Router /admin/tag [post]
func TagUsers(c *gin.Context) {
	var input TagUsersInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	session := configs.DB.NewSession(c, neo4j.SessionConfig{AccessMode: neo4j.AccessModeWrite})

	defer func(session neo4j.SessionWithContext, ctx context.Context) {
		err := session.Close(ctx)
		if err != nil {
			c.JSON(http.StatusInternalServerError, responses.ErrorResponse{
				Message: "Error al cerrar la sesión",
				Error:   err.Error(),
			})
		}
	}(session, c)

	// crear propiedades de tag
	for _, user := range input.Users {
		r, err := session.Run(
			c,
			"MATCH (p: Persona {Usuario: $user}) RETURN p",
			map[string]interface{}{
				"user": user,
			},
		)
		if err != nil {
			c.JSON(http.StatusInternalServerError, responses.ErrorResponse{
				Message: "Error al buscar el usuario",
				Error:   err.Error(),
			})
		}

		var persona models.Persona
		for r.Next(c) {
			vals := r.Record().Values[0].(neo4j.Node).Props
			persona = models.Persona{
				Usuario: vals["Usuario"].(string),
			}

			if persona.Usuario == "" {
				c.JSON(http.StatusNotFound, responses.ErrorResponse{
					Status:  http.StatusNotFound,
					Message: "Usuario no encontrado",
					Error:   fmt.Sprintf("Usuario %s no encontrado", user),
				})
				return
			}

			if vals[input.Tag] != nil { // Actualizar propiedad
				fmt.Println("Propiedad ya existe")
				_, err = session.Run(
					c,
					fmt.Sprintf("MATCH (p: Persona {Usuario: $user}) SET p.%s = $value", input.Tag),
					map[string]interface{}{
						"user":  user,
						"value": input.Value,
					})
				if err != nil {
					c.JSON(http.StatusInternalServerError, responses.ErrorResponse{
						Status:  http.StatusInternalServerError,
						Message: "Error al actualizar la propiedad",
						Error:   err.Error(),
					})
					return
				}
			} else { // Crear propiedad
				fmt.Println("Propiedad no existe")
				_, err = session.Run(
					c,
					fmt.Sprintf("MATCH (p: Persona {Usuario: $user}) SET p.%s = $value", input.Tag),
					map[string]interface{}{
						"user":  user,
						"value": input.Value,
					})
				if err != nil {
					c.JSON(http.StatusInternalServerError, responses.ErrorResponse{
						Status:  http.StatusInternalServerError,
						Message: "Error al crear la propiedad",
						Error:   err.Error(),
					})
					return
				}
			}
		}
	}

	c.JSON(http.StatusOK, responses.StandardResponse{
		Status:  http.StatusOK,
		Message: "Usuarios etiquetados correctamente",
		Data:    nil,
	})

}
