{{--
    Administrative Intelligence Component: Financial Filter Protocol
    
    This partial facilitates the temporal scoping of revenue analytics. 
    It orchestrates date-range definition and validation for transaction 
    velocity and settlement reports.
    
    @context Analytical Reporting
    @variables string $startDateFormatted The localized start date of the analysis period.
    @variables string $endDateFormatted The localized end date of the analysis period.
--}}
{{-- Filter Protocol --}}
<div class="card registry-card-premium registry-filter-card mb-5">
    <div class="card-body">
        <form action="{{ route('admin.reports.payments') }}" method="GET" class="row align-items-end">
            <div class="col-lg-7 mb-3 mb-lg-0">
                <label class="form-label-premium">{{ __('Analytics Period') }}</label>
                <input type="hidden" id="payments_start_date" name="start_date" value="{{ $startDateFormatted ?? '' }}">
                <input type="hidden" id="payments_end_date" name="end_date" value="{{ $endDateFormatted ?? '' }}">
                <div class="input-group input-group-premium report-date-range-shell">
                    <div class="input-group-prepend">
                        <span class="input-group-text"><i class="fas fa-calendar-alt text-xs"></i></span>
                    </div>
                    <input type="text"
                           class="form-control report-date-range-picker"
                           value="{{ trim(($startDateFormatted ?? '') . (($startDateFormatted ?? false) && ($endDateFormatted ?? false) ? ' to ' : '') . ($endDateFormatted ?? '')) }}"
                           placeholder="{{ __('Select revenue analysis range') }}"
                           readonly
                           data-start-input="#payments_start_date"
                           data-end-input="#payments_end_date">
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
                    <a href="{{ route('admin.reports.payments') }}" class="btn-reset-premium" data-toggle="tooltip" title="{{ __('Reset Range') }}">
                        <i class="fas fa-undo"></i>
                    </a>
                </div>
            </div>
        </form>
        @if(isset($startDateFormatted) && isset($endDateFormatted))
            <div class="mt-3">
                <span class="badge badge-pill badge-primary-soft text-primary px-3 py-2 font-weight-bold smallest uppercase letter-spacing-1">
                    <i class="fas fa-coins mr-1"></i> {{ __('ANALYZING PERIOD:') }} {{ $startDateFormatted }} — {{ $endDateFormatted }}
                </span>
            </div>
        @endif
    </div>
</div>
