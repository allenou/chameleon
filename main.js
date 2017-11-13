/**
 * @method random
 * @description return a random number
 * @param {Number} maxVal :max value
 */
function random(maxVal) {
    return Math.ceil(Math.random() * maxVal)
}

const canvas = document.querySelector('#canvas')
const context = canvas.getContext('2d')

const mapObj = {
    width: 1000,
    height: 800,
    color: '#fff'
}
const rectObj = {
    width: 20,
    height: 20,
}
const snakeObj = {
    length: 7,
    color: '#ffffff',
    direction: '',
    speed: 4,
    crawling: false
}

const foodObj = {
    color: ''
}

const colors = ['#B71C1C', '#880E4F', '#4A148C', '#311B92', '#1A237E', '#0D47A1', '#01579B',
    '#006064', '#004D40', '#1B5E20', '#33691E', '#827717', '#F57F17', '#FF6F00',
    '#E65100', '#BF360C', '#3E2723', '#212121', '#263238'
]

const directionOpts = ['top', 'right', 'bottom', 'left']


/**
 * map
 */
function drawMap() {
    canvas.setAttribute('width', mapObj.width)
    canvas.setAttribute('height', mapObj.height)
    context.fillStyle = mapObj.color
    context.fill()
        // context.fillRect(0, 0, mapObj.width, mapObj.height)
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
        context.stroke();
    }
}

/**
 * food
 */
let food

function Food() {
    let randomCoorX = random(mapObj.width)
    let randomCoorY = random(mapObj.height)
    let randomIndex = random(colors.length)

    foodObj.color = colors[randomIndex] //get food's random color in colors array

    this.coorX = randomCoorX
    this.coorY = randomCoorY
    this.food = new Rect(this.coorX, this.coorY, rectObj.width, rectObj.height, foodObj.color)
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
        let rect = new Rect(mapObj.width / 2, i * rectObj.height, rectObj.width, rectObj.height, snakeObj.color)
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

        for (let i = 0; i < snakeObj.length; i++) {
            this.snakeRectArray[i].draw()
        }
    },
    crawl() {

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

        let rect = new Rect(this.head.x, this.head.y, this.head.w, this.head.h, snakeObj.color)
        this.snakeRectArray.splice(1, 0, rect)
        this.snakeRectArray.pop()

        switch (this.direction) { //up:38 right:39 down:40 left:37
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
        console.log('x' + this.head.x, food.coorX)
        console.log('y' + this.head.y, food.coorY)
        if (this.head.x === food.coorX && this.head.y === food.coorY) {
            alert('eat')
        }
    }
}

let elapsed, then = 0
let fpsInterval = 1000 / snakeObj.speed

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
            console.log('stop')
            snakeObj.crawling = false
            cancelAnimationFrame(crawlID)
        } else {
            snakeObj.crawling = true
            console.log('crawling')
            requestAnimationFrame(handleCrawl)
        }
    }

    // control the snake crawl direction
    switch (e.keyCode) {
        //up:38 right:39 down:40 left:37
        case 37:
            if (snake.direction !== 39) {
                snake.direction = 37
            }
            break
        case 38:
            if (snake.direction !== 40) {
                snake.direction = 38
            }
            break
        case 39:
            if (snake.direction !== 37) {
                snake.direction = 39
            }
            break
        case 40:
            if (snake.direction !== 38) {
                snake.direction = 40
            }
            break
    }
    e.preventDefault()
})