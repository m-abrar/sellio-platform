@if ($property->latitude && $property->longitude)
    @php
        $lat = $property->latitude;
        $lng = $property->longitude;
        $mapUrl = "https://maps.google.com/maps?q={$lat},{$lng}&z=15&output=embed";
    @endphp

    <div class="property-map-frame ratio ratio-16x9 mb-3">
        <iframe
            src="{{ $mapUrl }}"
            class="property-map-frame__embed"
            frameborder="0"
            allowfullscreen=""
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            title="{{ __('Location map for :title', ['title' => $property->title]) }}">
        </iframe>
    </div>
@else
    <p class="text-muted small">{{ __('Location details are not available at this time.') }}</p>
@endif
