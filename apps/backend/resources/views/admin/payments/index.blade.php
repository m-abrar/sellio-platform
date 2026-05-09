{{--
    Administrative Financial Module: Transaction Ledger Registry
    
    This view provides the authoritative command center for the 
    platform's financial cashflow. It aggregates transaction records, 
    settlement statuses, gateway protocols, and fiscal values, 
    facilitating efficient auditing and moderation of the 
    marketplace's revenue stream.
    
    @extends adminlte::page
    @context Financial Management
    @variables Collection $payments Collection of Payment model instances.
--}}
@extends('adminlte::page')

@section('title', __('Payments & Revenue | Financial Intelligence'))

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-7">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-wallet mr-2 text-primary opacity-50"></i>
                    {{ $pageTitle ?? __('Financial Registry') }}
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">Monitor marketplace cashflow, transaction history, and gateway settlements.</p>
            </div>
            <div class="col-sm-5 text-right">
                <div class="d-flex justify-content-end align-items-center gap-12">
                    <a href="{{ route('admin.payments.create') }}" class="btn btn-primary btn-registry-add">
                        <i class="fas fa-plus-circle mr-2"></i> Log Transaction
                    </a>
                    <a href="{{ route('admin.welcome') }}" class="btn btn-white rounded-pill px-4 py-2 font-weight-bold shadow-sm smallest uppercase letter-spacing-1 border">
                        <i class="fas fa-th-large mr-2"></i> Dashboard
                    </a>
                </div>
            </div>
        </div>
    </div>
@stop

@section('content')
    <div class="container-fluid pb-5">
        @include('admin.alert')

        {{-- Filter Protocol --}}
        @include('admin.payments._filter')

        {{-- Payments Table Card --}}
        <div class="card card-premium shadow-premium border-0 overflow-hidden rounded-24">
            <div class="card-header border-0 bg-white py-4 px-4 d-flex align-items-center justify-content-between">
                <h3 class="card-title font-weight-bold text-dark mb-0 smallest text-uppercase letter-spacing-1 float-none">
                    <i class="fas fa-receipt mr-2 text-primary opacity-50"></i> Transaction Ledger
                </h3>
                <div class="card-tools d-flex align-items-center ml-auto">
                    <span class="badge badge-primary-light text-primary px-3 py-2 rounded-pill font-weight-bold smallest uppercase mr-3">
                        <i class="fas fa-chart-line mr-1"></i> {{ count($payments) }} TRANSACTIONS FOUND
                    </span>
                    <button type="button" class="btn btn-tool text-muted" data-card-widget="maximize">
                        <i class="fas fa-expand"></i>
                    </button>
                </div>
            </div>
            
            <div class="card-body p-4 bg-light-soft">
                <div class="row">
                    @forelse($payments as $payment)
                        @include('admin.payments.partials._card', ['payment' => $payment])
                    @empty
                        <div class="col-12">
                            <div class="card border-0 shadow-premium rounded-24 py-5 text-center bg-white">
                                <div class="py-4">
                                    <i class="fas fa-coins fa-4x text-muted opacity-25 mb-3 d-block"></i>
                                    <h5 class="text-muted font-weight-bold">{{ __('No Financial Data Detected') }}</h5>
                                    <p class="small text-secondary mb-0">{{ __('The marketplace revenue ledger is currently awaiting synchronized entries.') }}</p>
                                </div>
                            </div>
                        </div>
                    @endforelse
                </div>
            </div>

            @if(method_exists($payments, 'hasPages') && $payments->hasPages())
                <div class="card-footer bg-white border-top py-4 px-4 d-flex justify-content-between align-items-center">
                    <div class="text-muted smallest font-weight-bold uppercase letter-spacing-1">Displaying {{ $payments->firstItem() }} - {{ $payments->lastItem() }} of {{ $payments->total() }} records</div>
                    <div>{{ $payments->appends(request()->except('page'))->links('pagination::bootstrap-4') }}</div>
                </div>
            @endif
        </div>
    </div>
@endsection

@section('js')
@include('admin._partials._sweetalert')
<script>
    $(document).ready(function() {
        $('[data-toggle="tooltip"]').tooltip();
        $('.select2').select2({
            theme: 'bootstrap4',
            width: '100%',
            placeholder: "Filter Intelligence"
        });
    });
</script>
@endsection
