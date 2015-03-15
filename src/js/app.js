'use strict';

var modules = [
  'ngTouch',
  'ngRoute',
  'ngAnimate',
  'ngStorage',
  'ngCookies',
  'ui.bootstrap'
];

var TicTacToeApp = angular.module('tictactoe', modules);

TicTacToeApp.run(function($log) {

  $log.log('Running Tic Tac Toe App');

});