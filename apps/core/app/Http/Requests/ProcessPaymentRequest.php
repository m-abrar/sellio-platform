<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProcessPaymentRequest extends FormRequest
{
    protected function prepareForValidation()
    {
        $this->merge([
            'card_number' => str_replace([' ', '-', '_'], '', $this->card_number),
        ]);
    }

    public function rules(): array
    {
        return [
            'card_number'  => ['required', 'numeric', 'digits_between:14,19'],
            'name_on_card' => ['required', 'string', 'max:255'],
            'mm_yy'        => ['required', 'regex:/^(0[1-9]|1[0-2])\/\d{2}$/'],
            'cvc'          => ['required', 'numeric', 'digits_between:3,4'],
            'termsCheck'   => ['accepted'],
        ];
    }
}
