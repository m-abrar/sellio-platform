{{--
    Administrative Operations: Master Booking & Inquiry Registry
    
    This view serves as the cross-module operational command center. 
    It aggregates transactional requests from various marketplace verticals 
    (Real Estate, Events, Auto), providing real-time status oversight, 
    lifecycle filtering, and direct management of the operational queue.
    
    @extends adminlte::page
    @context Marketplace Operations
    @variables Paginator $bookings Collection of polymorphic booking/inquiry models.
    @variables string $status The current filtering status context.
--}}
@extends('adminlte::page')

@section('title', Str::title($status) . ' ' . __('Bookings & Inquiries'))

{{-- Plugin handled by config/adminlte.php --}}
@section('plugins.Datatables', true)

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row align-items-center mb-4">
            <div class="col-sm-7">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-file-invoice-dollar mr-2 text-primary opacity-50"></i>
                    {{ Str::title($status) }} {{ __('Operations Queue') }}
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">{{ __('Cross-module operational registry and transaction oversight.') }}</p>
            </div>
            <div class="col-sm-5 d-flex flex-column align-items-end justify-content-center">
                <div class="d-flex align-items-center gap-12">
                    <a href="{{ route('admin.welcome') }}" class="btn-back shadow-sm">
                        <i class="fas fa-th-large"></i> {{ __('Dashboard') }}
                    </a>
                    <div class="dropdown">
                        <button class="btn btn-primary rounded-pill px-4 py-2 font-weight-bold shadow-premium dropdown-toggle smallest uppercase letter-spacing-1" type="button" id="addOperationDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <i class="fas fa-plus-circle mr-2"></i> {{ __('INITIALIZE OPERATION') }}
                        </button>
                        <div class="dropdown-menu dropdown-menu-right shadow-premium border-0 animate__animated animate__fadeInUp rounded-xl" aria-labelledby="addOperationDropdown">
                            <h6 class="dropdown-header smallest font-weight-bold text-muted uppercase letter-spacing-1">{{ __('Real Estate') }}</h6>
                            <a class="dropdown-item py-2 px-4 smallest font-weight-bold" href="{{ route('admin.property-bookings.create') }}">
                                <i class="fas fa-home mr-2 text-primary opacity-50"></i> {{ __('Property Booking') }}
                            </a>
                            
                            <div class="dropdown-divider"></div>
                            <h6 class="dropdown-header smallest font-weight-bold text-muted uppercase letter-spacing-1">{{ __('Ticketing & Events') }}</h6>
                            <a class="dropdown-item py-2 px-4 smallest font-weight-bold" href="{{ route('admin.event-bookings.create') }}">
                                <i class="fas fa-ticket-alt mr-2 text-success opacity-50"></i> {{ __('Event Registration') }}
                            </a>
    
                            <div class="dropdown-divider"></div>
                            <h6 class="dropdown-header smallest font-weight-bold text-muted uppercase letter-spacing-1">{{ __('Leads & Inquiries') }}</h6>
                            <a class="dropdown-item py-2 px-4 smallest font-weight-bold" href="{{ route('admin.auto-inquiries.create') }}">
                                <i class="fas fa-car mr-2 text-info opacity-50"></i> {{ __('Auto Lead Entry') }}
                            </a>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
@stop

