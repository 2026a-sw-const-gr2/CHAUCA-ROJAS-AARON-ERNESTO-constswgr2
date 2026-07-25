Plan de Mantenimiento de Software: epn-event-manager

Basado en el diagnóstico del proyecto y los conceptos de mantenimiento de software, se ha realizado la siguiente clasificación y distribución de tareas para un equipo de 5 personas.

1. Clasificación de Problemas por Tipo de Mantenimiento

Según las definiciones de la presentación, los 14 hallazgos se clasifican de la siguiente manera:

🛠️ Mantenimiento Correctivo

(Se enfoca en identificar y corregir defectos y errores post-implementación).

Problema 1: El evento DELETE no se guarda, pero responde éxito. (Error funcional crítico).

Problema 3: Fechas guardadas como texto local y con nombres distintos. (Causa errores de ordenamiento y zonas horarias).

Problema 5: Estadísticas incompletas (Falta query_events). (Error de lógica que genera reportes incorrectos).

Problema 11: Parámetros numéricos sin validación. (Genera errores de ejecución como NaN).

⚙️ Mantenimiento Adaptativo

(Modificaciones para que el software funcione en entornos cambiantes).

Problema 8: Base SQLite hardcodeada y synchronize: true. (Debe adaptarse para funcionar mediante variables de entorno y migraciones, permitiendo el despliegue en distintos entornos como Dev, QA o Producción).

🚀 Mantenimiento Perfectivo

(Mejoras que optimizan el rendimiento, la mantenibilidad y la interfaz).

Problema 2: Modelo de eventos dividido en cuatro tablas casi iguales. (Optimización del código: Refactorización para reducir complejidad).

Problema 4: Ordenamiento de eventos en memoria y por texto. (Aumento de la velocidad de procesamiento y optimización del rendimiento).

Problema 9: Acoplamiento entre StatsModule y EventsService. (Optimización del código y arquitectura).

Problema 12: HTML, CSS y JS incrustados dentro del controlador. (Mejora en la usabilidad y mantenibilidad al separar la vista de la lógica).

🛡️ Mantenimiento Preventivo

(Prácticas proactivas para prevenir problemas futuros y monitorear).

Problema 6: DTOs sin validaciones. (Reduce el riesgo de interrupciones por inyección de datos corruptos).

Problema 7: Uso de any en payload. (Enfoque proactivo para evitar errores de tipado en el futuro).

Problema 10: Health check superficial. (Uso de herramientas de monitoreo: debe revisar la BD real para prevenir caídas silenciosas).

Problema 13: README genérico. (Previene errores humanos en el onboarding y despliegue).

Problema 14: Script lint corrige automáticamente. (Previene mezclar cambios de estilo con cambios funcionales, reduciendo riesgos en el control de versiones).
















2. Distribución de Tareas (Equipo de 5 Personas)

Para que el trabajo sea eficiente, las tareas se han agrupado por dominio técnico. Esto evita conflictos en Git (merge conflicts) y permite que cada integrante se enfoque en un área específica.

🧑‍💻 Persona 1: "El Bombero" (Enfoque Correctivo Inmediato)

Misión: Resolver los bugs críticos y errores lógicos de la API que afectan la funcionalidad actual.

Tarea 1 (Correctivo): [Prob. 1] Arreglar el evento DELETE para que persista correctamente en la base de datos o devuelva un error real.

Tarea 2 (Correctivo): [Prob. 5] Corregir la lógica de estadísticas para incluir la tabla query_events en el total.

Tarea 3 (Correctivo): [Prob. 11] Implementar ParseIntPipe en los controladores para validar que los IDs sean números (evitar NaN).

🧑‍💻 Persona 2: "El Arquitecto de Datos" (Refactorización Core)

Misión: Reestructurar la base de datos. Nota: Esta persona tiene solo 2 tareas porque unificar tablas es el trabajo más pesado y complejo.

