{{--
    Administrative Finance: Global All Transactions
    
    This view provides a central audit stream for all financial exchanges. 
    It integrates reconciliation data from various booking modules, 
    verifies principal identifiers, and displays proof-of-payment 
    artifacts to ensure total fiscal transparency across the platform.
    
    @extends adminlte::page
    @context Financial Operations
    @variables Collection $transactions List of Transaction model instances.
--}}
@extends('adminlte::page')

@section('plugins.Datatables', true)

@section('title', __('Transactions'))

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-8 text-center text-sm-left mb-3 mb-sm-0">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-file-invoice-dollar mr-2 text-primary"></i> {{ __('Transactions') }}
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">{{ __('Audit financial exchanges, verify payment artifacts, and reconcile bookings.') }}</p>
            </div>
            <div class="col-sm-4 d-flex align-items-center justify-content-center justify-content-sm-end">
                <a href="{{ route('admin.transactions.create') }}" class="btn btn-primary btn-registry-add shadow-premium">
                    <i class="fas fa-plus-circle mr-2"></i> {{ __('Add Transaction') }}
                </a>
            </div>
        </div>
    </div>
@stop

@section('content')

@include('admin.alert')

<div class="card registry-table-card">
    <div class="card-header border-0 bg-white py-4 px-4 d-flex align-items-center">
        <h3 class="card-title font-weight-bold text-dark text-uppercase smallest mb-0 float-none letter-spacing-1">{{ __('Transaction History') }}</h3>
        <div class="card-tools d-flex align-items-center ml-auto">
            <span class="badge badge-primary-light text-primary px-3 py-2 rounded-pill font-weight-bold smallest uppercase mr-2">
                <i class="fas fa-database mr-1"></i> {{ count($transactions) }} {{ __('RECORDS FOUND') }}
            </span>
            <button type="button" class="btn btn-tool text-muted" data-card-widget="maximize">
                <i class="fas fa-expand"></i>
            </button>
        </div>
    </div>
    <div class="card-body p-0">
        <div class="table-responsive">
            <table id="transactions-table" class="table table-hover table-premium mb-0 datatable-init"
                   data-datatable-config='{"paging": true, "searching": true, "ordering": true, "order": [[7, "desc"]], "responsive": true}'>
                <thead class="thead-light">
                    <tr>
                        <th>{{ __('Reference') }}</th>
                        <th>{{ __('Amount') }}</th>
                        <th>{{ __('Property') }}</th>
                        <th>{{ __('Customer') }}</th>
                        <th>{{ __('Booking Dates') }}</th>
                        <th>{{ __('Total') }}</th>
                        <th class="text-center">{{ __('Status') }}</th>
                        <th>{{ __('Timestamp') }}</th>
                        <th class="text-center">{{ __('Proof') }}</th>
                        <th class="text-right pr-4">{{ __('Actions') }}</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach ($transactions as $transaction)
                        <tr>
                            <td>{{ $transaction->reference_number ?? '—' }}</td>
                            <td>{{ setting('currency_symbol') }}{{ number_format($transaction->amount, 2) }}</td>
                            <td>{{ $transaction->booking?->property?->title ?? __('N/A') }}</td>
                            <td>{{ $transaction->booking?->full_name ?? __('N/A') }}</td>
                            <td>
                                @if($transaction->booking)
                                    {{ $transaction->booking->check_in_date?->format('d M, Y') }} - {{ $transaction->booking->check_out_date?->format('d M, Y') }}
                                @else
                                    —
                                @endif
                            </td>
                            <td>
                                @if($transaction->booking)
                                    {{ setting('currency_symbol') }}{{ number_format($transaction->booking->total_price, 2) }}
                                @else
                                    —
                                @endif
                            </td>
                            <td class="text-center align-middle">
                                @if($transaction->status == 'completed')
                                    <span class="badge badge-success-light px-3 py-1 rounded-pill font-weight-bold smallest uppercase">{{ __('Completed') }}</span>
                                @elseif($transaction->status == 'pending')
                                    <span class="badge badge-warning-light px-3 py-1 rounded-pill font-weight-bold smallest uppercase">{{ __('Pending') }}</span>
                                @elseif($transaction->status == 'failed')
                                    <span class="badge badge-danger-light px-3 py-1 rounded-pill font-weight-bold smallest uppercase">{{ __('Failed') }}</span>
                                @else
                                    <span class="badge badge-secondary-light px-3 py-1 rounded-pill font-weight-bold smallest uppercase">{{ ucfirst($transaction->status) }}</span>
                                @endif
                            </td>
                            <td class="small">{{ $transaction->transaction_date ? $transaction->transaction_date->format('Y-m-d H:i') : '—' }}</td>
                            <td class="text-center align-middle">
                                @if ($transaction->getFirstMediaUrl('transaction_screenshots'))
                                    <div class="table-img-preview shadow-sm mx-auto icon-box-60">
                                        <img src="{{ $transaction->getFirstMediaUrl('transaction_screenshots') }}" alt="{{ __('Screenshot') }}" class="object-fit-cover">
                                    </div>
                                @else
                                    <span class="text-muted smallest uppercase font-weight-bold">{{ __('No Image') }}</span>
                                @endif
                            </td>
                            <td class="text-right align-middle pr-4">
                                <div class="btn-group btn-group-premium">
                                    <a href="{{ route('admin.transactions.edit', $transaction->id) }}" 
                                       class="btn text-primary" 
                                       data-toggle="tooltip" title="{{ __('Modify Record') }}">
                                        <i class="fas fa-pencil-alt"></i>
                                    </a>
                                    <form action="{{ route('admin.transactions.destroy', $transaction->id) }}" method="POST" class="d-inline">
                                        @csrf
                                        @method('DELETE')
                                        <button type="button" class="btn text-danger" 
                                                data-toggle="tooltip" title="{{ __('Purge Record') }}"
                                                data-action="delete-trigger" 
                                                data-confirm-title="{{ __('Purge Transaction?') }}" 
                                                data-confirm-text="{{ __('Are you sure you want to permanently remove this transaction record?') }}">
                                            <i class="fas fa-trash-alt"></i>
                                        </button>
                                    </form>
                                </div>
                            </td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    </div>
</div>

@endsection


@section('js')
    <script src="{{ asset('admin-assets/pages/registry-index.js') }}"></script>
    <script src="{{ asset('admin-assets/pages/transactions-index.js') }}"></script>
@endsection
