package routes

import (
	"github.com/SebaVCH/Pipeline-DevSecOps/Backend/internal/interfaces/middleware"
	"github.com/gin-gonic/gin"
)

func SetupRouter() *gin.Engine {
	r := gin.Default()
	r.Use(middleware.CORSMiddleware())

	SetupUserRouter(r)
	SetupMentalNoteRouter(r)
	return r
}
