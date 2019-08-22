(function () {
    'use strict';
    projectCostByte.factory('ConnectivityMonitor', function($rootScope, $cordovaNetwork){
     
      return {
        isOnline: function(){
          $cordovaNetwork.isOnline = function () {
            return navigator.connection.type !== Connection.NONE;
            // console.log("navigator.connection.type",navigator.connection.type)
          };
    
        },
        isOffline: function(){
          $cordovaNetwork.isOffline = function () {
            return navigator.connection.type === Connection.NONE;
          };
        },
        startWatching: function(){
            if(ionic.Platform.isWebView()){
     
              $rootScope.$on('$cordovaNetwork:online', function(event, networkState){
              });
     
              $rootScope.$on('$cordovaNetwork:offline', function(event, networkState){
              });
     
            }
            else {
     
              window.addEventListener("online", function(e) {
              }, false);   
     
              window.addEventListener("offline", function(e) {
              }, false); 
            }      
        }
      }
    })
    })();