// console.log("Timer");

import flatpickr from "flatpickr";

import "flatpickr/dist/flatpickr.min.css";
// Описаний у документації
import iziToast from "izitoast";
// Додатковий імпорт стилів
import "izitoast/dist/css/iziToast.min.css";

const datePicker = document.querySelector("#datetime-picker");
const startButton = document.querySelector("[data-start]");
let userSelectedDate = null;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    if (selectedDates[0] < new Date()) {
      iziToast.error({ message: "Please choose a date in the future" });
      startButton.disabled = true;
    } else {
      startButton.disabled = false;
      userSelectedDate = selectedDates[0];
    }
  },
};

flatpickr(datePicker, options);

let timerInterval = null;

startButton.addEventListener("click", () => {
  if (!userSelectedDate) return;
  startButton.disabled = true;
  datePicker.disabled = true;
  
  timerInterval = setInterval(() => {
    const timeRemaining = userSelectedDate - new Date();

    if (timeRemaining <= 0) {
      clearInterval(timerInterval);
      updateTimerDisplay(0, 0, 0, 0);
      datePicker.disabled = false;
      return;
    }

    const { days, hours, minutes, seconds } = convertMs(timeRemaining);
    updateTimerDisplay(days, hours, minutes, seconds);
  }, 1000);
});

function updateTimerDisplay(days, hours, minutes, seconds) {
  document.querySelector("[data-days]").textContent = addLeadingZero(days);
  document.querySelector("[data-hours]").textContent = addLeadingZero(hours);
  document.querySelector("[data-minutes]").textContent = addLeadingZero(minutes);
  document.querySelector("[data-seconds]").textContent = addLeadingZero(seconds);
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}
