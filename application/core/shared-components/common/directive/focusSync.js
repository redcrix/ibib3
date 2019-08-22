(function () {
    'use strict';
    projectCostByte.directive('syncFocusWith', function($timeout, $rootScope) {
    return {
            restrict: 'A',
            scope: {
                focusValue: "=syncFocusWith"
            },
            link: function($scope, $element, attrs) {
                $scope.$watch("focusValue", function(currentValue, previousValue) {
                    // console.log('focussing on element')
                    if (currentValue === true && !previousValue) {
                        $timeout(function(){$element[0].focus()},1);
                    } else if (currentValue === false && previousValue) {
                        $timeout(function(){$element[0].blur()},1);
                    }
                })
            }
        }
    })
})();
