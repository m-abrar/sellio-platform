{{--
    Administrative Services: Global Booking Registry
    
    This view provides a central Dashboard for tracking service 
    appointments. It integrates high-fidelity audit trails for service 
    fulfillment, client engagement, and technician dispatch. It 
    facilitates efficient lifecycle tracking and resource allocation 
    through a responsive data architecture.
    
    @extends adminlte::page
    @context Service Booking Management
    @variables Paginator $bookings Paginated collection of ServiceAppointment models.
--}}
@extends('adminlte::page')

@section('title', __('Service Appointments | Service'))

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-7">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-concierge-bell mr-2 text-primary opacity-50"></i>
                    {{ __('Service Appointments') }}
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">{{ __('Manage service requests, schedule appointments, and track technician fulfillment.') }}</p>
            </div>
            <div class="col-sm-5 text-right">
                <div class="d-flex justify-content-end align-items-center gap-12">
                    <a href="{{ route('admin.welcome') }}" class="btn-back shadow-sm">
                        <i class="fas fa-th-large mr-2"></i> {{ __('Dashboard') }}
                    </a>
                </div>
            </div>
        </div>
    </div>
@stop

@section('content')
    <div class="container-fluid">
        @include('admin.alert')

        {{-- Filter Protocol --}}
        @include('admin.service-bookings._filter')

        {{-- Main Table --}}
        <div class="card card-premium overflow-hidden">
            <div class="card-header border-0 bg-white py-4 px-4 d-flex align-items-center">
                <h3 class="card-title font-weight-bold text-dark mb-0 smallest text-uppercase letter-spacing-1">
                    <i class="fas fa-list-ul mr-2 text-primary opacity-50"></i> {{ __('All Appointments') }}
                </h3>
            </div>

            <div class="card-body p-0">
                <div class="table-responsive">
                    <table id="bookings-table" class="table table-hover table-premium mb-0 datatable-init"
                           data-datatable-config='{"paging": false, "searching": false, "ordering": true, "info": false, "dom": "t"}'>
                        <thead class="thead-light">
                            <tr>
                                <th class="pl-4 col-media-70">{{ __('Media') }}</th>
                                <th>{{ __('Service Fulfillment') }}</th>
                                <th>{{ __('Client Principal') }}</th>
                                <th>{{ __('Schedule Date') }}</th>
                                <th class="text-center">{{ __('Lifecycle') }}</th>
                                <th class="text-right pr-4">{{ __('Actions') }}</th>
                            </tr>
                        </thead>
                        <tbody>
                            @forelse ($bookings as $booking)
                                <tr>
                                    <td class="text-center align-middle pl-4">
                                        <div class="icon-box-preview shadow-xs rounded overflow-hidden icon-box-md">
                                            <img src="{{ $booking->service->thumbnail_url ?? asset('images/fallbacks/default.jpg') }}" 
                                                 class="w-100 h-100 object-fit-cover"
                                                 alt="{{ $booking->service->title ?? 'Service' }}"
                                                 onerror="this.src='{{ asset('images/fallbacks/default.jpg') }}'">
                                        </div>
                                    </td>

                                    <td class="align-middle">
                                        <span class="d-block font-weight-bold text-dark mb-1">
                                            {{ $booking->service->title ?? __('N/A') }}
                                        </span>
                                        <div class="d-flex align-items-center">
                                            <span class="badge badge-primary-light text-primary px-2 py-1 mr-2 rounded-pill smallest font-weight-bold uppercase letter-spacing-1">
                                                ID: {{ $booking->id }}
                                            </span>
                                            @if($booking->service && $booking->service->category)
                                                <span class="text-muted smallest font-weight-bold uppercase letter-spacing-1">
                                                    <i class="fas fa-tag mr-1 text-primary opacity-50"></i>{{ $booking->service->category->title }}
                                                </span>
                                            @endif
                                        </div>
                                    </td>

                                    <td class="align-middle">
                                        <div class="d-flex align-items-center">
                                            <div class="icon-box-soft bg-primary-soft mr-3 d-flex align-items-center justify-content-center shadow-xs icon-box-md">
                                                <i class="fas fa-user-tie text-primary smallest"></i>
                                            </div>
                                            <div>
                                                <span class="d-block font-weight-bold text-dark mb-0 smallest uppercase letter-spacing-1">
                                                    {{ $booking->user->name ?? __('Guest Client') }}
                                                </span>
                                                <div class="smallest text-muted text-monospace">
                                                    {{ $booking->user->email ?? 'no-email@provided.com' }}
                                                </div>
                                            </div>
                                        </div>
                                    </td>

                                    <td class="align-middle">
                                        <div class="smallest font-weight-bold text-dark uppercase letter-spacing-1">
                                            {{ $booking->created_at->format('d M, Y') }}
                                        </div>
                                        <small class="text-muted smallest uppercase letter-spacing-1">
                                            <i class="far fa-clock mr-1 text-primary opacity-50"></i> {{ $booking->created_at->format('H:i') }}
                                        </small>
                                    </td>

                                    <td class="text-center align-middle">
                                        <span class="badge badge-info-light text-info px-3 py-2 rounded-pill font-weight-bold smallest uppercase letter-spacing-1 shadow-xs badge-min-110">
                                            {{ __($booking->status ?? 'Received') }}
                                        </span>
                                    </td>

                                    <td class="text-right align-middle pr-4">
                                        <div class="btn-group btn-group-premium shadow-xs rounded-pill border overflow-hidden">
                                            <a href="{{ route('admin.service-bookings.show', $booking->id) }}"
                                               class="btn btn-white text-info py-2 px-3 d-inline-flex align-items-center"
                                               data-toggle="tooltip" title="{{ __('Inspect Appointment') }}">
                                                <i class="fas fa-eye mr-2"></i> {{ __('Inspect') }}
                                            </a>
                                        </div>
                                    </td>
                                </tr>
                            @empty
                                <tr class="empty-state">
                                    <td colspan="6" class="text-center py-5">
                                        <div class="py-4">
                                            <i class="fas fa-concierge-bell fa-4x text-muted opacity-25 mb-3 d-block"></i>
                                            <h5 class="text-muted font-weight-bold">{{ __('No Service Requests Detected') }}</h5>
                                            <p class="small text-secondary mb-0">{{ __('The All Appointments is currently awaiting synchronized entries.') }}</p>
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
