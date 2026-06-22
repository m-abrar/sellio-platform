@php
    $today = now()->startOfDay();
    $calendarStart = $today->copy()->startOfMonth();
    $availabilityMonths = collect(range(0, 5))->map(fn ($offset) => $calendarStart->copy()->addMonths($offset));

    $statusMeta = [
        'confirmed' => [
            'label' => __('Booked'),
            'class' => 'is-confirmed',
            'color' => '#ef4444',
        ],
        'pending' => [
            'label' => __('Pending'),
            'class' => 'is-pending',
            'color' => '#f59e0b',
        ],
    ];

    $blockedDates = [];
    $displayBookings = collect($bookings);

    foreach ($displayBookings as $booking) {
        $status = $booking['status'] ?? 'confirmed';
        $period = \Carbon\CarbonPeriod::create($booking['start'], $booking['end']);

        foreach ($period as $date) {
            $blockedDates[$date->toDateString()] = $status;
        }
    }

    $blockedNightCount = count($blockedDates);
    $nextAvailableDate = null;
    $scanEnd = $today->copy()->addMonths(12);

    foreach (\Carbon\CarbonPeriod::create($today, $scanEnd) as $date) {
        if (!isset($blockedDates[$date->toDateString()])) {
            $nextAvailableDate = $date->copy();
            break;
        }
    }
@endphp

{{-- Section heading (prev sibling of data-availability-calendar — JS depends on this order) --}}
<div class="avail-head d-flex flex-column flex-lg-row justify-content-between align-items-lg-end gap-3 mb-4">
    <div>
        <h4 class="fw-800 text-dark detail-section-title mb-1">{{ __('Availability') }}</h4>
        <p class="small text-muted mb-0">
            {{ __('Booked and pending stays are blocked from new reservations.') }}
        </p>
    </div>
    <div class="avail-head__toolbar" data-availability-controls>
        @if($displayBookings->count() > 0)
            <span class="avail-blocked-pill">
                <i class="bi bi-moon-stars-fill me-1" style="font-size:.7rem"></i>
                {{ trans_choice(':count blocked stay|:count blocked stays', $displayBookings->count(), ['count' => $displayBookings->count()]) }}
            </span>
        @endif
        <div class="avail-nav" aria-label="{{ __('Calendar navigation') }}">
            <button type="button" class="avail-nav__btn" data-availability-prev aria-label="{{ __('Previous months') }}">
                <i class="bi bi-chevron-left"></i>
            </button>
            <button type="button" class="avail-nav__btn" data-availability-next aria-label="{{ __('Next months') }}">
                <i class="bi bi-chevron-right"></i>
            </button>
        </div>
    </div>
</div>

