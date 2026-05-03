@extends('adminlte::page')

@section('title', 'Subscription Plans')

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-2">
            <div class="col-sm-6">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-boxes mr-2 text-primary"></i> Subscription Plans
                </h1>
            </div>
            <div class="col-sm-6">
                <ol class="breadcrumb float-sm-right">
                    <li class="breadcrumb-item"><a href="{{ route('admin.welcome') }}">Dashboard</a></li>
                    <li class="breadcrumb-item active">Plans</li>
                </ol>
            </div>
        </div>
    </div>
@stop

@section('content')
<div class="container-fluid">
    @include('admin.alert')

    {{-- Filter Card: Blueprint Standard --}}
    <div class="card card-outline card-secondary shadow-sm mb-4 border-0">
        <div class="card-header bg-white">
            <h3 class="card-title text-muted font-weight-bold small text-uppercase">
                <i class="fas fa-filter mr-1"></i> Search Catalog
            </h3>
        </div>
        <div class="card-body">
            <form method="GET" action="{{ route('admin.plans.index') }}">
                <div class="row align-items-end">
                    <div class="col-md-5">
                        <label class="small text-muted font-weight-bold text-uppercase">Plan Identity</label>
                        <div class="input-group shadow-xs">
                            <div class="input-group-prepend">
                                <span class="input-group-text bg-white border-right-0"><i class="fas fa-search text-xs text-muted"></i></span>
                            </div>
                            <input type="text" name="name" class="form-control border-left-0 shadow-none" 
                                   placeholder="Search by plan name or description..." value="{{ request('name') }}">
                        </div>
                    </div>
                    <div class="col-md-4">
                        <label class="small text-muted font-weight-bold text-uppercase">Billing Cycle</label>
                        <select name="billing_period" class="form-control select2 shadow-none">
                            <option value="">All Cycles</option>
                            <option value="monthly" {{ request('billing_period') == 'monthly' ? 'selected' : '' }}>Monthly</option>
                            <option value="annually" {{ request('billing_period') == 'annually' ? 'selected' : '' }}>Annually</option>
                        </select>
                    </div>
                    <div class="col-md-3">
                        <div class="btn-group w-100 shadow-sm">
                            <button type="submit" class="btn btn-primary font-weight-bold">
                                <i class="fas fa-sync-alt mr-1"></i> APPLY
                            </button>
                            @if(request()->hasAny(['name', 'billing_period']))
                                <a href="{{ route('admin.plans.index') }}" class="btn btn-default border-left">
                                    <i class="fas fa-undo text-muted"></i>
                                </a>
                            @endif
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </div>

    {{-- Main Table Card --}}
    <div class="card card-primary card-outline shadow-sm border-0">
        <div class="card-header border-0 bg-white py-3">
            <h3 class="card-title font-weight-600 text-muted">
                Product Catalog <span class="badge badge-light border ml-2 px-2" style="font-weight: 500;">{{ count($plans) }} Total</span>
            </h3>
            <div class="card-tools">
                <a href="{{ route('admin.plans.create') }}" class="btn btn-primary btn-flat shadow-sm px-4">
                    <i class="fas fa-plus-circle mr-1"></i> Create New Plan
                </a>
            </div>
        </div>

        <div class="card-body p-0">
            <div class="table-responsive">
                <table id="plans-table" class="table table-hover table-premium mb-0">
                    <thead class="thead-light">
                        <tr>
                            <th class="px-4">Name & Label</th>
                            <th>Cost Analysis</th>
                            <th class="text-center">Active Status</th>
                            <th>Resource Quotas</th>
                            <th class="text-right px-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse ($plans as $plan)
                            <tr>
                                <td class="align-middle px-4">
                                    <div class="d-flex align-items-center">
                                        <div class="icon-shape mr-3 bg-light border rounded d-flex align-items-center justify-content-center shadow-xs" style="width:45px; height:45px; border-radius: 8px !important;">
                                            <i class="fas fa-layer-group text-primary"></i>
                                        </div>
                                        <div>
                                            <span class="d-block font-weight-bold text-dark mb-0">{{ $plan->title }}</span>
                                            @if($plan->label_text)
                                                <span class="badge badge-primary-light text-primary text-xs px-2 mt-1">
                                                    {{ strtoupper($plan->label_text) }}
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
                                    <small class="text-muted text-uppercase font-weight-bold text-monospace" style="font-size: 0.65rem; letter-spacing: 0.5px;">
                                        Per {{ $plan->billing_period }}
                                    </small>
                                </td>

                                <td class="text-center align-middle">
                                    <span class="badge {{ $plan->is_active ? 'badge-success-light' : 'badge-danger-light' }} px-3 py-1 text-uppercase" style="font-size: 0.7rem; letter-spacing: 0.5px; min-width: 85px;">
                                        {{ $plan->is_active ? 'Active' : 'Inactive' }}
                                    </span>
                                </td>

                                <td class="align-middle small">
                                    <div class="d-flex flex-column">
                                        <div class="mb-1 text-dark">
                                            <i class="fas fa-list-ul mr-2 text-muted" style="width: 15px;"></i>
                                            <strong>Listings:</strong> 
                                            {!! $plan->max_listings === null ? '<span class="text-primary font-weight-bold">Unlimited</span>' : $plan->max_listings !!}
                                        </div>
                                        <div class="text-dark">
                                            <i class="fas fa-star mr-2 text-warning" style="width: 15px;"></i>
                                            <strong>Featured:</strong> 
                                            {!! $plan->max_featured_listings === null ? '<span class="text-primary font-weight-bold">Unlimited</span>' : $plan->max_featured_listings !!}
                                        </div>
                                    </div>
                                </td>

                                <td class="text-right align-middle px-4">
                                    <div class="btn-group btn-group-premium shadow-sm">
                                        <a href="{{ route('admin.plans.edit', $plan->id) }}" 
                                           class="btn btn-default btn-sm text-info" 
                                           data-toggle="tooltip" title="Modify Plan">
                                            <i class="fas fa-pencil-alt"></i>
                                        </a>
                                        <form action="{{ route('admin.plans.destroy', $plan->id) }}" method="POST" class="d-inline">
                                            @csrf @method('DELETE')
                                            <button type="submit" class="btn btn-default btn-sm text-danger" 
                                                    data-toggle="tooltip" title="Delete Plan"
                                                    onclick="return confirm('Permanently delete the {{ $plan->title }} plan?')">
                                                <i class="fas fa-trash-alt"></i>
                                            </button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        @empty
                            {{-- Handled by generic empty state script --}}
                        @endforelse
                    </tbody>
                </table>
            </div>
        </div>

        @if(method_exists($plans, 'links') && $plans->hasPages())
            <div class="card-footer bg-white border-top py-3">
                <div class="d-flex justify-content-between align-items-center">
                    <span class="text-muted small font-weight-bold text-uppercase">Catalog Pagination</span>
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
<style>
    /* Blueprint Layout Utilities */
    .table-premium thead th { border-top: none; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 1px; color: #6c757d; }
    .shadow-xs { box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
    .text-monospace { font-family: 'SFMono-Regular', Consolas, monospace !important; }
    .italic { font-style: italic; }

    /* Blueprint Light Badge Classes */
    .badge-success-light { background-color: #dcfce7; color: #166534; border: 1px solid #bbf7d0; }
    .badge-danger-light { background-color: #fee2e2; color: #991b1b; border: 1px solid #fecaca; }
    .badge-primary-light { background-color: #e0f2fe; color: #0369a1; border: 1px solid #bae6fd; }

    /* Button Group Premium Style */
    .btn-group-premium .btn { border: 1px solid #e9ecef; background: #fff; }
    .btn-group-premium .btn:hover { background: #f8f9fa; }
</style>
@endsection

@section('js')
<script>
    $(function () {
        $('[data-toggle="tooltip"]').tooltip();
        if($('.select2').length) {
            $('.select2').select2({ theme: 'bootstrap4', width: '100%' });
        }
    });
</script>
@endsection
