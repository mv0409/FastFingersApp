document.getElementById("startButton").addEventListener("click", () => {
  const startButton = document.getElementById("startButton")
  const countTime = document.getElementById("countGameTime")
  const gameButtons = document.querySelectorAll('.gameButtons')
  
  //show game time
  countTime.classList.add("show")
  // hide inital start
  startButton.classList.add("hide");
  // add events to buttons, once (no memory leak)
  addEventsToButtons(gameButtons)
  // init game
  newGame(gameButtons);
});
// recursive function
function newGame(gameButtons) {
  // init state
  initalState()
  // random position buttons
  schuffleButtons(gameButtons)
  // start timer
  let timer = startTimer()
  // time runs out, refresh game or stop if won
  Promise.resolve().then(
    setTimeout(() => {
      clearInterval(timer)
      let { state, length } = validateState()
      // if player won - stop timer, dont refresh
      if((!state && !length) || (state && !length)) {
        removeCheckedButtons(gameButtons)
        newGame(gameButtons)
      }
    },deviceTimer())
  )
}
// spread buttons to random positions
function schuffleButtons(gameButtons) {
  let allowedWidht = [];
  let allowedHeight = [];
  let positions = [];
  // canvas by pixels minus size of button to edge's
  const canvasHeight = window.innerHeight / 2 - 40;
  const canvasWidth = window.innerWidth / 2 - 40;
  // create arrays x,y positions
  const heightArray = createArrayOfNumbers(-canvasHeight, canvasHeight);
  const widthArray = createArrayOfNumbers(-canvasWidth, canvasWidth);

  // inital position 
  allowedWidht.push(widthArray);
  allowedHeight.push(heightArray);

  // loop tru gamebuttons, assign random position
  gameButtons.forEach((button , i) => {
    // get random index of x,y position array
    const randomPosition = [
      randomArrayIndex(allowedWidht[i]),
      randomArrayIndex(allowedHeight[i]),
    ];
    positions.push(randomPosition);
    // exclude declared x,y positions
    allowedWidht.push(allowedPositions(positions[i][0], allowedWidht[i]));
    allowedHeight.push(allowedPositions(positions[i][1], allowedHeight[i]));
    // add to button style
    button.style.transform = `translate(${positions[i][0]}px,${positions[i][1]}px)`;
  })
}
// eventListener on buttons
function addEventsToButtons(gameButtons) {
  gameButtons.forEach((button) => {
    button.addEventListener('click', () => {
      // add button value to state on click
      addButtonToState(button)
      // validate state 
      let { state, length } = validateState()
      // call new game
      if(!state) {
        removeCheckedButtons(gameButtons)
        newGame(gameButtons)
      }
      if(state && length) {
        openModal(gameButtons)
      }
    })
  })
}
// mark checked buttons, update state
function addButtonToState (_button) {
  const button = _button.innerHTML
  _button.classList.add('mark-checked')
  updateState(button)
}
// open finished game modal
function openModal(gameButtons) {
    const finishModal = document.getElementById('finishModal')
    const playAgain = document.getElementById('playAgain')
    finishModal.style.display = "block"
    playAgain.addEventListener("click", () => {
        removeCheckedButtons(gameButtons)
        newGame(gameButtons)
        finishModal.style.display = "none"
    })
}
// remove class from button
function removeCheckedButtons(gameButtons) {
  gameButtons.forEach(button => button.classList.remove('mark-checked'))
}
// init state
function initalState() {
  let state = []
  localStorage.setItem('gameState', JSON.stringify(state))
}
// get state
function getState() {
  return JSON.parse(localStorage.getItem("gameState"));
}

// update state
function updateState(button) {
  const userArray = getState()
  userArray.push(button);
  localStorage.setItem('gameState', JSON.stringify(userArray))
}

// returns boolean, compare lenght of 2 arr
function compareLenght(userArray, resultArray) {
  return userArray.length === resultArray.length ? true : false
}


// returns iterval id, show timer on screen and start executing every sec
function startTimer() {
  let countGameTime = document.getElementById('countGameTime')
  let timer = 1
  countGameTime.textContent = timer
  let interval = setInterval(() => {
    timer += 1
    // show timer 
    countGameTime.textContent = timer
    // increment timer by 1000ms
  }, 1000);
  return interval
}

// returns boolean, compare user clicked buttons and final result
function validateState() {
  const resultArray = ["P", "O", "S", "A", "O"];
  const userArray = getState()
  const length = compareLenght(userArray, resultArray)
  const state = compareArrays(userArray, resultArray)
  return { state, length }
}

// returns boolean , compare 2 arr
function compareArrays(userArray, resultArray) {
  const index = userArray.length
  resultArray = resultArray.slice(0, index)
  return JSON.stringify(userArray) === JSON.stringify(resultArray)
    ? true
    : false
}
// returns genereted random number
function getRandomNumber(min, max) {
  const define = max - min + 1
  const generate = Math.random() * define
  return Math.floor(generate) + min
}
// returns array of numbers
function createArrayOfNumbers(start, end) {
  let arr = []
  for (let i = start; i <= end; i++) {
    arr.push(i)
  }
  return arr
}
// returns random index in array
function randomArrayIndex(array) {
  let index = getRandomNumber(0, array.length)
  return array[index]
}
// returns Array with excluded position(size of button)
function allowedPositions(value, array) {
  let notAllowedPositions = []
  for (let i = -20; i <= 20; i++) {
    notAllowedPositions.push(value + i)
  }
  array = array.filter((el) => {
    return notAllowedPositions.indexOf(el) < 0
  });
  return array;
}
// returns seconds for diffrent screen sizes
function deviceTimer() {
  return window.innerWidth < 480 ? 2000 : 5000
}

