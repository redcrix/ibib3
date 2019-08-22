(function () {
    'use strict';
    projectCostByte.directive('busyspinner', function () {
        return {
            restrict: 'E'
            , template: '<div class="spinner" ng-hide="spinnerhide"><ion-spinner icon="lines" class="spinner-calm"></ion-spinner><br/><div style="text-align:center;"><span class="spinner-text">pepr is working hard,</span> <br/><span class="spinner-text">Please wait!</span> </div></div>'
            , scope: {
                spinnerhide: '='
            , }
            , link: function (scope, element, attribute) {}
        }
    });
})();