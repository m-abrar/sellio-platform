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
        $body = $this->body;

        // 1. Initial structural sanitization via allowlist
        $body = strip_tags($body, '<a><b><i><u><strong><em><p><br><div><table><tr><td><th><thead><tbody><tfoot><ul><li><ol><h1><h2><h3><h4><h5><h6><img><span><hr>');

        // 2. ELITE DEFENSE: Aggressively remove all 'on*' event handlers (e.g. onerror, onclick)
        // This mitigates the primary limitation of strip_tags which preserves attributes.
        $body = preg_replace('/\s+on\w+\s*=\s*["\'].*?["\']/i', '', $body);
        $body = preg_replace('/\s+on\w+\s*=\s*[^\s>]+/i', '', $body);

        // 3. SECURE URIs: Block javascript: and data: pseudo-protocols in sensitive attributes
        $body = preg_replace('/(href|src|background|formaction)\s*=\s*["\']\s*(javascript|data):.*?["\']/i', '$1="#"', $body);

        $this->merge([
            'body' => $body,
        ]);
    }
}
