<?php

namespace Tests\Feature\Admin;

use App\Models\Addon;
use App\Models\BookingLineItem;
use App\Models\LineItem;
use App\Models\Property;
use App\Models\PropertyBooking;
use Tests\Concerns\InteractsWithAdmin;
use Tests\TestCase;

class AdminFinancialExtrasTest extends TestCase
{
    use InteractsWithAdmin;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seedAdminContext();
    }

    public function test_admin_can_create_update_and_delete_addon(): void
    {
        $this->actingAsSuperAdmin()->post(route('admin.addons.store'), [
            'name' => 'CRUD Test Addon',
            'description' => 'Addon for admin CRUD test.',
            'price' => 19.99,
            'status' => 'active',
        ])->assertRedirect(route('admin.addons.index'));

        $addon = Addon::where('name', 'CRUD Test Addon')->firstOrFail();

        $this->actingAsSuperAdmin()->put(route('admin.addons.update', $addon), [
            'name' => 'Updated CRUD Addon',
            'description' => 'Updated addon description.',
            'price' => 24.50,
            'status' => 'inactive',
        ])->assertRedirect(route('admin.addons.index'));

        $this->assertDatabaseHas('addons', [
            'id' => $addon->id,
            'name' => 'Updated CRUD Addon',
            'status' => 'inactive',
        ]);

        $this->actingAsSuperAdmin()->delete(route('admin.addons.destroy', $addon))
            ->assertRedirect(route('admin.addons.index'));

        $this->assertNull(Addon::find($addon->id));
    }

    public function test_admin_can_create_update_and_delete_line_item_template(): void
    {
        $this->actingAsSuperAdmin()->post(route('admin.line-items.store'), [
            'title' => 'CRUD Service Fee',
            'amount' => 5.00,
            'type' => 'fixed',
            'applies_on' => 'booking',
            'status' => 'active',
        ])->assertRedirect(route('admin.line-items.index'));

        $lineItem = LineItem::where('title', 'CRUD Service Fee')->firstOrFail();

        $this->actingAsSuperAdmin()->put(route('admin.line-items.update', $lineItem), [
            'title' => 'Updated Service Fee',
            'amount' => 7.50,
            'type' => 'percentage',
            'applies_on' => 'service',
            'status' => 'inactive',
        ])->assertRedirect(route('admin.line-items.index'));

        $this->assertDatabaseHas('line_items', [
            'id' => $lineItem->id,
            'title' => 'Updated Service Fee',
            'type' => 'percentage',
            'status' => 'inactive',
        ]);

        $this->actingAsSuperAdmin()->delete(route('admin.line-items.destroy', $lineItem))
            ->assertRedirect(route('admin.line-items.index'));

        $this->assertNull(LineItem::find($lineItem->id));
    }

    public function test_admin_can_update_and_delete_booking_line_item(): void
    {
        $property = Property::firstOrFail();
        $booking = PropertyBooking::create([
            'user_id' => $this->admin->id,
            'property_id' => $property->id,
            'full_name' => 'Line Item CRUD Guest',
            'email' => 'line-item-guest@test.test',
            'phone' => '+1 555 0505',
            'check_in_date' => now()->addMonths(2)->toDateString(),
            'check_out_date' => now()->addMonths(2)->addDays(3)->toDateString(),
            'guests' => 2,
            'total_price' => 320.00,
            'status' => PropertyBooking::STATUS_CONFIRMED,
        ]);

        $lineItem = BookingLineItem::create([
            'property_booking_id' => $booking->id,
            'title' => 'Cleaning Fee',
            'quantity' => 1,
            'price' => 50.00,
        ]);

        $this->actingAsSuperAdmin()
            ->from(route('admin.booking-line-items.index'))
            ->put(route('admin.booking-line-items.update', $lineItem), [
                'title' => 'Updated Cleaning Fee',
                'quantity' => 2,
                'price' => 75.00,
            ])
            ->assertRedirect(route('admin.booking-line-items.index'))
            ->assertSessionHas('success');

        $this->assertDatabaseHas('booking_line_items', [
            'id' => $lineItem->id,
            'title' => 'Updated Cleaning Fee',
            'quantity' => 2,
            'price' => '75.00',
        ]);

        $this->actingAsSuperAdmin()
            ->from(route('admin.booking-line-items.index'))
            ->delete(route('admin.booking-line-items.destroy', $lineItem))
            ->assertRedirect(route('admin.booking-line-items.index'))
            ->assertSessionHas('success');

        $this->assertNull(BookingLineItem::find($lineItem->id));
    }
}
