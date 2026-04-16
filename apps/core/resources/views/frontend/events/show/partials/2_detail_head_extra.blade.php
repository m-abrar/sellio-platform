<script>
    document.addEventListener('DOMContentLoaded', function() {
        // --- Setup & Initial Data Parsing ---
        const allTicketDataElement = document.getElementById('all-ticket-data');
        const ALL_INVENTORY_DATA = JSON.parse(allTicketDataElement.dataset.inventory || '{}');
        
        const occurrenceRadios = document.querySelectorAll('.occurrence-radio');
        const countdownWrapper = document.getElementById('countdown-wrapper');
        const countdownElement = document.getElementById('countdown-timer');
        const bookingForm = document.getElementById('booking-form');
        const formOccurrenceIdInput = document.getElementById('form-occurrence-id');
        const ticketRowsContainer = document.getElementById('ticket-rows-container');
        const checkoutButton = document.getElementById('checkout-button');
        const totalElement = document.getElementById('total-price');
        const noSelectionMessage = document.getElementById('no-selection-message');

        let countdownInterval;

        // --- Countdown Timer Logic ---
        function updateCountdown(targetDateString) {
            if (countdownInterval) {
                clearInterval(countdownInterval);
            }
            
            if (!targetDateString) {
                countdownWrapper.classList.add('d-none');
                return;
            }

            const targetDate = new Date(targetDateString).getTime();
            countdownWrapper.classList.remove('d-none');
            
            countdownInterval = setInterval(function() {
                const now = new Date().getTime();
                const distance = targetDate - now;
                const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);

                if (distance > 0) {
                    countdownElement.innerHTML = 
                        `${String(days).padStart(2, '0')} Days ` +
                        `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
                } else {
                    clearInterval(countdownInterval);
                    countdownElement.innerHTML = "EVENT STARTED / REGISTRATION CLOSED";
                    // You might want to disable the form here
                }
            }, 1000);
        }

        // --- Dynamic HTML Generation ---
        function generateTicketRows(inventory) {
            if (inventory.length === 0) {
                return '<p class="alert alert-warning">All ticket types for this date are sold out or unavailable.</p>';
            }

            return inventory.map(item => `
                <div class="d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom ticket-row" 
                    data-price="${item.price}"
                    data-available="${item.available}">
                    
                    <div class="form-check d-flex align-items-start w-75">
                        <input class="form-check-input mt-2 ticket-type-radio me-3" 
                               type="radio" 
                               name="selected_ticket_id" 
                               id="type-${item.id}" 
                               value="${item.id}" 
                               required>
                               
                        <label class="form-check-label w-100" for="type-${item.id}">
                            <span class="fw-bold mb-0 d-block">${item.name}</span>
                            <span class="fw-bolder text-primary-color price-highlight bg-primary-light px-2 py-1 rounded me-1 fs-5">
                                $${item.price.toFixed(2)}
                            </span>
                            <span class="small text-muted">(${item.available} left)</span>
                            <p class="small mt-1 mb-0 fst-italic text-muted">Ticket details...</p>
                        </label>
                    </div>
                    
                    <input type="number" 
                        name="quantity" 
                        data-ticket-id="${item.id}" 
                        class="form-control form-control-sm text-center quantity-input" 
                        value="0" 
                        min="0" 
                        max="${item.available}" 
                        style="width: 70px;" 
                        disabled>
                </div>
            `).join('');
        }
        
        // --- Total Calculation & Form Action Update ---
        function calculateTotal() {
            let total = 0;
            // Select elements only within the dynamic container
            const quantityInputs = document.querySelectorAll('#ticket-rows-container .quantity-input');
            const selectedRadio = document.querySelector('#ticket-rows-container .ticket-type-radio:checked');
            
            // Disable all quantity inputs
            quantityInputs.forEach(input => {
                input.disabled = true;
            });

            if (selectedRadio) {
                const selectedTicketId = selectedRadio.value;

                // Set the form action dynamically based on selected ticket
                const dynamicUrl = BOOKING_ROUTE_URL_TEMPLATE.replace('__TICKET_ID__', selectedTicketId);
                bookingForm.action = dynamicUrl;
                
                const activeQuantityInput = document.querySelector(`.quantity-input[data-ticket-id="${selectedTicketId}"]`);
                const ticketRow = selectedRadio.closest('.ticket-row');
                const price = parseFloat(ticketRow.dataset.price);
                
                let quantity = parseInt(activeQuantityInput.value);
                if (isNaN(quantity) || quantity < 1) {
                    quantity = 1; 
                    activeQuantityInput.value = quantity;
                }
                
                total = price * quantity;
                
                activeQuantityInput.disabled = false;
                checkoutButton.disabled = (quantity === 0);
                
                // Re-attach listeners for newly generated quantity inputs
                activeQuantityInput.addEventListener('change', calculateTotal);
                activeQuantityInput.addEventListener('keyup', calculateTotal);

            } else {
                checkoutButton.disabled = true;
                bookingForm.action = '';
            }

            totalElement.textContent = '$' + total.toLocaleString();
        }

        // --- Main Event Handler (Occurrence Selection) ---
        function handleOccurrenceSelection(event) {
            const occurrenceId = event.target.value;
            const data = ALL_INVENTORY_DATA[occurrenceId];

            if (!data) return;

            // 1. Hide the "no selection" message and show the form
            noSelectionMessage.classList.add('d-none');
            bookingForm.classList.remove('d-none');

            // 2. Set hidden occurrence ID in the form
            formOccurrenceIdInput.value = occurrenceId;
            
            // 3. Update the countdown timer
            updateCountdown(data.start_date_iso);
            
            // 4. Regenerate ticket rows
            ticketRowsContainer.innerHTML = generateTicketRows(data.inventory);
            
            // 5. Attach event listeners to the new ticket elements
            const newRadioInputs = document.querySelectorAll('#ticket-rows-container .ticket-type-radio');
            
            newRadioInputs.forEach(radio => {
                // When a radio button changes, recalculate the total and update the form action
                radio.addEventListener('change', calculateTotal);
            });
            
            // 6. Reset total display
            calculateTotal(); 
        }

        // --- Initialization ---
        
        occurrenceRadios.forEach(radio => {
            radio.addEventListener('change', handleOccurrenceSelection);
        });
        
        // Initial state
        updateCountdown(null);
        bookingForm.classList.add('d-none');
        noSelectionMessage.classList.remove('d-none');
    });
</script>
