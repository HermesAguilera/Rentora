<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Comisión de la plataforma
    |--------------------------------------------------------------------------
    |
    | Porcentaje que Rentora retiene del total de cada reserva. Se descuenta del
    | pago al anfitrión (host_payout_amount) al crear la reserva.
    |
    | Es el único lugar donde se define: lo usan BookingObserver y BookingService,
    | y se muestra al anfitrión en la solicitud de reserva.
    |
    */

    'platform_fee_percentage' => env('PLATFORM_FEE_PERCENTAGE', 7),

];
