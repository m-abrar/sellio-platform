/**
 * Administrative Services: Appointment Lifecycle Orchestration
 * 
 * This module facilitates the interactive behavior for the service 
 * appointment configuration interface. It orchestrates client principal 
 * assignment via Select2 and ensuring consistent UI behavior across 
 * appointment creation and modification workflows.
 */
$(document).ready(function() {
    // Initialize Select2 for principal and service mapping
    if (typeof $('.select2').select2 === 'function') {
        $('.select2').select2({
            theme: 'bootstrap4',
            width: '100%',
            placeholder: function() {
                return $(this).data('placeholder') || "Select Option";
            }
        });
    }
});
