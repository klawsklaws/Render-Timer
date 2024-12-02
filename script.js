let framesInput = document.getElementById('frames'); // Keeping for manual fallback
let timeInput = document.getElementById('time');
let timeUnitDisplay = document.getElementById('timeUnitDisplay'); // Span for unit display
let startPauseButton = document.getElementById('startPauseButton');
let stopButton = document.getElementById('stopButton');
let timerDisplay = document.getElementById('timerDisplay');
let scrollWheel = document.querySelector('.scroll-wheel'); // The scrollable container
let options = document.querySelectorAll('.option');

let remainingTime;
let timer;
let isRunning = false;
let isPaused = false;
let currentUnit = 'seconds'; // Default to seconds
let selectedFrames = 250; // Default frames value

// Sync scroll wheel selection with the number of frames
scrollWheel.addEventListener('scroll', () => {
    const center = scrollWheel.offsetHeight / 2 + scrollWheel.scrollTop;
    options.forEach(option => {
        const optionCenter = option.offsetTop + option.offsetHeight / 2;
        if (Math.abs(optionCenter - center) < option.offsetHeight / 2) {
            option.style.color = 'yellow'; // Highlight selected option
            selectedFrames = parseInt(option.textContent); // Update the selected number of frames
        } else {
            option.style.color = 'white'; // Reset others
        }
    });
});

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
    }

    remainingTime = totalTimeInSeconds * selectedFrames; // Multiply by selected frames

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
