<?php

namespace App\Services;

use App\Models\Setting;
use Illuminate\Support\Facades\Schema;

class CorsOriginResolver
{
    /**
     * Resolve the browser origins allowed to call the Laravel API.
     *
     * @return list<string>
     */
    public function resolve(): array
    {
        $candidates = array_merge(
            $this->settingsOrigins(),
            $this->envOrigins(),
            $this->localDevOrigins(),
        );

        $origins = array_values(array_unique(array_filter(
            array_map(fn (?string $value) => $this->normalizeOrigin($value), $candidates)
        )));

        sort($origins);

        return $origins;
    }

    /**
     * @return list<string>
     */
    protected function settingsOrigins(): array
    {
        try {
            if (! Schema::hasTable('settings')) {
                return [];
            }
        } catch (\Throwable) {
            return [];
        }

        $origins = [];

        foreach (['url_frontend', 'url_partner', 'url_user'] as $key) {
            $value = Setting::get($key);

            if (is_string($value) && $value !== '') {
                $origins[] = $value;
            }
        }

        $extra = Setting::get('cors_allowed_origins', '');

        if (is_string($extra) && $extra !== '') {
            $origins = array_merge($origins, $this->parseList($extra));
        }

        return $origins;
    }

    /**
     * @return list<string>
     */
    protected function envOrigins(): array
    {
        return array_values(array_filter(array_merge(
            [
                env('FRONTEND_URL'),
                env('STOREFRONT_URL'),
                env('SELLER_APP_URL'),
                env('BUYER_APP_URL'),
            ],
            $this->parseList((string) env('CORS_ALLOWED_ORIGINS', '')),
        )));
    }

    /**
     * @return list<string>
     */
    protected function localDevOrigins(): array
    {
        if (! app()->environment('local', 'testing')) {
            return [];
        }

        return [
            'http://localhost:3000',
            'http://127.0.0.1:3000',
            'http://localhost:3002',
            'http://127.0.0.1:3002',
            'http://localhost:3003',
            'http://127.0.0.1:3003',
            'http://localhost:5173',
            'http://127.0.0.1:5173',
        ];
    }

    /**
     * @return list<string>
     */
    protected function parseList(string $value): array
    {
        return array_values(array_filter(array_map(
            'trim',
            preg_split('/[\r\n,]+/', $value) ?: []
        )));
    }

    public function normalizeOrigin(?string $value): ?string
    {
        if ($value === null || trim($value) === '') {
            return null;
        }

        $value = trim($value);

        if (! preg_match('#^https?://#i', $value)) {
            $value = 'https://' . $value;
        }

        $parts = parse_url($value);

        if ($parts === false || empty($parts['host'])) {
            return null;
        }

        $scheme = strtolower($parts['scheme'] ?? 'https');
        $host = strtolower($parts['host']);
        $port = $parts['port'] ?? null;
        $defaultPort = $scheme === 'https' ? 443 : 80;

        $origin = $scheme . '://' . $host;

        if ($port !== null && (int) $port !== $defaultPort) {
            $origin .= ':' . $port;
        }

        return $origin;
    }
}
