(function () {
    var PandlMapConfig = function ($q,$ionicLoading,$timeout,$rootScope, $ionicTabsDelegate, PlTrackerService, CommonService) {
        return {
            restrict: 'E',
            // replace: true,
            scope: {
              items: '=',
              from: '='
            },
            bindToController: {
                items: '&'
            },
            controller: function () {

            },
            controllerAs: 'ctrl',
            templateUrl: 'application/inventory-management/directives/pandl-map-config.html',
            link: function (scope, ele, attr, controllers) {
      		    	scope.spinnerShow = false;
      		    	scope.tabDataSpinnerHide = false;
      		    	scope.toBeMappedItems = [];
                scope.mappedItems = [];
              	scope.PnLOptionsChunks = [];
              	var serviceRequestData = {};
              	scope.searchText="";
              	scope.selectedTab = 'toCategorise';


              	scope.fetchPnlInvItems = function() {
              		scope.toBeMappedItems = [];
		                scope.mappedItems = [];
              		if(scope.spinnerShow) {
              			scope.tabDataSpinnerHide = false;
              		}
              		PlTrackerService.fetchPnlInvItems().then(function (data) {
		                scope.item = data;
		                scope.supplierDataInvItemResponseHandler(data);
		            });
              	}
              	scope.fetchPnlInvItems();
                scope.setInventory = function(inv){
                  _.forEach(scope.groupedList,function(item){
                    if(item.isExpanded){
                      item.isExpanded = false;
                    }
                  })
                   $rootScope.current_selected = inv;
                   // let btn = angular.element(document.querySelectorAll('#PnLCat1'));
                   // let btnObj = btn[1]
                   //  $timeout(function(){
                   //     angular.element(btnObj).triggerHandler('click');
                   //  },200);
                }
                scope.setInventoryMapped = function(inv){
                  console.log('******')
                    // console.log(inv);
                    $rootScope.current_selected = inv;
                    console.log("")
                    $timeout(function(){
                       angular.element(document.querySelectorAll('#PnlCat')).triggerHandler('click');
                    },200);

                }
                scope.shoutLoud = function(newValue , oldValue){
                  var CatValue=newValue.split("::");
                  $rootScope.current_selected.selectedOption = newValue;
                  $rootScope.current_selected.minorCategory= CatValue[1];
                  $rootScope.current_selected.profitAndLossCategory = CatValue[0];
                  $rootScope.current_selected.isUpdated = true;

                };
                scope.shoutLoudMapped = function(newValue , oldValue){
                  var CatValue=newValue.split("::");
                  $rootScope.current_selected.isUpdated=true;
                  $rootScope.current_selected.selectedOption = newValue;
                  $rootScope.current_selected.minorCategory= CatValue[1];
                  $rootScope.current_selected.profitAndLossCategory = CatValue[0];

                };
                scope.newShoutReset = function(){
                };



	             scope.supplierDataInvItemResponseHandler = function(getSupItems){
	                scope.spinnerShow=true;
	                scope.tabDataSpinnerHide = true;
	                scope.dataReceived = true;
	                scope.mappedDataReceived=true
	                scope.supplierItems = [];
	                scope.toBeMappedItems = [];
	                scope.mappedItems = [];
                  scope.minorCategories=[];
                  scope.optVal=[];
                  scope.minorCategories=getSupItems.minor_categories;

                  scope.groupedList = [];
                  _.forEach(scope.minorCategories, function(value,i) {
                    _.forEach(value,function(item){
                      scope.optVal.push(item);
                    })
                    scope.groupedList.push({
                        "name": i,
                        "optionList": value
                      })

                  });
                  $rootScope.groupedListData = scope.groupedList;
                  // console.log(scope.groupedList);
	                _.each(getSupItems.supItems,function(supData){
	                    var pushData = _.find(scope.supplierItems, function(o) {
	                        if(o.inventory_item_id == supData.inventory_item_id){
	                          return true;
	                        }
	                    });

	                    if(!pushData){
	                      scope.supplierItems.push(supData);
	                    }
	                });
                  //-------------------------------------------------------------------------------------------------------


                scope.wholeSupplier = [];
	                _.each(scope.supplierItems,function(data){

		                // let options =[
		                //   	{"id":0,"name":"FOOD","selected":false,"buttonStyle":"button-out"},
		                //   	{"id":1,"name":"BEVERAGE","selected":false,"buttonStyle":"button-out"},
		                //   	{"id":2,"name":"SUPPLIES","selected":false,"buttonStyle":"button-out"},
		                //   	{"id":3,"name":"BEER","selected":false,"buttonStyle":"button-out"},
		                //   	{"id":4,"name":"SPIRITS","selected":false,"buttonStyle":"button-out"},
		                //   	{"id":5,"name":"WINE","selected":false,"buttonStyle":"button-out"}
		                // ];

		                if(data.profitAndLossCategory == "" || data.minorCategory == ""){
		                  	scope.toBeMappedItems.push(data);
                        if(scope.toBeMappedItems.length<=0){
                            scope.dataNotReceived=true;
                        }
		                } else {
  		                data.selectedOption = "";
                      // profitAndLossCategory
                      if(data.minorCategory)
                        data.selectedOption = (data.profitAndLossCategory).toUpperCase()+'::'+(data.minorCategory).toUpperCase();
                      else
                        data.selectedOption = "none"
		                    // let index = _.findIndex(options, function(opt) {
		                    //   return opt.name === data.selectedOption.name;
		                    // });
		                    scope.mappedItems.push(data);
		                }
                    // console.log(scope.mappedItems);

	                });
	            }

	            scope.switchTab = function(type) {
	              	if(scope.selectedTab != type) {
	              		scope.selectedTab = type;
	              	}
	            }
              scope.supplierDataResponseHandler = function(supplierItemsData) {

                  scope.dataReceived = true;

                  var my_supplier = supplierItemsData.supItems;

                  scope.originalItems = my_supplier;

                   scope.setArray(my_supplier);

                  scope.supplierItems = _.filter(my_supplier,  function(supplier){
                    if(supplier.supItems && (!supplier.invItemId || supplier.invItemId.length == 0)&& !supplier.saved && !supplier.isNA){
                      supplier.saved = false;
                      supplier.isUpdated = false;
                      supplier.isNA = false;
                      supplier.bg = "#eee";
                      supplier.color = "black";
                      supplier.convertion_factor = "";
                      supplier.conv_measurement_id = "";
                    }
                    return supplier.supItems && (!supplier.invItemId || supplier.invItemId.length == 0)
                  });

                };
              scope.invDataResponseHandler = function(invItems,supItemValues) {

                  scope.supplierDataResponseHandler(supItemValues);
                }
              scope.toBeMapClick = function(){
                  scope.map = true;
                  scope.dataReceived = false;
                   $rootScope.$broadcast('loader_set');
                  $timeout(function () {
                    scope.dataReceived = true;
                    $rootScope.$broadcast('loader_unset');
                  }, 400);
                   scope.mapped = false;
                }
              scope.mappedClick = function(){

                  scope.mapped = true;
                  scope.map = false;
                  scope.dataReceived = false;

                  $timeout(function () {
                    scope.dataReceived = true;
                  }, 400);
                }

	            // scope.toBeCatPnLOptionClick = function (pnLOption,item,id) {
	            //     pnLOption.selected = !pnLOption.selected;
	            //     item.profitAndLossCategory = (item.selectedName == pnLOption.name) ? '' : pnLOption.name;
	            //     item.selectedName = (item.selectedName == pnLOption.name) ? '' : pnLOption.name;
	            // };
              //
	            // scope.catPnLOptionClick = function (pnLOption,item,id) {
	            //     item.isUpdated = true;
	            //     let union = _.union(item.PnLOptionsChunks[0], item.PnLOptionsChunks[1]);
	            //     let pnlcat = false;
	            //     _.each(union, function(opt,i) {
	            //       	opt.selected = (opt.id == id) ? !opt.selected : false;
	            //       	opt.buttonStyle = opt.selected ? "button-bal" : "button-out";
	            //       	if(opt.selected)
	            //         	pnlcat  = pnLOption.name;
              //
	            //       	if(union.length == i+1){
	            //         	item.profitAndLossCategory = pnlcat ? pnlcat : '';
	            //       	}
	            //     });
	            // };
	            var toastMessage = function (message_text, duration) {
                  if (typeof duration === 'undefined') duration = 1500;
                  $ionicLoading.show({
                      template: message_text,
                      noBackdrop: true,
                      duration: duration
                  });
                };

              	// scope.pAndLItems =[
	              //   {"id":1,"name":"FOOD","selected":false,"buttonStyle":"button-out"},
	              //   {"id":2,"name":"BEVERAGE","selected":false,"buttonStyle":"button-out"},
	              //   {"id":3,"name":"SUPPLIES","selected":false,"buttonStyle":"button-out"},
	              //   {"id":4,"name":"BEER","selected":false,"buttonStyle":"button-out"},
	              //   {"id":5,"name":"SPIRITS","selected":false,"buttonStyle":"button-out"},
	              //   {"id":6,"name":"WINE","selected":false,"buttonStyle":"button-out"}
              	// ];
	            // var chunkLength = 3;
	            // if (scope.pAndLItems.length > 3) {
	            //     chunkLength = 3;
	            // }
	            // scope.PnLOptionsChunks = _.chunk(scope.pAndLItems, chunkLength);


              scope.setLoader = function(){
                scope.dataReceived = true;
                $rootScope.$broadcast('loader_unset');
              }
              scope.selectedOrDummy = function (pnlOption,item) {
                let buttonStyle = '';

                buttonStyle = buttonStyle + 'button-bal ';
                if (pnlOption.name !== item.selectedOption.name) {
                    buttonStyle = buttonStyle + 'button-out ';
                }
                return buttonStyle;
              };

	            scope.save = function(){
	                var element = angular.element(document.querySelectorAll('#my-float-pnl'));

	                element[0].style.pointerEvents = 'none';
	                var finalItems;
                  var finalItems = scope.mappedItems.concat(scope.toBeMappedItems);
	                scope.fetchItem = _.filter(finalItems,  function(supplier){
                      var returnElement;
                      if(supplier.isUpdated) {
                          returnElement = supplier.isUpdated;
                      }
                      return returnElement;
                  })
	                if(scope.fetchItem.length){
                        scope.dataReceived = false;
                        scope.mappedDataReceived=false;
                        scope.spinnerShow=false;
                      	serviceRequestData = {
                          	PandL_Category: scope.fetchItem
                      	};
                      	CommonService.postInvPnLMapping(mapPnLResponse,serviceRequestData);
	                } else{

	                    toastMessage("oops! nothing to map.", 2000);
	                    scope.dataReceived = true;
	                    document.getElementById("my-float-pnl").style.pointerEvents = "auto";
	                }
	            }

	            var mapPnLResponse = function(getMapPnL){
                  	_.forEach(scope.fetchItem, function(value) {
                    	value.selectedOption = {};
                    	value.selectedOption.selected = false;
                    	value.selectedOption.name = (value.profitAndLossCategory).toUpperCase();
                      // console.log(value);
                  	});
                  	if(getMapPnL.success || getMapPnL.response){
                  		toastMessage("P&L item mapped.", 4000);
                  		scope.fetchPnlInvItems();
                  	} else {
                  		toastMessage("something went wrong.", 2000);
                  	}
                }
                $rootScope.$on('start_search', function (event) {
                    scope.searchText = $rootScope.data.searchText;
              	});
                $rootScope.$on('setSelectedVal', function (event,selectedData) {
                  event.preventDefault();
                //   console.log(selectedData);
                  var CatValue=newValue.split("::");
                  $rootScope.current_selected.selectedOption = newValue;
                  $rootScope.current_selected.minorCategory= CatValue[1];
                  $rootScope.current_selected.profitAndLossCategory = CatValue[0];
                  $rootScope.current_selected.isUpdated = true;
                });
			       }
        };
    };
    PandlMapConfig.$inject = ['$q','$ionicLoading','$timeout','$rootScope', '$ionicTabsDelegate', 'PlTrackerService', 'CommonService'];
    projectCostByte.directive('pandlMapConfig', PandlMapConfig)

})();
projectCostByte.directive('ionSearchSelect', ['$ionicModal', '$ionicGesture','$timeout','$rootScope','inventoryService', function ($ionicModal, $ionicGesture,$timeout,$rootScope,inventoryService) {
    return {
        restrict: 'E',
        scope: {
            options: "=",
            optionSelected: "="
            // list: "="
        },
        controller: function ($scope, $element, $attrs) {
            $scope.searchSelect = {
                title: $attrs.title || "Search",
                // keyProperty: $attrs.keyProperty,
                // valueProperty: $attrs.valueProperty,
                templateUrl: $attrs.templateUrl || 'application/core/shared-components/common/directive/searchSelect.html',
                animation: $attrs.animation || 'slide-in-up',
                option: null,
                // searchvalue: "",
                // enableSearch: $attrs.enableSearch ? $attrs.enableSearch == "true" : true
            };
            $scope.data ={
              "searchValue": ""
            }
            $scope.searchCat = "";
            $ionicGesture.on('tap', function (e) {
                // if(!!$scope.searchSelect.keyProperty && !!$scope.searchSelect.valueProperty){
                //   if ($scope.optionSelected) {
                //     $scope.searchSelect.option = $scope.optionSelected[$scope.searchSelect.keyProperty];
                //   }
                // }
                // else{
                //   $scope.searchSelect.option = $scope.optionSelected;
                // }
                $scope.OpenModalFromTemplate($scope.searchSelect.templateUrl);
            }, $element);
            // $scope.setSelected = [];
            $scope.saveOption = function (newValue) {
              console.log('saveOption');
              $scope.closeModal();
              //
              // $rootScope.$broadcast('setSelectedVal',newValue);

              var CatValue=newValue.split("::");
              $rootScope.current_selected.selectedOption = newValue;
              $rootScope.current_selected.minorCategory= CatValue[1];
              $rootScope.current_selected.profitAndLossCategory = CatValue[0];
              $rootScope.current_selected.isUpdated = true;
              $rootScope.current_selected.isItemSelected = true
              // $scope.list.isUpdated = true;
              $rootScope.$broadcast('isCatItemSelected',$rootScope.current_selected);

              // $scope.setSelected.push($rootScope.current_selected)
              // console.log($scope.setSelected);
              inventoryService.setPnlMapSelected($rootScope.current_selected)
              // console.log($scope.list);
              // if(!!$scope.searchSelect.keyProperty && !!$scope.searchSelect.valueProperty){
              //   for (var i = 0; i < $scope.options.length; i++) {
              //       var currentOption = $scope.options[i];
              //       if(currentOption[$scope.searchSelect.keyProperty] == $scope.searchSelect.option){
              //         $scope.optionSelected = currentOption;
              //         break;
              //       }
              //   }
              // }
              // else{
              //   $scope.optionSelected = $scope.searchSelect.option;
              // }
                $scope.searchSelect.searchvalue = "";
                $scope.modal.remove();
            };

            $scope.toggleGroup = function (group) {
              // console.log(group);
              $timeout(function () {
                if(!group.isExpanded){
                  group.isExpanded = true;
                  group.spinnerShow = true;
                } else {
                  group.isExpanded = !group.isExpanded;
                  group.spinnerShow = group.isExpanded;
                }
              })
            };

            $scope.clearSearch = function () {
              console.log('clearSearch......');
              $scope.data.searchValue = "";
                // $scope.searchSelect.searchvalue = "";
            };

            $scope.closeModal = function () {
              // console.log("options",$scope.options)
              _.forEach($scope.options,function(data) {
                if(data.isExpanded) {
                  data.isExpanded = false;
                }
              })
              $scope.data.searchValue = "";
                $scope.modal.remove();
            };
            $scope.$on('$destroy', function () {
                if ($scope.modal) {
                    $scope.modal.remove();
                }
            });
            $scope.$watch('data.searchValue', function(newVal) {
              // console.log('searchValue items....',newVal);
              $scope.searchCat = newVal;
            }, true);

            $scope.OpenModalFromTemplate = function (templateUrl) {
                $ionicModal.fromTemplateUrl(templateUrl, {
                    scope: $scope,
                    animation: $scope.searchSelect.animation
                }).then(function (modal) {
                    $scope.modal = modal;
                    $scope.modal.show();
                });
            };
        }
    };
} ]);
