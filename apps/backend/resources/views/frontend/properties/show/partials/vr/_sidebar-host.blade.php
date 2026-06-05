@php
    $host = $property->user;
    $hostName = $host?->name ?? __('Host');
    $hostAvatar = $host?->avatar_url ?? 'https://ui-avatars.com/api/?name=' . urlencode($hostName) . '&background=00A896&color=fff&size=80&font-size=0.45';
    $hostListings = (int) ($host?->active_properties_count ?? 0);
    $hostResponseRate = $host?->response_rate ?? null;
@endphp

<div class="card glass-surface p-4">
    <h4 class="fw-bold mb-3">{{ __('Meet Your Host, :name', ['name' => $hostName]) }}</h4>

    <div class="text-center mb-3 border-bottom pb-3">
        <img src="{{ $hostAvatar }}"
             class="host-profile-avatar rounded-circle mb-2 shadow-sm"
             alt="{{ __('Host: :name', ['name' => $hostName]) }}">

        <h5 class="mb-0 fw-bold">{{ $hostName }}</h5>

        @if ($host?->is_superhost)
            <span class="badge bg-success-subtle text-success fw-semibold mt-1"><i class="bi bi-patch-check-fill me-1"></i>{{ __('Superhost') }}</span>
        @elseif($host?->created_at)
            <p class="small text-muted mb-0">{{ __('Host since :year', ['year' => $host->created_at->format('Y')]) }}</p>
        @endif

        <div class="d-flex justify-content-center gap-4 mt-3 small fw-semibold">
            @if($hostResponseRate)
                <span class="text-muted"><i class="bi bi-chat-dots me-1 text-primary-color"></i> {{ __(':rate response rate', ['rate' => $hostResponseRate]) }}</span>
            @endif
            <span class="text-muted"><i class="bi bi-building me-1 text-primary-color"></i> {{ trans_choice(':count listing|:count listings', $hostListings, ['count' => $hostListings]) }}</span>
        </div>
    </div>

    <div class="mb-4">
        <h6 class="fw-bold mb-2">{{ __('About :name', ['name' => $hostName]) }}</h6>
        <p class="small text-muted mb-0">
            {{ Str::limit($host?->bio ?? __('The host is dedicated to providing thoughtful stays and local experiences in :city.', ['city' => $property->city]), 150) }}
        </p>
    </div>

    <div class="d-grid gap-2">
        @auth
            @if($host)
                <a href="{{ route('conversation.start', $host) }}" class="btn btn-lg fw-bold text-white btn-primary-theme">
                    <i class="bi bi-envelope-fill me-2"></i>{{ __('Message Host') }}
                </a>
            @endif
        @else
            <a href="{{ route('login') }}" class="btn btn-lg fw-bold text-white btn-primary-theme">
                <i class="bi bi-envelope-fill me-2"></i>{{ __('Sign in to Message Host') }}
            </a>
        @endauth

        @if($host)
            <a href="{{ route('partner.profile', $host) }}" class="btn btn-lg fw-bold btn-outline-primary-theme">
                <i class="bi bi-person-badge me-2"></i>{{ __('View Profile') }}
            </a>
        @endif
    </div>

    <p class="text-center small text-muted mt-3">{{ __('We protect your personal information.') }}</p>
</div>
