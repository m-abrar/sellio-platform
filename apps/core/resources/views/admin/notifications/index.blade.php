@extends('adminlte::page')

@section('title', 'Admin Notifications')

@section('content_header')
    <h1><i class="fas fa-bell"></i> Admin Notifications</h1>
@stop

@section('content')

<div class="card shadow-sm rounded-3">
    <div class="card-header d-flex align-items-center">
        <h3 class="card-title mb-0 flex-grow-1">
            All Notifications 
            {{-- Use the total count from the original paginator object --}}
            <small class="text-muted ml-2">({{ $notifications->total() }} total)</small>
        </h3>
        
        {{-- Mark All as Read Form --}}
        {{-- Only show button if there are unread notifications --}}
        @if (Auth::user()->unreadNotifications()->exists())
            <form method="POST" action="{{ route('admin.notifications.readall') }}" class="ms-auto">
                @csrf
                <button type="submit" class="btn btn-primary btn-sm">
                    <i class="fas fa-check-double"></i> Mark All as Read
                </button>
            </form>
        @endif
    </div>

    <div class="card-body p-0">
        {{-- Using list-group-flush to remove border on first/last item --}}
        <div class="list-group list-group-flush">
        @forelse ($styledNotifications as $note)
            {{-- List Group Item for Notification --}}
            <a href="{{ $note['url'] }}" 
                class="list-group-item list-group-item-action p-3 {{ $note['is_read'] ? 'text-muted list-group-item-light' : 'bg-white font-weight-bold' }}"
                >
                    <div class="d-flex w-100 justify-content-between align-items-center">

                        {{-- LEFT: Icon + Message --}}
                        <div class="d-flex align-items-center flex-grow-1">
                            <i class="{{ $note['icon_class'] }} fa-fw mr-3" style="min-width: 25px;"></i>
                            <div class="text-start">
                                <h6 class="{{ $note['is_read'] ? 'text-muted' : 'text-dark font-weight-bold' }} mb-1">
                                    {{ $note['message'] }}
                                </h6>
                            </div>
                        </div>

                        {{-- RIGHT: Tag + Time --}}
                        <div class="text-end ms-3" style="min-width: 110px;">
                            <span class="badge {{ $note['tag_class'] }} mb-1">{{ $note['tag'] }}</span><br>
                            <small class="text-secondary">{{ $note['created_at_human'] }}</small>
                        </div>
                    </div>
                </a>

        @empty
            <p class="p-4 text-center text-muted">
                <i class="fas fa-info-circle"></i> No notifications found. You're all caught up!
            </p>
        @endforelse
        </div> {{-- End list-group --}}
    </div>
    
    {{-- Pagination links in the card footer if paginated --}}
    @if ($notifications instanceof \Illuminate\Contracts\Pagination\Paginator)
        <div class="card-footer clearfix">
            {{ $notifications->links('pagination::bootstrap-4') }} {{-- Use the standard AdminLTE pagination style --}}
        </div>
    @endif
</div>

@endsection