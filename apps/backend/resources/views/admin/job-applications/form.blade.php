{{--
    Administrative Jobs: Application Configuration
    
    This view serves as the authoritative interface for managing job 
    applications. It orchestrates candidate identity parameters, 
    pitch content (cover letter), and pipeline status tracking 
    (pending, reviewed, shortlisted, rejected, hired) to ensure 
    transparent and efficient recruitment oversight.
    
    @extends adminlte::page
    @context Job Application Management
    @variables JobApplication $application The application model instance.
    @variables Collection $jobs List of active job listings for mapping.
    @variables Collection $users List of platform members for candidate mapping.
--}}
@extends('adminlte::page')

@section('title', ($application->exists ? __('Modify') : __('Create')) . ' ' . __('Job Application'))

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-8">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-briefcase mr-2 text-primary opacity-50"></i> 
                    {{ $application->exists ? __('Update Application: #') . $application->id : __('New Career Submission') }}
                </h1>
                <p class="text-muted mt-2 small uppercase letter-spacing-1 mb-0">
                    {{ $application->exists ? __('Managing candidate submission for career opportunities.') : __('Manually logging a new candidate application.') }}
                </p>
            </div>
            <div class="col-sm-4 text-right">
                <a href="{{ route('admin.job-applications.index') }}" class="btn btn-back shadow-sm">
                    <i class="fas fa-arrow-left mr-1"></i> {{ __('Back to Queue') }}
                </a>
            </div>
        </div>
    </div>
@stop

@section('content')
<div class="container-fluid pb-5">
    @include('admin.alert')

    <form id="application-form" 
          action="{{ $application->exists ? route('admin.job-applications.update', $application->id) : route('admin.job-applications.store') }}" 
          method="POST">
        @csrf
        @if($application->exists) @method('PATCH') @endif

        <div class="row">
            {{-- Main Content Column --}}
            <div class="col-md-8">
                {{-- Lead Information --}}
                <div class="card border-0 shadow-premium rounded-xl overflow-hidden mb-4">
                    <div class="card-header border-0 bg-white py-4 px-4">
                        <h3 class="card-title-main">{{ __('Application Parameters') }}</h3>
                    </div>
                    <div class="card-body p-4 pt-0">
                        <div class="row">
                            <div class="col-md-6">
                                <div class="form-group mb-4">
                                    <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">Target Job Listing</label>
                                    <select name="job_listing_id" class="form-control select2" required>
                                        <option value="">Select Position</option>
                                        @foreach($jobs as $job)
                                            <option value="{{ $job->id }}" {{ old('job_listing_id', $application->job_listing_id) == $job->id ? 'selected' : '' }}>
                                                {{ $job->title }}
                                            </option>
                                        @endforeach
                                    </select>
                                    @error('job_listing_id') <span class="invalid-feedback d-block">{{ $message }}</span> @enderror
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group mb-4">
                                    <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">Candidate Principal</label>
                                    <select name="user_id" class="form-control select2" required>
                                        <option value="">Associate User</option>
                                        @foreach($users as $user)
                                            <option value="{{ $user->id }}" {{ old('user_id', $application->user_id) == $user->id ? 'selected' : '' }}>
                                                {{ $user->name }} ({{ $user->email }})
                                            </option>
                                        @endforeach
                                    </select>
                                    @error('user_id') <span class="invalid-feedback d-block">{{ $message }}</span> @enderror
                                </div>
                            </div>
                        </div>

                        <div class="form-group mb-0">
                            <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">{{ __('Cover Letter / Application Pitch') }}</label>
                            <textarea name="cover_letter" class="form-control textarea-premium" rows="12"
                                placeholder="{{ __('Candidate pitch, introductory message, or application context...') }}">{{ old('cover_letter', $application->cover_letter) }}</textarea>
                            @error('cover_letter') <span class="invalid-feedback d-block">{{ $message }}</span> @enderror
                        </div>
                    </div>
                </div>
            </div>

            {{-- Sidebar Column --}}
            <div class="col-md-4">
                @include('admin._partials._form-actions', [
                    'model' => $application,
                    'title' => __('APPLICATION'),
                    'back' => 'admin.job-applications.index'
                ])

                {{-- Status Control --}}
                <div class="card border-0 shadow-premium mb-4 rounded-xl overflow-hidden mt-4">
                    <div class="card-header border-0 bg-white py-4 px-4">
                        <h3 class="card-title-side">{{ __('Review Status') }}</h3>
                    </div>
                    <div class="card-body p-4 pt-0">
                        <div class="form-group mb-3">
                            <select name="status" class="form-control form-control-premium @error('status') is-invalid @enderror" required>
                                @foreach(['pending', 'reviewed', 'shortlisted', 'rejected', 'hired'] as $st)
                                    <option value="{{ $st }}" {{ old('status', $application->status ?? 'pending') == $st ? 'selected' : '' }}>
                                        {{ strtoupper(__($st)) }}
                                    </option>
                                @endforeach
                            </select>
                            @error('status') <span class="invalid-feedback d-block">{{ $message }}</span> @enderror
                        </div>
                        <div class="p-3 bg-light rounded-xl border border-light">
                            <p class="smallest text-muted mb-0 font-italic">
                                <i class="fas fa-info-circle mr-1"></i> {{ __('Status updates are synchronized with the candidate\'s career portal.') }}
                            </p>
                        </div>
                    </div>
                </div>

                {{-- Meta Information --}}
                <div class="card border-0 shadow-premium mb-4 rounded-xl overflow-hidden">
                    <div class="card-header border-0 bg-white py-4 px-4">
                        <h3 class="card-title-side">{{ __('Audit Trail') }}</h3>
                    </div>
                    <div class="card-body p-4 pt-0">
                        <div class="d-flex justify-content-between mb-2">
                            <span class="small text-muted uppercase letter-spacing-1">{{ __('Submitted At') }}</span>
                            <span class="small font-weight-bold">{{ $application->created_at ? $application->created_at->format('M d, Y') : __('Draft') }}</span>
                        </div>
                        <div class="d-flex justify-content-between">
                            <span class="small text-muted uppercase letter-spacing-1">{{ __('Candidate') }}</span>
                            <span class="small font-weight-bold text-primary">{{ __('Registered User') }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </form>
</div>
@endsection

@push('js')
<script>
    $(document).ready(function() {
        if (typeof $('.select2').select2 === 'function') {
            $('.select2').select2({
                theme: 'bootstrap4',
                width: '100%'
            });
        }
    });
</script>
@endpush
