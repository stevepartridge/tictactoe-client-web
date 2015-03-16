/* global TicTacToeApp, SockJS*/
'use strict';
/**=========================================================
 * Factory: services/connect.js
 * Connect Service
 =========================================================*/

TicTacToeApp
  .factory('Connect', [
    // '$q',
    '$timeout',
    function ($timeout) {

      var service = {},
        socket,
        messageIds = [];

      service.RECONNECT_TIMEOUT = 3000;
      service.SOCKET_URL = 'http://0.0.0.0:6975/tictactoe';

      var asyncAngularify = function (socket, callback) {
        return callback ? function () {
          var args = arguments;
          $timeout(function () {
            callback.apply(socket, args);
          }, 0);
        } : angular.noop;
      };

      var initialize = function () {

        socket = new SockJS(service.SOCKET_URL);

        socket.onopen = function(evt){
          console.log('open', evt);
        };

        socket.onclose = function(evt){
          console.log('close', evt);
          reconnect();
        };

        socket.onmessage = function(evt) {
          console.log('message', evt);
        };

      };

      service.send = function (name, data) {
        var id = Math.floor(Math.random() * 1000000);
        socket.send(JSON.stringify({
            id : id,
            event : name,
            data : data
          })
        );
        messageIds.push(id);
      };

      service.on = function(name, callback) {
        socket['on' + name] = asyncAngularify(socket, callback);
      };

      var reconnect = function () {
        $timeout(function () {
          initialize();
        }, service.RECONNECT_TIMEOUT);
      };

      initialize();

      return service;
    }
  ]);