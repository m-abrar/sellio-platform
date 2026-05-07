{{--
    SweetAlert2 Premium Design Integration
    
    This partial orchestrates the visual identity and behavioral logic 
    for administrative alerts and confirmation dialogs. It injects custom 
    glassmorphic CSS and provides global JavaScript helpers (SellioAlert) 
    to ensure interactive consistency across the backend.
--}}
<!-- SweetAlert2 Premium Integration -->
@push('css')
<style>
    /* Premium SweetAlert2 Custom Styling */
    .swal2-popup.swal2-glassmorphic {
        background: rgba(255, 255, 255, 0.85) !important;
        backdrop-filter: blur(16px) saturate(180%) !important;
        -webkit-backdrop-filter: blur(16px) saturate(180%) !important;
        border: 1px solid rgba(255, 255, 255, 0.3) !important;
        border-radius: 24px !important;
        box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15) !important;
    }
    
    .swal2-title {
        color: #1e293b !important;
        font-weight: 700 !important;
        letter-spacing: -0.02em !important;
    }
    
    .swal2-html-container {
        color: #64748b !important;
        font-size: 1rem !important;
    }

    .swal2-confirm.swal2-premium-btn {
        background: linear-gradient(135deg, #46a5ac 0%, #3d8f95 100%) !important;
        border-radius: 12px !important;
        padding: 12px 28px !important;
        font-weight: 600 !important;
        text-transform: uppercase !important;
        letter-spacing: 0.5px !important;
        box-shadow: 0 4px 14px 0 rgba(70, 165, 172, 0.39) !important;
    }

    .swal2-cancel.swal2-premium-btn-cancel {
        background: #f1f5f9 !important;
        color: #64748b !important;
        border-radius: 12px !important;
        padding: 12px 28px !important;
        font-weight: 600 !important;
        text-transform: uppercase !important;
        letter-spacing: 0.5px !important;
    }

    /* Entry Animations */
    .swal2-show {
        animation: swal2-show 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
    }

    @keyframes swal2-show {
        0% { transform: scale(0.7); opacity: 0; }
        100% { transform: scale(1); opacity: 1; }
    }
</style>
@endpush

@push('js')
<script>
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
     */
    function confirmDelete(formId, title = 'Are you sure?', text = 'This action cannot be undone and data will be permanently removed.', confirmBtn = 'Yes, Delete Item') {
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
                document.getElementById(formId).submit();
            }
        });
    }

    /**
     * Standard Success Toast
     */
    function showToast(title, icon = 'success') {
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
    }
</script>
@endpush