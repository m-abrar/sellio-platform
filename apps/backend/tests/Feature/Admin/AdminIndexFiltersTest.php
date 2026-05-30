<?php

namespace Tests\Feature\Admin;

use App\Models\Auto;
use App\Models\Category;
use App\Models\Classified;
use App\Models\Event;
use App\Models\Gallery;
use App\Models\JobListing;
use App\Models\NewsletterSubscriber;
use App\Models\Order;
use App\Models\Payment;
use App\Models\Plan;
use App\Models\Product;
use App\Models\Property;
use App\Models\PropertyBooking;
use App\Models\Service;
use App\Models\Subscription;
use App\Models\Testimonial;
use App\Models\Ticket;
use App\Models\Transaction;
use App\Models\Type;
use App\Models\User;
use App\Models\Withdrawal;
use Illuminate\Http\UploadedFile;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use Tests\Concerns\InteractsWithAdmin;
use Tests\TestCase;

class AdminIndexFiltersTest extends TestCase
{
    use InteractsWithAdmin;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seedAdminContext();
    }

    public function test_product_index_filters_by_title_and_publish_status(): void
    {
        Product::factory()->create(['title' => 'Alpha Filter Product', 'is_published' => true]);
        Product::factory()->create(['title' => 'Beta Filter Product', 'is_published' => false]);

        $titleResponse = $this->actingAsSuperAdmin()->get(route('admin.products.index', ['title' => 'Alpha Filter']));
        $titleResponse->assertOk();
        $titleResponse->assertSee('Alpha Filter Product', false);
        $titleResponse->assertDontSee('Beta Filter Product', false);

        $draftResponse = $this->actingAsSuperAdmin()->get(route('admin.products.index', ['status' => 0]));
        $draftResponse->assertOk();
        $draftResponse->assertSee('Beta Filter Product', false);
        $draftResponse->assertDontSee('Alpha Filter Product', false);
    }

    public function test_product_pagination_preserves_title_filter(): void
    {
        for ($i = 1; $i <= 16; $i++) {
            Product::factory()->create([
                'title' => 'Paginate Product ' . str_pad((string) $i, 2, '0', STR_PAD_LEFT),
            ]);
        }

        $pageOne = $this->actingAsSuperAdmin()->get(route('admin.products.index', ['title' => 'Paginate Product']));
        $pageOne->assertOk();
        $pageOne->assertSee('Paginate Product 16', false);
        $pageOne->assertDontSee('Paginate Product 01', false);

        $pageTwo = $this->actingAsSuperAdmin()->get(route('admin.products.index', [
            'title' => 'Paginate Product',
            'page' => 2,
        ]));
        $pageTwo->assertOk();
        $pageTwo->assertSee('Paginate Product 01', false);

        $paginationHtml = html_entity_decode($pageOne->getContent());
        $this->assertMatchesRegularExpression('/title=Paginate(\+|%20)Product/', $paginationHtml);
        $pageOne->assertSee('page=2', false);
    }

    public function test_service_index_filters_by_title(): void
    {
        Service::factory()->create(['title' => 'Unique Plumbing Service']);
        Service::factory()->create(['title' => 'Unique Electrical Service']);

        $response = $this->actingAsSuperAdmin()->get(route('admin.services.index', ['title' => 'Plumbing']));
        $response->assertOk();
        $response->assertSee('Unique Plumbing Service', false);
        $response->assertDontSee('Unique Electrical Service', false);
    }

    public function test_ticket_index_filters_by_status_and_search(): void
    {
        Ticket::create([
            'user_id' => $this->admin->id,
            'title' => 'Open Billing Issue',
            'description' => 'Invoice mismatch.',
            'status' => Ticket::STATUS_OPEN,
            'priority' => Ticket::PRIORITY_MEDIUM,
        ]);
        Ticket::create([
            'user_id' => $this->admin->id,
            'title' => 'Resolved Login Issue',
            'description' => 'Password reset completed.',
            'status' => Ticket::STATUS_RESOLVED,
            'priority' => Ticket::PRIORITY_LOW,
        ]);

        $statusResponse = $this->actingAsSuperAdmin()->get(route('admin.tickets.index', ['status' => Ticket::STATUS_OPEN]));
        $statusResponse->assertOk();
        $statusResponse->assertSee('Open Billing Issue', false);
        $statusResponse->assertDontSee('Resolved Login Issue', false);

        $searchResponse = $this->actingAsSuperAdmin()->get(route('admin.tickets.index', [
            'status' => 'all',
            'search' => 'Billing',
        ]));
        $searchResponse->assertOk();
        $searchResponse->assertSee('Open Billing Issue', false);
        $searchResponse->assertDontSee('Resolved Login Issue', false);
    }

    public function test_category_search_returns_empty_state_for_no_matches(): void
    {
        $response = $this->actingAsSuperAdmin()->get(route('admin.categories.index', [
            'search' => 'NoCategoryMatchXYZ999',
        ]));

        $response->assertOk();
        $response->assertDontSee('Test Category', false);
    }

    public function test_property_index_filters_by_name(): void
    {
        Property::factory()->create(['title' => 'Alpha Filter Property']);
        Property::factory()->create(['title' => 'Beta Filter Property']);

        $response = $this->actingAsSuperAdmin()->get(route('admin.properties.index', [
            'name' => 'Alpha Filter',
        ]));

        $response->assertOk();
        $response->assertSee('Alpha Filter Property', false);
        $response->assertDontSee('Beta Filter Property', false);
    }

    public function test_order_index_filters_by_order_number_and_status(): void
    {
        Order::factory()->create([
            'order_number' => 'ORD-FILTER-ALPHA-001',
            'status' => 'pending',
            'payment_status' => 'unpaid',
        ]);
        Order::factory()->create([
            'order_number' => 'ORD-FILTER-BETA-002',
            'status' => 'delivered',
            'payment_status' => 'paid',
        ]);

        $numberResponse = $this->actingAsSuperAdmin()->get(route('admin.product-orders.index', [
            'order_number' => 'FILTER-ALPHA',
        ]));
        $numberResponse->assertOk();
        $numberResponse->assertSee('ORD-FILTER-ALPHA-001', false);
        $numberResponse->assertDontSee('ORD-FILTER-BETA-002', false);

        $statusResponse = $this->actingAsSuperAdmin()->get(route('admin.product-orders.index', [
            'status' => 'pending',
        ]));
        $statusResponse->assertOk();
        $statusResponse->assertSee('ORD-FILTER-ALPHA-001', false);
        $statusResponse->assertDontSee('ORD-FILTER-BETA-002', false);
    }

    public function test_subscription_index_filters_by_user_name(): void
    {
        $user = User::factory()->create([
            'name' => 'FilterSubUser Alpha',
            'email' => 'filtersub-alpha@test.test',
        ]);
        $plan = Plan::firstOrFail();

        Subscription::create([
            'user_id' => $user->id,
            'plan_id' => $plan->id,
            'title' => 'Filter Alpha Subscription',
            'status' => Subscription::STATUS_ACTIVE,
            'starts_at' => now()->subDay(),
            'ends_at' => now()->addMonth(),
        ]);

        $response = $this->actingAsSuperAdmin()->get(route('admin.subscriptions.index', [
            'user' => 'FilterSubUser Alpha',
        ]));

        $response->assertOk();
        $response->assertSee('FilterSubUser Alpha', false);
        $response->assertSee('filtersub-alpha@test.test', false);
        $response->assertSee('1 ACTIVE SEATS', false);
    }

    public function test_payment_index_filters_by_transaction_search(): void
    {
        $subscription = Subscription::firstOrFail();

        Payment::create([
            'user_id' => $this->admin->id,
            'payable_id' => $subscription->id,
            'payable_type' => Subscription::class,
            'amount' => 12.34,
            'currency' => 'USD',
            'payment_method' => 'manual',
            'status' => 'completed',
            'transaction_id' => 'TXN-ALPHA-UNIQUE-001',
        ]);
        Payment::create([
            'user_id' => $this->admin->id,
            'payable_id' => $subscription->id,
            'payable_type' => Subscription::class,
            'amount' => 98.76,
            'currency' => 'USD',
            'payment_method' => 'manual',
            'status' => 'completed',
            'transaction_id' => 'TXN-BETA-UNIQUE-002',
        ]);

        $response = $this->actingAsSuperAdmin()->get(route('admin.payments.index', [
            'search' => 'ALPHA-UNIQUE',
        ]));

        $response->assertOk();
        $response->assertSee('12.34', false);
        $response->assertDontSee('98.76', false);
    }

    public function test_job_index_filters_by_title(): void
    {
        JobListing::factory()->create(['title' => 'Alpha Filter Job Listing']);
        JobListing::factory()->create(['title' => 'Beta Filter Job Listing']);

        $response = $this->actingAsSuperAdmin()->get(route('admin.jobs.index', ['title' => 'Alpha Filter']));
        $response->assertOk();
        $response->assertSee('Alpha Filter Job Listing', false);
        $response->assertDontSee('Beta Filter Job Listing', false);
    }

    public function test_event_index_filters_by_title(): void
    {
        Event::factory()->create(['title' => 'Alpha Filter Event']);
        Event::factory()->create(['title' => 'Beta Filter Event']);

        $response = $this->actingAsSuperAdmin()->get(route('admin.events.index', ['title' => 'Alpha Filter']));
        $response->assertOk();
        $response->assertSee('Alpha Filter Event', false);
        $response->assertDontSee('Beta Filter Event', false);
    }

    public function test_auto_index_filters_by_title(): void
    {
        Auto::factory()->create(['title' => 'Alpha Filter Auto']);
        Auto::factory()->create(['title' => 'Beta Filter Auto']);

        $response = $this->actingAsSuperAdmin()->get(route('admin.autos.index', ['title' => 'Alpha Filter']));
        $response->assertOk();
        $response->assertSee('Alpha Filter Auto', false);
        $response->assertDontSee('Beta Filter Auto', false);
    }

    public function test_classified_index_filters_by_title(): void
    {
        Classified::factory()->create([
            'title' => 'Alpha Filter Classified',
            'type_id' => Type::where('is_classified', true)->value('id'),
        ]);
        Classified::factory()->create([
            'title' => 'Beta Filter Classified',
            'type_id' => Type::where('is_classified', true)->value('id'),
        ]);

        $response = $this->actingAsSuperAdmin()->get(route('admin.classifieds.index', ['title' => 'Alpha Filter']));
        $response->assertOk();
        $response->assertSee('Alpha Filter Classified', false);
        $response->assertDontSee('Beta Filter Classified', false);
    }

    public function test_plan_index_filters_by_search_and_billing_period(): void
    {
        Plan::create([
            'title' => 'Alpha Filter Plan',
            'slug' => 'alpha-filter-plan',
            'price' => 9.99,
            'billing_period' => 'monthly',
            'listing_duration' => 30,
            'analytics_access' => 'basic',
            'is_active' => true,
        ]);
        Plan::create([
            'title' => 'Beta Filter Plan',
            'slug' => 'beta-filter-plan',
            'price' => 99.99,
            'billing_period' => 'annually',
            'listing_duration' => 365,
            'analytics_access' => 'advanced',
            'is_active' => true,
        ]);

        $searchResponse = $this->actingAsSuperAdmin()->get(route('admin.plans.index', [
            'search' => 'Alpha Filter',
        ]));
        $searchResponse->assertOk();
        $searchResponse->assertSee('Alpha Filter Plan', false);
        $searchResponse->assertDontSee('Beta Filter Plan', false);

        $periodResponse = $this->actingAsSuperAdmin()->get(route('admin.plans.index', [
            'billing_period' => 'annually',
        ]));
        $periodResponse->assertOk();
        $periodResponse->assertSee('Beta Filter Plan', false);
        $periodResponse->assertDontSee('Alpha Filter Plan', false);
    }

    public function test_testimonial_index_filters_by_status(): void
    {
        Testimonial::create([
            'author_name' => 'Published Filter Author',
            'quote' => 'Published testimonial for filter test.',
            'status' => Testimonial::STATUS_PUBLISHED,
        ]);
        Testimonial::create([
            'author_name' => 'Draft Filter Author',
            'quote' => 'Draft testimonial for filter test.',
            'status' => Testimonial::STATUS_DRAFT,
        ]);

        $response = $this->actingAsSuperAdmin()->get(route('admin.testimonials.index', [
            'status' => Testimonial::STATUS_PUBLISHED,
        ]));
        $response->assertOk();
        $response->assertSee('Published Filter Author', false);
        $response->assertDontSee('Draft Filter Author', false);
    }

    public function test_withdrawal_index_filters_by_status(): void
    {
        $partner = User::where('email', 'partner@test.test')->firstOrFail();

        Withdrawal::factory()->pending()->create([
            'user_id' => $partner->id,
            'amount' => 4000,
        ]);
        Withdrawal::factory()->create([
            'user_id' => $partner->id,
            'amount' => 6000,
            'status' => Withdrawal::STATUS_APPROVED,
            'approved_at' => now(),
        ]);

        $response = $this->actingAsSuperAdmin()->get(route('admin.withdrawals.index', [
            'status' => Withdrawal::STATUS_PENDING,
        ]));
        $response->assertOk();
        $response->assertSee('$40.00', false);
        $response->assertDontSee('$60.00', false);
    }

    public function test_user_index_filters_by_name_or_email(): void
    {
        User::factory()->create([
            'name' => 'FilterUser Alpha',
            'email' => 'filteruser-alpha@test.test',
        ]);

        $response = $this->actingAsSuperAdmin()->get(route('admin.users.index', [
            'search' => 'FilterUser Alpha',
        ]));

        $response->assertOk();
        $response->assertSee('FilterUser Alpha', false);
        $response->assertSee('filteruser-alpha@test.test', false);
        $response->assertDontSee('partner@test.test', false);
    }

    public function test_transaction_index_filters_by_reference_number(): void
    {
        Transaction::create([
            'user_id' => $this->admin->id,
            'amount' => 88.00,
            'status' => 'completed',
            'reference_number' => 'TXN-FILTER-ALPHA-001',
        ]);
        Transaction::create([
            'user_id' => $this->admin->id,
            'amount' => 99.00,
            'status' => 'completed',
            'reference_number' => 'TXN-FILTER-BETA-002',
        ]);

        $response = $this->actingAsSuperAdmin()->get(route('admin.transactions.index', [
            'reference_number' => 'FILTER-ALPHA',
        ]));

        $response->assertOk();
        $response->assertSee('TXN-FILTER-ALPHA-001', false);
        $response->assertDontSee('TXN-FILTER-BETA-002', false);
    }

    public function test_property_booking_index_filters_by_property(): void
    {
        $propertyA = Property::factory()->create(['title' => 'Filter Property Alpha']);
        $propertyB = Property::factory()->create(['title' => 'Filter Property Beta']);

        PropertyBooking::create([
            'user_id' => $this->admin->id,
            'property_id' => $propertyA->id,
            'full_name' => 'Alpha Property Guest',
            'email' => 'alpha-property-guest@test.test',
            'phone' => '+1 555 0303',
            'check_in_date' => now()->addMonths(5)->toDateString(),
            'check_out_date' => now()->addMonths(5)->addDays(2)->toDateString(),
            'guests' => 2,
            'total_price' => 150.00,
            'status' => PropertyBooking::STATUS_PENDING,
        ]);
        PropertyBooking::create([
            'user_id' => $this->admin->id,
            'property_id' => $propertyB->id,
            'full_name' => 'Beta Property Guest',
            'email' => 'beta-property-guest@test.test',
            'phone' => '+1 555 0404',
            'check_in_date' => now()->addMonths(6)->toDateString(),
            'check_out_date' => now()->addMonths(6)->addDays(2)->toDateString(),
            'guests' => 2,
            'total_price' => 175.00,
            'status' => PropertyBooking::STATUS_PENDING,
        ]);

        $response = $this->actingAsSuperAdmin()->get(route('admin.property-bookings.index', [
            'property' => $propertyA->id,
        ]));

        $response->assertOk();
        $response->assertSee('Alpha Property Guest', false);
        $response->assertDontSee('Beta Property Guest', false);
    }

    public function test_gallery_index_filters_by_filename_search(): void
    {
        $this->actingAsSuperAdmin()->post(route('admin.gallery.store'), [
            'title' => 'Filter Gallery Alpha',
            'image' => UploadedFile::fake()->image('gallery-filter-alpha.jpg'),
        ])->assertRedirect();

        $this->actingAsSuperAdmin()->post(route('admin.gallery.store'), [
            'title' => 'Filter Gallery Beta',
            'image' => UploadedFile::fake()->image('gallery-filter-beta.jpg'),
        ])->assertRedirect();

        $response = $this->actingAsSuperAdmin()->get(route('admin.gallery.index', [
            'search' => 'gallery-filter-alpha',
        ]));

        $response->assertOk();
        $response->assertSee('gallery-filter-alpha.jpg', false);
        $response->assertDontSee('gallery-filter-beta.jpg', false);
    }

    public function test_gallery_index_filters_by_source(): void
    {
        $this->actingAsSuperAdmin()->post(route('admin.gallery.store'), [
            'title' => 'Source Filter Asset',
            'image' => UploadedFile::fake()->image('source-filter-gallery.jpg'),
        ])->assertRedirect();

        $this->assertTrue(
            Media::query()->where('file_name', 'source-filter-gallery.jpg')->exists()
        );

        $response = $this->actingAsSuperAdmin()->get(route('admin.gallery.index', [
            'source' => 'Gallery',
        ]));

        $response->assertOk();
        $response->assertSee('source-filter-gallery.jpg', false);
    }

    public function test_newsletter_subscriber_index_filters_by_email_source_and_confirmation(): void
    {
        NewsletterSubscriber::create([
            'email' => 'filter-alpha-newsletter@test.test',
            'source' => 'footer',
            'is_confirmed' => true,
        ]);
        NewsletterSubscriber::create([
            'email' => 'filter-beta-newsletter@test.test',
            'source' => 'landing-page',
            'is_confirmed' => false,
        ]);

        $emailResponse = $this->actingAsSuperAdmin()->get(route('admin.newsletter-subscribers.index', [
            'search' => 'filter-alpha-newsletter',
        ]));
        $emailResponse->assertOk();
        $emailResponse->assertSee('filter-alpha-newsletter@test.test', false);
        $emailResponse->assertDontSee('filter-beta-newsletter@test.test', false);

        $sourceResponse = $this->actingAsSuperAdmin()->get(route('admin.newsletter-subscribers.index', [
            'source' => 'landing-page',
        ]));
        $sourceResponse->assertOk();
        $sourceResponse->assertSee('filter-beta-newsletter@test.test', false);
        $sourceResponse->assertDontSee('filter-alpha-newsletter@test.test', false);

        $confirmedResponse = $this->actingAsSuperAdmin()->get(route('admin.newsletter-subscribers.index', [
            'confirmed' => '1',
        ]));
        $confirmedResponse->assertOk();
        $confirmedResponse->assertSee('filter-alpha-newsletter@test.test', false);
        $confirmedResponse->assertDontSee('filter-beta-newsletter@test.test', false);
    }

    public function test_gallery_pagination_preserves_search_filter(): void
    {
        for ($i = 1; $i <= 25; $i++) {
            $gallery = Gallery::create([
                'title' => 'Paginate Gallery ' . $i,
                'slug' => 'paginate-gallery-' . $i,
            ]);

            $gallery->addMedia(UploadedFile::fake()->image("paginate-gallery-{$i}.jpg"))
                ->usingFileName('paginate-gallery-filter-' . str_pad((string) $i, 2, '0', STR_PAD_LEFT) . '.jpg')
                ->toMediaCollection('images');
        }

        $pageOne = $this->actingAsSuperAdmin()->get(route('admin.gallery.index', [
            'search' => 'paginate-gallery-filter',
        ]));
        $pageOne->assertOk();

        preg_match_all(
            '/<h6[^>]+title="(paginate-gallery-filter-\d{2}\.jpg)"[^>]*>\1<\/h6>/',
            html_entity_decode($pageOne->getContent()),
            $pageOneMatches
        );
        $this->assertCount(24, $pageOneMatches[1]);
        $pageOne->assertSee('to <span class="text-dark">24</span> of <span class="text-dark">25</span>', false);
        $pageOne->assertSee('page=2', false);

        $pageTwo = $this->actingAsSuperAdmin()->get(route('admin.gallery.index', [
            'search' => 'paginate-gallery-filter',
            'page' => 2,
        ]));
        $pageTwo->assertOk();

        preg_match_all(
            '/<h6[^>]+title="(paginate-gallery-filter-\d{2}\.jpg)"[^>]*>\1<\/h6>/',
            html_entity_decode($pageTwo->getContent()),
            $pageTwoMatches
        );
        $this->assertCount(1, $pageTwoMatches[1]);
        $this->assertEmpty(array_intersect($pageOneMatches[1], $pageTwoMatches[1]));
        $pageTwo->assertSee('to <span class="text-dark">25</span> of <span class="text-dark">25</span>', false);

        $paginationHtml = html_entity_decode($pageOne->getContent());
        $this->assertMatchesRegularExpression('/search=paginate-gallery-filter/', $paginationHtml);
    }

    public function test_newsletter_subscriber_pagination_preserves_search_filter(): void
    {
        for ($i = 1; $i <= 16; $i++) {
            NewsletterSubscriber::create([
                'email' => 'paginate-newsletter-' . str_pad((string) $i, 2, '0', STR_PAD_LEFT) . '@test.test',
                'source' => 'footer',
                'is_confirmed' => true,
            ]);
        }

        NewsletterSubscriber::create([
            'email' => 'other-newsletter@test.test',
            'source' => 'popup',
            'is_confirmed' => true,
        ]);

        $pageOne = $this->actingAsSuperAdmin()->get(route('admin.newsletter-subscribers.index', [
            'search' => 'paginate-newsletter',
        ]));
        $pageOne->assertOk();
        $pageOne->assertSee('paginate-newsletter-01@test.test', false);
        $pageOne->assertSee('paginate-newsletter-15@test.test', false);
        $pageOne->assertDontSee('paginate-newsletter-16@test.test', false);
        $pageOne->assertDontSee('other-newsletter@test.test', false);

        $pageTwo = $this->actingAsSuperAdmin()->get(route('admin.newsletter-subscribers.index', [
            'search' => 'paginate-newsletter',
            'page' => 2,
        ]));
        $pageTwo->assertOk();
        $pageTwo->assertSee('paginate-newsletter-16@test.test', false);
        $pageTwo->assertDontSee('paginate-newsletter-01@test.test', false);
    }
}
