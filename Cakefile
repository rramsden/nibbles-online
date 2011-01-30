{spawn, exec} = require 'child_process'
{puts} = require 'sys'

task 'build', 'build domingo library', (options) ->
  exec 'coffee -o public/ -c -c src/nibbles.coffee', (err) ->
    puts err
  exec 'coffee -o public/ -b -c src/domingo.coffee', (err) ->
    puts err

task 'server', 'start zappa server', (options) ->
  exec 'zappa -w app.coffee', (err) -> 
    puts err
