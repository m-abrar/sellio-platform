{{--
    Administrative Classifieds: Inquiry Manifest Visualization
    
    This view provides a comprehensive 360-degree visualization of a 
    specific marketplace inquiry. It aggregates listing context, buyer 
    communication manifests, contact intelligence (verified vs guest), 
    and operational metadata. It facilitates in-depth lead auditing and 
    registry maintenance.
    
    @extends adminlte::page
    @context Classified Module Management
    @variables ClassifiedInquiry $inquiry The classified inquiry model instance.
--}}
@extends('adminlte::page')

@section('title', __('Classified Inquiry') . ' #' . $inquiry->id)

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-8">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-tags mr-2 text-primary"></i> {{ __('Classified Manifest') }} <small class="text-muted ml-2">#{{ $inquiry->id }}</small>
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">Monitor marketplace inquiries, buyer messages, and direct listing interactions.</p>
            </div>
            <div class="col-sm-4 text-right">
                <a href="{{ route('admin.bookings.classifieds') }}" class="btn btn-back shadow-sm rounded-pill px-4 py-2 font-weight-bold smallest uppercase letter-spacing-1">
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
            {{-- Left Side: Inquiry Content --}}
            <div class="col-md-8">
                <div class="card card-premium shadow-premium border-0 overflow-hidden mb-4" style="border-radius: 24px;">
                    <div class="card-header border-0 bg-white py-4 px-4 d-flex align-items-center justify-content-between">
                        <h5 class="card-title font-weight-bold text-dark text-uppercase mb-0" style="letter-spacing: 1px;">
                            <i class="fas fa-layer-group mr-2 text-primary opacity-50"></i> {{ __('Listing Context') }}
                        </h5>
                        <div class="card-tools">
                             <span class="badge {{ str_contains($inquiry->getStatusBadgeClass(), 'success') ? 'badge-success' : 'badge-warning' }}-light text-{{ str_contains($inquiry->getStatusBadgeClass(), 'success') ? 'success' : 'warning' }} px-3 py-2 rounded-pill font-weight-bold smallest uppercase letter-spacing-1 shadow-xs">
                                {{ strtoupper($inquiry->status) }}
                            </span>
                        </div>
                    </div>
                    <div class="card-body px-4 pb-4">
                        <div class="row mb-4">
                            <div class="col-sm-8">
                                <label class="smallest font-weight-bold text-muted text-uppercase letter-spacing-1 mb-2 d-block">{{ __('Marketplace Item') }}</label>
                                <h4 class="text-dark font-weight-bold mb-1">{{ $inquiry->classifiedAd->title ?? __('N/A') }}</h4>
                                <span class="badge badge-light border text-muted smallest uppercase font-weight-bold px-2">{{ $inquiry->classifiedAd->category->title ?? __('General Listing') }}</span>
                            </div>
                            <div class="col-sm-4 text-sm-right border-left pl-md-4">
                                <label class="smallest font-weight-bold text-muted text-uppercase letter-spacing-1 mb-1 d-block">{{ __('Asking Valuation') }}</label>
                                <h3 class="text-success font-weight-bold mb-0" style="letter-spacing: -1px;">
                                    ${{ number_format($inquiry->classifiedAd->price ?? 0, 2) }}
                                </h3>
                            </div>
                        </div>

                        <div class="bg-primary-soft p-4 rounded-xl border border-primary-soft mt-2">
                            <h6 class="font-weight-bold text-primary text-uppercase smallest letter-spacing-1 mb-3">
                                <i class="fas fa-envelope-open-text mr-2"></i> {{ __('Buyer Communication') }}
                            </h6>
                            <div class="text-dark font-weight-500" style="line-height: 1.8; font-size: 1.1rem; font-style: italic;">
                                @if($inquiry->message)
                                    "{{ $inquiry->message }}"
                                @else
                                    <em class="text-muted smallest uppercase letter-spacing-1">{{ __('No specific message was attached to this inquiry.') }}</em>
                                @endif
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {{-- Right Side: Contact Info --}}
            <div class="col-md-4">
                <div class="card card-premium shadow-premium border-0 overflow-hidden mb-4" style="border-radius: 24px;">
                    <div class="card-header border-0 bg-white py-4 px-4">
                        <h5 class="card-title font-weight-bold text-dark text-uppercase smallest mb-0" style="letter-spacing: 1px;">
                            <i class="fas fa-user-circle mr-2 text-primary opacity-50"></i> {{ __('Contact Details') }}
                        </h5>
                    </div>
                    <div class="card-body px-4 pb-4 text-center">
                        <div class="position-relative d-inline-block mb-3">
                             <img class="img-circle shadow-premium border border-white"
                                 src="{{ $inquiry->user?->avatar_url ?? asset('images/fallbacks/default-avatar.png') }}"
                                 style="width: 90px; height: 90px; border-width: 4px !important;">
                        </div>
                        
                        <h5 class="font-weight-bold text-dark mb-1">{{ $inquiry->full_name ?? $inquiry->user->name }}</h5>
                        <p class="text-muted smallest font-weight-bold uppercase letter-spacing-1 mb-4">{{ $inquiry->email ?? $inquiry->user->email }}</p>

                        <div class="text-left mb-4">
                            <div class="px-3 py-2 bg-light rounded-xl border mb-2 d-flex justify-content-between align-items-center">
                                <span class="smallest font-weight-bold text-muted uppercase">Primary Phone</span>
                                <span class="smallest font-weight-bold text-dark">{{ $inquiry->phone ?? __('N/A') }}</span>
                            </div>
                            <div class="px-3 py-2 bg-light rounded-xl border d-flex justify-content-between align-items-center">
                                <span class="smallest font-weight-bold text-muted uppercase">Identity Type</span> 
                                <span class="badge {{ $inquiry->user_id ? 'badge-success-light text-success' : 'badge-secondary-light text-secondary' }} px-2 py-1 rounded-pill smallest font-weight-bold uppercase">
                                    {{ $inquiry->user_id ? __('Verified User') : __('Guest Prospect') }}
                                </span>
                            </div>
                        </div>

                        @if($inquiry->user_id)
                            <a href="{{ route('admin.users.show', $inquiry->user_id) }}" class="btn btn-white btn-block rounded-pill shadow-xs font-weight-bold smallest uppercase letter-spacing-1 py-2">
                                <i class="fas fa-user-shield mr-1 text-primary"></i> {{ __('View Deep Profile') }}
                            </a>
                        @endif
                    </div>
                </div>
                
                <div class="card card-premium shadow-premium border-0 overflow-hidden mb-4" style="border-radius: 24px;">
                    <div class="card-header border-0 bg-white py-4 px-4">
                        <h5 class="card-title font-weight-bold text-dark text-uppercase smallest mb-0" style="letter-spacing: 1px;">
                            <i class="fas fa-info-circle mr-2 text-primary opacity-50"></i> {{ __('Operational Meta') }}
                        </h5>
                    </div>
                    <div class="card-body p-0">
                        <div class="px-4 py-3 border-bottom d-flex justify-content-between align-items-center">
                            <span class="smallest font-weight-bold text-muted uppercase">Interaction ID</span>
                            <span class="smallest font-weight-bold text-dark text-monospace">#CL-{{ str_pad($inquiry->id, 5, '0', STR_PAD_LEFT) }}</span>
                        </div>
                        <div class="px-4 py-3 border-bottom d-flex justify-content-between align-items-center">
                            <span class="smallest font-weight-bold text-muted uppercase">Submitted On</span>
                            <span class="smallest font-weight-bold text-dark">{{ $inquiry->created_at->format('M d, Y') }}</span>
                        </div>
                    </div>
                    <div class="card-footer bg-white border-0 py-4 px-4">
                        <form action="{{ route('admin.classified-inquiries.destroy', $inquiry->id) }}"
                              method="POST"
                              id="delete-cl-form">
                            @csrf
                            @method('DELETE')
                            <button type="button" class="btn btn-white btn-block rounded-pill border font-weight-bold smallest uppercase text-danger py-2" 
                                    data-action="delete-trigger"
                                    data-confirm-title="Purge Marketplace Inquiry?"
                                    data-confirm-text="This will permanently remove the interaction from the registry.">
                                <i class="fas fa-trash-alt mr-1"></i> {{ __('Purge Registry Record') }}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
@stop

@push('css')
@include('admin._partials._toggle-card-css')
@endpush

@section('js')
<script src="{{ asset('admin-assets/pages/registry-index.js') }}"></script>
@stop
