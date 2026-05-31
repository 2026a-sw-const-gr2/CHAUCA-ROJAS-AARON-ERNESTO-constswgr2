# EPN Event Manager

API REST construida con NestJS para la gestión de smartphones con registro automático de eventos de auditoría. Desarrollada como proyecto de examen aplicando los cuatro tipos de mantenimiento de software: correctivo, adaptativo, perfectivo y preventivo.

---

## Tecnologías

- **NestJS 11** — framework principal
- **TypeORM + SQLite (better-sqlite3)** — persistencia de datos
- **class-validator / class-transformer** — validación de entradas
- **@nestjs/swagger** — documentación interactiva de la API
- **Jest** — pruebas unitarias

---

## Estructura del proyecto

```
src/
├── common/
│   └── guards/
│       └── api-key.guard.ts        # Guard de autenticación por API Key
├── database/
│   ├── entities/
│   │   ├── smartphone.entity.ts    # Entidad de smartphones
│   │   └── event.entity.ts         # Entidad de eventos de auditoría
│   ├── migrations/                 # Migraciones de base de datos
│   └── database.module.ts
├── modules/
│   ├── smartphones/                # CRUD principal de smartphones
│   │   ├── dto/
│   │   ├── smartphones.controller.ts
│   │   ├── smartphones.service.ts
│   │   └── smartphones.service.spec.ts
│   ├── events/                     # Registro y consulta de eventos
│   ├── health/                     # Verificación de estado del servidor
│   └── stats/                      # Estadísticas de operaciones
└── main.ts
```

---

## Requisitos previos

- Node.js 18 o superior
- npm 9 o superior

---

## Instalación y configuración

### 1. Ubicarse en la carpeta del proyecto

Todos los comandos deben ejecutarse desde la carpeta `epn-event-manager/epn-event-manager`:

```bash
cd epn-event-manager/epn-event-manager
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Copia el archivo de ejemplo y edita los valores:

```bash
cp .env.example .env
```

Contenido del `.env`:

```env
PORT=3000
DB_PATH=db/events.sqlite
DB_MIGRATIONS_RUN=true
DB_SYNCHRONIZE=false
API_KEY=epn-fis-2026-secret-key
```

> El valor de `API_KEY` es la clave que debes enviar en el header `x-fis-epn-key` en cada petición.

---

## Iniciar el servidor

```bash
# Modo desarrollo con recarga automática
npm run start:dev

# Modo desarrollo sin recarga
npm run start

# Modo producción
npm run start:prod
```

El servidor queda disponible en: `http://localhost:3000`

---

## Documentación de la API (Swagger)

Una vez iniciado el servidor, accede a:

```
http://localhost:3000/api
```

Desde ahí puedes probar todos los endpoints directamente. Para autenticarte haz clic en el botón **Authorize** e ingresa el valor de tu `API_KEY`.

---

## Autenticación

Todos los endpoints requieren el header:

```
x-fis-epn-key: epn-fis-2026-secret-key
```

Sin este header, la API responde con `401 Unauthorized`.

---

## Endpoints disponibles

### Smartphones — `/api/smartphones`

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/api/smartphones` | Crear un smartphone |
| `GET` | `/api/smartphones` | Listar todos los smartphones |
| `GET` | `/api/smartphones/:id` | Obtener un smartphone por ID |
| `PUT` | `/api/smartphones/:id` | Actualizar un smartphone |
| `DELETE` | `/api/smartphones/:id` | Eliminar un smartphone |

**Ejemplo de body para crear o actualizar:**

```json
{
  "brand": "Samsung",
  "model": "Galaxy S24",
  "price": 799.99,
  "storage": "128GB"
}
```

### Events — `/events`

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/events` | Listar todos los eventos de auditoría |
| `GET` | `/events/source/:source` | Filtrar eventos por fuente |
| `GET` | `/events/entity/:entity` | Filtrar eventos por entidad |
| `POST` | `/events` | Registrar un evento manualmente |

### Health — `/health`

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/health` | Verificar estado del servidor y la base de datos |

### Stats — `/stats`

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/stats` | Obtener conteo de operaciones CREATE, UPDATE, DELETE y QUERY |

---

## Validaciones de entrada

| Campo | Regla |
|-------|-------|
| `brand` | Requerido, máximo 100 caracteres |
| `model` | Requerido, máximo 150 caracteres |
| `price` | Número, mínimo 0.01 |
| `storage` | Requerido, máximo 50 caracteres |

Cualquier campo inválido devuelve `400 Bad Request` con el detalle del error.

---

## Pruebas

```bash
# Ejecutar pruebas unitarias
npm run test

# Ejecutar pruebas con cobertura
npm run test:cov
```

Las pruebas unitarias cubren los cinco métodos CRUD y las reglas de validación de negocio en `SmartphonesService`.

---

## Logs

El sistema registra cada operación con el siguiente formato:

```json
{
  "operation": "CREATE",
  "entity": "smartphone",
  "id": 1,
  "result": "ok",
  "timestamp": "2026-05-29T10:00:00.000Z"
}
```

- **INFO** — operación exitosa
- **WARN** — recurso no encontrado o fallo de registro de evento
- **ERROR** — fallo de base de datos u otro error de infraestructura

---

## Variables de entorno

| Variable | Descripción | Valor por defecto |
|----------|-------------|-------------------|
| `PORT` | Puerto del servidor | `3000` |
| `DB_PATH` | Ruta del archivo SQLite | `db/events.sqlite` |
| `DB_MIGRATIONS_RUN` | Ejecutar migraciones al iniciar | `true` |
| `DB_SYNCHRONIZE` | Sincronizar esquema automáticamente | `false` |
| `API_KEY` | Clave de acceso para todos los endpoints | — |
