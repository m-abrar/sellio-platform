<div class="card glass-surface border-0 rounded-5 overflow-hidden hover-lift h-100 text-center p-0 shadow-sm">
    <div class="position-relative">
        {{-- Event Cover Image --}}
        <div class="overflow-hidden" style="height: 160px;">
            <img src="{{ $event->primary_image_url }}"
                 class="w-100 h-100 object-fit-cover transition-img"
                 alt="{{ $event->title }}"
                 loading="lazy"
                 onerror="this.onerror=null;this.src='{{ asset('images/fallbacks/default-card.svg') }}';">
        </div>

        {{-- Date Badge Overlay --}}
        <div class="position-absolute top-0 start-0 m-3">
            <div class="bg-white rounded-4 px-2 py-1 text-center shadow-sm border border-white" style="min-width: 50px;">
                <span class="d-block fw-800 text-primary fs-5 lh-1">{{ $event->start_date_time->format('d') }}</span>
                <span class="small fw-800 text-uppercase text-muted" style="font-size: 0.6rem;">{{ $event->start_date_time->format('M') }}</span>
            </div>
        </div>
    </div>

    <div class="card-body p-4 pt-0">
        <div class="mb-3 position-relative z-2" style="margin-top: -32px;">
            <img src="{{ $event->user?->avatar_url }}"
                 class="rounded-circle border border-4 border-white shadow-sm mx-auto"
                 style="width: 64px; height: 64px; object-fit: cover;"
                 alt="{{ $event->user?->name }}"
                 title="{{ $event->user?->name }}">
        </div>

        <h6 class="fw-800 text-dark mb-1 text-truncate-2" style="height: 2.8rem; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">
            {{ $event->title }}
        </h6>

        <p class="small text-muted mb-3 d-flex align-items-center justify-content-center">
            <i class="bi bi-geo-alt-fill text-danger me-1"></i>
            <span class="text-truncate">{{ $event->location?->title ?? __('Online / Global') }}</span>
        </p>

        <div class="d-grid mt-auto">
            <a href="{{ route('events.show', $event->slug) }}" class="btn btn-primary btn-sm rounded-pill fw-800 py-2 shadow-sm">
                {{ __('Interested') }}
            </a>
        </div>
    </div>
</div>
