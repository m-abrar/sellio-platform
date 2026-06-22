@php
    $agent = $property->user;
    $agentName = $agent?->name ?? __('Listing Agent');
    $agentPhone = $agent?->phone ?: setting_string('phone_contact', '');
    $agentAvatar = $agent?->avatar_url ?? 'https://ui-avatars.com/api/?name=' . urlencode($agentName) . '&background=E05F2C&color=fff&size=80&font-size=0.45';
    $listingsCount = (int) ($agent?->sale_properties_count ?? $agent?->active_properties_count ?? 0);
    $yearsExperience = $agent?->created_at ? max(1, now()->year - $agent->created_at->year) : null;
@endphp

<div class="card detail-sidebar-card p-4">
    <h4 class="fw-800 mb-3"><i class="bi bi-person-check-fill me-2" style="color:var(--primary-color)"></i>{{ __('Your Dedicated Agent') }}</h4>

    <div class="text-center mb-4 border-bottom pb-4">
        <img src="{{ $agentAvatar }}"
             class="agent-profile-avatar rounded-circle mb-2 border border-3 border-primary-theme shadow-sm"
             alt="{{ __('Agent: :name', ['name' => $agentName]) }}">

        <h5 class="mb-0 fw-semibold mt-2">{{ $agentName }}</h5>
        <p class="small text-muted">{{ $agent?->job_title ?? __('Licensed Real Estate Agent') }}</p>

        <div class="d-flex justify-content-center gap-4 mt-3 small fw-semibold">
            @if($yearsExperience)
                <span class="text-muted" title="{{ __('Years of Experience') }}">
                    <i class="bi bi-award me-1" style="color:var(--primary-color)"></i>
                    {{ trans_choice(':count yr exp|:count yrs exp', $yearsExperience, ['count' => $yearsExperience]) }}
                </span>
            @endif
            <span class="text-muted" title="{{ __('Active Listings') }}">
                <i class="bi bi-building me-1" style="color:var(--primary-color)"></i>
                {{ trans_choice(':count active listing|:count active listings', $listingsCount, ['count' => $listingsCount]) }}
            </span>
        </div>
    </div>

    @if ($agent?->bio)
        <div class="mb-4">
            <h6 class="fw-semibold mb-2" style="color:var(--primary-color)">{{ __('About :name', ['name' => $agentName]) }}</h6>
            <p class="small text-muted mb-0">{{ Str::limit($agent->bio, 150) }}</p>
        </div>
    @endif

    <div class="d-grid gap-2">
        @auth
            @if($agent)
                <a href="{{ route('conversation.start', $agent) }}" class="btn btn-primary btn-header-cta">
                    <i class="bi bi-chat-dots me-2"></i>{{ __('Message agent') }}<i class="bi bi-arrow-right ms-2"></i>
                </a>
            @endif
        @else
            <a href="{{ route('login') }}" class="btn btn-primary btn-header-cta">
                <i class="bi bi-chat-dots me-2"></i>{{ __('Sign in to message') }}<i class="bi bi-arrow-right ms-2"></i>
            </a>
        @endauth

        @if($agentPhone)
            <a href="tel:{{ $agentPhone }}" class="btn btn-outline-secondary fw-semibold">
                <i class="bi bi-telephone me-2"></i>{{ __('Call :phone', ['phone' => $agentPhone]) }}
            </a>
        @endif

        @if($agent)
            <a href="{{ route('partner.profile', $agent) }}" class="btn btn-outline-secondary fw-semibold">
                <i class="bi bi-person-badge me-2"></i>{{ __('View agent profile') }}
            </a>
        @endif
    </div>

    <div class="text-center mt-4">
        <button type="button" class="btn btn-link fw-semibold" style="color:var(--primary-color)" data-property-id="{{ $property->id }}">
            <i class="bi bi-heart me-1"></i>{{ __('Save to favourites') }}
        </button>
    </div>
</div>
