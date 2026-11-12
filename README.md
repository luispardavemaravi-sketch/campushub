# SportHub

### Proyecto Integrador — JavaScript Avanzado | Avance 1

Aplicación web para administrar canchas deportivas y sus reservas. El proyecto aplica JavaScript moderno, programación orientada a objetos, validaciones, Angular y una API REST simulada con JSON Server.

**Universidad:** Universidad Tecnológica del Perú (UTP)  
**Curso:** JavaScript Avanzado  
**Avance:** 1
**Repositorio:** https://github.com/luispardavemaravi-sketch/campushub

## 1. Descripción

SportHub permite consultar canchas, filtrarlas por nombre y complejo, ver su detalle, crear y editar registros, y eliminarlos. También permite consultar y registrar reservas, detectar cruces de horario, y gestionar sus estados desde el panel Angular.

El sistema usa `core-js` como núcleo compartido para validaciones, modelos y estadísticas. `api-mock` ofrece los recursos REST y `angular-admin` contiene el panel administrativo.

## 2. Integrantes

| Integrante | Responsabilidad |
|---|---|
| Luisangel Pardave | Arquitectura, `core-js`, API Mock, servicios Angular e integración |
| Alexander Vilca | Formulario reactivo de creación y edición de canchas |
| Italo Quispe | Lista, filtros, detalle y eliminación de canchas; navegación |
| Mariana Ramos | Reservas, pipe de estado y directiva de mantenimiento |

## 3. Tecnologías

- JavaScript ES Modules y Node.js.
- TypeScript y Angular 22.
- Bootstrap 5 y RxJS.
- JSON Server 0.17.4.
- Node Test Runner (`node:test`) para `core-js`.

## 4. Estructura

```text
campushub/
├── core-js/                 # Validadores, modelos, estadísticas y pruebas
├── api-mock/
│   ├── db.json              # Datos de demostración
│   └── postman/             # Colección de pruebas REST
└── angular-admin/
    └── src/app/
        ├── components/      # Canchas, reservas, login y navegación
        ├── directives/      # Resaltado de canchas en mantenimiento
        ├── models/          # Interfaces TypeScript
        ├── pipes/           # Estado de reserva
        └── services/        # Acceso HTTP y autenticación
```

## 5. Funcionalidades del Avance 1

### Canchas

- Listar y filtrar por nombre y complejo.
- Consultar detalle.
- Crear, editar y eliminar mediante el API.
- Validar nombre, capacidad (1 a 60), implementos y estado.
- Resaltar canchas en mantenimiento.

### Reservas

- Consultar y registrar reservas asociadas a un estudiante y una cancha.
- Validar fechas, horas y duración.
- Evitar cruces de horario para la misma cancha y fecha.
- Aprobar o rechazar reservas desde el panel.
- Cancelar una reserva con `DELETE /reservas/:id`.
- Mostrar el estado con el pipe `estadoReserva`.

### JavaScript avanzado

`core-js` incluye las clases `Usuario`, `Cancha` y `Reserva`; validadores con expresiones regulares; métodos de arreglo como `filter`, `reduce` y `sort`; `Map`, `Set`, spread operator y un generador de códigos con closure.

## 6. Instalación y ejecución

Requisitos: Node.js, npm, Git y un navegador actualizado.

### Instalar dependencias

```bash
cd angular-admin
npm install
npm run sync-core
cd ../api-mock
npm install
```

### Iniciar JSON Server

Desde `api-mock`:

```bash
npm run api
```

El API queda disponible en `http://localhost:3000`.

### Iniciar Angular

En otra terminal, desde `angular-admin`:

```bash
npm start
```

Angular queda disponible en `http://localhost:4200` (o en el puerto alternativo que indique la CLI).

### Credenciales de demostración

- Administrador: `u24254899@utp.edu.pe` / `admin123`.
- Estudiante: `luis@utp.edu.pe` / `cliente123`.

## 7. API REST

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
| PATCH | `/reservas/:id` | Actualizar estado en el panel |
| DELETE | `/reservas/:id` | Cancelar reserva |
| GET | `/usuarios?correo=` | Buscar usuario para el login simulado |

La base de datos de demostración incluye 10 usuarios, 11 canchas y 28 reservas. Incluye registros pendientes, aprobados y rechazados para las pruebas del avance.

La colección Postman está en `api-mock/postman/sporthub-avance-1.postman_collection.json`.

## 8. Rutas Angular

| Ruta | Vista |
|---|---|
| `/login` | Inicio de sesión del administrador |
| `/canchas` | Listado y filtros |
| `/canchas/nuevo` | Crear cancha |
| `/canchas/:id` | Detalle |
| `/canchas/:id/editar` | Editar cancha |
| `/reservas` | Gestión de reservas |

## 9. Validación y pruebas

Las pruebas del núcleo están en `core-js/core.test.js`. Desde `core-js`, ejecútalas con:

```bash
npm test
```

Para comprobar la sincronización del núcleo y la compilación del panel:

```bash
cd angular-admin
npm run sync-core
npm run build
```

La colección Postman permite probar los métodos HTTP del API. Para las solicitudes de creación, usa registros de demostración y elimina los datos temporales al terminar.

## 10. Uso de herramientas de IA

Se utilizaron herramientas de asistencia para proponer y revisar código y apoyar la depuración. El equipo es responsable de comprender, validar y explicar el código presentado.
