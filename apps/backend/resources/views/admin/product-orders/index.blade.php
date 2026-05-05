@extends('adminlte::page')

@section('title', __('Product Orders | Commerce Intelligence'))

@section('plugins.Select2', true)
@section('plugins.Sweetalert2', true)
@section('plugins.Datatables', true)

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-7">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-shopping-bag mr-2 text-primary opacity-50"></i> {{ __('Sales & Orders') }}
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">Track marketplace transactions, fulfillment status, and customer shipments.</p>
            </div>
            <div class="col-sm-5 text-right">
                <div class="d-flex justify-content-end align-items-center" style="gap: 12px;">
                    <a href="{{ route('admin.product-orders.create') }}" class="btn btn-primary rounded-pill px-4 py-2 font-weight-bold shadow-premium smallest uppercase letter-spacing-1">
                        <i class="fas fa-plus-circle mr-2"></i> Add Order
                    </a>
                    <a href="{{ route('admin.welcome') }}" class="btn-back shadow-sm">
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

        <div class="card card-premium shadow-premium mb-4 border-0" style="border-radius: 20px;">
            <div class="card-body py-4 px-4">
                <form method="GET" action="{{ route('admin.product-orders.index') }}">
                    <div class="row align-items-end">
                        <div class="col-md-3">
                            <label class="small text-muted font-weight-bold uppercase letter-spacing-1">Order Tracking #</label>
                            <div class="input-group shadow-xs">
                                <div class="input-group-prepend">
                                    <span class="input-group-text bg-white border-right-0"><i class="fas fa-hashtag text-primary text-xs"></i></span>
                                </div>
                                <input type="text" name="order_number" class="form-control border-left-0 font-weight-bold" 
                                       placeholder="Enter order reference..." value="{{ request('order_number') }}">
                            </div>
                        </div>
                        <div class="col-md-3">
                            <label class="small text-muted font-weight-bold uppercase letter-spacing-1">Inventory Identification</label>
                            <div class="input-group shadow-xs">
                                <div class="input-group-prepend">
                                    <span class="input-group-text bg-white border-right-0"><i class="fas fa-box text-primary text-xs"></i></span>
                                </div>
                                <input type="text" name="product_name" class="form-control border-left-0 font-weight-bold" 
                                       placeholder="Search products..." value="{{ request('product_name') }}">
                            </div>
                        </div>
                        <div class="col-md-2">
                            <label class="small text-muted font-weight-bold uppercase letter-spacing-1">Fulfillment</label>
                            <div class="input-group shadow-xs">
                                <div class="input-group-prepend">
                                    <span class="input-group-text bg-white border-right-0"><i class="fas fa-truck text-primary text-xs"></i></span>
                                </div>
                                <select name="status" class="form-control border-left-0 select2">
                                    <option value="">All Statuses</option>
                                    <option value="pending" {{ $status == 'pending' ? 'selected' : '' }}>Pending</option>
                                    <option value="processing" {{ $status == 'processing' ? 'selected' : '' }}>Processing</option>
                                    <option value="completed" {{ $status == 'completed' ? 'selected' : '' }}>Completed</option>
                                    <option value="cancelled" {{ $status == 'cancelled' ? 'selected' : '' }}>Cancelled</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="d-flex" style="gap: 10px;">
                                <button type="submit" class="btn btn-primary flex-grow-1 font-weight-bold shadow-xs rounded-pill smallest uppercase">
                                    <i class="fas fa-sync-alt mr-2"></i> REFRESH REGISTRY
                                </button>
                                <a href="{{ route('admin.product-orders.index') }}" class="btn btn-default shadow-xs rounded-pill px-3 d-flex align-items-center justify-content-center" data-toggle="tooltip" title="Reset Filters">
                                    <i class="fas fa-undo text-danger m-0"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>

        {{-- Main Table --}}
        <div class="card card-premium shadow-premium border-0 overflow-hidden" style="border-radius: 24px;">
            <div class="card-header border-0 bg-white py-4 px-4 d-flex justify-content-between align-items-center">
                <h3 class="card-title font-weight-bold text-dark mb-0 smallest text-uppercase letter-spacing-1 float-none">
                    <i class="fas fa-list-ul mr-2 text-primary opacity-50"></i> Commerce Ledger
                </h3>
                
            </div>

            <div class="card-body p-0">
                <div class="table-responsive">
                    <form id="bulk-action-form" action="{{ route('admin.product-orders.bulk-update') }}" method="POST">
                        @csrf
                        <input type="hidden" name="bulk_status" id="bulk-status-input">
                        <table class="table table-hover table-premium mb-0">
                            <thead class="thead-light">
                                <tr>
                                    <th class="text-center pl-4" style="width: 50px">
                                        <div class="custom-control custom-checkbox custom-checkbox-premium">
                                            <input type="checkbox" class="custom-control-input" id="selectAll">
                                            <label class="custom-control-label" for="selectAll"></label>
                                        </div>
                                    </th>
                                    <th class="text-center" style="width: 70px">Media</th>
                                    <th>Commerce Protocol</th>
                                    <th>Client Principal</th>
                                    <th>Aggregate</th>
                                    <th>Settlement</th>
                                    <th class="text-center">Lifecycle</th>
                                    <th class="text-right pr-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                @forelse ($orders as $order)
                                    <tr>
                                        <td class="text-center align-middle pl-4">
                                            <div class="custom-control custom-checkbox custom-checkbox-premium">
                                                <input type="checkbox" name="ids[]" value="{{ $order->id }}" class="custom-control-input order-checkbox" id="check-{{ $order->id }}">
                                                <label class="custom-control-label" for="check-{{ $order->id }}"></label>
                                            </div>
                                        </td>
                                        <td class="text-center align-middle">
                                            @php
                                                $firstItem = $order->items->first();
                                                $thumbnail = $firstItem && $firstItem->product ? $firstItem->product->thumbnail_url : asset('images/fallbacks/default.jpg');
                                            @endphp
                                            <div class="table-img-preview shadow-sm">
                                                <img src="{{ $thumbnail }}" alt="Item" onerror="this.src='{{ asset('images/fallbacks/default.jpg') }}'">
                                            </div>
                                        </td>
                                        <td class="align-middle">
                                            <span class="d-block font-weight-bold text-dark mb-1 text-monospace">#{{ $order->order_number }}</span>
                                            @if($firstItem)
                                                <div class="smallest text-muted font-weight-bold uppercase letter-spacing-1">
                                                    <i class="fas fa-box-open mr-1 text-primary opacity-50"></i> {{ Str::limit($firstItem->product_name, 25) }}
                                                    @if($order->items->count() > 1)
                                                        <span class="badge badge-primary-light text-primary ml-1" style="font-size: 0.6rem;">+{{ $order->items->count() - 1 }} UNIT(S)</span>
                                                    @endif
                                                </div>
                                            @endif
                                        </td>
                                        <td class="align-middle">
                                            <div class="d-flex align-items-center">
                                                <div class="icon-box-soft bg-primary-soft mr-3 d-flex align-items-center justify-content-center shadow-xs" style="width:34px; height:34px; border-radius: 8px;">
                                                    <i class="fas fa-user-tie text-primary smallest"></i>
                                                </div>
                                                <div>
                                                    <span class="d-block font-weight-bold text-dark mb-0 smallest uppercase letter-spacing-1">{{ $order->user->name ?? 'Guest' }}</span>
                                                    <div class="smallest text-muted text-monospace">{{ Str::limit($order->user->email ?? 'no-email@provided.com', 20) }}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td class="align-middle">
                                            <div class="font-weight-bold text-dark mb-0 text-monospace h6">${{ number_format($order->total_amount, 2) }}</div>
                                            <div class="smallest text-muted font-weight-bold uppercase letter-spacing-1">{{ $order->items->count() }} {{ Str::plural('UNIT', $order->items->count()) }}</div>
                                        </td>
                                        <td class="align-middle">
                                            <span class="badge {{ $order->payment_status === 'paid' ? 'badge-success-light text-success' : 'badge-warning-light text-warning' }} px-3 py-1 rounded-pill font-weight-bold smallest uppercase letter-spacing-1 shadow-xs">
                                                {{ $order->payment_status }}
                                            </span>
                                        </td>
                                        <td class="text-center align-middle">
                                            @php
                                                $statusMap = [
                                                    'pending' => 'badge-warning-light text-warning',
                                                    'processing' => 'badge-info-light text-info',
                                                    'completed' => 'badge-success-light text-success',
                                                    'cancelled' => 'badge-danger-light text-danger'
                                                ];
                                                $statusClass = $statusMap[$order->status] ?? 'badge-secondary-light text-secondary';
                                            @endphp
                                            <span class="badge {{ $statusClass }} px-3 py-2 rounded-pill font-weight-bold smallest uppercase letter-spacing-1 shadow-xs" style="min-width: 100px;">
                                                {{ $order->status }}
                                            </span>
                                        </td>
                                        <td class="text-right align-middle pr-4">
                                            <div class="btn-group btn-group-premium shadow-sm rounded-pill border overflow-hidden bg-white">
                                                <a href="{{ route('admin.product-orders.show', $order->id) }}"
                                                   class="btn btn-white text-info py-2 px-3 d-inline-flex align-items-center"
                                                   data-toggle="tooltip" title="Inspect Order">
                                                    <i class="fas fa-eye mr-1"></i> Inspect
                                                </a>
                                            </div>
                                        </td>
                                    </tr>
                                @empty
                                    <tr class="empty-state">
                                        <td colspan="8" class="text-center py-5">
                                            <div class="py-4">
                                                <i class="fas fa-shopping-bag fa-4x text-muted opacity-25 mb-3 d-block"></i>
                                                <h5 class="text-muted font-weight-bold">No Commerce Records Detected</h5>
                                                <p class="small text-secondary mb-0">The order ledger is currently awaiting synchronized marketplace entries.</p>
                                            </div>
                                        </td>
                                    </tr>
                                @endforelse
                            </tbody>
                        </table>
                    </form>
                </div>
            </div>

            @if(method_exists($orders, 'hasPages') && $orders->hasPages())
                <div class="card-footer bg-white border-top py-4 px-4 d-flex justify-content-between align-items-center">
                    <div class="text-muted smallest font-weight-bold uppercase letter-spacing-1">Displaying {{ $orders->firstItem() }} - {{ $orders->lastItem() }} of {{ $orders->total() }} records</div>
                    <div>{{ $orders->withQueryString()->links('pagination::bootstrap-4') }}</div>
                </div>
            @endif
        </div>
    </div>

    {{-- Premium Floating Action Bar --}}
    <div id="bulk-floating-bar" class="bulk-floating-bar d-none">
        <div class="container-fluid h-100">
            <div class="d-flex align-items-center justify-content-between h-100 px-4">
                <div class="d-flex align-items-center">
                    <div class="selection-count-badge mr-4">
                        <span id="selected-count">0</span> SELECTED
                    </div>
                    <div class="divider-v"></div>
                    <div class="d-flex" style="gap: 15px;">
                        <div class="btn-group dropup">
                            <button type="button" class="btn btn-action-pill dropdown-toggle" data-toggle="dropdown">
                                <i class="fas fa-sync-alt mr-2"></i> UPDATE STATUS
                            </button>
                            <div class="dropdown-menu dropdown-menu-right shadow-premium-lg border-0 mb-3" style="border-radius: 15px;">
                                <h6 class="dropdown-header text-uppercase smallest letter-spacing-1 text-muted mb-2">Transition Lifecycle</h6>
                                <a class="dropdown-item py-3 px-4 font-weight-bold smallest uppercase letter-spacing-1" href="javascript:void(0)" onclick="handleBulkStatus('pending')">
                                    <i class="fas fa-clock mr-2 text-warning"></i> Set to Pending
                                </a>
                                <a class="dropdown-item py-3 px-4 font-weight-bold smallest uppercase letter-spacing-1" href="javascript:void(0)" onclick="handleBulkStatus('processing')">
                                    <i class="fas fa-sync mr-2 text-info"></i> Start Processing
                                </a>
                                <a class="dropdown-item py-3 px-4 font-weight-bold smallest uppercase letter-spacing-1" href="javascript:void(0)" onclick="handleBulkStatus('completed')">
                                    <i class="fas fa-check-circle mr-2 text-success"></i> Mark Completed
                                </a>
                                <div class="dropdown-divider"></div>
                                <a class="dropdown-item py-3 px-4 font-weight-bold smallest uppercase letter-spacing-1 text-danger" href="javascript:void(0)" onclick="handleBulkStatus('cancelled')">
                                    <i class="fas fa-times-circle mr-2"></i> Cancel Orders
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="d-flex align-items-center">
                    <button type="button" class="btn btn-close-bar" id="deselectAll">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
        </div>
    </div>
