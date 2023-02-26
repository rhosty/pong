let canvas = document.getElementById('canvas');
let ctx = canvas.getContext("2d");
let direction = 1;
let scorePlayerOne = 0;
let scorePLayertwo = 0;
let scoreArray = [scorePlayerOne, scorePLayertwo]
let scoreUpdated = false;
let randomNumber = 0;
let isGameStarted = false;
let buttons = document.querySelectorAll('button');
let isPlayerTwoPlaying = false;
let playerXCoordinate = 250;
let targetPlayerXCoordinate = playerXCoordinate;




//eventlistener
canvas.addEventListener('mousemove', animatePlayerOne)
canvas.addEventListener('click', animateBall)
canvas.addEventListener('click', getRandomDirection)

function resize() {
    ctx.canvas.width = 600;
    ctx.canvas.height = 600;
}
resize();
fetchFromLocalStorage()

// creates counters for the score 
function displayScore() {
    ctx.fillStyle = "green";
    ctx.font = "bold 24px Arial";
    ctx.fillText(scoreArray[1], 50, 250);

    ctx.fillStyle = "red";
    ctx.font = "bold 24px Arial";
    ctx.fillText(scoreArray[0], 50, 350);
}

function saveScoreToLocalStorage() {
    localStorage.setItem('score', JSON.stringify(scoreArray));
}

function fetchFromLocalStorage() {
    scoreArray = JSON.parse(localStorage.getItem('score'));
    if (scoreArray === null || scoreArray === undefined) {
        scoreArray = [0, 0]
    }
}

class Element {
    constructor(options) {
        this.x = options.x
        this.y = options.y
        this.width = options.width
        this.height = options.height
        this.color = options.color
        this.gravity = options.gravity

    }
}

const playerOne = new Element({
    x: 250,
    y: 550,
    width: 100,
    height: 20,
    color: '#454B1B',
})

const playerTwo = new Element({
    x: 250,
    y: 25,
    width: 100,
    height: 20,
    color: '#454B1B',
})

const ball = new Element({
    x: 290,
    y: 290,
    width: 20,
    height: 20,
    color: '#454B1B',
    gravity: 5,
})

function updatePlayerScore() {
    if (ball.y < 20 && !scoreUpdated) {
        scoreArray[0]++;
        scoreUpdated = true;
    } else if (ball.y > 550 && !scoreUpdated) {
        scoreArray[1]++;
        scoreUpdated = true;
    }
}


function drawElement(element) {
    ctx.fillStyle = element.color;
    ctx.fillRect(element.x, element.y, element.width, element.height);
}

function drawElements() {
    drawElement(playerOne)
    drawElement(playerTwo)
    drawElement(ball)
    displayScore()
}

//select player or computer
function selectPlayer() {
    buttons.forEach((button) => {
        button.addEventListener('click', function() {
                this.classList.toggle('active')
                if (this.textContent == "Player Two") {
                    isPlayerTwoPlaying = true;
                }
            }

        )
    })
}
selectPlayer();



//function that animates playerOne
function animatePlayerOne(e) {
    playerOne.x = e.layerX;
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    drawElements()
}

function animatePlayerTwo() {
    if (isPlayerTwoPlaying == false) {
        if (ball.x < 500) {
            playerTwo.x = (ball.width / 2) + (ball.x - (playerTwo.width / 2) + randomNumber);
        } else if (ball.x > 500) {
            playerTwo.x = 500;
        }
    } else {
        requestAnimationFrame(animatePlayerTwo);
        const distance = targetPlayerXCoordinate - playerTwo.x;
        const step = distance / 100;
        playerTwo.x += step;
    }
}

//animate ball up and down
function animateBall() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ball.y += (ball.gravity);
    if (ball.y >= playerOne.y &&
        ball.x + (ball.width / 2) > playerOne.x &&
        ball.x + (ball.width / 2) > playerOne.x - playerOne.width && ball.x <= playerOne.x + playerOne.width) {
        window.requestAnimationFrame(getNewBallX);
        ball.y = playerOne.y - ball.height
        ball.gravity *= -1.05;

    } else if (ball.y <= playerTwo.y &&
        ball.x + (ball.width / 2) > playerTwo.x &&
        ball.x + (ball.width / 2) > playerTwo.x - playerTwo.width && ball.x <= playerTwo.x + playerTwo.width) {
        ball.y = playerTwo.y + ball.height
        ball.gravity *= -1
    }
    drawElements();
    requestAnimationFrame(animateBall);
    saveScoreToLocalStorage()
    updatePlayerScore()
    resetWindow()
}

function getNewBallX() {

    ball.x = ball.x + (1 * plusOrMinus);
    requestAnimationFrame(getNewBallX)
    if (ball.x == 599) {
        ball.x = 598;
        plusOrMinus *= -1;
    } else if (ball.x == 1) {
        ball.x = 2;
        plusOrMinus *= -1;
    }
    animatePlayerTwo()

}

// determines if playertwo will return the ball or not
function getRandomNummber() {
    randomNumber = Math.random() * 100 - 30;
    randomNumber * (Math.random() < 0.5 ? -1 : 1);
}

function getRandomDirection() {
    if (isGameStarted == false) {
        plusOrMinus = Math.random() < 0.5 ? -1 : 1;
        isGameStarted = true;
    }


}
// reset window
function resetWindow() {
    if (ball.y > 600 || ball.y < -1) {
        window.location.reload();
    }
}
drawElements()

document.onkeydown = (e) => {
    e = e || window.event;
    if (e.keyCode === 37) {
        targetPlayerXCoordinate -= 20;
    } else if (e.keyCode === 39) {
        targetPlayerXCoordinate += 20;
    }
};