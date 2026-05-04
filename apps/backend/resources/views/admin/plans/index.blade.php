@extends('adminlte::page')

@section('title', 'Subscription Plans | Tier Registry')

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-8">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-boxes mr-2 text-primary opacity-50"></i> Tier Architect & Plans
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">Manage marketplace subscription tiers, billing structures, and service quotas.</p>
            </div>
            <div class="col-sm-4 text-right">
                <div class="d-flex justify-content-end align-items-center" style="gap: 12px;">
                    <a href="{{ route('admin.welcome') }}" class="btn-back shadow-sm">
                        <i class="fas fa-th-large"></i> Dashboard
                    </a>
                    <a href="{{ route('admin.plans.create') }}" class="btn btn-primary rounded-pill px-4 font-weight-bold shadow-premium">
                        <i class="fas fa-plus-circle mr-1"></i> ADD TIER
                    </a>
                </div>
            </div>
        </div>
    </div>
@stop

@section('content')
<div class="container-fluid">
    @include('admin.alert')

    {{-- Glass Filter Card --}}
    <div class="card card-premium shadow-sm mb-4 border-0">
        <div class="card-body py-4 px-4">
            <form method="GET" action="{{ route('admin.plans.index') }}">
                <div class="row align-items-end">
                    <div class="col-md-5">
                        <label class="smallest font-weight-bold text-secondary text-uppercase mb-2 letter-spacing-1">Search Identifier</label>
                        <div class="input-group border rounded shadow-xs bg-white" style="height: 46px; padding: 2px;">
                            <div class="input-group-prepend border-0">
                                <span class="input-group-text bg-white border-0 py-0"><i class="fas fa-search text-primary"></i></span>
                            </div>
                            <input type="text" name="name" class="form-control border-0 shadow-none h-100 py-0" 
                                   placeholder="Filter by tier name or label..." value="{{ request('name') }}">
                        </div>
                    </div>
                    <div class="col-md-4">
                        <label class="smallest font-weight-bold text-secondary text-uppercase mb-2 letter-spacing-1">Billing Cycle</label>
                        <div class="input-group border rounded shadow-xs bg-white" style="height: 46px; padding: 2px;">
                            <div class="input-group-prepend border-0">
                                <span class="input-group-text bg-white border-0 py-0"><i class="fas fa-calendar-alt text-primary"></i></span>
                            </div>
                            <select name="billing_period" class="form-control border-0 custom-select shadow-none bg-white h-100 py-0">
                                <option value="">All Temporal Cycles</option>
                                <option value="monthly" {{ request('billing_period') == 'monthly' ? 'selected' : '' }}>Monthly Tiers</option>
                                <option value="annually" {{ request('billing_period') == 'annually' ? 'selected' : '' }}>Annual Tiers</option>
                            </select>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="btn-group w-100 shadow-sm rounded-pill overflow-hidden border" style="height: 46px;">
                            <button type="submit" class="btn btn-primary font-weight-bold smallest uppercase d-flex align-items-center justify-content-center">
                                <i class="fas fa-sync-alt mr-1"></i> APPLY
                            </button>
                            @if(request()->hasAny(['name', 'billing_period']))
                                <a href="{{ route('admin.plans.index') }}" class="btn btn-white px-3 border-left d-flex align-items-center justify-content-center">
                                    <i class="fas fa-undo text-danger"></i>
                                </a>
                            @endif
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </div>

    {{-- Main Table Card --}}
    <div class="card card-premium overflow-hidden">
        <div class="card-header border-0 bg-white py-4 px-4 d-flex align-items-center justify-content-between">
            <h3 class="card-title font-weight-bold text-dark mb-0 smallest text-uppercase letter-spacing-1 float-none">
                <i class="fas fa-layer-group mr-2 text-primary opacity-50"></i> Product Catalog
            </h3>
            <span class="badge badge-primary-light text-primary px-3 py-2 rounded-pill font-weight-bold smallest uppercase ml-auto">
                {{ count($plans) }} ACTIVE TIERS
            </span>
        </div>

        <div class="card-body p-0">
            <div class="table-responsive">
                <table id="plans-table" class="table table-hover table-premium mb-0">
                    <thead class="thead-light">
                        <tr>
                            <th class="pl-4">Tier Identity</th>
                            <th>Cost Analysis</th>
                            <th class="text-center">Visibility</th>
                            <th>Resource Quotas</th>
                            <th class="text-right pr-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse ($plans as $plan)
                            <tr>
                                <td class="align-middle pl-4">
                                    <div class="d-flex align-items-center">
                                        <div class="icon-box-soft bg-primary-soft mr-3 d-flex align-items-center justify-content-center" style="width:45px; height:45px; border-radius: 12px;">
                                            <i class="fas fa-boxes text-primary"></i>
                                        </div>
                                        <div>
                                            <span class="d-block font-weight-bold text-dark mb-0" style="font-size: 0.95rem;">{{ $plan->title }}</span>
                                            @if($plan->label_text)
                                                <span class="badge badge-primary-light text-primary px-2 py-1 rounded-pill font-weight-bold smallest uppercase mt-1">
                                                    {{ $plan->label_text }}
                                                </span>
                                            @else
                                                <small class="text-muted italic">{{ Str::limit($plan->description, 35) }}</small>
                                            @endif
                                        </div>
                                    </div>
                                </td>

                                <td class="align-middle">
                                    <div class="text-dark font-weight-bold" style="font-size: 1.05rem;">
                                        {{ setting('currency_symbol', '$') }}{{ number_format($plan->price, 2) }}
                                    </div>
                                    <div class="smallest text-muted text-uppercase font-weight-bold letter-spacing-1 mt-1">
                                        PER {{ $plan->billing_period }}
                                    </div>
                                </td>

                                <td class="text-center align-middle">
                                    @if($plan->is_active)
                                        <span class="badge badge-success-light px-3 py-2 rounded-pill font-weight-bold smallest uppercase letter-spacing-1">
                                            <i class="fas fa-check-circle mr-1"></i> ACTIVE
                                        </span>
                                    @else
                                        <span class="badge badge-secondary-soft text-secondary px-3 py-2 rounded-pill font-weight-bold smallest uppercase letter-spacing-1">
                                            <i class="fas fa-eye-slash mr-1"></i> DISABLED
                                        </span>
                                    @endif
                                </td>

                                <td class="align-middle">
                                    <div class="d-flex flex-column" style="gap: 4px;">
                                        <div class="smallest text-dark font-weight-bold uppercase letter-spacing-1">
                                            <i class="fas fa-th-list mr-2 text-primary opacity-50" style="width: 15px;"></i>
                                            Assets: {!! $plan->max_listings === null ? '<span class="text-primary">∞</span>' : $plan->max_listings !!}
                                        </div>
                                        <div class="smallest text-dark font-weight-bold uppercase letter-spacing-1">
                                            <i class="fas fa-star mr-2 text-warning" style="width: 15px;"></i>
                                            Priority: {!! $plan->max_featured_listings === null ? '<span class="text-primary">∞</span>' : $plan->max_featured_listings !!}
                                        </div>
                                    </div>
                                </td>

                                <td class="text-right align-middle pr-4">
                                    <div class="btn-group btn-group-premium shadow-xs rounded-pill border overflow-hidden">
                                        <a href="{{ route('admin.plans.edit', $plan->id) }}" 
                                           class="btn btn-white text-info py-2 px-3 d-inline-flex align-items-center" 
                                           data-toggle="tooltip" title="Modify Tier">
                                            <i class="fas fa-pencil-alt"></i>
                                        </a>
                                        <form id="delete-form-{{ $plan->id }}" action="{{ route('admin.plans.destroy', $plan->id) }}" method="POST" class="d-inline">
                                            @csrf @method('DELETE')
                                            <button type="button" class="btn btn-white text-danger py-2 px-3 border-left d-inline-flex align-items-center" 
                                                    data-toggle="tooltip" title="Decommission"
                                                    onclick="confirmDelete('delete-form-{{ $plan->id }}', 'Decommission Tier?', 'All subscriptions tied to this tier will be affected.', 'Confirm')">
                                                <i class="fas fa-trash-alt"></i>
                                            </button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        @empty
                            <tr class="empty-state">
                                <td colspan="5" class="text-center py-5">
                                    <div class="py-4">
                                        <i class="fas fa-boxes fa-4x text-muted opacity-25 mb-3 d-block"></i>
                                        <h5 class="text-muted font-weight-bold">No Tiers Architected</h5>
                                        <p class="text-secondary small mb-3">Initialize your monetization engine by creating your first plan.</p>
                                        <a href="{{ route('admin.plans.create') }}" class="btn btn-primary btn-sm px-4 rounded-pill font-weight-bold">
                                            <i class="fas fa-plus mr-1"></i> CREATE FIRST TIER
                                        </a>
                                    </div>
                                </td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </div>

        @if(method_exists($plans, 'links') && $plans->hasPages())
            <div class="card-footer bg-white border-top py-3 px-4">
                <div class="d-flex justify-content-between align-items-center">
                    <span class="smallest text-muted font-weight-bold text-uppercase letter-spacing-1">Catalog Pagination</span>
                    <div>
                        {{ $plans->appends(request()->query())->links('pagination::bootstrap-4') }}
                    </div>
                </div>
            </div>
        @endif
    </div>
</div>
@endsection

@section('css')
@include('admin._partials._toggle-card-css')
<style>
    .italic { font-style: italic; }
</style>
@endsection

@section('js')
@include('admin._partials._sweetalert')
<script>
    $(function () {
        $('[data-toggle="tooltip"]').tooltip();
        if($('.select2').length) {
            $('.select2').select2({ theme: 'bootstrap4', width: '100%' });
        }
    });
</script>
@endsection
