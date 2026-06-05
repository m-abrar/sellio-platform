<?php

namespace App\Http\Requests;

use App\Models\Property;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

/**
 * Class StorePropertyBookingRequest
 *
 * Validates the final booking submission before it is saved to the database.
 */
class StorePropertyBookingRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize(): bool
    {
        return auth()->check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, array<int, string>>
     */
    public function rules(): array
    {
        return [
            'property_id' => ['required', 'exists:properties,id'],
            'check_in'    => ['required', 'date', 'after_or_equal:today'],
            'check_out'   => ['required', 'date', 'after:check_in'],
            'guests'      => ['required', 'integer', 'min:1', 'max:20'],
            'full_name'   => ['required', 'string', 'max:255'],
            'email'       => ['required', 'email', 'max:255'],
            'phone'       => ['nullable', 'string', 'max:20'],
            'message'     => ['nullable', 'string', 'max:500'],
            // Added validation for add-ons
            'add_ons'     => ['nullable', 'array'],
            'add_ons.*.qty' => ['required', 'integer', 'min:0', 'max:20'],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator) {
            $propertyId = $this->input('property_id');
            $guests = (int) $this->input('guests', 0);

            if (! $propertyId || $guests < 1) {
                return;
            }

            $property = Property::find($propertyId);

            if ($property && $guests > $property->booking_guest_capacity) {
                $validator->errors()->add('guests', __('This property allows up to :count guests.', [
                    'count' => $property->booking_guest_capacity,
                ]));
            }
        });
    }
}
