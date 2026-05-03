@extends('adminlte::page')

@section('title', __('Service Bookings'))

@section('plugins.Datatables', true)

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-end">
            <div class="col-sm-6">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-concierge-bell mr-2 text-primary"></i>
                    {{ __('Service Appointments') }}
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">Manage service requests, schedule appointments, and track technician fulfillment.</p>
            </div>
            <div class="col-sm-6 text-right">
                <ol class="breadcrumb float-sm-right bg-transparent p-0 mt-3 small">
                    <li class="breadcrumb-item"><a href="{{ route('admin.welcome') }}">{{ __('Dashboard') }}</a></li>
                    <li class="breadcrumb-item active">{{ __('Service Bookings') }}</li>
                </ol>
            </div>
        </div>
    </div>
@section('css')
    @include('admin._partials._toggle-card-css')
@endsection

@section('content')
    <div class="container-fluid">
        @include('admin.alert')

        {{-- Filter Bar --}}
        <div class="card border-0 shadow-premium mb-4" style="border-radius: 20px;">
            <div class="card-body py-4 px-4">
                <form method="GET" action="{{ route('admin.service-bookings.index') }}" class="row align-items-end">
                    <div class="col-md-4">
                        <label class="small text-muted font-weight-bold uppercase letter-spacing-1">{{ __('Service') }}</label>
                        <div class="input-group shadow-xs">
                            <input type="text" name="service_name" class="form-control" placeholder="Search service..." list="service-suggestions" value="{{ request('service_name') }}">
                        </div>
                    </div>
                    <div class="col-md-2">
                        <button type="submit" class="btn btn-primary font-weight-bold shadow-xs btn-block"><i class="fas fa-filter mr-1"></i> {{ __('FILTER') }}</button>
                    </div>
                    <div class="col-md-2">
                        <a href="{{ route('admin.service-bookings.index') }}" class="btn btn-default font-weight-bold shadow-xs btn-block"><i class="fas fa-undo mr-1"></i> {{ __('RESET') }}</a>
                    </div>
                </form>
            </div>
        </div>

        {{-- Main Table --}}
        <div class="card border-0 shadow-premium overflow-hidden" style="border-radius: 24px;">
            <div class="card-header border-0 bg-white py-3">
                <h3 class="card-title font-weight-600 text-muted"><i class="fas fa-clipboard-list mr-1 text-primary"></i> {{ __('All Bookings') }}</h3>
            </div>
            <div class="card-body p-0">
                <div class="table-responsive">
                    <table id="bookings-table" class="table table-hover table-premium mb-0">
                        <thead class="thead-light">
                            <tr>
                                <th class="text-center" style="width: 70px">Media</th>
                                <th>Service</th>
                                <th>Customer</th>
                                <th>Date</th>
                                <th class="text-center">Status</th>
                                <th class="text-right px-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            @forelse ($bookings as $booking)
                                <tr>
                                    <td class="text-center align-middle">
                                        <div class="table-img-preview shadow-xs">
                                            <img src="{{ $booking->service->thumbnail_url ?? asset('images/fallbacks/default.jpg') }}" alt="Service" onerror="this.src='{{ asset('images/fallbacks/default.jpg') }}'">
                                        </div>
                                    </td>
                                    <td class="align-middle">
                                        <span class="d-block font-weight-bold text-dark mb-0">{{ $booking->service->title ?? 'N/A' }}</span>
                                        <small class="text-muted">ID: {{ $booking->id }}</small>
                                    </td>
                                    <td>{{ $booking->user->name ?? 'Guest' }}</td>
                                    <td>{{ $booking->created_at->format('M d, Y') }}</td>
                                    <td class="text-center"><span class="badge badge-info">{{ $booking->status ?? 'Received' }}</span></td>
                                    <td class="text-right px-4">
                                        <a href="{{ route('admin.service-bookings.show', $booking->id) }}" class="btn btn-default btn-sm text-info"><i class="fas fa-eye"></i></a>
                                    </td>
                                </tr>
                            @empty
                                <tr><td colspan="6" class="text-center">No bookings found</td></tr>
                            @endforelse
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
@stop
