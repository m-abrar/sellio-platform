<div class="tours-docs-grid">
    {{-- 3D Virtual Tour --}}
    @if($property->virtual_tour)
        <a href="{{ $property->virtual_tour }}" class="asset-card" target="_blank" rel="noopener">
            <span class="asset-card__icon-wrap" aria-hidden="true">
                <i class="bi bi-camera-video-fill"></i>
            </span>
            <div class="asset-card__body">
                <span class="asset-card__title">{{ __('3D Virtual Tour') }}</span>
                <span class="asset-card__sub asset-card__sub--active">{{ __('Launch →') }}</span>
            </div>
        </a>
    @else
        <div class="asset-card asset-card--disabled" aria-disabled="true">
            <span class="asset-card__icon-wrap" aria-hidden="true">
                <i class="bi bi-camera-video-fill"></i>
            </span>
            <div class="asset-card__body">
                <span class="asset-card__title">{{ __('3D Virtual Tour') }}</span>
                <span class="asset-card__sub">{{ __('Coming soon') }}</span>
            </div>
        </div>
    @endif

    {{-- Property Brochure --}}
    <div class="asset-card asset-card--disabled" aria-disabled="true">
        <span class="asset-card__icon-wrap" aria-hidden="true">
            <i class="bi bi-file-earmark-pdf-fill"></i>
        </span>
        <div class="asset-card__body">
            <span class="asset-card__title">{{ __('Property Brochure') }}</span>
            <span class="asset-card__sub">{{ __('Request from agent') }}</span>
        </div>
    </div>
</div>

@push('styles')
<style>
.tours-docs-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}

.asset-card {
    display: inline-flex;
    align-items: center;
    gap: 14px;
    padding: 14px 20px;
    background: rgba(248, 246, 243, 0.8);
    border: 1.5px solid rgba(15, 23, 42, 0.08);
    border-radius: 14px;
    text-decoration: none;
    transition: border-color 0.15s ease, background 0.15s ease;
    min-width: 220px;
}

.asset-card:not(.asset-card--disabled):hover {
    background: rgba(var(--primary-color-rgb), 0.05);
    border-color: rgba(var(--primary-color-rgb), 0.3);
}

.asset-card--disabled {
    opacity: 0.6;
    cursor: default;
}

.asset-card__icon-wrap {
    flex: 0 0 auto;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 38px;
    height: 38px;
    border-radius: 10px;
    background: rgba(var(--primary-color-rgb), 0.1);
    color: var(--primary-color);
    font-size: 1rem;
}

.asset-card__body {
    display: flex;
    flex-direction: column;
    gap: 3px;
}

.asset-card__title {
    font-size: 0.88rem;
    font-weight: 700;
    color: var(--text-dark);
    line-height: 1.2;
}

.asset-card__sub {
    font-size: 0.7rem;
    font-weight: 800;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: #9ca3af;
}

.asset-card__sub--active {
    color: var(--primary-color);
}
</style>
@endpush
