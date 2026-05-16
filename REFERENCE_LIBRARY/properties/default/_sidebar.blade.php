{{-- Host Contact Card (Assumes $property->user relationship is loaded) --}}
@php
    $host = $property->user;
    $hostName = $host->name ?? 'Host';
    $hostAvatar = $host->avatar_url ?? "https://ui-avatars.com/api/?name=" . urlencode($hostName) . "&background=00A896&color=fff&size=80&font-size=0.45";
    
    // Hypothetical Metrics for Richer UI
    $hostReviews = $host->properties->flatMap->reviews->count();
    $hostResponseRate = $host->response_rate ?? '98%'; 
@endphp

<div class="card glass-surface p-4">
    <h4 class="fw-bold mb-3">Meet Your Host, {{ $hostName }}</h4>
    
    <div class="text-center mb-3 border-bottom pb-3">
        {{-- 💡 Alignment: Dynamic image and name --}}
        <img src="{{ $hostAvatar }}" 
             class="rounded-circle mb-2 shadow-sm" 
             style="width: 80px; height: 80px;"
             alt="Host: {{ $hostName }}">

        <h5 class="mb-0 fw-bold">{{ $hostName }}</h5>
        
        {{-- 💡 Alignment: Check for a superhost badge or custom status --}}
        @if ($host->is_superhost ?? false) 
            <span class="badge bg-success-subtle text-success fw-semibold mt-1"><i class="bi bi-patch-check-fill me-1"></i> Superhost</span>
        @else
            <p class="small text-muted mb-0">Host since {{ $host->created_at->format('Y') }}</p> 
        @endif
        
        {{-- Metrics Row for rich UX --}}
        <div class="d-flex justify-content-center gap-4 mt-3 small fw-semibold">
            <span class="text-muted"><i class="bi bi-chat-dots me-1 text-primary-color"></i> {{ $hostResponseRate }} Response Rate</span>
            <span class="text-muted"><i class="bi bi-chat-square-text me-1 text-primary-color"></i> {{ $hostReviews }} Reviews</span>
        </div>
    </div>
    
    {{-- 💡 Alignment: Host Short Bio --}}
    <div class="mb-4">
        <h6 class="fw-bold mb-2">About {{ $hostName }}</h6>
        <p class="small text-muted mb-0">
            {{ Str::limit($host->bio ?? 'The host is dedicated to providing five-star stays and local experiences in ' . $property->city . '.', 150) }}
        </p>
    </div>
    
    <div class="d-grid gap-2">
        {{-- Action 1: Primary Contact --}}
        <a href="{{ route('conversation.start', $host) }}" class="btn btn-lg fw-bold text-white btn-primary-theme">
            <i class="bi bi-envelope-fill me-2"></i>Message Host
        </a>
        
        {{-- Action 2: Secondary View Profile --}}
        <a href="{{ route('partner.profile', $host) }}" class="btn btn-lg fw-bold btn-outline-primary-theme">
            <i class="bi bi-person-badge me-2"></i>View Profile
        </a>
    </div>
    
    <p class="text-center small text-muted mt-3">We protect your personal information.</p>
</div>












{{-- Secondary Action --}}
<div class="text-center mt-3">
    <button class="btn btn-link text-danger fw-semibold"><i class="bi bi-heart me-1"></i> Save to Wishlist</button>
</div>