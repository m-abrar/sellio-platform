<div class="d-flex align-items-baseline mb-3">
    <span class="h1 fw-bold text-warning me-2">{{ $rating ?? '4.8' }}</span>
    <span class="text-muted fw-semibold">/ 5.0 rating based on {{ $reviewCount ?? '120' }} reviews</span>
</div>

{{-- Single Review Example --}}
<div class="d-flex mb-3 pb-3 border-bottom">
    <img src="https://ui-avatars.com/api/?name=MS&background=d1d5db&color=fff&size=40" class="rounded-circle me-3" alt="Reviewer" width="40" height="40">
    <div>
        <h6 class="mb-0 fw-semibold">Mark S.</h6>
        <div class="small text-warning mb-1">
            <i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-half"></i>
        </div>
        <p class="mb-0 small">"The atmosphere was incredibly relaxing. Sarah was a fantastic therapist, addressing all my problem areas. Highly recommended!"</p>
    </div>
</div>

<a href="#" class="btn btn-sm btn-link fw-semibold text-primary-color"><i class="bi bi-chat-left-text me-1"></i> View All {{ $reviewCount ?? '0' }} Reviews</a>
