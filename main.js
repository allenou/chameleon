let game = (function() {
    let canvas = document.querySelector('#canvas')
    let context = canvas.getContext('2d')

    let place = {
        width: 500,
        height: 500,
        backgroundColor: '#000'
    }

    let snake = {
        width: '5',
        length: 50,
        color: '#fff',
        headX: 0,
        headY: 0,
        tailX: 0,
        tailY: 0,
        direction: '',
        speed: 1,
        isCrawl: false
    }
    let food = {
        width: '5',
        length: 10,
        color: '#fff'
    }
    let crawling
    let directionOpts = ['top', 'right', 'bottom', 'left']
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
            snake.direction = directionOpts[Math.round(Math.abs(Math.random() * directionOpts.length - 1))]
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
            // console.log('headX:' + snake.headX + 'headY:' + snake.headY + 'tailX:' + snake.tailX + 'tailY:' + snake.tailY)
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
            let speed = snake.speed
            if (direction == 'top') {
                snake.headX = snake.headX
                snake.headY -= speed
                snake.tailX = snake.headX
                snake.tailY -= speed

            } else if (direction == 'right') {
                snake.headX += speed
                snake.headY = snake.headY
                snake.tailX += speed
                snake.tailY = snake.headY
            } else if (direction == 'bottom') {
                snake.headX = snake.headX
                snake.headY += speed
                snake.tailX = snake.headX
                snake.tailY += speed
            } else {
                snake.headX -= speed
                snake.headY = snake.headY
                snake.tailX -= speed
                snake.tailY = snake.headY
            }
            // console.log('headX:' + snake.headX + 'headY:' + snake.headY + 'tailX:' + snake.tailX + 'tailY:' + snake.tailY)
            game.drawSnake(snake.headX, snake.headY, snake.tailX, snake.tailY)
            game.collisionDetection()
            crawling = requestAnimationFrame(game.crawl, canvas)
        },
        collisionDetection() {
            if (snake.headX === 0 || snake.headX === place.width || snake.tailY === 0 || snake.tailY === place.height) {
                alert('game over')
                game.init()
            }
        },
        start() {
            document.addEventListener('keydown', (e) => {
                console.log(snake.isCrawl)
                if (e.keyCode === 32) {
                    if (snake.isCrawl) {
                        snake.isCrawl = false
                        console.log('cancel')
                        window.cancelAnimationFrame(crawling);
                        console.log(crawling)
                    } else {
                        snake.isCrawl = true
                        crawling = requestAnimationFrame(game.crawl, canvas)
                    }
                }
            })
        }
    }
}())
game.init()
game.start()
