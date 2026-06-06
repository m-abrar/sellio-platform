@php
    // Add this import line to fix the "Class not found" error
    use App\Models\Product; 
    
    /** @var \App\Models\Product $product */
    
    // 1. Use the Trait's gallery() method which respects Product::GALLERY_MEDIA
    $galleryPhotos = $product->gallery(); 
    
    // 2. Use the Trait's detection logic for the primary/featured image
    // This will check PRIMARY_MEDIA ('main_image') first
    $featuredImage = $product->getFirstMedia(Product::PRIMARY_MEDIA);
    
    $allPhotos = collect();
    if ($featuredImage) {
        $allPhotos->push($featuredImage);
    }
    
    // Filter out the featured image from the gallery to prevent duplicates
    $filteredGallery = $galleryPhotos->reject(fn($media) => $featuredImage && $media->id === $featuredImage->id);
    $allPhotos = $allPhotos->merge($filteredGallery);
    
    $totalPhotos = $allPhotos->count();
    
    // 3. Use the Trait's getImageUrl which handles fallbacks automatically
    $initialMainImage = $product->getImageUrl(Product::PRIMARY_MEDIA, 'detail');
@endphp

<div class="gallery-section p-0">
    {{-- Main Interactive Display --}}
    <div class="main-image-container mb-3 overflow-hidden rounded-4 border bg-white shadow-sm">
        <img 
            id="mainProductImage" 
            src="{{ $initialMainImage }}" 
            class="w-100 h-100 object-fit-contain transition-all" 
            alt="{{ $product->title }}"
            style="aspect-ratio: 1/1; cursor: zoom-in;"
            {{-- Identify if this is a fallback image via the trait --}}
            data-is-placeholder="{{ $product->isFallbackUrl($initialMainImage) ? 'true' : 'false' }}"
        >
    </div>
    
    {{-- Thumbnail Scrollbar --}}
    <div class="d-flex gap-2 thumbnail-container overflow-auto pb-2 custom-scrollbar">
        @forelse ($allPhotos as $index => $media)
            <div class="thumbnail-wrapper flex-shrink-0" style="width: 80px; height: 80px;">
                <img 
                    {{-- 'thumb' conversion is registered in registerCommonMediaConversions --}}
                    src="{{ $media->getUrl('thumb') }}" 
                    data-full-src="{{ $media->getUrl('detail') }}"
                    class="thumbnail-img w-100 h-100 object-fit-cover rounded-3 border pointer-cursor transition-all {{ $index === 0 ? 'active border-primary border-2' : 'opacity-75' }}" 
                    alt="{{ $product->title }} - {{ $index + 1 }}"
                    role="button"
                >
            </div>
        @empty
            {{-- Automated Fallback using the trait --}}
            <div class="thumbnail-wrapper" style="width: 80px; height: 80px;">
                <img 
                    src="{{ $product->getFallbackImage('thumb') }}" 
                    class="thumbnail-img w-100 h-100 object-fit-cover rounded-3 border active" 
                    alt="No photo available"
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

<style>
    .thumbnail-img.active {
        opacity: 1 !important;
        transform: scale(0.95);
        border-color: var(--bs-primary) !important;
    }
    .thumbnail-img:hover {
        opacity: 1;
        border-color: var(--bs-primary);
    }
    .pointer-cursor { cursor: pointer; }
    .thumbnail-container::-webkit-scrollbar { height: 4px; }
    .thumbnail-container::-webkit-scrollbar-thumb { background: #cbd5e0; border-radius: 10px; }
    .transition-all { transition: all 0.2s ease-in-out; }
</style>

<script>
    document.addEventListener('DOMContentLoaded', () => {
        const mainImage = document.getElementById('mainProductImage');
        const thumbnails = document.querySelectorAll('.thumbnail-img');

        thumbnails.forEach(thumb => {
            thumb.addEventListener('click', function() {
                const newSrc = this.getAttribute('data-full-src');
                if(!newSrc) return;

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