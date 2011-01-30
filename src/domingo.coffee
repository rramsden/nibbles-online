domingo = {} || domingo
domingo.game = {} || domingo.game

domingo.controllers = []; # callbacks for key events
domingo.keyState = {} # hash of keys being pressed
domingo.keyMap =
  up: [38]
  down: [40]
  right: [39]
  left: [37]
  w: [87]
  d: [68]
  s: [83]
  a: [65]
  '-': [189, 109]
  '+': [187, 61]

domingo.keyIsPressed = (key) ->
  if domingo.keyMap[key]
    for i in [0..domingo.keyMap[key].length-1]
      return true if domingo.keyState[domingo.keyMap[key][i]] == 1

domingo.keyJustReleased = (key) -> 
  if domingo.keyMap[key]
    for i in [0..domingo.keyMap[key].length-1]
      return true if domingo.keyState[domingo.keyMap[key][i]] == 2

domingo.onKeyUp = (e) -> 
  domingo.keyState[e.keyCode] = 2
  console.log e.keyCode
domingo.onKeyDown = (e) -> domingo.keyState[e.keyCode] = 1
domingo.onMouseDown = (e) -> {}
domingo.onMouseOver = (e) -> {}
domingo.onMouseOut = (e) -> {}

# Add a game controller to event processing queue
#
# === Parameters
# :hash:: controller 
# {
#   up : function() { player.direction.up = 1 },
#   down : function() { player.direction.down = 0 }
# }
#
domingo.addController = (controller) -> 
  domingo.controllers.push(controller);    

# This method will be called every game loop. It will update
# all game controllers.
domingo.updateController = () ->
  for controller in domingo.controllers
    for key, callback of controller
      callback() if domingo.keyIsPressed(key)

domingo.game.create = (width, height) ->
  domingo.game.width = width
  domingo.game.height = height
  $(".container").html("<center><canvas style='border:2px solid black' width=#{width} height=#{height}></canvas></center>")
  domingo.game.canvas = $('canvas')[0].getContext('2d')
