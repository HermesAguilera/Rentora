<?php

namespace App\Http\Controllers\Api\V1\Auth;

use Illuminate\Routing\Controller;
use OpenApi\Annotations as OA;
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
 * @OA\Info(
 *     version="1.0.0",
 *     title="Rentora API",
 *     description="API para el mercado de alquiler de espacios."
 * )
 * @OA\Server(
 *     url="http://localhost:8000/api/v1",
 *     description="Entorno local"
 * )
 * @OA\SecurityScheme(
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
     * @OA\Post(
     *   path="/api/v1/auth/register",
     *   tags={"Auth"},
     *   summary="Register a new user",
     *   description="Creates a new user account. Returns the user profile and a Sanctum bearer token. If REQUIRE_EMAIL_VERIFICATION is enabled, the token will only be returned after email confirmation.",
     *   operationId="authRegister",
     *   @OA\RequestBody(
     *     required=true,
     *     @OA\JsonContent(
     *       required={"first_name","last_name","email","password","password_confirmation","role"},
     *       @OA\Property(property="first_name", type="string", maxLength=50, example="Carlos"),
     *       @OA\Property(property="last_name", type="string", maxLength=50, example="Mejía"),
     *       @OA\Property(property="email", type="string", format="email", example="carlos@ejemplo.hn"),
     *       @OA\Property(property="password", type="string", format="password", minLength=8, example="M1Contras3ña!"),
     *       @OA\Property(property="password_confirmation", type="string", format="password", example="M1Contras3ña!"),
     *       @OA\Property(property="phone", type="string", nullable=true, example="+50498765432"),
     *       @OA\Property(property="role", type="string", enum={"renter","host","both"}, example="renter")
     *     )
     *   ),
     *   @OA\Response(
     *     response=201,
     *     description="User registered successfully",
     *     @OA\JsonContent(
     *       @OA\Property(property="user", ref="#/components/schemas/User"),
     *       @OA\Property(property="token", type="string", example="1|abc123xyz...")
     *     )
     *   ),
     *   @OA\Response(response=422, description="Validation error", @OA\JsonContent(ref="#/components/schemas/Error")),
     *   @OA\Response(response=429, description="Too many requests")
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
     * @OA\Post(
     *   path="/api/v1/auth/login",
     *   tags={"Auth"},
     *   summary="Login user",
     *   description="Authenticates the user and returns a Sanctum bearer token.",
     *   operationId="authLogin",
     *   @OA\RequestBody(
     *     required=true,
     *     @OA\JsonContent(
     *       required={"email","password"},
     *       @OA\Property(property="email", type="string", format="email", example="carlos@ejemplo.hn"),
     *       @OA\Property(property="password", type="string", format="password", example="M1Contras3ña!")
     *     )
     *   ),
     *   @OA\Response(
     *     response=200,
     *     description="Login successful",
     *     @OA\JsonContent(
     *       @OA\Property(property="user", ref="#/components/schemas/User"),
     *       @OA\Property(property="token", type="string", example="1|abc123xyz...")
     *     )
     *   ),
     *   @OA\Response(response=401, description="Unauthenticated"),
     *   @OA\Response(response=403, description="Forbidden (suspended/banned)"),
     *   @OA\Response(response=422, description="Validation error", @OA\JsonContent(ref="#/components/schemas/Error")),
     *   @OA\Response(response=429, description="Too many requests")
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
            return response()->json(['message' => $e->getMessage()], $e->getCode() ?: 401);
        }
    }

    /**
     * @OA\Post(
     *   path="/api/v1/auth/logout",
     *   tags={"Auth"},
     *   summary="Logout user",
     *   description="Revokes the current user token.",
     *   operationId="authLogout",
     *   security={{"sanctum": {}}},
     *   @OA\Response(
     *     response=200,
     *     description="Logout successful",
     *     @OA\JsonContent(
     *       @OA\Property(property="message", type="string", example="Sesión cerrada exitosamente.")
     *     )
     *   ),
     *   @OA\Response(response=401, description="Unauthenticated")
     * )
     */
    public function logout(Request $request): JsonResponse
    {
        $this->authService->logout($request->user());
        return response()->json(['message' => 'Sesión cerrada exitosamente.']);
    }

    /**
     * @OA\Post(
     *   path="/api/v1/auth/logout-all",
     *   tags={"Auth"},
     *   summary="Logout from all devices",
     *   description="Revokes all tokens for the authenticated user.",
     *   operationId="authLogoutAll",
     *   security={{"sanctum": {}}},
     *   @OA\Response(
     *     response=200,
     *     description="All sessions closed successfully",
     *     @OA\JsonContent(
     *       @OA\Property(property="message", type="string", example="Todas las sesiones cerradas exitosamente.")
     *     )
     *   ),
     *   @OA\Response(response=401, description="Unauthenticated")
     * )
     */
    public function logoutAll(Request $request): JsonResponse
    {
        $this->authService->logoutAll($request->user());
        return response()->json(['message' => 'Todas las sesiones cerradas exitosamente.']);
    }

    /**
     * @OA\Post(
     *   path="/api/v1/auth/refresh-token",
     *   tags={"Auth"},
     *   summary="Refresh token",
     *   description="Invalidates current token and issues a new one.",
     *   operationId="authRefreshToken",
     *   security={{"sanctum": {}}},
     *   @OA\Response(
     *     response=200,
     *     description="Token refreshed successfully",
     *     @OA\JsonContent(
     *       @OA\Property(property="token", type="string", example="2|abc456xyz...")
     *     )
     *   ),
     *   @OA\Response(response=401, description="Unauthenticated")
     * )
     */
    public function refreshToken(Request $request): JsonResponse
    {
        $result = $this->authService->refreshToken($request->user());
        return response()->json(['token' => $result['token']]);
    }

    /**
     * @OA\Post(
     *   path="/api/v1/auth/forgot-password",
     *   tags={"Auth"},
     *   summary="Send reset password link",
     *   description="Sends a password reset link to the given email if it exists.",
     *   operationId="authForgotPassword",
     *   @OA\RequestBody(
     *     required=true,
     *     @OA\JsonContent(
     *       required={"email"},
     *       @OA\Property(property="email", type="string", format="email", example="carlos@ejemplo.hn")
     *     )
     *   ),
     *   @OA\Response(
     *     response=200,
     *     description="Link sent (or simulated)",
     *     @OA\JsonContent(
     *       @OA\Property(property="message", type="string", example="Si el correo existe, recibirás un enlace para restablecer tu contraseña.")
     *     )
     *   ),
     *   @OA\Response(response=422, description="Validation error", @OA\JsonContent(ref="#/components/schemas/Error")),
     *   @OA\Response(response=429, description="Too many requests")
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
     * @OA\Post(
     *   path="/api/v1/auth/reset-password",
     *   tags={"Auth"},
     *   summary="Reset password",
     *   description="Resets the user's password using the token sent to their email.",
     *   operationId="authResetPassword",
     *   @OA\RequestBody(
     *     required=true,
     *     @OA\JsonContent(
     *       required={"email","password","password_confirmation","token"},
     *       @OA\Property(property="email", type="string", format="email", example="carlos@ejemplo.hn"),
     *       @OA\Property(property="password", type="string", format="password", example="NewP4ssw0rd!"),
     *       @OA\Property(property="password_confirmation", type="string", format="password", example="NewP4ssw0rd!"),
     *       @OA\Property(property="token", type="string", example="abc123xyz...")
     *     )
     *   ),
     *   @OA\Response(
     *     response=200,
     *     description="Password reset successful",
     *     @OA\JsonContent(
     *       @OA\Property(property="message", type="string", example="Contraseña restablecida exitosamente.")
     *     )
     *   ),
     *   @OA\Response(response=400, description="Invalid or expired token"),
     *   @OA\Response(response=422, description="Validation error", @OA\JsonContent(ref="#/components/schemas/Error"))
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
     * @OA\Get(
     *   path="/api/v1/auth/email/verify/{id}/{hash}",
     *   tags={"Auth"},
     *   summary="Verify email",
     *   description="Verifies the user's email via the signed URL.",
     *   operationId="authVerifyEmail",
     *   security={{"sanctum": {}}},
     *   @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *   @OA\Parameter(name="hash", in="path", required=true, @OA\Schema(type="string")),
     *   @OA\Response(
     *     response=200,
     *     description="Email verified successfully",
     *     @OA\JsonContent(
     *       @OA\Property(property="message", type="string", example="Correo verificado exitosamente.")
     *     )
     *   ),
     *   @OA\Response(response=401, description="Unauthenticated"),
     *   @OA\Response(response=403, description="Invalid signature")
     * )
     */
    public function verifyEmail(EmailVerificationRequest $request): JsonResponse
    {
        $request->fulfill();
        return response()->json(['message' => 'Correo verificado exitosamente.']);
    }

    /**
     * @OA\Post(
     *   path="/api/v1/auth/email/resend",
     *   tags={"Auth"},
     *   summary="Resend verification email",
     *   description="Resends the email verification link to the authenticated user.",
     *   operationId="authResendEmailVerification",
     *   security={{"sanctum": {}}},
     *   @OA\Response(
     *     response=200,
     *     description="Link sent successfully",
     *     @OA\JsonContent(
     *       @OA\Property(property="message", type="string", example="Enlace de verificación enviado.")
     *     )
     *   ),
     *   @OA\Response(response=400, description="Email already verified"),
     *   @OA\Response(response=401, description="Unauthenticated"),
     *   @OA\Response(response=429, description="Too many requests")
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
