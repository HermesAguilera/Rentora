<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use App\Enums\UserRole;
use App\Enums\UserStatus;
use App\Enums\TokenAbility;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\DB;
use Exception;

class AuthService extends BaseService
{
    public function register(array $data): array
    {
        return DB::transaction(function () use ($data) {
            $user = User::create([
                'first_name' => $data['first_name'],
                'last_name' => $data['last_name'],
                'email' => $data['email'],
                'phone' => $data['phone'] ?? null,
                'password' => Hash::make($data['password'], ['rounds' => 12]),
                'role' => UserRole::from($data['intended_role']),
                'status' => UserStatus::ACTIVE,
            ]);

            event(new Registered($user));

            $token = null;
            if (!env('REQUIRE_EMAIL_VERIFICATION', true)) {
                $abilities = TokenAbility::forRole($user->role);
                $token = $user->createToken('auth_token', $abilities)->plainTextToken;
            }

            return ['user' => $user, 'token' => $token];
        });
    }

    public function login(array $credentials): array
    {
        $user = User::where('email', $credentials['email'])->first();

        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            throw new Exception('Credenciales inválidas.', 401);
        }

        if ($user->status !== UserStatus::ACTIVE) {
            throw new Exception("Tu cuenta ha sido {$user->status->label()}. Contacta soporte.", 403);
        }

        $user->update(['last_login_at' => now()]);

        $abilities = TokenAbility::forRole($user->role);
        $token = $user->createToken('auth_token', $abilities)->plainTextToken;

        return ['user' => $user, 'token' => $token];
    }

    public function logout(User $user): void
    {
        $user->currentAccessToken()->delete();
    }

    public function logoutAll(User $user): void
    {
        $user->tokens()->delete();
    }

    public function refreshToken(User $user): array
    {
        $user->currentAccessToken()->delete();
        $abilities = TokenAbility::forRole($user->role);
        $token = $user->createToken('auth_token', $abilities)->plainTextToken;
        return ['token' => $token];
    }

    public function sendResetLink(array $data): string
    {
        return Password::broker()->sendResetLink($data);
    }

    public function resetPassword(array $data): string
    {
        $status = Password::broker()->reset(
            $data,
            function ($user, $password) {
                $user->password = Hash::make($password, ['rounds' => 12]);
                $user->setRememberToken(Str::random(60));
                $user->save();
                $user->tokens()->delete(); // invalidate all sessions
            }
        );

        return $status;
    }
}
