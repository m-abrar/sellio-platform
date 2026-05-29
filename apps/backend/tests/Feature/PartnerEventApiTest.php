<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Event;
use App\Models\Location;
use App\Models\Type;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class PartnerEventApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_partner_can_create_update_and_delete_event_listing(): void
    {
        Storage::fake('public');

        // Create partner user and role
        $partner = User::factory()->partner()->create();
        Role::create(['name' => 'partner']);
        $partner->assignRole('partner');

        // Create metadata for events
        $category = Category::factory()->create(['is_event' => true]);
        $type = Type::factory()->create(['is_event' => true]);
        $location = Location::factory()->create(['is_event' => true]);

        // 1. Create an Event Listing
        $createResponse = $this->actingAs($partner, 'sanctum')
            ->post('/api/dashboard/partner/events', [
                'title' => 'Stellar Tech Conference 2026',
                'description' => 'A premier gathering of tech innovators and global business leaders.',
                'category_id' => $category->id,
                'type_id' => $type->id,
                'location_id' => $location->id,
                'base_price' => '199.00',
                'is_paid' => '1',
                'is_published' => '1',
                'is_virtual' => '0',
                'address' => '456 Tech Boulevard',
                'city' => 'San Francisco',
                'country' => 'USA',
                'organizer_name' => 'Stellar Events Co.',
                'organizer_email' => 'contact@stellar.test',
                'tickets' => [
                    [
                        'id' => 'NEW_ticket_vip',
                        'title' => 'VIP Pass',
                        'base_price' => '399.00',
                    ],
                    [
                        'id' => 'NEW_ticket_regular',
                        'title' => 'Regular Pass',
                        'base_price' => '199.00',
                    ],
                ],
                'occurrences' => [
                    [
                        'id' => 'NEW_occ_day1',
                        'start_date_time' => '2026-09-10 09:00:00',
                        'duration_hours' => '8',
                        'max_attendees' => '500',
                        'venue_details' => 'Hall A',
                        'inventory' => [
                            'NEW_ticket_vip' => [
                                'available_quantity' => 100,
                                'override_price' => 349.00,
                            ],
                            'NEW_ticket_regular' => [
                                'available_quantity' => 400,
                                'override_price' => 0.00,
                            ],
                        ],
                    ],
                ],
                'tags' => ['Tech', 'AI', 'VentureCapital'],
                'main_image' => UploadedFile::fake()->image('conf-main.jpg', 1200, 800),
            ], ['Accept' => 'application/json']);

        $createResponse->assertCreated()
            ->assertJsonPath('data.title', 'Stellar Tech Conference 2026')
            ->assertJsonPath('data.pricing.is_paid', true)
            ->assertJsonPath('data.organizer.name', 'Stellar Events Co.')
            ->assertJsonPath('data.organizer.email', 'contact@stellar.test');

        $event = Event::with(['media', 'ticketTypes', 'occurrences.inventory', 'tags'])->findOrFail($createResponse->json('data.id'));
        $this->assertNotNull($event->getFirstMedia(Event::PRIMARY_MEDIA));
        $this->assertCount(2, $event->ticketTypes);
        $this->assertCount(1, $event->occurrences);
        $this->assertCount(3, $event->tags);

        $this->assertDatabaseHas('events', [
            'id' => $event->id,
            'user_id' => $partner->id,
            'title' => 'Stellar Tech Conference 2026',
            'base_price' => '199.00',
            'is_paid' => true,
        ]);

        $vipTicket = $event->ticketTypes->where('title', 'VIP Pass')->first();
        $occurrence = $event->occurrences->first();
        $vipInventory = $occurrence->inventory->where('event_ticket_type_id', $vipTicket->id)->first();
        
        $this->assertNotNull($vipInventory);
        $this->assertEquals(100, $vipInventory->available_quantity);
        $this->assertEquals(349.00, $vipInventory->override_price);

        // 2. Update the Event Listing
        $updateResponse = $this->actingAs($partner, 'sanctum')
            ->post("/api/dashboard/partner/events/{$event->id}", [
                '_method' => 'PATCH',
                'title' => 'Stellar Tech Conference 2026 Updated',
                'description' => 'A premier gathering of tech innovators and global business leaders - Updated.',
                'category_id' => $category->id,
                'type_id' => $type->id,
                'location_id' => $location->id,
                'base_price' => '249.00', // Increased base price
                'is_paid' => '1',
                'is_published' => '1',
                'is_virtual' => '0',
                'address' => '456 Tech Boulevard',
                'city' => 'San Francisco',
                'country' => 'USA',
                'organizer_name' => 'Stellar Events Co. New',
                'tickets' => [
                    [
                        'id' => (string) $vipTicket->id, // Existing VIP ticket
                        'title' => 'VIP Gold Pass',
                        'base_price' => '449.00',
                    ],
                ],
                'occurrences' => [
                    [
                        'id' => (string) $occurrence->id, // Existing Occurrence
                        'start_date_time' => '2026-09-10 10:00:00', // Shifted start time
                        'duration_hours' => '9', // Increased duration
                        'max_attendees' => '600',
                        'venue_details' => 'Hall A+B',
                        'inventory' => [
                            (string) $vipTicket->id => [
                                'available_quantity' => 150, // Increased quantity
                                'override_price' => 399.00,
                            ],
                        ],
                    ],
                ],
                'tags' => ['Tech', 'AI', 'Robotics'], // Modified tags
                'sync_existing_media' => '1',
                'existing_main_media_id' => (string) $event->getFirstMedia(Event::PRIMARY_MEDIA)->id,
            ], ['Accept' => 'application/json']);

        $updateResponse->assertOk()
            ->assertJsonPath('data.title', 'Stellar Tech Conference 2026 Updated')
            ->assertJsonPath('data.organizer.name', 'Stellar Events Co. New');

        $this->assertDatabaseHas('events', [
            'id' => $event->id,
            'title' => 'Stellar Tech Conference 2026 Updated',
            'base_price' => '249.00',
        ]);

        $occurrence->refresh()->load('inventory');
        $updatedVipInventory = $occurrence->inventory->where('event_ticket_type_id', $vipTicket->id)->first();
        $this->assertEquals(150, $updatedVipInventory->available_quantity);
        $this->assertEquals(399.00, $updatedVipInventory->override_price);

        // 3. Delete the Event Listing
        $deleteResponse = $this->actingAs($partner, 'sanctum')
            ->delete("/api/dashboard/partner/events/{$event->id}", [], ['Accept' => 'application/json']);

        $deleteResponse->assertOk();
        $this->assertSoftDeleted('events', [
            'id' => $event->id,
        ]);
    }

    public function test_unauthorized_partner_cannot_delete_other_events(): void
    {
        Role::create(['name' => 'partner']);
        
        $partnerOne = User::factory()->partner()->create();
        $partnerOne->assignRole('partner');
        
        $partnerTwo = User::factory()->partner()->create();
        $partnerTwo->assignRole('partner');

        $event = Event::factory()->create([
            'user_id' => $partnerOne->id,
        ]);

        $response = $this->actingAs($partnerTwo, 'sanctum')
            ->delete("/api/dashboard/partner/events/{$event->id}", [], ['Accept' => 'application/json']);

        $response->assertStatus(403);
        $this->assertDatabaseHas('events', [
            'id' => $event->id,
            'deleted_at' => null,
        ]);
    }
}
