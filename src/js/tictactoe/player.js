'use strict';

// Player object
// used in the Game object (game.js)
function Player(piece, name, human) {
  if(!piece) {
    console.error(
      'Player must be instantiated with the piece it will be assigned. (x or o).',
      'If another piece is used all things may come to an end.',
      'Dogs and cats living together, mass hysteria, etc.'
      );
  }
  // Set the players' piece
  this.piece = piece;

  // Set the players' name
  if(!name) {
    // Name was not provided, create one for them
    this.name = this.randomName();
  } else {
    // Name was provided, let them represent themselves as provided.
    this.name = name;
  }
  // set if the player is human or not
  this.human = (human);
}

// Proper method to retrieve the players' piece
Player.prototype.getPiece = function() {
  return this.piece;
};

// Proper method to set the players' piece
Player.prototype.setPiece = function(piece) {
  this.piece = piece;
};

// Method to generate a random name
Player.prototype.randomName = function() {

  // Names courteous of a random reference from the Despicable Me minions
  var names = [
      'Dave', 'Stuart', 'Jerry', 'Kevin', 'Tim', 'Mark', 'Phil', 'Darwin', 'Carl',
      'Lance', 'Tom', 'Donny', 'John', 'Bob', 'Paul', 'Frank', 'Larry', 'Jorge',
      'Josh', 'Snape', 'Billy', 'Ken', 'Mike', 'Bill', 'Scott', 'Cliff', 'Aaron'
      ];

  // Basic random number pull, nothing fancy.
  // Just need it to grab a random int for the names array
  function randomNum(min, max) {
    return Math.round( Math.random() * (max - min) + min);
  }

  // Return a random name based on the length of the
  // names array (less one because, well, it's an array)
  return names[randomNum(0, names.length-1)];
};


