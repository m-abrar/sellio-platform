{{--
    Administrative Finance: Global Transaction Ledger
    
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

@section('title', 'Transactions')

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-2">
            <div class="col-sm-6">
                <h1 class="m-0 text-dark font-weight-bold">
                     Transactions
                </h1>
            </div>
        </div>
    </div>
@stop

@section('content')

@include('admin.alert')

<div class="card card-primary card-outline shadow-sm border-0">
    <div class="card-header border-0 bg-white py-3">
        <h3 class="card-title">Recent Transactions List</h3>
        <a href="{{ route('admin.transactions.create') }}" class="btn btn-primary float-right">
            <i class="fas fa-plus"></i> Add Transaction
        </a>
    </div>
    <div class="card-body">
        <table id="transactions-table" class="table table-hover table-premium mb-0">
            <thead class="thead-light">
                <tr>
                    <th>Reference</th>
                    <th>Amount</th>
                    <th>Property Name</th>
                    <th>Guest Name</th>
                    <th>Booking Dates</th>
                    <th>Booking Total</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Screenshot</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($transactions as $transaction)
                    <tr>
                        <td>{{ $transaction->reference_number ?? '—' }}</td>
                        <td>{{ setting('currency_symbol') }}{{ number_format($transaction->amount, 2) }}</td>
                        <td>{{ $transaction->booking->property->title }}</td>
                        <td>{{ $transaction->booking->first_name }} {{ $transaction->booking->last_name }}</td>
                        <td>{{ \Carbon\Carbon::parse($transaction->booking->start_date)->format('d M, Y') }} - {{ \Carbon\Carbon::parse($transaction->booking->end_date)->format('d M, Y') }}</td>
                        <td>{{ setting('currency_symbol') }}{{ number_format($transaction->booking->total_price, 2) }}</td>
                        <td>
                            @if($transaction->status == 'completed')
                                <span class="badge badge-success">Completed</span>
                            @elseif($transaction->status == 'pending')
                                <span class="badge badge-warning">Pending</span>
                            @elseif($transaction->status == 'failed')
                                <span class="badge badge-danger">Failed</span>
                            @else
                                <span class="badge badge-secondary">{{ ucfirst($transaction->status) }}</span>
                            @endif
                        </td>
                        <td class="small">{{ $transaction->transaction_date ? $transaction->transaction_date->format('Y-m-d H:i') : '—' }}</td>
                        <td>
                            @if ($transaction->getFirstMediaUrl('transaction_screenshots'))
                                <img src="{{ $transaction->getFirstMediaUrl('transaction_screenshots') }}" alt="Screenshot" class="img-thumbnail icon-box-60 object-fit-cover">
                            @else
                                <span class="text-muted">No Image</span>
                            @endif
                        </td>
                        <td class="table-column-actions">
                            <a href="{{ route('admin.transactions.edit', $transaction->id) }}" class="btn btn-primary btn-sm">
                                <i class="fas fa-edit"></i>
                            </a>
                            <form action="{{ route('admin.transactions.destroy', $transaction->id) }}" method="POST" class="d-inline">
                                @csrf
                                @method('DELETE')
                                <button type="button" class="btn btn-danger btn-sm" 
                                        data-action="delete-trigger" 
                                        data-confirm-title="Purge Transaction?" 
                                        data-confirm-text="Are you sure you want to permanently remove this transaction record?">
                                    <i class="fas fa-trash-alt"></i>
                                </button>
                            </form>
                        </td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    </div>
</div>

@endsection


@section('js')
    @include('admin._partials._sweetalert')
    <script src="{{ asset('admin-assets/pages/transactions-index.js') }}"></script>
@endsection
