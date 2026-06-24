@php
    use App\Models\Product;

    $galleryPhotos = $product->gallery();
    $featuredImage = $product->getFirstMedia(Product::PRIMARY_MEDIA);

    $allPhotos = collect();
    if ($featuredImage) {
        $allPhotos->push($featuredImage);
    }

    $filteredGallery = $galleryPhotos->reject(fn($media) => $featuredImage && $media->id === $featuredImage->id);
    $allPhotos = $allPhotos->merge($filteredGallery);

    $totalPhotos = $allPhotos->count();
    $initialMainImage = $product->getImageUrl(Product::PRIMARY_MEDIA, 'detail');
@endphp

<div class="product-gallery p-0">
    <div class="main-image-container mb-3 overflow-hidden rounded-4 border bg-white shadow-sm position-relative">
        <img
            id="mainProductImage"
            src="{{ $initialMainImage }}"
            class="w-100 h-100 object-fit-contain product-gallery__main transition-all"
            alt="{{ $product->title }}"
            data-is-placeholder="{{ $product->isFallbackUrl($initialMainImage) ? 'true' : 'false' }}"
            data-bs-toggle="modal"
            data-bs-target="#productLightboxModal"
            role="button"
        >
        <span class="position-absolute bottom-0 end-0 m-2 badge bg-dark bg-opacity-50 text-white" style="font-size:.65rem;pointer-events:none">
            <i class="bi bi-zoom-in me-1"></i>{{ __('Enlarge') }}
        </span>
    </div>

    <div class="d-flex gap-2 product-gallery__thumbs overflow-auto pb-2">
        @forelse ($allPhotos as $index => $media)
            <div class="product-gallery__thumb">
                <img
                    src="{{ $product->resolveMediaUrl($media, 'thumb') }}"
                    data-full-src="{{ $product->resolveMediaUrl($media, 'detail') }}"
                    class="product-gallery__thumb-img thumbnail-img w-100 h-100 object-fit-cover rounded-3 border pointer-cursor transition-all {{ $index === 0 ? 'active border-primary border-2' : 'opacity-75' }}"
                    alt="{{ $product->title }} - {{ $index + 1 }}"
                    role="button"
                >
            </div>
        @empty
            <div class="product-gallery__thumb">
                <img
                    src="{{ $product->getFallbackImage('thumb') }}"
                    class="product-gallery__thumb-img thumbnail-img w-100 h-100 object-fit-cover rounded-3 border active"
                    alt="{{ __('No photo available') }}"
                >
            </div>
        @endforelse

        @if ($totalPhotos > 4)
            <div class="align-self-center ms-2">
                <span class="badge bg-light text-dark border fw-bold">
                    +{{ $totalPhotos - 4 }} {{ __('more') }}
                </span>
            </div>
        @endif
    </div>
</div>

{{-- Lightbox Modal --}}
<div class="modal fade" id="productLightboxModal" tabindex="-1" aria-label="{{ __('Photo viewer') }}" aria-modal="true">
    <div class="modal-dialog modal-dialog-centered modal-xl">
        <div class="modal-content bg-dark border-0 rounded-4 overflow-hidden position-relative">
            <button type="button" class="btn-close btn-close-white position-absolute top-0 end-0 m-3 z-10" data-bs-dismiss="modal" aria-label="{{ __('Close') }}"></button>
            <img id="productLightboxImg" src="" alt="{{ $product->title }}" class="w-100 d-block" style="max-height:88vh;object-fit:contain">
        </div>
    </div>
</div>

@push('scripts')
<script src="{{ asset('frontend/js/product-gallery.js') }}"></script>
<script>
(function () {
    var modal      = document.getElementById('productLightboxModal');
    var lightboxImg = document.getElementById('productLightboxImg');
    var mainImg    = document.getElementById('mainProductImage');
    if (!modal || !lightboxImg || !mainImg) return;

    modal.addEventListener('show.bs.modal', function () {
        lightboxImg.src = mainImg.src;
    });
    modal.addEventListener('hidden.bs.modal', function () {
        lightboxImg.src = '';
    });
})();
</script>
@endpush
