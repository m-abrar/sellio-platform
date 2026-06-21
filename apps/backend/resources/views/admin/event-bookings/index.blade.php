{{--
    Administrative Events: Global Attendance Registry
    
    This view provides a central Dashboard for tracking event 
    registrations. It integrates high-fidelity audit trails for attendee 
    engagement, revenue settlement, and lifecycle status tracking (pending, 
    confirmed, cancelled). It facilitates efficient manifest management 
    through multi-dimensional filtering and responsive data architecture.
    
    @extends adminlte::page
    @context Event Booking Management
    @variables Paginator $bookings Paginated collection of EventBooking models.
--}}
@extends('adminlte::page')

@section('title', __('Event Ticketing | Details'))

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-6">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-ticket-alt mr-2 text-primary opacity-50"></i>
                    {{ __('Event Ticketing') }}
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">{{ __('Monitor ticket sales, attendee lists, and event registration metrics.') }}</p>
            </div>
            <div class="col-sm-6 text-right">
                <div class="d-flex justify-content-end align-items-center gap-12">
                    <a href="{{ route('admin.event-bookings.create') }}" class="btn btn-primary rounded-pill px-4 py-2 font-weight-bold shadow-premium smallest uppercase letter-spacing-1">
                        <i class="fas fa-plus mr-2"></i> {{ __('Register Guest') }}
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

        {{-- Filter Protocol --}}
        @include('admin.event-bookings._filter')

        {{-- Main Table --}}
        <div class="card registry-table-card">
            <div class="card-header border-0 bg-white py-4 px-4 d-flex align-items-center">
                <h3 class="card-title font-weight-bold text-dark text-uppercase smallest mb-0 float-none letter-spacing-1">{{ __('All Attendees') }}</h3>
                <div class="card-tools d-flex align-items-center ml-auto">
                    <span class="badge badge-primary-light text-primary px-3 py-2 rounded-pill font-weight-bold smallest uppercase mr-2">
                        <i class="fas fa-id-card mr-1"></i> {{ $bookings->total() }} {{ __('ENTRIES FOUND') }}
                    </span>
                    <button type="button" class="btn btn-tool text-muted" data-card-widget="maximize">
                        <i class="fas fa-expand"></i>
                    </button>
                </div>
            </div>
            <div class="card-body p-0">
                <div class="table-responsive">
                    <table id="bookings-table" class="table table-hover table-premium mb-0 datatable-init"
                           data-datatable-config='{"paging": false, "lengthChange": false, "searching": false, "ordering": true, "info": false, "dom": "t"}'>
                        <thead class="thead-light">
                            <tr>
                                <th class="pl-4 col-media-80">{{ __('Media') }}</th>
                                <th>{{ __('Event Specification') }}</th>
                                <th>{{ __('Attendee Principal') }}</th>
                                <th>{{ __('Date') }}</th>
                                <th class="text-right">{{ __('Settlement') }}</th>
                                <th class="text-center">{{ __('Status') }}</th>
                                <th class="text-right pr-4">{{ __('Actions') }}</th>
                            </tr>
                        </thead>
                        <tbody>
                            @forelse ($bookings as $booking)
                                <tr>
                                    <td class="text-center align-middle pl-4">
                                        <div class="table-img-preview shadow-sm mx-auto">
                                            <img src="{{ $booking->event->thumbnail_url ?? asset('images/fallbacks/default.jpg') }}" onerror="this.src='{{ asset('images/fallbacks/default.jpg') }}'">
                                        </div>
                                    </td>
                                    <td class="align-middle">
                                        <span class="d-block font-weight-bold text-dark mb-0">{{ $booking->event->title ?? __('N/A') }}</span>
                                        <div class="d-flex align-items-center mt-1 gap-10">
                                            @if($booking->event && $booking->event->category)
                                                <span class="badge badge-primary-light text-primary px-2 py-1 rounded-pill smallest font-weight-bold uppercase">
                                                    {{ $booking->event->category->title }}
                                                </span>
                                            @endif
                                            @if($booking->event && $booking->event->location)
                                                <span class="text-muted smallest font-weight-bold uppercase">
                                                    <i class="fas fa-map-marker-alt mr-1 text-danger opacity-50"></i>{{ $booking->event->location->title }}
                                                </span>
                                            @endif
                                        </div>
                                    </td>
                                    <td class="align-middle">
                                        <span class="d-block font-weight-bold text-dark mb-0 smallest uppercase letter-spacing-1">{{ $booking->user->name ?? __('Guest Attendee') }}</span>
                                        <div class="smallest text-muted text-monospace">{{ $booking->user->email ?? __('no-email') }}</div>
                                    </td>
                                    <td class="align-middle">
                                        <div class="font-weight-bold text-dark mb-0 smallest uppercase letter-spacing-1">{{ $booking->created_at->format('d M, Y') }}</div>
                                        <small class="text-muted smallest uppercase font-weight-bold"><i class="far fa-clock mr-1 text-primary opacity-50"></i> {{ $booking->created_at->format('H:i') }}</small>
                                    </td>
                                    <td class="align-middle text-right">
                                        <div class="font-weight-bold text-primary mb-0 text-monospace h6">${{ number_format($booking->total_price, 2) }}</div>
                                        @if($booking->quantity > 1)
                                            <div class="smallest text-muted font-weight-bold uppercase letter-spacing-1">{{ $booking->quantity }} {{ __('Tickets') }}</div>
                                        @endif
                                    </td>
                                    @php
                                        $statusMap = ['pending' => 'badge-warning-light', 'confirmed' => 'badge-success-light', 'cancelled' => 'badge-danger-light'];
                                        $statusClass = $statusMap[$booking->status] ?? 'badge-secondary-light';
                                    @endphp
                                    <td class="text-center align-middle">
                                        <span class="badge {{ $statusClass }} px-3 py-1 rounded-pill font-weight-bold smallest uppercase letter-spacing-1 badge-min-90">
                                            {{ $booking->status ?? 'Confirmed' }}
                                        </span>
                                    </td>
                                    <td class="text-right align-middle pr-4">
                                        <div class="btn-group btn-group-premium">
                                            <a href="{{ route('admin.event-bookings.show', $booking->id) }}" class="btn text-info" data-toggle="tooltip" title="Inspect Record"><i class="fas fa-eye"></i></a>
                                            <a href="{{ route('admin.event-bookings.edit', $booking->id) }}" class="btn text-primary" data-toggle="tooltip" title="Modify Record"><i class="fas fa-edit"></i></a>
                                        </div>
                                    </td>
                                </tr>
                            @empty
                                <tr class="empty-state">
                                    <td colspan="7" class="text-center py-5">
                                        <div class="py-4">
                                            <i class="fas fa-ticket-alt fa-4x text-muted opacity-25 mb-3 d-block"></i>
                                            <h5 class="text-muted font-weight-bold">{{ __('No Ticketing Records Found') }}</h5>
                                            <p class="small text-secondary mb-0">{{ __('No bookings recorded yet.') }}</p>
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
                    <div class="text-muted smallest font-weight-bold uppercase letter-spacing-1">{{ __('Displaying') }} {{ $bookings->firstItem() }} - {{ $bookings->lastItem() }} {{ __('of') }} {{ $bookings->total() }} {{ __('records') }}</div>
                    <div>{{ $bookings->withQueryString()->links('pagination::bootstrap-4') }}</div>
                </div>
            @endif
        </div>
    </div>
@endsection


@section('js')
<script src="{{ asset('admin-assets/pages/registry-index.js') }}"></script>
@endsection
