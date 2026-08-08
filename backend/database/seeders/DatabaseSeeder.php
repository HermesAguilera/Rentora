<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Space;
use App\Models\Booking;
use App\Models\Review;
use App\Models\Conversation;
use App\Enums\UserRole;
use App\Enums\UserStatus;
use App\Enums\BookingStatus;
use App\Enums\RevieweeType;
use App\Enums\SpaceStatus;
use App\Enums\SpaceType;
use Carbon\Carbon;

/**
 * Datos de demostración de Rentora.
 *
 * Todo está escrito a mano (nada de Faker) para que las capturas y el video
 * muestren espacios, colonias y comentarios creíbles de Tegucigalpa.
 */
class DatabaseSeeder extends Seeder
{
    private const DEMO_PASSWORD = 'Rentora123!';

    /** Catálogo de espacios: se reparten entre los anfitriones en orden. */
    private const SPACES = [
        [
            'title' => 'Bodega techada en Col. Palmira',
            'type' => SpaceType::WAREHOUSE,
            'description' => 'Bodega de concreto con acceso vehicular directo y portón de metal. Ideal para guardar mercadería, mobiliario o equipo de trabajo. Piso pulido, buena ventilación e iluminación LED en todo el interior.',
            'neighborhood' => 'Col. Palmira',
            'address_line' => 'Avenida República de Chile, contiguo a Plaza Palmira',
            'price' => 4500,
            'size' => [5, 8, 3],
            'amenities' => ['24h_access', 'security_camera', 'covered', 'electricity'],
        ],
        [
            'title' => 'Garaje privado en Lomas del Guijarro',
            'type' => SpaceType::GARAGE,
            'description' => 'Garaje techado con portón eléctrico dentro de residencial con vigilancia las 24 horas. Espacio para un vehículo mediano o para almacenar cajas y equipo deportivo.',
            'neighborhood' => 'Lomas del Guijarro',
            'address_line' => 'Calle Principal, Residencial Lomas del Guijarro Sur',
            'price' => 2200,
            'size' => [3, 6, 2.5],
            'amenities' => ['24h_access', 'security_camera', 'covered'],
        ],
        [
            'title' => 'Cuarto exterior en Miraflores',
            'type' => SpaceType::ROOM,
            'description' => 'Cuarto independiente en la parte trasera de la casa, con entrada propia y llave exclusiva para el inquilino. Perfecto como bodega personal o taller pequeño.',
            'neighborhood' => 'Col. Miraflores',
            'address_line' => 'Bloque C, calle 3, casa 214',
            'price' => 1800,
            'size' => [3, 4, 2.6],
            'amenities' => ['electricity', 'covered', 'water_access'],
        ],
        [
            'title' => 'Bodega amplia en Col. Kennedy',
            'type' => SpaceType::WAREHOUSE,
            'description' => 'Bodega con acceso para camión de carga, ubicada a cinco minutos del anillo periférico. Cuenta con área de maniobra, tomas de corriente industrial y cámaras en la entrada.',
            'neighborhood' => 'Col. Kennedy',
            'address_line' => 'Sector 4, calle a la Villa Olímpica',
            'price' => 6800,
            'size' => [8, 12, 4],
            'amenities' => ['24h_access', 'security_camera', 'covered', 'electricity', 'water_access'],
        ],
        [
            'title' => 'Garaje doble en Los Próceres',
            'type' => SpaceType::GARAGE,
            'description' => 'Garaje para dos vehículos con acceso controlado por tarjeta. A pocos minutos del centro y del bulevar Morazán. Techado y con piso de concreto en buen estado.',
            'neighborhood' => 'Col. Los Próceres',
            'address_line' => 'Calle Los Alcaldes, edificio Torre Próceres',
            'price' => 3100,
            'size' => [5, 6, 2.8],
            'amenities' => ['24h_access', 'covered', 'security_camera'],
        ],
        [
            'title' => 'Closet grande en Res. El Trapiche',
            'type' => SpaceType::CLOSET,
            'description' => 'Espacio de closet acondicionado como mini bodega dentro de casa habitada, seco y libre de humedad. Recomendado para documentos, ropa de temporada o electrodomésticos pequeños.',
            'neighborhood' => 'Res. El Trapiche',
            'address_line' => 'Segunda etapa, sendero Los Robles',
            'price' => 900,
            'size' => [1.5, 2, 2.4],
            'amenities' => ['covered', 'electricity'],
        ],
        [
            'title' => 'Bodega comercial en Barrio La Granja',
            'type' => SpaceType::WAREHOUSE,
            'description' => 'Local usado como bodega, sobre calle principal y con rampa de descarga. Excelente opción para negocios que necesitan rotar inventario con frecuencia.',
            'neighborhood' => 'Barrio La Granja',
            'address_line' => 'Calle principal, frente a la gasolinera',
            'price' => 5400,
            'size' => [6, 10, 3.5],
            'amenities' => ['24h_access', 'electricity', 'covered', 'water_access'],
        ],
        [
            'title' => 'Cuarto con entrada independiente en Loarque',
            'type' => SpaceType::ROOM,
            'description' => 'Cuarto en primer nivel con puerta a la calle, reja de seguridad y toma de agua. Zona tranquila y con transporte público a una cuadra.',
            'neighborhood' => 'Col. Loarque',
            'address_line' => 'Bloque 9, casa 41',
            'price' => 1500,
            'size' => [3, 3.5, 2.5],
            'amenities' => ['electricity', 'water_access'],
        ],
        [
            'title' => 'Garaje techado en Col. Alameda',
            'type' => SpaceType::GARAGE,
            'description' => 'Garaje con techo de lámina y portón corredizo, dentro de una casa con perro guardián y vigilancia del vecindario. Espacio seco todo el año.',
            'neighborhood' => 'Col. Alameda',
            'address_line' => 'Avenida Juan Lindo, casa 88',
            'price' => 1900,
            'size' => [3, 5.5, 2.5],
            'amenities' => ['covered', '24h_access'],
        ],
        [
            'title' => 'Bodega pequeña en Res. Honduras',
            'type' => SpaceType::WAREHOUSE,
            'description' => 'Bodega compacta ideal para emprendedores que venden en línea. Entrada peatonal amplia, estantería de metal incluida y buena señal de internet.',
            'neighborhood' => 'Res. Honduras',
            'address_line' => 'Etapa 2, calle 14',
            'price' => 2600,
            'size' => [4, 5, 3],
            'amenities' => ['electricity', 'covered', 'security_camera'],
        ],
        [
            'title' => 'Espacio de patio en El Hatillo',
            'type' => SpaceType::OTHER,
            'description' => 'Área descubierta en patio cercado, apta para guardar materiales de construcción, remolques o vehículos en reparación. Acceso coordinado con el propietario.',
            'neighborhood' => 'El Hatillo',
            'address_line' => 'Kilómetro 8, carretera a El Hatillo',
            'price' => 1200,
            'size' => [6, 8, 0],
            'amenities' => ['24h_access', 'water_access'],
        ],
        [
            'title' => 'Cuarto exterior en Col. Florencia',
            'type' => SpaceType::ROOM,
            'description' => 'Cuarto anexo a la vivienda principal, recién pintado y con piso cerámico. Cerca del bulevar Suyapa y de varias universidades.',
            'neighborhood' => 'Col. Florencia Norte',
            'address_line' => 'Calle Los Laureles, casa 12',
            'price' => 2000,
            'size' => [3.5, 4, 2.6],
            'amenities' => ['electricity', 'covered', 'water_access'],
        ],
        [
            'title' => 'Garaje en Barrio Guanacaste',
            'type' => SpaceType::GARAGE,
            'description' => 'Garaje sencillo en zona céntrica, con portón de metal y buena iluminación en la calle. Práctico para quienes trabajan en el centro de la ciudad.',
            'neighborhood' => 'Barrio Guanacaste',
            'address_line' => 'Calle La Fuente, casa 7',
            'price' => 1400,
            'size' => [3, 5, 2.4],
            'amenities' => ['covered'],
        ],
        [
            'title' => 'Bodega con oficina en Villa Olímpica',
            'type' => SpaceType::WAREHOUSE,
            'description' => 'Bodega con una pequeña oficina cerrada al frente, baño propio y estacionamiento para dos vehículos. Buena opción para distribuidoras.',
            'neighborhood' => 'Villa Olímpica',
            'address_line' => 'Avenida Los Próceres, bodega 3',
            'price' => 7500,
            'size' => [7, 11, 4],
            'amenities' => ['24h_access', 'security_camera', 'covered', 'electricity', 'water_access'],
        ],
        [
            'title' => 'Closet bajo escalera en Las Uvas',
            'type' => SpaceType::CLOSET,
            'description' => 'Espacio cerrado bajo la escalera, seco y ventilado. Sirve para cajas, maletas y artículos que no se usan a diario.',
            'neighborhood' => 'Res. Las Uvas',
            'address_line' => 'Calle 2, casa 30',
            'price' => 650,
            'size' => [1.2, 2.2, 2],
            'amenities' => ['covered'],
        ],
        [
            'title' => 'Bodega en Col. Las Colinas',
            'type' => SpaceType::WAREHOUSE,
            'description' => 'Bodega dentro de residencial privado con caseta de vigilancia y acceso registrado. Cuenta con extintor, cámaras y alarma conectada.',
            'neighborhood' => 'Col. Las Colinas',
            'address_line' => 'Sendero Los Pinos, bodega B',
            'price' => 5200,
            'size' => [5, 9, 3.2],
            'amenities' => ['24h_access', 'security_camera', 'covered', 'electricity'],
        ],
    ];

