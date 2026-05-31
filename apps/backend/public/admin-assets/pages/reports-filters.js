/**
 * Analytical Reporting: shared date range filter controls.
 */

(function($) {
    'use strict';

    const formatDate = function(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    };

    const resolvePreset = function(preset) {
        const today = new Date();
        const end = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        let start = new Date(end);

        if (preset === 'month') {
            start = new Date(end.getFullYear(), end.getMonth(), 1);
        } else {
            start.setDate(end.getDate() - (parseInt(preset, 10) - 1));
        }

        return [start, end];
    };

    $(document).ready(function() {
        if (typeof flatpickr === 'undefined') {
            return;
        }

        $('.report-date-range-picker').each(function() {
            const input = this;
            const startInput = document.querySelector(input.dataset.startInput);
            const endInput = document.querySelector(input.dataset.endInput);
            const defaults = [startInput && startInput.value, endInput && endInput.value].filter(Boolean);

            const instance = flatpickr(input, {
                mode: 'range',
                dateFormat: 'Y-m-d',
                altInput: true,
                altFormat: 'M j, Y',
                defaultDate: defaults,
                disableMobile: true,
                onChange: function(selectedDates) {
                    if (!startInput || !endInput) {
                        return;
                    }

                    if (selectedDates.length >= 1) {
                        startInput.value = formatDate(selectedDates[0]);
                    }

                    if (selectedDates.length === 2) {
                        endInput.value = formatDate(selectedDates[1]);
                    }
                },
                onClose: function(selectedDates) {
                    if (!startInput || !endInput || selectedDates.length === 0) {
                        return;
                    }

                    if (selectedDates.length === 1) {
                        endInput.value = formatDate(selectedDates[0]);
                    }
                }
            });

            input._reportDateRangePicker = instance;
        });

        $('[data-report-range]').on('click', function() {
            const button = $(this);
            const form = button.closest('form');
            const picker = form.find('.report-date-range-picker').get(0);
            const startInput = form.find('input[name="start_date"]').get(0);
            const endInput = form.find('input[name="end_date"]').get(0);
            const dates = resolvePreset(button.data('report-range'));

            form.find('[data-report-range]').removeClass('is-active');
            button.addClass('is-active');

            if (startInput && endInput) {
                startInput.value = formatDate(dates[0]);
                endInput.value = formatDate(dates[1]);
            }

            if (picker && picker._reportDateRangePicker) {
                picker._reportDateRangePicker.setDate(dates, true);
            }
        });
    });
})(jQuery);