@endsection

@section('css')
<style>
    .text-monospace { font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace !important; }
    .object-fit-cover { object-fit: cover; }
    .bg-primary-soft { background: rgba(70, 165, 172, 0.1) !important; }
    .badge-info-light { background: rgba(23, 162, 184, 0.1) !important; }

    /* Floating Action Bar Styling */
    .bulk-floating-bar {
        position: fixed;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%);
        width: 90%;
        max-width: 800px;
        height: 80px;
        background: rgba(15, 23, 42, 0.95);
        backdrop-filter: blur(15px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 40px;
        z-index: 9999;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6);
        color: #fff;
        display: flex;
        transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }
    
    .bulk-floating-bar.d-none {
        display: none !important;
        opacity: 0;
        transform: translate(-50%, 40px);
    }

    .selection-count-badge {
        background: var(--primary);
        color: #fff;
        padding: 8px 20px;
        border-radius: 30px;
        font-weight: 800;
        font-size: 0.75rem;
        letter-spacing: 1px;
    }

    .divider-v {
        width: 1px;
        height: 30px;
        background: rgba(255, 255, 255, 0.1);
        margin: 0 25px;
    }

    .btn-action-pill {
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        color: #fff;
        border-radius: 30px;
        padding: 8px 25px;
        font-weight: 700;
        font-size: 0.7rem;
        letter-spacing: 1px;
        text-transform: uppercase;
        transition: all 0.3s ease;
    }

    .btn-action-pill:hover {
        background: rgba(255, 255, 255, 0.1);
        color: #fff;
        border-color: rgba(255, 255, 255, 0.2);
    }

    .btn-close-bar {
        background: transparent;
        border: none;
        color: rgba(255, 255, 255, 0.5);
        font-size: 1.2rem;
        transition: color 0.3s ease;
        padding: 10px;
    }

    .btn-close-bar:hover {
        color: #fff;
    }

    /* Animation */
    .animate__fadeInUpCustom {
        animation: fadeInUpCustom 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }

    @keyframes fadeInUpCustom {
        from { opacity: 0; transform: translate(-50%, 50px); }
        to { opacity: 1; transform: translate(-50%, 0); }
    }
