<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- Set the theme color for the status bar -->
    <meta name="theme-color" content="#121214"> <!-- Dark background color for the status bar -->
    
    <!-- Apple-specific meta tag for status bar color on iOS devices -->
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"> <!-- Ensures black status bar -->
    <meta name="apple-mobile-web-app-capable" content="yes">
    
    <title>Timer App</title>
    <!-- Include Font Awesome for icons -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" rel="stylesheet">
    <link rel="stylesheet" href="style.css">
    <style>
        /* Reset and basic styles */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: Myriad Pro Semibold, sans-serif;
            background: linear-gradient(45deg, #1c0818, #121214, #2a2c30); /* Initial gradient */
            background-size: 400% 400%; /* Make the gradient large enough to animate */
            animation: gradientAnimation 10s ease infinite; /* Apply the animation */
            color: white;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100%;
            padding: 20px;
        }

        @keyframes gradientAnimation {
            0% {
                background-position: 0% 50%;
            }
            50% {
                background-position: 100% 50%;
            }
            100% {
                background-position: 0% 50%;
            }
        }

        /* Main container styling */
        .container {
            max-width: 400px;
            width: 100%;
            background-color: rgba(29, 29, 29, 0.3);  /* Dark background with 80% opacity */
            border-radius: 30px;
            padding: 40px 30px; /* Adjusted padding for better spacing */
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        }

        h1 {
            font-size: 2.5rem;
            margin-bottom: 30px; /* Increased spacing for breathing room */
        }

        .inputs {
            margin-bottom: 25px; /* Increased space between input sections */
        }

        .inputs label {
            font-size: 1.2rem; /* Slightly larger font for better readability */
            margin-bottom: 8px; /* Increased spacing below labels */
            display: block;
        }

        /* Input fields styling */
        .inputs input,
        .inputs select {
            padding: 12px; /* Increased padding for a balanced look */
            font-size: 1.2rem; /* Larger font for consistency */
            border: 1px solid #555;
            background-color: transparent; /* Fully transparent background */
            color: white;
            margin-bottom: 2.5px; /* More space between inputs */
            border-radius: 15px;
            width: 100%; /* Ensure full width of inputs */
        }

        .time-input-container {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 15px;
            position: relative;
        }

        #timeUnitDisplay {
            font-size: 1.2rem;
            padding: 6px;
            cursor: pointer;
            background-color: transparent;
            border-radius: 10px;
            color: white;
            text-align: center;
            width: 40px;
            position: absolute;
            right: 0;
            transform: translateX(-20px);
        }

        #timeUnitDisplay:hover {
            background-color: #444;
        }

        .timer p {
            font-size: 5.5rem;
            margin-top: 40px;
            margin-bottom: 40px;
        }

        .controls {
            display: flex;
            justify-content: center;
            gap: 25px;
            margin-top: 40px;
        }

        .controls button {
            background-color: transparent;
            color: white;
            border: 1px solid #555;
            padding: 15px 20px;
            font-size: 1.4rem;
            cursor: pointer;
            width: 45%;
            border-radius: 15px;
            transition: background-color 0.3s;
        }

        .controls button i {
            font-size: 1.2rem;
        }

        .controls button:hover {
            background-color: rgba(51, 51, 51, 0.5);
        }

        .controls button:disabled {
            background-color: #555;
            cursor: not-allowed;
        }

        /* Safe area handling for iPhone X and newer */
        body {
            padding-bottom: env(safe-area-inset-bottom);
            padding-top: env(safe-area-inset-top);
        }

        /* Ensuring full height on mobile */
        html, body {
            height: 100%;
        }

        /* New style for the finish time display */
        .finish-time {
            font-size: 1.2rem;
            margin-top: 20px;
            text-align: center;
            color: #aaa;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Render Time</h1>

        <!-- Input for number of frames -->
        <div class="inputs">
            <label for="frames">Number of Frames</label>
            <input type="number" id="frames" value="250" min="1">
        </div>

        <!-- Time per frame input and unit selection -->
        <div class="inputs">
            <label for="time">Time per frame</label>
            <div class="time-input-container">
                <input type="number" id="time" value="1" min="1" step="0.1">
                <span id="timeUnitDisplay" class="unit-display" onclick="toggleUnit()">S</span>
            </div>
        </div>

        <!-- Timer display -->
        <div class="timer">
            <p id="timerDisplay" style="display:none">0</p>
        </div>

        <!-- Finish time display -->
        <div class="finish-time" id="finishTimeDisplay" style="display:none;"></div>

        <!-- Start/Pause and Stop buttons with icons -->
        <div class="controls">
            <button id="startPauseButton"><i class="fas fa-play"></i></button>
            <button id="stopButton" disabled><i class="fas fa-stop"></i></button>
        </div>
    </div>

    <script>
        let framesInput = document.getElementById('frames');
        let timeInput = document.getElementById('time');
        let timeUnitDisplay = document.getElementById('timeUnitDisplay');  // This is the span now
        let startPauseButton = document.getElementById('startPauseButton');
        let stopButton = document.getElementById('stopButton');
        let timerDisplay = document.getElementById('timerDisplay');
        let finishTimeDisplay = document.getElementById('finishTimeDisplay');
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

            // Calculate and display the finish time
            let finishTime = new Date(Date.now() + time * 1000); // Add remaining time in milliseconds
            let hoursFinish = finishTime.getHours();
            let minutesFinish = finishTime.getMinutes();
            let dayOfWeek = finishTime.toLocaleString('en-US', { weekday: 'long' });
            let timeSuffix = hoursFinish >= 12 ? 'PM' : 'AM';
            hoursFinish = hoursFinish % 12 || 12; // Convert to 12-hour format

            if (finishTime.getDate() !== new Date().getDate()) {
                let displayText = `Finish time: ${hoursFinish}:${minutesFinish.toString().padStart(2, '0')} ${timeSuffix}`;
                if (finishTime.getDate() > new Date().getDate()) {
                    if (finishTime.getDay() === (new Date()).getDay() + 1) {
                        displayText += ` (Tomorrow)`;
                    } else {
                        displayText += ` (${dayOfWeek})`;
                    }
                }
                finishTimeDisplay.textContent = displayText;
                finishTimeDisplay.style.display = 'block';
            } else {
                finishTimeDisplay.style.display = 'none';
            }
        }
    </script>
</body>
</html>
