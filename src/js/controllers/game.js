/* global TicTacToeApp, Game, Player*/
'use strict';
/**=========================================================
 * Module: controllers/game.js
 * Game Controller
 =========================================================*/

TicTacToeApp
  .controller('GameController', [
    '$rootScope',
    '$scope',
    'Connect',
    function ($rootScope, $scope, Connect) {

      $scope.connected = false;

      $scope.infoMessage = false;

      $scope.game = new Game();
      $scope.player1 = new Player('x', '', true);
      $scope.player1.name = '';
      $scope.player2 = new Player('o');

      $scope.newGameStep = 'welcome';

      $scope.cheatPosition = -1;

      $scope.createNewGame = function() {
        $scope.newGameStep = 'setname';
      };

      $scope.setPlayerName = function() {
        if($scope.player1.name === '') {
          $scope.player1.name = $scope.player1.randomName();
        }
        $scope.game.addPlayer($scope.player1);
        $scope.newGameStep = 'opponent';
      };

      $scope.setOpponentType = function(type) {
        switch(type) {
          case 'joshua':
            $scope.player2.name = 'Joshua';
            break;
          case 'minion':
            // Default player style
            break;
          case 'human':
            $scope.newGameStep = 'selecthuman';
            return;
          default:

            break;
        }
        $scope.newGameStep = 'active';
        $scope.game.status = 'active';
        $scope.game.addPlayer($scope.player2);
        $scope.game.start();

      };

      $scope.cheat = function() {
        $scope.cheatPosition = $scope.game.nextBestPosition($scope.game.activePlayer.piece);
      };

      $scope.playAgain = function() {
        $scope.game.reset();
        $scope.newGameStep = 'setname';
      };


      Connect.on('game.state', function(evt, data){
        $scope.connected = true;
        console.log('game.state', evt, data);
      });

      $scope.game.on('state', function(data){
        console.log('game state', data);
      });

      console.log('game controller');

    }
  ]);