/**
 * Administrative Financial: Subscription Enrollment Orchestration
 * 
 * Manages the interactive components of the subscription form,
 * including user account selection (Select2) and lifecycle tooltips.
 */

$(function () {
    // Initialize standard tooltips
    if (typeof $.fn.tooltip === 'function') {
        $('[data-toggle="tooltip"]').tooltip();
    }

    // Initialize Branded Select2 for account lookup
    if (typeof $.fn.select2 === 'function' && $('.select2').length) {
        $('.select2').select2({
            theme: 'bootstrap4',
            width: '100%',
            placeholder: $('#user-select-label').data('placeholder') || 'Select an account...'
        });
    }
});
