/**
 * Sellio Admin Global JavaScript
 * Standardizes DataTables, SweetAlert2, and Premium UI interactions.
 */

$(function() {
    /**
     * 1. Global DataTables Defaults
     * Ensures all tables follow the premium layout: Search Left, Show Per Page Right.
     */
    if ($.fn.dataTable) {
        $.extend(true, $.fn.dataTable.defaults, {
            "dom": '<"row px-4 pt-3"<"col-sm-12 col-md-6"f><"col-sm-12 col-md-6 text-right"l>>' +
                   '<"row"<"col-sm-12"tr>>' +
                   '<"row px-4 pb-3"<"col-sm-12 col-md-5"i><"col-sm-12 col-md-7"p>>',
            "language": {
                "search": "",
                "searchPlaceholder": "Search records...",
                "lengthMenu": "_MENU_ per page",
                "paginate": {
                    "previous": '<i class="fas fa-chevron-left"></i>',
                    "next": '<i class="fas fa-chevron-right"></i>'
                },
                "info": "Showing _START_ to _END_ of _TOTAL_ entries",
                "infoEmpty": "Showing 0 to 0 of 0 entries",
                "infoFiltered": "(filtered from _MAX_ total entries)"
            },
            "pagingType": "simple_numbers",
            "pageLength": 10,
            "responsive": true,
            "autoWidth": false,
            "classes": {
                "sFilterInput": "form-control form-control-sm form-control-premium",
                "sLengthSelect": "custom-select custom-select-sm form-control-premium"
            }
        });
        
        // Apply custom styles to filter input after initialization
        $(document).on('init.dt', function(e, settings) {
            var api = new $.fn.dataTable.Api(settings);
            $(api.table().container()).find('.dataTables_filter input').attr('placeholder', 'Search records...');
        });
    }

    /**
     * 2. Global Select2 Defaults
     */
    if ($.fn.select2) {
        // Apply Premium Select2 to all .select2 elements that haven't been initialized
        $('.select2:not(.select2-hidden-accessible)').each(function() {
            $(this).select2({
                theme: 'default',
                width: '100%',
                placeholder: $(this).data('placeholder') || 'Select an option'
            });
        });
    }

    /**
     * 3. AJAX Searchable Combobox Helper
     * Usage: initAjaxSelect2($('.ajax-select'), '/admin/api/search-users');
     */
    window.initAjaxSelect2 = function($element, url, options = {}) {
        const defaults = {
            ajax: {
                url: url,
                dataType: 'json',
                delay: 250,
                data: function (params) {
                    return {
                        q: params.term, // search term
                        page: params.page
                    };
                },
                processResults: function (data, params) {
                    params.page = params.page || 1;
                    return {
                        results: data.items,
                        pagination: {
                            more: (params.page * 30) < data.total_count
                        }
                    };
                },
                cache: true
            },
            placeholder: $element.data('placeholder') || 'Search...',
            minimumInputLength: 1,
            templateResult: options.templateResult || formatRepo,
            templateSelection: options.templateSelection || formatRepoSelection
        };

        const settings = $.extend(true, defaults, options);
        $element.select2(settings);
    };

    function formatRepo (repo) {
        if (repo.loading) return repo.text;
        return $(`<div class='select2-result-repository clearfix'>
            <div class='select2-result-repository__title font-weight-bold'>${repo.text || repo.title || repo.name}</div>
            ${repo.description ? `<div class='select2-result-repository__description small text-muted'>${repo.description}</div>` : ''}
        </div>`);
    }

    function formatRepoSelection (repo) {
        return repo.text || repo.title || repo.name || repo.id;
    }

    /**
     * 4. Initialize Tooltips & Popovers Globally
     */
    $('[data-toggle="tooltip"]').tooltip();
    $('[data-toggle="popover"]').popover();

    /**
     * 3. Navigation Highlighting Refinement
     */
    $('.nav-sidebar .nav-link.active').parent().parents('.nav-item').addClass('menu-open');
    $('.nav-sidebar .nav-link.active').closest('.nav-treeview').siblings('.nav-link').addClass('active');
});
