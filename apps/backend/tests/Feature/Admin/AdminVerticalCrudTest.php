<?php

namespace Tests\Feature\Admin;

use App\Models\Category;
use App\Models\Event;
use App\Models\JobListing;
use App\Models\Plan;
use App\Models\Service;
use App\Models\Ticket;
use App\Models\User;
use Spatie\Permission\Models\Role;
use Tests\Concerns\InteractsWithAdmin;
use Tests\TestCase;

class AdminVerticalCrudTest extends TestCase
{
    use InteractsWithAdmin;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seedAdminContext();
    }

    public function test_admin_can_create_update_and_delete_event(): void
    {
        $category = Category::where('is_event', true)->firstOrFail();
        $start = now()->addWeek();
        $end = $start->copy()->addHours(3);

        $this->actingAsSuperAdmin()->post(route('admin.events.store'), [
            'title' => 'CRUD Test Event',
            'description' => 'Event created by admin CRUD test.',
            'category_id' => $category->id,
            'start_date_time' => $start->toDateTimeString(),
            'end_date_time' => $end->toDateTimeString(),
            'base_price' => 49.99,
            'latitude' => 40.7128,
            'longitude' => -74.0060,
            'is_published' => true,
        ])->assertRedirect();

        $event = Event::where('title', 'CRUD Test Event')->firstOrFail();

        $this->actingAsSuperAdmin()->put(route('admin.events.update', $event), [
            'title' => 'Updated CRUD Event',
            'description' => 'Updated event description.',
            'category_id' => $category->id,
            'start_date_time' => $start->toDateTimeString(),
            'end_date_time' => $end->toDateTimeString(),
            'base_price' => 59.99,
            'latitude' => 40.7580,
            'longitude' => -73.9855,
            'is_published' => true,
        ])->assertRedirect();

        $this->assertDatabaseHas('events', [
            'id' => $event->id,
            'title' => 'Updated CRUD Event',
            'latitude' => 40.7580,
            'longitude' => -73.9855,
        ]);

        $this->actingAsSuperAdmin()->delete(route('admin.events.destroy', $event))
            ->assertRedirect();

        $this->assertSoftDeleted('events', ['id' => $event->id]);
    }

    public function test_admin_can_create_update_and_delete_service(): void
    {
        $category = Category::where('is_service', true)->firstOrFail();

        $this->actingAsSuperAdmin()->post(route('admin.services.store'), [
            'title' => 'CRUD Test Service',
            'description' => 'Service created by admin CRUD test.',
            'category_id' => $category->id,
            'base_price' => 99.00,
            'address' => '100 Service Way',
            'city' => 'Austin',
            'state' => 'Texas',
            'country' => 'USA',
            'zip_code' => '78701',
            'is_published' => true,
        ])->assertRedirect();

        $service = Service::where('title', 'CRUD Test Service')->firstOrFail();

        $this->actingAsSuperAdmin()->put(route('admin.services.update', $service), [
            'title' => 'Updated CRUD Service',
            'description' => 'Updated service description.',
            'category_id' => $category->id,
            'base_price' => 129.00,
            'address' => '200 Service Way',
            'city' => 'Dallas',
            'state' => 'Texas',
            'country' => 'USA',
            'zip_code' => '75201',
            'is_published' => true,
        ])->assertRedirect();

        $this->assertDatabaseHas('services', [
            'id' => $service->id,
            'title' => 'Updated CRUD Service',
            'address' => '200 Service Way',
            'city' => 'Dallas',
            'state' => 'Texas',
            'country' => 'USA',
            'zip_code' => '75201',
        ]);

        $this->actingAsSuperAdmin()->delete(route('admin.services.destroy', $service))
            ->assertRedirect();

        $this->assertSoftDeleted('services', ['id' => $service->id]);
    }

    public function test_admin_can_create_update_and_delete_job(): void
    {
        $category = Category::where('is_job', true)->firstOrFail();

        $this->actingAsSuperAdmin()->post(route('admin.jobs.store'), [
            'title' => 'CRUD Test Job',
            'description' => 'Job created by admin CRUD test.',
            'category_id' => $category->id,
            'is_published' => true,
        ])->assertRedirect();

        $job = JobListing::where('title', 'CRUD Test Job')->firstOrFail();

        $this->actingAsSuperAdmin()->put(route('admin.jobs.update', $job), [
            'title' => 'Updated CRUD Job',
            'description' => 'Updated job description.',
            'category_id' => $category->id,
            'is_published' => true,
        ])->assertRedirect();

        $this->assertDatabaseHas('joblistings', ['id' => $job->id, 'title' => 'Updated CRUD Job']);

        $this->actingAsSuperAdmin()->delete(route('admin.jobs.destroy', $job))
            ->assertRedirect();

        $this->assertSoftDeleted('joblistings', ['id' => $job->id]);
    }

    public function test_admin_can_create_update_and_delete_plan(): void
    {
        $this->actingAsSuperAdmin()->post(route('admin.plans.store'), [
            'title' => 'CRUD Test Plan',
            'price' => 19.99,
            'billing_period' => 'monthly',
            'listing_duration' => 30,
            'analytics_access' => 'basic',
            'is_active' => true,
        ])->assertRedirect(route('admin.plans.index'));

        $plan = Plan::where('title', 'CRUD Test Plan')->firstOrFail();

        $this->actingAsSuperAdmin()->put(route('admin.plans.update', $plan), [
            'title' => 'Updated CRUD Plan',
            'price' => 29.99,
            'billing_period' => 'monthly',
            'listing_duration' => 30,
            'analytics_access' => 'advanced',
            'is_active' => true,
        ])->assertRedirect(route('admin.plans.index'));

        $this->assertDatabaseHas('plans', ['id' => $plan->id, 'title' => 'Updated CRUD Plan']);

        $this->actingAsSuperAdmin()->delete(route('admin.plans.destroy', $plan))
            ->assertRedirect(route('admin.plans.index'));

        $this->assertNull(Plan::find($plan->id));
    }

    public function test_admin_can_update_ticket_status_and_delete_ticket(): void
    {
        $ticket = Ticket::create([
            'user_id' => $this->admin->id,
            'title' => 'CRUD Status Ticket',
            'description' => 'Ticket for status update test.',
            'status' => Ticket::STATUS_OPEN,
            'priority' => Ticket::PRIORITY_MEDIUM,
        ]);

        $this->actingAsSuperAdmin()->post(route('admin.tickets.status', $ticket), [
            'status' => Ticket::STATUS_IN_PROGRESS,
        ])->assertRedirect();

        $this->assertDatabaseHas('tickets', [
            'id' => $ticket->id,
            'status' => Ticket::STATUS_IN_PROGRESS,
        ]);

        $this->actingAsSuperAdmin()->delete(route('admin.tickets.destroy', $ticket))
            ->assertRedirect();

        $this->assertNull(Ticket::find($ticket->id));
    }

    public function test_admin_can_create_update_and_delete_user(): void
    {
        $userRole = Role::where('name', 'user')->firstOrFail();

        $this->actingAsSuperAdmin()->post(route('admin.users.store'), [
            'name' => 'CRUD Test User',
            'email' => 'crud-user@test.test',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'roles' => [$userRole->id],
        ])->assertRedirect(route('admin.users.index'));

        $user = User::where('email', 'crud-user@test.test')->firstOrFail();

        $this->actingAsSuperAdmin()->put(route('admin.users.update', $user), [
            'name' => 'Updated CRUD User',
            'email' => 'crud-user@test.test',
            'roles' => [$userRole->id],
        ])->assertRedirect(route('admin.users.index'));

        $this->assertDatabaseHas('users', ['id' => $user->id, 'name' => 'Updated CRUD User']);

        $this->actingAsSuperAdmin()->delete(route('admin.users.destroy', $user))
            ->assertRedirect(route('admin.users.index'));

        $this->assertNull(User::find($user->id));
    }
}
