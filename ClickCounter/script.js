var currentScore = document.querySelector('#currentScore')
var highScore = document.querySelector('#highScore')
var timer = document.querySelector('#timer')
var clickButton = document.querySelector('#clickButton')
var startButton = document.querySelector('#startBtn')
var pauseButton = document.querySelector('#pauseBtn')
var resumeButton = document.querySelector('#resumeBtn')
var resetButton = document.querySelector('#resetButton')
var statusMessage = document.querySelector('#statusMessage')
var displayName = document.querySelector('#displayName')

var current = 0
var high = 0
var timer1 = 10
var flag = false
var pauseFlag = false
var startedFlag = false
var timerId = null
var userName = 'Guest'
var previousHigh = 0

function onWebsite () {
  loadData()
  displayContent()
  promptUser()
}

function loadData () {
  var temp = localStorage.getItem('clickCounterHighScore')
  if (temp != null) {
    high = parseInt(temp)
    previousHigh = high
  } else {
    high = 0
  }
}

function displayContent () {
  currentScore.textContent = current
  highScore.textContent = high
  timer.textContent = timer1

  // TASK 1: Click Counter Turns Red When > 20
  if (current > 20) {
    currentScore.style.color = 'red'
  } else {
    currentScore.style.color = 'white'
  }
}

function promptUser () {
  var name = prompt("Who's playing? Please enter your name:")
  if (name && name.trim()) {
    userName = name.trim()
    displayName.textContent = userName
  } else {
    userName = 'Guest'
    displayName.textContent = userName
  }
}

function statusMsg (msg) {
  statusMessage.textContent = msg
}

function endGame () {
  // TASK 2: Calculate and display Clicks Per Second (CPS)
  var cps = (current / 10).toFixed(2)

  clearInterval(timerId)
  flag = false
  startedFlag = false
  clickButton.classList.remove('active')
  pauseButton.classList.remove('active')
  resumeButton.classList.remove('active')
  startButton.disabled = false

  // TASK 4: Change Start button text to "Play Again" after game ends
  startButton.innerHTML = 'Play Again'

  if (current > previousHigh) {
    high = current
    localStorage.setItem('clickCounterHighScore', high)
    highScore.textContent = high
    // TASK 5: Flash yellow/gold background for 1 second on new high score
    if (current > previousHigh) {
      document.body.style.background = 'gold'
      setTimeout(function () {
        document.body.style.background = ''
      }, 1000)
    }
    statusMsg(
      `You scored more than the previous score, Congrats!! = ${current}`
    )
  } else if (current == previousHigh && previousHigh > 0) {
    statusMsg(`You scored exactly the same as the high score = ${current}`)
  } else if (current < previousHigh) {
    statusMsg(
      `You scored lower than previous high score :- ${previousHigh}, Your score = ${current}`
    )
  } else {
    high = current
    localStorage.setItem('clickCounterHighScore', high)
    highScore.textContent = high
    if (current > 0) {
      statusMsg(
        `You scored more than the previous score, Congrats!! = ${current}`
      )
    } else {
      statusMsg(`Game Over! Your score = ${current}`)
    }
  }

  // Displaing CPS message as alert prompt at end of game
  setTimeout(function () {
    alert(`You clicked ${cps} times per second!`)
  }, 3000)
}

function startGame () {
  if (startedFlag) return

  startedFlag = true
  flag = true
  current = 0
  timer1 = 10
  previousHigh = high

  displayContent()
  clickButton.classList.add('active')
  startButton.disabled = true
  pauseButton.classList.add('active')

  // TASK 3: Flash "Click Me!" message for 1 second on game start
  statusMsg(`Click Me!`)

  setTimeout(function () {
    statusMsg(`Game started! Click as fast as you can, ${userName}!`)
  }, 1000)

  timerId = setInterval(function () {
    timer1--
    if (timer1 <= 0) {
      endGame()
      current = 0
      timer1 = 10
    }
    displayContent()
  }, 1000)
}

function pauseGame () {
  if (!flag || pauseFlag) return

  pauseFlag = true
  flag = false
  clearInterval(timerId)

  clickButton.classList.remove('active')
  pauseButton.classList.remove('active')
  resumeButton.classList.add('active')

  statusMsg(`Game paused. Click "Resume" to continue, ${userName}!`)
}

function resumeGame () {
  if (!pauseFlag) return

  pauseFlag = false
  flag = true

  clickButton.classList.add('active')
  resumeButton.classList.remove('active')
  pauseButton.classList.add('active')

  statusMsg(`Game resumed! Keep clicking, ${userName}!`)

  timerId = setInterval(function () {
    timer1--
    if (timer1 <= 0) {
      endGame()
      current = 0
      timer1 = 10
    }
    displayContent()
  }, 1000)
}

function userClick () {
  if (!flag || pauseFlag) return
  current++

  // TASK 6: Button grows 10% with each click (max 2× size)
  var currentScale = 1 + current * 0.1
  if (currentScale > 2) {
    currentScale = 2
  }
  clickButton.style.transform = `scale(${currentScale})`
  displayContent()
}

function resetGame () {
  clearInterval(timerId)
  current = 0
  high = 0
  previousHigh = 0
  timer1 = 10
  flag = false
  pauseFlag = false
  startedFlag = false

  // Reset button size at game start
  clickButton.style.transform = 'scale(1)'

  localStorage.removeItem('clickCounterHighScore')

  displayContent()
  clickButton.classList.remove('active')
  startButton.disabled = false
  pauseButton.classList.remove('active')
  resumeButton.classList.remove('active')

  statusMsg(`Everything reset! Ready for a fresh start, ${userName}?`)
}

onWebsite()

startButton.addEventListener('click', startGame)
clickButton.addEventListener('click', userClick)
pauseButton.addEventListener('click', pauseGame)
resumeButton.addEventListener('click', resumeGame)
resetButton.addEventListener('click', resetGame)
