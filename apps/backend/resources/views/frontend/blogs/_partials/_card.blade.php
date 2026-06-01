<a href="{{ route('blogs.show', $blog->slug) }}" class="listing-card glass-surface h-100 text-decoration-none text-dark d-flex flex-column transition-all shadow-hover rounded-4">
        
        <div class="img-container position-relative overflow-hidden rounded-top-4">
            <div class="listing-card-img aspect-ratio-4-3">
                {{-- Spatie Media Integration --}}
                <img src="{{ $blog->getFirstMediaUrl('featured_image') ?: asset('images/placeholder.jpg') }}" 
                     alt="{{ $blog->title }}" 
                     class="transition-img w-100 h-100 object-fit-cover">
            </div>
            
            {{-- Category Badge --}}
            <div class="position-absolute top-0 start-0 m-3">
                <span class="badge bg-white text-primary rounded-pill px-3 py-2 shadow-sm fw-bold border-0 backdrop-blur-sm">
                    {{ $blog->category->title ?? __('General') }}
                </span>
            </div>

            @if($blog->is_featured)
                <div class="position-absolute top-0 end-0 m-3">
                    <div class="bg-danger text-white rounded-circle d-flex align-items-center justify-content-center shadow-sm border border-2 border-white" style="width: 32px; height: 32px;" title="{{ __('Featured') }}">
                        <i class="bi bi-star-fill" style="font-size: 0.8rem;"></i>
                    </div>
                </div>
            @endif
        </div>

        <div class="card-body p-3 d-flex flex-column flex-grow-1">
            <div class="mb-3">
                <h6 class="property-title fw-800 mb-2 text-dark line-clamp-2 mt-1 lh-base">
                    {{ $blog->title }}
                </h6>
                <p class="text-muted small line-clamp-2 mb-0 opacity-75">
                    {{ Str::limit(strip_tags($blog->content), 90) }}
                </p>
            </div>
            
            <div class="d-flex justify-content-between align-items-center pt-3 border-top mt-auto">
                {{-- Metadata Group --}}
                <div class="d-flex gap-3 text-muted" style="font-size: 0.75rem;">
                    <span>
                        <i class="bi bi-calendar3 me-1"></i>
                        {{ $blog->created_at->format('M d') }}
                    </span>
                    <span>
                        <i class="bi bi-eye me-1"></i>
                        {{ number_format($blog->view_count ?? 0) }}
                    </span>
                </div>

                <div class="text-primary fw-bold small">
                    {{ __('Read') }} <i class="bi bi-arrow-right ms-1"></i>
                </div>
            </div>
        </div>
    </a>
