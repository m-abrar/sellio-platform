<div class="card glass-surface p-0 border-0 shadow-lg overflow-hidden">
    
    {{-- Gallery/Hero Section --}}
    @include('frontend.events.show.partials._gallery')
    
    <div class="px-4 px-lg-5 pb-5 pt-4">
        
        {{-- Category & Title --}}
        <div class="mb-4">
            @if($event->category)
                <span class="badge bg-primary-light text-primary-color mb-2 px-3 py-2 rounded-pill fw-bold">
                    <i class="bi bi-tag-fill me-1"></i> {{ $event->category->title }}
                </span>
            @endif
            <h1 class="fw-800 display-5 text-dark mb-3">{{ $event->title }}</h1>
            <p class="lead text-muted line-height-md">
                {{ $event->meta_description ?? Str::limit($event->description, 150) }}
            </p>
        </div>
        
        {{-- Quick Info Ribbon --}}
        <div class="row g-3 mb-5">
            <div class="col-md-4">
                <div class="p-3 bg-light rounded-4 h-100 border border-white shadow-sm">
                    <i class="bi bi-calendar-event text-primary-color fs-4 d-block mb-2"></i>
                    <span class="fw-bold d-block text-dark">
                        {{-- 💡 Fixed: Restored multi-day occurrence logic --}}
                        @if($event->occurrences && $event->occurrences->count() > 1)
                            {{ $event->occurrences->first()->start_date_time->format('M d') }} - {{ $event->occurrences->last()->start_date_time->format('M d, Y') }}
                        @else
                            {{ $event->start_date_time->format('F d, Y') }}
                        @endif
                    </span>
                    <span class="smaller text-muted">
                        {{ $event->occurrences->count() > 1 ? 'Multi-Day Event' : 'Date & Time' }}
                    </span>
                </div>
            </div>
            
            {{-- Venue and Tickets remain as before --}}
            <div class="col-md-4">
                <div class="p-3 bg-light rounded-4 h-100 border border-white shadow-sm">
                    <i class="bi bi-geo-alt text-primary-color fs-4 d-block mb-2"></i>
                    <span class="fw-bold d-block text-dark">
                        @if($event->is_virtual)
                            Virtual Event
                        @else
                            {{ $event->location->title ?? $event->city }}
                        @endif
                    </span>
                    <span class="smaller text-muted">Venue</span>
                </div>
            </div>
            <div class="col-md-4">
                <div class="p-3 bg-light rounded-4 h-100 border border-white shadow-sm">
                    <i class="bi bi-ticket-perforated text-primary-color fs-4 d-block mb-2"></i>
                    <span class="fw-bold d-block {{ $tickets_left < 10 ? 'text-danger' : 'text-dark' }}">
                        {{ $tickets_left > 0 ? $tickets_left . ' Seats Left' : 'Sold Out!' }}
                    </span>
                    <span class="smaller text-muted">Availability</span>
                </div>
            </div>
        </div>
        
        <hr class="opacity-10">
        
        {{-- About Section --}}
        <h4 class="fw-bold mt-5 mb-4 text-dark">Event Overview</h4>
        <div class="event-description text-muted fs-6 line-height-lg">
            {!! nl2br(e($event->description)) !!}
        </div>
        
        {{-- Dynamic Schedule Section --}}
        @if($event->schedule_items && $event->schedule_items->count() > 0)
            <h4 class="fw-bold mt-5 mb-4 text-dark"><i class="bi bi-clock-history me-2 text-primary-color"></i>Program Schedule</h4>
            <div class="schedule-timeline ms-2">
                @foreach($event->schedule_items as $item)
                    <div class="schedule-item">
                        <span class="fw-800 text-primary-color smaller text-uppercase d-block mb-1">{{ $item->time_slot }}</span>
                        <h6 class="fw-bold mb-1 text-dark">{{ $item->title }}</h6>
                        <p class="small text-muted mb-0">{{ $item->description }}</p>
                    </div>
                @endforeach
            </div>
        @endif

        {{-- Speakers Grid --}}
        @if($event->speakers && $event->speakers->count() > 0)
            <h4 class="fw-bold mt-5 mb-4 text-dark"><i class="bi bi-mic-fill me-2 text-primary-color"></i>Featured Speakers</h4>
            <div class="row row-cols-2 row-cols-md-4 g-4">
                @foreach($event->speakers as $speaker)
                    <div class="col text-center">
                        <div class="speaker-card p-3 bg-white border border-light shadow-sm">
                            <img src="{{ $speaker->avatar_url }}" class="rounded-circle mb-3 border border-3 border-white shadow-sm" width="90" height="90" style="object-fit: cover;">
                            <h6 class="fw-bold mb-1 text-dark">{{ $speaker->name }}</h6>
                            <p class="smaller text-muted mb-0">{{ $speaker->designation }}</p>
                        </div>
                    </div>
                @endforeach
            </div>
        @endif

        <hr class="mt-5 opacity-10">

        {{-- Map & Venue --}}
        @unless($event->is_virtual)
            <h4 class="fw-bold mt-5 mb-4 text-dark"><i class="bi bi-pin-map-fill me-2 text-primary-color"></i>Venue Information</h4>
            <div class="p-4 bg-light rounded-4 border border-white mb-4">
                <div class="row align-items-center">
                    <div class="col-md-7">
                        <h5 class="fw-bold text-dark">{{ $event->location->title ?? 'Event Venue' }}</h5>
                        <p class="text-muted mb-0">
                            {{ $event->address }}, {{ $event->city }}, {{ $event->zip_code }}<br>
                            <span class="fw-semibold">{{ $event->country }}</span>
                        </p>
                    </div>
                    <div class="col-md-5 text-md-end mt-3 mt-md-0">
                        <a href="https://www.google.com/maps/dir/?api=1&destination={{ $event->latitude }},{{ $event->longitude }}" target="_blank" class="btn btn-outline-primary-theme btn-sm rounded-pill px-4">
                            <i class="bi bi-signpost-split me-1"></i> Get Directions
                        </a>
                    </div>
                </div>
            </div>
            
            @if($event->latitude && $event->longitude)
                <div class="ratio ratio-21x9 rounded-4 overflow-hidden border shadow-sm">
                    <iframe 
                        src="https://maps.google.com/maps?q={{ $event->latitude }},{{ $event->longitude }}&hl=es;z=14&output=embed" 
                        style="border:0;" allowfullscreen="" loading="lazy"></iframe>
                </div>
            @endif
        @endunless
    </div>
</div>
