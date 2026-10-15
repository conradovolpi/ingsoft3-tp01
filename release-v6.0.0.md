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
- Corrección del incidente de PROD y causa comprobada: pendiente.
- Demostración de rollback y retorno a v6.0.0: pendiente.

Consultar `TP6-operacion.md` para diagnóstico y rollback. No se afirma que
PROD esté operativo ni que el rollback haya sido ejecutado.
