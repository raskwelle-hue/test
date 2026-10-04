# Estado del proyecto

Actualizado: 2026-10-04. Versión: MVP 1.1.0 con demo para inversionistas.

## Objetivo

Crear un catálogo de productos para clientes que puedan seleccionar uno o varios artículos y solicitar una cotización sin pagos ni e-commerce completo. Mantener una base simple que permita agregar base de datos, administración y emails.

## Terminado

- Página en español con diseño responsive, catálogo de seis productos e ilustraciones locales.
- Búsqueda por nombre/descripción y filtro por categoría.
- Selección múltiple sin duplicados, cantidades por producto y eliminación de artículos.
- Formulario con nombre, empresa, teléfono, email, productos, cantidades y comentarios.
- Validación HTML y validación independiente en servidor; límites de datos y del cuerpo HTTP.
- API que guarda cada solicitud como JSON privado y devuelve un UUID como folio después de persistir.
- Confirmación explícita; aviso de que no se envían emails; conservación del formulario ante errores.
- Código separado en catálogo, validación, adaptador de persistencia, API y presentación.
- README con instalación, arranque, build, verificaciones y límites; changelog del primer MVP.
- Git existente con rama `main` y remoto `https://github.com/raskwelle-hue/test.git`.
- Demo para inversionistas en `/demo.html`: propuesta de valor, recorrido y distinción entre funciones actuales y próximas etapas.
- Modo interactivo `/?demo=1` con controles para precargar un ejemplo ficticio (tres productos, ocho unidades) y reiniciar el recorrido. El envío utiliza la API real y el ejemplo se identifica como demo en comentarios.

## Verificación

- `npm ci`: instalación reproducible sin dependencias externas.
- `npm start`: arranca y sirve la página en http://localhost:3000.
- `npm run lint`: sintaxis JavaScript válida (chequeo básico, no ESLint).
- `npm test`: seis pruebas de integración aprobadas. Verifican catálogo e imágenes, página y recursos de demo, múltiples productos persistidos, rechazo de datos inválidos, fallo de almacenamiento, JSON malformado y límite de tamaño.
- `npm run build`: copia de recursos a `dist/` correcta. La API sigue requiriendo Node.js.
- Verificación HTTP de arranque y recursos realizada. No se pudo hacer revisión visual ni interacción real en navegador: el entorno no tiene un navegador conectado. Queda pendiente comprobar manualmente escritorio y móvil siguiendo el README.

## Qué falta

- Reemplazar productos ficticios por catálogo e imágenes reales.
- Base de datos durable y mecanismo operativo para consultar las solicitudes.
- Panel administrativo con autenticación y permisos.
- Envío de emails, reintentos y seguimiento comercial.
- Despliegue público, HTTPS, controles contra abuso y política de privacidad.
- Pruebas de interfaz automatizadas y revisión visual en dispositivos reales.

## Decisiones importantes

- JavaScript nativo y Node.js sin dependencias para reducir instalación y mantenimiento.
- Un archivo por solicitud evita sobrescribir solicitudes concurrentes; la escritura ocurre antes de la confirmación.
- UUID completo como folio; se conserva nombre del producto y cantidad en cada solicitud.
- `data/` excluido de Git y fuera de los recursos públicos. No se incluyen secretos ni datos personales en el repositorio.
- No hay precios, carrito de compra, cobros ni integraciones externas.
- Servidor ligado a localhost; el despliegue debe definir explícitamente cómo exponerlo.
- No se persiste el borrador del cliente en almacenamiento del navegador; recargar pierde la selección.
- La demo precarga datos únicamente por acción explícita del presentador y guarda una solicitud solo al enviar. Reiniciar no borra archivos guardados. No se presentan cifras de ventas, clientes o tracción como evidencia.

## Próximos pasos recomendados

1. Validar el flujo en escritorio/móvil y reemplazar el catálogo de ejemplo por productos reales.
2. Conectar una base de datos y un panel privado para gestionar las solicitudes.
3. Incorporar emails y preparar el despliegue con HTTPS, controles de abuso y privacidad.

## Problemas conocidos y límites

- La persistencia local requiere disco escribible y permanente. No sirve para hosting estático o instancias efímeras sin adaptar el repositorio.
- No se envían emails ni se promete contacto automático; para gestionar solicitudes hoy hay que revisar los archivos privados.
- No hay rate limiting ni idempotencia: un reintento después de una interrupción de red puede registrar otra solicitud.
- Build sin empaquetado/minificación; apropiado para este MVP pequeño.
- Revisión visual y pruebas reales del formulario pendientes por falta de navegador disponible en el entorno.

El MVP inicial se publicó en `main` con commit `b838cc63afbcb4ace1f299d3d127b6d33af3afda`. Este estado incluye la demo para inversionistas; consulta el historial de Git para su commit y publicación definitiva.
