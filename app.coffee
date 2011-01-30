include 'src/index.coffee'

get '/': -> render 'index'

at connection: ->
  UP = 0
  DOWN = 0
  LEFT = 0
  RIGHT = 0

  console.log "Client Connected : #{id}"
  app.players ?= {}

  # send a broadcast of players currently online
  for k, [x,y,direction,timestamp] of app.players
    # pathetic first attempt at dead reckoning
    FRAMERATE = 80
    current = new Date().getTime()
    x = x + Math.ceil((current - timestamp) / FRAMERATE) if direction == RIGHT 
    x = x - Math.ceil((current - timestamp) / FRAMERATE) if direction == LEFT 
    y = x + Math.ceil((current - timestamp) / FRAMERATE) if direction == DOWN
    y = x - Math.ceil((current - timestamp) / FRAMERATE) if direction == UP
    send 'join', id: k, direction: direction, x: x, y: y

  send 'welcome', time: new Date(), id: id

at disconnection: ->
  console.log "Client Disconnected : #{id}"
  delete app.players[id]
  broadcast 'remove', id: id

msg join: ->
  broadcast 'join', id: id, direction: @direction, x: @x, y: @y

msg move: ->
  app.players[id] = [@x, @y, @direction, @timestamp]
  console.log "broadcasting movement in direction #{[@x, @y, @direction, @timestamp]}"
  broadcast 'move', id: id, direction: @direction

layout ->
  html ->
    head -> 
      title "Nibbles Online"
      style ->
        '''
          html, body {margin: 0; padding: 0; overflow: hidden;}
        '''
    body -> @content
