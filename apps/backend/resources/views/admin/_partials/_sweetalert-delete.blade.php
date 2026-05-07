{{--
    Automated Deletion Protocol (SweetAlert Integration)
    
    This partial scans the DOM for legacy 'onclick' delete confirmations 
    and transparently upgrades them to the premium SweetAlert2 interface.
    It ensures that all destructive actions across the backend follow 
    a unified safety protocol and aesthetic.
--}}
@push('js')
<script>
$(document).ready(function() {
    /**
     * Automatic Sellio-Themed Confirmation for Delete Buttons
     * Scans for buttons with standard 'onclick="return confirm(...)"' and 
     * replaces them with premium SweetAlert2 modals.
     */
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
});
</script>
@endpush
