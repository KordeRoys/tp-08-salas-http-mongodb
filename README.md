# TP 8: reservas de salas con Express y MongoDB

Aplicación web y API REST para consultar y crear reservas de salas. Los datos se guardan en MongoDB mediante Mongoose Altas Free (M0).

## 1. Origen de la copia

Este proyecto es una copia/evolución de `TP7/tp-07-salas-mongodb`. Conserva la aplicación Express y las vistas EJS, e integra MongoDB en el servicio usado por las rutas web y la API. El `name` del proyecto en `package.json` y `package-lock.json` todavía es `tp-07-salas-mongodb`; no afecta la ejecución.

## 2. Versiones

Versiones observadas en este entorno:

| Herramienta o dependencia | Versión |
|---|---:|
| Node.js | 24.22.1 |
| npm | 11.19.1 |
| Express | 5.3.0 |
| Mongoose | 9.11.4 |
| EJS | 6.0.1 |
| express-ejs-layouts | 2.5.1 |
| Morgan | 1.12.1 |
| ESLint | 10.13.0 |
| Prettier | 3.9.10 |

## 3. Preparación de MongoDB Atlas

1. Crear un clúster en MongoDB Atlas.
2. En **Database Access**, crear un usuario de base de datos. No usar la contraseña de la cuenta de Atlas como contraseña de aplicación.
3. En **Network Access**, permitir la IP pública desde la que se ejecutará la aplicación. Evitar `0.0.0.0/0`, que permite conexiones desde cualquier IP.
4. En el clúster, seleccionar **Connect > Drivers** y copiar la URI para Node.js.
5. Desde la raíz del proyecto, crear `.env` copiando `.env.example`.
6. Completar `MONGODB_URI` en `.env` con la URI propia. El ejemplo utiliza la base de datos `reservas_salas_u8`:

   ```dotenv
   PORT=3000
   NODE_ENV=development
   MONGODB_URI=mongodb+srv://<USUARIO>:<PASSWORD>@<CLUSTER>.mongodb.net/reservas_salas_u8?retryWrites=true&w=majority
   ```

   Reemplazar los valores entre `< >`. Codificar los caracteres especiales de la contraseña para que sean válidos en una URI. No publicar ni compartir `.env`; `.gitignore` lo excluye del repositorio. `.env.example` es solo una plantilla y no contiene credenciales reales.

La aplicación obtiene la base de datos del nombre que aparece en la ruta de `MONGODB_URI`. El esquema especifica la colección `reservas`.

## 4. Entorno, DNS e inicio

Variables de entorno:

| Variable | Uso | Valor de ejemplo |
|---|---|---|
| `PORT` | Puerto HTTP; debe ser un entero entre 1 y 65535. | `3000` |
| `NODE_ENV` | Selecciona el formato de registro de Morgan. | `development` |
| `MONGODB_URI` | URI `mongodb://` o `mongodb+srv://` de la base de datos. | No usar una URI real en documentación. |

En `src/config/base-datos.js` se ajustan las consultas DNS de Node.js con `dns.setServers(["8.8.8.8", "1.1.1.1"])` (Google y Cloudflare), para resolver los registros SRV de Atlas. La selección de servidor de Mongoose tiene un tiempo máximo de 5 segundos. El ajuste DNS aplica al proceso de Node.js; si la red bloquea esos resolutores, consultar las políticas de red/DNS antes de cambiarlo.

Comandos desde la raíz del proyecto:

```powershell
npm install
npm start
```

`npm start` carga las variables de `.env` e inicia `src/index.js` con `--watch`. Por defecto, la aplicación queda disponible en `http://localhost:3000`; el puerto se puede cambiar con `PORT`.

Otros comandos definidos en `package.json`:

| Comando | Propósito |
|---|---|
| `npm run comprobardb` | Comprobar la conexión configurada. |
| `npm run crear` | Insertar una reserva de ejemplo directamente en MongoDB. |
| `npm run listar` | Listar documentos desde MongoDB. |
| `npm run check` | Ejecutar las comprobaciones de formato y ESLint. |

## 5. Estructura por capas

