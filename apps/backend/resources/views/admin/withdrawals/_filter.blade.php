{{--
    Administrative Financial Module: Payout Lifecycle Filter

    This component provides the query interface for the payout management
    registry. It orchestrates dual-axis filtration: lifecycle status
    (via pill navigation) and partner identity (via a standard select),
    ensuring efficient auditing of withdrawal queues.

    @context Financial Management - Payout Orchestration
    @variables string  $filter_status  The active lifecycle filter key.
    @variables Collection $users       Partners available for filtering.
--}}
<div class="card registry-card-premium registry-filter-card mb-4">
    <div class="card-body">
        <div class="d-flex flex-column flex-md-row align-items-center justify-content-between">

            {{-- Lifecycle pill tabs --}}
            <div class="d-flex flex-row align-items-center mb-3 mb-md-0 mr-md-4">
                <span class="form-label-premium font-weight-bold text-uppercase smallest letter-spacing-1" style="display: inline-block !important; margin-bottom: 0 !important; margin-right: 15px !important;">
                    <i class="fas fa-filter mr-1 text-primary opacity-75"></i> {{ __('Lifecycle:') }}
                </span>
                <ul class="nav nav-pills nav-pills-premium flex-nowrap bg-light p-1 rounded-pill border">
                    @foreach (['all' => 'ALL', 'pending' => 'PENDING', 'approved' => 'APPROVED', 'rejected' => 'REJECTED'] as $key => $label)
                        <li class="nav-item">
                            <a class="nav-link px-3 py-1 rounded-pill smallest font-weight-bold {{ $filter_status === $key ? 'active' : '' }}"
                               href="{{ route('admin.withdrawals.index', array_merge(request()->only('user_id'), ['status' => $key])) }}">
                                {{ __($label) }}
                            </a>
                        </li>
                    @endforeach
                </ul>
            </div>

            {{-- Partner filter + search --}}
            <div class="d-flex flex-column flex-sm-row align-items-center ml-md-auto gap-3">

                {{-- Partner select — standard input-group-premium to match search field --}}
                <div class="input-group input-group-premium shadow-sm rounded-pill overflow-hidden border mb-2 mb-sm-0 mr-sm-3">
                    <div class="input-group-prepend">
                        <span class="input-group-text bg-white border-0">
                            <i class="fas fa-user text-xs text-muted"></i>
                        </span>
                    </div>
                    <select id="user-filter"
                            class="form-control border-0 px-0 smallest font-weight-bold text-uppercase letter-spacing-1 text-muted"
                            style="min-width: 200px;"
                            data-navigate-select>
                        <option value="{{ route('admin.withdrawals.index', array_merge(request()->except('user_id', 'page'), ['status' => $filter_status])) }}">
                            {{ __('All Partners') }}
                        </option>
                        @foreach ($users as $u)
                            <option value="{{ route('admin.withdrawals.index', array_merge(request()->except('page'), ['status' => $filter_status, 'user_id' => $u->id])) }}"
                                {{ request('user_id') == $u->id ? 'selected' : '' }}>
                                {{ $u->name }} ({{ $u->email }})
                            </option>
                        @endforeach
                    </select>
                </div>

                {{-- Live search --}}
                <div class="input-group input-group-premium col-search-reduced shadow-sm rounded-pill overflow-hidden border">
                    <div class="input-group-prepend">
                        <span class="input-group-text bg-white border-0">
                            <i class="fas fa-search text-xs text-muted"></i>
                        </span>
                    </div>
                    <input type="text"
                           id="custom-search"
                           class="form-control border-0 px-0"
                           placeholder="{{ __('Search...') }}">
                </div>

            </div>
        </div>
    </div>
</div>
