let height = window.innerHeight 
let width = window.innerWidth
let interval
let n = -1
let timer = 1;
let startGame = document.getElementById('startButton')
let countGameTime = document.getElementById('countGameTime')
let gamePlayGround = document.getElementById('gamePlayGround')
let gameButtons = document.getElementsByClassName('gameButtons')
let modal = document.getElementById('finishModal')

startGame.addEventListener("click" , function () {
    startGame.classList.add("hide")
    countGameTime.classList.add("show")
    spreadButtons(gameButtons)
    addEventsToButtons()
    refreshGame()
})


function openModal() {
    if(interval) clearInterval(interval)
    modal.style.display = "block"
    document.getElementById('playAgain').addEventListener("click", function() {
        refreshGame()
        modal.style.display = "none"
    })
}

function refreshGame() {
    timer = 1
    countGameTime.textContent = timer
    if(interval) clearInterval(interval)
    removeCheckedButtons(gameButtons)
    newGame()
    interval = setInterval(function() {
        timer += 1
        countGameTime.textContent = timer
        if(isMobile() & timer == 3) {
            clearInterval(interval)
            timer = 1
            refreshGame()
        }
        if(!isMobile() & timer == 5) {
            clearInterval(interval)
            timer = 1
            refreshGame()
        }
    }, 1000);
}

function newGame() {
    let positions = []
    let allowedWidht = []
    let allowedHeight = []
    let canvasHeight = ((height ) / 2 ) - 36
    let canvasWidth = ((width  ) / 2 ) - 36
    let heightArray = createArrayOfNumbers(-canvasHeight, canvasHeight)
    let widthArray = createArrayOfNumbers(-canvasWidth, canvasWidth)


    allowedWidht.push(widthArray)
    allowedHeight.push(heightArray)
    for (let i = 0; i < gameButtons.length; i++) {

        let randomPosition= [
            randomWidth(allowedWidht[i]),
            randomHeight(allowedHeight[i])
        ]
        positions.push(randomPosition)
        allowedWidht.push(allowedWidthPositions(positions[i][0], allowedWidht[i]))
        allowedHeight.push(allowedHeightPositions(positions[i][1], allowedHeight[i]))
        gameButtons[i].style.transform =`translate(${ positions[i][0] }px,${ positions[i][1] }px)`; 
    }

}

function addEventsToButtons() {
    let userArray = []
    let resultArray = ["P","O","S","A","O"]

    for (let i = 0; i < gameButtons.length; i++) {
        document.getElementById(`position${i}`).addEventListener("click", function() {
            userArray.push(document.getElementById(`position${i}`).innerHTML)
            document.getElementById(`position${i}`).classList.add("mark-checked")
            const inc = increment()
            const result = compare(userArray[inc], resultArray[inc])
            if(!result) {
                n = -1
                userArray = []
                refreshGame()
            } else {
                if( userArray.length == resultArray.length & result) {
                    n = -1
                    userArray = []
                    openModal()
                }
            }
        })
    }
}

function removeCheckedButtons(gameButtons) {
    for (let i = 0; i < gameButtons.length; i++) {
        document.getElementById(`position${i}`).classList.remove("mark-checked")
    }
}

function spreadButtons(gameButtons) {
    for (let i = 0; i < gameButtons.length; i++) {
        document.getElementById(`position${i}`).classList.add("spread")
    }
}


function compare(userArray, resultArray) {
    if(userArray == resultArray) return true 
    else {
        return false
    }
}

function increment() {
    n++
    return n
}

function getRandomNumber(min, max) {
    let define = max - min + 1
    let generate = Math.random() * define
    let result = Math.floor(generate) + min
    return result
}

function createArrayOfNumbers(start, end) {
    let myArray = []
    for (let i = start; i <= end; i++) {
        myArray.push(i)
    }
    return myArray
}


function randomHeight(heightArray) {
    let index = getRandomNumber(0, heightArray.length)
    return heightArray[index]
}
function randomWidth(widthArray) {
    let index = getRandomNumber(0, widthArray.length)
    return widthArray[index]
}

function allowedHeightPositions(value, heightArray) {
    let notAllowedHeight = []
    for (let i = -21; i < 21; i++) {
        notAllowedHeight.push(value + i)
    }
    heightArray = heightArray.filter(function( el ) {
        return notAllowedHeight.indexOf( el ) < 0;
    })
    return heightArray
}

function allowedWidthPositions(value, widthArray) {
    let notAllowedWidth = []
    for (let i = -21; i < 21; i++) {
        notAllowedWidth.push(value + i)
    }
    widthArray = widthArray.filter(function( el ) {
        return notAllowedWidth.indexOf( el ) < 0;
    })
    return widthArray
}


function isMobile() {
    if(width < 480) return true
    else{
        return false
    }
}
