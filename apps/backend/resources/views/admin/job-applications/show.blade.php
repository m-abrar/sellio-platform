@extends('adminlte::page')

@section('title', __('Application') . ' #' . $application->id)

@section('content_header')
    <div class="d-flex justify-content-between">
        <h1>{{ __('Job Application') }} <small class="text-muted">#{{ $application->id }}</small></h1>
        <a href="{{ route('admin.bookings.index') }}" class="btn btn-default btn-sm">
            <i class="fas fa-arrow-left"></i> {{ __('Back to List') }}
        </a>
    </div>
@stop

@section('content')
    @include('admin.alert')

    <div class="row">
        {{-- Left: Candidate & Application Content --}}
        <div class="col-md-8">
            <div class="card card-outline card-primary">
                <div class="card-header">
                    <h3 class="card-title"><i class="fas fa-file-alt"></i> {{ __('Application Content') }}</h3>
                    <div class="card-tools">
                        <span class="badge {{ $application->getStatusBadgeClass() }} px-3 py-2">
                            {{ Str::upper($application->status) }}
                        </span>
                    </div>
                </div>
                <div class="card-body">
                    <h5>{{ __('Cover Letter') }}</h5>
                    <div class="p-4 bg-light border rounded" style="white-space: pre-wrap; line-height: 1.6;">
                        @if($application->cover_letter)
                            {{ $application->cover_letter }}
                        @else
                            <em class="text-muted">{{ __('No cover letter provided by the applicant.') }}</em>
                        @endif
                    </div>
                </div>
                <div class="card-footer">
                    <div class="btn-group">
                        <button type="button" class="btn btn-info dropdown-toggle" data-toggle="dropdown">
                            <i class="fas fa-user-edit"></i> {{ __('Update Status') }}
                        </button>
                        <div class="dropdown-menu">
                            @foreach(['pending', 'reviewed', 'interview', 'rejected', 'hired'] as $status)
                                <a class="dropdown-item" href="#">{{ Str::title($status) }}</a>
                            @endforeach
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {{-- Right: Sidebar Info --}}
        <div class="col-md-4">
            {{-- Job Info --}}
            <div class="card card-outline card-info">
                <div class="card-header">
                    <h3 class="card-title"><i class="fas fa-briefcase"></i> {{ __('Target Position') }}</h3>
                </div>
                <div class="card-body">
                    <h5><strong>{{ $application->job->title ?? __('N/A') }}</strong></h5>
                    <p class="text-muted">{{ __('Department') }}: {{ $application->job->category->name ?? __('General') }}</p>
                    <hr>
                    <small class="text-muted">{{ __('Applied on') }}:</small>
                    <p>{{ $application->created_at->format('M d, Y @ H:i') }}</p>
                </div>
            </div>

            {{-- Candidate Info --}}
            <div class="card card-outline card-success">
                <div class="card-header">
                    <h3 class="card-title"><i class="fas fa-user-tie"></i> {{ __('Candidate Profile') }}</h3>
                </div>
                <div class="card-body text-center">
                    <img src="https://ui-avatars.com/api/?name={{ urlencode($application->user->name) }}&background=28a745&color=fff" class="img-circle elevation-2 mb-3" style="width: 90px;">
                    <h4>{{ $application->user->name }}</h4>
                    <p class="text-muted">{{ $application->user->email }}</p>
                    <hr>
                    <div class="text-left">
                        <p><strong><i class="fas fa-phone mr-2"></i></strong> {{ $application->user->phone ?? __('N/A') }}</p>
                        <p><strong><i class="fas fa-eye mr-2"></i></strong> 
                            <span class="text-muted small">
                                {{ $application->viewed_at ? __('Viewed at') . ' ' . $application->viewed_at->format('M d, H:i') : __('Not viewed yet') }}
                            </span>
                        </p>
                    </div>
                    <a href="{{ route('admin.users.show', $application->user_id) }}" class="btn btn-outline-success btn-block btn-sm">
                        {{ __('Full Candidate History') }}
                    </a>
                </div>
            </div>
        </div>
    </div>
@stop
