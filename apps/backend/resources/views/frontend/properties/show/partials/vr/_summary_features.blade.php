<div class="row g-3">
    @php
        $features = [
            ['icon' => 'bi-people', 'label' => __('Sleeps'), 'value' => ($property->booking_guest_capacity ?? $property->maximum_guests ?? 1) . ' ' . __('Guests')],
            ['icon' => 'bi-door-open', 'label' => __('Bedrooms'), 'value' => $property->number_of_bedrooms ?? 0],
            ['icon' => 'bi-droplet', 'label' => __('Bathrooms'), 'value' => $property->number_of_bathrooms ?? 0],
            ['icon' => 'bi-moon-stars', 'label' => __('Min Stay'), 'value' => ($property->minimum_rental_days ?? 1) . ' ' . __('Nights')],
        ];
    @endphp

    @foreach($features as $f)
    <div class="col-6 col-md-3">
        <div class="feature-item d-flex flex-column align-items-center text-center p-3 rounded-4 bg-light border border-color-light">
            <div class="feature-icon-box mb-2">
                <i class="bi {{ $f['icon'] }}"></i>
            </div>
            <span class="tiny text-uppercase fw-bold text-muted">{{ $f['label'] }}</span>
            <span class="fw-800 text-dark">{{ $f['value'] }}</span>
        </div>
    </div>
    @endforeach
</div>
