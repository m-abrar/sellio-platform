<?php

namespace App\Http\Requests\Admin;

use App\Models\Subscription;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class SubscriptionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->check() && auth()->user()->hasRole('super-admin');
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'user_id'   => 'required|exists:users,id',
            'plan_id'   => 'required|exists:plans,id',
            'title'     => 'required|string|max:255',
            'status'    => ['required', Rule::in([
                Subscription::STATUS_ACTIVE, 
                Subscription::STATUS_ON_TRIAL, 
                Subscription::STATUS_PAST_DUE, 
                Subscription::STATUS_CANCELLED, 
                Subscription::STATUS_EXPIRED
            ])],
            'starts_at' => 'required|date',
            'ends_at'   => 'nullable|date|after_or_equal:starts_at',
        ];
    }
}