    private const HOSTS = [
        ['Ana', 'Reyes'],
        ['Luis', 'Bonilla'],
        ['Karen', 'Hernández'],
        ['Diego', 'Flores'],
    ];

    private const RENTERS = [
        ['María', 'López'],
        ['Tony', 'Gómez'],
        ['Josué', 'Canales'],
        ['Carlos', 'Ramos'],
        ['Laura', 'Flores'],
        ['Ana', 'Suazo'],
        ['José', 'Martínez'],
        ['Gabriela', 'Cruz'],
    ];

    private const HOST_REVIEWS = [
        'El espacio estaba tal cual las fotos, limpio y seco. El anfitrión muy puntual con la entrega de llaves.',
        'Excelente comunicación y la zona es segura. Volvería a alquilar sin dudarlo.',
        'Buen espacio por el precio. El acceso es cómodo incluso con camión pequeño.',
        'Todo en orden. Me avisaron con tiempo cualquier detalle y resolvieron rápido.',
        'Muy recomendado. El lugar tiene buena vigilancia y nunca tuve problemas de humedad.',
        'La bodega cumplió con lo que necesitaba. Solo mejoraría la iluminación de la entrada.',
    ];

    private const RENTER_REVIEWS = [
        'Inquilino responsable, entregó el espacio limpio y pagó siempre a tiempo.',
        'Muy buena comunicación durante todo el alquiler. Sin inconvenientes.',
        'Cuidó bien el espacio y avisó con anticipación cuando necesitaba acceso.',
        'Todo bien, persona seria y ordenada.',
    ];

