@if (!empty($relatedProperties) && $relatedProperties->isNotEmpty())
<div class="mt-5 pb-5">
    <h3 class="fw-800 mb-4 text-dark">{{ __('Similar Discoveries') }}</h3>
    <div class="row g-4">
        @foreach ($relatedProperties->take(3) as $related)
        <div class="col-md-4">
            <div class="card glass-surface border-0 h-100 shadow-sm hover-up rounded-4 overflow-hidden">
                <div class="position-relative">
                    <img src="{{ $related->thumbnail_url }}" class="card-img-top" style="height: 200px; object-fit: cover;">
                    <div class="position-absolute bottom-0 start-0 m-2">
                        <span class="badge bg-white text-dark shadow-sm">{{ $related->city }}</span>
                    </div>
                </div>
                <div class="card-body p-3">
                    <h5 class="fw-800 text-primary mb-1">{{ $related->price }}</h5>
                    <p class="text-dark fw-600 small mb-2 text-truncate">{{ $related->title }}</p>
                    <div class="d-flex gap-3 text-muted small">
                        <span><i class="fa fa-bed me-1"></i>{{ $related->number_of_bedrooms }}</span>
                        <span><i class="fa fa-bath me-1"></i>{{ $related->number_of_bathrooms }}</span>
                    </div>
                </div>
                <a href="{{ route('properties.show', $related->slug) }}" class="stretched-link"></a>
            </div>
        </div>
        @endforeach
    </div>
</div>
@endif