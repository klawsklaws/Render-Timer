let framesInput = document.getElementById('frames');
let timeInput = document.getElementById('time');
let timeUnitDisplay = document.getElementById('timeUnitDisplay');
let startPauseButton = document.getElementById('startPauseButton');
let stopButton = document.getElementById('stopButton');
let timerDisplay = document.getElementById('timerDisplay');
let finishTimeDisplay = document.getElementById('finishTimeDisplay');
let remainingTime;
let timer;
let isRunning = false;
let currentUnit = 'seconds';  // Default to seconds

// Toggle between "S" and "M" when the user clicks the unit display
function toggleUnit() {
    if (currentUnit === 'seconds') {
        currentUnit = 'minutes';
        timeUnitDisplay.textContent = 'M'; // Show minutes
    } else {
        currentUnit = 'seconds';
        timeUnitDisplay.textContent = 'S'; // Show seconds
    }
}

startPauseButton.addEventListener('click', toggleTimer);
stopButton.addEventListener('click', stopTimer);

function toggleTimer() {
    if (isRunning) {
        pauseTimer();
    } else {
        startTimer();
    }
}

function startTimer() {
    let timePerFrame = parseFloat(timeInput.value);
    let totalTimeInSeconds = timePerFrame;

    // Convert time to seconds based on the selected unit
    if (currentUnit === 'minutes') {
        totalTimeInSeconds *= 60;
    } else if (currentUnit === 'hours') {
        totalTimeInSeconds *= 3600;
    }

    remainingTime = totalTimeInSeconds * framesInput.value;

    isRunning = true;
    startPauseButton.innerHTML = '<i class="fas fa-pause"></i>';
    stopButton.disabled = false;
    startPauseButton.disabled = false;

    timer = setInterval(() => {
        if (remainingTime <= 0) {
            clearInterval(timer);
            isRunning = false;
            updateDisplay(remainingTime);
            startPauseButton.innerHTML = '<i class="fas fa-play"></i>';
            stopButton.disabled = true;
        } else {
            remainingTime -= 1;
            updateDisplay(remainingTime);
        }
    }, 1000);
}

function pauseTimer() {
    clearInterval(timer);
    isRunning = false;
    startPauseButton.innerHTML = '<i class="fas fa-play"></i>';
}

function stopTimer() {
    clearInterval(timer);
    isRunning = false;
    remainingTime = 0;
    updateDisplay(remainingTime);
    startPauseButton.innerHTML = '<i class="fas fa-play"></i>';
    stopButton.disabled = true;
}

function updateDisplay(time) {
    let hours = Math.floor(time / 3600);
    let minutes = Math.floor((time % 3600) / 60);
    let seconds = time % 60;

    if (hours > 0) {
        timerDisplay.textContent = `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    } else if (minutes > 0) {
        timerDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    } else {
        timerDisplay.textContent = `${seconds}`;
    }

    timerDisplay.style.display = 'block';

    // Calculate finish time
    let finishTime = new Date(Date.now() + remainingTime * 1000); // Convert seconds to milliseconds
    let hoursFinish = finishTime.getHours();
    let minutesFinish = finishTime.getMinutes();
    let timeSuffix = hoursFinish >= 12 ? 'PM' : 'AM';
    hoursFinish = hoursFinish % 12 || 12; // Convert to 12-hour format

    let currentDate = new Date();
    let finishDate = finishTime;

    // Display finish time correctly
    if (finishDate.toDateString() === currentDate.toDateString()) {
        // If finish time is today
        finishTimeDisplay.textContent = `Finish time: ${hoursFinish}:${minutesFinish.toString().padStart(2, '0')} ${timeSuffix}`;
        finishTimeDisplay.style.display = 'block';
    } else {
        // If finish time is tomorrow
        finishTimeDisplay.textContent = `Finish time: ${hoursFinish}:${minutesFinish.toString().padStart(2, '0')} ${timeSuffix} (Tomorrow)`;
        finishTimeDisplay.style.display = 'block';
    }
}
