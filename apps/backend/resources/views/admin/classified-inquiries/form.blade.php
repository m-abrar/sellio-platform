{{--
    Administrative Classifieds: Inquiry Lead Configuration
    
    This view serves as the authoritative interface for managing marketplace 
    interest leads. It orchestrates the association between target assets 
    and interested principals, tracks engagement lifecycle transitions 
    (from pending to replied/closed), and preserves the integrity of the 
    marketplace audit trail.
    
    @extends adminlte::page
    @context Classified Module Management
    @variables ClassifiedInquiry $inquiry The inquiry model instance.
    @variables Collection $classifieds Available marketplace listings.
    @variables Collection $users Registered marketplace participants.
--}}
@extends('adminlte::page')

@section('title', ($inquiry->exists ? __('Modify') : __('Create')) . ' ' . __('Classified Inquiry'))

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-8">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-search-dollar mr-2 text-primary opacity-50"></i> 
                    {{ $inquiry->exists ? __('Update Inquiry: #') . $inquiry->id : __('New Marketplace Inquiry') }}
                </h1>
                <p class="text-muted mt-2 small uppercase letter-spacing-1 mb-0">
                    {{ $inquiry->exists ? 'Managing interest for marketplace assets.' : 'Manually logging a new inquiry for a classified listing.' }}
                </p>
            </div>
            <div class="col-sm-4 text-right">
                <a href="{{ route('admin.classified-inquiries.index') }}" class="btn btn-back shadow-sm">
                    <i class="fas fa-arrow-left mr-1"></i> Back to Queue
                </a>
            </div>
        </div>
    </div>
@stop

@section('content')
<div class="container-fluid pb-5">
    @include('admin.alert')

    <form id="inquiry-form" 
          action="{{ $inquiry->exists ? route('admin.classified-inquiries.update', $inquiry->id) : route('admin.classified-inquiries.store') }}" 
          method="POST">
        @csrf
        @if($inquiry->exists) @method('PATCH') @endif

        <div class="row">
            {{-- Main Content Column --}}
            <div class="col-md-8">
                {{-- Lead Information --}}
                <div class="card border-0 shadow-premium rounded-xl overflow-hidden mb-4">
                    <div class="card-header border-0 bg-white py-4 px-4">
                        <h3 class="card-title-main">Lead Parameters</h3>
                    </div>
                    <div class="card-body p-4 pt-0">
                        <div class="row">
                            <div class="col-md-6">
                                <div class="form-group mb-4">
                                    <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">Target Classified Ad</label>
                                    <select name="classified_id" class="form-control select2" required>
                                        <option value="">Select Asset</option>
                                        @foreach($classifieds as $ad)
                                            <option value="{{ $ad->id }}" {{ old('classified_id', $inquiry->classified_id) == $ad->id ? 'selected' : '' }}>
                                                {{ $ad->title }}
                                            </option>
                                        @endforeach
                                    </select>
                                    @error('classified_id') <span class="invalid-feedback d-block">{{ $message }}</span> @enderror
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group mb-4">
                                    <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">Interested Principal</label>
                                    <select name="user_id" class="form-control select2" required>
                                        <option value="">Associate User</option>
                                        @foreach($users as $user)
                                            <option value="{{ $user->id }}" {{ old('user_id', $inquiry->user_id) == $user->id ? 'selected' : '' }}>
                                                {{ $user->name }} ({{ $user->email }})
                                            </option>
                                        @endforeach
                                    </select>
                                    @error('user_id') <span class="invalid-feedback d-block">{{ $message }}</span> @enderror
                                </div>
                            </div>
                        </div>

                        <div class="form-group mb-0">
                            <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">{{ __('Inquiry Message / Interest Context') }}</label>
                            <textarea name="message" class="form-control textarea-premium" rows="8"
                                placeholder="{{ __('Details regarding the inquiry, special requests, or negotiation notes...') }}">{{ old('message', $inquiry->message) }}</textarea>
                            @error('message') <span class="invalid-feedback d-block">{{ $message }}</span> @enderror
                        </div>
                    </div>
                </div>
            </div>

            {{-- Sidebar Column --}}
            <div class="col-md-4">
                @include('admin._partials._form-actions', [
                    'model' => $inquiry,
                    'title' => 'INQUIRY',
                    'back' => 'admin.classified-inquiries.index'
                ])

                {{-- Status Control --}}
                <div class="card border-0 shadow-premium mb-4 rounded-xl overflow-hidden mt-4">
                    <div class="card-header border-0 bg-white py-4 px-4">
                        <h3 class="card-title-side">Engagement Status</h3>
                    </div>
                    <div class="card-body p-4 pt-0">
                        <div class="form-group mb-3">
                            <select name="status" class="form-control form-control-premium @error('status') is-invalid @enderror" required>
                                @foreach(['pending', 'viewed', 'contacted', 'replied', 'closed'] as $st)
                                    <option value="{{ $st }}" {{ old('status', $inquiry->status ?? 'pending') == $st ? 'selected' : '' }}>
                                        {{ strtoupper($st) }}
                                    </option>
                                @endforeach
                            </select>
                            @error('status') <span class="invalid-feedback d-block">{{ $message }}</span> @enderror
                        </div>
                        <div class="p-3 bg-light rounded-xl border border-light">
                            <p class="smallest text-muted mb-0 font-italic">
                                <i class="fas fa-info-circle mr-1"></i> Tracking the conversion funnel helps optimize marketplace listing performance.
                            </p>
                        </div>
                    </div>
                </div>

                {{-- Meta Information --}}
                <div class="card border-0 shadow-premium mb-4 rounded-xl overflow-hidden">
                    <div class="card-header border-0 bg-white py-4 px-4">
                        <h3 class="card-title-side">Audit Trail</h3>
                    </div>
                    <div class="card-body p-4 pt-0">
                        <div class="d-flex justify-content-between mb-2">
                            <span class="small text-muted uppercase letter-spacing-1">Created At</span>
                            <span class="small font-weight-bold">{{ $inquiry->created_at ? $inquiry->created_at->format('M d, Y') : 'Draft' }}</span>
                        </div>
                        <div class="d-flex justify-content-between">
                            <span class="small text-muted uppercase letter-spacing-1">Source</span>
                            <span class="small font-weight-bold text-primary">Marketplace</span>
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
