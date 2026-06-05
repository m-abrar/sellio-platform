@php
    $seasonalPrices = $property->prices ?? collect();
    $baseNightlyRate = (float) ($property->price_per_night ?? 0);
@endphp

<div class="seasonal-pricing-heading d-flex flex-column flex-md-row justify-content-between align-items-md-end gap-2 mb-4">
    <div>
        <h4 class="fw-800 mb-1"><i class="bi bi-calendar2-week me-2"></i>{{ __('Seasonal rates') }}</h4>
        <p class="small text-muted mb-0">
            {{ __('Nightly rates can change by date range before fees and add-ons are applied.') }}
        </p>
    </div>

    @if($baseNightlyRate > 0)
        <span class="seasonal-pricing-base">
            {{ __('Standard') }}: <strong>{{ format_currency($baseNightlyRate, 0) }}</strong> / {{ __('night') }}
        </span>
    @endif
</div>

@if($seasonalPrices->isNotEmpty())
    <div class="seasonal-pricing-list" aria-label="{{ __('Seasonal nightly rates') }}">
        @foreach($seasonalPrices as $season)
            @php
                $startDate = $season->start_date ? \Carbon\Carbon::parse($season->start_date) : null;
                $endDate = $season->end_date ? \Carbon\Carbon::parse($season->end_date) : null;
                $seasonRate = (float) $season->price;
                $difference = $baseNightlyRate > 0 ? $seasonRate - $baseNightlyRate : 0;
            @endphp

            <article class="seasonal-pricing-row">
                <div class="seasonal-pricing-row__main">
                    <span class="seasonal-pricing-row__icon" aria-hidden="true">
                        <i class="bi bi-sun"></i>
                    </span>
                    <div>
                        <h6 class="mb-1 fw-800 text-dark">{{ $season->title }}</h6>
                        <p class="small text-muted mb-0">
                            @if($startDate && $endDate)
                                {{ $startDate->format('M j, Y') }} - {{ $endDate->format('M j, Y') }}
                            @else
                                {{ __('Flexible seasonal window') }}
                            @endif
                        </p>
                    </div>
                </div>

                <div class="seasonal-pricing-row__rate">
                    <strong>{{ format_currency($seasonRate, 0) }}</strong>
                    <span>{{ __('per night') }}</span>
                    @if($baseNightlyRate > 0 && abs($difference) >= 1)
                        <small class="{{ $difference > 0 ? 'text-danger' : 'text-success' }}">
                            {{ $difference > 0 ? '+' : '-' }}{{ format_currency(abs($difference), 0) }}
                        </small>
                    @endif
                </div>
            </article>
        @endforeach
    </div>
@else
    <div class="seasonal-pricing-empty">
        <i class="bi bi-calendar-check text-primary-color"></i>
        <div>
            <strong>{{ __('No seasonal overrides yet') }}</strong>
            <p class="small text-muted mb-0">{{ __('This stay currently uses the standard nightly rate across available dates.') }}</p>
        </div>
    </div>
@endif

@push('styles')
    <style>
        .seasonal-pricing-base {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            min-height: 38px;
            padding: 0 14px;
            border: 1px solid rgba(15, 23, 42, 0.08);
            border-radius: 999px;
            background: rgba(248, 250, 252, 0.9);
            color: #475569;
            font-size: 0.84rem;
            font-weight: 850;
            white-space: nowrap;
        }

        .seasonal-pricing-list {
            display: grid;
            gap: 12px;
        }

        .seasonal-pricing-row,
        .seasonal-pricing-empty {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 16px;
            padding: 16px;
            border: 1px solid rgba(15, 23, 42, 0.08);
            border-radius: 18px;
            background: #fff;
        }

        .seasonal-pricing-row__main {
            display: flex;
            align-items: center;
            gap: 12px;
            min-width: 0;
        }

        .seasonal-pricing-row__icon,
        .seasonal-pricing-empty > i {
            flex: 0 0 auto;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 42px;
            height: 42px;
            border-radius: 14px;
            background: rgba(var(--bs-primary-rgb, 13, 110, 253), 0.1);
            color: var(--bs-primary, #0d6efd);
            font-size: 1.12rem;
        }

        .seasonal-pricing-row__rate {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            gap: 1px;
            flex: 0 0 auto;
            text-align: right;
        }

        .seasonal-pricing-row__rate strong {
            color: var(--bs-primary, #0d6efd);
            font-size: 1.15rem;
            font-weight: 900;
            line-height: 1;
        }

        .seasonal-pricing-row__rate span,
        .seasonal-pricing-row__rate small {
            font-size: 0.76rem;
            font-weight: 850;
        }

        .seasonal-pricing-empty {
            justify-content: flex-start;
            background: rgba(248, 250, 252, 0.86);
        }

        @media (max-width: 575.98px) {
            .seasonal-pricing-row {
                align-items: flex-start;
            }

            .seasonal-pricing-row__rate strong {
                font-size: 1rem;
            }
        }
    </style>
@endpush
