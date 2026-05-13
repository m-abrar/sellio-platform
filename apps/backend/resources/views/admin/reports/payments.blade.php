{{--
    Administrative Intelligence: Financial Inflow Analytics
    
    This view provides a comprehensive audit trail for marketplace revenue. 
    It facilitates the visualization of settlement trends, transaction 
    velocity, and payment gateway performance through high-fidelity 
    data orchestration and trend analysis.
    
    @extends adminlte::page
    @context Analytical Reporting
    @variables string $reportTitle The localized title of the analytical report.
--}}
@extends('adminlte::page')

@section('plugins.Chartjs', true) 


@section('title', 'Payments | Admin')

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-7">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-chart-line mr-2 text-primary opacity-50"></i> {{ $reportTitle ?? 'Payments & Revenue Analytics' }}
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">High-fidelity analysis of marketplace inflow, revenue trends, and settled transactions.</p>
            </div>
            @include('admin.reports._header_actions', ['exportText' => 'Export Report'])
        </div>
    </div>
@stop

@section('content')
@include('admin.alert')

<div class="container-fluid pb-5">
    
    {{-- Filter Protocol --}}
    @include('admin.reports._payments_filter')

    {{-- Stats Row --}}
    <div class="row mb-5">
        <div class="col-lg-4 col-md-6 mb-4">
            <div class="card h-100 border-0 shadow-premium overflow-hidden rounded-24">
                <div class="card-body p-4">
                    <div class="d-flex align-items-center mb-3">
                        <div class="icon-box-soft bg-success-soft text-success mr-3 shadow-xs icon-box-48 rounded-14 d-flex align-items-center justify-content-center">
                            <i class="fas fa-money-bill-wave text-lg"></i>
                        </div>
                        <span class="text-uppercase smallest font-weight-bold text-muted letter-spacing-1">Total Revenue</span>
                    </div>
                    <div class="d-flex align-items-baseline">
                        <h2 class="font-weight-bold text-dark mb-0 mr-1">${{ $totalRevenue ?? '0.00' }}</h2>
                        <span class="text-muted smallest font-weight-bold">GROSS</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-lg-4 col-md-6 mb-4">
            <div class="card h-100 border-0 shadow-premium overflow-hidden rounded-24">
                <div class="card-body p-4">
                    <div class="d-flex align-items-center mb-3">
                        <div class="icon-box-soft bg-info-soft text-info mr-3 shadow-xs icon-box-48 rounded-14 d-flex align-items-center justify-content-center">
                            <i class="fas fa-chart-pie text-lg"></i>
                        </div>
                        <span class="text-uppercase smallest font-weight-bold text-muted letter-spacing-1">Avg Transaction</span>
                    </div>
                    <div class="d-flex align-items-baseline">
                        <h2 class="font-weight-bold text-dark mb-0 mr-1">${{ number_format($avgTransactionValue ?? 0, 2) }}</h2>
                        <span class="text-muted smallest font-weight-bold">MEAN</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-lg-4 col-md-6 mb-4">
            <div class="card h-100 border-0 shadow-premium overflow-hidden rounded-24">
                <div class="card-body p-4">
                    <div class="d-flex align-items-center mb-3">
                        <div class="icon-box-soft bg-primary-soft text-primary mr-3 shadow-xs icon-box-48 rounded-14 d-flex align-items-center justify-content-center">
                            <i class="fas fa-check-double text-lg"></i>
                        </div>
                        <span class="text-uppercase smallest font-weight-bold text-muted letter-spacing-1">Transactions</span>
                    </div>
                    <div class="d-flex align-items-baseline">
                        <h2 class="font-weight-bold text-dark mb-0 mr-1">{{ number_format($successfulTransactions ?? 0) }}</h2>
                        <span class="text-success smallest font-weight-bold uppercase ml-1">SETTLED</span>
                    </div>
                </div>
            </div>
        </div>
    </div>

    {{-- Trend Analysis --}}
        <div class="card card-premium shadow-premium mb-5 border-0 overflow-hidden">
        <div class="card-header border-0 bg-white pt-4 px-4 d-flex align-items-center">
            <div class="icon-box-soft bg-success-soft text-success mr-3 d-flex align-items-center justify-content-center shadow-xs icon-box-40 rounded-10">
                <i class="fas fa-chart-line"></i>
            </div>
            <h3 class="card-title font-weight-bold text-dark mb-0 smallest text-uppercase letter-spacing-1 float-none">Monthly Inflow Trend</h3>
        </div>
        <div class="card-body p-4">
            <div class="chart-responsive h-380-p">
                <canvas id="revenueChart" 
                        data-chart-config='{"labels": @json($chartLabels ?? []), "data": @json($chartData ?? [])}'></canvas>
            </div>
        </div>
    </div>

    {{-- Transaction History --}}
    <div class="card card-premium shadow-premium border-0 mb-5 overflow-hidden">
        <div class="card-header border-0 bg-white pt-4 px-4 d-flex justify-content-between align-items-center">
            <div class="d-flex align-items-center">
                <div class="icon-box-soft bg-info-soft text-info mr-3 d-flex align-items-center justify-content-center shadow-xs icon-box-40 rounded-10">
                    <i class="fas fa-file-invoice-dollar"></i>
                </div>
                <h3 class="card-title font-weight-bold text-dark mb-0 smallest text-uppercase letter-spacing-1 float-none">Recent Transactions</h3>
            </div>
            <a href="{{ route('admin.payments.index') }}" class="btn btn-premium-soft btn-premium-soft-primary">
                View Ledger <i class="fas fa-arrow-right ml-2"></i>
            </a>
        </div>
        <div class="card-body p-0">
            <div class="table-responsive">
                <table class="table table-hover table-premium m-0">
                    <thead class="thead-light">
                        <tr>
                            <th class="px-4">Reference</th>
                            <th>Value</th>
                            <th>Protocol</th>
                            <th class="text-center">Lifecycle</th>
                            <th>Intelligence</th>
                            <th class="text-right px-4">Temporal Data</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse ($recentTransactions ?? [] as $transaction)
                        <tr>
                            <td class="px-4 align-middle">
                                <span class="text-monospace smallest text-muted font-weight-bold">#{{ $transaction->id }}</span>
                            </td>
                            <td class="align-middle">
                                <div class="font-weight-bold text-dark">${{ number_format($transaction->amount, 2) }}</div>
                            </td>
                            <td class="align-middle">
                                <span class="smallest font-weight-bold uppercase letter-spacing-1 text-muted">
                                    <i class="fas fa-wallet mr-1"></i> {{ $transaction->method }}
                                </span>
                            </td> 
                            <td class="align-middle text-center">
                                @php
                                    $statusStyle = [
                                        'completed' => ['bg' => 'success-light', 'text' => 'success'],
                                        'pending'   => ['bg' => 'warning-light', 'text' => 'warning'],
                                        'failed'    => ['bg' => 'danger-light', 'text' => 'danger'],
                                    ][strtolower($transaction->status)] ?? ['bg' => 'secondary-light', 'text' => 'secondary'];
                                @endphp
                                <span class="badge badge-premium badge-{{ $statusStyle['bg'] }} text-{{ $statusStyle['text'] }} px-3 py-2 rounded-pill font-weight-bold smallest uppercase letter-spacing-1 shadow-xs min-w-90">
                                    {{ $transaction->status }}
                                </span>
                            </td>
                            <td class="align-middle">
                                <div class="smallest font-weight-bold uppercase letter-spacing-1">
                                    @include('admin.reports.partials._payable_link', ['payable' => $transaction->payable])
                                </div>
                            </td>
                            <td class="text-right px-4 align-middle">
                                <div class="smallest text-dark font-weight-bold uppercase letter-spacing-1 mb-1">
                                    {{ $transaction->paid_at?->format('M d, Y') }}
                                </div>
                                <div class="smallest text-muted uppercase letter-spacing-1">
                                    <i class="far fa-clock mr-1"></i> {{ $transaction->paid_at?->format('H:i') }}
                                </div>
                            </td>
                        </tr>
                        @empty
                        <tr>
                            <td colspan="6" class="text-center py-5">
                                <i class="fas fa-receipt fa-4x text-muted opacity-25 mb-3 d-block"></i>
                                <h5 class="text-muted font-weight-bold uppercase letter-spacing-1">No Transactions Detected</h5>
                                <p class="small text-secondary mb-0">Financial activity in this range is currently dormant.</p>
                            </td>
                        </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>
@stop

@push('css')
@include('admin._partials._toggle-card-css')
@endpush


@section('js')
<script src="{{ asset('admin-assets/pages/registry-index.js') }}"></script>
<script src="{{ asset('admin-assets/pages/reports-payments.js') }}"></script>
@endsection