@extends('adminlte::page')

@section('title', __('Rentals & Stays | Real Estate Intelligence'))

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
                <div class="d-flex justify-content-end align-items-center" style="gap: 12px;">
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
        <div class="card registry-card-premium registry-filter-card mb-4">
            <div class="card-body">
                <form method="GET" action="{{ url()->current() }}">
                    <div class="row align-items-end">
                        <div class="col-md-3">
                            <label class="form-label-premium">Property Focus</label>
                            <div class="input-group input-group-premium">
                                <div class="input-group-prepend">
                                    <span class="input-group-text"><i class="fas fa-home text-xs"></i></span>
                                </div>
                                <select name="property" class="form-control select2">
                                    <option value="">All Inventory</option>
                                    @foreach ($properties as $p)
                                        <option value="{{ $p->id }}" {{ request('property') == $p->id ? 'selected' : '' }}>
                                            {{ $p->title }}
                                        </option>
                                    @endforeach
                                </select>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <label class="form-label-premium">Booking Lifecycle</label>
                            <div class="input-group input-group-premium">
                                <div class="input-group-prepend">
                                    <span class="input-group-text"><i class="fas fa-traffic-light text-xs"></i></span>
                                </div>
                                <select name="status" class="form-control select2">
                                    <option value="all">All Lifecycle States</option>
                                    @foreach (['pending' => 'Pending Review', 'confirmed' => 'Confirmed Stay', 'cancelled' => 'Cancelled'] as $val => $label)
                                        <option value="{{ $val }}" {{ request('status') == $val ? 'selected' : '' }}>
                                            {{ $label }}
                                        </option>
                                    @endforeach
                                </select>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <label class="form-label-premium">Temporal Range</label>
                            <div class="d-flex align-items-center" style="gap: 10px;">
                                <div class="input-group input-group-premium flex-grow-1">
                                    <input type="date" name="start_date" class="form-control" value="{{ request('start_date') }}">
                                </div>
                                <div class="input-group input-group-premium flex-grow-1">
                                    <input type="date" name="end_date" class="form-control" value="{{ request('end_date') }}">
                                </div>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="d-flex align-items-center justify-content-end" style="gap: 12px;">
                                <button type="submit" class="btn-filter-premium flex-grow-1">
                                    <i class="fas fa-sync-alt mr-2"></i> UPDATE
                                </button>
                                <a href="{{ url()->current() }}" class="btn-reset-premium" data-toggle="tooltip" title="Reset Filters">
                                    <i class="fas fa-undo"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>

        {{-- Main Table --}}
        <div class="card registry-table-card">
            <div class="card-header border-0 bg-white py-4 px-4 d-flex align-items-center">
                <h3 class="card-title font-weight-bold text-dark text-uppercase smallest mb-0 float-none" style="letter-spacing: 1px;">Reservation Registry</h3>
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
                    <table id="bookings-table" class="table table-hover table-premium mb-0">
                        <thead class="thead-light">
                            <tr>
                                <th class="pl-4" style="width: 70px">Media</th>
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
                                        <div class="d-flex align-items-center mt-1" style="gap: 10px;">
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

                                    @php
                                        $statusMap = ['confirmed' => 'badge-success-light', 'pending' => 'badge-warning-light', 'cancelled' => 'badge-danger-light'];
                                        $statusClass = $statusMap[$booking->status] ?? 'badge-secondary-light';
                                    @endphp
                                    <td class="text-center align-middle">
                                        <span class="badge {{ $statusClass }} px-3 py-1 rounded-pill font-weight-bold smallest uppercase letter-spacing-1" style="min-width: 90px;">
                                            {{ $booking->status }}
                                        </span>
                                    </td>

                                    <td class="text-right align-middle pr-4">
                                        <div class="btn-group btn-group-premium">
                                            <a href="{{ route('admin.property-bookings.show', $booking->id) }}" class="btn text-info" data-toggle="tooltip" title="Inspect Record"><i class="fas fa-eye"></i></a>
                                            <a href="{{ route('admin.property-bookings.edit', $booking->id) }}" class="btn text-primary" data-toggle="tooltip" title="Modify Record"><i class="fas fa-edit"></i></a>
                                            <form action="{{ route('admin.property-bookings.destroy', $booking->id) }}" method="POST" class="d-inline">
                                                @csrf @method('DELETE')
                                                <button type="submit" class="btn text-danger" data-toggle="tooltip" title="Purge Record" onclick="return confirm('Permanently delete booking?')"><i class="fas fa-trash-alt"></i></button>
                                            </form>
                                        </div>
                                    </td>
                                </tr>
                            @empty
                                <tr class="empty-state">
                                    <td colspan="7" class="text-center py-5">
                                        <div class="py-4">
                                            <i class="fas fa-calendar-times fa-4x text-muted opacity-25 mb-3 d-block"></i>
                                            <h5 class="text-muted font-weight-bold">No Reservation Intelligence Detected</h5>
                                            <p class="small text-secondary mb-0">The real-estate booking ledger is currently awaiting synchronized entries.</p>
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
    .input-group-premium .select2-container { flex: 1 1 auto !important; width: 1% !important; }
    .input-group-premium .select2-container .select2-selection--single { height: 46px !important; border: 0 !important; padding-top: 10px !important; border-radius: 0 12px 12px 0 !important; }
</style>
@endsection

@section('js')
@include('admin._partials._sweetalert')
<script>
    $(document).ready(function() {
        if (typeof $.fn.select2 === 'function') {
            $('.select2').select2({ theme: 'bootstrap4', width: '100%' });
        }
        $('[data-toggle="tooltip"]').tooltip();

        if ($('#bookings-table tbody tr:not(.empty-state)').length > 0) {
            $('#bookings-table').DataTable({
                "paging": false,
                "lengthChange": false,
                "searching": true,
                "ordering": true,
                "info": false,
                "autoWidth": false,
                "responsive": true,
                "dom": '<"row pt-3"<"col-sm-12"f>>t',
                "language": {
                    "search": "",
                    "searchPlaceholder": "Search reservations..."
                }
            });
            $('.dataTables_filter input').addClass('form-control form-control-premium shadow-none border-light mb-3').css('width', '250px');
        }
    });
</script>
@endsection

