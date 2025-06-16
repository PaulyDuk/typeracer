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

let testStartTime = null;
let testEndTime = null;

// Change sample text when difficulty changes
document.getElementById('difficultySelect').addEventListener('change', setRandomSampleText);

// Attach event listeners for start and stop buttons
document.getElementById('startBtn').addEventListener('click', startTest);
document.getElementById('stopBtn').addEventListener('click', stopTest);

// Optionally, set a random sample text on page load
window.addEventListener('DOMContentLoaded', setRandomSampleText);

//initialize the test buttons
window.addEventListener('DOMContentLoaded', initializeTestButtons);

function setRandomSampleText() {
  const select = document.getElementById('difficultySelect');
  const difficulty = select.value;
  const options = sampleTexts[difficulty];
  const randomIndex = Math.floor(Math.random() * options.length);
  document.getElementById('sample-text').textContent = options[randomIndex];
  highlightSampleText(); // Ensure highlighting is applied on new sample text
}

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

    // Enable real-time feedback
    enableTypingFeedback();
    highlightSampleText();
}

function canStopTest() {
    const sampleText = document.getElementById('sample-text').textContent.trim();
    const userInput = document.getElementById('typing-input').value.trim();
    return userInput === sampleText;
}

function stopTest() {
    // Record the end time
    testEndTime = performance.now();

    // Calculate elapsed time in seconds
    const elapsedMs = testEndTime - testStartTime;
    const elapsedSeconds = elapsedMs / 1000;
    const roundedSeconds = elapsedSeconds.toFixed(2);

    // Get sample text and user input
    const sampleText = document.getElementById('sample-text').textContent.trim();
    const userInput = document.getElementById('typing-input').value.trim();

    // Split texts into words
    const sampleWords = sampleText.split(/\s+/);
    const userWords = userInput.split(/\s+/);

    // Count correctly typed words (in order)
    let correctWords = 0;
    for (let i = 0; i < Math.min(sampleWords.length, userWords.length); i++) {
        if (userWords[i] === sampleWords[i]) {
            correctWords++;
        }
    }

    // Calculate WPM
    const wpm = elapsedSeconds > 0 ? Math.round((correctWords / elapsedSeconds) * 60) : 0;

    // Display the time, WPM, and difficulty level in the results area
    document.getElementById('result-time').textContent = roundedSeconds;
    document.getElementById('result-wpm').textContent = wpm;
    const difficulty = document.getElementById('difficultySelect').value;
    document.getElementById('result-level').textContent = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);

    // Enable Start, disable Stop
    document.getElementById('startBtn').disabled = false;
    document.getElementById('stopBtn').disabled = true;

    // Disable typing input
    document.getElementById('typing-input').disabled = true;

    // Disable real-time feedback
    disableTypingFeedback();
}

// Set initial button states on page load
function initializeTestButtons() {
    document.getElementById('startBtn').disabled = false;
    document.getElementById('stopBtn').disabled = true;
    document.getElementById('typing-input').disabled = true;
}

function highlightSampleText() {
    const sampleTextElem = document.getElementById('sample-text');
    const typingInput = document.getElementById('typing-input');
    const sampleText = sampleTextElem.textContent.trim();
    const userInput = typingInput.value.trim();

    const sampleWords = sampleText.split(/\s+/);
    const userWords = userInput.split(/\s+/);

    let highlighted = sampleWords.map((word, idx) => {
        if (userWords[idx] === undefined || userWords[idx] === "") {
            // Not yet typed: no highlight
            return `<span>${word}</span>`;
        } else if (userWords[idx] === word) {
            // Correct: blue
            return `<span class="highlight-correct">${word}</span>`;
        } else {
            // Incorrect: red
            return `<span class="highlight-incorrect">${word}</span>`;
        }
    });

    sampleTextElem.innerHTML = highlighted.join(' ');
}

function enableTypingFeedback() {
    document.getElementById('typing-input').addEventListener('input', highlightSampleText);
}

function disableTypingFeedback() {
    document.getElementById('typing-input').removeEventListener('input', highlightSampleText);
    // Optionally, reset sample text formatting to plain text
    const sampleTextElem = document.getElementById('sample-text');
    sampleTextElem.textContent = sampleTextElem.textContent;
}