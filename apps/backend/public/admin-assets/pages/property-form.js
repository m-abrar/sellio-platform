(function ($) {
    'use strict';

    $(function () {
        let scoreIndex = parseInt($('#scoresTable').data('next-index') || 0, 10);
        let seasonalIndex = parseInt($('#seasonalPricesTable').data('next-index') || 0, 10);

        $(document).on('click', '[data-action="add-score"]', function () {
            const row = `
                <tr data-index="${scoreIndex}">
                    <td class="px-4 py-3">
                        <input type="text" name="scores[${scoreIndex}][title]" list="property-score-presets" class="form-control form-control-premium" placeholder="Walk Score" required>
                    </td>
                    <td class="px-4 py-3">
                        <input type="number" step="0.01" min="0" name="scores[${scoreIndex}][score]" class="form-control form-control-premium" placeholder="85" required>
                    </td>
                    <td class="px-4 py-3">
                        <input type="text" name="scores[${scoreIndex}][units]" class="form-control form-control-premium" placeholder="/100">
                    </td>
                    <td class="px-4 py-3">
                        <input type="text" name="scores[${scoreIndex}][description]" class="form-control form-control-premium" placeholder="Excellent">
                    </td>
                    <td class="px-4 py-3 text-center">
                        <button type="button" class="btn btn-danger btn-xs rounded-circle" data-action="remove-row"><i class="fas fa-trash"></i></button>
                    </td>
                </tr>
            `;

            $('#scoresTable tbody').append(row);
            scoreIndex++;
        });

        $(document).on('click', '[data-action="add-seasonal-price"]', function () {
            const row = `
                <tr data-index="${seasonalIndex}">
                    <td class="px-4 py-3">
                        <input type="text" name="seasonal_prices[${seasonalIndex}][name]" class="form-control form-control-premium" placeholder="Summer Peak" required>
                    </td>
                    <td class="px-4 py-3">
                        <input type="date" name="seasonal_prices[${seasonalIndex}][start_date]" class="form-control form-control-premium" required>
                    </td>
                    <td class="px-4 py-3">
                        <input type="date" name="seasonal_prices[${seasonalIndex}][end_date]" class="form-control form-control-premium" required>
                    </td>
                    <td class="px-4 py-3">
                        <input type="number" step="0.01" min="0" name="seasonal_prices[${seasonalIndex}][price]" class="form-control form-control-premium" placeholder="0.00" required>
                    </td>
                    <td class="px-4 py-3 text-center">
                        <button type="button" class="btn btn-danger btn-xs rounded-circle" data-action="remove-row"><i class="fas fa-trash"></i></button>
                    </td>
                </tr>
            `;

            $('#seasonalPricesTable tbody').append(row);
            seasonalIndex++;
        });

        $(document).on('click', '[data-action="remove-row"]', function () {
            $(this).closest('tr').remove();
        });
    });
})(jQuery);
