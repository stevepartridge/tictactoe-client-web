/* global TicTacToeApp*/
'use strict';
/**=========================================================
 * Module: controllers/game.js
 * Board Controller
 =========================================================*/

TicTacToeApp.controller('BoardController', [
  '$rootScope',
  '$scope',
  '$timeout',
  function ($rootScope, $scope, $timeout) {

    // Only for UI board creation
    $scope.rows = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8]
    ];

    $scope.hoveredPosition = -1;
    $scope.canPlaceOnHoveredPosition = false;

    $scope.placePiece = function (pos) {
      if($scope.game.activePlayer.piece !== $scope.player.piece) {
        return;
      }
      if($scope.game.board.canPopulate(pos)) {
        $scope.infoMessage = false;

        $scope.cheatPosition = -1;
        $scope.game.board.setPosition(pos, $scope.game.activePlayer.piece);

        // Add slight delay to make it look
        // like the AI is thinking
        $timeout(function(){
          $scope.game.nextTurn();
          if($scope.game.activePlayer.human) {
            console.log('active player is human');
            $scope.sendGameState();
          }
        }, 300);
      } else {
        console.log('Already placed.');
      }
    };

    $scope.onMouseOverPosition = function(pos) {
      if($scope.game.activePlayer.piece === $scope.player.piece) {
        $scope.hoveredPosition = pos;
      }
    };

    $scope.onMouseOutPosition = function() {
      $scope.hoveredPosition = -1;
    };

    $scope.$watch('game.activePlayer', function(oldValue, newValue) {
      console.log('game.activePlayer', oldValue, newValue);
      if($scope.game.activePlayer) {
        // console.log(newValue.piece, $scope.player.piece);
        if($scope.game.activePlayer.piece !== $scope.player.piece) {
          // if($rootScope.$digest)
          // $rootScope.$apply(function(){
            $scope.infoMessage = 'Waiting for ' + $scope.opponent.name + ' to move...';
          // });
        } else {
          $scope.infoMessage = '';
        }
      }
    });

    console.log('board controller');

  }
]);