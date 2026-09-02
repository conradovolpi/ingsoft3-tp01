# Decisiones del proyecto

## TP1 — Git y flujo de trabajo

### Conflicto entre ramas

Durante el TP se trabajó mediante ramas y Pull Requests para evitar modificar directamente `main`.

En un Pull Request apareció un conflicto porque dos ramas habían modificado la misma parte de un archivo de forma diferente. Git pudo detectar el conflicto, pero no resolverlo automáticamente porque no podía decidir qué versión era la correcta.

Se resolvió manualmente revisando ambos cambios, eligiendo el contenido que debía conservarse y realizando un nuevo commit.

El conflicto podría haberse evitado manteniendo las ramas actualizadas con `main`, integrando cambios con mayor frecuencia o evitando modificar simultáneamente la misma parte del archivo.

También se configuró la protección de `main`, por lo que un `git push` directo es rechazado y los cambios deben ingresar mediante Pull Request.

Al finalizar se creó el tag `v1.0.0` y su Release correspondiente.

### Problemas e IA

Los principales problemas fueron el conflicto entre ramas y el rechazo del push directo a `main`. Ambos fueron utilizados para verificar que el flujo de trabajo y la protección funcionaban correctamente.

Se utilizó ChatGPT para interpretar comandos de Git, entender el conflicto y asistir en la documentación. Las sugerencias se verificaron ejecutando los comandos y comprobando los resultados en GitHub.


## TP2 — Contenedores

### Aplicación elegida

Se eligió **MisGastos** porque era una aplicación acotada y comprensible que contaba con los elementos necesarios para el TP: frontend React/Vite, backend .NET, base de datos MySQL y tests/funcionalidades que permitían verificar su funcionamiento.

### Dockerfiles multi-stage

Tanto backend como frontend utilizan Dockerfiles de dos etapas para separar construcción y ejecución.

En backend, la primera etapa utiliza el SDK de .NET para compilar y publicar; la segunda utiliza solamente el runtime para ejecutar la API.

En frontend, Node se utiliza para generar el build de React y luego nginx sirve los archivos estáticos generados.

Esto permite que las imágenes finales no incluyan herramientas de compilación innecesarias y sean más pequeñas.

### Comunicación entre servicios

Docker Compose crea una red interna y los servicios se encuentran mediante sus nombres.

El backend se conecta a MySQL mediante `db:3306` y no mediante `localhost`, porque dentro de un contenedor `localhost` representa al propio contenedor.

El frontend utiliza nginx para reenviar las solicitudes `/api` hacia `backend:8080`.

### Healthcheck y depends_on

`depends_on` expresa que el backend depende de la base de datos y controla el orden de arranque.

El `healthcheck` verifica que MySQL esté realmente listo para aceptar conexiones. Por eso se utiliza `condition: service_healthy`: no alcanza con que el contenedor esté iniciado, la base debe estar operativa.

### Secretos y persistencia

Las variables reales se almacenan localmente en `.env`, que está excluido mediante `.gitignore`.

El repositorio contiene `.env.example` para indicar qué variables necesita configurar quien clone el proyecto, sin publicar valores privados.

Los datos de MySQL se guardan en el volumen `mysql_data`, por lo que no dependen de la vida del contenedor.

Las imágenes del backend y frontend fueron publicadas en GHCR. `docker-compose.registry.yml` utiliza esas imágenes mediante `image:` en lugar de construirlas localmente.

### Problemas e IA

Durante el TP hubo problemas con la conexión a MySQL usando `localhost`, la configuración del proxy de nginx, variables de entorno y el healthcheck. Se corrigieron verificando la comunicación entre frontend, backend y base de datos.

Se utilizó ChatGPT para revisar Dockerfiles, Docker Compose, nginx e interpretar errores. Todo se verificó levantando el sistema y probando su funcionamiento.


## TP3 — Planificación y trazabilidad

### Sprint

Se eligió un sprint de 2 semanas porque permite tener ciclos cortos de trabajo y feedback sin fragmentar demasiado las tareas.

### Límite WIP

Se configuró un WIP de 2 elementos en `In Progress`.

Al trabajar una sola persona, este límite permite concentrarse en terminar el trabajo iniciado y, al mismo tiempo, disponer de un segundo lugar si una tarea queda bloqueada.

### Historia mal escrita

La historia "Como desarrollador quiero crear la tabla usuarios para guardar los datos" estaba mal planteada porque describe una solución técnica y no valor para un usuario.

Una mejor versión sería:

"Como usuario quiero registrar mis datos para poder identificarme y gestionar mis gastos."

Crear la tabla sería una tarea técnica necesaria para implementar esa historia.

### Trazabilidad

Se relacionaron épica, historia, tarea, Pull Request y commit.

Se verificó usando `Closes #9`: al mergear el Pull Request a `main`, GitHub cerró automáticamente la tarea y la movió a `Done`.

### Problemas e IA

Fue necesario instalar GitHub CLI, agregar permisos para Projects, incorporar issues al Project y sincronizar una rama `main` que había divergido de `origin/main`.

Se utilizó ChatGPT para interpretar la guía, comandos de Git/GitHub CLI y resolver estos inconvenientes. Los resultados fueron comprobados directamente en GitHub.


## TP4 — Integración Continua

### Jobs y ejecución en paralelo

Se creó `.github/workflows/ci.yml` con dos jobs: `build-backend` y `build-frontend`.

Se separaron porque ambos componentes pueden construirse independientemente. Al no existir dependencia entre ellos, GitHub Actions puede ejecutarlos en paralelo y reducir el tiempo total del pipeline.

### Dockerfiles

Cada job construye utilizando los mismos Dockerfiles creados en TP2.

Esto evita tener un proceso de build distinto para CI y permite comprobar que las imágenes reales del proyecto siguen pudiendo construirse correctamente.

### Cache

Se configuró cache de capas Docker con scopes separados para backend y frontend.

El cache permite reutilizar capas que no cambiaron y acelerar ejecuciones posteriores.

Si el cache desaparece, el pipeline sigue funcionando: Docker simplemente debe reconstruir las capas desde cero y tarda más.

### Required checks

Se configuraron checks requeridos sobre `main`.

Se comprobó con un Pull Request cuyo pipeline quedó en rojo: GitHub bloqueó el merge. Luego se corrigió el problema, se realizó un nuevo commit y el workflow volvió a ejecutarse.

Cuando los jobs quedaron en verde, el merge volvió a estar habilitado.

También se agregó al README un badge que informa el estado del workflow.

### Problemas e IA

Los principales puntos fueron configurar correctamente el workflow, el cache y los required status checks, además de comprobar el caso rojo → corrección → verde.

Se utilizó ChatGPT para revisar el workflow, interpretar errores y comprender la configuración de GitHub Actions. Todo se verificó mediante ejecuciones reales del pipeline.