/**
 * Finance Module: Transaction Configuration Logic
 */

(function($) {
    'use strict';

    $(document).ready(function() {
        // Handle Amount Formatting on Blur
        const amountInput = $('#amount');
        if (amountInput.length > 0) {
            amountInput.on('blur', function() {
                const val = parseFloat($(this).val());
                if (!isNaN(val)) {
                    $(this).val(val.toFixed(2));
                }
            });
        }
    });
})(jQuery);
