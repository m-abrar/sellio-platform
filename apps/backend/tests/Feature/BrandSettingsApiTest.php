<?php

namespace Tests\Feature;

use App\Models\Setting;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Tests\TestCase;

class BrandSettingsApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_brand_settings_exposes_marketplace_module_flags(): void
    {
        Setting::set('is_section.products', '1');
        Setting::set('is_section.autos', '0');
        Setting::set('is_section.properties', '1');
        Setting::set('is_section.events', '0');
        Cache::forget('settings_all');

        $this->getJson('/api/v1/brand-settings')
            ->assertOk()
            ->assertJsonPath('data.modules.products', true)
            ->assertJsonPath('data.modules.autos', false)
            ->assertJsonPath('data.modules.properties', true)
            ->assertJsonPath('data.modules.events', false)
            ->assertJsonStructure([
                'data' => [
                    'modules' => [
                        'products',
                        'properties',
                        'autos',
                        'events',
                        'services',
                        'jobs',
                        'classifieds',
                    ],
                ],
            ]);
    }
}
