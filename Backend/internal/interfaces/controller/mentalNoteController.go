package controller

import (
	"github.com/SebaVCH/Pipeline-DevSecOps/Backend/internal/usecase"
	"github.com/gin-gonic/gin"
)

type MentalNoteController struct {
	mentalNoteUseCase usecase.MentalNoteUseCase
}

func NewMentalNoteController(mentalNoteUseCase usecase.MentalNoteUseCase) *MentalNoteController {
	return &MentalNoteController{
		mentalNoteUseCase: mentalNoteUseCase,
	}
}

func (m *MentalNoteController) CreateMentalNote(c *gin.Context) {
	m.mentalNoteUseCase.CreateMentalNote(c)
}

func (m *MentalNoteController) DeleteMentalNote(c *gin.Context) {
	m.mentalNoteUseCase.DeleteMentalNote(c)
}

func (m *MentalNoteController) DeleteAllMentalNotes(c *gin.Context) {
	m.mentalNoteUseCase.DeleteAllMentalNotes(c)
}

func (m *MentalNoteController) GetMyMentalNotes(c *gin.Context) {
	m.mentalNoteUseCase.GetMyMentalNotes(c)
}

func (m *MentalNoteController) GetAllMentalNotes(c *gin.Context) {
	m.mentalNoteUseCase.GetAllMentalNotes(c)
}