✅ **COMPLETADA** - Tarea 1 (Perfectivo): [Prob. 2] Unificar las 4 tablas de eventos (create_events, update_events, etc.) en una sola entidad Event con un campo action.
- ✅ Nueva entidad `EventEntity` creada en `src/database/entities/event.entity.ts`
- ✅ Base de datos module actualizado para usar la nueva entidad
- ✅ Events module refactorizado
- ✅ Servicio simplificado de 4 repositorios a 1
- ✅ Compilación exitosa sin errores

✅ **COMPLETADA** - Tarea 2 (Correctivo/Perfectivo): [Prob. 3] Estandarizar todas las columnas de fecha a un único formato ISO/UTC (ej. created_at).
- ✅ Campo de fecha unificado: `created_at` en formato ISO 8601
- ✅ Reemplazado `toLocaleString()` con `toISOString()`
- ✅ Zona horaria UTC estandarizada
- ✅ Comparación cronológica correcta (DESC en findAll)
- ✅ Compatible con estándares internacionales

🧑‍💻 Persona 3: "El Optimizador" (Rendimiento y Entorno)

Misión: Mejorar el rendimiento de consultas, desacoplar módulos y preparar la app para diferentes entornos.

Tarea 1 (Perfectivo): [Prob. 4] Eliminar el ordenamiento en memoria (localeCompare) y trasladarlo a una consulta SQL/TypeORM (ORDER BY).

Tarea 2 (Perfectivo): [Prob. 9] Desacoplar StatsModule y EventsService creando un servicio o interfaz dedicada.

Tarea 3 (Adaptativo): [Prob. 8] Quitar la ruta hardcodeada de SQLite y el synchronize: true, pasándolo a variables de entorno (.env).

🧑‍💻 Persona 4: "El Guardián" (Seguridad y Monitoreo)

Misión: Hacer la aplicación robusta y monitoreable frente a fallos futuros.

Tarea 1 (Preventivo): [Prob. 6] Implementar class-validator y ValidationPipe en todos los DTOs.

Tarea 2 (Preventivo): [Prob. 7] Eliminar los tipos any en los payloads y reemplazarlos por interfaces tipadas o DTOs.

Tarea 3 (Preventivo): [Prob. 10] Mejorar el endpoint del Health Check (health.controller.ts) para que verifique el estado real de la conexión a la base de datos.

🧑‍💻 Persona 5: "El Especialista en DX y Vistas" (Developer Experience & UI)

Misión: Mejorar la experiencia de desarrollo, las herramientas del proyecto y limpiar la capa de presentación.

Tarea 1 (Perfectivo): [Prob. 12] Extraer el HTML, CSS y JS incrustados en tasks.controller.ts hacia archivos estáticos o un motor de plantillas.

Tarea 2 (Preventivo): [Prob. 13] Redactar un README.md completo documentando la arquitectura, endpoints y variables de entorno.

Tarea 3 (Preventivo): [Prob. 14] Separar el script del package.json en dos comandos distintos: lint (solo revisión) y lint:fix (corrección).


3. Backlog de Features propuestas

Estas tareas pueden agregarse como features al proyecto para mejorar la usabilidad, la trazabilidad y la calidad de la aplicación.

Feature 1: Añadir endpoint de detalle de tarea
- Agregar `GET /tasks/:id` para recuperar una tarea por ID.
- Retornar `404` si la tarea no existe.
- Usar `ParseIntPipe` para validar el ID.
- Criterios de aceptación:
  - Existe un endpoint funcional `GET /tasks/:id`.
  - El endpoint retorna `200` con la tarea correcta cuando el ID existe.
  - El endpoint retorna `404` si el ID no corresponde a ninguna tarea.
  - El ID inválido (no numérico) falla con un error de validación.

Feature 2: Filtrado de tareas por estado y búsqueda por título
- Extender `GET /tasks` con query params `estado` y `q`.
- Permitir devolver tareas filtradas por `pendiente`, `en progreso` o `completada`.
- Permitir buscar coincidencias parciales en `titulo`.
- Criterios de aceptación:
  - `GET /tasks?estado=pendiente` retorna solo tareas en estado `pendiente`.
  - `GET /tasks?q=revision` retorna tareas cuyo título contiene `revision`.
  - Si no se pasa filtro, el endpoint retorna todas las tareas activas.
  - El filtro `estado` rechaza valores inválidos con un error claro.

