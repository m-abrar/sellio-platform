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
            
            <div class="card-body p-0">
                <div class="table-responsive">
                    <table id="payments-table" class="table table-hover table-premium mb-0">
                        <thead class="thead-light">
                            <tr>
                                <th class="pl-4">Client Principal</th> 
                                <th>Intelligence Focus</th> 
                                <th>Temporal Data</th> 
                                <th class="text-right">Settlement Value</th> 
                                <th class="text-center">Lifecycle</th> 
                                <th class="text-right pr-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            @forelse($payments as $payment)
                                <tr>
                                    <td class="align-middle pl-4">
                                        @if($payment->user)
                                            <div class="d-flex align-items-center">
                                                <div class="icon-box-soft bg-primary-soft mr-3 d-flex align-items-center justify-content-center shadow-xs icon-box-38 rounded-10">
                                                    <span class="smallest font-weight-bold text-primary">{{ strtoupper(substr($payment->user->name, 0, 1)) }}</span>
                                                </div>
                                                <div>
                                                    <span class="d-block font-weight-bold text-dark mb-0 smallest uppercase letter-spacing-1">{{ $payment->user->name }}</span>
                                                    <small class="text-muted text-monospace smallest smallest-0-7">{{ $payment->user->email }}</small>
                                                </div>
                                            </div>
                                        @else
                                            <span class="badge badge-secondary-light text-secondary px-3 py-1 rounded-pill smallest font-weight-bold uppercase">External Principal</span>
                                        @endif
                                    </td>
                                    
                                    <td class="align-middle">
                                        <div class="font-weight-bold text-dark smallest text-uppercase letter-spacing-1">
                                            @include('admin.payments.partials._payable_link', ['payable' => $payment->payable])
                                        </div>
                                        <div class="mt-1">
                                            @php
                                                $methodMap = [
                                                    'stripe' => ['icon' => 'fab fa-cc-stripe', 'class' => 'text-indigo'],
                                                    'paypal' => ['icon' => 'fab fa-paypal', 'class' => 'text-primary'],
                                                    'manual' => ['icon' => 'fas fa-hand-holding-usd', 'class' => 'text-success'],
                                                ];
                                                $m = $methodMap[$payment->payment_method] ?? ['icon' => 'fas fa-wallet', 'class' => 'text-muted'];
                                            @endphp
                                            <span class="smallest font-weight-bold uppercase letter-spacing-1 {{ $m['class'] }}">
                                                <i class="{{ $m['icon'] }} mr-1"></i> {{ $payment->payment_method }}
                                            </span>
                                        </div>
                                    </td>

                                    <td class="align-middle">
                                        <div class="smallest text-dark font-weight-bold uppercase letter-spacing-1 mb-1">
                                            {{ ($payment->paid_at ?? $payment->created_at)->format('d M Y') }}
                                        </div>
                                        <div class="smallest text-muted uppercase letter-spacing-1">
                                            <i class="far fa-clock mr-1"></i>{{ ($payment->paid_at ?? $payment->created_at)->format('H:i') }}
                                        </div>
                                    </td>

                                    <td class="text-right align-middle">
                                        <div class="font-weight-bold text-dark mb-0">
                                            <span class="smallest font-weight-normal opacity-50 mr-1">{{ $payment->currency }}</span>{{ number_format($payment->amount, 2) }}
                                        </div>
                                        <div class="text-monospace smallest text-muted opacity-50 smallest-0-65" title="Gateway Reference">
                                            #{{ Str::limit($payment->transaction_id ?? '---', 12) }}
                                        </div>
                                    </td>

                                    <td class="text-center align-middle">
                                        @php
                                            $statusMap = [
                                                'completed' => 'badge-success-light text-success',
                                                'failed'    => 'badge-danger-light text-danger',
                                                'refunded'  => 'badge-info-light text-info',
                                                'pending'   => 'badge-warning-light text-warning',
                                            ];
                                            $statusClass = $statusMap[$payment->status] ?? 'badge-secondary-light text-secondary';
                                        @endphp
                                        <span class="badge {{ $statusClass }} px-3 py-2 rounded-pill font-weight-bold smallest uppercase letter-spacing-1 shadow-xs min-w-100">
                                            {{ $payment->status }}
                                        </span>
                                    </td>
                                    
                                    <td class="text-right align-middle pr-4">
                                        <div class="btn-group btn-group-premium">
                                            <a href="{{ route('admin.payments.edit', $payment->id) }}" class="btn text-info" data-toggle="tooltip" title="Modify Record"><i class="fas fa-edit"></i></a>
                                            <form id="delete-form-{{ $payment->id }}" action="{{ route('admin.payments.destroy', $payment->id) }}" method="POST" class="d-inline">
                                                @csrf @method('DELETE')
                                                <button type="button" class="btn text-danger" data-toggle="tooltip" title="Void Record" onclick="confirmDelete('delete-form-{{ $payment->id }}', 'Void Transaction?', 'This action will permanently remove this financial record from the ledger.', 'Confirm')"><i class="fas fa-trash-alt"></i></button>
                                            </form>
                                        </div>
                                    </td>
                                </tr>
                            @empty
                                <tr class="empty-state">
                                    <td colspan="6" class="text-center py-5">
                                        <div class="py-4">
                                            <i class="fas fa-coins fa-4x text-muted opacity-25 mb-3 d-block"></i>
                                            <h5 class="text-muted font-weight-bold">No Financial Data Detected</h5>
                                            <p class="small text-secondary mb-0">The marketplace revenue ledger is currently awaiting synchronized entries.</p>
                                        </div>
                                    </td>
                                </tr>
                            @endforelse
                        </tbody>
                    </table>
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
