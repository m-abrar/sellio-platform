{{--
    Administrative E-Commerce: Order Initialization
    
    This view facilitates the manual entry of product orders, 
    supporting offline and telephone sales protocols. It orchestrates 
    customer identification, multi-line item manifests with dynamic 
    pricing, and logistics destination parameters. It features a real-time 
    financial summary and transaction status controls.
    
    @extends adminlte::page
    @context E-Commerce Module Management
    @variables Collection $users Registered platform customers.
    @variables Collection $products Available inventory for order mapping.
--}}
@extends('adminlte::page')

@section('title', __('Initialize New Manual Order'))

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-8">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-cart-plus mr-2 text-primary opacity-50"></i> 
                    {{ __('Initialize Order') }}
                </h1>
                <p class="text-muted mt-2 small uppercase letter-spacing-1 mb-0">
                    {{ __('Manual transaction entry for offline or telephone sales protocols.') }}
                </p>
            </div>
            <div class="col-sm-4 text-right">
                <a href="{{ route('admin.product-orders.index') }}" class="btn btn-back shadow-sm">
                    <i class="fas fa-arrow-left mr-1"></i> {{ __('Back to Registry') }}
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
            {{-- Main Content Column --}}
            <div class="col-md-8">
                {{-- Customer Identification --}}
                <div class="card border-0 shadow-premium rounded-xl overflow-hidden mb-4">
                    <div class="card-header border-0 bg-white py-4 px-4">
                        <h3 class="card-title-main">{{ __('Customer Identification') }}</h3>
                    </div>
                    <div class="card-body p-4 pt-0">
                        <div class="form-group mb-0">
                            <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">{{ __('Select Registered User') }}</label>
                            <select name="user_id" id="user_id" class="form-control select2" required>
                                <option value="">-- {{ __('SEARCH CUSTOMER DATABASE') }} --</option>
                                @foreach($users as $user)
                                    <option value="{{ $user->id }}" data-name="{{ $user->name }}" data-email="{{ $user->email }}">
                                        {{ $user->name }} ({{ $user->email }})
                                    </option>
                                @endforeach
                            </select>
                            @error('user_id') <span class="invalid-feedback d-block">{{ $message }}</span> @enderror
                        </div>
                    </div>
                </div>

                {{-- Item Manifest --}}
                <div class="card border-0 shadow-premium rounded-xl overflow-hidden mb-4">
                    <div class="card-header border-0 bg-white py-4 px-4 d-flex align-items-center">
                        <h3 class="card-title-main">{{ __('Item Manifest') }}</h3>
                        <button type="button" class="btn btn-primary btn-sm rounded-pill px-3 ml-auto font-weight-bold smallest uppercase letter-spacing-1" onclick="addItemRow()">
                            <i class="fas fa-plus mr-1"></i> {{ __('Add Line Item') }}
                        </button>
                    </div>
                    <div class="card-body p-0">
                        <div class="table-responsive">
                            <table class="table table-premium mb-0" id="itemsTable">
                                <thead class="bg-light">
                                    <tr>
                                        <th class="pl-4 uppercase smallest letter-spacing-1 font-weight-bold" style="width: 50%">{{ __('Product Selection') }}</th>
                                        <th class="text-center uppercase smallest letter-spacing-1 font-weight-bold">{{ __('Rate') }}</th>
                                        <th class="text-center uppercase smallest letter-spacing-1 font-weight-bold" style="width: 120px">{{ __('Qty') }}</th>
                                        <th class="text-right pr-4 uppercase smallest letter-spacing-1 font-weight-bold">{{ __('Subtotal') }}</th>
                                        <th style="width: 50px"></th>
                                    </tr>
                                </thead>
                                <tbody id="itemsBody">
                                    <tr class="item-row">
                                        <td class="pl-4 py-3 align-middle">
                                            <select name="items[0][product_id]" class="form-control select2 product-select" required onchange="updateRowPrice(this)">
                                                <option value="">-- {{ __('SELECT PRODUCT') }} --</option>
                                                @foreach($products as $product)
                                                    <option value="{{ $product->id }}" data-price="{{ $product->price }}" data-title="{{ $product->title }}">
                                                        {{ $product->title }} ({{ number_format($product->price, 2) }})
                                                    </option>

                                                @endforeach
                                            </select>
                                        </td>
                                        <td class="text-center align-middle">
                                            <div class="font-weight-bold text-dark unit-price-display">$0.00</div>
                                            <input type="hidden" name="items[0][unit_price]" class="unit-price-input" value="0">
                                        </td>
                                        <td class="text-center align-middle">
                                            <input type="number" name="items[0][quantity]" class="form-control form-control-premium text-center quantity-input" value="1" min="1" onchange="calculateTotals()">
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

            {{-- Sidebar Column --}}
            <div class="col-md-4">
                {{-- Order Summary --}}
                <div class="card border-0 shadow-premium rounded-xl overflow-hidden mb-4">
                    <div class="card-header border-0 bg-white py-4 px-4">
                        <h3 class="card-title-side">{{ __('Order Summary') }}</h3>
                    </div>
                    <div class="card-body p-4">
                        <div class="d-flex justify-content-between mb-3">
                            <span class="small font-weight-bold text-muted uppercase letter-spacing-1">{{ __('Subtotal') }}</span>
                            <span class="small font-weight-bold text-dark" id="summarySubtotal">$0.00</span>
                            <input type="hidden" name="subtotal" id="inputSubtotal" value="0">
                        </div>
                        <div class="d-flex justify-content-between mb-3 align-items-center">
                            <span class="small font-weight-bold text-muted uppercase letter-spacing-1">{{ __('Logistics Rate') }}</span>
                            <div style="width: 120px;">
                                <input type="number" name="shipping_cost" class="form-control form-control-premium text-right font-weight-bold" value="0" step="0.01" onchange="calculateTotals()">
                            </div>
                        </div>
                        <div class="d-flex justify-content-between mb-4 pb-4 border-bottom">
                            <span class="small font-weight-bold text-muted uppercase letter-spacing-1">{{ __('Tax Ledger (0%)') }}</span>
                            <span class="small font-weight-bold text-dark">$0.00</span>
                            <input type="hidden" name="tax_amount" value="0">
                        </div>
                        <div class="d-flex justify-content-between mb-4">
                            <span class="small font-weight-bold text-dark uppercase letter-spacing-1">{{ __('Grand Total') }}</span>
                            <span class="h5 font-weight-bold text-primary mb-0" id="summaryTotal">$0.00</span>
                            <input type="hidden" name="total_amount" id="inputTotal" value="0">
                        </div>

                        <div class="form-group mb-4">
                            <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">{{ __('Transaction Status') }}</label>
                            <select name="status" class="form-control form-control-premium select2" required>
                                <option value="pending">{{ __('PENDING') }}</option>
                                <option value="processing">{{ __('PROCESSING') }}</option>
                                <option value="shipped">{{ __('SHIPPED') }}</option>
                                <option value="delivered">{{ __('DELIVERED') }}</option>
                            </select>
                        </div>

                        <button type="submit" class="btn btn-submit-premium btn-block py-3">
                            <i class="fas fa-check-double mr-2"></i> {{ __('Authorize Order') }}
                        </button>
                    </div>
                </div>

                {{-- Logistics Destination --}}
                <div class="card border-0 shadow-premium rounded-xl overflow-hidden mb-4">
                    <div class="card-header border-0 bg-white py-4 px-4">
                        <h3 class="card-title-side">{{ __('Logistics Destination') }}</h3>
                    </div>
                    <div class="card-body p-4 pt-0">
                        <div class="form-group mb-4">
                            <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">{{ __('Recipient Name') }}</label>
                            <input type="text" name="shipping_name" id="shipping_name" class="form-control form-control-premium" required placeholder="{{ __('Full Identity') }}">
                        </div>
                        <div class="form-group mb-4">
                            <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">{{ __('Street Address') }}</label>
                            <textarea name="shipping_address" id="shipping_address" class="form-control" rows="3" required placeholder="{{ __('Full shipping coordinates...') }}" style="border-radius: 16px; border: 1px solid var(--border-light);"></textarea>
                        </div>
                        <div class="row">
                            <div class="col-6">
                                <div class="form-group mb-4">
                                    <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">{{ __('City') }}</label>
                                    <input type="text" name="shipping_city" class="form-control form-control-premium" required>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="form-group mb-4">
                                    <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">{{ __('Zip Code') }}</label>
                                    <input type="text" name="shipping_zip" class="form-control form-control-premium" required>
                                </div>
                            </div>
                        </div>
                        <div class="form-group mb-0">
                            <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">{{ __('Internal Protocol Notes') }}</label>
                            <textarea name="notes" class="form-control" rows="2" placeholder="{{ __('Administrative remarks...') }}" style="border-radius: 16px; border: 1px solid var(--border-light);"></textarea>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </form>
</div>
@endsection

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
                    theme: 'bootstrap4',
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
                    <select name="items[${rowId}][product_id]" class="form-control select2 product-select" required onchange="updateRowPrice(this)">
                        <option value="">-- {{ __('SELECT PRODUCT') }} --</option>
                        @foreach($products as $product)
                            <option value="{{ $product->id }}" data-price="{{ $product->price }}" data-title="{{ $product->title }}">
                                {{ $product->title }} ({{ number_format($product->price, 2) }})
                            </option>

                        @endforeach
                    </select>
                </td>
                <td class="text-center align-middle">
                    <div class="font-weight-bold text-dark unit-price-display">$0.00</div>
                    <input type="hidden" name="items[${rowId}][unit_price]" class="unit-price-input" value="0">
                </td>
                <td class="text-center align-middle">
                    <input type="number" name="items[${rowId}][quantity]" class="form-control form-control-premium text-center quantity-input" value="1" min="1" onchange="calculateTotals()">
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
