{{-- Filter Protocol --}}
<div class="card registry-card-premium registry-filter-card mb-5">
    <div class="card-body">
        <form action="{{ route('admin.reports.properties') }}" method="GET" class="row align-items-end">
            <div class="col-md-5 mb-3 mb-md-0">
                <label class="form-label-premium">Audit Period (Start)</label>
                <div class="input-group input-group-premium">
                    <div class="input-group-prepend">
                        <span class="input-group-text"><i class="fas fa-calendar-alt text-xs"></i></span>
                    </div>
                    <input type="date" name="start_date" class="form-control" value="{{ $startDateFormatted ?? '' }}">
                </div>
            </div>
            <div class="col-md-5 mb-3 mb-md-0">
                <label class="form-label-premium">Audit Period (End)</label>
                <div class="input-group input-group-premium">
                    <div class="input-group-prepend">
                        <span class="input-group-text"><i class="fas fa-calendar-check text-xs"></i></span>
                    </div>
                    <input type="date" name="end_date" class="form-control" value="{{ $endDateFormatted ?? '' }}">
                </div>
            </div>
            <div class="col-md-2">
                <div class="d-flex align-items-center justify-content-end" style="gap: 12px;">
                    <button type="submit" class="btn-filter-premium flex-grow-1">
                        <i class="fas fa-sync-alt mr-2"></i> UPDATE
                    </button>
                    <a href="{{ route('admin.reports.properties') }}" class="btn-reset-premium" data-toggle="tooltip" title="Reset Range">
                        <i class="fas fa-undo"></i>
                    </a>
                </div>
            </div>
        </form>
        @if(isset($startDateFormatted) && isset($endDateFormatted))
            <div class="mt-3 text-center">
                <span class="badge badge-pill badge-primary-soft px-3 py-2">
                    <i class="fas fa-history mr-1"></i> Scan Period: {{ $startDateFormatted }} — {{ $endDateFormatted }}
                </span>
            </div>
        @endif
    </div>
</div>
