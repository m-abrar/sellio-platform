<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use App\Http\Resources\UserResource;

class AuthController extends Controller
{
    /**
     * @var \App\Services\AuthService
     */
    protected $authService;

    /**
     * AuthController constructor.
     *
     * @param  \App\Services\AuthService  $authService
     */
    public function __construct(\App\Services\AuthService $authService)
    {
        $this->authService = $authService;
    }

    public function login(LoginRequest $request)
    {
        $result = $this->authService->login($request->email, $request->password);
        $user = $result['user'];

        return $this->successResponse([
            'access_token' => $result['token'],
            'token_type'   => 'Bearer',
            'user'         => new UserResource($user),
        ]);
    }

    public function logout(Request $request)
    {
        $user = $request->user();

        if ($user) {
            $this->authService->logout($user);
            return $this->successResponse(null, __('Logged out successfully'));
        }

        return $this->errorResponse(__('Already logged out or session expired'), 401);
    }

    /**
     * Refresh the current Sanctum token.
     */
    public function refresh(Request $request): \Illuminate\Http\JsonResponse
    {
        $token = $this->authService->refreshToken($request->user());

        return $this->successResponse([
            'access_token' => $token,
            'token_type'   => 'Bearer',
        ]);
    }

    public function register(RegisterRequest $request)
    {
        $result = $this->authService->register($request->validated(), $request->role);
        $user = $result['user'];

        return $this->successResponse([
            'access_token' => $result['token'],
            'token_type'   => 'Bearer',
            'user'         => new UserResource($user),
        ], __('Registration successful'), 201);
    }

}
