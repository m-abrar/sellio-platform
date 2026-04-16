<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\TicketResource;
use App\Http\Requests\Api\Tickets\StoreTicketRequest;
use App\Http\Requests\Api\Tickets\ReplyTicketRequest;
use App\Models\Ticket;
use Illuminate\Http\Request;

class TicketController extends Controller
{
    /**
     * Display a listing of the authenticated user's tickets.
     */
    public function index()
    {
        $tickets = auth()->user()->tickets()
            ->with(['messages', 'user']) // eager load
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return TicketResource::collection($tickets);
    }

    /**
     * Store a newly created ticket in storage.
     */
    public function store(StoreTicketRequest $request)
    {
        $ticket = auth()->user()->tickets()->create([
            'title' => $request->title,
            'description' => $request->description,
            'priority' => $request->get('priority', 'low'),
            'status' => 'open',
        ]);

        return response()->json([
            'message' => 'Ticket created successfully.',
            'data' => new TicketResource($ticket)
        ], 210);
    }

    /**
     * Display the specified ticket thread.
     */
    public function show(Ticket $ticket)
    {
        // Verify owner if not Admin (Admin handles are separate, but verify generic ownership)
        if ($ticket->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized Access.'], 403);
        }

        $ticket->load(['messages.user']);

        return new TicketResource($ticket);
    }

    /**
     * Add a reply to the ticket thread (User side).
     */
    public function reply(ReplyTicketRequest $request, Ticket $ticket)
    {
        if ($ticket->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized Access.'], 403);
        }

        if ($ticket->status === 'closed') {
            return response()->json(['message' => 'Cannot reply to a closed ticket.'], 400);
        }

        $message = $ticket->messages()->create([
            'user_id' => auth()->id(),
            'body' => $request->body,
        ]);

        return response()->json([
            'message' => 'Reply submitted.',
            'data' => $message 
        ], 200);
    }
}
