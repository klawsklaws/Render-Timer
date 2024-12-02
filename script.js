let framesInput = document.getElementById('frames');
let timeInput = document.getElementById('time');
let timeUnitDisplay = document.getElementById('timeUnitDisplay');
let startButton = document.getElementById('startButton');
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

// Start or restart the countdown
startButton.addEventListener('click', toggleTimer);

// Update the timer display when input changes
framesInput.addEventListener('input', updateTimerDisplay);
timeInput.addEventListener('input', updateTimerDisplay);

// Event listener for "Enter" key press to start countdown
timeInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        startTimer();  // Start the timer when "Enter" is pressed
    }
});

function toggleTimer() {
    if (isRunning) {
        // If running, restart the timer
        restartTimer();
    } else {
        // If paused, start the timer
        startTimer();
    }
}

function startTimer() {
    let timePerFrame = parseFloat(timeInput.value);
    let totalTimeInSeconds = timePerFrame;

    // Convert time to seconds based on the selected unit
    if (currentUnit === 'minutes') {
        totalTimeInSeconds *= 60;
    }

    remainingTime = totalTimeInSeconds * framesInput.value;

    isRunning = true;
    startButton.innerHTML = '<i class="fas fa-redo"></i>';  // Change button to "Restart" icon (redo)

    timer = setInterval(() => {
        if (remainingTime <= 0) {
            clearInterval(timer);
            isRunning = false;
            updateDisplay(remainingTime);
            startButton.innerHTML = '<i class="fas fa-play"></i>';  // Change button to "Start" icon
        } else {
            remainingTime -= 1;
            updateDisplay(remainingTime);
        }
    }, 1000);
}

function restartTimer() {
    // Reset the timer to initial state
    clearInterval(timer);
    isRunning = false;
    startButton.innerHTML = '<i class="fas fa-play"></i>';  // Change button to "Start" icon
    updateTimerDisplay();  // Update the display with new time
    startTimer();  // Restart the timer
}

function updateTimerDisplay() {
    let timePerFrame = parseFloat(timeInput.value);
    let totalTimeInSeconds = timePerFrame;

    // Convert time to seconds based on the selected unit
    if (currentUnit === 'minutes') {
        totalTimeInSeconds *= 60;
    }

    remainingTime = totalTimeInSeconds * framesInput.value;

    if (!isRunning) {
        updateDisplay(remainingTime);  // Update the display
    }
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

    // Dynamically adjust font size to prevent dots
    let fontSize = 5; // Default font size
    if (remainingTime > 3600) {
        fontSize = 3; // Smaller font size for large times (e.g., > 1 hour)
    } else if (remainingTime > 1800) {
        fontSize = 4; // Slightly smaller font for mid-range times
    } else if (remainingTime > 600) {
        fontSize = 4.5; // Moderate font for reasonable times
    }

    // Apply the font size dynamically
    timerDisplay.style.fontSize = `${fontSize}rem`; // Adjust font size to prevent overflow

    timerDisplay.style.display = 'block';

    // Calculate the finish time
    let finishTime = new Date(Date.now() + remainingTime * 1000); // Convert seconds to milliseconds
    let hoursFinish = finishTime.getHours();
    let minutesFinish = finishTime.getMinutes();
    let dayOfWeek = finishTime.toLocaleString('en-US', { weekday: 'long' });
    hoursFinish = hoursFinish % 24; // Ensure 24-hour format

    let displayText = `Finish Time: ${hoursFinish}:${minutesFinish.toString().padStart(2, '0')}`;
    
    if (finishTime.getDate() !== new Date().getDate()) {
        if (finishTime.getDate() > new Date().getDate()) {
            let futureDate = finishTime.toLocaleDateString();
            if (finishTime.getDate() > new Date().getDate() + 7) {
                // Show date if finish time is more than 7 days ahead
                displayText += ` on ${futureDate}`;
            } else if (finishTime.getDay() === (new Date()).getDay() + 1) {
                displayText += ` (Tomorrow)`;
            } else {
                displayText += ` (${dayOfWeek})`;
            }
        }
    }

    finishTimeDisplay.textContent = displayText;
    finishTimeDisplay.style.display = 'block';
}
