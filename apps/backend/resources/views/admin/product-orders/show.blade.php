@extends('adminlte::page')

@section('title', __('Order Details') . ' #' . $order->order_number)

@section('content_header')
    <div class="container-fluid">
        <div class="row mb-2">
            <div class="col-sm-6">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-shopping-bag mr-2 text-primary"></i>
                    {{ __('Order Details') }} <small class="text-muted">#{{ $order->order_number }}</small>
                </h1>
            </div>
            <div class="col-sm-6">
                <ol class="breadcrumb float-sm-right">
                    <li class="breadcrumb-item"><a href="{{ route('admin.welcome') }}">{{ __('Dashboard') }}</a></li>
                    <li class="breadcrumb-item"><a href="{{ route('admin.product-orders.index') }}">{{ __('Product Orders') }}</a></li>
                    <li class="breadcrumb-item active">#{{ $order->order_number }}</li>
                </ol>
            </div>
        </div>
    </div>
@stop

@section('content')
    <div class="container-fluid">
        @include('admin.alert')

        <div class="row">
            {{-- Left Column: Items & Summary --}}
            <div class="col-md-8">
                <div class="card card-outline card-primary shadow-sm mb-4">
                    <div class="card-header border-0 bg-white">
                        <h3 class="card-title font-weight-bold text-muted">
                            <i class="fas fa-box-open mr-1 text-primary"></i> {{ __('Order Items') }}
                        </h3>
                    </div>
                    <div class="card-body p-0">
                        <div class="table-responsive">
                            <table class="table table-striped table-hover mb-0">
                                <thead>
                                    <tr>
                                        <th>Product</th>
                                        <th class="text-center">Rate</th>
                                        <th class="text-center">Qty</th>
                                        <th class="text-right">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    @foreach ($order->items as $item)
                                        <tr>
                                            <td>
                                                <strong>{{ $item->product_name ?? ($item->product->title ?? 'N/A') }}</strong>
                                            </td>
                                            <td class="text-center">${{ number_format($item->unit_price, 2) }}</td>
                                            <td class="text-center">{{ $item->quantity }}</td>
                                            <td class="text-right">${{ number_format($item->total_price, 2) }}</td>
                                        </tr>
                                    @endforeach
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {{-- Summary Card --}}
                <div class="card card-outline card-secondary shadow-sm">
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-6">
                                <p class="text-muted"><i class="fas fa-sticky-note mr-1"></i> <strong>Notes:</strong><br>{{ $order->notes ?: 'No notes attached.' }}</p>
                            </div>
                            <div class="col-md-6">
                                <div class="table-responsive">
                                    <table class="table table-sm mb-0">
                                        <tr>
                                            <th class="text-muted">Subtotal:</th>
                                            <td class="text-right">${{ number_format($order->subtotal, 2) }}</td>
                                        </tr>
                                        <tr>
                                            <th class="text-muted">Shipping:</th>
                                            <td class="text-right">${{ number_format($order->shipping_cost, 2) }}</td>
                                        </tr>
                                        <tr>
                                            <th class="text-muted">Tax:</th>
                                            <td class="text-right">${{ number_format($order->tax_amount, 2) }}</td>
                                        </tr>
                                        <tr>
                                            <th class="text-danger">Discount:</th>
                                            <td class="text-right text-danger">-${{ number_format($order->discount_amount, 2) }}</td>
                                        </tr>
                                        <tr class="border-top">
                                            <th class="h5">Total:</th>
                                            <td class="text-right h5 font-weight-bold text-success">${{ number_format($order->total_amount, 2) }}</td>
                                        </tr>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {{-- Right Column: Customer & Shipping --}}
            <div class="col-md-4">
                {{-- Status Management Card --}}
                <div class="card card-outline card-info shadow-sm mb-4">
                    <div class="card-header border-0 bg-white pt-3">
                        <h3 class="card-title font-weight-bold text-muted small text-uppercase">
                            <i class="fas fa-tasks mr-1 text-info"></i> Manage Lifecycle
                        </h3>
                    </div>
                    <div class="card-body">
                        <form action="{{ route('admin.product-orders.update-status', $order->id) }}" method="POST">
                            @csrf
                            <div class="form-group mb-3">
                                <label class="small font-weight-bold">Update Order Status</label>
                                <select name="status" class="form-control form-control-lg select2" id="statusSelect">
                                    @foreach($statuses as $value => $label)
                                        <option value="{{ $value }}" {{ $order->status === $value ? 'selected' : '' }}>{{ $label }}</option>
                                    @endforeach
                                </select>
                            </div>

                            <div class="form-group mb-3 {{ in_array($order->status, ['shipped', 'out_for_delivery', 'delivered']) ? '' : 'd-none' }}" id="trackingGroup">
                                <label class="small font-weight-bold">Tracking Number</label>
                                <div class="input-group">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text bg-white"><i class="fas fa-truck text-muted"></i></span>
                                    </div>
                                    <input type="text" name="tracking_number" class="form-control" placeholder="Enter carrier tracking #" value="{{ $order->tracking_number }}">
                                </div>
                            </div>

                            <button type="submit" class="btn btn-info btn-block font-weight-bold shadow-sm py-2">
                                <i class="fas fa-save mr-1"></i> Sync Status
                            </button>
                        </form>
                    </div>
                </div>

                {{-- Visual Timeline --}}
                <div class="card card-outline card-dark shadow-sm mb-4">
                    <div class="card-header border-0 bg-white pt-3">
                        <h3 class="card-title font-weight-bold text-muted small text-uppercase">
                            <i class="fas fa-history mr-1 text-dark"></i> Tracking Timeline
                        </h3>
                    </div>
                    <div class="card-body p-0">
                        <ul class="list-group list-group-flush small">
                            @php
                                $lifecycle = [
                                    ['id' => 'pending', 'label' => 'Order Placed', 'icon' => 'fa-shopping-cart'],
                                    ['id' => 'processing', 'label' => 'Processed', 'icon' => 'fa-cogs'],
                                    ['id' => 'shipped', 'label' => 'Shipped', 'icon' => 'fa-shipping-fast'],
                                    ['id' => 'out_for_delivery', 'label' => 'Out for Delivery', 'icon' => 'fa-map-marker-alt'],
                                    ['id' => 'delivered', 'label' => 'Delivered', 'icon' => 'fa-check-circle'],
                                ];
                                
                                // Simple logic to determine if a stage is active or passed
                                $statusOrder = ['pending', 'processing', 'shipped', 'out_for_delivery', 'delivered'];
                                $currentIdx = array_search($order->status, $statusOrder);
                                if($currentIdx === false) $currentIdx = -1;
                            @endphp

                            @foreach($lifecycle as $index => $step)
                                @php
                                    $isActive = ($order->status === $step['id']);
                                    $isPassed = ($currentIdx >= $index);
                                    $color = $isPassed ? 'text-success' : 'text-muted';
                                @endphp
                                <li class="list-group-item d-flex align-items-center py-3 {{ $isActive ? 'bg-light font-weight-bold' : '' }}">
                                    <div class="mr-3 text-center" style="width: 25px;">
                                        <i class="fas {{ $step['icon'] }} {{ $color }} fa-lg"></i>
                                    </div>
                                    <div>
                                        <div class="{{ $color }}">{{ $step['label'] }}</div>
                                        @if($step['id'] === 'shipped' && $order->shipped_at)
                                            <div class="text-xs text-muted font-weight-normal">{{ $order->shipped_at->format('M d, H:i') }}</div>
                                        @elseif($step['id'] === 'delivered' && $order->delivered_at)
                                            <div class="text-xs text-muted font-weight-normal">{{ $order->delivered_at->format('M d, H:i') }}</div>
                                        @elseif($isPassed)
                                            <div class="text-xs text-muted font-weight-normal">Completed</div>
                                        @endif
                                    </div>
                                    @if($isActive)
                                        <span class="ml-auto badge badge-info">Current</span>
                                    @elseif($isPassed)
                                        <span class="ml-auto"><i class="fas fa-check text-success small"></i></span>
                                    @endif
                                </li>
                            @endforeach
                        </ul>
                    </div>
                </div>

                {{-- Customer Card --}}
                <div class="card card-outline card-secondary shadow-sm mb-4">
                    <div class="card-header">
                        <h3 class="card-title font-weight-bold"><i class="fas fa-user-circle mr-1 text-primary"></i> Customer</h3>
                    </div>
                    <div class="card-body py-2">
                        <p class="mb-1"><strong>{{ $order->user->name ?? 'Guest' }}</strong></p>
                        <p class="mb-0 text-muted small">{{ $order->user->email ?? 'N/A' }}</p>
                    </div>
                </div>

                {{-- Shipping Card --}}
                <div class="card card-outline card-secondary shadow-sm">
                    <div class="card-header">
                        <h3 class="card-title font-weight-bold"><i class="fas fa-truck mr-1 text-primary"></i> Shipping Details</h3>
                    </div>
                    <div class="card-body py-2">
                        <p class="mb-1"><strong>{{ $order->shipping_name }}</strong></p>
                        <p class="mb-1 text-muted">{{ $order->shipping_address }}</p>
                        <p class="mb-0 text-muted">{{ $order->shipping_city }}, {{ $order->shipping_state }} {{ $order->shipping_zip }}</p>
                        <p class="mb-0 text-muted">{{ $order->shipping_country }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
@stop

@push('js')
<script>
    $(document).ready(function() {
        $('.select2').select2({
            theme: 'bootstrap4',
            width: '100%'
        });

        $('#statusSelect').on('change', function() {
            const status = $(this).val();
            const trackingStatuses = ['shipped', 'out_for_delivery', 'delivered'];
            
            if (trackingStatuses.includes(status)) {
                $('#trackingGroup').removeClass('d-none').hide().fadeIn();
            } else {
                $('#trackingGroup').fadeOut(function() {
                    $(this).addClass('d-none');
                });
            }
        });
    });
</script>
@endpush
