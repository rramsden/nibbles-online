view index: ->
  @scripts = [
    'vendor/jquery'
  ]
  
  script src: 'https://ajax.googleapis.com/ajax/libs/jquery/1.4.4/jquery.min.js' 
  script src: '/domingo.js'
  script src: '/nibbles.js'

  div class:'container', ->
