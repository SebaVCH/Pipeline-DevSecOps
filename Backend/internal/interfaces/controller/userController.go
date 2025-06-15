package controller

import (
	"github.com/SebaVCH/Pipeline-DevSecOps/Backend/internal/usecase"
	"github.com/gin-gonic/gin"
)

type UserController struct {
	userUseCase usecase.UserUseCase
}

func NewUserController(userUseCase usecase.UserUseCase) *UserController {
	return &UserController{
		userUseCase: userUseCase,
	}
}

func (u *UserController) Register(c *gin.Context) {
	u.userUseCase.Register(c)
}

func (u *UserController) Login(c *gin.Context) {
	u.userUseCase.Login(c)
}

func (u *UserController) GetAllUsers(c *gin.Context) {
	u.userUseCase.GetAllUsers(c)
}
