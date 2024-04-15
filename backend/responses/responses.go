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

type CareerResponse struct {
	Status  int              `json:"status"`  // Código de estado de la respuesta
	Message string           `json:"message"` // Mensaje de la respuesta
	Careers []models.Carrera `json:"careers"` // Datos adicionales de la respuesta
}

type ZodiacalSignResponse struct {
	Status  int            `json:"status"`       // Código de estado de la respuesta
	Message string         `json:"message"`      // Mensaje de la respuesta
	Signs   []models.Signo `json:"zodiacalSign"` // Datos adicionales de la respuesta
}

type TeamsResponse struct {
	Status  int             `json:"status"`  // Código de estado de la respuesta
	Message string          `json:"message"` // Mensaje de la respuesta
	Teams   []models.Equipo `json:"teams"`   // Datos adicionales de la respuesta
}

type PlacesResponse struct {
	Status  int            `json:"status"`  // Código de estado de la respuesta
	Message string         `json:"message"` // Mensaje de la respuesta
	Places  []models.Lugar `json:"places"`  // Datos adicionales de la respuesta
}

type SongsResponse struct {
	Status  int              `json:"status"`  // Código de estado de la respuesta
	Message string           `json:"message"` // Mensaje de la respuesta
	Songs   []models.Cancion `json:"songs"`   // Datos adicionales de la respuesta
}

type UsersResponse struct {
	Status int              `json:"status"` // Código de estado de la respuesta
	Users  []models.Persona `json:"users"`  // Datos adicionales de la respuesta
}

type MetricsResponse struct {
	Status  int              `json:"status"`  // Código de estado de la respuesta
	Message string           `json:"message"` // Mensaje de la respuesta
	Metrics map[string]int64 `json:"metrics"` // Datos adicionales de la respuesta
}
