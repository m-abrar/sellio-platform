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
    public function clearCache()
    {
        try {
            Artisan::call('cache:clear');
            return back()->with('success', '🏆 Application cache cleared successfully!');
        } catch (\Exception $e) {
            Log::error("System Maintenance - Cache Clear Error: " . $e->getMessage());
            return back()->with('error', '❌ Failed to clear application cache: ' . $e->getMessage());
        }
    }

    /**
     * Clear the configuration cache.
     */
    public function clearConfig()
    {
        try {
            Artisan::call('config:clear');
            return back()->with('success', '⚙️ Configuration cache cleared successfully!');
        } catch (\Exception $e) {
            Log::error("System Maintenance - Config Clear Error: " . $e->getMessage());
            return back()->with('error', '❌ Failed to clear configuration cache.');
        }
    }

    /**
     * Clear the route cache.
     */
    public function clearRoute()
    {
        try {
            Artisan::call('route:clear');
            return back()->with('success', '🛣️ Route cache cleared successfully!');
        } catch (\Exception $e) {
            Log::error("System Maintenance - Route Clear Error: " . $e->getMessage());
            return back()->with('error', '❌ Failed to clear route cache.');
        }
    }

    /**
     * Clear the view cache.
     */
    public function clearView()
    {
        try {
            Artisan::call('view:clear');
            return back()->with('success', '📄 View cache cleared successfully!');
        } catch (\Exception $e) {
            Log::error("System Maintenance - View Clear Error: " . $e->getMessage());
            return back()->with('error', '❌ Failed to clear view cache.');
        }
    }

    /**
     * Optimize the application (Clear and Cache everything).
     */
    public function optimize()
    {
        try {
            // We clear everything first to be safe
            Artisan::call('optimize:clear');
            
            // Then we optimize
            Artisan::call('optimize');
            
            return back()->with('success', '🚀 Application optimized and cached successfully!');
        } catch (\Exception $e) {
            Log::error("System Maintenance - Optimize Error: " . $e->getMessage());
            return back()->with('error', '❌ Failed to optimize application.');
        }
    }

    /**
     * Create the storage link.
     */
    public function storageLink()
    {
        try {
            // Check if link already exists
            if (public_path('storage')) {
                // If it exists but might be broken, we could tell the user, but usually Artisan handle it.
            }
            Artisan::call('storage:link');
            return back()->with('success', '🔗 Storage symbolic link created successfully!');
        } catch (\Exception $e) {
            Log::error("System Maintenance - Storage Link Error: " . $e->getMessage());
            return back()->with('error', '❌ Failed to create storage link.');
        }
    }

    /**
     * Regenerate missing media library conversions in the background.
     */
    public function regenerateMedia()
    {
        try {
            RegenerateMediaJob::dispatch();
            
            return back()->with('success', '🖼️ Media regeneration task has been queued! Please ensure your queue worker is running.');
        } catch (\Exception $e) {
            Log::error("System Maintenance - Media Regeneration Error: " . $e->getMessage());
            return back()->with('error', '❌ Failed to queue media regeneration.');
        }
    }
}
