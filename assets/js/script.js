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

const bestResults = {
    easy: { time: null, wpm: null },
    medium: { time: null, wpm: null },
    hard: { time: null, wpm: null }
};

let testStartTime = null;
let testEndTime = null;
let testStarted = false;

// Change sample text when difficulty changes
document.getElementById('difficultySelect').addEventListener('change', setRandomSampleText);

// Add event listeners for typing-input
document.getElementById('typing-input').addEventListener('input', handleTypingInput);
document.getElementById('typing-input').addEventListener('keydown', handleTypingKeydown);

function handleTypingInput() {
    if (!testStarted && document.getElementById('typing-input').value.trim() !== "") {
        startTestOnFirstInput();
    }
    if (testStarted) {
        highlightSampleText();
    }
}

function handleTypingKeydown(event) {
    if (testStarted && event.key === "Enter") {
        event.preventDefault(); // Prevent newline in textarea
        stopTestOnEnter();
    }
}

function startTestOnFirstInput() {
    testStarted = true;
    testStartTime = performance.now();
    testEndTime = null;

    // Enable real-time feedback
    enableTypingFeedback();
    highlightSampleText();

    // Clear previous results
    document.getElementById('result-time').textContent = '-';
    document.getElementById('result-wpm').textContent = '-';
    document.getElementById('result-level').textContent = '-';
}

function stopTestOnEnter() {
    testEndTime = performance.now();
    testStarted = false;

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

    // Update best results if this run is better
    updateBestResults(difficulty, elapsedSeconds, wpm);

    // Disable typing input
    document.getElementById('typing-input').disabled = true;

    // Disable real-time feedback
    disableTypingFeedback();
}

function updateBestResults(difficulty, time, wpm) {
    let best = bestResults[difficulty];

    // Only update if WPM is higher than previous best
    if (best.wpm === null || wpm > best.wpm) {
        best.wpm = wpm;
        best.time = time;
        document.getElementById(`best-wpm-${difficulty}`).textContent = wpm;
        document.getElementById(`best-time-${difficulty}`).textContent = time.toFixed(2);
    }
}

// Update retry logic to reset everything for a new test
document.getElementById('retryBtn').addEventListener('click', resetTest);

function resetTest() {
    testStarted = false;
    testStartTime = null;
    testEndTime = null;

    // Reset typing input
    const typingInput = document.getElementById('typing-input');
    typingInput.disabled = false;
    typingInput.value = '';
    typingInput.placeholder = 'Start typing to begin the test';
    typingInput.focus();

    // Reset results
    document.getElementById('result-time').textContent = '-';
    document.getElementById('result-wpm').textContent = '-';
    document.getElementById('result-level').textContent = '-';

    // Set new sample text
    setRandomSampleText();

    // Remove feedback
    highlightSampleText();
}

// Update setRandomSampleText to highlight on new text
function setRandomSampleText() {
    const select = document.getElementById('difficultySelect');
    const difficulty = select.value;
    const options = sampleTexts[difficulty];
    const randomIndex = Math.floor(Math.random() * options.length);
    document.getElementById('sample-text').textContent = options[randomIndex];
    highlightSampleText();

    // Clear and reset typing input
    const typingInput = document.getElementById('typing-input');
    typingInput.value = '';
    typingInput.placeholder = 'Start typing to begin the test';
    typingInput.disabled = false;
    typingInput.focus();
    highlightSampleText();
}

// Update initializeTestButtons to only affect typing-input
function initializeTestButtons() {
    document.getElementById('typing-input').disabled = false;
    document.getElementById('typing-input').value = '';
    document.getElementById('typing-input').placeholder = 'Start typing to begin the test';
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