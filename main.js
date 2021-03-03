
document.getElementById("startButton").addEventListener("click", () => {
  const startButton = document.getElementById("startButton")
  const countTime = document.getElementById("countGameTime")
  const gameButtons = document.querySelectorAll('.gameButtons')
  //show game time
  countTime.classList.add("show")
  // hide inital start
  startButton.classList.add("hide");
  // init game
  new Game(gameButtons);
})
class GameState {

  initState() {
      const state = []
      localStorage.setItem('gameState', JSON.stringify(state))
  }

  getState() {
      const state = JSON.parse(localStorage.getItem('gameState'))
      return state
  }

  clearIntervalId() {
      const itervalId = localStorage.getItem('gameIntervalId')
      clearInterval(itervalId)
  }

  clearTimeId() {
      const timeId = localStorage.getItem('gameTimeId')
      clearTimeout(timeId)
  }

  setTimeId(timeId) {
      localStorage.setItem('gameTimeId', timeId)
  }

  setIntervalId(intervalId) {
      localStorage.setItem('gameIntervalId', intervalId)
  }

  validateState() {
      const resultArray = ["P", "O", "S", "A", "O"];
      const userArray = this.getState()
      const length = this.compareLenght(userArray, resultArray)
      const state = this.compareArrays(userArray, resultArray)
      return { state, length }
  }

  compareArrays(userArray, resultArray) {
      let userArr = [...userArray]
      let resultArr = [...resultArray]
      const index = userArr.length
      resultArr = resultArr.slice(0, index)
      return JSON.stringify(userArray) === JSON.stringify(resultArr)
        ? true
        : false
  }

  compareLenght(userArray, resultArray) {
      return userArray.length === resultArray.length ? true : false
  }

  addButtonToState(button) {
      button.classList.add('mark-checked')
      this.updateState(button.innerHTML)
  }

  updateState(button) {
      const userArray = this.getState()
      userArray.push(button);
      localStorage.setItem('gameState', JSON.stringify(userArray))
  }
}

class Game extends GameState{
  constructor(gameButtons) {
      super()
      this.gameButtons = gameButtons
      this.initGame()
      this.initListeners()
  }

  initGame() {
      this.removeCheckedButtons()
      this.initState()
      this.initIterval()
      this.initTimer()
      this.shuffleButtons()
  }

  deviceTimer() {
      return window.innerWidth < 480 ? 2000 : 5000
  }

  initIterval () {
      let countGameTime = document.getElementById('countGameTime')
      countGameTime.textContent = '1'
      let interval = setInterval(() => {
        countGameTime.textContent ++
      }, 1000);
      this.setIntervalId(interval)
  }

  initTimer() {
     const time = setTimeout(() => {
          this.clearIntervalId()
          this.clearTimeId()
          this.initGame()
      }, this.deviceTimer());
      this.setTimeId(time)
  }

  initListeners() {
      this.gameButtons.forEach(button => {
          button.addEventListener('click', () => {
              // add letter to state
              this.addButtonToState(button)
              // validate state 
              let { state, length } = this.validateState()
              // call new game,clear all from prev state
              if(!state) {
                this.removeCheckedButtons()
                this.clearIntervalId()
                this.clearTimeId()
                this.initGame()
              }
              if(state && length) {
                this.clearIntervalId()
                this.clearTimeId()
                this.openModal()
              }
            })
      })
  }

  shuffleButtons() {
      let allowedWidht = [];
      let allowedHeight = [];
      let positions = [];
      // canvas by pixels minus size of button to edge's
      const canvasHeight = window.innerHeight / 2 - 40;
      const canvasWidth = window.innerWidth / 2 - 40;
      // create arrays x,y positions
      const heightArray = this.createArrayOfNumbers(-canvasHeight, canvasHeight);
      const widthArray = this.createArrayOfNumbers(-canvasWidth, canvasWidth);
    
      // inital position 
      allowedWidht.push(widthArray);
      allowedHeight.push(heightArray);
    
      // loop tru gamebuttons, assign random position
      this.gameButtons.forEach((button , i) => {
        // get random index of x,y position array
        const randomPosition = [
          this.randomArrayIndex(allowedWidht[i]),
          this.randomArrayIndex(allowedHeight[i]),
        ];
        positions.push(randomPosition);
        // exclude declared x,y positions
        allowedWidht.push(this.allowedPositions(positions[i][0], allowedWidht[i]));
        allowedHeight.push(this.allowedPositions(positions[i][1], allowedHeight[i]));
        // add to button style
        button.style.transform = `translate(${positions[i][0]}px,${positions[i][1]}px)`;
      })
  }

  createArrayOfNumbers(start, end) {
      let arr = []
      for (let i = start; i <= end; i++) {
        arr.push(i)
      }
      return arr
  }
  
  randomArrayIndex(array) {
      const arr = [...array]
      let index = this.getRandomNumber(0, arr.length)
      return arr[index]
  }
  
  allowedPositions(value, array) {
      let notAllowedPositions = []
      let arr = [...array]
      for (let i = -20; i <= 20; i++) {
        notAllowedPositions.push(value + i)
      }
      arr = arr.filter((el) => {
        return notAllowedPositions.indexOf(el) < 0
      });
      return arr;
  }
  
  getRandomNumber(min, max) {
      return Math.floor(min + Math.random() * (max - min));
  }
  
  openModal() {
      const finishModal = document.getElementById('finishModal')
      const playAgain = document.getElementById('playAgain')
      finishModal.style.display = "block"
      playAgain.addEventListener("click", () => {
          this.removeCheckedButtons()
          this.initGame()
          finishModal.style.display = "none"
      })
  }

  removeCheckedButtons() {
      this.gameButtons.forEach(button => button.classList.remove('mark-checked'))
  }
}

