/**
 * Product Configuration Page Logic
 */

(function($) {
    'use strict';

    $(document).ready(function() {
        let variationIndex = $('#variationsTable').data('next-index') || 0;
        let addonIndex = $('#addonsTable').data('next-index') || 0;

        // Add Attribute Row
        $(document).on('click', '[data-action="add-variation"]', function() {
            let row = `
                <tr data-index="${variationIndex}">
                    <td class="px-4 py-3"><input type="text" name="attributes[${variationIndex}][name]" class="form-control form-control-premium py-1 px-3 h-auto" placeholder="Color" required></td>
                    <td class="px-4 py-3"><input type="text" name="attributes[${variationIndex}][value]" class="form-control form-control-premium py-1 px-3 h-auto" placeholder="Red" required></td>
                    <td class="px-4 py-3"><input type="number" step="0.01" name="attributes[${variationIndex}][additional_price]" class="form-control form-control-premium py-1 px-3 h-auto" value="0.00"></td>
                    <td class="px-4 py-3"><input type="text" name="attributes[${variationIndex}][sku_extension]" class="form-control form-control-premium py-1 px-3 h-auto" placeholder="-RED"></td>
                    <td class="px-4 py-3"><input type="number" name="attributes[${variationIndex}][stock_quantity]" class="form-control form-control-premium py-1 px-3 h-auto" value="0"></td>
                    <td class="px-4 py-3 text-center">
                        <div class="custom-control custom-switch custom-switch-premium d-inline-block">
                            <input type="hidden" name="attributes[${variationIndex}][is_variation]" value="0">
                            <input type="checkbox" name="attributes[${variationIndex}][is_variation]" value="1" class="custom-control-input" id="attr_v_${variationIndex}" checked>
                            <label class="custom-control-label" for="attr_v_${variationIndex}"></label>
                        </div>
                    </td>
                    <td class="px-4 py-3 text-center"><button type="button" class="btn btn-danger btn-xs rounded-circle" data-action="remove-row"><i class="fas fa-trash"></i></button></td>
                </tr>
            `;
            $('#variationsTable tbody').append(row);
            variationIndex++;
        });

        // Add Addon Row
        $(document).on('click', '[data-action="add-addon"]', function() {
            let row = `
                <tr data-index="${addonIndex}">
                    <td class="px-4 py-3"><input type="text" name="addons[${addonIndex}][title]" class="form-control form-control-premium py-1 px-3 h-auto" placeholder="Gift Wrap" required></td>
                    <td class="px-4 py-3"><input type="number" step="0.01" name="addons[${addonIndex}][price]" class="form-control form-control-premium py-1 px-3 h-auto" value="0.00" required></td>
                    <td class="px-4 py-3">
                        <select name="addons[${addonIndex}][pricing_type]" class="form-control form-control-premium py-1 px-3 h-auto">
                            <option value="one_time">One-Time</option>
                            <option value="per_unit">Per Unit</option>
                        </select>
                    </td>
                    <td class="px-4 py-3"><input type="text" name="addons[${addonIndex}][description]" class="form-control form-control-premium py-1 px-3 h-auto" placeholder="Add beautiful gift box"></td>
                    <td class="px-4 py-3 text-center">
                        <div class="custom-control custom-switch custom-switch-premium d-inline-block">
                            <input type="hidden" name="addons[${addonIndex}][is_required]" value="0">
                            <input type="checkbox" name="addons[${addonIndex}][is_required]" value="1" class="custom-control-input" id="addon_r_${addonIndex}">
                            <label class="custom-control-label" for="addon_r_${addonIndex}"></label>
                        </div>
                    </td>
                    <td class="px-4 py-3 text-center"><button type="button" class="btn btn-danger btn-xs rounded-circle" data-action="remove-row"><i class="fas fa-trash"></i></button></td>
                </tr>
            `;
            $('#addonsTable tbody').append(row);
            addonIndex++;
        });

        // Remove Row
        $(document).on('click', '[data-action="remove-row"]', function() {
            $(this).closest('tr').remove();
        });

        // Slug Auto-generation
        const titleInput = $('#title');
        const slugInput = $('#slug');
        titleInput.on('input', function () {
            if(!slugInput.data('edited')){
                let slug = $(this).val().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
                slugInput.val(slug);
            }
        });
        slugInput.on('change', function() { $(this).data('edited', true); });
        
        // Initialize Select2 with Premium Theme
        if ($.fn.select2) {
            $('.select2').select2({ theme: 'bootstrap4', width: '100%' });
        }
    });
})(jQuery);
