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
    <div class="main-image-container mb-3 overflow-hidden rounded-4 border bg-white shadow-sm">
        <img
            id="mainProductImage"
            src="{{ $initialMainImage }}"
            class="w-100 h-100 object-fit-contain product-gallery__main transition-all"
            alt="{{ $product->title }}"
            data-is-placeholder="{{ $product->isFallbackUrl($initialMainImage) ? 'true' : 'false' }}"
        >
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

<script>
    document.addEventListener('DOMContentLoaded', () => {
        const mainImage = document.getElementById('mainProductImage');
        const thumbnails = document.querySelectorAll('.product-gallery__thumb-img');

        thumbnails.forEach(thumb => {
            thumb.addEventListener('click', function() {
                const newSrc = this.getAttribute('data-full-src');
                if (!newSrc) return;

                mainImage.style.opacity = '0.3';

                setTimeout(() => {
                    mainImage.src = newSrc;
                    mainImage.style.opacity = '1';
                }, 150);

                thumbnails.forEach(t => {
                    t.classList.remove('active', 'border-primary', 'border-2');
                    t.classList.add('opacity-75');
                });

                this.classList.add('active', 'border-primary', 'border-2');
                this.classList.remove('opacity-75');
            });
        });
    });
</script>
