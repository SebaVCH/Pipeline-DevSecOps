package usecase

import (
	"github.com/SebaVCH/Pipeline-DevSecOps/Backend/internal/domain"
	"github.com/SebaVCH/Pipeline-DevSecOps/Backend/internal/repository"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"net/http"
	"strconv"
)

type MentalNoteUseCase interface {
	CreateMentalNote(c *gin.Context)
	DeleteMentalNote(c *gin.Context)
	DeleteAllMentalNotes(c *gin.Context)
	GetMyMentalNotes(c *gin.Context)
	GetAllMentalNotes(c *gin.Context)
}

type mentalNoteUseCase struct {
	mentalNoteRepo repository.MentalNoteRepository
}

func NewMentalNoteUseCase(mentalNoteRepo repository.MentalNoteRepository) MentalNoteUseCase {
	return &mentalNoteUseCase{
		mentalNoteRepo: mentalNoteRepo,
	}
}

func (m mentalNoteUseCase) CreateMentalNote(c *gin.Context) {
	var note domain.MentalNote
	if err := c.ShouldBindJSON(&note); err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "Estructura de nota mental inválida"})
		return
	}

	claims, exists := c.Get("user")
	if !exists {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "No autorizado"})
		return
	}

	userClaims, ok := claims.(jwt.MapClaims)
	if !ok {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Token inválido"})
		return
	}

	userID, ok := userClaims["user_id"].(float64)
	if !ok {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "ID Invalido"})
		return
	}

	err := m.mentalNoteRepo.CreateMentalNote(note, int(userID))
	if err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "Error al crear la nota mental"})
		return
	}
	c.IndentedJSON(http.StatusOK, gin.H{"message": "Nota mental creada correctamente"})
}

func (m mentalNoteUseCase) DeleteMentalNote(c *gin.Context) {
	noteID := c.Param("id")
	if noteID == "" {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "ID de nota mental inválido"})
		return
	}
	noteIDnum, _ := strconv.Atoi(noteID)
	err := m.mentalNoteRepo.DeleteMentalNote(noteIDnum)
	if err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "Error al borrar todas tus notas mentales"})
		return
	}
	c.IndentedJSON(http.StatusOK, gin.H{"message": "Nota mental eliminada correctamente"})
}

func (m mentalNoteUseCase) DeleteAllMentalNotes(c *gin.Context) {
	claims, exists := c.Get("user")
	if !exists {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "No autorizado"})
		return
	}

	userClaims, ok := claims.(jwt.MapClaims)
	if !ok {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Token inválido"})
		return
	}

	userID, ok := userClaims["user_id"].(float64)
	if !ok {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "ID Invalido"})
		return
	}

	err := m.mentalNoteRepo.DeleteAllMentalNotes(int(userID))
	if err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "Error al borrar todas tus notas mentales"})
		return
	}
	c.IndentedJSON(http.StatusOK, gin.H{"message": "Notas mentales eliminada correctamente"})
}

func (m mentalNoteUseCase) GetMyMentalNotes(c *gin.Context) {
	claims, exists := c.Get("user")
	if !exists {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "No autorizado"})
		return
	}

	userClaims, ok := claims.(jwt.MapClaims)
	if !ok {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Token inválido"})
		return
	}

	userID, ok := userClaims["user_id"].(float64)
	if !ok {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "ID Invalido"})
		return
	}
	var notes []domain.MentalNote
	notes, err := m.mentalNoteRepo.GetMyMentalNotes(int(userID))
	if err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "Error al obtener las notas mentales"})
		return
	}
	c.IndentedJSON(http.StatusOK, notes)
}

func (m mentalNoteUseCase) GetAllMentalNotes(c *gin.Context) {
	var notes []domain.MentalNote
	notes, err := m.mentalNoteRepo.GetAllMentalNotes()
	if err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "Error al obtener las notas mentales"})
		return
	}
	c.IndentedJSON(http.StatusOK, notes)
}
