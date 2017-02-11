const canvas = document.querySelector('#canvas')
const context = canvas.getContext('2d')

const mapObj = {
    width: 500,
    height: 500,
    backgroundColor: '#000'
}
const snakeObj = {
    length: 7,
    color: '#fff',
    direction: '',
    speed: 1,
    width: 10,
    height: 10,
    crawling: false
}
const foodObj = {
    color: ''
}
let crawlID, gameOver

function drawMap() {
    canvas.setAttribute('width', mapObj.width)
    canvas.setAttribute('height', mapObj.height)
    canvas.fillStyle = mapObj.backgroundColor
    context.fillRect(0, 0, mapObj.width, mapObj.height)
}


const directionOpts = ['top', 'right', 'bottom', 'left']

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
        context.rect(this.x, this.y, this.w, this.h);
        context.fill();
        context.stroke();
    }
}
/**
 * food
 */
function Food() {
    let random = Math.random()
    let coorX = Math.round(random * mapObj.width)
    let coorY = Math.round(random * mapObj.height)

    let i = 0,
        str = ''
    while (i < 3) {
        str += Math.floor(random * 255).toString(16)
        i++
    }
    foodObj.color = '#' + str
    this.food = new Rect(coorX, coorY, snakeObj.width, snakeObj.height, foodObj.color)
}
Food.prototype = {
    draw() {
        this.food.draw()
    }
}

/**
 * snake
 */
function Snake() {
    let snakeRectArray = []
    for (let i = 0; i < snakeObj.length; i++) {
        let rect = new Rect(mapObj.width / 2, i * snakeObj.height, snakeObj.width, snakeObj.height, snakeObj.color)
        // snakeRectArray.push(rect)
        snakeRectArray.splice(0, 0, rect);
    }
    snakeRectArray[0].color = "red"
    this.head = snakeRectArray[0]
    this.snakeRectArray = snakeRectArray
    this.direction = 40 //Init snake crawl direction [up:38 right:39 down:40 left:37]
}
Snake.prototype = {
    draw() {
        for (let i = 0; i < snakeObj.length; i++) {
            this.snakeRectArray[i].draw()
        }
        // console.log('x' + this.head.x)
        // console.log('y' + this.head.y)
    },
    crawl() {
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
            default:
                break
        }


        if (this.head.x >= mapObj.width || this.head.x < 0 || this.head.y >= mapObj.height || this.head.y < 0) {
            // gameOver = confirm('game over')
            // if (gameOver) {
            //     snakeObj.crawling = false
            //     cancelAnimationFrame(crawlID)
            //     food.draw()
            // }
            snakeObj.crawling = false
            cancelAnimationFrame(crawlID)
        }
    }
}

function handleCrawl() {
    let fps = 30,
        now, then = Date.now(),
        interval = 1000 / fps,
        delta

    if (snakeObj.crawling) {
        requestAnimationFrame(handleCrawl)
    }
    return function() {
        now = Date.now();　　
        delta = now - then;
        if (delta > interval) {
            then = now - (delta % interval);
            context.clearRect(0, 0, mapObj.width, mapObj.height)
            drawMap()
            food.draw()
            snake.crawl()
            snake.draw()
        }
    }
}

const food = new Food()
const snake = new Snake()

function initGame() {
    drawMap()
    food.draw()
    snake.draw()
}
initGame()
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
