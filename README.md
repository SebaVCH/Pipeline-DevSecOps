# Pipeline DevSecOps

## Indicaciones para abrir el proyecto

Este proyecto cuenta con un backend en Go y un frontend en React (TypeScript), estructurado para trabajar con Docker y CI/CD a través de GitHub Actions. A continuación se indican los pasos para ejecutarlo localmente.

---

### 1. Agregar él .env al trabajo
Asumiendo que este laboratorio representa buenas prácticas, se ignoró el archivo ".env" a la hora de realizar commits/push dentro del ".gitignore", por lo que luego de descargar el entorno con el que se está trabajando, se debe generar un archivo .env dentro de la carpeta Backend con los siguientes datos:
```
JWT_SECRET=W8at!yz.=dr*!Rm}3!D71$mN(;@Mag
FRONTEND_URL=http://localhost:5173
```

### 2. Iniciar el proyecto
Para ejecutar el proyecto ejecutar el siguiente comando:
```
docker-compose up --build
```

### 3. Visualizar la aplicación
Una vez iniciados ambos servicios, puedes acceder a la aplicación desde tu navegador en:

http://localhost:5173

### 3.1 Probar la aplicación con las siguientes credenciales:
>[!WARNING] 
> Considerar que en un entorno real no se expondrían las credenciales de los usuarios

|Usuario|Contraseña|Role |
|-------|----------|-----|
|Juan   |123       |user |
|Pedro  |123       |admin|
|Diego  |123       |user |

### 4. Rutas disponibles

/ - Menú de inicio
   
/login – Inicio de sesión de usuario.

/register – Registro de nuevo usuario.

/admin – Vista exclusiva para el administrador.

/dashboard – Panel principal del usuario.


### Tecnologías utilizadas
Backend: Go, Gin-Gonic, GORM, JWT, SQLite

Frontend: React, TypeScript, Vite

CI/CD: GitHub Actions

Análisis de seguridad: SonarCloud

Contenedores: Docker



Autores:

Sebastián Andrés Vega Chepillo

Maximiliano Alfredo Pasten Nayem
