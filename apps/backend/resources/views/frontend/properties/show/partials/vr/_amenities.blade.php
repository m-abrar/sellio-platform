<section id="amenities" class="mt-5">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <h4 class="fw-800 text-dark mb-0 section-title">{{ __('What this home offers') }}</h4>
    </div>

    @if ($property->amenities->isNotEmpty())
        <div class="amenities-grid">
            @foreach($property->amenities as $amenity)
                <div class="amenity-chip">
                    <i class="{{ $amenity->icon ?? 'bi bi-check2-circle' }} amenity-chip__icon" aria-hidden="true"></i>
                    <span class="amenity-chip__label">{{ $amenity->title }}</span>
                </div>
            @endforeach
        </div>
    @endif
</section>

@push('styles')
<style>
/* ── Amenity chip grid ───────────────────────────────────────────── */
.amenities-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}

.amenity-chip {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 9px 16px;
    background: rgba(248, 246, 243, 0.8);
    border: 1.5px solid rgba(15, 23, 42, 0.08);
    border-radius: 999px;
    transition: border-color 0.15s ease, background 0.15s ease;
}

.amenity-chip:hover {
    background: rgba(var(--primary-color-rgb), 0.05);
    border-color: rgba(var(--primary-color-rgb), 0.25);
}

.amenity-chip__icon {
    color: var(--primary-color);
    font-size: 0.88rem;
    opacity: 0.85;
    flex: 0 0 auto;
}

.amenity-chip__label {
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--text-dark);
    white-space: nowrap;
}
</style>
@endpush
