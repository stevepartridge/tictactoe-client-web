/* global TicTacToeApp*/
'use strict';
/**=========================================================
 * Module: controllers/game.js
 * Board Controller
 =========================================================*/

TicTacToeApp.controller('BoardController', [
  '$scope',
  '$timeout',
  function ($scope, $timeout) {

    // Only for UI board creation
    $scope.rows = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8]
    ];

    $scope.hoveredPosition = -1;
    $scope.canPlaceOnHoveredPosition = false;

    $scope.placePiece = function (pos) {
      if($scope.game.board.canPopulate(pos)) {
        $scope.infoMessage = false;

        $scope.cheatPosition = -1;
        $scope.game.board.setPosition(pos, $scope.game.activePlayer.piece);

        // Add slight delay to make it look
        // like the AI is thinking
        $timeout(function(){
          $scope.game.nextTurn();
        }, 300);
      } else {
        console.log('Already placed.');
      }
    };

    $scope.onMouseOverPosition = function(pos) {
      $scope.hoveredPosition = pos;
    };

    $scope.onMouseOutPosition = function() {
      $scope.hoveredPosition = -1;
    };

    console.log('board controller');

  }
]);