{{-- Assumes $service is passed --}}
<div id="quote-form" class="quotable-sidebar sticky-top" style="top: 20px;">
    
    {{-- Quote Request Card --}}
    <div class="card glass-surface border-0 shadow-sm p-4 mb-3">
        <h4 class="fw-800 text-dark mb-1">{{ __('Get a Custom Quote') }}</h4>
        <p class="text-muted small mb-4">{{ __('Provide details to receive a tailored proposal.') }}</p>
        
        <form action="{{ route('services.quote.store', $service->slug) }}" method="POST">
            @csrf 
            <input type="hidden" name="service_id" value="{{ $service->id }}">
            
            {{-- Dynamic Scope Input --}}
            <div class="mb-3">
                <label class="form-label small fw-bold text-uppercase tracking-wider text-muted">{{ __('Project Scale') }}</label>
                <div class="input-group border rounded-3 overflow-hidden">
                    <span class="input-group-text bg-white border-0"><i class="bi bi-layers text-primary"></i></span>
                    <input type="number" name="scope_size" class="form-control border-0 ps-0" 
                           placeholder="{{ $service->is_project_based ? __('Estimated Hours / Units') : __('Number of Personnel') }}" 
                           min="1" required>
                </div>
            </div>

            {{-- Target Date --}}
            <div class="mb-3">
                <label class="form-label small fw-bold text-uppercase tracking-wider text-muted">{{ __('Target Start Date') }}</label>
                <div class="input-group border rounded-3 overflow-hidden">
                    <span class="input-group-text bg-white border-0"><i class="bi bi-calendar-event text-primary"></i></span>
                    <input type="date" name="target_date" class="form-control border-0 ps-0" 
                           min="{{ now()->format('Y-m-d') }}" required>
                </div>
            </div>
            
            {{-- Package Selection (Dynamic from Service Packages) --}}
            <div class="mb-4">
                <label class="form-label small fw-bold text-uppercase tracking-wider text-muted">
                    {{ __('Select Package Preference') }}
                </label>
                <select name="service_package_id" class="form-select border rounded-3 shadow-none bg-light-focus" required>
                    <option value="" selected disabled>{{ __('Choose a starting point...') }}</option>
                    
                    @if ($service->packages->isNotEmpty())
                        @foreach ($service->packages as $package)
                            <option value="{{ $package->id }}">
                                {{ $package->title }} 
                                — {{ __('Starts at') }} ${{ number_format($package->price, 0) }} 
                                ({{ $package->billing_period }})
                            </option>
                        @endforeach
                        {{-- Optional: Allow for a custom/not-sure option --}}
                        <option value="custom">{{ __('Custom / Not Sure (Request Discussion)') }}</option>
                    @else
                        {{-- Fallback if no packages are defined --}}
                        <option value="standard">{{ __('Standard Service Engagement') }}</option>
                        <option value="urgent">{{ __('Urgent / Priority Project') }}</option>
                        <option value="consultancy">{{ __('General Consultancy') }}</option>
                    @endif
                </select>
            </div>

            <style>
                /* Subtle focus effect for the select box */
                .bg-light-focus:focus {
                    background-color: #f8fafc;
                    border-color: var(--bs-primary);
                }
            </style>
            
            <div class="d-grid mb-3">
                <button type="submit" class="btn btn-lg fw-800 text-white btn-primary shadow-sm rounded-pill">
                    {{ __('Request Proposal') }}
                </button>
            </div>
        </form>

        <div class="text-center">
            <span class="badge bg-light text-muted fw-normal py-2 px-3 rounded-pill">
                <i class="bi bi-shield-check text-success me-1"></i> {{ __('Secure & Direct Request') }}
            </span>
        </div>
    </div>
    
    {{-- Service Area Card --}}
    <div class="card glass-surface p-3 mb-3 border-0 shadow-sm border-start border-primary border-4">
        <div class="d-flex align-items-center">
            <div class="icon-box-sm bg-primary-light text-primary me-3">
                <i class="bi bi-geo-alt-fill"></i>
            </div>
            <div>
                <h6 class="fw-bold mb-0 text-dark">{{ __('Service Area') }}</h6>
                <p class="small mb-0 text-muted">
                    {{ $service->city }}, {{ $service->country }} 
                    @if($service->service_radius)
                        (+{{ $service->service_radius }}km)
                    @endif
                </p>
            </div>
        </div>
    </div>
    
    {{-- Provider Quick Connect --}}
    <div class="card glass-surface p-3 mb-3 border-0 shadow-sm">
        <h6 class="fw-800 mb-3 text-dark small text-uppercase">{{ __('Direct Support') }}</h6>
        <div class="d-flex flex-column gap-2">
            <a href="tel:{{ $service->user->phone }}" class="text-decoration-none d-flex align-items-center text-muted hover-primary">
                <i class="bi bi-telephone me-2 text-primary"></i>
                <span class="small fw-semibold">{{ $service->user->phone ?? __('Not Available') }}</span>
            </a>
            <a href="mailto:{{ $service->user->email }}" class="text-decoration-none d-flex align-items-center text-muted hover-primary">
                <i class="bi bi-envelope me-2 text-primary"></i>
                <span class="small fw-semibold">{{ $service->user->email }}</span>
            </a>
        </div>
    </div>
</div>