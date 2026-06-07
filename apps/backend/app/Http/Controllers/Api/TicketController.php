<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Tickets\ReplyTicketRequest;
use App\Http\Requests\Api\Tickets\StoreTicketRequest;
use App\Http\Resources\TicketResource;
use App\Models\Ticket;
use App\Services\TicketService;
use Illuminate\Http\Request;

class TicketController extends Controller
{
    /**
     * @var \App\Services\TicketService
     */
    protected $ticketService;

    /**
     * TicketController constructor.
     */
    public function __construct(TicketService $ticketService)
    {
        $this->ticketService = $ticketService;
    }

    /**
     * Display a listing of the authenticated user's tickets.
     */
    public function index()
    {
        $tickets = $this->ticketService->getUserTickets(auth()->user());

        return TicketResource::collection($tickets);
    }

    /**
     * Store a newly created ticket in storage.
     */
    public function store(StoreTicketRequest $request)
    {
        $ticket = $this->ticketService->createTicket(auth()->user(), $request->validated());

        return $this->successResponse(
            new TicketResource($ticket),
            __('Ticket created successfully.'),
            [],
            201
        );
    }

    /**
     * Display the specified ticket thread.
     */
    public function show(Ticket $ticket)
    {
        $this->authorizeOwner($ticket);

        return new TicketResource($ticket->load(['messages.user']));
    }

    /**
     * Add a reply to the ticket thread (User side).
     */
    public function reply(ReplyTicketRequest $request, Ticket $ticket)
    {
        $this->authorizeOwner($ticket);

        if ($ticket->status === 'closed') {
            return $this->errorResponse(__('Cannot reply to a closed ticket.'), 400);
        }

        $this->ticketService->replyToTicket(auth()->user(), $ticket, $request->validated());

        return $this->successResponse(
            new TicketResource($ticket->fresh(['messages.user'])),
            __('Reply submitted.')
        );
    }

    /**
     * Internal: Verify ticket ownership.
     */
    protected function authorizeOwner(Ticket $ticket): void
    {
        if ($ticket->user_id !== auth()->id()) {
            abort(403, __('Unauthorized Access.'));
        }
    }
}
