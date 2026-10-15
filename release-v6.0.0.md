# v6.0.0 — CI/CD con QA y producción

Borrador: no publicar hasta completar las verificaciones.

El pipeline construye frontend y backend, ejecuta tests y coverage, publica
imágenes por SHA y solicita despliegues en QA y producción mediante Render.
Producción utiliza el environment `production`; comprobar en GitHub que
su aprobación manual esté configurada.

## Evidencias requeridas antes de publicar

- SHA de main validado: pendiente.
- Run de CI y resultados de tests/coverage: pendiente.
- Deploys QA y PROD `live` para ese SHA: pendiente.
- Smoke tests de API, frontend y consulta mediante proxy: pendiente.
- Incidente PROD: recuperado en a3636bb mediante deploy al servicio correcto;
  API y proxy frontend verificados con HTTP 200. Falta corregir el hook del
  pipeline y verificar un despliegue completo desde GitHub Actions.
- Demostración de rollback y retorno a v6.0.0: pendiente.

Consultar `TP6-operacion.md` para diagnóstico y rollback. El rollback no
fue ejecutado; no hay un deploy previo exitoso del backend PROD para usar
como destino verificado. No volver al deploy que falló por SSL.
