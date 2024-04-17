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

// Recommendation Sistema simple de recomendación de usuarios.
// @Summary Sistema simple de recomendación de usuarios.
// @Description Dado un usuario, encontrar a usuario que tengan intereses en común. Se comparan las relaciones de favoritos, gustos y desagrados.
// @Tags Usuarios
// @Accept json
// @Produce json
// @Param username path string true "Nombre de usuario"
// @Success 200 {object} responses.RecommendationResponse "Recomendaciones encontradas"
// @Failure 400 {object} responses.ErrorResponse "El nombre de usuario no puede estar vacío"
// @Failure 500 {object} responses.ErrorResponse "Error al buscar coincidencias"
// @Router /users/recommendation/{username} [get]
func Recommendation(c *gin.Context) {
	username := c.Param("username")

	if username == "" {
		c.JSON(http.StatusBadRequest, responses.ErrorResponse{
			Status:  http.StatusBadRequest,
			Message: "El nombre de usuario no puede estar vacío",
			Error:   "El nombre de usuario no puede estar vacío. Por favor, ingrese un nombre de usuario válido en la URL.",
		})
		return
	}

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

	/*
		Sistema simple de recomendación de usuarios.
		Dado un usuario, encontrar a usuario que tengan intereses en común.

		Relaciones a considerar:
		- Nodo: Relación (Propiedad a comparar)
		- Canción: Favorita Canción (Nombre)
		- Canción: Le Gusta Canción (Nombre)
		- Canción: No Le Gusta Canción (Nombre)
		- Carrera: Le Interesa Carrera (Nombre)
		- Carrera: Estudia Carrera (Nombre)
		- Signo: Es Signo (Nombre)
		- Equipo: Apoya Equipo (Nombre)
		- Equipo: No Apoya Equipo (Nombre)
		- Lugar: Le Gusta Lugar (Nombre)
		- Lugar: No Le Gusta Lugar (Nombre)
	*/

	var matches = make(map[string]int) // usuario: puntaje

	// ES_FAVORITA
	r, err := session.Run(
		c,
		"MATCH (p:Persona {Usuario: $username})-[:ES_FAVORITA]->(c:Cancion)<-[:ES_FAVORITA]-(p2:Persona) RETURN p2.Usuario",
		map[string]interface{}{"username": username},
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, responses.ErrorResponse{
			Status:  http.StatusInternalServerError,
			Message: "Error al buscar coincidencias",
			Error:   err.Error(),
		})
		return
	}

	for r.Next(c) {
		user := r.Record().Values[0].(string)
		fmt.Printf("ES_FAVORITA Canción: %s\n", user)
		matches[user]++
	}

	// LE_GUSTA
	r, err = session.Run(
		c,
		"MATCH (p:Persona {Usuario: $username})-[:LE_GUSTA]->(c:Cancion)<-[:LE_GUSTA]-(p2:Persona) RETURN p2.Usuario",
		map[string]interface{}{"username": username},
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, responses.ErrorResponse{
			Status:  http.StatusInternalServerError,
			Message: "Error al buscar coincidencias",
			Error:   err.Error(),
		})
		return
	}

	for r.Next(c) {
		user := r.Record().Values[0].(string)
		fmt.Printf("LE_GUSTA Canción: %s\n", user)
		matches[user]++
	}

	// NO_LE_GUSTA
	r, err = session.Run(
		c,
		"MATCH (p:Persona {Usuario: $username})-[:NO_LE_GUSTA]->(c:Cancion)<-[:NO_LE_GUSTA]-(p2:Persona) RETURN p2.Usuario",
		map[string]interface{}{"username": username},
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, responses.ErrorResponse{
			Status:  http.StatusInternalServerError,
			Message: "Error al buscar coincidencias",
			Error:   err.Error(),
		})
		return
	}

	// LE_INTERESA
	r, err = session.Run(
		c,
		"MATCH (p:Persona {Usuario: $username})-[:LE_INTERESA]->(c:Carrera)<-[:LE_INTERESA]-(p2:Persona) RETURN p2.Usuario",
		map[string]interface{}{"username": username},
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, responses.ErrorResponse{
			Status:  http.StatusInternalServerError,
			Message: "Error al buscar coincidencias",
			Error:   err.Error(),
		})
		return
	}

	for r.Next(c) {
		user := r.Record().Values[0].(string)
		fmt.Printf("LE_INTERESA Carrera: %s\n", user)
		matches[user]++
	}

	// Estudia
	r, err = session.Run(
		c,
		"MATCH (p:Persona {Usuario: $username})-[:ESTUDIA]->(c:Carrera)<-[:ESTUDIA]-(p2:Persona) RETURN p2.Usuario",
		map[string]interface{}{"username": username},
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, responses.ErrorResponse{
			Status:  http.StatusInternalServerError,
			Message: "Error al buscar coincidencias",
			Error:   err.Error(),
		})
		return
	}

	for r.Next(c) {
		user := r.Record().Values[0].(string)
		fmt.Printf("ESTUDIA Carrera: %s\n", user)
		matches[user]++
	}

	// ES_SIGNO
	r, err = session.Run(
		c,
		"MATCH (p:Persona {Usuario: $username})-[:ES_SIGNO]->(c:SignoZodiacal)<-[:ES_SIGNO]-(p2:Persona) RETURN p2.Usuario",
		map[string]interface{}{"username": username},
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, responses.ErrorResponse{
			Status:  http.StatusInternalServerError,
			Message: "Error al buscar coincidencias",
			Error:   err.Error(),
		})
		return
	}

	for r.Next(c) {
		user := r.Record().Values[0].(string)
		fmt.Printf("ES_SIGNO Signo: %s\n", user)
		matches[user]++
	}

	// APOYA
	r, err = session.Run(
		c,
		"MATCH (p:Persona {Usuario: $username})-[:APOYA]->(c:Equipo)<-[:APOYA]-(p2:Persona) RETURN p2.Usuario",
		map[string]interface{}{"username": username},
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, responses.ErrorResponse{
			Status:  http.StatusInternalServerError,
			Message: "Error al buscar coincidencias",
			Error:   err.Error(),
		})
		return
	}

	for r.Next(c) {
		user := r.Record().Values[0].(string)
		fmt.Printf("APOYA Equipo: %s\n", user)
		matches[user]++
	}

	// RECHAZA
	r, err = session.Run(
		c,
		"MATCH (p:Persona {Usuario: $username})-[:RECHAZA]->(c:Equipo)<-[:RECHAZA]-(p2:Persona) RETURN p2.Usuario",
		map[string]interface{}{"username": username},
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, responses.ErrorResponse{
			Status:  http.StatusInternalServerError,
			Message: "Error al buscar coincidencias",
			Error:   err.Error(),
		})
		return
	}

	for r.Next(c) {
		user := r.Record().Values[0].(string)
		fmt.Printf("RECHAZA Equipo: %s\n", user)
		matches[user]++
	}

	// LE_GUSTA
	r, err = session.Run(
		c,
		"MATCH (p:Persona {Usuario: $username})-[:VISITA]->(c:Lugar)<-[:VISITA]-(p2:Persona) RETURN p2.Usuario",
		map[string]interface{}{"username": username},
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, responses.ErrorResponse{
			Status:  http.StatusInternalServerError,
			Message: "Error al buscar coincidencias",
			Error:   err.Error(),
		})
		return
	}

	for r.Next(c) {
		user := r.Record().Values[0].(string)
		fmt.Printf("LE_GUSTA Lugar: %s\n", user)
		matches[user]++
	}

	// NO_LE_GUSTA
	r, err = session.Run(
		c,
		"MATCH (p:Persona {Usuario: $username})-[:NO_LE_GUSTA]->(c:Lugar)<-[:NO_LE_GUSTA]-(p2:Persona) RETURN p2.Usuario",
		map[string]interface{}{"username": username},
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, responses.ErrorResponse{
			Status:  http.StatusInternalServerError,
			Message: "Error al buscar coincidencias",
			Error:   err.Error(),
		})
		return
	}

	for r.Next(c) {
		user := r.Record().Values[0].(string)
		fmt.Printf("NO_LE_GUSTA Lugar: %s\n", user)
		matches[user]++
	}

	c.JSON(http.StatusOK, responses.RecommendationResponse{
		Status:  http.StatusOK,
		Message: "Recomendaciones encontradas",
		Matches: matches,
	})
}
