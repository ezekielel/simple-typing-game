const url = 'https://quotes15.p.rapidapi.com/quotes/random/?language_code=en';
const options = {
  method: 'GET',
  headers: {
    'x-rapidapi-key': '305354919amsh90635a651fb3802p160855jsn383d9c00335f',
    'x-rapidapi-host': 'quotes15.p.rapidapi.com'
  }
};

const quoteDisplayElement = document.getElementById('quoteDisplay');
const quoteInputElement = document.getElementById('quoteInput');
const timerElement = document.getElementById('timer');

let hasStarted = false; // Flag to track if the timer has started

quoteInputElement.addEventListener('input', () => {
  const arrayQuote = quoteDisplayElement.querySelectorAll('span');
  const arrayValue = quoteInputElement.value.split('');

  let correct = true;
  arrayQuote.forEach((characterSpan, index) => {
    const character = arrayValue[index];
    if (character == null) {
      characterSpan.classList.remove('correct');
      characterSpan.classList.remove('incorrect');
      correct = false;
    } else if (character === characterSpan.innerText) {
      characterSpan.classList.add('correct');
      characterSpan.classList.remove('incorrect');
    } else {
      characterSpan.classList.remove('correct');
      characterSpan.classList.add('incorrect');
      correct = false;
    }
  });

  // Start the timer only after the user starts typing
  if (!hasStarted && arrayValue.length > 0) {
    startTimer();
    hasStarted = true; // Ensure timer only starts once
  }

  if (correct) renderNewQuote();
});

function getRandomQuote() {
  return fetch(url, options)
    .then(response => response.json())
    .then(data => data.content || data.quote || data.text) // Adjust based on the actual response
    .catch(err => console.error('Error fetching quote:', err)); // Error handling
}

async function renderNewQuote() {
  const quote = await getRandomQuote();
  quoteDisplayElement.innerHTML = '';
  
  if (quote) {
    quote.split('').forEach(character => {
      const characterSpan = document.createElement('span');
      characterSpan.innerText = character;
      quoteDisplayElement.appendChild(characterSpan);
    });
  }
  quoteInputElement.value = ''; // Clear the input field
  resetTimer(); // Reset the timer when a new quote is rendered
  hasStarted = false; // Reset the timer start flag for the new quote
}

let startTime;
let timerInterval;

function startTimer() {
  startTime = new Date();
  if (timerInterval) clearInterval(timerInterval); // Clear any existing timer interval
  timerInterval = setInterval(() => {
    timerElement.innerText = getTimerTime();
  }, 1000);
}

function resetTimer() {
  if (timerInterval) clearInterval(timerInterval); // Stop the running timer
  timerElement.innerText = '0'; // Reset the timer display
}

function getTimerTime() {
  return Math.floor((new Date() - startTime) / 1000);
}

const restartButton = document.getElementById('restartButton');

// Add an event listener to refresh the page when the button is clicked
restartButton.addEventListener('click', () => {
  location.reload(); // Refresh the page
});

renderNewQuote();
