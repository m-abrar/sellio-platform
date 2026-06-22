<div class="d-flex align-items-baseline mb-4">
    <span class="h1 fw-bold me-2" style="color:var(--primary-color)">{{ $rating ?? '4.8' }}</span>
    <span class="text-muted fw-semibold">{{ __('/ 5.0 rating based on :count reviews', ['count' => $reviewCount ?? '120']) }}</span>
</div>

@forelse($reviews ?? [] as $review)
<div class="d-flex mb-4 pb-4 border-bottom">
    <img src="https://ui-avatars.com/api/?name={{ urlencode(substr($review->reviewer_name ?? 'U', 0, 2)) }}&background=E05F2C&color=fff&size=40&font-size=0.45&bold=true"
         class="rounded-circle me-3 flex-shrink-0" alt="{{ $review->reviewer_name ?? 'Reviewer' }}" width="40" height="40">
    <div>
        <h6 class="mb-0 fw-semibold">{{ $review->reviewer_name ?? 'Anonymous' }}</h6>
        <div class="small mb-1" style="color:var(--primary-color)">
            @for($i = 1; $i <= 5; $i++)
                @if(($review->rating ?? 4) >= $i)
                    <i class="bi bi-star-fill"></i>
                @elseif(($review->rating ?? 4) >= $i - 0.5)
                    <i class="bi bi-star-half"></i>
                @else
                    <i class="bi bi-star"></i>
                @endif
            @endfor
        </div>
        <p class="mb-0 small text-muted">"{{ $review->comment ?? '' }}"</p>
    </div>
</div>
@empty
{{-- Fallback placeholder review --}}
<div class="d-flex mb-4 pb-4 border-bottom">
    <img src="https://ui-avatars.com/api/?name=MS&background=E05F2C&color=fff&size=40&font-size=0.45&bold=true"
         class="rounded-circle me-3 flex-shrink-0" alt="Reviewer" width="40" height="40">
    <div>
        <h6 class="mb-0 fw-semibold">Mark S.</h6>
        <div class="small mb-1" style="color:var(--primary-color)">
            <i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-half"></i>
        </div>
        <p class="mb-0 small text-muted">"The atmosphere was incredibly relaxing. Sarah was a fantastic therapist, addressing all my problem areas. Highly recommended!"</p>
    </div>
</div>
@endforelse

<a href="#" class="btn btn-sm btn-link fw-semibold text-primary p-0"><i class="bi bi-chat-left-text me-1"></i> {{ __('View All :count Reviews', ['count' => $reviewCount ?? '0']) }}</a>
