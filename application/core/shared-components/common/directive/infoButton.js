(function () {
    'use strict';
    projectCostByte.directive('infobutton', infobutton);

    function infobutton () {
        return {
            restrict: 'E'
            , templateUrl: 'application/core/shared-components/common/directive/infoButton.html'
            , scope: {             }
            , link: function (scope, element, attribute) {            }
        }
    }
})();