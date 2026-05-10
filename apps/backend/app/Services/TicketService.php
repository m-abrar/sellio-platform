<?php

namespace App\Services;

use App\Models\Ticket;
use App\Models\User;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

/**
 * Class TicketService
 * Orchestrates the public-facing ticket lifecycle, managing creation and user-side replies.
 */
class TicketService
{
    /**
     * Get paginated tickets for a specific user.
     */
    public function getUserTickets(User $user, int $perPage = 10): LengthAwarePaginator
    {
        return $user->tickets()
            ->with(['messages.user', 'user'])
            ->latest()
            ->paginate($perPage);
    }

    /**
     * Initialize a new support ticket.
     */
    public function createTicket(User $user, array $data): Ticket
    {
        return $user->tickets()->create([
            'title'       => $data['title'],
            'description' => $data['description'],
            'priority'    => $data['priority'] ?? 'low',
            'status'      => 'open',
        ]);
    }

    /**
     * Add a user-originated reply to an existing ticket.
     */
    public function replyToTicket(User $user, Ticket $ticket, array $data): Ticket
    {
        return DB::transaction(function () use ($user, $ticket, $data) {
            $ticket->messages()->create([
                'user_id' => $user->id,
                'body'    => $data['body'],
            ]);

            // Re-open if closed and user replies? (Depends on business rules)
            if ($ticket->status === 'closed') {
                $ticket->update(['status' => 'open']);
            }

            return $ticket;
        });
    }
}
