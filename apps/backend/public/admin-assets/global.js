/**
 * Sellio Admin Global JavaScript
 * Standardizes DataTables, SweetAlert2, and Premium UI interactions.
 */

$(function() {
    /**
     * 0. SweetAlert2 Premium Configuration
     */
    if (window.Swal) {
        window.PremiumToast = Swal.mixin({
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
        
        window.PremiumConfirm = Swal.mixin({
            customClass: {
                confirmButton: 'btn btn-primary rounded-pill px-4 py-2 font-weight-bold mx-2',
                cancelButton: 'btn btn-light rounded-pill px-4 py-2 font-weight-bold mx-2 border'
            },
            buttonsStyling: false
        });
    }

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
    const tooltipDefaults = {
        container: 'body',
        boundary: 'window',
        trigger: 'hover',
    };

    $('.nav-sidebar .nav-link[data-full-title]').each(function () {
        const $link = $(this);
        if (!$link.attr('title')) {
            $link.attr('title', $link.attr('data-full-title'));
        }
    });

    $('[data-toggle="tooltip"]').tooltip(tooltipDefaults);
    $('[data-toggle="popover"]').popover();

    /**
     * 3. Navigation Highlighting Refinement
     */
    $('.nav-sidebar .nav-link.active').parent().parents('.nav-item').addClass('menu-open');
    $('.nav-sidebar .nav-link.active').closest('.nav-treeview').siblings('.nav-link').addClass('active');

    /**
     * 4. Premium Toggle Switch Listener
     */
    $(document).on('change', '.toggle-input', function() {
        const card = $(this).closest('label');
        const statusText = card.find('.toggle-status');
        if (statusText.length) {
            statusText.text($(this).is(':checked') ? 'ENABLED' : 'DISABLED');
        }
    });

    /**
     * 5. Form Submission Micro-interactions
     * Prevents double submission and provides visual feedback.
     */
    $('form').on('submit', function() {
        const btn = $(this).find('button[type="submit"]');
        if (btn.hasClass('btn-submit-premium')) {
            btn.prop('disabled', true);
            btn.data('original-html', btn.html());
            btn.html('<i class="fas fa-circle-notch fa-spin mr-2"></i> PROCESSING...');
        }
    });

    /**
     * 7. Centralized Action Handlers (Audit Remediation)
     * Replaces inline 'onclick' and 'onsubmit' handlers across the dashboard.
     */
    
    // Delegated listener for generic delete triggers
    $(document).on('click', '[data-action="delete-trigger"]', function(e) {
        e.preventDefault();
        const btn = $(this);
        const formId = btn.data('form-id');
        const title = btn.data('confirm-title') || 'Are you sure?';
        const text = btn.data('confirm-text') || 'This action cannot be undone.';
        const confirmBtn = btn.data('confirm-btn') || 'Yes, Delete It';

        if (window.PremiumConfirm) {
            PremiumConfirm.fire({
                title: title,
                text: text,
                icon: 'warning',
                iconColor: '#f59e0b',
                showCancelButton: true,
                confirmButtonText: `<i class="fas fa-trash-alt mr-2"></i> ${confirmBtn}`,
                cancelButtonText: 'Cancel',
                reverseButtons: true
            }).then((result) => {
                if (result.isConfirmed) {
                    const form = formId ? document.getElementById(formId) : btn.closest('form');
                    if (form) form.submit();
                }
            });
        }
    });

    // Centralized confirmation helper (legacy support)
    window.confirmAction = function(options) {
        if (!window.PremiumConfirm) return confirm(options.text || 'Are you sure?');
        
        return PremiumConfirm.fire({
            title: options.title || 'Are you sure?',
            text: options.text || '',
            icon: options.icon || 'warning',
            showCancelButton: true,
            confirmButtonText: options.confirmButtonText || 'Confirm',
            cancelButtonText: options.cancelButtonText || 'Cancel',
            reverseButtons: true
        });
    };

    // Global Logout Orchestration
    $(document).on('click', '#admin-logout-link', function(e) {
        e.preventDefault();
        const $form = $('#admin-logout-form');
        if ($form.length) {
            $form.submit();
        } else {
            window.location.href = $(this).attr('href');
        }
    });

    // Global Image Fallback Protocol
    window.addEventListener('error', function(e) {
        if (e.target.tagName === 'IMG') {
            const fallback = e.target.dataset.fallback || '/images/fallbacks/default.jpg';
            if (e.target.src !== fallback) {
                e.target.src = fallback;
            }
        }
    }, true);
});
