/* global TicTacToeApp, SockJS*/
'use strict';
/**=========================================================
 * Factory: services/connect.js
 * Connect Service
 =========================================================*/

TicTacToeApp
  .factory('Connect', [
    // '$q',
    '$rootScope',
    '$timeout',
    function ($rootScope, $timeout) {

      var service = {},
        socket,
        listeners = {},
        events = {}
        ;

      service.RECONNECT_TIMEOUT = 3000;

      $rootScope.connected = false;

      function buildUrl() {

        var url = 'http://connect.stevepartridge.me';
        var port = '';
        // var port = window.location.port === '' ? '' : ':6975';
        // if(window.location.host.match('/(10|172|192).*')) {
        //   url = window.location.protocol + '//' + window.location.hostname;
        //   port = ':6975';
        // }
        // var location = window.location.;
        // if(location.indexOf(':') > -1) {

        // }

        return url + port;
        // console.log('url', url);
        // return 'http://connect.stevepartridge.me';
      }

      service.SOCKET_URL = buildUrl() + '/tictactoe';

      var asyncAngularify = function (socket, callback) {
        return callback ? function () {
          var args = arguments;
          $timeout(function () {
            callback.apply(socket, args);
          }, 0);
        } : angular.noop;
      };

      var notifyListeners = function(evt) {
        if(evt.id) {
          if(listeners[evt.id]) {
            var listener = listeners[evt.id];
            if(evt.error) {
              if(listener.onError) {
                listener.onError.call(undefined, evt.error);
              }
            } else {
              if(listener.onSuccess) {
                listener.callback.call(undefined, evt.data);
              }
            }

            listener = null;
            delete listeners[evt.id];
          }
        } else {
          var callbacks = events[evt.name];
          if(callbacks) {
            var totalCallbacks = callbacks.length;
            for(var i = 0; i < totalCallbacks; i++) {
              callbacks[i].call(undefined, evt.data);
            }
          }
        }
      };

      var initialize = function () {

        $rootScope.connected = false;

        console.log('Connect URL:', service.SOCKET_URL);
        socket = new SockJS(service.SOCKET_URL);

        socket.onopen = function(evt){
          $rootScope.connected = true;
          console.log('open', evt);
        };

        socket.onclose = function(evt){
          console.log('close', evt);
          $rootScope.connected = false;
          reconnect();
        };

        socket.onmessage = function(payload) {
          var data = angular.fromJson(payload.data) || false;
          console.log('payload', payload, data);
          if(data) {
            notifyListeners(data);
          }
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
        // messageIds.push(id);
      };

      service.on = function(name, callback) {
        // socket['on' + name] = asyncAngularify(socket, callback);
        if(!events[name]) {
          events[name] = [];
        }
        events[name].push(asyncAngularify(socket, callback));
      };

      var reconnect = function () {

        $rootScope.connected = false;

        $timeout(function () {
          initialize();
        }, service.RECONNECT_TIMEOUT);
      };

      initialize();

      return service;
    }
  ]);