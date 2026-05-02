<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Ticket;
use App\Models\TicketMessage;
use App\Services\Admin\TicketManagementService;
use App\Http\Requests\Admin\Tickets\ReplyTicketRequest;
use App\Http\Requests\Admin\Tickets\UpdateTicketStatusRequest;
use Illuminate\Http\Request;

class TicketController extends Controller
{
    protected $ticketService;

    public function __construct(TicketManagementService $ticketService)
    {
        $this->ticketService = $ticketService;
    }
    /**
     * Display a listing of support tickets.
     */
    public function index(Request $request)
    {
        $status = $request->get('status', 'open'); // Default to open
        
        $tickets = Ticket::with('user')
            ->when($status !== 'all', function ($q) use ($status) {
                return $q->where('status', $status);
            })
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return view('admin.tickets.index', compact('tickets', 'status'));
    }

    /**
     * Display the specified ticket thread.
     */
    public function show(Ticket $ticket)
    {
        // Mark as viewed by admin if not already viewed
        if (!$ticket->viewed_at) {
            $ticket->update(['viewed_at' => now()]);
        }

         $messages = $ticket->messages()->with('user')->orderBy('created_at', 'asc')->get();

        return view('admin.tickets.show', compact('ticket', 'messages'));
    }

    /**
     * Store a reply/message in the ticket thread.
     */
    public function reply(ReplyTicketRequest $request, Ticket $ticket)
    {
        $this->ticketService->replyToTicket($ticket, $request->validated());

        return redirect()->back()->with('success', 'Reply submitted successfully.');
    }

    /**
     * Update ticket status.
     */
    public function updateStatus(UpdateTicketStatusRequest $request, Ticket $ticket)
    {
        $this->ticketService->updateStatus($ticket, $request->status);

        return redirect()->back()->with('success', 'Ticket status updated to ' . $request->status);
    }

    /**
     * Bulk update tickets status or priority.
     */
    public function bulkUpdate(Request $request)
    {
        $validated = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:tickets,id',
            'type' => 'required|string|in:status,priority',
            'value' => 'required|string',
        ]);

        $this->ticketService->bulkUpdate($validated['ids'], $validated['type'], $validated['value']);

        return redirect()->back()->with('success', 'Bulk update completed successfully.');
    }

    /**
     * Remove the specified ticket from storage.
     */
    public function destroy(Ticket $ticket)
    {
        $ticket->delete();
        return redirect()->back()->with('success', 'Ticket purged successfully.');
    }
}
