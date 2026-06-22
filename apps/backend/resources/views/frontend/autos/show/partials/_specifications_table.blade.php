@php
    $specGroups = [
        ['label' => __('Condition'),    'value' => ($auto->condition_rating ?? 'N/A') . '/10', 'icon' => 'bi-shield-check',       'highlight' => true],
        ['label' => __('Drivetrain'),   'value' => $auto->drivetrain ?? __('Not Specified'),    'icon' => 'bi-gear-fill'],
        ['label' => __('Fuel Economy'), 'value' => $auto->fuel_economy ?? __('N/A'),            'icon' => 'bi-droplet-half'],
        ['label' => __('Warranty'),     'value' => $auto->warranty_months ? $auto->warranty_months . ' ' . __('Months') : __('As-Is / None'), 'icon' => 'bi-patch-check-fill'],
        ['label' => __('VIN Number'),   'value' => $auto->vin_number ?? __('On Request'),       'icon' => 'bi-hash',               'mono' => true],
        ['label' => __('Stock No.'),    'value' => $auto->stock_number ?? $auto->id,            'icon' => 'bi-box-seam-fill'],
    ];
@endphp

<div class="spec-rows">
    @foreach(array_chunk($specGroups, 2) as $pair)
        <div class="spec-row-pair">
            @foreach($pair as $spec)
                <div class="spec-cell">
                    <span class="spec-cell__icon" aria-hidden="true">
                        <i class="bi {{ $spec['icon'] }}"></i>
                    </span>
                    <span class="spec-cell__label">{{ $spec['label'] }}</span>
                    <span class="spec-cell__value {{ ($spec['highlight'] ?? false) ? 'spec-cell__value--hi' : '' }} {{ ($spec['mono'] ?? false) ? 'font-monospace' : '' }}">
                        {{ $spec['value'] }}
                    </span>
                </div>
            @endforeach
        </div>
    @endforeach
</div>

@push('styles')
<style>
.spec-rows {
    background: rgba(248, 246, 243, 0.75);
    border: 1.5px solid rgba(15, 23, 42, 0.07);
    border-radius: 16px;
    overflow: hidden;
}

.spec-row-pair {
    display: grid;
    grid-template-columns: 1fr 1fr;
    border-bottom: 1.5px solid rgba(15, 23, 42, 0.06);
}

.spec-row-pair:last-child {
    border-bottom: 0;
}

.spec-cell {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 18px;
    border-right: 1.5px solid rgba(15, 23, 42, 0.06);
}

.spec-cell:last-child {
    border-right: 0;
}

.spec-cell__icon {
    flex: 0 0 auto;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    border-radius: 8px;
    background: rgba(var(--primary-color-rgb), 0.1);
    color: var(--primary-color);
    font-size: 0.82rem;
}

.spec-cell__label {
    flex: 1;
    font-size: 0.72rem;
    font-weight: 800;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: #9ca3af;
    min-width: 0;
}

.spec-cell__value {
    flex: 0 0 auto;
    font-size: 0.9rem;
    font-weight: 800;
    color: var(--text-dark);
    white-space: nowrap;
}

.spec-cell__value--hi {
    color: var(--primary-color);
}

@media (max-width: 575.98px) {
    .spec-row-pair {
        grid-template-columns: 1fr;
    }
    .spec-cell {
        border-right: 0;
        border-bottom: 1.5px solid rgba(15, 23, 42, 0.06);
    }
    .spec-row-pair:last-child .spec-cell:last-child {
        border-bottom: 0;
    }
}
</style>
@endpush
