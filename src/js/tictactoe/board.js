'use strict';

// Board object, to used within
// the Game object (game.js)
function Board() {

  // Total positions on the board, this
  // will also be referenced in the various
  // loops/refs elsewhere to save a notation
  // in big-O
  this.totalPositions = 9;

  // Default position value, just a good old
  // fashioned empty space. have to be careful
  // though because it can be assumed as a
  // false-y value in conditional checks
  this.defaultPositionValue = '';

  // Winning combinations
  this.winningCombinations = [
    [0, 1, 2], // Top horizontal row
    [3, 4, 5], // Middle horizontal row
    [6, 7, 8], // Bottom horizontal row
    [0, 3, 6], // Left vertical column
    [1, 4, 7], // Middle vertical column
    [2, 5, 8], // Right vertical column
    [0, 4, 8], // Diagonal top left to bottom right
    [2, 4, 6]  // Diagonal top right to bottom left
  ];

  this.pieces = [];

  this.winner = false;

  this.reset();

}

// Reset the game state back to the factory defaults
Board.prototype.reset = function () {

  // Create/clear the positions array
  this.positions = [];

  // Initiate and populate each position with
  // the default/null value of an empty string
  for (var i = 0; i < this.totalPositions; i++) {
    this.positions.push(this.defaultPositionValue);
  }
};

// Add piece to the board (x/o)
Board.prototype.addPiece = function (piece) {
  // Confirm it does not exist yet
  if (this.pieceExists(piece)) {
    console.error('Piece ' + piece + ' already exists!');
    return;
  }
  this.pieces.push(piece);
};

// Helper method to determine if it does exist
Board.prototype.pieceExists = function (piece) {
  var totalPieces = this.pieces.length;
  for (var i = 0; i < totalPieces; i++) {
    if (this.pieces[i] === piece) {
      return true;
    }
  }
  return false;
};

// Helper method to determine if a position can be
// populated or not
Board.prototype.canPopulate = function (pos) {
  return (this.getPosition(pos) === this.defaultPositionValue);
};

// Proper method to be used when setting a positions
// piece value (x / o)
Board.prototype.setPosition = function (pos, value) {
  // Verify that the position being set is empty
  // i.e. populated with the default position value
  if (this.getPosition(pos) === this.defaultPositionValue) {
    // Set the position with the value of the piece
    this.positions[pos] = value;
    // and return it, because, why not
    return this.getPosition(pos);
  } else {
    console.warn(
      'Position ' + pos + ' is already populated with ' +
      this.getPosition(pos) +
      'The canPopulate should be used prior to using ' +
      'setPosition to prevent this warning.'
    );
    return this.getPosition(pos);
  }
};

// Grab the current position's populated state
Board.prototype.getPosition = function (pos) {
  if (this.positions[pos] === undefined) {
    console.error(
      'Position ' + pos + ' not found! ' +
      'In theory, this should not happen, ' +
      'but if it does you have won the prize of sadness, enjoy.'
    );
  } else {
    return this.positions[pos];
  }
};

// Helper method to grab all the remaining available
// positions on the current board state
Board.prototype.availablePositions = function () {
  var result = [];
  for (var i = 0; i < this.totalPositions; i++) {
    if (this.positions[i] === this.defaultPositionValue) {
      result.push(i);
    }
  }
  return result;
};

// Boolean method to determine if the game
// is over and set the board winner and
// if it is a tie (boolean) or not
Board.prototype.isGameOver = function() {

  // Reference to the winner (piece)
  var winner = this.hasWinner();
  if(winner) {
    this.winner = winner;
    return true;
  }
  // Use the isFull method to determine if
  // the board is the polar opposite of empty
  if(this.isFull()) {
    this.tie = true;
    return true;
  }
  return false;
};

// Helper method to detect if the board is
// all filled up with pieces of battle
Board.prototype.isFull = function () {
  for (var i = 0; i < this.totalPositions; i++) {
    if (this.positions[i] === this.defaultPositionValue) {
      return false;
    }
  }
  return true;
};

// Method to determine if there is a winner and if so
// return the piece that is the winner
Board.prototype.hasWinner = function () {

  // Reference to the total pieces count
  // since this is currently only used for
  // TicTacToe it shouldn't be more than two
  // but this will allow for reuse elsewhere
  // if needed for other glorious things
  var totalPieces = this.pieces.length;

  // Reference to the total count of winning combinations
  var totalWinningCombinations = this.winningCombinations.length;

  /******* clean up signle letter variables other than `i`, use meaninful names like `pieceIndex` ******/
  // Loop through the pieces
  for (var p = 0; p < totalPieces; p++) {

    // Reference the piece
    var piece = this.pieces[p];

    // Using that piece, loop through the winning
    // combinations and see if it is a glorious victor
    // or just a sad and pathetic loser of Tic Tac Toe
    for (var i = 0; i < totalWinningCombinations; i++) {

      // Current combination reference
      var combo = this.winningCombinations[i];

      // Reference to total count of combinations
      var totalComboPositions = combo.length;

      // Loop through the positions of the combination
      for (var cp = 0; cp < totalComboPositions; cp++) {

        // To see if the piece is populating that current
        // possition, in this case check to see if it is not
        // populating it, because if so...
        if (this.positions[combo[cp]] !== piece) {
          // we can just break out of the loop and save
          // some futher operations
          break;
        } else {
          // See if the current position that is being
          // evaluated is the last of the combination
          // if so, this means the piece populates all the
          // positions and...
          if ((cp + 1) >= totalComboPositions) {
            // this piece can be returned
            return piece;
          }
        }
      }
    }
  }
};

// Utiility method to clone the critical aspects of the board
// for use with the AI negamax/prune algorithms
Board.prototype.clone = function() {

  // Create a new board
  var cloned = new Board();

  // Clone the positions and pieces of the
  // current board to the new one
  cloned.positions = this.positions.slice();
  cloned.pieces = this.pieces.slice();

  // return the cloned board
  return cloned;
};
