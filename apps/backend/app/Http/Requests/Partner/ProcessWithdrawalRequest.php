<?php

namespace App\Http\Requests\Partner;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Class ProcessWithdrawalRequest
 * Validates the inbound payout request, ensuring the requested amount 
 * adheres to the platform's minimum threshold and the partner's available balance.
 */
class ProcessWithdrawalRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize(): bool
    {
        return $this->user() && $this->user()->hasRole('partner');
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
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
            'payout_method_id' => [
                'required',
                'integer',
                'exists:payout_methods,id',
            ],
        ];
    }
}
