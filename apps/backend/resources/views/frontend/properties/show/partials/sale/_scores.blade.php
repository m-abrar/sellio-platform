@php
    $scoresCount = $property->scores->count();
    $normalizedTotal = 0;
    foreach($property->scores as $s) {
        $normalizedTotal += ($s->score <= 10) ? ($s->score * 10) : $s->score;
    }
    $totalScoreValue = $scoresCount > 0 ? ($normalizedTotal / $scoresCount) : 0;
    $isTotalHigh = $totalScoreValue >= 75;
@endphp

@unless($hideHeading ?? false)
<h6 class="fw-bold mb-4" style="color:var(--primary-color)">
    <i class="bi bi-bicycle me-2"></i>{{ __('Lifestyle & Accessibility') }}
</h6>
@endunless

@if ($scoresCount > 0)
    {{-- Livability summary card --}}
    <div class="livability-score-summary bg-primary p-4 mb-4 position-relative overflow-hidden rounded-4">
        <div class="row align-items-center position-relative z-1">
            <div class="col-auto">
                <div class="livability-score-ring d-flex align-items-center justify-content-center bg-white rounded-circle shadow-lg">
                    <div class="text-center">
                        <h2 class="livability-score-value fw-800 text-primary-dark mb-0 lh-1">
                            {{ number_format($totalScoreValue, 0) }}
                        </h2>
                        <div class="livability-score-scale text-muted fw-bold">/100</div>
                    </div>
                </div>
            </div>
            <div class="col">
                <h5 class="text-white fw-800 mb-1">{{ __('Livability Index') }}</h5>
                <p class="text-white text-opacity-75 small mb-0 fw-semibold tracking-wider text-uppercase">
                    {{ $isTotalHigh ? __('Highly Accessible Living') : __('Standard Local Lifestyle') }}
                </p>
            </div>
        </div>
    </div>

    {{-- Individual scores — horizontal row list --}}
    <div class="score-rows">
        @foreach ($property->scores as $score)
            @php
                $scale  = ($score->score <= 10) ? 10 : 100;
                $pct    = min(100, round(($score->score / $scale) * 100));
                $isHigh = ($scale == 100) ? ($score->score >= 70) : ($score->score >= 7);
                $label  = $score->description ?? ($isHigh ? __('Excellent') : __('Good'));

                $t = strtolower($score->title ?? '');
                $icon = match(true) {
                    str_contains($t, 'bike')    => 'bi-bicycle',
                    str_contains($t, 'walk')    => 'bi-person-walking',
                    str_contains($t, 'transit') => 'bi-bus-front-fill',
                    str_contains($t, 'safety')  => 'bi-shield-check',
                    str_contains($t, 'school')  => 'bi-mortarboard-fill',
                    str_contains($t, 'sound')   => 'bi-soundwave',
                    str_contains($t, 'air')     => 'bi-wind',
                    str_contains($t, 'crime')   => 'bi-eye-slash',
                    str_contains($t, 'park')    => 'bi-tree-fill',
                    default                     => 'bi-graph-up',
                };
            @endphp

            <div class="score-row">
                <div class="score-row__meta">
                    <span class="score-row__icon" aria-hidden="true">
                        <i class="bi {{ $icon }}"></i>
                    </span>
                    <span class="score-row__title">{{ $score->title }}</span>
                    <span class="score-row__value">
                        <strong>{{ number_format($score->score, ($scale == 10 ? 1 : 0)) }}</strong><span>/{{ $scale }}</span>
                    </span>
                </div>
                <div class="score-row__track-wrap">
                    <div
                        class="score-row__track"
                        role="progressbar"
                        aria-valuenow="{{ $score->score }}"
                        aria-valuemin="0"
                        aria-valuemax="{{ $scale }}"
                        aria-label="{{ $score->title }}: {{ $score->score }}/{{ $scale }}"
                    >
                        <div class="score-row__fill {{ $isHigh ? 'is-high' : '' }}" style="width:{{ $pct }}%"></div>
                    </div>
                    <span class="score-row__label {{ $isHigh ? 'is-high' : '' }}">{{ $label }}</span>
                </div>
            </div>
        @endforeach
    </div>
@else
    <p class="text-muted small">{{ __('No scores available.') }}</p>
@endif

@push('styles')
<style>
/* ── Score rows container ────────────────────────────────────────── */
.score-rows {
    background: rgba(248, 246, 243, 0.75);
    border: 1.5px solid rgba(15, 23, 42, 0.07);
    border-radius: 16px;
    overflow: hidden;
}

/* ── Individual row ──────────────────────────────────────────────── */
.score-row {
    padding: 15px 20px;
    border-bottom: 1.5px solid rgba(15, 23, 42, 0.06);
}

.score-row:last-child {
    border-bottom: 0;
}

/* ── Top line: icon + title + score ──────────────────────────────── */
.score-row__meta {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 10px;
}

.score-row__icon {
    flex: 0 0 auto;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 8px;
    background: rgba(var(--primary-color-rgb), 0.1);
    color: var(--primary-color);
    font-size: 0.78rem;
}

.score-row__title {
    flex: 1;
    font-size: 0.87rem;
    font-weight: 700;
    color: var(--text-dark);
    min-width: 0;
}

.score-row__value {
    flex: 0 0 auto;
    white-space: nowrap;
}

.score-row__value strong {
    font-size: 1rem;
    font-weight: 800;
    color: var(--primary-color);
    line-height: 1;
}

.score-row__value span {
    font-size: 0.7rem;
    font-weight: 700;
    color: #9ca3af;
    margin-left: 1px;
}

/* ── Bottom line: bar + label ────────────────────────────────────── */
.score-row__track-wrap {
    display: flex;
    align-items: center;
    gap: 12px;
}

.score-row__track {
    flex: 1;
    height: 5px;
    border-radius: 999px;
    background: rgba(15, 23, 42, 0.08);
    overflow: hidden;
}

.score-row__fill {
    height: 100%;
    border-radius: 999px;
    background: rgba(var(--primary-color-rgb), 0.45);
    transition: width 0.6s ease;
}

.score-row__fill.is-high {
    background: var(--primary-color);
}

.score-row__label {
    flex: 0 0 72px;
    text-align: right;
    font-size: 0.72rem;
    font-weight: 800;
    color: #9ca3af;
    white-space: nowrap;
}

.score-row__label.is-high {
    color: #16a34a;
}

/* ── Responsive ──────────────────────────────────────────────────── */
@media (max-width: 575.98px) {
    .score-row {
        padding: 13px 16px;
    }
}
</style>
@endpush
