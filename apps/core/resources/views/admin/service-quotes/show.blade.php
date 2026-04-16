@extends('adminlte::page')

@section('title', __('Service Quote') . ' #' . $quote->id)

@section('content_header')
    <div class="d-flex justify-content-between align-items-center">
        <h1>
            <i class="fas fa-file-invoice text-warning mr-2"></i>
            {{ __('Quote Request') }} <small class="text-muted">#{{ $quote->id }}</small>
        </h1>
        <a href="{{ route('admin.service-quotes.index') }}" class="btn btn-default btn-sm">
            <i class="fas fa-arrow-left"></i> {{ __('Back to List') }}
        </a>
    </div>
@stop

@section('content')
    @include('admin.alert')

    <div class="row">
        {{-- Left Column: Quote & Service Details --}}
        <div class="col-md-8">

            {{-- Quote Details Card --}}
            <div class="card card-outline card-warning">
                <div class="card-header">
                    <h3 class="card-title"><i class="fas fa-tools mr-1"></i> {{ __('Service & Scope') }}</h3>
                    <div class="card-tools">
                        @php
                            $statusMap = [
                                'pending'  => 'badge-warning',
                                'quoted'   => 'badge-info',
                                'accepted' => 'badge-success',
                                'rejected' => 'badge-danger',
                            ];
                        @endphp
                        <span class="badge {{ $statusMap[$quote->status] ?? 'badge-secondary' }} px-3 py-2">
                            {{ Str::upper($quote->status) }}
                        </span>
                    </div>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-sm-7">
                            <label class="text-muted mb-0">{{ __('Service Requested') }}</label>
                            <h4 class="text-warning font-weight-bold">
                                {{ $quote->service->title ?? __('N/A') }}
                            </h4>
                            <p class="text-muted small">ID: #{{ $quote->service_id }}</p>
                        </div>
                        <div class="col-sm-5 text-sm-right border-left">
                            <label class="text-muted mb-0">{{ __('Submitted On') }}</label>
                            <p class="font-weight-bold">{{ $quote->created_at->format('M d, Y @ H:i') }}</p>
                            @if($quote->requested_date)
                                <label class="text-muted mb-0">{{ __('Desired Start Date') }}</label>
                                <p>{{ $quote->requested_date->format('M d, Y') }}</p>
                            @endif
                        </div>
                    </div>

                    @if($quote->scope_size)
                        <div class="mt-3">
                            <label class="text-muted mb-1">{{ __('Project Scope') }}</label>
                            <span class="badge badge-secondary px-3 py-2 text-capitalize" style="font-size: 0.85rem;">
                                <i class="fas fa-ruler-combined mr-1"></i> {{ $quote->scope_size }}
                            </span>
                        </div>
                    @endif

                    <hr>

                    <h5><i class="fas fa-comment-alt text-muted mr-2"></i>{{ __('Project Details / Requirements') }}</h5>
                    <div class="p-3 bg-light rounded border">
                        @if($quote->details)
                            {!! nl2br(e($quote->details)) !!}
                        @else
                            <em class="text-muted">{{ __('No specific details provided.') }}</em>
                        @endif
                    </div>
                </div>
            </div>

            {{-- Quoted Price Card --}}
            <div class="card card-outline {{ $quote->quoted_price ? 'card-success' : 'card-secondary' }}">
                <div class="card-header">
                    <h3 class="card-title"><i class="fas fa-dollar-sign mr-1"></i> {{ __('Quote & Pricing') }}</h3>
                </div>
                <div class="card-body">
                    @if($quote->quoted_price)
                        <div class="text-center py-3">
                            <p class="text-muted mb-1">{{ __('Quoted Price') }}</p>
                            <h2 class="text-success font-weight-bold display-4">
                                ${{ number_format($quote->quoted_price, 2) }}
                            </h2>
                            <p class="text-muted small">{{ __('Estimate provided by service partner') }}</p>
                        </div>
                    @else
                        <div class="text-center py-4 text-muted">
                            <i class="fas fa-hourglass-half fa-3x mb-3 d-block text-secondary"></i>
                            <p>{{ __('No price has been quoted yet.') }}</p>
                            <p class="small">{{ __('The partner has not responded to this request.') }}</p>
                        </div>
                    @endif
                </div>
            </div>

        </div>

        {{-- Right Sidebar: Customer Information --}}
        <div class="col-md-4">
            <div class="card card-outline card-dark">
                <div class="card-header">
                    <h3 class="card-title"><i class="fas fa-user-tag mr-1"></i> {{ __('Client Information') }}</h3>
                </div>
                <div class="card-body">
                    @if($quote->user)
                        <div class="text-center mb-3">
                            <img src="https://ui-avatars.com/api/?name={{ urlencode($quote->user->name) }}&background=ffc107&color=fff"
                                 class="img-circle elevation-2" style="width: 80px;" alt="{{ $quote->user->name }}">
                            <h5 class="mt-2 mb-0">{{ $quote->user->name }}</h5>
                            <small class="text-muted">{{ $quote->user->email }}</small>
                        </div>
                        <ul class="list-group list-group-unbordered mb-3">
                            <li class="list-group-item">
                                <b>{{ __('User ID') }}</b>
                                <span class="float-right text-monospace">#{{ $quote->user_id }}</span>
                            </li>
                            <li class="list-group-item">
                                <b>{{ __('Member Since') }}</b>
                                <span class="float-right">{{ $quote->user->created_at->format('M Y') }}</span>
                            </li>
                        </ul>
                        <a href="{{ route('admin.users.show', $quote->user_id) }}"
                           class="btn btn-warning btn-block btn-sm">
                            <i class="fas fa-external-link-alt"></i> {{ __('View User Profile') }}
                        </a>
                    @else
                        <div class="text-center py-4 text-muted">
                            <i class="fas fa-user-slash fa-3x mb-3 d-block text-gray"></i>
                            <p>{{ __('Guest / Account Deleted') }}</p>
                        </div>
                    @endif
                </div>
            </div>

            {{-- Meta Info Card --}}
            <div class="card card-outline card-secondary">
                <div class="card-header">
                    <h3 class="card-title"><i class="fas fa-info-circle mr-1"></i> {{ __('Meta') }}</h3>
                </div>
                <div class="card-body p-0">
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item d-flex justify-content-between">
                            <span class="text-muted">{{ __('Package') }}</span>
                            <span>{{ $quote->service_package_id ? '#' . $quote->service_package_id : __('N/A') }}</span>
                        </li>
                        <li class="list-group-item d-flex justify-content-between">
                            <span class="text-muted">{{ __('Viewed') }}</span>
                            <span>
                                @if($quote->viewed_at)
                                    <i class="fas fa-check text-success"></i> {{ $quote->viewed_at->diffForHumans() }}
                                @else
                                    <span class="badge badge-warning">{{ __('Unread') }}</span>
                                @endif
                            </span>
                        </li>
                        <li class="list-group-item d-flex justify-content-between">
                            <span class="text-muted">{{ __('Last Updated') }}</span>
                            <span>{{ $quote->updated_at->format('M d, Y') }}</span>
                        </li>
                    </ul>
                </div>
                <div class="card-footer bg-white">
                    <form action="{{ route('admin.service-quotes.destroy', $quote->id) }}"
                          method="POST"
                          onsubmit="return confirm('{{ __('Permanently delete this quote request?') }}')">
                        @csrf
                        @method('DELETE')
                        <button type="submit" class="btn btn-outline-danger btn-sm btn-block">
                            <i class="fas fa-trash-alt"></i> {{ __('Delete Quote') }}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </div>
@stop
