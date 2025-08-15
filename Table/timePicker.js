// timePicker.js
document.addEventListener('DOMContentLoaded', () => {
  const selectedTimeButton = document.getElementById('selected-time-button');
  const timePickerModal = document.getElementById('time-picker-modal');
  const closeModalButton = timePickerModal ? timePickerModal.querySelector('.close-button') : null;
  const okButton = document.getElementById('ok-button'); // optional
  const modalTimeSlotsGrid = document.getElementById('modal-time-slots-grid');
  const dateScrollerGrid = document.getElementById('date-scroller-grid');

  // Support both your old (.month-label) and new (#current-month-label) month container
  const monthLabelEl =
    document.getElementById('current-month-label') ||
    document.querySelector('.month-label');

  // --- State ---
  let selectedDate = startOfDay(new Date());
  const startTimeMinutes = 16 * 60; // 4:00 PM
  const endTimeMinutes = 23 * 60;   // 11:00 PM
  const interval = 15;              // minutes
  let selectedTime = formatTime(startTimeMinutes); // default to 4:00 PM

  // --- Utils ---
  function startOfDay(d) {
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    return x;
  }

  function formatTime(totalMinutes) {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const h12 = hours % 12 === 0 ? 12 : hours % 12;
    const mm = minutes < 10 ? `0${minutes}` : `${minutes}`;
    return `${h12}:${mm} ${ampm}`;
  }

  function dateKey(d) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  const monthNames = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
  const daysShort  = ['SUN','MON','TUE','WED','THU','FRI','SAT'];

  function setMonthLabelFor(date) {
    if (monthLabelEl) monthLabelEl.textContent = monthNames[date.getMonth()];
  }

  // --- Date scroller ---
  function generateDateScroller() {
    if (!dateScrollerGrid) return;

    dateScrollerGrid.innerHTML = '';
    const today = startOfDay(new Date());
    const DAYS = 14; // today + next 13 days

    for (let i = 0; i < DAYS; i++) {
      const d = startOfDay(new Date(today));
      d.setDate(today.getDate() + i);

      const box = document.createElement('div');
      box.className = 'date-box';
      box.dataset.date = dateKey(d);

      const top = document.createElement('span');
      top.className = 'day-of-week';
      top.textContent = (i === 0) ? 'TODAY' : daysShort[d.getDay()];

      const num = document.createElement('span');
      num.className = 'day-of-month';
      num.textContent = d.getDate();

      box.appendChild(top);
      box.appendChild(num);

      if (dateKey(d) === dateKey(today)) box.classList.add('today');
      if (dateKey(d) === dateKey(selectedDate)) box.classList.add('selected-date');

      box.addEventListener('click', () => {
        const prev = dateScrollerGrid.querySelector('.date-box.selected-date');
        if (prev) prev.classList.remove('selected-date');
        box.classList.add('selected-date');
        selectedDate = startOfDay(new Date(box.dataset.date));
        setMonthLabelFor(selectedDate); // keep month label in sync with chosen date
      });

      dateScrollerGrid.appendChild(box);
    }

    // initial month label
    setMonthLabelFor(selectedDate);
  }

  // --- Time slots in modal ---
  function generateTimeSlots() {
    if (!modalTimeSlotsGrid) return;

    modalTimeSlotsGrid.innerHTML = '';

    for (let t = startTimeMinutes; t <= endTimeMinutes; t += interval) {
      const div = document.createElement('div');
      div.className = 'time-slot-box';
      const label = formatTime(t);
      div.textContent = label;

      if (label === selectedTime) div.classList.add('selected');

      // Click time = select immediately, update button, close modal
      div.addEventListener('click', () => {
        const prev = modalTimeSlotsGrid.querySelector('.time-slot-box.selected');
        if (prev) prev.classList.remove('selected');
        div.classList.add('selected');

        selectedTime = label;
        updateSelectedTimeButton();

        if (timePickerModal) timePickerModal.style.display = 'none';
      });

      modalTimeSlotsGrid.appendChild(div);
    }
  }

  function updateSelectedTimeButton() {
    if (!selectedTimeButton) return;
    selectedTimeButton.textContent = selectedTime || 'Select Time';
    selectedTimeButton.style.color = 'rgb(29, 38, 88)';
  }

  // --- Modal controls ---
  if (selectedTimeButton) {
    selectedTimeButton.addEventListener('click', () => {
      if (!timePickerModal) return;
      generateTimeSlots();
      timePickerModal.style.display = 'flex';
    });
  }

  if (closeModalButton) {
    closeModalButton.addEventListener('click', () => {
      timePickerModal.style.display = 'none';
    });
  }

  if (okButton) {
    okButton.addEventListener('click', () => {
      // OK is optional now; selection already happens on click
      timePickerModal.style.display = 'none';
    });
  }

  window.addEventListener('click', (e) => {
    if (e.target === timePickerModal) {
      timePickerModal.style.display = 'none';
    }
  });

  // --- Init ---
  generateDateScroller();
  updateSelectedTimeButton();
});
