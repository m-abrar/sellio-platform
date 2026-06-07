<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateEmailTemplateRequest extends FormRequest
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
     */
    public function rules(): array
    {
        return [
            'subject'   => ['required', 'string', 'max:255'],
            'body'      => ['required', 'string'],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }

    /**
     * Handle post-validation sanitization.
     */
    protected function passedValidation(): void
    {
        $this->merge([
            'body' => sanitize_rich_html(
                $this->body,
                '<a><b><i><u><strong><em><p><br><div><table><tr><td><th><thead><tbody><tfoot><ul><li><ol><h1><h2><h3><h4><h5><h6><img><span><hr><style>'
            ),
        ]);
    }
}
