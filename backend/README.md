# Rentora Backend MVP

Rentora is a peer-to-peer storage rental platform in Honduras. This repository contains the Laravel 11/12 backend.

## Setup Instructions

1. Clone the repository and navigate into it.
2. Run `composer install`.
3. Copy `.env.example` to `.env` and configure your database and environment variables.
4. Generate application key: `php artisan key:generate`.
5. Run migrations and seed the database: `php artisan migrate --seed`.
6. Start the development server using Laravel Sail: `./vendor/bin/sail up -d` or using `php artisan serve`.

## Architecture Overview

```text
+-----------------------+
|   Client (Web/Mobile) |
+-----------+-----------+
            | HTTP / REST
+-----------v-----------+
|    Nginx / Router     |
+-----------+-----------+
            |
+-----------v-----------+
| Laravel App (Rentora) |
|                       |
|  +-----------------+  |
|  |   Controllers   |  |
|  +--------+--------+  |
|           |           |
|  +--------v--------+  |
|  |    Services     |  | <--- Business Logic
|  +--------+--------+  |
|           |           |
|  +--------v--------+  |
|  |     Models      |  | <--- Data Access / Repository
|  +--------+--------+  |
+-----------+-----------+
            |
    +-------+-------+
    |               |
+---v----+      +---v---+
| MySQL  |      | Redis |
+--------+      +-------+
```

## Service/Repository Pattern

We utilize the **Service Pattern** to decouple our application's business logic from the HTTP layer (Controllers). 

- **Controllers**: Handle HTTP requests, perform validation (via FormRequests), and format responses (via API Resources). They do NOT contain complex business rules.
- **Services**: Classes like `BookingService` and `SpaceService` contain the core business logic. They process data, coordinate state transitions (e.g., `BookingStateMachine`), and dispatch events.
- **Models/Repositories**: Eloquent models are used directly for data access, acting as an implicit repository layer for simplicity in this MVP while keeping queries expressive.

## API Endpoints

| Group | Method | Endpoint | Description |
|---|---|---|---|
| **Auth** | POST | `/api/v1/auth/register` | Register new user |
| | POST | `/api/v1/auth/login` | Authenticate user |
| | POST | `/api/v1/auth/logout` | Revoke token |
| **Spaces** | GET | `/api/v1/spaces` | List active spaces |
| | POST | `/api/v1/spaces` | Create space (draft) |
| | POST | `/api/v1/spaces/{uuid}/publish` | Submit space for review |
| **Bookings** | POST | `/api/v1/bookings` | Create booking request |
| | POST | `/api/v1/bookings/{uuid}/confirm` | Host confirms booking |
| | POST | `/api/v1/bookings/{uuid}/cancel` | Cancel a booking |
| **Reviews** | POST | `/api/v1/reviews` | Submit a review for completed booking |
| | GET | `/api/v1/spaces/{uuid}/reviews` | Get space reviews |
| **Admin** | GET | `/api/v1/admin/stats` | Dashboard statistics |
| | POST | `/api/v1/admin/spaces/{uuid}/approve`| Approve pending space |
| | POST | `/api/v1/admin/users/{uuid}/suspend` | Suspend user account |

For full details, please refer to the OpenAPI documentation available at `/docs/api` (powered by Scramble).
