@extends('adminlte::page')

@section('title', ($appointment->exists ? 'Modify' : 'Create') . ' Service Appointment | Executive Registry')

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-8">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-calendar-check mr-2 text-primary opacity-50"></i> 
                    {{ $appointment->exists ? 'Update Appointment: #' . $appointment->id : 'New Service Booking' }}
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">
                    {{ $appointment->exists ? 'Managing service delivery schedule and client engagement.' : 'Manually logging a new service appointment request.' }}
                </p>
            </div>
            <div class="col-sm-4 text-right">
                <a href="{{ route('admin.service-appointments.index') }}" class="btn btn-back shadow-sm rounded-pill px-4">
                    <i class="fas fa-arrow-left mr-1"></i> BACK TO QUEUE
                </a>
            </div>
        </div>
    </div>
@stop

@section('content')
<div class="container-fluid">
    @include('admin.alert')

    <form id="appointment-form" 
          action="{{ $appointment->exists ? route('admin.service-appointments.update', $appointment->id) : route('admin.service-appointments.store') }}" 
          method="POST">
        @csrf
        @if($appointment->exists) @method('PATCH') @endif

        <div class="row pb-5">
            {{-- Primary column --}}
            <div class="col-md-8">
                <div class="card card-premium shadow-premium mb-4 border-0 overflow-hidden">
                    <div class="card-header border-0 bg-white py-4 px-4 d-flex align-items-center">
                        <h3 class="card-title font-weight-bold text-dark mb-0 text-uppercase letter-spacing-1" style="font-size: 1.1rem;">
                            <i class="fas fa-info-circle mr-2 text-primary opacity-50"></i> Booking Parameters
                        </h3>
                    </div>
                    <div class="card-body p-4">
                        <div class="row">
                            <div class="col-md-6 mb-4">
                                <label class="smallest font-weight-bold text-secondary text-uppercase mb-2 letter-spacing-1">Target Service</label>
                                <div class="input-group input-group-premium shadow-xs">
                                    <div class="input-group-prepend border-0">
                                        <span class="input-group-text bg-white border-0 py-0"><i class="fas fa-concierge-bell text-primary"></i></span>
                                    </div>
                                    <select name="service_id" class="form-control border-0 custom-select shadow-none bg-white h-100 py-0 select2" required>
                                        <option value="">Select Service</option>
                                        @foreach($services as $service)
                                            <option value="{{ $service->id }}" {{ old('service_id', $appointment->service_id) == $service->id ? 'selected' : '' }}>
                                                {{ $service->title }}
                                            </option>
                                        @endforeach
                                    </select>
                                </div>
                                @error('service_id') <small class="text-danger font-weight-bold mt-1 d-block">{{ $message }}</small> @enderror
                            </div>
                            <div class="col-md-6 mb-4">
                                <label class="smallest font-weight-bold text-secondary text-uppercase mb-2 letter-spacing-1">Client Principal</label>
                                <div class="input-group input-group-premium shadow-xs">
                                    <div class="input-group-prepend border-0">
                                        <span class="input-group-text bg-white border-0 py-0"><i class="fas fa-user-tie text-primary"></i></span>
                                    </div>
                                    <select name="user_id" class="form-control border-0 custom-select shadow-none bg-white h-100 py-0 select2" required>
                                        <option value="">Associate User</option>
                                        @foreach($users as $user)
                                            <option value="{{ $user->id }}" {{ old('user_id', $appointment->user_id) == $user->id ? 'selected' : '' }}>
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
                                <label class="smallest font-weight-bold text-secondary text-uppercase mb-2 letter-spacing-1">Client Full Name</label>
                                <div class="input-group input-group-premium shadow-xs">
                                    <div class="input-group-prepend border-0">
                                        <span class="input-group-text bg-white border-0 py-0"><i class="fas fa-id-card text-primary"></i></span>
                                    </div>
                                    <input type="text" name="name" class="form-control border-0 shadow-none bg-white h-100 py-0 font-weight-bold" 
                                           value="{{ old('name', $appointment->name) }}" required placeholder="e.g. John Doe">
                                </div>
                                @error('name') <small class="text-danger font-weight-bold mt-1 d-block">{{ $message }}</small> @enderror
                            </div>
                            <div class="col-md-4 mb-4">
                                <label class="smallest font-weight-bold text-secondary text-uppercase mb-2 letter-spacing-1">Electronic Mail</label>
                                <div class="input-group input-group-premium shadow-xs">
                                    <div class="input-group-prepend border-0">
                                        <span class="input-group-text bg-white border-0 py-0"><i class="fas fa-envelope text-primary"></i></span>
                                    </div>
                                    <input type="email" name="email" class="form-control border-0 shadow-none bg-white h-100 py-0 text-monospace" 
                                           value="{{ old('email', $appointment->email) }}" required placeholder="john@example.com">
                                </div>
                                @error('email') <small class="text-danger font-weight-bold mt-1 d-block">{{ $message }}</small> @enderror
                            </div>
                            <div class="col-md-4 mb-4">
                                <label class="smallest font-weight-bold text-secondary text-uppercase mb-2 letter-spacing-1">Phone Contact</label>
                                <div class="input-group input-group-premium shadow-xs">
                                    <div class="input-group-prepend border-0">
                                        <span class="input-group-text bg-white border-0 py-0"><i class="fas fa-phone text-primary"></i></span>
                                    </div>
                                    <input type="text" name="phone" class="form-control border-0 shadow-none bg-white h-100 py-0" 
                                           value="{{ old('phone', $appointment->phone) }}" placeholder="+1 234 567 890">
                                </div>
                                @error('phone') <small class="text-danger font-weight-bold mt-1 d-block">{{ $message }}</small> @enderror
                            </div>
                        </div>

                        <div class="row mt-2">
                            <div class="col-md-4 mb-4">
                                <label class="smallest font-weight-bold text-secondary text-uppercase mb-2 letter-spacing-1">Scheduled Timeline</label>
                                <div class="input-group input-group-premium shadow-xs">
                                    <div class="input-group-prepend border-0">
                                        <span class="input-group-text bg-white border-0 py-0"><i class="fas fa-calendar-day text-primary"></i></span>
                                    </div>
                                    <input type="datetime-local" name="scheduled_at" class="form-control border-0 shadow-none bg-white h-100 py-0 smallest font-weight-bold" 
                                           value="{{ old('scheduled_at', $appointment->scheduled_at ? $appointment->scheduled_at->format('Y-m-d\TH:i') : '') }}" required>
                                </div>
                                @error('scheduled_at') <small class="text-danger font-weight-bold mt-1 d-block">{{ $message }}</small> @enderror
                            </div>
                            <div class="col-md-4 mb-4">
                                <label class="smallest font-weight-bold text-secondary text-uppercase mb-2 letter-spacing-1">Booking Topic</label>
                                <div class="input-group input-group-premium shadow-xs">
                                    <div class="input-group-prepend border-0">
                                        <span class="input-group-text bg-white border-0 py-0"><i class="fas fa-tag text-primary"></i></span>
                                    </div>
                                    <input type="text" name="topic" class="form-control border-0 shadow-none bg-white h-100 py-0" 
                                           value="{{ old('topic', $appointment->topic) }}" placeholder="e.g. Initial Consultation">
                                </div>
                                @error('topic') <small class="text-danger font-weight-bold mt-1 d-block">{{ $message }}</small> @enderror
                            </div>
                            <div class="col-md-4 mb-4">
                                <label class="smallest font-weight-bold text-secondary text-uppercase mb-2 letter-spacing-1">Lifecycle Status</label>
                                <div class="input-group input-group-premium shadow-xs">
                                    <div class="input-group-prepend border-0">
                                        <span class="input-group-text bg-white border-0 py-0"><i class="fas fa-traffic-light text-primary"></i></span>
                                    </div>
                                    <select name="status" class="form-control border-0 custom-select shadow-none bg-white h-100 py-0" required>
                                        @foreach(['pending', 'confirmed', 'completed', 'cancelled'] as $st)
                                            <option value="{{ $st }}" {{ old('status', $appointment->status ?? 'pending') == $st ? 'selected' : '' }}>
                                                {{ strtoupper($st) }}
                                            </option>
                                        @endforeach
                                    </select>
                                </div>
                                @error('status') <small class="text-danger font-weight-bold mt-1 d-block">{{ $message }}</small> @enderror
                            </div>
                        </div>

                        <div class="col-12 mb-0">
                            <label class="smallest font-weight-bold text-secondary text-uppercase mb-2 letter-spacing-1">Service Notes / Requirements</label>
                            <textarea name="notes" class="form-control border shadow-xs bg-white p-3" rows="4"
                                style="border-radius: 12px; font-size: 0.9rem;"
                                placeholder="Client notes or special requirements...">{{ old('notes', $appointment->notes) }}</textarea>
                            @error('notes') <small class="text-danger font-weight-bold mt-1 d-block">{{ $message }}</small> @enderror
                        </div>
                    </div>
                </div>
            </div>

            {{-- Sidebar column --}}
            <div class="col-md-4">
                <div class="sticky-top" style="top: 20px; z-index: 10;">
                    {{-- Action Card --}}
                    @include('admin._partials._form-actions', [
                        'model' => $appointment,
                        'title' => 'SERVICE BOOKING',
                        'back' => 'admin.service-appointments.index'
                    ])

                    <div class="card card-premium shadow-premium mt-4 border-0 overflow-hidden">
                        <div class="card-body p-4 bg-primary-soft">
                            <h6 class="font-weight-bold text-primary mb-3 smallest text-uppercase letter-spacing-1">Service Protocol</h6>
                            <p class="text-muted small mb-0" style="line-height: 1.6;">
                                Confirming this appointment will trigger an automated confirmation email to the client principal. Ensure the <strong>Scheduled Timeline</strong> is verified with the service provider.
                            </p>
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
                theme: 'default',
                width: '100%'
            });
        }
    });
</script>
@endpush
