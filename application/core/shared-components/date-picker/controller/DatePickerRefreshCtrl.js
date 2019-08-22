(function() {
    'use strict';

    projectCostByte.controller('DatePickerRefreshCtrl', datePickerCtrl);

    datePickerCtrl.$inject = ['$scope','$state','$rootScope'];

    function datePickerCtrl($scope,$state,$rootScope) {
        $scope.onDatePickerRefreshInit = function() {
            $state.go($rootScope.previousState);
        }
    }

})();