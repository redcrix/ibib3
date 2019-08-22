(function() {
    'use strict';

    projectCostByte.controller('LaborCostsCtrl', laborCostsCtrl);

    laborCostsCtrl.$inject = ['$scope', 'CommonService', 'LaborCostsService', '$state', '$stateParams', 'CommonConstants','$http', 'decisionStoreFactory'];

    function laborCostsCtrl($scope, CommonService, LaborCostsService, $state, $stateParams, CommonConstants, $http, decisionStoreFactory) {
        $scope.navBarTitle.showToggleButton = true;
        $scope.employeeData = [];
        $scope.employeeId = {};
        $scope.employeeNameById = {};
        $scope.employeeRoleById = {};
        $scope.employeePayById = {};

        $scope.initializeView = function() {
            $scope.pageTitle = "Labor Costs";
          $scope.callbackReturnedCount = 0;
          $scope.fetchLaborCostList();
          //$scope.fetchLaborCostValue();
        }

        var laborCostListResponseHandler = function(data) {
          $scope.employeeData = data
          /*  for(var i = 0; i < names.length; i++)
            {
                var employeeId = employeeIds[i];

                $scope.employeeNameById[employeeId] = names[i];
                $scope.employeeRoleById[employeeId] = role[i];
            }
            $scope.callbackReturnedCount++;
            if ($scope.callbackReturnedCount == 2) {
                $scope.finalDictionary();
            } */
        }

        var laborCostValueResponseHandler = function(employeeIds, values) {
            for(var i=0; i<values.length; i++)
            {
                $scope.employeePayById[employeeIds[i]] = values[i];
            }
            $scope.callbackReturnedCount++;
            if ($scope.callbackReturnedCount == 2) {
                $scope.finalDictionary();
            }
        }

        $scope.fetchLaborCostValue = function() {
            LaborCostsService.fetchLaborCostValue(laborCostValueResponseHandler);
        }

        $scope.fetchLaborCostList = function() {
            LaborCostsService.fetchLaborCostList(laborCostListResponseHandler);
        }
        $scope.finalDictionary = function() {
            for(var employeeId in $scope.employeeNameById)
            {
                $scope.employeeData.push({
                    key: employeeId,
                    emp_name: $scope.employeeNameById[employeeId],
                    emp_pay: $scope.employeePayById[employeeId],
                    emp_role: $scope.employeeRoleById[employeeId],
                });

            }
        }
    }
})();
