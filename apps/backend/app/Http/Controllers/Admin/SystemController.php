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
}
