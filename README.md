# CampusHub / SportHub — Proyecto Integrador JavaScript Avanzado

**Proyecto Integrador — JavaScript Avanzado | Avance 2**  
Plataforma web integral de gestión y reservas desarrollada bajo una arquitectura multi-frontend (Angular + TypeScript y React + Hooks) conectada a una API REST en formato JSON.

* **Universidad:** Universidad Tecnológica del Perú (UTP)
* **Curso:** JavaScript Avanzado
* **Etapa actual:** Segundo Avance (Arquitectura Multi-Frontend: Angular + React + API REST)
* **Repositorio:** https://github.com/luispardavemaravi-sketch/campushub

---

## 1. Descripción del Proyecto

El sistema resuelve la administración y reserva de espacios/instalaciones académicas y deportivas mediante dos interfaces desacopladas que consumen una misma fuente de datos REST:

1. **Panel Administrativo (`angular-admin`):** Desarrollado en **Angular y TypeScript**, orientado a la gestión operativa (CRUD completo de recursos, control de disponibilidad y administración de reservas mediante servicios HTTP tipados).
2. **Portal del Usuario (`react-estudiante`):** Desarrollado en **React (Vite + Hooks)**, enfocado en la experiencia del estudiante para explorar el catálogo, consultar disponibilidad y gestionar sus propias reservas utilizando `useState` y `useEffect`.
3. **Núcleo de Lógica y Validaciones (`core-js`):** Módulo independiente en JavaScript moderno (ES6+) con modelos, validadores, estadísticas y pruebas unitarias.
4. **Servidor API REST (`api-mock`):** Capa de servicios RESTful en formato JSON que centraliza la persistencia de usuarios, espacios y reservas para ambos clientes.

---

## 2. Arquitectura y Estructura del Repositorio

```text
campushub/
├── angular-admin/        # Frontend Administrativo (Angular + TypeScript + Bootstrap)
│   └── src/app/
│       ├── models/       # Interfaces y tipado estático de entidades
│       ├── services/     # Comunicación REST mediante HttpClient
│       └── ...           # Componentes de listado, detalle y gestión
├── react-estudiante/     # Frontend Portal Estudiante (React + Vite + Hooks)
│   └── src/
│       ├── pages/        # Vistas principales (Inicio, Catálogo, Reservas, Login)
│       └── ...           # Gestión de estado con useState y consumo con useEffect
├── api-mock/             # Servidor API REST (JSON Server - Puerto 3000)
│   ├── db.json           # Base de datos JSON centralizada
│   └── package.json      # Scripts de ejecución de la API
├── core-js/              # Lógica de negocio modular en JavaScript ES6+
│   ├── modelos.js
│   ├── validadores.js
│   ├── estadisticas.js
│   └── core.test.js
├── .gitignore
└── README.md