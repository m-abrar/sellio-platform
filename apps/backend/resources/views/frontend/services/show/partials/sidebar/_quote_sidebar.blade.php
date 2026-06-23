{{-- Assumes $service is passed --}}
<div id="quote-form" class="quotable-sidebar">

    {{-- Quote Request Card --}}
    <div class="card detail-sidebar-card mb-3 overflow-hidden">
        <div class="p-4" style="background:#F4F0EC;border-bottom:1.5px solid rgba(15,23,42,.07)">
            <p class="small fw-semibold text-uppercase mb-1" style="letter-spacing:.06em;color:var(--primary-color)">
                <i class="bi bi-file-earmark-text-fill me-1"></i>{{ __('Custom Quote') }}
            </p>
            <h4 class="fw-800 text-dark mb-1" style="font-family:var(--font-heading)">{{ __('Get a Proposal') }}</h4>
            <p class="small text-muted mb-0">{{ __('Provide details to receive a tailored proposal.') }}</p>
        </div>
        <div class="card-body p-4">
            <h6 class="fw-800 mb-3" style="font-size:.8rem;letter-spacing:.04em;text-transform:uppercase;color:var(--primary-color)">
                <i class="bi bi-sliders me-2"></i>{{ __('Project details') }}
            </h6>

            <form action="{{ route('services.quote.store', $service->slug) }}" method="POST">
                @csrf
                <input type="hidden" name="service_id" value="{{ $service->id }}">

                <div class="mb-3">
                    <label class="form-label small fw-semibold text-muted">{{ __('Project scale') }}</label>
                    <div class="input-group rounded-3 overflow-hidden" style="border:1.5px solid rgba(15,23,42,.12)">
                        <span class="input-group-text bg-white border-0"><i class="bi bi-layers" style="color:var(--primary-color)"></i></span>
                        <input type="number" name="scope_size" class="form-control border-0 ps-0 shadow-none"
                               placeholder="{{ $service->is_project_based ? __('Estimated hours / units') : __('Number of personnel') }}"
                               min="1" required>
                    </div>
                </div>

                <div class="mb-3">
                    <label class="form-label small fw-semibold text-muted">{{ __('Target start date') }}</label>
                    <div class="input-group rounded-3 overflow-hidden" style="border:1.5px solid rgba(15,23,42,.12)">
                        <span class="input-group-text bg-white border-0"><i class="bi bi-calendar-event" style="color:var(--primary-color)"></i></span>
                        <input type="date" name="target_date" class="form-control border-0 ps-0 shadow-none"
                               min="{{ now()->format('Y-m-d') }}" required>
                    </div>
                </div>

                <div class="mb-4">
                    <label class="form-label small fw-semibold text-muted">{{ __('Select package preference') }}</label>
                    <select name="service_package_id" class="form-select shadow-none rounded-3" style="border:1.5px solid rgba(15,23,42,.12)" required>
                        <option value="" selected disabled>{{ __('Choose a starting point…') }}</option>

                        @if ($service->packages->isNotEmpty())
                            @foreach ($service->packages as $package)
                                <option value="{{ $package->id }}">
                                    {{ $package->title }}
                                    — {{ __('Starts at') }} ${{ number_format($package->price, 0) }}
                                    ({{ $package->billing_period }})
                                </option>
                            @endforeach
                            <option value="custom">{{ __('Custom / not sure (request discussion)') }}</option>
                        @else
                            <option value="standard">{{ __('Standard service engagement') }}</option>
                            <option value="urgent">{{ __('Urgent / priority project') }}</option>
                            <option value="consultancy">{{ __('General consultancy') }}</option>
                        @endif
                    </select>
                </div>

                <div class="d-grid mb-3">
                    <button type="submit" class="btn btn-primary btn-header-cta">
                        {{ __('Request proposal') }}<i class="bi bi-arrow-right ms-2"></i>
                    </button>
                </div>
            </form>

            <div class="text-center">
                <span class="small text-muted">
                    <i class="bi bi-shield-check me-1" style="color:var(--primary-color)"></i> {{ __('Secure & direct request') }}
                </span>
            </div>
        </div>
    </div>

    {{-- Service Area Card --}}
    <div class="card detail-sidebar-card p-3 mb-3" style="border-left:4px solid var(--primary-color)">
        <div class="d-flex align-items-center">
            <div class="me-3 rounded-2 d-flex align-items-center justify-content-center" style="width:36px;height:36px;background:rgba(var(--primary-color-rgb),.1)">
                <i class="bi bi-geo-alt-fill" style="color:var(--primary-color)"></i>
            </div>
            <div>
                <h6 class="fw-semibold mb-0 text-dark">{{ __('Service area') }}</h6>
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
    <div class="card detail-sidebar-card p-3 mb-3">
        <h6 class="fw-semibold mb-3 text-dark small text-uppercase">{{ __('Direct support') }}</h6>
        <div class="d-flex flex-column gap-2">
            <a href="tel:{{ $service->user->phone }}" class="text-decoration-none d-flex align-items-center text-muted">
                <i class="bi bi-telephone me-2" style="color:var(--primary-color)"></i>
                <span class="small fw-semibold">{{ $service->user->phone ?? __('Not available') }}</span>
            </a>
            <a href="mailto:{{ $service->user->email }}" class="text-decoration-none d-flex align-items-center text-muted">
                <i class="bi bi-envelope me-2" style="color:var(--primary-color)"></i>
                <span class="small fw-semibold">{{ $service->user->email }}</span>
            </a>
        </div>
    </div>
</div>
