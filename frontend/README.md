# Rentora - Client-Side Web Application (Frontend)

Este directorio contiene el código fuente de la capa de presentación de **Rentora**, una SPA (Single Page Application) desarrollada con **React** y **TypeScript**, optimizada para la gestión eficiente y escalable de alquiler de espacios de almacenamiento P2P (Peer-to-Peer).

El sistema web implementa interfaces adaptativas y modulares orientadas a tres perfiles de usuario bien definidos: **Arrendatarios**, **Anfitriones** y **Administradores**.

---

## 🛠️ Stack Tecnológico y Arquitectura

### Core Stack
* **Biblioteca Principal:** [React 18+](https://react.dev/) (Functional Components & Hooks).
* **Superset de Lenguaje:** [TypeScript](https://www.typescriptlang.org/) para tipado estático estricto y robustez del código.
* **Herramienta de Construcción (Bundler):** [Vite](https://vitejs.dev/) para un HMR (Hot Module Replacement) ultra rápido y optimización en producción.
* **Estilizado y UI:** [Tailwind CSS](https://tailwindcss.com/) acoplado a una metodología de componentes utilitarios y diseño atómico.

### Gestión de Estado e Ingesta de Datos
* **Estado Global:** [React Context API](https://react.dev/learn/passing-data-deeply-with-context) o **Zustand** para la persistencia del estado de autenticación y flujos transversales.
* **Consumo de API & Caché:** [TanStack Query (React Query)](https://tanstack.com/query/latest) para la sincronización de estado asíncrono con el backend de Laravel, optimizando la invalidación de caché, paginación y mutaciones.
* **Cliente HTTP:** [Axios](https://axios-http.com/) configurado con interceptores para inyección automatizada de tokens portadores (`Bearer Token`) gestionados por *Laravel Sanctum*.

---

## 📂 Arquitectura de Directorios (Pattern Structure)

El diseño del proyecto sigue un patrón modular basado en **Feature-Driven Development (FDD)** y separación de responsabilidades:

```text
frontend/
├── .husky/                 # Hooks de Git para automatización de linters
├── public/                 # Assets estáticos globales (favicons, manifest)
├── src/
│   ├── assets/             # Recursos visuales compilables (imágenes, SVGs)
│   ├── components/         # Componentes atómicos comunes y reutilizables (UI)
│   │   ├── ui/             # Botones, inputs, modales genéricos
│   │   └── layout/         # Navbar, Sidebar, Footer compartidos
│   ├── config/             # Configuración de clientes (Axios, constantes globales)
│   ├── context/            # Proveedores de estado global (Auth, Theme)
│   ├── features/           # Módulos encapsulados por dominio de negocio
│   │   ├── auth/           # Login, registro, recuperación de credenciales
│   │   ├── spaces/         # Catálogo, filtros, detalle y publicación de bodegas
│   │   ├── bookings/       # Flujo de reservas, estados y pasarela lógica
│   │   └── admin/          # Panel de control de moderación y analíticas
│   ├── hooks/              # Custom hooks globales reutilizables
│   ├── routes/             # Enrutamiento centralizado y guardas de seguridad
│   ├── services/           # Capa de abstracción de red y llamadas de API (End-points)
│   ├── types/              # Declaraciones e interfaces de TypeScript (.d.ts)
│   ├── utils/              # Funciones helper, formateadores y validadores
│   ├── App.tsx             # Componente raíz
│   └── main.tsx            # Punto de entrada de la aplicación
├── .env.example            # Plantilla de variables de entorno
├── eslint.config.js        # Configuración de análisis estático de código
├── tailwind.config.js      # Configuración del sistema de diseño visual
├── tsconfig.json           # Políticas de compilación de TypeScript
└── vite.config.ts          # Pipeline de configuración de empaquetado Vite

