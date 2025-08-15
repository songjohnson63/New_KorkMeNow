document.addEventListener('DOMContentLoaded', () => {
    const selectedTimeButton = document.getElementById('selected-time-button');
    const timePickerModal = document.getElementById('time-picker-modal');
    const closeModalButton = timePickerModal.querySelector('.close-button');
    const okButton = document.getElementById('ok-button');
    const modalTimeSlotsGrid = document.getElementById('modal-time-slots-grid');
    const dateScrollerGrid = document.getElementById('date-scroller-grid'); // New element
    // Note: currentMonthLabel is not defined here in your provided code,
    // assuming it's correctly handled in HTML or previous JS setup if needed for display.

    // State variables for selected date and time
    let selectedDate = null; // Stores Date object for the confirmed selection (from main page)
    let selectedTime = null; // Stores formatted time string (e.g., "4:00 PM")

    // Temporary variables for selection within the modal
    // tempSelectedDate is no longer needed as date is selected directly on main screen
    let tempSelectedTime = null; // Stores formatted time string from time slot click in modal

    // --- Helper Functions ---

    // Function to format minutes into "HH:MM AM/PM"
    function formatTime(totalMinutes) {
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;

        const ampm = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours % 12 === 0 ? 12 : hours % 12;
        const displayMinutes = minutes < 10 ? '0' + minutes : minutes;

        return `${displayHours}:${displayMinutes} ${ampm}`;
    }

    // Function to format a Date object for display (e.g., "July 17, 2025")
    // This is not used for the main button's text, but useful for console logs.
    function formatDateForDisplay(date) {
        if (!date) return '';
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }

    // Function to get "YYYY-MM-DD" string from Date object
    function getDateString(date) {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    // --- Time Slot Generation Logic (for modal) ---
    const startTimeMinutes = 16 * 60; // 4:00 PM
    const endTimeMinutes = 23 * 60;   // 11:00 PM
    const interval = 15;

    function generateTimeSlots() {
        modalTimeSlotsGrid.innerHTML = ''; // Clear previous slots
        for (let i = startTimeMinutes; i <= endTimeMinutes; i += interval) {
            const timeSlotBox = document.createElement('div');
            timeSlotBox.classList.add('time-slot-box');
            const formattedTime = formatTime(i);
            timeSlotBox.textContent = formattedTime;
            timeSlotBox.dataset.totalMinutes = i;

            // Mark as selected if it matches the currently stored tempSelectedTime
            if (formattedTime === tempSelectedTime) {
                timeSlotBox.classList.add('selected');
            }

            timeSlotBox.addEventListener('click', () => {
                const currentlySelected = modalTimeSlotsGrid.querySelector('.time-slot-box.selected');
                if (currentlySelected) {
                    currentlySelected.classList.remove('selected');
                }
                timeSlotBox.classList.add('selected');
                tempSelectedTime = timeSlotBox.textContent; // Update temp selection
            });
            modalTimeSlotsGrid.appendChild(timeSlotBox);
        }
    }

    // --- Date Scroller Generation Logic (for main page) ---
    const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const numberOfDaysToGenerate = 14; // Generate dates for today + next 13 days

    function generateDateScroller() {
        dateScrollerGrid.innerHTML = ''; // Clear previous dates
        const today = new Date(); // Actual current date (Phnom Penh current date based on context)
        today.setHours(0, 0, 0, 0); // Normalize to start of day for comparison

        // Update the month label (assuming currentMonthLabel exists in HTML)
        const currentMonthLabelElement = document.getElementById('current-month-label');
        if (currentMonthLabelElement) {
            currentMonthLabelElement.textContent = monthNames[today.getMonth()];
        }

        for (let i = 0; i < numberOfDaysToGenerate; i++) {
            const date = new Date();
            date.setDate(today.getDate() + i); // Calculate date relative to today
            date.setHours(0, 0, 0, 0); // Normalize for comparison

            const dateBox = document.createElement('div');
            dateBox.classList.add('date-box');
            dateBox.dataset.date = getDateString(date); // Store date in YYYY-MM-DD format

            const dayOfWeekSpan = document.createElement('span');
            dayOfWeekSpan.classList.add('day-of-week');
            dayOfWeekSpan.textContent = (i === 0) ? 'TODAY' : daysOfWeek[date.getDay()];

            const dayOfMonthSpan = document.createElement('span');
            dayOfMonthSpan.classList.add('day-of-month');
            dayOfMonthSpan.textContent = date.getDate();

            dateBox.appendChild(dayOfWeekSpan);
            dateBox.appendChild(dayOfMonthSpan);

            // Add 'today' class if it's the actual current day
            if (getDateString(date) === getDateString(today)) { 
                dateBox.classList.add('today');
            }

            // Mark as selected if it matches the current confirmed selectedDate
            if (selectedDate && getDateString(date) === getDateString(selectedDate)) {
                dateBox.classList.add('selected-date');
            }

            // Event listener for date selection on main page
            dateBox.addEventListener('click', () => {
                const currentlySelected = dateScrollerGrid.querySelector('.date-box.selected-date');
                if (currentlySelected) {
                    currentlySelected.classList.remove('selected-date');
                }
                dateBox.classList.add('selected-date');
                selectedDate = new Date(dateBox.dataset.date); // Update the main selectedDate immediately
                console.log('Selected Date (Main Screen):', formatDateForDisplay(selectedDate));
            });

            dateScrollerGrid.appendChild(dateBox);
        }
    }

    // --- Initial Setup on page load ---

    // Set initial date to today
    selectedDate = new Date(); 
    selectedDate.setHours(0, 0, 0, 0); // Normalize

    // Set initial time (e.g., 4:00 PM)
    selectedTime = formatTime(startTimeMinutes); // Default to 4:00 PM

    // *** THE CRITICAL FIX: CALL generateDateScroller() HERE ON PAGE LOAD ***
    generateDateScroller(); 
    
    // Update the main button's text display immediately after initial setup
    updateMainButtonDisplay(); 

    // --- Modal Control Logic ---

    // Open Modal when time button is clicked
    selectedTimeButton.addEventListener('click', () => {
        // Initialize tempSelectedTime with the currently confirmed selectedTime
        tempSelectedTime = selectedTime; 
        generateTimeSlots(); // Populate time slots inside the modal
        // The modal title should reflect it's only for time selection now, but HTML can only be changed by user.
        // Assuming h3 in modal content is for 'Select a Time'
        timePickerModal.style.display = 'flex'; // Show modal
    });

    // Close Modal via 'x' button
    closeModalButton.addEventListener('click', () => {
        timePickerModal.style.display = 'none';
    });

    // Close Modal via OK button
    okButton.addEventListener('click', () => {
        if (tempSelectedTime) {
            selectedTime = tempSelectedTime; // Confirm time selection from modal
            updateMainButtonDisplay(); // Update main button with new time
            timePickerModal.style.display = 'none';
        } else {
            // If no time is selected in the modal, but OK is clicked
            alert('Please select a time.'); 
        }
    });

    // Close Modal if clicked outside content
    window.addEventListener('click', (event) => {
        if (event.target === timePickerModal) {
            timePickerModal.style.display = 'none';
        }
    });

    // Update the main button's text display (Time only)
    function updateMainButtonDisplay() {
        // The main button should display only the time, not the date and time.
        selectedTimeButton.textContent = selectedTime || 'Select Time'; 
        selectedTimeButton.style.color = 'rgb(29, 38, 88)'; 
    }
});