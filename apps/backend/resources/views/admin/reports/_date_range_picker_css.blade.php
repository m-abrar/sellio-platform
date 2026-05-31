<style>
    .report-date-range-shell .input-group-text {
        background: linear-gradient(135deg, rgba(70, 165, 172, 0.14), rgba(37, 99, 235, 0.08));
        border-color: rgba(70, 165, 172, 0.18);
        color: var(--primary);
    }

    .report-date-range-picker[readonly] {
        background: #ffffff;
        cursor: pointer;
        font-weight: 700;
        letter-spacing: 0;
    }

    .report-range-presets {
        display: grid;
        gap: 8px;
        grid-template-columns: repeat(3, minmax(0, 1fr));
    }

    .report-range-chip {
        align-items: center;
        background: #ffffff;
        border: 1px solid rgba(70, 165, 172, 0.18);
        border-radius: 999px;
        color: #475569;
        display: inline-flex;
        font-size: 0.72rem;
        font-weight: 800;
        height: 42px;
        justify-content: center;
        letter-spacing: 0;
        padding: 0 12px;
        transition: all 0.18s ease;
    }

    .report-range-chip:hover,
    .report-range-chip.is-active {
        background: var(--primary);
        border-color: var(--primary);
        color: #ffffff;
        box-shadow: 0 12px 24px rgba(70, 165, 172, 0.22);
    }

    .flatpickr-calendar {
        border: 0;
        border-radius: 16px;
        box-shadow: 0 18px 40px rgba(15, 23, 42, 0.16), 0 8px 18px rgba(15, 23, 42, 0.08);
        padding: 6px;
    }

    .flatpickr-months .flatpickr-month {
        height: 42px;
    }

    .flatpickr-current-month {
        font-weight: 800;
        padding-top: 11px;
    }

    .flatpickr-day.selected,
    .flatpickr-day.startRange,
    .flatpickr-day.endRange,
    .flatpickr-day.selected.inRange,
    .flatpickr-day.startRange.inRange,
    .flatpickr-day.endRange.inRange,
    .flatpickr-day.selected:hover,
    .flatpickr-day.startRange:hover,
    .flatpickr-day.endRange:hover {
        background: var(--primary) !important;
        border-color: var(--primary) !important;
        color: #ffffff !important;
    }

    .flatpickr-day.inRange,
    .flatpickr-day.prevMonthDay.inRange,
    .flatpickr-day.nextMonthDay.inRange {
        background: var(--primary-soft) !important;
        border-color: transparent !important;
        color: var(--primary) !important;
    }

    .flatpickr-day.today {
        border-color: var(--primary) !important;
        color: var(--primary) !important;
    }

    @media (max-width: 575.98px) {
        .report-range-presets {
            grid-template-columns: 1fr;
        }
    }
</style>
