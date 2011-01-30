include 'src/index.coffee'

get '/': -> render 'index'

layout ->
  html ->
    head -> 
      title "Nibbles Online"
      style ->
        '''
          html, body {margin: 0; padding: 0; overflow: hidden;}
        '''
    body -> @content
