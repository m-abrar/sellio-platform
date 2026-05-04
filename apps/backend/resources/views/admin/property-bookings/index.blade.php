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
    <div class="container-fluid">
        @include('admin.alert')

        {{-- Glass Filter Card --}}
        <div class="card card-premium shadow-sm mb-4 border-0">
            <div class="card-body py-4 px-4">
                <form method="GET" action="{{ route('admin.property-bookings.index') }}">
                    <div class="row align-items-end">
                        <div class="col-md-3">
                            <label class="smallest font-weight-bold text-secondary text-uppercase mb-2 letter-spacing-1">Property Focus</label>
                            <div class="input-group border rounded shadow-xs bg-white" style="height: 46px; padding: 2px;">
                                <div class="input-group-prepend border-0">
                                    <span class="input-group-text bg-white border-0 py-0"><i class="fas fa-home text-primary"></i></span>
                                </div>
                                <select name="property" class="form-control border-0 custom-select shadow-none bg-white h-100 py-0 select2">
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
                            <label class="smallest font-weight-bold text-secondary text-uppercase mb-2 letter-spacing-1">Booking Lifecycle</label>
                            <div class="input-group border rounded shadow-xs bg-white" style="height: 46px; padding: 2px;">
                                <div class="input-group-prepend border-0">
                                    <span class="input-group-text bg-white border-0 py-0"><i class="fas fa-traffic-light text-primary"></i></span>
                                </div>
                                <select name="status" class="form-control border-0 custom-select shadow-none bg-white h-100 py-0">
                                    <option value="">All Statuses</option>
                                    @foreach (['pending', 'confirmed', 'cancelled'] as $s)
                                        <option value="{{ $s }}" {{ request('status') == $s ? 'selected' : '' }}>
                                            {{ Str::title($s) }}
                                        </option>
                                    @endforeach
                                </select>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <label class="smallest font-weight-bold text-secondary text-uppercase mb-2 letter-spacing-1">Temporal Range</label>
                            <div class="d-flex align-items-center" style="gap: 10px;">
                                <div class="input-group border rounded shadow-xs bg-white flex-grow-1" style="height: 46px; padding: 2px;">
                                    <input type="date" name="start_date" class="form-control border-0 shadow-none bg-white h-100 py-0 smallest" value="{{ request('start_date') }}">
                                </div>
                                <span class="text-muted smallest font-weight-bold uppercase letter-spacing-1">to</span>
                                <div class="input-group border rounded shadow-xs bg-white flex-grow-1" style="height: 46px; padding: 2px;">
                                    <input type="date" name="end_date" class="form-control border-0 shadow-none bg-white h-100 py-0 smallest" value="{{ request('end_date') }}">
                                </div>
                            </div>
                        </div>
                        <div class="col-md-2">
                            <div class="btn-group w-100 shadow-sm rounded-pill overflow-hidden border" style="height: 46px;">
                                <button type="submit" class="btn btn-primary font-weight-bold smallest uppercase d-flex align-items-center justify-content-center">
                                    <i class="fas fa-sync-alt mr-2"></i> UPDATE
                                </button>
                                <a href="{{ route('admin.property-bookings.index') }}" class="btn btn-white px-3 border-left d-flex align-items-center justify-content-center">
                                    <i class="fas fa-undo text-danger"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>

        {{-- Main Table --}}
        <div class="card card-premium overflow-hidden">
            <div class="card-header border-0 bg-white py-4 px-4 d-flex align-items-center">
                <h3 class="card-title font-weight-bold text-dark mb-0 smallest text-uppercase letter-spacing-1">
                    <i class="fas fa-list-ul mr-2 text-primary opacity-50"></i> Reservation Ledger
                </h3>
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
                                        <div class="icon-box-preview shadow-xs rounded overflow-hidden" style="width: 54px; height: 54px;">
                                            <img src="{{ $booking->property->thumbnail_url ?? asset('images/fallbacks/default.jpg') }}" 
                                                 class="w-100 h-100 object-fit-cover"
                                                 alt="{{ $booking->property->title }}">
                                        </div>
                                    </td>

                                    <td class="align-middle">
                                        <span class="d-block font-weight-bold text-dark mb-1">
                                            {{ $booking->property->title ?? __('N/A') }}
                                        </span>
                                        <div class="d-flex align-items-center">
                                            @if($booking->property && $booking->property->category)
                                                <span class="badge badge-primary-light text-primary px-2 py-1 mr-2 rounded-pill smallest font-weight-bold uppercase letter-spacing-1">
                                                    {{ $booking->property->category->title }}
                                                </span>
                                            @endif
                                            @if($booking->property && $booking->property->location)
                                                <span class="text-muted smallest font-weight-bold uppercase letter-spacing-1">
                                                    <i class="fas fa-map-marker-alt mr-1 text-danger opacity-75"></i>{{ $booking->property->location->title }}
                                                </span>
                                            @endif
                                        </div>
                                    </td>

                                    <td class="align-middle">
                                        <div class="d-flex align-items-center">
                                            <div class="icon-box-soft bg-primary-soft mr-3 d-flex align-items-center justify-content-center shadow-xs" style="width:36px; height:36px; border-radius: 8px;">
                                                <i class="fas fa-user-tie text-primary smallest"></i>
                                            </div>
                                            <div>
                                                <span class="d-block font-weight-bold text-dark mb-0 smallest uppercase letter-spacing-1">
                                                    {{ $booking->full_name ?: ($booking->user->name ?? __('Guest User')) }}
                                                </span>
                                                <div class="smallest text-muted text-monospace">
                                                    {{ $booking->email ?: ($booking->user->email ?? 'no-email@provided.com') }}
                                                </div>
                                            </div>
                                        </div>
                                    </td>

                                    <td class="align-middle">
                                        <div class="smallest font-weight-bold text-dark uppercase letter-spacing-1">
                                            {{ $booking->check_in_date->format('d M') }} — {{ $booking->check_out_date->format('d M Y') }}
                                        </div>
                                        <small class="text-muted smallest uppercase letter-spacing-1">
                                            <i class="fas fa-moon mr-1 text-primary opacity-50"></i> {{ $booking->duration_nights }} Nights
                                        </small>
                                    </td>

                                    <td class="align-middle text-right">
                                        <div class="font-weight-bold text-success h6 mb-0">${{ $booking->formatted_total }}</div>
                                        <div class="smallest text-muted uppercase letter-spacing-1">Settled Revenue</div>
                                    </td>

                                    @php
                                        $statusMap = ['confirmed' => 'badge-success-light text-success', 'pending' => 'badge-warning-light text-warning', 'cancelled' => 'badge-danger-light text-danger'];
                                        $statusClass = $statusMap[$booking->status] ?? 'badge-secondary-light text-secondary';
                                    @endphp
                                    <td class="text-center align-middle">
                                        <span class="badge {{ $statusClass }} px-3 py-2 rounded-pill font-weight-bold smallest uppercase letter-spacing-1 shadow-xs" style="min-width: 100px;">
                                            {{ $booking->status }}
                                        </span>
                                    </td>

                                    <td class="text-right align-middle pr-4">
                                        <div class="btn-group btn-group-premium shadow-xs rounded-pill border overflow-hidden">
                                            <a href="{{ route('admin.property-bookings.show', $booking->id) }}"
                                               class="btn btn-white text-info py-2 px-3 d-inline-flex align-items-center"
                                               data-toggle="tooltip" title="Inspect Record">
                                                <i class="fas fa-eye"></i>
                                            </a>
                                            <a href="{{ route('admin.property-bookings.edit', $booking->id) }}"
                                               class="btn btn-white text-primary py-2 px-3 border-left d-inline-flex align-items-center"
                                               data-toggle="tooltip" title="Modify Record">
                                                <i class="fas fa-edit"></i>
                                            </a>
                                            <form id="delete-form-{{ $booking->id }}" action="{{ route('admin.property-bookings.destroy', $booking->id) }}" method="POST" class="d-inline">
                                                @csrf @method('DELETE')
                                                <button type="button" class="btn btn-white text-danger py-2 px-3 border-left d-inline-flex align-items-center" 
                                                        data-toggle="tooltip" title="Terminate Record"
                                                        onclick="confirmDelete('delete-form-{{ $booking->id }}', 'Void Reservation?', 'This will permanently remove this property booking record.', 'Confirm')">
                                                    <i class="fas fa-trash-alt"></i>
                                                </button>
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
    .text-monospace { font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace !important; }
    .select2-container--bootstrap4 .select2-selection--single { height: 100% !important; border: 0 !important; background: transparent !important; }
    .select2-container--bootstrap4 .select2-selection--single .select2-selection__rendered { line-height: 40px !important; padding-left: 0 !important; font-weight: 600 !important; font-size: 0.85rem !important; }
    .select2-container--bootstrap4 .select2-selection--single .select2-selection__arrow { top: 50% !important; transform: translateY(-50%) !important; }
    .object-fit-cover { object-fit: cover; }
</style>
@endsection

@section('js')
@include('admin._partials._sweetalert')
<script>
    $(document).ready(function() {
        $('[data-toggle="tooltip"]').tooltip();
        $('.select2').select2({
            theme: 'bootstrap4',
            width: '100%',
            placeholder: "Select Property"
        });
    });
</script>
@endsection
