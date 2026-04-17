<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Setting;
use App\Models\Page;
use App\Models\Theme;
use Illuminate\Support\Facades\DB; 

class SettingController extends Controller
{
    /**
     * Display the Settings Explorer page.
     */
    public function index()
    {
        $settings = Setting::pluck('value', 'key')->toArray(); 
        $pages = Page::where('type','page')->get();
        // Load all themes for potential use in the index/explorer view
        $themes = Theme::all();
        
        return view('admin.settings.index', compact('settings', 'pages', 'themes'));
    }

    /**
     * Loads the specific settings view (dedicated page) based on the URL parameter.
     */
    public function getSection(string $section)
    {
        // Fetch all settings data once
        $settings = Setting::pluck('value', 'key')->toArray();
        
        $viewPath = 'admin.settings.partials.' . $section;
        
        // --- Conditionally load extra data (like pages and FILTERED applications) ---
        $pages = [];
        $applications = []; 
        
        if ($section === 'pages') {
            $pages = Page::where('type', 'page')->get();
            
            // Load specific theme subsets based on theme_key prefix
            $themes['all'] = Theme::all(); 
            $themes['unifieds'] = $this->getFilteredThemes('unified');
            $themes['properties'] = $this->getFilteredThemes('prop');
            $themes['autos'] = $this->getFilteredThemes('auto');
            $themes['events'] = $this->getFilteredThemes('event');
            $themes['jobs'] = $this->getFilteredThemes('job');
            $themes['services'] = $this->getFilteredThemes('service');
            $themes['classifieds'] = $this->getFilteredThemes('classified');
        }
        
        // Safety check
        if (!view()->exists($viewPath)) {
             abort(404, "Settings section '{$section}' not found.");
        }

        // Returns the dedicated view, which includes the layout and the form.
        return view($viewPath, compact('settings', 'pages', 'themes'));
    }

    /**
     * Dynamically updates the specific settings section data.
     */
    public function updateSection(Request $request, string $section)
    {
        // 1. Fetch the rules for the section dynamically
        $rules = $this->getValidationRules($section);

        // Define keys that are file-based and should only be validated if a file is present
        $fileKeys = ['site_logo', 'site_favicon'];
        
        foreach ($fileKeys as $key) {
            // If the section rules have this key but no file is in the request, unset the rule
            if (isset($rules[$key]) && !$request->hasFile($key)) {
                unset($rules[$key]);
            }
        }

        // 2. Run Validation
        $request->validate($rules);
        
        // 3. Save the data to the database
        $this->saveSettingsData($request, $section);
        
        // 4. Return success
        return back()->with('success', ucfirst($section) . ' settings updated successfully!');
    }

    // --- Helper Functions ---

    /**
     * Defines the validation rules for each settings section.
     */
    private function getValidationRules(string $section): array
    {
        $rules = [
            'general' => [
                'site_name' => 'required|string|max:255',
                'site_tagline' => 'nullable|string|max:255',
                'default_language' => 'required|string',
                'timezone' => 'required|string',
                'frontend_edit' => 'nullable|boolean',
                'currency_code' => 'required|string|max:10',
                'site_logo' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048',
                'site_favicon' => 'nullable|image|mimes:ico,png,webp|max:100',
                
                // External Application URLs
                'url_frontend' => 'nullable|url',
                'url_admin' => 'nullable|url',
                'url_partner' => 'nullable|url',
                'url_user' => 'nullable|url',
                'built_in_website_status' => 'nullable|string|in:active,redirect',
            ],
            'modules' => [
                'is_section' => 'nullable|array',
            ],
            'contact' => [
                'email_contact' => 'required|email|max:255',
                'phone_contact' => 'nullable|string|max:50',
                'address' => 'nullable|string|max:255',
            ],
            'seo' => [
                'meta_title' => 'nullable|string|max:255',
                'meta_description' => 'nullable|string',
                'google_verification_code' => 'nullable|string|max:255',
                'google_analytics' => 'nullable|string', 
                'custom_head_code' => 'nullable|string', 
                'custom_footer_code' => 'nullable|string', 
            ],
            'social' => [
                'facebook_url' => 'nullable|url',
                'twitter_url' => 'nullable|url',
                'instagram_url' => 'nullable|url',
                'linkedin_url' => 'nullable|url',
                'youtube_url' => 'nullable|url',
            ],
            'pages' => [
                // Site Home now expects a theme_key (string)
                'site_home' => 'nullable|string', 
                
                // Other Page IDs (Integer must point to a valid Page ID)
                'site_blog_archive' => 'nullable|integer',
                'site_contact' => 'nullable|integer', 
                'site_about' => 'nullable|integer', 
                'site_faqs' => 'nullable|integer',
                
                // Legal Page IDs
                'site_terms' => 'nullable|integer', 
                'site_privacy' => 'nullable|integer',
            ],
            'apis' => [
                'google_map_api_key' => 'nullable|string|max:255',
            ],
        ];

        // Dynamic Validation for Listing Archive Theme Keys (Requires Theme::pluck to run)
        if ($section === 'pages') {
            $availableThemeKeys = Theme::pluck('theme_key')->toArray();
            
            // Add an empty string for the "-- Default Theme --" option
            $themeValidationRule = 'nullable|string|in:' . implode(',', array_merge([''], $availableThemeKeys));

            // Theme keys for listing archives
            $themeKeysToValidate = [
                'app_unifieds',
                'app_properties',
                'app_autos',
                'app_events',
                'app_jobs',
                'app_services',
                'app_classifieds',
            ];
            
            // Add validation for 'site_home' and the archive themes
            $allThemeKeysToValidate = array_merge($themeKeysToValidate, ['site_home']);

            foreach ($allThemeKeysToValidate as $key) {
                $rules['pages'][$key] = $themeValidationRule;
            }
        }

        return $rules[$section] ?? [];
    }
    
