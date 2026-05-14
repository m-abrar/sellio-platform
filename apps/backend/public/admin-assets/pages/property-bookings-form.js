/**
 * Administrative Real Estate: Booking Lifecycle Orchestration
 * 
 * This module facilitates the interactive behavior for the property 
 * booking configuration interface. It orchestrates date selection via 
 * Flatpickr, principal assignment via Select2, and occupancy 
 * visualization via FullCalendar.
 */
$(document).ready(function() {
    // Initialize Flatpickr for Date Inputs
    if (typeof flatpickr === 'function') {
        flatpickr("input[type=date]", {
            altInput: true,
            altFormat: "F j, Y",
            dateFormat: "Y-m-d",
            allowInput: true
        });
    }

    // Initialize Select2 for principal assignment
    if (typeof $('.select2').select2 === 'function') {
        $('.select2').select2({
            theme: 'bootstrap4',
            width: '100%',
            placeholder: "Select Principal"
        });
    }

    // Initialize FullCalendar for occupancy visualization
    const calendarEl = document.getElementById('calendar');
    if (calendarEl && typeof FullCalendar !== 'undefined') {
        const configElement = document.getElementById('calendar-config');
        if (configElement) {
            const calendarEvents = JSON.parse(configElement.getAttribute('data-events') || '[]');
            const calendar = new FullCalendar.Calendar(calendarEl, {
                initialView: 'dayGridMonth',
                headerToolbar: {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,dayGridWeek'
                },
                events: calendarEvents,
                height: 'auto',
                eventDisplay: 'block',
                eventTextColor: '#1e293b',
                eventClassNames: 'shadow-xs border-0'
            });
            calendar.render();
        }
    }
});
