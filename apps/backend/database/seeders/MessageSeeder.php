<?php

// File: database/seeders/MessageSeeder.php
// Purpose: Populates the 'conversations' and 'messages' tables with sample
// conversation threads between Buyers (users) and Partners for development and testing.
// It relies on pre-existing users created by the UserSeeder.

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Conversation;
use App\Models\Message;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;

/**
 * Class MessageSeeder
 *
 * Creates sample conversations and related messages between different user roles
 * (Buyer and Partner) to simulate real-world usage of the messaging system.
 */
class MessageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run(): void
    {
        $this->command->info('💬 Starting Message Seeder...');

        // Disable foreign key checks temporarily to allow for clean table manipulation
        // and avoid constraints issues during mass deletion/insertion.
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        
        // --- 1. Read Existing Users (Do NOT create new users) ---
        
        // Fetch users based on their roles to establish conversation pairs
        $buyers = User::where('is_buyer', true)->get();
        $partners = User::where('is_partner', true)->get();

        // Guard clause: ensure minimum required users exist
        if ($buyers->isEmpty() || $partners->isEmpty()) {
            $this->command->error("❌ Skipping Message Seeder: Need at least one Buyer (is_buyer=true) and one Partner (is_partner=true) to create conversations.");
            DB::statement('SET FOREIGN_KEY_CHECKS=1;');
            return;
        }

        // Assign specific users for mock conversations (C1, P1, C2, P2, C3)
        $client1 = $buyers[0];
        $partner1 = $partners[0];
        
        // Use next user if available, otherwise reuse the first user for variety
        $client2 = $buyers->count() > 1 ? $buyers[1] : $client1; 
        $partner2 = $partners->count() > 1 ? $partners[1] : $partner1; 
        $client3 = $buyers->count() > 2 ? $buyers[2] : $client1; 

        $service = \App\Models\Service::first();
        $property = \App\Models\Property::first();
        $auto = \App\Models\Auto::first();

        $this->command->line("\n--- 📝 Defining Conversations ---");
        $this->command->line("  - Pairs: {$client1->title} <-> {$partner1->title}, {$client2->title} <-> {$partner2->title}, {$client3->title} <-> {$partner1->title}");

        // --- 2. Define Conversations and Messages using Retrieved IDs ---
        
        // Define an array structure for seeding multiple conversations and their messages
        $conversationsData = [
            // Conversation 1: Client 1 (Buyer) and Partner 1 (Service Booking Confirmation)
            [
                'user_id' => $client1->id,
                'partner_id' => $partner1->id,
                'subject' => 'Booking Confirmation: Deep Tissue Massage',
                'start_time' => Carbon::now()->subHours(5),
                'last_update' => Carbon::now()->subMinutes(1),
                'inquiriable_type' => $service ? \App\Models\Service::class : null,
                'inquiriable_id' => $service ? $service->id : null,
                'messages' => [
                    // Messages include sender_id and a time delay (delay_mins) for sequencing
                    ['sender_id' => $partner1->id, 'body' => 'Hello ' . $client1->title . '! We received your request. Is 4:00 PM today suitable for the Deep Tissue Massage?', 'delay_mins' => 1],
                    ['sender_id' => $client1->id, 'body' => 'Yes, please confirm the time. Looking forward to it!', 'delay_mins' => 5],
                    ['sender_id' => $partner1->id, 'body' => 'Confirmed! See you at 4 PM.', 'delay_mins' => 1],
                    ['sender_id' => $client1->id, 'body' => 'Just one quick question: is there parking available?', 'delay_mins' => 10],
                ]
            ],
            // Conversation 2: Client 2 (Buyer) and Partner 2 (Property Inquiry)
            [
                'user_id' => $client2->id,
                'partner_id' => $partner2->id,
                'subject' => 'Inquiry: Warehouse Space Rental (5,000 sq ft)',
                'start_time' => Carbon::now()->subDay(),
                'last_update' => Carbon::now()->subMinutes(30),
                'inquiriable_type' => $property ? \App\Models\Property::class : null,
                'inquiriable_id' => $property ? $property->id : null,
                'messages' => [
                    ['sender_id' => $client2->id, 'body' => 'Hi, I saw your listing for the warehouse space. Is it suitable for storing paper products?', 'delay_mins' => 5],
                    ['sender_id' => $partner2->id, 'body' => 'Good morning, ' . $client2->title . '. Yes, the unit is climate-controlled. What volume are you looking to store?', 'delay_mins' => 60],
                    ['sender_id' => $client2->id, 'body' => 'Around 5,000 sq ft of space, starting next month.', 'delay_mins' => 15],
                    ['sender_id' => $partner2->id, 'body' => 'That size is available! I can send over the floor plans and a detailed quote.', 'delay_mins' => 5],
                ]
            ],
            // Conversation 3: Client 3 (Buyer) and Partner 1 (Urgent Consultation) - Reuses Partner 1
            [
                'user_id' => $client3->id,
                'partner_id' => $partner1->id, 
                'subject' => 'Urgent Consultation Request - Tomorrow at 6 PM',
                'start_time' => Carbon::now()->subDays(3),
                'last_update' => Carbon::now()->subHours(2),
                'inquiriable_type' => $auto ? \App\Models\Auto::class : null,
                'inquiriable_id' => $auto ? $auto->id : null,
                'messages' => [
                    ['sender_id' => $client3->id, 'body' => 'I require an urgent consultation. Are you available this week?', 'delay_mins' => 1],
                    ['sender_id' => $partner1->id, 'body' => 'We have a slot opening at 6 PM tomorrow. Is that suitable?', 'delay_mins' => 10],
                    ['sender_id' => $client3->id, 'body' => 'Acceptable. Send confirmation.', 'delay_mins' => 3],
                ]
            ],
        ];

        // --- 3. Seed Conversations and Messages ---
        $seededCount = 0;
        $totalMessages = 0;
        foreach ($conversationsData as $data) {
            
            // Safety check: skip if the conversation data somehow pairs a user with themselves
            if ($data['user_id'] == $data['partner_id']) {
                $this->command->line("  ⚠️ Skipping conversation where user_id equals partner_id.");
                continue;
            }

            $user = User::find($data['user_id'])->name ?? 'Buyer';
            $partner = User::find($data['partner_id'])->name ?? 'Partner';
            $this->command->line("  * Seeding: '{$data['subject']}' ({$user} <-> {$partner})");

            // Cleanup: Delete existing conversations between these specific users to ensure uniqueness and clean state
            $deleted = Conversation::where('user_id', $data['user_id'])
                                 ->where('partner_id', $data['partner_id'])
                                 ->delete();

            if ($deleted > 0) {
                 $this->command->line("    - Removed {$deleted} old conversation thread(s).");
            }

            // Create the main conversation record
            $conversation = Conversation::create([
                'user_id' => $data['user_id'],
                'partner_id' => $data['partner_id'],
                'subject' => $data['subject'], 
                'status' => 'active',
                'admin_note' => 'System generated demo conversation.',
                'inquiriable_type' => $data['inquiriable_type'] ?? null,
                'inquiriable_id' => $data['inquiriable_id'] ?? null,
                'created_at' => $data['start_time'],
                'updated_at' => $data['last_update'],
            ]);
            $seededCount++;

            // Seed the individual messages within the conversation
            $currentTime = $data['start_time'];
            foreach ($data['messages'] as $messageData) {
                // Increment time based on the defined delay to ensure sequential and realistic timestamps
                $currentTime = $currentTime->copy()->addMinutes($messageData['delay_mins']); 

                Message::create([
                    'conversation_id' => $conversation->id,
                    'sender_id' => $messageData['sender_id'],
                    'body' => $messageData['body'],
                    'created_at' => $currentTime,
                    'updated_at' => $currentTime,
                ]);
                $totalMessages++;
            }
        }

        // Re-enable foreign key checks after seeding is complete
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
        
        $this->command->info("\n--- 🏁 Messaging Seeding Complete ---");
        $this->command->info("🎉 Successfully seeded {$seededCount} new conversations with {$totalMessages} total messages.");
    }
}