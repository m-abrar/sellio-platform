@extends('adminlte::page')

@section('title', __('Product Orders'))

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-end">
            <div class="col-sm-6">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-shopping-bag mr-2 text-primary"></i> {{ __('Sales & Orders') }}
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">Track marketplace transactions, fulfillment status, and customer shipments.</p>
            </div>
            <div class="col-sm-6 d-flex flex-column align-items-end justify-content-center">
                <ol class="breadcrumb bg-transparent p-0 mb-0 smallest font-weight-bold text-uppercase letter-spacing-1">
                    <li class="breadcrumb-item"><a href="{{ route('admin.welcome') }}" class="text-primary">Dashboard</a></li>
                    <li class="breadcrumb-item active text-muted">Product Orders</li>
                </ol>
            </div>
        </div>
    </div>
@stop

@section('js')
<script>
    $(function () {
        $('[data-toggle="tooltip"]').tooltip();

        // Bulk Selection Logic
        const $selectAll = $('#selectAll');
        const $orderCheckboxes = $('.order-checkbox');
        const $bulkContainer = $('#bulk-actions-container');
        const $selectedCount = $('#selected-count');

        function updateBulkUI() {
            const checkedCount = $('.order-checkbox:checked').length;
            if (checkedCount > 0) {
                $bulkContainer.removeClass('d-none');
                $selectedCount.text(checkedCount);
            } else {
                $bulkContainer.addClass('d-none');
            }
        }

        $selectAll.on('change', function() {
            $orderCheckboxes.prop('checked', this.checked);
            updateBulkUI();
        });

        $orderCheckboxes.on('change', function() {
            if (!this.checked) $selectAll.prop('checked', false);
            if ($('.order-checkbox:checked').length === $orderCheckboxes.length) $selectAll.prop('checked', true);
            updateBulkUI();
        });

        // Handle Bulk Status Update
        window.handleBulkStatus = function(status) {
            Swal.fire({
                title: 'Update ' + $('.order-checkbox:checked').length + ' orders?',
                text: "Status will be set to " + status.toUpperCase(),
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: 'var(--primary)',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, update all'
            }).then((result) => {
                if (result.isConfirmed) {
                    $('#bulk-status-input').val(status);
                    $('#bulk-action-form').submit();
                }
            });
        };
    });
</script>
@stop

