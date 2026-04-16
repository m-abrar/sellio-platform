@php
    use App\Models\Event;
    const CAROUSEL_CONVERSION = 'detail';
    
    $featuredImage = $event->getFirstMedia(Event::PRIMARY_MEDIA);
    $galleryPhotos = $event->gallery();
    
    $allPhotos = collect();
    if ($featuredImage) {
        $allPhotos->push($featuredImage);
    }
    
    $filteredGallery = $galleryPhotos->reject(fn($media) => $featuredImage && $media->id === $featuredImage->id);
    
    $allPhotos = $allPhotos->merge($filteredGallery);

    $totalPhotos = $allPhotos->count();

@endphp

<div id="eventGallery" class="carousel slide listing-header-carousel" data-bs-ride="carousel">
    <div class="carousel-inner">
        @forelse ($allPhotos as $index => $media)
            <div class="carousel-item {{ $index === 0 ? 'active' : '' }}">
                <img 
                    src="{{ $media->getUrl(CAROUSEL_CONVERSION) }}" 
                    class="d-block w-100 listing-header-img" 
                    alt="{{ $media->name }}"
                >
            </div>
        @empty
            <div class="carousel-item active">
                <img 
                    src="{{ $event->getImageUrl(conversion: CAROUSEL_CONVERSION) }}" 
                    class="d-block w-100 listing-header-img" 
                    alt="No photo available"
                >
            </div>
        @endforelse
    </div>
    
    @if ($totalPhotos > 1)
        <button class="carousel-control-prev" type="button" data-bs-target="#eventGallery" data-bs-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Previous</span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#eventGallery" data-bs-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Next</span>
        </button>
    @endif
    
    <span class="badge position-absolute top-0 end-0 m-3 text-white fw-bold bg-dark-glass z-10">
        <i class="bi bi-images me-1"></i> {{ $totalPhotos }} Photos
    </span>
</div>