{{-- Calendar container (JS targets this with [data-availability-calendar]) --}}
<div class="avail-panel" data-availability-calendar>

    {{-- Stats strip --}}
    <div class="avail-stats">
        <div class="avail-stat">
            <span class="avail-stat__label">{{ __('Next Available') }}</span>
            <strong class="avail-stat__value">{{ $nextAvailableDate ? $nextAvailableDate->format('M j, Y') : __('Check back soon') }}</strong>
        </div>
        <div class="avail-stat">
            <span class="avail-stat__label">{{ __('Blocked Nights') }}</span>
            <strong class="avail-stat__value">{{ $blockedNightCount }}</strong>
        </div>
        <div class="avail-stat">
            <span class="avail-stat__label">{{ __('Min. Stay') }}</span>
            <strong class="avail-stat__value">{{ trans_choice(':count night|:count nights', max(1, (int) ($property->minimum_rental_days ?? 1)), ['count' => max(1, (int) ($property->minimum_rental_days ?? 1))]) }}</strong>
        </div>
    </div>

    {{-- Legend --}}
    <div class="avail-legend" aria-label="{{ __('Calendar legend') }}">
        <span class="avail-legend__item">
            <span class="avail-dot is-available" aria-hidden="true"></span>{{ __('Available') }}
        </span>
        @foreach($statusMeta as $meta)
            <span class="avail-legend__item">
                <span class="avail-dot {{ $meta['class'] }}" aria-hidden="true"></span>{{ $meta['label'] }}
            </span>
        @endforeach
    </div>

    {{-- Month grid --}}
    <div class="avail-months" data-availability-months>
        @foreach($availabilityMonths as $monthIndex => $month)
            @php
                $leadingBlanks = $month->copy()->startOfMonth()->dayOfWeek;
                $daysInMonth = $month->daysInMonth;
            @endphp

            <section class="avail-month" data-availability-month data-month-index="{{ $monthIndex }}" aria-label="{{ $month->format('F Y') }}">
                <div class="avail-month__header">
                    <span class="avail-month__name">{{ $month->format('F') }}</span>
                    <span class="avail-month__year">{{ $month->format('Y') }}</span>
                </div>

                <div class="avail-weekdays" aria-hidden="true">
                    @foreach(['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'] as $wd)
                        <span>{{ $wd }}</span>
                    @endforeach
                </div>

                <div class="avail-days">
                    @for($blank = 0; $blank < $leadingBlanks; $blank++)
                        <span class="avail-day is-empty" aria-hidden="true"></span>
                    @endfor

                    @for($day = 1; $day <= $daysInMonth; $day++)
                        @php
                            $date      = $month->copy()->day($day);
                            $dateKey   = $date->toDateString();
                            $status    = $blockedDates[$dateKey] ?? null;
                            $meta      = $status ? ($statusMeta[$status] ?? $statusMeta['confirmed']) : null;
                            $prevSt    = $blockedDates[$date->copy()->subDay()->toDateString()] ?? null;
                            $nextSt    = $blockedDates[$date->copy()->addDay()->toDateString()] ?? null;
                            $isBlocked = (bool) $status;
                            $isStart   = $isBlocked && $prevSt !== $status;
                            $isEnd     = $isBlocked && $nextSt !== $status;
                            $isMid     = $isBlocked && !$isStart && !$isEnd;
                            $isSingle  = $isBlocked && $isStart && $isEnd;
                            $classes   = collect([
                                'avail-day',
                                $date->isSameDay($today) ? 'is-today' : null,
                                $date->lt($today)         ? 'is-past'  : null,
                                $meta['class'] ?? null,
                                $isStart   ? 'is-range-start'  : null,
                                $isMid     ? 'is-range-middle' : null,
                                $isEnd     ? 'is-range-end'    : null,
                                $isSingle  ? 'is-range-single' : null,
                            ])->filter()->implode(' ');
                        @endphp

                        <span
                            class="{{ $classes }}"
                            title="{{ $date->format('M j, Y') }}{{ $meta ? ' – ' . $meta['label'] : ' – ' . __('Available') }}"
                            aria-label="{{ $date->format('M j, Y') }}{{ $meta ? ' – ' . $meta['label'] : ' – ' . __('Available') }}"
                        ><span class="avail-day__num">{{ $day }}</span></span>
                    @endfor
                </div>
            </section>
        @endforeach
    </div>

</div>{{-- /avail-panel --}}

@if($displayBookings->isNotEmpty())
    <div class="avail-ranges mt-3">
        @foreach($displayBookings->take(8) as $booking)
            @php
                $status = $booking['status'] ?? 'confirmed';
                $meta   = $statusMeta[$status] ?? $statusMeta['confirmed'];
            @endphp
            <div class="avail-range">
                <span class="avail-dot {{ $meta['class'] }}" aria-hidden="true"></span>
                <strong>{{ $meta['label'] }}</strong>
                <span class="text-muted">
                    {{ \Carbon\Carbon::parse($booking['start'])->format('M j, Y') }}
                    &ndash;
                    {{ \Carbon\Carbon::parse($booking['end'])->format('M j, Y') }}
                </span>
            </div>
        @endforeach
    </div>
@endif

<p class="small text-muted fst-italic mt-3 mb-0">
    {{ __('Calendar shows nightly availability. Check-out days become available after the previous stay ends.') }}
</p>

@push('styles')
<style>
/* ── Availability: heading toolbar ──────────────────────────────── */
.avail-head__toolbar {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    align-self: flex-start;
}

