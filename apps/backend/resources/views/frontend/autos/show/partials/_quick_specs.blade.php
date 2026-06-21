@php
    $specs = [
        [
            'icon' => 'bi-speedometer2',
            'label' => __('Mileage'),
            'value' => $auto->mileage_formatted ?? number_format($auto->mileage) . ' ' . ($auto->mileage_unit ?? 'mi'),
        ],
        [
            'icon' => 'bi-fuel-pump',
            'label' => __('Fuel Type'),
            'value' => ucfirst($auto->engine_type ?? $auto->fuel_type ?? 'N/A'),
        ],
        [
            'icon' => 'bi-gear-wide-connected',
            'label' => __('Transmission'),
            'value' => ucfirst($auto->transmission ?? 'N/A'),
        ],
        [
            'icon' => 'bi-palette',
            'label' => __('Exterior Color'),
            'value' => $auto->exterior_color ?? 'N/A',
        ],
    ];
@endphp

<div class="row g-3 mb-4">
    @foreach($specs as $spec)
        <div class="col-6 col-md-3">
            <div class="feature-item d-flex flex-column align-items-center text-center p-3 rounded-4 h-100">
                <div class="feature-icon-box mb-2" style="width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; border-radius: 12px; background: var(--primary-light); color: var(--primary-color); font-size: 1.25rem;">
                    <i class="bi {{ $spec['icon'] }}"></i>
                </div>
                <span class="metric-label d-block mb-1">{{ $spec['label'] }}</span>
                <span class="metric-value text-dark d-block">{{ $spec['value'] }}</span>
            </div>
        </div>
    @endforeach
</div>
