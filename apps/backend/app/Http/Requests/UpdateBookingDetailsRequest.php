<?php

namespace App\Http\Requests;

use App\Models\EventBooking;
use App\Models\PropertyBooking;
use Illuminate\Foundation\Http\FormRequest;

/**
 * Class UpdateBookingDetailsRequest
 *
 * Handles validation for updating attendee information during checkout.
 */
class UpdateBookingDetailsRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize(): bool
    {
        $booking = $this->route('booking');
        if ($booking) {
            // Check both PropertyBooking and EventBooking as they might use the same request
            // This is a common pattern in the unified dashboard
            $userId = auth()->id();
            
            $isPropertyOwner = PropertyBooking::where('id', $booking instanceof PropertyBooking ? $booking->id : $booking)
                ->where('user_id', $userId)
                ->exists();
                
            $isEventOwner = EventBooking::where('id', $booking instanceof EventBooking ? $booking->id : $booking)
                ->where('user_id', $userId)
                ->exists();
                
            return $isPropertyOwner || $isEventOwner;
        }
        return auth()->check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules(): array
    {
        return [
            'user_name'  => 'required|string|max:255',
            'user_email' => 'required|email|max:255',
            'user_phone' => 'nullable|string|max:20',
        ];
    }
}
