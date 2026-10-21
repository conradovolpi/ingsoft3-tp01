# Decisiones del proyecto

## Enlaces de entrega P2 — TP6 y TP7

- Aplicación: **MisGastos**.
- QA (frontend): https://misgastos-front-qa-6v5o.onrender.com
- PROD (frontend): https://misgastos-front-prod-i8sb.onrender.com
- API QA: https://misgastos-api-qa-volpi.onrender.com
- API PROD: https://misgastos-api-prod-fznx.onrender.com

### TP6

- [Release v6.0.0](https://github.com/conradovolpi/ingsoft3-tp01/releases/tag/v6.0.0).
- [Pipeline aprobado hasta PROD](https://github.com/conradovolpi/ingsoft3-tp01/actions/runs/39270442867).
- [Pase a PROD rechazado con motivo, intento 2](https://github.com/conradovolpi/ingsoft3-tp01/actions/runs/39468994099/attempts/2).
- [Notas de release y rollback](https://github.com/conradovolpi/ingsoft3-tp01/blob/main/release-v6.0.0.md).
- [Workflow del cierre de TP6](https://github.com/conradovolpi/ingsoft3-tp01/blob/v6.0.0/.github/workflows/ci.yml).

### TP7

- Paquetes públicos: [backend](https://github.com/users/conradovolpi/packages/container/package/ingsoft3-tp01-backend) y [frontend](https://github.com/users/conradovolpi/packages/container/package/ingsoft3-tp01-frontend).
- Etiqueta de recuperación verificada en ambos entornos: `sha-700f7a93d3ae4fa6cbf95dfdf1feb8c1e3ac2080`.
- Rotura: [commit 31e38f5](https://github.com/conradovolpi/ingsoft3-tp01/commit/31e38f58cf638bc4375eb4e52af4d9a1106250ba) y [corrida roja](https://github.com/conradovolpi/ingsoft3-tp01/actions/runs/39295215591).
- Reportes de esa corrida: [integración verde](https://github.com/conradovolpi/ingsoft3-tp01/actions/runs/39295215591/artifacts/12207298029) y [e2e roja](https://github.com/conradovolpi/ingsoft3-tp01/actions/runs/39295215591/artifacts/12207258214). PROD quedó omitido.
- [Recuperación completa en verde hasta PROD](https://github.com/conradovolpi/ingsoft3-tp01/actions/runs/39297633337).
- QA: [API](https://misgastos-api-qa-volpi.onrender.com) y [frontend](https://misgastos-front-qa-6v5o.onrender.com).
- PROD: [API](https://misgastos-api-prod-fznx.onrender.com) y [frontend](https://misgastos-front-prod-i8sb.onrender.com).
- [Release v7.0.0](https://github.com/conradovolpi/ingsoft3-tp01/releases/tag/v7.0.0).
- [Pipeline del cierre de v7.0.0](https://github.com/conradovolpi/ingsoft3-tp01/actions/runs/39302852026).

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

---

# TP5 — Testing, coverage y quality gate

## Tests realizados

### Backend
Se implementaron 8 métodos de test sobre distintas reglas de `ExpenseService`, incluyendo:

- validación de mes y año,
- validación de monto y descripción,
- cálculo del total mensual,
- agrupación por categoría,
- y guardado de un gasto mediante mock.

Se utilizaron `[Theory]`, `[InlineData]`, casos de error y `Mock<IExpenseRepository>`.

### Frontend
Se agregaron unit tests sin DOM sobre `expenseService` y `expenseLevel`.

Se utilizaron:

- `it.each`,
- casos de error,
- y mocks con `vi.fn()` para reemplazar `fetch`.

## Refactor para poder mockear

El controller accedía directamente a `AppDbContext`.

Se separó la lógica en:

`Controller → ExpenseService → IExpenseRepository → ExpenseRepository → AppDbContext`

Esto permitió reemplazar el repositorio real por un mock y probar la lógica sin usar MySQL.

## Coverage y umbrales

### Backend
Coverage medido:

- Lines: 38,18 %
- Branches: 56,25 %

Umbrales:

- Lines: 35 %
- Branches: 50 %

### Frontend
Coverage medido:

- Lines: 75 %
- Branches: 50 %

Umbrales:

- Lines: 70 %
- Branches: 45 %

Los valores se eligieron en función de la cobertura real, dejando un margen pequeño para que una regresión haga fallar el pipeline.

## Exclusiones de coverage

En backend se excluyeron:

- `Program`
- `AppDbContext`
- Models
- Migrations
- código generado por OpenAPI

No se excluyeron `ExpenseService`, `ExpenseRepository` ni `ExpensesController`.

En frontend se configuró:

`include: ['src/services/**']`

para medir la lógica testeada y no componentes de presentación.

## Coverage alto no garantiza calidad

Coverage mide qué código se ejecutó, no si fue correctamente verificado.

Por ejemplo, llamar a `getExpenseLevel(5000)` sin un `expect` aumenta coverage, pero no comprueba que el resultado sea correcto.

## Rama sin cubrir

Se identificó como camino posible la validación de mes inválido en `GetMonthlySummaryAsync`.

Una entrada que lo recorrería es:

`month = 13`

La regla ya se prueba directamente en los tests parametrizados de `IsValidMonth`, por lo que no se agregó otro test en esta etapa.

## Quality gate

Los jobs `build-backend` y `build-frontend` del TP4 se extendieron para:

- ejecutar tests,
- medir coverage,
- comparar contra los umbrales,
- publicar reportes,
- y fallar si la cobertura baja.

Así, un cambio puede compilar y tener todos los tests existentes en verde, pero igualmente quedar bloqueado por calidad.

## Demostración del gate

Se agregó código nuevo sin tests.

Todos los tests existentes pasaron, pero el coverage del frontend cayó a:

- Lines: 52,17 %
- Branches: 28,57 %

Como los umbrales eran 70 % y 45 %, `build-frontend` quedó rojo y el merge fue bloqueado.

Luego se agregaron los tests faltantes, el coverage volvió a superar el umbral y el PR pudo mergearse.

PR rojo → verde → merge:

https://github.com/conradovolpi/ingsoft3-tp01/pull/20

Corrida roja:
https://github.com/conradovolpi/ingsoft3-tp01/actions/runs/37704584623

Corrida verde:
https://github.com/conradovolpi/ingsoft3-tp01/actions/runs/37705121353

Segundo PR rojo abierto hasta la defensa:
https://github.com/conradovolpi/ingsoft3-tp01/pull/22

## Problemas encontrados

El coverage inicial del backend incluía código generado y no representaba bien la lógica testeada. Se ajustaron las exclusiones para medir solo código relevante.

En frontend se limitó la medición a `src/services/**`.

También se agregaron los reportes generados al `.gitignore` para no versionarlos.

## Uso de IA

Se utilizó ChatGPT como apoyo para diseñar los tests, configurar mocks, coverage, thresholds, Docker y GitHub Actions.

Todo fue verificado ejecutando los tests localmente, dentro de Docker y en Pull Requests reales de GitHub.

## TP6 — CI/CD y operación

### Cadena de despliegue y artefactos

En el [workflow de v6.0.0](https://github.com/conradovolpi/ingsoft3-tp01/blob/v6.0.0/.github/workflows/ci.yml), los builds del backend y frontend ejecutan tests y coverage. Los pasos siguientes se ejecutan sólo si los anteriores aprobaron. La publicación en GHCR se habilita únicamente para un push a main; en un PR se construye y verifica sin publicar. Así se evita publicar una imagen que haya fallado la verificación de ese componente.

QA depende de ambos builds mediante needs y se habilita únicamente en un push a main. PROD depende del smoke de QA y usa el environment production con aprobación manual. Desde TP7, la cadena agrega integración y e2e entre QA y PROD.

Es Continuous Delivery: el pipeline deja una versión lista para desplegar, pero una persona decide su pase a PROD. Con Continuous Deployment también se automatizaría esa decisión.

En TP6 Render reconstruía el código del SHA solicitado en cada entorno. Aunque fuera el mismo commit, no se garantizaba reutilizar el binario comprobado en CI: dos reconstrucciones podían resolver dependencias de forma distinta. En TP7 se corrigió esa limitación usando las imágenes de GHCR ya construidas por CI.

### Environments, secrets y aprobación

Los hooks RENDER_HOOK_API_QA y RENDER_HOOK_FRONT_QA están en el environment qa; RENDER_HOOK_API_PROD y RENDER_HOOK_FRONT_PROD, en production. El job de PROD obtiene también URL_API_PROD y URL_FRONT_PROD de las variables de ese environment. Los valores privados no están versionados. GITHUB_TOKEN lo emite GitHub para cada ejecución y los jobs de build tienen packages: write para publicar en GHCR.

Antes de aprobar reviso el SHA, los tests y coverage, el resultado de QA y su smoke y, desde TP7, los reportes de integración/e2e y la imagen solicitada. En Render contrasto el estado Live y la referencia de imagen. También reviso los cambios, la compatibilidad con la base y la versión de recuperación. La aprobación protege los secrets y el inicio del job de producción; no demuestra por sí sola que la aplicación funcione.

El [run 39270442867](https://github.com/conradovolpi/ingsoft3-tp01/actions/runs/39270442867) registra la aprobación manual y el despliegue de PROD exitoso.

### Pase a producción rechazado

El 21/10/2026 se reintentó únicamente deploy-prod de una corrida anterior, como prueba controlada del gate. El job quedó esperando la aprobación obligatoria y se rechazó antes de ejecutar pasos.

Evidencia: [corrida 39468994099, intento 2](https://github.com/conradovolpi/ingsoft3-tp01/actions/runs/39468994099/attempts/2), sección Deployment protection rules.

Motivo registrado: el candidato 716a07a era anterior al cierre de TP9 (cb0fc7b / v9.0.0). Promoverlo hubiera sido volver a una versión anterior sin un rollback planificado y validado. Se conservó la versión vigente de PROD. GitHub registra state: rejected con el comentario y deploy-prod fallido sin pasos ejecutados. Una cancelación de workflow no equivale a este rechazo.

### Smoke y free tier

El smoke consulta /health, /api/expenses, la página del frontend y /api/expenses a través de su proxy. Comprueba que la API escucha, que puede leer datos y que el recorrido frontend → backend responde. No verifica todos los flujos ni demuestra que un HTTP 200 corresponda al SHA nuevo: por eso se contrasta también el deploy en Render.

Los servicios gratuitos pueden dormir y necesitan arrancar ante una petición. El workflow usa intentos y timeouts; para la defensa se abren QA y PROD con anticipación. El 21/10 se verificó que ambas páginas terminaron mostrando los gastos tras el arranque. No se usó fallback local.

### Patrón de despliegue y rollback

El proyecto usa el mecanismo de despliegue de Render y una promoción secuencial QA → aprobación → PROD. No se implementaron canary, blue-green ni feature flags. Para un servicio que necesite reducir el riesgo de una actualización elegiría blue-green: probar la nueva versión por separado, cambiar el tráfico y conservar la anterior para recuperarse. Requiere capacidad adicional y compatibilidad del esquema.

En el cierre operativo de TP6 se verificó 5868803, se volvió con backend y frontend a a3636bb, se consultaron los gastos y se regresó a 5868803. Las [notas publicadas de v6.0.0](https://github.com/conradovolpi/ingsoft3-tp01/releases/tag/v6.0.0) registran el resultado. No se restauró ni modificó el esquema de la base.

El procedimiento consiste en identificar el último par compatible de frontend/backend, impedir promociones concurrentes, seleccionar esa versión en ambos servicios, esperar Live y repetir salud, gastos y proxy. El cronómetro se inicia al ordenar la recuperación y se detiene cuando pasan las verificaciones de ambos servicios. No quedó registrado el tiempo total de la práctica original; no se presenta un tiempo estimado como una medición. Volver el código atrás no revierte migraciones ni recupera datos borrados.

### Problemas y uso de IA

El backend PROD falló al iniciar por un error SSL con una versión previa. Además, el hook de API PROD apuntaba a QA y el proxy del frontend PROD devolvía 502. Se corrigió el hook, se estableció BACKEND_URL en el frontend y se incorporó la comprobación del recorrido por el proxy. El [PR #31](https://github.com/conradovolpi/ingsoft3-tp01/pull/31) y la [corrida aprobada](https://github.com/conradovolpi/ingsoft3-tp01/actions/runs/39270442867) documentan el cierre.

Se utilizó ChatGPT para diagnosticar, preparar cambios, revisar el pipeline y organizar la documentación. Se verificó la asistencia mediante tests, coverage, QA/PROD, revisión de despliegues, la práctica de rollback y el rechazo explícito del pase antiguo. Esta sección reemplaza las notas de preparación previas.


## TP7 — Imágenes, integración y e2e

Los enlaces de paquetes, corridas, reportes y entornos están al inicio de este documento.

En la defensa se mostrarán los Events de los cuatro servicios: Deploy Hook, etiqueta de imagen y estado Live. Los entornos se mantendrán disponibles hasta esa instancia.

### Imágenes y despliegue

En TP6 Render reconstruía el código por entorno. Ahora CI publica las imágenes una vez y QA y PROD ejecutan las mismas mediante `imgURL`: build once, deploy many.

Usamos `sha-<commit completo>` para relacionar cada imagen con su código. No publicamos `latest` porque cambia de significado. Las etiquetas pueden sobrescribirse; un digest identifica contenido inmutable.

Cambiamos los cuatro servicios existentes a Existing Image, conservando URLs, variables e historial. La imagen inicial fue `sha-060f24d39e99cfcdef8eebcb396c72c2948fcb36`; cada pipeline selecciona después su propia etiqueta mediante el hook. Verificamos los paquetes públicos con docker pull sin credenciales.

En Events comprobamos Deploy Hook, etiqueta y estado Live. El smoke solo comprueba disponibilidad: una versión anterior también podría responder. Verificar automáticamente el commit servido queda como mejora futura.

La misma imagen del frontend sirve en ambos entornos: usa rutas relativas /api y Nginx recibe BACKEND_URL y DNS_RESOLVER por variables.

### Pruebas

Integración prueba la API y PostgreSQL reales de QA: alta, consulta y borrado; descripción vacía rechazada sin guardar; resumen mensual por categoría. Elegimos el resumen porque un total incorrecto afecta el uso diario.

Es integración amplia: comprueba el entorno desplegado, pero depende de su disponibilidad. Una integración estrecha con base descartable tendría mayor aislamiento.

Las e2e prueban desde Chromium: crear y borrar; validar monto obligatorio; crear y recargar para comprobar persistencia. No hay mocks. Los datos tienen nombres únicos y se eliminan verificando su ausencia, incluso mediante limpieza auxiliar si falla una prueba.

Conservamos reglas y casos de borde en unitarios; integración cubre persistencia y e2e los recorridos principales del usuario. Evitamos repetir todas las combinaciones en las suites más costosas.

Usamos esperas por condiciones, timeouts y un reintento en CI para tolerar cold starts, sin sleeps ni pruebas salteadas. Una prueba flaky cambia de resultado sin cambios relevantes y requiere investigar su causa.

### Gate y evidencias

La cadena es: builds → QA → integración → e2e → aprobación manual → PROD. Los reportes son separados y se publican también ante fallos. No se ignoran errores de las suites.

Cambiamos el botón de “Agregar gasto” a “Guardar gasto”, sin modificar tests. Los unitarios aprobaron; en la corrida 39295215591, integración quedó verde, e2e roja y PROD omitido. El reporte mostró que faltaba el botón esperado: la API funcionaba y fallaba el recorrido del frontend.

Restauramos el botón mediante el PR #36. La corrida 39297633337 aprobó las dos suites y desplegó en PROD tras la aprobación manual. El gate no cubre funciones que las pruebas no recorren.

### Release

v7.0.0 debe señalar el commit verificado en PROD. `git rev-list -n 1 v7.0.0` permite obtenerlo y formar las referencias de ambas imágenes con `sha-<commit>`.

### Problemas y uso de IA

Resolvimos el motor Docker detenido y verificamos la recuperación de un 502 transitorio cuya causa no quedó confirmada.

La IA se utilizó principalmente para solucionar errores, y también como apoyo para configurar el pipeline, preparar las pruebas y redactar documentación. Verificamos la asistencia ejecutando tests, revisando reportes y comprobando los despliegues y el bloqueo de PROD.

## TP8 — Infraestructura como Código

Elegí Terraform con Neon y Render, fijando los providers `kislerdm/neon` en `0.18.0` y `render-oss/render` en `1.9.1`. Declaré un entorno nuevo de preprod con proyecto, rol y base propios en Neon y dos servicios gratuitos en Render, usando las imágenes del TP7. La conexión a la base y la URL del backend se derivan de los recursos declarados.

El primer apply falló porque Neon exigía `org_id`; lo resolví agregando el identificador de mi organización al proyecto. Las credenciales se leen desde variables de entorno. El estado local, que contiene datos sensibles, queda excluido de Git; `.terraform.lock.hcl` se versiona.

Verifiqué los endpoints de vida y acceso a la base, el frontend y la persistencia de un gasto al recargar. Después destruí los cinco recursos y los recreé con apply, repetí las pruebas y comprobé `No changes`. QA y producción siguieron respondiendo. Dejé preprod destruido al terminar.

Utilicé ChatGPT para interpretar la consigna, preparar la configuración de Terraform y resolver errores. Verifiqué la asistencia mediante validate, lectura de planes, pruebas de la aplicación y el ciclo destroy → apply.

## TP9 — DevSecOps y observabilidad

Activamos Dependabot, CodeQL y push protection. Mergeamos el [PR #46](https://github.com/conradovolpi/ingsoft3-tp01/pull/46), que actualizó `@vitejs/plugin-react` de 6.1.0 a 6.1.2 (patch), tras revisar sus cambios y comprobar CI en verde. Corregimos las cuatro alertas de permisos de Actions y CodeQL quedó sin alertas abiertas.

UptimeRobot monitorea `/health` de PROD: avisó la caída en 5 minutos (17:45–17:50), registró la recuperación y quedó pausado. Sentry recibió errores del backend y frontend. En la muestra de una hora, `GET /api/Expenses` fue la operación más usada y más lenta: 8 pedidos y P95 de 2,40 s; originó el [issue #59](https://github.com/conradovolpi/ingsoft3-tp01/issues/59) en el tablero.

Resolvimos el 404 inicial del monitor apuntándolo a `/health` y retiramos las pruebas temporales de error. Usamos ChatGPT para configurar, resolver problemas y documentar; verificamos con builds, tests, CI/CD, alertas del monitor y eventos y trazas reales en Sentry.
