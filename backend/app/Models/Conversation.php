<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;

/**
 * @property int $id
 * @property string $uuid
 * @property int|null $space_id
 * @property int $renter_id
 * @property int $host_id
 */
class Conversation extends Model
{
    use HasUuids, HasFactory;

    public function uniqueIds(): array
    {
        return ['uuid'];
    }

    protected $fillable = [
        'space_id',
        'renter_id',
        'host_id',
        'last_message_at',
    ];

    protected function casts(): array
    {
        return [
            'last_message_at' => 'datetime',
        ];
    }

    public function space(): BelongsTo
    {
        return $this->belongsTo(Space::class);
    }

    public function renter(): BelongsTo
    {
        return $this->belongsTo(User::class, 'renter_id');
    }

    public function host(): BelongsTo
    {
        return $this->belongsTo(User::class, 'host_id');
    }

    public function messages(): HasMany
    {
        return $this->hasMany(Message::class);
    }

    /** El otro participante visto desde el usuario dado. */
    public function counterpartFor(User $user): User
    {
        return $user->id === $this->renter_id ? $this->host : $this->renter;
    }

    public function includes(User $user): bool
    {
        return in_array($user->id, [$this->renter_id, $this->host_id], true);
    }
}
