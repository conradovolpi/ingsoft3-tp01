# TP6: diagnóstico, release y rollback

Estado al 15/10/2026: preparación local y despliegue controlado del backend
PROD iniciado; no se publicó una release ni se ejecutó un rollback.
Falta la consigna original del TP6
para contrastar todos los requisitos de entrega.

## Evidencia disponible

- Base revisada: `a3636bb` de `main`.
- La salida aportada del run `38670853856`, intento 3, muestra builds y QA
  correctos y PROD cancelado por el usuario. Esa salida no determina la causa
  del timeout ni acredita que el deploy de Render haya terminado.
- `Program.cs` ejecuta `EnsureCreated()` para Postgres o `Migrate()` para MySQL
  antes de `app.Run()`. Si falla o demora la conexión, la API todavía no escucha.
- El Dockerfile escucha en `8080`; falta contrastarlo con la configuración real.
- El smoke test verifica disponibilidad, pero no identifica el commit servido.
  Un 200 de la versión anterior puede producir un falso positivo.
- Consulta autenticada de GitHub: el último run sigue siendo
  https://github.com/conradovolpi/ingsoft3-tp01/actions/runs/38670853856/attempts/3.
  Los jobs de build y QA finalizaron correctamente. En el job PROD
  `116217702524`, el paso de hooks fue exitoso y `/health` agotó 10 segundos
  sin recibir bytes en 22 intentos antes de la cancelación. Por el uso de
  `&&`, ese smoke test no llegó a consultar gastos ni frontend.

## Diagnóstico en Render y GitHub

### Hallazgo confirmado en Render (15/10/2026)

En el workspace confirmado por el usuario, `tea-db7vmbe7bikc73e9q380`:

- Backend PROD: `srv-db832vmq1p3s739cpto0`.
- Su único deploy previo, `dep-db832vuq1p3s739cpugg`, usaba
  `e66f4415088d48567dd9e3cf2fabb8ace0c2a9aa` y terminó `update_failed`.
  Los logs muestran `Exception while performing SSL handshake` y rechazo
  del certificado remoto durante `EnsureCreated()`, antes de abrir el puerto.
- La actualización de Npgsql del PR #29 no había llegado a ese servicio.
- A las 02:40:27 UTC, el job PROD solicitó el hook de API. Render registró
  un nuevo deploy por hook en el backend QA `srv-db7vuhpsrm7s7386m0c0`
  (`dep-db83q6o1npsc73adhshg`), sin ningún nuevo deploy en backend PROD.
  Esto evidencia que el hook utilizado para API PROD apunta a QA.
- El frontend PROD sí publicó `a3636bb`, deploy `dep-db83q6rncjis73egtic0`.
- Los servicios tienen auto-deploy desactivado.

Se inició un despliegue controlado del backend PROD con el main validado,
SHA `a3636bba7cd80e5f90e3f240c68b0b6428e87a7e`, mediante Render:
`dep-db8kh3l9fdbs739mfgt0`, creado a las 21:41:34 UTC (18:41:34 Argentina).
Render confirmó `live` a las 21:43:30 UTC. El log muestra escucha en
`http://0.0.0.0:8080`; las consultas públicas posteriores devolvieron HTTP 200
para `/health` y `/api/expenses`. No se cambiaron credenciales ni TLS.

Corrección necesaria en GitHub: reemplazar `RENDER_HOOK_API_PROD` en el
ámbito efectivo del job por el deploy hook del servicio PROD indicado arriba.
Comprobar también si hay un secret homónimo en el environment `production`
que esté sobrescribiendo el secret del repositorio. No copiar el hook a este
documento. Las herramientas conectadas no exponen la lectura del hook ni la
actualización de secrets; esta corrección sigue pendiente.

### Lista de verificación

1. Identificar el servicio `misgastos-api-prod-fznx`, el último deploy, su SHA,
   estado y hora. Consultar eventos y logs de build y arranque de ese deploy.
2. Comparar PROD con QA: repositorio, root directory, Dockerfile, comando de
   inicio, puerto y health check `/health`. Verificar que ambos usan el SHA
   esperado y que no hay despliegues automáticos que salteen la aprobación.
