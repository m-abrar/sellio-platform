<?php

namespace Tests\Feature\Admin;

use App\Models\Amenity;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Event;
use App\Models\EventOccurrence;
use App\Models\EventTicketType;
use App\Models\Menu;
use App\Models\MenuItem;
use App\Models\Payment;
use App\Models\Plan;
use App\Models\Product;
use App\Models\Property;
use App\Models\Service;
use App\Models\ServicePackage;
use App\Models\Subscription;
use App\Models\User;
use App\Services\Admin\ListingQueryService;
use Spatie\Permission\Models\Role;
use Tests\Concerns\InteractsWithAdmin;
use Tests\TestCase;

class AdminRelationshipTest extends TestCase
{
    use InteractsWithAdmin;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seedAdminContext();
    }

    public function test_product_store_persists_category_and_brand(): void
    {
        $category = Category::where('is_product', true)->firstOrFail();
        $brand = Brand::where('is_product', true)->firstOrFail();

        $this->actingAsSuperAdmin()->post(route('admin.products.store'), [
            'title' => 'Relationship Test Product',
            'description' => 'Product with category and brand.',
            'base_price' => 49.99,
            'category_id' => $category->id,
            'brand_id' => $brand->id,
            'is_published' => true,
        ])->assertRedirect(route('admin.products.index'));

        $product = Product::where('title', 'Relationship Test Product')->firstOrFail();

        $this->assertSame($category->id, $product->category_id);
        $this->assertSame($brand->id, $product->brand_id);
        $this->assertTrue($product->category->is($category));
        $this->assertTrue($product->brand->is($brand));
    }

    public function test_property_amenities_relationship_persists_in_pivot(): void
    {
        $property = Property::firstOrFail();
        $amenity = Amenity::create([
            'title' => 'Test Pool',
            'slug' => 'test-pool',
            'is_published' => true,
            'is_property' => true,
        ]);

        $property->amenities()->sync([$amenity->id]);

        $property->refresh();

        $this->assertCount(1, $property->amenities);
        $this->assertTrue($property->amenities->first()->is($amenity));
        $this->assertDatabaseHas('amenity_property', [
            'property_id' => $property->id,
            'amenity_id' => $amenity->id,
        ]);
    }

    public function test_property_update_syncs_amenities_via_admin_form(): void
    {
        $property = Property::firstOrFail();
        $amenity = Amenity::create([
            'title' => 'HTTP Pool Amenity',
            'slug' => 'http-pool-amenity',
            'is_published' => true,
            'is_property' => true,
        ]);

        $this->actingAsSuperAdmin()->put(route('admin.properties.update', $property), [
            'title' => $property->title,
            'slug' => $property->slug,
            'description' => $property->description,
            'base_price' => $property->base_price,
            'city' => $property->city,
            'country' => $property->country,
            'amenities' => [$amenity->id],
        ])->assertSessionHasNoErrors()
            ->assertRedirect(route('admin.properties.index'));

        $property->refresh();

        $this->assertTrue($property->amenities->contains('id', $amenity->id));
    }

    public function test_event_has_occurrences_and_ticket_types(): void
    {
        $event = Event::firstOrFail();

        EventOccurrence::factory()->count(2)->create(['event_id' => $event->id]);
        EventTicketType::factory()->create(['event_id' => $event->id, 'title' => 'VIP Pass']);

        $event->refresh();

        $this->assertCount(2, $event->occurrences);
        $this->assertCount(1, $event->ticketTypes);
        $this->assertDatabaseCount('event_occurrences', 2);
        $this->assertDatabaseHas('event_ticket_types', [
            'event_id' => $event->id,
            'title' => 'VIP Pass',
        ]);
    }

    public function test_service_has_packages(): void
    {
        $service = Service::firstOrFail();

        ServicePackage::create([
            'service_id' => $service->id,
            'title' => 'Basic Package',
            'slug' => 'basic-package',
            'description' => 'Starter service tier.',
            'price' => 99.00,
            'billing_period' => 'one_time',
            'is_active' => true,
        ]);

        $service->refresh();

        $this->assertCount(1, $service->packages);
        $this->assertDatabaseHas('service_packages', [
            'service_id' => $service->id,
            'title' => 'Basic Package',
        ]);
    }

    public function test_user_creation_assigns_roles(): void
    {
        $moderatorRole = Role::where('name', 'moderator')->firstOrFail();

        $this->actingAsSuperAdmin()->post(route('admin.users.store'), [
            'name' => 'Moderator Test User',
            'email' => 'moderator-test@test.test',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'roles' => [$moderatorRole->id],
        ])->assertRedirect();

        $user = User::where('email', 'moderator-test@test.test')->firstOrFail();

        $this->assertTrue($user->hasRole('moderator'));
        $this->assertDatabaseHas('model_has_roles', [
            'model_id' => $user->id,
            'model_type' => User::class,
            'role_id' => $moderatorRole->id,
        ]);
    }

    public function test_subscription_belongs_to_user_plan_and_quota(): void
    {
        $subscription = Subscription::with(['user', 'plan', 'quota'])->firstOrFail();
        $plan = Plan::where('slug', 'test-plan')->firstOrFail();

        $this->assertTrue($subscription->user->is($this->admin));
        $this->assertTrue($subscription->plan->is($plan));
        $this->assertNotNull($subscription->quota);
        $this->assertSame($subscription->id, $subscription->quota->subscription_id);
    }

    public function test_payment_links_to_subscription_payable(): void
    {
        $subscription = Subscription::firstOrFail();

        $this->actingAsSuperAdmin()->post(route('admin.payments.store'), [
            'user_id' => $this->admin->id,
            'payable_id' => $subscription->id,
            'payable_type' => Subscription::class,
            'amount' => 9.99,
            'currency' => 'USD',
            'payment_method' => 'manual',
            'status' => 'completed',
        ])->assertRedirect(route('admin.payments.index'));

        $payment = Payment::where('payable_id', $subscription->id)
            ->where('payable_type', Subscription::class)
            ->firstOrFail();

        $this->assertSame('9.99', (string) $payment->amount);
        $this->assertTrue($payment->payable->is($subscription));
    }

    public function test_menu_structure_nests_items_under_parent(): void
    {
        $menu = Menu::firstOrFail();
        $parent = MenuItem::where('menu_id', $menu->id)->where('title', 'Home')->firstOrFail();
        $child = MenuItem::create([
            'menu_id' => $menu->id,
            'title' => 'Nested Child',
            'url' => '/nested',
            'order' => 2,
            'status' => 'active',
        ]);

        $this->actingAsSuperAdmin()->post(route('admin.menu.update_structure', $menu), [
            'menu_structure' => json_encode([
                [
                    'id' => $parent->id,
                    'children' => [
                        ['id' => $child->id, 'children' => []],
                    ],
                ],
            ]),
        ])->assertRedirect();

        $this->assertDatabaseHas('menu_items', [
            'id' => $child->id,
            'parent_id' => $parent->id,
        ]);
    }

    public function test_listing_service_resolves_seeded_vertical_models(): void
    {
        $service = app(ListingQueryService::class);

        $property = Property::where('title', 'Test Property')->firstOrFail();
        $event = Event::where('title', 'Test Event')->firstOrFail();
        $serviceModel = Service::where('title', 'Test Service')->firstOrFail();

        $this->assertSame('Test Property', $service->resolveListing('property', $property->id)?->title);
        $this->assertSame('Test Event', $service->resolveListing('event', $event->id)?->title);
        $this->assertSame('Test Service', $service->resolveListing('service', $serviceModel->id)?->title);
    }

    public function test_unified_listings_query_returns_seeded_property_title(): void
    {
        $service = app(ListingQueryService::class);
        $property = Property::where('title', 'Test Property')->firstOrFail();

        $listings = $service->getUnifiedListings('all');
        $titles = $listings->pluck('title')->all();

        $this->assertContains('Test Property', $titles);
        $this->assertSame('Test Property', $service->resolveListing('property', $property->id)?->title);
    }
}
