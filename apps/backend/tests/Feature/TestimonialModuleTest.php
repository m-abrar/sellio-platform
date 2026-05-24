<?php

namespace Tests\Feature;

use App\Models\Testimonial;
use App\Models\Theme;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class TestimonialModuleTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_create_update_and_delete_testimonial_with_theme_priority(): void
    {
        $admin = User::factory()->create();
        $role = Role::create(['name' => 'admin']);
        $permission = Permission::create(['name' => 'manage-marketing']);
        $role->givePermissionTo($permission);
        $admin->assignRole($role);

        $theme = Theme::create([
            'theme_key' => 'services_corporate',
            'vertical' => 'services',
            'title' => 'Services Corporate',
            'is_active' => true,
        ]);

        $response = $this->actingAs($admin)->post(route('admin.testimonials.store'), [
            'author_name' => 'Avery Stone',
            'author_title' => 'COO',
            'company' => 'Northwind',
            'quote' => 'Sellio gave our team a cleaner operating rhythm.',
            'rating' => 5,
            'status' => Testimonial::STATUS_PUBLISHED,
            'sort_order' => 7,
            'themes' => [
                $theme->id => [
                    'enabled' => 1,
                    'priority' => 2,
                    'is_featured' => 1,
                ],
            ],
        ]);

        $testimonial = Testimonial::firstOrFail();
        $response->assertRedirect(route('admin.testimonials.edit', $testimonial));
        $this->assertDatabaseHas('testimonials', [
            'author_name' => 'Avery Stone',
            'status' => Testimonial::STATUS_PUBLISHED,
        ]);
        $this->assertDatabaseHas('testimonial_theme', [
            'testimonial_id' => $testimonial->id,
            'theme_id' => $theme->id,
            'priority' => 2,
            'is_featured' => true,
        ]);

        $this->actingAs($admin)->patch(route('admin.testimonials.update', $testimonial), [
            'author_name' => 'Avery Stone',
            'author_title' => 'COO',
            'company' => 'Northwind',
            'quote' => 'Updated quote.',
            'rating' => 4,
            'status' => Testimonial::STATUS_DRAFT,
            'sort_order' => 3,
        ])->assertSessionHasNoErrors()
            ->assertRedirect(route('admin.testimonials.index'));

        $this->assertDatabaseHas('testimonials', [
            'id' => $testimonial->id,
            'quote' => 'Updated quote.',
            'status' => Testimonial::STATUS_DRAFT,
        ]);
        $this->assertDatabaseMissing('testimonial_theme', [
            'testimonial_id' => $testimonial->id,
            'theme_id' => $theme->id,
        ]);

        $this->actingAs($admin)->delete(route('admin.testimonials.destroy', $testimonial))
            ->assertRedirect(route('admin.testimonials.index'));

        $this->assertSoftDeleted('testimonials', ['id' => $testimonial->id]);
    }

    public function test_public_api_returns_published_theme_specific_records_before_global_records(): void
    {
        $theme = Theme::create([
            'theme_key' => 'services_corporate',
            'vertical' => 'services',
            'title' => 'Services Corporate',
            'is_active' => true,
        ]);

        $global = Testimonial::create([
            'author_name' => 'Global Customer',
            'quote' => 'Global quote.',
            'status' => Testimonial::STATUS_PUBLISHED,
            'sort_order' => 1,
        ]);

        $themeSpecific = Testimonial::create([
            'author_name' => 'Theme Customer',
            'quote' => 'Theme quote.',
            'status' => Testimonial::STATUS_PUBLISHED,
            'sort_order' => 99,
        ]);
        $themeSpecific->themes()->attach($theme->id, ['priority' => 0, 'is_featured' => true]);

        Testimonial::create([
            'author_name' => 'Draft Customer',
            'quote' => 'Hidden quote.',
            'status' => Testimonial::STATUS_DRAFT,
            'sort_order' => 0,
        ]);

        $response = $this->getJson('/api/v1/testimonials?theme_key=services_corporate&limit=6');

        $response->assertOk();
        $this->assertSame(
            [$themeSpecific->id, $global->id],
            collect($response->json('data'))->pluck('id')->all()
        );
        $this->assertTrue($response->json('data.0.is_featured'));
        $this->assertSame(0, $response->json('data.0.theme_priority'));
    }

    public function test_public_api_returns_global_records_for_invalid_theme_key(): void
    {
        $global = Testimonial::create([
            'author_name' => 'Global Customer',
            'quote' => 'Global quote.',
            'status' => Testimonial::STATUS_PUBLISHED,
            'sort_order' => 1,
        ]);

        $theme = Theme::create([
            'theme_key' => 'services_corporate',
            'vertical' => 'services',
            'title' => 'Services Corporate',
            'is_active' => true,
        ]);

        $assigned = Testimonial::create([
            'author_name' => 'Assigned Customer',
            'quote' => 'Assigned quote.',
            'status' => Testimonial::STATUS_PUBLISHED,
            'sort_order' => 0,
        ]);
        $assigned->themes()->attach($theme->id, ['priority' => 0]);

        $response = $this->getJson('/api/v1/testimonials?theme_key=missing_theme');

        $response->assertOk();
        $this->assertSame([$global->id], collect($response->json('data'))->pluck('id')->all());
    }
}
