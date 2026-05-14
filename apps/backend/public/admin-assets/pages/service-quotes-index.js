/**
 * Administrative Services: Leads Registry Orchestration
 * 
 * Manages the lead tracking interface, including filtering Select2 
 * initialization and DataTable audit trails.
 */

$(document).ready(function() {
    // Initialize standard tooltips
    if (typeof $.fn.tooltip === 'function') {
        $('[data-toggle="tooltip"]').tooltip();
    }

    // Initialize Branded Select2 for filters
    if (typeof $.fn.select2 === 'function') {
        $('.select2').select2({ 
            theme: 'bootstrap4', 
            width: '100%' 
        });
    }

    // Initialize Lead Registry DataTable
    const $table = $('#quotes-table');
    if ($table.length && $table.find('tbody tr:not(.empty-state)').length > 0) {
        $table.DataTable({
            "paging": false,
            "lengthChange": false,
            "searching": false,
            "bSearching": false,
            "ordering": true,
            "info": false,
            "autoWidth": false,
            "responsive": true,
            "dom": 't',
            "columnDefs": [
                { "orderable": false, "targets": [0, 6] }
            ]
        });
    }
});
