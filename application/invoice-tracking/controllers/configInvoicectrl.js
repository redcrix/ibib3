(function () {
    'use strict'
    projectCostByte.controller('InvoiceConfigCtrl', InvoiceConfigCtrl);

    InvoiceConfigCtrl.$inject = ['$q', '$scope', '$state', '$filter', '$location', '$ionicSideMenuDelegate',
        '$rootScope', 'CommonService', 'CommonConstants', 'Utils', '$cordovaCamera', '$cordovaFileTransfer',
        'DocumentSelectionService', '$ionicLoading', '$ionicActionSheet', '$ionicModal', '$window','PlTrackerService'

    ];

    function InvoiceConfigCtrl($q, $scope, $state, $filter, $location, $ionicSideMenuDelegate, $rootScope,
        CommonService, CommonConstants, Utils, $cordovaCamera, $cordovaFileTransfer,
        DocumentSelectionService, $ionicLoading, $ionicActionSheet, $ionicModal, $window,PlTrackerService) {

    	console.log("config controller called");
    	$scope.spinnerShow = false;
    	$scope.tabDataSpinnerHide = false;
    	$scope.toBeMappedItems = [];
      	$scope.mappedItems = [];
      	$scope.PnLOptionsChunks = [];
      	var serviceRequestData = {};
      	$scope.searchText="";
      	$scope.selectedTab = 'toCategorise';
      	$scope.showTabs=false;
        $scope.$on('GETINVOICEFORPERIOD', function (event, period) {
            console.log("GETINVOICEFORPERIOD in summaryInvoice : ", period);
            $rootScope.$broadcast('suppliersPageUpdate');
            $scope.showTabs=true;
            $scope.selectedPeriod = period;
            $scope.fetchInvoiceConfigItems(period);
            $scope.$broadcast('BUSY');

        });
      	$scope.fetchInvoiceConfigItems =function(selectedPeriod){
      		$scope.toBeMappedItems = [];
            $scope.mappedItems = [];
      		console.log("$scope.spinnerShow : ", $scope.spinnerShow, $scope.tabDataSpinnerHide)
      		if($scope.spinnerShow) {
      			$scope.tabDataSpinnerHide = false;
      		}
        	DocumentSelectionService.fetchInvoiceConfigItems(selectedPeriod).then(function (data) {
          		console.log("data after saving : ", data);
            	$scope.pnLItems = data;
            	$scope.supplierDataResponseHandler(data);
        	});
        }
    	$scope.supplierDataResponseHandler = function(getSupItems){
            console.log('supplierDataResponseHandler.....', getSupItems)
            $scope.spinnerShow=true;
            $scope.tabDataSpinnerHide = true;
            $scope.dataReceived = true;
            $scope.mappedDataReceived=true;
            $scope.supplierItems = [];
            $scope.toBeMappedItems = [];
            $scope.mappedItems = [];
            _.each(getSupItems.supItems,function(data){
                var pushData = _.find($scope.supplierItems, function(o) {
                    if(o.supItemAlias == data.supItemAlias && o.supplier == data.supplier && data.tableType != "UnknownBusinessSupplierItemsData"){
                      return true;
                    }
                });
                if(!pushData){
                  	$scope.supplierItems.push(data);
                }
            });

            var checkItem = _.each($scope.supplierItems,  function(supplier){
              	let options =[
                    {"id":0,"name":"FOOD","selected":false,"buttonStyle":"button-out"},
                    {"id":1,"name":"BEVERAGE","selected":false,"buttonStyle":"button-out"},
                    {"id":2,"name":"SUPPLIES","selected":false,"buttonStyle":"button-out"},
                    {"id":3,"name":"BEER","selected":false,"buttonStyle":"button-out"},
                    {"id":4,"name":"SPIRITS","selected":false,"buttonStyle":"button-out"},
                    {"id":5,"name":"WINE","selected":false,"buttonStyle":"button-out"}
                ];
              	var pushData = _.find($scope.toBeMappedItems, function(o) {
                    return o.supItemId == supplier.supItemId;
              	});
              	var pushMappedData = _.find($scope.mappedItems, function(o) {
                    return o.supItemId == supplier.supItemId;
              	});

              	var cnt = _.sumBy($scope.supplierItems, function(o) { return o.supItemAlias == supplier.supItemAlias && o.supplier == supplier.supplier && o.supItemId == supplier.supItemId ? 1 : 0; });
                if(supplier.supItemAlias != "" && (supplier.minorCategory == "" || supplier.minorCategory == "NONE") && !pushData){
                    $scope.toBeMappedItems.push(supplier);
                    if($scope.toBeMappedItems.length<=0){
                    	$scope.spinnerShow=true;
		            	$scope.tabDataSpinnerHide = true;
		            	$scope.dataNotReceived = true;
                    }
                }
                if(supplier.supItemAlias != "" && supplier.minorCategory != "" && supplier.minorCategory != "NONE" && !pushMappedData){
                    supplier.selectedOption = {};
                    supplier.selectedOption.name = (supplier.minorCategory).toUpperCase();
                    if(cnt == 1) {
	                    let index = _.findIndex(options, function(opt) {
	                        return opt.name === supplier.selectedOption.name;
	                    });

	                    options[index].selected = true;
	                    options[index].buttonStyle = 'button-bal';

	                    supplier.PnLOptionsChunks = _.chunk(options, 3);
	                    $scope.mappedItems.push(supplier);
	                    console.log("$scope.mappedItems",$scope.mappedItems);
	                    if($scope.mappedItems.length<=0){
	                    	console.log("$scope.mappedItems.length",$scope.mappedItems.length);
	                    	$scope.spinnerShow=true;
			            	$scope.tabDataSpinnerHide = true;
			            	$scope.dataNotMappedReceived = true;
                    	}
                    }
                }

            })
            $scope.toBeMappedItems = _.filter($scope.toBeMappedItems,function(toMap){
              	return toMap.supItemAlias
            })

        }
      	$scope.fetchInvoiceConfigItems($scope.selectedPeriod);
        $scope.switchTab = function(type) {
          	if($scope.selectedTab != type) {
          		console.log("switching tab from : ", $scope.selectedTab, type);
          		$scope.fetchInvoiceConfigItems($scope.selectedPeriod);
          		$scope.selectedTab = type;
          	}
        }

        $scope.toBeCatPnLOptionClick = function (pnLOption,item,id) {
            pnLOption.selected = !pnLOption.selected;
            item.minorCategory = (item.selectedName == pnLOption.name) ? '' : pnLOption.name;
            item.selectedName = (item.selectedName == pnLOption.name) ? '' : pnLOption.name;
        };

        $scope.catPnLOptionClick = function (pnLOption,item,id) {
        	console.log("catPnLOptionClicked")
            item.isUpdated = true;
            let union = _.union(item.PnLOptionsChunks[0], item.PnLOptionsChunks[1]);
            let pnlcat = false;
            _.each(union, function(opt,i) {
              	opt.selected = (opt.id == id) ? !opt.selected : false;
              	opt.buttonStyle = opt.selected ? "button-bal" : "button-out";
              	if(opt.selected)
                	pnlcat  = pnLOption.name;

              	if(union.length == i+1){
                	item.minorCategory = pnlcat ? pnlcat : '';
              	}
            });
        };
        var toastMessage = function (message_text, duration) {
          if (typeof duration === 'undefined') duration = 1500;
          $ionicLoading.show({
              template: message_text,
              noBackdrop: true,
              duration: duration
          });
        };

      	$scope.pAndLItems =[
            {"id":1,"name":"FOOD","selected":false,"buttonStyle":"button-out"},
            {"id":2,"name":"BEVERAGE","selected":false,"buttonStyle":"button-out"},
            {"id":3,"name":"SUPPLIES","selected":false,"buttonStyle":"button-out"},
            {"id":4,"name":"BEER","selected":false,"buttonStyle":"button-out"},
            {"id":5,"name":"SPIRITS","selected":false,"buttonStyle":"button-out"},
            {"id":6,"name":"WINE","selected":false,"buttonStyle":"button-out"}
      	];
        var chunkLength = 3;
        if ($scope.pAndLItems.length > 3) {
            chunkLength = 3;
        }
        $scope.PnLOptionsChunks = _.chunk($scope.pAndLItems, chunkLength);

        $scope.save = function(){
        	console.log("save called");
            var element = angular.element(document.querySelectorAll('#my-float-pnl'));
            $scope.dataReceived = false;
            $scope.mappedDataReceived=false;
            $scope.spinnerShow=false;
            element[0].style.pointerEvents = 'none';
            var finalItems;
            if($scope.selectedTab == 'categorised') {
              	finalItems = $scope.mappedItems;
            } else {
              	finalItems = $scope.toBeMappedItems;
            }
            console.log("$scope.selectedTab : ", $scope.selectedTab);
            $scope.fetchItem = _.filter(finalItems,  function(supplier){
                var returnElement;
                if($scope.selectedTab == 'categorised') {
                  	returnElement = supplier.isUpdated;
                } else {
                  	returnElement = supplier.minorCategory;
                }
                  return returnElement;
            })
            console.log($scope.fetchItem)
            if($scope.fetchItem.length){
              	serviceRequestData = {
                    pnlItems: $scope.fetchItem
                };
              	CommonService.postPnLMapping(mapPnLResponse,serviceRequestData);
                console.log(serviceRequestData)
            } else{
                toastMessage("oops! nothing to map.", 2000);
                $scope.dataReceived = true;
                document.getElementById("my-float-pnl").style.pointerEvents = "auto";
            }
        }

        var mapPnLResponse = function(getMapPnL){
          	_.forEach($scope.fetchItem, function(value) {
                value.selectedOption = {};
                value.selectedOption.selected = false;
                value.selectedOption.name = (value.minorCategory).toUpperCase();
         	});
          	if(getMapPnL.success || getMapPnL.response){
          		console.log("saved successfully")
          		toastMessage("P&L item mapped.", 4000);
          	} else {
          		toastMessage("something went wrong.", 2000);
          	}
          	$scope.fetchInvoiceConfigItems($scope.selectedPeriod);
          	document.getElementById("my-float-pnl").style.pointerEvents = "auto";
        }
      	$scope.invoiceToFilter = {
      		text :''
      	};
      	$scope.searchText='';
      	$scope.$watch('invoiceToFilter.text', function(newVal) {
            $scope.searchText = newVal;
        });
      	$scope.closeSearch = function(){
            $scope.invoiceToFilter.text = '';
         }

	}
})();
