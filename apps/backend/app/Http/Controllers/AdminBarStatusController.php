<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AdminBarStatusController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        $user = Auth::user();

        if (! $user || ! $user->hasAnyRole(['super-admin', 'admin'])) {
            return response()->json([
                'authenticated' => false,
                'user' => null,
            ]);
        }

        return response()->json([
            'authenticated' => true,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'roles' => $user->getRoleNames(),
            ],
        ]);
    }
}
