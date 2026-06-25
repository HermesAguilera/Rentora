<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Enums\RevieweeType;

/**
 * @property int $id
 * @property string $uuid
 * @property int $booking_id
 * @property int $reviewer_id
 * @property int $reviewee_id
 * @property RevieweeType $reviewee_type
 * @property int $rating
 * @property string|null $comment
 * @property bool $is_visible
 */
class Review extends Model
{
    use HasUuids, HasFactory;

    public function uniqueIds(): array
    {
        return ['uuid'];
    }

    protected $fillable = [
        'booking_id',
        'reviewer_id',
        'reviewee_id',
        'reviewee_type',
        'rating',
        'comment',
        'is_visible',
    ];

    protected function casts(): array
    {
        return [
            'reviewee_type' => RevieweeType::class,
            'rating' => 'integer',
            'is_visible' => 'boolean',
        ];
    }

    public function booking(): BelongsTo
    {
        return $this->belongsTo(Booking::class, 'booking_id');
    }

    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewer_id');
    }

    public function reviewee(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewee_id');
    }
}
