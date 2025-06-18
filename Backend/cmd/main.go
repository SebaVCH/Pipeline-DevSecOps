package main

import "github.com/SebaVCH/Pipeline-DevSecOps/Backend/cmd/app"

func main() {

	if err := app.StartBackend(); err != nil {
		panic(err)
	}

}