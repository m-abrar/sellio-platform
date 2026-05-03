@extends('adminlte::page')

@section('title', ($newsletterSubscriber->exists ? 'Edit' : 'Add') . ' Subscriber')

@section('content_header')
<div class="container-fluid pt-4">
    <div class="row mb-4 align-items-center">
        <div class="col-sm-8">
            <h1 class="m-0 text-dark font-weight-bold">
                <i class="fas fa-envelope-open-text mr-2 text-primary"></i> 
                {{ $newsletterSubscriber->exists ? 'Edit Subscriber' : 'New Subscriber' }}
            </h1>
            <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">Manage audience subscription status and acquisition metrics.</p>
        </div>
        <div class="col-sm-4 text-right">
            <a href="{{ route('admin.newsletter-subscribers.index') }}" class="btn btn-back shadow-sm">
                <i class="fas fa-arrow-left mr-1"></i> Back to List
            </a>
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
                <div class="card card-premium overflow-hidden">
                    <div class="card-header border-0 bg-white py-3 px-4">
                        <h3 class="card-title font-weight-bold text-dark text-uppercase small" style="letter-spacing: 1px;">Subscriber Details</h3>
                    </div>
                    <div class="card-body p-4">
                        <div class="form-group mb-4">
                            <label for="email" class="font-weight-600">Email Address <span class="text-danger">*</span></label>
                            <div class="input-group shadow-xs">
                                <div class="input-group-prepend">
                                    <span class="input-group-text bg-light border-right-0"><i class="fas fa-at text-muted"></i></span>
                                </div>
                                <input type="email" name="email" id="email" class="form-control form-control-lg @error('email') is-invalid @enderror" 
                                       value="{{ old('email', $newsletterSubscriber->email ?? '') }}" required placeholder="email@example.com">
                            </div>
                            @error('email') <span class="invalid-feedback d-block">{{ $message }}</span> @enderror
                        </div>

                        <div class="form-group mb-0">
                            <label for="source" class="font-weight-600">Registration Source</label>
                            <input type="text" name="source" id="source" class="form-control @error('source') is-invalid @enderror" 
                                   value="{{ old('source', $newsletterSubscriber->source ?? '') }}" placeholder="e.g. Footer, Checkout, Admin">
                            <small class="text-muted">Where did this user subscribe from?</small>
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
                <div class="card card-premium shadow-premium mt-4 overflow-hidden">
                    <div class="card-header bg-white border-0 py-3 px-4">
                        <h3 class="card-title font-weight-bold text-dark mb-0 small text-uppercase letter-spacing-1">Lifecycle State</h3>
                    </div>
                    <div class="card-body p-4">
                        <label class="w-100 cursor-pointer mb-0">
                            @php $confirmed = old('is_confirmed', $newsletterSubscriber->is_confirmed ?? false); @endphp
                            <input type="hidden" name="is_confirmed" value="0">
                            <input type="checkbox" name="is_confirmed" value="1" 
                                   class="d-none toggle-input" 
                                   {{ $confirmed ? 'checked' : '' }}>
                            
                            <div class="border rounded px-3 py-3 d-flex justify-content-between align-items-center toggle-card shadow-xs">
                                <div>
                                    <div class="font-weight-bold smallest text-uppercase text-muted letter-spacing-1 mb-1">Confirmed?</div>
                                    <div class="small toggle-status font-weight-bold {{ $confirmed ? 'text-success' : 'text-warning' }}">
                                        {{ $confirmed ? 'SUBSCRIPTION VERIFIED' : 'PENDING VERIFICATION' }}
                                    </div>
                                </div>
                                <div class="toggle-indicator"></div>
                            </div>
                        </label>
                    </div>
                </div>

                {{-- Metadata Card (Only on Edit) --}}
                @if($newsletterSubscriber->exists)
                <div class="card card-premium shadow-premium mt-4 overflow-hidden">
                    <div class="card-body p-4 small text-muted">
                        <div class="d-flex justify-content-between mb-2">
                            <span class="smallest font-weight-bold uppercase">Subscribed on</span>
                            <span class="text-dark font-weight-bold">{{ $newsletterSubscriber->created_at->format('M d, Y') }}</span>
                        </div>
                        <div class="d-flex justify-content-between">
                            <span class="smallest font-weight-bold uppercase">Last Updated</span>
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



@push('css')
<style>
/* Custom Toggle Logic */
.toggle-card { transition: all 0.3s ease; background-color: #f8f9fa; cursor: pointer; border-color: var(--border-color) !important; }
.toggle-input:checked + .toggle-card { background-color: rgba(40, 167, 69, 0.05); border-color: #28a745 !important; }
.toggle-indicator { width: 36px; height: 20px; border-radius: 10px; background-color: #ccc; position: relative; }
.toggle-indicator::after { 
    content: ''; position: absolute; top: 2px; left: 2px; width: 16px; height: 16px; 
    border-radius: 50%; background-color: white; transition: all 0.3s ease; 
}
.toggle-input:checked + .toggle-card .toggle-indicator { background-color: #28a745; }
.toggle-input:checked + .toggle-card .toggle-indicator::after { transform: translateX(16px); }
</style>
@endpush

@push('js')
<script>
    document.addEventListener('DOMContentLoaded', function () {
        const toggleInput = document.querySelector('.toggle-input');
        const statusText = document.querySelector('.toggle-status');
        
        if (toggleInput) {
            toggleInput.addEventListener('change', function() {
                statusText.textContent = this.checked ? 'SUBSCRIPTION VERIFIED' : 'PENDING VERIFICATION';
                statusText.className = 'small toggle-status font-weight-bold ' + (this.checked ? 'text-success' : 'text-warning');
            });
        }
    });
</script>
@endpush
