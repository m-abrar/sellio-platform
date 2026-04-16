<script>
document.addEventListener('DOMContentLoaded', function() {
    // --- DOM Element References ---
    const allTicketDataElement = document.getElementById('all-ticket-data');
    const ticketRowsContainer = document.getElementById('ticket-rows-container');
    const bookingForm = document.getElementById('booking-form');
    const formOccurrenceIdInput = document.getElementById('form-occurrence-id');
    const countdownWrapper = document.getElementById('countdown-wrapper');
    const countdownElement = document.getElementById('countdown-timer');
    const checkoutButton = document.getElementById('checkout-button');
    const totalElement = document.getElementById('total-price');
    const noSelectionMessage = document.getElementById('no-selection-message');
    const occurrenceRadios = document.querySelectorAll('.occurrence-radio');

    if (!allTicketDataElement || !ticketRowsContainer || !bookingForm || !totalElement) {
        console.warn('Ticket booking JS: required DOM elements missing — script will exit early.');
        return;
    }

    // --- Config and Data ---
    const BOOKING_ROUTE_URL_TEMPLATE =
        allTicketDataElement.dataset.bookingRoute ||
        (typeof BOOKING_ROUTE_URL_TEMPLATE !== 'undefined' ? BOOKING_ROUTE_URL_TEMPLATE : '');

    let ALL_INVENTORY_DATA = {};
    try {
        ALL_INVENTORY_DATA = JSON.parse(allTicketDataElement.dataset.inventory || '{}');
    } catch (err) {
        console.error('Failed to parse inventory JSON:', err);
        ALL_INVENTORY_DATA = {};
    }

    let countdownInterval = null;

    // --- COUNTDOWN TIMER ---
    function updateCountdown(targetDateString) {
        if (countdownInterval) {
            clearInterval(countdownInterval);
            countdownInterval = null;
        }

        if (!countdownWrapper || !countdownElement) return;

        if (!targetDateString) {
            countdownWrapper.classList.add('d-none');
            return;
        }

        const targetDate = new Date(targetDateString).getTime();
        if (isNaN(targetDate)) {
            countdownWrapper.classList.add('d-none');
            return;
        }

        countdownWrapper.classList.remove('d-none');

        countdownInterval = setInterval(function() {
            const now = Date.now();
            const distance = targetDate - now;

            if (distance > 0) {
                const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);

                countdownElement.innerHTML =
                    `${String(days).padStart(2, '0')} Days ` +
                    `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
            } else {
                clearInterval(countdownInterval);
                countdownInterval = null;
                countdownElement.innerHTML = "EVENT STARTED / REGISTRATION CLOSED";
                if (bookingForm) bookingForm.classList.add('d-none');
            }
        }, 1000);
    }

    // --- TICKET ROWS GENERATION ---
    function generateTicketRows(inventory) {
        if (!Array.isArray(inventory) || inventory.length === 0) {
            return '<p class="alert alert-warning">All ticket types for this date are sold out or unavailable.</p>';
        }

        return inventory.map(item => {
            const price = parseFloat(item.price) || 0;
            const available = parseInt(item.available) || 0;
            const id = item.id;
            const name = item.name || 'Ticket';
            return `
                <div class="d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom ticket-row" 
                    data-price="${price}"
                    data-available="${available}">
                    
                    <div class="form-check d-flex align-items-start w-75">
                        <input class="form-check-input mt-2 ticket-type-radio me-3" 
                               type="radio" 
                               name="selected_ticket_id" 
                               id="type-${id}" 
                               value="${id}">
                               
                        <label class="form-check-label w-100" for="type-${id}">
                            <span class="fw-bold mb-0 d-block">${name}</span>
                            <span class="fw-bolder text-primary-color price-highlight bg-primary-light px-2 py-1 rounded me-1 fs-5">
                                $${price.toFixed(2)}
                            </span>
                            <span class="small text-muted">(${available} left)</span>
                            <p class="small mt-1 mb-0 fst-italic text-muted">Ticket details...</p>
                        </label>
                    </div>
                    
                    <input type="number" 
                        name="quantity" 
                        data-ticket-id="${id}" 
                        class="form-control form-control-sm text-center quantity-input" 
                        value="1" 
                        min="1" 
                        max="${available}" 
                        style="width: 70px;" 
                        disabled>
                </div>
            `;
        }).join('');
    }

    // --- CALCULATE TOTAL ---
    function calculateTotal() {
        let total = 0;
        const quantityInputs = ticketRowsContainer.querySelectorAll('.quantity-input');
        const selectedRadio = ticketRowsContainer.querySelector('.ticket-type-radio:checked');

        quantityInputs.forEach(input => {
            input.disabled = true;
        });

        if (selectedRadio) {
            const selectedTicketId = String(selectedRadio.value || '');
            if (BOOKING_ROUTE_URL_TEMPLATE) {
                bookingForm.action = BOOKING_ROUTE_URL_TEMPLATE.replace('__TICKET_ID__', encodeURIComponent(selectedTicketId));
            }

            const activeQuantityInput = ticketRowsContainer.querySelector(`.quantity-input[data-ticket-id="${selectedTicketId}"]`);
            if (activeQuantityInput) activeQuantityInput.disabled = false;

            const ticketRow = selectedRadio.closest('.ticket-row');
            const price = ticketRow ? parseFloat(ticketRow.dataset.price || 0) : 0;

            let quantity = activeQuantityInput ? parseInt(activeQuantityInput.value, 10) : 1;
            if (isNaN(quantity) || quantity < 1) quantity = 1;
            const max = activeQuantityInput ? parseInt(activeQuantityInput.max, 10) : 1;
            if (!isNaN(max) && quantity > max) quantity = max;

            total = price * quantity;
            if (checkoutButton) checkoutButton.disabled = (quantity <= 0);
        } else {
            if (checkoutButton) checkoutButton.disabled = true;
            bookingForm.action = '';
        }

        totalElement.textContent =
            '$' + total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    // --- OCCURRENCE SELECTION HANDLER (Scroll logic removed) ---
    function handleOccurrenceSelection(event) {
        const occurrenceId = event.target.value;
        if (!occurrenceId) return;

        const data = ALL_INVENTORY_DATA[occurrenceId];
        if (!data) {
            if (noSelectionMessage) noSelectionMessage.classList.remove('d-none');
            bookingForm.classList.add('d-none');
            return;
        }

        if (noSelectionMessage) noSelectionMessage.classList.add('d-none');
        bookingForm.classList.remove('d-none');
        formOccurrenceIdInput.value = occurrenceId;

        updateCountdown(data.start_date_iso || '');
        ticketRowsContainer.innerHTML = generateTicketRows(data.inventory || []);
        bookingForm.action = '';
        calculateTotal();

        // SCROLL LOGIC WAS HERE. Now it's ONLY called by the 'change' event listener below.
    }

    // --- EVENT DELEGATION FOR DYNAMIC ELEMENTS ---
    ticketRowsContainer.addEventListener('change', function(event) {
        const t = event.target;
        if (!t) return;
        if (t.classList.contains('ticket-type-radio') || t.classList.contains('quantity-input')) {
            calculateTotal();
        }
    });

    ticketRowsContainer.addEventListener('keyup', function(event) {
        if (event.target.classList.contains('quantity-input')) {
            calculateTotal();
        }
    });

    // --- AUTO-SELECT NEAREST FUTURE OCCURRENCE ---
    function autoSelectNearestOccurrence() {
        const now = new Date().getTime();
        let nearestId = null;
        let nearestTime = Infinity;

        // Iterate over the ALL_INVENTORY_DATA object (more efficient than iterating DOM elements)
        for (const [occurrenceId, data] of Object.entries(ALL_INVENTORY_DATA)) {
            if (!data.start_date_iso) continue;
            const startTime = new Date(data.start_date_iso).getTime();
            
            // Find the nearest future date (startTime >= now)
            if (!isNaN(startTime) && startTime >= now && startTime < nearestTime) {
                nearestTime = startTime;
                nearestId = occurrenceId;
            }
        }

        if (nearestId) {
            // Now find the single radio button in the DOM based on the ID
            const radio = document.querySelector(`.occurrence-radio[value="${nearestId}"]`);
            if (radio) {
                radio.checked = true;
                // We call the selection handler, but WITHOUT scrolling
                handleOccurrenceSelection({ target: radio }); 
            }
        } else {
            updateCountdown(null);
            bookingForm.classList.add('d-none');
            if (noSelectionMessage) noSelectionMessage.classList.remove('d-none');
        }
    }

    // --- INITIALIZATION ---
    occurrenceRadios.forEach(radio => {
        radio.addEventListener('change', function(event) {
            handleOccurrenceSelection(event);
            // SCROLLING IS NOW ONLY HERE, triggered by a user's *explicit* radio selection change
            bookingForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    // Auto-select nearest future event on load (no scroll from here)
    autoSelectNearestOccurrence();
});
</script>
