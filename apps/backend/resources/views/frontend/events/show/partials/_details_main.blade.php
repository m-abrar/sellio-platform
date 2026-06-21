<div class="detail-main-card p-0 border-0 overflow-hidden">
    @include('frontend.events.show.partials._gallery')

    <div class="px-4 px-lg-5 pb-5 pt-4">
        <div class="mb-4">
            @if($event->category)
                <span class="badge bg-light-primary text-primary mb-2 px-3 py-2 rounded-2 fw-semibold">
                    <i class="bi bi-tag-fill me-1"></i>{{ $event->category->title }}
                </span>
            @endif
            <h1 class="fw-800 display-6 text-dark mb-3">{{ $event->title }}</h1>
            <p class="lead text-muted mb-0">
                {{ $event->meta_description ?? Str::limit($event->description, 180) }}
            </p>
        </div>

        <div class="row g-3 mb-5">
            <div class="col-md-4">
                <div class="detail-metric-card h-100">
                    <i class="bi bi-calendar-event text-primary fs-4 d-block mb-2"></i>
                    <span class="fw-800 d-block text-dark">
                        @if($event->occurrences && $event->occurrences->count() > 1)
                            {{ $event->occurrences->first()->start_date_time->format('M d') }} - {{ $event->occurrences->last()->start_date_time->format('M d, Y') }}
                        @else
                            {{ $event->start_date_time->format('F d, Y') }}
                        @endif
                    </span>
                    <span class="metric-label mb-0">
                        {{ $event->occurrences->count() > 1 ? __('Multi-Day Event') : __('Date & Time') }}
                    </span>
                </div>
            </div>

            <div class="col-md-4">
                <div class="detail-metric-card h-100">
                    <i class="bi bi-geo-alt text-primary fs-4 d-block mb-2"></i>
                    <span class="fw-800 d-block text-dark">
                        @if($event->is_virtual)
                            {{ __('Virtual Event') }}
                        @else
                            {{ $event->location->title ?? $event->city }}
                        @endif
                    </span>
                    <span class="metric-label mb-0">{{ __('Venue') }}</span>
                </div>
            </div>

            <div class="col-md-4">
                <div class="detail-metric-card h-100">
                    <i class="bi bi-ticket-perforated text-primary fs-4 d-block mb-2"></i>
                    <span class="fw-800 d-block {{ $tickets_left < 10 ? 'text-danger' : 'text-dark' }}">
                        {{ $tickets_left > 0 ? $tickets_left . ' ' . __('Seats Left') : __('Sold Out!') }}
                    </span>
                    <span class="metric-label mb-0">{{ __('Availability') }}</span>
                </div>
            </div>
        </div>

        <section class="mb-5">
            <h4 class="fw-800 mb-4 text-dark detail-section-title">{{ __('Event Overview') }}</h4>
            <div class="event-description text-muted lh-lg">
                {!! nl2br(e($event->description)) !!}
            </div>
        </section>

        @if($event->schedule_items && $event->schedule_items->count() > 0)
            <section class="mb-5">
                <h4 class="fw-800 mb-4 text-dark detail-section-title">
                    <i class="bi bi-clock-history me-2 text-primary"></i>{{ __('Program Schedule') }}
                </h4>
                <div class="schedule-timeline ms-2">
                    @foreach($event->schedule_items as $item)
                        <div class="schedule-item">
                            <span class="fw-800 text-primary smaller text-uppercase d-block mb-1">{{ $item->time_slot }}</span>
                            <h6 class="fw-bold mb-1 text-dark">{{ $item->title }}</h6>
                            <p class="small text-muted mb-0">{{ $item->description }}</p>
                        </div>
                    @endforeach
                </div>
            </section>
        @endif

        @if($event->speakers && $event->speakers->count() > 0)
            <section class="mb-5">
                <h4 class="fw-800 mb-4 text-dark detail-section-title">
                    <i class="bi bi-mic-fill me-2 text-primary"></i>{{ __('Featured Speakers') }}
                </h4>
                <div class="row row-cols-2 row-cols-md-4 g-4">
                    @foreach($event->speakers as $speaker)
                        <div class="col text-center">
                            <div class="speaker-card p-3 detail-sidebar-card h-100">
                                <img src="{{ $speaker->avatar_url }}" class="rounded-circle mb-3 border border-3 border-white shadow-sm object-fit-cover" width="90" height="90" alt="{{ $speaker->name }}">
                                <h6 class="fw-bold mb-1 text-dark">{{ $speaker->name }}</h6>
                                <p class="smaller text-muted mb-0">{{ $speaker->designation }}</p>
                            </div>
                        </div>
                    @endforeach
                </div>
            </section>
        @endif

        @unless($event->is_virtual)
            <section>
                <h4 class="fw-800 mb-4 text-dark detail-section-title">
                    <i class="bi bi-pin-map-fill me-2 text-primary"></i>{{ __('Venue Information') }}
                </h4>
                <div class="detail-sidebar-card p-4 mb-4">
                    <div class="row align-items-center">
                        <div class="col-md-7">
                            <h5 class="fw-bold text-dark">{{ $event->location->title ?? __('Event Venue') }}</h5>
                            <p class="text-muted mb-0">
                                {{ $event->address }}, {{ $event->city }}, {{ $event->zip_code }}<br>
                                <span class="fw-semibold">{{ $event->country }}</span>
                            </p>
                        </div>
                        <div class="col-md-5 text-md-end mt-3 mt-md-0">
                            <a href="https://www.google.com/maps/dir/?api=1&destination={{ $event->latitude }},{{ $event->longitude }}" target="_blank" class="btn btn-outline-secondary fw-semibold px-4 rounded-2">
                                <i class="bi bi-signpost-split me-1"></i>{{ __('Get Directions') }}
                            </a>
                        </div>
                    </div>
                </div>

                @if($event->latitude && $event->longitude)
                    <div class="ratio ratio-21x9 rounded-4 overflow-hidden border shadow-sm">
                        <iframe
                            src="https://maps.google.com/maps?q={{ $event->latitude }},{{ $event->longitude }}&hl=es;z=14&output=embed" class="border-0" allowfullscreen="" loading="lazy"></iframe>
                    </div>
                @endif
            </section>
        @endunless
    </div>
</div>
