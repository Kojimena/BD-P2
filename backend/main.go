package main

import (
	"backend/configs"
	"backend/routes"
	"github.com/gin-gonic/gin"
)

func main() {
	router := gin.Default()

	configs.ConnectDB()
	routes.Routes(router)

	router.Run("localhost:8080")
}
