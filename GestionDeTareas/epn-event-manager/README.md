# epn-event-manager

<!--
  Problema 13 — Mantenimiento Preventivo
  Qué: El README original era el template genérico de NestJS, sin información del proyecto.
  Mejora: Se documenta la arquitectura real, los endpoints, las variables de entorno
          y los pasos de instalación basándose en el código existente.
  Por qué: Un README completo previene errores en el onboarding, reduce el tiempo
           de configuración y facilita el despliegue en nuevos entornos.
  Tipo: Preventivo.
-->

Aplicación de gestión de tareas y auditoría de eventos construida con **NestJS** y **SQLite**. Permite registrar tareas (CRUD) y auditar eventos de sistema (CREATE, UPDATE, DELETE, QUERY) con estadísticas en tiempo real.

---

## Arquitectura general

```
src/
├── app.module.ts                  # Módulo raíz
├── main.ts                        # Bootstrap de la aplicación
├── database/
│   ├── database.module.ts         # Configuración TypeORM (SQLite)
│   └── entities/
│       ├── task.entity.ts         # Entidad de tareas
│       ├── create-event.entity.ts
│       ├── update-event.entity.ts
│       ├── delete-event.entity.ts
│       └── query-event.entity.ts
└── modules/
    ├── tasks/                     # CRUD de tareas + UI web
    ├── events/                    # Registro de eventos de auditoría
    ├── stats/                     # Estadísticas de eventos
    └── health/                    # Health check de la aplicación
```

La base de datos es **SQLite** gestionada por **TypeORM**. Cada tipo de evento (CREATE, UPDATE, DELETE, QUERY) se almacena en su propia tabla.

---

## Tecnologías utilizadas

| Tecnología | Versión | Rol |
|---|---|---|
| Node.js | ≥ 18 | Runtime |
| NestJS | ^11 | Framework backend |
| TypeORM | ^0.3 | ORM |
| better-sqlite3 | ^12 | Driver SQLite |
| class-validator | ^0.15 | Validación de DTOs |
| @nestjs/config | ^4 | Variables de entorno |

---

## Instalación

```bash
# 1. Instalar dependencias
npm install

# 2. Crear el archivo de variables de entorno
cp .env.example .env   # o crear manualmente (ver sección Variables de entorno)

# 3. Crear la carpeta de base de datos (si no existe)
mkdir db
```

---

## Variables de entorno

Crear un archivo `.env` en la raíz del proyecto (`epn-event-manager/`) con el siguiente contenido:

```env
# Tipo de base de datos (no cambiar si se usa SQLite)
DB_TYPE=better-sqlite3

# Ruta al archivo SQLite (relativa a la raíz del proyecto)
DB_NAME=db/events.sqlite

# Sincronización automática del esquema — solo true en desarrollo inicial
# NUNCA usar true en producción; usar migraciones en su lugar
DB_SYNCHRONIZE=false

# Puerto del servidor (opcional, por defecto 3000)
PORT=3000
```

> **Importante:** `DB_SYNCHRONIZE=true` crea/modifica tablas automáticamente al iniciar.
> En entornos de producción debe ser `false` y se deben ejecutar migraciones manuales.

---

## Ejecutar el proyecto

```bash
# Modo desarrollo (recarga automática)
npm run start:dev

# Modo desarrollo normal
npm run start

# Modo producción (requiere build previo)
npm run build
npm run start:prod
```

La aplicación estará disponible en: `http://localhost:3000`

---

## Interfaz de usuario

La aplicación incluye una UI web para gestión de tareas:

```
http://localhost:3000/tasks/ui
```

---

## Endpoints principales

### Tareas (`/tasks`)

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/tasks/ui` | Interfaz web de gestión de tareas |
| `GET` | `/tasks` | Listar todas las tareas |
| `POST` | `/tasks` | Crear una tarea nueva |
| `PUT` | `/tasks/:id` | Actualizar una tarea por ID |
| `DELETE` | `/tasks/:id` | Eliminar una tarea por ID |

**Body para POST `/tasks`:**
```json
{
  "titulo": "Mi tarea",
  "descripcion": "Descripción opcional",
  "estado": "pendiente"
}
```
Valores válidos para `estado`: `pendiente`, `en progreso`, `completada`.

---

### Eventos (`/events`)

| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/events` | Registrar un evento de auditoría |
| `GET` | `/events` | Listar todos los eventos |
| `GET` | `/events/source/:source` | Filtrar eventos por fuente |
| `GET` | `/events/entity/:entity` | Filtrar eventos por entidad |

**Body para POST `/events`:**
```json
{
  "source": "sistema-externo",
  "entity": "usuario",
  "action": "CREATE",
  "title": "Nuevo usuario creado",
  "description": "Se registró el usuario juan@email.com",
  "payload": { "id": 42, "email": "juan@email.com" }
}
```
Valores válidos para `action`: `CREATE`, `UPDATE`, `DELETE`, `QUERY`.

---

### Estadísticas (`/stats`)

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/stats` | Totales de eventos por tipo |

**Respuesta de ejemplo:**
```json
{
  "create": 10,
  "update": 5,
  "delete": 2,
  "query": 8,
  "total": 25
}
```

---

### Health Check (`/health`)

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/health` | Estado de la aplicación |

---

## Scripts disponibles

```bash
npm run start          # Iniciar en modo normal
npm run start:dev      # Iniciar con recarga automática (desarrollo)
npm run start:debug    # Iniciar con depurador
npm run start:prod     # Iniciar desde el build compilado
npm run build          # Compilar TypeScript a dist/
npm run format         # Formatear código con Prettier
npm run lint           # Revisar estilo de código (sin modificar archivos)
npm run lint:fix       # Revisar y corregir estilo de código automáticamente
npm run test           # Ejecutar tests unitarios
npm run test:watch     # Tests en modo watch
npm run test:cov       # Tests con reporte de cobertura
npm run test:e2e       # Tests end-to-end
```

---

## Estructura de carpetas importante

```
epn-event-manager/
├── src/
│   ├── modules/tasks/views/tasks.html   # Vista HTML de la UI de tareas
│   └── ...
├── db/                                  # Carpeta de la base de datos SQLite (crear manualmente)
├── dist/                                # Código compilado (generado por nest build)
├── .env                                 # Variables de entorno (NO subir a git)
├── nest-cli.json                        # Configuración de NestJS CLI
└── package.json
```

---

## Notas para desarrolladores

- La carpeta `db/` debe existir antes de iniciar el servidor. Si no existe, SQLite no puede crear el archivo de base de datos.
- El archivo `.env` no está en el repositorio; debe crearse manualmente antes del primer arranque.
- Los archivos `.html` en `src/` se copian automáticamente a `dist/` durante `npm run build` gracias a la configuración `assets` en `nest-cli.json`.
- Para desarrollo con `npm run start:dev`, los archivos HTML en `src/` se usan directamente (no se necesita build).
- Al agregar nuevas entidades, incluirlas en el array `entities` de `src/database/database.module.ts`.
