# Pipeline DevSecOps

# Pipeline DevSecOps

## Indicaciones para abrir el proyecto

Este proyecto cuenta con un backend en Go y un frontend en React (TypeScript), estructurado para trabajar con Docker y CI/CD a través de GitHub Actions. A continuación se indican los pasos para ejecutarlo localmente.

---

### 1. Iniciar el backend

Ubícate en la siguiente ruta:

/backend/cmd/

Ejecuta el siguiente comando:
go run main.go



2. Iniciar el frontend
Ubícate en la siguiente ruta:

/frontend/src/

Ejecuta:
npm run dev



3. Visualizar la aplicación
Una vez iniciados ambos servicios, puedes acceder a la aplicación desde tu navegador en:


http://localhost:5173/login



4. Rutas disponibles
   
/login – Inicio de sesión de usuario.

/register – Registro de nuevo usuario.

/admin – Vista exclusiva para el administrador.

/dashboard – Panel principal del usuario.




Tecnologías utilizadas
Backend: Go, Gin-Gonic, GORM, JWT, SQLite

Frontend: React, TypeScript, Vite

CI/CD: GitHub Actions

Análisis de seguridad: SonarCloud

Contenedores: Docker



Autores:

Sebastián Andrés Vega Chepillo

Maximiliano Alfredo Pasten Nayem
