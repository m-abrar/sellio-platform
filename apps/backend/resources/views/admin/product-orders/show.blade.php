@extends('adminlte::page')

@section('title', __('Order Details') . ' #' . $order->order_number)

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-6">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-shopping-bag mr-2 text-primary"></i>
                    {{ __('Order Protocol') }} <small class="text-muted font-weight-bold opacity-75">#{{ $order->order_number }}</small>
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">Marketplace transaction fulfillment and customer logistics interface.</p>
            </div>
            <div class="col-sm-6 text-right">
                <div class="d-flex justify-content-end align-items-center" style="gap: 12px;">
                    <a href="{{ route('admin.product-orders.index') }}" class="btn btn-default shadow-sm rounded-pill px-4 font-weight-bold smallest print-hide">
                        <i class="fas fa-arrow-left mr-1"></i> BACK TO REGISTRY
                    </a>
                    <button type="button" class="btn btn-primary shadow-premium rounded-pill px-4 font-weight-bold smallest print-hide" onclick="window.print()">
                        <i class="fas fa-print mr-1"></i> GENERATE INVOICE
                    </button>
                </div>
            </div>
        </div>
    </div>
@stop

@section('content')
    <div class="container-fluid pb-5">
        @include('admin.alert')

        <div class="row">
            {{-- Left Column: Items & Summary --}}
            <div class="col-md-8">
                <div class="card border-0 shadow-premium overflow-hidden mb-4" style="border-radius: 24px;">
                    <div class="card-header border-0 bg-white py-4 px-4">
                        <h3 class="card-title font-weight-bold text-dark mb-0">
                            <i class="fas fa-box-open mr-2 text-primary opacity-50"></i> {{ __('Fulfillment Manifest') }}
                        </h3>
                    </div>
                    <div class="card-body p-0">
                        <div class="table-responsive">
                            <table class="table table-hover table-premium mb-0">
                                <thead class="thead-light">
                                    <tr>
                                        <th class="pl-4 text-left" style="width: 50%;">{{ __('Item Details') }}</th>
                                        <th class="text-center">Rate</th>
                                        <th class="text-center">Quantity</th>
                                        <th class="text-right pr-4">Line Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    @foreach ($order->items as $item)
                                        <tr>
                                            <td class="pl-4 py-4">
                                                <div class="d-flex align-items-center">
                                                    <div class="table-img-preview mr-3 shadow-xs" style="width: 50px; height: 50px;">
                                                        <img src="{{ $item->product->thumbnail_url ?? asset('images/fallbacks/default.jpg') }}" alt="Product" onerror="this.src='{{ asset('images/fallbacks/default.jpg') }}'">
                                                    </div>
                                                    <div>
                                                        <span class="d-block font-weight-bold text-dark">{{ $item->product_name ?? ($item->product->title ?? 'N/A') }}</span>
                                                        @php
                                                            $itemAttrs = $item->selected_attributes;
                                                            if (is_string($itemAttrs)) {
                                                                $itemAttrs = json_decode($itemAttrs, true);
                                                            }
                                                        @endphp
                                                        @if(is_array($itemAttrs) && count($itemAttrs) > 0)
                                                            <div class="mt-1 d-flex flex-wrap" style="gap: 6px;">
                                                                @foreach($itemAttrs as $key => $value)
                                                                    <span class="badge badge-light border text-muted smallest px-2" style="font-weight: 600;">
                                                                        {{ strtoupper(str_replace('_', ' ', $key)) }}: {{ is_array($value) ? implode(', ', $value) : $value }}
                                                                    </span>
                                                                @endforeach
                                                            </div>
                                                        @endif
                                                    </div>
                                                </div>
                                            </td>
                                            <td class="text-center align-middle font-weight-bold text-muted">${{ number_format($item->unit_price, 2) }}</td>
                                            <td class="text-center align-middle">
                                                <span class="badge badge-primary-light text-primary px-3 py-1 rounded-pill font-weight-bold">×{{ $item->quantity }}</span>
                                            </td>
                                            <td class="text-right pr-4 align-middle font-weight-bold text-dark">${{ number_format($item->total_price, 2) }}</td>
                                        </tr>
                                    @endforeach
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {{-- Summary Card --}}
                <div class="card border-0 shadow-premium mb-4" style="border-radius: 24px;">
                    <div class="card-body p-4">
                        <div class="row">
                            <div class="col-md-6">
                                <div class="p-4 rounded-xl h-100" style="background: rgba(248, 250, 252, 0.8); border: 1px dashed var(--border-color);">
                                    <h5 class="smallest text-uppercase font-weight-bold text-muted letter-spacing-1 mb-3">
                                        <i class="fas fa-sticky-note mr-2 text-warning"></i> Customer Directives
                                    </h5>
                                    <p class="text-dark font-italic mb-0" style="line-height: 1.6;">
                                        {{ $order->notes ?: 'No specific handling instructions or notes provided by the customer for this transaction.' }}
                                    </p>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="table-responsive">
                                    <table class="table table-sm table-borderless mb-0">
                                        <tr class="text-muted smallest font-weight-bold text-uppercase">
                                            <th class="py-2">Item Subtotal</th>
                                            <td class="text-right py-2 font-weight-bold">${{ number_format($order->subtotal, 2) }}</td>
                                        </tr>
                                        <tr class="text-muted smallest font-weight-bold text-uppercase border-bottom border-light">
                                            <th class="py-2">Logistics (Shipping)</th>
                                            <td class="text-right py-2 font-weight-bold text-info">+ ${{ number_format($order->shipping_cost, 2) }}</td>
                                        </tr>
                                        <tr class="text-muted smallest font-weight-bold text-uppercase border-bottom border-light">
                                            <th class="py-2">Govt. Tax & Levies</th>
                                            <td class="text-right py-2 font-weight-bold">+ ${{ number_format($order->tax_amount, 2) }}</td>
                                        </tr>
                                        @if($order->discount_amount > 0)
                                            <tr class="text-danger smallest font-weight-bold text-uppercase border-bottom border-light">
                                                <th class="py-2">Promotional Outflow</th>
                                                <td class="text-right py-2 font-weight-bold">- ${{ number_format($order->discount_amount, 2) }}</td>
                                            </tr>
                                        @endif
                                        <tr>
                                            <th class="pt-4 h4 font-weight-bold text-dark">GRAND TOTAL</th>
                                            <td class="text-right pt-4 h3 font-weight-bold text-success">${{ number_format($order->total_amount, 2) }}</td>
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
                <div class="card border-0 shadow-premium mb-4 overflow-hidden print-hide" style="border-radius: 24px;">
                    <div class="card-header border-0 bg-info py-3 px-4">
                        <h3 class="card-title font-weight-bold text-white smallest text-uppercase letter-spacing-1 mb-0">
                            <i class="fas fa-tasks mr-1"></i> Sync Lifecycle
                        </h3>
                    </div>
                    <div class="card-body p-4">
                        <form action="{{ route('admin.product-orders.update-status', $order->id) }}" method="POST">
                            @csrf
                            <div class="form-group mb-4">
                                <label class="smallest text-uppercase font-weight-bold text-muted mb-2">Protocol Status</label>
                                <select name="status" class="form-control select2 shadow-xs" id="statusSelect">
                                    @foreach($statuses as $value => $label)
                                        <option value="{{ $value }}" {{ $order->status === $value ? 'selected' : '' }}>{{ strtoupper($label) }}</option>
                                    @endforeach
                                </select>
                            </div>

                            <div class="form-group mb-4 {{ in_array($order->status, ['shipped', 'out_for_delivery', 'delivered']) ? '' : 'd-none' }}" id="trackingGroup">
                                <label class="smallest text-uppercase font-weight-bold text-muted mb-2">Courier tracking #</label>
                                <div class="input-group-premium">
                                    <div class="input-group">
                                        <div class="input-group-prepend">
                                            <span class="input-group-text bg-transparent border-0"><i class="fas fa-truck text-muted"></i></span>
                                        </div>
                                        <input type="text" name="tracking_number" class="form-control border-0 bg-transparent" placeholder="WAYBILL / TRACKING ID" value="{{ $order->tracking_number }}">
                                    </div>
                                </div>
                            </div>

                            <button type="submit" class="btn btn-info btn-block rounded-pill font-weight-bold py-3 smallest">
                                <i class="fas fa-sync-alt mr-2"></i> UPDATE TRANSACTION STATE
                            </button>
                        </form>
                    </div>
                </div>

                {{-- Visual Timeline --}}
                <div class="card border-0 shadow-premium mb-4 overflow-hidden print-hide" style="border-radius: 24px;">
                    <div class="card-header border-0 bg-dark py-3 px-4">
                        <h3 class="card-title font-weight-bold text-white smallest text-uppercase letter-spacing-1 mb-0">
                            <i class="fas fa-history mr-1 opacity-50"></i> Logistics Timeline
                        </h3>
                    </div>
                    <div class="card-body p-0">
                        <ul class="list-group list-group-flush">
                            @php
                                $lifecycle = [
                                    ['id' => 'pending', 'label' => 'Order Placed', 'icon' => 'fa-shopping-cart'],
                                    ['id' => 'processing', 'label' => 'Fulfillment', 'icon' => 'fa-cogs'],
                                    ['id' => 'shipped', 'label' => 'Dispatched', 'icon' => 'fa-shipping-fast'],
                                    ['id' => 'out_for_delivery', 'label' => 'Near Destination', 'icon' => 'fa-map-marker-alt'],
                                    ['id' => 'delivered', 'label' => 'Protocol Closed', 'icon' => 'fa-check-circle'],
                                ];
                                
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
                                <li class="list-group-item d-flex align-items-center py-3 border-0 {{ $isActive ? 'bg-primary-soft' : '' }}">
                                    <div class="mr-3 text-center icon-box-soft {{ $isPassed ? 'bg-success-soft' : 'bg-light' }}" style="width: 40px; height: 40px;">
                                        <i class="fas {{ $step['icon'] }} {{ $color }}"></i>
                                    </div>
                                    <div class="flex-grow-1">
                                        <div class="font-weight-bold smallest text-uppercase {{ $color }}">{{ $step['label'] }}</div>
                                        @if($isActive)
                                            <span class="smallest text-primary font-weight-bold">CURRENT STATE</span>
                                        @elseif($isPassed)
                                            <span class="smallest text-muted font-weight-bold">COMPLETED</span>
                                        @endif
                                    </div>
                                    @if($isPassed)
                                        <i class="fas fa-check-circle text-success shadow-sm rounded-circle"></i>
                                    @endif
                                </li>
                            @endforeach
                        </ul>
                    </div>
                </div>

                {{-- Customer & Shipping Registry --}}
                <div class="card border-0 shadow-premium mb-4 overflow-hidden" style="border-radius: 24px;">
                    <div class="card-header border-0 bg-white py-3 px-4 border-bottom">
                        <h3 class="card-title font-weight-bold text-dark smallest text-uppercase letter-spacing-1 mb-0">
                            <i class="fas fa-id-card mr-1 text-primary"></i> Shipping Registry
                        </h3>
                    </div>
                    <div class="card-body p-4">
                        <div class="d-flex align-items-center mb-4 pb-4 border-bottom border-light">
                            <div class="avatar-wrapper mr-3 shadow-xs" style="width: 50px; height: 50px; border-radius: 12px; overflow: hidden; background: var(--primary-soft); display: flex; align-items: center; justify-content: center;">
                                <i class="fas fa-user-tie text-primary h4 mb-0"></i>
                            </div>
                            <div>
                                <span class="d-block font-weight-bold text-dark h6 mb-0">{{ $order->shipping_name ?: ($order->user->name ?? 'GUEST') }}</span>
                                <span class="text-muted smallest font-weight-bold">{{ $order->user->email ?? 'Direct / Legacy Order' }}</span>
                            </div>
                        </div>

                        <div class="shipping-address-block">
                            <label class="smallest text-uppercase font-weight-bold text-muted mb-2 d-block">Logistics Destination</label>
                            <div class="p-3 rounded-xl border border-light" style="background: #fafbfc;">
                                <p class="mb-1 text-dark font-weight-bold small"><i class="fas fa-map-pin mr-2 text-danger opacity-50"></i> {{ $order->shipping_address }}</p>
                                <p class="mb-1 text-muted small ml-4">{{ $order->shipping_city }}, {{ $order->shipping_state }} {{ $order->shipping_zip }}</p>
                                <p class="mb-0 text-muted font-weight-bold smallest text-uppercase ml-4 letter-spacing-1">{{ $order->shipping_country }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
@stop

@push('css')
@include('admin._partials._toggle-card-css')
<style>
    @media print {
        .main-sidebar, .main-header, .btn, .card-header .btn, .sync-lifecycle-card, .logistics-timeline-card, .sync-lifecycle-section {
            display: none !important;
        }
        .content-wrapper {
            margin-left: 0 !important;
            padding-top: 0 !important;
        }
        .card {
            border: 1px solid #eee !important;
            box-shadow: none !important;
        }
        .container-fluid {
            width: 100% !important;
            padding: 0 !important;
        }
    }
</style>
@endpush

@push('js')
<script>
    $(document).ready(function() {
        if (typeof $.fn.select2 !== 'undefined') {
            $('.select2').select2({
                theme: 'bootstrap4',
                width: '100%'
            });
        }

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
