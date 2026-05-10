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
        // Sanitize the body to prevent Stored XSS while allowing safe HTML for email templates
        $safeHtml = strip_tags($this->body, '<a><b><i><u><strong><em><p><br><div><table><tr><td><th><thead><tbody><tfoot><ul><li><ol><h1><h2><h3><h4><h5><h6><img><span><hr>');
        
        $this->merge([
            'body' => $safeHtml,
        ]);
    }
}
