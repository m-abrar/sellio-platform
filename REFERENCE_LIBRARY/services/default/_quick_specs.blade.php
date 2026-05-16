<div class="specs-wrapper mt-2">
    <div class="row g-0">
        {{-- 1. Expertise Level (Mapped from Integer) --}}
        @php
            $levels = [
                1 => ['label' => __('Entry Level'), 'sub' => __('Junior Professional')],
                2 => ['label' => __('Intermediate'), 'sub' => __('Experienced')],
                3 => ['label' => __('Expert'), 'sub' => __('Specialist')],
                4 => ['label' => __('Master'), 'sub' => __('Industry Leader')],
            ];
            $currentLevel = $levels[$service->expertise_level] ?? ['label' => __('Standard'), 'sub' => __('Verified')];
        @endphp
        <div class="col-12 border-bottom border-color-light py-3">
            <div class="d-flex justify-content-between align-items-center">
                <div class="d-flex align-items-center">
                    <div class="spec-icon-box bg-primary-light text-primary me-3">
                        <i class="bi bi-mortarboard-fill"></i>
                    </div>
                    <div>
                        <span class="d-block fw-bold text-dark small mb-0">{{ $currentLevel['label'] }}</span>
                        <span class="text-muted tiny text-uppercase tracking-wider">{{ $currentLevel['sub'] }}</span>
                    </div>
                </div>
                <div class="text-end">
                    <span class="badge bg-light text-primary border fw-bold">{{ __('Level') }} {{ $service->expertise_level }}</span>
                </div>
            </div>
        </div>

        {{-- 2. Service Radius (From Migration) --}}
        <div class="col-12 border-bottom border-color-light py-3">
            <div class="d-flex justify-content-between align-items-center">
                <div class="d-flex align-items-center">
                    <div class="spec-icon-box bg-primary-light text-primary me-3">
                        <i class="bi bi-geo-alt-fill"></i>
                    </div>
                    <div>
                        <span class="d-block fw-bold text-dark small mb-0">{{ __('Service Radius') }}</span>
                        <span class="text-muted tiny text-uppercase tracking-wider">{{ __('Coverage Area') }}</span>
                    </div>
                </div>
                <div class="text-end">
                    <span class="fw-800 text-dark fs-6">
                        @if($service->service_radius > 0)
                            {{ $service->service_radius }} km
                        @else
                            {{ __('Global/Remote') }}
                        @endif
                    </span>
                </div>
            </div>
        </div>

        {{-- 3. Contract/Availability (From Migration) --}}
        <div class="col-12 border-bottom border-color-light py-3">
            <div class="d-flex justify-content-between align-items-center">
                <div class="d-flex align-items-center">
                    <div class="spec-icon-box bg-primary-light text-primary me-3">
                        <i class="bi bi-file-earmark-medical-fill"></i>
                    </div>
                    <div>
                        <span class="d-block fw-bold text-dark small mb-0">{{ __('Min. Commitment') }}</span>
                        <span class="text-muted tiny text-uppercase tracking-wider">{{ __('Contract Terms') }}</span>
                    </div>
                </div>
                <div class="text-end">
                    <span class="fw-800 text-dark fs-6">
                        {{ $service->min_contract_months ?? 1 }} {{ Str::plural(__('Month'), $service->min_contract_months) }}
                    </span>
                </div>
            </div>
        </div>

        {{-- 4. Capacity (From Migration) --}}
        <div class="col-12 py-3">
            <div class="d-flex justify-content-between align-items-center">
                <div class="d-flex align-items-center">
                    <div class="spec-icon-box bg-primary-light text-primary me-3">
                        <i class="bi bi-people-fill"></i>
                    </div>
                    <div>
                        <span class="d-block fw-bold text-dark small mb-0">{{ __('Client Slots') }}</span>
                        <span class="text-muted tiny text-uppercase tracking-wider">{{ __('Availability') }}</span>
                    </div>
                </div>
                <div class="text-end">
                    <span class="fw-800 {{ $service->max_client_slots > 0 ? 'text-success' : 'text-muted' }} fs-6">
                        {{ $service->max_client_slots ?? __('Unlimited') }}
                    </span>
                </div>
            </div>
        </div>
    </div>
</div>