# Rentora

Rentora es una plataforma de alquiler de espacios de almacenamiento entre particulares (Peer-to-Peer) que conecta personas con espacio disponible para almacenar bienes con usuarios que necesitan soluciones de almacenamiento seguras, flexibles y accesibles.

El objetivo de la plataforma es aprovechar espacios subutilizados y ofrecer una alternativa económica a los servicios tradicionales de bodegas y mini almacenes.

---

## Características Principales

### Para Arrendatarios

* Buscar espacios de almacenamiento disponibles.
* Filtrar por ubicación, tamaño y precio.
* Reservar espacios de forma segura.
* Gestionar reservas activas.
* Calificar y reseñar anfitriones.

### Para Anfitriones

* Publicar espacios disponibles para alquiler.
* Gestionar disponibilidad y precios.
* Aprobar o rechazar solicitudes de reserva.
* Administrar ingresos y reservas.
* Recibir valoraciones de usuarios.

### Para Administradores

* Moderación de espacios publicados.
* Gestión de usuarios.
* Monitoreo de reservas.
* Estadísticas de uso de la plataforma.
* Gestión de incidencias y reportes.

---

## Arquitectura General

```text
+------------------------------------------------+
|                  Clientes                       |
|      Web App / Mobile App / API Clients         |
+----------------------+-------------------------+
                       |
                       v
+------------------------------------------------+
|                 API REST (Laravel)             |
+------------------------------------------------+
| Auth | Spaces | Bookings | Reviews | Payments |
+------------------------------------------------+
                       |
       +---------------+---------------+
       |                               |
       v                               v
+--------------+              +---------------+
|    MySQL     |              |     Redis     |
| Persistencia |              | Caché/Colas   |
+--------------+              +---------------+
```

---

## Estructura del Proyecto

```text
rentora/
│
├── backend/           # API Laravel
├── frontend/          # Aplicación web
├── mobile/            # Aplicación móvil (opcional)
├── docs/              # Documentación
├── docker/            # Configuración Docker
└── README.md
```

---

## Tecnologías Utilizadas

### Backend

* Laravel 11/12
* PHP 8.3+
* MySQL
* Redis
* Laravel Sanctum
* Queue Jobs
* Events & Listeners

### Frontend

* React / Vue (según implementación)
* TypeScript
* Tailwind CSS

### DevOps

* Docker
* Docker Compose
* Nginx
* GitHub Actions

---

## Flujo Básico de Reserva

1. Un anfitrión publica un espacio.
2. El espacio es revisado y aprobado.
3. Un usuario busca y selecciona un espacio.
4. Se crea una solicitud de reserva.
5. El anfitrión confirma la solicitud.
6. La reserva se activa.
7. Al finalizar, ambas partes pueden dejar reseñas.

---

## Instalación del Proyecto

### Clonar el repositorio

```bash
git clone https://github.com/tu-organizacion/rentora.git
cd rentora
```

### Backend

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## Variables de Entorno

Ejemplo:

```env
APP_NAME=Rentora
APP_ENV=local

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=rentora
DB_USERNAME=root
DB_PASSWORD=

REDIS_HOST=127.0.0.1
```

---

## API

La documentación de la API se encuentra en:

```text
/docs/api
```

o mediante Swagger/OpenAPI si está habilitado.

---

## Roadmap

### MVP

* [x] Registro y autenticación
* [x] Gestión de espacios
* [x] Reservas
* [x] Reseñas
* [x] Panel administrativo

### Futuras Versiones

* [ ] Integración de pagos en línea
* [ ] Aplicación móvil
* [ ] Chat en tiempo real
* [ ] Notificaciones push
* [ ] Sistema de disputas
* [ ] Recomendaciones basadas en IA

---

## Contribución

1. Crear una rama para la funcionalidad.

```bash
git checkout -b feature/nueva-funcionalidad
```

2. Realizar cambios y confirmar.

```bash
git commit -m "feat: nueva funcionalidad"
```

3. Enviar cambios al repositorio.

```bash
git push origin feature/nueva-funcionalidad
```

4. Crear un Pull Request.

---

## Licencia

Este proyecto es propiedad de Rentora y se encuentra en desarrollo.
