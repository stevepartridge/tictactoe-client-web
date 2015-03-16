# tictactoe-client-web
A basic browser based Tic Tac Toe game

#### Prerequisites 
- Node.js (Currently tested with [v0.10.34](http://nodejs.org/dist/v0.10.34/))
- npm (comes with Node.js)
- Bower _*_
``` 
npm install -g bower
```

Gulp _*_
```
npm install -g gulp
```
_*_ if you would rather not install it globally you can call the relative bin file (node_modules/<package>/bin...)

### Run it locally
- Pull this repo down
- From within the root directory, at the command line (Terminal, Putty, etc.) run:
``` 
npm install
bower install
```

- Now you should be able to spin it up
``` 
gulp
```
It should now be running at [localhost:8000](http://locahost:8000)
#### Build the production version
```
gulp build
```
