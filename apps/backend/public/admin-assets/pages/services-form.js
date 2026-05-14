/**
 * Administrative Services: Inventory Lifecycle Orchestration
 * 
 * This module facilitates the interactive behavior for the service 
 * inventory configuration interface. It orchestrates slug generation, 
 * taxonomy assignment via Select2, and destructive operations (delete) 
 * via SweetAlert2, ensuring 100% CSP compliance.
 */
$(document).ready(function() {
    // Initialize Select2 for taxonomy and regional hub mapping
    if (typeof $('.select2').select2 === 'function') {
        $('.select2').select2({
            theme: 'bootstrap4',
            width: '100%'
        });
    }

    // Slug generation logic: Automatically derives URI segments from title inputs
    const titleInput = $('#title');
    const slugInput = $('#slug');

    if (titleInput.length && slugInput.length) {
        titleInput.on('input', function() {
            if (!slugInput.data('edited')) {
                let slug = $(this).val()
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/^-|-$/g, '');
                slugInput.val(slug);
            }
        });

        slugInput.on('change', function() {
            $(this).data('edited', true);
        });
    }
});

/**
 * Triggers the destructive disposal protocol for a service listing.
 * 
 * @param {string} formId The unique identifier for the disposal form.
 * @param {string} title Localized confirmation title.
 * @param {string} text Localized confirmation warning text.
 * @param {string} confirmText Localized confirmation button label.
 */
function confirmServiceDeletion(formId, title, text, confirmText) {
    if (typeof Swal !== 'undefined') {
        Swal.fire({
            title: title || 'Are you sure?',
            text: text || "Permanently delete this service listing?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#64748b',
            confirmButtonText: confirmText || 'Yes, delete it!',
            customClass: {
                popup: 'rounded-xl',
                confirmButton: 'rounded-pill px-4',
                cancelButton: 'rounded-pill px-4'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                const form = document.getElementById(formId);
                if (form) form.submit();
            }
        });
    }
}
