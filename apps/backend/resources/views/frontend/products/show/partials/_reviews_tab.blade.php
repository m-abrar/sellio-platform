@php
    $approvedReviews = $product->reviews->where('status', 'approved');
    $approvedCount   = $approvedReviews->count();
    $avgRating       = (float) ($product->reviews_avg_rating ?? 0);
    $avgHalf         = round($avgRating * 2) / 2;
@endphp

<div class="row g-5">

    {{-- ── Rating summary ─────────────────────────────────────── --}}
    <div class="col-md-3">
        <div class="text-center text-md-start">
            <div class="fw-800 text-dark mb-1" style="font-family:var(--font-heading);font-size:clamp(2.8rem,5vw,4rem);line-height:1">
                {{ $avgRating > 0 ? number_format($avgRating, 1) : '—' }}
            </div>
            <div class="d-flex gap-1 mb-1 justify-content-center justify-content-md-start" style="color:var(--primary-color)">
                @for($i = 1; $i <= 5; $i++)
                    <i class="bi bi-star{{ $avgHalf >= $i ? '-fill' : ($avgHalf >= $i - 0.5 ? '-half' : '') }}"></i>
                @endfor
            </div>
            <p class="small text-muted mb-0">
                {{ trans_choice(':count review|:count reviews', $product->reviews_count, ['count' => $product->reviews_count]) }}
            </p>
        </div>
    </div>

    {{-- ── Reviews + write form ────────────────────────────────── --}}
    <div class="col-md-9">

        @forelse($approvedReviews as $review)
            <div class="mb-4 pb-4 border-bottom border-color-light">
                <div class="d-flex align-items-start gap-3">
                    <img src="{{ $review->user?->avatar_url ?? 'https://ui-avatars.com/api/?name='.urlencode($review->user?->name ?? 'U').'&background=E05F2C&color=fff&size=40&bold=true' }}"
                         class="rounded-circle flex-shrink-0 object-fit-cover"
                         width="40" height="40"
                         alt="{{ $review->user?->name }}">
                    <div class="min-w-0 flex-grow-1">
                        <div class="d-flex align-items-center justify-content-between gap-2 flex-wrap mb-1">
                            <span class="fw-semibold text-dark small">{{ $review->user?->name ?? __('Anonymous') }}</span>
                            <span class="small text-muted">{{ $review->created_at->format('M d, Y') }}</span>
                        </div>
                        <div class="d-flex gap-1 mb-2" style="color:var(--primary-color);font-size:.75rem">
                            @for($i = 1; $i <= 5; $i++)
                                <i class="bi bi-star{{ $review->rating >= $i ? '-fill' : '' }}"></i>
                            @endfor
                        </div>
                        <p class="text-muted small lh-lg mb-0">{{ $review->comment }}</p>
                    </div>
                </div>

                {{-- Seller reply --}}
                @if($review->partner_reply)
                    <div class="ms-5 mt-3 p-3 rounded-3"
                         style="background:rgba(248,246,243,.85);border-left:3px solid var(--primary-color)">
                        <p class="small fw-semibold mb-1" style="color:var(--primary-color)">
                            <i class="bi bi-shop me-1"></i>{{ __('Seller response') }}
                            @if($review->partner_replied_at)
                                <span class="fw-normal text-muted ms-2" style="font-size:.7rem">
                                    · {{ $review->partner_replied_at->format('M d, Y') }}
                                </span>
                            @endif
                        </p>
                        <p class="small text-muted mb-0">{{ $review->partner_reply }}</p>
                    </div>
                @endif
            </div>
        @empty
            <div class="text-center py-5">
                <i class="bi bi-chat-square-text display-4 text-muted opacity-25 d-block mb-3"></i>
                <p class="text-muted mb-1">{{ __('No reviews yet.') }}</p>
                <p class="small text-muted mb-0">{{ __('Be the first to share your experience with this product.') }}</p>
            </div>
        @endforelse

        {{-- ── Write a review ──────────────────────────────────── --}}
        <div class="mt-4 pt-4 border-top border-color-light">
            @auth
                <h6 class="fw-800 text-dark mb-4" style="font-family:var(--font-heading)">{{ __('Write a Review') }}</h6>
                <form action="{{ route('reviews.store', ['type' => 'product', 'id' => $product->id]) }}"
                      method="POST"
                      id="review-form">
                    @csrf

                    <div class="mb-4">
                        <label class="form-label small fw-semibold text-muted d-block mb-2">{{ __('Your rating') }}</label>
                        <div class="star-rating d-flex gap-1" id="starRating">
                            @for($i = 1; $i <= 5; $i++)
                                <label class="star-rating__label" for="star{{ $i }}" title="{{ $i }}">
                                    <input class="visually-hidden" type="radio" name="rating" id="star{{ $i }}" value="{{ $i }}" required>
                                    <i class="bi bi-star-fill fs-4" style="color:rgba(15,23,42,.12);transition:color .12s"></i>
                                </label>
                            @endfor
                        </div>
                    </div>

                    <div class="mb-4">
                        <label class="form-label small fw-semibold text-muted" for="reviewComment">{{ __('Your review') }}</label>
                        <textarea id="reviewComment"
                                  name="comment"
                                  class="form-control shadow-none"
                                  rows="4"
                                  maxlength="1000"
                                  placeholder="{{ __('Share your experience with this product…') }}"
                                  required></textarea>
                        <div class="d-flex justify-content-end mt-1">
                            <span id="reviewCharCount" class="small text-muted">0 / 1000</span>
                        </div>
                    </div>

                    <button type="submit" class="btn btn-primary btn-header-cta">
                        <i class="bi bi-send me-2"></i>{{ __('Submit Review') }}
                    </button>
                </form>

                @once
                @push('scripts')
                <script>
                (function () {
                    var stars   = document.querySelectorAll('#starRating .star-rating__label');
                    var inputs  = document.querySelectorAll('#starRating input[type=radio]');
                    var primary = getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim() || '#E05F2C';
                    var dim     = 'rgba(15,23,42,.12)';

                    function paintStars(upTo) {
                        stars.forEach(function (lbl, idx) {
                            lbl.querySelector('i').style.color = idx < upTo ? primary : dim;
                        });
                    }

                    stars.forEach(function (lbl, idx) {
                        lbl.addEventListener('mouseenter', function () { paintStars(idx + 1); });
                        lbl.addEventListener('click',      function () { paintStars(idx + 1); });
                    });
                    document.getElementById('starRating').addEventListener('mouseleave', function () {
                        var checked = document.querySelector('#starRating input:checked');
                        paintStars(checked ? parseInt(checked.value) : 0);
                    });

                    var textarea  = document.getElementById('reviewComment');
                    var charCount = document.getElementById('reviewCharCount');
                    if (textarea && charCount) {
                        textarea.addEventListener('input', function () {
                            charCount.textContent = textarea.value.length + ' / 1000';
                        });
                    }
                })();
                </script>
                @endpush
                @endonce
            @else
                <div class="text-center py-4 rounded-3" style="background:rgba(248,246,243,.7)">
                    <i class="bi bi-person-circle display-6 text-muted opacity-40 d-block mb-2"></i>
                    <p class="text-muted small mb-3">{{ __('Sign in to leave a review') }}</p>
                    <a href="{{ route('login') }}" class="btn btn-primary fw-semibold">
                        <i class="bi bi-box-arrow-in-right me-1"></i>{{ __('Sign in') }}
                    </a>
                </div>
            @endauth
        </div>

    </div>
</div>
