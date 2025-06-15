package repository

import (
	"errors"
	"github.com/SebaVCH/Pipeline-DevSecOps/Backend/internal/domain"
	"github.com/SebaVCH/Pipeline-DevSecOps/Backend/internal/infrastructure/database"
	"gorm.io/gorm"
)

type MentalNoteRepository interface {
	CreateMentalNote(note domain.MentalNote, authorID int) error
	DeleteMentalNote(noteID int) error
	DeleteAllMentalNotes(userID int) error
	GetAllMentalNotes() ([]domain.MentalNote, error)
	GetMyMentalNotes(userID int) ([]domain.MentalNote, error)
}

type mentalNoteRepository struct {
	db *gorm.DB
}

func NewMentalNoteRepository() MentalNoteRepository {
	return &mentalNoteRepository{
		db: database.DB,
	}
}
func (m *mentalNoteRepository) CreateMentalNote(note domain.MentalNote, authorID int) error {
	m.db.Create(&note)
	note.AuthorID = authorID
	if err := m.db.Save(&note).Error; err != nil {
		return errors.New("error al crear la nota mental")
	}
	return nil
}

func (m *mentalNoteRepository) DeleteMentalNote(noteID int) error {
	if err := m.db.Delete(&domain.MentalNote{}, noteID).Error; err != nil {
		return errors.New("error al eliminar la nota mental")
	}
	return nil
}

func (m *mentalNoteRepository) DeleteAllMentalNotes(userID int) error {
	if err := m.db.Where("author_id = ?", userID).Delete(&domain.MentalNote{}).Error; err != nil {
		return errors.New("error al eliminar todas las notas mentales del usuario")
	}
	return nil
}

func (m *mentalNoteRepository) GetAllMentalNotes() ([]domain.MentalNote, error) {
	var notes []domain.MentalNote
	if err := m.db.Preload("Author").Find(&notes).Error; err != nil {
		return nil, errors.New("error al obtener todas las notas mentales")
	}
	return notes, nil
}

func (m *mentalNoteRepository) GetMyMentalNotes(userID int) ([]domain.MentalNote, error) {
	var notes []domain.MentalNote
	if err := m.db.Preload("Author").Where("author_id = ?", userID).Find(&notes).Error; err != nil {
		return nil, errors.New("error al obtener las notas mentales del usuario")
	}
	return notes, nil
}
