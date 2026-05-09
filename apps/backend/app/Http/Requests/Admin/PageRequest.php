<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class PageRequest extends FormRequest
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
        $pageId = $this->route('page') ? $this->route('page')->id : null;

        return [
            'title'            => ['required', 'string', 'max:255', 'unique:pages,title,' . $pageId],
            'slug'             => ['nullable', 'string', 'max:255', 'regex:/^[a-z0-9-]+$/', 'unique:pages,slug,' . $pageId],
            'type'             => ['nullable', 'string', 'max:50', 'in:page,header,footer,system,landing'],
            'image'            => ['nullable', 'string', 'max:255'],
            'meta_description' => ['nullable', 'string', 'max:500'],
            'meta_keywords'    => ['nullable', 'string', 'max:500'],
            'css'              => ['nullable', 'string'],
            'html'             => ['nullable', 'string'],
            'header_id'        => ['nullable', 'exists:pages,id'],
            'footer_id'        => ['nullable', 'exists:pages,id'],
            'status'           => ['required', 'string', 'in:active,inactive,draft'],
        ];
    }
}
