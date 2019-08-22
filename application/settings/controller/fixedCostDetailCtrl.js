(function() {
    'use strict';

    projectCostByte.controller('FixedCostDetailCtrl', fixedCostDetailCtrl);

    fixedCostDetailCtrl.$inject = ['$scope', 'CommonService', 'FixedCostService', '$state', '$stateParams', 'CommonConstants','$http', 'decisionStoreFactory'];

    function fixedCostDetailCtrl($scope, CommonService, FixedCostService, $state, $stateParams, CommonConstants, $http, decisionStoreFactory) {

    $scope.item_id = $stateParams.id;
    $scope.item_name = $stateParams.name;
    $scope.dict_detail = [];
    $scope.valueField = [];
    $scope.result = [];
    $scope.date = [];
    $scope.fixedCostDetailData = {
    months: [],
    dates: [],
    foodcost: []
    }

    $scope.initializeView = function() {
      $scope.pageTitle = "Fixed Costs";
      $scope.navBarTitle.showToggleButton = false;
    $scope.fetchFixedCostDetail();
   }

var fixedCostDetailResponseHandler = function(dates, month, values) {
  console.log(values);
  $scope.fixedCostDetailData.dates = dates
  $scope.fixedCostDetailData.months = month;
  $scope.fixedCostDetailData.foodcost = values;
  for(var i=0; i<$scope.fixedCostDetailData.months.length; i++)
  {
  var m = $scope.fixedCostDetailData.months[i];
  var v1 = $scope.fixedCostDetailData.foodcost[i];
  var v2 = $scope.fixedCostDetailData.dates[i];
  $scope.dict_detail.push({
    key:   m,
    value1: parseFloat(v1),
    value2: v2
  });
}
             }

$scope.fetchFixedCostDetail = function() {
        FixedCostService.fetchFixedCostDetailService(fixedCostDetailResponseHandler, $scope.item_id);
               }

$scope.pushFixedCostValue = function() {
        FixedCostService.pushFixedCostValueService($scope.valueField, $scope.item_id, $scope.date);
                            }

$scope.submit = function() {

for(var i=0; i<$scope.dict_detail.length; i++)
{
$scope.result1 =  $scope.dict_detail[i].key;
$scope.result2 =  $scope.dict_detail[i].value1;
$scope.result.push($scope.result1);
$scope.date.push($scope.dict_detail[i].value2);
$scope.valueField.push(document.getElementById($scope.result1).value);
}

$scope.pushFixedCostValue();

}

 }
})();
