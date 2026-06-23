<?php

use App\Services\BookingService;
use App\Models\Space;

test('calculates pricing correctly', function () {
    $service = new BookingService();
    $space = new Space(['price_per_month' => 1000]);
    
    config(['rentora.platform_fee_percentage' => 10]);

    $pricing = $service->calculatePricing($space, 3);

    expect($pricing['total'])->toBe(3000.0)
          ->and($pricing['fee'])->toBe(300.0)
          ->and($pricing['payout'])->toBe(2700.0);
});
