{{-- Assumes $service is passed --}}
<div id="quote-form" class="quotable-sidebar">

    {{-- Quote Request Card --}}
    <div class="card detail-sidebar-card p-4 mb-3">
        <h4 class="fw-800 text-dark mb-1">{{ __('Get a custom quote') }}</h4>
        <p class="text-muted small mb-4">{{ __('Provide details to receive a tailored proposal.') }}</p>

        <form action="{{ route('services.quote.store', $service->slug) }}" method="POST">
            @csrf
            <input type="hidden" name="service_id" value="{{ $service->id }}">

            <div class="mb-3">
                <label class="form-label small fw-semibold text-muted">{{ __('Project scale') }}</label>
                <div class="input-group border rounded-3 overflow-hidden">
                    <span class="input-group-text bg-white border-0"><i class="bi bi-layers text-primary"></i></span>
                    <input type="number" name="scope_size" class="form-control border-0 ps-0"
                           placeholder="{{ $service->is_project_based ? __('Estimated hours / units') : __('Number of personnel') }}"
                           min="1" required>
                </div>
            </div>

            <div class="mb-3">
                <label class="form-label small fw-semibold text-muted">{{ __('Target start date') }}</label>
                <div class="input-group border rounded-3 overflow-hidden">
                    <span class="input-group-text bg-white border-0"><i class="bi bi-calendar-event text-primary"></i></span>
                    <input type="date" name="target_date" class="form-control border-0 ps-0"
                           min="{{ now()->format('Y-m-d') }}" required>
                </div>
            </div>

            <div class="mb-4">
                <label class="form-label small fw-semibold text-muted">{{ __('Select package preference') }}</label>
                <select name="service_package_id" class="form-select border rounded-3 shadow-none" required>
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
            <span class="badge bg-light text-muted fw-normal py-2 px-3 rounded-2">
                <i class="bi bi-shield-check text-success me-1"></i> {{ __('Secure & direct request') }}
            </span>
        </div>
    </div>

    {{-- Service Area Card --}}
    <div class="card detail-sidebar-card p-3 mb-3 border-start border-primary border-4">
        <div class="d-flex align-items-center">
            <div class="icon-box-sm bg-primary-light text-primary me-3">
                <i class="bi bi-geo-alt-fill"></i>
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
            <a href="tel:{{ $service->user->phone }}" class="text-decoration-none d-flex align-items-center text-muted hover-primary">
                <i class="bi bi-telephone me-2 text-primary"></i>
                <span class="small fw-semibold">{{ $service->user->phone ?? __('Not available') }}</span>
            </a>
            <a href="mailto:{{ $service->user->email }}" class="text-decoration-none d-flex align-items-center text-muted hover-primary">
                <i class="bi bi-envelope me-2 text-primary"></i>
                <span class="small fw-semibold">{{ $service->user->email }}</span>
            </a>
        </div>
    </div>
</div>
