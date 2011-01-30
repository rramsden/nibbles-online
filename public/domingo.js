var domingo;
domingo = {} || domingo;
domingo.game = {} || domingo.game;
domingo.controllers = [];
domingo.keyState = {};
domingo.keyMap = {
  up: [38],
  down: [40],
  right: [39],
  left: [37],
  w: [87],
  d: [68],
  s: [83],
  a: [65],
  '-': [189, 109],
  '+': [187, 61]
};
domingo.keyIsPressed = function(key) {
  var i, _ref;
  if (domingo.keyMap[key]) {
    for (i = 0, _ref = domingo.keyMap[key].length - 1; (0 <= _ref ? i <= _ref : i >= _ref); (0 <= _ref ? i += 1 : i -= 1)) {
      if (domingo.keyState[domingo.keyMap[key][i]] === 1) {
        return true;
      }
    }
  }
};
domingo.keyJustReleased = function(key) {
  var i, _ref;
  if (domingo.keyMap[key]) {
    for (i = 0, _ref = domingo.keyMap[key].length - 1; (0 <= _ref ? i <= _ref : i >= _ref); (0 <= _ref ? i += 1 : i -= 1)) {
      if (domingo.keyState[domingo.keyMap[key][i]] === 2) {
        return true;
      }
    }
  }
};
domingo.onKeyUp = function(e) {
  domingo.keyState[e.keyCode] = 2;
  return console.log(e.keyCode);
};
domingo.onKeyDown = function(e) {
  return domingo.keyState[e.keyCode] = 1;
};
domingo.onMouseDown = function(e) {
  return {};
};
domingo.onMouseOver = function(e) {
  return {};
};
domingo.onMouseOut = function(e) {
  return {};
};
domingo.addController = function(controller) {
  return domingo.controllers.push(controller);
};
domingo.updateController = function() {
  var callback, controller, key, _i, _len, _ref, _results;
  _ref = domingo.controllers;
  _results = [];
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    controller = _ref[_i];
    _results.push((function() {
      var _results;
      _results = [];
      for (key in controller) {
        callback = controller[key];
        _results.push(domingo.keyIsPressed(key) ? callback() : void 0);
      }
      return _results;
    })());
  }
  return _results;
};
domingo.game.create = function(width, height) {
  domingo.game.width = width;
  domingo.game.height = height;
  $(".container").html("<center><canvas style='border:2px solid black' width=" + width + " height=" + height + "></canvas></center>");
  return domingo.game.canvas = $('canvas')[0].getContext('2d');
};