.avail-blocked-pill {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 7px 14px;
    background: rgba(var(--primary-color-rgb), 0.08);
    border: 1.5px solid rgba(var(--primary-color-rgb), 0.2);
    border-radius: 999px;
    color: var(--primary-color);
    font-size: 0.8rem;
    font-weight: 800;
    white-space: nowrap;
}

.avail-nav {
    display: inline-flex;
    gap: 6px;
}

.avail-nav__btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 34px;
    border: 1.5px solid rgba(15, 23, 42, 0.12);
    border-radius: 50%;
    background: #fff;
    color: var(--text-dark);
    font-size: 0.8rem;
    transition: background 0.16s ease, border-color 0.16s ease, color 0.16s ease;
}

.avail-nav__btn:hover:not(:disabled) {
    background: var(--primary-color);
    border-color: var(--primary-color);
    color: #fff;
}

.avail-nav__btn:disabled {
    opacity: 0.3;
    cursor: not-allowed;
}

/* ── Stats strip ─────────────────────────────────────────────────── */
.avail-stats {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    background: rgba(248, 246, 243, 0.8);
    border: 1.5px solid rgba(15, 23, 42, 0.07);
    border-radius: 14px;
    overflow: hidden;
    margin-bottom: 20px;
}

.avail-stat {
    padding: 16px 20px;
    border-right: 1.5px solid rgba(15, 23, 42, 0.07);
}

.avail-stat:last-child {
    border-right: 0;
}

.avail-stat__label {
    display: block;
    font-size: 0.62rem;
    font-weight: 900;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: #9ca3af;
    margin-bottom: 5px;
}

.avail-stat__value {
    font-size: 0.98rem;
    font-weight: 800;
    color: var(--text-dark);
}

/* ── Legend ──────────────────────────────────────────────────────── */
.avail-legend {
    display: flex;
    flex-wrap: wrap;
    gap: 14px;
    margin-bottom: 18px;
}

.avail-legend__item {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    font-size: 0.84rem;
    font-weight: 600;
    color: #64748b;
}

.avail-dot {
    flex: 0 0 auto;
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #22c55e;
}

.avail-dot.is-confirmed {
    background: #ef4444;
}

.avail-dot.is-pending {
    background: #f59e0b;
}

/* ── Month grid ──────────────────────────────────────────────────── */
.avail-panel {
    background: transparent;
}

.avail-months {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    border: 1.5px solid rgba(15, 23, 42, 0.07);
    border-radius: 16px;
    overflow: hidden;
    background: #fff;
}

.avail-month {
    display: none;
    padding: 20px;
    border-right: 1.5px solid rgba(15, 23, 42, 0.07);
}

.avail-month.is-visible {
    display: block;
}

.avail-month.is-visible-last {
    border-right: 0;
}

.avail-month__header {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    margin-bottom: 14px;
    padding-bottom: 12px;
    border-bottom: 1.5px solid rgba(15, 23, 42, 0.06);
}

.avail-month__name {
    font-family: var(--font-heading);
    font-size: 1.05rem;
    font-weight: 400;
    letter-spacing: -0.01em;
    color: var(--text-dark);
}

.avail-month__year {
    font-size: 0.7rem;
    font-weight: 800;
    letter-spacing: 0.05em;
    color: #94a3b8;
}

.avail-weekdays {
    display: grid;
    grid-template-columns: repeat(7, minmax(0, 1fr));
    margin-bottom: 8px;
    text-align: center;
    font-size: 0.62rem;
    font-weight: 800;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: #94a3b8;
}

.avail-days {
    display: grid;
    grid-template-columns: repeat(7, minmax(0, 1fr));
    row-gap: 3px;
}

/* ── Day cells ───────────────────────────────────────────────────── */
.avail-day {
    position: relative;
    isolation: isolate;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 32px;
    aspect-ratio: 1;
    font-size: 0.8rem;
    font-weight: 700;
    color: var(--text-dark);
    cursor: default;
}

.avail-day::before {
    content: "";
    position: absolute;
    inset: 2px;
    z-index: -1;
    border-radius: 50%;
    background: transparent;
    transition: background 0.14s ease;
}

.avail-day__num {
    position: relative;
    z-index: 1;
}

.avail-day.is-past {
    color: #d1d5db;
}

