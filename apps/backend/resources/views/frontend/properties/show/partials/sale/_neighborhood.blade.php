<h6 class="fw-800 text-dark mb-4 d-flex align-items-center gap-2" style="font-size:.95rem">
    <i class="bi bi-pin-map-fill" style="color:var(--primary-color)" aria-hidden="true"></i>
    {{ __('Points of Interest') }}
</h6>

@php
    $groupedNeighborhoods = $property->neighborhoods->groupBy('category');
    $categoryIcons = [
        'Commute'     => 'bi-train-front-fill',
        'Essential'   => 'bi-cart-check-fill',
        'School'      => 'bi-mortarboard-fill',
        'Recreation'  => 'bi-tree-fill',
    ];
@endphp

@if ($groupedNeighborhoods->isNotEmpty())
    <div class="poi-list">
        @foreach ($groupedNeighborhoods as $categoryName => $neighborhoods)
            <div class="poi-group">
                <div class="poi-group__label">
                    <i class="bi {{ $categoryIcons[$categoryName] ?? 'bi-geo-alt-fill' }} poi-group__icon" aria-hidden="true"></i>
                    {{ $categoryName }}
                </div>
                @foreach ($neighborhoods as $item)
                    <div class="poi-item">
                        <span class="poi-item__name">{{ $item->title }}</span>
                        <span class="poi-item__dist">{{ $item->distance_value ?? '—' }} {{ $item->distance_unit ?? '' }}</span>
                    </div>
                @endforeach
            </div>
        @endforeach
    </div>
@endif

@push('styles')
<style>
.poi-list {
    display: flex;
    flex-direction: column;
    gap: 18px;
}

.poi-group__label {
    display: flex;
    align-items: center;
    gap: 7px;
    font-size: 0.65rem;
    font-weight: 900;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    color: #9ca3af;
    margin-bottom: 8px;
}

.poi-group__icon {
    color: var(--primary-color);
    font-size: 0.75rem;
    opacity: 0.85;
}

.poi-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    padding: 8px 12px;
    background: rgba(248, 246, 243, 0.7);
    border: 1.5px solid rgba(15, 23, 42, 0.07);
    border-radius: 10px;
    margin-bottom: 6px;
}

.poi-item:last-child {
    margin-bottom: 0;
}

.poi-item__name {
    font-size: 0.83rem;
    font-weight: 600;
    color: var(--text-dark);
    flex: 1;
    min-width: 0;
}

.poi-item__dist {
    flex: 0 0 auto;
    font-size: 0.72rem;
    font-weight: 800;
    color: #9ca3af;
    white-space: nowrap;
}
</style>
@endpush
