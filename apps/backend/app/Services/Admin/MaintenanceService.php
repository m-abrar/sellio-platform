<?php

namespace App\Services\Admin;

use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Log;
use App\Jobs\RegenerateMediaJob;

/**
 * Class MaintenanceService
 * Orchestrates administrative maintenance and diagnostic protocols, decoupling 
 * Artisan commands and system health checks from the HTTP layer.
 */
class MaintenanceService
{
    /**
     * Clear the application data cache.
     */
    public function clearCache(): void
    {
        Artisan::call('cache:clear');
    }

    /**
     * Clear the configuration cache.
     */
    public function clearConfig(): void
    {
        Artisan::call('config:clear');
    }

    /**
     * Clear the route registration cache.
     */
    public function clearRoute(): void
    {
        Artisan::call('route:clear');
    }

    /**
     * Clear the compiled Blade template cache.
     */
    public function clearView(): void
    {
        Artisan::call('view:clear');
    }

    /**
     * Execute a full application optimization and caching protocol.
     */
    public function optimize(): void
    {
        Artisan::call('optimize:clear');
        Artisan::call('optimize');
    }

    /**
     * Re-initialize the public storage symbolic link.
     */
    public function createStorageLink(): void
    {
        Artisan::call('storage:link');
    }

    /**
     * Queue a background task to regenerate all media asset variations.
     */
    public function queueMediaRegeneration(): void
    {
        RegenerateMediaJob::dispatch();
    }

    /**
     * Generate a comprehensive system health and environment status report.
     *
     * @return array
     */
    public function getStatusReport(): array
    {
        return [
            'requirements' => [
                __('PHP Version (>= 8.2)') => [
                    'met'   => version_compare(PHP_VERSION, '8.2.0', '>='),
                    'value' => PHP_VERSION,
                    'type'  => 'version'
                ],
                __('BCMath Extension')   => ['met' => extension_loaded('bcmath'), 'type' => 'extension'],
                __('Ctype Extension')    => ['met' => extension_loaded('ctype'), 'type' => 'extension'],
                __('Fileinfo Extension') => ['met' => extension_loaded('fileinfo'), 'type' => 'extension'],
                __('JSON Extension')     => ['met' => extension_loaded('json'), 'type' => 'extension'],
                __('Mbstring Extension') => ['met' => extension_loaded('mbstring'), 'type' => 'extension'],
                __('OpenSSL Extension')  => ['met' => extension_loaded('openssl'), 'type' => 'extension'],
                __('PDO Extension')      => ['met' => extension_loaded('pdo'), 'type' => 'extension'],
                __('Tokenizer Extension')=> ['met' => extension_loaded('tokenizer'), 'type' => 'extension'],
                __('XML Extension')      => ['met' => extension_loaded('xml'), 'type' => 'extension'],
                __('GD Extension')       => ['met' => extension_loaded('gd'), 'type' => 'extension'],
                __('Intl Extension')     => ['met' => extension_loaded('intl'), 'type' => 'extension'],
                __('Zip Extension')      => ['met' => extension_loaded('zip'), 'type' => 'extension'],
                __('Exif Extension')     => ['met' => extension_loaded('exif'), 'type' => 'extension'],
                __('CURL Extension')     => ['met' => extension_loaded('curl'), 'type' => 'extension'],
                __('exec() Function')    => ['met' => function_exists('exec'), 'type' => 'function'],
                __('passthru() Function')=> ['met' => function_exists('passthru'), 'type' => 'function'],
                __('shell_exec() Function') => ['met' => function_exists('shell_exec'), 'type' => 'function'],
                __('symlink() Function')    => ['met' => function_exists('symlink'), 'type' => 'function'],
            ],
            'permissions' => [
                'storage' => [
                    'path' => storage_path(),
                    'met'  => is_writable(storage_path()),
                ],
                'bootstrap/cache' => [
                    'path' => base_path('bootstrap/cache'),
                    'met'  => is_writable(base_path('bootstrap/cache')),
                ],
                '.env' => [
                    'path' => base_path('.env'),
                    'met'  => is_writable(base_path('.env')),
                ],
            ]
        ];
    }
}
