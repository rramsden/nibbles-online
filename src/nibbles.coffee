RED = 'rgb(255, 0, 0)'
BLUE = 'rgb(0, 255, 0)'
EMPTY = 0
SNAKE = 1
ITEM = 2

class Nibbles

  constructor: (@width, @height) ->
    @snakes = []
    @items = []
    window.addEventListener('keyup', domingo.onKeyUp, false)
    window.addEventListener('keydown', domingo.onKeyDown, false)
   
    @board = []
    for i in [0..Math.floor(@width/10)]
      @board[i] = []
      for j in [0..Math.floor(@height/10)]
        @board[i][j] = EMPTY
        if Math.floor(Math.random()*100 > 10)
          @board[i][j] = ITEM
          @items.push [i,j]
    
    # set the player up add a controller
    player1 = new Snake(BLUE, 0, 0)
    player1_controller = {
      up:    (-> player1.direction = 0),
      down:  (-> player1.direction = 1),
      left:  (-> player1.direction = 2),
      right: (-> player1.direction = 3)
    }

    player2 = new Snake(RED, 10, 10)
    player2_controller = {
      w: (-> player2.direction = 0),
      s: (-> player2.direction = 1),
      a: (-> player2.direction = 2),
      d: (-> player2.direction = 3)
    }

    domingo.addController(player1_controller)
    domingo.addController(player2_controller)
    @snakes.push player1
    @snakes.push player2
    domingo.game.create(@width, @height)
    this.draw_items()

  collide: (x, y) ->
    @board[x][y] == SNAKE

  item: (x, y) ->
    @board[x][y] == ITEM

  draw_items: ->
    for item in @items
      domingo.game.canvas.fillStyle = "rgb(#{Math.floor(Math.random()*255)}, #{Math.floor(Math.random()*255)}, #{Math.floor(Math.random()*255)})"
      domingo.game.canvas.fillRect(item[0]*10, item[1]*10, 10, 10)

  join: (name, x, y) ->
    @snakes.push new Snake(x, y)
    
  # the main game loop
  update: -> 
    domingo.updateController()
    for i, snake of @snakes
      snake.update(@board)
  
class Snake
  UP = 0
  DOWN = 1
  LEFT = 2
  RIGHT = 3

  constructor: (@color, @x, @y) ->
    @dead = false
    @size = 5
    @body = []
    @clear = []
    @direction = 1

  draw: ->
    canvas = domingo.game.canvas
    canvas.fillStyle = @color
    canvas.fillRect(@x*10, @y*10, 10, 10)
      
  # better clean up after itself
  flush: (coord, board) ->
    canvas = domingo.game.canvas
    canvas.fillStyle = 'rgb(255,255,255)'
    canvas.fillRect(coord[0]*10, coord[1]*10, 10, 10)
    board[coord[0]][coord[1]] = EMPTY

  collide: (board) ->
    @dead = true if board[@x][@y] == SNAKE
    return @dead

  update: (board) ->
    return if @dead == true

    @x = (@x + (domingo.game.width/10)) % (domingo.game.width/10)
    @y = (@y + (domingo.game.height/10)) % (domingo.game.height/10)
    this.draw()
    this.flush(@body.shift(), board) if @body.length == @size
    @size++ if board[@x][@y] == ITEM
    @body.push [@x,@y]
    
    switch @direction
      when UP
        board[@x][@y--] = 1 unless this.collide(board)
      when DOWN
        board[@x][@y++] = 1 unless this.collide(board)
      when LEFT
        board[@x--][@y] = 1 unless this.collide(board)
      when RIGHT
        board[@x++][@y] = 1 unless this.collide(board)

# exports
$().ready -> 
  domingo.nibbles = new Nibbles(600, 400)
  setInterval (-> domingo.nibbles.update()), 80
