<?php

namespace App\Http\Requests\Admin;

use App\Models\Testimonial;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class TestimonialRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'author_name' => ['required', 'string', 'max:255'],
            'author_title' => ['nullable', 'string', 'max:255'],
            'company' => ['nullable', 'string', 'max:255'],
            'quote' => ['required', 'string', 'max:5000'],
            'rating' => ['nullable', 'integer', 'min:1', 'max:5'],
            'status' => ['required', Rule::in([
                Testimonial::STATUS_DRAFT,
                Testimonial::STATUS_PUBLISHED,
                Testimonial::STATUS_ARCHIVED,
            ])],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'themes' => ['nullable', 'array'],
            'themes.*.enabled' => ['nullable', 'boolean'],
            'themes.*.priority' => ['nullable', 'integer', 'min:0'],
            'themes.*.is_featured' => ['nullable', 'boolean'],
        ];
    }

    protected function passedValidation(): void
    {
        $this->merge([
            'sort_order' => (int) ($this->input('sort_order') ?? 0),
        ]);
    }
}
