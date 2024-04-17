package main

import (
	"backend/configs"
	docs "backend/docs"
	"backend/routes"
	"github.com/gin-gonic/gin"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

func CORS() gin.HandlerFunc {
	// Reference: https://github.com/gin-contrib/cors/issues/29
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}

func main() {
	router := gin.Default()
	router.Use(CORS())

	// Neo4j
	configs.ConnectDB()

	// Swagger
	docs.SwaggerInfo.Title = "Bases de Datos 2 Proyecto 2: Backend"
	docs.SwaggerInfo.Description = "API para el backend del proyecto 2 de Bases de Datos 2"
	docs.SwaggerInfo.Version = "1.0.0"
	docs.SwaggerInfo.Host = "super-trixi-kojimena.koyeb.app"
	docs.SwaggerInfo.BasePath = "/"

	routes.Routes(router)

	router.GET("/documentation/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	err := router.Run()
	if err != nil {
		panic(err)
	}
}
