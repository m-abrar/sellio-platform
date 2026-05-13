/**
 * Sellio Admin: SweetAlert2 Global Orchestration
 * 
 * Provides standardized behavioral logic and glassmorphic visual 
 * identity for all administrative confirmation dialogs and alerts.
 */

(function(window, Swal) {
    'use strict';

    if (!Swal) return;

    // Global SweetAlert2 Configuration
    const SellioAlert = Swal.mixin({
        customClass: {
            popup: 'swal2-glassmorphic',
            confirmButton: 'swal2-premium-btn btn btn-primary',
            cancelButton: 'swal2-premium-btn-cancel btn btn-light mr-3'
        },
        buttonsStyling: false,
        backdrop: `rgba(15, 23, 42, 0.4)`,
        showClass: {
            popup: 'swal2-show'
        },
        hideClass: {
            popup: 'swal2-hide'
        }
    });

    /**
     * Standard Delete Confirmation
     * @param {string} formId - The ID of the form to submit upon confirmation
     * @param {string} title - The title of the alert
     * @param {string} text - The descriptive text
     * @param {string} confirmBtn - Text for the confirmation button
     */
    window.confirmDelete = function(formId, title = 'Are you sure?', text = 'This action cannot be undone and data will be permanently removed.', confirmBtn = 'Yes, Delete Item') {
        SellioAlert.fire({
            title: title,
            text: text,
            icon: 'warning',
            iconColor: '#f59e0b',
            showCancelButton: true,
            confirmButtonText: `<i class="fas fa-trash-alt mr-2"></i> ${confirmBtn}`,
            cancelButtonText: 'No, Keep it',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                const form = document.getElementById(formId);
                if (form) form.submit();
            }
        });
    };

    /**
     * Standard Success Toast
     * @param {string} title - The message to display
     * @param {string} icon - The icon type (success, error, warning, info)
     */
    window.showToast = function(title, icon = 'success') {
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
        });

        Toast.fire({
            icon: icon,
            title: title
        });
    };


    /**
     * Automatic Sellio-Themed Confirmation for Delete Buttons
     * Scans for buttons with standard 'onclick="return confirm(...)"' and 
     * replaces them with premium SweetAlert2 modals.
     */
    window.upgradeDeleteButtons = function() {
        document.querySelectorAll('form button[onclick*="confirm"]').forEach(function(btn) {
            let onClickText = btn.getAttribute('onclick');
            let message = 'Are you sure you want to proceed with this deletion?';

            // Extract message from confirm('...')
            if (onClickText) {
                let match = onClickText.match(/confirm\(['"](.+?)['"]\)/);
                if (match && match[1]) {
                    message = match[1];
                }
            }

            // Nullify native confirm to prevent browser popup
            btn.removeAttribute('onclick');

            // Add Premium SweetAlert2 handler
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const form = btn.closest('form');

                SellioAlert.fire({
                    title: 'Confirm Deletion',
                    text: message,
                    icon: 'warning',
                    iconColor: '#f59e0b',
                    showCancelButton: true,
                    confirmButtonText: '<i class="fas fa-trash-alt mr-2"></i> Yes, Delete It',
                    cancelButtonText: 'Cancel',
                    reverseButtons: true
                }).then((result) => {
                    if (result.isConfirmed) {
                        form.submit();
                    }
                });
            });
        });
    };

    // Auto-run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', window.upgradeDeleteButtons);
    } else {
        window.upgradeDeleteButtons();
    }

    // Expose the configured instance
    window.SellioAlert = SellioAlert;

})(window, window.Swal);
