<?php

namespace Tests\Feature;

use App\Models\PageContent;
use App\Models\Setting;
use App\Models\User;
use App\Services\ContentService;
use App\Services\HomeDataService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class LaravelPublicStorefrontTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        Setting::set('built_in_website_status', 'active');
    }

    public function test_homepage_returns_successful_response(): void
    {
        $this->get(route('index'))
            ->assertOk()
            ->assertSee(__('Explore the Marketplace'), false);
    }

    public function test_homepage_hero_tabs_include_vanilla_switcher_markup(): void
    {
        $this->get(route('index'))
            ->assertOk()
            ->assertSee('data-hero-search', false)
            ->assertSee('data-hero-tab', false)
            ->assertSee('data-hero-pane', false)
            ->assertSee('id="hero-search-properties"', false)
            ->assertSee('data-hero-target="hero-search-properties"', false);
    }

    public function test_products_index_renders_product_catalog_not_classifieds(): void
    {
        Setting::set('is_section.products', '1');
        Cache::forget('settings_all');

        $this->get(route('products.index'))
            ->assertOk()
            ->assertSee(__('Product Catalog'), false)
            ->assertSee('listing-page--products', false)
            ->assertSee('listing-grid', false)
            ->assertDontSee(__('Ads Available'), false);
    }

    public function test_cart_page_uses_page_shell_markup(): void
    {
        Setting::set('is_section.products', '1');
        Cache::forget('settings_all');

        $this->get(route('cart.index'))
            ->assertOk()
            ->assertSee('page-shell--cart', false)
            ->assertSee(__('Your Shopping Cart'), false);
    }

    public function test_listing_index_pages_share_unified_layout_markup(): void
    {
        Setting::set('is_section.properties', '1');
        Setting::set('is_section.jobs', '1');
        Cache::forget('settings_all');

        $this->get(route('properties.index'))
            ->assertOk()
            ->assertSee('listing-page--properties', false)
            ->assertSee(__('Filters'), false);

        $this->get(route('jobs.index'))
            ->assertOk()
            ->assertSee('listing-page--jobs', false)
            ->assertSee('listing-grid', false);
    }

    public function test_properties_index_survives_array_like_cached_page_content(): void
    {
        Setting::set('is_section.properties', '1');
        Cache::forget('settings_all');

        $scope = config('content.blade_scope', 'laravel_blade');
        Cache::forever("page_content.{$scope}.properties.search.heading", ['unexpected' => 'array']);

        $this->get(route('properties.index'))
            ->assertOk()
            ->assertSee('listing-page--properties', false);

        $this->assertSame('array', content_display(['unexpected' => 'array'], 'Fallback'));
    }

    public function test_content_display_coerces_arrays_for_blade_escaping(): void
    {
        $this->assertSame('first', content_display(['first', 'second'], ''));
        $this->assertSame('Fallback', content_display(null, 'Fallback'));
        $this->assertSame('$', setting_string('currency_symbol', '$'));
    }

    public function test_pagination_translation_does_not_return_array_for_page_navigation_label(): void
    {
        $this->assertIsString(__('Page navigation'));
        $this->assertIsArray(__('pagination'));
    }

    public function test_properties_index_handles_json_array_currency_symbol_setting(): void
    {
        Setting::set('is_section.properties', '1');
        Setting::set('currency_symbol', '["$"]');
        Cache::forget('settings_all');

        $this->assertSame('$', setting('currency_symbol', '$'));

        $this->get(route('properties.index'))
            ->assertOk()
            ->assertSee('listing-page--properties', false);
    }

    public function test_properties_index_renders_for_authenticated_admin(): void
    {
        Setting::set('is_section.properties', '1');
        Cache::forget('settings_all');

        Role::firstOrCreate(['name' => 'admin']);
        $admin = User::factory()->create();
        $admin->assignRole('admin');

        $this->actingAs($admin)
            ->get(route('properties.index'))
            ->assertOk()
            ->assertSee('listing-page--properties', false);
    }

    public function test_disabled_module_route_returns_not_found(): void
    {
        Setting::set('is_section.products', '0');
        Cache::forget('settings_all');

        $this->get(route('products.index'))->assertNotFound();
    }

    public function test_content_service_resolves_laravel_blade_scope(): void
    {
        $scope = config('content.blade_scope', 'laravel_blade');

        PageContent::create([
            'theme_key' => $scope,
            'page' => 'home',
            'section' => 'hero',
            'content_key' => 'badge',
            'value' => 'Scoped Badge Copy',
            'input_type' => 'text',
        ]);

        Cache::flush();

        $value = app(ContentService::class)->get('home.hero.badge', 'Fallback Badge');

        $this->assertSame('Scoped Badge Copy', $value);
    }

    public function test_home_data_omits_blogs_when_module_disabled(): void
    {
        Setting::set('is_section.blogs', '0');
        Cache::forget('settings_all');
        Cache::flush();

        $data = app(HomeDataService::class)->getHomeData();

        $this->assertTrue($data['blogsFeatured']->isEmpty());
        $this->assertFalse(
            $data['publicModules']->contains(fn (array $module) => $module['id'] === 'blogs')
        );
    }

    public function test_footer_includes_newsletter_when_enabled(): void
    {
        Setting::set('newsletter_enabled', '1');
        Cache::forget('settings_all');

        $this->get(route('index'))
            ->assertOk()
            ->assertSee(route('newsletter.subscribe'), false)
            ->assertSee('name="email"', false);
    }

    public function test_footer_hides_newsletter_when_disabled(): void
    {
        Setting::set('newsletter_enabled', '0');
        Cache::forget('settings_all');

        $this->get(route('index'))
            ->assertOk()
            ->assertDontSee('name="source" value="site_footer"', false);
    }
}
