let framesInput = document.getElementById('frames');
let timeInput = document.getElementById('time');
let timeUnitDisplay = document.getElementById('timeUnitDisplay');  // This is the span now
let startPauseButton = document.getElementById('startPauseButton');
let stopButton = document.getElementById('stopButton');
let timerDisplay = document.getElementById('timerDisplay');
let remainingTime;
let timer;
let isRunning = false;
let isPaused = false;
let currentUnit = 'seconds';  // Default to seconds

// Toggle between "S" and "M" when the user clicks the unit display
function toggleUnit() {
    if (currentUnit === 'seconds') {
        currentUnit = 'minutes';
        timeUnitDisplay.textContent = 'M';  // Show minutes
    } else {
        currentUnit = 'seconds';
        timeUnitDisplay.textContent = 'S';  // Show seconds
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

    remainingTime = totalTimeInSeconds * framesInput.value; // Multiply by number of frames

    isRunning = true;
    isPaused = false;

    startPauseButton.innerHTML = '<i class="fas fa-pause"></i>'; // Show pause icon
    stopButton.disabled = false;
    startPauseButton.disabled = false;

    timer = setInterval(() => {
        if (remainingTime <= 0) {
            clearInterval(timer);
            isRunning = false;
            updateDisplay(remainingTime);
            startPauseButton.innerHTML = '<i class="fas fa-play"></i>'; // Show play icon
            stopButton.disabled = true;
        } else {
            remainingTime -= 1;
            updateDisplay(remainingTime);
            updateFinishTimeDisplay(); // Update the finish time display
        }
    }, 1000);
}

function pauseTimer() {
    clearInterval(timer);
    isRunning = false;
    isPaused = true;
    startPauseButton.innerHTML = '<i class="fas fa-play"></i>'; // Show play icon
}

function stopTimer() {
    clearInterval(timer);
    isRunning = false;
    isPaused = false;
    remainingTime = 0;
    updateDisplay(remainingTime);
    startPauseButton.innerHTML = '<i class="fas fa-play"></i>'; // Show play icon
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
}

function updateFinishTimeDisplay() {
    let currentDate = new Date();
    let finishTimeInMillis = currentDate.getTime() + remainingTime * 1000; // Convert seconds to milliseconds
    let finishDate = new Date(finishTimeInMillis);

    // Get current date components (day, month, year) for comparison
    let currentDay = currentDate.getDate();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();

    // Get finish date components (day, month, year) for comparison
    let finishDay = finishDate.getDate();
    let finishMonth = finishDate.getMonth();
    let finishYear = finishDate.getFullYear();

    let hours = finishDate.getHours();
    let minutes = finishDate.getMinutes();
    let seconds = finishDate.getSeconds();

    let finishTimeDisplay = document.getElementById("finishTimeDisplay");

    // Convert to 12-hour format with AM/PM
    let timeSuffix = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    if (hours === 0) hours = 12; // Handle midnight and noon

    // Check if the finish time is today or tomorrow
    if (currentYear === finishYear && currentMonth === finishMonth && currentDay === finishDay) {
        // Finish Time Today
        finishTimeDisplay.textContent = `Finish Time: ${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} ${timeSuffix}`;
    } else if (currentYear === finishYear && currentMonth === finishMonth && currentDay + 1 === finishDay) {
        // Finish Time Tomorrow
        finishTimeDisplay.textContent = `Finish Time (Tomorrow): ${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} ${timeSuffix}`;
    } else {
        // For cases where the finish time is in the future
        finishTimeDisplay.textContent = `Finish Time: ${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} ${timeSuffix}`;
    }
}
