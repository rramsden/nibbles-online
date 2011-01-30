(function() {
  var BLUE, EMPTY, ITEM, Nibbles, RED, SNAKE, Snake;
  RED = 'rgb(255, 0, 0)';
  BLUE = 'rgb(0, 255, 0)';
  EMPTY = 0;
  SNAKE = 1;
  ITEM = 2;
  Nibbles = (function() {
    function Nibbles(width, height) {
      var i, j, player1, player1_controller, player2, player2_controller, _ref, _ref2;
      this.width = width;
      this.height = height;
      this.snakes = [];
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
      player1 = new Snake(BLUE, 0, 0);
      player1_controller = {
        up: (function() {
          return player1.direction = 0;
        }),
        down: (function() {
          return player1.direction = 1;
        }),
        left: (function() {
          return player1.direction = 2;
        }),
        right: (function() {
          return player1.direction = 3;
        })
      };
      player2 = new Snake(RED, 10, 10);
      player2_controller = {
        w: (function() {
          return player2.direction = 0;
        }),
        s: (function() {
          return player2.direction = 1;
        }),
        a: (function() {
          return player2.direction = 2;
        }),
        d: (function() {
          return player2.direction = 3;
        })
      };
      domingo.addController(player1_controller);
      domingo.addController(player2_controller);
      this.snakes.push(player1);
      this.snakes.push(player2);
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
        domingo.game.canvas.fillStyle = "rgb(" + (Math.floor(Math.random() * 255)) + ", " + (Math.floor(Math.random() * 255)) + ", " + (Math.floor(Math.random() * 255)) + ")";
        _results.push(domingo.game.canvas.fillRect(item[0] * 10, item[1] * 10, 10, 10));
      }
      return _results;
    };
    Nibbles.prototype.join = function(name, x, y) {
      return this.snakes.push(new Snake(x, y));
    };
    Nibbles.prototype.update = function() {
      var i, snake, _ref, _results;
      domingo.updateController();
      _ref = this.snakes;
      _results = [];
      for (i in _ref) {
        snake = _ref[i];
        snake.update(this.board);
        _results.push(snake.dead ? (console.log('killing snake'), snake.dead ? delete snake : void 0) : void 0);
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
    function Snake(color, x, y) {
      this.color = color;
      this.x = x;
      this.y = y;
      this.dead = false;
      this.size = 5;
      this.body = [];
      this.clear = [];
      this.direction = 1;
    }
    Snake.prototype.draw = function() {
      var canvas;
      canvas = domingo.game.canvas;
      canvas.fillStyle = this.color;
      return canvas.fillRect(this.x * 10, this.y * 10, 10, 10);
    };
    Snake.prototype.flush = function(coord, board) {
      var canvas;
      canvas = domingo.game.canvas;
      canvas.fillStyle = 'rgb(255,255,255)';
      canvas.fillRect(coord[0] * 10, coord[1] * 10, 10, 10);
      return board[coord[0]][coord[1]] = EMPTY;
    };
    Snake.prototype.collide = function(board) {
      if (board[this.x][this.y] === SNAKE) {
        this.dead = true;
      }
      return this.dead;
    };
    Snake.prototype.update = function(board) {
      if (this.dead === true) {
        return;
      }
      this.x = (this.x + (domingo.game.width / 10)) % (domingo.game.width / 10);
      this.y = (this.y + (domingo.game.height / 10)) % (domingo.game.height / 10);
      this.draw();
      if (this.body.length === this.size) {
        this.flush(this.body.shift(), board);
      }
      if (board[this.x][this.y] === ITEM) {
        this.size++;
      }
      this.body.push([this.x, this.y]);
      switch (this.direction) {
        case UP:
          if (!this.collide(board)) {
            return board[this.x][this.y--] = 1;
          }
        case DOWN:
          if (!this.collide(board)) {
            return board[this.x][this.y++] = 1;
          }
        case LEFT:
          if (!this.collide(board)) {
            return board[this.x--][this.y] = 1;
          }
        case RIGHT:
          if (!this.collide(board)) {
            return board[this.x++][this.y] = 1;
          }
      }
    };
    return Snake;
  })();
  $().ready(function() {
    domingo.nibbles = new Nibbles(600, 400);
    return setInterval((function() {
      return domingo.nibbles.update();
    }), 80);
  });
}).call(this);
