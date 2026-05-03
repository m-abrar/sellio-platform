@extends('adminlte::page')

@section('title', 'Edit Email Template')

@section('content_header')
<div class="container-fluid pt-4">
    <div class="row mb-4 align-items-center">
        <div class="col-sm-8">
            <h1 class="m-0 text-dark font-weight-bold">
                <i class="fas fa-envelope-open-text mr-2 text-primary"></i> 
                Edit Template: <span class="text-muted font-weight-bold text-uppercase">{{ $template->key }}</span>
            </h1>
            <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">Modify automated dispatch parameters and notification content.</p>
        </div>
        <div class="col-sm-4 text-right">
            <a href="{{ route('admin.email-templates.index') }}" class="btn btn-back shadow-sm">
                <i class="fas fa-arrow-left mr-1"></i> Back to Templates
            </a>
        </div>
    </div>
</div>
@stop

@section('content')
<div class="container-fluid">
    @include('admin.alert')

    <form id="template-form" action="{{ route('admin.email-templates.update', $template->id) }}" method="POST">
        @csrf
        @if($template->exists) @method('PATCH') @endif

        <div class="row pb-5">
            {{-- Left Column: Editor --}}
            <div class="col-md-8">
                <div class="card card-premium overflow-hidden">
                    <div class="card-header border-0 bg-white py-3 px-4">
                        <h3 class="card-title font-weight-bold text-dark text-uppercase small" style="letter-spacing: 1px;"><i class="fas fa-pen-nib mr-2 text-primary opacity-50"></i> Email Architect</h3>
                    </div>
                    <div class="card-body p-4">
                        <div class="form-group mb-4">
                            <label for="subject" class="font-weight-600">Email Subject <span class="text-danger">*</span></label>
                            <input type="text" name="subject" id="subject" class="form-control form-control-lg @error('subject') is-invalid @enderror" 
                                   value="{{ old('subject', $template->subject) }}" required placeholder="e.g. Your Subscription is Active">
                            @error('subject') <span class="invalid-feedback">{{ $message }}</span> @enderror
                        </div>

                        <div class="form-group mb-0">
                            <label for="body" class="font-weight-600">Body Content <span class="text-danger">*</span></label>
                            <textarea name="body" id="body" class="form-control @error('body') is-invalid @enderror" 
                                      rows="15" required>{{ old('body', $template->body) }}</textarea>
                            @error('body') <span class="invalid-feedback">{{ $message }}</span> @enderror
                        </div>
                    </div>
                </div>
            </div>

            {{-- Right Column: Status & Placeholders --}}
            <div class="col-md-4">
                {{-- Action Card --}}
                @include('admin._partials._form-actions', [
                    'model' => $template,
                    'title' => 'EMAIL TEMPLATE',
                    'back' => 'admin.email-templates.index'
                ])

                {{-- Status Logic Card --}}
                <div class="card card-premium shadow-premium mt-4 overflow-hidden">
                    <div class="card-header bg-white border-0 py-3 px-4">
                        <h3 class="card-title font-weight-bold text-dark mb-0 small text-uppercase letter-spacing-1">Lifecycle State</h3>
                    </div>
                    <div class="card-body p-4">
                         <label class="w-100 cursor-pointer mb-0">
                            <input type="hidden" name="is_active" value="0">
                            <input type="checkbox" name="is_active" value="1" 
                                   class="d-none toggle-input" 
                                   {{ $template->is_active ? 'checked' : '' }}>
                            
                            <div class="border rounded px-3 py-3 d-flex justify-content-between align-items-center toggle-card shadow-xs">
                                <div>
                                    <div class="font-weight-bold smallest text-uppercase text-muted letter-spacing-1 mb-1">Active Status</div>
                                    <div class="small toggle-status font-weight-bold {{ $template->is_active ? 'text-success' : 'text-warning' }}">
                                        {{ $template->is_active ? 'DISPATCH ENABLED' : 'DISPATCH SUSPENDED' }}
                                    </div>
                                </div>
                                <div class="toggle-indicator"></div>
                            </div>
                        </label>
                    </div>
                </div>

                {{-- Variables Card --}}
                <div class="card card-premium shadow-premium mt-4 overflow-hidden">
                    <div class="card-header border-0 bg-white py-3 px-4">
                        <h3 class="card-title font-weight-bold text-dark mb-0 small text-uppercase letter-spacing-1">
                            <i class="fas fa-code mr-2 text-primary opacity-50"></i> Injection Tokens
                        </h3>
                    </div>
                    <div class="card-body p-0">
                        <ul class="list-group list-group-flush">
                            <li class="list-group-item d-flex justify-content-between align-items-center border-0 py-3">
                                <code class="text-primary font-weight-bold">{user_name}</code>
                                <span class="smallest font-weight-bold text-muted uppercase letter-spacing-1">Full Name</span>
                            </li>
                            <li class="list-group-item d-flex justify-content-between align-items-center border-0 py-3 bg-light">
                                <code class="text-primary font-weight-bold">{amount}</code>
                                <span class="smallest font-weight-bold text-muted uppercase letter-spacing-1">Transaction</span>
                            </li>
                            <li class="list-group-item d-flex justify-content-between align-items-center border-0 py-3">
                                <code class="text-primary font-weight-bold">{transaction_id}</code>
                                <span class="smallest font-weight-bold text-muted uppercase letter-spacing-1">ID Ref</span>
                            </li>
                            <li class="list-group-item d-flex justify-content-between align-items-center border-0 py-3 bg-light">
                                <code class="text-primary font-weight-bold">{{ config("app.name") }}</code>
                                <span class="smallest font-weight-bold text-muted uppercase letter-spacing-1">Platform</span>
                            </li>
                        </ul>
                    </div>
                    <div class="card-footer bg-white text-center py-3 border-top">
                        <small class="text-muted smallest font-weight-bold uppercase"><i class="fas fa-info-circle mr-1"></i> Copy and paste these tokens</small>
                    </div>
                </div>
            </div>
        </div>
    </form>
</div>
@endsection

@push('js')
<script>
    document.addEventListener('DOMContentLoaded', function () {
        // Toggle text logic
        const toggleInput = document.querySelector('.toggle-input');
        const statusText = document.querySelector('.toggle-status');
        
        if (toggleInput) {
            toggleInput.addEventListener('change', function() {
                statusText.textContent = this.checked ? 'DISPATCH ENABLED' : 'DISPATCH SUSPENDED';
                statusText.className = 'small toggle-status font-weight-bold ' + (this.checked ? 'text-success' : 'text-warning');
            });
        }
    });
</script>
@endpush

@push('css')
<style>
    .rounded-3 { border-radius: 0.6rem !important; }
    .sticky-top { top: 20px; }
    
    /* Variable helper styling */
    code {
        background: #f1f3f9;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 0.9rem;
    }

    /* Modern Toggle CSS */
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
