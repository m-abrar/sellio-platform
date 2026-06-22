<div class="row g-4 mb-2">
    {{-- Availability & Status Section --}}
    <div class="col-md-7">
        <h6 class="fw-bold text-dark text-uppercase small tracking-wider mb-3">
            <i class="bi bi-clock-history me-2" style="color:var(--primary-color)"></i>{{ __('Availability') }}
        </h6>
        <div class="p-3 rounded-3" style="background:rgba(248,246,243,.8);border:1.5px solid rgba(15,23,42,.07)">
            @if($service?->operating_hours && $service?->operating_days_label)
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <span class="small fw-semibold text-capitalize">{{ $service->operating_days_label }}</span>
                    <span class="small text-muted">{{ $service->operating_hours }}</span>
                </div>
            @else
                <div class="mb-2">
                    <span class="small text-muted fst-italic">{{ __('Operating hours not specified') }}</span>
                </div>
            @endif

            <div class="d-flex justify-content-between align-items-center border-top pt-2">
                <span class="small fw-semibold">{{ __('Current Status') }}</span>

                @if($service?->is_open)
                    <span class="fw-semibold small px-2 py-1 rounded-pill" style="background:rgba(var(--primary-color-rgb),.1);color:var(--primary-color)">
                        <i class="bi bi-circle-fill me-1" style="font-size:.4rem;vertical-align:middle"></i>{{ __('Open Now') }}
                    </span>
                @else
                    <span class="fw-semibold small px-2 py-1 rounded-pill text-muted" style="background:rgba(15,23,42,.06)">
                        <i class="bi bi-circle-fill me-1" style="font-size:.4rem;vertical-align:middle"></i>{{ __('Currently Closed') }}
                    </span>
                @endif
            </div>
        </div>
    </div>

    {{-- Direct Contact Section --}}
    <div class="col-md-5">
        <h6 class="fw-bold text-dark text-uppercase small tracking-wider mb-3">{{ __('Direct Contact') }}</h6>
        <div class="d-flex flex-column gap-2">

            @if($service?->user?->phone)
                <a href="tel:{{ $service->user->phone }}" class="text-decoration-none text-muted small hover-primary d-flex align-items-center transition-all">
                    <div class="icon-box-sm me-2">
                        <i class="bi bi-telephone" style="color:var(--primary-color)"></i>
                    </div>
                    <span class="fw-500">{{ $service->user->phone }}</span>
                </a>
            @endif

            @if($service?->user?->email)
                <a href="mailto:{{ $service?->user?->email }}" class="text-decoration-none text-muted small hover-primary d-flex align-items-center transition-all">
                    <div class="icon-box-sm me-2">
                        <i class="bi bi-envelope" style="color:var(--primary-color)"></i>
                    </div>
                    <span class="fw-500">{{ __('Send Email') }}</span>
                </a>
            @endif

            @if(!$service?->user?->phone && !$service?->email)
                 <p class="small text-muted fst-italic mb-0">{{ __('No contact info available') }}</p>
            @endif
        </div>
    </div>
</div>
