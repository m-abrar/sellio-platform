@extends('adminlte::page')

@section('title', ($inquiry->exists ? 'Modify' : 'Create') . ' Classified Inquiry')

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-8">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-search-dollar mr-2 text-primary"></i> 
                    {{ $inquiry->exists ? 'Update Inquiry: #' . $inquiry->id : 'New Marketplace Inquiry' }}
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">
                    {{ $inquiry->exists ? 'Managing interest for marketplace assets.' : 'Manually logging a new inquiry for a classified listing.' }}
                </p>
            </div>
            <div class="col-sm-4 text-right">
                <a href="{{ route('admin.classified-inquiries.index') }}" class="btn btn-back shadow-sm rounded-pill px-4">
                    <i class="fas fa-arrow-left mr-1"></i> BACK TO QUEUE
                </a>
            </div>
        </div>
    </div>
@stop

@section('content')
<div class="container-fluid">
    @include('admin.alert')

    <form id="inquiry-form" 
          action="{{ $inquiry->exists ? route('admin.classified-inquiries.update', $inquiry->id) : route('admin.classified-inquiries.store') }}" 
          method="POST">
        @csrf
        @if($inquiry->exists) @method('PATCH') @endif

        <div class="row pb-5">
            {{-- Left Column --}}
            <div class="col-md-8">
                <div class="card card-premium shadow-premium mb-4 overflow-hidden border-0">
                    <div class="card-header border-0 bg-white py-4 px-4 d-flex align-items-center">
                        <h3 class="card-title font-weight-bold text-dark mb-0 text-uppercase letter-spacing-1" style="font-size: 1.1rem;">
                            <i class="fas fa-info-circle mr-2 text-primary opacity-50"></i> Lead Parameters
                        </h3>
                    </div>
                    <div class="card-body p-4">
                        <div class="row">
                            <div class="col-md-6 mb-4">
                                <label class="smallest font-weight-bold text-secondary text-uppercase mb-2 letter-spacing-1">Target Classified Ad</label>
                                <div class="input-group border rounded shadow-xs bg-white" style="height: 46px; padding: 2px;">
                                    <div class="input-group-prepend border-0">
                                        <span class="input-group-text bg-white border-0 py-0"><i class="fas fa-shopping-bag text-primary"></i></span>
                                    </div>
                                    <select name="classified_id" class="form-control border-0 custom-select shadow-none bg-white h-100 py-0 select2" required>
                                        <option value="">Select Asset</option>
                                        @foreach($classifieds as $ad)
                                            <option value="{{ $ad->id }}" {{ old('classified_id', $inquiry->classified_id) == $ad->id ? 'selected' : '' }}>
                                                {{ $ad->title }}
                                            </option>
                                        @endforeach
                                    </select>
                                </div>
                                @error('classified_id') <small class="text-danger font-weight-bold mt-1 d-block">{{ $message }}</small> @enderror
                            </div>
                            <div class="col-md-6 mb-4">
                                <label class="smallest font-weight-bold text-secondary text-uppercase mb-2 letter-spacing-1">Interested Principal</label>
                                <div class="input-group border rounded shadow-xs bg-white" style="height: 46px; padding: 2px;">
                                    <div class="input-group-prepend border-0">
                                        <span class="input-group-text bg-white border-0 py-0"><i class="fas fa-user-tie text-primary"></i></span>
                                    </div>
                                    <select name="user_id" class="form-control border-0 custom-select shadow-none bg-white h-100 py-0 select2" required>
                                        <option value="">Associate User</option>
                                        @foreach($users as $user)
                                            <option value="{{ $user->id }}" {{ old('user_id', $inquiry->user_id) == $user->id ? 'selected' : '' }}>
                                                {{ $user->name }} ({{ $user->email }})
                                            </option>
                                        @endforeach
                                    </select>
                                </div>
                                @error('user_id') <small class="text-danger font-weight-bold mt-1 d-block">{{ $message }}</small> @enderror
                            </div>
                        </div>

                        <div class="col-12 mb-0">
                            <label class="smallest font-weight-bold text-secondary text-uppercase mb-2 letter-spacing-1">Inquiry Message / Interest Context</label>
                            <textarea name="message" class="form-control border shadow-xs bg-white p-3" rows="8"
                                style="border-radius: 12px; font-size: 0.9rem;"
                                placeholder="Details regarding the inquiry...">{{ old('message', $inquiry->message) }}</textarea>
                            @error('message') <small class="text-danger font-weight-bold mt-1 d-block">{{ $message }}</small> @enderror
                        </div>
                    </div>
                </div>
            </div>

            {{-- Right Column --}}
            <div class="col-md-4">
                <div class="sticky-top" style="top: 20px; z-index: 10;">
                    {{-- Action Card --}}
                    <div class="card card-premium shadow-premium border-0 overflow-hidden mb-4">
                        <div class="card-header border-0 bg-white py-4 px-4">
                            <h3 class="card-title font-weight-bold text-dark mb-0 text-uppercase letter-spacing-1" style="font-size: 1.1rem;">
                                <i class="fas fa-bolt mr-2 text-warning opacity-50"></i> Registry Actions
                            </h3>
                        </div>
                        <div class="card-body p-4">
                            <button type="submit" class="btn btn-primary btn-block rounded-pill py-3 font-weight-bold shadow-xs text-uppercase letter-spacing-1 mb-3">
                                <i class="fas fa-save mr-2"></i> {{ $inquiry->exists ? 'Update Inquiry' : 'Log Inquiry' }}
                            </button>
                            <a href="{{ route('admin.classified-inquiries.index') }}" class="btn btn-default btn-block rounded-pill py-3 font-weight-bold border shadow-none text-uppercase letter-spacing-1">
                                <i class="fas fa-times mr-2 text-danger"></i> Discard Changes
                            </a>
                        </div>
                    </div>

                    <div class="card card-premium shadow-premium border-0 overflow-hidden">
                        <div class="card-header border-0 bg-white py-4 px-4 d-flex align-items-center">
                            <h3 class="card-title font-weight-bold text-dark mb-0 text-uppercase letter-spacing-1" style="font-size: 1.1rem;">
                                <i class="fas fa-project-diagram mr-2 text-primary opacity-50"></i> Engagement Status
                            </h3>
                        </div>
                        <div class="card-body p-4">
                            <div class="form-group mb-0">
                                <select name="status" class="form-control @error('status') is-invalid @enderror" required>
                                    @foreach(['pending', 'viewed', 'contacted', 'replied', 'closed'] as $st)
                                        <option value="{{ $st }}" {{ old('status', $inquiry->status ?? 'pending') == $st ? 'selected' : '' }}>
                                            {{ strtoupper($st) }}
                                        </option>
                                    @endforeach
                                </select>
                                @error('status') <span class="invalid-feedback">{{ $message }}</span> @enderror
                            </div>
                            <div class="mt-3 p-3 bg-light rounded-xl border border-light">
                                <p class="smallest text-muted mb-0 font-italic">
                                    <i class="fas fa-info-circle mr-1"></i> Changing status helps track the conversion funnel for marketplace listings.
                                </p>
                            </div>
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
