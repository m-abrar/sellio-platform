@extends('adminlte::page')

@section('title', 'Ticket Details #' . $ticket->id)

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-8">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-ticket-alt mr-2 text-primary"></i> Support Manifest #{{ $ticket->id }}
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">Unified thread for resolution tracking, stakeholder communication, and audit logging.</p>
            </div>
            <div class="col-sm-4 text-right">
                <a href="{{ route('admin.tickets.index') }}" class="btn btn-back shadow-sm rounded-pill px-4 py-2 font-weight-bold smallest uppercase letter-spacing-1">
                    <i class="fas fa-arrow-left mr-1"></i> Return to Queue
                </a>
            </div>
        </div>
    </div>
@stop

@section('content_header_breadcrumbs')
@stop

@section('content')
<div class="container-fluid pb-5">
    @include('admin.alert')

    <div class="row">
        <!-- Main Conversation Thread -->
        <div class="col-md-8">
            <div class="card border-0 shadow-premium overflow-hidden" style="border-radius: 24px;">
                <div class="card-header border-0 bg-white py-4 px-4">
                    <h5 class="card-title font-weight-bold text-dark text-uppercase mb-0" style="letter-spacing: 1px;">
                        <i class="fas fa-comments mr-2 text-primary opacity-50"></i> Resolution Thread
                    </h5>
                </div>
                <div class="card-body px-4 pb-4">
                    <!-- Issue Definition -->
                    <div class="bg-primary-soft p-4 rounded-xl border border-primary-soft mb-5">
                        <div class="d-flex justify-content-between align-items-start mb-3">
                            <div class="d-flex align-items-center">
                                <div class="bg-white rounded-circle shadow-sm mr-3 d-flex align-items-center justify-content-center" style="width: 48px; height: 48px; border: 2px solid #fff;">
                                    <i class="fas fa-user-tag text-primary"></i>
                                </div>
                                <div>
                                    <h6 class="font-weight-bold text-dark mb-0">{{ $ticket->user->name ?? 'Guest Participant' }}</h6>
                                    <small class="text-muted smallest font-weight-bold uppercase">{{ $ticket->user->email ?? 'Direct Prospect' }}</small>
                                </div>
                            </div>
                            <span class="badge badge-white shadow-xs px-3 py-2 rounded-pill font-weight-bold smallest text-muted">
                                INITIATED {{ $ticket->created_at->format('M d, Y @ H:i') }}
                            </span>
                        </div>
                        <div class="text-dark font-weight-500" style="line-height: 1.8; font-size: 1.05rem;">
                            {!! nl2br(e($ticket->description)) !!}
                        </div>
                    </div>

                    <!-- Chat Interface -->
                    <div class="ticket-chat-thread mb-4 pr-2" style="max-height: 600px; overflow-y: auto;">
                        @forelse($messages as $message)
                            @php $isAdmin = $message->user_id === auth()->id(); @endphp
                            <div class="d-flex mb-4 {{ $isAdmin ? 'justify-content-end' : '' }}">
                                <div class="p-3 {{ $isAdmin ? 'bg-primary text-white shadow-premium' : 'bg-light border' }}" 
                                     style="max-width: 80%; border-radius: {{ $isAdmin ? '20px 20px 4px 20px' : '20px 20px 20px 4px' }};">
                                    <div class="d-flex justify-content-between align-items-center mb-2">
                                        <span class="smallest font-weight-bold {{ $isAdmin ? 'text-white-50' : 'text-primary' }} uppercase letter-spacing-1">
                                            {{ $isAdmin ? 'System Agent' : ($message->user->name ?? 'User') }}
                                        </span>
                                        <span class="smallest {{ $isAdmin ? 'text-white-50' : 'text-muted' }} ml-4">
                                            {{ $message->created_at->format('H:i') }}
                                        </span>
                                    </div>
                                    <div class="font-weight-500" style="line-height: 1.6;">
                                        {!! nl2br(e($message->body)) !!}
                                    </div>
                                </div>
                            </div>
                        @empty
                            <div class="text-center py-5 opacity-50">
                                <i class="fas fa-comment-slash fa-3x mb-3"></i>
                                <p class="smallest font-weight-bold uppercase letter-spacing-1">No active correspondence</p>
                            </div>
                        @endforelse
                    </div>

                    <!-- Response Manifest -->
                    <div class="mt-5 border-top pt-4">
                        <form action="{{ route('admin.tickets.reply', $ticket->id) }}" method="POST">
                            @csrf
                            <div class="form-group mb-0">
                                <label class="text-uppercase smallest font-weight-bold letter-spacing-1 text-muted mb-2">Internal Agency Response</label>
                                <textarea name="body" class="form-control form-control-premium shadow-none border-light mb-3" rows="4" placeholder="Draft your professional response..." required></textarea>
                                <button type="submit" class="btn btn-primary rounded-pill px-5 font-weight-bold">
                                    <i class="fas fa-paper-plane mr-2"></i> TRANSMIT REPLY
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>

        <!-- Meta & Operations Sidebar -->
        <div class="col-md-4">
            {{-- Protocol & Identity Card --}}
            <div class="card border-0 shadow-premium overflow-hidden" style="border-radius: 24px;">
                <div class="card-header border-0 bg-white py-4 px-4">
                    <h5 class="card-title font-weight-bold text-dark text-uppercase smallest mb-0" style="letter-spacing: 1px;">
                        <i class="fas fa-shield-alt mr-2 text-primary opacity-50"></i> Protocol & Meta
                    </h5>
                </div>
                <div class="card-body p-0">
                    <div class="px-4 py-3 border-bottom d-flex justify-content-between align-items-center">
                        <span class="smallest font-weight-bold text-muted uppercase">Lifecycle State</span>
                        @php
                            $statusColor = match($ticket->status) {
                                'open' => 'success',
                                'in-progress' => 'info',
                                'closed' => 'dark',
                                default => 'warning'
                            };
                        @endphp
                        <span class="badge badge-{{ $statusColor }}-light text-{{ $statusColor }} px-3 py-1 rounded-pill font-weight-bold smallest">{{ strtoupper($ticket->status) }}</span>
                    </div>
                    <div class="px-4 py-3 border-bottom d-flex justify-content-between align-items-center">
                        <span class="smallest font-weight-bold text-muted uppercase">Urgency Tier</span>
                        @php
                            $priorityColor = match($ticket->priority) {
                                'urgent' => 'danger',
                                'high' => 'warning',
                                'medium' => 'primary',
                                default => 'secondary'
                            };
                        @endphp
                        <span class="text-{{ $priorityColor }} font-weight-bold smallest uppercase">
                            <i class="fas fa-bolt mr-1"></i> {{ $ticket->priority }}
                        </span>
                    </div>
                    <div class="px-4 py-3 border-bottom d-flex justify-content-between align-items-center">
                        <span class="smallest font-weight-bold text-muted uppercase">Account ID</span>
                        <span class="text-dark font-weight-bold smallest text-monospace">#{{ str_pad($ticket->user_id ?? 0, 6, '0', STR_PAD_LEFT) }}</span>
                    </div>
                    <div class="px-4 py-4 bg-light">
                        <label class="text-uppercase smallest font-weight-bold letter-spacing-1 text-muted mb-3 d-block text-center">Transition Lifecycle State</label>
                        <form action="{{ route('admin.tickets.status', $ticket->id) }}" method="POST">
                            @csrf
                            <div class="form-group mb-3">
                                <select name="status" class="form-control form-control-sm form-control-premium shadow-none border-light">
                                    <option value="open" @if($ticket->status === 'open') selected @endif>Return to Open Queue</option>
                                    <option value="in-progress" @if($ticket->status === 'in-progress') selected @endif>Set to In-Progress</option>
                                    <option value="closed" @if($ticket->status === 'closed') selected @endif>Archive & Close Thread</option>
                                    <option value="reopened" @if($ticket->status === 'reopened') selected @endif>Re-Verify (Reopen)</option>
                                </select>
                            </div>
                            <button type="submit" class="btn btn-white btn-sm btn-block rounded-pill border font-weight-bold uppercase smallest py-2">
                                EXECUTE STATE CHANGE
                            </button>
                        </form>
                    </div>
                </div>
                <div class="card-footer bg-white border-0 py-4 text-center">
                    <p class="smallest text-muted font-weight-bold uppercase mb-0">
                        <i class="fas fa-fingerprint mr-1 opacity-50"></i> Manifest Secured & Audited
                    </p>
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
