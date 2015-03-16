/*exported AI*/
'use strict';

// The Artificial Intelligence 'class'
// not unlike SkyNet, this could one day
// control the robots used by humankind...
// ...or it could just be used to make an
// incredibly frustrating tic tac toe game.
function AI() {

}

// Determine the next best position to move
// Return the position index
AI.prototype.nextBestForPiece = function(board, piece) {

  // Determine the opponent's piece
  var opponentPiece = piece === 'x' ? 'o' : 'x';

  // Reference for the available positions
  var availablePositions = board.availablePositions();

  // Reference for the available positions total count
  var totalAvailablePositions = availablePositions.length;

  // Define the initial bestValue
  var bestValue = -Infinity;

  // Define best position reference for end result
  var bestPosition;

  // Loop through the available positions, run down each
  // of their respective trees using the negamax algorithm
  for (var i = 0; i < totalAvailablePositions; i++) {

    // Clone the current board so it doesn't share
    // the existing object space
    var boardClone = board.clone();

    // Set the position on the newly created board
    boardClone.setPosition(availablePositions[i], piece);

    // Grab the value determined by the negamax/pruning algorithm
    var value = -this.negamax(boardClone, opponentPiece, totalAvailablePositions, -Infinity, Infinity);

    // If the value is higher than the current best
    // then use it as the new best value
    if(value > bestValue) {
      bestValue = value;
      bestPosition = availablePositions[i];
    }
  }

  // return the best position
  return bestPosition;
};

// The delightful negamax search (similar to the minimax algorithm)
// using an alpha/beta pruning method with depth limitations.
// Since this is tic tac toe, it's not terribly necessary due to the
// fairly minimal number of states.  This would have a greater benefit
// in Connect4, Chess, Checkers, etc. but I've always liked it so that's
// why I chose to use it over just minimax.  Also since it's in JavaScript
// it doesn't hurt to cut down on the number of operations that are run through.
//
// Some light reading/reference material
// http://en.wikipedia.org/wiki/Negamax#NegaMax_with_Alpha_Beta_Pruning
AI.prototype.negamax = function(board, piece, depth, alpha, beta) {

  // If we're at the top depth or the game is over,
  // then determine the value based on if there is
  // a winner, loser, or if it's a draw/tie
  if(depth === 0 || board.isGameOver()) {
    var winner = board.hasWinner();
    if (winner) {
      if (winner === piece) {
        return 1;
      }
      return -1;
    }
    return 0;
  }

  // Reference for the available positions
  var availablePositions = board.availablePositions();

  // Reference for the available positions total count
  var totalAvailablePositions = availablePositions.length;

  // Determine the opponent's piece
  var opponentPiece = piece === 'x' ? 'o' : 'x';

  // Define the initial bestValue
  var bestValue = -Infinity;

  // Roll through that beautiful bean footage of each subsequent
  for (var i = 0; i < totalAvailablePositions; i++) {

   // Again, clone the current board so it doesn't share
   // the existing object space
    var boardClone = board.clone();

    // Set the position on the newly created board
    boardClone.setPosition(availablePositions[i], piece);

    // Grab the value as it runs down the rabbit hole, or
    // tree rather to see if it is our golden ticket to the
    // chocolate factory.
    var value = -this.negamax(boardClone, opponentPiece, depth - 1, -beta, -alpha);

    // Use the JavaScript max method to return the greater value
    // storing it as the current best value
    //
    // REFERENCE:
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/max
    bestValue = Math.max(bestValue, value);

    // Use the same method to determine the alpha
    alpha = Math.max(alpha, value);

    // However, if the alpha is higher than the beta
    // then prune that ugly bastard of a branch
    if(alpha >= beta) {
      // and break out of the loop
      break;
    }
  }
  // Return that best value
  return bestValue;
};


// Potential further optimization of sorting the list
// of possible positions to be searched first over the
// known lesser positions (work in progress)
// AI.prototype.optimal = function(positions) {

//   var optimalPositions = [0, 2, 4, 6, 8];
//   var sorted = [];

//   for (var i = 0; i < positions.length; i++) {
//     if(positions[i] === )
//   }


// };
