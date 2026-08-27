# MisGastos — Ingeniería de Software III

Aplicación web para registrar y consultar gastos personales.

El sistema está compuesto por:

* Frontend: React + Vite
* Backend: ASP.NET Core .NET 10
* Base de datos: MySQL 8
* Contenedores: Docker y Docker Compose
* Servidor web del frontend: nginx

## Requisitos

Para levantar el proyecto solo es necesario tener:

* Git
* Docker Desktop con el motor iniciado

No es necesario instalar .NET, Node.js ni MySQL localmente.

## Levantar el sistema desde cero

### 1. Clonar el repositorio

```bash
git clone https://github.com/conradovolpi/ingsoft3-tp01.git
cd ingsoft3-tp01
```

### 2. Crear el archivo de variables de entorno

En Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

En Linux/macOS:

```bash
cp .env.example .env
```

El archivo `.env` contiene las credenciales utilizadas localmente y no se versiona en Git.

### 3. Levantar el sistema completo

```bash
docker compose up -d
```

Docker Compose levanta:

* `db`: MySQL 8
* `backend`: API de MisGastos
* `frontend`: React servido mediante nginx

### 4. Verificar el estado

```bash
docker compose ps
```

La base de datos debe aparecer como `healthy` y los demás servicios como `Up`.

## Acceso a la aplicación

Frontend:

```text
http://localhost:3000
```

API:

```text
http://localhost:5171/api/expenses
```

MySQL se publica en el puerto local `3307`.

## Comunicación entre servicios

Dentro de la red creada por Docker Compose, el backend accede a MySQL mediante:

```text
db:3306
```

`db` es el nombre del servicio definido en `docker-compose.yml`.

El frontend realiza solicitudes a rutas relativas `/api/...`. nginx recibe esas solicitudes y las reenvía internamente al backend en:

```text
backend:8080
```

## Persistencia

Los datos de MySQL se almacenan en el volumen:

```text
mysql_data
```

Apagar y recrear los contenedores conserva los datos:

```bash
docker compose down
docker compose up -d
```

Para eliminar también los datos persistidos:

```bash
docker compose down -v
```

## Imágenes publicadas

Las imágenes de la aplicación están publicadas públicamente en GitHub Container Registry:

```text
ghcr.io/conradovolpi/misgastos-backend:v0.1.0
ghcr.io/conradovolpi/misgastos-frontend:v0.1.0
```

Para levantar el sistema utilizando las imágenes publicadas en lugar de construirlas localmente:

```bash
docker compose -f docker-compose.registry.yml up -d
```

## Detener el sistema

```bash
docker compose down
```

Para detenerlo y eliminar también el volumen de la base de datos:

```bash
docker compose down -v
```
