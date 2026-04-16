@extends('adminlte::page')

@section('title', 'Ticket Details #' . $ticket->id)

@section('content_header')
<div class="container-fluid">
    <div class="row mb-2">
        <div class="col-sm-6">
            <h1 class="m-0 text-dark font-weight-bold">
                <i class="fas fa-ticket-alt mr-2 text-success"></i>Ticket Details #{{ $ticket->id }}
            </h1>
        </div>
        <div class="col-sm-6 text-right">
            <a href="{{ route('admin.tickets.index') }}" class="btn btn-outline-secondary btn-sm">
                <i class="fas fa-arrow-left mr-1"></i> Back to List
            </a>
        </div>
    </div>
</div>
@stop

@section('content')
<div class="container-fluid">
    @include('admin.alert')

    <div class="row">
        <!-- Main Thread Column -->
        <div class="col-md-8">
            <div class="card card-primary card-outline shadow-sm border-0">
                <div class="card-header bg-white py-3">
                    <h3 class="card-title font-weight-bold">
                        {{ $ticket->title }}
                    </h3>
                </div>
                <div class="card-body">
                    <!-- Initial Description (User input) -->
                    <div class="alert alert-light border-0 shadow-none p-3 mb-4 bg-light">
                        <div class="d-flex justify-content-between mb-2">
                            <span class="font-weight-bold text-dark">{{ $ticket->user->name ?? 'Guest User' }}</span>
                            <small class="text-muted">{{ $ticket->created_at->format('M d, Y H:i A') }}</small>
                        </div>
                        <div class="text-secondary">
                            {!! nl2br(e($ticket->description)) !!}
                        </div>
                    </div>

                    <hr class="my-4">

                    <!-- Conversation History -->
                    <div class="ticket-chat-thread mb-4" style="max-height: 500px; overflow-y: auto; padding: 10px;">
                        @forelse($messages as $message)
                            <!-- Chat Bubble -->
                            <div class="d-flex mb-3 @if($message->user_id === auth()->id()) justify-content-end @endif">
                                <div class="p-3 rounded shadow-sm" style="max-width: 75%; @if($message->user_id === auth()->id()) background-color: #d1ecf1; color: #0c5460; @else background-color: #f8f9fa; border: 1px solid #e9ecef; @endif">
                                    <div class="d-flex justify-content-between mb-1">
                                        <small class="font-weight-bold mr-3">
                                            {{ $message->user->name ?? 'Unknown' }}
                                        </small>
                                        <small class="text-muted">
                                            {{ $message->created_at->format('H:i A') }}
                                        </small>
                                    </div>
                                    <div class="message-body">
                                        {!! nl2br(e($message->body)) !!}
                                    </div>
                                </div>
                            </div>
                        @empty
                            <div class="text-center py-3 text-muted">No replies yet.</div>
                        @endforelse
                    </div>

                    <!-- Reply Form -->
                    <form action="{{ route('admin.tickets.reply', $ticket->id) }}" method="POST">
                        @csrf
                        <div class="form-group mb-0">
                            <textarea name="body" class="form-control" rows="4" placeholder="Type your reply here..." required></textarea>
                            <button type="submit" class="btn btn-primary btn-sm btn-block mt-2">
                                <i class="fas fa-paper-plane mr-1"></i> Send Reply
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

        <!-- Sidebar Actions Column -->
        <div class="col-md-4">
            <div class="card card-outline card-secondary shadow-sm border-0">
                <div class="card-header bg-white">
                    <h3 class="card-title font-weight-bold">Ticket Details</h3>
                </div>
                <div class="card-body p-0">
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item d-flex justify-content-between align-items-center">
                            <span>Status</span>
                            <span class="badge badge-{{ match($ticket->status) {
                                'open' => 'success',
                                'in-progress' => 'info',
                                'closed' => 'dark',
                                default => 'warning'
                            } }}">
                                {{ ucfirst($ticket->status) }}
                            </span>
                        </li>
                        <li class="list-group-item d-flex justify-content-between align-items-center">
                            <span>Priority</span>
                            <span class="badge badge-{{ match($ticket->priority) {
                                'urgent' => 'danger',
                                'high' => 'orange',
                                'medium' => 'primary',
                                default => 'secondary'
                            } }}">
                                {{ ucfirst($ticket->priority) }}
                            </span>
                        </li>
                        <li class="list-group-item d-flex justify-content-between align-items-center">
                            <span>Creator</span>
                            <span>{{ $ticket->user->name ?? 'Guest' }}</span>
                        </li>
                        <li class="list-group-item d-flex justify-content-between align-items-center">
                            <span>Opened</span>
                            <span>{{ $ticket->created_at->diffForHumans() }}</span>
                        </li>
                    </ul>
                </div>
            </div>

            <!-- Quick Status Actions -->
            <div class="card card-outline card-warning shadow-sm border-0">
                <div class="card-header bg-white">
                    <h3 class="card-title font-weight-bold">Update Status</h3>
                </div>
                <div class="card-body">
                    <form action="{{ route('admin.tickets.status', $ticket->id) }}" method="POST">
                        @csrf
                        <div class="form-group">
                            <select name="status" class="form-control custom-select">
                                <option value="open" @if($ticket->status === 'open') selected @endif>Open</option>
                                <option value="in-progress" @if($ticket->status === 'in-progress') selected @endif>In-progress</option>
                                <option value="closed" @if($ticket->status === 'closed') selected @endif>Closed</option>
                                <option value="reopened" @if($ticket->status === 'reopened') selected @endif>Reopened</option>
                            </select>
                        </div>
                        <button type="submit" class="btn btn-sm btn-outline-warning btn-block">
                            Update State
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>
@stop

@push('css')
<style>
    .ticket-chat-thread::-webkit-scrollbar { width: 6px; }
    .ticket-chat-thread::-webkit-scrollbar-thumb { background-color: #ccc; border-radius: 3px; }
</style>
@endpush
