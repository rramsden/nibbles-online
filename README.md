### Nibbles Online
  Awesome online nibbles game written in delicious coffee script :)

  http://www.playnibbles.com/

### Setup

  You will need node.js and npm installed before you can run the server. 
  
    npm install zappa

  Once zappa is installed all you need to do is execute these commands from the root directory

    cake build
    zappa -w app.coffee

  Once you have zappa running pass the URL out to your friends :)

### TODO

  * implement a decent dead reckoning algorithm for server/client
  * allow users to have nicknames for their snakes 
  * mini-chat room for players to interact 
  * add different kinds of powerups for increased speed, increase snake thickness, etc
  * scrollable plane, this is a massive multiplayer game after all. We dont want 1000+ players crunched into one window!
