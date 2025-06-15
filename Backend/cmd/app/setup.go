package app

import (
	"github.com/SebaVCH/Pipeline-DevSecOps/Backend/internal/config"
	"github.com/SebaVCH/Pipeline-DevSecOps/Backend/internal/infrastructure/database"
	"github.com/SebaVCH/Pipeline-DevSecOps/Backend/internal/interfaces/routes"
)

func StartBackend() error {

	if err := config.LoadEnv(); err != nil {
		return err
	}

	if err := database.StartDB(); err != nil {
		return err
	}

	if err := routes.SetupRouter().Run(":8080"); err != nil {
		return err
	}

	return nil
}
