@php
    $totalReviews  = $property->reviews->count();
    $averageRating = $totalReviews > 0 ? $property->reviews->avg('rating') : 0;
@endphp

@if($totalReviews > 0)
<div class="reviews-section mt-4">

    {{-- Section heading --}}
    <h4 class="fw-800 text-dark detail-section-title mb-4">{{ __('Guest Reviews') }}</h4>

    {{-- Rating summary strip --}}
    <div class="reviews-summary">
        <div class="reviews-summary__score">
            <span class="reviews-summary__avg">{{ number_format($averageRating, 1) }}</span>
            <div class="reviews-summary__stars">
                @include('components.rating-stars', ['rating' => $averageRating])
            </div>
            <span class="reviews-summary__count">
                {{ trans_choice(':count review|:count reviews', $totalReviews, ['count' => $totalReviews]) }}
            </span>
        </div>
        <div class="reviews-summary__badge">
            <i class="bi bi-patch-check-fill reviews-summary__badge-icon" aria-hidden="true"></i>
            <div>
                <strong class="reviews-summary__badge-title">{{ __('Guest Favorites') }}</strong>
                <span class="reviews-summary__badge-sub">{{ __('Top 5% for hospitality & reliability') }}</span>
            </div>
        </div>
    </div>

    {{-- Review cards --}}
    <div class="reviews-grid">
        @foreach($property->reviews->take(4) as $review)
            @php
                $reviewerName   = $review->user->name ?? __('Verified Guest');
                $reviewerAvatar = $review->user->avatar_url ?? null;
                $reviewerInitial = strtoupper(substr($reviewerName, 0, 1));
            @endphp
            <div class="review-card">
                <div class="review-card__header">
                    {{-- Avatar: photo if available, else branded initial --}}
                    <div class="review-card__avatar" aria-hidden="true">
                        @if($reviewerAvatar)
                            <img
                                src="{{ $reviewerAvatar }}"
                                alt="{{ $reviewerName }}"
                                class="review-card__avatar-img"
                                onerror="this.parentElement.innerHTML='<span class=\'review-card__avatar-initial\'>{{ $reviewerInitial }}</span>'"
                            >
                        @else
                            <span class="review-card__avatar-initial">{{ $reviewerInitial }}</span>
                        @endif
                    </div>
                    <div class="review-card__meta">
                        <strong class="review-card__name">{{ $reviewerName }}</strong>
                        <span class="review-card__date">{{ $review->created_at->format('M Y') }}</span>
                    </div>
                    @if($review->rating)
                        <div class="review-card__stars ms-auto">
                            @include('components.rating-stars', ['rating' => $review->rating])
                        </div>
                    @endif
                </div>
                <p class="review-card__body">
                    &ldquo;{{ Str::limit($review->comment, 160) }}&rdquo;
                </p>
            </div>
        @endforeach
    </div>

</div>
@endif

@push('styles')
<style>
/* ── Rating summary strip ────────────────────────────────────────── */
.reviews-summary {
    display: flex;
    align-items: stretch;
    background: rgba(248, 246, 243, 0.8);
    border: 1.5px solid rgba(15, 23, 42, 0.07);
    border-radius: 14px;
    overflow: hidden;
    margin-bottom: 20px;
}

.reviews-summary__score {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 5px;
    padding: 22px 30px;
    border-right: 1.5px solid rgba(15, 23, 42, 0.07);
    flex: 0 0 auto;
}

.reviews-summary__avg {
    font-size: 2.6rem;
    font-weight: 800;
    line-height: 1;
    color: var(--primary-color);
}

.reviews-summary__count {
    font-size: 0.72rem;
    font-weight: 700;
    color: #9ca3af;
    letter-spacing: 0.02em;
    margin-top: 2px;
}

.reviews-summary__badge {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 22px 26px;
    flex: 1;
}

.reviews-summary__badge-icon {
    flex: 0 0 auto;
    font-size: 1.8rem;
    color: var(--primary-color);
}

.reviews-summary__badge-title {
    display: block;
    font-size: 1rem;
    font-weight: 800;
    color: var(--text-dark);
    line-height: 1.2;
}

.reviews-summary__badge-sub {
    display: block;
    font-size: 0.78rem;
    font-weight: 500;
    color: #9ca3af;
    margin-top: 3px;
}

/* ── Review cards grid ───────────────────────────────────────────── */
.reviews-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
}

.review-card {
    background: rgba(248, 246, 243, 0.7);
    border: 1.5px solid rgba(15, 23, 42, 0.07);
    border-radius: 16px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 14px;
}

/* ── Avatar ──────────────────────────────────────────────────────── */
.review-card__header {
    display: flex;
    align-items: center;
    gap: 12px;
}

.review-card__avatar {
    flex: 0 0 42px;
    width: 42px;
    height: 42px;
    border-radius: 50%;
    overflow: hidden;
    background: var(--primary-color);
    display: flex;
    align-items: center;
    justify-content: center;
}

.review-card__avatar-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}

.review-card__avatar-initial {
    color: #fff;
    font-size: 0.9rem;
    font-weight: 800;
    line-height: 1;
}

/* ── Meta & stars ────────────────────────────────────────────────── */
.review-card__meta {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
    flex: 1;
}

.review-card__name {
    font-size: 0.88rem;
    font-weight: 800;
    color: var(--text-dark);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.review-card__date {
    font-size: 0.72rem;
    font-weight: 600;
    color: #9ca3af;
}

.review-card__stars {
    flex: 0 0 auto;
}

/* ── Quote ───────────────────────────────────────────────────────── */
.review-card__body {
    font-size: 0.87rem;
    line-height: 1.7;
    color: #64748b;
    margin: 0;
    font-style: italic;
    border-top: 1.5px solid rgba(15, 23, 42, 0.06);
    padding-top: 12px;
}

/* ── Responsive ──────────────────────────────────────────────────── */
@media (max-width: 767.98px) {
    .reviews-summary {
        flex-direction: column;
    }

    .reviews-summary__score {
        border-right: 0;
        border-bottom: 1.5px solid rgba(15, 23, 42, 0.07);
        flex-direction: row;
        justify-content: flex-start;
        gap: 16px;
        padding: 16px 20px;
    }

    .reviews-summary__badge {
        padding: 16px 20px;
    }
}

@media (max-width: 575.98px) {
    .reviews-grid {
        grid-template-columns: 1fr;
    }

    .review-card {
        padding: 16px;
    }
}
</style>
@endpush
