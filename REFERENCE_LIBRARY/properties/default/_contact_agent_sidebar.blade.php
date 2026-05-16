{{-- Contact Agent Card (Assumes $property->user is the listing agent/partner) --}}
@php
    $agent = $property->user; 
    $agentName = $agent->name ?? 'Listing Agent';
    $agentPhone = $agent->phone ?? setting('phone_contact', 'N/A');
    $agentAvatar = $agent->avatar_url ?? "https://ui-avatars.com/api/?name=" . urlencode($agentName) . "&background=6366f1&color=fff&size=80&font-size=0.45";
    
    // Hypothetical Metrics for Richer UI
    $listingsCount = $agent->properties->where('is_sale', true)->where('is_published', true)->count() ?? 1;
    $yearsExperience = $agent->years_experience ?? (now()->year - $agent->created_at->year);
@endphp

<div class="card glass-surface p-4 shadow-lg">
    <h4 class="fw-bold mb-3"><i class="bi bi-person-check-fill me-2 text-primary-color"></i>Your Dedicated Agent</h4>
    
    <div class="text-center mb-4 border-bottom pb-4">
        <img src="{{ $agentAvatar }}" 
             class="rounded-circle mb-2 border border-3 border-primary-theme shadow-sm" 
             style="width: 90px; height: 90px;"
             alt="Agent: {{ $agentName }}">
        
        <h5 class="mb-0 fw-bold mt-2">{{ $agentName }}</h5>
        <p class="small text-muted">{{ $agent->name ?? 'Licensed Real Estate Agent' }}</p>
        
        {{-- Agent Metrics --}}
        <div class="d-flex justify-content-center gap-4 mt-3 small fw-semibold">
            <span class="text-muted" title="Years of Experience"><i class="bi bi-award me-1 text-primary-color"></i> {{ $yearsExperience }} Yrs Exp</span>
            <span class="text-muted" title="Active Listings"><i class="bi bi-building me-1 text-primary-color"></i> {{ $listingsCount }} Active Listings</span>
        </div>
    </div>
    
    {{-- 💡 Alignment: Short Bio Section --}}
    @if ($agent->bio ?? false)
        <div class="mb-4">
            <h6 class="fw-bold mb-2 text-primary-color">A Little About {{ $agentName }}</h6>
            <p class="small text-muted mb-0">
                {{ Str::limit($agent->bio, 150) }}
            </p>
        </div>
    @endif
    
    <div class="d-grid gap-2">
        {{-- Primary CTA: Message Agent (Lead capture) --}}
        <a href="{{ route('conversation.start', $agent) }}" class="btn btn-lg fw-bold text-white btn-primary-theme">
            <i class="bi bi-chat-dots me-2"></i>Message Agent Now
        </a>
    </div>
    
    <div class="d-grid gap-2 mt-2 mb-4">
        {{-- Secondary CTA: Call Agent --}}
        <a href="tel:{{ $agentPhone }}" class="btn btn-lg btn-outline-secondary fw-bold">
            <i class="bi bi-telephone me-2"></i>Call {{ $agentPhone }}
        </a>
        
        {{-- Tertiary CTA: Schedule Showing --}}
        <a href="{{ route('conversation.start', $property->user) }}" class="btn btn-lg btn-outline-info fw-bold">
            <i class="bi bi-calendar-event me-2"></i>Schedule a Showing
        </a>
    </div>

    <div class="text-center small text-muted">
        <a href="{{ route('partner.profile', $agent) }}" class="text-decoration-none fw-semibold text-primary-color">
            View Agent's Full Profile
        </a>
    </div>
</div>






{{-- Secondary Action (Save to Favorites) --}}
<div class="text-center mt-3">
    <button class="btn btn-link text-danger fw-semibold" data-property-id="{{ $property->id }}">
        <i class="bi bi-heart me-1"></i> Save to Favorites
    </button>
</div>