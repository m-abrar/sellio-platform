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
                <p class="text-muted mt-2 small uppercase letter-spacing-1 mb-0">
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
<div class="container-fluid pb-5">
    @include('admin.alert')

    <form id="inquiry-form" 
          action="{{ $inquiry->exists ? route('admin.auto-inquiries.update', $inquiry->id) : route('admin.auto-inquiries.store') }}" 
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
                        <div class="form-group mb-4">
                            <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">Full Identity Name <span class="text-danger">*</span></label>
                            <input type="text" name="full_name" class="form-control form-control-hero @error('full_name') is-invalid @enderror" 
                                   value="{{ old('full_name', $inquiry->full_name) }}" required placeholder="e.g. Robert Smith">
                            @error('full_name') <span class="invalid-feedback d-block">{{ $message }}</span> @enderror
                        </div>

                        <div class="row">
                            <div class="col-md-6">
                                <div class="form-group mb-4">
                                    <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">Interested Vehicle Asset</label>
                                    <select name="auto_id" class="form-control select2" required>
                                        <option value="">Select Vehicle</option>
                                        @foreach($autos as $auto)
                                            <option value="{{ $auto->id }}" {{ old('auto_id', $inquiry->auto_id) == $auto->id ? 'selected' : '' }}>
                                                {{ $auto->title }}
                                            </option>
                                        @endforeach
                                    </select>
                                    @error('auto_id') <span class="invalid-feedback d-block">{{ $message }}</span> @enderror
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group mb-4">
                                    <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">Platform Account Principal</label>
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

                        <div class="row">
                            <div class="col-md-6">
                                <div class="form-group mb-4">
                                    <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">Electronic Contact</label>
                                    <input type="email" name="email" class="form-control form-control-premium text-monospace" 
                                           value="{{ old('email', $inquiry->email) }}" required placeholder="robert@example.com">
                                    @error('email') <span class="invalid-feedback d-block">{{ $message }}</span> @enderror
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group mb-4">
                                    <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">Telephonic Contact</label>
                                    <input type="text" name="phone" class="form-control form-control-premium" 
                                           value="{{ old('phone', $inquiry->phone) }}" placeholder="+1 234 567 890">
                                    @error('phone') <span class="invalid-feedback d-block">{{ $message }}</span> @enderror
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-md-6">
                                <div class="form-group mb-4">
                                    <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">Preferred Viewing Date</label>
                                    <input type="date" name="preferred_date" class="form-control form-control-premium" 
                                           value="{{ old('preferred_date', $inquiry->preferred_date) }}">
                                    @error('preferred_date') <span class="invalid-feedback d-block">{{ $message }}</span> @enderror
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group mb-4">
                                    <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">Target Time Window</label>
                                    <input type="text" name="preferred_time" class="form-control form-control-premium" 
                                           value="{{ old('preferred_time', $inquiry->preferred_time) }}" placeholder="e.g. Afternoon, 3 PM">
                                    @error('preferred_time') <span class="invalid-feedback d-block">{{ $message }}</span> @enderror
                                </div>
                            </div>
                        </div>

                        <div class="form-group mb-0">
                            <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">Inquiry Narrative / Lead Context</label>
                            <textarea name="message" class="form-control" rows="6"
                                style="border-radius: 16px; border: 1px solid var(--border-light);"
                                placeholder="Describe the inquiry context, special requests, or negotiation notes...">{{ old('message', $inquiry->message) }}</textarea>
                            @error('message') <span class="invalid-feedback d-block">{{ $message }}</span> @enderror
                        </div>
                    </div>
                </div>
            </div>

            {{-- Sidebar Column --}}
            <div class="col-md-4">
                @include('admin._partials._form-actions', [
                    'model' => $inquiry,
                    'title' => 'LEAD',
                    'back' => 'admin.auto-inquiries.index'
                ])

                {{-- Status Control --}}
                <div class="card border-0 shadow-premium mb-4 rounded-xl overflow-hidden mt-4">
                    <div class="card-header border-0 bg-white py-4 px-4">
                        <h3 class="card-title-side">Pipeline Status</h3>
                    </div>
                    <div class="card-body p-4 pt-0">
                        <div class="form-group mb-3">
                            <select name="status" class="form-control form-control-premium @error('status') is-invalid @enderror" required>
                                @foreach(['pending', 'reviewed', 'contacted', 'closed'] as $st)
                                    <option value="{{ $st }}" {{ old('status', $inquiry->status ?? 'pending') == $st ? 'selected' : '' }}>
                                        {{ strtoupper($st) }}
                                    </option>
                                @endforeach
                            </select>
                            @error('status') <span class="invalid-feedback d-block">{{ $message }}</span> @enderror
                        </div>
                        <div class="p-3 bg-light rounded-xl border border-light">
                            <p class="smallest text-muted mb-0 font-italic">
                                <i class="fas fa-info-circle mr-1"></i> Changing status triggers lead tracking updates in the partner dashboard.
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
                            <span class="small font-weight-bold text-primary">Internal / Web</span>
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
    $(document).ready(function () {
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