.avail-day.is-today::after {
    content: "";
    position: absolute;
    inset: 0;
    border: 2px solid rgba(var(--primary-color-rgb), 0.5);
    border-radius: 50%;
    pointer-events: none;
}

.avail-day.is-confirmed,
.avail-day.is-pending {
    color: #fff;
}

.avail-day.is-confirmed::before {
    background: #ef4444;
}

.avail-day.is-pending::before {
    background: #f59e0b;
}

.avail-day.is-range-start:not(.is-range-single)::before {
    right: -1px;
    border-radius: 50% 0 0 50%;
}

.avail-day.is-range-middle::before {
    left: -1px;
    right: -1px;
    border-radius: 0;
}

.avail-day.is-range-end:not(.is-range-single)::before {
    left: -1px;
    border-radius: 0 50% 50% 0;
}

.avail-day:not(.is-empty):not(.is-past):not(.is-confirmed):not(.is-pending):hover::before {
    background: rgba(15, 23, 42, 0.05);
}

/* ── Booked range pills ──────────────────────────────────────────── */
.avail-ranges {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.avail-range {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: rgba(248, 246, 243, 0.9);
    border: 1.5px solid rgba(15, 23, 42, 0.07);
    border-radius: 999px;
    padding: 8px 14px;
    font-size: 0.82rem;
    font-weight: 700;
    color: var(--text-dark);
}

/* ── Responsive ──────────────────────────────────────────────────── */
@media (max-width: 991.98px) {
    .avail-months {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
}

@media (max-width: 767.98px) {
    .avail-head__toolbar {
        width: 100%;
        justify-content: space-between;
    }

    .avail-months {
        grid-template-columns: 1fr;
    }

    .avail-month {
        border-right: 0;
    }
}

@media (max-width: 575.98px) {
    .avail-stats {
        border-radius: 12px;
    }

    .avail-stat {
        padding: 12px 14px;
    }

    .avail-stat__label {
        font-size: 0.56rem;
    }

    .avail-stat__value {
        font-size: 0.86rem;
    }

    .avail-month {
        padding: 14px;
    }

    .avail-day {
        min-height: 30px;
        font-size: 0.76rem;
    }

    .avail-ranges {
        flex-direction: column;
    }

    .avail-range {
        width: 100%;
        border-radius: 12px;
    }
}
</style>
@endpush

@push('scripts')
    <script>
        document.addEventListener('DOMContentLoaded', function () {
            document.querySelectorAll('[data-availability-calendar]').forEach(function (calendar) {
                const months = Array.from(calendar.querySelectorAll('[data-availability-month]'));
                const controls = calendar.previousElementSibling?.querySelector('[data-availability-controls]');
                const previousButton = controls?.querySelector('[data-availability-prev]');
                const nextButton = controls?.querySelector('[data-availability-next]');
                let startIndex = 0;

                if (!months.length || !previousButton || !nextButton) {
                    months.forEach((month, index) => month.classList.toggle('is-visible', index < 3));
                    return;
                }

                function getPerPage() {
                    if (window.matchMedia('(max-width: 767.98px)').matches) return 1;
                    if (window.matchMedia('(max-width: 991.98px)').matches) return 2;
                    return 3;
                }

                function render() {
                    const perPage = getPerPage();
                    const maxStart = Math.max(0, months.length - perPage);
                    startIndex = Math.min(startIndex, maxStart);

                    months.forEach(function (month, index) {
                        const isVisible = index >= startIndex && index < startIndex + perPage;
                        month.classList.toggle('is-visible', isVisible);
                        month.classList.toggle('is-visible-last', isVisible && index === Math.min(months.length - 1, startIndex + perPage - 1));
                    });

                    previousButton.disabled = startIndex === 0;
                    nextButton.disabled = startIndex >= maxStart;
                }

                previousButton.addEventListener('click', function () {
                    startIndex = Math.max(0, startIndex - getPerPage());
                    render();
                });

                nextButton.addEventListener('click', function () {
                    const perPage = getPerPage();
                    startIndex = Math.min(Math.max(0, months.length - perPage), startIndex + perPage);
                    render();
                });

                window.addEventListener('resize', render);
                render();
            });
        });
    </script>
@endpush
