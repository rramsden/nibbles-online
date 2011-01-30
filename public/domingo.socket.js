domingo.network = {
  create: function(host, port) {
    domingo.network.log("connecting to " + host + " on port " + port);
    domingo.network.socket = new io.Socket(host, {
      port: 5678
    });
    domingo.network.socket.on('connect', domingo.network.open);
    domingo.network.socket.on('connect_failed', domingo.network.open);
    domingo.network.socket.on('close', domingo.network.close);
    domingo.network.socket.on('message', domingo.network.recv);
    domingo.network.socket.on('error', domingo.network.error);
    domingo.network.socket.connect();
    return domingo.network.callbacks = [];
  },
  open: function() {
    domingo.network.log("connection established");
    domingo.network.log("sending handshake");
    return domingo.network.send({
      said: {
        text: 'hello'
      }
    });
  },
  close: function() {
    return domingo.network.log("connection closed");
  },
  error: function(msg) {
    return domingo.network.log(msg);
  },
  send: function(packet) {
    return domingo.network.socket.send(JSON.stringify(packet));
  },
  callback: function(opcode, callback) {
    return domingo.network.callbacks[opcode] = callback;
  },
  setHandler: function(fun) {
    return domingo.network._handler = fun;
  },
  handler: function(packet) {
    if (domingo.network._handler) {
      return domingo.network._handler(packet);
    }
  },
  recv: function(packet) {
    var data, opcode, _ref, _results;
    domingo.network.handler(JSON.parse(packet));
    _ref = JSON.parse(packet);
    _results = [];
    for (opcode in _ref) {
      data = _ref[opcode];
      _results.push(domingo.network.callbacks[opcode] ? domingo.network.callbacks[opcode](data) : void 0);
    }
    return _results;
  },
  log: function(msg) {
    return console.log("[WEBSOCKET] : " + msg);
  }
};