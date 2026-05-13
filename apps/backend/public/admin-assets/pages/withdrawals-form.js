/**
 * Financial Module: Payout Request Detail Logic
 */

(function($) {
    'use strict';

    $(document).ready(function() {
        // Approval Orchestration
        window.triggerApproval = function() {
            if (typeof SellioAlert !== 'undefined') {
                SellioAlert.fire({
                    title: 'Finalize Payout?',
                    text: "Confirm that funds have been transferred to the partner.",
                    icon: 'question',
                    iconColor: '#10b981',
                    showCancelButton: true,
                    confirmButtonText: '<i class="fas fa-check-circle mr-2"></i> Yes, Finalize!',
                    cancelButtonText: 'Cancel',
                    reverseButtons: true
                }).then((result) => {
                    if (result.isConfirmed) {
                        const form = document.getElementById('payoutApproveForm');
                        if (form) form.submit();
                    }
                });
            } else {
                // Fallback to native confirmation if helpers are missing
                if (confirm('Finalize Payout? Confirm that funds have been transferred.')) {
                    document.getElementById('payoutApproveForm').submit();
                }
            }
        };
    });
})(jQuery);
