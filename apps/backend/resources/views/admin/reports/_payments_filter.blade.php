{{-- Filter Protocol --}}
<div class="card registry-card-premium registry-filter-card mb-5">
    <div class="card-body">
        <form action="{{ route('admin.reports.payments') }}" method="GET" class="row align-items-end">
            <div class="col-md-5">
                <label class="form-label-premium">Analytics Period (Start)</label>
                <div class="input-group input-group-premium">
                    <div class="input-group-prepend">
                        <span class="input-group-text"><i class="fas fa-calendar-alt text-xs"></i></span>
                    </div>
                    <input type="date" name="start_date" class="form-control" value="{{ $startDateFormatted ?? '' }}">
                </div>
            </div>
            <div class="col-md-5">
                <label class="form-label-premium">Analytics Period (End)</label>
                <div class="input-group input-group-premium">
                    <div class="input-group-prepend">
                        <span class="input-group-text"><i class="fas fa-calendar-check text-xs"></i></span>
                    </div>
                    <input type="date" name="end_date" class="form-control" value="{{ $endDateFormatted ?? '' }}">
                </div>
            </div>
            <div class="col-md-2">
                <div class="d-flex align-items-center justify-content-end gap-12">
                    <button type="submit" class="btn-filter-premium flex-grow-1">
                        <i class="fas fa-sync-alt mr-2"></i> UPDATE
                    </button>
                    <a href="{{ route('admin.reports.payments') }}" class="btn-reset-premium" data-toggle="tooltip" title="Reset Range">
                        <i class="fas fa-undo"></i>
                    </a>
                </div>
            </div>
        </form>
        @if(isset($startDateFormatted) && isset($endDateFormatted))
            <div class="mt-3">
                <span class="badge badge-pill badge-primary-soft text-primary px-3 py-2 font-weight-bold smallest uppercase letter-spacing-1">
                    <i class="fas fa-coins mr-1"></i> ANALYZING PERIOD: {{ $startDateFormatted }} — {{ $endDateFormatted }}
                </span>
            </div>
        @endif
    </div>
</div>
