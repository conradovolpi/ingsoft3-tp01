# v6.0.0 - CI/CD con QA y produccion

El pipeline construye frontend y backend, ejecuta tests y coverage,
publica imagenes por SHA y despliega en QA y produccion mediante Render.
El environment production requiere aprobacion manual.

## Verificaciones realizadas

- Commit de la aplicacion validado: 5868803.
- PR de mejoras integrado: #31.
- Tests, coverage, despliegue QA y despliegue PROD aprobados.
- Ejecucion: https://github.com/conradovolpi/ingsoft3-tp01/actions/runs/39270442867
- Aprobacion manual de produccion comprobada.
- Hook del backend PROD corregido para apuntar al servicio correcto.
- Backend y frontend PROD confirmados Live en 5868803.
- Smoke tests de API, frontend y consulta mediante proxy aprobados.
- Rollback de ambos servicios al commit a3636bb realizado.
- Aplicacion y consulta de gastos verificadas tras el rollback.
- Retorno de ambos servicios a 5868803 realizado y verificado.

El rollback demostro la recuperacion de una version anterior del codigo.
No se realizaron cambios ni restauraciones del esquema de base de datos.

Consultar TP6-operacion.md para el diagnostico y procedimiento operativo.
