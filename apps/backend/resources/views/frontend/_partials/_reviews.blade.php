<div class="pt-2" data-aos="fade-up">
    <div class="d-flex align-items-center mb-4">
        <h4 class="fw-800 mb-0">
            <i class="bi bi-chat-square-quote-fill me-2" style="color:var(--primary-color)"></i>{{ __('Community Reviews') }}
        </h4>
        <span class="ms-3 badge rounded-pill fw-semibold" style="background:rgba(var(--primary-color-rgb),.1);color:var(--primary-color)">
            {{ $reviewable->reviews->count() }}
        </span>
    </div>

    {{-- Rating Summary --}}
    <div class="row align-items-center mb-5 g-3 p-4 rounded-4" style="background:rgba(248,246,243,.9);border:1.5px solid rgba(15,23,42,.07)">
        <div class="col-md-auto text-center px-4">
            @php $averageRating = $reviewable->reviews->avg('rating') ?? 0; @endphp
            <h2 class="display-4 fw-800 text-dark mb-0">{{ number_format($averageRating, 1) }}</h2>
            <div class="fs-5 my-1" style="color:var(--primary-color)">
                @for ($i = 1; $i <= 5; $i++)
                    <i class="bi bi-star{{ $i <= round($averageRating) ? '-fill' : '' }}"></i>
                @endfor
            </div>
            <p class="text-muted small mb-0">{{ __('Average Rating') }}</p>
        </div>
        <div class="col-md px-md-4">
            @foreach(range(5, 1) as $stars)
                @php
                    $count = $reviewable->reviews->where('rating', $stars)->count();
                    $percent = $reviewable->reviews->count() > 0 ? ($count / $reviewable->reviews->count()) * 100 : 0;
                @endphp
                <div class="d-flex align-items-center mb-1">
                    <span class="small fw-semibold text-muted me-2" style="width:20px">{{ $stars }}</span>
                    <div class="progress flex-grow-1 rounded-pill" style="height:6px;background:rgba(15,23,42,.08)">
                        <div class="progress-bar rounded-pill" style="width:{{ $percent }}%;background:var(--primary-color)"></div>
                    </div>
                    <span class="small text-muted ms-2" style="width:30px">{{ $count }}</span>
                </div>
            @endforeach
        </div>
    </div>

    {{-- Review List --}}
    <div class="review-list">
        @forelse($reviewable->reviews as $review)
            <div class="review-item pb-4 mb-4 {{ !$loop->last ? 'border-bottom' : '' }}" style="border-color:rgba(15,23,42,.07)!important">
                <div class="d-flex justify-content-between align-items-start mb-3">
                    <div class="d-flex align-items-center">
                        <div class="rounded-circle d-flex align-items-center justify-content-center me-3 fw-800 text-white flex-shrink-0"
                             style="width:40px;height:40px;background:var(--primary-color);font-size:.9rem">
                            {{ strtoupper(substr($review->user->name ?? 'A', 0, 1)) }}
                        </div>
                        <div>
                            <h6 class="mb-0 fw-800 text-dark">{{ $review->user->name ?? __('Anonymous') }}</h6>
                            <small class="text-muted">{{ $review->created_at->diffForHumans() }}</small>
                        </div>
                    </div>
                    <div class="small" style="color:var(--primary-color)">
                        @for ($i = 1; $i <= 5; $i++)
                            <i class="bi bi-star{{ $i <= $review->rating ? '-fill' : '' }}"></i>
                        @endfor
                    </div>
                </div>
                <p class="text-muted mb-0 ps-5 ms-1 lh-base fst-italic">
                    "{{ $review->comment ?? __('No comments provided.') }}"
                </p>
            </div>
        @empty
            <div class="text-center py-5">
                <i class="bi bi-chat-left-dots display-4 d-block mb-2" style="color:rgba(var(--primary-color-rgb),.2)"></i>
                <p class="text-muted mb-0">{{ __('Be the first to share your experience!') }}</p>
            </div>
        @endforelse
    </div>

    {{-- Write a Review Form --}}
    @auth
        @if(!$reviewable->reviews->where('user_id', auth()->id())->first())
            <div class="p-4 rounded-4 mt-4" style="background:rgba(248,246,243,.8);border:1.5px solid rgba(15,23,42,.07)">
                <h6 class="fw-800 mb-4">{{ __('Write a Review') }}</h6>
                <form action="{{ route('reviews.store', ['type' => $type, 'id' => $reviewable->id]) }}" method="POST">
                    @csrf
                    <div class="mb-3">
                        <label class="form-label small fw-semibold text-muted">{{ __('Your Rating') }}</label>
                        <div class="star-rating d-flex gap-2 fs-3" style="color:rgba(15,23,42,.2)">
                            @for($i=1; $i<=5; $i++)
                                <input type="radio" name="rating" id="star{{ $i }}" value="{{ $i }}" class="btn-check" required>
                                <label for="star{{ $i }}" class="bi bi-star cursor-pointer transition-all"></label>
                            @endfor
                        </div>
                        @error('rating') <small class="text-danger">{{ $message }}</small> @enderror
                    </div>

                    <div class="mb-3">
                        <textarea name="comment" class="form-control rounded-3 p-3" rows="3"
                                  placeholder="{{ __('Describe your experience...') }}" required
                                  style="border:1.5px solid rgba(15,23,42,.12);background:#fff"></textarea>
                    </div>

                    <button type="submit" class="btn btn-primary btn-header-cta">
                        <i class="bi bi-send-fill me-2"></i>{{ __('Post Review') }}<i class="bi bi-arrow-right ms-2"></i>
                    </button>
                </form>
            </div>
        @endif
    @else
        <div class="p-4 rounded-4 text-center mt-4" style="background:rgba(var(--primary-color-rgb),.05);border:1.5px solid rgba(var(--primary-color-rgb),.15)">
            <p class="mb-3 small text-muted">{{ __('Logged in users can leave verified reviews.') }}</p>
            <a href="{{ route('login') }}" class="btn btn-primary btn-header-cta">
                <i class="bi bi-box-arrow-in-right me-2"></i>{{ __('Login Now') }}<i class="bi bi-arrow-right ms-2"></i>
            </a>
        </div>
    @endauth
</div>
