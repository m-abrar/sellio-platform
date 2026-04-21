@extends('adminlte::page')

@section('title', Str::title($status) . ' ' . __('Bookings & Inquiries'))

{{-- Plugin handled by config/adminlte.php --}}
@section('plugins.Datatables', true)

@section('content_header')
    <div class="container-fluid">
        <div class="row mb-2">
            <div class="col-sm-6">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-file-invoice-dollar mr-2 text-primary"></i>
                    {{ Str::title($status) }} {{ __('Bookings & Inquiries') }}
                </h1>
            </div>
            <div class="col-sm-6">
                <ol class="breadcrumb float-sm-right">
                    <li class="breadcrumb-item"><a href="{{ route('admin.welcome') }}">Dashboard</a></li>
                    <li class="breadcrumb-item active">Bookings</li>
                </ol>
            </div>
        </div>
    </div>
@stop

@section('content')
    <div class="container-fluid">
        @include('admin.alert')

<div class="row mb-3">
            <div class="col-12">
<ul class="nav nav-pills mb-3 p-1 bg-white shadow-sm rounded-pill" id="statusTabs" role="tablist" style="width: fit-content;">
                    <li class="nav-item">
                        <a class="nav-link {{ $status === 'all' ? 'active' : '' }} px-4 py-2 rounded-pill" 
                           href="{{ route(Route::currentRouteName(), ['status' => 'all']) }}">
                            <i class="fas fa-list mr-1"></i> {{ __('All') }}
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link {{ $status === 'pending' ? 'active' : '' }} px-4 py-2 rounded-pill" 
                           href="{{ route(Route::currentRouteName(), ['status' => 'pending']) }}">
                            <i class="fas fa-hourglass-start mr-1"></i> {{ __('Pending') }}
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link {{ $status === 'confirmed' ? 'active' : '' }} px-4 py-2 rounded-pill" 
                           href="{{ route(Route::currentRouteName(), ['status' => 'confirmed']) }}">
                            <i class="fas fa-check-circle mr-1"></i> {{ __('Confirmed') }}
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link {{ $status === 'cancelled' ? 'active' : '' }} px-4 py-2 rounded-pill" 
                           href="{{ route(Route::currentRouteName(), ['status' => 'cancelled']) }}">
                            <i class="fas fa-times-circle mr-1"></i> {{ __('Cancelled') }}
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link {{ $status === 'completed' ? 'active' : '' }} px-4 py-2 rounded-pill" 
                           href="{{ route(Route::currentRouteName(), ['status' => 'completed']) }}">
                            <i class="fas fa-check-double mr-1"></i> {{ __('Completed') }}
                        </a>
                    </li>
                </ul>
            </div>
        </div>

        <div class="card card-primary card-outline shadow-sm">
            <div class="card-header border-0 bg-white py-3">
                <h3 class="card-title font-weight-600 text-muted">
                    <i class="fas fa-exchange-alt mr-1 text-primary"></i> {{ __('Activities History') }}
                </h3>
                <div class="card-tools">
                    <button type="button" class="btn btn-tool" data-card-widget="maximize">
                        <i class="fas fa-expand"></i>
                    </button>
                </div>
            </div>
            
            <div class="card-body p-0">
                <div class="table-responsive">
                    <table id="bookings-table" class="table table-hover table-premium mb-0">
                        <thead class="thead-light">
                            <tr>
                                <th style="width: 70px" class="text-center">Media</th>
                                <th>{{ __('Related Item') }}</th>
                                <th>{{ __('Customer') }}</th>
                                <th>{{ __('Module') }}</th>
                                <th>{{ __('Date & Time') }}</th>
                                <th class="text-center">{{ __('Status') }}</th>
                                <th class="text-right px-4">{{ __('Actions') }}</th>
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

                                    <td class="align-middle">
                                        @if ($booking->user)
                                            <div class="d-flex align-items-center">
                                                <div class="avatar-sm mr-2 bg-light rounded-circle text-center border shadow-xs" style="width:32px; height:32px; line-height:30px;">
                                                    <i class="fas fa-user text-muted text-xs"></i>
                                                </div>
                                                <div>
                                                    <span class="d-block text-sm font-weight-bold text-dark mb-0">{{ $booking->user->name }}</span>
                                                    <small class="text-muted text-monospace" style="font-size: 0.7rem;">ID: #{{ $booking->user_id }}</small>
                                                </div>
                                            </div>
                                        @else
                                            <span class="badge badge-danger-light border px-2">
                                                <i class="fas fa-user-slash mr-1"></i> {{ __('Deleted User') }}
                                            </span>
                                        @endif
                                    </td>
                                    
                                    <td class="align-middle">
                                        <span class="badge {{ $booking->getTypeBadgeClass() }} shadow-xs px-2 py-1 text-xs">
                                            <i class="fas fa-layer-group fa-xs mr-1 opacity-7"></i> {{ $booking->getFriendlyType() }}
                                        </span>
                                    </td>
                                    
                                    <td class="align-middle"> 
                                        <div class="text-dark font-weight-600 mb-0" style="font-size: 0.9rem;">{{ $booking->created_at->format('M d, Y') }}</div>
                                        <div class="small text-muted"><i class="far fa-clock mr-1 text-xs"></i>{{ $booking->created_at->format('H:i') }}</div>
                                    </td>

                                    <td class="text-center align-middle">
                                        {{-- Dynamic Light Badges for Status --}}
                                        @php
                                            $statusClass = 'secondary';
                                            if($booking->status == 'confirmed') $statusClass = 'success';
                                            if($booking->status == 'pending') $statusClass = 'warning';
                                            if($booking->status == 'cancelled') $statusClass = 'danger';
                                        @endphp
                                        <span class="badge badge-{{ $statusClass }}-light px-3 py-1 text-uppercase shadow-xs" style="font-size: 0.7rem; letter-spacing: 0.5px;">
                                            {{ $booking->status }}
                                        </span>
                                    </td>

                                    <td class="text-right align-middle px-4">
                                        <div class="btn-group btn-group-premium shadow-sm">
                                            <a href="{{ ($booking->booking_type && $booking->id) ? route('admin.bookings.show', ['type' => $booking->booking_type, 'id' => $booking->id]) : '#' }}" 
                                               class="btn btn-default btn-sm text-info {{ (!$booking->booking_type || !$booking->id) ? 'disabled' : '' }}" 
                                               data-toggle="tooltip" title="{{ __('View Details') }}">
                                                <i class="fas fa-eye"></i>
                                            </a>
                                            
                                            <form action="{{ route('admin.bookings.destroy', ['type' => $booking->booking_type, 'id' => $booking->id]) }}" 
                                                  method="POST" 
                                                  class="d-inline"
                                                  onsubmit="return confirm('Permanently delete this transaction record?')">
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
                                <tr class="empty-state">
                                    <td colspan="7" class="text-center py-5">
                                        <i class="fas fa-receipt fa-3x text-muted mb-3 d-block"></i>
                                        <h5 class="text-muted font-weight-bold">{{ __('No Bookings Found') }}</h5>
                                        <p class="text-secondary small">{{ __('There are no transactions matching the status') }}: <strong>{{ $status }}</strong></p>
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
@endsection

@section('js')
<script>
    $(function () {
        $('[data-toggle="tooltip"]').tooltip();
    });
</script>
@include('admin._partials._sweetalert-delete')
@endsection
