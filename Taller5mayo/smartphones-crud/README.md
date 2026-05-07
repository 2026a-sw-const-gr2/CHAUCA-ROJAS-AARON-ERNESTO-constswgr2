# smartphones-crud

CRUD academico simple para un catalogo de smartphones. Cada operacion CRUD envia automaticamente un evento HTTP POST al proyecto `epn-event-manager` en:

```txt
http://localhost:3000/events
```

## Tecnologias

- Node.js
- Express
- Axios
- Almacenamiento en memoria

## Estructura

```txt
src/
  app.js
  controllers/
    smartphoneController.js
  models/
    smartphoneModel.js
  routes/
    smartphoneRoutes.js
  services/
    eventService.js
    smartphoneService.js
```

## Instalacion y ejecucion

1. Iniciar primero `epn-event-manager` en el puerto `3000`.
2. Instalar dependencias del CRUD:

```bash
npm install
```

3. Ejecutar el CRUD:

```bash
npm run dev
```

El servicio queda disponible en:

```txt
http://localhost:4000
```

Si el Event Manager usa otra URL, configurar:

```bash
set EVENT_MANAGER_URL=http://localhost:3000/events
```

## Endpoints

| Metodo | URL | Descripcion |
| --- | --- | --- |
| POST | `/api/smartphones` | Crear smartphone |
| GET | `/api/smartphones` | Listar smartphones |
| GET | `/api/smartphones/:id` | Buscar smartphone por id |
| PUT | `/api/smartphones/:id` | Editar smartphone |
| DELETE | `/api/smartphones/:id` | Eliminar smartphone |

## Payload de evento enviado al Event Manager

Ejemplo para crear:

```json
{
  "source": "smartphones-crud",
  "entity": "smartphone",
  "action": "CREATE",
  "title": "Smartphone creado",
  "description": "Se registro un nuevo smartphone",
  "payload": {
    "id": 1,
    "brand": "Samsung",
    "model": "S25",
    "price": 1200,
    "storage": "256GB"
  }
}
```

## Ejemplos para Postman

### Crear smartphone

- Method: `POST`
- URL: `http://localhost:4000/api/smartphones`
- Body raw JSON:

```json
{
  "brand": "Samsung",
  "model": "S25",
  "price": 1200,
  "storage": "256GB"
}
```

### Listar smartphones

- Method: `GET`
- URL: `http://localhost:4000/api/smartphones`

### Buscar por id

- Method: `GET`
- URL: `http://localhost:4000/api/smartphones/1`

### Editar smartphone

- Method: `PUT`
- URL: `http://localhost:4000/api/smartphones/1`
- Body raw JSON:

```json
{
  "brand": "Apple",
  "model": "iPhone 16",
  "price": 1300,
  "storage": "512GB"
}
```

### Eliminar smartphone

- Method: `DELETE`
- URL: `http://localhost:4000/api/smartphones/1`

## Tipos de mantenimiento explicados en el codigo

- Correctivo: middleware global de errores en `src/app.js`.
- Adaptativo: variable `EVENT_MANAGER_URL` en `src/services/eventService.js`.
- Perfectivo: separacion por rutas, controladores, servicios y modelos para facilitar mejoras futuras.
- Preventivo: validaciones del modelo en `src/models/smartphoneModel.js`.


fetch("http://localhost:4000/api/smartphones", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    brand: "Samsung",
    model: "S25",
    price: 1200,
    storage: "256GB"
  })
})
.then(res => res.json())
.then(data => console.log(data))
.catch(err => console.error(err));

para usar, http://localhost:4000/api/smartphones