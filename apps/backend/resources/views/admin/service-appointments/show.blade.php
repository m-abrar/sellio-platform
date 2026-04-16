@extends('adminlte::page')

@section('title', __('Service Appointment') . ' #' . $appointment->id)

@section('content_header')
    <div class="d-flex justify-content-between">
        <h1>{{ __('Appointment Details') }} <small class="text-muted">#{{ $appointment->id }}</small></h1>
        <a href="{{ route('admin.bookings.index') }}" class="btn btn-default btn-sm">
            <i class="fas fa-arrow-left"></i> {{ __('Back to Unified List') }}
        </a>
    </div>
@stop

@section('content')
    <div class="row">
        {{-- Left Side: Appointment & Service Info --}}
        <div class="col-md-8">
            <div class="card card-outline card-info">
                <div class="card-header">
                    <h3 class="card-title"><i class="fas fa-concierge-bell"></i> {{ __('Service Information') }}</h3>
                    <div class="card-tools">
                        <span class="badge {{ $appointment->getStatusBadgeClass() }} px-3 py-2">
                            {{ Str::upper($appointment->status) }}
                        </span>
                    </div>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-sm-6">
                            <label class="text-muted mb-0">{{ __('Service Name') }}</label>
                            <p class="lead text-bold">{{ $appointment->service->title ?? __('N/A') }}</p>
                        </div>
                        <div class="col-sm-6 text-sm-right">
                            <label class="text-muted mb-0">{{ __('Scheduled Date & Time') }}</label>
                            <p class="lead">
                                {{ $appointment->scheduled_at ? $appointment->scheduled_at->format('l, M d, Y') : __('TBD') }}<br>
                                <small class="text-primary">{{ $appointment->scheduled_at ? $appointment->scheduled_at->format('H:i A') : '' }}</small>
                            </p>
                        </div>
                    </div>

                    <hr>

                    <div class="row">
                        <div class="col-sm-6">
                            <h5><i class="fas fa-sticky-note text-muted mr-2"></i>{{ __('Notes') }}</h5>
                            <div class="p-3 bg-light border rounded">
                                {{ $appointment->notes ?? __('No additional notes provided.') }}
                            </div>
                        </div>
                        <div class="col-sm-6 text-sm-right">
                            <label class="text-muted mb-0">{{ __('Service Price') }}</label>
                            <h2 class="text-success font-weight-bold">
                                {{ number_format($appointment->price, 2) }}
                            </h2>
                        </div>
                    </div>
                </div>
                <div class="card-footer">
                    <small class="text-muted">
                        <i class="fas fa-eye"></i> {{ __('Viewed At') }}: 
                        {{ $appointment->viewed_at ? $appointment->viewed_at->format('M d, Y H:i') : __('Never') }}
                    </small>
                </div>
            </div>
        </div>

        {{-- Right Side: Customer Info --}}
        <div class="col-md-4">
            <div class="card card-outline card-primary">
                <div class="card-header">
                    <h3 class="card-title"><i class="fas fa-user"></i> {{ __('Customer Details') }}</h3>
                </div>
                <div class="card-body box-profile">
                    <div class="text-center">
                        <img class="profile-user-img img-fluid img-circle"
                             src="https://ui-avatars.com/api/?name={{ urlencode($appointment->user->name) }}&background=17a2b8&color=fff"
                             alt="User profile picture">
                    </div>
                    <h3 class="profile-username text-center">{{ $appointment->user->name }}</h3>
                    <p class="text-muted text-center">{{ $appointment->user->email }}</p>

                    <ul class="list-group list-group-unbordered mb-3">
                        <li class="list-group-item">
                            <b>{{ __('Phone') }}</b> <a class="float-right">{{ $appointment->user->phone ?? __('N/A') }}</a>
                        </li>
                        <li class="list-group-item">
                            <b>{{ __('Member Since') }}</b> <a class="float-right">{{ $appointment->user->created_at->format('M Y') }}</a>
                        </li>
                    </ul>

                    <a href="{{ route('admin.users.show', $appointment->user_id) }}" class="btn btn-primary btn-block">
                        <i class="fas fa-external-link-alt"></i> {{ __('View Full Profile') }}
                    </a>
                </div>
            </div>
        </div>
    </div>
@stop
