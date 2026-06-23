{{-- Editorial title block --}}
<header class="property-title-block mb-4">
    @if($event->category)
        <p class="small fw-semibold text-uppercase mb-2" style="letter-spacing:.08em;color:var(--primary-color)">
            <i class="bi bi-calendar3 me-1"></i>{{ $event->category->title }}
        </p>
    @endif
    <h1 class="display-5 text-dark mb-3 tracking-tight lh-sm">{{ $event->title }}</h1>
    @if($event->meta_description || $event->description)
        <p class="lead text-muted mb-0 fs-5">{{ $event->meta_description ?? Str::limit(strip_tags($event->description), 200) }}</p>
    @endif
</header>

{{-- Key facts bar --}}
<div class="property-key-facts d-flex flex-wrap rounded-3 overflow-hidden mb-4" style="background:rgba(248,246,243,.8);border:1.5px solid rgba(15,23,42,.07)">
    <div class="key-fact-item flex-fill text-center px-4 py-3 border-end border-color-light">
        <i class="bi bi-calendar-event key-fact-icon"></i>
        <span class="d-block fw-800 text-dark" style="font-size:.9rem">
            @if(($event->occurrences?->count() ?? 0) > 1)
                {{ $event->occurrences->first()->start_date_time->format('M d') }} – {{ $event->occurrences->last()->start_date_time->format('M d, Y') }}
            @else
                {{ $event->start_date_time->format('M d, Y') }}
            @endif
        </span>
        <span class="small text-muted">{{ ($event->occurrences?->count() ?? 0) > 1 ? __('Date Range') : __('Date') }}</span>
    </div>
    <div class="key-fact-item flex-fill text-center px-4 py-3 border-end border-color-light">
        <i class="bi bi-clock key-fact-icon"></i>
        <span class="d-block fw-800 text-dark" style="font-size:.9rem">{{ $event->start_date_time->format('g:i A') }}</span>
        <span class="small text-muted">{{ __('Starts At') }}</span>
    </div>
    <div class="key-fact-item flex-fill text-center px-4 py-3 border-end border-color-light">
        <i class="bi bi-{{ $event->is_virtual ? 'laptop' : 'geo-alt-fill' }} key-fact-icon"></i>
        <span class="d-block fw-800 text-dark" style="font-size:.9rem">
            {{ $event->is_virtual ? __('Online') : ($event->location?->title ?? $event->city) }}
        </span>
        <span class="small text-muted">{{ __('Venue') }}</span>
    </div>
    <div class="key-fact-item flex-fill text-center px-4 py-3">
        @php $availColor = ($tickets_left > 0 && $tickets_left < 10) ? 'var(--primary-color)' : 'var(--text-dark)'; @endphp
        <i class="bi bi-ticket-perforated key-fact-icon"></i>
        <span class="d-block fw-800" style="font-size:.9rem;color:{{ $availColor }}">
            {{ $tickets_left > 0 ? $tickets_left . ' ' . __('left') : __('Sold Out') }}
        </span>
        <span class="small text-muted">{{ __('Availability') }}</span>
    </div>
</div>

{{-- Main content card --}}
<div class="detail-main-card border-0 overflow-hidden mb-4">
    <div class="p-4 p-lg-5">

        <section class="mb-5">
            <h4 class="fw-800 mb-4 text-dark detail-section-title">
                <i class="bi bi-body-text me-2" style="color:var(--primary-color);font-size:.85em" aria-hidden="true"></i>{{ __('Event Overview') }}
            </h4>
            <div class="event-description text-muted lh-lg">
                {!! nl2br(e($event->description)) !!}
            </div>
        </section>

        @if($event->schedule_items && $event->schedule_items->count() > 0)
            <section class="mb-5 pt-4 border-top border-color-light">
                <h4 class="fw-800 mb-4 text-dark detail-section-title">
                    <i class="bi bi-clock-history me-2" style="color:var(--primary-color);font-size:.85em" aria-hidden="true"></i>{{ __('Program Schedule') }}
                </h4>
                <div class="schedule-timeline ms-2">
                    @foreach($event->schedule_items as $item)
                        <div class="schedule-item">
                            <span class="fw-800 d-block mb-1 small" style="color:var(--primary-color)">{{ $item->time_slot }}</span>
                            <h6 class="fw-bold mb-1 text-dark">{{ $item->title }}</h6>
                            <p class="small text-muted mb-0">{{ $item->description }}</p>
                        </div>
                    @endforeach
                </div>
            </section>
        @endif

        @if($event->speakers && $event->speakers->count() > 0)
            <section class="mb-5 pt-4 border-top border-color-light">
                <h4 class="fw-800 mb-4 text-dark detail-section-title">
                    <i class="bi bi-mic-fill me-2" style="color:var(--primary-color);font-size:.85em" aria-hidden="true"></i>{{ __('Featured Speakers') }}
                </h4>
                <div class="row g-3">
                    @foreach($event->speakers as $speaker)
                        <div class="col-md-6">
                            <div class="d-flex align-items-center gap-3 p-3 rounded-3 h-100"
                                 style="background:rgba(248,246,243,.7);border:1.5px solid rgba(15,23,42,.07)">
                                <img src="{{ $speaker->avatar_url }}"
                                     class="rounded-3 flex-shrink-0 object-fit-cover"
                                     width="60" height="60"
                                     alt="{{ $speaker->name }}">
                                <div class="min-w-0">
                                    <h6 class="fw-bold mb-0 text-dark lh-sm">{{ $speaker->name }}</h6>
                                    <p class="small text-muted mb-0 mt-1">{{ $speaker->designation }}</p>
                                </div>
                            </div>
                        </div>
                    @endforeach
                </div>
            </section>
        @endif

        @unless($event->is_virtual)
            <section class="pt-4 border-top border-color-light">
                <h4 class="fw-800 mb-4 text-dark detail-section-title">
                    <i class="bi bi-pin-map-fill me-2" style="color:var(--primary-color);font-size:.85em" aria-hidden="true"></i>{{ __('Venue Information') }}
                </h4>
                <div class="detail-sidebar-card p-4 mb-4">
                    <div class="row align-items-center">
                        <div class="col-md-7">
                            <h5 class="fw-bold text-dark">{{ $event->location?->title ?? __('Event Venue') }}</h5>
                            <p class="text-muted mb-0">
                                {{ $event->address }}, {{ $event->city }}, {{ $event->zip_code }}<br>
                                <span class="fw-semibold">{{ $event->country }}</span>
                            </p>
                        </div>
                        <div class="col-md-5 text-md-end mt-3 mt-md-0">
                            <a href="https://www.google.com/maps/dir/?api=1&destination={{ $event->latitude }},{{ $event->longitude }}"
                               target="_blank"
                               class="btn btn-outline-secondary fw-semibold px-4 rounded-2">
                                <i class="bi bi-signpost-split me-1"></i>{{ __('Get Directions') }}
                            </a>
                        </div>
                    </div>
                </div>

                @if($event->latitude && $event->longitude)
                    <div class="ratio ratio-21x9 rounded-4 overflow-hidden border">
                        <iframe
                            src="https://maps.google.com/maps?q={{ $event->latitude }},{{ $event->longitude }}&hl=es;z=14&output=embed"
                            class="border-0" allowfullscreen="" loading="lazy"></iframe>
                    </div>
                @endif
            </section>
        @endunless

    </div>
</div>
