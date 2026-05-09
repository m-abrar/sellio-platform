{{--
    Administrative Services: Appointment Configuration
    
    This view serves as the authoritative interface for managing service 
    appointments. It orchestrates client identity parameters, scheduled 
    itineraries, service mapping, and lifecycle status tracking 
    (pending, confirmed, completed, cancelled) to ensure transparent 
    and efficient service delivery oversight.
    
    @extends adminlte::page
    @context Service Appointment Management
    @variables ServiceAppointment $appointment The appointment model instance.
    @variables Collection $services List of active services for mapping.
    @variables Collection $users List of platform members for client mapping.
--}}
@extends('adminlte::page')

@section('title', ($appointment->exists ? 'Modify' : 'Create') . ' Service Appointment')

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-8">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-calendar-check mr-2 text-primary opacity-50"></i> 
                    {{ $appointment->exists ? 'Update Appointment: #' . $appointment->id : 'New Service Booking' }}
                </h1>
                <p class="text-muted mt-2 small uppercase letter-spacing-1 mb-0">
                    {{ $appointment->exists ? 'Managing service delivery schedule and client engagement.' : 'Manually logging a new service appointment request.' }}
                </p>
            </div>
            <div class="col-sm-4 text-right">
                <a href="{{ route('admin.service-appointments.index') }}" class="btn btn-back shadow-sm">
                    <i class="fas fa-arrow-left mr-1"></i> Back to Queue
                </a>
            </div>
        </div>
    </div>
@stop

