{{--
    Administrative Financial Module: Subscription Resource Registry
    
    This view provides the authoritative command center for monitoring 
    active subscription resource utilization. It aggregates user 
    identities, plan associations, real-time usage metrics (listings/featured), 
    and lifecycle statuses, facilitating efficient auditing and 
    moderation of platform resource consumption.
    
    @extends adminlte::page
    @context Financial Management
    @variables Collection $quotas Collection of SubscriptionQuota model instances.
--}}
@extends('adminlte::page')

@section('plugins.Datatables', true)

@section('title', 'Subscription Quotas')

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-2">
            <div class="col-sm-6">
                <h1 class="m-0 text-dark font-weight-bold">
                     Subscription Quotas
                </h1>
            </div>
        </div>
    </div>
@stop

@section('content')
@include('admin.alert')

<div class="card card-primary card-outline shadow-sm border-0">
    <div class="card-body">
        <form method="GET" action="{{ route('admin.subscription-quotas.index') }}">
            <div class="row g-2">
                <div class="col-md-4">
                    <select name="user_id" class="form-control">
                        <option value="">All Users</option>
                        @foreach($users as $user)
                            <option value="{{ $user->id }}" {{ request('user_id') == $user->id ? 'selected' : '' }}>
                                {{ $user->name }}
                            </option>
                        @endforeach
                    </select>
                </div>

                <div class="col-md-4">
                    <select name="plan_id" class="form-control">
                        <option value="">All Plans</option>
                        @foreach($plans as $plan)
                            <option value="{{ $plan->id }}" {{ request('plan_id') == $plan->id ? 'selected' : '' }}>
                                {{ $plan->title }}
                            </option>
                        @endforeach
                    </select>
                </div>

                <div class="col-md-2">
                    <button type="submit" class="btn btn-outline-secondary w-100">Filter</button>
                </div>
            </div>
        </form>
    </div>
</div>

<div class="card">
    <div class="card-header d-flex justify-content-between align-items-center">
        <h3 class="card-title">Quota List</h3>
    </div>
    <div class="card-body table-responsive">
        <table class="table table-hover table-premium mb-0">
            <thead class="thead-light">
                <tr>
                    <th>User</th>
                    <th>Plan</th>
                    <th>Listings Used</th>
                    <th>Featured Used</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                @foreach($quotas as $quota)
                    <tr>
                        <td>{{ $quota->subscription->user->name }}</td>
                        <td>{{ $quota->subscription->plan->title }}</td>
                        <td>{{ $quota->listings_used }} / {{ $quota->subscription->plan->listings_limit ?? '-' }}</td>
                        <td>{{ $quota->featured_used }} / {{ $quota->subscription->plan->featured_limit ?? '-' }}</td>
                        <td>
                            @php
                                $status = 'Active';
                                if($quota->subscription->ends_at && $quota->subscription->ends_at < now()) $status = 'Expired';
                                elseif($quota->listings_used >= ($quota->subscription->plan->listings_limit ?? 0) ||
                                       $quota->featured_used >= ($quota->subscription->plan->featured_limit ?? 0)) $status = 'Over Limit';
                            @endphp
                            <span class="badge {{ $status == 'Active' ? 'bg-success' : ($status == 'Expired' ? 'bg-secondary' : 'bg-danger') }}">
                                {{ $status }}
                            </span>
                        </td>
                        <td class="d-flex gap-1">
                            <a href="{{ route('admin.subscription-quotas.edit', $quota->id) }}" class="btn btn-primary btn-sm">
                                <i class="fas fa-edit"></i>
                            </a> &nbsp;&nbsp;&nbsp;

                            <form action="{{ route('admin.subscription-quotas.reset', $quota->id) }}" method="POST" onsubmit="return confirm('Reset quota for this user?');">
                                @csrf
                                <button type="submit" class="btn btn-warning btn-sm">
                                    <i class="fas fa-sync-alt"></i>
                                </button>
                            </form>
                        </td>
                    </tr>
                @endforeach
            </tbody>
        </table>

        <div class="mt-3">
            {{ $quotas->links() }}
        </div>
    </div>
</div>
@stop
