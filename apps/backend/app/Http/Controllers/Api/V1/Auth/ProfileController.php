<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Http\Requests\Auth\UpdateProfileRequest;
use App\Http\Requests\Auth\UpdatePasswordRequest;

class ProfileController extends Controller
{
    public function show(Request $request)
    {
        $user = $request->user();

        return $this->successResponse([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'phone' => $user->phone,
            'username' => $user->username,
            'roles' => $user->getRoleNames(),
            'avatar_url' => $user->avatar_url,
        ]);
    }

    public function update(UpdateProfileRequest $request)
    {
        $user = $request->user();

        $user->update([
            'name' => $request->name,
            'phone' => $request->phone,
            'username' => $request->username,
        ]);

        return $this->successResponse(
            [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'username' => $user->username,
            ],
            'Profile updated successfully'
        );
    }

    public function updatePassword(UpdatePasswordRequest $request)
    {
        $user = $request->user();

        if (!Hash::check($request->current_password, $user->password)) {
            return $this->errorResponse(
                'The provided current password does not match our records.',
                422,
                ['current_password' => ['The provided current password does not match our records.']],
            );
        }

        $user->update([
            'password' => $request->password, // Encrypted by cast
        ]);

        return $this->successResponse(null, 'Password updated successfully'
        );
    }
}
