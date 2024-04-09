package routes

import (
	"github.com/gin-gonic/gin"
)

func Routes(router *gin.Engine) {
	router.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "Service is up and running!",
		})
	})
}
