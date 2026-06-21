<h6 class="fw-bold mb-4 text-primary"><i class="bi bi-pin-map-fill me-2"></i>{{ __('Points of Interest') }}</h6>
@php
    $groupedNeighborhoods = $property->neighborhoods->groupBy('category');
    $categoryIcons = ['Commute' => 'bi-train-front', 'Essential' => 'bi-cart-check', 'School' => 'bi-book', 'Recreation' => 'bi-tree'];
@endphp

@if ($groupedNeighborhoods->isNotEmpty())
    <div class="accordion accordion-flush custom-neighborhood" id="neighborhoodAccordion">
        @foreach ($groupedNeighborhoods as $categoryName => $neighborhoods)
            <div class="mb-3">
                <h6 class="fw-800 text-dark small text-uppercase mb-2 d-flex align-items-center">
                    <i class="bi {{ $categoryIcons[$categoryName] ?? 'bi-geo-alt' }} me-2 text-primary"></i>
                    {{ $categoryName }}
                </h6>
                <ul class="list-unstyled">
                    @foreach ($neighborhoods as $item)
                        <li class="d-flex justify-content-between align-items-center mb-2 p-2 rounded-3 hover-light transition-all">
                            <span class="text-muted small"><i class="bi bi-dot me-1"></i>{{ $item->title }}</span>
                            <span class="badge bg-white text-dark border fw-normal tiny shadow-sm">
                                {{ $item->distance_value ?? '0.5' }} {{ $item->distance_unit ?? 'km' }}
                            </span>
                        </li>
                    @endforeach
                </ul>
            </div>
        @endforeach
    </div>
@endif
