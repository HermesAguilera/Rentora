# Backend MVP de Rentora

Rentora es una plataforma de alquiler de espacios de almacenamiento entre particulares (peer-to-peer) en Honduras. Este repositorio contiene el backend desarrollado en Laravel 11/12.

---

## 🚀 Instrucciones de Configuración

1. Clona el repositorio y navega dentro de él.
2. Ejecuta:

   ```bash
   composer install
   ```

3. Copia el archivo `.env.example` a `.env` y configura tu base de datos y variables de entorno.

   ```bash
   cp .env.example .env
   ```

4. Genera la clave de la aplicación:

   ```bash
   php artisan key:generate
   ```

5. Ejecuta las migraciones y los seeders de la base de datos:

   ```bash
   php artisan migrate --seed
   ```

6. Inicia el servidor de desarrollo usando Laravel Sail:

   ```bash
   ./vendor/bin/sail up -d
   ```

   O utilizando el servidor integrado de Laravel:

   ```bash
   php artisan serve
   ```

---

## 🏗️ Vista General de la Arquitectura

```text
+-----------------------+
|   Cliente (Web/Móvil) |
+-----------+-----------+
            |
            | HTTP / REST
            |
+-----------v-----------+
|     Nginx / Router    |
+-----------+-----------+
            |
+-----------v-----------+
| Laravel App (Rentora) |
|                       |
|  +-----------------+  |
|  |  Controladores  |  |
|  +--------+--------+  |
|           |           |
|  +--------v--------+  |
|  |    Servicios    |  |  <- Lógica de Negocio
|  +--------+--------+  |
|           |           |
|  +--------v--------+  |
|  |     Modelos     |  |  <- Acceso a Datos / Repositorio
|  +--------+--------+  |
+-----------+-----------+
            |
    +-------+-------+
    |               |
+---v----+      +---v---+
| MySQL  |      | Redis |
+--------+      +-------+
```

---

## 📐 Patrón Servicio/Repositorio

Utilizamos el **Patrón de Servicio** para desacoplar la lógica de negocio de la capa HTTP (Controladores).

### Controladores

- Manejan las solicitudes HTTP.
- Realizan validaciones mediante **Form Requests**.
- Formatean respuestas mediante **API Resources**.
- No contienen reglas de negocio complejas.

### Servicios

Clases como:

- `BookingService`
- `SpaceService`

Responsabilidades:

- Contener la lógica central del negocio.
- Procesar datos.
- Coordinar transiciones de estado (por ejemplo, `BookingStateMachine`).
- Despachar eventos del sistema.

### Modelos / Repositorios

Los modelos de Eloquent se utilizan directamente para el acceso a datos, actuando como una capa de repositorio implícita para mantener la simplicidad del MVP sin perder la expresividad de las consultas.

---

## 📡 API Endpoints

### Auth

| Método | Endpoint | Descripción |
|---------|----------|-------------|
| POST | `/api/v1/auth/register` | Registrar un nuevo usuario |
| POST | `/api/v1/auth/login` | Autenticar usuario |
| POST | `/api/v1/auth/logout` | Revocar token |

### Spaces

| Método | Endpoint | Descripción |
|---------|----------|-------------|
| GET | `/api/v1/spaces` | Listar espacios activos |
| POST | `/api/v1/spaces` | Crear espacio (borrador) |
| POST | `/api/v1/spaces/{uuid}/publish` | Enviar espacio para revisión |

### Bookings

| Método | Endpoint | Descripción |
|---------|----------|-------------|
| POST | `/api/v1/bookings` | Crear solicitud de reserva |
| POST | `/api/v1/bookings/{uuid}/confirm` | El anfitrión confirma la reserva |
| POST | `/api/v1/bookings/{uuid}/cancel` | Cancelar una reserva |

### Reviews

| Método | Endpoint | Descripción |
|---------|----------|-------------|
| POST | `/api/v1/reviews` | Enviar una reseña para una reserva completada |
| GET | `/api/v1/spaces/{uuid}/reviews` | Obtener las reseñas de un espacio |

### Admin

| Método | Endpoint | Descripción |
|---------|----------|-------------|
| GET | `/api/v1/admin/stats` | Estadísticas del panel de control |
| POST | `/api/v1/admin/spaces/{uuid}/approve` | Aprobar espacio pendiente |
| POST | `/api/v1/admin/users/{uuid}/suspend` | Suspender cuenta de usuario |

---

## 🛠️ Stack Tecnológico

- **Laravel 11/12**
- **MySQL**
- **Redis**
- **Laravel Sanctum** (Autenticación API)
- **Laravel Sail** (Entorno de desarrollo)
- **Nginx** (Proxy Web)

---

## 📄 Licencia

Proyecto desarrollado como MVP para Rentora.

<!-- Contribución de Donalson Hernandez -->