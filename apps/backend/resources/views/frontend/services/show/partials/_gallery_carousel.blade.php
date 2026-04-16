@php
    use App\Models\Service;
    // const CAROUSEL_CONVERSION = 'detail';
    
    $featuredImage = $service->getFirstMedia(Service::PRIMARY_MEDIA);
    $galleryPhotos = $service->gallery();
    
    // Merge featured into gallery, preventing duplicates
    $allPhotos = $featuredImage ? collect([$featuredImage])->merge($galleryPhotos->reject(fn($m) => $m->id === $featuredImage->id)) : $galleryPhotos;
    $totalPhotos = $allPhotos->count();
@endphp

<div id="serviceGallery" class="carousel slide position-relative shadow-sm" data-bs-ride="carousel">
    @if($totalPhotos > 0)
        <div class="position-absolute bottom-0 end-0 m-3 z-3">
            <span class="badge glass-surface text-dark px-3 py-2 rounded-pill shadow-sm small fw-bold">
                <i class="bi bi-camera me-1"></i> 1 / {{ $totalPhotos }}
            </span>
        </div>
    @endif

    <div class="carousel-inner rounded-top-4">
        @forelse ($allPhotos as $index => $media)
            <div class="carousel-item {{ $index === 0 ? 'active' : '' }}">
                <div class="ratio ratio-16x9">
                    <img src="{{ $media->getUrl('detail') }}" 
                         class="object-fit-cover" 
                         alt="{{ $service->title }}" 
                         loading="{{ $index === 0 ? 'eager' : 'lazy' }}">
                </div>
            </div>
        @empty
            <div class="carousel-item active">
                <div class="ratio ratio-16x9 bg-light d-flex align-items-center justify-content-center">
                    <div class="text-center">
                        <i class="bi bi-image text-muted display-4"></i>
                        <p class="small text-muted mt-2">No photos available</p>
                    </div>
                </div>
            </div>
        @endforelse
    </div>
    
    @if ($totalPhotos > 1)
        <button class="carousel-control-prev" type="button" data-bs-target="#serviceGallery" data-bs-slide="prev">
            <span class="carousel-control-prev-icon p-3 bg-dark bg-opacity-25 rounded-circle" aria-hidden="true"></span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#serviceGallery" data-bs-slide="next">
            <span class="carousel-control-next-icon p-3 bg-dark bg-opacity-25 rounded-circle" aria-hidden="true"></span>
        </button>
    @endif
</div>
