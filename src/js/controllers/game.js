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


      $scope.infoMessage = false;
      $scope.overlayMessage = false;

      $scope.game = new Game();
      $scope.player = new Player('x', '', true);
      $scope.player.name = '';
      $scope.opponent = new Player('o');

      $scope.newGameStep = 'welcome';

      $scope.cheatPosition = -1;

      $scope.connection = {};
      $scope.availablePlayers = [];

      $scope.gameRequest = {};

      $scope.createNewGame = function() {
        $scope.newGameStep = 'setname';
      };

      $scope.setPlayerName = function() {
        if($scope.player.name === '') {
          $scope.player.name = $scope.player.randomName();
        }
        $scope.game.addPlayer($scope.player);
        $scope.newGameStep = 'opponent';
        Connect.send('players.new', angular.copy($scope.player));
      };

      $scope.setOpponentType = function(type) {
        switch(type) {
          case 'joshua':
            $scope.opponent.name = 'Joshua';
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
        $scope.game.addPlayer($scope.opponent);
        $scope.game.start();

      };

      $scope.cheat = function() {
        $scope.cheatPosition = $scope.game.nextBestPosition($scope.game.activePlayer.piece);
      };

      $scope.playAgain = function() {
        $scope.game.reset();
        $scope.newGameStep = 'setname';
      };

      // -----------------------------
      $scope.startGameWithPlayer = function(connId) {
        console.log('start game with player', connId);
        Connect.send('game.request', {
            from : angular.copy($scope.connection.id),
            to : connId
          });
        $scope.newGameStep = 'waitingforresponse';
      };

      $scope.acceptGameRequest = function() {
        $scope.newGameStep = 'pickpiece';
        $scope.game = new Game();
        $scope.game.id = $scope.gameRequest.id;
        $scope.gameRequest.id = false;
      };

      $scope.pickPiece = function(piece) {

        Connect.send('game.request.accept', {
          id: angular.copy($scope.game.id),
          piece: piece,
          to : angular.copy($scope.gameRequest.from)
        });

        $scope.newGameStep = 'active';
        $scope.game.status = 'active';

        $scope.overlayMessage = 'Preparing game...';
        $scope.gameRequest = {};

      };

      $scope.sendGameState = function() {
        Connect.send('game.state', {
          id : $scope.game.id,
          piece : $scope.game.activePlayer.piece,
          players : angular.copy($scope.game.players),
          board : {
            positions : angular.copy($scope.game.board.positions)
          }
        });
      };

      var populatePlayersList = function(list) {
        var totalPlayers = list.length;
        $scope.availablePlayers = [];
        for(var i = 0; i < totalPlayers; i++) {
          if(list[i].connection_id !== $scope.connection.id) {
            $scope.availablePlayers.push(list[i]);
          }
        }
      };

      Connect.on('connection.info', function(data){
        console.log('connection.info', data);
        $scope.connection = data;
      });

      Connect.on('game.state', function(data){
        console.log('game.state', data);
        if(data.board) {
          if(data.board.positions) {
            // $rootScope.$apply(function(){
              $scope.game.board.positions = data.board.positions;
            // });
          }
        }
        if($scope.game.activePlayer.piece !== data.piece) {
          $scope.game.nextTurn();
        } else {
          if($scope.game.isGameOver()) {
            console.log('game is over');
            $scope.game.nextTurn();
          }
        }

      });

      Connect.on('players.list', function(data){
        console.log('players.list', data);
        populatePlayersList(data);
      });

      Connect.on('game.request', function(data){
        console.log('game.request', data);
        // $scope.gameRequest = {};
        $scope.gameRequest = data;
      });

      Connect.on('game.start', function(data){
        console.log('game.start', data);

        $scope.overlayMessage = false;

        $scope.game = new Game();
        $scope.game.id = data.game.id;

        var player1 = new Player(data.one.piece, data.one.name, true);
        player1.connection_id = data.one.connection_id;

        var player2 = new Player(data.two.piece, data.two.name, true);
        player2.connection_id = data.two.connection_id;

        $scope.game.addPlayer(player1);
        $scope.game.addPlayer(player2);

        if(player1.connection_id === $scope.connection.id) {
          $scope.player = player1;
          $scope.opponent = player2;
        }

        if(player2.connection_id === $scope.connection.id) {
          $scope.player = player2;
          $scope.opponent = player1;
        }

        $scope.overlayMessage = false;
        $scope.gameRequest = {};

        $scope.game.status = 'active';

        $scope.game.start();
      });

      console.log('game controller');

    }
  ]);