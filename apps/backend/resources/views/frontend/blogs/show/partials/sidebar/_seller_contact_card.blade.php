<div class="card detail-sidebar-card p-4 mb-4">
    <h5 class="fw-bold mb-3"><i class="bi bi-person-circle me-2"></i>Seller Details</h5>

    {{-- Seller Avatar --}}
    <div class="d-flex align-items-center mb-3">
        <img src="{{ $seller->avatar_url ?? asset('images/default-avatar.png') }}" 
             alt="{{ $seller->title ?? 'Seller' }} Avatar" 
             class="rounded-circle me-3" 
             class="object-fit-cover" style="width: 60px; height: 60px;">
        <div>
            <p class="fs-4 fw-bold mb-0">{{ $seller->title ?? 'Private Seller' }}</p>
            <p class="text-muted small mb-0">Member Since {{ $seller->created_at->format('F Y') }}</p>
        </div>
    </div>
    
    <hr class="mt-0">

    {{-- Seller Rating and Reviews --}}
    @php
        // The controller should ensure the 'reviews' relationship is loaded on the User model
        $avgRating = $seller->reviews()->avg('rating');
        $reviewCount = $seller->reviews()->count();
    @endphp
    
    @if ($reviewCount > 0)
        <div class="d-flex align-items-center mb-3">
            <span class="text-warning me-2">
                @for ($i = 1; $i <= 5; $i++)
                    <i class="bi bi-star{{ $i <= round($avgRating) ? '-fill' : '' }}"></i>
                @endfor
            </span>
            <span class="small text-muted">({{ $reviewCount }} Reviews)</span>
        </div>
    @else
        <p class="small text-info mb-3"><i class="bi bi-info-circle me-1"></i> No public reviews yet.</p>
    @endif
    
    {{-- Action Buttons --}}
    
    {{-- Use route('conversation.start') for the Send Message button --}}
    <a href="{{ route('conversation.start', $seller) }}" class="btn btn-lg btn-primary mb-2">
        <i class="bi bi-chat-dots me-2"></i>Send Message
    </a>

    {{-- View Profile Button --}}
    <a href="{{ route('partner.profile', $seller) }}" class="btn btn-sm btn-outline-secondary">
        View Profile
    </a>
</div>
