const canvas = document.querySelector('#canvas')
const context = canvas.getContext('2d')

const mapObj = {
    width: 800,
    height: 500,
    color: '#fff'
}
const rectObj = {
    size: 20
}
const snakeObj = {
    length: 5,
    color: '#232323',
    direction: '',
    speed: 4,
    crawling: false,
    eated: false
}

const foodObj = {
    color: '',
    coorArr: []
}


const colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#009688', '#4caf50', '#ff9800', '#ff5722']

/**
 * @method random
 * @description return a random number
 * @param {Number} maxVal :max value
 */
function random(maxVal) {
    return Math.ceil(Math.random() * maxVal)
}

/**
 * @method randomCoor
 * @description return a random coor
 * @param {Number} maxVal :max value
 */
function randomCoor(maxVal, divisor) {
    let coorArr = []
    for (let i = divisor; i < maxVal; i++) {
        Number.isInteger(i / divisor) && coorArr.push(i)
    }
    return coorArr[random(coorArr.length - 1)]
}

/**
 * map
 */
function drawMap() {
    canvas.setAttribute('width', mapObj.width)
    canvas.setAttribute('height', mapObj.height)
    context.fillStyle = mapObj.color
    context.fill()
}


/**
 * rect
 */
function Rect(x, y, w, h, color) {
    this.x = x
    this.y = y
    this.w = w
    this.h = h
    this.color = color
}

Rect.prototype = {
    draw() {
        context.beginPath();
        context.fillStyle = this.color;
        context.rect(this.x, this.y, this.w, this.h)
        context.fill();
        // context.stroke();
    }
}

/**
 * food
 */
let food

function Food() {
    let size = rectObj.size
    let coorX = randomCoor(mapObj.width, size)
    let coorY = randomCoor(mapObj.height, size)

    foodObj.color = colors[random(colors.length - 1)] //get food's random color in colors array

    this.coorX = coorX
    this.coorY = coorY
    this.food = new Rect(this.coorX, this.coorY, size, size, foodObj.color)
}

Food.prototype = {
    draw() {
        this.food.draw()
    }
}

food = new Food()

/**
 * snake
 */

let snake
let crawlID

function Snake() {
    let snakeRectArray = []

    for (let i = 0; i < snakeObj.length; i++) {
        let rect = new Rect(mapObj.width / 2, i * rectObj.size, rectObj.size, rectObj.size, snakeObj.color)
        snakeRectArray.splice(0, 0, rect); //add from scratch
    }

    snakeRectArray[0].color = "red"

    this.head = snakeRectArray[0]
    this.snakeRectArray = snakeRectArray

    this.direction = 40 //Init snake crawl direction [up:38 right:39 down:40 left:37]
}

Snake.prototype = {
    draw() {
        context.clearRect(0, 0, mapObj.width, mapObj.height)
        drawMap()
        food.draw()

        let snakeRectArray = this.snakeRectArray
        for (let i = 0; i < snakeRectArray.length; i++) {
            snakeRectArray[i].draw()
        }
    },
    crawl() {
        // handle game over
        if (this.head.x >= mapObj.width || this.head.x < 0 || this.head.y >= mapObj.height || this.head.y < 0) {
            snakeObj.crawling = false
            cancelAnimationFrame(crawlID)

            alert('game over')

            //restart game
            food = new Food()
            snake = new Snake()
            food.draw()
            snake.draw()
            return
        }

        snakeObj.color = snakeObj.eated && foodObj.color ? foodObj.color : snakeObj.color

        let rect = new Rect(this.head.x, this.head.y, rectObj.size, rectObj.size, snakeObj.color)
        this.snakeRectArray.splice(1, 0, rect)
        this.snakeRectArray.pop()

        switch (this.direction) { // up:38 right:39 down:40 left:37
            case 37:
                this.head.x -= this.head.w
                break
            case 38:
                this.head.y -= this.head.h
                break
            case 39:
                this.head.x += this.head.w
                break
            case 40:
                this.head.y += this.head.h
                break
        }

        this.draw()
        this.eat()
    },
    eat() {
        if (this.head.x === food.coorX && this.head.y === food.coorY) {
            snakeObj.eated = true
            let rect = new Rect(food.coorX, food.coorY, this.head.w, this.head.h, foodObj.color)
            this.snakeRectArray.push(rect)


            this.crawl()
            food = new Food()
            food.draw()
        }
    }
}

let elapsed, then = 0
let fpsInterval = 1000 / snakeObj.speed

/**
 * handle crawl
 */
function handleCrawl(now) {
    if (snakeObj.crawling) {
        now = Date.now();　　
        elapsed = now - then
        if (elapsed > fpsInterval) {
            then = now - (elapsed % fpsInterval);
            snake.crawl()
        }
        requestAnimationFrame(handleCrawl)
    }
}


//init game
snake = new Snake()
snake.draw()


/*
 *listen keyword
 */
document.addEventListener('keydown', (e) => {
    // control the snake crawl or stop
    if (e.keyCode === 32) {
        if (snakeObj.crawling) {
            snakeObj.crawling = false
            cancelAnimationFrame(crawlID)
        } else {
            snakeObj.crawling = true
            requestAnimationFrame(handleCrawl)
        }
    }

    // control the snake crawl direction
    // up:38 right:39 down:40 left:37
    switch (e.keyCode) {
        case 37:
            if (snake.direction !== 39)
                snake.direction = 37
            break
        case 38:
            if (snake.direction !== 40)
                snake.direction = 38
            break
        case 39:
            if (snake.direction !== 37)
                snake.direction = 39
            break
        case 40:
            if (snake.direction !== 38)
                snake.direction = 40
            break
    }
    e.preventDefault()
})