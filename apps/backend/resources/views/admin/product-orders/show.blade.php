@extends('adminlte::page')

@section('title', __('Order Details') . ' #' . $order->order_number . ' | Commerce Intelligence')

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-6">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-shopping-bag mr-2 text-primary opacity-50"></i>
                    {{ __('Order Protocol') }} <small class="text-muted font-weight-bold opacity-75 text-monospace">#{{ $order->order_number }}</small>
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">Marketplace transaction fulfillment and customer logistics interface.</p>
            </div>
            <div class="col-sm-6 text-right">
                <div class="d-flex justify-content-end align-items-center" style="gap: 12px;">
                    <a href="{{ route('admin.product-orders.index') }}" class="btn-back shadow-sm print-hide">
                        <i class="fas fa-receipt mr-2"></i> Back to Ledger
                    </a>
                    <button type="button" class="btn btn-primary shadow-premium rounded-pill px-4 py-2 font-weight-bold smallest uppercase letter-spacing-1 print-hide" onclick="window.print()">
                        <i class="fas fa-print mr-2"></i> Generate Invoice
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
            {{-- Left Column: Manifest & Summary --}}
            <div class="col-md-8">
                <div class="card card-premium shadow-sm border-0 overflow-hidden mb-4">
                    <div class="card-header border-0 bg-white py-4 px-4 d-flex justify-content-between align-items-center">
                        <h3 class="card-title font-weight-bold text-dark mb-0 smallest text-uppercase letter-spacing-1">
                            <i class="fas fa-box-open mr-2 text-primary opacity-50"></i> {{ __('Fulfillment Manifest') }}
                        </h3>
                    </div>
                    <div class="card-body p-0">
                        <div class="table-responsive">
                            <table class="table table-hover table-premium mb-0">
                                <thead class="thead-light">
                                    <tr>
                                        <th class="pl-4 py-3 smallest text-uppercase font-weight-bold letter-spacing-1 text-secondary border-0" style="width: 50%;">{{ __('Item Identification') }}</th>
                                        <th class="text-center py-3 smallest text-uppercase font-weight-bold letter-spacing-1 text-secondary border-0">Rate</th>
                                        <th class="text-center py-3 smallest text-uppercase font-weight-bold letter-spacing-1 text-secondary border-0">Quantity</th>
                                        <th class="text-right pr-4 py-3 smallest text-uppercase font-weight-bold letter-spacing-1 text-secondary border-0">Line Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    @foreach ($order->items as $item)
                                        <tr>
                                            <td class="pl-4 py-4 align-middle">
                                                <div class="d-flex align-items-center">
                                                    <div class="icon-box-preview mr-3 shadow-xs border rounded" style="width: 54px; height: 54px;">
                                                        <img src="{{ $item->product->thumbnail_url ?? asset('images/fallbacks/default.jpg') }}" 
                                                             class="w-100 h-100 object-fit-cover" 
                                                             alt="Product" 
                                                             onerror="this.src='{{ asset('images/fallbacks/default.jpg') }}'">
                                                    </div>
                                                    <div>
                                                        <span class="d-block font-weight-bold text-dark mb-1 smallest uppercase letter-spacing-1">{{ $item->product_name ?? ($item->product->title ?? 'N/A') }}</span>
                                                        @php
                                                            $itemAttrs = $item->selected_attributes;
                                                            if (is_string($itemAttrs)) {
                                                                $itemAttrs = json_decode($itemAttrs, true);
                                                            }
                                                        @endphp
                                                        @if(is_array($itemAttrs) && count($itemAttrs) > 0)
                                                            <div class="mt-1 d-flex flex-wrap" style="gap: 6px;">
                                                                @foreach($itemAttrs as $key => $value)
                                                                    <span class="badge badge-light border text-muted smallest px-2 py-1 font-weight-bold uppercase letter-spacing-1 shadow-xs">
                                                                        {{ str_replace('_', ' ', $key) }}: {{ is_array($value) ? implode(', ', $value) : $value }}
                                                                    </span>
                                                                @endforeach
                                                            </div>
                                                        @endif
                                                    </div>
                                                </div>
                                            </td>
                                            <td class="text-center align-middle font-weight-bold text-muted text-monospace">${{ number_format($item->unit_price, 2) }}</td>
                                            <td class="text-center align-middle">
                                                <span class="badge badge-primary-light text-primary px-3 py-1 rounded-pill font-weight-bold smallest uppercase letter-spacing-1 shadow-xs">×{{ $item->quantity }}</span>
                                            </td>
                                            <td class="text-right pr-4 align-middle font-weight-bold text-dark h6 mb-0 text-monospace">${{ number_format($item->total_price, 2) }}</td>
                                        </tr>
                                    @endforeach
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {{-- Fiscal Summary --}}
                <div class="card card-premium shadow-sm border-0 mb-4">
                    <div class="card-body p-4">
                        <div class="row">
                            <div class="col-md-6">
                                <div class="p-4 rounded-xl h-100 border bg-light shadow-xs" style="border-style: dashed !important;">
                                    <h6 class="smallest text-uppercase font-weight-bold text-secondary letter-spacing-1 mb-3">
                                        <i class="fas fa-sticky-note mr-2 text-warning opacity-75"></i> Handling Directives
                                    </h6>
                                    <p class="text-muted smallest font-weight-bold uppercase letter-spacing-1 mb-0" style="line-height: 1.6;">
                                        {{ $order->notes ?: 'No specific handling instructions or notes provided by the customer for this transaction.' }}
                                    </p>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="table-responsive">
                                    <table class="table table-sm table-borderless mb-0">
                                        <tr class="text-muted smallest font-weight-bold text-uppercase letter-spacing-1">
                                            <th class="py-2">Item Subtotal</th>
                                            <td class="text-right py-2 text-dark text-monospace">${{ number_format($order->subtotal, 2) }}</td>
                                        </tr>
                                        <tr class="text-muted smallest font-weight-bold text-uppercase letter-spacing-1 border-bottom border-light">
                                            <th class="py-2">Logistics (Shipping)</th>
                                            <td class="text-right py-2 text-info text-monospace">+ ${{ number_format($order->shipping_cost, 2) }}</td>
                                        </tr>
                                        <tr class="text-muted smallest font-weight-bold text-uppercase letter-spacing-1 border-bottom border-light">
                                            <th class="py-2">Govt. Tax & Levies</th>
                                            <td class="text-right py-2 text-danger text-monospace">+ ${{ number_format($order->tax_amount, 2) }}</td>
                                        </tr>
                                        @if($order->discount_amount > 0)
                                            <tr class="text-success smallest font-weight-bold text-uppercase letter-spacing-1 border-bottom border-light">
                                                <th class="py-2">Promotional Discount</th>
                                                <td class="text-right py-2 text-monospace">- ${{ number_format($order->discount_amount, 2) }}</td>
                                            </tr>
                                        @endif
                                        <tr>
                                            <th class="pt-4 h6 font-weight-bold text-dark uppercase letter-spacing-2">AGGREGATE TOTAL</th>
                                            <td class="text-right pt-4 h4 font-weight-bold text-success text-monospace">${{ number_format($order->total_amount, 2) }}</td>
                                        </tr>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {{-- Right Column: Intelligence & Registry --}}
            <div class="col-md-4">
                {{-- Lifecycle Management --}}
                <div class="card card-premium shadow-sm border-0 mb-4 overflow-hidden print-hide">
                    <div class="card-header border-0 bg-primary py-3 px-4">
                        <h3 class="card-title font-weight-bold text-white smallest text-uppercase letter-spacing-1 mb-0">
                            <i class="fas fa-tasks mr-2"></i> Sync Lifecycle
                        </h3>
                    </div>
                    <div class="card-body p-4 bg-white">
                        <form action="{{ route('admin.product-orders.update-status', $order->id) }}" method="POST">
                            @csrf
                            <div class="form-group mb-4">
                                <label class="smallest text-uppercase font-weight-bold text-secondary mb-2 letter-spacing-1">Protocol Transition</label>
                                <select name="status" class="form-control select2 shadow-xs" id="statusSelect">
                                    @foreach($statuses as $value => $label)
                                        <option value="{{ $value }}" {{ $order->status === $value ? 'selected' : '' }}>{{ strtoupper($label) }}</option>
                                    @endforeach
                                </select>
                            </div>

                            <div class="form-group mb-4 {{ in_array($order->status, ['shipped', 'out_for_delivery', 'delivered']) ? '' : 'd-none' }}" id="trackingGroup">
                                <label class="smallest text-uppercase font-weight-bold text-secondary mb-2 letter-spacing-1">Courier Identification</label>
                                <div class="input-group border rounded shadow-xs bg-white" style="height: 46px; padding: 2px;">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text bg-transparent border-0 px-3"><i class="fas fa-truck text-primary opacity-50"></i></span>
                                    </div>
                                    <input type="text" name="tracking_number" class="form-control border-0 shadow-none bg-white h-100 py-0 smallest font-weight-bold text-monospace" 
                                           placeholder="WAYBILL / TRACKING ID" value="{{ $order->tracking_number }}">
                                </div>
                            </div>

                            <button type="submit" class="btn btn-primary btn-block rounded-pill font-weight-bold py-2 shadow-xs smallest uppercase letter-spacing-1">
                                <i class="fas fa-sync-alt mr-2"></i> Transition State
                            </button>
                        </form>
                    </div>
                </div>

                {{-- Logistics Timeline --}}
                <div class="card card-premium shadow-sm border-0 mb-4 overflow-hidden print-hide">
                    <div class="card-header border-0 bg-dark py-3 px-4">
                        <h3 class="card-title font-weight-bold text-white smallest text-uppercase letter-spacing-1 mb-0">
                            <i class="fas fa-history mr-2 opacity-50"></i> Logistics Timeline
                        </h3>
                    </div>
                    <div class="card-body p-0">
                        <ul class="list-group list-group-flush">
                            @php
                                $lifecycle = [
                                    ['id' => 'pending', 'label' => 'Order Registry', 'icon' => 'fa-shopping-cart'],
                                    ['id' => 'processing', 'label' => 'Internal Fulfillment', 'icon' => 'fa-cogs'],
                                    ['id' => 'shipped', 'label' => 'Transit Dispatched', 'icon' => 'fa-shipping-fast'],
                                    ['id' => 'out_for_delivery', 'label' => 'Near Destination', 'icon' => 'fa-map-marker-alt'],
                                    ['id' => 'delivered', 'label' => 'Registry Closed', 'icon' => 'fa-check-circle'],
                                ];
                                
                                $statusOrder = ['pending', 'processing', 'shipped', 'out_for_delivery', 'delivered'];
                                $currentIdx = array_search($order->status, $statusOrder);
                                if($currentIdx === false) $currentIdx = -1;
                            @endphp

                            @foreach($lifecycle as $index => $step)
                                @php
                                    $isActive = ($order->status === $step['id']);
                                    $isPassed = ($currentIdx >= $index);
                                    $colorClass = $isPassed ? 'text-success' : 'text-muted';
                                @endphp
                                <li class="list-group-item d-flex align-items-center py-3 border-0 {{ $isActive ? 'bg-primary-soft' : '' }}">
                                    <div class="mr-3 icon-box-soft {{ $isPassed ? 'bg-success-soft' : 'bg-light' }} shadow-xs d-flex align-items-center justify-content-center" style="width: 38px; height: 38px; border-radius: 10px;">
                                        <i class="fas {{ $step['icon'] }} smallest {{ $colorClass }}"></i>
                                    </div>
                                    <div class="flex-grow-1">
                                        <div class="font-weight-bold smallest uppercase letter-spacing-1 {{ $colorClass }}">{{ $step['label'] }}</div>
                                        @if($isActive)
                                            <span class="smallest text-primary font-weight-bold uppercase letter-spacing-1" style="font-size: 0.6rem;">CURRENT STATE</span>
                                        @endif
                                    </div>
                                    @if($isPassed)
                                        <i class="fas fa-check-circle text-success smallest opacity-50"></i>
                                    @endif
                                </li>
                            @endforeach
                        </ul>
                    </div>
                </div>

                {{-- Client Registry --}}
                <div class="card card-premium shadow-sm border-0 overflow-hidden">
                    <div class="card-header border-0 bg-white py-3 px-4 border-bottom">
                        <h3 class="card-title font-weight-bold text-dark smallest text-uppercase letter-spacing-1 mb-0">
                            <i class="fas fa-id-card mr-2 text-primary opacity-50"></i> Client Intelligence
                        </h3>
                    </div>
                    <div class="card-body p-4">
                        <div class="d-flex align-items-center mb-4 pb-4 border-bottom">
                            <div class="icon-box-soft bg-primary-soft mr-3 shadow-xs d-flex align-items-center justify-content-center" style="width: 50px; height: 50px; border-radius: 12px;">
                                <i class="fas fa-user-tie text-primary h5 mb-0"></i>
                            </div>
                            <div>
                                <span class="d-block font-weight-bold text-dark mb-0 smallest uppercase letter-spacing-1">{{ $order->shipping_name ?: ($order->user->name ?? 'GUEST') }}</span>
                                <span class="text-muted smallest font-weight-bold text-monospace">{{ $order->user->email ?? 'Direct / Legacy Order' }}</span>
                            </div>
                        </div>

                        <div class="shipping-address-block">
                            <label class="smallest text-uppercase font-weight-bold text-secondary mb-2 d-block letter-spacing-1">Logistics Destination</label>
                            <div class="p-3 rounded-xl border bg-light shadow-xs">
                                <p class="mb-2 text-dark font-weight-bold smallest uppercase letter-spacing-1"><i class="fas fa-map-pin mr-2 text-danger opacity-50"></i> {{ $order->shipping_address }}</p>
                                <p class="mb-1 text-muted smallest font-weight-bold uppercase letter-spacing-1 ml-4">{{ $order->shipping_city }}, {{ $order->shipping_state }} {{ $order->shipping_zip }}</p>
                                <p class="mb-0 text-primary font-weight-bold smallest text-uppercase ml-4 letter-spacing-2">{{ $order->shipping_country }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection

@section('css')
<style>
    .text-monospace { font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace !important; }
    .letter-spacing-2 { letter-spacing: 2px !important; }
    .object-fit-cover { object-fit: cover; }
    .bg-primary-soft { background: rgba(70, 165, 172, 0.1) !important; }
    .bg-success-soft { background: rgba(40, 167, 69, 0.1) !important; }
    .rounded-xl { border-radius: 12px !important; }

    @media print {
        .main-sidebar, .main-header, .btn, .btn-back, .print-hide, .sync-lifecycle-card {
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
    }
</style>
@endsection

@section('js')
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
@endsection
