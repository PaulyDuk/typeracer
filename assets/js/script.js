const sampleTexts = {
  easy: [
    "The quick brown fox jumps over the lazy dog.",
    "Typing is fun and helps you learn fast.",
    "Practice makes perfect every single day."
  ],
  medium: [
    "A journey of a thousand miles begins with a single step.",
    "She sells seashells by the seashore every morning.",
    "Typing tests improve your speed and accuracy."
  ],
  hard: [
    "Sphinx of black quartz, judge my vow as quickly as possible.",
    "Pack my box with five dozen liquor jugs before midnight.",
    "The five boxing wizards jump quickly over the lazy dwarf."
  ]
};

function setRandomSampleText() {
  const select = document.getElementById('difficultySelect');
  const difficulty = select.value;
  const options = sampleTexts[difficulty];
  const randomIndex = Math.floor(Math.random() * options.length);
  document.getElementById('sample-text').textContent = options[randomIndex];
}

// Change sample text when difficulty changes
document.getElementById('difficultySelect').addEventListener('change', setRandomSampleText);

// Optionally, set a random sample text on page load
window.addEventListener('DOMContentLoaded', setRandomSampleText);

let testStartTime = null;
let testEndTime = null;

function startTest() {
    // Record the start time
    testStartTime = performance.now();
    testEndTime = null;

    // Disable Start, enable Stop
    document.getElementById('startBtn').disabled = true;
    document.getElementById('stopBtn').disabled = false;

    // Enable typing input and clear it
    const typingInput = document.getElementById('typing-input');
    typingInput.disabled = false;
    typingInput.value = '';
    typingInput.placeholder = '';
    typingInput.focus();

    // Clear previous results
    document.getElementById('result-time').textContent = '-';
}

function stopTest() {
    // Record the end time
    testEndTime = performance.now();

    // Calculate elapsed time in seconds
    const elapsedMs = testEndTime - testStartTime;
    const elapsedSeconds = elapsedMs / 1000;
    const roundedSeconds = elapsedSeconds.toFixed(2);

    // Display the time in the results area
    document.getElementById('result-time').textContent = roundedSeconds;

    // Enable Start, disable Stop
    document.getElementById('startBtn').disabled = false;
    document.getElementById('stopBtn').disabled = true;

    // Disable typing input
    document.getElementById('typing-input').disabled = true;
}

// Set initial button states on page load
function initializeTestButtons() {
    document.getElementById('startBtn').disabled = false;
    document.getElementById('stopBtn').disabled = true;
    document.getElementById('typing-input').disabled = true;
}

// Attach event listeners
document.getElementById('startBtn').addEventListener('click', startTest);
document.getElementById('stopBtn').addEventListener('click', stopTest);

window.addEventListener('DOMContentLoaded', initializeTestButtons);