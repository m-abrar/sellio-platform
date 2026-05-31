{{--
    Administrative Intelligence Component: Booking Filter Protocol
    
    This partial facilitates the temporal filtering of booking analytics. 
    It orchestrates date-range selection and range-badge feedback, 
    ensuring precise analytical scoping for reservation velocity reports.
    
    @context Analytical Reporting
    @variables string $startDateFormatted The localized start date of the analysis period.
    @variables string $endDateFormatted The localized end date of the analysis period.
--}}
{{-- Filter Protocol --}}
<div class="card registry-card-premium registry-filter-card mb-5">
    <div class="card-body">
        <form action="{{ url()->current() }}" method="GET" class="row align-items-end">
            <div class="col-lg-7 mb-3 mb-lg-0">
                <label class="form-label-premium">{{ __('Analysis Period') }}</label>
                <input type="hidden" id="bookings_start_date" name="start_date" value="{{ $startDateFormatted ?? '' }}">
                <input type="hidden" id="bookings_end_date" name="end_date" value="{{ $endDateFormatted ?? '' }}">
                <div class="input-group input-group-premium report-date-range-shell">
                    <div class="input-group-prepend">
                        <span class="input-group-text"><i class="fas fa-calendar-alt text-xs"></i></span>
                    </div>
                    <input type="text"
                           class="form-control report-date-range-picker"
                           value="{{ trim(($startDateFormatted ?? '') . (($startDateFormatted ?? false) && ($endDateFormatted ?? false) ? ' to ' : '') . ($endDateFormatted ?? '')) }}"
                           placeholder="{{ __('Select booking analysis range') }}"
                           readonly
                           data-start-input="#bookings_start_date"
                           data-end-input="#bookings_end_date">
                </div>
            </div>
            <div class="col-lg-3 mb-3 mb-lg-0">
                <label class="form-label-premium">{{ __('Quick Range') }}</label>
                <div class="report-range-presets">
                    <button type="button" class="report-range-chip" data-report-range="7">{{ __('7D') }}</button>
                    <button type="button" class="report-range-chip" data-report-range="30">{{ __('30D') }}</button>
                    <button type="button" class="report-range-chip" data-report-range="month">{{ __('MTD') }}</button>
                </div>
            </div>
            <div class="col-lg-2">
                <div class="d-flex align-items-center justify-content-end gap-12">
                    <button type="submit" class="btn-filter-premium flex-grow-1">
                        <i class="fas fa-sync-alt mr-2"></i> {{ __('UPDATE') }}
                    </button>
                    <a href="{{ url()->current() }}" class="btn-reset-premium" data-toggle="tooltip" title="{{ __('Reset Range') }}">
                        <i class="fas fa-undo"></i>
                    </a>
                </div>
            </div>
        </form>
        @if(isset($startDateFormatted) && isset($endDateFormatted))
            <div class="mt-3 text-center">
                <span class="badge badge-pill badge-primary-soft px-3 py-2">
                    <i class="fas fa-history mr-1"></i> {{ __('Data range:') }} {{ $startDateFormatted }} — {{ $endDateFormatted }}
                </span>
            </div>
        @endif
    </div>
</div>
