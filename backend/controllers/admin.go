package controllers

import (
	"backend/configs"
	"backend/responses"
	"context"
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/neo4j/neo4j-go-driver/v5/neo4j"
	"net/http"
)

type TagUsersInput struct {
	Users []string `json:"users" binding:"required"`
	Tag   string   `json:"tag" binding:"required"`
	Value bool     `json:"value" binding:"required"`
}

// TagUsers crea una propiedad en los nodos de los usuarios
// @Summary Etiquetar usuarios
// @Description Etiquetar usuarios con una propiedad
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
		_, err := session.Run(
			c,
			fmt.Sprintf("MATCH (p: Persona {Usuario: $user}) SET p.%s = true", input.Tag),
			map[string]interface{}{
				"user": user,
			},
		)

		if err != nil {
			c.JSON(http.StatusInternalServerError, responses.ErrorResponse{
				Message: "Error al crear la relación",
				Error:   err.Error(),
			})
		}
	}

	c.JSON(http.StatusOK, responses.StandardResponse{
		Status:  http.StatusOK,
		Message: "Usuarios etiquetados correctamente",
		Data:    nil,
	})

}
