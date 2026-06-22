{{--
    Expects:
    $features -> A collection or array of feature objects/strings
--}}

@if(count($features) > 0)
    <div class="amenities-grid">
        @foreach($features as $feature)
            <div class="amenity-chip">
                <i class="bi bi-check2-circle amenity-chip__icon" aria-hidden="true"></i>
                <span class="amenity-chip__label">{{ is_string($feature) ? $feature : $feature->title }}</span>
            </div>
        @endforeach
    </div>
@else
    <p class="text-muted small fst-italic">{{ __('No specific expertise listed for this service.') }}</p>
@endif
