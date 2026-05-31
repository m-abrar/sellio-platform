<?php

namespace Tests\Feature\Admin;

use App\Models\EmailTemplate;
use App\Models\NewsletterSubscriber;
use App\Models\Property;
use App\Models\PropertyBooking;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Cache;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use Tests\Concerns\InteractsWithAdmin;
use Tests\TestCase;

class AdminExtendedResourcesTest extends TestCase
{
    use InteractsWithAdmin;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seedAdminContext();
    }

    public function test_admin_can_create_update_and_delete_ledger_transaction(): void
    {
        $this->actingAsSuperAdmin()->post(route('admin.transactions.store'), [
            'amount' => 250.50,
            'payment_method' => 'bank_transfer',
            'reference_number' => 'LEDGER-CRUD-001',
            'status' => 'pending',
            'notes' => 'Created by admin transaction CRUD test.',
            'transaction_date' => now()->toDateTimeString(),
        ])->assertRedirect();

        $transaction = Transaction::where('reference_number', 'LEDGER-CRUD-001')->firstOrFail();

        $this->actingAsSuperAdmin()->put(route('admin.transactions.update', $transaction), [
            'amount' => 275.00,
            'payment_method' => 'manual',
            'reference_number' => 'LEDGER-CRUD-001-UPDATED',
            'status' => 'completed',
            'notes' => 'Updated by admin transaction CRUD test.',
            'transaction_date' => now()->toDateTimeString(),
        ])->assertRedirect(route('admin.transactions.index'));

        $this->assertDatabaseHas('ledger_transactions', [
            'id' => $transaction->id,
            'reference_number' => 'LEDGER-CRUD-001-UPDATED',
            'status' => 'completed',
        ]);

        $this->actingAsSuperAdmin()->delete(route('admin.transactions.destroy', $transaction))
            ->assertRedirect(route('admin.transactions.index'));

        $this->assertSoftDeleted('ledger_transactions', ['id' => $transaction->id]);
    }

    public function test_admin_can_update_email_template(): void
    {
        $template = EmailTemplate::create([
            'key' => 'crud_test_template',
            'title' => 'CRUD Test Template',
            'subject' => 'Original Subject',
            'body' => '<p>Original body</p>',
            'is_active' => true,
        ]);

        $this->actingAsSuperAdmin()->put(route('admin.email-templates.update', $template), [
            'subject' => 'Updated Subject Line',
            'body' => '<p>Updated template body for admin test.</p>',
            'is_active' => true,
        ])->assertRedirect(route('admin.email-templates.index'));

        $this->assertDatabaseHas('email_templates', [
            'id' => $template->id,
            'subject' => 'Updated Subject Line',
        ]);
    }

    public function test_admin_can_open_email_template_editor(): void
    {
        $template = EmailTemplate::create([
            'key' => 'editable_template',
            'title' => 'Editable Template',
            'subject' => 'Editable Subject',
            'body' => '<p>Editable body</p>',
            'is_active' => true,
        ]);

        $this->actingAsSuperAdmin()
            ->get(route('admin.email-templates.edit', $template))
            ->assertOk()
            ->assertSee('Editable Subject', false)
            ->assertSee('Email Architect', false);
    }

    public function test_admin_can_create_update_and_delete_property_booking(): void
    {
        $property = Property::firstOrFail();
        $checkIn = now()->addMonths(3)->toDateString();
        $checkOut = now()->addMonths(3)->addDays(4)->toDateString();

        $payload = [
            'property_id' => $property->id,
            'user_id' => $this->admin->id,
            'check_in_date' => $checkIn,
            'check_out_date' => $checkOut,
            'guests' => 2,
            'full_name' => 'CRUD Booking Guest',
            'email' => 'booking-guest@test.test',
            'phone' => '+1 555 0101',
            'status' => PropertyBooking::STATUS_PENDING,
            'message' => 'Created by admin property booking CRUD test.',
        ];

        $this->actingAsSuperAdmin()->post(route('admin.property-bookings.store'), $payload)
            ->assertRedirect();

        $booking = PropertyBooking::where('full_name', 'CRUD Booking Guest')->firstOrFail();

        $this->actingAsSuperAdmin()->put(route('admin.property-bookings.update', $booking), array_merge($payload, [
            'full_name' => 'Updated CRUD Booking Guest',
            'status' => PropertyBooking::STATUS_CONFIRMED,
        ]))->assertRedirect(route('admin.property-bookings.index'));

        $this->assertDatabaseHas('property_bookings', [
            'id' => $booking->id,
            'full_name' => 'Updated CRUD Booking Guest',
            'status' => PropertyBooking::STATUS_CONFIRMED,
        ]);

        $this->actingAsSuperAdmin()->delete(route('admin.property-bookings.destroy', $booking))
            ->assertRedirect(route('admin.property-bookings.index'));

        $this->assertNull(PropertyBooking::find($booking->id));
    }

    public function test_admin_can_update_and_delete_newsletter_subscriber(): void
    {
        $subscriber = NewsletterSubscriber::create([
            'email' => 'newsletter-crud@test.test',
            'source' => 'footer',
            'is_confirmed' => false,
        ]);

        $this->actingAsSuperAdmin()->put(route('admin.newsletter-subscribers.update', $subscriber), [
            'email' => 'newsletter-updated@test.test',
            'is_confirmed' => true,
            'source' => 'landing-page',
        ])->assertRedirect(route('admin.newsletter-subscribers.index'));

        $this->assertDatabaseHas('newsletter_subscribers', [
            'id' => $subscriber->id,
            'email' => 'newsletter-updated@test.test',
        ]);

        $this->actingAsSuperAdmin()->delete(route('admin.newsletter-subscribers.destroy', $subscriber))
            ->assertRedirect(route('admin.newsletter-subscribers.index'));

        $this->assertNull(NewsletterSubscriber::find($subscriber->id));
    }

    public function test_admin_can_update_general_settings_section(): void
    {
        $this->actingAsSuperAdmin()->post(route('admin.settings.update.group', 'general'), [
            'site_name' => 'Sellio QA Platform',
            'site_tagline' => 'Updated QA tagline',
            'default_language' => 'en',
            'timezone' => 'UTC',
            'currency_code' => 'USD',
        ])->assertRedirect();

        $this->assertDatabaseHas('settings', [
            'key' => 'site_name',
            'value' => 'Sellio QA Platform',
        ]);
    }

    public function test_admin_can_upload_general_settings_logo(): void
    {
        $this->actingAsSuperAdmin()->post(route('admin.settings.update.group', 'general'), [
            'site_name' => 'Sellio QA Platform',
            'site_tagline' => 'Updated QA tagline',
            'default_language' => 'en',
            'timezone' => 'UTC',
            'currency_code' => 'USD',
            'site_logo' => UploadedFile::fake()->image('qa-logo.png'),
        ])->assertRedirect();

        $this->assertDatabaseHas('settings', [
            'key' => 'site_logo',
        ]);

        $logoPath = \Illuminate\Support\Facades\DB::table('settings')
            ->where('key', 'site_logo')
            ->value('value');

        $this->assertNotEmpty($logoPath);
    }

    public function test_admin_can_upload_gallery_asset(): void
    {
        $this->actingAsSuperAdmin()->post(route('admin.gallery.store'), [
            'title' => 'CRUD Gallery Asset',
            'image' => UploadedFile::fake()->image('gallery-crud.jpg'),
        ])->assertRedirect();

        $this->assertDatabaseHas('galleries', [
            'title' => 'CRUD Gallery Asset',
        ]);

        $this->assertTrue(
            Media::query()->where('file_name', 'gallery-crud.jpg')->exists()
        );
    }

    public function test_admin_can_replace_gallery_asset(): void
    {
        $this->actingAsSuperAdmin()->post(route('admin.gallery.store'), [
            'title' => 'Replace Target Asset',
            'image' => UploadedFile::fake()->image('replace-before.jpg'),
        ])->assertRedirect();

        $media = Media::query()->where('file_name', 'replace-before.jpg')->firstOrFail();

        $this->actingAsSuperAdmin()->put(route('admin.gallery.update', $media->id), [
            'image' => UploadedFile::fake()->image('replace-after.jpg'),
        ])->assertRedirect();

        $this->assertFalse(Media::query()->where('file_name', 'replace-before.jpg')->exists());
        $this->assertTrue(Media::query()->where('file_name', 'replace-after.jpg')->exists());
    }

    public function test_admin_can_delete_gallery_asset(): void
    {
        $this->actingAsSuperAdmin()->post(route('admin.gallery.store'), [
            'title' => 'Delete Target Asset',
            'image' => UploadedFile::fake()->image('delete-target.jpg'),
        ])->assertRedirect();

        $media = Media::query()->where('file_name', 'delete-target.jpg')->firstOrFail();

        $this->actingAsSuperAdmin()->delete(route('admin.gallery.destroy', $media->id))
            ->assertRedirect();

        $this->assertNull(Media::find($media->id));
    }

    public function test_unified_bookings_index_shows_created_property_booking(): void
    {
        Cache::flush();

        $property = Property::factory()->create(['title' => 'Unified Feed Property XYZ']);
        PropertyBooking::create([
            'user_id' => $this->admin->id,
            'property_id' => $property->id,
            'full_name' => 'Unified Feed Guest',
            'email' => 'unified-feed@test.test',
            'phone' => '+1 555 0202',
            'check_in_date' => now()->addMonths(4)->toDateString(),
            'check_out_date' => now()->addMonths(4)->addDays(2)->toDateString(),
            'guests' => 1,
            'total_price' => 199.00,
            'status' => PropertyBooking::STATUS_PENDING,
        ]);

        $response = $this->actingAsSuperAdmin()->get(route('admin.bookings.index'));
        $response->assertOk();
        $response->assertSee('Unified Feed Property XYZ', false);
    }
}
