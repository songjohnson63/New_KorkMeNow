document.addEventListener("DOMContentLoaded", function () {
    const backButton = document.getElementById('back-button');
    const wrapper = document.querySelector('.table-wrapper');

    backButton.addEventListener('click', function () {
    wrapper.classList.add('swipe-right-out');
    setTimeout(() => {
        window.location.href = "../index.html";
    }, 400);
    });

    const timePickerModal = document.getElementById('time-picker-modal');
  const selectedTimeButton = document.getElementById('selected-time-button');
  const timePickerCloseButton = timePickerModal ? timePickerModal.querySelector('.close-button') : null;
  const okButton = document.getElementById('ok-button');

  if (selectedTimeButton) {
    selectedTimeButton.addEventListener('click', () => {
      if (timePickerModal) {
        timePickerModal.style.display = 'block';
      }
    });
  }

  if (timePickerCloseButton) {
    timePickerCloseButton.addEventListener('click', () => {
      if (timePickerModal) {
        timePickerModal.style.display = 'none';
      }
    });
  }

  if (okButton) {
    okButton.addEventListener('click', () => {
      if (timePickerModal) {
        timePickerModal.style.display = 'none';
      }
    });
  }

  window.addEventListener('click', (event) => {
    if (event.target === timePickerModal) {
      timePickerModal.style.display = 'none';
    }
  });

    const modal = document.getElementById("userInputModal");
    const selectedSeatIdDisplay = document.getElementById("selectedSeatIdDisplay");
    const seatIdInput = document.getElementById("seatIdInput");

    // Delegated click handler for seats
    document.querySelector(".seat-map").addEventListener("click", function (event) {
        const seat = event.target.closest(".seat");
        if (!seat) return; // Not a seat, ignore

        const seatId = seat.getAttribute("data-seat-id") || seat.id || "Unknown Seat";
        selectedSeatIdDisplay.textContent = seatId;
        seatIdInput.value = seatId;

        modal.style.display = "flex";
    });


    window.addEventListener('click', (event) => {
    if (event.target === userInputModal) {
      userInputModal.style.display = 'none';
    }
  });


});
