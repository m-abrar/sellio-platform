<div class="col">
    <a href="{{ route('events.show', $event) }}" 
       class="evc-card evc-glass-surface h-100 text-decoration-none text-dark d-flex flex-column transition-all shadow-hover rounded-4 position-relative {{ $event->is_featured ? 'evc-featured-border' : '' }}">
        
        {{-- 1. Featured Ribbon (Top Layer) --}}
        @if($event->is_featured)
            <div class="evc-featured-ribbon">
                <span><i class="bi bi-star-fill me-1"></i>{{ __('FEATURED') }}</span>
            </div>
        @endif

        {{-- 2. Media Container --}}
        <div class="evc-img-container position-relative overflow-hidden rounded-top-4">
            <div class="evc-listing-card-img evc-aspect-ratio-16-9">
                <img src="{{ $event->primary_image_url }}" 
                     alt="{{ e($event->title) }}" 
                     class="transition-img w-100 h-100 object-fit-cover" 
                     loading="lazy">
            </div>
            
            {{-- Price Badge (Top Right) --}}
            <div class="position-absolute top-0 end-0 m-2">
                <span class="badge {{ $event->is_free ? 'bg-success' : ($event->on_sale ? 'bg-danger' : 'bg-primary') }} text-white rounded-pill px-3 py-2 shadow-sm fw-800 evc-auto-badge border border-white border-opacity-25">
                    @if($event->on_sale && !$event->is_free)<i class="bi bi-tag-fill me-1"></i>@endif
                    {{ $event->is_free ? __('FREE') : $event->price_formatted }}
                </span>
            </div>

            {{-- Date Block (Bottom Left with Margin) --}}
            {{-- We use m-3 to give it breathing room from both bottom and side --}}
            <div class="position-absolute bottom-0 start-0 m-3">
                <div class="evc-date-block-overlay text-center bg-white rounded-3 shadow px-2 py-1 border border-light">
                    <span class="fw-800 text-dark d-block" style="font-size: 1.1rem; line-height: 1;">
                        {{ $event->start_date_time->format('d') }}
                    </span>
                    <span class="text-uppercase fw-bold text-primary" style="font-size: 0.6rem; letter-spacing: 0.5px;">
                        {{ $event->start_date_time->format('M') }}
                    </span>
                </div>
            </div>
        </div>

        {{-- 3. Content Body --}}
        <div class="card-body p-3 pt-0 d-flex flex-column flex-grow-1 position-relative">
            
            {{-- Organizer Avatar (Overlapping) --}}
            <div class="evc-organizer-wrapper position-absolute translate-middle-y" style="top: 0; right: 20px; z-index: 11;">
                <img src="{{ $event->organizer->avatar_url ?? asset('assets/img/default-avatar.png') }}" 
                     alt="{{ e($event->organizer->name ?? '') }}" 
                     class="rounded-circle border border-3 border-white shadow-sm bg-white"
                     style="width: 42px; height: 42px; object-fit: cover;"
                     data-bs-toggle="tooltip" 
                     title="{{ e($event->organizer->name ?? __('Organizer')) }}">
            </div>

            {{-- Title Section --}}
            <h5 class="fw-800 mb-1 mt-4 {{ $event->is_featured ? 'text-primary' : 'text-dark' }} text-truncate" style="min-height: 3rem;">
                {{ $event->title }}
            </h5>

            <div class="text-muted d-flex align-items-center text-truncate small mb-3">
                <i class="bi bi-geo-alt-fill text-danger me-1"></i>
                {{ $event->is_virtual ? __('Online Access') : ($event->location?->title ?? __('Venue TBD')) }}
            </div>
            
            {{-- Metrics Row --}}
            <div class="row g-0 pt-3 border-top mt-auto align-items-center">
                <div class="col-6 text-center border-end">
                    <span class="evc-metric-label">{{ __('TIME') }}</span>
                    <span class="evc-metric-value fw-800 d-block">{{ $event->start_date_time->format('g:i A') }}</span>
                </div>
                <div class="col-6 text-center">
                    <span class="evc-metric-label">{{ __('FORMAT') }}</span>
                    <span class="evc-metric-value fw-800 text-truncate px-1 d-block">
                        {{ $event->type->title ?? __('In-Person') }}
                    </span>
                </div>
            </div>
        </div>
    </a>
</div>
