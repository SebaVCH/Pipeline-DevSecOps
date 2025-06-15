package routes

import (
	"github.com/SebaVCH/Pipeline-DevSecOps/Backend/internal/interfaces/controller"
	"github.com/SebaVCH/Pipeline-DevSecOps/Backend/internal/interfaces/middleware"
	"github.com/SebaVCH/Pipeline-DevSecOps/Backend/internal/repository"
	"github.com/SebaVCH/Pipeline-DevSecOps/Backend/internal/usecase"
	"github.com/gin-gonic/gin"
)

func SetupUserRouter(r *gin.Engine) {
	userRepo := repository.NewUserRepository()
	userUseCase := usecase.NewUserUseCase(userRepo)
	userController := controller.NewUserController(userUseCase)

	protected := r.Group("/")
	protected.POST("/register", userController.Register)
	protected.POST("/login", userController.Login)
	protected.Use(middleware.AuthMiddleware())
	protected.GET("/users", middleware.RoleMiddleware("admin"), userController.GetAllUsers)
}
