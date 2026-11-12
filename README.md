# SportHub

### Proyecto Integrador — JavaScript Avanzado | Avances 1 y 2

Aplicación para administrar canchas deportivas y permitir que los estudiantes consulten el catálogo y registren solicitudes de reserva.

- **Dominio:** SportHub (aprobado por el docente)
- **Universidad:** Universidad Tecnológica del Perú (UTP)
- **Curso:** JavaScript Avanzado
- **Repositorio:** [campushub en GitHub](https://github.com/luispardavemaravi-sketch/campushub)

## 1. Integrantes

| Integrante | Responsabilidad |
|---|---|
| Luisangel Pardave | Arquitectura, `core-js`, API Mock, servicios Angular e integración |
| Alexander Vilcapoma | Formulario reactivo de creación y edición de canchas |
| Italo Quispe | Lista, filtros, detalle y eliminación de canchas; navegación |
| Mariana Ramos | Reservas, pipe de estado y directiva de mantenimiento |

## 2. Tecnologías

- JavaScript ES Modules y Node.js.
- TypeScript y Angular 22 para el panel administrativo.
- React 18, Vite 6, React Router 6 y Hooks para el portal del estudiante.
- Bootstrap 5 y RxJS.
- JSON Server 0.17.4 para el API simulado.
- Node Test Runner (`node:test`) para `core-js`.

## 3. Estructura del repositorio

```text
campushub/
├── core-js/                 # Validadores, modelos, estadísticas y pruebas
├── api-mock/                # API JSON Server y colección Postman
├── angular-admin/           # Panel administrativo Angular (Avance 1)
└── react-estudiante/        # Portal React del estudiante (Avance 2)
```

## 4. Funcionalidades del Avance 1

### `core-js`

Incluye las clases `Usuario`, `Cancha` y `Reserva`; validadores de correo, código, fecha, hora, cancha y reserva; estadísticas con `reduce`, `Map`, `Set`, `sort` y spread; y un generador de códigos con closure. Sus pruebas se ejecutan con `node:test`.

### `api-mock`

JSON Server expone el contrato REST de SportHub en el puerto `3000`. La base de demostración contiene 10 usuarios (4 administradores y 6 estudiantes), 11 canchas y 30 reservas con códigos consecutivos.

### `angular-admin`

El panel permite listar, filtrar, ver, crear, editar y eliminar canchas. También permite consultar reservas, aprobarlas o rechazarlas y cancelar una reserva. Incluye formularios reactivos, validaciones, navegación, pipe de estado y resaltado de canchas en mantenimiento.

Rutas principales:

| Ruta | Vista |
|---|---|
| `/login` | Inicio de sesión del administrador |
| `/canchas` | Listado y filtros |
| `/canchas/nuevo` | Crear cancha |
| `/canchas/:id` | Detalle |
| `/canchas/:id/editar` | Editar cancha |
| `/reservas` | Gestión de reservas |

## 5. Funcionalidades del Avance 2

`react-estudiante` es una SPA React con Bootstrap y `react-router-dom`. Conserva su estructura y presentación propias del Avance 2. Usa una copia local de `api-mock/db.json`; las reservas nuevas se guardan en `localStorage`.

- Catálogo filtrable por texto y complejo, detalle de cancha y página 404.
- Inicio de sesión simulado para estudiantes; las rutas personales están protegidas.
- Hooks: `useState` para filtros y reservas; `useEffect` para títulos y cuenta regresiva con limpieza; `useContext` para autenticación y tema; `useRef` para enfocar y restablecer el primer campo.
- Formulario controlado que reutiliza `core-js` para validar datos y bloquear cruces de horarios.

Rutas React:

| Ruta | Vista |
|---|---|
| `/` | Inicio |
| `/catalogo` | Catálogo de canchas |
| `/catalogo/:id` | Detalle de cancha |
| `/login` | Inicio de sesión del estudiante |
| `/mis-reservas` | Reservas del estudiante (protegida) |
| `/nueva-reserva` | Formulario de reserva (protegida) |
| `*` | Página 404 |

El Avance 2 trabaja con datos locales. La conexión del portal React al API REST corresponde al Avance 3.

## 6. Instalación

Requisitos: Node.js LTS, npm, Git y un navegador actualizado.

Instala las dependencias de cada módulo desde la raíz del repositorio:

```bash
cd core-js
npm install
cd ../api-mock
npm install
cd ../angular-admin
npm install
npm run sync-core
cd ../react-estudiante
npm ci
```

## 7. Ejecución

### API simulado

En una terminal, desde `api-mock`:

```bash
npm run api
```

El API queda disponible en `http://localhost:3000` y lo consume el panel Angular.

### Panel Angular

En otra terminal, desde `angular-admin`:

```bash
npm start
```

Angular queda disponible en `http://localhost:4200` (o en el puerto alternativo que indique la CLI).

### Portal React

En otra terminal, desde `react-estudiante`:

```bash
npm run dev
```

Vite inicia el portal en `http://localhost:5173`. Este avance usa su copia local de los datos y no requiere iniciar JSON Server.

Para compilar ambos frontends, ejecuta `npm run build` desde cada carpeta correspondiente.

## 8. Credenciales de demostración

- Administrador Angular: `u24254899@utp.edu.pe` / `admin123`.
- Estudiante React: `U20231234` o `luis@utp.edu.pe` / `cliente123`.

## 9. Contrato del API

| Método | Endpoint | Uso |
|---|---|---|
| GET | `/canchas?q=&complejo=` | Listar y filtrar canchas |
| GET | `/canchas/:id` | Ver detalle |
| POST | `/canchas` | Crear cancha |
| PUT | `/canchas/:id` | Actualizar cancha |
| DELETE | `/canchas/:id` | Eliminar cancha |
| GET | `/reservas` | Listar reservas |
| GET | `/reservas?usuarioId=5` | Filtrar reservas por usuario |
| POST | `/reservas` | Registrar reserva |
| PATCH | `/reservas/:id` | Aprobar, rechazar o cancelar sin borrar el registro |
| GET | `/usuarios?correo=` | Buscar usuario para login simulado |

La colección de pruebas está en `api-mock/postman/sporthub-avance-1.postman_collection.json`.

## 10. Validación y compilación

Desde `core-js`, ejecuta las pruebas del núcleo:

```bash
npm test
```

Sincroniza el núcleo y compila Angular:

```bash
cd angular-admin
npm run sync-core
npm run build
```

Compila React:

```bash
cd react-estudiante
npm run build
```

Los detalles de ejecución del portal también están en [`react-estudiante/README.md`](react-estudiante/README.md).

## 11. Uso de herramientas de IA

Se utilizaron herramientas de asistencia para proponer y revisar código y apoyar la depuración. El equipo es responsable de comprender, validar y explicar el código presentado.