@section('content')
<div class="container-fluid pb-5">
    @include('admin.alert')

    <form id="appointment-form" 
          action="{{ $appointment->exists ? route('admin.service-appointments.update', $appointment->id) : route('admin.service-appointments.store') }}" 
          method="POST">
        @csrf
        @if($appointment->exists) @method('PATCH') @endif

        <div class="row">
            {{-- Main Content Column --}}
            <div class="col-md-8">
                {{-- Lead Information --}}
                <div class="card border-0 shadow-premium rounded-xl overflow-hidden mb-4">
                    <div class="card-header border-0 bg-white py-4 px-4">
                        <h3 class="card-title-main">Booking Parameters</h3>
                    </div>
                    <div class="card-body p-4 pt-0">
                        <div class="form-group mb-4">
                            <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">Client Full Name <span class="text-danger">*</span></label>
                            <input type="text" name="name" class="form-control form-control-hero @error('name') is-invalid @enderror" 
                                   value="{{ old('name', $appointment->name) }}" required placeholder="e.g. John Doe">
                            @error('name') <span class="invalid-feedback d-block">{{ $message }}</span> @enderror
                        </div>

                        <div class="row">
                            <div class="col-md-6">
                                <div class="form-group mb-4">
                                    <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">Target Service</label>
                                    <select name="service_id" class="form-control select2" required>
                                        <option value="">Select Service</option>
                                        @foreach($services as $service)
                                            <option value="{{ $service->id }}" {{ old('service_id', $appointment->service_id) == $service->id ? 'selected' : '' }}>
                                                {{ $service->title }}
                                            </option>
                                        @endforeach
                                    </select>
                                    @error('service_id') <span class="invalid-feedback d-block">{{ $message }}</span> @enderror
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group mb-4">
                                    <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">Client Principal</label>
                                    <select name="user_id" class="form-control select2" required>
                                        <option value="">Associate User</option>
                                        @foreach($users as $user)
                                            <option value="{{ $user->id }}" {{ old('user_id', $appointment->user_id) == $user->id ? 'selected' : '' }}>
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
                                    <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">Electronic Mail</label>
                                    <input type="email" name="email" class="form-control form-control-premium text-monospace" 
                                           value="{{ old('email', $appointment->email) }}" required placeholder="john@example.com">
                                    @error('email') <span class="invalid-feedback d-block">{{ $message }}</span> @enderror
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group mb-4">
                                    <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">Phone Contact</label>
                                    <input type="text" name="phone" class="form-control form-control-premium" 
                                           value="{{ old('phone', $appointment->phone) }}" placeholder="+1 234 567 890">
                                    @error('phone') <span class="invalid-feedback d-block">{{ $message }}</span> @enderror
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-md-4">
                                <div class="form-group mb-4">
                                    <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">Scheduled Timeline</label>
                                    <input type="datetime-local" name="scheduled_at" class="form-control form-control-premium font-weight-bold" 
                                           value="{{ old('scheduled_at', $appointment->scheduled_at ? $appointment->scheduled_at->format('Y-m-d\TH:i') : '') }}" required>
                                    @error('scheduled_at') <span class="invalid-feedback d-block">{{ $message }}</span> @enderror
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="form-group mb-4">
                                    <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">Booking Topic</label>
                                    <input type="text" name="topic" class="form-control form-control-premium" 
                                           value="{{ old('topic', $appointment->topic) }}" placeholder="e.g. Initial Consultation">
                                    @error('topic') <span class="invalid-feedback d-block">{{ $message }}</span> @enderror
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="form-group mb-4">
                                    <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">Lifecycle Status</label>
                                    <select name="status" class="form-control form-control-premium" required>
                                        @foreach(['pending', 'confirmed', 'completed', 'cancelled'] as $st)
                                            <option value="{{ $st }}" {{ old('status', $appointment->status ?? 'pending') == $st ? 'selected' : '' }}>
                                                {{ strtoupper($st) }}
                                            </option>
                                        @endforeach
                                    </select>
                                    @error('status') <span class="invalid-feedback d-block">{{ $message }}</span> @enderror
                                </div>
                            </div>
                        </div>

                        <div class="form-group mb-0">
                            <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">{{ __('Service Notes / Requirements') }}</label>
                            <textarea name="notes" class="form-control textarea-premium" rows="4"
                                placeholder="{{ __('Client notes or special requirements...') }}">{{ old('notes', $appointment->notes) }}</textarea>
                            @error('notes') <span class="invalid-feedback d-block">{{ $message }}</span> @enderror
                        </div>
                    </div>
                </div>
            </div>

            {{-- Sidebar Column --}}
            <div class="col-md-4">
                @include('admin._partials._form-actions', [
                    'model' => $appointment,
                    'title' => 'APPOINTMENT',
                    'back' => 'admin.service-appointments.index'
                ])

                {{-- Service Protocol --}}
                <div class="card border-0 shadow-premium mt-4 rounded-xl overflow-hidden">
                    <div class="card-header border-0 bg-white py-4 px-4">
                        <h3 class="card-title-side">Service Protocol</h3>
                    </div>
                    <div class="card-body p-4 pt-0">
                        <div class="p-3 bg-light rounded-xl border border-light">
                            <p class="small text-muted mb-0 font-italic" style="line-height: 1.6;">
                                <i class="fas fa-info-circle mr-1 text-primary"></i> Confirming this appointment will trigger an automated confirmation email to the client principal. Ensure the <strong>Scheduled Timeline</strong> is verified with the service provider.
                            </p>
                        </div>
                    </div>
                </div>

                {{-- Meta Information --}}
                <div class="card border-0 shadow-premium mb-4 rounded-xl overflow-hidden mt-4">
                    <div class="card-header border-0 bg-white py-4 px-4">
                        <h3 class="card-title-side">Audit Trail</h3>
                    </div>
                    <div class="card-body p-4 pt-0">
                        <div class="d-flex justify-content-between mb-2">
                            <span class="small text-muted uppercase letter-spacing-1">Created At</span>
                            <span class="small font-weight-bold">{{ $appointment->created_at ? $appointment->created_at->format('M d, Y') : 'Draft' }}</span>
                        </div>
                        <div class="d-flex justify-content-between">
                            <span class="small text-muted uppercase letter-spacing-1">Source</span>
                            <span class="small font-weight-bold text-primary">Service Registry</span>
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
