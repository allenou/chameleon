var game = (function() {
    var canvas = document.querySelector('#canvas')
    var context = canvas.getContext('2d')

    var place = {
        width: 500,
        height: 500,
        backgroundColor: '#000'
    }

    var snake = {
        width: '5',
        length: 50,
        color: '#fff',
        headX: 0,
        headY: 0,
        tailX: 0,
        tailY: 0,
        direction: '',
        crawlSpeed: 10,
        isCrawl:false
    }
    var food = {
        width: '5',
        length: 10,
        color: '#fff'
    }
    var directionOpts = ['top', 'right', 'bottom', 'left']
    return {
        init() {
            // init plce style
            canvas.setAttribute('width', place.width)
            canvas.setAttribute('height', place.height)
            canvas.fillStyle = place.backgroundColor
            context.fillRect(0, 0, place.width, place.height)
                // random snake coor
            snake.headX = this.randomCoor().x
            snake.headY = this.randomCoor().y

            //random snake direction
            snake.direction = directionOpts[Math.round(Math.random() * directionOpts.length)]
                // init snake length
            let direction = snake.direction
            if (direction == 'top') {
                snake.tailX = snake.headX
                snake.tailY = snake.headY - snake.length
            } else if (direction == 'right') {
                snake.tailX = snake.headX - snake.length
                snake.tailY = snake.headY
            } else if (direction == 'bottom') {
                snake.tailX = snake.headX
                snake.tailY = snake.headY + snake.length
            } else {
                snake.tailX = snake.headX + snake.length
                snake.tailY = snake.headY
            }
            game.drawSnake(snake.headX, snake.headY, snake.tailX, snake.tailY)
        },
        randomCoor() {
            let coor = {
                x: Math.round(Math.random() * place.width),
                y: Math.round(Math.random() * place.height)
            }
            return coor
        },
        drawSnake(headX, headY, tailX, tailY) {
            canvas.fillStyle = place.backgroundColor
            context.fillRect(0, 0, place.width, place.height)
            context.lineWidth = snake.width
            context.strokeStyle = snake.color
            context.moveTo(headX, headY)
            context.lineTo(tailX, tailY)
            context.stroke()
        },
        crawl() {
            context.clearRect(0, 0, place.width, place.height)
            canvas.width = canvas.width
            let direction = snake.direction
            console.log('direction:' + direction)
            if (direction == 'top') {
                snake.headX = snake.headX
                snake.headY = snake.headY - snake.crawlSpeed
                snake.tailX = snake.headX
                snake.tailY = snake.headY - snake.crawlSpeed

            } else if (direction == 'right') {
                snake.headX = snake.headX + snake.crawlSpeed
                snake.headY = snake.headY
                snake.tailX = snake.headX + snake.crawlSpeed
                snake.tailY = snake.headY
            } else if (direction == 'bottom') {
                snake.headX = snake.headX
                snake.headY = snake.headY + snake.crawlSpeed
                snake.tailX = snake.headX
                snake.tailY = snake.headY + snake.crawlSpeed
            } else {
                snake.headX = snake.headX - snake.crawlSpeed
                snake.headY = snake.headY
                snake.tailX = snake.headX - snake.crawlSpeed
                snake.tailY = snake.headY
            }
            game.drawSnake(snake.headX, snake.headY, snake.tailX, snake.tailY)
        },
        start() {
            let crawling
            document.addEventListener('keydown', (e) => {
                if (e.keyCode === 32) {
                    if (snake.isCrawl) {
                        snake.isCrawl = false
                        clearInterval(crawling)
                    } else {
                        snake.isCrawl = true
                        crawling = setInterval(this.crawl, 1000)
                    }
                }
            })
        }
    }
}())
game.init()
game.start()
