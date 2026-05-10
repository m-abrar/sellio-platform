<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Carbon\Carbon;

class ReportRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->check() && (auth()->user()->hasRole('admin') || auth()->user()->hasRole('super-admin'));
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'start_date' => 'nullable|date|before_or_equal:end_date',
            'end_date'   => 'nullable|date|after_or_equal:start_date',
        ];
    }

    /**
     * Get validated dates with fallbacks.
     */
    public function getDates(int $defaultDays = 365): array
    {
        $endDate   = $this->filled('end_date') ? Carbon::parse($this->end_date) : now();
        $startDate = $this->filled('start_date') ? Carbon::parse($this->start_date) : now()->subDays($defaultDays);

        if ($startDate->greaterThan($endDate)) {
            $startDate = $endDate->copy()->subDays($defaultDays);
        }

        return [$startDate, $endDate];
    }
}
