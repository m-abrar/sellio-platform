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

<div class="availability-heading d-flex flex-column flex-lg-row justify-content-between align-items-lg-end gap-3 mb-4">
    <div>
        <h4 class="fw-800 mb-1"><i class="bi bi-calendar-range me-2"></i>{{ __('Availability') }}</h4>
        <p class="small text-muted mb-0">
            {{ __('Booked and pending stays are blocked from new reservations.') }}
        </p>
    </div>

    <div class="availability-toolbar" data-availability-controls>
        <span class="availability-count">
            {{ trans_choice(':count blocked stay|:count blocked stays', $displayBookings->count(), ['count' => $displayBookings->count()]) }}
        </span>
        <div class="availability-nav" aria-label="{{ __('Calendar navigation') }}">
            <button type="button" class="availability-nav__btn" data-availability-prev aria-label="{{ __('Previous months') }}">
                <i class="bi bi-chevron-left"></i>
            </button>
            <button type="button" class="availability-nav__btn" data-availability-next aria-label="{{ __('Next months') }}">
                <i class="bi bi-chevron-right"></i>
            </button>
        </div>
    </div>
</div>

<div class="availability-calendar-panel" data-availability-calendar>
    <div class="availability-summary">
        <div>
            <span class="availability-summary__label">{{ __('Next Available') }}</span>
            <strong>{{ $nextAvailableDate ? $nextAvailableDate->format('M j, Y') : __('Check back soon') }}</strong>
        </div>
        <div>
            <span class="availability-summary__label">{{ __('Blocked Nights') }}</span>
            <strong>{{ $blockedNightCount }}</strong>
        </div>
        <div>
            <span class="availability-summary__label">{{ __('Minimum Stay') }}</span>
            <strong>{{ trans_choice(':count night|:count nights', max(1, (int) ($property->minimum_rental_days ?? 1)), ['count' => max(1, (int) ($property->minimum_rental_days ?? 1))]) }}</strong>
        </div>
    </div>

    <div class="availability-legend" aria-label="{{ __('Calendar legend') }}">
        <span class="availability-legend__item">
            <span class="availability-dot is-available" aria-hidden="true"></span>{{ __('Available') }}
        </span>
        @foreach($statusMeta as $meta)
            <span class="availability-legend__item">
                <span class="availability-dot {{ $meta['class'] }}" aria-hidden="true"></span>{{ $meta['label'] }}
            </span>
        @endforeach
    </div>

    <div class="availability-months" data-availability-months>
        @foreach($availabilityMonths as $monthIndex => $month)
            @php
                $leadingBlanks = $month->copy()->startOfMonth()->dayOfWeek;
                $daysInMonth = $month->daysInMonth;
            @endphp

            <section class="availability-month" data-availability-month data-month-index="{{ $monthIndex }}" aria-label="{{ $month->format('F Y') }}">
                <div class="availability-month__header">
                    <span>{{ $month->format('F') }}</span>
                    <strong>{{ $month->format('Y') }}</strong>
                </div>

                <div class="availability-weekdays" aria-hidden="true">
                    @foreach(['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as $weekday)
                        <span>{{ __($weekday) }}</span>
                    @endforeach
                </div>

                <div class="availability-days">
                    @for($blank = 0; $blank < $leadingBlanks; $blank++)
                        <span class="availability-day is-empty" aria-hidden="true"></span>
                    @endfor

                    @for($day = 1; $day <= $daysInMonth; $day++)
                        @php
                            $date = $month->copy()->day($day);
                            $dateKey = $date->toDateString();
                            $status = $blockedDates[$dateKey] ?? null;
                            $meta = $status ? ($statusMeta[$status] ?? $statusMeta['confirmed']) : null;
                            $previousStatus = $blockedDates[$date->copy()->subDay()->toDateString()] ?? null;
                            $nextStatus = $blockedDates[$date->copy()->addDay()->toDateString()] ?? null;
                            $isBlocked = (bool) $status;
                            $isRangeStart = $isBlocked && $previousStatus !== $status;
                            $isRangeEnd = $isBlocked && $nextStatus !== $status;
                            $isRangeMiddle = $isBlocked && !$isRangeStart && !$isRangeEnd;
                            $isRangeSingle = $isBlocked && $isRangeStart && $isRangeEnd;
                            $classes = collect([
                                'availability-day',
                                $date->isSameDay($today) ? 'is-today' : null,
                                $date->lt($today) ? 'is-past' : null,
                                $meta['class'] ?? null,
                                $isRangeStart ? 'is-range-start' : null,
                                $isRangeMiddle ? 'is-range-middle' : null,
                                $isRangeEnd ? 'is-range-end' : null,
                                $isRangeSingle ? 'is-range-single' : null,
                            ])->filter()->implode(' ');
                        @endphp

                        <span
                            class="{{ $classes }}"
                            title="{{ $date->format('M j, Y') }}{{ $meta ? ' - ' . $meta['label'] : ' - ' . __('Available') }}"
                            aria-label="{{ $date->format('M j, Y') }}{{ $meta ? ' - ' . $meta['label'] : ' - ' . __('Available') }}"
                        >
                            <span class="availability-day__number">{{ $day }}</span>
                        </span>
                    @endfor
                </div>
            </section>
        @endforeach
    </div>
</div>

@if($displayBookings->isNotEmpty())
    <div class="availability-ranges mt-3">
        @foreach($displayBookings->take(8) as $booking)
            @php
                $status = $booking['status'] ?? 'confirmed';
                $meta = $statusMeta[$status] ?? $statusMeta['confirmed'];
            @endphp

            <div class="availability-range">
                <span class="availability-dot {{ $meta['class'] }}" aria-hidden="true"></span>
                <strong>{{ $meta['label'] }}</strong>
                <span>
                    {{ \Carbon\Carbon::parse($booking['start'])->format('M j, Y') }}
                    -
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
        .availability-heading .fw-800 {
            font-weight: 800;
        }

        .availability-toolbar {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            align-self: flex-start;
        }

        .availability-count {
            display: inline-flex;
            align-items: center;
            min-height: 38px;
            padding: 0 14px;
            border: 1px solid rgba(15, 23, 42, 0.08);
            border-radius: 999px;
            background: rgba(248, 250, 252, 0.9);
            color: #0f172a;
            font-size: 0.82rem;
            font-weight: 900;
        }

        .availability-nav {
            display: inline-flex;
            gap: 6px;
            padding: 4px;
            border: 1px solid rgba(15, 23, 42, 0.08);
            border-radius: 999px;
            background: rgba(248, 250, 252, 0.9);
        }

        .availability-nav__btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 30px;
            height: 30px;
            border: 0;
            border-radius: 999px;
            background: transparent;
            color: #334155;
            transition: background-color 0.16s ease, color 0.16s ease, opacity 0.16s ease;
        }

        .availability-nav__btn:hover:not(:disabled) {
            background: rgba(var(--bs-primary-rgb, 13, 110, 253), 0.1);
            color: var(--bs-primary, #0d6efd);
        }

        .availability-nav__btn:disabled {
            opacity: 0.35;
            cursor: not-allowed;
        }

        .availability-calendar-panel {
            background: #fff;
            border: 1px solid rgba(15, 23, 42, 0.08);
            border-radius: 18px;
            padding: 18px 0 0;
        }

        .availability-summary {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 0;
            margin-bottom: 18px;
            padding: 0 18px 18px;
            border-bottom: 1px solid rgba(15, 23, 42, 0.08);
        }

        .availability-summary > div {
            padding: 2px 18px;
            border-right: 1px solid rgba(15, 23, 42, 0.08);
        }

        .availability-summary > div:first-child {
            padding-left: 0;
        }

        .availability-summary > div:last-child {
            border-right: 0;
            padding-right: 0;
        }

        .availability-summary__label {
            display: block;
            color: #64748b;
            font-size: 0.68rem;
            font-weight: 900;
            letter-spacing: 0.04em;
            text-transform: uppercase;
            margin-bottom: 4px;
        }

        .availability-summary strong {
            color: #0f172a;
            font-size: 0.98rem;
            font-weight: 900;
        }

        .availability-legend {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin-bottom: 18px;
            padding: 0 18px;
        }

        .availability-legend__item,
        .availability-range {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            color: #475569;
            font-size: 0.86rem;
            font-weight: 800;
        }

        .availability-dot {
            flex: 0 0 auto;
            display: inline-block;
            width: 9px;
            height: 9px;
            border-radius: 999px;
            background: #22c55e;
            box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
        }

        .availability-dot.is-confirmed {
            background: #ef4444;
            box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
        }

        .availability-dot.is-pending {
            background: #f59e0b;
            box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.12);
        }

        .availability-months {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 0;
            border-top: 1px solid rgba(15, 23, 42, 0.08);
        }

        .availability-month {
            display: none;
            background: transparent;
            border-right: 1px solid rgba(15, 23, 42, 0.08);
            padding: 18px;
        }

        .availability-month.is-visible {
            display: block;
        }

        .availability-month.is-visible-last {
            border-right: 0;
        }

        .availability-month__header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            color: #0f172a;
            font-size: 1.05rem;
            font-weight: 900;
            margin-bottom: 16px;
            padding-bottom: 12px;
        }

        .availability-weekdays,
        .availability-days {
            display: grid;
            grid-template-columns: repeat(7, minmax(0, 1fr));
            column-gap: 0;
            row-gap: 8px;
        }

        .availability-weekdays {
            margin-bottom: 10px;
            color: #64748b;
            font-size: 0.7rem;
            font-weight: 900;
            text-align: center;
        }

        .availability-day {
            position: relative;
            isolation: isolate;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            min-height: 34px;
            aspect-ratio: 1;
            color: #1e293b;
            font-size: 0.84rem;
            font-weight: 850;
        }

        .availability-day::before {
            content: "";
            position: absolute;
            inset: 2px;
            z-index: -1;
            border-radius: 999px;
            background: transparent;
            transition: background-color 0.16s ease;
        }

        .availability-day__number {
            position: relative;
            z-index: 1;
        }

        .availability-day.is-empty::before {
            background: transparent;
            border-color: transparent;
        }

        .availability-day.is-past {
            color: #cbd5e1;
        }

        .availability-day.is-today::after {
            content: "";
            position: absolute;
            inset: 0;
            border: 2px solid rgba(var(--bs-primary-rgb, 13, 110, 253), 0.42);
            border-radius: 999px;
            pointer-events: none;
        }

        .availability-day.is-confirmed,
        .availability-day.is-pending {
            color: #fff;
        }

        .availability-day.is-confirmed::before {
            background: #ef4444;
        }

        .availability-day.is-pending::before {
            background: #f59e0b;
        }

        .availability-day.is-range-start:not(.is-range-single)::before {
            right: -1px;
            border-radius: 999px 0 0 999px;
        }

        .availability-day.is-range-middle::before {
            left: -1px;
            right: -1px;
            border-radius: 0;
        }

        .availability-day.is-range-end:not(.is-range-single)::before {
            left: -1px;
            border-radius: 0 999px 999px 0;
        }

        .availability-day:not(.is-empty):not(.is-past):hover::before {
            background: rgba(15, 23, 42, 0.06);
        }

        .availability-ranges {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
        }

        .availability-range {
            background: rgba(248, 250, 252, 0.9);
            border: 1px solid rgba(15, 23, 42, 0.08);
            border-radius: 999px;
            padding: 9px 12px;
        }

        @media (max-width: 991.98px) {
            .availability-months {
                grid-template-columns: repeat(2, minmax(0, 1fr));
            }
        }

        @media (max-width: 767.98px) {
            .availability-toolbar {
                width: 100%;
                justify-content: space-between;
            }

            .availability-months {
                grid-template-columns: 1fr;
            }
        }

        @media (max-width: 575.98px) {
            .availability-heading {
                margin-bottom: 14px !important;
            }

            .availability-heading h4 {
                font-size: 1.12rem;
            }

            .availability-toolbar {
                gap: 8px;
            }

            .availability-count {
                min-height: 34px;
                padding: 0 12px;
                font-size: 0.76rem;
            }

            .availability-calendar-panel {
                padding-top: 14px;
                border-radius: 16px;
            }

            .availability-summary {
                grid-template-columns: repeat(3, minmax(0, 1fr));
                gap: 0;
                padding: 0 14px 14px;
            }

            .availability-summary > div {
                border-right: 1px solid rgba(15, 23, 42, 0.08);
                padding: 0 8px;
            }

            .availability-summary > div:first-child {
                padding-left: 0;
            }

            .availability-summary > div:last-child {
                border-right: 0;
                padding-right: 0;
            }

            .availability-summary__label {
                font-size: 0.56rem;
                line-height: 1.2;
            }

            .availability-summary strong {
                display: block;
                font-size: 0.8rem;
                line-height: 1.25;
            }

            .availability-month {
                padding: 14px;
                border-right: 0;
            }

            .availability-weekdays,
            .availability-days {
                row-gap: 6px;
            }

            .availability-day {
                min-height: 32px;
                font-size: 0.8rem;
            }

            .availability-ranges {
                flex-direction: column;
                gap: 8px;
            }

            .availability-range {
                width: 100%;
                justify-content: flex-start;
                border-radius: 14px;
                padding: 10px 12px;
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
                    if (window.matchMedia('(max-width: 767.98px)').matches) {
                        return 1;
                    }

                    if (window.matchMedia('(max-width: 991.98px)').matches) {
                        return 2;
                    }

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
