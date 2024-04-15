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
	"time"
)

// GetAllUsers obtiene todos los usuarios
// @Summary Obtiene todos los usuarios
// @Description Obtiene todos los usuarios registrados en la base de datos
// @Tags Admin
// @Accept json
// @Produce json
// @Param filter query string false "Filtro de búsqueda opcional en base a una propiedad"
// @Success 200 {object} responses.UsersResponse "Usuarios obtenidos exitosamente"
// @Failure 500 {object} responses.ErrorResponse "Error al procesar la solicitud"
// @Router /admin/users [get]
func GetAllUsers(c *gin.Context) {
	filter := c.Query("filter")

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

	var users []models.Persona

	if filter == "" {
		r, err := session.Run(
			c,
			"MATCH (p: Persona) RETURN p",
			nil,
		)
		if err != nil {
			c.JSON(http.StatusInternalServerError, responses.ErrorResponse{
				Message: "Error al buscar los usuarios",
				Error:   err.Error(),
			})
		}

		for r.Next(c) {
			vals := r.Record().Values[0].(neo4j.Node).Props
			user := models.Persona{
				Nombre:          vals["Nombre"].(string),
				Apellido:        vals["Apellido"].(string),
				FechaNacimiento: vals["FechaNacimiento"].(time.Time).String(),
				Genero:          vals["Genero"].(string),
				Usuario:         vals["Usuario"].(string),
				Password:        vals["Password"].(string),
			}
			users = append(users, user)
		}
	} else { // filter es un string con el nombre de la propiedad
		fmt.Println("Filter: ", filter)
		r, err := session.Run(
			c,
			fmt.Sprintf("MATCH (p: Persona) WHERE p.%s RETURN p", filter),
			nil,
		)

		if err != nil {
			c.JSON(http.StatusInternalServerError, responses.ErrorResponse{
				Message: "Error al buscar los usuarios",
				Error:   err.Error(),
			})
		}

		for r.Next(c) {
			vals := r.Record().Values[0].(neo4j.Node).Props
			user := models.Persona{
				Nombre:          vals["Nombre"].(string),
				Apellido:        vals["Apellido"].(string),
				FechaNacimiento: vals["FechaNacimiento"].(time.Time).String(),
				Genero:          vals["Genero"].(string),
				Usuario:         vals["Usuario"].(string),
				Password:        vals["Password"].(string),
			}
			users = append(users, user)
		}

	}

	c.JSON(http.StatusOK, responses.UsersResponse{
		Status: http.StatusOK,
		Users:  users,
	})
}

type DeleteUsersInput struct {
	Users []string `json:"users" binding:"required"` // Usuarios a eliminar
}

// DeleteUsers elimina usuarios de la base de datos
// @Summary Elimina usuarios
// @Description Elimina multiples usuarios de la base de datos
// @Tags Admin
// @Accept json
// @Produce json
// @Param input body DeleteUsersInput true "Usuarios a eliminar"
// @Success 200 {object} responses.StandardResponse "Usuarios eliminados correctamente"
// @Failure 404 {object} responses.ErrorResponse "Usuario no encontrado"
// @Failure 500 {object} responses.ErrorResponse "Error al procesar la solicitud"
// @Router /admin/users/delete [post]
func DeleteUsers(c *gin.Context) {
	var input DeleteUsersInput
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

		for r.Next(c) {
			var persona models.Persona
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

			_, err = session.Run(
				c,
				"MATCH (p: Persona {Usuario: $user}) DETACH DELETE p",
				map[string]interface{}{
					"user": user,
				})
			if err != nil {
				c.JSON(http.StatusInternalServerError, responses.ErrorResponse{
					Status:  http.StatusInternalServerError,
					Message: "Error al eliminar el usuario",
					Error:   err.Error(),
				})
				return
			}
		}
	}

	c.JSON(http.StatusOK, responses.StandardResponse{
		Status:  http.StatusOK,
		Message: "Usuarios eliminados correctamente",
		Data:    nil,
	})
}

type TagUsersInput struct {
	Users []string `json:"users" binding:"required"` // Usuarios a etiquetar
	Tag   string   `json:"tag" binding:"required"`   // Propiedad a crear
	Value *bool    `json:"value" binding:"required"` // Valor de la propiedad
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

		for r.Next(c) {
			var persona models.Persona
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

type RemoveTagInput struct {
	Users []string `json:"users" binding:"required"` // Usuarios a etiquetar
	Tag   string   `json:"tag" binding:"required"`   // Propiedad a eliminar
}

// RemoveTag elimina una propiedad en los nodos de los usuarios
// @Summary Eliminar propiedad de usuarios
// @Description Eliminar una propiedad de multiples usuarios
// @Tags Admin
// @Accept json
// @Produce json
// @Param input body RemoveTagInput true "Usuarios y etiqueta"
// @Success 200 {object} responses.StandardResponse
// @Router /admin/tag/remove [post]
func RemoveTag(c *gin.Context) {
	var input RemoveTagInput
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

		for r.Next(c) {
			var persona models.Persona
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
				_, err = session.Run(
					c,
					fmt.Sprintf("MATCH (p: Persona {Usuario: $user}) REMOVE p.%s", input.Tag),
					map[string]interface{}{
						"user": user,
					})
				if err != nil {
					c.JSON(http.StatusInternalServerError, responses.ErrorResponse{
						Status:  http.StatusInternalServerError,
						Message: "Error al eliminar la propiedad",
						Error:   err.Error(),
					})
					return
				}
			} else { // Crear propiedad
				fmt.Println("Propiedad no existe")
				c.JSON(http.StatusBadRequest, responses.ErrorResponse{
					Status:  http.StatusBadRequest,
					Message: "La propiedad no existe",
					Error:   fmt.Sprintf("La propiedad %s no existe en el usuario %s", input.Tag, user),
				})
				return
			}
		}
	}

	c.JSON(http.StatusOK, responses.StandardResponse{
		Status:  http.StatusOK,
		Message: "Propiedad eliminada correctamente",
		Data:    nil,
	})

}

