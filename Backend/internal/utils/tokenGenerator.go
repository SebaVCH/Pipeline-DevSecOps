package utils

import (
	"github.com/SebaVCH/Pipeline-DevSecOps/Backend/internal/config"
	"github.com/SebaVCH/Pipeline-DevSecOps/Backend/internal/domain"
	"github.com/golang-jwt/jwt/v5"
	"time"
)

func GenerateToken(user domain.User) (string, error) {

	claims := jwt.MapClaims{
		"user_id":   user.ID,
		"user_role": user.Role,
		"exp":       time.Now().Add(time.Hour * 24).Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	jwtSecret := config.JwtSecret

	return token.SignedString(jwtSecret)
}
