var game = (function () {
    var canvas = document.querySelector('#canvas')
    var context = canvas.getContext('2d')

    var mapObj = {
        width: 400,
        height: 300,
        color: '#fff'
    }

    var rectObj = {
        size: 20
    }

    var snakeObj = {
        length: 7,
        color: '#232323',
        direction: 83, //Init snake crawl direction [up:87 right:68 down:83 left:65]
        speed: 4,
        isCrawl: false,
        isEat: false,
        body: [],
        headColors: ['red']
    }

    var foodObj = {
        color: '',
        coorArr: []
    }
    var scoreObj = {
        last: '',
        high: ''
    }


    var colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#009688', '#4caf50', '#ff9800', '#ff5722']


    /**
     * @method random
     * @description return a random result
     * @param {Object} obj a integer or an array
     */
    function random(obj) {
        if (!Array.isArray(obj))
            return Math.ceil(Math.random() * obj)
        else
            return obj[Math.ceil(Math.random() * obj.length - 1)]
    }

    /**
     * @method randomCoor
     * @description return a random coor
     * @param {Number} maxVal :max value
     */
    function randomCoor(maxVal, divisor) {
        var coorArr = []
        for (var i = divisor; i < maxVal; i++) {
            Number.isInteger(i / divisor) && coorArr.push(i)
        }
        return random(coorArr)
    }

    /**
     * map
     */

    function Map() {
        this.width = mapObj.width
        this.height = mapObj.height
        this.color = mapObj.color
    }
    Map.prototype = {
        draw() {
            canvas.setAttribute('width', this.width)
            canvas.setAttribute('height', this.height)
            context.fillStyle = this.color
            context.fill()
        },
        clear() {
            context.clearRect(0, 0, this.width, this.height)
        }
    }
    var map = new Map()

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
        }
    }

    /**
     * food
     */


    function Food() {
        var size = rectObj.size

        foodObj.color = random(colors) //get food's random color in colors array

        this.coorX = randomCoor(mapObj.width, size)
        this.coorY = randomCoor(mapObj.height, size)
        this.food = new Rect(this.coorX, this.coorY, size, size, foodObj.color)
    }

    Food.prototype = {
        draw() {
            this.food.draw()
        }
    }
    var food = new Food()



    /**
     * snake
     */

    var snake
    var crawlID

    function Snake() {
        var body = []
        var size = rectObj.size
        for (var i = 0; i < snakeObj.length; i++) {
            body.splice(0, 0, new Rect(mapObj.width / 2, i * size, size, size, snakeObj.color)); //add from scratch
        }
        this.body = body
        this.head = body[0]
        this.head.color = snakeObj.headColors[0]
    }

    Snake.prototype = {
        /**
         * init game
         */
        draw() {
            map.draw()
            var body = this.body
            for (var i = 0; i < body.length; i++) {
                body[i].draw()
            }
            food.draw()
        },
        isEat() {
            return this.head.x === food.coorX && this.head.y === food.coorY
        },
        isHitWall() {
            return this.head.x >= mapObj.width || this.head.x < 0 || this.head.y >= mapObj.height || this.head.y < 0
        },
        isHitSelf() {
            var body = this.body
            for (var i = 1; i < body.length; i++) {
                if (this.head.x === body[i].x && this.head.y === body[i].y) return true
            }
        },
        /**
         * handle snake crawl
         */
        crawl() {
            // var body = this.body
            var head = this.head

            // handle hit
            if (this.isHitWall() || this.isHitSelf()) {
                snakeObj.isCrawl = false
                cancelAnimationFrame(crawlID)

                alert('game over')

                //restart game
                food = new Food()
                food.draw()
                snake = new Snake()

                snake.draw()
                return false
            }



            // snakeObj.color =  foodObj.color 

            var rect = new Rect(head.x, head.y, rectObj.size, rectObj.size, snakeObj.color)
            this.body.splice(1, 0, rect)
            this.body.pop()

            switch (snakeObj.direction) { // up:87 right:68 down:83 left:65
                case 65:
                    head.x -= head.w
                    break
                case 87:
                    head.y -= head.h
                    break
                case 68:
                    head.x += head.w
                    break
                case 83:
                    head.y += head.h
                    break
            }
            if (this.isEat()) {
                snakeObj.speed += this.body.length * 0.01 // change speed
                console.log(document.querySelector('#score .text'))
                document.querySelector('#score .text').textContent = Math.round(this.body.length * snakeObj.speed)
                map.clear()
                // map.draw()
                snake.draw()
                // snakeObj.isEat = true
                this.body.push(food)

                // change head and body color
                snakeObj.headColors.push(foodObj.color)
                this.head.color = snakeObj.headColors[0]  // set the color of the head to the color of the previous body
                snakeObj.color = snakeObj.headColors[1]
                snakeObj.headColors.splice(0, 1)
                this.crawl()

                // feeding new food
                food = new Food()
                food.draw()


            }
            this.draw()
        }
    }


    //init game
    snake = new Snake()
    snake.draw()


    /**
     * handle crawl speed
     */
    var elapsed, then = 0


    function handleCrawl(now) {
        if (snakeObj.isCrawl) {
            var fpsInterval = 1000 / snakeObj.speed
            now = Date.now();
            elapsed = now - then
            if (elapsed > fpsInterval) {
                then = now - (elapsed % fpsInterval);
                snake.crawl()
            }
            requestAnimationFrame(handleCrawl)
        }
    }




    return {
        play: function () {
            // listen keywordlisten keyword
            document.addEventListener('keydown', (e) => {
                // control the snake crawl or stop
                if (e.keyCode === 32) {
                    snakeObj.isCrawl ? cancelAnimationFrame(crawlID) : requestAnimationFrame(handleCrawl)
                    snakeObj.isCrawl = !snakeObj.isCrawl
                }
                if (snakeObj.isCrawl) {
                    // control the snake crawl direction
                    // up:87 right:68 down:83 left:65
                    switch (e.keyCode) {
                        case 65:
                            if (snakeObj.direction !== 68)
                                snakeObj.direction = 65
                            break
                        case 87:
                            if (snakeObj.direction !== 83)
                                snakeObj.direction = 87
                            break
                        case 68:
                            if (snakeObj.direction !== 65)
                                snakeObj.direction = 68
                            break
                        case 83:
                            if (snakeObj.direction !== 87)
                                snakeObj.direction = 83
                            break
                    }
                    e.preventDefault()
                }
            })
        }
    }
}())

game.play()