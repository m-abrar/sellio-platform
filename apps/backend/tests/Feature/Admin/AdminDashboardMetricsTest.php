<?php

namespace Tests\Feature\Admin;

use App\Models\Auto;
use App\Models\Classified;
use App\Models\Event;
use App\Models\JobListing;
use App\Models\Product;
use App\Models\Property;
use App\Models\Service;
use App\Models\Subscription;
use App\Models\Ticket;
use App\Models\User;
use App\Services\Admin\DashboardService;
use Tests\Concerns\ClearsAdminDashboardCache;
use Tests\Concerns\InteractsWithAdmin;
use Tests\TestCase;

class AdminDashboardMetricsTest extends TestCase
{
    use ClearsAdminDashboardCache;
    use InteractsWithAdmin;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seedAdminContext();
    }

    public function test_dashboard_user_metrics_match_database(): void
    {
        $this->clearAdminDashboardCache();

        $metrics = app(DashboardService::class)->getGlobalMetrics();
        $userMetrics = $metrics['user_metrics'];

        $this->assertSame(number_format(User::count()), $userMetrics['total_users']);
        $this->assertSame(
            number_format(Subscription::where('status', Subscription::STATUS_ACTIVE)->count()),
            $userMetrics['active_subscriptions']
        );
    }

    public function test_dashboard_urgent_actions_reflect_database_counts(): void
    {
        Ticket::query()->update(['status' => Ticket::STATUS_RESOLVED]);
        Ticket::create([
            'user_id' => $this->admin->id,
            'title' => 'Open Ticket A',
            'description' => 'Needs attention.',
            'status' => Ticket::STATUS_OPEN,
            'priority' => Ticket::PRIORITY_MEDIUM,
        ]);
        Ticket::create([
            'user_id' => $this->admin->id,
            'title' => 'Open Ticket B',
            'description' => 'Needs attention.',
            'status' => Ticket::STATUS_IN_PROGRESS,
            'priority' => Ticket::PRIORITY_HIGH,
        ]);

        Product::factory()->count(2)->create(['is_published' => false]);

        $this->clearAdminDashboardCache();

        $metrics = app(DashboardService::class)->getGlobalMetrics();

        $this->assertSame(Ticket::unresolved()->count(), $metrics['urgent_actions']['unresolved_tickets']);
        $this->assertSame($this->expectedListingApprovals(), $metrics['urgent_actions']['listing_approvals']);
        $this->assertSame($this->expectedLiveListings(), $metrics['secondary_metrics']['live_properties']);
    }

    public function test_dashboard_page_renders_database_metrics(): void
    {
        $this->clearAdminDashboardCache();

        $userCount = number_format(User::count());

        $this->actingAsSuperAdmin()
            ->get(route('admin.welcome'))
            ->assertOk()
            ->assertSee($userCount, false);
    }

    public function test_dashboard_metrics_refresh_after_cache_clear(): void
    {
        $this->clearAdminDashboardCache();
        $before = app(DashboardService::class)->getGlobalMetrics();

        Ticket::create([
            'user_id' => $this->admin->id,
            'title' => 'Cache Refresh Ticket',
            'description' => 'Created after initial metrics load.',
            'status' => Ticket::STATUS_OPEN,
            'priority' => Ticket::PRIORITY_LOW,
        ]);

        $stale = app(DashboardService::class)->getGlobalMetrics();
        $this->assertSame($before['urgent_actions']['unresolved_tickets'], $stale['urgent_actions']['unresolved_tickets']);

        $this->clearAdminDashboardCache();
        $fresh = app(DashboardService::class)->getGlobalMetrics();

        $this->assertSame(
            $before['urgent_actions']['unresolved_tickets'] + 1,
            $fresh['urgent_actions']['unresolved_tickets']
        );
    }

    private function expectedListingApprovals(): int
    {
        $models = [
            Property::class,
            Event::class,
            JobListing::class,
            Auto::class,
            Service::class,
            Classified::class,
            Product::class,
        ];

        return array_sum(array_map(
            fn (string $model) => $model::where('is_published', false)->count(),
            $models
        ));
    }

    private function expectedLiveListings(): int
    {
        $models = [
            Property::class,
            Event::class,
            JobListing::class,
            Auto::class,
            Service::class,
            Classified::class,
            Product::class,
        ];

        return array_sum(array_map(
            fn (string $model) => $model::where('is_published', true)->count(),
            $models
        ));
    }
}
