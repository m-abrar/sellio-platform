<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use App\Models\Page;
use App\Models\Theme;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\View\View;

/**
 * Class SettingController
 * Orchestrates the platform's centralized configuration engine, managing 
 * environmental parameters, feature toggles, and marketing synchronization.
 */
class SettingController extends Controller
{
    /**
     * @var \App\Services\Admin\SettingService
     */
    protected $settingService;

    /**
     * SettingController constructor.
     *
     * @param  \App\Services\Admin\SettingService  $settingService
     */
    public function __construct(\App\Services\Admin\SettingService $settingService)
    {
        $this->settingService = $settingService;
    }

    /**
     * Display the centralized Settings Explorer dashboard.
     *
     * @return \Illuminate\View\View
     */
    public function index(): View
    {
        $settings = Setting::pluck('value', 'key')->toArray(); 
        $pages    = Page::where('type', 'page')->get();
        $themes   = Theme::all();
        
        return view('admin.settings.index', compact('settings', 'pages', 'themes'));
    }

    /**
     * Load a specific administrative settings segment based on the sectional parameter.
     *
     * @param  string  $section
     * @return \Illuminate\View\View
     */
    public function getSection(string $section): View
    {
        $settings = Setting::pluck('value', 'key')->toArray();
        $viewPath = 'admin.settings.partials.' . $section;
        
        $pages  = [];
        $themes = []; 
        
        if ($section === 'pages') {
            $pages               = Page::where('type', 'page')->get();
            $themes['all']       = Theme::all(); 
            $themes['unifieds']  = $this->settingService->getFilteredThemes('unified');
            $themes['properties'] = $this->settingService->getFilteredThemes('prop');
            $themes['autos']      = $this->settingService->getFilteredThemes('auto');
            $themes['events']     = $this->settingService->getFilteredThemes('event');
            $themes['jobs']       = $this->settingService->getFilteredThemes('job');
            $themes['services']   = $this->settingService->getFilteredThemes('service');
            $themes['classifieds'] = $this->settingService->getFilteredThemes('classified');
        }
        
        if (!view()->exists($viewPath)) {
             abort(404, __("Settings section ':section' not found.", ['section' => $section]));
        }

        return view($viewPath, compact('settings', 'pages', 'themes'));
    }

    /**
     * Persist localized updates for a specific settings segment.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  string  $section
     * @return \Illuminate\Http\RedirectResponse
     */
    public function updateSection(Request $request, string $section): RedirectResponse
    {
        $rules = $this->settingService->getValidationRules($section);

        // Optimization: Conditional File Validation
        $fileKeys = ['site_logo', 'site_favicon'];
        foreach ($fileKeys as $key) {
            if (isset($rules[$key]) && !$request->hasFile($key)) {
                unset($rules[$key]);
            }
        }

        $request->validate($rules);
        $this->settingService->updateSettings($request, $section, $rules);
        
        return back()->with('success', __(':section settings updated successfully!', [
            'section' => ucfirst($section)
        ]));
    }
}