    public function run(): void
    {
        $admin = $this->createUser('Nabila', 'Andino', 'admin@rentora.com', UserRole::ADMIN, '+50422340001');
        $admin->update(['password' => Hash::make('rentora_secure_password_123!')]);

        // Cuentas fijas para la demo: ambas con rol "both" para publicar y reservar.
        $demoHost = $this->createUser('Pedro', 'Andino', 'host@rentora.com', UserRole::BOTH, '+50498760001');
        $demoRenter = $this->createUser('Erick', 'Sánchez', 'cliente@rentora.com', UserRole::BOTH, '+50498760002');

        $hosts = collect(self::HOSTS)->map(fn (array $name, int $i) => $this->createUser(
            $name[0],
            $name[1],
            $this->emailFor($name),
            UserRole::HOST,
            '+5049876' . str_pad((string) (100 + $i), 4, '0', STR_PAD_LEFT),
        ));

        $renters = collect(self::RENTERS)->map(fn (array $name, int $i) => $this->createUser(
            $name[0],
            $name[1],
            $this->emailFor($name),
            UserRole::RENTER,
            '+5049876' . str_pad((string) (200 + $i), 4, '0', STR_PAD_LEFT),
        ));

        // Los primeros 4 espacios son del anfitrión demo; el resto se reparte.
        $owners = collect([$demoHost, $demoHost, $demoHost, $demoHost])
            ->concat($hosts->concat($hosts)->concat($hosts));

        $spaces = collect(self::SPACES)->map(
            fn (array $data, int $i) => $this->createSpace($data, $owners[$i]),
        );

        $this->seedBookings($spaces, $renters, $demoHost, $demoRenter);
        $this->seedConversations($spaces, $demoHost, $demoRenter, $renters);

        // El cliente demo abre la app con algunos favoritos ya guardados.
        $demoRenter->favoriteSpaces()->sync($spaces->slice(1, 3)->pluck('id'));
    }

