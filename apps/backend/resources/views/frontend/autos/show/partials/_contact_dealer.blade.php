{{-- Contact Dealer Card (UI/UX Enhanced) --}}
@php
    // Assuming $auto->user is the dealer
    $dealer = $auto->user; 
    $dealerName = $dealer->name ?? 'AutoMax Pro';
    $dealerPhone = $dealer->phone ?? '(555) 987-6543';
    // Removed $dealerEmail as it is no longer used for the CTA
    $dealerLogo = $dealer->logo_url ?? "https://ui-avatars.com/api/?name=" . urlencode($dealerName) . "&background=6366f1&color=fff&size=80&font-size=0.45&bold=true";
    $dealerReviews = $dealer?->reviews ?? collect();
    $dealerRating = $dealerReviews->avg('rating') ?: 0;
    $dealerReviewCount = $dealerReviews->count();
@endphp

<div class="card glass-surface p-4 mt-4">
    <h4 class="fw-bold mb-3">
        <i class="bi bi-person-lines-fill me-2 text-primary-color "></i>
        {{ __('Connect with the Dealer') }}
    </h4>

    <div class="text-center mb-4 border-bottom pb-3">
        {{-- 💡 UX Improvement: Dealer Logo/Avatar for Trust --}}
        <img src="{{ $dealerLogo }}" 
             class="rounded-circle mb-2 border border-3 border-primary-theme shadow-sm" 
             style="width: 70px; height: 70px;"
             alt="Dealer Logo: {{ $dealerName }}">
        
        <h5 class="mb-0 fw-bold mt-2">{{ $dealerName }}</h5>
        <p class="small text-muted mb-1">
            <i class="bi bi-geo-alt-fill me-1"></i> {{ $auto->city ?? __('Local') }} {{ __('Dealership') }}
        </p>

        {{-- 💡 UX Improvement: Display Rating --}}
        <span class="text-warning fw-bold small">
            <i class="bi bi-star-fill"></i> {{ number_format($dealerRating, 1) }} ({{ $dealerReviewCount }} {{ __('reviews') }})
        </span>
    </div>

    {{-- 1. Internal Message Button (PRIMARY CTA - Moved to top) --}}
    <div class="d-grid mb-3">
        @auth
            <a href="{{ route('conversation.start', $dealer) }}"
               class="btn btn-lg fw-bold text-white btn-primary-theme shadow-primary-md">
                <i class="bi bi-chat-dots-fill me-2"></i>{{ __('Send Message') }}
            </a>
        @else
            <a href="{{ route('login') }}"
               class="btn btn-lg fw-bold text-white btn-primary-theme shadow-primary-md">
                <i class="bi bi-chat-dots-fill me-2"></i>{{ __('Sign in to Message') }}
            </a>
        @endauth
    </div>

    {{-- 2. Call Button (SECONDARY CTA - Moved below) --}}
    <div class="d-grid mb-4">
        <a href="tel:{{ $dealerPhone }}" class="btn btn-lg fw-bold btn-outline-info">
            <i class="bi bi-telephone-fill me-2"></i>{{ __('Call :phone', ['phone' => $dealerPhone]) }}
        </a>
    </div>
    
    {{-- Hours/Context --}}
    <div class="text-center small text-muted">
        <p class="mb-0 fw-semibold text-dark">{{ __('Sales Hours') }}</p>
        <p class="mb-0">{{ $dealer->hours ?? 'Mon-Sat: 9 AM - 6 PM PST' }}</p>
    </div>
</div>
