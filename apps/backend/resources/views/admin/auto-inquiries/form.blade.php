@extends('adminlte::page')

@section('title', ($inquiry->exists ? 'Modify' : 'Create') . ' Auto Inquiry')

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-8">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-car mr-2 text-primary"></i> 
                    {{ $inquiry->exists ? 'Update Inquiry: #' . $inquiry->id : 'New Purchase Inquiry' }}
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">
                    {{ $inquiry->exists ? 'Managing lead engagement for high-value vehicle assets.' : 'Manually logging a new purchase interest for a vehicle.' }}
                </p>
            </div>
            <div class="col-sm-4 text-right">
                <a href="{{ route('admin.auto-inquiries.index') }}" class="btn btn-back shadow-sm rounded-pill px-4">
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
          action="{{ $inquiry->exists ? route('admin.auto-inquiries.update', $inquiry->id) : route('admin.auto-inquiries.store') }}" 
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
                                <label class="smallest font-weight-bold text-secondary text-uppercase mb-2 letter-spacing-1">Interested Vehicle Asset</label>
                                <div class="input-group border rounded shadow-xs bg-white" style="height: 46px; padding: 2px;">
                                    <div class="input-group-prepend border-0">
                                        <span class="input-group-text bg-white border-0 py-0"><i class="fas fa-car text-primary"></i></span>
                                    </div>
                                    <select name="auto_id" class="form-control border-0 custom-select shadow-none bg-white h-100 py-0 select2" required>
                                        <option value="">Select Vehicle</option>
                                        @foreach($autos as $auto)
                                            <option value="{{ $auto->id }}" {{ old('auto_id', $inquiry->auto_id) == $auto->id ? 'selected' : '' }}>
                                                {{ $auto->title }}
                                            </option>
                                        @endforeach
                                    </select>
                                </div>
                                @error('auto_id') <small class="text-danger font-weight-bold mt-1 d-block">{{ $message }}</small> @enderror
                            </div>
                            <div class="col-md-6 mb-4">
                                <label class="smallest font-weight-bold text-secondary text-uppercase mb-2 letter-spacing-1">Platform Account Principal</label>
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

                        <div class="row mt-2">
                            <div class="col-md-4 mb-4">
                                <label class="smallest font-weight-bold text-secondary text-uppercase mb-2 letter-spacing-1">Full Identity Name</label>
                                <div class="input-group border rounded shadow-xs bg-white" style="height: 46px; padding: 2px;">
                                    <div class="input-group-prepend border-0">
                                        <span class="input-group-text bg-white border-0 py-0"><i class="fas fa-id-card text-primary"></i></span>
                                    </div>
                                    <input type="text" name="full_name" class="form-control border-0 shadow-none bg-white h-100 py-0 font-weight-bold" 
                                           value="{{ old('full_name', $inquiry->full_name) }}" required placeholder="e.g. Robert Smith">
                                </div>
                                @error('full_name') <small class="text-danger font-weight-bold mt-1 d-block">{{ $message }}</small> @enderror
                            </div>
                            <div class="col-md-4 mb-4">
                                <label class="smallest font-weight-bold text-secondary text-uppercase mb-2 letter-spacing-1">Electronic Contact</label>
                                <div class="input-group border rounded shadow-xs bg-white" style="height: 46px; padding: 2px;">
                                    <div class="input-group-prepend border-0">
                                        <span class="input-group-text bg-white border-0 py-0"><i class="fas fa-envelope text-primary"></i></span>
                                    </div>
                                    <input type="email" name="email" class="form-control border-0 shadow-none bg-white h-100 py-0 text-monospace" 
                                           value="{{ old('email', $inquiry->email) }}" required placeholder="robert@example.com">
                                </div>
                                @error('email') <small class="text-danger font-weight-bold mt-1 d-block">{{ $message }}</small> @enderror
                            </div>
                            <div class="col-md-4 mb-4">
                                <label class="smallest font-weight-bold text-secondary text-uppercase mb-2 letter-spacing-1">Telephonic Contact</label>
                                <div class="input-group border rounded shadow-xs bg-white" style="height: 46px; padding: 2px;">
                                    <div class="input-group-prepend border-0">
                                        <span class="input-group-text bg-white border-0 py-0"><i class="fas fa-phone text-primary"></i></span>
                                    </div>
                                    <input type="text" name="phone" class="form-control border-0 shadow-none bg-white h-100 py-0" 
                                           value="{{ old('phone', $inquiry->phone) }}" placeholder="+1 234 567 890">
                                </div>
                                @error('phone') <small class="text-danger font-weight-bold mt-1 d-block">{{ $message }}</small> @enderror
                            </div>
                        </div>

                        <div class="row mt-2">
                            <div class="col-md-6 mb-4">
                                <label class="smallest font-weight-bold text-secondary text-uppercase mb-2 letter-spacing-1">Preferred Viewing Chronology</label>
                                <div class="input-group border rounded shadow-xs bg-white" style="height: 46px; padding: 2px;">
                                    <div class="input-group-prepend border-0">
                                        <span class="input-group-text bg-white border-0 py-0"><i class="fas fa-calendar-day text-primary"></i></span>
                                    </div>
                                    <input type="date" name="preferred_date" class="form-control border-0 shadow-none bg-white h-100 py-0 smallest font-weight-bold" 
                                           value="{{ old('preferred_date', $inquiry->preferred_date) }}">
                                </div>
                                @error('preferred_date') <small class="text-danger font-weight-bold mt-1 d-block">{{ $message }}</small> @enderror
                            </div>
                            <div class="col-md-6 mb-4">
                                <label class="smallest font-weight-bold text-secondary text-uppercase mb-2 letter-spacing-1">Target Time Window</label>
                                <div class="input-group border rounded shadow-xs bg-white" style="height: 46px; padding: 2px;">
                                    <div class="input-group-prepend border-0">
                                        <span class="input-group-text bg-white border-0 py-0"><i class="fas fa-clock text-primary"></i></span>
                                    </div>
                                    <input type="text" name="preferred_time" class="form-control border-0 shadow-none bg-white h-100 py-0" 
                                           value="{{ old('preferred_time', $inquiry->preferred_time) }}" placeholder="e.g. Afternoon, 3 PM">
                                </div>
                                @error('preferred_time') <small class="text-danger font-weight-bold mt-1 d-block">{{ $message }}</small> @enderror
                            </div>
                        </div>

                        <div class="col-12 mb-0">
                            <label class="smallest font-weight-bold text-secondary text-uppercase mb-2 letter-spacing-1">Inquiry Narrative / Lead Context</label>
                            <textarea name="message" class="form-control border shadow-xs bg-white p-3" rows="4"
                                style="border-radius: 12px; font-size: 0.9rem;"
                                placeholder="Lead details or special requests...">{{ old('message', $inquiry->message) }}</textarea>
                        </div>
                    </div>
                </div>
            </div>

            {{-- Right Column --}}
            <div class="col-md-4">
                <div class="sticky-top" style="top: 20px; z-index: 10;">
                    {{-- Action Card --}}
                    @include('admin._partials._form-actions', [
                        'model' => $inquiry,
                        'title' => 'PURCHASE LEAD',
                        'back' => 'admin.auto-inquiries.index'
                    ])

                    <div class="card card-premium shadow-premium mt-4 border-0 overflow-hidden">
                        <div class="card-header border-0 bg-white py-4 px-4 d-flex align-items-center">
                            <h3 class="card-title font-weight-bold text-dark mb-0 text-uppercase letter-spacing-1" style="font-size: 1.1rem;">
                                <i class="fas fa-project-diagram mr-2 text-primary opacity-50"></i> Pipeline Status
                            </h3>
                        </div>
                        <div class="card-body p-4">
                            <div class="form-group mb-0">
                                <select name="status" class="form-control @error('status') is-invalid @enderror" required>
                                    @foreach(['pending', 'reviewed', 'contacted', 'closed'] as $st)
                                        <option value="{{ $st }}" {{ old('status', $inquiry->status ?? 'pending') == $st ? 'selected' : '' }}>
                                            {{ strtoupper($st) }}
                                        </option>
                                    @endforeach
                                </select>
                                @error('status') <span class="invalid-feedback">{{ $message }}</span> @enderror
                            </div>
                            <div class="mt-3 p-3 bg-light rounded-xl border border-light">
                                <p class="smallest text-muted mb-0 font-italic">
                                    <i class="fas fa-info-circle mr-1"></i> Changing status triggers lead tracking updates in the partner dashboard.
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
    document.addEventListener('DOMContentLoaded', function () {
        if (typeof $('.select2').select2 === 'function') {
            $('.select2').select2({
                theme: 'bootstrap4',
                width: '100%'
            });
        }
    });
</script>
@endpush

@include('admin._partials._toggle-card-css')
