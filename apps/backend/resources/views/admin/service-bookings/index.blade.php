@extends('adminlte::page')

@section('title', __('Service Bookings'))

@section('plugins.Datatables', true)

@section('content_header')
    <div class="container-fluid">
        <div class="row mb-2">
            <div class="col-sm-6">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-concierge-bell mr-2 text-primary"></i>
                    {{ __('Service Bookings') }}
                </h1>
            </div>
            <div class="col-sm-6">
                <ol class="breadcrumb float-sm-right">
                    <li class="breadcrumb-item"><a href="{{ route('admin.welcome') }}">{{ __('Dashboard') }}</a></li>
                    <li class="breadcrumb-item active">{{ __('Service Bookings') }}</li>
                </ol>
            </div>
        </div>
    </div>
@stop

@section('content')
    <div class="container-fluid">
        @include('admin.alert')

        {{-- Filter Bar --}}
        <div class="card card-outline card-secondary shadow-sm mb-3">
            <div class="card-body py-2">
                <form method="GET" action="{{ route('admin.service-bookings.index') }}" class="form-inline flex-wrap gap-2">
                    <div class="form-group mr-2 mb-2">
                        <label class="mr-1 text-muted small">{{ __('Service') }}</label>
                        <select name="service" class="form-control form-control-sm">
                            <option value="">{{ __('All Services') }}</option>
                            @foreach ($services as $s)
                                <option value="{{ $s->id }}" {{ request('service') == $s->id ? 'selected' : '' }}>{{ $s->title }}</option>
                            @endforeach
                        </select>
                    </div>
                    <div class="mb-2">
                        <button type="submit" class="btn btn-primary btn-sm mr-1"><i class="fas fa-filter mr-1"></i> {{ __('Filter') }}</button>
                        <a href="{{ route('admin.service-bookings.index') }}" class="btn btn-default btn-sm"><i class="fas fa-times"></i> {{ __('Clear') }}</a>
                    </div>
                </form>
            </div>
        </div>

        {{-- Main Table --}}
        <div class="card card-primary card-outline shadow-sm">
            <div class="card-header border-0 bg-white py-3">
                <h3 class="card-title font-weight-600 text-muted"><i class="fas fa-clipboard-list mr-1 text-primary"></i> {{ __('All Bookings') }}</h3>
            </div>
            <div class="card-body p-0">
                <div class="table-responsive">
                    <table id="bookings-table" class="table table-hover mb-0">
                        <thead class="thead-light">
                            <tr>
                                <th style="width: 60px" class="text-center">ID</th>
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
                                    <td class="text-center">#{{ $booking->id }}</td>
                                    <td>{{ $booking->service->title ?? 'N/A' }}</td>
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
