<?php

namespace App\Services\Admin;

use App\Models\Setting;
use App\Models\Theme;
use App\Services\Admin\PlatformUrlVerificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class SettingService
{
    public function __construct(
        protected PlatformUrlVerificationService $platformUrlVerificationService,
    ) {}

    /**
     * Define the operational validation schema for each settings segment.
     *
     * @param  string  $section
     * @return array
     */
    public function getValidationRules(string $section): array
    {
        $rules = [
            'general' => [
                'site_name'               => 'required|string|max:255',
                'site_tagline'            => 'nullable|string|max:255',
                'default_language'        => 'required|string',
                'timezone'                => 'required|string',
                'currency_code'           => 'required|string|max:10',
                'currency_symbol'         => 'nullable|string|max:10',
                'hide_site_name'          => 'nullable|boolean',
                'site_logo'               => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048',
                'site_favicon'            => 'nullable|image|mimes:ico,png,webp|max:100',
            ],
            'system' => [
                'url_frontend'            => 'nullable|url',
                'url_admin'               => 'nullable|url',
                'url_partner'             => 'nullable|url',
                'url_user'                => 'nullable|url',
                'cors_allowed_origins'    => 'nullable|string|max:4000',
                'built_in_website_status' => 'nullable|string|in:active,redirect',
                'frontend_edit'           => 'nullable|boolean',
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
                'gtm_container_id'         => 'nullable|string|max:50',
                'google_analytics'         => 'nullable|string|max:50',
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
                'google_map_api_key'               => 'nullable|string|max:255',
                'gemini_api_key'                   => 'nullable|string|max:255',
                'smart_search_examples'            => 'nullable|string',
                'smart_search_thinking_messages'   => 'nullable|string',
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
    public function getFilteredThemes(string $prefix)
    {
        return Theme::where('theme_key', 'LIKE', $prefix . '_%')->get();
    }

    /**
     * Persist localized updates for a specific settings segment within a transaction.
     *
     * @param Request $request
     * @param string $section
     * @param array $rules
     * @return void
     */
    public function updateSettings(Request $request, string $section, array $rules): void
    {
        DB::transaction(function () use ($request, $section, $rules) {
            $validKeys = array_keys($rules);
            $booleanKeys = ['frontend_edit', 'hide_site_name'];
            $fileKeys = ['site_logo', 'site_favicon'];
            $arrayKeys = ['is_section'];
            $jsonLineKeys = ['smart_search_examples', 'smart_search_thinking_messages'];

            foreach ($validKeys as $key) {
                // Skip files if not present in request to prevent overwriting with null
                if (in_array($key, $fileKeys) && !$request->hasFile($key)) {
                    continue;
                }

                $value = $request->input($key);

                // Handle line-separated → JSON array fields
                if (in_array($key, $jsonLineKeys)) {
                    $lines = array_values(array_filter(
                        array_map('trim', explode("\n", $value ?? '')),
                        fn($l) => $l !== ''
                    ));
                    Setting::updateOrCreate(['key' => $key], ['value' => $lines ? json_encode($lines) : null]);
                    continue;
                }

                // Handle Booleans
                if (in_array($key, $booleanKeys)) {
                    $value = $request->boolean($key) ? '1' : '0';
                }

                // Handle Theme Synchronization
                if ($section === 'pages' && $key === 'site_home') {
                    $this->activateThemeByKey($value);
                    continue;
                }

                // Handle Files
                if (in_array($key, $fileKeys) && $request->hasFile($key)) {
                    $path = $request->file($key)->store('settings', 'public');
                    Setting::updateOrCreate(['key' => $key], ['value' => $path]);

                    if ($key === 'site_favicon') {
                        $this->syncFaviconToPublic($path);
                    }
                } 
                // Handle Arrays (Modules/Sections)
                elseif (in_array($key, $arrayKeys)) {
                    $this->handleArraySetting($key, $value);
                } 
                // Handle Standard Scalars
                else {
                    if (array_key_exists($key, PlatformUrlVerificationService::URL_FIELDS)) {
                        $this->platformUrlVerificationService->syncVerificationOnSave($key, $value);
                    }

                    Setting::updateOrCreate(['key' => $key], ['value' => $value]);
                }
            }
        });
    }

    /**
     * Handle array-based settings like feature sections.
     *
     * @param string $key
     * @param mixed $value
     * @return void
     */
    protected function handleArraySetting(string $key, $value): void
    {
        if ($key === 'is_section') {
            $existingKeys = Setting::where('key', 'LIKE', 'is_section.%')->pluck('key');
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

    /**
     * Activate a theme by its key and update the home setting.
     *
     * @param string|null $themeKey
     * @return void
     */
    protected function activateThemeByKey(?string $themeKey): void
    {
        Theme::query()->update(['is_active' => false]);
        
        if (!empty($themeKey)) {
            Theme::where('theme_key', $themeKey)->update(['is_active' => true]);
        }
        
        Setting::updateOrCreate(['key' => 'site_home'], ['value' => $themeKey ?? '']);
    }

    /**
     * Sync favicon to public directory.
     *
     * @param string $storagePath
     * @return void
     */
    protected function syncFaviconToPublic(string $storagePath): void
    {
        try {
            $sourcePath = storage_path('app/public/' . $storagePath);
            $destinationPath = public_path('favicon.ico');
            
            if (!file_exists(dirname($destinationPath))) {
                mkdir(dirname($destinationPath), 0755, true);
            }
            
            if (file_exists($sourcePath)) {
                copy($sourcePath, $destinationPath);
            }
        } catch (\Exception $e) {
            Log::warning("Favicon Sync Failed: " . $e->getMessage());
        }
    }
}
