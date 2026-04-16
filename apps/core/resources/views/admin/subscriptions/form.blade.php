@extends('adminlte::page')

@section('title', (isset($subscription) ? 'Edit' : 'Add') . ' Subscription')

@section('content_header')
<div class="container-fluid">
    <div class="row mb-2">
        <div class="col-sm-6">
            <h1 class="m-0 text-dark font-weight-bold">
                <i class="fas fa-file-invoice-dollar mr-2 text-primary"></i> 
                {{ isset($subscription) ? 'Edit Subscription' : 'Add Subscription' }}
            </h1>
        </div>
        <div class="col-sm-6 text-right">
            <a href="{{ route('admin.subscriptions.index') }}" class="btn btn-default btn-flat btn-sm shadow-sm">
                <i class="fas fa-arrow-left mr-1"></i> Back to List
            </a>
        </div>
    </div>
</div>
@stop

@section('content')
<div class="container-fluid">
    @include('admin.alert')

    <form id="subscription-form" 
          action="{{ isset($subscription) ? route('admin.subscriptions.update', $subscription->id) : route('admin.subscriptions.store') }}" 
          method="POST">
        @csrf
        @if(isset($subscription)) @method('PATCH') @endif

        <div class="row pb-5">
            {{-- Left Column --}}
            <div class="col-md-8">
                <ul class="nav nav-pills mb-3 p-1 bg-white shadow-sm rounded-pill" id="subscriptionTabs" role="tablist" style="width: fit-content;">
                    <li class="nav-item">
                        <a class="nav-link active px-4 py-2 rounded-pill" id="details-tab" data-toggle="tab" href="#details" role="tab">
                            <i class="fas fa-info-circle mr-1"></i> Details
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link px-4 py-2 rounded-pill" id="settings-tab" data-toggle="tab" href="#settings" role="tab">
                            <i class="fas fa-cogs mr-1"></i> Configuration
                        </a>
                    </li>
                    @if(isset($subscription))
                    <li class="nav-item">
                        <a class="nav-link px-4 py-2 rounded-pill" id="payments-tab" data-toggle="tab" href="#payments" role="tab">
                            <i class="fas fa-history mr-1"></i> Payment History
                        </a>
                    </li>
                    @endif
                </ul>

                <div class="tab-content" id="subscriptionTabContent">
                    <div class="tab-pane fade show active" id="details" role="tabpanel">
                        <div class="card shadow-sm rounded-3 border-0">
                            <div class="card-header bg-white border-bottom">
                                <h3 class="card-title font-weight-bold text-dark">Subscription Info</h3>
                            </div>
                            <div class="card-body">
                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="form-group">
                                            <label>User <span class="text-danger">*</span></label>
                                            <select name="user_id" class="form-control select2 shadow-none" required>
                                                @foreach($users as $user)
                                                    <option value="{{ $user->id }}" {{ old('user_id', $subscription->user_id ?? '') == $user->id ? 'selected' : '' }}>
                                                        {{ $user->name }} ({{ $user->email }})
                                                    </option>
                                                @endforeach
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="form-group">
                                            <label>Plan <span class="text-danger">*</span></label>
                                            <select name="plan_id" class="form-control shadow-none" required>
                                                @foreach($plans as $plan)
                                                    <option value="{{ $plan->id }}" {{ old('plan_id', $subscription->plan_id ?? '') == $plan->id ? 'selected' : '' }}>
                                                        {{ $plan->title }} ({{ ucfirst($plan->billing_cycle ?? 'N/A') }})
                                                    </option>
                                                @endforeach
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div class="form-group">
                                    <label>Unique Identifier (Title) <span class="text-danger">*</span></label>
                                    <input type="text" name="title" class="form-control" placeholder="e.g. main" value="{{ old('title', $subscription->title ?? 'main') }}" required>
                                </div>

                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="form-group">
                                            <label>Starts At <span class="text-danger">*</span></label>
                                            <input type="datetime-local" name="starts_at" class="form-control" value="{{ old('starts_at', isset($subscription) && $subscription->starts_at ? $subscription->starts_at->format('Y-m-d\TH:i') : now()->format('Y-m-d\TH:i')) }}" required>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="form-group">
                                            <label>Ends At (Optional)</label>
                                            <input type="datetime-local" name="ends_at" class="form-control" value="{{ old('ends_at', isset($subscription) && $subscription->ends_at ? $subscription->ends_at->format('Y-m-d\TH:i') : '') }}">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="tab-pane fade" id="settings" role="tabpanel">
                        @include('admin.subscriptions.partials.settings')
                    </div>

                    @if(isset($subscription))
                    <div class="tab-pane fade" id="payments" role="tabpanel">
                         {{-- Payment History logic here --}}
                         @include('admin.subscriptions.partials.payments-history')
                    </div>
                    @endif
                </div>
            </div>

            {{-- Right Column --}}
            <div class="col-md-4">
                <div class="sticky-top" style="top: 20px; z-index: 10;">
                    @include('admin.subscriptions.partials.action-buttons')
                </div>
            </div>
        </div>
    </form>
</div>
@endsection

@push('css')
<style>
    .sticky-top { top: 20px; }
    #subscriptionTabs.nav-pills .nav-link { color: #6c757d; font-weight: 500; transition: all 0.3s ease; border: 1px solid transparent; }
    #subscriptionTabs.nav-pills .nav-link.active { background-color: var(--primary); color: #fff !important; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
    .rounded-3 { border-radius: 0.6rem !important; }
</style>
@endpush
