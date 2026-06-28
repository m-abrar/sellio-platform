<?php

namespace App\Http\Controllers\Api\V1\Dashboard\User;

use App\Http\Controllers\Controller;
use App\Models\PushToken;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PushTokenController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'token' => ['required', 'string', 'max:255', 'regex:/^Expo(?:nent)?PushToken\[[^\]]+\]$/'],
            'platform' => ['nullable', 'string', 'in:android,ios'],
            'device_name' => ['nullable', 'string', 'max:255'],
        ]);

        $token = PushToken::updateOrCreate(
            ['token' => $validated['token']],
            [
                'user_id' => $request->user()->id,
                'platform' => $validated['platform'] ?? null,
                'device_name' => $validated['device_name'] ?? null,
                'last_used_at' => now(),
            ],
        );

        return $this->successResponse(['id' => $token->id], __('Push notifications enabled.'));
    }

    public function destroy(Request $request): JsonResponse
    {
        $validated = $request->validate(['token' => ['required', 'string', 'max:255']]);
        $request->user()->pushTokens()->where('token', $validated['token'])->delete();

        return $this->successResponse(null, __('Push notifications disabled.'));
    }
}
