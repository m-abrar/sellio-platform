<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Log;
use App\Jobs\RegenerateMediaJob;

class SystemController extends Controller
{
    /**
     * Display the System Maintenance page.
     */
    public function maintenance()
    {
        return view('admin.system.maintenance');
    }

    /**
     * Clear the application cache.
     */
    public function clearCache(Request $request)
    {
        try {
            Artisan::call('cache:clear');
            $msg = '🏆 Application cache cleared successfully!';
            return $request->ajax() ? response()->json(['success' => true, 'message' => $msg]) : back()->with('success', $msg);
        } catch (\Exception $e) {
            Log::error("System Maintenance - Cache Clear Error: " . $e->getMessage());
            $msg = '❌ Failed to clear application cache: ' . $e->getMessage();
            return $request->ajax() ? response()->json(['success' => false, 'message' => $msg], 500) : back()->with('error', $msg);
        }
    }

    public function clearConfig(Request $request)
    {
        try {
            Artisan::call('config:clear');
            $msg = '⚙️ Configuration cache cleared successfully!';
            return $request->ajax() ? response()->json(['success' => true, 'message' => $msg]) : back()->with('success', $msg);
        } catch (\Exception $e) {
            Log::error("System Maintenance - Config Clear Error: " . $e->getMessage());
            $msg = '❌ Failed to clear configuration cache.';
            return $request->ajax() ? response()->json(['success' => false, 'message' => $msg], 500) : back()->with('error', $msg);
        }
    }

    public function clearRoute(Request $request)
    {
        try {
            Artisan::call('route:clear');
            $msg = '🛣️ Route cache cleared successfully!';
            return $request->ajax() ? response()->json(['success' => true, 'message' => $msg]) : back()->with('success', $msg);
        } catch (\Exception $e) {
            Log::error("System Maintenance - Route Clear Error: " . $e->getMessage());
            $msg = '❌ Failed to clear route cache.';
            return $request->ajax() ? response()->json(['success' => false, 'message' => $msg], 500) : back()->with('error', $msg);
        }
    }

    public function clearView(Request $request)
    {
        try {
            Artisan::call('view:clear');
            $msg = '📄 View cache cleared successfully!';
            return $request->ajax() ? response()->json(['success' => true, 'message' => $msg]) : back()->with('success', $msg);
        } catch (\Exception $e) {
            Log::error("System Maintenance - View Clear Error: " . $e->getMessage());
            $msg = '❌ Failed to clear view cache.';
            return $request->ajax() ? response()->json(['success' => false, 'message' => $msg], 500) : back()->with('error', $msg);
        }
    }

    public function optimize(Request $request)
    {
        try {
            Log::info("System Maintenance - Starting full optimization.");
            Artisan::call('optimize:clear');
            Artisan::call('optimize');
            
            Log::info("System Maintenance - Optimization complete.");
            $msg = '🚀 Application optimized and cached successfully!';
            return $request->ajax() ? response()->json(['success' => true, 'message' => $msg]) : redirect()->route('admin.system.maintenance')->with('success', $msg);
        } catch (\Exception $e) {
            Log::error("System Maintenance - Optimize Error: " . $e->getMessage());
            $msg = '❌ Failed to optimize application: ' . $e->getMessage();
            return $request->ajax() ? response()->json(['success' => false, 'message' => $msg], 500) : redirect()->route('admin.system.maintenance')->with('error', $msg);
        }
    }

    public function storageLink(Request $request)
    {
        try {
            Artisan::call('storage:link');
            $msg = '🔗 Storage symbolic link created successfully!';
            return $request->ajax() ? response()->json(['success' => true, 'message' => $msg]) : back()->with('success', $msg);
        } catch (\Exception $e) {
            Log::error("System Maintenance - Storage Link Error: " . $e->getMessage());
            $msg = '❌ Failed to create storage link.';
            return $request->ajax() ? response()->json(['success' => false, 'message' => $msg], 500) : back()->with('error', $msg);
        }
    }

    public function regenerateMedia(Request $request)
    {
        try {
            RegenerateMediaJob::dispatch();
            $msg = '🖼️ Media regeneration task has been queued!';
            return $request->ajax() ? response()->json(['success' => true, 'message' => $msg]) : back()->with('success', $msg);
        } catch (\Exception $e) {
            Log::error("System Maintenance - Media Regeneration Error: " . $e->getMessage());
            $msg = '❌ Failed to queue media regeneration.';
            return $request->ajax() ? response()->json(['success' => false, 'message' => $msg], 500) : back()->with('error', $msg);
        }
    }

    /**
     * Display the System Health & Requirements page.
     */
    public function status()
    {
        $requirements = [
            'PHP Version (>= 8.2)' => [
                'met' => version_compare(PHP_VERSION, '8.2.0', '>='),
                'value' => PHP_VERSION,
                'type' => 'version'
            ],
            'BCMath Extension' => ['met' => extension_loaded('bcmath'), 'type' => 'extension'],
            'Ctype Extension' => ['met' => extension_loaded('ctype'), 'type' => 'extension'],
            'Fileinfo Extension' => ['met' => extension_loaded('fileinfo'), 'type' => 'extension'],
            'JSON Extension' => ['met' => extension_loaded('json'), 'type' => 'extension'],
            'Mbstring Extension' => ['met' => extension_loaded('mbstring'), 'type' => 'extension'],
            'OpenSSL Extension' => ['met' => extension_loaded('openssl'), 'type' => 'extension'],
            'PDO Extension' => ['met' => extension_loaded('pdo'), 'type' => 'extension'],
            'Tokenizer Extension' => ['met' => extension_loaded('tokenizer'), 'type' => 'extension'],
            'XML Extension' => ['met' => extension_loaded('xml'), 'type' => 'extension'],
            'GD Extension' => ['met' => extension_loaded('gd'), 'type' => 'extension'],
            'Intl Extension' => ['met' => extension_loaded('intl'), 'type' => 'extension'],
            'Zip Extension' => ['met' => extension_loaded('zip'), 'type' => 'extension'],
            'Exif Extension' => ['met' => extension_loaded('exif'), 'type' => 'extension'],
            'CURL Extension' => ['met' => extension_loaded('curl'), 'type' => 'extension'],
            'exec() Function' => ['met' => function_exists('exec'), 'type' => 'function'],
            'passthru() Function' => ['met' => function_exists('passthru'), 'type' => 'function'],
        ];

        $permissions = [
            'storage' => [
                'path' => storage_path(),
                'met' => is_writable(storage_path()),
            ],
            'bootstrap/cache' => [
                'path' => base_path('bootstrap/cache'),
                'met' => is_writable(base_path('bootstrap/cache')),
            ],
            '.env' => [
                'path' => base_path('.env'),
                'met' => is_writable(base_path('.env')),
            ],
        ];

        return view('admin.system.status', compact('requirements', 'permissions'));
    }
}
