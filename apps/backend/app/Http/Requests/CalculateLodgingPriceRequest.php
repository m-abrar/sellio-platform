<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Class CalculateLodgingPriceRequest
 * Validates temporal parameters for lodging price estimation, ensuring 
 * chronological integrity and valid date sequences for stay duration.
 */
class CalculateLodgingPriceRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to perform lodging price calculations.
     *
     * @return bool
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Define the temporal validation constraints for lodging duration.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'check_in'  => ['required', 'date'],
            'check_out' => ['required', 'date', 'after:check_in'],
        ];
    }
}
