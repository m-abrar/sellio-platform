{{--
    Administrative Intelligence Module: System Alert Stream
    
    This view serves as the primary real-time notification ledger for 
    administrators. It facilitates the monitoring of marketplace 
    signals, automated alerts, and user activities, providing a 
    high-fidelity interface for system-wide lifecycle auditing.
    
    @extends adminlte::page
    @context Intelligence Management
    @variables Collection $notifications Paginator of raw notification models.
    @variables Array $styledNotifications Array of UI-formatted notification objects.
--}}
@extends('adminlte::page')

@section('title', 'Admin Notifications | Notifications')

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-8">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-bell mr-2 text-primary opacity-50"></i> Notifications
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">Monitor real-time system alerts, user activities, and marketplace signals.</p>
            </div>
            <div class="col-sm-4 text-right">
                @if (Auth::user()->unreadNotifications()->exists())
                    <form method="POST" action="{{ route('admin.notifications.readall') }}" class="d-inline">
                        @csrf
                        <button type="submit" class="btn btn-primary rounded-pill px-4 py-2 font-weight-bold shadow-premium smallest uppercase letter-spacing-1">
                            <i class="fas fa-check-double mr-2"></i> Mark All as Read
                        </button>
                    </form>
                @endif
                <a href="{{ route('admin.welcome') }}" class="btn-back shadow-sm ml-2">
                    <i class="fas fa-th-large"></i> Dashboard
                </a>
            </div>
        </div>
    </div>
@stop

@section('content')
<div class="container-fluid pb-5">
    @include('admin.alert')

    <div class="card registry-table-card shadow-premium border-0 overflow-hidden" style="border-radius: 24px;">
        <div class="card-header border-0 bg-white py-4 px-4 d-flex align-items-center justify-content-between">
            <h3 class="card-title font-weight-bold text-dark mb-0 smallest text-uppercase letter-spacing-1 float-none">
                <i class="fas fa-stream mr-2 text-primary opacity-50"></i> All Notifications
            </h3>
            <div class="card-tools ml-auto">
                <span class="badge badge-primary-light text-primary px-3 py-2 rounded-pill font-weight-bold smallest uppercase letter-spacing-1">
                    <i class="fas fa-database mr-1"></i> {{ $notifications->total() }} TOTAL ALERTS
                </span>
            </div>
        </div>

        <div class="card-body p-0">
            <div class="list-group list-group-flush">
                @forelse ($styledNotifications as $note)
                    <a href="{{ $note['url'] }}" 
                       class="list-group-item list-group-item-action p-4 border-bottom {{ $note['is_read'] ? 'opacity-75 bg-light' : 'bg-white' }}"
                       style="transition: all 0.2s ease;">
                        <div class="d-flex w-100 justify-content-between align-items-center">
                            <div class="d-flex align-items-center flex-grow-1">
                                <div class="icon-box-soft {{ $note['tag_class'] == 'badge-info' ? 'bg-info-soft text-info' : ($note['tag_class'] == 'badge-success' ? 'bg-success-soft text-success' : 'bg-primary-soft text-primary') }} mr-4 d-flex align-items-center justify-content-center shadow-xs" 
                                     style="width:50px; height:50px; border-radius: 14px;">
                                    <i class="{{ $note['icon_class'] }} fa-lg"></i>
                                </div>
                                <div>
                                    <h6 class="{{ $note['is_read'] ? 'text-muted' : 'text-dark font-weight-bold' }} mb-1" style="font-size: 1rem;">
                                        {{ $note['message'] }}
                                    </h6>
                                    <div class="d-flex align-items-center" style="gap: 15px;">
                                        <span class="smallest font-weight-bold text-uppercase letter-spacing-1 {{ $note['is_read'] ? 'text-muted' : 'text-primary' }}">
                                            {{ $note['tag'] }}
                                        </span>
                                        <span class="text-muted smallest font-weight-bold uppercase letter-spacing-1">
                                            <i class="far fa-clock mr-1"></i> {{ $note['created_at_human'] }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div class="text-right ml-3">
                                @if(!$note['is_read'])
                                    <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:var(--primary);flex-shrink:0;"></span>
                                @endif
                                <i class="fas fa-chevron-right text-muted opacity-25 ml-3"></i>
                            </div>
                        </div>
                    </a>
                @empty
                    <div class="p-5 text-center">
                        <div class="py-5">
                            <i class="fas fa-bell-slash fa-4x text-muted opacity-25 mb-4 d-block"></i>
                            <h5 class="text-muted font-weight-bold">No notifications yet</h5>
                            <p class="text-secondary small">You've cleared all signals. We'll alert you when something happens.</p>
                        </div>
                    </div>
                @endforelse
            </div>
        </div>

        @if ($notifications->hasPages())
            <div class="card-footer bg-white border-top py-4 px-4 d-flex justify-content-between align-items-center">
                <div class="text-muted smallest font-weight-bold uppercase letter-spacing-1">Displaying {{ $notifications->firstItem() }} - {{ $notifications->lastItem() }} of {{ $notifications->total() }} alerts</div>
                <div>{{ $notifications->links('pagination::bootstrap-4') }}</div>
            </div>
        @endif
    </div>
</div>
@endsection

@section('css')
<style>
    .bg-info-soft { background: rgba(0, 123, 255, 0.1); }
    .bg-success-soft { background: rgba(40, 167, 69, 0.1); }
    .bg-primary-soft { background: rgba(70, 165, 172, 0.1); }
    .list-group-item:hover { transform: translateX(5px); z-index: 10; border-left: 4px solid var(--primary) !important; }
</style>
@endsection