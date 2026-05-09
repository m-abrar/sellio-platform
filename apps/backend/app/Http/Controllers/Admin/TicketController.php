<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Ticket;
use App\Models\TicketMessage;
use App\Services\Admin\TicketManagementService;
use App\Http\Requests\Admin\Tickets\ReplyTicketRequest;
use App\Http\Requests\Admin\Tickets\UpdateTicketStatusRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

/**
 * Class TicketController
 * Orchestrates administrative support infrastructure, coordinating threaded 
 * communications, ticket status transitions, and high-volume bulk governance.
 */
class TicketController extends Controller
{
    /**
     * The ticket management service.
     *
     * @var \App\Services\Admin\TicketManagementService
     */
    protected TicketManagementService $ticketService;

    /**
     * TicketController constructor.
     *
     * @param  \App\Services\Admin\TicketManagementService  $ticketService
     */
    public function __construct(TicketManagementService $ticketService)
    {
        $this->ticketService = $ticketService;
    }

    /**
     * Display a filtered and paginated listing of support tickets.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\View\View
     */
    public function index(Request $request): View
    {
        $status = $request->query('status', 'open');
        $search = $request->query('search');
        $priority = $request->query('priority');
        
        $tickets = Ticket::with('user')
            ->when($status !== 'all', function ($q) use ($status) {
                return $q->where('status', $status);
            })
            ->when($priority, function ($q) use ($priority) {
                return $q->where('priority', $priority);
            })
            ->when($search, function ($q) use ($search) {
                return $q->where(function($sq) use ($search) {
                    $sq->where('title', 'LIKE', "%{$search}%")
                       ->orWhere('description', 'LIKE', "%{$search}%")
                       ->orWhere('id', $search);
                });
            })
            ->orderBy('created_at', 'desc')
            ->paginate(15)
            ->withQueryString();

        return view('admin.tickets.index', compact('tickets', 'status', 'priority', 'search'));
    }

    /**
     * Display the comprehensive message thread for a specific support ticket.
     *
     * @param  \App\Models\Ticket  $ticket
     * @return \Illuminate\View\View
     */
    public function show(Ticket $ticket): View
    {
        // Administrative Read Receipt Tracking
        if (!$ticket->viewed_at) {
            $ticket->update(['viewed_at' => now()]);
        }

        $messages = $ticket->messages()->with('user')->orderBy('created_at', 'asc')->get();

        return view('admin.tickets.show', compact('ticket', 'messages'));
    }

    /**
     * Append a reply to the ticket thread and notify associated stakeholders.
     *
     * @param  \App\Http\Requests\Admin\Tickets\ReplyTicketRequest  $request
     * @param  \App\Models\Ticket  $ticket
     * @return \Illuminate\Http\RedirectResponse
     */
    public function reply(ReplyTicketRequest $request, Ticket $ticket): RedirectResponse
    {
        $this->ticketService->replyToTicket($ticket, $request->validated());

        return redirect()->back()->with('success', __('Support reply submitted successfully.'));
    }

    /**
     * Update the operational status of a specific support ticket.
     *
     * @param  \App\Http\Requests\Admin\Tickets\UpdateTicketStatusRequest  $request
     * @param  \App\Models\Ticket  $ticket
     * @return \Illuminate\Http\RedirectResponse
     */
    public function updateStatus(UpdateTicketStatusRequest $request, Ticket $ticket): RedirectResponse
    {
        $this->ticketService->updateStatus($ticket, $request->input('status'));

        return redirect()->back()->with('success', __('Ticket status updated to :status successfully.', [
            'status' => $request->input('status')
        ]));
    }

    /**
     * Execute a high-fidelity bulk update on multiple tickets (Status/Priority/Action).
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function bulkUpdate(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'ids'   => 'required|array',
            'ids.*' => 'exists:tickets,id',
            'type'  => 'required|string|in:status,priority,action',
            'value' => 'required|string',
        ]);

        $this->ticketService->bulkUpdate($validated['ids'], $validated['type'], $validated['value']);

        return redirect()->back()->with('success', __('Bulk operations synchronized successfully.'));
    }

    /**
     * Permanently remove a ticket thread from the administrative database.
     *
     * @param  \App\Models\Ticket  $ticket
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(Ticket $ticket): RedirectResponse
    {
        $ticket->delete();
        return redirect()->back()->with('success', __('Ticket thread purged successfully.'));
    }
}
