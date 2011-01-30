include 'src/index.coffee'

get '/': -> render 'index'

at connection: ->
  console.log "Client Connected : #{id}"
  app.players ?= {}

  for k, v of app.players
    send 'join', id: k

  # add new player 
  app.players[id] = true
  send 'welcome', time: new Date(), id: id

at disconnection: ->
  delete app.players[id]
  broadcast "#{id} is gone!"

msg move: ->
  console.log "broadcasting movement in direction #{@direction}"
  broadcast 'move', move: id: id, direction: @direction

layout ->
  html ->
    head -> 
      title "Nibbles Online"
      style ->
        '''
          html, body {margin: 0; padding: 0; overflow: hidden;}
        '''
    body -> @content
