# Product Management App

Prueba técnica: aplicación de gestión de productos (CRUD completo de productos con categorías).

## Stack

- **Backend:** .NET 8 (API REST, SQL Server, Swagger, CORS)
- **Frontend:** React + TypeScript + Vite  
  - PrimeReact (tabla, formularios, diálogos)
  - Redux Toolkit (gestión global de categorías)
  - Formik + Yup (gestión de formularios y validación)
- **Base de datos:** SQL Server (instancia local o Docker)

## Estructura del repositorio

- `frontend/` — aplicación React (UI de gestión de productos)  
- `backend/` — API .NET 8 (CRUD de productos y categorías, Swagger, validación)

---

## Requisitos previos

Para levantar el proyecto necesitas:

- [.NET SDK 8](https://dotnet.microsoft.com/)  
- [Node.js](https://nodejs.org/) (recomendado ≥ 18 LTS)  
- npm o pnpm  
- SQL Server Express:
  - Puede ser una instancia local de SQL Server **o**
  - Un contenedor Docker con SQL Server

Ejemplo rápido con Docker:

```bash
docker run -e "ACCEPT_EULA=Y" \
  -e "SA_PASSWORD=Passw0rd!" \
  -p 1433:1433 \
  -d mcr.microsoft.com/mssql/server:2022-latest