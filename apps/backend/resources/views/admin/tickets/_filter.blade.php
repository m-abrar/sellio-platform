<div class="card registry-card-premium registry-filter-card mb-4">
    <div class="card-body">
        <form method="GET" action="{{ url()->current() }}">
            <input type="hidden" name="status" value="{{ request('status', 'open') }}">
            <div class="row align-items-end">
                <div class="col-md-5">
                    <label class="form-label-premium">{{ __('Search Query') }}</label>
                    <div class="input-group input-group-premium">
                        <div class="input-group-prepend">
                            <span class="input-group-text"><i class="fas fa-search text-xs"></i></span>
                        </div>
                        <input type="text" name="search" class="form-control" placeholder="{{ __('Search by title, description or ID...') }}" value="{{ request('search') }}">
                    </div>
                </div>
                <div class="col-md-4">
                    <label class="form-label-premium">{{ __('Priority Level') }}</label>
                    <div class="input-group input-group-premium">
                        <div class="input-group-prepend">
                            <span class="input-group-text"><i class="fas fa-bolt text-xs"></i></span>
                        </div>
                        <select name="priority" class="form-control select2">
                            <option value="">{{ __('All Priorities') }}</option>
                            @foreach(['urgent', 'high', 'medium', 'low'] as $p)
                                <option value="{{ $p }}" {{ request('priority') == $p ? 'selected' : '' }}>{{ strtoupper(__($p)) }}</option>
                            @endforeach
                        </select>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="d-flex align-items-center justify-content-end gap-12">
                        <button type="submit" class="btn-filter-premium flex-grow-1">
                            <i class="fas fa-sync-alt mr-2"></i> {{ __('FILTER') }}
                        </button>
                        <a href="{{ route('admin.tickets.index', ['status' => request('status', 'open')]) }}" class="btn-reset-premium" data-toggle="tooltip" title="{{ __('Reset Filters') }}">
                            <i class="fas fa-undo"></i>
                        </a>
                    </div>
                </div>
            </div>
        </form>
    </div>
</div>
