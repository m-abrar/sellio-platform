@php
    use App\Models\Property;
    $carouselConversion = 'detail';
    
    $featuredImage = $property->getFirstMedia(Property::PRIMARY_MEDIA);
    $galleryPhotos = $property->gallery();
    
    $allPhotos = collect();
    if ($featuredImage) {
        $allPhotos->push($featuredImage);
    }
    
    $filteredGallery = $galleryPhotos->reject(fn($media) => $featuredImage && $media->id === $featuredImage->id);
    
    $allPhotos = $allPhotos->merge($filteredGallery);

    $totalPhotos = $allPhotos->count();
    $displayPhotoCount = max(1, $totalPhotos);

@endphp

<div id="propertyGallery" class="carousel slide listing-header-carousel" data-bs-ride="carousel">
    <div class="carousel-inner">
        @forelse ($allPhotos as $index => $media)
            @php $imgSrc = $property->resolveMediaUrl($media, $carouselConversion); @endphp
            <div class="carousel-item {{ $index === 0 ? 'active' : '' }}">
                <img
                    src="{{ $imgSrc }}"
                    class="d-block w-100 listing-header-img gallery-lightbox-trigger"
                    alt="{{ $media->name ?: $property->title }}"
                    loading="{{ $index === 0 ? 'eager' : 'lazy' }}"
                    data-lightbox-src="{{ $imgSrc }}"
                    data-bs-toggle="modal"
                    data-bs-target="#galleryLightboxModal"
                    role="button"
                    style="cursor:zoom-in"
                >
            </div>
        @empty
            <div class="carousel-item active">
                <img
                    src="{{ $property->getImageUrl(conversion: $carouselConversion) }}"
                    class="d-block w-100 listing-header-img"
                    alt="{{ __('No photo available for :title', ['title' => $property->title]) }}"
                    loading="eager"
                >
            </div>
        @endforelse
    </div>

    @if ($totalPhotos > 1)
        <button class="carousel-control-prev" type="button" data-bs-target="#propertyGallery" data-bs-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden">{{ __('Previous') }}</span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#propertyGallery" data-bs-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden">{{ __('Next') }}</span>
        </button>
    @endif

    <span class="badge position-absolute top-0 end-0 m-3 text-white fw-bold bg-dark-glass z-10">
        <i class="bi bi-images me-1"></i> {{ trans_choice(':count Photo|:count Photos', $displayPhotoCount, ['count' => $displayPhotoCount]) }}
    </span>
    @if($totalPhotos > 0)
        <span class="badge position-absolute bottom-0 end-0 m-3 bg-dark-glass text-white" style="font-size:.7rem">
            <i class="bi bi-zoom-in me-1"></i>{{ __('Click to enlarge') }}
        </span>
    @endif
</div>

{{-- Lightbox Modal --}}
<div class="modal fade" id="galleryLightboxModal" tabindex="-1" aria-label="{{ __('Photo viewer') }}" aria-modal="true">
    <div class="modal-dialog modal-dialog-centered modal-xl">
        <div class="modal-content bg-dark border-0 rounded-4 overflow-hidden position-relative">
            <button type="button" class="btn-close btn-close-white position-absolute top-0 end-0 m-3 z-10" data-bs-dismiss="modal" aria-label="{{ __('Close') }}"></button>
            <img id="galleryLightboxImg" src="" alt="{{ $property->title }}" class="w-100 d-block" style="max-height:88vh;object-fit:contain">
        </div>
    </div>
</div>

@once
    @push('scripts')
    <script>
        (function () {
            var modal = document.getElementById('galleryLightboxModal');
            var lightboxImg = document.getElementById('galleryLightboxImg');
            if (!modal || !lightboxImg) return;
            modal.addEventListener('show.bs.modal', function (e) {
                var trigger = e.relatedTarget;
                if (trigger && trigger.dataset.lightboxSrc) {
                    lightboxImg.src = trigger.dataset.lightboxSrc;
                }
            });
            modal.addEventListener('hidden.bs.modal', function () {
                lightboxImg.src = '';
            });
        })();
    </script>
    @endpush
@endonce
