<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(LoginRequest $request)
    {

        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        // Generate dynamic token
        $token = $user->createToken('auth_token')->plainTextToken;

        return $this->successResponse([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'roles' => $user->getRoleNames(), // Spatie method
            ]
        ]);
    }

    public function logout(Request $request)
    {
        $user = $request->user();

        if ($user) {
            // This deletes the specific token used for this request
            $user->currentAccessToken()->delete();
            
            return $this->successResponse(null, 'Logged out successfully');
        }

        return $this->errorResponse('Already logged out or session expired', 401);
    }

    /**
     * Refresh the current Sanctum token.
     * Deletes the existing token and issues a fresh one.
     */
    public function refresh(Request $request): \Illuminate\Http\JsonResponse
    {
        $user = $request->user();

        $user->currentAccessToken()->delete();

        return $this->successResponse([
            'access_token' => $user->createToken('auth_token')->plainTextToken,
            'token_type'   => 'Bearer',
        ]);
    }

    public function register(RegisterRequest $request)
    {

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'username' => $request->username,
            'password' => $request->password, // Encrypted by cast
            'is_buyer' => $request->role === 'user',
        ]);

        $user->assignRole($request->role);

        $token = $user->createToken('auth_token')->plainTextToken;

        return $this->successResponse([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'roles' => $user->getRoleNames(),
            ]
        ], 'Registration successful', 201);
    }

}
