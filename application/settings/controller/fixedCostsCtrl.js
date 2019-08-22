(function() {
    'use strict';

    projectCostByte.controller('FixedCostsCtrl', fixedCostsCtrl);

    fixedCostsCtrl.$inject = ['$scope', 'CommonService', 'FixedCostService', '$state', '$stateParams', 'CommonConstants','$http', 'decisionStoreFactory'];

    function fixedCostsCtrl($scope, CommonService, FixedCostService, $state, $stateParams, CommonConstants, $http, decisionStoreFactory) {
    $scope.fixedCostNameById = {};
    $scope.fixedCostRankById = {};
    $scope.fixedCostValueById = {};
    $scope.finalDictionaryById = [];

    $scope.initializeView = function() {
      $scope.pageTitle = "Settings";
       $scope.navBarTitle.showToggleButton = false;
       $scope.fetchFixedCostList();
       $scope.fetchFixedCostValue();
       $scope.callbackReturnedCount = 0;
     }

   var fixedCostListResponseHandler = function(names, id, rank) {

        for(var i=0; i<names.length; i++)
        {
        $scope.fixedCostNameById[id[i]] = names[i];
        $scope.fixedCostRankById[id[i]] = rank[i];
        }
        $scope.callbackReturnedCount++;
        if ($scope.callbackReturnedCount == 2) {
            $scope.finalDictionary();
        }
      }

  var fixedCostValueResponseHandler = function(id, values) {

       for(var i=0; i<values.length; i++)
       {
         $scope.fixedCostValueById[id[i]] = values[i];
       }
       $scope.callbackReturnedCount++;
       if ($scope.callbackReturnedCount == 2) {
           $scope.finalDictionary();
       }
      }

  $scope.fetchFixedCostValue = function() {
        FixedCostService.fetchFixedCostValue(fixedCostValueResponseHandler);
                   }

  $scope.fetchFixedCostList = function() {
      FixedCostService.fetchFixedCostList(fixedCostListResponseHandler);
                 }
  $scope.finalDictionary = function() {

      for(var id in $scope.fixedCostValueById)
         {
         var k = id;
         $scope.finalDictionaryById.push({
           key: k,
           name: $scope.fixedCostNameById[k],
           value: $scope.fixedCostValueById[k],
           rank: $scope.fixedCostRankById[k],
           });

           }
      $scope.finalDictionaryById.sort(function(a, b) {
         return parseFloat(a.rank) - parseFloat(b.rank);
     });
         }

}
})();
