<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Log;
use App\Jobs\RegenerateMediaJob;
use Illuminate\View\View;

/**
 * Class SystemController
 * Orchestrates administrative maintenance and diagnostic protocols, coordinating 
 * server-level optimization, cache synchronization, and system health monitoring.
 */
class SystemController extends Controller
{
    /**
     * Display the centralized System Maintenance dashboard.
     *
     * @return \Illuminate\View\View
     */
    public function maintenance(): View
    {
        return view('admin.system.maintenance');
    }

    /**
     * Clear the application data cache and handle response protocols.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse|\Illuminate\Http\RedirectResponse
     */
    public function clearCache(Request $request): JsonResponse|RedirectResponse
    {
        try {
            Artisan::call('cache:clear');
            $msg = __('Application cache cleared successfully!');
            return $request->ajax() 
                ? response()->json(['success' => true, 'message' => $msg]) 
                : back()->with('success', $msg);
        } catch (\Exception $e) {
            Log::error("System Maintenance - Cache Clear Error: " . $e->getMessage());
            $msg = __('Failed to clear application cache: :error', ['error' => $e->getMessage()]);
            return $request->ajax() 
                ? response()->json(['success' => false, 'message' => $msg], 500) 
                : back()->with('error', $msg);
        }
    }

    /**
     * Clear the configuration cache to re-initialize environment parameters.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse|\Illuminate\Http\RedirectResponse
     */
    public function clearConfig(Request $request): JsonResponse|RedirectResponse
    {
        try {
            Artisan::call('config:clear');
            $msg = __('Configuration cache cleared successfully!');
            return $request->ajax() 
                ? response()->json(['success' => true, 'message' => $msg]) 
                : back()->with('success', $msg);
        } catch (\Exception $e) {
            Log::error("System Maintenance - Config Clear Error: " . $e->getMessage());
            $msg = __('Failed to clear configuration cache.');
            return $request->ajax() 
                ? response()->json(['success' => false, 'message' => $msg], 500) 
                : back()->with('error', $msg);
        }
    }

    /**
     * Clear the route registration cache.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse|\Illuminate\Http\RedirectResponse
     */
    public function clearRoute(Request $request): JsonResponse|RedirectResponse
    {
        try {
            Artisan::call('route:clear');
            $msg = __('Route cache cleared successfully!');
            return $request->ajax() 
                ? response()->json(['success' => true, 'message' => $msg]) 
                : back()->with('success', $msg);
        } catch (\Exception $e) {
            Log::error("System Maintenance - Route Clear Error: " . $e->getMessage());
            $msg = __('Failed to clear route cache.');
            return $request->ajax() 
                ? response()->json(['success' => false, 'message' => $msg], 500) 
                : back()->with('error', $msg);
        }
    }

    /**
     * Clear the compiled Blade template cache.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse|\Illuminate\Http\RedirectResponse
     */
    public function clearView(Request $request): JsonResponse|RedirectResponse
    {
        try {
            Artisan::call('view:clear');
            $msg = __('View cache cleared successfully!');
            return $request->ajax() 
                ? response()->json(['success' => true, 'message' => $msg]) 
                : back()->with('success', $msg);
        } catch (\Exception $e) {
            Log::error("System Maintenance - View Clear Error: " . $e->getMessage());
            $msg = __('Failed to clear view cache.');
            return $request->ajax() 
                ? response()->json(['success' => false, 'message' => $msg], 500) 
                : back()->with('error', $msg);
        }
    }

    /**
     * Execute a full application optimization protocol.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse|\Illuminate\Http\RedirectResponse
     */
    public function optimize(Request $request): JsonResponse|RedirectResponse
    {
        try {
            Log::info("System Maintenance - Starting full optimization.");
            Artisan::call('optimize:clear');
            Artisan::call('optimize');
            
            $msg = __('Application optimized and cached successfully!');
            return $request->ajax() 
                ? response()->json(['success' => true, 'message' => $msg]) 
                : redirect()->route('admin.system.maintenance')->with('success', $msg);
        } catch (\Exception $e) {
            Log::error("System Maintenance - Optimize Error: " . $e->getMessage());
            $msg = __('Failed to optimize application: :error', ['error' => $e->getMessage()]);
            return $request->ajax() 
                ? response()->json(['success' => false, 'message' => $msg], 500) 
                : redirect()->route('admin.system.maintenance')->with('error', $msg);
        }
    }

    /**
     * Re-initialize the public storage symbolic link.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse|\Illuminate\Http\RedirectResponse
     */
    public function storageLink(Request $request): JsonResponse|RedirectResponse
    {
        try {
            Artisan::call('storage:link');
            $msg = __('Storage symbolic link created successfully!');
            return $request->ajax() 
                ? response()->json(['success' => true, 'message' => $msg]) 
                : back()->with('success', $msg);
        } catch (\Exception $e) {
            Log::error("System Maintenance - Storage Link Error: " . $e->getMessage());
            $msg = __('Failed to create storage link.');
            return $request->ajax() 
                ? response()->json(['success' => false, 'message' => $msg], 500) 
                : back()->with('error', $msg);
        }
    }

    /**
     * Queue a background task to regenerate all media asset variations.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse|\Illuminate\Http\RedirectResponse
     */
    public function regenerateMedia(Request $request): JsonResponse|RedirectResponse
    {
        try {
            RegenerateMediaJob::dispatch();
            $msg = __('Media regeneration task has been queued successfully!');
            return $request->ajax() 
                ? response()->json(['success' => true, 'message' => $msg]) 
                : back()->with('success', $msg);
        } catch (\Exception $e) {
            Log::error("System Maintenance - Media Regeneration Error: " . $e->getMessage());
            $msg = __('Failed to queue media regeneration.');
            return $request->ajax() 
                ? response()->json(['success' => false, 'message' => $msg], 500) 
                : back()->with('error', $msg);
        }
    }

    /**
     * Display the comprehensive System Health & Environment status report.
     *
     * @return \Illuminate\View\View
     */
    public function status(): View
    {
        $requirements = [
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
        ];

        $permissions = [
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
        ];

        return view('admin.system.status', compact('requirements', 'permissions'));
    }
}
