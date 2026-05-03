@extends('adminlte::page')

@section('title', ($newsletterSubscriber->exists ? 'Edit' : 'Add') . ' Subscriber')

@section('content_header')
<div class="container-fluid pt-4">
    <div class="row mb-2">
        <div class="col-sm-6">
            <h1 class="m-0 text-dark font-weight-bold">
                <i class="fas fa-envelope-open-text mr-2 text-primary"></i> 
                {{ $newsletterSubscriber->exists ? 'Edit Subscriber' : 'New Subscriber' }}
            </h1>
        </div>
        <div class="col-sm-6 text-right">
            <a href="{{ route('admin.newsletter-subscribers.index') }}" class="btn btn-default btn-flat btn-sm shadow-sm">
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
                <div class="card shadow-sm rounded-3 border-0">
                    <div class="card-header bg-white border-bottom">
                        <h3 class="card-title font-weight-bold text-dark">Subscriber Details</h3>
                    </div>
                    <div class="card-body">
                        <div class="form-group mb-4">
                            <label for="email">Email Address <span class="text-danger">*</span></label>
                            <div class="input-group">
                                <div class="input-group-prepend">
                                    <span class="input-group-text bg-light border-right-0"><i class="fas fa-at text-muted"></i></span>
                                </div>
                                <input type="email" name="email" id="email" class="form-control form-control-lg @error('email') is-invalid @enderror" 
                                       value="{{ old('email', $newsletterSubscriber->email ?? '') }}" required placeholder="email@example.com">
                            </div>
                            @error('email') <span class="invalid-feedback d-block">{{ $message }}</span> @enderror
                        </div>

                        <div class="form-group mb-0">
                            <label for="source">Registration Source</label>
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
                <div class="sticky-top" style="top: 20px;">
                    {{-- Action Card --}}
                    <div class="card shadow-sm border-0 rounded-lg overflow-hidden mb-4">
                        <div class="card-header bg-dark py-3" style="border-bottom: 3px solid var(--primary) !important;">
                            <h3 class="card-title text-white font-weight-bold">Status & Save</h3>
                        </div>
                        <div class="card-body bg-white p-4">
                            
                            {{-- Confirmation Switch --}}
                            <div class="mb-4">
                                <label class="w-100 cursor-pointer">
                                    @php $confirmed = old('is_confirmed', $newsletterSubscriber->is_confirmed ?? false); @endphp
                                    <input type="hidden" name="is_confirmed" value="0">
                                    <input type="checkbox" name="is_confirmed" value="1" 
                                           class="d-none toggle-input" 
                                           {{ $confirmed ? 'checked' : '' }}>
                                    
                                    <div class="border rounded px-3 py-2 d-flex justify-content-between align-items-center toggle-card shadow-sm">
                                        <div>
                                            <div class="fw-bold small text-dark">Subscription Status</div>
                                            <div class="small toggle-status text-muted">
                                                {{ $confirmed ? 'Confirmed' : 'Unconfirmed' }}
                                            </div>
                                        </div>
                                        <div class="toggle-indicator"></div>
                                    </div>
                                </label>
                            </div>

                            <button type="submit" class="btn btn-primary btn-block py-2 mb-3 shadow-sm rounded-pill">
                                <i class="fas fa-save mr-2"></i> <strong>{{ $newsletterSubscriber->exists ? 'Update' : 'Save' }} Subscriber</strong>
                            </button>
                        </div>
                    </div>

                    {{-- Metadata Card (Only on Edit) --}}
                    @if($newsletterSubscriber->exists)
                    <div class="card shadow-sm border-0 rounded-3">
                        <div class="card-body small text-muted">
                            <div class="d-flex justify-content-between mb-2">
                                <span>Subscribed on:</span>
                                <span class="text-dark font-weight-bold">{{ $newsletterSubscriber->created_at->format('M d, Y') }}</span>
                            </div>
                            <div class="d-flex justify-content-between">
                                <span>Last Updated:</span>
                                <span class="text-dark font-weight-bold">{{ $newsletterSubscriber->updated_at->diffForHumans() }}</span>
                            </div>
                        </div>
                    </div>
                    @endif
                </div>
            </div>
        </div>
    </form>
</div>
@endsection



@push('css')
<style>
.rounded-3 { border-radius: 0.6rem !important; }
.sticky-top { top: 20px; z-index: 10; }

/* Custom Toggle Logic */
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

@push('js')
<script>
    document.addEventListener('DOMContentLoaded', function () {
        const toggleInput = document.querySelector('.toggle-input');
        const statusText = document.querySelector('.toggle-status');
        
        if (toggleInput) {
            toggleInput.addEventListener('change', function() {
                statusText.textContent = this.checked ? 'Confirmed' : 'Unconfirmed';
            });
        }
    });
</script>
@endpush
