@extends('adminlte::page')

@section('title', Str::title($status) . ' ' . __('Bookings & Inquiries'))

{{-- Plugin handled by config/adminlte.php --}}
@section('plugins.Datatables', true)

@section('content_header')
    <div class="container-fluid">
        <div class="row align-items-center mb-4">
            <div class="col-sm-7">
                <h1 class="m-0 text-dark font-weight-bold d-inline-block">
                    <i class="fas fa-file-invoice-dollar mr-2 text-primary opacity-50"></i>
                    {{ Str::title($status) }} {{ __('Bookings & Inquiries') }}
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">Manage customer reservations, lead generation, and operational transaction flow.</p>
            </div>
            <div class="col-sm-5 d-flex flex-column align-items-end justify-content-center">
                <ol class="breadcrumb bg-transparent p-0 mb-0 smallest font-weight-bold text-uppercase letter-spacing-1">
                    <li class="breadcrumb-item"><a href="{{ route('admin.welcome') }}" class="text-primary">Dashboard</a></li>
                    <li class="breadcrumb-item active text-muted">Bookings</li>
                </ol>
            </div>
        </div>
    </div>
@stop

@section('content')
    <div class="container-fluid">
        @include('admin.alert')

    <div class="row mb-4">
        <div class="col-12">
            <div class="card border-0 shadow-premium" style="border-radius: 20px;">
                <div class="card-body p-2 d-flex align-items-center justify-content-between">
                    <div class="d-flex align-items-center">
                        <span class="text-muted smallest font-weight-bold ml-3 mr-3 text-uppercase letter-spacing-1">
                            <i class="fas fa-filter mr-1 text-primary"></i> Filter Registry:
                        </span>
                        <ul class="nav nav-pills p-1 bg-light rounded-pill">
                                <li class="nav-item">
                                    <a class="nav-link {{ $status === 'all' ? 'active bg-primary shadow-sm' : 'text-muted' }} px-4 py-1 smallest font-weight-bold rounded-pill transition-all" 
                                       href="{{ route(Route::currentRouteName(), ['status' => 'all']) }}">
                                       <i class="fas fa-list-ul mr-2"></i> ALL QUEUES
                                    </a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link {{ $status === 'pending' ? 'active bg-warning shadow-sm' : 'text-muted' }} px-4 py-1 smallest font-weight-bold rounded-pill transition-all" 
                                       href="{{ route(Route::currentRouteName(), ['status' => 'pending']) }}">
                                       <i class="fas fa-hourglass-start mr-2"></i> PENDING
                                    </a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link {{ $status === 'confirmed' ? 'active bg-success shadow-sm' : 'text-muted' }} px-4 py-1 smallest font-weight-bold rounded-pill transition-all" 
                                       href="{{ route(Route::currentRouteName(), ['status' => 'confirmed']) }}">
                                       <i class="fas fa-check-circle mr-2"></i> CONFIRMED
                                    </a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link {{ $status === 'cancelled' ? 'active bg-danger shadow-sm' : 'text-muted' }} px-4 py-1 smallest font-weight-bold rounded-pill transition-all" 
                                       href="{{ route(Route::currentRouteName(), ['status' => 'cancelled']) }}">
                                       <i class="fas fa-times-circle mr-2"></i> CANCELLED
                                    </a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link {{ $status === 'completed' ? 'active bg-dark shadow-sm' : 'text-muted' }} px-4 py-1 smallest font-weight-bold rounded-pill transition-all" 
                                       href="{{ route(Route::currentRouteName(), ['status' => 'completed']) }}">
                                       <i class="fas fa-archive mr-2"></i> ARCHIVED
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

        <div class="card border-0 shadow-premium overflow-hidden" style="border-radius: 24px;">
            <div class="card-header border-0 bg-white py-4 px-4">
                <h3 class="card-title font-weight-bold text-dark text-uppercase smallest mb-0" style="letter-spacing: 1px;">
                    Operational Registry
                </h3>
                <div class="card-tools">
                    <span class="badge badge-primary-light text-primary px-3 py-2 rounded-pill font-weight-bold smallest uppercase mr-2">
                        <i class="fas fa-chart-pie mr-1"></i> {{ $bookings->total() }} OPERATIONS FOUND
                    </span>
                    <button type="button" class="btn btn-tool text-muted" data-card-widget="maximize">
                        <i class="fas fa-expand"></i>
                    </button>
                </div>
            </div>
            
            <div class="card-body p-0">
                <div class="table-responsive">
                    <table id="bookings-table" class="table table-hover table-premium mb-0">
                        <thead class="bg-light text-uppercase smallest font-weight-bold">
                            <tr>
                                <th style="width: 70px" class="text-center py-3 border-0">Media</th>
                                <th class="py-3 border-0">{{ __('Related Item') }}</th>
                                <th class="py-3 border-0">{{ __('Customer') }}</th>
                                <th class="py-3 border-0">{{ __('Module') }}</th>
                                <th class="py-3 border-0">{{ __('Date & Time') }}</th>
                                <th class="text-center py-3 border-0">{{ __('Status') }}</th>
                                <th class="text-right px-4 py-3 border-0">{{ __('Actions') }}</th>
                            </tr>
                        </thead>
                        <tbody>
                            @forelse ($bookings as $booking)
                                <tr>
                                    <td class="text-center align-middle">
                                        <div class="table-img-preview shadow-xs">
                                            <img src="{{ $booking->item_thumbnail }}" onerror="this.src='{{ asset('images/fallbacks/default.jpg') }}'">
                                        </div>
                                    </td>
                                    
                                    <td class="align-middle">
                                        <span class="d-block font-weight-bold text-dark mb-0">{{ $booking->item_title }}</span>
                                        <small class="badge badge-light border text-muted mt-1">ID: {{ $booking->id }}</small>
                                    </td> 

                                    <td class="align-middle py-4">
                                        @if ($booking->user)
                                            <div class="d-flex align-items-center">
                                                <div class="icon-circle bg-light border text-muted mr-3 shadow-xs" style="width: 38px; height: 38px; border-radius: 12px; display: flex; align-items: center; justify-content: center;">
                                                    <i class="fas fa-user-circle"></i>
                                                </div>
                                                <div>
                                                    <span class="d-block font-weight-bold text-dark smallest">{{ $booking->user->name }}</span>
                                                    <span class="text-muted smallest">ID: #{{ $booking->user_id }}</span>
                                                </div>
                                            </div>
                                        @else
                                            <span class="badge badge-danger-light border px-2 smallest font-weight-bold uppercase">
                                                <i class="fas fa-user-slash mr-1"></i> {{ __('Deleted') }}
                                            </span>
                                        @endif
                                    </td>
                                    
                                    <td class="align-middle">
                                        <span class="badge {{ $booking->getTypeBadgeClass() }} shadow-xs px-2 py-1 text-xs">
                                            <i class="fas fa-layer-group fa-xs mr-1 opacity-7"></i> {{ $booking->getFriendlyType() }}
                                        </span>
                                    </td>
                                    
                                    <td class="align-middle py-4"> 
                                        <div class="font-weight-600 text-dark smallest">{{ $booking->created_at->diffForHumans(null, true) }} ago</div>
                                        <small class="text-muted smallest">{{ $booking->created_at->format('M d, Y') }}</small>
                                    </td>

                                    <td class="text-center align-middle py-4">
                                        @php
                                            $statusClass = match($booking->status) {
                                                'confirmed' => 'success',
                                                'pending' => 'warning',
                                                'cancelled' => 'danger',
                                                default => 'secondary'
                                            };
                                        @endphp
                                        <span class="badge badge-{{ $statusClass }}-light text-{{ $statusClass }} px-3 py-1 smallest font-weight-bold rounded-pill">{{ strtoupper($booking->status) }}</span>
                                    </td>

                                    <td class="text-right align-middle pr-4 py-4">
                                        <div class="btn-group btn-group-premium shadow-xs rounded-pill border overflow-hidden">
                                            <a href="{{ ($booking->booking_type && $booking->id) ? route('admin.bookings.show', ['type' => $booking->booking_type, 'id' => $booking->id]) : '#' }}" 
                                               class="btn btn-white btn-sm text-primary py-2 px-3 border-right {{ (!$booking->booking_type || !$booking->id) ? 'disabled' : '' }}" 
                                               data-toggle="tooltip" title="View Registry Details">
                                                <i class="fas fa-eye"></i>
                                            </a>
                                            <form action="{{ ($booking->booking_type && $booking->id) ? route('admin.bookings.destroy', [$booking->booking_type, $booking->id]) : '#' }}" method="POST" class="d-inline">
                                                @csrf @method('DELETE')
                                                <button type="submit" class="btn btn-white btn-sm text-danger py-2 px-3" data-toggle="tooltip" title="Purge Record" onclick="return confirm('Permanently delete booking?')">
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
                                            <i class="fas fa-receipt fa-3x text-light mb-3"></i>
                                            <p class="text-muted font-weight-bold mb-0">No operational records found for this queue.</p>
                                        </div>
                                    </td>
                                </tr>
                            @endforelse
                        </tbody>
                    </table>
                </div>
            </div>
            
            @if($bookings->hasPages())
                <div class="card-footer bg-white border-0 py-3">
                    <div class="float-right">
                        {{ $bookings->appends(['status' => $status])->links('pagination::bootstrap-4') }}
                    </div>
                </div>
            @endif
        </div>
    </div>
@stop

@section('css')
<style>
    #statusTabs.nav-pills .nav-link { color: #6c757d; font-weight: 500; transition: all 0.3s ease; }
    #statusTabs.nav-pills .nav-link.active { background-color: var(--primary); color: #fff !important; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
    #statusTabs.nav-pills .nav-link:hover:not(.active) { background-color: #f8f9fa; }
</style>
@stop

@section('js')
<script>
    $(function () {
        $('[data-toggle="tooltip"]').tooltip();

        // DataTables Premium Initialization
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
                    "searchPlaceholder": "Search bookings registry..."
                }
            });
            $('.dataTables_filter input').addClass('form-control form-control-premium shadow-none border-light mb-3').css('width', '250px');
        }
    });
</script>
@stop

@include('admin._partials._sweetalert-delete')
