let framesInput = document.getElementById('frames');
let timeInput = document.getElementById('time');
let timeUnitDisplay = document.getElementById('timeUnitDisplay'); // This is the span now
let startPauseButton = document.getElementById('startPauseButton');
let stopButton = document.getElementById('stopButton');
let timerDisplay = document.getElementById('timerDisplay');
let finishTimeDisplay = document.createElement('p'); // Create a new element for finish time
document.querySelector('.timer').appendChild(finishTimeDisplay); // Append it below the timer
let remainingTime;
let timer;
let isRunning = false;
let isPaused = false;

let currentUnit = 'seconds'; // Default to seconds

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

    remainingTime = totalTimeInSeconds * framesInput.value; // Multiply by number of frames

    // Calculate finish time
    let now = new Date(); // Current time
    let finishTime = new Date(now.getTime() + remainingTime * 1000); // Add total time (in ms)

    // Format finish time as HH:mm:ss
    let hours = finishTime.getHours().toString().padStart(2, '0');
    let minutes = finishTime.getMinutes().toString().padStart(2, '0');
    let seconds = finishTime.getSeconds().toString().padStart(2, '0');

    // Determine if the finish time is today, tomorrow, or another day
    let nowDay = now.getDate();
    let finishDay = finishTime.getDate();
    let dayDifference = finishDay - nowDay;

    let dayLabel;
    if (dayDifference === 0) {
        dayLabel = "today";
    } else if (dayDifference === 1) {
        dayLabel = "tomorrow";
    } else {
        // If more than one day difference, display the name of the day
        let daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        dayLabel = `on ${daysOfWeek[finishTime.getDay()]}`;
    }

    // Combine time and day label
    let formattedFinishTime = `${hours}:${minutes}:${seconds} ${dayLabel}`;

    // Display the finish time
    finishTimeDisplay.textContent = `Finishes at: ${formattedFinishTime}`;
    finishTimeDisplay.style.display = 'block'; // Show finish time
    finishTimeDisplay.style.fontSize = '1.5rem'; // Styling for better visibility
    finishTimeDisplay.style.marginTop = '10px'; // Space below the main timer

    // Start the timer as before
    isRunning = true;
    isPaused = false;
    startPauseButton.innerHTML = '<i class="fas fa-pause"></i>'; // Show pause icon
    stopButton.disabled = false;

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
    finishTimeDisplay.style.display = 'none'; // Hide finish time when stopped
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
