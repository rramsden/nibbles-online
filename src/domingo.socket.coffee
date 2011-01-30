domingo.network = { 

  create: (host, port) ->
    domingo.network.log "connecting to #{host} on port #{port}"
    domingo.network.socket = new io.Socket(host, {port: 5678})
    domingo.network.socket.on('connect', domingo.network.open)
    domingo.network.socket.on('connect_failed', domingo.network.open)
    domingo.network.socket.on('close', domingo.network.close)
    domingo.network.socket.on('message', domingo.network.recv)
    domingo.network.socket.on('error', domingo.network.error)
    domingo.network.socket.connect()
    domingo.network.callbacks = []

  open: ->
    domingo.network.log "connection established"
    domingo.network.log "sending handshake"
    domingo.network.send({said: {text: 'hello'}})

  close: ->
    domingo.network.log "connection closed"

  error: (msg) ->
    domingo.network.log(msg)

  send: (packet) ->
    domingo.network.socket.send(JSON.stringify(packet))

  # TODO : support for multiple callbacks
  callback: (opcode, callback) ->
    domingo.network.callbacks[opcode] = callback

  setHandler: (fun) ->
    domingo.network._handler = fun

  handler: (packet) ->
    domingo.network._handler(packet) if domingo.network._handler

  recv: (packet) ->
    domingo.network.handler(JSON.parse(packet))
    for opcode, data of JSON.parse(packet)
      domingo.network.callbacks[opcode](data) if domingo.network.callbacks[opcode]

  log: (msg) ->
    console.log "[WEBSOCKET] : #{msg}"

}
