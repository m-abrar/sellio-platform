<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Theme;
use App\Models\Setting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;
use Illuminate\View\View;

/**
 * Class ThemeController
 * Orchestrates the administrative visual identity, coordinating theme activation, 
 * vertical-specific configurations, and global layout synchronization.
 */
class ThemeController extends Controller
{
    /**
     * Display a comprehensive listing of themes grouped by vertical, including recently active selections.
     *
     * @return \Illuminate\View\View
     * @throws \Illuminate\Auth\Access\AuthorizationException
     */
    public function index(): View
    {
        $this->authorize('viewAny', Theme::class);

        $activeTheme = Theme::where('is_active', true)->first();
        
        $recentThemes = Theme::where('is_active', false)
            ->whereNotNull('last_activated_at')
            ->orderBy('last_activated_at', 'desc')
            ->limit(4)
            ->get();

        $themesByVertical = Theme::orderBy('order')
            ->get()
            ->groupBy('vertical');

        return view('admin.themes.index', compact('activeTheme', 'recentThemes', 'themesByVertical'));
    }

    /**
     * Show the interface for editing a theme's structural configuration and variables.
     *
     * @param  \App\Models\Theme  $theme
     * @return \Illuminate\View\View
     * @throws \Illuminate\Auth\Access\AuthorizationException
     */
    public function edit(Theme $theme): View
    {
        $this->authorize('update', $theme);
        return view('admin.themes.edit', compact('theme'));
    }

    /**
     * Update a theme's structural configuration and trigger layout cache invalidation.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Theme  $theme
     * @return \Illuminate\Http\RedirectResponse
     * @throws \Illuminate\Auth\Access\AuthorizationException
     */
    public function update(Request $request, Theme $theme): RedirectResponse
    {
        $this->authorize('update', $theme);

        $validated = $request->validate([
            'vertical'  => 'nullable|string|max:50',
            'variables' => 'nullable|array',
            'config'    => 'nullable|array',
        ]);

        $theme->update($validated);

        // Global Cache Invalidation: Ensure visual changes propagate immediately
        Cache::forget('active_theme_data');

        return redirect()->route('admin.themes.index')
            ->with('success', __('Theme configuration updated successfully.'));
    }

    /**
     * Activate a specific theme and synchronize the platform's home configuration.
     *
     * @param  \App\Models\Theme  $theme
     * @return \Illuminate\Http\RedirectResponse
     * @throws \Illuminate\Auth\Access\AuthorizationException
     */
    public function activate(Theme $theme): RedirectResponse
    {
        $this->authorize('activate', $theme);

        DB::transaction(function () use ($theme) {
            // Phase 1: Deactivate existing themes (Atomic Switch)
            Theme::query()->update(['is_active' => false]);
            
            // Phase 2: Elevate the target theme
            $theme->update([
                'is_active'         => true,
                'last_activated_at' => now(),
            ]);

            // Phase 3: Synchronize global site configuration
            Setting::updateOrCreate(
                ['key' => 'site_home'],
                ['value' => $theme->theme_key]
            );
        });

        Cache::forget('active_theme_data');

        return redirect()->route('admin.themes.index')
            ->with('success', __('Theme activated and site configuration synchronized successfully.'));
    }
}
