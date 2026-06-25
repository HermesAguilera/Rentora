<?php

namespace App\Http\Controllers\Api\V1\Auth;

use Illuminate\Routing\Controller;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\ForgotPasswordRequest;
use App\Http\Requests\Auth\ResetPasswordRequest;
use App\Services\AuthService;
use App\Http\Resources\UserPrivateResource;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Password;
use Illuminate\Foundation\Auth\EmailVerificationRequest;

/**
 *     version="1.0.0",
 *     title="Rentora API",
 *     description="API para el mercado de alquiler de espacios."
 * )
 *     url="http://localhost:8000/api/v1",
 *     description="Entorno local"
 * )
 *     securityScheme="sanctum",
 *     type="http",
 *     scheme="bearer",
 *     bearerFormat="JWT"
 * )
 */
class AuthController extends Controller
{
    public function __construct(private AuthService $authService)
    {
    }

    /**
     *   path="/api/v1/auth/register",
     *   tags={"Auth"},
     *   summary="Register a new user",
     *   description="Creates a new user account. Returns the user profile and a Sanctum bearer token. If REQUIRE_EMAIL_VERIFICATION is enabled, the token will only be returned after email confirmation.",
     *   operationId="authRegister",
     *     required=true,
     *       required={"first_name","last_name","email","password","password_confirmation","role"},
     *     )
     *   ),
     *     response=201,
     *     description="User registered successfully",
     *     )
     *   ),
     * )
     */
    public function register(RegisterRequest $request): JsonResponse
    {
        $result = $this->authService->register($request->validated());

        return response()->json([
            'user' => new UserPrivateResource($result['user']),
            'token' => $result['token'],
        ], 201);
    }

    /**
     *   path="/api/v1/auth/login",
     *   tags={"Auth"},
     *   summary="Login user",
     *   description="Authenticates the user and returns a Sanctum bearer token.",
     *   operationId="authLogin",
     *     required=true,
     *       required={"email","password"},
     *     )
     *   ),
     *     response=200,
     *     description="Login successful",
     *     )
     *   ),
     * )
     */
    public function login(LoginRequest $request): JsonResponse
    {
        try {
            $result = $this->authService->login($request->validated());
            
            return response()->json([
                'user' => new UserPrivateResource($result['user']),
                'token' => $result['token'],
            ]);
        } catch (\Exception $e) {
            $code = $e->getCode();
            // Ensure the code is a valid HTTP status code
            $httpCode = (is_numeric($code) && $code >= 100 && $code <= 599) ? (int) $code : 401;
            return response()->json(['message' => $e->getMessage()], $httpCode);
        }
    }

    /**
     *   path="/api/v1/auth/logout",
     *   tags={"Auth"},
     *   summary="Logout user",
     *   description="Revokes the current user token.",
     *   operationId="authLogout",
     *   security={{"sanctum": {}}},
     *     response=200,
     *     description="Logout successful",
     *     )
     *   ),
     * )
     */
    public function logout(Request $request): JsonResponse
    {
        $this->authService->logout($request->user());
        return response()->json(['message' => 'Sesión cerrada exitosamente.']);
    }

    /**
     *   path="/api/v1/auth/logout-all",
     *   tags={"Auth"},
     *   summary="Logout from all devices",
     *   description="Revokes all tokens for the authenticated user.",
     *   operationId="authLogoutAll",
     *   security={{"sanctum": {}}},
     *     response=200,
     *     description="All sessions closed successfully",
     *     )
     *   ),
     * )
     */
    public function logoutAll(Request $request): JsonResponse
    {
        $this->authService->logoutAll($request->user());
        return response()->json(['message' => 'Todas las sesiones cerradas exitosamente.']);
    }

    /**
     *   path="/api/v1/auth/refresh-token",
     *   tags={"Auth"},
     *   summary="Refresh token",
     *   description="Invalidates current token and issues a new one.",
     *   operationId="authRefreshToken",
     *   security={{"sanctum": {}}},
     *     response=200,
     *     description="Token refreshed successfully",
     *     )
     *   ),
     * )
     */
    public function refreshToken(Request $request): JsonResponse
    {
        $result = $this->authService->refreshToken($request->user());
        return response()->json(['token' => $result['token']]);
    }

    /**
     *   path="/api/v1/auth/forgot-password",
     *   tags={"Auth"},
     *   summary="Send reset password link",
     *   description="Sends a password reset link to the given email if it exists.",
     *   operationId="authForgotPassword",
     *     required=true,
     *       required={"email"},
     *     )
     *   ),
     *     response=200,
     *     description="Link sent (or simulated)",
     *     )
     *   ),
     * )
     */
    public function forgotPassword(ForgotPasswordRequest $request): JsonResponse
    {
        $status = $this->authService->sendResetLink($request->validated());

        // Always return 200 to prevent email enumeration
        return response()->json([
            'message' => 'Si el correo existe, recibirás un enlace para restablecer tu contraseña.'
        ]);
    }

    /**
     *   path="/api/v1/auth/reset-password",
     *   tags={"Auth"},
     *   summary="Reset password",
     *   description="Resets the user's password using the token sent to their email.",
     *   operationId="authResetPassword",
     *     required=true,
     *       required={"email","password","password_confirmation","token"},
     *     )
     *   ),
     *     response=200,
     *     description="Password reset successful",
     *     )
     *   ),
     * )
     */
    public function resetPassword(ResetPasswordRequest $request): JsonResponse
    {
        $status = $this->authService->resetPassword($request->validated());

        if ($status === Password::PASSWORD_RESET) {
            return response()->json(['message' => 'Contraseña restablecida exitosamente.']);
        }

        return response()->json(['message' => 'El token es inválido o ha expirado.'], 400);
    }

    /**
     *   path="/api/v1/auth/email/verify/{id}/{hash}",
     *   tags={"Auth"},
     *   summary="Verify email",
     *   description="Verifies the user's email via the signed URL.",
     *   operationId="authVerifyEmail",
     *   security={{"sanctum": {}}},
     *     response=200,
     *     description="Email verified successfully",
     *     )
     *   ),
     * )
     */
    public function verifyEmail(EmailVerificationRequest $request): JsonResponse
    {
        $request->fulfill();
        return response()->json(['message' => 'Correo verificado exitosamente.']);
    }

    /**
     *   path="/api/v1/auth/email/resend",
     *   tags={"Auth"},
     *   summary="Resend verification email",
     *   description="Resends the email verification link to the authenticated user.",
     *   operationId="authResendEmailVerification",
     *   security={{"sanctum": {}}},
     *     response=200,
     *     description="Link sent successfully",
     *     )
     *   ),
     * )
     */
    public function resendEmailVerification(Request $request): JsonResponse
    {
        if ($request->user()->hasVerifiedEmail()) {
            return response()->json(['message' => 'El correo ya está verificado.'], 400);
        }

        $request->user()->sendEmailVerificationNotification();
        return response()->json(['message' => 'Enlace de verificación enviado.']);
    }
}
