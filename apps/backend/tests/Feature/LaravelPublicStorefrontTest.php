<?php

namespace Tests\Feature;

use App\Contracts\PaymentGatewayService;
use App\Models\Auto;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Classified;
use App\Models\Event;
use App\Models\Menu;
use App\Models\MenuItem;
use App\Models\PageContent;
use App\Models\Payment;
use App\Models\PaymentGateway;
use App\Models\Product;
use App\Models\Property;
use App\Models\PropertyAddon;
use App\Models\PropertyBooking;
use App\Models\SeasonalPrice;
use App\Models\Setting;
use App\Models\User;
use App\Services\ContentService;
use App\Services\GatewayManager;
use App\Services\HomeDataService;
use App\Services\StripeGatewayService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Schema;
use Mockery;
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

    public function test_cart_page_shows_calculated_subtotal_for_cart_items(): void
    {
        Setting::set('is_section.products', '1');
        Setting::set('built_in_website_status', 'active');
        Cache::forget('settings_all');

        $user = User::factory()->create();
        $product = Product::factory()->create([
            'base_price' => 42.50,
            'sale_price' => null,
            'on_sale' => false,
            'manage_stock' => true,
            'stock_quantity' => 5,
        ]);

        $cart = Cart::create(['user_id' => $user->id, 'temp_total' => 0]);
        $item = new CartItem([
            'cart_id' => $cart->id,
            'product_id' => $product->id,
            'quantity' => 2,
            'attribute_ids' => [],
            'addon_ids' => [],
        ]);
        $item->unit_price = 42.50;
        $item->save();

        $this->actingAs($user)
            ->get(route('cart.index'))
            ->assertOk()
            ->assertSee('$85.00', false)
            ->assertDontSee('$0.00', false);
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

    public function test_login_page_renders_redesigned_auth_shell(): void
    {
        $this->get(route('login'))
            ->assertOk()
            ->assertSee('auth-page', false)
            ->assertSee(__('Welcome Back'), false)
            ->assertSee('btn-primary-theme', false)
            ->assertSee(__('Or continue with'), false);
    }

    public function test_login_page_falls_back_to_vendor_styles_when_vite_build_missing(): void
    {
        $manifestPath = public_path('build/manifest.json');
        $backupPath = public_path('build/manifest.json.login-fallback-test.bak');
        $hadManifest = file_exists($manifestPath);

        if ($hadManifest) {
            rename($manifestPath, $backupPath);
        }

        try {
            $response = $this->get(route('login'));

            $response->assertOk()
                ->assertSee('vendor/npm/bootstrap/css/bootstrap.min.css', false)
                ->assertSee('frontend/css/style.css', false)
                ->assertSee('frontend/css/auth.css', false);
        } finally {
            if ($hadManifest && file_exists($backupPath)) {
                rename($backupPath, $manifestPath);
            }
        }
    }

    public function test_login_page_survives_missing_page_contents_table(): void
    {
        Schema::dropIfExists('page_contents');

        $this->get(route('login'))
            ->assertOk()
            ->assertSee(__('Login'), false);
    }

    public function test_login_page_survives_missing_cart_tables(): void
    {
        Schema::dropIfExists('cart_items');
        Schema::dropIfExists('carts');

        $this->get(route('login'))
            ->assertOk()
            ->assertSee(__('Login'), false);
    }

    public function test_homepage_survives_missing_settings_table(): void
    {
        Cache::forget('settings_all');
        Cache::forget('site_name');
        Schema::dropIfExists('settings');

        $this->get(route('index'))
            ->assertOk()
            ->assertSee(__('Explore the Marketplace'), false);
    }

    public function test_homepage_survives_missing_properties_table(): void
    {
        Cache::flush();
        Schema::dropIfExists('properties');

        $this->get(route('index'))
            ->assertOk()
            ->assertSee(__('Explore the Marketplace'), false);
    }

    public function test_homepage_survives_missing_themes_table(): void
    {
        Cache::flush();
        Schema::dropIfExists('themes');

        $this->get(route('index'))
            ->assertOk()
            ->assertSee(__('Explore the Marketplace'), false);
    }

    public function test_homepage_survives_missing_menu_tables(): void
    {
        Cache::flush();
        Schema::dropIfExists('menu_items');
        Schema::dropIfExists('menus');

        $this->get(route('index'))
            ->assertOk()
            ->assertSee(__('Explore the Marketplace'), false);
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
            ->assertSee('images/fallbacks/default-detail.svg', false)
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

        SeasonalPrice::factory()->create([
            'property_id' => $property->id,
            'title' => 'Summer Peak',
            'start_date' => now()->addMonth()->startOfMonth()->toDateString(),
            'end_date' => now()->addMonth()->endOfMonth()->toDateString(),
            'price' => 240,
        ]);

        $this->get(route('properties.show', $property->slug))
            ->assertOk()
            ->assertSee('detail-page--property-rental', false)
            ->assertSee('Completed Rental Property', false)
            ->assertSee(__('Reserve Your Stay'), false)
            ->assertSee(__('Seasonal rates'), false)
            ->assertSee('Summer Peak', false)
            ->assertSee(format_currency(240, 0), false)
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

        Property::factory()->create([
            'status' => 'approved',
            'is_published' => true,
            'approved_at' => now(),
        ]);

        Property::factory()->create([
            'status' => 'active',
            'is_published' => true,
            'approved_at' => now(),
        ]);

        $response = $this->actingAs($admin)
            ->get(route('properties.index'))
            ->assertOk()
            ->assertSee('listing-page--properties', false);

        $this->assertMatchesRegularExpression('/1\s+Listings Available/', strip_tags($response->getContent()));
    }

    public function test_public_properties_index_uses_curated_demo_limit_when_unfiltered(): void
    {
        Setting::set('is_section.properties', '1');
        Cache::forget('settings_all');

        Property::factory()
            ->count(35)
            ->create([
                'status' => 'approved',
                'is_published' => true,
                'approved_at' => now(),
            ]);

        $response = $this->get(route('properties.index'))
            ->assertOk()
            ->assertSee('listing-page--properties', false);

        $this->assertMatchesRegularExpression('/30\s+Listings Available/', strip_tags($response->getContent()));
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

    public function test_admin_can_open_single_content_item_editor_from_storefront_pencil_link(): void
    {
        Role::firstOrCreate(['name' => 'super-admin']);
        $admin = User::factory()->create();
        $admin->assignRole('super-admin');

        $content = PageContent::create([
            'theme_key' => config('content.blade_scope', 'laravel_blade'),
            'page' => 'home',
            'section' => 'hero',
            'content_key' => 'badge',
            'value' => 'Editable Badge',
            'input_type' => 'text',
        ]);

        $this->actingAs($admin)
            ->get(route('admin.content.edit.item', $content))
            ->assertOk()
            ->assertSee('Editable Badge', false)
            ->assertSee(route('admin.content.bulk_update'), false);
    }

    public function test_home_hero_fields_show_editable_controls_for_admins_when_frontend_edit_is_enabled(): void
    {
        Setting::set('frontend_edit', '1');
        Cache::flush();

        Role::firstOrCreate(['name' => 'admin']);
        $admin = User::factory()->create();
        $admin->assignRole('admin');

        $heroTitle = PageContent::create([
            'theme_key' => config('content.blade_scope', 'laravel_blade'),
            'page' => 'home',
            'section' => 'hero',
            'content_key' => 'title',
            'value' => 'Editable <span class="text-primary">Hero</span>',
            'input_type' => 'text',
        ]);

        $this->actingAs($admin)
            ->get(route('index'))
            ->assertOk()
            ->assertSee('Editable <span class="text-primary">Hero</span>', false)
            ->assertSee('editable-group', false)
            ->assertSee(route('admin.content.edit.item', ['id' => $heroTitle->id]), false);
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
            ->assertSee(__('Step 1 of 3'), false)
            ->assertSee(__('Stay Details'), false)
            ->assertSee(__('Enhance Your Stay'), false)
            ->assertSee(__('Continue to Payment'), false)
            ->assertSee('Step One Rental', false);
    }

    public function test_property_booking_checkout_shows_seeded_addons_for_rental(): void
    {
        Setting::set('is_section.properties', '1');
        Cache::forget('settings_all');

        $property = Property::factory()->create([
            'is_sale' => false,
            'is_rental' => true,
            'price_per_night' => 120,
            'maximum_guests' => 4,
        ]);

        PropertyAddon::factory()->create([
            'property_id' => $property->id,
            'title' => 'Daily Breakfast',
            'type' => 'per_night',
            'icon' => 'bi-cup-hot',
            'is_popular' => true,
            'max_qty' => 4,
            'price' => 25,
        ]);

        $checkIn = now()->addDays(4)->toDateString();
        $checkOut = now()->addDays(7)->toDateString();

        $this->get(route('property.booking.checkout', [
            'property' => $property->slug,
            'start_date' => $checkIn,
            'end_date' => $checkOut,
            'guests' => 2,
        ]))
            ->assertOk()
            ->assertSee('Daily Breakfast', false)
            ->assertDontSee(__('No add-ons available.'), false);
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

    public function test_property_booking_payment_uses_stripe_elements_when_gateway_is_configured(): void
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

        PaymentGateway::create([
            'title' => 'Stripe',
            'slug' => 'stripe',
            'class_name' => StripeGatewayService::class,
            'is_active' => true,
            'mode' => PaymentGateway::MODE_SANDBOX,
        ])->credentials()->create([
            'sandbox_config' => [
                'secret_key' => 'sk_test_example',
                'publishable_key' => 'pk_test_property_booking',
                'currency' => 'USD',
            ],
            'live_config' => [],
        ]);

        $this->actingAs($user)
            ->get(route('property.booking.payment', [
                'property' => $property->slug,
                'booking' => $booking->id,
            ]))
            ->assertOk()
            ->assertSee('https://js.stripe.com/v3/', false)
            ->assertSee('pk_test_property_booking', false)
            ->assertSee('data-stripe-card-element', false)
            ->assertSee('data-stripe-payment-token', false);
    }

    public function test_property_booking_stripe_payment_confirms_booking_and_records_payment(): void
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
                'total_price' => 600,
            ]);

        PaymentGateway::create([
            'title' => 'Stripe',
            'slug' => 'stripe',
            'class_name' => StripeGatewayService::class,
            'is_active' => true,
            'mode' => PaymentGateway::MODE_SANDBOX,
        ]);

        $fakeGateway = Mockery::mock(PaymentGatewayService::class);
        $fakeGateway->shouldReceive('charge')
            ->once()
            ->withArgs(function (float $amount, string $token, string $returnUrl, array $metadata) use ($booking) {
                return $amount === 600.0
                    && $token === 'tok_visa'
                    && str_contains($returnUrl, '/booking/' . $booking->id . '/payment/confirm/stripe')
                    && ($metadata['purpose'] ?? null) === 'property_booking'
                    && ($metadata['property_booking_id'] ?? null) === (string) $booking->id;
            })
            ->andReturn([
                'status' => 'successful',
                'reference' => 'pi_property_booking_success',
                'message' => 'Payment processed successfully via Stripe.',
            ]);

        $this->mock(GatewayManager::class, function ($mock) use ($fakeGateway) {
            $mock->shouldReceive('resolve')->once()->andReturn($fakeGateway);
        });

        $this->actingAs($user)
            ->post(route('property.booking.processPayment', $booking), [
                'payment_method' => 'stripe',
                'card_number' => '4242 4242 4242 4242',
                'name_on_card' => 'Demo Guest',
                'mm_yy' => '12/30',
                'cvc' => '123',
                'termsCheck' => '1',
            ])
            ->assertRedirect(route('property.booking.confirmation', [
                'property' => $property->slug,
                'booking' => $booking->id,
            ]));

        $this->assertDatabaseHas('property_bookings', [
            'id' => $booking->id,
            'status' => PropertyBooking::STATUS_CONFIRMED,
        ]);

        $this->assertDatabaseHas('payments', [
            'user_id' => $user->id,
            'amount' => 600,
            'payment_method' => 'stripe',
            'transaction_id' => 'pi_property_booking_success',
            'status' => Payment::STATUS_COMPLETED,
            'payable_type' => PropertyBooking::class,
            'payable_id' => $booking->id,
        ]);
    }

    public function test_property_booking_stripe_failure_keeps_booking_pending(): void
    {
        Setting::set('is_section.properties', '1');
        Cache::forget('settings_all');

        $user = User::factory()->create();
        $property = Property::factory()->create([
            'is_sale' => false,
            'is_rental' => true,
            'price_per_night' => 150,
        ]);

        $booking = PropertyBooking::factory()
            ->forDateRange(now()->addDays(6), now()->addDays(8), 150)
            ->pending()
            ->create([
                'property_id' => $property->id,
                'user_id' => $user->id,
                'guests' => 2,
                'total_price' => 300,
            ]);

        PaymentGateway::create([
            'title' => 'Stripe',
            'slug' => 'stripe',
            'class_name' => StripeGatewayService::class,
            'is_active' => true,
            'mode' => PaymentGateway::MODE_SANDBOX,
        ]);

        $fakeGateway = Mockery::mock(PaymentGatewayService::class);
        $fakeGateway->shouldReceive('charge')
            ->once()
            ->andReturn([
                'status' => 'failed',
                'reference' => 'pi_property_booking_failed',
                'message' => 'Stripe reported a charge failure.',
            ]);

        $this->mock(GatewayManager::class, function ($mock) use ($fakeGateway) {
            $mock->shouldReceive('resolve')->once()->andReturn($fakeGateway);
        });

        $this->actingAs($user)
            ->from(route('property.booking.payment', [
                'property' => $property->slug,
                'booking' => $booking->id,
            ]))
            ->post(route('property.booking.processPayment', $booking), [
                'payment_method' => 'stripe',
                'card_number' => '4242 4242 4242 4242',
                'name_on_card' => 'Demo Guest',
                'mm_yy' => '12/30',
                'cvc' => '123',
                'termsCheck' => '1',
            ])
            ->assertRedirect(route('property.booking.payment', [
                'property' => $property->slug,
                'booking' => $booking->id,
            ]));

        $this->assertDatabaseHas('property_bookings', [
            'id' => $booking->id,
            'status' => PropertyBooking::STATUS_PENDING,
        ]);

        $this->assertDatabaseHas('payments', [
            'user_id' => $user->id,
            'amount' => 300,
            'payment_method' => 'stripe',
            'transaction_id' => 'pi_property_booking_failed',
            'status' => Payment::STATUS_FAILED,
            'payable_type' => PropertyBooking::class,
            'payable_id' => $booking->id,
        ]);
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
            ->assertSee('checkout-success-hero', false)
            ->assertSee(__('Booking Confirmation'), false)
            ->assertSee(__('Booking Confirmed!'), false)
            ->assertDontSee(__('Step :step of 3', ['step' => 3]), false)
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

    public function test_property_booking_store_creates_pending_booking_and_redirects_to_payment(): void
    {
        Setting::set('is_section.properties', '1');
        Cache::forget('settings_all');

        $user = User::factory()->create();
        $property = Property::factory()->create([
            'is_sale' => false,
            'is_rental' => true,
            'price_per_night' => 160,
            'maximum_guests' => 4,
        ]);

        $checkIn = now()->addDays(8)->toDateString();
        $checkOut = now()->addDays(11)->toDateString();

        $this->actingAs($user)
            ->post(route('property.booking.store', ['property' => $property->slug]), [
                'property_id' => $property->id,
                'check_in' => $checkIn,
                'check_out' => $checkOut,
                'guests' => 2,
                'full_name' => 'Storefront Guest',
                'email' => $user->email,
                'phone' => '555-0101',
            ])
            ->assertRedirect();

        $booking = PropertyBooking::query()
            ->where('user_id', $user->id)
            ->where('property_id', $property->id)
            ->latest('id')
            ->first();

        $this->assertNotNull($booking);
        $this->assertSame('pending', $booking->status);
        $this->assertSame('Storefront Guest', $booking->full_name);
    }

    public function test_product_detail_page_uses_primary_image_url_for_related_products(): void
    {
        Setting::set('is_section.products', '1');
        Cache::forget('settings_all');

        $product = Product::factory()->create([
            'title' => 'Primary Detail Product',
            'is_published' => true,
        ]);

        $related = Product::factory()->create([
            'title' => 'Related Shelf Product',
            'is_published' => true,
            'category_id' => $product->category_id,
        ]);

        $this->get(route('product.show', $product->slug))
            ->assertOk()
            ->assertSee('Primary Detail Product', false)
            ->assertSee('Related Shelf Product', false)
            ->assertSee($related->primary_image_url, false)
            ->assertDontSee('map-placeholder.webp', false);
    }

    public function test_digital_product_detail_renders_physical_template(): void
    {
        Setting::set('is_section.products', '1');
        Cache::forget('settings_all');

        $product = Product::factory()->create([
            'title' => 'Digital Download Product',
            'is_published' => true,
            'is_digital' => true,
        ]);

        $this->get(route('product.show', $product->slug))
            ->assertOk()
            ->assertSee('Digital Download Product', false)
            ->assertSee('DIGITAL', false);
    }

    public function test_legacy_products_detail_url_redirects_to_product_show(): void
    {
        Setting::set('is_section.products', '1');
        Cache::forget('settings_all');

        $product = Product::factory()->create([
            'title' => 'Legacy Route Product',
            'is_published' => true,
        ]);

        $this->get('/products/' . $product->slug)
            ->assertRedirect(route('product.show', $product->slug));
    }

    public function test_classified_detail_page_renders_token_aligned_header_and_seller_card(): void
    {
        Setting::set('is_section.classifieds', '1');
        Cache::forget('settings_all');

        $classified = Classified::factory()->create([
            'title' => 'Token Aligned Classified',
            'is_published' => true,
        ]);

        $this->get(route('classifieds.show', $classified->slug))
            ->assertOk()
            ->assertSee('Token Aligned Classified', false)
            ->assertSee(__('Contact Seller'), false)
            ->assertSee(__('Safety Tips'), false)
            ->assertSee('classified-detail-header', false);
    }
}
