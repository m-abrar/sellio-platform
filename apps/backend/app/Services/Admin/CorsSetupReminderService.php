<?php

namespace App\Services\Admin;

use App\Models\Setting;
use App\Services\CorsOriginResolver;
use Illuminate\Support\Facades\Schema;

class CorsSetupReminderService
{
    private const PLACEHOLDER_MARKERS = [
        'your-laravel-domain.com',
        'your-domain.com',
        'yourdomain.com',
        'marketplace.yourdomain.com',
        'demo.sellio.buzz',
        'example.com',
        'changeme',
        'replace-me',
        'placeholder',
    ];

    /**
     * @var array<string, string>
     */
    private const PORTAL_FIELDS = [
        'url_frontend' => 'Public Storefront URL',
        'url_admin' => 'Admin Control Panel URL',
        'url_partner' => 'Partner Portal URL',
        'url_user' => 'Customer App URL',
    ];

    public function __construct(
        protected CorsOriginResolver $corsOriginResolver,
        protected PlatformUrlVerificationService $platformUrlVerificationService,
    ) {}

    /**
     * @return array{
     *     title: string,
     *     summary: string,
     *     issues: list<array{field: string, label: string, value: string, detail: string}>,
     *     settings_url: string,
     *     active_origins: list<string>
     * }|null
     */
    public function getReminder(): ?array
    {
        if (! $this->shouldEvaluate()) {
            return null;
        }

        $issues = $this->collectIssues();

        if ($issues === []) {
            return null;
        }

        return [
            'title' => __('Platform URLs need your attention'),
            'summary' => __('Enter your real storefront, admin, partner, and customer URLs in Settings → System, then verify each one. CORS updates automatically after you save verified URLs.'),
            'issues' => $issues,
            'settings_url' => route('admin.settings.group', ['section' => 'system']),
            'active_origins' => $this->corsOriginResolver->resolve(),
        ];
    }

    protected function shouldEvaluate(): bool
    {
        if (! auth()->check()) {
            return false;
        }

        if (! auth()->user()->hasRole(['admin', 'super-admin'])) {
            return false;
        }

        try {
            return Schema::hasTable('settings');
        } catch (\Throwable) {
            return false;
        }
    }

    /**
     * @return list<array{field: string, label: string, value: string, detail: string}>
     */
    protected function collectIssues(): array
    {
        $issues = [];

        foreach (self::PORTAL_FIELDS as $field => $label) {
            $issue = $this->inspectPortalUrl($field, $label, Setting::get($field, ''));

            if ($issue !== null) {
                $issues[] = $issue;
            }
        }

        return $issues;
    }

    /**
     * @return array{field: string, label: string, value: string, detail: string}|null
     */
    protected function inspectPortalUrl(string $field, string $label, mixed $value): ?array
    {
        if (! is_string($value) || trim($value) === '') {
            return [
                'field' => $field,
                'label' => $label,
                'value' => '',
                'detail' => __('Not set'),
            ];
        }

        $value = trim($value);
        $host = $this->hostnameFromUrl($value);

        if ($host === null) {
            return [
                'field' => $field,
                'label' => $label,
                'value' => $value,
                'detail' => __('Invalid URL'),
            ];
        }

        if ($this->isPlaceholderHost($host)) {
            return [
                'field' => $field,
                'label' => $label,
                'value' => $value,
                'detail' => __('Still a placeholder domain'),
            ];
        }

        if ($this->isLocalHost($host) && ! app()->environment('local')) {
            return [
                'field' => $field,
                'label' => $label,
                'value' => $value,
                'detail' => __('Still points to localhost'),
            ];
        }

        if (! $this->platformUrlVerificationService->isConnected($field, $value)) {
            return [
                'field' => $field,
                'label' => $label,
                'value' => $value,
                'detail' => __('Saved but not verified — open Settings → System and test the connection'),
            ];
        }

        return null;
    }

    protected function hostnameFromUrl(string $url): ?string
    {
        $normalized = preg_match('#^https?://#i', $url) ? $url : 'https://' . $url;

        $host = parse_url($normalized, PHP_URL_HOST);

        return is_string($host) ? strtolower($host) : null;
    }

    protected function isPlaceholderHost(string $hostname): bool
    {
        foreach (self::PLACEHOLDER_MARKERS as $marker) {
            if (str_contains($hostname, $marker)) {
                return true;
            }
        }

        return false;
    }

    protected function isLocalHost(string $hostname): bool
    {
        return in_array($hostname, ['localhost', '127.0.0.1'], true);
    }
}
