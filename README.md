# CampusHub Labs

### Proyecto Integrador — JavaScript Avanzado | Avance 1

Sistema web académico orientado a la gestión de laboratorios y reservas, desarrollado con JavaScript, TypeScript, Angular y Bootstrap, utilizando una API REST simulada mediante JSON Server.

**Universidad:** Universidad Tecnológica del Perú (UTP)  
**Curso:** JavaScript Avanzado  
**Etapa:** Primer avance del proyecto integrador  
**Repositorio:** https://github.com/luispardavemaravi-sketch/campushub

---

## 1. Descripción del proyecto

CampusHub Labs es una aplicación web que permite consultar, registrar, actualizar y eliminar laboratorios, así como visualizar, registrar y cancelar reservas.

El objetivo de este primer avance es aplicar conceptos de JavaScript avanzado, programación orientada a objetos, validaciones, programación funcional, consumo de API REST y desarrollo de componentes Angular.

La aplicación utiliza una arquitectura frontend–API simulada, con separación de responsabilidades entre lógica de negocio, presentación, servicios y almacenamiento de datos.

## 2. Integrantes y responsabilidades

| Integrante | Responsabilidad |
|---|---|
| Luisangel Pardave | Líder, arquitectura inicial, `core-js`, API Mock, servicios Angular, integración y revisión de Pull Requests |
| Alexander Vilca | Formulario reactivo para creación y edición de laboratorios |
| Ítalo Quispe | Listado, filtros, detalle y eliminación de laboratorios; componente de navegación |
| Mariana Ramos | Gestión de reservas, pipe personalizado y directiva de atributo |

El proyecto se desarrolla colaborativamente mediante Git y GitHub, utilizando ramas individuales y Pull Requests.

## 3. Tecnologías utilizadas

| Tecnología | Aplicación |
|---|---|
| JavaScript ES Modules | Lógica de negocio y validaciones |
| Node.js | Ejecución de JavaScript y pruebas |
| TypeScript | Desarrollo de componentes y servicios |
| Angular 22 | Interfaz web |
| Bootstrap 5 | Diseño responsivo y estilos |
| RxJS | Manejo de operaciones asíncronas |
| JSON Server | Simulación de API REST |
| Git y GitHub | Control de versiones y colaboración |
| Node Test Runner | Pruebas automatizadas |

## 4. Estructura del proyecto

```text
campushub/
├── angular-admin/
│   └── src/
│       ├── app/
│       │   ├── components/
│       │   │   ├── laboratorio-list/
│       │   │   ├── laboratorio-form/
│       │   │   ├── laboratorio-detail/
│       │   │   ├── reserva-list/
│       │   │   └── navbar/
│       │   ├── config/
│       │   ├── directives/
│       │   ├── models/
│       │   ├── pipes/
│       │   └── services/
│       └── core/
├── api-mock/
│   ├── db.json
│   └── package.json
├── core-js/
│   ├── validadores.js
│   ├── modelos.js
│   ├── estadisticas.js
│   ├── core.test.js
│   └── package.json
└── README.md
```

### Descripción de los módulos

**core-js:** contiene las validaciones, los modelos orientados a objetos, las funciones de estadísticas y las pruebas automatizadas.

**api-mock:** contiene el servidor REST simulado y los datos JSON.

**angular-admin:** contiene la aplicación web, sus componentes, formularios, rutas, modelos, servicios, pipe y directiva.

## 5. Funcionalidades del avance 1

### Gestión de laboratorios

- Consultar los laboratorios registrados.
- Filtrar por nombre y sede.
- Visualizar información detallada.
- Crear nuevos laboratorios.
- Editar laboratorios existentes.
- Eliminar laboratorios con confirmación.
- Identificar laboratorios disponibles y en mantenimiento.
- Validar capacidad entre 1 y 60.

### Gestión de reservas

- Consultar reservas registradas.
- Visualizar laboratorio y estudiante asociado.
- Mostrar estados mediante un pipe personalizado.
- Crear reservas.
- Cancelar reservas.
- Validar fecha y horario.
- Comprobar conflictos de horario.
- Asociar una reserva con un estudiante y laboratorio.

### JavaScript avanzado

Se implementaron conceptos como:

- Clases y objetos.
- Constructores, métodos y getters.
- Expresiones regulares.
- Arrow functions.
- `map()`, `filter()`, `reduce()` y `sort()`.
- `Map` y `Set`.
- Spread operator.
- Closures.
- Validación de fechas y horas.
- Detección de superposición entre reservas.

## 6. Requisitos previos

Para ejecutar el proyecto se necesita:

- Node.js y npm instalados.
- Git instalado.
- Un editor de código como Visual Studio Code.
- Un navegador web actualizado.

## 7. Instalación y ejecución

### 7.1. Clonar el repositorio

```bash
git clone https://github.com/luispardavemaravi-sketch/campushub.git
cd campushub
git switch main
```

### 7.2. Instalar dependencias de Angular

```bash
cd angular-admin
npm install
npm run sync-core
cd ..
```

El comando `sync-core` copia las funciones compartidas de `core-js` al directorio `angular-admin/src/core`.

### 7.3. Instalar dependencias del API

```bash
cd api-mock
npm install
cd ..
```

### 7.4. Iniciar el API REST

Desde `api-mock`:

```bash
npm run api
```

El servidor se ejecuta en:

http://localhost:3000

Recursos disponibles:

- http://localhost:3000/usuarios
- http://localhost:3000/laboratorios
- http://localhost:3000/reservas

### 7.5. Iniciar Angular

En una segunda terminal, desde `angular-admin`:

