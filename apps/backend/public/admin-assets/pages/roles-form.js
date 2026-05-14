/**
 * Administrative Security: Role Management Orchestration
 * 
 * Facilitates the interactive selection and toggling of permission grids
 * within the role creation and modification interfaces.
 */

$(function() {
    // Group-level toggling logic
    $('.group-toggler').on('change', function() {
        const isChecked = $(this).prop('checked');
        $(this).closest('.rounded-xl').find('.permission-item').prop('checked', isChecked);
    });

    // Global toggle orchestration
    $('#globalToggle').on('click', function() {
        const anyUnchecked = $('.permission-item:not(:checked)').length > 0;
        $('.permission-item, .group-toggler').prop('checked', anyUnchecked);
    });

    // Sync group toggler if all items are checked manually
    $('.permission-item').on('change', function() {
        const groupContainer = $(this).closest('.rounded-xl');
        const allChecked = groupContainer.find('.permission-item:not(:checked)').length === 0;
        groupContainer.find('.group-toggler').prop('checked', allChecked);
    });
});