    private function emailFor(array $name): string
    {
        $slug = fn (string $value) => strtolower(strtr($value, [
            'á' => 'a', 'é' => 'e', 'í' => 'i', 'ó' => 'o', 'ú' => 'u', 'ñ' => 'n',
        ]));

        return $slug($name[0]) . '.' . $slug($name[1]) . '@rentora.com';
    }

    private function createUser(
        string $firstName,
        string $lastName,
        string $email,
        UserRole $role,
        string $phone,
    ): User {
        return User::create([
            'first_name' => $firstName,
            'last_name' => $lastName,
            'email' => $email,
            'phone' => $phone,
            'password' => Hash::make(self::DEMO_PASSWORD),
            'role' => $role,
            'status' => UserStatus::ACTIVE,
            'email_verified_at' => now(),
            'phone_verified_at' => now(),
            'identity_verified_at' => now(),
        ]);
    }

    private function createSpace(array $data, User $host): Space
    {
        [$width, $depth, $height] = $data['size'];

        return Space::create([
            'host_id' => $host->id,
            'title' => $data['title'],
            'description' => $data['description'],
            'type' => $data['type'],
            'status' => SpaceStatus::ACTIVE,
            'price_per_month' => $data['price'],
            'minimum_months' => 1,
            'width_meters' => $width,
            'depth_meters' => $depth,
            'height_meters' => $height ?: null,
            'address_line' => $data['address_line'],
            'neighborhood' => $data['neighborhood'],
            'city' => 'Tegucigalpa',
            'department' => 'Francisco Morazán',
            'country' => 'HN',
            'amenities' => $data['amenities'],
            'published_at' => now()->subDays(random_int(10, 120)),
        ]);
    }

    /**
     * Reservas repartidas en el tiempo para que la gráfica de ingresos y el
     * historial de pagos tengan forma, con reseñas en las ya finalizadas.
     */
    private function seedBookings($spaces, $renters, User $demoHost, User $demoRenter): void
    {
        $reviewIndex = 0;

        // Finalizadas (con reseña) repartidas en los últimos meses.
        foreach ($spaces as $i => $space) {
            $renter = $renters[$i % $renters->count()];
            $months = [3, 6, 4, 12][$i % 4];
            $start = Carbon::today()->subMonths($months + ($i % 5) + 1)->startOfMonth()->addDays(4);

            $booking = $this->createBooking($space, $renter, $months, $start, BookingStatus::COMPLETED);

            Review::create([
                'booking_id' => $booking->id,
                'reviewer_id' => $renter->id,
                'reviewee_id' => $space->host_id,
                'reviewee_type' => RevieweeType::HOST,
                'rating' => [5, 5, 4, 5, 4, 5][$reviewIndex % 6],
                'comment' => self::HOST_REVIEWS[$reviewIndex % count(self::HOST_REVIEWS)],
                'is_visible' => true,
            ]);

            Review::create([
                'booking_id' => $booking->id,
                'reviewer_id' => $space->host_id,
                'reviewee_id' => $renter->id,
                'reviewee_type' => RevieweeType::RENTER,
                'rating' => [5, 4, 5, 5][$reviewIndex % 4],
                'comment' => self::RENTER_REVIEWS[$reviewIndex % count(self::RENTER_REVIEWS)],
                'is_visible' => true,
            ]);

            $reviewIndex++;
        }

        // Alquileres en curso.
        foreach ($spaces->take(6) as $i => $space) {
            $this->createBooking(
                $space,
                $renters[($i + 3) % $renters->count()],
                [6, 12, 3][$i % 3],
                Carbon::today()->subMonths(2)->addDays($i * 3),
                BookingStatus::ACTIVE,
            );
        }

        // El cliente demo tiene un alquiler activo con el anfitrión demo.
        $this->createBooking(
            $spaces[0],
            $demoRenter,
            12,
            Carbon::today()->subMonth(),
            BookingStatus::ACTIVE,
        );

        // Solicitudes pendientes que el anfitrión demo puede aceptar en el video.
        $demoSpaces = $spaces->where('host_id', $demoHost->id)->values();
        foreach ([[$renters[0], 6], [$renters[1], 3], [$renters[2], 12]] as $i => [$renter, $months]) {
            $this->createBooking(
                $demoSpaces[$i % $demoSpaces->count()],
                $renter,
                $months,
                Carbon::today()->addDays(7 + $i * 5),
                BookingStatus::PENDING,
            );
        }
    }

