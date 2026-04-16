@extends('adminlte::page')

@section('title', __('Classified Inquiry') . ' #' . $inquiry->id)

@section('content_header')
    <div class="d-flex justify-content-between">
        <h1>{{ __('Classified Inquiry') }} <small class="text-muted">#{{ $inquiry->id }}</small></h1>
        <a href="{{ route('admin.bookings.index') }}" class="btn btn-default btn-sm">
            <i class="fas fa-arrow-left"></i> {{ __('Back to Unified List') }}
        </a>
    </div>
@stop

@section('content')
    <div class="row">
        {{-- Left Side: Inquiry Content --}}
        <div class="col-md-8">
            <div class="card card-outline card-warning">
                <div class="card-header">
                    <h3 class="card-title"><i class="fas fa-tags"></i> {{ __('Listing Information') }}</h3>
                    <div class="card-tools">
                         <span class="badge {{ $inquiry->getStatusBadgeClass() }} px-3 py-2">
                            {{ Str::upper($inquiry->status) }}
                        </span>
                    </div>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-sm-8">
                            <label class="text-muted mb-0">{{ __('Item Name') }}</label>
                            <h4 class="text-bold text-dark">{{ $inquiry->classifiedAd->title ?? __('N/A') }}</h4>
                            <p class="text-muted">{{ __('Category') }}: {{ $inquiry->classifiedAd->category->title ?? __('Uncategorized') }}</p>
                        </div>
                        <div class="col-sm-4 text-sm-right border-left">
                            <label class="text-muted mb-0">{{ __('Asking Price') }}</label>
                            <h3 class="text-success font-weight-bold">
                                {{ number_format($inquiry->classifiedAd->price ?? 0, 2) }}
                            </h3>
                        </div>
                    </div>

                    <hr>

                    <h5><i class="fas fa-envelope-open-text text-muted mr-2"></i>{{ __('Buyer Message') }}</h5>
                    <div class="p-4 bg-light border rounded shadow-sm">
                        @if($inquiry->message)
                            "{{ $inquiry->message }}"
                        @else
                            <em class="text-muted">{{ __('No additional message was sent.') }}</em>
                        @endif
                    </div>
                </div>
            </div>
        </div>

        {{-- Right Side: Contact Info --}}
        <div class="col-md-4">
            <div class="card card-outline card-warning">
                <div class="card-header">
                    <h3 class="card-title"><i class="fas fa-user-circle"></i> {{ __('Contact Details') }}</h3>
                </div>
                <div class="card-body box-profile">
                    <div class="text-center mb-3">
                         <img class="profile-user-img img-fluid img-circle"
                             src="https://ui-avatars.com/api/?name={{ urlencode($inquiry->full_name ?? $inquiry->user->name ?? 'Buyer') }}&background=f39c12&color=fff"
                             alt="Buyer profile">
                    </div>
                    
                    <h5 class="text-center font-weight-bold">{{ $inquiry->full_name ?? $inquiry->user->name }}</h5>
                    <p class="text-muted text-center">{{ $inquiry->email ?? $inquiry->user->email }}</p>

                    <ul class="list-group list-group-unbordered mb-3">
                        <li class="list-group-item">
                            <b>{{ __('Phone') }}</b> <span class="float-right">{{ $inquiry->phone ?? __('N/A') }}</span>
                        </li>
                        <li class="list-group-item">
                            <b>{{ __('Account Type') }}</b> 
                            <span class="float-right badge {{ $inquiry->user_id ? 'badge-success' : 'badge-secondary' }}">
                                {{ $inquiry->user_id ? __('Registered') : __('Guest') }}
                            </span>
                        </li>
                    </ul>

                    @if($inquiry->user_id)
                        <a href="{{ route('admin.users.show', $inquiry->user_id) }}" class="btn btn-warning btn-block text-white">
                            <i class="fas fa-user-shield"></i> {{ __('View Profile') }}
                        </a>
                    @endif
                </div>
            </div>
        </div>
    </div>
@stop
