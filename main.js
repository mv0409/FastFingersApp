document.getElementById('startButton').addEventListener("click" , () => {
    document.getElementById('startButton').classList.add("hide")
    document.getElementById('countGameTime').classList.add("show")
    newGame(document.getElementsByClassName('gameButtons'))
})

function openModal(gameButtons) {
    document.getElementById('finishModal').style.display = "block"
    document.getElementById('playAgain').addEventListener("click", () => {
        newGame(gameButtons)
        document.getElementById('finishModal').style.display = "none"
    })
}

const game = {
    state : 'Start-Game',
    transitions: {
        'Start-Game' : {
            refresh : function refreshGame(startButtons) {

            }
        },
        'Game-End' : {
            successEnd: function successEnd() {

            }
        },

    }
}
    
    // let interval = setInterval(() => {
    //     console.log(interval, 'inside interval')
    //     timer += 1
    //     document.getElementById('countGameTime').textContent = timer
    //     if(isMobile() && timer === 3) {
    //         clearInterval(interval)
    //         refreshGame(gameButtons)
    //     }
    //     if(!isMobile() && timer === 10) {
    //         console.log(interval, 'inside game over')
    //         clearInterval(interval)
    //         refreshGame(gameButtons)
    //     }
    // }, 1000);

    // checkResult(gameButtons, userArray, resultArray, timer)
// }

function newGame(gameButtons) {
    const userArray = []
    const resultArray = ["P","O","S","A","O"]
    let positions = []
    let allowedWidht = []
    let allowedHeight = []
    const canvasHeight = (( window.innerHeight ) / 2 ) - 36
    const canvasWidth = (( window.innerWidth  ) / 2 ) - 36
    const heightArray = createArrayOfNumbers( -canvasHeight, canvasHeight)
    const widthArray = createArrayOfNumbers( -canvasWidth, canvasWidth)

    allowedWidht.push(widthArray)
    allowedHeight.push(heightArray)

    for (let i = 0; i < gameButtons.length; i++) {
        document.getElementById(`position-${i}`).classList.add("spread")
        document.getElementById(`position-${i}`).classList.remove("mark-checked")

        document.getElementById(`position-${i}`).addEventListener("click", () => {
            document.getElementById(`position-${i}`).classList.add("mark-checked")

            check(document.getElementById(`position-${i}`).innerHTML)
        })
        let randomPosition= [
            randomArrayIndex(allowedWidht[i]),
            randomArrayIndex(allowedHeight[i])
        ]
        positions.push(randomPosition)
        allowedWidht.push(allowedPositions(positions[i][0], allowedWidht[i]))
        allowedHeight.push(allowedPositions(positions[i][1], allowedHeight[i]))
        gameButtons[i].style.transform =`translate(${ positions[i][0] }px,${ positions[i][1] }px)`; 
    }

}


// function checkResult(gameButtons) {
//     for (let i = 0; i < gameButtons.length; i++) {
//         document.getElementById(`position-${i}`).addEventListener("click", () => {
//             document.getElementById(`position-${i}`).classList.add("mark-checked")
//         })
        //     userArray.push(document.getElementById(`position-${i}`).innerHTML)
        //     const result = compareArrays(userArray, resultArray)
        //     const lenght = compareLenght(userArray, resultArray)
        //     console.log(result, 'result')
        //     if(result && lenght) {
        //         openModal(gameButtons)
        //     }
        //     if(!result) {
        //         refreshGame(gameButtons)
        //     }
        // })
    // }
// }
function compareLenght(userArray, resultArray) {
    return userArray.length === resultArray.length ? true : false
}

function compareArrays(userArray, resultArray) {
    const index = userArray.length
    resultArray = resultArray.slice(0, index)
    return JSON.stringify(userArray) === JSON.stringify(resultArray) ? true : false
}

function getRandomNumber(min, max) {
    const define = max - min + 1
    const generate = Math.random() * define
    return Math.floor(generate) + min
}

function createArrayOfNumbers(start, end) {
    let arr = []
    for (let i = start; i <= end; i++) {
        arr.push(i)
    }
    return arr
}

function randomArrayIndex(array) {
    let index = getRandomNumber(0, array.length)
    return array[index]
}

function allowedPositions(value, array) {
    let notAllowedPositions = []
    for (let i = - 18; i <= 18; i++) {
        notAllowedPositions.push(value + i)
    }
    array = array.filter(( el ) => {
        return notAllowedPositions.indexOf( el ) < 0
    })
    return array
}

function isMobile() {
    return window.innerWidth < 480 ? true : false
}

