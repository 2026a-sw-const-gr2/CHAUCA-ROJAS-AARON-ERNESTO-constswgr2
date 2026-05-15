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

Tarea 1 (Perfectivo): [Prob. 2] Unificar las 4 tablas de eventos (create_events, update_events, etc.) en una sola entidad Event con un campo action.

Tarea 2 (Correctivo/Perfectivo): [Prob. 3] Estandarizar todas las columnas de fecha a un único formato ISO/UTC (ej. created_at).

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