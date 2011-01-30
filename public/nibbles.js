(function() {
  var BLACK, BLUE, COLORS, EMPTY, ITEM, Nibbles, RANDOM_COLOR, RANDOM_X, RANDOM_Y, RED, SNAKE, Snake, WHITE;
  RED = 'rgb(255, 0, 0)';
  BLUE = 'rgb(0, 255, 0)';
  WHITE = 'rgb(255,255,255)';
  BLACK = 'rgb(0,0,0)';
  COLORS = [RED, BLUE, BLACK];
  RANDOM_COLOR = (function() {
    return COLORS[Math.floor(Math.random() * COLORS.length)];
  })();
  RANDOM_X = (function() {
    return Math.floor(Math.random() * (600 / 10));
  })();
  RANDOM_Y = (function() {
    return Math.floor(Math.random() * (400 / 10));
  })();
  EMPTY = 0;
  SNAKE = 1;
  ITEM = 2;
  Nibbles = (function() {
    function Nibbles(width, height) {
      var i, j, _ref, _ref2;
      this.width = width;
      this.height = height;
      this.snakes = {};
      this.items = [];
      window.addEventListener('keyup', domingo.onKeyUp, false);
      window.addEventListener('keydown', domingo.onKeyDown, false);
      this.board = [];
      for (i = 0, _ref = Math.floor(this.width / 10); (0 <= _ref ? i <= _ref : i >= _ref); (0 <= _ref ? i += 1 : i -= 1)) {
        this.board[i] = [];
        for (j = 0, _ref2 = Math.floor(this.height / 10); (0 <= _ref2 ? j <= _ref2 : j >= _ref2); (0 <= _ref2 ? j += 1 : j -= 1)) {
          this.board[i][j] = EMPTY;
          if (Math.floor(Math.random() * 100 > 10)) {
            this.board[i][j] = ITEM;
            this.items.push([i, j]);
          }
        }
      }
      domingo.game.create(this.width, this.height);
      this.draw_items();
    }
    Nibbles.prototype.collide = function(x, y) {
      return this.board[x][y] === SNAKE;
    };
    Nibbles.prototype.item = function(x, y) {
      return this.board[x][y] === ITEM;
    };
    Nibbles.prototype.draw_items = function() {
      var item, _i, _len, _ref, _results;
      _ref = this.items;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        item = _ref[_i];
        domingo.canvas.fillStyle = "rgb(" + (Math.floor(Math.random() * 255)) + ", " + (Math.floor(Math.random() * 255)) + ", " + (Math.floor(Math.random() * 255)) + ")";
        _results.push(domingo.canvas.fillRect(item[0] * 10, item[1] * 10, 10, 10));
      }
      return _results;
    };
    Nibbles.prototype.handle_packet = function(packet) {
      var controller, data, opcode, player, snake, _results;
      _results = [];
      for (opcode in packet) {
        data = packet[opcode];
        console.log("[NIBBLES] : received " + opcode);
        _results.push((function() {
          switch (opcode) {
            case 'welcome':
              console.log("[NIBBLES] : server local time is " + data['time']);
              player = new Snake(RANDOM_COLOR, this.board, RANDOM_X, RANDOM_Y);
              this.snakes[data['id']] = player;
              controller = {
                up: (function() {
                  domingo.network.send({
                    move: {
                      direction: 0
                    }
                  });
                  return player.direction = 0;
                }),
                down: (function() {
                  domingo.network.send({
                    move: {
                      direction: 1
                    }
                  });
                  return player.direction = 1;
                }),
                left: (function() {
                  domingo.network.send({
                    move: {
                      direction: 2
                    }
                  });
                  return player.direction = 2;
                }),
                right: (function() {
                  domingo.network.send({
                    move: {
                      direction: 3
                    }
                  });
                  return player.direction = 3;
                })
              };
              return domingo.addController(controller);
            case 'join':
              console.log("[NIBBLES] : player " + data['id'] + " joined the game");
              snake = new Snake(RANDOM_COLOR, this.board, data['x'], data['y']);
              return this.snakes[data['id']] = snake;
            case 'move':
              return this.snakes[id].direction = data['direction'];
            default:
              return console.log("[NIBBLES] : unknown opcode " + opcode);
          }
        }).call(this));
      }
      return _results;
    };
    Nibbles.prototype.update = function() {
      var i, snake, _ref, _results;
      domingo.updateController();
      _ref = this.snakes;
      _results = [];
      for (i in _ref) {
        snake = _ref[i];
        snake.update();
        _results.push(snake.dead ? delete this.snakes[i] : void 0);
      }
      return _results;
    };
    return Nibbles;
  })();
  Snake = (function() {
    var DOWN, LEFT, RIGHT, UP;
    UP = 0;
    DOWN = 1;
    LEFT = 2;
    RIGHT = 3;
    function Snake(color, board, x, y) {
      this.color = color;
      this.board = board;
      this.x = x;
      this.y = y;
      this.dead = false;
      this.size = 5;
      this.body = [];
      this.clear = [];
      this.direction = 1;
    }
    Snake.prototype.draw = function() {
      domingo.canvas.fillStyle = this.color;
      return domingo.canvas.fillRect(this.x * 10, this.y * 10, 10, 10);
    };
    Snake.prototype.flush = function(_arg) {
      var x, y;
      x = _arg[0], y = _arg[1];
      domingo.canvas.fillStyle = WHITE;
      domingo.canvas.fillRect(x * 10, y * 10, 10, 10);
      return this.board[x][y] = EMPTY;
    };
    Snake.prototype.collide = function() {
      if (this.board[this.x][this.y] === SNAKE) {
        this.dead = true;
        this.die();
      }
      return this.dead;
    };
    Snake.prototype.die = function() {
      var x, y, _i, _len, _ref, _ref2, _results;
      _ref = this.body;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        _ref2 = _ref[_i], x = _ref2[0], y = _ref2[1];
        domingo.canvas.fillStyle = WHITE;
        domingo.canvas.fillRect(x * 10, y * 10, 10, 10);
        _results.push(this.board[x][y] = EMPTY);
      }
      return _results;
    };
    Snake.prototype.update = function() {
      if (this.dead === true) {
        return;
      }
      this.x = (this.x + (domingo.game.width / 10)) % (domingo.game.width / 10);
      this.y = (this.y + (domingo.game.height / 10)) % (domingo.game.height / 10);
      this.draw();
      if (this.body.length === this.size) {
        this.flush(this.body.shift());
      }
      if (this.board[this.x][this.y] === ITEM) {
        this.size++;
      }
      this.body.push([this.x, this.y]);
      switch (this.direction) {
        case UP:
          if (!this.collide()) {
            return this.board[this.x][this.y--] = 1;
          }
        case DOWN:
          if (!this.collide()) {
            return this.board[this.x][this.y++] = 1;
          }
        case LEFT:
          if (!this.collide()) {
            return this.board[this.x--][this.y] = 1;
          }
        case RIGHT:
          if (!this.collide()) {
            return this.board[this.x++][this.y] = 1;
          }
      }
    };
    return Snake;
  })();
  $().ready(function() {
    domingo.nibbles = new Nibbles(600, 400);
    domingo.network.create('localhost', '5678');
    domingo.network.setHandler((function(packet) {
      return domingo.nibbles.handle_packet(packet);
    }));
    return setInterval((function() {
      return domingo.nibbles.update();
    }), 80);
  });
}).call(this);
