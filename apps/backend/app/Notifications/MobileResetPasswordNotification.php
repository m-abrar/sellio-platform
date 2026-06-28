<?php

namespace App\Notifications;

use Illuminate\Auth\Notifications\ResetPassword;

class MobileResetPasswordNotification extends ResetPassword
{
    /**
     * Build a deep link handled by the Expo Router reset-password screen.
     */
    protected function resetUrl($notifiable): string
    {
        return 'sellio://reset-password?' . http_build_query([
            'token' => $this->token,
            'email' => $notifiable->getEmailForPasswordReset(),
        ], '', '&', PHP_QUERY_RFC3986);
    }
}
