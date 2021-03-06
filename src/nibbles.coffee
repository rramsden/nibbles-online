RED = 'rgb(255, 0, 0)'
BLUE = 'rgb(0, 255, 0)'
WHITE = 'rgb(255,255,255)'
BLACK = 'rgb(0,0,0)'
COLORS = [RED, BLUE, BLACK]

RANDOM_COLOR = (-> COLORS[Math.floor(Math.random()*COLORS.length)] )()
RANDOM_X = (-> Math.floor(Math.random()*(600/10)))() # use a global instead
RANDOM_Y = (-> Math.floor(Math.random()*(400/10)))()

EMPTY = 0
SNAKE = 1
ITEM = 2

UP = 0
DOWN = 1
LEFT = 2
RIGHT = 3

class Nibbles

  constructor: (@width, @height) ->
    @snakes = {}
    @items = []
    window.addEventListener('keyup', domingo.onKeyUp, false)
    window.addEventListener('keydown', domingo.onKeyDown, false)
   
    @board = []
    for i in [0..Math.floor(@width/10)]
      @board[i] = []
      for j in [0..Math.floor(@height/10)]
        @board[i][j] = EMPTY
        if Math.floor(Math.random()*100 > 90)
          @board[i][j] = ITEM
          @items.push [i,j]
    
    domingo.game.create(@width, @height)
    this.draw_items()

  collide: (x, y) ->
    @board[x][y] == SNAKE

  item: (x, y) ->
    @board[x][y] == ITEM

  draw_items: ->
    for item in @items
      domingo.canvas.fillStyle = "rgb(#{Math.floor(Math.random()*255)}, #{Math.floor(Math.random()*255)}, #{Math.floor(Math.random()*255)})"
      domingo.canvas.fillRect(item[0]*10, item[1]*10, 10, 10)

  handle_packet: (packet) ->
    for opcode, data of packet
      console.log "[NIBBLES] : received #{opcode}"
      
      switch opcode
        # we will add main player to the game only
        # when we have received a response from the server
        when 'welcome'
          console.log "[NIBBLES] : server local time is #{data['time']}"
          player = new Snake(RANDOM_COLOR, @board, RANDOM_X, RANDOM_Y)
          @snakes[data['id']] = player
          controller = {
            up:    (->
              domingo.network.send({move: {direction: UP, x: player.x, y: player.y, timestamp: new Date().getTime()}}) if player.direction != UP 
              player.direction = UP
            ),
            down:  (-> 
              domingo.network.send({move: {direction: DOWN, x: player.x, y: player.y, timestamp: new Date().getTime()}}) if player.direction != DOWN
              player.direction = DOWN
            ),
            left:  (-> 
              domingo.network.send({move: {direction: LEFT, x: player.x, y: player.y, timestamp: new Date().getTime()}}) if player.direction != LEFT
              player.direction = LEFT
            ),
            right: (-> 
              domingo.network.send({move: {direction: RIGHT, x: player.x, y: player.y, timestamp: new Date().getTime()}}) if player.direction != RIGHT
              player.direction = RIGHT
            )
          }
          domingo.addController(controller)
          domingo.network.send({join: {x: player.x, y: player.y, direction: player.direction, timestamp: new Date().getTime()}})
        when 'join'
          console.log "[NIBBLES] : player #{data['id']} joined the game"
          console.log data
          snake = new Snake(RANDOM_COLOR, @board, data['x'], data['y'])
          snake.direction = data['direction']
          @snakes[data['id']] = snake
        when 'move'
          @snakes[data['id']].direction = data['direction']
        when 'remove'
          @snakes[data['id']].die()
        else
          console.log "[NIBBLES] : unknown opcode #{opcode}"
   
  # the main game loop
  update: -> 
    domingo.updateController()
    for i, snake of @snakes
      snake.update()
      delete @snakes[i] if snake.dead
  
class Snake

  constructor: (@color, @board, @x, @y) ->
    @dead = false
    @size = 5
    @body = []
    @clear = []
    @direction = 1

  draw: ->
    domingo.canvas.fillStyle = @color
    domingo.canvas.fillRect(@x*10, @y*10, 10, 10)
      
  # better clean up after itself
  flush: ([x,y]) ->
    domingo.canvas.fillStyle = WHITE
    domingo.canvas.fillRect(x*10, y*10, 10, 10)
    @board[x][y] = EMPTY

  collide: ->
    if @board[@x][@y] == SNAKE
      this.die()
    return @dead

  die: ->
    @dead = true
    for [x, y] in @body
      domingo.canvas.fillStyle = WHITE
      domingo.canvas.fillRect(x*10, y*10, 10, 10)
      @board[x][y] = EMPTY

  update: ->
    return if @dead == true

    @x = (@x + (domingo.game.width/10)) % (domingo.game.width/10)
    @y = (@y + (domingo.game.height/10)) % (domingo.game.height/10)
    this.draw()
    this.flush(@body.shift()) if @body.length == @size
    @size++ if @board[@x][@y] == ITEM
    @body.push [@x,@y]
    
    switch @direction
      when UP
        @board[@x][@y--] = 1 unless this.collide()
      when DOWN
        @board[@x][@y++] = 1 unless this.collide()
      when LEFT
        @board[@x--][@y] = 1 unless this.collide()
      when RIGHT
        @board[@x++][@y] = 1 unless this.collide()

# exports
$().ready -> 
  domingo.nibbles = new Nibbles(600, 400)
  domingo.network.create('localhost', '5678')
  
  # this looks a bit weird, when we set a callback we need to preserve the nibbles scope so
  # the value of `this` doesnt change so we pass the packet handler function an anonymous function
  domingo.network.setHandler( ((packet) -> domingo.nibbles.handle_packet(packet)) )
  setInterval (-> domingo.nibbles.update()), 80
