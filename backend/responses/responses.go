package responses

import "backend/models"

// StandardResponse estructura de respuesta estándar
type StandardResponse struct {
	Status  int                    `json:"status"`  // Código de estado de la respuesta
	Message string                 `json:"message"` // Mensaje de la respuesta
	Data    map[string]interface{} `json:"data"`    // Datos adicionales de la respuesta
}

// ErrorResponse estructura de respuesta de error
type ErrorResponse struct {
	Status  int    `json:"status"`  // Código de error de la respuesta
	Message string `json:"message"` // Mensaje de error de la respuesta
	Error   string `json:"error"`   // Detalles específicos del error
}

type LoginResponse struct {
	Status  int            `json:"status"`  // Código de estado de la respuesta
	Message string         `json:"message"` // Mensaje de la respuesta
	User    models.Persona `json:"user"`    // Datos adicionales de la respuesta
}