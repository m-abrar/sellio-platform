<?php

namespace Tests\Feature;

use App\Models\PageContent;
use App\Models\Setting;
use App\Models\Auto;
use App\Models\Event;
use App\Models\Menu;
use App\Models\MenuItem;
use App\Models\Property;
use App\Models\PropertyBooking;
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

    public function test_currency_helpers_and_listing_price_accessors_use_settings(): void
    {
        Setting::set('currency_symbol', 'USD ');
        Setting::set('currency_position', 'right');
        Cache::forget('settings_all');

        $this->assertSame('1,234.50USD ', format_currency(1234.5));
        $this->assertSame('1.2KUSD ', format_currency_compact(1234.5));

        $auto = new Auto([
            'base_price' => 24000,
            'sale_price' => 21000,
            'engine_type' => 'electric',
        ]);

        $this->assertTrue($auto->on_sale);
        $this->assertSame('21,000USD ', $auto->sale_price_formatted);
        $this->assertSame('24,000USD ', $auto->base_price_formatted);
        $this->assertSame('EV', $auto->fuel_badge_label);

        $property = new Property([
            'is_sale' => true,
            'base_price' => 420000,
        ]);

        $this->assertSame('420.0KUSD ', $property->price_formatted_k);

        $event = new Event([
            'base_price' => 75,
        ]);

        $this->assertSame('75.00USD ', $event->price_formatted);
    }

    public function test_property_sale_detail_page_renders_complete_shell(): void
    {
        Setting::set('is_section.properties', '1');
        Cache::forget('settings_all');

        $property = Property::factory()->create([
            'title' => 'Completed Sale Property',
            'is_sale' => true,
            'is_rental' => false,
            'base_price' => 350000,
            'sale_price' => null,
        ]);

        $this->get(route('properties.show', $property->slug))
            ->assertOk()
            ->assertSee('detail-page--property-sale', false)
            ->assertSee('Completed Sale Property', false)
            ->assertSee('images/fallbacks/default-detail.jpg', false)
            ->assertSee('1 Photo', false)
            ->assertSee(__('Schedule a Visit'), false)
            ->assertSee(__('Your Dedicated Agent'), false);
    }

    public function test_property_rental_detail_page_renders_booking_widget_and_availability(): void
    {
        Setting::set('is_section.properties', '1');
        Cache::forget('settings_all');

        $property = Property::factory()->create([
            'title' => 'Completed Rental Property',
            'is_sale' => false,
            'is_rental' => true,
            'price_per_night' => 180,
            'maximum_guests' => 4,
            'minimum_rental_days' => 2,
        ]);

        PropertyBooking::factory()->create([
            'property_id' => $property->id,
            'user_id' => User::factory(),
            'full_name' => 'Rental Guest',
            'email' => 'guest@example.test',
            'phone' => '5551234567',
            'check_in_date' => now()->addDays(7)->toDateString(),
            'check_out_date' => now()->addDays(10)->toDateString(),
            'status' => 'confirmed',
        ]);

        $this->get(route('properties.show', $property->slug))
            ->assertOk()
            ->assertSee('detail-page--property-rental', false)
            ->assertSee('Completed Rental Property', false)
            ->assertSee(__('Secure Your Stay'), false)
            ->assertSee(__('Availability'), false)
            ->assertSee('name="guests"', false)
            ->assertSee('disable: bookedDateRanges', false)
            ->assertSee('"from":"' . now()->addDays(7)->toDateString() . '"', false)
            ->assertSee('"to":"' . now()->addDays(9)->toDateString() . '"', false)
            ->assertSee(__('Meet Your Host'), false);
    }

    public function test_property_default_detail_page_exists_for_unspecified_listing_type(): void
    {
        Setting::set('is_section.properties', '1');
        Cache::forget('settings_all');

        $property = Property::factory()->create([
            'title' => 'Completed Default Property',
            'is_sale' => false,
            'is_rental' => false,
        ]);

        $this->get(route('properties.show', $property->slug))
            ->assertOk()
            ->assertSee('detail-page--property', false)
            ->assertSee('Completed Default Property', false)
            ->assertSee(__('Property Details'), false);
    }

    public function test_property_lodging_price_endpoint_returns_formatted_total(): void
    {
        Setting::set('is_section.properties', '1');
        Setting::set('currency_symbol', '$');
        Setting::set('currency_position', 'left');
        Cache::forget('settings_all');

        $property = Property::factory()->create([
            'is_sale' => false,
            'is_rental' => true,
            'price_per_night' => 125,
        ]);

        $this->getJson(route('properties.calculate-lodging-price', [
            'property' => $property->id,
            'check_in' => now()->addDays(2)->toDateString(),
            'check_out' => now()->addDays(5)->toDateString(),
            'guests' => 1,
        ]))
            ->assertOk()
            ->assertJsonPath('total_nights', 3)
            ->assertJsonPath('estimated_lodging_total', '375.00')
            ->assertJsonPath('estimated_lodging_total_formatted', '$375.00');
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

    public function test_main_header_menu_filters_disabled_module_items(): void
    {
        Setting::set('is_section.products', '1');
        Setting::set('is_section.autos', '0');
        Cache::flush();

        $menu = Menu::updateOrCreate(
            [
                'theme_key' => config('content.blade_scope', 'laravel_blade'),
                'location_key' => 'main_header',
            ],
            [
                'title' => 'Main Header',
                'status' => 'active',
            ]
        );
        $menu->items()->delete();

        MenuItem::create([
            'menu_id' => $menu->id,
            'title' => 'Visible Products Menu',
            'url' => '/products',
            'module' => 'products',
            'order' => 1,
            'status' => 'active',
        ]);

        MenuItem::create([
            'menu_id' => $menu->id,
            'title' => 'Hidden Autos Menu',
            'url' => '/autos',
            'module' => 'autos',
            'order' => 2,
            'status' => 'active',
        ]);

        $this->get(route('index'))
            ->assertOk()
            ->assertSee('Visible Products Menu', false)
            ->assertDontSee('Hidden Autos Menu', false);
    }

    public function test_editable_controls_are_hidden_for_guests_and_admins_without_frontend_edit(): void
    {
        Setting::set('frontend_edit', '0');
        Cache::flush();

        $this->get(route('index'))
            ->assertOk()
            ->assertDontSee('editable-group', false)
            ->assertDontSee('edit-link', false);

        Role::firstOrCreate(['name' => 'admin']);
        $admin = User::factory()->create();
        $admin->assignRole('admin');

        $this->actingAs($admin)
            ->get(route('index'))
            ->assertOk()
            ->assertDontSee('editable-group', false)
            ->assertDontSee('edit-link', false);
    }

    public function test_editable_controls_are_visible_for_admins_when_frontend_edit_is_enabled(): void
    {
        Setting::set('frontend_edit', '1');
        Cache::flush();

        Role::firstOrCreate(['name' => 'admin']);
        $admin = User::factory()->create();
        $admin->assignRole('admin');

        $content = PageContent::create([
            'theme_key' => config('content.blade_scope', 'laravel_blade'),
            'page' => 'global',
            'section' => 'header',
            'content_key' => 'brand_text',
            'value' => 'Editable Brand Copy',
            'input_type' => 'text',
        ]);

        $this->actingAs($admin)
            ->get(route('index'))
            ->assertOk()
            ->assertSee('Editable Brand Copy', false)
            ->assertSee('editable-group', false)
            ->assertSee(route('admin.content.edit.item', ['id' => $content->id]), false);
    }

    public function test_property_booking_checkout_renders_step_one_of_three(): void
    {
        Setting::set('is_section.properties', '1');
        Cache::forget('settings_all');

        $property = Property::factory()->create([
            'title' => 'Step One Rental',
            'is_sale' => false,
            'is_rental' => true,
            'price_per_night' => 150,
            'maximum_guests' => 4,
        ]);

        $checkIn = now()->addDays(3)->toDateString();
        $checkOut = now()->addDays(6)->toDateString();

        $this->get(route('property.booking.checkout', [
            'property' => $property->slug,
            'start_date' => $checkIn,
            'end_date' => $checkOut,
            'guests' => 2,
        ]))
            ->assertOk()
            ->assertSee('page-shell--property-booking', false)
            ->assertSee(__('Step :step of 3', ['step' => 1]), false)
            ->assertSee(__('Stay Overview'), false)
            ->assertSee(__('Continue to Payment'), false)
            ->assertSee('Step One Rental', false);
    }

    public function test_property_booking_payment_renders_step_two_for_booking_owner(): void
    {
        Setting::set('is_section.properties', '1');
        Cache::forget('settings_all');

        $user = User::factory()->create();
        $property = Property::factory()->create([
            'is_sale' => false,
            'is_rental' => true,
            'price_per_night' => 200,
        ]);

        $booking = PropertyBooking::factory()
            ->forDateRange(now()->addDays(5), now()->addDays(8), 200)
            ->pending()
            ->create([
                'property_id' => $property->id,
                'user_id' => $user->id,
                'guests' => 2,
            ]);

        $this->actingAs($user)
            ->get(route('property.booking.payment', [
                'property' => $property->slug,
                'booking' => $booking->id,
            ]))
            ->assertOk()
            ->assertSee(__('Step :step of 3', ['step' => 2]), false)
            ->assertSee(__('Secure Payment'), false)
            ->assertSee(__('Review Booking'), false)
            ->assertSee(__('Complete Payment'), false);
    }

    public function test_property_booking_confirmation_renders_step_three_for_booking_owner(): void
    {
        Setting::set('is_section.properties', '1');
        Cache::forget('settings_all');

        $user = User::factory()->create();
        $property = Property::factory()->create([
            'title' => 'Confirmed Stay Property',
            'is_sale' => false,
            'is_rental' => true,
            'price_per_night' => 175,
        ]);

        $booking = PropertyBooking::factory()
            ->forDateRange(now()->addDays(10), now()->addDays(13), 175)
            ->confirmed()
            ->create([
                'property_id' => $property->id,
                'user_id' => $user->id,
                'guests' => 3,
                'full_name' => 'Confirmed Guest',
            ]);

        $this->actingAs($user)
            ->get(route('property.booking.confirmation', [
                'property' => $property->slug,
                'booking' => $booking->id,
            ]))
            ->assertOk()
            ->assertSee(__('Step :step of 3', ['step' => 3]), false)
            ->assertSee(__('Booking Confirmation'), false)
            ->assertSee(__('Booking Confirmed!'), false)
            ->assertSee('Confirmed Stay Property', false)
            ->assertSee('Confirmed Guest', false);
    }

    public function test_property_booking_payment_is_forbidden_for_other_users(): void
    {
        Setting::set('is_section.properties', '1');
        Cache::forget('settings_all');

        $owner = User::factory()->create();
        $stranger = User::factory()->create();
        $property = Property::factory()->create([
            'is_sale' => false,
            'is_rental' => true,
        ]);

        $booking = PropertyBooking::factory()
            ->forDateRange(now()->addDays(4), now()->addDays(7))
            ->pending()
            ->create([
                'property_id' => $property->id,
                'user_id' => $owner->id,
            ]);

        $this->actingAs($stranger)
            ->get(route('property.booking.payment', [
                'property' => $property->slug,
                'booking' => $booking->id,
            ]))
            ->assertForbidden();
    }
}
