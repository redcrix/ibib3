(function () {
    'use strict';
    projectCostByte.directive('backbuttonbaralt', backbuttonbaralt);

    backbuttonbaralt.$inject = ['$ionicHistory', '$window'];
    function backbuttonbaralt ($ionicHistory, $window) {
        return {
            restrict: 'E'
            , template: '<ion-nav-bar class="bar bar-header app-theme-text app-theme-color" align-title="center">'
            +'<ion-nav-back-button ng-show="showbutton" id="my-back-btn" class="app-theme-text" ng-click="myGoBack()">'
            +'</ion-nav-back-button></ion-nav-bar>'
            , scope: {
                showbutton: '='
            , }
            , link: function (scope, element, attribute) {
                console.log('directive ' , scope.showbutton)
                scope.myGoBack = function() {
                  console.log("Back------------");
//                            console.log("c b b");
                            $ionicHistory.goBack();
//                            $window.history.back();
                 };
            }
        }
    }
})();
