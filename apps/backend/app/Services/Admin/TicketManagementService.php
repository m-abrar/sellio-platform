<?php

namespace App\Services\Admin;

use App\Models\Ticket;
use Illuminate\Support\Facades\DB;

class TicketManagementService
{
    /**
     * Store a reply in the ticket thread and update ticket state.
     */
    public function replyToTicket(Ticket $ticket, array $data): Ticket
    {
        return DB::transaction(function () use ($ticket, $data) {
            $ticket->messages()->create([
                'user_id' => auth()->id(), // Admin/Staff user replying
                'body' => $data['body'],
            ]);

            // Optionally update ticket status to 'in-progress' on admin reply
            if ($ticket->status === 'open') {
                $ticket->update(['status' => 'in-progress']);
            }

            return $ticket;
        });
    }

    /**
     * Update ticket status.
     */
    public function updateStatus(Ticket $ticket, string $status): Ticket
    {
        $ticket->update(['status' => $status]);
        
        return $ticket;
    }

    /**
     * Bulk update ticket status or priority.
     */
    public function bulkUpdate(array $ids, string $type, string $value): void
    {
        if ($type === 'action' && $value === 'delete') {
            Ticket::whereIn('id', $ids)->delete();
        } else {
            Ticket::whereIn('id', $ids)->update([$type => $value]);
        }
    }
}
