package database

import (
	"github.com/SebaVCH/Pipeline-DevSecOps/Backend/internal/domain"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var DB *gorm.DB

func StartDB() error {
	var err error

	DB, err = gorm.Open(sqlite.Open("mentalNoteDB.db"))

	if err != nil {
		return err
	}
	if err := DB.AutoMigrate(
		&domain.User{}, &domain.MentalNote{},
	); err != nil {
		return err
	}
	return nil
}
