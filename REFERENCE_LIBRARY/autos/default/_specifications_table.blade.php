<div class="specs-table-container rounded-4 overflow-hidden border border-color-light">
    <table class="table table-borderless mb-0">
        <tbody>
            @php
                $specGroups = [
                    [
                        'label' => __('Condition'), 
                        'value' => ($auto->condition_rating ?? 'N/A') . '/10', 
                        'icon' => 'bi-shield-shaded',
                        'highlight' => true
                    ],
                    [
                        'label' => __('Drivetrain'), 
                        'value' => $auto->drivetrain ?? __('Not Specified'), 
                        'icon' => 'bi-gear-fill'
                    ],
                    [
                        'label' => __('Fuel Economy'), 
                        'value' => $auto->fuel_economy ?? __('N/A'), 
                        'icon' => 'bi-droplet-half'
                    ],
                    [
                        'label' => __('Warranty'), 
                        'value' => $auto->warranty_months ? $auto->warranty_months . ' ' . __('Months') : __('As-Is / None'), 
                        'icon' => 'bi-patch-check'
                    ],
                    [
                        'label' => __('VIN Number'), 
                        'value' => $auto->vin_number ?? __('Available on Request'), 
                        'icon' => 'bi-hash',
                        'mono' => true
                    ],
                    [
                        'label' => __('Stock Number'), 
                        'value' => $auto->stock_number ?? $auto->id, 
                        'icon' => 'bi-box-seam'
                    ]
                ];
            @endphp

            <div class="row g-0">
                @foreach(array_chunk($specGroups, 2) as $chunk)
                    @foreach($chunk as $spec)
                        <div class="col-md-6 border-bottom border-end border-color-light">
                            <div class="d-flex align-items-center justify-content-between p-3 h-100 bg-glass-light">
                                <div class="d-flex align-items-center">
                                    <i class="bi {{ $spec['icon'] }} text-muted me-3 opacity-50"></i>
                                    <span class="text-muted fw-500 small text-uppercase tracking-wider">{{ $spec['label'] }}</span>
                                </div>
                                <div class="text-end">
                                    <span class="fw-800 {{ isset($spec['highlight']) ? 'text-primary' : 'text-dark' }} {{ isset($spec['mono']) ? 'font-monospace small' : '' }}">
                                        {{ $spec['value'] }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    @endforeach
                @endforeach
            </div>
        </tbody>
    </table>
</div>