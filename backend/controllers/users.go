package controllers

import "github.com/gin-gonic/gin"

// Users
// @Summary Prueba
// @Description Prueba
// @Tags Users
// @Accept json
// @Produce json
// @Success 200 {string} string "Service is up and running!"
// @Router /users [get]
func Users(c *gin.Context) {
	c.JSON(200, gin.H{
		"message": "Service is up and running!",
	})
}
