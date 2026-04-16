<div class="row g-3">
    @php
        $features = [
            ['icon' => 'bi-people', 'label' => 'Sleeps', 'value' => ($property->maximum_guests ?? 0) . ' Guests'],
            ['icon' => 'bi-door-open', 'label' => 'Bedrooms', 'value' => $property->number_of_bedrooms ?? 0],
            ['icon' => 'bi-droplet', 'label' => 'Bathrooms', 'value' => $property->number_of_bathrooms ?? 0],
            ['icon' => 'bi-moon-stars', 'label' => 'Min Stay', 'value' => ($property->minimum_rental_days ?? 1) . ' Nights'],
        ];
    @endphp

    @foreach($features as $f)
    <div class="col-6 col-md-3">
        <div class="feature-item d-flex flex-column align-items-center text-center p-3 rounded-4 bg-glass-light border border-color-light">
            <div class="feature-icon-box mb-2">
                <i class="bi {{ $f['icon'] }}"></i>
            </div>
            <span class="tiny text-uppercase fw-bold text-muted">{{ $f['label'] }}</span>
            <span class="fw-800 text-dark">{{ $f['value'] }}</span>
        </div>
    </div>
    @endforeach
</div>
