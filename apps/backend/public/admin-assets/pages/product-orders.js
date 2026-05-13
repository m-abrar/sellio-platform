/**
 * Manual Order Entry Management Logic
 */

(function($) {
    'use strict';

    let itemCount = $('.item-row').length;

    $(document).ready(function() {
        initSelect2();
        
        // Auto-fill shipping name when user is selected
        $(document).on('change', '#user_id', function() {
            const selected = $(this).find(':selected');
            if (selected.val()) {
                $('#shipping_name').val(selected.data('name'));
            }
        });

        // Add Line Item
        $(document).on('click', '[data-action="add-item-row"]', function() {
            const rowId = itemCount++;
            // Note: The product options are fetched from the existing select in the first row
            const productOptions = $('.product-select').first().html();
            
            const template = `
                <tr class="item-row">
                    <td class="pl-4 py-3 align-middle">
                        <select name="items[${rowId}][product_id]" class="form-control select2 product-select" required>
                            ${productOptions}
                        </select>
                    </td>
                    <td class="text-center align-middle">
                        <div class="font-weight-bold text-dark unit-price-display">$0.00</div>
                        <input type="hidden" name="items[${rowId}][unit_price]" class="unit-price-input" value="0">
                    </td>
                    <td class="text-center align-middle">
                        <input type="number" name="items[${rowId}][quantity]" class="form-control form-control-premium text-center quantity-input" value="1" min="1">
                    </td>
                    <td class="text-right align-middle pr-4 font-weight-bold text-primary row-total-display">
                        $0.00
                    </td>
                    <td class="align-middle text-center pr-4">
                        <button type="button" class="btn btn-link text-danger p-0" data-action="remove-item-row">
                            <i class="fas fa-times-circle"></i>
                        </button>
                    </td>
                </tr>
            `;
            $('#itemsBody').append(template);
            initSelect2();
        });

        // Remove Line Item
        $(document).on('click', '[data-action="remove-item-row"]', function() {
            if ($('.item-row').length > 1) {
                $(this).closest('tr').remove();
                calculateTotals();
            } else {
                if (window.Swal) {
                    Swal.fire('Manifest Error', 'Order must contain at least one line item.', 'error');
                }
            }
        });

        // Update price when product selection changes
        $(document).on('change', '.product-select', function() {
            const selected = $(this).find(':selected');
            const price = parseFloat(selected.data('price')) || 0;
            const row = $(this).closest('tr');
            
            row.find('.unit-price-display').text('$' + price.toFixed(2));
            row.find('.unit-price-input').val(price);
            
            calculateTotals();
        });

        // Calculate totals when quantity changes
        $(document).on('change', '.quantity-input, input[name="shipping_cost"]', function() {
            calculateTotals();
        });

        function initSelect2() {
            if ($.fn.select2) {
                $('.select2').each(function() {
                    if (!$(this).hasClass("select2-hidden-accessible")) {
                        $(this).select2({
                            theme: 'bootstrap4',
                            width: '100%'
                        });
                    }
                });
            }
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
    });
})(jQuery);
