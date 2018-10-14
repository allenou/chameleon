var game = (function() {
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
        length: 5,
        color: '#232323',
        direction: 83, //Init snake crawl direction [up:87 right:68 down:83 left:65]
        speed: 4,
        isCrawl: false,
        isEat: false,
        body: [],
        headColors:['red']
    }

    var foodObj = {
        color: '',
        coorArr: []
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

    function Map() {}
    Map.prototype = {
        draw() {
            canvas.setAttribute('width', mapObj.width)
            canvas.setAttribute('height', mapObj.height)
            context.fillStyle = mapObj.color
            context.fill()
        },
        clear() {
            context.clearRect(0, 0, mapObj.width, mapObj.height)
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
        var coorX = randomCoor(mapObj.width, size)
        var coorY = randomCoor(mapObj.height, size)

        foodObj.color = random(colors) //get food's random color in colors array

        this.coorX = coorX
        this.coorY = coorY
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

    /**
     * @description
     * @param {Object} head snake head
     */
    function isHitWall(head) {
        // console.log(head)
        if (head.x >= mapObj.width || head.x < 0 || head.y >= mapObj.height || head.y < 0) return true
    }

    /**
     * @description
     * @param {Object} body snake body
     */
    function isHitSelf(body) {
        var head = body[0]
        // console.log(head)
        for (var i = 1; i < body.length; i++) {
            if (head.x === body[i].x && head.y === body[i].y) return true
        }
    }

    function isEat(head, food) {

        if (head.x === food.coorX && head.y === food.coorY) {
            return true
        }
    }

    function Snake() {
        var body = []
        for (var i = 0; i < snakeObj.length; i++) {
            var rect = new Rect(mapObj.width / 2, i * rectObj.size, rectObj.size, rectObj.size, snakeObj.color)
            body.splice(0, 0, rect); //add from scratch
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
        /**
         * handle snake crawl
         */
        crawl() {
            var body = this.body
            var head = this.head

            // handle special
            if (isHitWall(head) || isHitSelf(body)) {
                snakeObj.isCrawl = false
                cancelAnimationFrame(crawlID)

                alert('game over')

                //restart game
                food = new Food()
                food.draw()
                snake = new Snake()
            
                snake.draw()
                return
            }



            // snakeObj.color =  foodObj.color 

            var rect = new Rect(head.x, head.y, rectObj.size, rectObj.size, snakeObj.color)
            body.splice(1, 0, rect)
            body.pop()

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
            if (isEat(head, food)===true) {
                snakeObj.isEat = true
                snakeObj.headColors.push(foodObj.color)
                this.head.color = snakeObj.headColors[0]  // set the color of the head to the color of the previous body
                snakeObj.color = snakeObj.headColors[1]
                snakeObj.headColors.splice(0,1)
                  this.crawl()
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
    var fpsInterval = 1000 / snakeObj.speed

    function handleCrawl(now) {
        if (snakeObj.isCrawl) {
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
        play: function() {
            // listen keywordlisten keyword
            document.addEventListener('keydown', (e) => {
                // control the snake crawl or stop
                if (e.keyCode === 32) {
                    if (snakeObj.isCrawl) {
                        snakeObj.isCrawl = false
                        cancelAnimationFrame(crawlID)
                    } else {
                        snakeObj.isCrawl = true
                        requestAnimationFrame(handleCrawl)
                    }
                }

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
            })
        }
    }
}())

game.play()