    private function createBooking(
        Space $space,
        User $renter,
        int $months,
        Carbon $start,
        BookingStatus $status,
    ): Booking {
        return Booking::create([
            'space_id' => $space->id,
            'renter_id' => $renter->id,
            'host_id' => $space->host_id,
            'status' => $status,
            'start_date' => $start->toDateString(),
            'end_date' => $start->copy()->addMonths($months)->toDateString(),
            'months_duration' => $months,
            'price_per_month' => $space->price_per_month,
            'confirmed_at' => $status === BookingStatus::PENDING ? null : $start->copy()->subDays(3),
            'completed_at' => $status === BookingStatus::COMPLETED
                ? $start->copy()->addMonths($months)
                : null,
        ]);
    }

    private function seedConversations($spaces, User $demoHost, User $demoRenter, $renters): void
    {
        $this->createConversation($spaces[0], $demoRenter, $demoHost, [
            [$demoRenter, '¡Hola Pedro! Vi tu bodega en Palmira y me interesa.'],
            [$demoRenter, '¿El acceso también es los fines de semana?'],
            [$demoHost, '¡Hola Erick! Sí, el acceso es de lunes a domingo, las 24 horas.'],
            [$demoHost, 'Solo te pido avisar si vas a entrar con camión para abrir el portón grande.'],
            [$demoRenter, 'Perfecto, justo lo que necesitaba. Voy a hacer la reserva hoy mismo.'],
        ]);

        $this->createConversation($spaces[1], $renters[0], $demoHost, [
            [$renters[0], 'Buenas tardes, ¿el garaje sigue disponible?'],
            [$demoHost, 'Buenas tardes María, sí, está disponible desde el próximo mes.'],
            [$renters[0], 'Excelente, ¿puedo pasar a verlo el sábado por la mañana?'],
        ]);

        $this->createConversation($spaces[2], $renters[1], $demoHost, [
            [$renters[1], 'Hola, ¿el cuarto tiene toma de corriente?'],
            [$demoHost, 'Sí, tiene dos tomas y luz incluida en el precio.'],
            [$renters[1], 'Gracias por la información, lo voy a pensar.'],
        ]);
    }

    /** @param array<int, array{0: User, 1: string}> $messages */
    private function createConversation(Space $space, User $renter, User $host, array $messages): void
    {
        $conversation = Conversation::create([
            'space_id' => $space->id,
            'renter_id' => $renter->id,
            'host_id' => $host->id,
        ]);

        $sentAt = Carbon::now()->subDays(2);

        foreach ($messages as $index => [$sender, $body]) {
            $sentAt = $sentAt->copy()->addMinutes(7 * ($index + 1));

            $conversation->messages()->create([
                'sender_id' => $sender->id,
                'body' => $body,
                // Los del propio remitente cuentan como leídos; el último entrante queda sin leer.
                'read_at' => $index < count($messages) - 1 ? $sentAt : null,
                'created_at' => $sentAt,
                'updated_at' => $sentAt,
            ]);
        }

        $conversation->update(['last_message_at' => $sentAt]);
    }
}
