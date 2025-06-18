package usecase

import (
	"github.com/SebaVCH/Pipeline-DevSecOps/Backend/internal/domain"
	"github.com/SebaVCH/Pipeline-DevSecOps/Backend/internal/repository"
	"github.com/SebaVCH/Pipeline-DevSecOps/Backend/internal/utils"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	"net/http"
)

type UserUseCase interface {
	Register(c *gin.Context)
	Login(c *gin.Context)
	GetAllUsers(c *gin.Context)
}

type userUseCase struct {
	userRepo repository.UserRepository
}

func NewUserUseCase(userRepo repository.UserRepository) UserUseCase {
	return &userUseCase{
		userRepo: userRepo,
	}
}

func (u userUseCase) Register(c *gin.Context) {
	var user domain.User
	if err := c.ShouldBindJSON(&user); err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "Estructura de usuario inválida"})
		return
	}
	err := u.userRepo.Register(user)
	if err != nil {
		c.IndentedJSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}
	c.IndentedJSON(http.StatusOK, gin.H{"message": "Usuario registrado correctamente"})
}

func (u userUseCase) Login(c *gin.Context) {
	var credentials domain.User
	if err := c.ShouldBindJSON(&credentials); err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "Estructura de usuario inválida"})
		return
	}
	dbUser, err := u.userRepo.GetByUsername(credentials.Username)
	if err != nil {
		c.IndentedJSON(http.StatusUnauthorized, gin.H{"error": "Usuario o contraseña incorrectos"})
		return
	}
	err = bcrypt.CompareHashAndPassword([]byte(dbUser.Password), []byte(credentials.Password))
	if err != nil {
		c.IndentedJSON(http.StatusUnauthorized, gin.H{"error": "Usuario o contraseña incorrectos"})
		return
	}

	token, err := utils.GenerateToken(dbUser)
	if err != nil {
		c.IndentedJSON(http.StatusInternalServerError, gin.H{"error": "Error al generar el token"})
		return
	}

	c.IndentedJSON(http.StatusOK, gin.H{"message": token})
}

func (u userUseCase) GetAllUsers(c *gin.Context) {
	var users []domain.User
	users, err := u.userRepo.GetAllUsers()
	if err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "Error al obtener los usuarios"})
		return
	}
	c.IndentedJSON(http.StatusOK, gin.H{"message": users})
}