| Ruta | Responsabilidad |
|---|---|
| `src/index.js` | Lee configuración, conecta MongoDB e inicia/cierra el servidor. |
| `src/app.js` | Configura Express, middleware, rutas, vistas y respuestas 404. |
| `src/config/entorno.js` | Lee y valida las variables de entorno. |
| `src/config/base-datos.js` | Configura DNS y conexión/desconexión de Mongoose. |
| `src/rutas/` | Asocia endpoints con middleware y controladores. |
| `src/controladores/reservas.js` | Coordina solicitudes y respuestas HTTP/HTML/JSON. |
| `src/servicios/reservas-mongo.js` | Consulta, representa y crea reservas en MongoDB. |
| `src/modelos/reservas.js` | Define el esquema y modelo Mongoose `Reserva`. |
| `src/middleware/` | Valida entradas, prepara datos de solicitud y maneja errores/registros. |
| `views/` | Plantillas EJS para páginas HTML. |
| `public/` | Archivos estáticos. |
| `scripts/` | Scripts para comprobar conexión, crear y listar datos. |

## 6. Endpoints

La base de la API es `/api/reservas`. Las rutas de página devuelven HTML; las rutas `/api/` devuelven JSON.

| Método y ruta | Descripción | Respuestas principales |
|---|---|---|
| `GET /` | Página de inicio. | `200` HTML |
| `GET /estado` | Estado del servicio y cantidad/códigos de reservas. | `200` JSON; error inesperado `500` JSON |
| `GET /reservas` | Lista las reservas. | `200` HTML; error inesperado `500` HTML |
| `GET /reservas/nueva` | Formulario para crear una reserva. | `200` HTML |
| `POST /reservas` | Valida y crea una reserva desde el formulario. | `302` redirige al listado; entrada inválida `400` HTML |
| `GET /reservas/:id` | Muestra una reserva en HTML. | `200`; identificador válido inexistente `404`; formato inválido `400` |
| `GET /api/reservas` | Lista reservas en JSON. Acepta filtro opcional `?sala=Sala%20Norte`. | `200` JSON; filtro vacío o no textual `400`; error inesperado `500` |
| `GET /api/reservas/:id` | Busca una reserva por ObjectId. | `200` JSON; ID mal formado `400` JSON; ID válido inexistente `404` JSON |
| `POST /api/reservas` | Valida y guarda una reserva JSON. | `201` JSON; datos inválidos o JSON mal formado `400` JSON; error inesperado `500` JSON |
| `GET /api/prueba-error` | Genera un error intencional para comprobar el manejador. | `500` JSON genérico |
| Ruta API inexistente | Respuesta de ruta no encontrada. | `404` JSON |

`/api/prueba-error` es una ruta de diagnóstico que fuerza un fallo deliberadamente. Usarla solo para probar en desarrollo y retirarla o protegerla antes de publicar/desplegar la aplicación.

## 7. JSON de ejemplo

Solicitud `POST /api/reservas` con `Content-Type: application/json`:

```json
{
  "estudiante": "Ana Pérez",
  "email": "ana@example.com",
  "sala": "Sala Norte",
  "fecha": "2026-11-09",
  "turno": "Mañana",
  "personas": 2
}
```

Respuesta esperada al crear (`201 Created`; el `id` lo genera MongoDB):

```json
{
  "id": "6735a1b2c3d4e5f678901234",
  "estudiante": "Ana Pérez",
  "email": "ana@example.com",
  "sala": "Sala Norte",
  "fecha": "2026-11-09",
  "turno": "Mañana",
  "personas": 2,
  "estado": "pendiente"
}
```

El ID de la respuesta es ilustrativo, no corresponde a un documento real.

## 8. Validaciones y límites

El middleware valida las solicitudes web y API antes de llamar al servicio de creación; Mongoose también valida el esquema al guardar.

| Campo | Regla implementada | Límite |
|---|---|---|
| `estudiante` | Texto requerido; se quitan espacios de los extremos. | No se limita longitud ni formato adicional. |
| `email` | Texto requerido; debe contener `@`; se quitan espacios de los extremos. | No se valida completamente que sea una dirección de correo válida. |
| `sala` | Para crear una reserva, debe ser `Sala Norte`, `Sala Sur` o `Sala Multimedia`. | El filtro de listado `?sala=` solo requiere texto no vacío; un nombre de sala desconocido devuelve una lista vacía, no un `400`. |
| `fecha` | Texto requerido y recortado. | No comprueba fecha calendario ni formato `YYYY-MM-DD`. |
| `turno` | Debe ser `Mañana`, `Tarde` o `Noche`. | No hay más reglas de horario. |
| `personas` | Entero entre 1 y 6 inclusive. | No admite fracciones ni valores fuera del rango. |
| `estado` | Se asigna `pendiente` por defecto; el esquema admite `pendiente` o `confirmado`. | No se recibe del formulario/API de creación. |

