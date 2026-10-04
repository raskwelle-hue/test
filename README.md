# Forma · Catálogo y solicitudes de cotización

MVP de catálogo web en español. Permite buscar y filtrar seis productos de ejemplo, seleccionar varios, cambiar cantidades, quitar productos y enviar una solicitud con nombre, empresa, teléfono, email y comentarios. El servidor valida y guarda la solicitud antes de devolver un folio. No incluye pagos.

## Stack

- HTML, CSS responsive y JavaScript nativo, sin framework.
- Node.js 22 o superior, módulos ES y servidor HTTP integrado.
- Persistencia inicial: un archivo JSON por solicitud, en `data/quotes/`.
- Pruebas con `node:test`. Sin dependencias externas ni credenciales.
- Ilustraciones SVG locales de ejemplo; no requieren conexión a servicios externos.

## Instalar

Instala Node.js 22 o superior (incluye npm) y Git. Desde una terminal:

```sh
git clone https://github.com/raskwelle-hue/test.git
cd test
npm ci
```

En Windows, si PowerShell bloquea `npm.ps1`, usa `npm.cmd` en lugar de `npm`.

## Ejecutar

```sh
npm start
```

Abre **http://localhost:3000**. El servidor escucha en `127.0.0.1` para desarrollo local. Detén el proceso con Ctrl+C. La carpeta `data/quotes/` se crea al enviar la primera solicitud; necesita permisos de escritura y queda excluida de Git. Los archivos contienen datos personales: mantenlos privados.

Para reiniciar automáticamente el servidor al modificar código:

```sh
npm run dev
```

El puerto puede configurarse mediante la variable de entorno `PORT`. No se necesita archivo `.env`.

## Build y verificaciones

```sh
npm run lint
npm test
npm run build
```

`lint` comprueba sintaxis JavaScript con `node --check`; no es un análisis completo de estilo. El build copia los recursos web a `dist/`, sin transpilación. **Para ejecutar la aplicación completa usa `npm start`**, que sirve `public/` y la API. Abrir `index.html` directamente o publicar solamente `dist/` no permite enviar solicitudes.

## Uso y verificación manual

1. Abre el catálogo y prueba la búsqueda y el filtro de categorías.
2. Pulsa “Solicitar cotización” en dos productos. Cambia sus cantidades; también puedes quitarlos.
3. Completa los datos obligatorios y envía la solicitud.
4. Verás “¡Solicitud registrada!” y un folio. Comprueba que existe `data/quotes/<folio>.json` con los productos y cantidades enviados.
5. Pulsa “Crear otra solicitud”. La solicitud anterior ya fue guardada; el formulario comienza vacío.

La confirmación significa que se guardó en el servidor, **no que se envió un email**. Un error conserva la selección y los datos para intentar nuevamente. No hay un endpoint público para leer las solicitudes.

## Demo para inversionistas

Con `npm start` en ejecución, abre **http://localhost:3000/demo.html**. También hay un enlace en el pie del catálogo.

1. La presentación explica la propuesta de valor, el recorrido del cliente y el alcance real del MVP.
2. Pulsa **Probar la demo interactiva** para abrir `/?demo=1`.
3. Explora el catálogo y pulsa **Preparar ejemplo**. Se cargan tres productos (ocho unidades) y un contacto ficticio `demo@example.com`. Puedes modificar productos, cantidades y datos.
4. Pulsa **Enviar solicitud**. Se utiliza la misma API del MVP y se guarda una solicitud real de prueba con un comentario que la identifica como demo. La confirmación muestra el folio; no envía emails.
5. **Reiniciar** limpia el formulario y la selección para repetir la presentación. No elimina solicitudes guardadas.

La demo no envía automáticamente al precargar datos, no incluye métricas comerciales inventadas y distingue las funciones actuales de las próximas integraciones.

## Estructura principal

```text
public/
  index.html           Página y formulario accesible
  styles.css           Diseño responsive
  app.js               Catálogo, selección y envío
  demo.html            Presentación para inversionistas
  demo.js              Controles y precarga del recorrido
  demo.css             Diseño de presentación y controles
  images/              Ilustraciones SVG locales
server/
  index.js             Arranque y puerto
  app.js               HTTP, recursos estáticos y API
  products.js          Catálogo de ejemplo
  quote-service.js     Validación y normalización
  quote-repository.js  Adaptador de persistencia local
scripts/
  build.js             Copia de assets
  lint.js              Validación sintáctica
  create-images.js     Generador reproducible de ilustraciones
test/app.test.js        Pruebas de integración
PROJECT_STATUS.md      Estado y límites del MVP
CHANGELOG.md           Historial de cambios
```

## API y extensión

- `GET /api/products`: lista de productos.
- `POST /api/quotes`: JSON `{ name, company, phone, email, comments, items: [{ productId, quantity }] }`. Devuelve HTTP 201 con `{ id, createdAt }` solamente después de guardar.
- Cantidades enteras de 1 a 9999, email y teléfono válidos, comentarios de hasta 2000 caracteres. Los productos deben existir y no pueden repetirse en una solicitud. Máximo de cuerpo: 16 KiB.

Para conectar una base de datos, reemplaza `save()` en el repositorio e inyéctalo en `createApp`. Para un catálogo dinámico, sustituye el módulo de productos por un repositorio compartido con la validación. El envío de emails debe ejecutarse tras la persistencia mediante un servicio independiente. Un panel administrativo futuro necesita autenticación y autorización.

Antes de exponerlo públicamente, prepara almacenamiento durable, HTTPS, medidas contra abuso y una política de privacidad. Este MVP no incluye panel, email, protección antispam, idempotencia de envíos ni despliegue público.
