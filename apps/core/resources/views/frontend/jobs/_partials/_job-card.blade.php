<div class="col">
    <div class="jbl-listing-card glass-surface h-100 d-flex flex-column transition-all hover-up rounded-4 border-0 shadow-sm position-relative overflow-hidden" 
         x-data="{ isFavorite: false }">
        
        {{-- 1. COVER IMAGE SECTION --}}
        <div class="position-relative jbl-card-image-wrapper">
            <img src="{{ $job->primary_image_url }}" 
                 class="w-100 h-100 object-fit-cover transition-img jbl-card-img-top" 
                 alt="{{ $job->title }}">
            
            <div class="position-absolute top-0 start-0 w-100 p-3 d-flex justify-content-between jbl-badge-container">
                <div>
                    @if($job->is_featured)
                        <span class="badge bg-danger text-white fw-800 px-2 py-1 rounded-2 shadow-sm">
                            <i class="bi bi-patch-check-fill me-1"></i>{{ __('FEATURED') }}
                        </span>
                    @endif
                </div>
                
                @isset($job->category)
                    <span class="badge {{ $job->badge_class }} fw-700 px-2 py-1 rounded-2 shadow-sm">
                        {{ $job->category->title }}
                    </span>
                @endisset
            </div>
        </div>

        {{-- 2. CARD CONTENT --}}
        <div class="card-body p-4 pt-0 d-flex flex-column position-relative">
            
            <div class="d-flex justify-content-between align-items-end mb-3">
                {{-- Logo Container --}}
                <div class="bg-white shadow rounded-3 border border-white border-4 d-flex align-items-center justify-content-center jbl-employer-logo-container">
                    <img src="{{ $job->employer->avatar_url }}" 
                         alt="{{ $job->employer->name }}" 
                         class="img-fluid rounded">
                </div>
                
                {{-- Save Button --}}
                <button type="button" 
                        @click.prevent="isFavorite = !isFavorite"
                        class="btn btn-white rounded-circle shadow-sm d-flex align-items-center justify-content-center border-0 position-absolute jbl-btn-save-job">
                    <i class="bi" :class="isFavorite ? 'bi-bookmark-fill text-primary' : 'bi-bookmark text-muted'"></i>
                </button>
            </div>

            {{-- Main Link Area --}}
            <a href="{{ route('jobs.show', $job->slug) }}" class="text-decoration-none flex-grow-1">
                <div class="mb-3">
                    <h6 class="text-primary fw-800 mb-1 small">{{ $job->employer->name }}</h6>
                    <h5 class="property-title fw-800 mb-2 text-dark line-clamp-1">{{ $job->title }}</h5>
                    
                    <div class="d-flex align-items-center gap-3">
                        <span class="text-muted small">
                            <i class="bi bi-geo-alt me-1 text-primary"></i>{{ $job->location->title ?? $job->city ?? __('Global') }}
                        </span>
                        <span class="text-muted small">
                            <i class="bi bi-clock-history me-1"></i>{{ $job->created_at->diffForHumans(null, true) }}
                        </span>
                    </div>
                </div>

                <p class="text-muted small mb-4 jbl-description-text">
                    {{ Str::limit(strip_tags($job->description), 95) }}
                </p>
            </a>

            {{-- 3. FOOTER METRICS --}}
            <div class="row g-0 pt-3 border-top mt-auto align-items-center">
                <div class="col-4 border-end">
                    <span class="metric-label text-uppercase">{{ __('Type') }}</span>
                    <span class="metric-value jbl-metric-value fw-800 text-dark text-truncate d-block pe-1">
                        {{ $job->type->title ?? __('Full-Time') }}
                    </span>
                </div>
                <div class="col-4 border-end text-center">
                    <span class="metric-label text-uppercase">{{ __('Salary') }}</span>
                    <span class="metric-value jbl-metric-value fw-800 text-success">
                        {{ $job->salary_range_formatted ?? __('Comp.') }}
                    </span>
                </div>
                <div class="col-4 text-end">
                    <span class="metric-label text-uppercase">{{ __('Model') }}</span>
                    <span class="metric-value jbl-metric-value fw-800 text-dark">
                        {{ $job->workplace_label }}
                    </span>
                </div>
            </div>
        </div>
    </div>
</div>





