<?php

namespace Tests\Feature;

use App\Models\PageContent;
use App\Models\Setting;
use App\Services\ContentService;
use App\Services\HomeDataService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
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

    public function test_products_index_renders_product_catalog_not_classifieds(): void
    {
        Setting::set('is_section.products', '1');
        Cache::forget('settings_all');

        $this->get(route('products.index'))
            ->assertOk()
            ->assertSee(__('Product Catalog'), false)
            ->assertSee(__('Filter Products'), false)
            ->assertDontSee(__('Ads Available'), false);
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
