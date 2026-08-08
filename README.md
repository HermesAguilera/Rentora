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
├── mobile/            # Aplicación móvil (Próximamente)
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

Para desarrollo local basta con PHP 8.2+ y SQLite (no hace falta MySQL ni Redis):

```bash
cd backend
composer install
php artisan key:generate
php artisan storage:link
php artisan migrate --seed
php artisan serve
```

`storage:link` es necesario para que las fotos de los espacios se sirvan en `/storage`.

La API queda en `http://localhost:8000/api/v1`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

La app queda en `http://localhost:5173` y apunta a la API según `VITE_API_URL` (ver `frontend/.env`).

### Cuentas de prueba

| Rol | Correo | Contraseña | Entra a |
| --- | --- | --- | --- |
| Anfitrión e inquilino | `host@rentora.com` | `Rentora123!` | `/app` (+ panel en `/dashboard`) |
| Anfitrión e inquilino | `cliente@rentora.com` | `Rentora123!` | `/app` |
| Administrador | `admin@rentora.com` | `rentora_secure_password_123!` | `/admin` |

El resto de usuarios sembrados (anfitriones e inquilinos con nombres propios) también usan `Rentora123!`.

### Moderación de espacios

Cuando un anfitrión publica un espacio, este queda en estado `pending_review` y **no aparece** en la
búsqueda pública hasta que un administrador lo apruebe:

```text
draft ──publicar──> pending_review ──aprobar──> active
                           └────────rechazar──> rejected
```

La aprobación se hace desde **`/admin/espacios`**, iniciando sesión con la cuenta de administrador.
Rechazar exige un motivo, que le llega al anfitrión como notificación. Solo los usuarios con
`role = admin` pueden entrar; el resto es redirigido y la API responde 403.

### Comisión de la plataforma

Rentora retiene un porcentaje del total de cada reserva, definido en un único lugar:
`config/rentora.php` (`platform_fee_percentage`, actualmente **7%**). Se puede sobrescribir con la
variable de entorno `PLATFORM_FEE_PERCENTAGE`.

La comisión se calcula al crear la reserva y se guarda en `bookings.platform_fee_amount`, así que
cambiar el porcentaje no altera las reservas ya existentes. Al anfitrión se le muestra el monto
exacto en la solicitud, antes de aceptarla.

### Fotos de los espacios

Se suben al publicar el espacio (hasta 10, máximo 5 MB cada una, JPG/PNG/WEBP). La primera es la
principal y es la que aparece en las tarjetas de búsqueda.

Las imágenes se guardan sin redimensionar en `storage/app/public/spaces/{uuid}`. No se generan
miniaturas porque esta instalación de PHP no tiene las extensiones `gd` ni `imagick`; si se
instalan, el lugar para agregar los tamaños es `SpacePhotoController::store`.

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
