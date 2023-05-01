// Global Variables
const RANDOM_QUOTE_API_URL = 'http://api.quotable.io/random' // API source
const quoteDisplayElement = document.getElementById('quoteDisplay')
const quoteInputElement = document.getElementById('quoteInput')
const timerElement = document.getElementById('timer')

let startedTyping = false // new variable

quoteInputElement.addEventListener('input', () => {
  if (!startedTyping) { // start timer if not started yet
    startedTyping = true
    startTimer()
  }
  
  const arrayQuote = quoteDisplayElement.querySelectorAll('span')
  const arrayValue = quoteInputElement.value.split('')

  let correct = true
  arrayQuote.forEach((characterSpan, index) => {
    const character = arrayValue[index]
    if (character == null) {
      characterSpan.classList.remove('correct')
      characterSpan.classList.remove('incorrect')
      correct = false
    } else if (character === characterSpan.innerText) {
      characterSpan.classList.add('correct')
      characterSpan.classList.remove('incorrect')
    } else {
      characterSpan.classList.remove('correct')
      characterSpan.classList.add('incorrect')
      correct = false
    }
  })
  if (correct) {
    startedTyping = false // reset timer when quote is correct
    renderNewQuote()
  }
})

function getRandomQuote() {
  return fetch(RANDOM_QUOTE_API_URL)
    .then(response => response.json())
    .then(data => data.content)
}

// Timer
let startTime, timerIntervalId
function startTimer() {
  timerElement.innerText = '0:00' // Reset timer to 0 when user starts typing
  startTime = new Date()
  timerIntervalId = setInterval(() => {
    timerElement.innerText = getTimerTime()
    if (timerElement.innerText === quoteDisplayElement.innerText.length / 5 + ':00') {
      clearInterval(timerIntervalId) // Stop timer when user finishes typing quote
    }
  }, 1000)
}

function getTimerTime() {
  const elapsedTime = Math.floor((new Date() - startTime) / 1000)
  const minutes = Math.floor(elapsedTime / 60).toString().padStart(2, '0')
  const seconds = (elapsedTime % 60).toString().padStart(2, '0')
  return `${minutes}:${seconds}`
}


function getTimerTime() {
  return Math.floor((new Date() - startTime) / 1000)
}

async function renderNewQuote() {
  const quote = await getRandomQuote()
  quoteDisplayElement.innerHTML = ''
  quote.split('').forEach(character => {
    const characterSpan = document.createElement('span')
    characterSpan.innerText = character
    quoteDisplayElement.appendChild(characterSpan)
  })
  quoteInputElement.value = null
  clearInterval(timerIntervalId)
  timerElement.innerText = '0:00'
}
renderNewQuote()
