@extends('adminlte::page')

@section('title', __('Event Ticketing | Registry Intelligence'))

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-6">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-ticket-alt mr-2 text-primary opacity-50"></i>
                    {{ __('Event Ticketing') }}
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">Monitor ticket sales, attendee lists, and event registration metrics.</p>
            </div>
            <div class="col-sm-6 text-right">
                <div class="d-flex justify-content-end align-items-center" style="gap: 12px;">
                    <a href="{{ route('admin.event-bookings.create') }}" class="btn btn-primary rounded-pill px-4 py-2 font-weight-bold shadow-premium smallest uppercase letter-spacing-1">
                        <i class="fas fa-plus mr-2"></i> Register Guest
                    </a>
                    <a href="{{ route('admin.welcome') }}" class="btn-back shadow-sm">
                        <i class="fas fa-th-large mr-2"></i> Dashboard
                    </a>
                </div>
            </div>
        </div>
    </div>
@stop

@section('content')
    <div class="container-fluid pb-5">
        @include('admin.alert')

        {{-- Premium Filter Card --}}
        <div class="card card-premium shadow-sm mb-4 border-0">
            <div class="card-body py-4 px-4">
                <form method="GET" action="{{ route('admin.event-bookings.index') }}">
                    <div class="row align-items-end">
                        <div class="col-md-3">
                            <label class="smallest font-weight-bold text-secondary text-uppercase mb-2 letter-spacing-1">Event Identification</label>
                            <div class="input-group shadow-xs">
                                <div class="input-group-prepend">
                                    <span class="input-group-text bg-white border-right-0"><i class="fas fa-ticket-alt text-primary"></i></span>
                                </div>
                                <select name="event_id" class="form-control border-left-0 select2">
                                    <option value="">All Events Intelligence</option>
                                    @foreach($events as $e)
                                        <option value="{{ $e->id }}" {{ request('event_id') == $e->id ? 'selected' : '' }}>{{ $e->title }}</option>
                                    @endforeach
                                </select>
                            </div>
                        </div>
                        <div class="col-md-2">
                            <label class="smallest font-weight-bold text-secondary text-uppercase mb-2 letter-spacing-1">Classification</label>
                            <div class="input-group shadow-xs">
                                <div class="input-group-prepend">
                                    <span class="input-group-text bg-white border-right-0"><i class="fas fa-tags text-primary"></i></span>
                                </div>
                                <select name="category" class="form-control border-left-0">
                                    <option value="">All Categories</option>
                                    @foreach ($categories as $c)
                                        <option value="{{ $c->id }}" {{ request('category') == $c->id ? 'selected' : '' }}>{{ $c->title }}</option>
                                    @endforeach
                                </select>
                            </div>
                        </div>
                        <div class="col-md-2">
                            <label class="smallest font-weight-bold text-secondary text-uppercase mb-2 letter-spacing-1">Lifecycle Status</label>
                            <div class="input-group shadow-xs">
                                <div class="input-group-prepend">
                                    <span class="input-group-text bg-white border-right-0"><i class="fas fa-filter text-primary"></i></span>
                                </div>
                                <select name="status" class="form-control border-left-0">
                                    <option value="">All Statuses</option>
                                    <option value="pending" {{ $status == 'pending' ? 'selected' : '' }}>Pending</option>
                                    <option value="confirmed" {{ $status == 'confirmed' ? 'selected' : '' }}>Confirmed</option>
                                    <option value="cancelled" {{ $status == 'cancelled' ? 'selected' : '' }}>Cancelled</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-md-5">
                            <div class="d-flex" style="gap: 10px;">
                                <button type="submit" class="btn btn-primary flex-grow-1 font-weight-bold smallest uppercase">
                                    <i class="fas fa-sync-alt mr-2"></i> REFRESH REGISTRY
                                </button>
                                <a href="{{ route('admin.event-bookings.index') }}" class="btn btn-back px-3 border shadow-sm d-flex align-items-center justify-content-center" data-toggle="tooltip" title="Reset Filters">
                                    <i class="fas fa-undo text-danger m-0"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>

        {{-- Main Table --}}
        <div class="card card-premium shadow-premium border-0 overflow-hidden">
            <div class="card-header border-0 bg-white py-4 px-4 d-flex align-items-center justify-content-between">
                <h3 class="card-title font-weight-bold text-dark mb-0 smallest text-uppercase letter-spacing-1 float-none">
                    <i class="fas fa-list-ul mr-2 text-primary opacity-50"></i> Ticketing Ledger
                </h3>
            </div>

            <div class="card-body p-0">
                <div class="table-responsive">
                    <table id="bookings-table" class="table table-hover table-premium mb-0">
                        <thead class="thead-light">
                            <tr>
                                <th class="pl-4" style="width: 70px">Media</th>
                                <th>Event Specification</th>
                                <th>Attendee Principal</th>
                                <th>Registry Date</th>
                                <th class="text-right">Settlement</th>
                                <th class="text-center">Lifecycle</th>
                                <th class="text-right pr-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            @forelse ($bookings as $booking)
                                <tr>
                                    <td class="text-center align-middle pl-4">
                                        <div class="icon-box-preview shadow-xs rounded overflow-hidden" style="width: 54px; height: 54px;">
                                            <img src="{{ $booking->event->thumbnail_url ?? asset('images/fallbacks/default.jpg') }}" 
                                                 class="w-100 h-100 object-fit-cover"
                                                 alt="{{ $booking->event->title ?? 'Event' }}"
                                                 onerror="this.src='{{ asset('images/fallbacks/default.jpg') }}'">
                                        </div>
                                    </td>

                                    <td class="align-middle">
                                        <span class="d-block font-weight-bold text-dark mb-1">
                                            {{ $booking->event->title ?? __('N/A') }}
                                        </span>
                                        <div class="d-flex align-items-center">
                                            @if($booking->event && $booking->event->category)
                                                <span class="badge badge-primary-light text-primary px-2 py-1 mr-2 rounded-pill smallest font-weight-bold uppercase letter-spacing-1 shadow-xs">
                                                    {{ $booking->event->category->title }}
                                                </span>
                                            @endif
                                            @if($booking->event && $booking->event->location)
                                                <span class="text-muted smallest font-weight-bold uppercase letter-spacing-1">
                                                    <i class="fas fa-map-marker-alt mr-1 text-danger opacity-50"></i>{{ $booking->event->location->title }}
                                                </span>
                                            @endif
                                        </div>
                                    </td>

                                    <td class="align-middle">
                                        @if($booking->user)
                                            <div class="d-flex align-items-center">
                                                <div class="icon-box-soft bg-primary-soft mr-3 d-flex align-items-center justify-content-center shadow-xs" style="width:36px; height:36px; border-radius: 8px;">
                                                    <i class="fas fa-user-tie text-primary smallest"></i>
                                                </div>
                                                <div>
                                                    <span class="d-block font-weight-bold text-dark mb-0 smallest uppercase letter-spacing-1">
                                                        {{ $booking->user->name }}
                                                    </span>
                                                    <div class="smallest text-muted text-monospace">
                                                        {{ $booking->user->email }}
                                                    </div>
                                                </div>
                                            </div>
                                        @else
                                            <span class="badge badge-secondary-light text-secondary px-3 py-1 rounded-pill smallest font-weight-bold uppercase letter-spacing-1">
                                                {{ __('Guest Attendee') }}
                                            </span>
                                        @endif
                                    </td>

                                    <td class="align-middle">
                                        <div class="smallest font-weight-bold text-dark uppercase letter-spacing-1">
                                            {{ $booking->created_at->format('d M, Y') }}
                                        </div>
                                        <small class="text-muted smallest uppercase letter-spacing-1">
                                            <i class="far fa-clock mr-1 text-primary opacity-50"></i> {{ $booking->created_at->format('H:i') }}
                                        </small>
                                    </td>

                                    <td class="align-middle text-right">
                                        <div class="h6 font-weight-bold text-primary mb-0 text-monospace">
                                            ${{ number_format($booking->total_price, 2) }}
                                        </div>
                                        @if($booking->quantity > 1)
                                            <div class="smallest text-muted font-weight-bold uppercase letter-spacing-1">
                                                {{ $booking->quantity }} Tickets
                                            </div>
                                        @endif
                                    </td>

                                    @php
                                        $statusMap = [
                                            'pending' => 'badge-warning-light text-warning',
                                            'confirmed' => 'badge-success-light text-success',
                                            'cancelled' => 'badge-danger-light text-danger'
                                        ];
                                        $statusClass = $statusMap[$booking->status] ?? 'badge-info-light text-info';
                                    @endphp
                                    <td class="text-center align-middle">
                                        <span class="badge {{ $statusClass }} px-3 py-2 rounded-pill font-weight-bold smallest uppercase letter-spacing-1 shadow-xs" style="min-width: 100px;">
                                            {{ $booking->status ?? 'Confirmed' }}
                                        </span>
                                    </td>

                                    <td class="text-right align-middle pr-4">
                                        <div class="btn-group btn-group-premium shadow-xs rounded-pill border overflow-hidden">
                                            <a href="{{ route('admin.event-bookings.show', $booking->id) }}"
                                               class="btn btn-white text-info py-2 px-3 d-inline-flex align-items-center border-right"
                                               data-toggle="tooltip" title="Inspect Record">
                                                <i class="fas fa-eye"></i>
                                            </a>
                                            <a href="{{ route('admin.event-bookings.edit', $booking->id) }}"
                                               class="btn btn-white text-primary py-2 px-3 d-inline-flex align-items-center"
                                               data-toggle="tooltip" title="Modify Record">
                                                <i class="fas fa-edit"></i>
                                            </a>
                                        </div>
                                    </td>
                                </tr>
                            @empty
                                <tr class="empty-state">
                                    <td colspan="7" class="text-center py-5">
                                        <div class="py-4">
                                            <i class="fas fa-ticket-alt fa-4x text-muted opacity-25 mb-3 d-block"></i>
                                            <h5 class="text-muted font-weight-bold">No Ticketing Records Found</h5>
                                            <p class="small text-secondary mb-0">The registration ledger is currently awaiting synchronized entries.</p>
                                        </div>
                                    </td>
                                </tr>
                            @endforelse
                        </tbody>
                    </table>
                </div>
            </div>

            @if($bookings->hasPages())
                <div class="card-footer bg-white border-top py-4 px-4 d-flex justify-content-between align-items-center">
                    <div class="text-muted smallest font-weight-bold uppercase letter-spacing-1">Displaying {{ $bookings->firstItem() }} - {{ $bookings->lastItem() }} of {{ $bookings->total() }} records</div>
                    <div>{{ $bookings->withQueryString()->links('pagination::bootstrap-4') }}</div>
                </div>
            @endif
        </div>
    </div>
@endsection

@section('css')
<style>
    .text-monospace { font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace !important; }
    .object-fit-cover { object-fit: cover; }
    .bg-primary-soft { background: rgba(70, 165, 172, 0.1) !important; }
    .badge-info-light { background: rgba(23, 162, 184, 0.1) !important; }
</style>
@endsection

@section('js')
<script>
    $(document).ready(function() {
        $('[data-toggle="tooltip"]').tooltip();
        $('.select2').select2({
            theme: 'bootstrap4',
            placeholder: 'Select identification'
        });
    });
</script>
@endsection
