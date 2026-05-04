@extends('adminlte::page')

@section('title', __('Initialize New Manual Order | Executive Registry'))

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-6">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-cart-plus mr-2 text-primary opacity-50"></i>
                    {{ __('Initialize Order') }}
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">Manual transaction entry for offline or telephone sales protocols.</p>
            </div>
            <div class="col-sm-6 text-right">
                <a href="{{ route('admin.product-orders.index') }}" class="btn btn-back shadow-sm rounded-pill px-4">
                    <i class="fas fa-arrow-left mr-1"></i> BACK TO REGISTRY
                </a>
            </div>
        </div>
    </div>
@stop

@section('content')
    <div class="container-fluid pb-5">
        @include('admin.alert')

        <form action="{{ route('admin.product-orders.store') }}" method="POST" id="orderForm">
            @csrf
            <div class="row">
                {{-- Left Column: Customer & Items --}}
                <div class="col-md-8">
                    {{-- Customer Selection Card --}}
                    <div class="card card-premium shadow-premium overflow-hidden mb-4 border-0">
                        <div class="card-header border-0 bg-white py-4 px-4 d-flex align-items-center">
                            <h3 class="card-title font-weight-bold text-dark mb-0 text-uppercase letter-spacing-1" style="font-size: 1.1rem;">
                                <i class="fas fa-user-circle mr-2 text-primary opacity-50"></i> Customer Identification
                            </h3>
                        </div>
                        <div class="card-body p-4">
                            <div class="row">
                                <div class="col-md-12">
                                    <label class="smallest text-uppercase font-weight-bold text-muted mb-2 letter-spacing-1">Select Registered User</label>
                                    <div class="input-group input-group-premium shadow-xs">
                                        <div class="input-group-prepend">
                                            <span class="input-group-text"><i class="fas fa-search text-primary"></i></span>
                                        </div>
                                        <select name="user_id" id="user_id" class="form-control select2" required>
                                            <option value="">-- SEARCH CUSTOMER DATABASE --</option>
                                            @foreach($users as $user)
                                                <option value="{{ $user->id }}" data-name="{{ $user->name }}" data-email="{{ $user->email }}">
                                                    {{ $user->name }} ({{ $user->email }})
                                                </option>
                                            @endforeach
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {{-- Order Items Card --}}
                    <div class="card card-premium shadow-premium overflow-hidden mb-4 border-0">
                        <div class="card-header border-0 bg-white py-4 px-4 d-flex align-items-center">
                            <h3 class="card-title font-weight-bold text-dark mb-0 text-uppercase letter-spacing-1" style="font-size: 1.1rem;">
                                <i class="fas fa-list-ul mr-2 text-primary opacity-50"></i> Item Manifest
                            </h3>
                            <button type="button" class="btn btn-primary btn-sm rounded-pill px-3 ml-auto font-weight-bold smallest" onclick="addItemRow()">
                                <i class="fas fa-plus mr-1"></i> ADD LINE ITEM
                            </button>
                        </div>
                        <div class="card-body p-0">
                            <div class="table-responsive">
                                <table class="table table-premium mb-0" id="itemsTable">
                                    <thead class="bg-light text-uppercase smallest font-weight-bold">
                                        <tr>
                                            <th class="pl-4" style="width: 50%">Product Selection</th>
                                            <th class="text-center">Rate</th>
                                            <th class="text-center" style="width: 120px">Qty</th>
                                            <th class="text-right pr-4">Subtotal</th>
                                            <th style="width: 50px"></th>
                                        </tr>
                                    </thead>
                                    <tbody id="itemsBody">
                                        {{-- Row Template --}}
                                        <tr class="item-row">
                                            <td class="pl-4 py-3 align-middle">
                                                <div class="input-group input-group-premium shadow-none border-light-soft" style="height: 38px;">
                                                    <select name="items[0][product_id]" class="form-control select2 product-select" required onchange="updateRowPrice(this)">
                                                        <option value="">-- SELECT PRODUCT --</option>
                                                        @foreach($products as $product)
                                                            <option value="{{ $product->id }}" data-price="{{ $product->price }}" data-name="{{ $product->name }}">
                                                                {{ $product->name }} ({{ number_format($product->price, 2) }})
                                                            </option>
                                                        @endforeach
                                                    </select>
                                                </div>
                                            </td>
                                            <td class="text-center align-middle">
                                                <div class="font-weight-bold text-dark unit-price-display">$0.00</div>
                                                <input type="hidden" name="items[0][unit_price]" class="unit-price-input" value="0">
                                            </td>
                                            <td class="text-center align-middle">
                                                <input type="number" name="items[0][quantity]" class="form-control text-center quantity-input" value="1" min="1" onchange="calculateTotals()" style="border-radius: 8px !important; height: 38px !important;">
                                            </td>
                                            <td class="text-right align-middle pr-4 font-weight-bold text-primary row-total-display">
                                                $0.00
                                            </td>
                                            <td class="align-middle text-center pr-4">
                                                <button type="button" class="btn btn-link text-danger p-0" onclick="removeItemRow(this)">
                                                    <i class="fas fa-times-circle"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                {{-- Right Column: Shipping & Summary --}}
                <div class="col-md-4">
                    {{-- Summary Card --}}
                    <div class="card card-premium shadow-premium overflow-hidden mb-4 border-0">
                        <div class="card-header bg-dark d-flex align-items-center py-3 px-4 border-0" style="background: #0f172a !important; border-bottom: 3px solid var(--primary) !important;">
                            <h3 class="card-title text-white mb-0 font-weight-bold smallest text-uppercase letter-spacing-1">
                                <i class="fas fa-receipt mr-1 text-primary"></i> Order Summary
                            </h3>
                        </div>
                        <div class="card-body p-4">
                            <div class="d-flex justify-content-between mb-3">
                                <span class="text-muted font-weight-bold smallest text-uppercase">Subtotal</span>
                                <span class="text-dark font-weight-bold" id="summarySubtotal">$0.00</span>
                                <input type="hidden" name="subtotal" id="inputSubtotal" value="0">
                            </div>
                            <div class="d-flex justify-content-between mb-3 align-items-center">
                                <span class="text-muted font-weight-bold smallest text-uppercase">Shipping Protocol</span>
                                <div style="width: 100px;">
                                    <input type="number" name="shipping_cost" class="form-control form-control-sm text-right font-weight-bold" value="0" step="0.01" onchange="calculateTotals()" style="border-radius: 8px !important;">
                                </div>
                            </div>
                            <div class="d-flex justify-content-between mb-4 pb-4 border-bottom">
                                <span class="text-muted font-weight-bold smallest text-uppercase">Tax Ledger (0%)</span>
                                <span class="text-dark font-weight-bold">$0.00</span>
                                <input type="hidden" name="tax_amount" value="0">
                            </div>
                            <div class="d-flex justify-content-between mb-4">
                                <span class="text-dark font-weight-bold text-uppercase h6 mb-0">Grand Total</span>
                                <span class="text-primary font-weight-bold h5 mb-0" id="summaryTotal">$0.00</span>
                                <input type="hidden" name="total_amount" id="inputTotal" value="0">
                            </div>

                            <div class="form-group mb-4">
                                <label class="smallest text-uppercase font-weight-bold text-muted mb-2 letter-spacing-1">Transaction Status</label>
                                <div class="input-group input-group-premium shadow-xs">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text"><i class="fas fa-traffic-light text-primary"></i></span>
                                    </div>
                                    <select name="status" class="form-control select2" required>
                                        <option value="pending">PENDING</option>
                                        <option value="processing">PROCESSING</option>
                                        <option value="shipped">SHIPPED</option>
                                        <option value="delivered">DELIVERED</option>
                                    </select>
                                </div>
                            </div>

                            <button type="submit" class="btn btn-submit-premium btn-block py-3 font-weight-bold smallest text-uppercase letter-spacing-1">
                                <i class="fas fa-check-double mr-2"></i> AUTHORIZE & SYNC ORDER
                            </button>
                        </div>
                    </div>

                    {{-- Logistics Details Card --}}
                    <div class="card card-premium shadow-premium overflow-hidden mb-4 border-0">
                        <div class="card-header border-0 bg-white py-4 px-4 d-flex align-items-center">
                            <h3 class="card-title font-weight-bold text-dark mb-0 text-uppercase letter-spacing-1" style="font-size: 1.1rem;">
                                <i class="fas fa-truck mr-1 text-primary opacity-50"></i> Logistics Destination
                            </h3>
                        </div>
                        <div class="card-body p-4">
                            <div class="mb-4">
                                <label class="smallest text-uppercase font-weight-bold text-muted mb-2 letter-spacing-1">Recipient Name</label>
                                <div class="input-group input-group-premium shadow-xs">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text"><i class="fas fa-id-card text-primary"></i></span>
                                    </div>
                                    <input type="text" name="shipping_name" id="shipping_name" class="form-control" required placeholder="Full Name">
                                </div>
                            </div>
                            <div class="mb-4">
                                <label class="smallest text-uppercase font-weight-bold text-muted mb-2 letter-spacing-1">Street Address</label>
                                <textarea name="shipping_address" id="shipping_address" class="form-control border shadow-xs bg-white p-3" rows="3" required placeholder="Full shipping address" style="border-radius: 12px; font-size: 0.9rem;"></textarea>
                            </div>
                            <div class="row">
                                <div class="col-6 mb-4">
                                    <label class="smallest text-uppercase font-weight-bold text-muted mb-2 letter-spacing-1">City</label>
                                    <div class="input-group input-group-premium shadow-xs">
                                        <div class="input-group-prepend">
                                            <span class="input-group-text"><i class="fas fa-city text-primary"></i></span>
                                        </div>
                                        <input type="text" name="shipping_city" class="form-control" required>
                                    </div>
                                </div>
                                <div class="col-6 mb-4">
                                    <label class="smallest text-uppercase font-weight-bold text-muted mb-2 letter-spacing-1">Zip Code</label>
                                    <div class="input-group input-group-premium shadow-xs">
                                        <div class="input-group-prepend">
                                            <span class="input-group-text"><i class="fas fa-map-pin text-primary"></i></span>
                                        </div>
                                        <input type="text" name="shipping_zip" class="form-control" required>
                                    </div>
                                </div>
                            </div>
                            <div class="mb-0">
                                <label class="smallest text-uppercase font-weight-bold text-muted mb-2 letter-spacing-1">Notes / Internal Protocol</label>
                                <textarea name="notes" class="form-control border shadow-xs bg-white p-3" rows="2" placeholder="Internal remarks..." style="border-radius: 12px; font-size: 0.9rem;"></textarea>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    </div>
