@extends('adminlte::page')

@section('title', 'Edit Email Template')

@section('content_header')
<div class="container-fluid">
    <div class="row mb-2">
        <div class="col-sm-6">
            <h1 class="m-0 text-dark font-weight-bold">
                <i class="fas fa-envelope-open-text mr-2 text-primary"></i> 
                Edit Template: <span class="text-muted">{{ $template->key }}</span>
            </h1>
        </div>
        <div class="col-sm-6 text-right">
            <a href="{{ route('admin.email-templates.index') }}" class="btn btn-default btn-flat btn-sm shadow-sm">
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
                <div class="card shadow-sm rounded-3 border-0">
                    <div class="card-header bg-white border-bottom">
                        <h3 class="card-title font-weight-bold text-dark">Email Content</h3>
                    </div>
                    <div class="card-body">
                        <div class="form-group mb-4">
                            <label for="subject">Email Subject <span class="text-danger">*</span></label>
                            <input type="text" name="subject" id="subject" class="form-control form-control-lg @error('subject') is-invalid @enderror" 
                                   value="{{ old('subject', $template->subject) }}" required placeholder="e.g. Your Subscription is Active">
                            @error('subject') <span class="invalid-feedback">{{ $message }}</span> @enderror
                        </div>

                        <div class="form-group mb-0">
                            <label for="body">Body Content <span class="text-danger">*</span></label>
                            <textarea name="body" id="body" class="form-control @error('body') is-invalid @enderror" 
                                      rows="15" required>{{ old('body', $template->body) }}</textarea>
                            @error('body') <span class="invalid-feedback">{{ $message }}</span> @enderror
                        </div>
                    </div>
                </div>
            </div>

            {{-- Right Column: Status & Placeholders --}}
            <div class="col-md-4">
                <div class="sticky-top" style="top: 20px; z-index: 10;">
                    
                    {{-- Action Card --}}
                    <div class="card shadow-sm border-0 rounded-lg overflow-hidden mb-4">
                        <div class="card-header bg-dark py-3" style="border-bottom: 3px solid var(--primary) !important;">
                            <h3 class="card-title text-white font-weight-bold">Status & Save</h3>
                        </div>
                        <div class="card-body bg-white p-4">
                             <div class="mb-4">
                                <label class="w-100 cursor-pointer">
                                    <input type="hidden" name="is_active" value="0">
                                    <input type="checkbox" name="is_active" value="1" 
                                           class="d-none toggle-input" 
                                           {{ $template->is_active ? 'checked' : '' }}>
                                    
                                    <div class="border rounded px-3 py-2 d-flex justify-content-between align-items-center toggle-card shadow-sm">
                                        <div>
                                            <div class="fw-bold small text-dark">Template Status</div>
                                            <div class="small toggle-status text-muted">
                                                {{ $template->is_active ? 'Active' : 'Inactive' }}
                                            </div>
                                        </div>
                                        <div class="toggle-indicator"></div>
                                    </div>
                                </label>
                            </div>

                            <button type="submit" class="btn btn-primary btn-flat btn-block py-3 font-weight-bold shadow-sm" style="border-radius: 8px;">
                                <i class="fas fa-save mr-2"></i> <strong>Save Template</strong>
                            </button>
                        </div>
                    </div>

                    {{-- Variables Card --}}
                    <div class="card shadow-sm border-0 rounded-3 overflow-hidden">
                        <div class="card-header bg-light border-bottom">
                            <h3 class="card-title font-weight-bold text-muted small text-uppercase">
                                <i class="fas fa-code mr-1 text-primary"></i> Available Variables
                            </h3>
                        </div>
                        <div class="card-body p-0">
                            <ul class="list-group list-group-flush">
                                <li class="list-group-item d-flex justify-content-between align-items-center border-0 py-3">
                                    <code class="text-primary font-weight-bold">{user_name}</code>
                                    <span class="small text-muted">User's Full Name</span>
                                </li>
                                <li class="list-group-item d-flex justify-content-between align-items-center border-0 py-3 bg-light">
                                    <code class="text-primary font-weight-bold">{amount}</code>
                                    <span class="small text-muted">Transaction Sum</span>
                                </li>
                                <li class="list-group-item d-flex justify-content-between align-items-center border-0 py-3">
                                    <code class="text-primary font-weight-bold">{transaction_id}</code>
                                    <span class="small text-muted">ID Reference</span>
                                </li>
                                <li class="list-group-item d-flex justify-content-between align-items-center border-0 py-3 bg-light">
                                    <code class="text-primary font-weight-bold">{{ config("app.name") }}</code>
                                    <span class="small text-muted">Site Title</span>
                                </li>
                            </ul>
                        </div>
                        <div class="card-footer bg-white text-center">
                            <small class="text-muted italic"><i class="fas fa-info-circle mr-1"></i> Copy and paste these into the body or subject.</small>
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
    document.addEventListener('DOMContentLoaded', function () {
        // Toggle text logic
        const toggleInput = document.querySelector('.toggle-input');
        const statusText = document.querySelector('.toggle-status');
        
        if (toggleInput) {
            toggleInput.addEventListener('change', function() {
                statusText.textContent = this.checked ? 'Active' : 'Inactive';
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
    .toggle-card { transition: all 0.3s ease; background-color: #f8f9fa; cursor: pointer; }
    .toggle-input:checked + .toggle-card { background-color: #e9f7ef; border-color: #28a745 !important; }
    .toggle-indicator { width: 36px; height: 20px; border-radius: 10px; background-color: #ccc; position: relative; }
    .toggle-indicator::after { 
        content: ''; position: absolute; top: 2px; left: 2px; width: 16px; height: 16px; 
        border-radius: 50%; background-color: white; transition: all 0.3s ease; 
    }
    .toggle-input:checked + .toggle-card .toggle-indicator { background-color: #28a745; }
    .toggle-input:checked + .toggle-card .toggle-indicator::after { transform: translateX(16px); }
</style>
@endpush
