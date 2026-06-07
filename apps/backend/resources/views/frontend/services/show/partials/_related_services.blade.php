@php
    $fallbackImage = asset('images/fallbacks/default-card.jpg');
@endphp

<div class="row g-4">
    @forelse (($relatedServices ?? collect())->take(3) as $related)
        <div class="col-md-4">
            <div class="card glass-surface related-service-card h-100">
                <img src="{{ $related->primary_image_url ?? $related->thumbnail_url ?? $fallbackImage }}"
                     class="card-img-top related-img"
                     alt="{{ $related->title }}">
                <div class="card-body d-flex flex-column">
                    <h6 class="card-title fw-bold">{{ $related->title }}</h6>
                    @if (!empty($related->short_description))
                        <p class="card-text small text-muted mb-2">{{ \Illuminate\Support\Str::limit($related->short_description, 100) }}</p>
                    @endif
                    <div class="d-flex justify-content-between align-items-center mt-auto">
                        <span class="fw-bold text-success">
                            @if (!empty($related->price))
                                ${{ number_format((float) $related->price, 0) }}
                            @else
                                {{ __('Contact') }}
                            @endif
                        </span>
                        <a href="{{ route('services.show', $related->slug) }}" class="btn btn-sm btn-primary-outline-cta">
                            {{ __('Explore') }}
                        </a>
                    </div>
                </div>
            </div>
        </div>
    @empty
        <div class="col-12">
            <p class="text-muted mb-0">{{ __('No related services are available right now.') }}</p>
        </div>
    @endforelse
</div>
