@extends('adminlte::page')

@section('title', __('Application') . ' #' . $application->id)

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-8">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-file-signature mr-2 text-primary"></i> {{ __('Application Manifest') }} <small class="text-muted ml-2">#{{ $application->id }}</small>
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">Unified candidate dossier for talent evaluation, hiring workflow, and record-keeping.</p>
            </div>
            <div class="col-sm-4 text-right">
                <a href="{{ route('admin.bookings.jobs') }}" class="btn btn-back shadow-sm rounded-pill px-4 py-2 font-weight-bold smallest uppercase letter-spacing-1">
                    <i class="fas fa-arrow-left mr-1"></i> Return to Registry
                </a>
            </div>
        </div>
    </div>
@stop

@section('content_header_breadcrumbs')
@stop

@section('content')
    <div class="container-fluid pb-5">
        @include('admin.alert')

        <div class="row">
            {{-- Left: Candidate & Application Content --}}
            <div class="col-md-8">
                <div class="card card-premium shadow-premium border-0 overflow-hidden mb-4 rounded-24">
                    <div class="card-header border-0 bg-white py-4 px-4 d-flex align-items-center justify-content-between">
                        <h5 class="card-title font-weight-bold text-dark text-uppercase mb-0 letter-spacing-1">
                            <i class="fas fa-file-alt mr-2 text-primary opacity-50"></i> {{ __('Submission Dossier') }}
                        </h5>
                        <div class="card-tools">
                            @php
                                $statusMap = [
                                    'submitted' => 'badge-warning',
                                    'reviewed'  => 'badge-info',
                                    'accepted'  => 'badge-success',
                                    'hired'     => 'badge-success',
                                    'rejected'  => 'badge-danger',
                                ];
                                $statusClass = $statusMap[$application->status] ?? 'badge-secondary';
                            @endphp
                            <span class="badge {{ $statusClass }}-light text-{{ str_replace('badge-', '', $statusClass) }} px-3 py-2 rounded-pill font-weight-bold smallest uppercase letter-spacing-1 shadow-xs">
                                {{ strtoupper($application->status) }}
                            </span>
                        </div>
                    </div>
                    <div class="card-body px-4 pb-4">
                        <div class="bg-primary-soft p-4 rounded-xl border border-primary-soft mb-4">
                            <h6 class="font-weight-bold text-primary text-uppercase smallest letter-spacing-1 mb-3">
                                <i class="fas fa-quote-left mr-2"></i> {{ __('Professional Cover Letter') }}
                            </h6>
                            <div class="text-dark font-weight-500 leading-loose font-1-05 pre-wrap">
                                @if($application->cover_letter)
                                    {{ $application->cover_letter }}
                                @else
                                    <em class="text-muted smallest uppercase letter-spacing-1">{{ __('No formal cover letter was transmitted by the candidate.') }}</em>
                                @endif
                            </div>
                        </div>

                        {{-- Metadata / Attachments Placeholder (If any) --}}
                        <div class="row mt-4">
                            <div class="col-md-6">
                                <div class="p-3 border rounded-xl bg-light shadow-xs">
                                    <span class="d-block smallest font-weight-bold text-muted uppercase mb-1">Intent Verification</span>
                                    <span class="d-block font-weight-bold text-dark">Self-Submitted Form</span>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="p-3 border rounded-xl bg-light shadow-xs">
                                    <span class="d-block smallest font-weight-bold text-muted uppercase mb-1">Dossier Integrity</span>
                                    <span class="d-block font-weight-bold text-success"><i class="fas fa-shield-alt mr-1"></i> Verified Record</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="card-footer bg-light border-0 py-4 px-4">
                        <div class="d-flex align-items-center justify-content-between">
                            <div class="dropdown">
                                <button type="button" class="btn btn-white shadow-xs rounded-pill px-4 font-weight-bold smallest uppercase letter-spacing-1 dropdown-toggle" data-toggle="dropdown">
                                    <i class="fas fa-user-edit mr-1 text-primary"></i> {{ __('Advance Pipeline') }}
                                </button>
                                <div class="dropdown-menu shadow-premium-lg border-0 py-2 rounded-xl">
                                    @foreach(['submitted', 'reviewed', 'interview', 'rejected', 'hired'] as $status)
                                        <a class="dropdown-item py-2 px-4 smallest font-weight-bold text-uppercase letter-spacing-1" href="javascript:void(0)">{{ $status }}</a>
                                    @endforeach
                                </div>
                            </div>
                            
                            <span class="smallest text-muted font-weight-bold uppercase">
                                <i class="fas fa-fingerprint mr-1"></i> System Audited Submission
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {{-- Right: Sidebar Info --}}
            <div class="col-md-4">
                {{-- Job Info --}}
                <div class="card card-premium shadow-premium border-0 overflow-hidden mb-4 rounded-24">
                    <div class="card-header border-0 bg-white py-4 px-4">
                        <h5 class="card-title font-weight-bold text-dark text-uppercase smallest mb-0 letter-spacing-1">
                            <i class="fas fa-briefcase mr-2 text-primary opacity-50"></i> {{ __('Target Position') }}
                        </h5>
                    </div>
                    <div class="card-body px-4 pb-4">
                        <div class="d-flex align-items-center mb-4">
                            <div class="icon-circle bg-primary-soft text-primary mr-3 shadow-xs icon-box-md">
                                <i class="fas fa-building"></i>
                            </div>
                            <div>
                                <h6 class="font-weight-bold text-dark mb-0">{{ $application->job->title ?? __('N/A') }}</h6>
                                <span class="badge badge-light border text-muted smallest uppercase font-weight-bold px-2">{{ $application->job->category->title ?? __('General Recruitment') }}</span>
                            </div>
                        </div>
                        
                        <div class="px-3 py-2 bg-light rounded-xl border mb-2 d-flex justify-content-between align-items-center">
                            <span class="smallest font-weight-bold text-muted uppercase">Applied At</span>
                            <span class="smallest font-weight-bold text-dark">{{ $application->created_at->format('M d, Y @ H:i') }}</span>
                        </div>
                        <div class="px-3 py-2 bg-light rounded-xl border d-flex justify-content-between align-items-center">
                            <span class="smallest font-weight-bold text-muted uppercase">Reference ID</span>
                            <span class="smallest font-weight-bold text-dark text-monospace">#JAPP-{{ str_pad($application->id, 5, '0', STR_PAD_LEFT) }}</span>
                        </div>
                    </div>
                </div>

                {{-- Candidate Info --}}
                <div class="card card-premium shadow-premium border-0 overflow-hidden mb-4 rounded-24">
                    <div class="card-header border-0 bg-white py-4 px-4">
                        <h5 class="card-title font-weight-bold text-dark text-uppercase smallest mb-0 letter-spacing-1">
                            <i class="fas fa-user-tie mr-2 text-primary opacity-50"></i> {{ __('Candidate Identity') }}
                        </h5>
                    </div>
                    <div class="card-body px-4 pb-4 text-center">
                        <div class="position-relative d-inline-block mb-3">
                            <img src="https://ui-avatars.com/api/?name={{ urlencode($application->user->name) }}&background=46a5ac&color=fff&size=200" 
                                 class="img-circle shadow-premium border border-white icon-box-lg border-4">
                            <div class="status-indicator bg-success position-absolute b-5-r-5-w-20-h-20-round-border-3"></div>
                        </div>
                        
                        <h5 class="font-weight-bold text-dark mb-1">{{ $application->user->name }}</h5>
                        <p class="text-muted smallest font-weight-bold uppercase letter-spacing-1 mb-4">{{ $application->user->email }}</p>
                        
                        <div class="text-left mb-4">
                            <div class="d-flex align-items-center mb-3">
                                <div class="icon-box-soft bg-light mr-3 d-flex align-items-center justify-content-center icon-box-sm">
                                    <i class="fas fa-phone fa-xs text-muted"></i>
                                </div>
                                <span class="smallest font-weight-bold text-dark">{{ $application->user->phone ?? __('Not Provided') }}</span>
                            </div>
                            <div class="d-flex align-items-center">
                                <div class="icon-box-soft bg-light mr-3 d-flex align-items-center justify-content-center icon-box-sm">
                                    <i class="fas fa-eye fa-xs text-muted"></i>
                                </div>
                                <span class="smallest font-weight-bold text-muted uppercase">
                                    {{ $application->viewed_at ? __('Registry Review') . ': ' . $application->viewed_at->format('M d, H:i') : __('Awaiting Agency Review') }}
                                </span>
                            </div>
                        </div>

                        <a href="{{ route('admin.users.show', $application->user_id) }}" class="btn btn-white btn-block rounded-pill shadow-xs font-weight-bold smallest uppercase letter-spacing-1 py-2">
                            <i class="fas fa-external-link-alt mr-1 text-primary"></i> {{ __('View Deep Profile') }}
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
@stop

@push('css')
<style>
    /* Print or view specific styles can be added here if needed */
</style>
@endpush
