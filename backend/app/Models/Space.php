<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use App\Enums\SpaceType;
use App\Enums\SpaceStatus;
use App\Observers\SpaceObserver;

/**
 * @property int $id
 * @property string $uuid
 * @property int $host_id
 * @property string $title
 * @property string $description
 * @property SpaceType $type
 * @property SpaceStatus $status
 * @property float $price_per_month
 * @property int $minimum_months
 * @property int|null $max_months
 * @property float|null $width_meters
 * @property float|null $height_meters
 * @property float|null $depth_meters
 * @property int|null $floor_number
 * @property string $address_line
 * @property string $neighborhood
 * @property string $city
 * @property string $department
 * @property string $country
 * @property float|null $latitude
 * @property float|null $longitude
 * @property array $amenities
 * @property string|null $rules
 * @property \Illuminate\Support\Carbon|null $published_at
 * @property-read string|null $primary_photo_url
 */
#[ObservedBy([SpaceObserver::class])]
class Space extends Model
{
    use HasUuids, SoftDeletes, HasFactory;

    public function uniqueIds(): array
    {
        return ['uuid'];
    }

    protected $fillable = [
        'host_id',
        'title',
        'description',
        'type',
        'status',
        'price_per_month',
        'minimum_months',
        'max_months',
        'width_meters',
        'height_meters',
        'depth_meters',
        'floor_number',
        'address_line',
        'neighborhood',
        'city',
        'department',
        'country',
        'latitude',
        'longitude',
        'amenities',
        'rules',
        'published_at',
    ];

    protected $appends = [
        'primary_photo_url',
    ];

    protected function casts(): array
    {
        return [
            'type' => SpaceType::class,
            'status' => SpaceStatus::class,
            'price_per_month' => 'decimal:2',
            'width_meters' => 'decimal:2',
            'height_meters' => 'decimal:2',
            'depth_meters' => 'decimal:2',
            'latitude' => 'decimal:7',
            'longitude' => 'decimal:7',
            'amenities' => 'array',
            'published_at' => 'datetime',
        ];
    }

    public function getPrimaryPhotoUrlAttribute(): ?string
    {
        $primary = $this->photos->where('is_primary', true)->first();
        if ($primary) {
            return $primary->path; // Setup storage URL here later if needed
        }

        $first = $this->photos->first();
        return $first ? $first->path : null;
    }

    public function host(): BelongsTo
    {
        return $this->belongsTo(User::class, 'host_id');
    }

    public function photos(): HasMany
    {
        return $this->hasMany(SpacePhoto::class, 'space_id')->orderBy('order');
    }

    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class, 'space_id');
    }
}
