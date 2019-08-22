(function() {
    'use strict';

    projectCostByte.controller('LaborCostsDetailCtrl', laborCostsDetailCtrl);

    laborCostsDetailCtrl.$inject = ['$scope', 'CommonService', 'LaborCostsService', '$state', '$stateParams', 'CommonConstants','$http', 'decisionStoreFactory'];

    function laborCostsDetailCtrl($scope, CommonService, LaborCostsService, $state, $stateParams, CommonConstants, $http, decisionStoreFactory) {

        $scope.employeeId = $stateParams.id;
        $scope.employeeName = $stateParams.name;
        $scope.employeePayDetail = [];
        $scope.valueField = [];
        $scope.date = [];


        $scope.initializeView = function() {
          $scope.pageTitle = "Labor Costs";
          $scope.navBarTitle.showToggleButton = false;
          $scope.fetchLaborCostDetail();
       }

       var laborCostDetailResponseHandler = function(dates, month, values) {

          for(var i=0; i<month.length; i++)
          {
              $scope.employeePayDetail.push({
                  key:   month[i],
                  value: parseFloat(values[i]),
                  date: dates[i]
              });
            }
      }

      $scope.fetchLaborCostDetail = function() {
            LaborCostsService.fetchLaborCostDetailService(laborCostDetailResponseHandler, $scope.employeeId);
                     }

      $scope.pushLaborCostValue = function() {
            LaborCostsService.pushLaborCostValue($scope.valueField, $scope.employeeId, $scope.date);
                                  }

      $scope.submit = function() {

        for(var i=0; i<$scope.dict_detail.length; i++)
        {
            result =  $scope.employeePayDetail[i].key;
          //  $scope.result.push($scope.result1);
            $scope.date.push($scope.employeePayDetail[i].date);
            $scope.valueField.push(document.getElementById(result).value);
        }

        $scope.pushLaborCostValue();

        }

 }
})();
