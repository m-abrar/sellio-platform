@extends('adminlte::page')

@section('title', __('Auto Inquiry') . ' #' . $inquiry->id)

@section('content_header')
    <div class="d-flex justify-content-between">
        <h1>{{ __('Vehicle Inquiry') }} <small class="text-muted">#{{ $inquiry->id }}</small></h1>
        <a href="{{ route('admin.bookings.index') }}" class="btn btn-default btn-sm">
            <i class="fas fa-arrow-left"></i> {{ __('Back to List') }}
        </a>
    </div>
@stop

@section('content')
    <div class="row">
        {{-- Vehicle & Inquiry Details --}}
        <div class="col-md-8">
            <div class="card card-outline card-danger">
                <div class="card-header">
                    <h3 class="card-title"><i class="fas fa-car"></i> {{ __('Vehicle Interest') }}</h3>
                    <div class="card-tools">
                        <span class="badge {{ $inquiry->getStatusBadgeClass() }} px-3 py-2">
                            {{ Str::upper($inquiry->status) }}
                        </span>
                    </div>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-sm-7">
                            <label class="text-muted mb-0">{{ __('Interested Vehicle') }}</label>
                            <h3 class="text-danger font-weight-bold">{{ $inquiry->auto->title ?? __('N/A') }}</h3>
                            <p class="text-muted">ID: #{{ $inquiry->vehicle_id }}</p>
                        </div>
                        <div class="col-sm-5 text-sm-right border-left">
                            <label class="text-muted mb-0">{{ __('Inquiry Received') }}</label>
                            <p>{{ $inquiry->created_at->format('M d, Y @ H:i') }}</p>
                        </div>
                    </div>

                    <hr>

                    <h5><i class="fas fa-comment-alt text-muted mr-2"></i>{{ __('Lead Message') }}</h5>
                    <div class="p-3 bg-light rounded border">
                        @if($inquiry->message)
                            "{{ $inquiry->message }}"
                        @else
                            <em class="text-muted">{{ __('No specific message provided.') }}</em>
                        @endif
                    </div>
                </div>
            </div>
        </div>

        {{-- Lead Contact Sidebar --}}
        <div class="col-md-4">
            <div class="card card-outline card-dark">
                <div class="card-header">
                    <h3 class="card-title"><i class="fas fa-user-tag"></i> {{ __('Lead Information') }}</h3>
                </div>
                <div class="card-body">
                    <div class="text-center mb-3">
                        <img src="https://ui-avatars.com/api/?name={{ urlencode($inquiry->full_name ?? 'Lead') }}&background=dc3545&color=fff" 
                             class="img-circle elevation-2" style="width: 80px;">
                    </div>
                    <ul class="list-group list-group-unbordered mb-3">
                        <li class="list-group-item">
                            <b>{{ __('Name') }}</b> <span class="float-right">{{ $inquiry->full_name }}</span>
                        </li>
                        <li class="list-group-item">
                            <b>{{ __('Email') }}</b> <span class="float-right small">{{ $inquiry->email }}</span>
                        </li>
                        <li class="list-group-item">
                            <b>{{ __('Phone') }}</b> <span class="float-right">{{ $inquiry->phone ?? __('N/A') }}</span>
                        </li>
                    </ul>
                    
                    @if($inquiry->user_id)
                        <a href="{{ route('admin.users.show', $inquiry->user_id) }}" class="btn btn-danger btn-block btn-sm">
                            <i class="fas fa-history"></i> {{ __('View Customer Profile') }}
                        </a>
                    @else
                        <button class="btn btn-default btn-block btn-sm disabled">{{ __('Guest User') }}</button>
                    @endif
                </div>
            </div>
        </div>
    </div>
@stop
