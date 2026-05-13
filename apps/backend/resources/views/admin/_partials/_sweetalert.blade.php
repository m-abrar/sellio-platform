{{--
    SweetAlert2 Premium Design Integration
    
    This partial orchestrates the visual identity and behavioral logic 
    for administrative alerts and confirmation dialogs. It injects custom 
    glassmorphic CSS and provides global JavaScript helpers (SellioAlert) 
    to ensure interactive consistency across the backend.
--}}
<!-- SweetAlert2 Premium Integration -->
@push('js')
<script src="{{ asset('admin-assets/swal-helpers.js') }}"></script>
@endpush