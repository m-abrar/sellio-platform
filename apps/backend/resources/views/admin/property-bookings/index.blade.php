{{--
    Administrative Real Estate: Rental & Stay Registry
    
    This view provides a high-fidelity audit trail of all property 
    reservations. It integrates operational metrics (revenue, duration), 
    lifecycle status tracking, and multi-dimensional filtering, serving 
    as the command center for short-term rental oversight.
    
    @extends adminlte::page
    @context Property Operational Administration
    @variables Paginator $bookings Paginated collection of PropertyBooking models.
--}}
@extends('adminlte::page')

@section('title', __('Rentals & Stays | Real Estate Intelligence'))

@section('css')
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css">
<style>
    .flatpickr-calendar { border-radius: 16px; border: 0; box-shadow: 0 15px 35px rgba(0,0,0,0.1), 0 5px 15px rgba(0,0,0,0.05); padding: 5px; }
    .flatpickr-day.selected, .flatpickr-day.startRange, .flatpickr-day.endRange, .flatpickr-day.selected.inRange, .flatpickr-day.startRange.inRange, .flatpickr-day.endRange.inRange, .flatpickr-day.selected:focus, .flatpickr-day.startRange:focus, .flatpickr-day.endRange:focus, .flatpickr-day.selected:hover, .flatpickr-day.startRange:hover, .flatpickr-day.endRange:hover, .flatpickr-day.prevMonthDay.selected, .flatpickr-day.nextMonthDay.selected, .flatpickr-day.prevMonthDay.startRange, .flatpickr-day.nextMonthDay.startRange, .flatpickr-day.prevMonthDay.endRange, .flatpickr-day.nextMonthDay.endRange { background: var(--primary) !important; border-color: var(--primary) !important; color: #ffffff !important; }
    .flatpickr-day.inRange, .flatpickr-day.prevMonthDay.inRange, .flatpickr-day.nextMonthDay.inRange, .flatpickr-day.today.inRange, .flatpickr-day.prevMonthDay.today.inRange, .flatpickr-day.nextMonthDay.today.inRange { background: var(--primary-soft) !important; border-color: transparent !important; color: var(--primary) !important; }
    .flatpickr-day:hover, .flatpickr-day.prevMonthDay:hover, .flatpickr-day.nextMonthDay:hover, .flatpickr-day:focus, .flatpickr-day.prevMonthDay:focus, .flatpickr-day.nextMonthDay:focus { background: var(--primary-soft) !important; border-color: transparent !important; color: var(--primary) !important; }
    .flatpickr-months .flatpickr-month { height: 40px; }
    .flatpickr-current-month { padding-top: 10px; font-weight: 700; }
    .flatpickr-day.today { border-color: var(--primary) !important; color: var(--primary) !important; }
    .flatpickr-day.today:hover, .flatpickr-day.today.selected { background: var(--primary) !important; color: #ffffff !important; }
</style>
@endsection

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-7">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-calendar-check mr-2 text-primary opacity-50"></i>
                    {{ __('Rentals & Stays') }}
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">Manage property reservations, guest arrivals, and short-term stay schedules.</p>
            </div>
            <div class="col-sm-5 text-right">
                <div class="d-flex justify-content-end align-items-center gap-12">
                    <a href="{{ route('admin.property-bookings.create') }}" class="btn btn-primary rounded-pill px-4 py-2 font-weight-bold shadow-premium smallest uppercase letter-spacing-1">
                        <i class="fas fa-plus-circle mr-2"></i> Add Booking
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
        @include('admin.property-bookings._filter')

        {{-- Main Table --}}
        <div class="card registry-table-card">
            <div class="card-header border-0 bg-white py-4 px-4 d-flex align-items-center">
                <h3 class="card-title font-weight-bold text-dark text-uppercase smallest mb-0 float-none letter-spacing-1">Reservation Registry</h3>
                <div class="card-tools d-flex align-items-center ml-auto">
                    <span class="badge badge-primary-light text-primary px-3 py-2 rounded-pill font-weight-bold smallest uppercase mr-2">
                        <i class="fas fa-chart-line mr-1"></i> {{ $bookings->total() }} RESERVATIONS
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
                                <th class="pl-4 col-media-70">Media</th>
                                <th>Property Asset</th>
                                <th>Guest Principal</th>
                                <th>Stay Duration</th>
                                <th class="text-right">Total Value</th>
                                <th class="text-center">Lifecycle</th>
                                <th class="text-right pr-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            @forelse ($bookings as $booking)
                                <tr>
                                    <td class="text-center align-middle pl-4">
                                        <div class="table-img-preview shadow-sm mx-auto">
                                            <img src="{{ $booking->property->thumbnail_url ?? asset('images/fallbacks/default.jpg') }}" onerror="this.src='{{ asset('images/fallbacks/default.jpg') }}'">
                                        </div>
                                    </td>
                                    <td class="align-middle">
                                        <span class="d-block font-weight-bold text-dark mb-0">{{ $booking->property->title ?? __('N/A') }}</span>
                                        <div class="d-flex align-items-center mt-1 gap-10">
                                            @if($booking->property && $booking->property->category)
                                                <span class="badge badge-primary-light text-primary px-2 py-1 rounded-pill smallest font-weight-bold uppercase">
                                                    {{ $booking->property->category->title }}
                                                </span>
                                            @endif
                                            @if($booking->property && $booking->property->location)
                                                <span class="text-muted smallest font-weight-bold uppercase">
                                                    <i class="fas fa-map-marker-alt mr-1 text-danger opacity-50"></i>{{ $booking->property->location->title }}
                                                </span>
                                            @endif
                                        </div>
                                    </td>

                                    <td class="align-middle">
                                        <span class="d-block font-weight-bold text-dark mb-0 smallest uppercase letter-spacing-1">
                                            {{ $booking->full_name ?: ($booking->user->name ?? __('Guest User')) }}
                                        </span>
                                        <div class="smallest text-muted text-monospace">
                                            {{ $booking->email ?: ($booking->user->email ?? 'no-email') }}
                                        </div>
                                    </td>

                                    <td class="align-middle">
                                        <div class="smallest font-weight-bold text-dark uppercase letter-spacing-1">
                                            {{ $booking->check_in_date->format('d M') }} — {{ $booking->check_out_date->format('d M Y') }}
                                        </div>
                                        <small class="text-muted smallest uppercase font-weight-bold">
                                            <i class="fas fa-moon mr-1 text-primary opacity-50"></i> {{ $booking->duration_nights }} Nights
                                        </small>
                                    </td>

                                    <td class="align-middle text-right">
                                        <div class="font-weight-bold text-success h6 mb-0">${{ $booking->formatted_total }}</div>
                                        <div class="smallest text-muted uppercase font-weight-bold">Revenue</div>
                                    </td>

                                    <td class="text-center align-middle">
                                        @php $status = $booking->getStatusMeta(); @endphp
                                        <span class="badge badge-{{ $status['color'] }}-light px-3 py-1 rounded-pill font-weight-bold smallest uppercase letter-spacing-1 badge-min-90">
                                            {{ $status['label'] }}
                                        </span>
                                    </td>

                                    <td class="text-right align-middle pr-4">
                                        <div class="btn-group btn-group-premium">
                                            <a href="{{ route('admin.property-bookings.show', $booking->id) }}" class="btn text-info" data-toggle="tooltip" title="Inspect Record"><i class="fas fa-eye"></i></a>
                                            <a href="{{ route('admin.property-bookings.edit', $booking->id) }}" class="btn text-primary" data-toggle="tooltip" title="Modify Record"><i class="fas fa-edit"></i></a>
                                            <form action="{{ route('admin.property-bookings.destroy', $booking->id) }}" method="POST" class="d-inline">
                                                @csrf @method('DELETE')
                                                 <button type="button" class="btn text-danger" 
                                                         data-toggle="tooltip" title="Purge Record" 
                                                         data-action="delete-trigger"
                                                         data-confirm-title="Purge Record?"
                                                         data-confirm-text="Are you sure you want to permanently delete this reservation?">
                                                     <i class="fas fa-trash-alt"></i>
                                                 </button>
                                            </form>
                                        </div>
                                    </td>
                                </tr>
                            @empty
                                @include('admin._partials._empty-state', [
                                    'colspan' => 7,
                                    'icon' => 'fas fa-calendar-times',
                                    'title' => 'No Reservation Intelligence Detected',
                                    'description' => 'The real-estate booking ledger is currently awaiting synchronized entries.'
                                ])
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


@section('js')
<script src="https://cdn.jsdelivr.net/npm/flatpickr"></script>
<script src="{{ asset('admin-assets/pages/registry-index.js') }}"></script>
<script src="{{ asset('admin-assets/pages/property-bookings-index.js') }}"></script>
@endsection

