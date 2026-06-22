<h4 class="fw-800 text-dark detail-section-title mb-4">
    <i class="bi bi-shield-check me-2" style="color:var(--primary-color);font-size:.85em" aria-hidden="true"></i>
    {{ __('House Rules') }}
</h4>

{{-- Check-in / check-out strip --}}
<div class="rules-times">
    <div class="rules-time">
        <span class="rules-time__icon-wrap" aria-hidden="true">
            <i class="bi bi-box-arrow-in-right"></i>
        </span>
        <div class="rules-time__body">
            <span class="rules-time__label">{{ __('Check-in') }}</span>
            <strong class="rules-time__value">{{ __('After 4:00 PM') }}</strong>
        </div>
    </div>
    <div class="rules-time">
        <span class="rules-time__icon-wrap" aria-hidden="true">
            <i class="bi bi-box-arrow-right"></i>
        </span>
        <div class="rules-time__body">
            <span class="rules-time__label">{{ __('Check-out') }}</span>
            <strong class="rules-time__value">{{ __('10:00 AM Sharp') }}</strong>
        </div>
    </div>
</div>

{{-- General rule chips --}}
<div class="rules-chips mt-3">
    <div class="rule-chip rule-chip--no">
        <i class="bi bi-slash-circle rule-chip__icon" aria-hidden="true"></i>
        {{ __('No Smoking') }}
    </div>
    <div class="rule-chip rule-chip--no">
        <i class="bi bi-music-note-beamed rule-chip__icon" aria-hidden="true"></i>
        {{ __('No Parties or Events') }}
    </div>
    <div class="rule-chip">
        <i class="bi bi-moon-stars-fill rule-chip__icon" aria-hidden="true"></i>
        {{ __('Quiet Hours 10 PM – 8 AM') }}
    </div>
    @if(($property->maximum_guests ?? 0) > 0)
    <div class="rule-chip">
        <i class="bi bi-people-fill rule-chip__icon" aria-hidden="true"></i>
        {{ trans_choice('Max :count guest|Max :count guests', $property->maximum_guests, ['count' => $property->maximum_guests]) }}
    </div>
    @endif
    @if(($property->minimum_rental_days ?? 0) > 1)
    <div class="rule-chip">
        <i class="bi bi-calendar2-check rule-chip__icon" aria-hidden="true"></i>
        {{ trans_choice(':count night minimum|:count nights minimum', $property->minimum_rental_days, ['count' => $property->minimum_rental_days]) }}
    </div>
    @endif
</div>

@push('styles')
<style>
/* ── Check-in / check-out strip ──────────────────────────────────── */
.rules-times {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0;
    background: rgba(248, 246, 243, 0.8);
    border: 1.5px solid rgba(15, 23, 42, 0.07);
    border-radius: 14px;
    overflow: hidden;
}

.rules-time {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 18px 22px;
    border-right: 1.5px solid rgba(15, 23, 42, 0.07);
}

.rules-time:last-child {
    border-right: 0;
}

.rules-time__icon-wrap {
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

.rules-time__body {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.rules-time__label {
    font-size: 0.65rem;
    font-weight: 900;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: #9ca3af;
}

.rules-time__value {
    font-size: 0.97rem;
    font-weight: 800;
    color: var(--text-dark);
}

/* ── Rule chips ──────────────────────────────────────────────────── */
.rules-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 9px;
}

.rule-chip {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 8px 14px;
    background: rgba(248, 246, 243, 0.8);
    border: 1.5px solid rgba(15, 23, 42, 0.08);
    border-radius: 999px;
    font-size: 0.83rem;
    font-weight: 600;
    color: var(--text-dark);
}

.rule-chip--no {
    background: rgba(239, 68, 68, 0.05);
    border-color: rgba(239, 68, 68, 0.15);
}

.rule-chip__icon {
    font-size: 0.8rem;
    color: var(--primary-color);
    opacity: 0.85;
    flex: 0 0 auto;
}

.rule-chip--no .rule-chip__icon {
    color: #ef4444;
    opacity: 1;
}

/* ── Responsive ──────────────────────────────────────────────────── */
@media (max-width: 575.98px) {
    .rules-times {
        grid-template-columns: 1fr;
    }

    .rules-time {
        border-right: 0;
        border-bottom: 1.5px solid rgba(15, 23, 42, 0.07);
    }

    .rules-time:last-child {
        border-bottom: 0;
    }

    .rules-time {
        padding: 14px 16px;
    }
}
</style>
@endpush
