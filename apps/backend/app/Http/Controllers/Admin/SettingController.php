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
            $themes['unifieds']  = $this->getFilteredThemes('unified');
            $themes['properties'] = $this->getFilteredThemes('prop');
            $themes['autos']      = $this->getFilteredThemes('auto');
            $themes['events']     = $this->getFilteredThemes('event');
            $themes['jobs']       = $this->getFilteredThemes('job');
            $themes['services']   = $this->getFilteredThemes('service');
            $themes['classifieds'] = $this->getFilteredThemes('classified');
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
        $rules = $this->getValidationRules($section);

        // Optimization: Conditional File Validation
        $fileKeys = ['site_logo', 'site_favicon'];
        foreach ($fileKeys as $key) {
            if (isset($rules[$key]) && !$request->hasFile($key)) {
                unset($rules[$key]);
            }
        }

        $request->validate($rules);
        $this->saveSettingsData($request, $section);
        
        return back()->with('success', __(':section settings updated successfully!', [
            'section' => ucfirst($section)
        ]));
    }

    /**
     * Define the operational validation schema for each settings segment.
     *
     * @param  string  $section
     * @return array
     */
    private function getValidationRules(string $section): array
    {
        $rules = [
            'general' => [
                'site_name'               => 'required|string|max:255',
                'site_tagline'            => 'nullable|string|max:255',
                'default_language'        => 'required|string',
                'timezone'                => 'required|string',
                'frontend_edit'           => 'nullable|boolean',
                'currency_code'           => 'required|string|max:10',
                'hide_site_name'          => 'nullable|boolean',
                'site_logo'               => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048',
                'site_favicon'            => 'nullable|image|mimes:ico,png,webp|max:100',
                'url_frontend'            => 'nullable|url',
                'url_admin'               => 'nullable|url',
                'url_partner'             => 'nullable|url',
                'url_user'                => 'nullable|url',
                'built_in_website_status' => 'nullable|string|in:active,redirect',
            ],
            'modules' => [
                'is_section' => 'nullable|array',
            ],
            'contact' => [
                'email_contact' => 'required|email|max:255',
                'phone_contact' => 'nullable|string|max:50',
                'address'       => 'nullable|string|max:255',
            ],
            'seo' => [
                'meta_title'               => 'nullable|string|max:255',
                'meta_description'         => 'nullable|string',
                'google_verification_code' => 'nullable|string|max:255',
                'google_analytics'         => 'nullable|string', 
                'custom_head_code'         => 'nullable|string', 
                'custom_footer_code'       => 'nullable|string', 
            ],
            'social' => [
                'facebook_url'  => 'nullable|url',
                'twitter_url'   => 'nullable|url',
                'instagram_url' => 'nullable|url',
                'linkedin_url'  => 'nullable|url',
                'youtube_url'   => 'nullable|url',
            ],
            'pages' => [
                'site_home'         => 'nullable|string', 
                'site_blog_archive' => 'nullable|integer',
                'site_contact'      => 'nullable|integer', 
                'site_about'        => 'nullable|integer', 
                'site_faqs'         => 'nullable|integer',
                'site_terms'        => 'nullable|integer', 
                'site_privacy'      => 'nullable|integer',
            ],
            'apis' => [
                'google_map_api_key' => 'nullable|string|max:255',
            ],
        ];

        // Dynamic Rule Generation for Vertical Themes
        if ($section === 'pages') {
            $availableThemeKeys   = Theme::pluck('theme_key')->toArray();
            $themeValidationRule  = 'nullable|string|in:' . implode(',', array_merge([''], $availableThemeKeys));
            $themeKeysToValidate = [
                'app_unifieds', 'app_properties', 'app_autos', 'app_events', 
                'app_jobs', 'app_services', 'app_classifieds', 'site_home'
            ];
            
            foreach ($themeKeysToValidate as $key) {
                $rules['pages'][$key] = $themeValidationRule;
            }
        }

        return $rules[$section] ?? [];
    }
    
    /**
     * Retrieve a filtered subset of themes based on functional prefixing.
     *
     * @param  string  $prefix
     * @return \Illuminate\Database\Eloquent\Collection
     */
    private function getFilteredThemes(string $prefix)
    {
        return Theme::where('theme_key', 'LIKE', $prefix . '_%')->get();
    }
    
    /**
     * Synchronize visual platform re-alignment by activating a theme via its unique key.
     *
     * @param  string|null  $themeKey
     * @return void
     */
    private function activateThemeByKey(?string $themeKey): void
    {
        Theme::query()->update(['is_active' => false]);
        
        if (!empty($themeKey)) {
            $theme = Theme::where('theme_key', $themeKey)->first();
            if ($theme) {
                $theme->update(['is_active' => true]);
            }
        }
        
        Setting::updateOrCreate(['key' => 'site_home'], ['value' => $themeKey ?? '']);
    }

    /**
     * Perform atomic bulk persistence of settings data, including polymorphic file handling.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  string  $section
     * @return void
     */
    private function saveSettingsData(Request $request, string $section): void
    {
        $validKeys   = array_keys($this->getValidationRules($section));
        $fileKeys    = ['site_logo', 'site_favicon'];
        $arrayKeys   = ['is_section'];
        $booleanKeys = ['frontend_edit', 'hide_site_name'];
        
        foreach ($validKeys as $key) {
            $value = $request->input($key);

            // Protocol A: Boolean Normalization
            if (in_array($key, $booleanKeys)) {
                $value = $request->boolean($key) ? '1' : '0';
            }
            
            // Protocol B: Theme Synchronization
            if ($section === 'pages' && $key === 'site_home') {
                $this->activateThemeByKey($value);
                continue; 
            }
            
            // Protocol C: Asset Persistence
            if (in_array($key, $fileKeys) && $request->hasFile($key)) {
                $path = $request->file($key)->store('settings', 'public');
                Setting::updateOrCreate(['key' => $key], ['value' => $path]);

                if ($key === 'site_favicon') {
                    $this->syncFaviconToPublic($path);
                }
            } 
            // Protocol D: Hierarchical Feature Toggles
            elseif (in_array($key, $arrayKeys)) {
                if ($key === 'is_section') {
                    $existingKeys     = Setting::where('key', 'LIKE', 'is_section.%')->pluck('key');
                    $submittedSubKeys = is_array($value) ? array_keys($value) : [];

                    foreach ($existingKeys as $fullKey) {
                        $subKey = str_replace('is_section.', '', $fullKey);
                        if (!in_array($subKey, $submittedSubKeys)) {
                            Setting::updateOrCreate(['key' => $fullKey], ['value' => '0']);
                        }
                    }
                }

                if (is_array($value)) {
                    foreach ($value as $subKey => $subValue) {
                        Setting::updateOrCreate(['key' => $key . '.' . $subKey], ['value' => $subValue]);
                    }
                }
            } 
            // Protocol E: Semantic Scalar Persistence
            elseif (!in_array($key, $fileKeys)) {
                Setting::updateOrCreate(['key' => $key], ['value' => $value]);
            }
        }
    }

    /**
     * Synchronize the uploaded favicon to the public/favicons/favicon.ico path.
     * Ensures compatibility with third-party packages requiring hardcoded public assets.
     *
     * @param  string  $storagePath
     * @return void
     */
    private function syncFaviconToPublic(string $storagePath): void
    {
        try {
            $sourcePath      = storage_path('app/public/' . $storagePath);
            $destinationPath = public_path('favicons/favicon.ico');
            
            if (!file_exists(dirname($destinationPath))) {
                mkdir(dirname($destinationPath), 0755, true);
            }
            
            if (file_exists($sourcePath)) {
                copy($sourcePath, $destinationPath);
            }
        } catch (\Exception $e) {
            Log::warning("Favicon Synchronization Failure: " . $e->getMessage());
        }
    }
}