No se implementan autenticación/autorización, prevención de reservas duplicadas ni reglas de privacidad adicionales. No enviar datos personales reales en ejemplos o pruebas compartidas.

## 9. Matriz de resultados HTTP

Resultados definidos por la implementación. Los casos que consultan o escriben datos requieren que la aplicación esté conectada a MongoDB.

| Caso | Ejemplo | HTTP | Formato / resultado |
|---|---|---:|---|
| Listado API correcto | `GET /api/reservas` | `200` | Arreglo JSON; puede estar vacío. |
| Creación correcta | `POST /api/reservas` con el JSON de ejemplo | `201` | Reserva guardada en MongoDB y devuelta en JSON. |
| Campo inválido | `POST /api/reservas` con `"personas": 7` | `400` | JSON de error; no se llama al servicio de creación. |
| JSON mal formado | `POST /api/reservas` con cuerpo que no sea JSON válido | `400` | JSON genérico; no se crea una reserva. |
| ID mal formado | `GET /api/reservas/no-es-un-objectid` | `400` | JSON de error de identificador. |
| ID bien formado pero inexistente | `GET /api/reservas/000000000000000000000000` | `404` | JSON indicando que no existe la reserva. |
| Ruta API inexistente | `GET /api/no-existe` | `404` | JSON de ruta no encontrada. |
| Error inesperado de API | `GET /api/prueba-error` | `500` | JSON genérico; no expone traza ni mensaje interno. |
| Error inesperado en página | Fallo consultando `GET /reservas` | `500` | Página HTML de error con código 500. |

Para comprobar respuestas en Postman, usar `http://localhost:3000` (o el puerto configurado). En `POST /api/reservas`, seleccionar **Body > raw > JSON**. Para JSON mal formado, enviar intencionalmente un cuerpo inválido con `Content-Type: application/json`. En un `500`, el servidor registra el identificador de solicitud y el tipo de error; la respuesta al cliente no contiene stack trace ni secretos.

La matriz documenta los resultados esperados por código. No implica que se haya probado una conexión a una cuenta Atlas específica.

## 10. Prueba de persistencia después de reiniciar

1. Confirmar que `.env` apunta a la base de datos de prueba y ejecutar `npm start`.
2. En Postman, enviar el JSON de ejemplo a `POST http://localhost:3000/api/reservas`.
3. Confirmar `201 Created` y guardar el valor `id` devuelto.
4. Detener el servidor con `Ctrl+C`.
5. Iniciarlo nuevamente con `npm start`.
6. En Postman, enviar `GET http://localhost:3000/api/reservas/<id-guardado>`.
7. El resultado debe ser `200 OK` con la misma reserva y el mismo `id`. También se puede comprobar en Atlas **Data Explorer > reservas_salas_u8 > reservas**.

Una reserva que aparece después de reiniciar confirma persistencia en MongoDB; una respuesta `201` por sí sola no comprueba el reinicio. No ejecutar la prueba contra una base con datos importantes.

## 11. Scripts de base de datos

| Comando | Resultado esperado |
|---|---|
| `npm run comprobardb` | Informa que se estableció la conexión si la URI, IP y DNS son correctos. |
| `npm run crear` | Inserta una reserva de ejemplo y muestra su `_id`. |
| `npm run listar` | Muestra las reservas existentes en la colección. |

`npm run crear` inserta un nuevo documento cada vez que se ejecuta. Usar una base de pruebas y no inferir que se guardó si el script informa un error.

## 12. Comparación con TP 07

En TP 07, la web guardaba las reservas en memoria; MongoDB se usaba solo mediante scripts. En TP 08, la web y la API consultan y guardan reservas en MongoDB, por lo que los datos persisten al reiniciar. TP 08 también agrega endpoints JSON y usa ObjectId en lugar de IDs numéricos. La aplicación conserva las páginas web y las validaciones principales.