@section('content')
    <div class="container-fluid">
        @include('admin.alert')

        {{-- Premium Filter Card --}}
        <div class="card border-0 shadow-premium mb-4" style="border-radius: 20px;">
            <div class="card-body py-4 px-4">
                <form method="GET" action="{{ route('admin.product-orders.index') }}" class="row align-items-end justify-content-center">
                    <div class="col-auto">
                        <label class="small text-muted font-weight-bold uppercase letter-spacing-1">Order #</label>
                        <input type="text" name="order_number" class="form-control shadow-xs" placeholder="Search..." value="{{ request('order_number') }}">
                    </div>
                    <div class="col-auto">
                        <label class="small text-muted font-weight-bold uppercase letter-spacing-1">Product</label>
                        <input type="text" name="product_name" class="form-control shadow-xs" placeholder="Search..." value="{{ request('product_name') }}">
                    </div>
                    <div class="col-auto">
                        <label class="small text-muted font-weight-bold uppercase letter-spacing-1">Status</label>
                        <select name="status" class="form-control shadow-xs">
                            <option value="">All</option>
                            <option value="pending" {{ $status == 'pending' ? 'selected' : '' }}>Pending</option>
                            <option value="processing" {{ $status == 'processing' ? 'selected' : '' }}>Processing</option>
                            <option value="completed" {{ $status == 'completed' ? 'selected' : '' }}>Completed</option>
                            <option value="cancelled" {{ $status == 'cancelled' ? 'selected' : '' }}>Cancelled</option>
                        </select>
                    </div>
                    <div class="col-auto">
                        <label class="small text-muted font-weight-bold uppercase letter-spacing-1">Payment</label>
                        <select name="payment_status" class="form-control shadow-xs">
                            <option value="">All</option>
                            <option value="paid" {{ request('payment_status') == 'paid' ? 'selected' : '' }}>Paid</option>
                            <option value="unpaid" {{ request('payment_status') == 'unpaid' ? 'selected' : '' }}>Unpaid</option>
                        </select>
                    </div>
                    <div class="col-auto d-flex align-items-end" style="gap: 8px;">
                        <button type="submit" class="btn btn-primary font-weight-bold shadow-xs" style="height: 38px;">
                            <i class="fas fa-filter mr-1"></i> FILTER
                        </button>
                        <a href="{{ route('admin.product-orders.index') }}" class="btn btn-default font-weight-bold shadow-xs" style="height: 38px;">
                            <i class="fas fa-undo"></i>
                        </a>
                    </div>
                </form>
            </div>
        </div>

        {{-- Main Table --}}
        <div class="card border-0 shadow-premium overflow-hidden" style="border-radius: 24px;">
            <div class="card-header border-0 bg-white py-4 px-4 d-flex justify-content-between align-items-center">
                <h3 class="card-title font-weight-bold text-dark mb-0 smallest text-uppercase letter-spacing-1 float-none">{{ __('All Orders') }}</h3>
                <div id="bulk-actions-container" class="d-none animate__animated animate__fadeIn">
                    <div class="dropdown d-inline-block">
                        <button class="btn btn-primary btn-sm dropdown-toggle rounded-pill px-4 shadow-sm" type="button" data-toggle="dropdown">
                            <i class="fas fa-tasks mr-1"></i> BULK ACTIONS (<span id="selected-count">0</span>)
                        </button>
                        <div class="dropdown-menu dropdown-menu-right shadow-lg border-0" style="border-radius: 12px;">
                            <h6 class="dropdown-header text-uppercase smallest letter-spacing-1">Update Status</h6>
                            <a class="dropdown-item py-2" href="#" onclick="handleBulkStatus('pending')"><i class="fas fa-clock mr-2 text-warning"></i> Mark as Pending</a>
                            <a class="dropdown-item py-2" href="#" onclick="handleBulkStatus('processing')"><i class="fas fa-sync mr-2 text-info"></i> Mark as Processing</a>
                            <a class="dropdown-item py-2" href="#" onclick="handleBulkStatus('completed')"><i class="fas fa-check-circle mr-2 text-success"></i> Mark as Completed</a>
                            <a class="dropdown-item py-2" href="#" onclick="handleBulkStatus('cancelled')"><i class="fas fa-times-circle mr-2 text-danger"></i> Mark as Cancelled</a>
                        </div>
                    </div>
                </div>
            </div>
            <div class="card-body p-0">
                <div class="table-responsive">
                    <form id="bulk-action-form" action="{{ route('admin.product-orders.bulk-update') }}" method="POST">
                        @csrf
                        <input type="hidden" name="bulk_status" id="bulk-status-input">
                        <table class="table table-hover table-premium mb-0">
                            <thead class="thead-light">
                                <tr>
                                    <th class="text-center" style="width: 50px">
                                        <div class="custom-control custom-checkbox">
                                            <input type="checkbox" class="custom-control-input" id="selectAll">
                                            <label class="custom-control-label" for="selectAll"></label>
                                        </div>
                                    </th>
                                    <th class="text-center" style="width: 70px">Media</th>
                                    <th>Order Number</th>
                                    <th>Customer</th>
                                    <th>Total</th>
                                    <th>Payment</th>
                                    <th class="text-center">Status</th>
                                    <th>Date</th>
                                    <th class="text-right px-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                @forelse ($orders as $order)
                                    <tr>
                                        <td class="text-center align-middle">
                                            <div class="custom-control custom-checkbox">
                                                <input type="checkbox" name="ids[]" value="{{ $order->id }}" class="custom-control-input order-checkbox" id="check-{{ $order->id }}">
                                                <label class="custom-control-label" for="check-{{ $order->id }}"></label>
                                            </div>
                                        </td>
                                        <td class="text-center align-middle">
                                            @php
                                                $firstItem = $order->items->first();
                                                $thumbnail = $firstItem && $firstItem->product ? $firstItem->product->thumbnail_url : asset('images/fallbacks/default.jpg');
                                            @endphp
                                            <div class="table-img-preview shadow-xs">
                                                <img src="{{ $thumbnail }}" alt="Order item" onerror="this.src='{{ asset('images/fallbacks/default.jpg') }}'">
                                            </div>
                                        </td>
                                        <td class="align-middle">
                                            <strong>{{ $order->order_number }}</strong>
                                            @if($firstItem)
                                                <div class="text-xs text-muted mt-1">
                                                    <i class="fas fa-box-open mr-1"></i> {{ $firstItem->product_name }}
                                                    @if($firstItem->product && $firstItem->product->sku)
                                                        <span class="text-uppercase text-secondary opacity-75 font-weight-bold ml-1" style="font-size: 0.6rem;">[{{ $firstItem->product->sku }}]</span>
                                                    @endif
                                                    @if($order->items->count() > 1)
                                                        <span class="badge badge-secondary ml-1" style="font-size: 0.6rem;">+{{ $order->items->count() - 1 }} MORE</span>
                                                    @endif
                                                </div>
                                            @endif
                                        </td>
                                        <td class="align-middle">
                                            <div class="d-flex align-items-center">
                                                <div class="avatar-xs mr-3 bg-light rounded-circle text-center border shadow-xs d-flex align-items-center justify-content-center" style="width:38px; height:38px;">
                                                    <i class="fas fa-user text-muted"></i>
                                                </div>
                                                <div>
                                                    <span class="d-block font-weight-bold text-dark mb-0">{{ $order->user->name ?? 'N/A' }}</span>
                                                    <div class="text-xs text-muted">
                                                        <a href="mailto:{{ $order->user->email ?? '' }}" class="text-info"><i class="fas fa-envelope mr-1"></i>{{ $order->user->email ?? 'N/A' }}</a>
                                                        @if($order->shipping_city)
                                                            <div class="mt-1 opacity-75">
                                                                <i class="fas fa-map-marker-alt mr-1 text-xs text-danger"></i>{{ $order->shipping_city }}, {{ $order->shipping_country }}
                                                            </div>
                                                        @endif
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td class="align-middle">
                                            <div class="font-weight-bold text-lg text-primary mb-1">${{ number_format($order->total_amount, 2) }}</div>
                                            <div class="item-details-stack">
                                                @foreach($order->items as $item)
                                                    <div class="text-xs text-muted mb-1 glass-card-soft p-2 rounded-lg border shadow-xs" style="width: fit-content; min-width: 180px; background: rgba(248, 249, 250, 0.5);">
                                                        <div class="d-flex justify-content-between border-bottom border-light pb-1 mb-1">
                                                            <span class="font-weight-bold text-dark">{{ $item->quantity }} × {{ Str::limit($item->product_name, 15) }}</span>
                                                            <span class="text-primary font-weight-bold">${{ number_format($item->unit_price, 2) }}</span>
                                                        </div>
                                                        @php
                                                            $itemAttrs = $item->selected_attributes;
                                                            if (is_string($itemAttrs)) {
                                                                $itemAttrs = json_decode($itemAttrs, true);
                                                            }
                                                        @endphp
                                                        @if(is_array($itemAttrs) && count($itemAttrs) > 0)
                                                            <div class="mt-1">
                                                                @foreach($itemAttrs as $key => $value)
                                                                    <div class="mb-0 d-flex justify-content-between">
                                                                        <span class="text-muted" style="font-size: 0.6rem; opacity: 0.8;">{{ strtoupper(str_replace('_', ' ', $key)) }}:</span> 
                                                                        <span class="text-dark font-weight-600 ml-2" style="font-size: 0.6rem;">{{ is_array($value) ? implode(', ', $value) : $value }}</span>
                                                                    </div>
                                                                @endforeach
                                                            </div>
                                                        @endif
                                                    </div>
                                                @endforeach
                                            </div>
                                        </td>
                                        <td class="align-middle">
                                            <span class="badge {{ $order->payment_status === 'paid' ? 'badge-success-light text-success' : 'badge-warning-light text-warning' }} px-3 py-1 text-uppercase" style="font-size: 0.7rem; border-radius: 6px;">
                                                {{ ucfirst($order->payment_status) }}
                                            </span>
                                        </td>
                                        <td class="text-center align-middle">
                                            @php
                                                $statusColors = [
                                                    'pending' => 'badge-warning-light text-warning',
                                                    'processing' => 'badge-info-light text-info',
                                                    'completed' => 'badge-success-light text-success',
                                                    'cancelled' => 'badge-danger-light text-danger'
                                                ];
                                                $statusColor = $statusColors[$order->status] ?? 'badge-secondary-light text-secondary';
                                            @endphp
                                            <span class="badge {{ $statusColor }} px-3 py-1 text-uppercase" style="font-size: 0.7rem; border-radius: 6px;">{{ ucfirst($order->status) }}</span>
                                        </td>
                                        <td class="align-middle">
                                            <span class="d-block font-weight-bold text-dark">{{ $order->created_at->format('M d, Y') }}</span>
                                            <small class="text-muted">{{ $order->created_at->format('h:i A') }}</small>
                                        </td>
                                        <td class="text-right px-4">
                                            <a href="{{ route('admin.product-orders.show', $order->id) }}" class="btn btn-default btn-sm text-info" data-toggle="tooltip" title="View Order"><i class="fas fa-eye"></i></a>
                                        </td>
                                    </tr>
                                @empty
                                    <tr><td colspan="9" class="text-center py-4">No orders found</td></tr>
                                @endforelse
                            </tbody>
                        </table>
                    </form>
                </div>
            </div>
            @if ($orders->hasPages())
                <div class="card-footer border-0 bg-white">
                    {{ $orders->links() }}
                </div>
            @endif
        </div>
    </div>
@stop
