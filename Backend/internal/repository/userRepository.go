package repository

import (
	"errors"
	"github.com/SebaVCH/Pipeline-DevSecOps/Backend/internal/domain"
	"github.com/SebaVCH/Pipeline-DevSecOps/Backend/internal/infrastructure/database"
	"github.com/SebaVCH/Pipeline-DevSecOps/Backend/internal/utils"
	"gorm.io/gorm"
)

type UserRepository interface {
	Register(user domain.User) error
	GetAllUsers() ([]domain.User, error)
	GetByUsername(username string) (domain.User, error)
}

type userRepository struct {
	db *gorm.DB
}

func NewUserRepository() UserRepository {
	return &userRepository{
		db: database.DB,
	}
}

func (u userRepository) Register(user domain.User) error {
	var existingUser domain.User
	err := u.db.Where("username = ?", user.Username).First(&existingUser).Error
	if err == nil {
		return errors.New("Este usuario ya existe")
	}
	user.Password = utils.HashPassword(user.Password)
	user.Role = "user"
	err = u.db.Create(&user).Error
	if err != nil {
		return errors.New("Error al registrar el usuario")
	}

	return nil
}

func (u userRepository) GetAllUsers() ([]domain.User, error) {
	var users []domain.User
	err := u.db.Find(&users).Error
	if err != nil {
		return nil, err
	}
	return users, err
}

func (u userRepository) GetByUsername(username string) (domain.User, error) {
	var user domain.User
	err := u.db.Where("username = ?", username).First(&user).Error
	if err != nil {
		return domain.User{}, errors.New("Usuario no encontrado")
	}
	return user, nil
}
