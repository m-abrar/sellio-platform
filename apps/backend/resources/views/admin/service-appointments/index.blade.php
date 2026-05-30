@extends('adminlte::page')

@section('title', __('Service Appointments'))

@section('plugins.Datatables', true)

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-8">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-calendar-check mr-2 text-primary"></i> {{ __('Service Appointments') }}
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">{{ __('Manage scheduled service appointments and provider bookings.') }}</p>
            </div>
            <div class="col-sm-4 text-right">
                <a href="{{ route('admin.service-appointments.create') }}" class="btn btn-primary rounded-pill px-4 font-weight-bold shadow-premium">
                    <i class="fas fa-plus-circle mr-1"></i> {{ __('New Appointment') }}
                </a>
            </div>
        </div>
    </div>
@stop

@section('content')
<div class="container-fluid pb-5">
    @include('admin.alert')

    <div class="card registry-table-card">
        <div class="card-header border-0 bg-white py-4 px-4 d-flex align-items-center">
            <h3 class="card-title font-weight-bold text-dark text-uppercase smallest mb-0">{{ __('Appointment Registry') }}</h3>
            <div class="card-tools ml-auto">
                <span class="badge badge-primary-light text-primary px-3 py-2 rounded-pill font-weight-bold smallest uppercase">
                    {{ $appointments->total() }} {{ __('RECORDS') }}
                </span>
            </div>
        </div>
        <div class="card-body p-0">
            <div class="table-responsive">
                <table class="table table-hover table-premium mb-0">
                    <thead class="thead-light">
                        <tr>
                            <th>{{ __('Service') }}</th>
                            <th>{{ __('Customer') }}</th>
                            <th>{{ __('Scheduled') }}</th>
                            <th class="text-center">{{ __('Status') }}</th>
                            <th class="text-right pr-4">{{ __('Actions') }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse ($appointments as $appointment)
                            <tr>
                                <td class="align-middle">{{ $appointment->service->title ?? '—' }}</td>
                                <td class="align-middle">
                                    <div class="font-weight-bold">{{ $appointment->name }}</div>
                                    <small class="text-muted">{{ $appointment->email }}</small>
                                </td>
                                <td class="align-middle">{{ optional($appointment->scheduled_at)->format('M d, Y H:i') ?? '—' }}</td>
                                <td class="text-center align-middle">
                                    <span class="badge badge-light border text-uppercase">{{ $appointment->status }}</span>
                                </td>
                                <td class="text-right align-middle pr-4">
                                    <a href="{{ route('admin.service-appointments.show', $appointment) }}" class="btn btn-sm btn-outline-primary">
                                        {{ __('View') }}
                                    </a>
                                </td>
                            </tr>
                        @empty
                            <tr>
                                <td colspan="5" class="text-center text-muted py-5">{{ __('No appointments found.') }}</td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </div>
        @if($appointments->hasPages())
            <div class="card-footer bg-white">{{ $appointments->links() }}</div>
        @endif
    </div>
</div>
@endsection
