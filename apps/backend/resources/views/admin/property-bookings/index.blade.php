@extends('adminlte::page')

@section('title', __('Property Bookings'))

@section('plugins.Datatables', true)

@section('content_header')
    <div class="container-fluid">
        <div class="row mb-2">
            <div class="col-sm-6">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-calendar-check mr-2 text-primary"></i>
                    Property Bookings
                </h1>
            </div>
            <div class="col-sm-6 text-right">
                <a href="{{ route('admin.property-bookings.create') }}" class="btn btn-primary btn-flat shadow-sm">
                    <i class="fas fa-plus mr-1"></i> Add Booking
                </a>
            </div>
        </div>
    </div>
@stop

@section('content')
    <div class="container-fluid">
        @include('admin.alert')

        {{-- Premium Filter Card --}}
        <div class="card card-outline card-secondary shadow-sm mb-4">
            <div class="card-body py-4">
                <form method="GET" action="{{ route('admin.property-bookings.index') }}">
                    <div class="row align-items-end">
                        <div class="col-md-3">
                            <label class="small text-muted font-weight-bold uppercase letter-spacing-1">Property</label>
                            <select name="property" class="form-control shadow-xs">
                                <option value="">All Properties</option>
                                @foreach ($properties as $p)
                                    <option value="{{ $p->id }}" {{ request('property') == $p->id ? 'selected' : '' }}>
                                        {{ $p->title }}
                                    </option>
                                @endforeach
                            </select>
                        </div>
                        <div class="col-md-2">
                            <label class="small text-muted font-weight-bold uppercase letter-spacing-1">Status</label>
                            <select name="status" class="form-control shadow-xs">
                                <option value="">All Statuses</option>
                                @foreach (['pending', 'confirmed', 'cancelled'] as $s)
                                    <option value="{{ $s }}" {{ $status == $s ? 'selected' : '' }}>
                                        {{ Str::title($s) }}
                                    </option>
                                @endforeach
                            </select>
                        </div>
                        <div class="col-md-2">
                            <label class="small text-muted font-weight-bold uppercase letter-spacing-1">Check-In From</label>
                            <input type="date" name="start_date" class="form-control shadow-xs" value="{{ request('start_date') }}">
                        </div>
                        <div class="col-md-2">
                            <label class="small text-muted font-weight-bold uppercase letter-spacing-1">To</label>
                            <input type="date" name="end_date" class="form-control shadow-xs" value="{{ request('end_date') }}">
                        </div>
                        <div class="col-md-3 d-flex align-items-end" style="gap: 10px;">
                            <button type="submit" class="btn btn-primary flex-fill font-weight-bold shadow-xs">
                                <i class="fas fa-filter mr-1"></i> APPLY
                            </button>
                            <a href="{{ route('admin.property-bookings.index') }}" class="btn btn-default font-weight-bold shadow-xs">
                                <i class="fas fa-undo"></i>
                            </a>
                        </div>
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
                                <th style="width: 60px" class="text-center">{{ __('ID') }}</th>
                                <th style="width: 60px" class="text-center">{{ __('Item') }}</th>
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
                                        <span class="text-muted font-weight-bold text-monospace">#{{ $booking->id }}</span>
                                    </td>
                                    <td class="text-center align-middle">
                                        <div class="product-img-preview shadow-xs" style="width: 50px; height: 50px; border-radius: 6px; overflow:hidden; margin: auto; border: 1px solid #eee;">
                                            <img src="{{ $booking->property->thumbnail_url ?? asset('images/fallbacks/default.jpg') }}" 
                                                 alt="{{ $booking->property->title }}"
                                                 class="w-100 h-100"
                                                 style="object-fit: cover;">
                                        </div>
                                    </td>

                                    <td class="align-middle">
                                        <span class="d-block font-weight-bold text-dark mb-0">
                                            {{ $booking->property->title ?? __('N/A') }}
                                        </span>
                                        <small class="text-muted">ID: #{{ $booking->property_id }}</small>
                                    </td>

                                    <td class="align-middle">
                                        <span class="d-block font-weight-bold text-dark mb-0">{{ $booking->full_name }}</span>
                                        <small class="text-muted">{{ $booking->email }}</small>
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
        if ($('#bookings-table tbody tr').length > 0 && !$('#bookings-table tbody tr td[colspan]').length) {
            $('#bookings-table').DataTable({
                "paging": false,
                "searching": true,
                "ordering": true,
                "info": false,
                "autoWidth": false,
                "responsive": true,
                "order": [[0, "desc"]],
                dom: '<"d-flex justify-content-start ml-3 mb-3"f>rt',
                "language": {
                    "search": "",
                    "searchPlaceholder": "{{ __('Search bookings...') }}"
                },
                "columnDefs": [{ "orderable": false, "targets": [7] }]
            });
        }
        $('[data-toggle="tooltip"]').tooltip();
    });
</script>
@endsection
