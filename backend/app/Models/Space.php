<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use App\Enums\SpaceType;
use App\Enums\SpaceStatus;
use App\Enums\RevieweeType;
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
        $primary = $this->photos->firstWhere('is_primary', true) ?? $this->photos->first();

        return $primary?->path
            ? \Illuminate\Support\Facades\Storage::disk('public')->url($primary->path)
            : null;
    }

    public function host(): BelongsTo
    {
        return $this->belongsTo(User::class, 'host_id');
    }

    public function photos(): HasMany
    {
        return $this->hasMany(SpacePhoto::class, 'space_id')->orderBy('order');
    }

    public function primaryPhoto(): HasOne
    {
        return $this->hasOne(SpacePhoto::class, 'space_id')->orderByDesc('is_primary')->orderBy('order');
    }

    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class, 'space_id');
    }

    /**
     * Reseñas del espacio: las que los inquilinos dejaron al anfitrión
     * por una reserva de este espacio.
     */
    public function reviews(): HasManyThrough
    {
        return $this->hasManyThrough(Review::class, Booking::class, 'space_id', 'booking_id')
            ->where('reviews.reviewee_type', RevieweeType::HOST->value)
            ->where('reviews.is_visible', true);
    }

    public function favoritedBy(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'favorites');
    }

    /** Igual que en User: respeta el agregado precargado con `withAvg` si existe. */
    public function getAverageRatingAttribute(): float
    {
        $preloaded = $this->attributes['average_rating'] ?? null;

        return round((float) ($preloaded ?? $this->reviews()->avg('rating') ?? 0), 1);
    }

    public function getReviewCountAttribute(): int
    {
        return (int) ($this->attributes['review_count'] ?? $this->reviews()->count());
    }
}
