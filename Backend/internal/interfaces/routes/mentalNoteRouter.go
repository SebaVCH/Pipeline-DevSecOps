package routes

import (
	"github.com/SebaVCH/Pipeline-DevSecOps/Backend/internal/interfaces/controller"
	"github.com/SebaVCH/Pipeline-DevSecOps/Backend/internal/interfaces/middleware"
	"github.com/SebaVCH/Pipeline-DevSecOps/Backend/internal/repository"
	"github.com/SebaVCH/Pipeline-DevSecOps/Backend/internal/usecase"
	"github.com/gin-gonic/gin"
)

func SetupMentalNoteRouter(r *gin.Engine) {
	mentalNoteRepo := repository.NewMentalNoteRepository()
	mentalNoteUseCase := usecase.NewMentalNoteUseCase(mentalNoteRepo)
	mentalNoteController := controller.NewMentalNoteController(mentalNoteUseCase)

	protected := r.Group("/")
	protected.Use(middleware.AuthMiddleware())
	protected.POST("/mental-notes", mentalNoteController.CreateMentalNote)
	protected.GET("/mental-notes", mentalNoteController.GetMyMentalNotes)
	protected.DELETE("/mental-notes/:id", mentalNoteController.DeleteMentalNote)
	protected.DELETE("/mental-notes", mentalNoteController.DeleteAllMentalNotes)
	protected.GET("/admin/mental-notes", middleware.RoleMiddleware("admin"), mentalNoteController.GetAllMentalNotes)
}
