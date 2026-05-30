<?php

namespace Tests\Feature\Admin;

use App\Models\Advertisement;
use App\Models\Language;
use App\Models\Testimonial;
use App\Models\Theme;
use App\Models\User;
use App\Models\Withdrawal;
use Tests\Concerns\InteractsWithAdmin;
use Tests\TestCase;

class AdminCmsOperationsTest extends TestCase
{
    use InteractsWithAdmin;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seedAdminContext();
    }

    public function test_admin_can_create_update_and_delete_testimonial(): void
    {
        $payload = [
            'author_name' => 'CRUD Test Author',
            'author_title' => 'CEO',
            'company' => 'Sellio Labs',
            'quote' => 'This platform transformed our marketplace operations.',
            'rating' => 5,
            'status' => Testimonial::STATUS_PUBLISHED,
            'sort_order' => 1,
        ];

        $this->actingAsSuperAdmin()->post(route('admin.testimonials.store'), $payload)
            ->assertRedirect();

        $testimonial = Testimonial::where('author_name', 'CRUD Test Author')->firstOrFail();

        $this->actingAsSuperAdmin()->put(route('admin.testimonials.update', $testimonial), array_merge($payload, [
            'author_name' => 'Updated CRUD Author',
            'quote' => 'Updated testimonial quote for admin CRUD test.',
        ]))->assertRedirect(route('admin.testimonials.index'));

        $this->assertDatabaseHas('testimonials', [
            'id' => $testimonial->id,
            'author_name' => 'Updated CRUD Author',
        ]);

        $this->actingAsSuperAdmin()->delete(route('admin.testimonials.destroy', $testimonial))
            ->assertRedirect(route('admin.testimonials.index'));

        $this->assertSoftDeleted('testimonials', ['id' => $testimonial->id]);
    }

    public function test_admin_can_create_update_and_delete_advertisement(): void
    {
        $payload = [
            'title' => 'CRUD Test Advertisement',
            'radius' => 25,
            'latitude' => 30.2672,
            'longitude' => -97.7431,
            'link' => 'https://example.com/promo',
            'orientations' => ['sidebar'],
            'status' => true,
        ];

        $this->actingAsSuperAdmin()->post(route('admin.advertisements.store'), $payload)
            ->assertRedirect(route('admin.advertisements.index'));

        $advertisement = Advertisement::where('title', 'CRUD Test Advertisement')->firstOrFail();

        $this->actingAsSuperAdmin()->put(route('admin.advertisements.update', $advertisement), array_merge($payload, [
            'title' => 'Updated CRUD Advertisement',
            'radius' => 50,
        ]))->assertRedirect(route('admin.advertisements.index'));

        $this->assertDatabaseHas('advertisements', [
            'id' => $advertisement->id,
            'title' => 'Updated CRUD Advertisement',
            'status' => Advertisement::STATUS_ACTIVE,
        ]);

        $this->actingAsSuperAdmin()->delete(route('admin.advertisements.destroy', $advertisement))
            ->assertRedirect(route('admin.advertisements.index'));

        $this->assertSoftDeleted('advertisements', ['id' => $advertisement->id]);
    }

    public function test_admin_can_create_update_and_delete_language(): void
    {
        $this->actingAsSuperAdmin()->post(route('admin.languages.store'), [
            'name' => 'CRUD Test Language',
            'code' => 'zcr',
            'flag_icon' => 'flag-icon-us',
        ])->assertRedirect(route('admin.languages.index'));

        $language = Language::where('code', 'zcr')->firstOrFail();
        $this->assertFileExists($language->getTranslationFilePath());

        $this->actingAsSuperAdmin()->post(route('admin.languages.update', $language), [
            'name' => 'Updated CRUD Language',
            'code' => 'zcr',
            'flag_icon' => 'flag-icon-gb',
        ])->assertRedirect(route('admin.languages.index'));

        $this->assertDatabaseHas('languages', [
            'id' => $language->id,
            'name' => 'Updated CRUD Language',
        ]);

        $this->actingAsSuperAdmin()->delete(route('admin.languages.destroy', $language))
            ->assertRedirect(route('admin.languages.index'));

        $this->assertNull(Language::find($language->id));
        $this->assertFileDoesNotExist(base_path('lang/zcr.json'));
    }

    public function test_admin_can_update_contact_settings_section(): void
    {
        $this->actingAsSuperAdmin()->post(route('admin.settings.update.group', 'contact'), [
            'email_contact' => 'billing-updated@test.test',
            'phone_contact' => '+1 555 0100',
            'address' => '123 Admin Settings Street',
        ])->assertRedirect();

        $this->assertDatabaseHas('settings', [
            'key' => 'email_contact',
            'value' => 'billing-updated@test.test',
        ]);
    }

    public function test_admin_can_update_theme_configuration(): void
    {
        $theme = Theme::firstOrFail();

        $this->actingAsSuperAdmin()->post(route('admin.themes.update', $theme), [
            'vertical' => 'unifieds',
            'variables' => ['primary_color' => '#112233'],
            'config' => ['layout' => 'wide'],
        ])->assertRedirect(route('admin.themes.index'));

        $theme->refresh();

        $this->assertSame('unifieds', $theme->vertical);
        $this->assertSame('#112233', $theme->variables['primary_color'] ?? null);
    }

    public function test_admin_can_approve_and_reject_pending_withdrawal(): void
    {
        $partner = User::where('email', 'partner@test.test')->firstOrFail();

        $pending = Withdrawal::factory()->pending()->create([
            'user_id' => $partner->id,
            'amount' => 5000,
        ]);
        $rejectTarget = Withdrawal::factory()->pending()->create([
            'user_id' => $partner->id,
            'amount' => 7500,
        ]);

        $this->actingAsSuperAdmin()->post(route('admin.withdrawals.approve', $pending))
            ->assertRedirect();

        $this->assertDatabaseHas('withdrawals', [
            'id' => $pending->id,
            'status' => Withdrawal::STATUS_APPROVED,
        ]);

        $this->actingAsSuperAdmin()->post(route('admin.withdrawals.reject', $rejectTarget), [
            'admin_note' => 'Rejected by admin CRUD test.',
        ])->assertRedirect();

        $this->assertDatabaseHas('withdrawals', [
            'id' => $rejectTarget->id,
            'status' => Withdrawal::STATUS_REJECTED,
            'admin_note' => 'Rejected by admin CRUD test.',
        ]);
    }
}
