<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Class SearchBlogRequest
 * Orchestrates the validation logic for faceted blog content discovery,
 * managing search vectors, categorical filtering, and taxonomy-based queries.
 */
class SearchBlogRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to perform faceted search operations.
     *
     * @return bool
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Define the validation parameters for optimized blog content indexing.
     *
     * @return array<string, mixed>
     */
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
