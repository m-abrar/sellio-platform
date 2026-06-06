<?php

namespace App\Services;

use App\Models\PageContent;
use App\DTOs\ContentResult;
use Illuminate\Support\Facades\{Cache, Auth, Config, Schema, Storage};
use Illuminate\Http\Request;

class ContentService
{
    protected const FILE_COLLECTION = 'page_content';
    protected string $contentScope;

    public function __construct(Request $request)
    {
        $this->contentScope = Config::get('content.blade_scope', 'laravel_blade');
    }

    protected array $localCache = [];
    protected bool $isPrimed = false;

    public function get(string $keyString, $default = null): mixed
    {
        $parts = explode('.', $keyString);
        if (count($parts) < 3) return $default;
        [$page, $section, $key] = $parts; 

        if (! Schema::hasTable('page_contents')) {
            return content_display($default, $default);
        }

        $isAdmin = Auth::check() && Auth::user()->hasRole(['admin', 'super-admin']);
        $frontendEditEnabled = (bool) setting('frontend_edit', false);

        // Visitor/Guest Path (Uses Global Cache)
        if (!$isAdmin || !$frontendEditEnabled) {
            $cacheKey = $this->generateCacheKey($page, $section, $key);

            return content_display(
                Cache::rememberForever($cacheKey, fn() => $this->fetchFromDb($page, $section, $key, $default)),
                $default
            );
        }

        // Admin Path (Optimized with Local Priming to avoid N+1)
        if (!$this->isPrimed) {
            $this->primeLocalCache($page);
        }

        $localKey = "{$section}.{$key}";
        if (isset($this->localCache[$localKey])) {
            $setting = $this->localCache[$localKey];
        } else {
            // Fallback for missing keys (still creates if missing)
            $setting = PageContent::firstOrCreate([
                'theme_key'   => $this->contentScope,
                'page'        => $page,
                'section'     => $section,
                'content_key' => $key,
            ], [
                'value'       => $default,
                'input_type'  => 'text',
            ]);
            $this->localCache[$localKey] = $setting;
        }

        return new ContentResult(
            id: $setting->id, 
            value: $this->formatValue($setting, $default)
        );
    }

    protected function primeLocalCache(string $page): void
    {
        $contents = PageContent::where('theme_key', $this->contentScope)
            ->where('page', $page)
            ->get();

        foreach ($contents as $content) {
            $this->localCache["{$content->section}.{$content->content_key}"] = $content;
        }
        $this->isPrimed = true;
    }

    protected function formatValue(PageContent $setting, $default): mixed
    {
        if (in_array($setting->input_type, ['logo', 'file', 'image'])) {
            // Logic to handle media library or raw paths
            $value = $setting->value ?? $default;
            return $value ? Storage::url($value) : $default;
        }
        return $setting->value ?? $default;
    }

    protected function fetchFromDb($page, $section, $key, $default)
    {
        $setting = PageContent::where([
            'theme_key'    => $this->contentScope,
            'page'        => $page,
            'section'     => $section,
            'content_key' => $key,
        ])->first();

        if (!$setting) {
            return content_display($default, $default);
        }

        return content_display($this->formatValue($setting, $default), $default);
    }

    public function forgetCache(PageContent $setting): void
    {
        Cache::forget($this->generateCacheKey($setting->page, $setting->section, $setting->content_key, $setting->theme_key));
    }

    protected function generateCacheKey($page, $section, $key, ?string $scope = null): string
    {
        $scope ??= $this->contentScope;

        return "page_content.{$scope}.{$page}.{$section}.{$key}";
    }
}
