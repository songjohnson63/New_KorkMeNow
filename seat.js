const findTableBtn = document.getElementById('find-table');
  const animatedWrapper = document.querySelector('.animated-wrapper');

  findTableBtn.addEventListener('click', function () {
    // Add the swipe animation class to the wrapper only
    animatedWrapper.classList.add('swipe-out');

    // Wait for animation to finish, then redirect
    setTimeout(() => {
      window.location.href = "../Table/table.html";
    }, 500); // match CSS duration
  });