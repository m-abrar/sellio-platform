<?php

namespace App\Services;

use App\Models\Auto;
use App\Models\AutoInquiry;
use Illuminate\Support\Facades\Auth;

/**
 * Class AutoInquiryService
 *
 * Handles the business logic for processing vehicle-specific inquiries.
 */
class AutoInquiryService
{
    /**
     * Create a new inquiry record for a specific vehicle.
     *
     * @param Auto $auto
     * @param array $data
     * @return AutoInquiry
     */
    public function createInquiry(Auto $auto, array $data): AutoInquiry
    {
        return AutoInquiry::create([
            'user_id'        => Auth::id(),
            'auto_id'        => $auto->id,
            'full_name'      => $data['full_name'],
            'email'          => $data['email'],
            'phone'          => $data['phone'] ?? null,
            'preferred_date' => $data['preferred_date'],
            'preferred_time' => $data['preferred_time'],
            'message'        => $data['message'] ?? null,
            'status'         => 'pending',
        ]);
    }
}
