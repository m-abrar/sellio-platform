<div class="p-4 gallery-section">
    {{-- Main Display Image --}}
    <img 
        id="mainImage" 
        src="{{ $classified->getInitialMainImageUrl('detail') }}" 
        class="main-listing-img mb-3 img-fluid rounded shadow-sm" 
        alt="{{ $classified->title }}"
    >
    
    <div class="d-flex gap-2 thumbnail-container overflow-auto pb-2">
        @forelse ($allPhotos as $index => $media)
            <img 
                src="{{ $media->getUrl('thumb') }}" 
                data-full-src="{{ $media->getUrl('detail') }}"
                class="thumbnail-img {{ $index === 0 ? 'active' : '' }}" 
                alt="{{ $media->name ?? $classified->title }}"
                role="button"
            >
        @empty
            <img 
                src="{{ $classified->getImageUrl(conversion: 'thumb') }}" 
                data-full-src="{{ $classified->getImageUrl(conversion: 'detail') }}"
                class="thumbnail-img active" 
                alt="{{ __('No photo available') }}"
            >
        @endforelse

        @if ($allPhotos->count() > 1)
            <span class="thumbnail-count small text-muted align-self-center ms-2">
                {{ __('+ :count photos', ['count' => $allPhotos->count()]) }}
            </span>
        @endif
    </div>
</div>

@push('scripts')
<script>
    // Logic moved to a push stack to prevent duplication if partial is called twice
    (function() {
        document.addEventListener('DOMContentLoaded', () => {
            const container = document.querySelector('.gallery-section');
            if (!container) return;

            const mainImage = container.querySelector('#mainImage');
            const thumbnails = container.querySelectorAll('.thumbnail-img');

            thumbnails.forEach(thumb => {
                thumb.addEventListener('click', function() {
                    mainImage.src = this.getAttribute('data-full-src');
                    thumbnails.forEach(t => t.classList.remove('active'));
                    this.classList.add('active');
                });
            });
        });
    })();
</script>
@endpush