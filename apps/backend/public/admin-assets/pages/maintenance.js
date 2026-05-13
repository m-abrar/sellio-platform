/**
 * Infrastructure Module: System Maintenance Orchestration
 */

(function($) {
    'use strict';

    $(document).ready(function() {
        // Task Execution Interceptor
        $('.btn-purge, button[type="submit"]').not('.btn-back').on('click', function(e) {
            const $button = $(this);
            const $form = $button.closest('form');
            if (!$form.length) return;

            const actionName = $button.text().trim();
            const url = $form.attr('action');
            const method = $form.attr('method') || 'POST';
            
            e.preventDefault();

            if (typeof SellioAlert === 'undefined') {
                // Fallback to native confirmation if helpers are missing
                if (confirm('AUTHORIZE OPERATION? System will execute: ' + actionName)) {
                    $form.submit();
                }
                return;
            }

            SellioAlert.fire({
                title: 'AUTHORIZE OPERATION?',
                text: `SYSTEM WILL EXECUTE: ${actionName}. PROCEED WITH CAUTION.`,
                icon: 'warning',
                iconColor: '#f59e0b',
                showCancelButton: true,
                confirmButtonText: '<i class="fas fa-bolt mr-2"></i> Execute Action',
                cancelButtonText: 'Abort Mission',
                reverseButtons: true
            }).then((result) => {
                if (result.isConfirmed) {
                    // Orchestrate AJAX Execution
                    SellioAlert.fire({
                        title: 'EXECUTING...',
                        text: "Please wait while the system optimizes foundational buffers.",
                        allowOutsideClick: false,
                        didOpen: () => {
                            SellioAlert.showLoading();
                        }
                    });

                    $.ajax({
                        url: url,
                        type: method,
                        data: $form.serialize(),
                        success: function(response) {
                            SellioAlert.fire({
                                icon: 'success',
                                title: 'SYSTEM INTELLIGENCE',
                                text: response.message || "OPERATION COMPLETED SUCCESSFULLY.",
                                iconColor: '#46a5ac'
                            });
                        },
                        error: function(xhr) {
                            const errorMsg = xhr.responseJSON?.message || 'AN UNKNOWN ERROR OCCURRED DURING EXECUTION.';
                            SellioAlert.fire({
                                icon: 'error',
                                title: 'MISSION INTERRUPTED',
                                text: errorMsg.toUpperCase(),
                                iconColor: '#ef4444'
                            });
                        }
                    });
                }
            });
        });
    });
})(jQuery);
