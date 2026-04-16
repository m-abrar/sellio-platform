<?php

namespace App\Http\Requests\Partner;

use Illuminate\Foundation\Http\FormRequest;

class ProcessWithdrawalRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        /** @var \App\Models\User $partner */
        $partner = $this->user();
        $maxBalanceDollars = number_format($partner->balance / 100, 2, '.', '');
        
        return [
            'amount' => [
                'required', 
                'numeric', 
                'min:10.00',
                'max:' . $maxBalanceDollars, 
            ],
        ];
    }
}
