@php
    $totalReviews = $property->reviews->count();
    $averageRating = $totalReviews > 0 ? number_format($property->reviews->avg('rating'), 1) : 0;
@endphp

<div class="card glass-surface p-4 p-lg-5 mt-4 border-0 shadow-sm">
    <div class="row align-items-center mb-5">
        <div class="col-md-auto text-center border-end border-color-light pe-md-5">
            <div class="review-score-big">{{ $averageRating }}</div>
            <div class="mt-2">
                @include('components.rating-stars', ['rating' => $averageRating])
            </div>
            <p class="text-muted small mt-2 mb-0">{{ $totalReviews }} {{ __('Verified Reviews') }}</p>
        </div>
        <div class="col-md ms-md-4 mt-4 mt-md-0">
            <h4 class="fw-800 mb-1">{{ __('Guest Favorites') }}</h4>
            <p class="text-muted mb-0">{{ __('This home is in the top 5% of properties based on ratings, hospitality, and reliability.') }}</p>
        </div>
    </div>

    <div class="row g-4">
        @foreach($property->reviews->take(4) as $review)
            <div class="col-md-6">
                <div class="p-4 rounded-4 bg-glass-light h-100 border border-color-light">
                    <div class="d-flex align-items-center mb-3">
                        <div class="review-avatar avatar-sm me-3 bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold">
                            {{ substr($review->user->name ?? 'G', 0, 1) }}
                        </div>
                        <div>
                            <h6 class="mb-0 fw-bold">{{ $review->user->name ?? __('Verified Guest') }}</h6>
                            <span class="tiny text-muted">{{ $review->created_at->format('M Y') }}</span>
                        </div>
                    </div>
                    <p class="text-muted small mb-0 lh-base italic">"{{ Str::limit($review->comment, 150) }}"</p>
                </div>
            </div>
        @endforeach
    </div>
</div>
