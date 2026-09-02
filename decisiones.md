# Decisiones del proyecto

## TP2 — Contenedores

### Aplicación elegida

Para el trabajo práctico se eligió **MisGastos**, una aplicación web para registrar y consultar gastos personales.

La aplicación cumple con los requisitos del TP porque cuenta con:

* Backend desarrollado con ASP.NET Core .NET 10.
* Frontend desarrollado con React y Vite.
* Base de datos MySQL 8.
* Operaciones para crear, consultar y administrar gastos.
* Proyecto de tests para el backend y herramientas de testing en el frontend.

Se eligió esta aplicación porque tiene un tamaño acotado y permite comprender y modificar el código durante los próximos trabajos prácticos. Además, contiene las tres partes necesarias para trabajar durante el semestre: frontend, backend y persistencia de datos.

Antes de contenerizarla se verificó que la aplicación compilara y funcionara correctamente.

### Dockerfile del backend

Se utilizó un Dockerfile multi-stage.

La primera etapa utiliza:

```text
mcr.microsoft.com/dotnet/sdk:10.0
```

Esta imagen contiene el SDK necesario para restaurar dependencias y compilar/publicar la aplicación.

La segunda etapa utiliza:

```text
mcr.microsoft.com/dotnet/aspnet:10.0
```

Esta imagen contiene únicamente el runtime necesario para ejecutar la API.

Se eligió esta estructura para evitar incluir el SDK completo en la imagen final, reduciendo el tamaño y la superficie de ataque.

La imagen del SDK ocupa aproximadamente 1.25 GB, mientras que la imagen final del backend ocupa aproximadamente 350 MB.

También se agregó un `.dockerignore` para excluir directorios como `bin`, `obj` y resultados de tests.

### Dockerfile del frontend

También se utilizó un Dockerfile multi-stage.

La primera etapa utiliza:

```text
node:22-alpine
```

Node se utiliza únicamente para instalar las dependencias y ejecutar el build de React/Vite.

La segunda etapa utiliza:

```text
nginx:alpine
```

nginx sirve los archivos estáticos generados en `dist`.

La imagen final del frontend ocupa aproximadamente 93.7 MB.

Se utilizó `npm ci` en lugar de `npm install` dentro del Dockerfile para instalar exactamente las versiones definidas en `package-lock.json`.

También se creó un `.dockerignore` para evitar copiar `node_modules`, `dist` y otros archivos innecesarios al contexto de construcción.

### Comunicación entre frontend y backend

El frontend utiliza rutas relativas:

```text
/api/...
```

En producción, nginx recibe estas solicitudes y las reenvía al servicio del backend:

```text
backend:8080
```

Se eligió este mecanismo para evitar escribir una URL absoluta del backend en el código del frontend y para permitir que los servicios se comuniquen mediante la red interna de Docker Compose.

### Base de datos y persistencia

Se utiliza MySQL 8 como servicio `db`.

El backend accede a la base de datos mediante:

```text
Server=db;Port=3306
```

`db` no es una dirección IP, sino el nombre del servicio definido en Docker Compose. Docker proporciona resolución DNS interna entre los servicios.

La información de MySQL se guarda en un volumen nombrado:

```text
mysql_data
```

Se verificó que:

* `docker compose down` elimina los contenedores pero conserva los datos.
* `docker compose up -d` vuelve a levantar el sistema con los datos existentes.
* `docker compose down -v` elimina también el volumen y, por lo tanto, los datos almacenados.

### Healthcheck y orden de arranque

MySQL cuenta con un `healthcheck` basado en `mysqladmin ping`.

El backend utiliza:

```text
depends_on:
  db:
    condition: service_healthy
```

Esto permite que el backend espere a que MySQL esté realmente disponible para recibir conexiones.

Se decidió utilizar esta combinación porque `depends_on` por sí solo solamente asegura el orden de inicio de los contenedores, pero no garantiza que la base de datos esté lista.

### Manejo de secretos

Las contraseñas de MySQL no se escriben directamente en `docker-compose.yml`.

Se utilizan variables provenientes del archivo:

```text
.env
```

Este archivo está incluido en `.gitignore` y no se versiona.

En el repositorio se incluye:

```text
.env.example
```

para indicar qué variables necesita configurar una persona que clone el proyecto.

### Registry

Las imágenes del backend y frontend fueron publicadas en GitHub Container Registry con una versión semántica:

```text
ghcr.io/conradovolpi/misgastos-backend:v0.1.0
ghcr.io/conradovolpi/misgastos-frontend:v0.1.0
```

Ambas imágenes fueron configuradas como públicas.

Se verificó la visibilidad pública cerrando la sesión de GHCR con `docker logout` y realizando posteriormente un `docker pull` de ambas imágenes sin credenciales.

También se creó `docker-compose.registry.yml`, que utiliza las imágenes publicadas mediante `image:` en lugar de construirlas mediante `build:`.

Se verificó que el sistema completo funcione utilizando este archivo.

### Problemas encontrados y resolución

Durante el desarrollo se encontraron los siguientes puntos:

* La aplicación inicialmente utilizaba `localhost` para acceder a MySQL. Dentro de Docker, `localhost` representa al propio contenedor, por lo que en Compose se cambió la conexión a `db:3306`.
* Las contraseñas estaban inicialmente escritas en `docker-compose.yml`. Se reemplazaron por variables provenientes de `.env`.
* Faltaban archivos `.dockerignore` para evitar copiar artefactos generados localmente.
* El frontend necesitaba configurar nginx como proxy para reenviar las solicitudes `/api` al backend.
* La aplicación estaba inicialmente fuera del repositorio utilizado en el TP1. Se incorporó al mismo repositorio del semestre y se trabajó sobre una rama específica para el TP2.

