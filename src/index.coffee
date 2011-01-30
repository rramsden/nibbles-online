view index: ->
  @scripts = [
    'vendor/jquery'
  ]
  
  script src: 'https://ajax.googleapis.com/ajax/libs/jquery/1.4.4/jquery.min.js' 
  script src: 'http://cdn.socket.io/stable/socket.io.js'
  script src: '/domingo.js'
  script src: '/domingo.socket.js'
  script src: '/nibbles.js'

  div class:'container', ->