@section('content')
    <div class="container-fluid pb-5">
        @include('admin.alert')

        <div class="row">
            <div class="col-12">
                {{-- Filter Card --}}
        <div class="row mb-4">
            <div class="col-12">
                <div class="card registry-card-premium registry-filter-card">
                    <div class="card-body d-flex align-items-center justify-content-between">
                        <div class="d-flex align-items-center">
                            <span class="form-label-premium mb-0 mr-3">
                                <i class="fas fa-filter mr-1 text-primary"></i> {{ __('Filter Registry:') }}
                            </span>
                            <ul class="nav nav-pills nav-pills-premium">
                                <li class="nav-item">
                                    <a class="nav-link {{ $status === 'all' ? 'active' : '' }}" 
                                       href="{{ route(Route::currentRouteName(), ['status' => 'all']) }}">
                                       <i class="fas fa-list-ul mr-2"></i> {{ __('ALL QUEUES') }}
                                    </a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link {{ $status === 'pending' ? 'active' : '' }}" 
                                       href="{{ route(Route::currentRouteName(), ['status' => 'pending']) }}">
                                       <i class="fas fa-hourglass-start mr-2"></i> {{ __('PENDING') }}
                                    </a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link {{ $status === 'confirmed' ? 'active' : '' }}" 
                                       href="{{ route(Route::currentRouteName(), ['status' => 'confirmed']) }}">
                                       <i class="fas fa-check-circle mr-2"></i> {{ __('CONFIRMED') }}
                                    </a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link {{ $status === 'cancelled' ? 'active' : '' }}" 
                                       href="{{ route(Route::currentRouteName(), ['status' => 'cancelled']) }}">
                                       <i class="fas fa-times-circle mr-2"></i> {{ __('CANCELLED') }}
                                    </a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link {{ $status === 'completed' ? 'active' : '' }}" 
                                       href="{{ route(Route::currentRouteName(), ['status' => 'completed']) }}">
                                       <i class="fas fa-archive mr-2"></i> {{ __('ARCHIVED') }}
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="card registry-table-card">
            <div class="card-header border-0 bg-white py-4 px-4 d-flex align-items-center">
                <h3 class="card-title font-weight-bold text-dark text-uppercase smallest mb-0 float-none letter-spacing-1">
                    {{ __('Operational Registry') }}
                </h3>
                <div class="card-tools d-flex align-items-center ml-auto">
                    <span class="badge badge-primary-light text-primary px-3 py-2 rounded-pill font-weight-bold smallest uppercase mr-2">
                        <i class="fas fa-chart-pie mr-1"></i> {{ $bookings->total() }} {{ __('OPERATIONS FOUND') }}
                    </span>
                <button type="button" class="btn btn-tool text-muted" data-card-widget="maximize">
                    <i class="fas fa-expand"></i>
                </button>
            </div>
        </div>
                
                <div class="card-body p-0">
                    <div class="table-responsive">
                        <table id="bookings-table" class="table table-hover table-premium mb-0 datatable-init"
                               data-datatable-config='{"paging": false, "lengthChange": false, "searching": false, "ordering": true, "info": false}'>
                            <thead class="bg-light text-uppercase smallest font-weight-bold">
                                <tr>
                                    <th class="py-3 border-0 text-center col-media-80">{{ __('Media') }}</th>
                                    <th class="py-3 border-0">{{ __('Related Item') }}</th>
                                    <th class="py-3 border-0">{{ __('Customer') }}</th>
                                    <th class="py-3 border-0">{{ __('Module') }}</th>
                                    <th class="py-3 border-0">{{ __('Date & Time') }}</th>
                                    <th class="py-3 border-0 text-center">{{ __('Status') }}</th>
                                    <th class="py-3 border-0 text-right px-4">{{ __('Actions') }}</th>
                                </tr>
                            </thead>
                            <tbody>
                                @forelse ($bookings as $booking)
                                    <tr>
                                        <td class="text-center align-middle">
                                            <div class="table-img-preview shadow-sm">
                                                <img src="{{ $booking->item_thumbnail }}" onerror="this.src='{{ asset('images/fallbacks/default.jpg') }}'">
                                            </div>
                                        </td>
                                        
                                        <td class="align-middle">
                                            <span class="d-block font-weight-bold text-dark mb-0">{{ $booking->item_title }}</span>
                                            <small class="badge badge-light border text-muted mt-1">ID: {{ $booking->id }}</small>
                                        </td> 

                                        <td class="align-middle">
                                            @if ($booking->user)
                                                <div class="d-flex align-items-center">
                                                    <div class="icon-circle bg-light border text-muted mr-3 shadow-xs icon-box-sm d-flex align-items-center justify-content-center">
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
                                        
                                        <td class="align-middle"> 
                                            <div class="font-weight-600 text-dark smallest">{{ $booking->created_at->diffForHumans(null, true) }} ago</div>
                                            <small class="text-muted smallest">{{ $booking->created_at->format('M d, Y') }}</small>
                                        </td>

                                        <td class="text-center align-middle">
                                            @php
                                                $statusClass = match($booking->status) {
                                                    'confirmed' => 'success',
                                                    'pending' => 'warning',
                                                    'cancelled' => 'danger',
                                                    default => 'secondary'
                                                };
                                            @endphp
                                            <span class="badge badge-{{ $statusClass }}-light px-3 py-1 smallest font-weight-bold rounded-pill">{{ __(strtoupper($booking->status)) }}</span>
                                        </td>

                                        <td class="text-right align-middle px-4">
                                            <div class="btn-group btn-group-premium">
                                                <a href="{{ ($booking->booking_type && $booking->id) ? route('admin.bookings.show', ['type' => $booking->booking_type, 'id' => $booking->id]) : '#' }}" 
                                                   class="btn text-primary {{ (!$booking->booking_type || !$booking->id) ? 'disabled' : '' }}" 
                                                   data-toggle="tooltip" title="View Registry Details">
                                                    <i class="fas fa-eye"></i>
                                                </a>
                                                <form action="{{ ($booking->booking_type && $booking->id) ? route('admin.bookings.destroy', [$booking->booking_type, $booking->id]) : '#' }}" method="POST" class="d-inline">
                                                    @csrf @method('DELETE')
                                                     <button type="button" class="btn text-danger" 
                                                             data-toggle="tooltip" title="Purge Record" 
                                                             data-action="delete-trigger"
                                                             data-confirm-title="Purge Record?"
                                                             data-confirm-text="Are you sure you want to permanently delete this booking?">
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
                                                <p class="text-muted font-weight-bold mb-0">{{ __('No operational records found for this queue.') }}</p>
                                            </div>
                                        </td>
                                    </tr>
                                @endforelse
                            </tbody>
                        </table>
                    </div>
                </div>
                
            @if(method_exists($bookings, 'hasPages') && $bookings->hasPages())
                <div class="card-footer bg-white border-0 py-4 px-4 d-flex justify-content-between align-items-center">
                    <div class="text-muted smallest font-weight-bold uppercase">{{ __('Displaying') }} {{ $bookings->firstItem() }} - {{ $bookings->lastItem() }} {{ __('of') }} {{ $bookings->total() }} {{ __('records') }}</div>
                    <div>{{ $bookings->appends(['status' => $status])->links('pagination::bootstrap-4') }}</div>
                </div>
            @endif
            </div>
        </div>
    </div>
</div>
@stop

@push('css')
@include('admin._partials._toggle-card-css')
@endpush

@section('js')
<script src="{{ asset('admin-assets/pages/registry-index.js') }}"></script>
@stop

@include('admin._partials._sweetalert-delete')
