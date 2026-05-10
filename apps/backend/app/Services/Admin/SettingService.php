<?php

namespace App\Services\Admin;

use App\Models\Setting;
use App\Models\Theme;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class SettingService
{
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

            foreach ($validKeys as $key) {
                // Skip files if not present in request to prevent overwriting with null
                if (in_array($key, $fileKeys) && !$request->hasFile($key)) {
                    continue;
                }

                $value = $request->input($key);

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
            $destinationPath = public_path('favicons/favicon.ico');
            
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