Feature 3: Paginación en listas de tareas y eventos
- Soportar `page` y `limit` en `GET /tasks` y `GET /events`.
- Devolver metadatos de paginación: `total`, `page`, `limit`, `pages`.
- Criterios de aceptación:
  - `GET /tasks?page=2&limit=5` retorna la página correcta de tareas.
  - La respuesta incluye `total`, `page`, `limit` y `pages`.
  - `page` y `limit` inválidos son manejados con validación.

Feature 4: Filtros de eventos por acción y rango de fechas
- Añadir `GET /events?action=CREATE,UPDATE` y `fromDate`/`toDate`.
- Permitir filtrar eventos por `action` y por fecha de creación.
- Criterios de aceptación:
  - `GET /events?action=CREATE` retorna solo eventos `CREATE`.
  - `GET /events?fromDate=2026-01-01&toDate=2026-01-31` retorna eventos dentro del rango.
  - Los filtros combinados funcionan juntos correctamente.
  - Los formatos de fecha inválidos devuelven un error de validación.

Feature 5: Estadísticas avanzadas y tendencias
- Extender `GET /stats` con datos por rango de fechas.
- Incluir un conteo por `action` y porcentaje de crecimiento frente al periodo anterior.
- Criterios de aceptación:
  - `GET /stats?fromDate=2026-06-01&toDate=2026-06-30` retorna estadísticas filtradas.
  - La respuesta contiene conteos por acción y los totales.
  - Se muestra el porcentaje de crecimiento frente al periodo anterior.

Feature 6: Registro de usuario/propietario de tarea
- Añadir campo `asignado_a` a `TaskEntity` y DTOs.
- Permitir consultar tareas por responsable.
- Criterios de aceptación:
  - Las tareas pueden crearse y actualizarse con `asignado_a`.
  - `GET /tasks?asignado_a=juan` retorna solo tareas asignadas a `juan`.
  - El campo se persiste correctamente en la base de datos.

Feature 7: Campos adicionales en tareas: prioridad y fecha de vencimiento
- Añadir `prioridad` (`baja`, `media`, `alta`) y `fecha_vencimiento`.
- Mostrar estado de tareas vencidas en la API.
- Criterios de aceptación:
  - Las tareas aceptan `prioridad` y `fecha_vencimiento` en el modelo.
  - La API retorna un indicador `vencida: true/false` cuando aplica.
  - El campo `prioridad` valida los valores permitidos.

Feature 8: Soft delete / restaurar tareas
- Cambiar eliminación física por `deleted_at` opcional.
- Agregar endpoint `POST /tasks/:id/restore`.
- Ignorar tareas marcadas como eliminadas en las listas normales.
- Criterios de aceptación:
  - `DELETE /tasks/:id` marca `deleted_at` sin borrar la fila.
  - Tareas borradas no aparecen en `GET /tasks` normales.
  - `POST /tasks/:id/restore` rehace la tarea eliminada.
  - Si la tarea no existe o no está borrada, el endpoint retorna un error apropiado.

Feature 9: UI web mejorada con frontend separado
- Mover los HTML/CSS/JS incrustados a `src/modules/tasks/views/`.
- Mejorar la interfaz para crear, editar, filtrar y marcar tareas completadas.
- Criterios de aceptación:
  - La vista `GET /tasks/ui` carga archivos estáticos desde `views/`.
  - La interfaz permite crear y editar tareas sin errores.
  - El filtrado y marcado de tareas funciona desde la UI.

Feature 10: Auditoría de eventos automática desde operaciones CRUD
- Registrar automáticamente eventos `CREATE`, `UPDATE`, `DELETE` cuando se manipulan tareas.
- Usar `EventsService` internamente en `TasksService`.
- Criterios de aceptación:
  - Crear, actualizar y borrar tareas genera eventos de auditoría.
  - Los eventos tienen `action` correcto y payload con datos relevantes.
  - No se registran eventos duplicados para una misma operación.