### Uso de Inteligencia Artificial

Se utilizó ChatGPT como herramienta de asistencia durante el desarrollo del TP2.

La asistencia se utilizó principalmente para:

* Revisar la estructura de los Dockerfiles.
* Configurar Docker Compose.
* Configurar nginx como proxy.
* Interpretar errores y salidas de Docker.
* Preparar la documentación del trabajo práctico.

Las propuestas realizadas con asistencia de IA fueron verificadas ejecutando los comandos y comprobando directamente el funcionamiento del sistema.

Entre las verificaciones realizadas se encuentran:

* Construcción exitosa de las imágenes de backend y frontend.
* Ejecución completa del sistema con `docker compose up -d`.
* Comunicación frontend → backend → MySQL.
* Prueba de persistencia del volumen.
* Eliminación de datos mediante `docker compose down -v`.
* Publicación de ambas imágenes en GHCR.
* Descarga de las imágenes públicas sin autenticación.
* Ejecución del sistema mediante `docker-compose.registry.yml`.

De esta forma, las configuraciones propuestas no se utilizaron únicamente por haber sido generadas por IA, sino que fueron comprobadas experimentalmente en el entorno local.

# TP3 - Planificación y trazabilidad

## Duración del sprint

Se configuró un sprint de 2 semanas. Elegí esta duración porque permite trabajar con una iteración suficientemente corta como para revisar el avance con frecuencia, pero a la vez brinda tiempo suficiente para completar las tareas planificadas sin fragmentar demasiado el trabajo.

## Límite de trabajo en progreso

Se configuró un límite WIP de 2 elementos en la columna In Progress. Como el proyecto es realizado por una sola persona, se utilizó la regla de cantidad de integrantes más uno: 1 + 1 = 2. El segundo lugar permite continuar con otra tarea si la primera queda temporalmente bloqueada, sin acumular demasiado trabajo sin terminar.

## Diagnóstico de la historia mal escrita

La historia "Como desarrollador quiero crear la tabla usuarios para guardar los datos" está mal planteada porque describe una implementación técnica y no un valor observable para un usuario. Crear una tabla es una tarea técnica, no una historia de usuario.

Una posible reescritura sería: "Como usuario quiero registrar mis datos en la aplicación para poder identificarme y gestionar mis gastos".

## Problemas encontrados y soluciones

Durante el desarrollo del TP se encontraron los siguientes problemas:

- GitHub CLI (`gh`) no estaba instalada. Se instaló mediante `winget` y se verificó posteriormente con `gh --version`.
- La autenticación de GitHub CLI no tenía inicialmente permiso para administrar Projects. Se agregó el scope `project` mediante `gh auth refresh -s project`.
- El Project fue creado mediante GitHub CLI, por lo que los issues no se agregaron automáticamente. Se incorporaron manualmente utilizando `gh project item-add`.
- La rama local `main` había divergido de `origin/main`. Antes de modificarla se creó una rama de respaldo y luego se sincronizó `main` con el estado remoto mediante `git reset --hard origin/main`.
- Se verificó la trazabilidad configurando un Pull Request con `Closes #9`. Al mergearse a `main`, GitHub cerró automáticamente la tarea #9 y el Project la movió a Done.

## Uso de Inteligencia Artificial

Se utilizó ChatGPT como herramienta de asistencia para interpretar la guía del trabajo práctico, orientar el uso de Git y GitHub CLI, resolver los inconvenientes encontrados y asistir en la redacción de este documento.

Los comandos y configuraciones sugeridos fueron verificados ejecutándolos sobre el repositorio y comprobando sus resultados directamente en GitHub. También se verificó la jerarquía de issues, el estado del tablero y el cierre automático de la tarea mediante el Pull Request antes de considerar completada cada etapa.

# TP4 - Integración Continua: Pipelines as Code

## Estructura del pipeline

Se configuró un workflow de Integración Continua mediante GitHub Actions en el archivo `.github/workflows/ci.yml`.

El workflow se ejecuta automáticamente en dos situaciones:

- Cuando se abre o actualiza un Pull Request dirigido a `main`.
- Cuando se realiza un push a `main`.

El pipeline se dividió en dos jobs:

- `build-backend`
- `build-frontend`

Cada job construye una imagen Docker utilizando el Dockerfile correspondiente creado en el TP2.

Los jobs se ejecutan en paralelo porque el backend y el frontend pueden construirse de manera independiente. No existe una dependencia entre ambos builds, por lo que ejecutarlos en paralelo evita agregar una espera innecesaria al pipeline.

Cada job se ejecuta en un runner independiente de GitHub Actions, por lo que no comparten filesystem ni los archivos generados durante la ejecución.

## Uso de los Dockerfiles del proyecto

Se decidió que el pipeline construya la aplicación utilizando los mismos Dockerfiles desarrollados en el TP2, en lugar de ejecutar directamente comandos como `dotnet publish` o `npm run build` desde el workflow.

Esta decisión evita mantener dos definiciones distintas del proceso de construcción.

De esta manera, el mismo procedimiento utilizado para generar las imágenes que posteriormente pueden ejecutarse o desplegarse es también el que verifica GitHub Actions.

Esto reduce el riesgo de que el pipeline valide una forma de compilación diferente de la utilizada realmente por la aplicación.

## Cache de capas

Se configuró cache de capas de Docker mediante GitHub Actions.

Para el backend se utilizó:

```text
cache-from: type=gha,scope=backend
cache-to: type=gha,mode=max,scope=backend