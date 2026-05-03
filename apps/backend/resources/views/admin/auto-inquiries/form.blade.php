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
                <a href="{{ route('admin.auto-inquiries.index') }}" class="btn btn-back shadow-sm">
                    <i class="fas fa-arrow-left mr-1"></i> Back to Queue
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
                <div class="card card-premium shadow-premium mb-4 overflow-hidden">
                    <div class="card-header bg-white border-0 py-3 px-4">
                        <h3 class="card-title font-weight-bold text-dark mb-0 small text-uppercase letter-spacing-1">
                            <i class="fas fa-info-circle mr-2 text-primary opacity-50"></i> Lead Parameters
                        </h3>
                    </div>
                    <div class="card-body p-4">
                        <div class="row">
                            <div class="col-md-6">
                                <div class="form-group mb-4">
                                    <label class="font-weight-600">Interested Vehicle <span class="text-danger">*</span></label>
                                    <select name="auto_id" class="form-control select2 @error('auto_id') is-invalid @enderror" required>
                                        <option value="">-- Select Auto Listing --</option>
                                        @foreach($autos as $auto)
                                            <option value="{{ $auto->id }}" {{ old('auto_id', $inquiry->auto_id) == $auto->id ? 'selected' : '' }}>
                                                {{ $auto->title }} (ID: #{{ $auto->id }})
                                            </option>
                                        @endforeach
                                    </select>
                                    @error('auto_id') <span class="invalid-feedback">{{ $message }}</span> @enderror
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group mb-4">
                                    <label class="font-weight-600">Platform Account <span class="text-danger">*</span></label>
                                    <select name="user_id" class="form-control select2 @error('user_id') is-invalid @enderror" required>
                                        <option value="">-- Associate User --</option>
                                        @foreach($users as $user)
                                            <option value="{{ $user->id }}" {{ old('user_id', $inquiry->user_id) == $user->id ? 'selected' : '' }}>
                                                {{ $user->name }} ({{ $user->email }})
                                            </option>
                                        @endforeach
                                    </select>
                                    @error('user_id') <span class="invalid-feedback">{{ $message }}</span> @enderror
                                </div>
                            </div>
                        </div>

                        <div class="row mt-2">
                            <div class="col-md-4">
                                <div class="form-group mb-4">
                                    <label class="font-weight-600">Full Name <span class="text-danger">*</span></label>
                                    <input type="text" name="full_name" class="form-control @error('full_name') is-invalid @enderror" 
                                           value="{{ old('full_name', $inquiry->full_name) }}" required placeholder="e.g. Robert Smith">
                                    @error('full_name') <span class="invalid-feedback">{{ $message }}</span> @enderror
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="form-group mb-4">
                                    <label class="font-weight-600">Contact Email <span class="text-danger">*</span></label>
                                    <input type="email" name="email" class="form-control @error('email') is-invalid @enderror" 
                                           value="{{ old('email', $inquiry->email) }}" required placeholder="robert@example.com">
                                    @error('email') <span class="invalid-feedback">{{ $message }}</span> @enderror
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="form-group mb-4">
                                    <label class="font-weight-600">Contact Phone</label>
                                    <input type="text" name="phone" class="form-control @error('phone') is-invalid @enderror" 
                                           value="{{ old('phone', $inquiry->phone) }}" placeholder="+1 234 567 890">
                                    @error('phone') <span class="invalid-feedback">{{ $message }}</span> @enderror
                                </div>
                            </div>
                        </div>

                        <div class="row mt-2">
                            <div class="col-md-6">
                                <div class="form-group mb-4">
                                    <label class="font-weight-600">Preferred Viewing Date</label>
                                    <input type="date" name="preferred_date" class="form-control @error('preferred_date') is-invalid @enderror" 
                                           value="{{ old('preferred_date', $inquiry->preferred_date) }}">
                                    @error('preferred_date') <span class="invalid-feedback">{{ $message }}</span> @enderror
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group mb-4">
                                    <label class="font-weight-600">Preferred Time Window</label>
                                    <input type="text" name="preferred_time" class="form-control @error('preferred_time') is-invalid @enderror" 
                                           value="{{ old('preferred_time', $inquiry->preferred_time) }}" placeholder="e.g. Afternoon, 3 PM">
                                    @error('preferred_time') <span class="invalid-feedback">{{ $message }}</span> @enderror
                                </div>
                            </div>
                        </div>

                        <div class="form-group mb-0">
                            <label class="font-weight-600">Inquiry Message</label>
                            <textarea name="message" class="form-control" rows="4" placeholder="Lead details or special requests...">{{ old('message', $inquiry->message) }}</textarea>
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

                    <div class="card card-premium shadow-premium mt-4 overflow-hidden border-primary-soft">
                        <div class="card-header bg-white border-0 py-3 px-4">
                            <h3 class="card-title font-weight-bold text-dark mb-0 small text-uppercase letter-spacing-1">Pipeline Status</h3>
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
