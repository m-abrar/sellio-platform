<div class="card event-card border-0 overflow-hidden hover-lift h-100 text-center p-0">
    <div class="position-relative">
        {{-- Cover Image --}}
        <div class="overflow-hidden" style="height: 160px;">
            <img src="{{ $event->primary_image_url }}"
                 class="w-100 h-100 object-fit-cover transition-img"
                 alt="{{ $event->title }}"
                 loading="lazy"
                 onerror="this.onerror=null;this.src='{{ asset('images/fallbacks/default-card.svg') }}';">
        </div>

        {{-- Date Badge --}}
        <div class="position-absolute top-0 start-0 m-3">
            <div class="evc-date-badge">
                <span class="evc-date-day">{{ $event->start_date_time->format('d') }}</span>
                <span class="evc-date-month">{{ $event->start_date_time->format('M') }}</span>
            </div>
        </div>
    </div>

    <div class="card-body p-4 pt-0">
        <div class="mb-3 position-relative z-2" style="margin-top: -32px;">
            <img src="{{ $event->user?->avatar_url }}"
                 class="rounded-circle border border-4 border-white shadow-sm mx-auto object-fit-cover"
                 style="width: 64px; height: 64px;"
                 alt="{{ $event->user?->name }}"
                 title="{{ $event->user?->name }}">
        </div>

        <h6 class="event-card__title text-dark mb-1">{{ $event->title }}</h6>

        <p class="small text-muted mb-3 d-flex align-items-center justify-content-center">
            <i class="bi bi-geo-alt-fill me-1 lc-geo-icon"></i>
            <span class="text-truncate">{{ $event->location?->title ?? __('Online / Global') }}</span>
        </p>

        <div class="d-grid mt-auto">
            <a href="{{ route('events.show', $event->slug) }}" class="btn btn-primary btn-sm btn-header-cta fw-semibold">
                {{ __('View event') }}<i class="bi bi-arrow-right ms-1"></i>
            </a>
        </div>
    </div>
</div>