Feature 11: Documentación y pruebas de contrato
- Crear especificaciones de API simples para todos los endpoints.
- Añadir pruebas E2E que cubran creación, actualización, eliminación, filtrado y estadísticas.
- Criterios de aceptación:
  - Existe documentación de los endpoints clave.
  - Las pruebas E2E cubren al menos los flujos principales.
  - Las pruebas pasan en el repositorio.

Feature 12: Mejorar la configuración y despliegue con `.env.example`
- Añadir `.env.example` con variables obligatorias.
- Documentar en README el uso de `DB_SYNCHRONIZE=false` y el flujo de migraciones.
- Criterios de aceptación:
  - Hay un `.env.example` completo en la raíz.
  - El README explica claramente las variables y recomendaciones.
  - El proyecto puede iniciarse con el archivo de ejemplo si se completan los valores.

Feature 13: Validación global y manejo centralizado de errores
- Configurar `ValidationPipe` global en `main.ts`.
- Añadir filtro de excepciones para respuestas uniformes en errores de validación.
- Criterios de aceptación:
  - Los DTOs de entrada se validan automáticamente.
  - Las respuestas de error tienen formato uniforme.
  - Las validaciones invalidan payloads malformados antes de llegar al servicio.

Feature 14: Health check de base de datos y estado de dependencias
- Extender `/health` para validar el acceso a la base de datos y la presencia de archivos estáticos.
- Retornar `status: error` si alguno de los recursos no está disponible.
- Criterios de aceptación:
  - `/health` retorna `ok` cuando la DB y recursos están accesibles.
  - Retorna `error` si la DB está caída o falta un recurso crítico.
  - Incluye un timestamp y estado de cada dependencia.

Feature 15: Autenticación y autorización básica
- Añadir autenticación simple con credenciales en memoria o JWT para proteger endpoints críticos.
- Permitir acceso solo a usuarios autenticados para modificar tareas y registrar eventos.
- Registrar intentos de acceso fallidos en la tabla de eventos.
- Criterios de aceptación:
  - Los endpoints protegidos devuelven `401` si no hay token o credenciales válidas.
  - Un usuario autenticado puede acceder a endpoints protegidos.
  - Los intentos fallidos se registran como eventos en la base de datos.

Feature 16: Hashing y almacenamiento seguro de secretos
- Usar hashing con `bcrypt` para cualquier contraseña o token guardado en configuración.
- No almacenar contraseñas en texto claro en `.env` ni en la base de datos.
- Añadir validación de fuerza para contraseñas y tokens.
- Criterios de aceptación:
  - Las contraseñas nunca se almacenan en texto plano.
  - El hashing de `bcrypt` se aplica antes de persistir credenciales.
  - Las contraseñas débiles se rechazan con un mensaje claro.

Feature 17: Sanitización y protección contra inyección
- Validar y sanitizar `query` y `payload` en los endpoints de búsqueda y eventos.
- Usar pipes y DTOs para evitar inyección de SQL/JSON y datos malformados.
- Añadir filtros globales para limpiar entradas y respuestas.
- Criterios de aceptación:
  - Los campos de query se sanitizan antes de ser usados en consultas.
  - Los payloads malformados son rechazados por validación.
  - La aplicación no ejecuta consultas peligrosas a partir de datos de entrada.

Feature 18: Límites y protección contra abuso
- Implementar rate limiting en los endpoints públicos `POST /events` y `POST /tasks`.
- Bloquear o ralentizar peticiones repetidas desde el mismo origen.
- Registrar eventos de abuso en el sistema de auditoría.
- Criterios de aceptación:
  - Las peticiones excesivas reciben `429 Too Many Requests`.
  - El rate limiting se aplica a los endpoints públicos definidos.
  - Los eventos de abuso quedan registrados para auditoría.
