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

    // Calculate the finish time
    let finishTime = new Date(Date.now() + remainingTime * 1000); // Convert seconds to milliseconds
    let hoursFinish = finishTime.getHours();
    let minutesFinish = finishTime.getMinutes();
    let dayOfWeek = finishTime.toLocaleString('en-US', { weekday: 'long' });
    let timeSuffix = hoursFinish >= 12 ? 'PM' : 'AM';
    hoursFinish = hoursFinish % 12 || 12; // Convert to 12-hour format

    // Determine if the finish time is today or tomorrow
    let finishDate = finishTime.getDate();
    let currentDate = new Date().getDate();

    if (finishDate === currentDate) {
        // If the finish time is today
        finishTimeDisplay.textContent = `Finish Time: ${hoursFinish}:${minutesFinish.toString().padStart(2, '0')} ${timeSuffix}`;
        finishTimeDisplay.style.display = 'block';
    } else if (finishDate > currentDate) {
        // If the finish time is tomorrow
        finishTimeDisplay.textContent = `Finish Time (Tomorrow): ${hoursFinish}:${minutesFinish.toString().padStart(2, '0')} ${timeSuffix}`;
        finishTimeDisplay.style.display = 'block';
    } else {
        finishTimeDisplay.style.display = 'none'; // Hide if no relevant finish time
    }
}
