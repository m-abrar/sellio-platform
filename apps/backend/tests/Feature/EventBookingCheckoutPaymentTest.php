<?php

namespace Tests\Feature;

use App\Contracts\PaymentGatewayService;
use App\Models\Event;
use App\Models\EventBooking;
use App\Models\EventOccurrence;
use App\Models\EventOccurrenceTicket;
use App\Models\EventTicketType;
use App\Models\Payment;
use App\Models\PaymentGateway;
use App\Models\Setting;
use App\Models\User;
use App\Services\GatewayManager;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Mockery;
use Tests\TestCase;

class EventBookingCheckoutPaymentTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        Setting::set('built_in_website_status', 'active');
        Setting::set('is_section.events', '1');
        Cache::forget('settings_all');
    }

    public function test_event_checkout_uses_stripe_elements_when_gateway_is_configured(): void
    {
        [$user, $event, $booking] = $this->createPendingEventBooking();
        $this->createStripeGateway(publishableKey: 'pk_test_event_checkout');

        $this->actingAs($user)
            ->get(route('events.tickets.booking.checkout', [$event->slug, $booking->id]))
            ->assertOk()
            ->assertSee('https://js.stripe.com/v3/', false)
            ->assertSee('pk_test_event_checkout', false)
            ->assertSee('data-stripe-card-element', false)
            ->assertSee('data-stripe-payment-token', false);
    }

    public function test_event_stripe_payment_confirms_booking_and_records_payment(): void
    {
        [$user, $event, $booking] = $this->createPendingEventBooking(totalPrice: 100);
        $this->createStripeGateway();

        $fakeGateway = Mockery::mock(PaymentGatewayService::class);
        $fakeGateway->shouldReceive('charge')
            ->once()
            ->withArgs(function (float $amount, string $token, string $returnUrl, array $metadata) use ($booking) {
                return $amount === 105.0
                    && $token === 'pm_card_visa'
                    && str_contains($returnUrl, '/booking/' . $booking->id . '/payment/confirm/stripe')
                    && ($metadata['purpose'] ?? null) === 'event_booking'
                    && ($metadata['event_booking_id'] ?? null) === (string) $booking->id;
            })
            ->andReturn([
                'status' => 'successful',
                'reference' => 'pi_event_booking_success',
                'message' => 'Payment processed successfully via Stripe.',
            ]);

        $this->mock(GatewayManager::class, function ($mock) use ($fakeGateway) {
            $mock->shouldReceive('resolve')->once()->andReturn($fakeGateway);
        });

        $this->actingAs($user)
            ->post(route('events.tickets.booking.processPayment', [$event->slug, $booking->id]), [
                'payment_method' => 'stripe',
                'payment_token' => 'pm_card_visa',
            ])
            ->assertRedirect(route('events.tickets.booking.confirmation', [$event->slug, $booking->id]));

        $this->assertDatabaseHas('event_bookings', [
            'id' => $booking->id,
            'status' => EventBooking::STATUS_CONFIRMED,
            'payment_status' => 'paid',
            'transaction_id' => 'pi_event_booking_success',
        ]);

        $this->assertDatabaseHas('payments', [
            'user_id' => $user->id,
            'amount' => 105,
            'payment_method' => 'stripe',
            'transaction_id' => 'pi_event_booking_success',
            'status' => Payment::STATUS_COMPLETED,
            'payable_type' => EventBooking::class,
            'payable_id' => $booking->id,
        ]);
    }

    public function test_event_stripe_failure_keeps_booking_pending(): void
    {
        [$user, $event, $booking] = $this->createPendingEventBooking(totalPrice: 80);
        $this->createStripeGateway();

        $fakeGateway = Mockery::mock(PaymentGatewayService::class);
        $fakeGateway->shouldReceive('charge')
            ->once()
            ->andReturn([
                'status' => 'failed',
                'reference' => 'pi_event_booking_failed',
                'message' => 'Stripe reported a charge failure.',
            ]);

        $this->mock(GatewayManager::class, function ($mock) use ($fakeGateway) {
            $mock->shouldReceive('resolve')->once()->andReturn($fakeGateway);
        });

        $this->actingAs($user)
            ->from(route('events.tickets.booking.checkout', [$event->slug, $booking->id]))
            ->post(route('events.tickets.booking.processPayment', [$event->slug, $booking->id]), [
                'payment_method' => 'stripe',
                'payment_token' => 'pm_card_visa',
            ])
            ->assertRedirect(route('events.tickets.booking.checkout', [$event->slug, $booking->id]));

        $this->assertDatabaseHas('event_bookings', [
            'id' => $booking->id,
            'status' => EventBooking::STATUS_PENDING,
            'payment_status' => 'unpaid',
            'transaction_id' => null,
        ]);

        $this->assertDatabaseHas('payments', [
            'user_id' => $user->id,
            'amount' => 84,
            'payment_method' => 'stripe',
            'transaction_id' => 'pi_event_booking_failed',
            'status' => Payment::STATUS_FAILED,
            'payable_type' => EventBooking::class,
            'payable_id' => $booking->id,
        ]);
    }

    public function test_event_stripe_auth_return_confirms_booking_and_records_payment(): void
    {
        [$user, $event, $booking] = $this->createPendingEventBooking(totalPrice: 60);
        $this->createStripeGateway();

        $fakeGateway = Mockery::mock(PaymentGatewayService::class);
        $fakeGateway->shouldReceive('retrieveIntentStatus')
            ->once()
            ->with('pi_event_booking_auth')
            ->andReturn([
                'status' => 'successful',
                'reference' => 'pi_event_booking_auth',
                'message' => 'Payment confirmed successfully.',
            ]);

        $this->mock(GatewayManager::class, function ($mock) use ($fakeGateway) {
            $mock->shouldReceive('resolve')->once()->andReturn($fakeGateway);
        });

        $this->actingAs($user)
            ->get(route('events.tickets.booking.payment.confirm', [$event->slug, $booking->id, 'stripe']) . '?payment_intent=pi_event_booking_auth')
            ->assertRedirect(route('events.tickets.booking.confirmation', [$event->slug, $booking->id]));

        $this->assertDatabaseHas('event_bookings', [
            'id' => $booking->id,
            'status' => EventBooking::STATUS_CONFIRMED,
            'payment_status' => 'paid',
            'transaction_id' => 'pi_event_booking_auth',
        ]);

        $this->assertDatabaseHas('payments', [
            'user_id' => $user->id,
            'amount' => 63,
            'payment_method' => 'stripe',
            'transaction_id' => 'pi_event_booking_auth',
            'status' => Payment::STATUS_COMPLETED,
            'payable_type' => EventBooking::class,
            'payable_id' => $booking->id,
        ]);
    }

    public function test_stripe_webhook_payment_intent_succeeded_confirms_event_booking(): void
    {
        [$user, , $booking] = $this->createPendingEventBooking(totalPrice: 120);
        $this->createStripeGateway();

        $fakeService = Mockery::mock(PaymentGatewayService::class);
        $fakeService->shouldReceive('handleWebhook')
            ->once()
            ->andReturn([
                'status' => 'processed',
                'event_booking_id' => (string) $booking->id,
                'payment_status' => 'paid',
                'reference' => 'pi_event_booking_webhook',
                'message' => 'Event booking payment completed.',
            ]);

        $this->mock(GatewayManager::class, function ($mock) use ($fakeService) {
            $mock->shouldReceive('resolve')->once()->andReturn($fakeService);
        });

        $this->postJson('/webhooks/stripe', ['type' => 'payment_intent.succeeded'])
            ->assertOk()
            ->assertJsonPath('status', 'success');

        $this->assertDatabaseHas('event_bookings', [
            'id' => $booking->id,
            'status' => EventBooking::STATUS_CONFIRMED,
            'payment_status' => 'paid',
            'transaction_id' => 'pi_event_booking_webhook',
        ]);

        $this->assertDatabaseHas('payments', [
            'user_id' => $user->id,
            'amount' => 126,
            'payment_method' => 'stripe',
            'transaction_id' => 'pi_event_booking_webhook',
            'status' => Payment::STATUS_COMPLETED,
            'payable_type' => EventBooking::class,
            'payable_id' => $booking->id,
        ]);
    }

    private function createPendingEventBooking(float $totalPrice = 100): array
    {
        $user = User::factory()->create();
        $event = Event::factory()->create([
            'is_paid' => true,
            'base_price' => $totalPrice,
        ]);
        $occurrence = EventOccurrence::factory()->create([
            'event_id' => $event->id,
        ]);
        $ticket = EventTicketType::factory()->create([
            'event_id' => $event->id,
            'base_price' => $totalPrice,
        ]);
        $inventory = EventOccurrenceTicket::create([
            'event_occurrence_id' => $occurrence->id,
            'event_ticket_type_id' => $ticket->id,
            'available_quantity' => 50,
            'override_price' => $totalPrice,
            'is_active' => true,
        ]);

        $booking = EventBooking::forceCreate([
            'user_id' => $user->id,
            'event_id' => $event->id,
            'event_occurrence_id' => $occurrence->id,
            'event_ticket_type_id' => $ticket->id,
            'occurrence_ticket_id' => $inventory->id,
            'quantity' => 1,
            'user_name' => $user->name,
            'user_email' => $user->email,
            'user_phone' => '555-0100',
            'total_price' => $totalPrice,
            'status' => EventBooking::STATUS_PENDING,
            'payment_status' => 'unpaid',
        ]);

        return [$user, $event, $booking];
    }

    private function createStripeGateway(string $publishableKey = 'pk_test_event_checkout'): PaymentGateway
    {
        $gateway = PaymentGateway::create([
            'title' => 'Stripe',
            'slug' => 'stripe',
            'class_name' => \App\Services\StripeGatewayService::class,
            'is_active' => true,
            'mode' => PaymentGateway::MODE_SANDBOX,
        ]);

        $gateway->credentials()->create([
            'sandbox_config' => [
                'secret_key' => 'sk_test_example',
                'publishable_key' => $publishableKey,
                'webhook_secret' => 'whsec_test_example',
                'currency' => 'USD',
            ],
            'live_config' => [],
        ]);

        return $gateway;
    }
}
