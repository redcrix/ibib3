(function () {
    'use strict'
    projectCostByte.controller('InvoiceConfigCtrl', InvoiceConfigCtrl);

    InvoiceConfigCtrl.$inject = ['$q', '$scope', '$state', '$filter', '$location', '$ionicSideMenuDelegate',
        '$rootScope', 'CommonService', 'CommonConstants', 'Utils', '$cordovaCamera', '$cordovaFileTransfer',
        'DocumentSelectionService', '$ionicLoading', '$ionicActionSheet', '$ionicModal', '$window','PlTrackerService','$timeout',
        '$stateParams','$ionicPopup','appModalService','MarginOptimizerServiceOne','MenuEngineeringServiceOne','LaborOptimizerService','$ionicPlatform','$ionicHistory'
    ];

    function InvoiceConfigCtrl($q, $scope, $state, $filter, $location, $ionicSideMenuDelegate, $rootScope,
        CommonService, CommonConstants, Utils, $cordovaCamera, $cordovaFileTransfer,
        DocumentSelectionService, $ionicLoading, $ionicActionSheet, $ionicModal, $window,PlTrackerService,$timeout,$stateParams,$ionicPopup,appModalService,MarginOptimizerServiceOne,MenuEngineeringServiceOne,LaborOptimizerService,$ionicPlatform,$ionicHistory) {
        $scope.spinnerShow = false;
      	$scope.tabDataSpinnerHide = false;
      	$scope.toBeMappedItems = [];
      	$scope.mappedItems = [];
      	$scope.PnLOptionsChunks = [];
      	var serviceRequestData = {};
      	$scope.searchText="";
      	$scope.selectedTab = 'toCategorise';
      	$scope.showTabs=false;
        $rootScope.regenerateSummary = true;
      $scope.periodDetailSelection = function () {
            if (angular.isDefined($scope.periodList)) {
                var selectedPeriod = {};
                _.each($scope.periodList, function(p, pIndex) {
                    if(angular.isDefined($rootScope.globalSelectedPeriod) && p.text == $rootScope.globalSelectedPeriod.text) {
                        p = $rootScope.globalSelectedPeriod;
                        selectedPeriod = p;
                    } else if(!angular.isDefined($rootScope.globalSelectedPeriod)) {
                        if(pIndex == $scope.periodList[$scope.periodList.length - 1]) {
                            p.selected = true
                            $rootScope.globalSelectedPeriod = p;
                            selectedPeriod = p;
                        }
                    }
                })
                return selectedPeriod.text;
            }
            return ""
        }
        var setPeriodData = function(yearData) {
            $scope.periodList = [];
            for(var i=0; i < $scope.completePeriodList.length; i++) {
                if(yearData.text === $scope.completePeriodList[i].year) {
                    $scope.periodList.push($scope.completePeriodList[i]);
                }
            }
            if(angular.isDefined($rootScope.globalSelectedPeriod)) {
                _.each($scope.periodList, function(p, pIndex) {
                    if(p.text === $rootScope.globalSelectedPeriod.text) {
                        p.selected = true;
                    }
                })
            } else if (!(_.find($scope.periodList, ['selected', true])))  {
                $scope.periodList[$scope.periodList.length - 1].selected = true;
                $rootScope.globalSelectedPeriod = $scope.periodList[$scope.periodList.length - 1];
            } else {
                let periodSelected = _.find($scope.periodList, ['selected', true]);
                $rootScope.globalSelectedPeriod = periodSelected;
            }
        }
        var setPandYdata = function(periodDataList) {
            $scope.periodList = [];
            $scope.yearList = [];
            var unique = {};
            var temp = "";
            var insertIndex = 0;
            for(var i=0; i < periodDataList.length; i++) {
                if (!unique[periodDataList[i].year]) {
                    $scope.yearList.push({text:periodDataList[i].year, selected:periodDataList[i].selected});
                    unique[periodDataList[i].year] = periodDataList[i];
                }
                if(angular.isDefined($rootScope.globalSelectedYear)) {
                    temp = $rootScope.globalSelectedYear;
                } else if(periodDataList[i].selected) {
                    temp = periodDataList[i].year;
                    $rootScope.globalSelectedYear = temp;
                    $rootScope.globalSelectedPeriod = periodDataList[i];
                }
            }
            for(var i=0; i < $scope.yearList.length; i++) {
                if($scope.yearList[i].text === temp) {
                    $scope.yearList[i].selected = true;
                    for(var j=0; j < periodDataList.length; j++) {
                        if(temp === periodDataList[j].year) {
                            $scope.periodList[insertIndex] = periodDataList[j];
                            insertIndex ++
                        }
                    }
                }
            }
            if(angular.isDefined($scope.periodList)) {
                _.each($scope.periodList, function(p){
                    if(p.text == $rootScope.globalSelectedPeriod.text) {
                        p.selected = true;
                    }
                })
            }
        }
        $scope.showPeriod = function () {
          // console.log($scope.periodList);
            if(!$rootScope.isChagesExist) {
                if ($scope.periodSelection === 'Period') {
                    var hideSheet = $ionicActionSheet.show({
                        buttons: $scope.periodList,
                        titleText: '<h4><center>Select Period</center></h4>',
                        cancelText: 'Cancel',
                        cancel: function () {
                        },
                        buttonClicked: function (index) {
                            _.each($scope.periodList, function (p, pIndex) {
                                if (index === pIndex) {
                                    p.selected = true;
                                    $rootScope.globalSelectedPeriod = p;
                                    $rootScope.globalSelectedPeriodIndex = undefined;
                                    $timeout(setWeeksFilterButtons, 1);
                                } else {
                                    p.selected = false;
                                }
                            });
                            return true;
                        }
                    });
                }
                var myEl = angular.element(document.querySelector('.action-sheet-group'));
                myEl.css('overflow-y', 'scroll');
                myEl.css('max-height', (window.innerHeight - 50) + 'px');
                myE1.css('max-width', (window.innerWidth - 120) + 'px');
            }else {
                $rootScope.discardChangesFrom.name = 'showPeriodClick';
                $rootScope.discardChangesFrom.value = null;
                if (modal_shown) {
                    modal_shown = appModalService.show('application/invoice-tracking/view/configConfirmation.html', 'ConfigConfirmationCtrl',$rootScope.discardChangesFrom)
                }
                return modal_shown
            }
        };
        $scope.initializeView = function () {
            // console.log("iiii99")
            // $scope.onLoad();
            $rootScope.isChagesExist = false;
            $scope.periodSelection = 'Period';
            $scope.headerShow = true;
            $scope.config = false;
            $scope.isItemMapped = false;
            PlTrackerService.fetchPeriodWeeksWithData()
            .then(function (periodListWithData) {
                $scope.completePeriodList = periodListWithData;
                setPandYdata(periodListWithData);
                $timeout(setWeeksFilterButtons, 1);
            });
            if($rootScope.refreshSummary){
                $rootScope.regenerateSummary = false;
               
                $rootScope.$broadcast('summaryRefresh')
            }
        };

        $scope.yearDetailSelection = function () {
            if (angular.isDefined($scope.yearList)) {
                let selectedYear = _.find($scope.yearList, ['selected', true]);
                return selectedYear.text;
            }
            return ""
        }
        $scope.showYear = function() {
            if(!$rootScope.isChagesExist) {
                var hideYearSheet = $ionicActionSheet.show({
                    buttons: $scope.yearList,
                    titleText: '<h4><center>Select a Year</center></h4>',
                    cancelText: 'Cancel',
                    cancel: function () {
                    },
                    buttonClicked: function (index) {
                        _.each($scope.yearList, function (y, yIndex) {
                            if (index === yIndex) {
                                y.selected = true;
                                $rootScope.globalSelectedYear = y.text;
                                $rootScope.globalSelectedPeriod = undefined;
                                $rootScope.globalSelectedPeriodIndex = undefined;
                                setPeriodData(y);
                                $timeout(setWeeksFilterButtons, 1);
                            } else {
                                y.selected = false;
                            }
                        });
                        return true;
                    }
                });
                var myE2 = angular.element(document.querySelector('.action-sheet-group'));
                myE2.css('overflow-y', 'scroll');
                myE2.css('max-height', (window.innerHeight - 50) + 'px');
                myE2.css('max-width', (window.innerWidth - 120) + 'px');
            }else {
                $rootScope.discardChangesFrom.name = 'showYearClick';
                $rootScope.discardChangesFrom.value = null;
                if (modal_shown) {
                    // console.log("showing conversion");
                    modal_shown = appModalService.show('application/invoice-tracking/view/configConfirmation.html', 'ConfigConfirmationCtrl',$rootScope.discardChangesFrom)
                }
                return modal_shown
            }
        };

        var setWeeksFilterButtons = function (periodItem) {
            return $q(function (resolve, reject) {
                if (angular.isDefined($scope.periodList)) {
                    let periodItem = _.find($scope.periodList, ['selected', true]);
                    let buttons = _.transform(periodItem.periodWeeks, function (result, periodWeek, index) {
                        periodWeek.style = '';
                        result.push(periodWeek)
                    });
                    let selectedWeekButton = _.findIndex(buttons, ['selected', true]);
                    if(angular.isDefined($rootScope.globalSelectedPeriodIndex)) {
                        selectedWeekButton = $rootScope.globalSelectedPeriodIndex
                    } else if (selectedWeekButton === -1) {
                        selectedWeekButton = 0;
                        $rootScope.globalSelectedPeriodIndex = selectedWeekButton;
                    }
                    $scope.filterButtons = buttons;
                    $scope.filterbuttonclick(selectedWeekButton);
                    resolve(true)
                }

            })

        };
        var modal_shown = true;
        $rootScope.discardChangesFrom ={
            'name' :'',
            'value' : null
        }
        $scope.filterbuttonclick = function (filterbuttonindex) {
          if($rootScope.isChagesExist == false) {
              // console.log('$scope.filterbuttonclick*****',filterbuttonindex);
              $scope.isItemMapped = false;
                $rootScope.invoiceData.searchText = '';
                $scope.spinnerHide = false;
                _.each($scope.filterButtons, function (button, index) {
                    if (index === filterbuttonindex) {
                        $rootScope.globalSelectedPeriodIndex = index;
                        button.selected = true;
                    } else {
                        button.selected = false;
                    }
                });
                $rootScope.$broadcast('suppliersPageUpdate');
                $scope.showTabs=true;
                $scope.selectedPeriod = $scope.filterButtons[filterbuttonindex].periodWeekTag;
                if($rootScope.isFromStateParams) { 
                    $scope.supplierDataResponseHandler($stateParams.inputParams);
                } else {
                    $scope.fetchInvoiceConfigItems($scope.selectedPeriod);
                }
                $scope.$broadcast('BUSY');
            }else {
                $rootScope.discardChangesFrom.name = 'filterbuttonclick';
                $rootScope.discardChangesFrom.value = filterbuttonindex;
                if (modal_shown) {
                    // console.log("showing conversion");
                    modal_shown = appModalService.show('application/invoice-tracking/view/configConfirmation.html', 'ConfigConfirmationCtrl',$rootScope.discardChangesFrom)
                }
                return modal_shown
                
                
            }
        };

        $scope.periodClickHandler = function () {
            $scope.periodSelection = 'Period';
            $scope.headerShow = true;
            $scope.config = false;
            $rootScope.showSearchBtn = false;
        };
        $scope.setInventory = function(inv){
            // console.log('********',angular.copy(inv));
          $rootScope.current_selected = inv;
            // $timeout(function(){
            //    angular.element(document.querySelectorAll('#pnlCat')).triggerHandler('click');
            // },200);

      }
      $scope.isItemCatSelected = false; 
      $scope.setInventoryMapped = function(inv){
          inv.isItemSelected = false;
          $scope.isItemCatSelected = false;
        // console.log('********',angular.copy(inv));
        $rootScope.current_selected = inv;
        if(inv.isItemSelected) {
            $scope.isItemCatSelected = true;
        }
          // $timeout(function(){
          //    angular.element(document.querySelectorAll('#pnLCat')).triggerHandler('click');
          // },200);

      }
      $rootScope.$on('isCatItemSelected',function(evnt,data) {
          if(data.isItemSelected) {
            data.isItemCatSelected = true;
            $rootScope.isChagesExist = true;
        }
      })
      // $scope.shoutLoud = function(newValue , oldValue){
      //   var CatValue=newValue.split("::");
      //   $scope.current_selected.selectedOption = newValue;
      //   $scope.current_selected.minorCategory= CatValue[1];
      //   $scope.current_selected.profitAndLossCategory = CatValue[0];
      //   $scope.current_selected.isUpdated = true;
      //
      // };
      // $scope.shoutLoudMapped = function(newValue , oldValue){
      //   var CatValue=newValue.split("::");
      //   $scope.current_selected.isUpdated=true;
      //   $scope.current_selected.selectedOption = newValue;
      //   $scope.current_selected.minorCategory= CatValue[1];
      //   $scope.current_selected.profitAndLossCategory = CatValue[0];
      // };
      	$scope.fetchInvoiceConfigItems =function(selectedPeriod){

      		$scope.toBeMappedItems = [];
            $scope.mappedItems = [];
      		if($scope.spinnerShow) {
      			$scope.tabDataSpinnerHide = false;
      		}
        	DocumentSelectionService.fetchInvoiceConfigItems(selectedPeriod).then(function (data) {
            	$scope.supplierDataResponseHandler(data);
        	});
        }
         $scope.regenrateRes = function(data){
            // console.log("data",data)
            if(data.response) {
                toastMessage("Summary updated successfully",3000);
            }else {
            }
        }
    	$scope.supplierDataResponseHandler = function(getSupItems){
            $scope.pnLItems = getSupItems;
            $scope.spinnerShow=true;
            $scope.tabDataSpinnerHide = true;
            $scope.dataReceived = true;
            $scope.mappedDataReceived=true;
            $scope.supplierItems = [];
            $scope.toBeMappedItems = [];
            $scope.mappedItems = [];
            $scope.minorCategories=[];
            $scope.minorCategories=getSupItems.minor_categories;
            $scope.groupedList = [];
            _.forEach($scope.minorCategories, function(value,i) {
              $scope.groupedList.push({
                "name": i,
                "optionList": value
              })
            });
            // console.log($scope.groupedList,$scope.minorCategories)
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
            while($scope.toBeMappedItems.length>0){
              $scope.toBeMappedItems.pop();
            }
            while($scope.mappedItems.length>0){
              $scope.mappedItems.pop();
            }
            var checkItem = _.each($scope.supplierItems,  function(supplier){
              	var pushData = _.find($scope.toBeMappedItems, function(o) {
                    return o.supItemId == supplier.supItemId;
              	});
              	var pushMappedData = _.find($scope.mappedItems, function(o) {
                    return o.supItemId == supplier.supItemId;
              	});

              	var cnt = _.sumBy($scope.supplierItems, function(o) { return o.supItemAlias == supplier.supItemAlias && o.supplier == supplier.supplier && o.supItemId == supplier.supItemId ? 1 : 0; });
                if(supplier.supItemAlias != "" && (supplier.minorCategory == "" || supplier.profitAndLossCategory == "" || supplier.minorCategory == "NONE") && !pushData){

                    $scope.toBeMappedItems.push(supplier);
                    if($scope.toBeMappedItems.length==0){
                    	$scope.spinnerShow=true;
		            	$scope.tabDataSpinnerHide = true;
		            	$scope.dataNotReceived = true;
                    }
                }
                if(supplier.supItemAlias != "" && supplier.minorCategory != "" && supplier.profitAndLossCategory != "" && supplier.minorCategory != "NONE" && !pushMappedData){
                    supplier.selectedOption = "";
                    // profitAndLossCategory
                    supplier.selectedOption = (supplier.profitAndLossCategory).toUpperCase()+'::'+(supplier.minorCategory).toUpperCase();
                    if(cnt == 1) {
	                    $scope.mappedItems.push(supplier);
	                    if($scope.mappedItems.length<=0){
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
            if($scope.isItemMapped) {
                var confirmPopup = $ionicPopup.confirm({
                        template: 'Do you want to Regenerate summary?',
                        okText: "Ok",
                        okType: "button-balanced",
                });
                confirmPopup.then(function(res) {
                    if (res) {
                        toastMessage("Regenerating summary .....",6000)
                        CommonService.getRegenerateSummaryChanges($scope.regenrateRes,$scope.selectedPeriod)
                    } else {}
                });
            }
            $rootScope.isFromStateParams = false;
        }
        $scope.switchTab = function(type) {
            $scope.dataNotReceived=false;
            $scope.searchText = '';
            $scope.invoiceToFilter.text ='';
          	if($scope.selectedTab != type) {
          		$scope.selectedTab = type;
          	}
            // console.log($scope.selectedPeriod);
            // $scope.fetchInvoiceConfigItems($scope.selectedPeriod);
        }

        $scope.toBeCatPnLOptionClick = function (pnLOption,item,id) {
            pnLOption.selected = !pnLOption.selected;
            item.minorCategory = (item.selectedName == pnLOption.name) ? '' : pnLOption.name;
            item.selectedName = (item.selectedName == pnLOption.name) ? '' : pnLOption.name;
        };

        $scope.catPnLOptionClick = function (pnLOption,item,id) {
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
            var element = angular.element(document.querySelectorAll('#my-float-pnl'));
            $scope.dataReceived = false;
            $scope.mappedDataReceived=false;
            $scope.spinnerShow=false;
            // element[0].style.pointerEvents = 'none';
            var finalItems;
            var finalItems = $scope.mappedItems.concat($scope.toBeMappedItems);
                    $scope.fetchItem = _.filter(finalItems,  function(supplier){
                      var returnElement;
                      if(supplier.isUpdated) {
                          returnElement = supplier.isUpdated;
                      }
                      return returnElement;
                  })
            // console.log("$scope.fetchItem.length",$scope.fetchItem.length);
            if($scope.fetchItem.length){
              	serviceRequestData = {
                    pnlItems: $scope.fetchItem
                };
              	CommonService.postPnLMapping(mapPnLResponse,serviceRequestData);
            } else{
                toastMessage("oops! nothing to map.", 2000);
                $scope.spinnerShow=true;
                $scope.tabDataSpinnerHide = true;
                $scope.dataReceived = true;
                $scope.mappedDataReceived=true;
                document.getElementById("my-float-pnl").style.pointerEvents = "auto";
            }
        }

       
        var mapPnLResponse = function(getMapPnL){
            $rootScope.refreshSummary = false;
          	_.forEach($scope.fetchItem, function(value) {
                value.selectedOption = {};
                value.selectedOption.selected = false;
                value.selectedOption.name = (value.minorCategory).toUpperCase();
         	});
          	if(getMapPnL.success || getMapPnL.response){
                  $scope.isItemMapped = true;
          		toastMessage("P&L item mapped.", 4000);
                  $rootScope.isChagesExist = false;
                $rootScope.regenerateSummary = false;
                $rootScope.refreshSummary = true;
                _.forEach($rootScope.checkForDisable,function(item,index) {
                    $rootScope.checkForDisable[index].isDisable = false;
                })
                
          	} else {
          		toastMessage("something went wrong.", 2000);
          	}
          	$scope.fetchInvoiceConfigItems($scope.selectedPeriod);
          	// document.getElementById("my-float-pnl").style.pointerEvents = "auto";
        }

        $scope.minorCatItemSelected = function(data) {
            // console.log("data",data)
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
        $scope.closeModalCtrl = function (result) {
            $scope.closeModal({
                'modal': 'closed'
            })
        }
        $rootScope.$on('saveChangesClled',function(evnt,data) {
            var finalItems;
            var finalItems = $scope.mappedItems.concat($scope.toBeMappedItems);
                    $scope.fetchItem = _.filter(finalItems,  function(supplier){
                      var returnElement;
                      if(supplier.isUpdated) {
                          returnElement = supplier.isUpdated;
                      }
                      return returnElement;
                  })
            if ($scope.fetchItem.length) {
                $scope.save();
            }
            $rootScope.isChagesExist = false;
        })
        $rootScope.$on('discardChangesFromClled',function(evnt,data) {
            // console.log("on called",$rootScope.discardChangesFrom);
            $rootScope.isChagesExist = false;
            if(data.name == 'filterbuttonclick') {
                $scope.filterbuttonclick(data.value);
            }else if(data.name == 'showYearClick') {
                $scope.showYear();
            }else if(data.name == 'showPeriodClick') {
                $scope.showPeriod();
            }else if(data.name == 'invoiceTrackingCalled') {
                $state.go($rootScope.discardChangesFrom.value);
            }else if(data.name == 'invoiceConfigCalled') {
                $state.go($rootScope.discardChangesFrom.value);
            }else if(data.name == 'invoiceSummaryCalled') {
                $state.go($rootScope.discardChangesFrom.value);
            }else if(data.name == 'orgDashboardClickHandler') {
                $state.go($rootScope.discardChangesFrom.value);
            }else if(data.name == 'dashboardClickHandler') {
                $state.go($rootScope.discardChangesFrom.value);
            }else if(data.name == 'marginoptimizer2ClickHandler') {
                $state.go($rootScope.discardChangesFrom.value + MarginOptimizerServiceOne.fetchSelectedMenuType('key'));
            }else if(data.name == 'modManagerClickHandler') {
                $state.go($rootScope.discardChangesFrom.value);
            }else if(data.name == 'menuengineeringClickHandler') {
                $state.go($rootScope.discardChangesFrom.value + MenuEngineeringServiceOne.fetchSelectedMenuType('key'));
            }else if(data.name == 'prepManagerClickHandler') {
                $state.go($rootScope.discardChangesFrom.value);
            }else if(data.name == 'inventoryManagerClickHandler') {
                $state.go($rootScope.discardChangesFrom.value);
            }else if(data.name == 'documentUploadClickHandler') {
                $state.go($rootScope.discardChangesFrom.value);
            }else if(data.name == 'uploadClickHandler') {
                $state.go($rootScope.discardChangesFrom.value);
            }else if(data.name == 'inventoryToolClickHandler') {
                $state.go($rootScope.discardChangesFrom.value);
            }else if(data.name == 'plTrackerClickHandler') {
                $state.go($rootScope.discardChangesFrom.value);
            }else if(data.name == 'laborOptimizerClickHandler') {
                $state.go($rootScope.discardChangesFrom.value + LaborOptimizerService.fetchSelectedLaborType());
            }else if(data.name == 'operationsClickHandler') {
                $state.go($rootScope.discardChangesFrom.value);
            }else if(data.name == 'weekPriceChangeClickHandler') {
                $state.go($rootScope.discardChangesFrom.value);
            }else if(data.name == 'recipeCostTrackingClickHandler') {
                $state.go($rootScope.discardChangesFrom.value);
            }else if(data.name == 'invoiceEntryClickHandler') {
                $state.go($rootScope.discardChangesFrom.value);
            }
        })
        // $scope.onLoad = function() {
        //     console.log("onLoad function called");
        //     document.addEventListener("deviceready", onDeviceReady, false);
        // } 
        // function onDeviceReady() {
        //     console.log("onDeviceReady function called")
        //     // Register the event listener
        //     document.addEventListener("backbutton", onBackKeyDown, false);
        // }
        // function onKeyDown(keyCode, event)  {
        //     if (Integer.parseInt(android.os.Build.VERSION.SDK) > 5
        //             && keyCode == KeyEvent.KEYCODE_BACK
        //             && event.getRepeatCount() == 0) {
        //         Log.d("CDA", "onKeyDown Called");
        //         onBackPressed();
        //         return true; 
        //     }
        //     return super.onKeyDown(keyCode, event);
        // }
        var isBackButton = $ionicPlatform.registerBackButtonAction(function (event) {
                // console.log("register fun")
                $rootScope.$on('$stateChangeSuccess', function (ev, to, toParams, from, fromParams) {
                   //assign the "from" parameter to something
                   $rootScope.previousState = from.name
                   // console.log("$stateChangeSuccess",ev,"to", to,"toParams", toParams,"from", from,"fromParams", fromParams)
                });
              if($rootScope.isChagesExist) {
                // $rootScope.$on('$stateChangeSuccess', function (ev, to, toParams, from, fromParams) {
                   //assign the "from" parameter to something
                   
                   // console.log("called",$rootScope.previousState)
                   if($rootScope.previousState == 'app.invoices.summary') {
                       $rootScope.discardChangesFrom.name = 'invoiceSummaryCalled';
                       $rootScope.discardChangesFrom.value = $rootScope.previousState;
                   }else if($rootScope.previousState == 'app.invoices.trackings') {
                       $rootScope.discardChangesFrom.name = 'invoiceTrackingCalled';
                       $rootScope.discardChangesFrom.value = $rootScope.previousState;
                   }
                   // console.log("$stateChangeSuccess",ev,"to", to,"toParams", toParams,"from", from,"fromParams", fromParams)
                // });
                
                if (modal_shown) {
                    // console.log("modal_shown",$rootScope.discardChangesFrom)
                    modal_shown = appModalService.show('application/invoice-tracking/view/configConfirmation.html', 'ConfigConfirmationCtrl',$rootScope.discardChangesFrom)
                } 
                return modal_shown
                event.preventDefault();
                event.stopPropagation();
            }else {
                $ionicHistory.goBack();
            }
        }, 501);
        

	}
})();
