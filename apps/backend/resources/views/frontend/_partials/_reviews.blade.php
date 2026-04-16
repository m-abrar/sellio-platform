<div class="p-2 mt-4" data-aos="fade-up">
    <h5 class="fw-800 mb-4 d-flex align-items-center">
        <i class="bi bi-chat-square-quote me-2 text-primary"></i> 
        {{ __('Community Reviews') }}
        <span class="ms-auto badge bg-primary-subtle text-primary rounded-pill fs-7">
            {{ $reviewable->reviews->count() }}
        </span>
    </h5>

    {{-- Rating Summary --}}
    <div class="row align-items-center mb-5 bg-light rounded-4 p-4 g-3">
        <div class="col-md-auto text-center border-end-md px-4">
            @php $averageRating = $reviewable->reviews->avg('rating') ?? 0; @endphp
            <h2 class="display-4 fw-800 text-dark mb-0">{{ number_format($averageRating, 1) }}</h2>
            <div class="text-warning fs-5">
                @for ($i = 1; $i <= 5; $i++)
                    <i class="bi bi-star{{ $i <= round($averageRating) ? '-fill' : '' }}"></i>
                @endfor
            </div>
            <p class="text-muted small mb-0 mt-1">{{ __('Average Rating') }}</p>
        </div>
        <div class="col-md px-md-4">
            {{-- Simplified Rating Bars --}}
            @foreach(range(5, 1) as $stars)
                @php 
                    $count = $reviewable->reviews->where('rating', $stars)->count();
                    $percent = $reviewable->reviews->count() > 0 ? ($count / $reviewable->reviews->count()) * 100 : 0;
                @endphp
                <div class="d-flex align-items-center mb-1">
                    <span class="small fw-600 text-muted me-2" style="width: 20px;">{{ $stars }}</span>
                    <div class="progress flex-grow-1 rounded-pill" style="height: 6px;">
                        <div class="progress-bar bg-warning" style="width: {{ $percent }}%"></div>
                    </div>
                    <span class="small text-muted ms-2" style="width: 30px;">{{ $count }}</span>
                </div>
            @endforeach
        </div>
    </div>

    {{-- Review List --}}
    <div class="review-list">
        @forelse($reviewable->reviews as $review)
            <div class="review-item pb-4 mb-4 {{ !$loop->last ? 'border-bottom' : '' }}">
                <div class="d-flex justify-content-between align-items-start mb-2">
                    <div class="d-flex align-items-center">
                        <div class="avatar-sm bg-primary-subtle rounded-circle d-flex align-items-center justify-content-center me-3 fw-800 text-primary">
                            {{ strtoupper(substr($review->user->name ?? 'A', 0, 1)) }}
                        </div>
                        <div>
                            <h6 class="mb-0 fw-800">{{ $review->user->name ?? __('Anonymous') }}</h6>
                            <small class="text-muted">{{ $review->created_at->diffForHumans() }}</small>
                        </div>
                    </div>
                    <div class="text-warning small">
                        @for ($i = 1; $i <= 5; $i++)
                            <i class="bi bi-star{{ $i <= $review->rating ? '-fill' : '' }}"></i>
                        @endfor
                    </div>
                </div>
                <p class="text-muted mb-0 ps-5 ms-2 lh-base italic">
                    "{{ $review->comment ?? __('No comments provided.') }}"
                </p>
            </div>
        @empty
            <div class="text-center py-4">
                <i class="bi bi-chat-left-dots display-4 text-light"></i>
                <p class="text-muted mt-2">{{ __('Be the first to share your experience!') }}</p>
            </div>
        @endforelse
    </div>

    {{-- Form Section --}}
    @auth
        @if(!$reviewable->reviews->where('user_id', auth()->id())->first())
            <div class="mt-4 p-4 border rounded-5 bg-white shadow-sm">
                <h6 class="fw-800 mb-3">{{ __('Write a Review') }}</h6>
                <form action="{{ route('reviews.store', ['type' => $type, 'id' => $reviewable->id]) }}" method="POST">
                    @csrf
                    <div class="mb-3">
                        <label class="form-label small fw-800 text-muted uppercase tracking-wider">{{ __('Your Rating') }}</label>
                        <div class="star-rating d-flex gap-2 fs-3 text-muted">
                            @for($i=1; $i<=5; $i++)
                                <input type="radio" name="rating" id="star{{ $i }}" value="{{ $i }}" class="btn-check" required>
                                <label for="star{{ $i }}" class="bi bi-star cursor-pointer transition-all"></label>
                            @endfor
                        </div>
                        @error('rating') <small class="text-danger">{{ $message }}</small> @enderror
                    </div>

                    <div class="form-group mb-3">
                        <textarea name="comment" class="form-control rounded-4 p-3 border-light bg-light" rows="3" placeholder="{{ __('Describe your experience...') }}" required></textarea>
                    </div>

                    <button type="submit" class="btn btn-primary rounded-pill px-5 fw-800 hover-lift">
                        {{ __('Post Review') }}
                    </button>
                </form>
            </div>
        @endif
    @else
        <div class="alert bg-light border-1 text-center mt-4">
            <p class="mb-2 small">{{ __('Logged in users can leave verified reviews.') }}</p>
            <a href="{{ route('login') }}" class="btn btn-sm btn-dark rounded-pill px-4">{{ __('Login Now') }}</a>
        </div>
    @endauth
</div>
