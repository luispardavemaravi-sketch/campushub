# SportHub | Portal del estudiante

Frontend React del proyecto integrador JavaScript Avanzado. Conserva la presentación del Avance 2 y usa una copia local de `api-mock/db.json`.

## Ejecutar

Requiere Node.js LTS y npm. Desde esta carpeta:

```bash
npm ci
npm run dev
```

Vite inicia el portal en `http://localhost:5173`. Para validar la compilación de producción:

```bash
npm run build
```

## Rutas

- `/` — inicio.
- `/catalogo` y `/catalogo/:id` — listado filtrable y detalle de canchas.
- `/login` — inicio de sesión simulado con usuarios locales.
- `/mis-reservas` y `/nueva-reserva` — rutas protegidas para estudiantes.
- Las rutas desconocidas muestran la página 404.

## Datos y reglas compartidas

`src/data/db.json` es la copia local de `../api-mock/db.json`. Las reservas creadas se guardan en `localStorage`. `src/core/modelos.js` y `src/core/validadores.js` se sincronizaron con `core-js`; se reutilizan `Usuario`, `Reserva`, las validaciones de fecha y hora, y la regla para evitar cruces de horario.

Cuenta de demostración: código `U20231234`, contraseña `cliente123`.
