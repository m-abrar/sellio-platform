<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\Auth\SendResetLinkEmailRequest;
use App\Http\Requests\Auth\ResetPasswordRequest;
use Illuminate\Support\Facades\Password;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Support\Str;
use App\Notifications\MobileResetPasswordNotification;

class PasswordResetController extends Controller
{
    public function sendResetLinkEmail(SendResetLinkEmailRequest $request)
    {

        $callback = $request->validated('client') === 'mobile'
            ? function ($user, string $token): void {
                $user->notify(new MobileResetPasswordNotification($token));
            }
            : null;

        $status = Password::broker()->sendResetLink(
            $request->only('email'),
            $callback,
        );

        if ($status === Password::RESET_LINK_SENT) {
            return $this->successResponse(null, __($status));
        }
        return $this->errorResponse(__($status), 422);
    }

    public function reset(ResetPasswordRequest $request)
    {        // Validation handled by FormRequest

        $status = Password::broker()->reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, $password) {
                $user->forceFill([
                    'password' => $password
                ])->setRememberToken(Str::random(60));

                $user->save();

                event(new PasswordReset($user));
            }
        );

        if ($status === Password::PASSWORD_RESET) {
            return $this->successResponse(null, __($status));
        }
        return $this->errorResponse(__($status), 422);
    }
}
