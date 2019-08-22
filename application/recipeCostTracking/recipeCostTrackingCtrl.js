(function() {
  'use strict';

  	projectCostByte.controller('RecipeCostTrackingCtrl', recipeCostTrackingCtrl);

  	recipeCostTrackingCtrl.$inject = ['$q', '$ionicHistory', '$scope', '$state', '$stateParams', '$timeout', '$ionicTabsDelegate', 'MarginOptimizerServiceOne', '$ionicPopup', 'Utils', '$rootScope', '$ionicPopover', 'CommonService', '$ionicScrollDelegate', 'ErrorReportingServiceOne', '$ionicListDelegate', 'TaskCreationServiceOne', '$ionicLoading','supportToolService'];

  	function recipeCostTrackingCtrl($q, $ionicHistory, $scope, $state, $stateParams, $timeout, $ionicTabsDelegate, MarginOptimizerServiceOne, $ionicPopup, Utils, $rootScope, $ionicPopover, CommonService, $ionicScrollDelegate, ErrorReportingServiceOne, $ionicListDelegate, TaskCreationServiceOne, $ionicLoading,supportToolService) {
		// console.log("called recipe ctrl")
		$scope.showLoader = false;
		$scope.businessList = [];
		$scope.text = {"searchData" : "" }
		$scope.$watch('text.searchData',function(value){
			$scope.text.searchData = value;
		},true)
		$scope.setBusiness = function(item, type, index) {
			angular.element(document.querySelectorAll('#my_biz')).triggerHandler('click');
		}
		$scope.toggleGrp = function(grp){
	      grp.isExpanded = !grp.isExpanded;
	      // console.log($scope.supllierList);
	    }
		$scope.shoutLoud = function(newValue, oldValue) {
			$scope.showLoader = true;
		 	$scope.current_selected = newValue;
		 	serviceReqData ={
				"businessId" : $scope.current_selected.businessId,
				"businessStoreId" : $scope.current_selected.businessStoreId
			}
		  CommonService.getPriceRecipeDetails(responseData,serviceReqData)
		};
		$scope.loginData = JSON.parse(localStorage.getItem('login'));
		$scope.current_selected = $scope.loginData;
		supportToolService.fetchAllBusiness($scope.loginData).then(function(biz) {
		    $scope.businessList = biz.items;
		    // console.log('business',$scope.businessList)
		});
		$scope.invItemIdList = [];
		var responseData = function(data) {
			$scope.pricerecipedata = data.items[0];
			$scope.pricerecipedata.push({
				"bId" : "C1B0F7E7",
				"storeId" : "0",
				"InventoryItemId" : "INV1",
				"Category" :"COOLER WALK IN BY PHONE",
				"InventoryUnit" : "cs - case",
				"InventoryPrice" : "10.00",
				"InvoiceUnit" : "cs - case",
				"InvoicePrice" : "10.00",
				"SupplierId" : "S37",
				"SupplierItemId" : "8866378",
				"InvoiceId" : "INV197",
				"Status" : "inactive",
				"buttonColor": false
			})
			$scope.showLoader = true;
			_.forEach($scope.pricerecipedata,function(item){
				$scope.invItemIdList.push(item.InventoryItemId)
			})
			$scope.fetchSupplier();
		}
		var serviceReqData ={
			"businessId" : $scope.current_selected.businessId,
			"businessStoreId" : $scope.current_selected.businessStoreId
		}
		CommonService.getPriceRecipeDetails(responseData,serviceReqData)
		$scope.fetchSupplier = function(){
	      // console.log($scope.invItemIdList);
	      function arrUnique(arr) {
	        var cleaned = [];
	        arr.forEach(function(itm) {
	          var unique = true;
	          cleaned.forEach(function(itm2) {
	            if (_.isEqual(itm, itm2)) unique = false;
	          });
	          if (unique) cleaned.push(itm);
	        });
	        return cleaned;
	      }
	      CommonService.fetchSupplierItemWeb(function(response){
	        // console.log("supplier response is");
	        $scope.supllierList = response.data.data;
	        // console.log($scope.supllierList);
	        _.forEach($scope.pricerecipedata,function(ing,i){
	          ing.supList = [];
	          ing.buttonColor = false;
	          _.forEach($scope.supllierList,function(sup,j){
	            if(ing.InventoryItemId == sup.Inv_item_id){
	              // console.log(i);
	              ing.supList.push(sup);
	              ing.buttonColor = true;
	              ing.supList = arrUnique(ing.supList)
	            }
	          });

	        });
	        // console.log($scope.ingredientsData);

	      }, $scope.invItemIdList);
	    } 
	}
})();