func Metrics(c *gin.Context) {
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

	/*
		Métricas:
		- Cantidad de usuarios (Estudiantes y Profesores)
		- Cantidad de publicaciones
		- Cantidad de lugares
		- Cantidad de equipos
		- Cantidad de canciones
		- Cantidad de carreras
		- Cantidad de signos zodiacales
		- Cantidad de relaciones de usuario con canciones
		- Cantidad de relaciones de usuario con lugares
		- Cantidad de relaciones de usuario con equipos
		- Cantidad de relaciones de usuario con carreras
		- Cantidad de relaciones de usuario con signos zodiacales
	*/

	var metrics = make(map[string]int64)

	// Cantidad de usuarios
	r, err := session.Run(
		c,
		"MATCH (p: Persona) RETURN count(p)",
		nil,
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, responses.ErrorResponse{
			Message: "Error al buscar la cantidad de usuarios",
			Error:   err.Error(),
		})
	}

	for r.Next(c) {
		metrics["Cantidad de usuarios"] = r.Record().Values[0].(int64)
	}

	// Cantidad de Estudiantes
	r, err = session.Run(
		c,
		"MATCH (p: Estudiante) RETURN count(p)",
		nil,
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, responses.ErrorResponse{
			Message: "Error al buscar la cantidad de estudiantes",
			Error:   err.Error(),
		})
	}

	for r.Next(c) {
		metrics["Cantidad de estudiantes"] = r.Record().Values[0].(int64)
	}

	// Cantidad de Profesores
	r, err = session.Run(
		c,
		"MATCH (p: Profesor) RETURN count(p)",
		nil,
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, responses.ErrorResponse{
			Message: "Error al buscar la cantidad de profesores",
			Error:   err.Error(),
		})
	}

	for r.Next(c) {
		metrics["Cantidad de profesores"] = r.Record().Values[0].(int64)
	}

	// Cantidad de publicaciones
	r, err = session.Run(
		c,
		"MATCH (p: Persona) RETURN sum(size(p.Publicaciones))",
		nil,
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, responses.ErrorResponse{
			Message: "Error al buscar la cantidad de publicaciones",
			Error:   err.Error(),
		})
	}

	for r.Next(c) {
		metrics["Cantidad de publicaciones"] = r.Record().Values[0].(int64)
	}

	// Cantidad de nodos
	counts := []string{"lugares", "equipos", "carreras", "signos zodiacales", "canciones"}
	r, err = session.Run(
		c,
		"MATCH (n: Lugar) RETURN count(n) UNION ALL MATCH (n: Equipo) RETURN count(n) UNION ALL MATCH (n: Carrera) RETURN count(n) UNION ALL MATCH (n: SignoZodiacal) RETURN count(n) UNION ALL MATCH (n: Cancion) RETURN count(n)",
		nil,
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, responses.ErrorResponse{
			Message: "Error al buscar la cantidad de nodos",
			Error:   err.Error(),
		})
	}

	for _, count := range counts {
		r.Next(c)
		metrics[fmt.Sprintf("Cantidad de %s", count)] = r.Record().Values[0].(int64)
	}

	// Cantidad de relaciones
	relations := []string{"usuario-cancion", "usuario-lugar", "usuario-equipo", "usuario-carrera", "usuario-signo"}
	r, err = session.Run(
		c,
		"MATCH (u: Persona)-[r]->(c: Cancion) RETURN count(r) UNION ALL MATCH (u: Persona)-[r]->(l: Lugar) RETURN count(r) UNION ALL MATCH (u: Persona)-[r]->(e: Equipo) RETURN count(r) UNION ALL MATCH (u: Persona)-[r]->(c: Carrera) RETURN count(r) UNION ALL MATCH (u: Persona)-[r]->(s: SignoZodiacal) RETURN count(r)",
		nil,
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, responses.ErrorResponse{
			Message: "Error al buscar la cantidad de relaciones",
			Error:   err.Error(),
		})
	}

	for _, relation := range relations {
		r.Next(c)
		metrics[fmt.Sprintf("Cantidad de relaciones de %s", relation)] = r.Record().Values[0].(int64)
	}

	c.JSON(http.StatusOK, responses.MetricsResponse{
		Status:  http.StatusOK,
		Message: "Métricas obtenidas correctamente",
		Metrics: metrics,
	})
}
