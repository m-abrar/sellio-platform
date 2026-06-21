@php
    $host = $property->user;
    $hostName = $host->name ?? __('Host');
    $hostAvatar = $host->avatar_url ?? 'https://ui-avatars.com/api/?name=' . urlencode($hostName) . '&background=00A896&color=fff&size=80&font-size=0.45';
    $hostReviews = $host?->properties?->flatMap->reviews->count() ?? 0;
    $hostResponseRate = $host->response_rate ?? '98%';
@endphp

<div class="card bg-white border p-4">
    <h4 class="fw-bold mb-3">{{ __('Meet Your Host, :name', ['name' => $hostName]) }}</h4>

    <div class="text-center mb-3 border-bottom pb-3">
        <img src="{{ $hostAvatar }}"
             class="host-profile-avatar rounded-circle mb-2 shadow-sm"
             alt="{{ __('Host: :name', ['name' => $hostName]) }}">

        <h5 class="mb-0 fw-bold">{{ $hostName }}</h5>

        @if ($host->is_superhost ?? false)
            <span class="badge bg-success-subtle text-success fw-semibold mt-1"><i class="bi bi-patch-check-fill me-1"></i>{{ __('Superhost') }}</span>
        @elseif($host?->created_at)
            <p class="small text-muted mb-0">{{ __('Host since :year', ['year' => $host->created_at->format('Y')]) }}</p>
        @endif

        <div class="d-flex justify-content-center gap-4 mt-3 small fw-semibold">
            <span class="text-muted"><i class="bi bi-chat-dots me-1 text-primary"></i> {{ __(':rate Response Rate', ['rate' => $hostResponseRate]) }}</span>
            <span class="text-muted"><i class="bi bi-chat-square-text me-1 text-primary"></i> {{ trans_choice(':count Review|:count Reviews', $hostReviews, ['count' => $hostReviews]) }}</span>
        </div>
    </div>

    <div class="mb-4">
        <h6 class="fw-bold mb-2">{{ __('About :name', ['name' => $hostName]) }}</h6>
        <p class="small text-muted mb-0">
            {{ Str::limit($host->bio ?? __('The host is dedicated to providing five-star stays and local experiences in :city.', ['city' => $property->city]), 150) }}
        </p>
    </div>

    <div class="d-grid gap-2">
        <a href="{{ route('conversation.start', $host) }}" class="btn btn-lg btn-primary">
            <i class="bi bi-envelope-fill me-2"></i>{{ __('Message Host') }}
        </a>

        <a href="{{ route('partner.profile', $host) }}" class="btn btn-lg btn-outline-secondary fw-semibold">
            <i class="bi bi-person-badge me-2"></i>{{ __('View Profile') }}
        </a>
    </div>

    <p class="text-center small text-muted mt-3">{{ __('We protect your personal information.') }}</p>
</div>

<div class="text-center mt-3">
    <button type="button" class="btn btn-link text-danger fw-semibold"><i class="bi bi-heart me-1"></i> {{ __('Save to Wishlist') }}</button>
</div>
