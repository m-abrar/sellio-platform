<?php

namespace Tests\Feature;

use App\Events\Partner\PartnerLeadCreated;
use App\Models\Event;
use App\Models\EventOccurrence;
use App\Models\EventOccurrenceTicket;
use App\Models\EventTicketType;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event as EventFacade;
use Tests\TestCase;

class BuyerEventBookingApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_buyer_can_reserve_available_event_tickets(): void
    {
        EventFacade::fake([PartnerLeadCreated::class]);

        $buyer = User::factory()->create();
        $event = Event::factory()->create([
            'base_price' => 25,
            'is_paid' => true,
        ]);
        $occurrence = EventOccurrence::factory()->create([
            'event_id' => $event->id,
            'start_date_time' => now()->addWeek(),
            'end_date_time' => now()->addWeek()->addHours(2),
        ]);
        $ticket = EventTicketType::factory()->create([
            'event_id' => $event->id,
            'title' => 'General Admission',
            'base_price' => 25,
        ]);
        $inventory = EventOccurrenceTicket::query()->create([
            'event_occurrence_id' => $occurrence->id,
            'event_ticket_type_id' => $ticket->id,
            'available_quantity' => 20,
            'override_price' => 25,
        ]);

        $this->getJson("/api/v1/events/{$event->slug}")
            ->assertOk()
            ->assertJsonPath("data.occurrences.0.inventory.{$ticket->id}.available_quantity", 20)
            ->assertJsonPath("data.occurrences.0.inventory.{$ticket->id}.price", 25);

        $this->actingAs($buyer, 'sanctum')
            ->postJson("/api/v1/events/{$event->id}/bookings", [
                'event_occurrence_id' => $occurrence->id,
                'event_ticket_type_id' => $ticket->id,
                'quantity' => 2,
            ])
            ->assertCreated()
            ->assertJsonPath('data.user_id', $buyer->id)
            ->assertJsonPath('data.event_id', $event->id)
            ->assertJsonPath('data.quantity', 2)
            ->assertJsonPath('data.total_price', '50.00')
            ->assertJsonPath('data.status', 'pending');

        $this->assertDatabaseHas('event_bookings', [
            'user_id' => $buyer->id,
            'event_id' => $event->id,
            'event_occurrence_id' => $occurrence->id,
            'event_ticket_type_id' => $ticket->id,
            'occurrence_ticket_id' => $inventory->id,
            'quantity' => 2,
            'status' => 'pending',
        ]);
    }
}
