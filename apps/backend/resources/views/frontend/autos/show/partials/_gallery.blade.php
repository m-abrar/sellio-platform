@php
    use App\Models\Auto;
    const CAROUSEL_CONVERSION = 'detail';
    
    $featuredPhoto = $auto->getFirstMedia(Auto::PRIMARY_MEDIA);
    
    $galleryPhotos = $auto->gallery(); 
    
    $allPhotos = collect();
    if ($featuredPhoto) {
        $allPhotos->push($featuredPhoto);
    }
    
    $filteredGallery = $galleryPhotos->reject(fn($media) => $featuredPhoto && $media->id === $featuredPhoto->id);
    
    $allPhotos = $allPhotos->merge($filteredGallery);
    $totalPhotos = $allPhotos->count();
    
@endphp

<div id="vehicleGallery" class="carousel slide listing-header-carousel" data-bs-ride="carousel">
    <div class="carousel-inner">
        @forelse ($allPhotos as $index => $media)
            <div class="carousel-item {{ $index === 0 ? 'active' : '' }}">
                <img 
                    src="{{ $auto->resolveMediaUrl($media, CAROUSEL_CONVERSION) }}" 
                    class="d-block w-100 listing-header-img" 
                    alt="{{ $auto->title ?? 'Vehicle' }} - {{ $media->name ?? 'Photo ' . ($index + 1) }}"
                >
            </div>
        @empty
            <div class="carousel-item active">
                <img 
                    src="{{ $auto->getImageUrl(conversion: CAROUSEL_CONVERSION) }}" 
                    class="d-block w-100 listing-header-img" 
                    alt="No photo available for {{ $auto->title ?? 'Vehicle' }}"
                >
            </div>
        @endforelse
    </div>
    
    @if ($totalPhotos > 1)
        <button class="carousel-control-prev" type="button" data-bs-target="#vehicleGallery" data-bs-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden">{{ __('Previous') }}</span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#vehicleGallery" data-bs-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden">{{ __('Next') }}</span>
        </button>
    @endif
    
    <span class="badge position-absolute top-0 end-0 m-3 text-white fw-bold bg-dark-glass z-10">
        <i class="bi bi-images me-1"></i> {{ $totalPhotos }} {{ __('Photos') }}
    </span>
</div>
