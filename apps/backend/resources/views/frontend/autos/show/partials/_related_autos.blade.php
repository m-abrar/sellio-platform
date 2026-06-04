{{-- Assumes $relatedAutos is a Collection of Auto models --}}
@if ($relatedAutos->isNotEmpty())

    <div class="mt-5 pt-4">
        <h3 class="fw-bold mb-4"><i class="bi bi-compass-fill me-2 text-primary-color"></i>Similar Vehicles You Might Like</h3>
        
        <p class="lead text-muted small mb-4">
            Explore other {{ $auto->make }} listings or similar models near {{ $auto->city }}.
        </p>

        <div class="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4">
            
            @foreach ($relatedAutos->take(3) as $relatedAuto)
                {{-- 💡 Reusing the Auto Card partial for consistency --}}
                <div class="col">
                    @include('frontend.autos._auto_card', ['auto' => $relatedAuto])
                </div>
            @endforeach

        </div>

        <div class="text-center mt-5">
            <a href="{{ route('autos.index', ['make' => $auto->make]) }}" class="btn btn-lg btn-outline-primary-theme fw-bold">
                <i class="bi bi-search me-2"></i>View All {{ $auto->make }} Listings
            </a>
        </div>
    </div>

@endif
