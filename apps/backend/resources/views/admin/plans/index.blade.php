{{--
    Administrative Financial Module: Subscription Plan Registry
    
    This view provides the authoritative command center for managing 
    platform-wide monetization tiers. It aggregates plan identities, 
    pricing analysis, resource quotas, and publication status, 
    facilitating efficient auditing and moderation of the 
    platform's subscription offerings.
    
    @extends adminlte::page
    @context Financial Management
    @variables Collection $plans Collection of Plan model instances.
--}}
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
                <div class="d-flex justify-content-end align-items-center gap-12">
                    <a href="{{ route('admin.welcome') }}" class="btn-back shadow-sm">
                        <i class="fas fa-th-large"></i> Dashboard
                    </a>
                    <a href="{{ route('admin.plans.create') }}" class="btn btn-primary btn-registry-add">
                        <i class="fas fa-plus-circle mr-2"></i> ADD TIER
                    </a>
                </div>
            </div>
        </div>
    </div>
@stop

@section('content')
<div class="container-fluid">
    @include('admin.alert')

    {{-- Filter Protocol --}}
    @include('admin.plans._filter')

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
                <table id="plans-table" class="table table-hover table-premium mb-0 datatable-init"
                       data-datatable-config='{"paging": false, "info": false, "searching": false, "ordering": true}'>
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
                                        <div class="icon-box-soft bg-primary-soft mr-3 d-flex align-items-center justify-content-center icon-box-45 rounded-12">
                                            <i class="fas fa-boxes text-primary"></i>
                                        </div>
                                        <div>
                                            <span class="d-block font-weight-bold text-dark mb-0 font-0-95">{{ $plan->title }}</span>
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
                                    <div class="text-dark font-weight-bold font-1-05">
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
                                    <div class="d-flex flex-column gap-4-p">
                                        <div class="smallest text-dark font-weight-bold uppercase letter-spacing-1">
                                            <i class="fas fa-th-list mr-2 text-primary opacity-50 icon-box-15"></i>
                                            Assets: {!! $plan->max_listings === null ? '<span class="text-primary">∞</span>' : $plan->max_listings !!}
                                        </div>
                                        <div class="smallest text-dark font-weight-bold uppercase letter-spacing-1">
                                            <i class="fas fa-star mr-2 text-warning icon-box-15"></i>
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
                                                    data-action="delete-trigger"
                                                    data-confirm-title="Decommission Tier?"
                                                    data-confirm-text="All subscriptions tied to this tier will be affected.">
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
                                        <a href="{{ route('admin.plans.create') }}" class="btn btn-primary btn-registry-add">
                                            <i class="fas fa-plus mr-2"></i> CREATE FIRST TIER
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

@section('js')
<script src="{{ asset('admin-assets/pages/registry-index.js') }}"></script>
@endsection
