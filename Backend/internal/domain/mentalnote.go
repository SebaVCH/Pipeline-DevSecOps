package domain

type MentalNote struct {
	ID          int    `gorm:"primaryKey"`
	Title       string `gorm:"not null"`
	Description string `gorm:"not null"`
	AuthorID    int    `gorm:"not null"`
	Author      User   `gorm:"foreignKey:AuthorID;references:ID;not null"`
}
