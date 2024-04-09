package configs

import (
	"context"
	"fmt"
	"github.com/joho/godotenv"
	"github.com/neo4j/neo4j-go-driver/v5/neo4j"
	"os"
)

var DB neo4j.DriverWithContext

func ConnectDB() {
	err := godotenv.Load()
	if err != nil {
		panic(err)
	}

	uri := os.Getenv("NEO4J_URI")
	user := os.Getenv("NEO4J_USERNAME")
	password := os.Getenv("NEO4J_PASSWORD")

	if uri == "" || user == "" || password == "" {
		panic("Missing environment variables for Neo4j connection")
	}

	driver, err := neo4j.NewDriverWithContext(uri, neo4j.BasicAuth(user, password, ""))

	if err != nil {
		panic(err)
	}

	err = driver.VerifyConnectivity(context.Background())

	if err != nil {
		panic(err)
	}
	fmt.Println("Neo4j connected")
	DB = driver

	// ping the database to check if the connection is successful
}
