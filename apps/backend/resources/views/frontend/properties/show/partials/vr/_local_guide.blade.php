{{-- Local Activities & Dining --}}
<h5 class="fw-800 text-dark mb-4 local-guide-heading">
    <i class="bi bi-compass-fill local-guide-heading__icon" aria-hidden="true"></i>
    {{ __('Local Activities & Dining') }}
</h5>

<div class="local-guide-grid">
    {{-- Explore --}}
    <div class="local-guide-card">
        <div class="local-guide-card__head">
            <span class="local-guide-card__icon-wrap" aria-hidden="true">
                <i class="bi bi-binoculars-fill"></i>
            </span>
            <span class="local-guide-card__cat">{{ __('Explore') }}</span>
        </div>
        <ul class="local-guide-list">
            <li class="local-guide-item">
                <span class="local-guide-item__icon" aria-hidden="true"><i class="bi bi-tsunami"></i></span>
                <span class="local-guide-item__name">{{ __('Surfing lessons') }}</span>
                <span class="local-guide-item__dist">5 min walk</span>
            </li>
            <li class="local-guide-item">
                <span class="local-guide-item__icon" aria-hidden="true"><i class="bi bi-scooter"></i></span>
                <span class="local-guide-item__name">{{ __('Bike / Scooter Rentals') }}</span>
                <span class="local-guide-item__dist">0.8 mi</span>
            </li>
            <li class="local-guide-item">
                <span class="local-guide-item__icon" aria-hidden="true"><i class="bi bi-signpost-2"></i></span>
                <span class="local-guide-item__name">{{ __('Nature Preserve Trail') }}</span>
                <span class="local-guide-item__dist">1 mi</span>
            </li>
        </ul>
    </div>

    {{-- Dining & Nightlife --}}
    <div class="local-guide-card">
        <div class="local-guide-card__head">
            <span class="local-guide-card__icon-wrap" aria-hidden="true">
                <i class="bi bi-cup-hot-fill"></i>
            </span>
            <span class="local-guide-card__cat">{{ __('Dining & Nightlife') }}</span>
        </div>
        <ul class="local-guide-list">
            <li class="local-guide-item">
                <span class="local-guide-item__icon" aria-hidden="true"><i class="bi bi-cup-straw"></i></span>
                <span class="local-guide-item__name">{{ __('Beach Bar & Grill') }}</span>
                <span class="local-guide-item__dist">2 blocks</span>
            </li>
            <li class="local-guide-item">
                <span class="local-guide-item__icon" aria-hidden="true"><i class="bi bi-fork-knife"></i></span>
                <span class="local-guide-item__name">{{ __('Fine Dining District') }}</span>
                <span class="local-guide-item__dist">10 min drive</span>
            </li>
            <li class="local-guide-item">
                <span class="local-guide-item__icon" aria-hidden="true"><i class="bi bi-bag-fill"></i></span>
                <span class="local-guide-item__name">{{ __('Farmers Market') }} <span class="local-guide-item__note">(Sat)</span></span>
                <span class="local-guide-item__dist">1.5 mi</span>
            </li>
        </ul>
    </div>
</div>

@push('styles')
<style>
/* ── Local guide heading ─────────────────────────────────────────── */
.local-guide-heading {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 1.05rem;
    letter-spacing: -0.01em;
}

.local-guide-heading__icon {
    color: var(--primary-color);
    font-size: 1rem;
    opacity: 0.85;
}

/* ── Two-column grid ─────────────────────────────────────────────── */
.local-guide-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
    margin-bottom: 4px;
}

/* ── Category card ───────────────────────────────────────────────── */
.local-guide-card {
    background: rgba(248, 246, 243, 0.75);
    border: 1.5px solid rgba(15, 23, 42, 0.07);
    border-radius: 16px;
    padding: 18px 20px;
}

.local-guide-card__head {
    display: flex;
    align-items: center;
    gap: 11px;
    margin-bottom: 16px;
    padding-bottom: 14px;
    border-bottom: 1.5px solid rgba(15, 23, 42, 0.07);
}

.local-guide-card__icon-wrap {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex: 0 0 auto;
    width: 36px;
    height: 36px;
    border-radius: 10px;
    background: rgba(var(--primary-color-rgb), 0.1);
    color: var(--primary-color);
    font-size: 0.95rem;
}

.local-guide-card__cat {
    font-size: 0.88rem;
    font-weight: 800;
    color: var(--text-dark);
    letter-spacing: -0.01em;
}

/* ── Item list ───────────────────────────────────────────────────── */
.local-guide-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 11px;
}

.local-guide-item {
    display: flex;
    align-items: center;
    gap: 9px;
}

.local-guide-item__icon {
    flex: 0 0 auto;
    width: 20px;
    text-align: center;
    color: var(--primary-color);
    font-size: 0.82rem;
    opacity: 0.75;
}

.local-guide-item__name {
    flex: 1;
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--text-dark);
    min-width: 0;
}

.local-guide-item__note {
    font-weight: 500;
    color: #9ca3af;
    font-size: 0.78rem;
}

.local-guide-item__dist {
    flex: 0 0 auto;
    font-size: 0.75rem;
    font-weight: 800;
    color: #9ca3af;
    letter-spacing: 0.01em;
    white-space: nowrap;
}

/* ── Responsive ──────────────────────────────────────────────────── */
@media (max-width: 575.98px) {
    .local-guide-grid {
        grid-template-columns: 1fr;
    }

    .local-guide-card {
        padding: 16px;
    }
}
</style>
@endpush