3. Comprobar `DB_PROVIDER=postgres` si la base es PostgreSQL y la presencia de
   `ConnectionStrings__DefaultConnection`. No copiar valores de secretos a
   issues, documentación ni salidas compartidas.
4. Revisar disponibilidad de la base, host, puerto, TLS y acceso desde el
   servicio. Confirmar el error concreto antes de cambiar configuración.
5. En GitHub, revisar los logs del job PROD y las variables `URL_API_PROD` y
   `URL_FRONT_PROD` del environment `production`, hooks y required reviewers.
   El YAML por sí solo no configura los revisores requeridos.
6. Aplicar una corrección mínima basada en los logs mediante rama y PR.
   Ejecutar tests y coverage, validar QA, aprobar PROD y comprobar en Render
   que el deploy del SHA exacto esté `live` antes de aceptar los smoke tests.
7. Comprobar `/health`, `/api/expenses`, la página del frontend y su consulta
   de gastos a través del proxy. Registrar fecha, SHA, URLs de runs y deploys,
   códigos HTTP y resultado. No registrar datos personales de los gastos.

Los hooks de Render inician o encolan un deploy; no certifican que esté listo.
Referencia: https://render.com/docs/deploy-hooks

## Cambios locales preparados

El workflow valida que las URLs del smoke test estén definidas, informa el
número de intento en PROD y limita los jobs de despliegue a 30 minutos.
Estos cambios mejoran el diagnóstico; no resuelven por sí mismos el backend
ni la verificación del SHA desplegado.

## Release v6.0.0 (pendiente)

Crear la release solamente después de tener CI, QA y PROD verificados para
un mismo SHA de `main`. Confirmar primero que el tag no existe remotamente.
Usar como notas `release-v6.0.0.md`, completando sus evidencias pendientes.
Crear el tag en ese SHA explícito, no en una rama de trabajo ni en el HEAD
implícito. No mover un tag publicado para corregir un despliegue.

## Rollback (procedimiento preparado, no ejecutado)

1. Registrar el SHA y los deploy IDs actuales de frontend y backend, además
   del último par de deploys que funcionó conjuntamente. No asumir que
   `v5.0.0` es compatible con la base de PROD.
2. Comprobar compatibilidad del esquema y respaldo recuperable. Volver el
   código atrás no revierte migraciones ni restaura datos.
3. Evitar que un deploy automático o un job aprobado pendiente reemplace
   el rollback. Coordinar el estado del pipeline antes de operar.
4. En Render, seleccionar los deploys anteriores verificados de backend y
   frontend y ejecutar el rollback controlado. Si la opción no está disponible,
   desplegar el SHA anterior explícito por el mecanismo autorizado.
5. Esperar el estado `live` de ambos y repetir las verificaciones de salud,
   listado de gastos y frontend. Registrar los deploy IDs y SHA efectivos.
6. Tras la demostración, volver a desplegar el SHA de v6.0.0, verificarlo
   nuevamente y documentar el estado final. Si falla el rollback, conservar
   logs y evaluar la base antes de intentar más cambios.

## Accesos y verificaciones pendientes

La copia local se obtuvo correctamente. La herramienta local de GitHub
informó credencial inválida dentro del entorno restringido; no se confirmó
su estado fuera de ese entorno. La solicitud posterior para consultar
GitHub y PROD externamente fue rechazada y no se ejecutó.
Las integraciones GitHub y Render no tenían conexión confirmada.
Docker Desktop no tenía el motor disponible durante la revisión.

Actualización: GitHub quedó conectado y se confirmó acceso al repositorio,
su SHA de main y los logs del intento 3 mediante la integración autorizada.
Render continúa pendiente de conexión; el usuario indicó que lo habilitará.

La revisión `git diff --check` pasó. El intento local de `dotnet test`
sin restaurar dependencias terminó con error de compilación sin diagnósticos
útiles; no produjo evidencia de tests aprobados. Faltan ejecutar tests,
coverage y validación real del workflow en GitHub.
