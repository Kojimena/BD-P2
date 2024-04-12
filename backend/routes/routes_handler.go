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
		users.POST("/student", controllers.NewStudent)
		users.POST("/teacher", controllers.NewTeacher)
		users.GET("/careers", controllers.GetCareers)
		users.GET("/signs", controllers.GetZodiacalSigns)
	}

	teams := router.Group("/teams")
	{
		teams.GET("/", controllers.GetTeams)
		teams.POST("/", controllers.NewTeam)
	}

	places := router.Group("/places")
	{
		places.GET("/", controllers.GetPlaces)
		places.POST("/", controllers.NewPlace)

	}

	songs := router.Group("/songs")
	{
		songs.GET("/", controllers.GetSongs)
	}

}
