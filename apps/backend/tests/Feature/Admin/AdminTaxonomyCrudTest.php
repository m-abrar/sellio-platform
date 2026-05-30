<?php

namespace Tests\Feature\Admin;

use App\Models\Brand;
use App\Models\Location;
use App\Models\Tag;
use App\Models\Type;
use Tests\Concerns\InteractsWithAdmin;
use Tests\TestCase;

class AdminTaxonomyCrudTest extends TestCase
{
    use InteractsWithAdmin;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seedAdminContext();
    }

    public function test_admin_can_manage_tags(): void
    {
        $this->actingAsSuperAdmin()->post(route('admin.tags.store'), [
            'title' => 'Admin Test Tag',
            'slug' => 'admin-test-tag',
            'is_published' => true,
            'is_product' => true,
        ])->assertRedirect();

        $tag = Tag::where('slug', 'admin-test-tag')->firstOrFail();

        $this->actingAsSuperAdmin()->put(route('admin.tags.update', $tag), [
            'title' => 'Updated Admin Tag',
            'slug' => 'admin-test-tag',
            'is_published' => true,
            'is_product' => true,
        ])->assertRedirect(route('admin.tags.index'));

        $this->assertDatabaseHas('tags', ['id' => $tag->id, 'title' => 'Updated Admin Tag']);

        $this->actingAsSuperAdmin()->delete(route('admin.tags.destroy', $tag))
            ->assertRedirect(route('admin.tags.index'));

        $this->assertNull(Tag::find($tag->id));
    }

    public function test_admin_can_manage_types(): void
    {
        $this->actingAsSuperAdmin()->post(route('admin.types.store'), [
            'title' => 'Admin Test Type',
            'slug' => 'admin-test-type',
            'is_published' => true,
            'is_auto' => true,
        ])->assertRedirect();

        $type = Type::where('slug', 'admin-test-type')->firstOrFail();

        $this->actingAsSuperAdmin()->put(route('admin.types.update', $type), [
            'title' => 'Updated Admin Type',
            'slug' => 'admin-test-type',
            'is_published' => true,
            'is_auto' => true,
        ])->assertRedirect(route('admin.types.index'));

        $this->assertDatabaseHas('types', ['id' => $type->id, 'title' => 'Updated Admin Type']);

        $this->actingAsSuperAdmin()->delete(route('admin.types.destroy', $type))
            ->assertRedirect(route('admin.types.index'));

        $this->assertNull(Type::find($type->id));
    }

    public function test_admin_can_manage_brands(): void
    {
        $this->actingAsSuperAdmin()->post(route('admin.brands.store'), [
            'title' => 'Admin Test Brand',
            'slug' => 'admin-test-brand',
            'is_published' => true,
            'is_product' => true,
        ])->assertRedirect();

        $brand = Brand::where('slug', 'admin-test-brand')->firstOrFail();

        $this->actingAsSuperAdmin()->put(route('admin.brands.update', $brand), [
            'title' => 'Updated Admin Brand',
            'slug' => 'admin-test-brand',
            'is_published' => true,
            'is_product' => true,
        ])->assertRedirect(route('admin.brands.index'));

        $this->assertDatabaseHas('brands', ['id' => $brand->id, 'title' => 'Updated Admin Brand']);

        $this->actingAsSuperAdmin()->delete(route('admin.brands.destroy', $brand))
            ->assertRedirect(route('admin.brands.index'));

        $this->assertNull(Brand::find($brand->id));
    }

    public function test_admin_can_manage_locations(): void
    {
        $this->actingAsSuperAdmin()->post(route('admin.locations.store'), [
            'title' => 'Admin Test Location',
            'slug' => 'admin-test-location',
            'country' => 'USA',
            'is_published' => true,
            'is_property' => true,
        ])->assertRedirect();

        $location = Location::where('slug', 'admin-test-location')->firstOrFail();

        $this->actingAsSuperAdmin()->put(route('admin.locations.update', $location), [
            'title' => 'Updated Admin Location',
            'slug' => 'admin-test-location',
            'country' => 'USA',
            'is_published' => true,
            'is_property' => true,
        ])->assertRedirect(route('admin.locations.index'));

        $this->assertDatabaseHas('locations', ['id' => $location->id, 'title' => 'Updated Admin Location']);

        $this->actingAsSuperAdmin()->delete(route('admin.locations.destroy', $location))
            ->assertRedirect(route('admin.locations.index'));

        $this->assertNull(Location::find($location->id));
    }
}
