{{--
    Administrative Marketing Module: Audience Identity Architect
    
    This view provides the primary interface for managing newsletter 
    subscriber profiles. It facilitates email identity orchestration, 
    acquisition source attribution, and opt-in status lifecycle 
    configuration (Verified Lead vs. Pending Opt-in).
    
    @extends adminlte::page
    @context Marketing Management
    @variables NewsletterSubscriber $newsletterSubscriber The subscriber model instance.
--}}
@extends('adminlte::page')

@section('title', ($newsletterSubscriber->exists ? 'Edit' : 'Add') . ' Subscriber')

@section('content_header')
<div class="container-fluid pt-4">
    <div class="row mb-4 align-items-center">
        <div class="col-sm-8">
            <h1 class="m-0 text-dark font-weight-bold">
                <i class="fas fa-envelope-open-text mr-2 text-primary opacity-50"></i> 
                {{ $newsletterSubscriber->exists ? 'Edit Subscriber' : 'New Subscriber' }}
            </h1>
            <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">Manage audience subscription status and acquisition metrics.</p>
        </div>
        <div class="col-sm-4 text-right">
            <div class="d-flex justify-content-end align-items-center gap-12">
                <a href="{{ route('admin.welcome') }}" class="btn-back shadow-sm">
                    <i class="fas fa-th-large"></i> Dashboard
                </a>
                <a href="{{ route('admin.newsletter-subscribers.index') }}" class="btn-back shadow-sm">
                    <i class="fas fa-arrow-left"></i> Back to Ledger
                </a>
            </div>
        </div>
    </div>
</div>
@stop

@section('content')
<div class="container-fluid">
    @include('admin.alert')

    <form id="subscriber-form" 
          action="{{ $newsletterSubscriber->exists ? route('admin.newsletter-subscribers.update', $newsletterSubscriber->id) : route('admin.newsletter-subscribers.store') }}" 
          method="POST">
        @csrf
        @if($newsletterSubscriber->exists) @method('PATCH') @endif

        <div class="row pb-5">
            {{-- Left Column: Main Data --}}
            <div class="col-md-8">
                <div class="card card-premium">
                    <div class="card-header border-0 bg-white py-4 px-4">
                        <h3 class="card-title font-weight-bold text-dark mb-0 smallest text-uppercase letter-spacing-1">
                            <i class="fas fa-user-tag mr-2 text-primary opacity-50"></i> Subscriber Identity
                        </h3>
                    </div>
                    <div class="card-body p-4">
                        <div class="form-group mb-4">
                            <label class="small font-weight-bold text-secondary mb-2 text-uppercase ls-0-5">Email Address <span class="text-danger">*</span></label>
                            <div class="input-group border rounded p-1 shadow-xs bg-white">
                                <div class="input-group-prepend border-0">
                                    <span class="input-group-text bg-white border-0"><i class="fas fa-at text-primary"></i></span>
                                </div>
                                <input type="email" name="email" id="email" class="form-control border-0 @error('email') is-invalid @enderror" 
                                       value="{{ old('email', $newsletterSubscriber->email ?? '') }}" required placeholder="email@example.com">
                            </div>
                            @error('email') <span class="invalid-feedback d-block">{{ $message }}</span> @enderror
                        </div>

                        <div class="form-group mb-0">
                            <label class="small font-weight-bold text-secondary mb-2 text-uppercase ls-0-5">Registration Source</label>
                            <div class="input-group border rounded p-1 shadow-xs bg-white">
                                <div class="input-group-prepend border-0">
                                    <span class="input-group-text bg-white border-0"><i class="fas fa-fingerprint text-primary"></i></span>
                                </div>
                                <input type="text" name="source" id="source" class="form-control border-0 @error('source') is-invalid @enderror" 
                                       value="{{ old('source', $newsletterSubscriber->source ?? '') }}" placeholder="e.g. Footer, Checkout, Admin">
                            </div>
                            <small class="text-muted mt-2 d-block">Origin of the subscription event.</small>
                            @error('source') <span class="invalid-feedback">{{ $message }}</span> @enderror
                        </div>
                    </div>
                </div>
            </div>

            {{-- Right Column: Actions & Metadata --}}
            <div class="col-md-4">
                {{-- Action Card --}}
                @include('admin._partials._form-actions', [
                    'model' => $newsletterSubscriber,
                    'title' => 'SUBSCRIBER',
                    'back' => 'admin.newsletter-subscribers.index'
                ])

                {{-- Status Logic Card --}}
                <div class="card card-premium shadow-premium mt-4">
                    <div class="card-header bg-white border-0 py-3 px-4">
                        <h3 class="card-title font-weight-bold text-dark mb-0 smallest text-uppercase letter-spacing-1">Lifecycle State</h3>
                    </div>
                    <div class="card-body p-4">
                        <label class="w-100 cursor-pointer mb-0">
                            @php $confirmed = old('is_confirmed', $newsletterSubscriber->is_confirmed ?? false); @endphp
                            <input type="hidden" name="is_confirmed" value="0">
                            <input type="checkbox" name="is_confirmed" value="1" 
                                   class="d-none toggle-input" 
                                   {{ $confirmed ? 'checked' : '' }}>
                            
                            <div class="d-flex justify-content-between align-items-center toggle-card">
                                <div>
                                    <div class="fw-bold small text-dark">Subscription Status</div>
                                    <div class="small toggle-status text-muted">{{ $confirmed ? 'Verified Lead' : 'Pending Opt-in' }}</div>
                                </div>
                                <div class="toggle-indicator"></div>
                            </div>
                        </label>
                    </div>
                </div>

                {{-- Metadata Card (Only on Edit) --}}
                @if($newsletterSubscriber->exists)
                <div class="card card-premium shadow-premium mt-4">
                    <div class="card-body p-4 small text-muted">
                        <div class="d-flex justify-content-between mb-2">
                            <span class="smallest font-weight-bold uppercase letter-spacing-1">Subscribed on</span>
                            <span class="text-dark font-weight-bold">{{ $newsletterSubscriber->created_at->format('M d, Y') }}</span>
                        </div>
                        <div class="d-flex justify-content-between">
                            <span class="smallest font-weight-bold uppercase letter-spacing-1">Last Updated</span>
                            <span class="text-dark font-weight-bold">{{ $newsletterSubscriber->updated_at->diffForHumans() }}</span>
                        </div>
                    </div>
                </div>
                @endif
            </div>
        </div>
    </form>
</div>
@endsection

@section('css')
@include('admin._partials._toggle-card-css')
@stop

@section('js')
<script src="{{ asset('admin-assets/pages/registry-index.js') }}"></script>
@stop