```bash
npm start
```

La aplicación normalmente estará disponible en:

http://localhost:4200

Si el puerto se encuentra ocupado, se deberá utilizar el puerto alternativo indicado por Angular.

Ambos servidores deben permanecer ejecutándose para utilizar las funcionalidades que consultan el API.

## 8. API REST

La API simulada utiliza operaciones HTTP para consultar y modificar datos.

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/usuarios` | Consultar usuarios |
| GET | `/laboratorios` | Consultar laboratorios |
| GET | `/laboratorios/:id` | Consultar un laboratorio |
| POST | `/laboratorios` | Crear laboratorio |
| PUT | `/laboratorios/:id` | Actualizar laboratorio |
| DELETE | `/laboratorios/:id` | Eliminar laboratorio |
| GET | `/reservas` | Consultar reservas |
| GET | `/reservas?usuarioId=3` | Filtrar reservas por usuario |
| POST | `/reservas` | Registrar reserva |
| DELETE | `/reservas/:id` | Cancelar reserva |

Los datos iniciales del proyecto incluyen:

- 8 usuarios.
- 8 laboratorios.
- 20 reservas.

JSON Server utiliza el archivo `api-mock/db.json` para almacenar y actualizar los registros.

## 9. Rutas de Angular

| Ruta | Vista |
|---|---|
| `/laboratorios` | Listado de laboratorios |
| `/laboratorios/nuevo` | Crear laboratorio |
| `/laboratorios/:id` | Detalle de laboratorio |
| `/laboratorios/:id/editar` | Editar laboratorio |
| `/reservas` | Gestión de reservas |

## 10. Formularios, pipe y directiva

### Formularios reactivos

Se utiliza `FormBuilder`, `FormGroup` y `Validators` para gestionar los datos ingresados.

Las validaciones permiten identificar campos obligatorios, valores fuera de rango y formatos incorrectos antes de enviar solicitudes al API.

Para editar un laboratorio, se consulta su información y se utiliza `patchValue()` para cargar los valores existentes.

### Pipe `estadoReserva`

Transforma el estado almacenado en una representación adecuada para el usuario.

Estados principales:

- Aprobada.
- Pendiente.
- Rechazada.

### Directiva `appResaltarMantenimiento`

Permite identificar visualmente los laboratorios cuyo estado es `mantenimiento`, aplicando estilos de advertencia.

También se utiliza `ngClass` para establecer clases CSS de manera dinámica.

## 11. Pruebas automatizadas

Las pruebas del núcleo JavaScript se encuentran en:

`core-js/core.test.js`

Para ejecutarlas:

```bash
cd core-js
npm test
```

Se utilizan `node:test` y `node:assert/strict`.

Las pruebas contemplan validación de correos institucionales, códigos estudiantiles, fechas, horas, laboratorios, reservas, superposición de horarios, modelos orientados a objetos y funciones de estadísticas.

Para comprobar la compilación de Angular:

```bash
cd angular-admin
npm run sync-core
npm run build
```

## 12. Flujo de prueba funcional

Para verificar la aplicación:

1. Iniciar JSON Server.
2. Iniciar Angular.
3. Comprobar la carga de los laboratorios.
4. Probar los filtros por nombre y sede.
5. Verificar el resaltado de mantenimiento.
6. Probar las validaciones del formulario.
7. Crear un laboratorio de prueba.
8. Editar el laboratorio creado.
9. Comprobar la visualización de reservas.
10. Crear y cancelar una reserva de prueba.
11. Eliminar el laboratorio de prueba.
12. Verificar que los registros iniciales permanezcan disponibles.

Se recomienda utilizar datos de demostración y conservar una copia de seguridad de `db.json` antes de realizar operaciones que modifiquen los registros.

## 13. Organización con Git y GitHub

El equipo utiliza las siguientes ramas:

- `main`: versión integrada para la entrega.
- `dev`: integración de funcionalidades.
- `feature/*`: desarrollo individual.
- `fix/*`: correcciones de integración.

Las contribuciones se registran mediante commits y Pull Requests.

El líder del proyecto revisa las contribuciones antes de integrarlas en la rama correspondiente.

## 14. Uso de herramientas de inteligencia artificial

Durante el desarrollo se utilizaron herramientas de asistencia con inteligencia artificial como apoyo para la generación y revisión de propuestas de código, comprensión de conceptos, resolución de errores y depuración.

El equipo es responsable de revisar, integrar, comprobar y explicar el código presentado. La utilización de estas herramientas no sustituye las pruebas ni la comprensión técnica de las funcionalidades implementadas.

## 15. Solución de problemas frecuentes

**La aplicación Angular se muestra, pero los datos no aparecen.**

Comprobar que JSON Server esté ejecutándose en el puerto 3000 y que los endpoints respondan.

**El puerto 4200 está ocupado.**

Detener el proceso Angular anterior o utilizar el puerto alternativo indicado por el servidor.

**Aparecen errores de compilación.**

Revisar la terminal, verificar los imports y ejecutar `npm run build`.

**Los datos cambiaron después de las pruebas.**

Recordar que JSON Server modifica `db.json` al ejecutar solicitudes POST, PUT y DELETE. Restaurar los datos originales desde una copia de seguridad cuando corresponda.

---

## Estado de la entrega

**Avance 1 — CampusHub Labs**

Proyecto desarrollado de forma colaborativa, integrando JavaScript avanzado, Angular y servicios REST simulados para la gestión de laboratorios y reservas.

La entrega final debe acompañarse de las pruebas y evidencias requeridas por la rúbrica académica.