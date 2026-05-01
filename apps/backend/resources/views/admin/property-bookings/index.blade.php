@extends('adminlte::page')

@section('title', __('Property Bookings'))

@section('plugins.Datatables', true)

@section('content_header')
    <div class="container-fluid">
        <div class="row mb-4 align-items-end">
            <div class="col-sm-6">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-calendar-check mr-2 text-primary"></i>
                    {{ __('Rentals & Stays') }}
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">Manage property reservations, guest arrivals, and short-term stay schedules.</p>
            </div>
            <div class="col-sm-6 text-right">
                <a href="{{ route('admin.property-bookings.create') }}" class="btn btn-primary btn-sm rounded-pill px-4 font-weight-bold shadow-lg">
                    <i class="fas fa-plus-circle mr-1"></i> ADD BOOKING
                </a>
                <ol class="breadcrumb float-sm-right bg-transparent p-0 mt-3 small">
                    <li class="breadcrumb-item"><a href="{{ route('admin.welcome') }}">{{ __('Dashboard') }}</a></li>
                    <li class="breadcrumb-item active">{{ __('Property Bookings') }}</li>
                </ol>
            </div>
        </div>
    </div>
@stop

@section('content')
    <div class="container-fluid">
        @include('admin.alert')

        {{-- Premium Filter Card --}}
        <div class="card card-outline card-secondary shadow-sm mb-4">
            <div class="card-body py-3">
                <form method="GET" action="{{ route('admin.property-bookings.index') }}" class="row align-items-end justify-content-center">
                    <div class="col-auto">
                        <label class="small text-muted font-weight-bold uppercase letter-spacing-1">Property</label>
                        <select name="property" class="form-control shadow-xs">
                            <option value="">All</option>
                            @foreach ($properties as $p)
                                <option value="{{ $p->id }}" {{ request('property') == $p->id ? 'selected' : '' }}>
                                    {{ $p->title }}
                                </option>
                            @endforeach
                        </select>
                    </div>
                    <div class="col-auto">
                        <label class="small text-muted font-weight-bold uppercase letter-spacing-1">Status</label>
                        <select name="status" class="form-control shadow-xs">
                            <option value="">All</option>
                            @foreach (['pending', 'confirmed', 'cancelled'] as $s)
                                <option value="{{ $s }}" {{ $status == $s ? 'selected' : '' }}>
                                    {{ Str::title($s) }}
                                </option>
                            @endforeach
                        </select>
                    </div>
                    <div class="col-auto">
                        <label class="small text-muted font-weight-bold uppercase letter-spacing-1">From</label>
                        <input type="date" name="start_date" class="form-control shadow-xs" value="{{ request('start_date') }}">
                    </div>
                    <div class="col-auto">
                        <label class="small text-muted font-weight-bold uppercase letter-spacing-1">To</label>
                        <input type="date" name="end_date" class="form-control shadow-xs" value="{{ request('end_date') }}">
                    </div>
                    <div class="col-auto d-flex align-items-end" style="gap: 8px;">
                        <button type="submit" class="btn btn-primary font-weight-bold shadow-xs" style="height: 38px;">
                            <i class="fas fa-filter mr-1"></i> FILTER
                        </button>
                        <a href="{{ route('admin.property-bookings.index') }}" class="btn btn-default font-weight-bold shadow-xs" style="height: 38px;">
                            <i class="fas fa-undo"></i>
                        </a>
                    </div>
                </form>
            </div>
        </div>

        {{-- Main Table --}}
        <div class="card card-primary card-outline shadow-sm">
            <div class="card-header border-0 bg-white py-3">
                <h3 class="card-title font-weight-600 text-muted">All Property Bookings</h3>
            </div>

            <div class="card-body p-0">
                <div class="table-responsive">
                    <table id="bookings-table" class="table table-hover table-premium mb-0">
                        <thead class="thead-light">
                            <tr>
                                <th style="width: 70px" class="text-center">Media</th>
                                <th>{{ __('Property') }}</th>
                                <th>{{ __('Guest') }}</th>
                                <th>{{ __('Check-In') }}</th>
                                <th>{{ __('Check-Out') }}</th>
                                <th class="text-right">{{ __('Total') }}</th>
                                <th class="text-center">{{ __('Status') }}</th>
                                <th class="text-right px-4">{{ __('Actions') }}</th>
                            </tr>
                        </thead>
                        <tbody>
                            @forelse ($bookings as $booking)
                                @php
                                    $statusMap = [
                                        'confirmed' => 'success',
                                        'pending'   => 'warning',
                                        'cancelled' => 'danger',
                                    ];
                                    $statusClass = $statusMap[$booking->status] ?? 'secondary';
                                @endphp
                                <tr>
                                    <td class="text-center align-middle">
                                        <div class="table-img-preview shadow-xs">
                                            <img src="{{ $booking->property->thumbnail_url ?? asset('images/fallbacks/default.jpg') }}" 
                                                 alt="{{ $booking->property->title }}">
                                        </div>
                                    </td>

                                    <td class="align-middle">
                                        <span class="d-block font-weight-bold text-dark mb-0">
                                            {{ $booking->property->title ?? __('N/A') }}
                                        </span>
                                        <div class="text-xs mt-1">
                                            @if($booking->property && $booking->property->category)
                                                <span class="badge badge-primary-light text-primary px-2 py-1 mr-1" style="font-size: 0.6rem; border-radius: 4px;">
                                                    <i class="fas fa-tag mr-1"></i>{{ strtoupper($booking->property->category->title) }}
                                                </span>
                                            @endif
                                            @if($booking->property && $booking->property->location)
                                                <span class="text-muted" style="font-size: 0.7rem;">
                                                    <i class="fas fa-map-marker-alt mr-1 text-danger opacity-75"></i>{{ $booking->property->location->title }}
                                                </span>
                                            @endif
                                        </div>
                                    </td>

                                    <td class="align-middle">
                                        <div class="d-flex align-items-center">
                                            <div class="avatar-xs mr-2 bg-light rounded-circle text-center border shadow-xs d-flex align-items-center justify-content-center" style="width:32px; height:32px;">
                                                <i class="fas fa-user-circle text-muted"></i>
                                            </div>
                                            <div>
                                                <span class="d-block font-weight-bold text-dark mb-0" style="font-size: 0.9rem;">
                                                    {{ $booking->full_name ?: ($booking->user->name ?? __('Guest User')) }}
                                                </span>
                                                <div class="text-xs text-muted">
                                                    {{ $booking->email ?: ($booking->user->email ?? 'no-email@provided.com') }}
                                                    @if($booking->user_id)
                                                        <i class="fas fa-check-circle ml-1 text-success" title="Verified Account"></i>
                                                    @endif
                                                </div>
                                            </div>
                                        </div>
                                    </td>

                                    <td class="align-middle">
                                        <div class="font-weight-600">{{ $booking->check_in_date->format('M d, Y') }}</div>
                                        <small class="text-muted">{{ $booking->check_in_date->format('D') }}</small>
                                    </td>

                                    <td class="align-middle">
                                        <div class="font-weight-600">{{ $booking->check_out_date->format('M d, Y') }}</div>
                                        <small class="text-muted">{{ $booking->duration_nights }} {{ __('nights') }}</small>
                                    </td>

                                    <td class="align-middle text-right font-weight-bold text-primary">
                                        ${{ $booking->formatted_total }}
                                    </td>

                                    <td class="text-center align-middle">
                                        <span class="badge badge-{{ $statusClass }}-light px-3 py-1 text-uppercase shadow-xs"
                                              style="font-size: 0.7rem; letter-spacing: 0.5px;">
                                            {{ $booking->status }}
                                        </span>
                                    </td>

                                    <td class="text-right align-middle px-4">
                                        <div class="btn-group btn-group-premium shadow-sm">
                                            <a href="{{ route('admin.property-bookings.show', $booking->id) }}"
                                               class="btn btn-default btn-sm text-info"
                                               data-toggle="tooltip" title="{{ __('View') }}">
                                                <i class="fas fa-eye"></i>
                                            </a>
                                            <a href="{{ route('admin.property-bookings.edit', $booking->id) }}"
                                               class="btn btn-default btn-sm text-primary"
                                               data-toggle="tooltip" title="{{ __('Edit') }}">
                                                <i class="fas fa-edit"></i>
                                            </a>
                                            <form action="{{ route('admin.property-bookings.destroy', $booking->id) }}"
                                                  method="POST" class="d-inline"
                                                  onsubmit="return confirm('{{ __('Delete this booking permanently?') }}')">
                                                @csrf
                                                @method('DELETE')
                                                <button type="submit" class="btn btn-default btn-sm text-danger"
                                                        data-toggle="tooltip" title="{{ __('Delete') }}">
                                                    <i class="fas fa-trash-alt"></i>
                                                </button>
                                            </form>
                                        </div>
                                    </td>
                                </tr>
                            @empty
                                {{-- Handled by DataTables --}}
                            @endforelse
                        </tbody>
                    </table>
                </div>
            </div>

            @if($bookings->hasPages())
                <div class="card-footer bg-white border-0 py-3">
                    <div class="float-right">
                        {{ $bookings->withQueryString()->links('pagination::bootstrap-4') }}
                    </div>
                </div>
            @endif
        </div>
    </div>
@stop

@section('js')
<script>
    $(function () {
        $('[data-toggle="tooltip"]').tooltip();
    });
</script>
@endsection
