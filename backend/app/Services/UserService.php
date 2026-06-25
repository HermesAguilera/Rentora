<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

class UserService
{
    public function updateProfile(User $user, array $data): User
    {
        if (isset($data['email']) && $data['email'] !== $user->email) {
            $user->email_verified_at = null;
            $user->email = $data['email'];
            $user->sendEmailVerificationNotification();
        }

        if (isset($data['password'])) {
            if (!Hash::check($data['current_password'], $user->password)) {
                throw new \Exception('La contraseña actual es incorrecta.', 400);
            }
            $user->password = Hash::make($data['password'], ['rounds' => 12]);
        }

        if (isset($data['first_name'])) {
            $user->first_name = $data['first_name'];
        }
        if (isset($data['last_name'])) {
            $user->last_name = $data['last_name'];
        }
        if (isset($data['phone'])) {
            $user->phone = $data['phone'];
        }

        $user->save();

        return $user;
    }

    public function uploadAvatar(User $user, $file): string
    {
        $manager = new ImageManager(new Driver());
        
        $image = $manager->read($file);
        
        // 400x400
        $image->cover(400, 400);
        $encoded = $image->toWebp(90);

        $path = "avatars/{$user->uuid}/avatar.webp";
        
        if ($user->avatar_path) {
            Storage::disk('s3')->delete($user->avatar_path);
        }

        Storage::disk('s3')->put($path, $encoded->toString());
        
        $user->update(['avatar_path' => $path]);

        // Returns signed url
        return Storage::disk('s3')->temporaryUrl($path, now()->addMinutes(60));
    }

    public function getStats(User $user): array
    {
        return [
            'total_renter_bookings' => $user->renterBookings()->count(),
            'total_host_bookings' => $user->hostBookings()->count(),
            'average_rating_given' => (float) $user->reviewsWritten()->avg('rating') ?: 0.0,
            'average_rating_received' => (float) $user->reviewsReceived()->avg('rating') ?: 0.0,
            'total_spaces_listed' => $user->spaces()->count(),
        ];
    }
}
