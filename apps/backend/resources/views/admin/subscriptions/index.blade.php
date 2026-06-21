{{--
    Administrative Financial Module: Subscription All Subscriptions
    
    This view provides the authoritative Dashboard for the 
    platform's membership ecosystem. It aggregates subscriber 
    identities, service tier associations, access timelines, and 
    lifecycle statuses, facilitating efficient auditing and moderation 
    of the platform's recurring revenue memberships.
    
    @extends adminlte::page
    @context Financial Management
    @variables Collection $subscriptions Collection of Subscription model instances.
--}}
@extends('adminlte::page')

@section('title', __('Subscriptions'))

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-8">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-sync-alt mr-2 text-primary opacity-50"></i> {{ __('All Subscriptions') }}
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">{{ __('Track platform memberships, trial states, and recurring revenue pipelines.') }}</p>
            </div>
            <div class="col-sm-4 text-right">
                <div class="d-flex justify-content-end align-items-center gap-12">
                    <a href="{{ route('admin.welcome') }}" class="btn-back shadow-sm">
                        <i class="fas fa-th-large"></i> {{ __('Dashboard') }}
                    </a>
                    <a href="{{ route('admin.subscriptions.create') }}" class="btn btn-primary btn-registry-add">
                        <i class="fas fa-plus-circle mr-2"></i> {{ __('ENROLL USER') }}
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
    @include('admin.subscriptions._filter')

    {{-- Main Table --}}
    <div class="card card-premium overflow-hidden">
        <div class="card-header border-0 bg-white py-4 px-4 d-flex align-items-center">
            <h3 class="card-title font-weight-bold text-dark mb-0 smallest text-uppercase letter-spacing-1 float-none">
                <i class="fas fa-id-badge mr-2 text-primary opacity-50"></i> {{ __('All Subscriptions') }}
            </h3>
            <div class="card-tools ml-auto">
                <span class="badge badge-primary-light text-primary px-3 py-2 rounded-pill font-weight-bold smallest uppercase">
                    <i class="fas fa-users mr-1"></i> {{ $subscriptions->total() }} {{ __('ACTIVE SEATS') }}
                </span>
            </div>
        </div>

        <div class="card-body p-0">
            <div class="table-responsive">
                <table id="subscriptions-table" class="table table-hover table-premium mb-0 datatable-init"
                       data-datatable-config='{"paging": false, "info": false, "searching": false, "ordering": true}'>
                    <thead class="thead-light">
                        <tr>
                            <th class="pl-4">{{ __('Subscriber Identity') }}</th>
                            <th>{{ __('Service Tier') }}</th>
                            <th>{{ __('Access Timeline') }}</th>
                            <th class="text-center">{{ __('Status') }}</th>
                            <th class="text-right pr-4">{{ __('Actions') }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse ($subscriptions as $subscription)
                            @php
                                $statusMap = [
                                    'active'    => 'badge-success-light',
                                    'on_trial'  => 'badge-info-light',
                                    'past_due'  => 'badge-warning-light',
                                    'expired'   => 'badge-secondary-light',
                                    'cancelled' => 'badge-danger-light',
                                ];
                                $badgeClass = $statusMap[$subscription->status] ?? 'badge-secondary-soft text-secondary';
                            @endphp
                            <tr>
                                <td class="align-middle pl-4">
                                    <div class="d-flex align-items-center">
                                        <img src="{{ $subscription->user?->avatar_url ?? asset('images/fallbacks/avatar.jpg') }}"
                                             alt="{{ $subscription->user->name ?? __('Subscriber') }}"
                                             class="rounded-circle shadow-xs mr-3 object-fit-cover"
                                             width="42"
                                             height="42">
                                        <div>
                                            <span class="d-block font-weight-bold text-dark mb-0 font-0-95">{{ $subscription->user->name ?? __('Unknown User') }}</span>
                                            <small class="text-muted text-monospace smallest">{{ $subscription->user->email ?? __('N/A') }}</small>
                                        </div>
                                    </div>
                                </td>

                                <td class="align-middle">
                                    <div class="text-dark font-weight-bold">{{ $subscription->plan->title ?? __('Custom Plan') }}</div>
                                    <span class="badge badge-light border text-muted smallest uppercase font-weight-bold mt-1">
                                        <i class="fas fa-tag mr-1 text-xs opacity-50"></i> {{ __('Recurring Billing') }}
                                    </span>
                                </td>

                                <td class="align-middle">
                                    <div class="d-flex flex-column gap-4-p">
                                        <div class="smallest text-dark font-weight-bold uppercase letter-spacing-1">
                                            <i class="far fa-calendar-check mr-2 text-success icon-box-15"></i>
                                            {{ __('Started') }}: {{ $subscription->starts_at->format('M d, Y') }}
                                        </div>
                                        <div class="smallest text-dark font-weight-bold uppercase letter-spacing-1">
                                            @if(!$subscription->ends_at)
                                                <i class="fas fa-infinity mr-2 text-primary icon-box-15"></i>
                                                {{ __('Access') }}: <span class="text-primary">{{ __('PERPETUAL') }}</span>
                                            @else
                                                <i class="far fa-calendar-times mr-2 text-danger icon-box-15"></i>
                                                {{ __('Until') }}: {{ $subscription->ends_at->format('M d, Y') }}
                                            @endif
                                        </div>
                                    </div>
                                </td>

                                <td class="text-center align-middle">
                                    <span class="badge {{ $badgeClass }} px-3 py-2 rounded-pill font-weight-bold smallest uppercase letter-spacing-1 min-w-90">
                                        {{ strtoupper(str_replace('_', ' ', __($subscription->status))) }}
                                    </span>
                                </td>

                                <td class="text-right align-middle pr-4">
                                    <div class="btn-group btn-group-premium shadow-xs rounded-pill border overflow-hidden">
                                        <a href="{{ route('admin.subscriptions.edit', $subscription->id) }}" 
                                           class="btn btn-white text-info py-2 px-3 d-inline-flex align-items-center" 
                                           data-toggle="tooltip" title="{{ __('Modify Enrollment') }}">
                                            <i class="fas fa-pencil-alt"></i>
                                        </a>
                                        <form id="delete-form-{{ $subscription->id }}" action="{{ route('admin.subscriptions.destroy', $subscription->id) }}" method="POST" class="d-inline">
                                            @csrf @method('DELETE')
                                            <button type="button" class="btn btn-white text-danger py-2 px-3 border-left d-inline-flex align-items-center" 
                                                    data-toggle="tooltip" title="{{ __('Terminate') }}"
                                                    data-action="delete-trigger"
                                                    data-confirm-title="{{ __('Terminate Enrollment?') }}"
                                                    data-confirm-text="{{ __('This user will lose access to all subscription benefits immediately.') }}">
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
                                        <i class="fas fa-sync-alt fa-4x text-muted opacity-25 mb-3 d-block"></i>
                                        <h5 class="text-muted font-weight-bold">{{ __('No Enrollments Detected') }}</h5>
                                        <p class="text-secondary small mb-3">{{ __('New user subscriptions will be architected here.') }}</p>
                                        <a href="{{ route('admin.subscriptions.create') }}" class="btn btn-primary btn-registry-add">
                                            <i class="fas fa-plus mr-2"></i> {{ __('INITIALIZE ENROLLMENT') }}
                                        </a>
                                    </div>
                                </td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </div>

        @if(method_exists($subscriptions, 'hasPages') && $subscriptions->hasPages())
            <div class="card-footer bg-white border-top py-4 px-4 d-flex justify-content-between align-items-center">
                <div class="text-muted smallest font-weight-bold uppercase letter-spacing-1">{{ __('Displaying :first - :last of :total records', ['first' => $subscriptions->firstItem(), 'last' => $subscriptions->lastItem(), 'total' => $subscriptions->total()]) }}</div>
                <div>{{ $subscriptions->appends(request()->except('page'))->links('pagination::bootstrap-4') }}</div>
            </div>
        @endif
    </div>
</div>
@endsection

@section('js')
<script src="{{ asset('admin-assets/pages/registry-index.js') }}"></script>
@endsection
