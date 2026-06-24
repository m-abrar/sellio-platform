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
            <span class="badge bg-white text-dark px-3 py-2 rounded-2 shadow-sm small fw-semibold">
                <i class="bi bi-camera me-1"></i>
                <span id="serviceGalleryCounter">1</span> / {{ $totalPhotos }}
            </span>
        </div>
        <div class="position-absolute bottom-0 start-0 m-3 z-3">
            <span class="badge bg-dark bg-opacity-50 text-white" style="font-size:.7rem">
                <i class="bi bi-zoom-in me-1"></i>{{ __('Click to enlarge') }}
            </span>
        </div>
    @endif

    <div class="carousel-inner rounded-top-4">
        @forelse ($allPhotos as $index => $media)
            @php $imgSrc = $service->resolveMediaUrl($media, 'detail'); @endphp
            <div class="carousel-item {{ $index === 0 ? 'active' : '' }}">
                <div class="ratio ratio-16x9">
                    <img src="{{ $imgSrc }}"
                         class="object-fit-cover gallery-lightbox-trigger"
                         alt="{{ $service->title }}"
                         loading="{{ $index === 0 ? 'eager' : 'lazy' }}"
                         data-lightbox-src="{{ $imgSrc }}"
                         data-bs-toggle="modal"
                         data-bs-target="#serviceLightboxModal"
                         role="button"
                         style="cursor:zoom-in">
                </div>
            </div>
        @empty
            <div class="carousel-item active">
                <div class="ratio ratio-16x9 bg-light d-flex align-items-center justify-content-center">
                    <div class="text-center">
                        <i class="bi bi-image text-muted display-4"></i>
                        <p class="small text-muted mt-2">{{ __('No photos available') }}</p>
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

{{-- Lightbox Modal --}}
<div class="modal fade" id="serviceLightboxModal" tabindex="-1" aria-label="{{ __('Photo viewer') }}" aria-modal="true">
    <div class="modal-dialog modal-dialog-centered modal-xl">
        <div class="modal-content bg-dark border-0 rounded-4 overflow-hidden position-relative">
            <button type="button" class="btn-close btn-close-white position-absolute top-0 end-0 m-3 z-10" data-bs-dismiss="modal" aria-label="{{ __('Close') }}"></button>
            <img id="serviceLightboxImg" src="" alt="{{ $service->title }}" class="w-100 d-block" style="max-height:88vh;object-fit:contain">
        </div>
    </div>
</div>

@once
    @push('scripts')
    <script>
        (function () {
            // Lightbox
            var modal = document.getElementById('serviceLightboxModal');
            var lightboxImg = document.getElementById('serviceLightboxImg');
            if (modal && lightboxImg) {
                modal.addEventListener('show.bs.modal', function (e) {
                    if (e.relatedTarget && e.relatedTarget.dataset.lightboxSrc) {
                        lightboxImg.src = e.relatedTarget.dataset.lightboxSrc;
                    }
                });
                modal.addEventListener('hidden.bs.modal', function () {
                    lightboxImg.src = '';
                });
            }

            // Counter update
            var carousel = document.getElementById('serviceGallery');
            var counter  = document.getElementById('serviceGalleryCounter');
            if (carousel && counter) {
                carousel.addEventListener('slide.bs.carousel', function (e) {
                    counter.textContent = e.to + 1;
                });
            }

            // Share button
            document.querySelectorAll('.js-share-btn').forEach(function (btn) {
                btn.addEventListener('click', function () {
                    var title = btn.dataset.shareTitle || document.title;
                    var url   = btn.dataset.shareUrl   || window.location.href;
                    if (navigator.share) {
                        navigator.share({ title: title, url: url }).catch(function () {});
                    } else {
                        navigator.clipboard.writeText(url).then(function () {
                            var orig = btn.innerHTML;
                            btn.innerHTML = '<i class="bi bi-check2 me-1"></i>{{ __("Link copied") }}';
                            setTimeout(function () { btn.innerHTML = orig; }, 2000);
                        });
                    }
                });
            });
        })();
    </script>
    @endpush
@endonce
