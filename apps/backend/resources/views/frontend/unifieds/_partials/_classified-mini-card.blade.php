<div>
    <a href="{{ route('classifieds.show', $item->slug) }}" class="text-decoration-none group d-block">
        <div class="rounded-4 overflow-hidden mb-2 shadow-sm position-relative hover-lift border border-white border-opacity-50 glass-surface">
            
            {{-- Image Container --}}
            <div class="overflow-hidden" style="height: 120px;">
                <img src="{{ $item->primary_image_url }}" 
                     class="w-100 h-100 object-fit-cover transition-img" 
                     alt="{{ $item->title }}"
                     loading="lazy"
                     onerror="this.onerror=null;this.src='{{ asset('images/fallbacks/default-card.svg') }}';">
            </div>

            {{-- Price Badge Overlay --}}
            <div class="position-absolute bottom-0 start-0 p-2 w-100 bg-dark bg-opacity-60 backdrop-blur-sm">
                <span class="text-white fw-800" style="font-size: 0.75rem;">
                    {{ $item->price_formatted ?? '$' . number_format($item->base_price) }}
                </span>
            </div>
            
            {{-- Condition Tag (Optional) --}}
            @if(isset($item->condition_label))
                <span class="position-absolute top-0 start-0 m-2 badge bg-glass-dark rounded-pill fs-xxs">
                    {{ strtoupper($item->condition_label) }}
                </span>
            @endif
        </div>
        
        <h6 class="text-dark fw-800 small text-truncate mb-0 px-1 hover-text-primary transition-all">
            {{ $item->title }}
        </h6>
    </a>
</div>
