<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SearchBlogRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'search'   => ['nullable', 'string', 'max:100'],
            'category' => ['nullable', 'string', 'exists:categories,slug'],
            'tag'      => ['nullable', 'string', 'exists:tags,slug'],
            'sort'     => ['nullable', 'in:latest,popular,oldest'],
        ];
    }
}
