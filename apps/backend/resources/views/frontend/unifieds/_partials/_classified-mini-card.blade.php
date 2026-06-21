<div>
    <a href="{{ route('classifieds.show', $item->slug) }}" class="text-decoration-none group d-block">
        <div class="classified-mini rounded-4 overflow-hidden mb-2 position-relative hover-lift">

            <div class="overflow-hidden" style="height: 120px;">
                <img src="{{ $item->primary_image_url }}"
                     class="w-100 h-100 object-fit-cover transition-img"
                     alt="{{ $item->title }}"
                     loading="lazy"
                     onerror="this.onerror=null;this.src='{{ asset('images/fallbacks/default-card.svg') }}';">
            </div>

            <div class="position-absolute bottom-0 start-0 p-2 w-100 bg-dark bg-opacity-60 backdrop-blur-sm">
                <span class="text-white fw-semibold" style="font-size: 0.75rem;">
                    {{ $item->price_formatted ?? '$' . number_format($item->base_price) }}
                </span>
            </div>

            @if(isset($item->condition_label))
                <span class="position-absolute top-0 start-0 m-2 badge classified-mini__badge rounded-2">
                    {{ $item->condition_label }}
                </span>
            @endif
        </div>

        <h6 class="classified-mini__title text-dark text-truncate mb-0 px-1">
            {{ $item->title }}
        </h6>
    </a>
</div>
