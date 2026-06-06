<?php

namespace Tests\Feature;

use App\Models\Menu;
use App\Models\PageContent;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class AdminBarContextTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_receives_empty_context(): void
    {
        $response = $this->getJson('/admin-bar/context?theme_key=properties_classic');

        $response->assertOk()
            ->assertJson([
                'pages' => [],
                'menus' => [],
                'enabled_modules' => [],
            ]);
    }

    public function test_admin_receives_theme_scoped_context(): void
    {
        Role::firstOrCreate(['name' => 'admin']);

        $admin = User::factory()->create();
        $admin->assignRole('admin');

        PageContent::query()->create([
            'theme_key' => 'properties_classic',
            'page' => 'home',
            'section' => 'hero',
            'content_key' => 'title',
            'input_type' => 'text',
            'value' => 'Hello',
        ]);

        Menu::query()->create([
            'theme_key' => 'properties_classic',
            'title' => 'Main Header',
            'location_key' => 'main_header',
            'status' => 'active',
        ]);

        Menu::query()->create([
            'theme_key' => 'events_music',
            'title' => 'Other Theme Menu',
            'location_key' => 'main_header',
            'status' => 'active',
        ]);

        $response = $this->actingAs($admin)->getJson('/admin-bar/context?theme_key=properties_classic');

        $response->assertOk()
            ->assertJsonPath('pages', ['home'])
            ->assertJsonCount(1, 'menus')
            ->assertJsonPath('menus.0.title', 'Main Header')
            ->assertJson(fn ($json) => $json->has('enabled_modules')->etc());
    }
}
