(function () {
    'use strict';
    projectCostByte.directive('backbuttonwindow', backbuttonwindow);

    backbuttonwindow.$inject = ['$ionicHistory', '$window'];
    function backbuttonwindow ($ionicHistory, $window) {
        return {
            restrict: 'E'
            , template: '<ion-nav-bar class="bar bar-header app-theme-text app-theme-color" align-title="center">'
            +'<ion-nav-back-button ng-show="!navbartitle.showToggleButton" id="my-back-btn" class="app-theme-text" ng-click="myGoBack()">'
            +'</ion-nav-back-button></ion-nav-bar>'
            , scope: {
                navbartitle: '='
            , }
            , link: function (scope, element, attribute) {
                scope.myGoBack = function() {
                           console.log("Back------------");
                           // console.log($ionicHistory);
                            // $ionicHistory.goBack();
                           $window.history.back();
                 };
            }
        }
    }
})();
