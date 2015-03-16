/* global Board, AI*/
/*exported Game*/
'use strict';

function Game() {

  // Define the max players
  // changing this will most likely
  // break the game in it's current state
  this.maxPlayers = 2;

  // Establish the new game
  this.reset();
}

// Create/Reset the game to factory defaults
Game.prototype.reset = function() {

  // Create the board
  this.board = new Board();

  // Create/attach the AI
  this.ai = new AI();

  // Reference to the players
  this.players = [];

  // Used in hasWinner() for more info
  this.winner = false;

  // Tie/Draw boolean
  this.tie = false;

  // Status of the game
  // used for the UI
  this.status = 'pending';

};

// Start the game, set the active player to the first one
// added to the players array/game
Game.prototype.start = function() {
  this.activePlayerIndex = 0;
  this.activePlayer = this.players[this.activePlayerIndex];
};

// Reference to the board
Game.prototype.board = function () {
  return this.board || new Board();
};


// Add a player to players list, currently this
// should only be 2, but why not support more for a
// future thumderdome style version of tic-tac-toe
Game.prototype.addPlayer = function(player) {

  // Make sure this doesn't exceed the max players
  if(this.maxPlayers >= this.players.length) {
    console.warn(
      'Unable to add player, ' +
      'it will exceed the maximum allotment of ' +
      this.maxPlayers + ' players.'
      );
    return;
  }

  // On the off chance that the randomly selected
  // names happen to be identical, make them a Junior
  if(this.playerNameExists(player.name)) {
    player.name = player.name + ' II';
  }

  // add the player to the players array
  this.players.push(player);

  // add the player's peice to the board
  this.board.addPiece(player.piece);
};

// Helper method to determine if a player name
// already exists, returns boolean
Game.prototype.playerNameExists = function(name) {
  var totalPlayers = this.players.length;
  // Loop through the current players
  for(var i = 0; i < totalPlayers; i++) {
    if(this.players[i].name === name) {
      return true;
    }
  }
  return false;
};

// Method to invoke the next turn
Game.prototype.nextTurn = function() {

  // Using the players array, increment the index
  this.activePlayerIndex = this.activePlayerIndex + 1;
  // if that index is out of the top range
  if(this.activePlayerIndex === this.players.length) {
    // revert to the first index
    this.activePlayerIndex = 0;
  }

  // Check to see if the last move caused the
  // game to be over
  if(this.isGameOver()) {
    this.status = 'over';

    // log out that the game is over
    console.log('Game Over');

    // See if ended in a tie
    if(this.tie) {
      console.log('ends in a tie');
    } else {
      // if not a tie, log out the winner
      console.log(
        'Player ' + this.winner.name +
        ', playing as "' + this.winner.piece + '" ' +
        'has won!');
    }
    // and return out so the game no longer continues
    return;
  }

  // Update the active player
  this.activePlayer = this.players[this.activePlayerIndex];

  // If the active player is not a human, invoke the
  // skynet AI to pick the position for the player
  if(!this.activePlayer.human) {
    // Grab the best position
    var position = this.nextBestPosition(this.activePlayer.piece);
    // Set it on the board
    this.board.setPosition(position, this.activePlayer.piece);
    // Invoke the next turn
    this.nextTurn();
  }

};

// Helper method at the Game level
// to see if the game is over (boolean)
Game.prototype.isGameOver = function() {
  if(this.hasWinner()) {
    return true;
  }
  if(this.board.isFull()) {
    this.tie = true;
    return true;
  }
  return false;
};

// Check if there is a winner, if so return the winning
// player, found by using the board's determining the
// winning piece
Game.prototype.hasWinner = function() {
  var winningPiece = this.board.hasWinner();
  if(winningPiece) {
    this.winner = this.getPlayerByPiece(winningPiece);
    return this.winner;
  }
  return false;
};

// Helper method to grab the winner
Game.prototype.getWinner = function() {
  if(this.hasWinner()) {
    return this.winner;
  }
  return false;
};

// Helper method to support cheating if the human
// user would like to phone a friend in skynet
Game.prototype.nextBestPosition = function(piece) {
  return this.ai.nextBestForPiece(this.board, piece);
};
