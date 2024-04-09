package routes

import (
	"backend/controllers"
	"github.com/gin-gonic/gin"
)

func Routes(router *gin.Engine) {
	router.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "Service is up and running!",
		})
	})

	users := router.Group("/users")
	{
		users.GET("/", controllers.Users)
		users.POST("/student", controllers.NewStudent)
		users.GET("/careers", controllers.GetCareers)
	}

}
