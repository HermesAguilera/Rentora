<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use App\Enums\BookingStatus;
use App\Observers\BookingObserver;

/**
 * @property int $id
 * @property string $uuid
 * @property int $space_id
 * @property int $renter_id
 * @property int $host_id
 * @property BookingStatus $status
 * @property \Illuminate\Support\Carbon $start_date
 * @property \Illuminate\Support\Carbon|null $end_date
 * @property int $months_duration
 * @property float $price_per_month
 * @property float $total_amount
 * @property float $platform_fee_amount
 * @property float $host_payout_amount
 * @property string|null $cancellation_reason
 * @property \Illuminate\Support\Carbon|null $confirmed_at
 * @property \Illuminate\Support\Carbon|null $cancelled_at
 * @property \Illuminate\Support\Carbon|null $completed_at
 * @property string|null $renter_notes
 */
#[ObservedBy([BookingObserver::class])]
class Booking extends Model
{
    use HasUuids, SoftDeletes, HasFactory;

    public function uniqueIds(): array
    {
        return ['uuid'];
    }

    protected $fillable = [
        'space_id',
        'renter_id',
        'host_id',
        'status',
        'start_date',
        'end_date',
        'months_duration',
        'price_per_month',
        'total_amount',
        'platform_fee_amount',
        'host_payout_amount',
        'cancellation_reason',
        'confirmed_at',
        'cancelled_at',
        'completed_at',
        'renter_notes',
    ];

    protected function casts(): array
    {
        return [
            'status' => BookingStatus::class,
            'start_date' => 'date',
            'end_date' => 'date',
            'price_per_month' => 'decimal:2',
            'total_amount' => 'decimal:2',
            'platform_fee_amount' => 'decimal:2',
            'host_payout_amount' => 'decimal:2',
            'confirmed_at' => 'datetime',
            'cancelled_at' => 'datetime',
            'completed_at' => 'datetime',
        ];
    }

    public function space(): BelongsTo
    {
        return $this->belongsTo(Space::class, 'space_id');
    }

    public function renter(): BelongsTo
    {
        return $this->belongsTo(User::class, 'renter_id');
    }

    public function host(): BelongsTo
    {
        return $this->belongsTo(User::class, 'host_id');
    }

    public function review(): HasOne
    {
        return $this->hasOne(Review::class, 'booking_id');
    }
}
