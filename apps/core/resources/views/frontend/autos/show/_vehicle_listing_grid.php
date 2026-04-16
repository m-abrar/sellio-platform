<div class="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4">

    @foreach($autos as $auto)

    {{-- Auto Card 1 (Certified Honda) --}}
    <div class="col">
        <a href="{{ route('autos.show', $auto) }}" class="card listing-card glass-surface h-100 text-decoration-none text-dark">
            <div class="img-container">
                <img src="https://picsum.photos/400/300?random=31" alt="Red Sedan">
                <span class="badge position-absolute top-0 end-0 m-3 text-white bg-success fw-bold">CERTIFIED</span>
            </div>
            <div class="card-body p-4">
                <h5 class="fw-bold mb-1">2023 Honda Civic</h5>
                <p class="small text-muted mb-3"><i class="bi bi-tag me-1"></i> $25,500</p>

                {{-- Features --}}
                <div class="d-flex justify-content-between listing-features pt-2 border-top">
                    <span class="text-dark fw-semibold"><i class="bi bi-speedometer2 me-1"></i> 12k miles</span>
                    <span class="text-dark fw-semibold"><i class="bi bi-gear-fill me-1"></i> Auto</span>
                    <span class="text-dark fw-semibold"><i class="bi bi-fuel-pump me-1"></i> Gas</span>
                </div>
            </div>
        </a>
    </div>

    {{-- Auto Card 2 (Electric Tesla) --}}
    <div class="col">
        <a href="{{ route('autos.show', $auto) }}" class="card listing-card glass-surface h-100 text-decoration-none text-dark">
            <div class="img-container">
                <img src="https://picsum.photos/400/300?random=32" alt="Electric SUV">
                {{-- Badge for Electric (using primary color) --}}
                <span class="badge position-absolute top-0 end-0 m-3 text-white btn-primary">ELECTRIC</span>
            </div>
            <div class="card-body p-4">
                <h5 class="fw-bold mb-1">2024 Tesla Model Y</h5>
                <p class="small text-muted mb-3"><i class="bi bi-tag me-1"></i> $48,990</p>

                {{-- Features --}}
                <div class="d-flex justify-content-between listing-features pt-2 border-top">
                    <span class="text-dark fw-semibold"><i class="bi bi-speedometer2 me-1"></i> 4k miles</span>
                    <span class="text-dark fw-semibold"><i class="bi bi-gear-fill me-1"></i> Auto</span>
                    <span class="text-dark fw-semibold"><i class="bi bi-battery-full me-1"></i> Electric</span>
                </div>
            </div>
        </a>
    </div>

    {{-- Auto Card 3 (Featured Truck) --}}
    <div class="col">
        <a href="{{ route('autos.show', $auto) }}" class="card listing-card glass-surface h-100 text-decoration-none text-dark">
            <div class="img-container">
                <img src="https://picsum.photos/400/300?random=33" alt="Truck">
                <span class="badge position-absolute top-0 end-0 m-3 text-white bg-warning text-dark fw-bold">FEATURED</span>
            </div>
            <div class="card-body p-4">
                <h5 class="fw-bold mb-1">2019 Ford F-150</h5>
                <p class="small text-muted mb-3"><i class="bi bi-tag me-1"></i> $34,750</p>

                {{-- Features --}}
                <div class="d-flex justify-content-between listing-features pt-2 border-top">
                    <span class="text-dark fw-semibold"><i class="bi bi-speedometer2 me-1"></i> 55k miles</span>
                    <span class="text-dark fw-semibold"><i class="bi bi-gear-fill me-1"></i> Auto</span>
                    <span class="text-dark fw-semibold"><i class="bi bi-fuel-pump me-1"></i> Gas</span>
                </div>
            </div>
        </a>
    </div>

    @endforeach

</div>