    /**
     * Helper function to fetch themes based on a theme_key prefix.
     */
    private function getFilteredThemes(string $prefix)
    {
        // Use LIKE to match theme_keys starting with the prefix, followed by an underscore
        return Theme::where('theme_key', 'LIKE', $prefix . '_%')->get();
    }
    
    /**
     * Helper function to activate a theme by its key and update the site_home setting.
     * This logic is the canonical activation method used by the SettingController.
     *
     * @param string|null $themeKey The theme_key to activate.
     * @return void
     */
    private function activateThemeByKey(?string $themeKey): void
    {
        // 1. Deactivate all themes
        Theme::query()->update(['is_active' => false]);
        
        // 2. If a key is provided, find and activate the theme
        if (!empty($themeKey)) {
            $theme = Theme::where('theme_key', $themeKey)->first();

            if ($theme) {
                Theme::where('id', $theme->id)->update(['is_active' => true]);
            }
        }
        
        // 3. Save the theme key to the 'site_home' setting (even if null/empty)
        Setting::updateOrCreate(['key' => 'site_home'], ['value' => $themeKey ?? '']);
    }

    /**
     * Generic function to save settings data, including special handling for arrays and files.
     */
    private function saveSettingsData(Request $request, string $section)
    {
        // 1. Get the keys we should expect to save (based on validation rules)
        $validKeys = array_keys($this->getValidationRules($section));

        // Define keys that require special handling
        $fileKeys = ['site_logo', 'site_favicon'];
        $arrayKeys = ['is_section'];
        
        foreach ($validKeys as $key) {
            $value = $request->input($key);
            
            // --- A. Handle Theme Activation for site_home (Use the helper method) ---
            if ($section === 'pages' && $key === 'site_home') {
                $this->activateThemeByKey($value);
                // We handled saving the setting inside activateThemeByKey, so we continue
                continue; 
            }
            
            // --- B. Handle File Uploads ---
            if (in_array($key, $fileKeys) && $request->hasFile($key)) {
                $path = $request->file($key)->store('settings', 'public');
                Setting::updateOrCreate(['key' => $key], ['value' => $path]);

                // Sync favicon to public directory for hardcoded package references
                if ($key === 'site_favicon') {
                    $this->syncFaviconToPublic($path);
                }
            // --- C. Handle Array Fields (e.g., modules activation) ---
            } elseif (in_array($key, $arrayKeys)) {
                
                // If the section is 'modules', we need to reset any unchecked boxes 
                if ($key === 'is_section') {
                    $existingKeys = Setting::where('key', 'LIKE', 'is_section.%')->pluck('key');
                    $submittedSubKeys = is_array($value) ? array_keys($value) : [];

                    foreach ($existingKeys as $fullKey) {
                        $subKey = str_replace('is_section.', '', $fullKey);
                        if (!in_array($subKey, $submittedSubKeys)) {
                            // Unchecked box: set value to 0
                            Setting::updateOrCreate(['key' => $fullKey], ['value' => '0']);
                        }
                    }
                }

                // Save submitted values (the checked boxes)
                if (is_array($value)) {
                    foreach ($value as $subKey => $subValue) {
                        Setting::updateOrCreate(
                            ['key' => $key . '.' . $subKey],
                            ['value' => $subValue]
                        );
                    }
                }
                
            // --- D. Handle Simple Fields (Text, Select, Page IDs, Theme Keys) ---
            } elseif (!in_array($key, $fileKeys)) {
                // This covers all non-file fields (text, select, other page IDs, listing themes, etc.)
                Setting::updateOrCreate(['key' => $key], ['value' => $value]);
            }
        }
    }

    /**
     * Synchronizes the uploaded favicon to the public/favicons/favicon.ico path
     * to ensure compatibility with third-party packages that have hardcoded paths.
     */
    private function syncFaviconToPublic(string $storagePath): void
    {
        try {
            $sourcePath = storage_path('app/public/' . $storagePath);
            $destinationPath = public_path('favicons/favicon.ico');
            
            // Ensure the directory exists
            if (!file_exists(dirname($destinationPath))) {
                mkdir(dirname($destinationPath), 0755, true);
            }
            
            if (file_exists($sourcePath)) {
                copy($sourcePath, $destinationPath);
            }
        } catch (\Exception $e) {
            // Silently fail to avoid crashing the settings update if permissions are restricted
            \Illuminate\Support\Facades\Log::warning("Failed to sync favicon to public directory: " . $e->getMessage());
        }
    }
}
