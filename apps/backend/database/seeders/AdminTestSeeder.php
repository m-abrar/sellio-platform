<?php

namespace Database\Seeders;

use App\Models\Auto;
use App\Models\Blog;
use App\Models\Category;
use App\Models\Classified;
use App\Models\Event;
use App\Models\JobListing;
use App\Models\Menu;
use App\Models\MenuItem;
use App\Models\Page;
use App\Models\Plan;
use App\Models\Product;
use App\Models\Property;
use App\Models\Service;
use App\Models\Subscription;
use App\Models\SubscriptionQuota;
use App\Models\Theme;
use App\Models\Ticket;
use App\Models\Type;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

/**
 * Deterministic seed data for admin dashboard feature/E2E tests.
 */
class AdminTestSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            SettingSeeder::class,
            RolesAndPermissionsSeeder::class,
            LocationSeeder::class,
            CategorySeeder::class,
            BrandSeeder::class,
            TypeSeeder::class,
        ]);

        Permission::firstOrCreate(['name' => 'manage-marketing']);
        Role::where('name', 'super-admin')->first()
            ?->givePermissionTo('manage-marketing');

        $this->enableAllModules();

        $admin = User::updateOrCreate(
            ['email' => 'admin@sellio.buzz'],
            [
                'name' => 'Admin User',
                'username' => 'admin_user',
                'password' => Hash::make('admin123'),
                'email_verified_at' => now(),
                'is_verified' => true,
                'is_admin' => true,
            ]
        );
        $admin->assignRole('super-admin');

        User::factory()->create(['email' => 'partner@test.test'])->assignRole('partner');

        $category = Category::factory()->create(['title' => 'Test Category', 'is_blog' => true]);

        Product::factory()->create(['title' => 'Test Product']);
        Property::factory()->create(['title' => 'Test Property']);
        Auto::factory()->create(['title' => 'Test Auto']);
        Event::factory()->create(['title' => 'Test Event']);
        JobListing::factory()->create(['title' => 'Test Job']);
        Service::factory()->create(['title' => 'Test Service']);
        Classified::factory()->create([
            'title' => 'Test Classified',
            'type_id' => Type::where('is_classified', true)->value('id'),
        ]);

        Blog::create([
            'user_id' => $admin->id,
            'category_id' => $category->id,
            'title' => 'Test Blog',
            'slug' => 'test-blog',
            'content' => 'Test blog content.',
        ]);

        Page::create([
            'title' => 'Test Page',
            'slug' => 'test-page',
            'status' => Page::STATUS_ACTIVE,
        ]);

        $plan = Plan::firstOrCreate(
            ['slug' => 'test-plan'],
            [
                'title' => 'Test Plan',
                'price' => 9.99,
                'billing_period' => 'monthly',
                'is_active' => true,
            ]
        );

        Subscription::create([
            'user_id' => $admin->id,
            'plan_id' => $plan->id,
            'title' => 'Test Subscription',
            'status' => Subscription::STATUS_ACTIVE,
            'starts_at' => now()->subMonth(),
            'ends_at' => now()->addMonth(),
        ]);

        $subscription = Subscription::first();
        SubscriptionQuota::create([
            'subscription_id' => $subscription->id,
            'listings_used' => 1,
            'featured_used' => 0,
        ]);

        Ticket::create([
            'user_id' => $admin->id,
            'title' => 'Test Ticket',
            'description' => 'Support ticket for admin tests.',
            'status' => Ticket::STATUS_OPEN,
            'priority' => Ticket::PRIORITY_MEDIUM,
        ]);

        Theme::firstOrCreate(
            ['theme_key' => 'unifieds_default'],
            ['vertical' => 'unifieds', 'title' => 'Unified Default', 'is_active' => true]
        );

        $menu = Menu::firstOrCreate(
            ['theme_key' => 'unifieds_default', 'location_key' => 'main_header'],
            ['title' => 'Main Menu', 'status' => 'active']
        );
        MenuItem::firstOrCreate(
            ['menu_id' => $menu->id, 'title' => 'Home'],
            ['url' => '/', 'order' => 0]
        );

        $this->call(Payment\PaymentGatewaysSeeder::class);
    }

    private function enableAllModules(): void
    {
        foreach (['properties', 'products', 'autos', 'events', 'jobs', 'services', 'classifieds'] as $module) {
            DB::table('settings')->updateOrInsert(
                ['key' => 'is_section.' . $module],
                ['group' => 'modules', 'value' => '1', 'created_at' => now(), 'updated_at' => now()]
            );
        }
    }
}