</style>
@endsection

@section('js')
<script>
    $(function () {
        $('[data-toggle="tooltip"]').tooltip();
        
        $('.select2').select2({
            theme: 'bootstrap4',
            width: '100%',
            placeholder: 'All Statuses'
        });

        const $bulkBar = $('#bulk-floating-bar');
        const $selectedCount = $('#selected-count');

        function updateBulkUI() {
            const checkedCount = $('.order-checkbox:checked').length;
            if (checkedCount > 0) {
                $selectedCount.text(checkedCount);
                if ($bulkBar.hasClass('d-none')) {
                    $bulkBar.removeClass('d-none').addClass('animate__fadeInUpCustom');
                }
            } else {
                $bulkBar.addClass('d-none').removeClass('animate__fadeInUpCustom');
            }
        }

        $(document).on('change', '#selectAll', function() {
            $('.order-checkbox').prop('checked', this.checked);
            updateBulkUI();
        });

        $(document).on('click', '#deselectAll', function() {
            $('.order-checkbox').prop('checked', false);
            $('#selectAll').prop('checked', false);
            updateBulkUI();
        });

        $(document).on('change', '.order-checkbox', function() {
            const $orderCheckboxes = $('.order-checkbox');
            if (!this.checked) $('#selectAll').prop('checked', false);
            if ($('.order-checkbox:checked').length === $orderCheckboxes.length) $('#selectAll').prop('checked', true);
            updateBulkUI();
        });

        window.handleBulkStatus = function(status) {
            Swal.fire({
                title: 'Update ' + $('.order-checkbox:checked').length + ' orders?',
                text: "Lifecycle status will be transitioned to " + status.toUpperCase(),
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: 'var(--primary)',
                cancelButtonColor: '#d33',
                confirmButtonText: 'TRANSITION ALL',
                cancelButtonText: 'ABORT'
            }).then((result) => {
                if (result.isConfirmed) {
                    $('#bulk-status-input').val(status);
                    $('#bulk-action-form').submit();
                }
            });
        };
    });
</script>
@endsection