@stop

@push('css')
<style>
    .unit-price-display { font-size: 0.9rem; }
    .row-total-display { font-size: 1rem; }
    .border-light-soft { border: 1px solid #f1f5f9 !important; }
</style>
@endpush

@push('js')
<script>
    let itemCount = 1;

    $(document).ready(function() {
        initSelect2();
        
        // Auto-fill shipping name when user is selected
        $('#user_id').on('change', function() {
            const selected = $(this).find(':selected');
            if (selected.val()) {
                $('#shipping_name').val(selected.data('name'));
            }
        });
    });

    function initSelect2() {
        $('.select2').each(function() {
            if (!$(this).hasClass("select2-hidden-accessible")) {
                $(this).select2({
                    theme: 'default',
                    width: '100%'
                });
            }
        });
    }

    function addItemRow() {
        const rowId = itemCount++;
        const template = `
            <tr class="item-row">
                <td class="pl-4 py-3 align-middle">
                    <div class="input-group input-group-premium shadow-none border-light-soft" style="height: 38px;">
                        <select name="items[${rowId}][product_id]" class="form-control select2 product-select" required onchange="updateRowPrice(this)">
                            <option value="">-- SELECT PRODUCT --</option>
                            @foreach($products as $product)
                                <option value="{{ $product->id }}" data-price="{{ $product->price }}" data-name="{{ $product->name }}">
                                    {{ $product->name }} ({{ number_format($product->price, 2) }})
                                </option>
                            @endforeach
                        </select>
                    </div>
                </td>
                <td class="text-center align-middle">
                    <div class="font-weight-bold text-dark unit-price-display">$0.00</div>
                    <input type="hidden" name="items[${rowId}][unit_price]" class="unit-price-input" value="0">
                </td>
                <td class="text-center align-middle">
                    <input type="number" name="items[${rowId}][quantity]" class="form-control text-center quantity-input" value="1" min="1" onchange="calculateTotals()" style="border-radius: 8px !important; height: 38px !important;">
                </td>
                <td class="text-right align-middle pr-4 font-weight-bold text-primary row-total-display">
                    $0.00
                </td>
                <td class="align-middle text-center pr-4">
                    <button type="button" class="btn btn-link text-danger p-0" onclick="removeItemRow(this)">
                        <i class="fas fa-times-circle"></i>
                    </button>
                </td>
            </tr>
        `;
        $('#itemsBody').append(template);
        initSelect2();
    }

    function removeItemRow(btn) {
        if ($('.item-row').length > 1) {
            $(btn).closest('tr').remove();
            calculateTotals();
        } else {
            Swal.fire('Manifest Error', 'Order must contain at least one line item.', 'error');
        }
    }

    function updateRowPrice(select) {
        const selected = $(select).find(':selected');
        const price = parseFloat(selected.data('price')) || 0;
        const row = $(select).closest('tr');
        
        row.find('.unit-price-display').text('$' + price.toFixed(2));
        row.find('.unit-price-input').val(price);
        
        calculateTotals();
    }

    function calculateTotals() {
        let subtotal = 0;
        
        $('.item-row').each(function() {
            const price = parseFloat($(this).find('.unit-price-input').val()) || 0;
            const qty = parseInt($(this).find('.quantity-input').val()) || 0;
            const total = price * qty;
            
            $(this).find('.row-total-display').text('$' + total.toFixed(2));
            subtotal += total;
        });
        
        const shipping = parseFloat($('input[name="shipping_cost"]').val()) || 0;
        const total = subtotal + shipping;
        
        $('#summarySubtotal').text('$' + subtotal.toFixed(2));
        $('#inputSubtotal').val(subtotal.toFixed(2));
        
        $('#summaryTotal').text('$' + total.toFixed(2));
        $('#inputTotal').val(total.toFixed(2));
    }
</script>
@endpush
