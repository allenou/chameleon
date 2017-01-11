const canvas = document.querySelector('#canvas')
const context = canvas.getContext('2d')
const map = {
    width: 500,
    height: 500,
    backgroundColor: '#000'
}
canvas.setAttribute('width', map.width)
canvas.setAttribute('height', map.height)
canvas.fillStyle = map.backgroundColor
context.fillRect(0, 0, map.width, map.height)

const rectObj = {

}
const snakeObj = {
    width: '5',
    length:7,
    color: '#fff',
    direction: '',
    speed: 1,
    isCrawl: false,
    width: 10,
    height: 10
}
const foodObj = {
    color: ''
}


let directionOpts = ['top', 'right', 'bottom', 'left']

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
Rect.prototype.draw = function() {
        context.beginPath();
        context.fillStyle = this.color;
        context.rect(this.x, this.y, this.w, this.h);
        context.fill();
        context.stroke();
    }
    /**
     * food
     */
function Food() {
    let coor = {
        x: Math.round(Math.random() * map.width),
        y: Math.round(Math.random() * map.height)
    }
    let i = 0,
        str = ''
    while (i < 3) {
        str += Math.floor((Math.random() * 255)).toString(16)
        i++
    }
    foodObj.color = '#' + str
    this.food = new Rect(coor.x, coor.y, snakeObj.width, snakeObj.height, foodObj.color)
}
Food.prototype.draw = function() {
    this.food.draw()
}
const food = new Food()

    /**
     * snake
     */
function Snake() {
    let snakeRectArray = []
    for (let i = 0; i < snakeObj.length; i++) {
        let rect = new Rect(map.width / 2, i*snakeObj.height, snakeObj.width, snakeObj.height, snakeObj.color)
            // snakeRectArray.push(rect)
        snakeRectArray.splice(0, 0, rect);
    }
    snakeRectArray[0].color = "red"
    this.head = snakeRectArray[0]
    this.snakeRectArray = snakeRectArray
    this.direction = 40 //up:38 right:39 down:40 left:37
}
Snake.prototype.draw = function() {
    for (let i = 0; i < snakeObj.length; i++) {
        this.snakeRectArray[i].draw()
    }
    console.log(this.head.x)
    console.log(this.head.y)

}
Snake.prototype.crawl = function() {
    let rect = new Rect(this.head.x, this.head.y, this.head.w, this.head.h, snakeObj.color)
    this.snakeRectArray.splice(1, 0, rect)
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
            this.head.y += this.head.y
            break
        default:
            break
    }
}
const snake = new Snake()
snake.draw()
const crawling = requestAnimationFrame(function() {
    context.clearRect(0, 0, map.width, map.height)
    food.draw()
    snake.crawl()
    snake.draw()
}, canvas)

//
//         init() {
//
//             // // init plce style
//             //
//             // // random snake coor
//             // snake.headX = this.randomCoor().x
//             // snake.headY = this.randomCoor().y
//             //
//             // //random snake direction
//             // snake.direction = directionOpts[Math.round(Math.abs(Math.random() * directionOpts.length - 1))]
//             //     // init snake length
//             // let direction = snake.direction
//             // if (direction == 'top') {
//             //     snake.tailX = snake.headX
//             //     snake.tailY = snake.headY - snake.length
//             // } else if (direction == 'right') {
//             //     snake.tailX = snake.headX - snake.length
//             //     snake.tailY = snake.headY
//             // } else if (direction == 'bottom') {
//             //     snake.tailX = snake.headX
//             //     snake.tailY = snake.headY + snake.length
//             // } else {
//             //     snake.tailX = snake.headX + snake.length
//             //     snake.tailY = snake.headY
//             // }
//             // // console.log('headX:' + snake.headX + 'headY:' + snake.headY + 'tailX:' + snake.tailX + 'tailY:' + snake.tailY)
//             // game.drawSnake(snake.headX, snake.headY, snake.tailX, snake.tailY)
//         },
//         randomCoor() {
//             let coor = {
//                 x: Math.round(Math.random() * map.width),
//                 y: Math.round(Math.random() * map.height)
//             }
//             return coor
//         },
//         drawSnake(headX, headY, tailX, tailY) {
//             canvas.fillStyle = map.backgroundColor
//             context.fillRect(0, 0, map.width, map.height)
//             context.lineWidth = snake.width
//             context.strokeStyle = snake.color
//             context.moveTo(headX, headY)
//             context.lineTo(tailX, tailY)
//             context.stroke()
//         },
//         crawl() {
//             context.clearRect(0, 0, map.width, map.height)
//             canvas.width = canvas.width
//             let direction = snake.direction
//             console.log('direction:' + direction)
//             let speed = snake.speed
//             if (direction == 'top') {
//                 snake.headX = snake.headX
//                 snake.headY -= speed
//                 snake.tailX = snake.headX
//                 snake.tailY -= speed
//
//             } else if (direction == 'right') {
//                 snake.headX += speed
//                 snake.headY = snake.headY
//                 snake.tailX += speed
//                 snake.tailY = snake.headY
//             } else if (direction == 'bottom') {
//                 snake.headX = snake.headX
//                 snake.headY += speed
//                 snake.tailX = snake.headX
//                 snake.tailY += speed
//             } else {
//                 snake.headX -= speed
//                 snake.headY = snake.headY
//                 snake.tailX -= speed
//                 snake.tailY = snake.headY
//             }
//             // console.log('headX:' + snake.headX + 'headY:' + snake.headY + 'tailX:' + snake.tailX + 'tailY:' + snake.tailY)
//             game.drawSnake(snake.headX, snake.headY, snake.tailX, snake.tailY)
//             game.collisionDetection()
//             crawling = requestAnimationFrame(game.crawl, canvas)
//         },
//         collisionDetection() {
//             if (snake.headX === 0 || snake.headX === map.width || snake.tailY === 0 || snake.tailY === map.height) {
//                 alert('game over')
//                 game.init()
//             }
//         },
//         start() {
//             document.addEventListener('keydown', (e) => {
//                 console.log(snake.isCrawl)
//                 if (e.keyCode === 32) {
//                     if (snake.isCrawl) {
//                         snake.isCrawl = false
//                         console.log('cancel')
//                         window.cancelAnimationFrame(crawling);
//                         console.log(crawling)
//                     } else {
//                         snake.isCrawl = true
//                         crawling = requestAnimationFrame(game.crawl, canvas)
//                     }
//                 }
//             })
//         }
//     }
// }())
// // game.init()
// // game.start()
