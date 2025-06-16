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