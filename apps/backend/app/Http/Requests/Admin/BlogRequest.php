<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;

class BlogRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        $blogId = $this->route('blog') ? $this->route('blog')->id : null;

        return [
            'title'           => ['required', 'string', 'max:255'],
            'slug'            => ['nullable', 'string', 'max:255', 'unique:blogs,slug,' . $blogId],
            'category_id'     => ['required', 'exists:categories,id'],
            'content'         => ['required', 'string'],
            'subtitle'        => ['nullable', 'string', 'max:255'],
            'reading_time'    => ['nullable', 'integer', 'min:1'],
            'video'           => ['nullable', 'string'],
            'is_published'    => ['nullable', 'boolean'],
            'is_featured'     => ['nullable', 'boolean'],
            'allow_comments'  => ['nullable', 'boolean'],
            'featured_image'  => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif,webp', 'max:5120'],
            'tags'            => ['nullable', 'array'],
            'tags.*'          => ['exists:tags,id'],
            'meta_title'      => ['nullable', 'string', 'max:255'],
            'meta_description'=> ['nullable', 'string', 'max:500'],
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        if ($this->filled('title') && !$this->filled('slug')) {
            $this->merge([
                'slug' => Str::slug($this->title),
            ]);
        }
    }
}
