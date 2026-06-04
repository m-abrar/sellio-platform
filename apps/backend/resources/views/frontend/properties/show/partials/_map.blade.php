@if ($property->latitude && $property->longitude)
    
    {{-- Generate a clean Google Maps embed URL using the coordinates --}}
    @php
        $lat = $property->latitude;
        $lng = $property->longitude;
        $map_url = "https://maps.google.com/maps?q={$lat},{$lng}&z=15&output=embed";
    @endphp

    <div class="ratio ratio-16x9 mb-3" style="max-height: 400px; border-radius: var(--bs-card-border-radius);">
        {{-- 💡 Alignment: Dynamic Google Maps iframe --}}
        <iframe src="{{ $map_url }}" 
                frameborder="0" 
                style="border:0; border-radius: var(--bs-card-border-radius);" 
                allowfullscreen="" 
                loading="lazy" 
                referrerpolicy="no-referrer-when-downgrade"
                title="Location map for {{ $property->title }}">
        </iframe>
    </div>
@else
    <p class="text-muted small">{{ __('Location details are not available at this time.') }}</p>
@endif
