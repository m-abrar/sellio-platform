<?php

namespace App\Services\Admin;

use App\Models\Setting;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class PlatformUrlVerificationService
{
    /**
     * @var array<string, array{label: string, placeholder: string}>
     */
    public const URL_FIELDS = [
        'url_frontend' => [
            'label' => 'Public Storefront URL',
            'placeholder' => 'https://www.yourdomain.com',
        ],
        'url_admin' => [
            'label' => 'Admin Control Panel URL',
            'placeholder' => 'https://www.yourdomain.com/admin',
        ],
        'url_partner' => [
            'label' => 'Partner Portal URL',
            'placeholder' => 'https://seller.yourdomain.com',
        ],
        'url_user' => [
            'label' => 'Customer App URL',
            'placeholder' => 'https://buyer.yourdomain.com',
        ],
    ];

    /**
     * @return array<string, array{
     *     field: string,
     *     label: string,
     *     placeholder: string,
     *     value: string,
     *     connected: bool,
     *     status: string,
     *     status_message: string
     * }>
     */
    public function getFieldsMetadata(array $settings): array
    {
        $metadata = [];

        foreach (self::URL_FIELDS as $field => $config) {
            $value = trim((string) ($settings[$field] ?? ''));
            $connected = $this->isConnected($field, $value);

            $metadata[$field] = [
                'field' => $field,
                'label' => __($config['label']),
                'placeholder' => $config['placeholder'],
                'value' => $value,
                'connected' => $connected,
                'status' => $this->resolveStatus($value, $connected),
                'status_message' => $this->resolveStatusMessage($value, $connected),
            ];
        }

        return $metadata;
    }

    /**
     * @return array{connected: bool, message: string, status_code: int|null}
     */
    public function verify(string $field, string $url): array
    {
        if (! array_key_exists($field, self::URL_FIELDS)) {
            return [
                'connected' => false,
                'message' => __('Unknown platform URL field.'),
                'status_code' => null,
            ];
        }

        $normalized = $this->normalizeUrl($url);

        if ($normalized === null) {
            return [
                'connected' => false,
                'message' => __('Enter a valid absolute URL (including https://).'),
                'status_code' => null,
            ];
        }

        try {
            $response = Http::withOptions([
                'verify' => false,
                'allow_redirects' => true,
            ])
                ->timeout(12)
                ->withHeaders([
                    'User-Agent' => 'Sellio-Platform-URL-Verifier/1.0',
                ])
                ->get($normalized);

            $statusCode = $response->status();
            $connected = $response->successful() || in_array($statusCode, [401, 403], true);

            if ($connected) {
                $this->markConnected($field, $normalized);

                return [
                    'connected' => true,
                    'message' => __('Connected — the URL responded successfully.'),
                    'status_code' => $statusCode,
                ];
            }

            $this->markDisconnected($field);

            return [
                'connected' => false,
                'message' => __('The URL responded with HTTP :code. Check the domain, path, and SSL certificate.', [
                    'code' => $statusCode,
                ]),
                'status_code' => $statusCode,
            ];
        } catch (\Throwable $exception) {
            $this->markDisconnected($field);

            return [
                'connected' => false,
                'message' => __('Could not reach this URL: :error', [
                    'error' => Str::limit($exception->getMessage(), 180),
                ]),
                'status_code' => null,
            ];
        }
    }

    public function isConnected(string $field, ?string $currentUrl = null): bool
    {
        $currentUrl = trim((string) ($currentUrl ?? Setting::get($field, '')));

        if ($currentUrl === '') {
            return false;
        }

        $normalizedCurrent = $this->normalizeUrl($currentUrl);
        $verifiedUrl = Setting::get($this->verifiedUrlKey($field), '');

        return Setting::get($this->verifiedKey($field), '') === '1'
            && $verifiedUrl !== ''
            && $verifiedUrl === $normalizedCurrent;
    }

    public function markConnected(string $field, string $url): void
    {
        $normalized = $this->normalizeUrl($url);

        Setting::set($this->verifiedKey($field), '1');
        Setting::set($this->verifiedUrlKey($field), $normalized ?? trim($url));
    }

    public function markDisconnected(string $field): void
    {
        Setting::set($this->verifiedKey($field), '0');
        Setting::set($this->verifiedUrlKey($field), '');
    }

    public function syncVerificationOnSave(string $field, mixed $value): void
    {
        if (! array_key_exists($field, self::URL_FIELDS)) {
            return;
        }

        $normalized = $this->normalizeUrl(is_string($value) ? $value : '');
        $storedVerifiedUrl = Setting::get($this->verifiedUrlKey($field), '');

        if ($normalized === null || $normalized !== $storedVerifiedUrl) {
            $this->markDisconnected($field);
        }
    }

    public function verifiedKey(string $field): string
    {
        return $field . '_verified';
    }

    public function verifiedUrlKey(string $field): string
    {
        return $field . '_verified_url';
    }

    protected function resolveStatus(string $value, bool $connected): string
    {
        if ($value === '') {
            return 'empty';
        }

        return $connected ? 'connected' : 'unverified';
    }

    protected function resolveStatusMessage(string $value, bool $connected): string
    {
        if ($value === '') {
            return __('Not configured');
        }

        if ($connected) {
            return __('Connected');
        }

        return __('Not verified — test the URL before saving');
    }

    protected function normalizeUrl(?string $url): ?string
    {
        if (! is_string($url)) {
            return null;
        }

        $url = trim($url);

        if ($url === '') {
            return null;
        }

        if (! preg_match('#^https?://#i', $url)) {
            $url = 'https://' . $url;
        }

        if (filter_var($url, FILTER_VALIDATE_URL) === false) {
            return null;
        }

        return rtrim($url, '/');
    }
}
