<?php

namespace Tests\Feature\Admin;

use App\Models\Auto;
use App\Models\Category;
use App\Models\Classified;
use App\Models\Property;
use App\Models\Type;
use Tests\Concerns\InteractsWithAdmin;
use Tests\TestCase;

class AdminListingVerticalCrudTest extends TestCase
{
    use InteractsWithAdmin;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seedAdminContext();
    }

    public function test_admin_can_create_update_and_soft_delete_property(): void
    {
        $category = Category::where('is_property', true)->firstOrFail();

        $this->actingAsSuperAdmin()->post(route('admin.properties.store'), [
            'title' => 'CRUD Test Property',
            'description' => 'Created by admin property CRUD test.',
            'base_price' => 350000,
            'category_id' => $category->id,
            'city' => 'Austin',
            'country' => 'USA',
            'latitude' => 30.2672,
            'longitude' => -97.7431,
            'status' => true,
        ])->assertRedirect();

        $property = Property::where('title', 'CRUD Test Property')->firstOrFail();

        $this->actingAsSuperAdmin()->put(route('admin.properties.update', $property), [
            'title' => 'Updated CRUD Property',
            'description' => 'Updated by admin property CRUD test.',
            'base_price' => 375000,
            'category_id' => $category->id,
            'city' => 'Austin',
            'country' => 'USA',
            'latitude' => 30.2700,
            'longitude' => -97.7500,
            'status' => true,
            'scores' => [
                ['title' => 'Walk Score', 'score' => 88, 'units' => '/100', 'description' => 'Very Walkable'],
                ['title' => 'School Rating', 'score' => 8.5, 'units' => '/10', 'description' => 'Excellent'],
            ],
            'seasonal_prices' => [
                [
                    'name' => 'Summer Peak',
                    'start_date' => now()->addMonths(2)->toDateString(),
                    'end_date' => now()->addMonths(3)->toDateString(),
                    'price' => 275,
                ],
            ],
        ])->assertRedirect();

        $this->assertDatabaseHas('properties', [
            'id' => $property->id,
            'title' => 'Updated CRUD Property',
            'is_published' => true,
            'latitude' => 30.2700,
            'longitude' => -97.7500,
        ]);

        $this->assertDatabaseHas('property_scores', [
            'property_id' => $property->id,
            'title' => 'Walk Score',
            'score' => 88,
        ]);
        $this->assertDatabaseHas('property_scores', [
            'property_id' => $property->id,
            'title' => 'School Rating',
            'score' => 8.5,
        ]);

        $this->assertDatabaseHas('seasonal_prices', [
            'property_id' => $property->id,
            'title' => 'Summer Peak',
            'price' => 275,
        ]);

        $this->actingAsSuperAdmin()->delete(route('admin.properties.destroy', $property))
            ->assertRedirect(route('admin.properties.index'));

        $this->assertSoftDeleted('properties', ['id' => $property->id]);
    }

    public function test_admin_can_create_update_and_soft_delete_auto(): void
    {
        $category = Category::where('is_auto', true)->firstOrFail();

        $payload = [
            'title' => 'CRUD Test Auto',
            'description' => 'Created by admin auto CRUD test.',
            'category_id' => $category->id,
            'base_price' => 25000,
            'year' => 2020,
            'make' => 'Toyota',
            'model' => 'Camry',
            'engine_type' => 'Inline-4',
            'transmission' => 'automatic',
            'fuel_economy' => 'petrol',
            'drivetrain' => 'fwd',
            'exterior_color' => 'Blue',
            'mileage_value' => 50000,
            'mileage_units' => 'km',
            'stock_quantity' => 1,
            'city' => 'Austin',
            'country' => 'USA',
            'is_published' => true,
        ];

        $this->actingAsSuperAdmin()->post(route('admin.autos.store'), $payload)
            ->assertRedirect();

        $auto = Auto::where('title', 'CRUD Test Auto')->firstOrFail();

        $this->actingAsSuperAdmin()->put(route('admin.autos.update', $auto), array_merge($payload, [
            'title' => 'Updated CRUD Auto',
            'base_price' => 24000,
        ]))->assertRedirect();

        $this->assertDatabaseHas('autos', [
            'id' => $auto->id,
            'title' => 'Updated CRUD Auto',
            'engine_type' => 'Gasoline',
            'transmission' => 'Automatic',
            'drivetrain' => 'FWD',
        ]);

        $this->actingAsSuperAdmin()->delete(route('admin.autos.destroy', $auto))
            ->assertRedirect(route('admin.autos.index'));

        $this->assertSoftDeleted('autos', ['id' => $auto->id]);
    }

    public function test_admin_can_create_update_and_soft_delete_classified(): void
    {
        $category = Category::where('is_classified', true)->firstOrFail();
        $type = Type::where('is_classified', true)->firstOrFail();

        $payload = [
            'title' => 'CRUD Test Classified',
            'description' => 'Created by admin classified CRUD test.',
            'category_id' => $category->id,
            'type_id' => $type->id,
            'base_price' => 150,
            'item_condition' => 'used',
            'is_published' => true,
        ];

        $this->actingAsSuperAdmin()->post(route('admin.classifieds.store'), $payload)
            ->assertRedirect();

        $classified = Classified::where('title', 'CRUD Test Classified')->firstOrFail();

        $this->actingAsSuperAdmin()->put(route('admin.classifieds.update', $classified), array_merge($payload, [
            'title' => 'Updated CRUD Classified',
            'base_price' => 175,
        ]))->assertRedirect();

        $this->assertDatabaseHas('classified_ads', [
            'id' => $classified->id,
            'title' => 'Updated CRUD Classified',
            'item_condition' => 5,
        ]);

        $this->actingAsSuperAdmin()->delete(route('admin.classifieds.destroy', $classified))
            ->assertRedirect(route('admin.classifieds.index'));

        $this->assertSoftDeleted('classified_ads', ['id' => $classified->id]);
    }
}
