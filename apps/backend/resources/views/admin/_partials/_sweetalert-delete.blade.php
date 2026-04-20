@push('js')
<script>
$(document).ready(function() {
    // Select all buttons inside actions form that use onclick="return confirm"
    document.querySelectorAll('.btn-group-premium form button[onclick]').forEach(function(btn) {
        let onClickText = btn.getAttribute('onclick');
        let message = 'Are you sure you want to delete this listing?';

        // Extract message from confirm('...')
        if (onClickText) {
            let match = onClickText.match(/confirm\(['"](.+?)['"]\)/);
            if (match && match[1]) {
                message = match[1];
            }
        }

        // Nullify native confirm to prevent browser popup
        btn.removeAttribute('onclick');

        // Add SweetAlert2 handler
        btn.addEventListener('click', function(e) {
            e.preventDefault(); // Stop immediate trigger
            const form = btn.closest('form');

            Swal.fire({
                title: 'Confirm Operation',
                text: message,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Yes, proceed',
                cancelButtonText: 'Cancel'
            }).then((result) => {
                if (result.isConfirmed) {
                    form.submit(); // Submit actual form back
                }
            });
        });
    });
});
</script>
@endpush
