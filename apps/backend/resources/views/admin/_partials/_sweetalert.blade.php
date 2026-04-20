<!-- SweetAlert2 integration for admin delete confirmations -->
@push('js')
<script>
function confirmDelete(formId, title = 'Are you sure?', text = 'This action cannot be undone.', confirmBtn = 'Yes, delete it!') {
    Swal.fire({
        title: title,
        text: text,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: confirmBtn
    }).then((result) => {
        if (result.isConfirmed) {
            document.getElementById(formId).submit();
        }
    });
}
</script>
@endpush