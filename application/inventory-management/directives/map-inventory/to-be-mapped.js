(function () {
    var ToBeMapped = function (CommonService,$q,$timeout,$ionicLoading,$rootScope,$ionicFilterBar,$ionicModal,inventoryItemsSvc,inventoryHomeSvc,$ionicPopup,$ionicSlideBoxDelegate,$window,$ionicPopover,ErrorReportingServiceOne) {
        return {
            restrict: 'E',
            // replace: true,
            scope: {
              bar : '=',
              items: '='
            },
            bindToController: {
                item: '&'
            },
            controller: function () {

            },
            controllerAs: 'ctrl',
            templateUrl: 'application/inventory-management/directives/map-inventory/to-be-mapped-section.html',
            link: function (scope, ele, attr, controllers) {

                scope.map = true;
                scope.mapped = false;
                scope.dataReceived = false;
                scope.invDataReceived = false;
                scope.itemCount = 0;
                $rootScope.refresh = false;
                scope.desableBg = false;
                scope.showSearchButton = true;
                scope.locationAccepted = true;
                $rootScope.moveToBeMapped = false;
                scope.showCancelBtn = true;

                scope.nextSlide = function() {
                  $ionicSlideBoxDelegate.next();
                }
                scope.invDataResponseHandler = function(invItems) {
                  if(invItems){
                    scope.inventoryItems = invItems.supItems;
                    scope.editInv = {
                      supItems : [{supItemId: "", supItemAlias: "Create New Inventory Item" ,category:""}],
                      supItem: null
                    };
                    _.find(scope.inventoryItems,function(inv){
                      scope.editInv.supItems.push(inv);
                    });
                    // console.log(scope.editInv.supItems);
                    // scope.editInv = {
                    //   supItems : invItems.supItems,
                    //   supItem: null
                    // };
                  }
                }

                scope.toBeMapClick = function(){
                  scope.map = true;
                  scope.mapped = false;
                  scope.dataReceived = false;

                  $timeout(function () {
                    scope.dataReceived = true;
                  }, 400);
                }

                scope.getSupplierItems = function(){
                  // console.log("returning supplier items");
                  return scope.supplierItems;
                }
                // scope.mapItems = function(){
                //     console.log("I was also triggererd!");
                //     var element = angular.element(document.querySelectorAll('#my-float-inv'));
                //     // console.log(element)
                //     scope.dataReceived = false;
                //     element[0].style.pointerEvents = 'none';

                //     // console.log(set_type);
                //     scope.saveMappedData();
                // }
                scope.setArray = function(originalItems){
                   scope.supplierItems = _.filter(originalItems,  function(supplier){
                    // if(supplier.supItems && (!supplier.invItemId || supplier.invItemId.length == 0)){
                    if(supplier.supItems && (!supplier.hasOwnProperty("invItemId") || supplier.invItemId.length == 0) && !supplier.saved && !supplier.isNA){
                      supplier.saved = false;
                      supplier.isUpdated = false;
                      supplier.isNA = false;
                      supplier.bg = "#eee";
                      supplier.color = "black";
                      supplier.convertion_factor = "";
                      supplier.conv_measurement_id = "";
                      supplier.selected_measurement_id = "";
                      supplier.isShowing = (!supplier.saved && supplier.supItems && !supplier.isNA && (!supplier.invItemId || supplier.invItemId.length == 0)) ? true : false;
                    }
                    return supplier.supItems && (!supplier.invItemId || supplier.invItemId.length == 0)
                    })
                }
                // CommonService.fetchInvItems(invDataResponseHandler);
                scope.wholeSupplier = [];
                scope.supplierDataResponseHandler = function(supplierItemsData) {
                  scope.dataReceived = true;
                  // console.log(supplierItemsData.status);
                  // if(supplierItemsData.status == 200){
                    var my_supplier = supplierItemsData.data.supItems;
                    scope.originalItems = my_supplier;
                    // scope.setArray(my_supplier);
                    scope.supplierItems = _.filter(my_supplier,  function(supplier){

                      if(supplier.supItems && (!supplier.invItemId || supplier.invItemId.length == 0)&& !supplier.saved && !supplier.isNA){
                        supplier.saved = false;
                        supplier.isUpdated = false;
                        supplier.isNA = false;
                        supplier.bg = "#eee";
                        supplier.color = "black";
                        supplier.convertion_factor = "";
                        supplier.conv_measurement_id = "";
                        supplier.selected_measurement_id = "";

                      }

                      supplier.isShowing = (!supplier.saved && supplier.supItems && !supplier.isNA && (!supplier.invItemId || supplier.invItemId.length == 0)) ? true : false;
                      // console.log("supplier.supItems: ",supplier.supItems);
                      // console.log(supplier.isShowing, (!supplier.saved && supplier.supItems && !supplier.isNA && (!supplier.invItemId || supplier.invItemId.length == 0)));
                      return supplier.supItems && !supplier.isNA && (!supplier.invItemId || supplier.invItemId.length == 0)
                    });
                    // console.log(scope.supplierItems.length,scope.supplierItems);
                  // } else {
                  //     toastMessage("Something went wrong!", 2000);
                  // }
                };
                scope.openModal = function() {
                  $ionicModal.fromTemplateUrl('application/inventory-management/directives/map-inventory/new-inventory-item-modal.html', {
                    scope: scope,
                    animation: 'slide-in-up',
                    backdropClickToClose: false
                  }).then(function(modal) {
                    scope.modal = modal;
                    scope.modal.show();
                  });
                };
                scope.closeModal = function(model) {
                  console.log('closeModal')
                  // scope.addInvItem.$setPristine();
                  // scope.addInvItem.$setUntouched();
                  scope.modal.hide();
                };
                scope.setUnit = function(){
                  console.log('setUnit ------------------')
                  $ionicSlideBoxDelegate.slide(1, 150);
                }

                scope.openUnitModal = function() {
                  $ionicModal.fromTemplateUrl('application/inventory-management/directives/map-inventory/unit-configuration.html', {
                    scope: scope,
                    animation: 'slide-in-up',
                    // focusFirstInput: true,
                    backdropClickToClose: false
                  }).then(function(modal) {
                    scope.unitModal = modal;
                    scope.unitModal.show();
                    $ionicSlideBoxDelegate.enableSlide(false);
                    // console.log($ionicSlideBoxDelegate.currentIndex())
                  });
                };
                scope.closeUnitModal = function(datas) {
                  // console.log('closeModal',datas)
                  // scope.addInvItem.$setPristine();
                  // scope.addInvItem.$setUntouched();
                  $rootScope.refresh = true;
                  datas.measurementId = '';
                  // datas.supplierItemPrice = 0.0;
                  datas.supplierItemPrice = scope.current_selected.actualSupPrice;
                  scope.locationAccepted = true;
                  scope.current_selected.selectedInvItemId = '';
                  scope.unitModal.hide();
                };
               // scope.priceClick = function(getItem,$event){
                   scope.priceClick = function(getItem){
                    console.log('priceClick: ')
                    scope.locationAccepted = false;
                    // scope.showReportPopover($event);
                  //  scope.errorReporting()
                }

                scope.savedDataSetting = function(){
                  // console.log('savedDataSetting')
                  scope.current_selected.saved = true;
                  // console.log(scope.current_selected)
                  _.forEach(scope.originalItems, function(supplier,index) {
                      if(supplier.supItemIds == scope.current_selected.supItemIds) {
                        supplier.saved = true;
                        supplier.isUpdated = scope.current_selected.isUpdated;
                        supplier.invItemId = scope.current_selected.isNA ? [] :scope.current_selected.invItemId;
                      }
                      if(index+1 == scope.originalItems.length){
                        console.log('if')
                        scope.setArray(scope.originalItems);
                        scope.setSuccess();
                      }
                  });
                }
                let headerSet;
                let myEl;
                function setHeaderText(){
                  headerSet = angular.element(document.querySelectorAll('.show-search-inv'))
                  headerSet[0].style.display = "flex";
                  myEl = angular.element( document.querySelector( '.show-search-inv' ) );
                  myEl.removeClass('ng-cloak');
                }
                scope.setSuccess = function(){
                  setHeaderText();
                  $rootScope.searchItem = true;
                  scope.dataReceived = true;
                  toastMessage("Inventories mapped.", 3000);
                  scope.dataReceived = true;
                  $rootScope.data.searchText = '';
                  // $rootScope.searchItem = false;
                  $rootScope.showSearchBtn = true;
                  document.getElementById("my-float-inv").style.pointerEvents = "auto";
                  $rootScope.$broadcast('inventory_to_map');
                }

                var mapandConfigRes = function(getMapInv,status){
                    // scope.savePopup1 = false;
                    scope.dataReceived = true;
                    // if(status == 200){
                      if(getMapInv.response.isPopUp2){
                        scope.showCancelBtn = false;
                        // console.log("show popup2",scope.showCancelBtn)

                        scope.setUnit();
                      } else if(!getMapInv.response.isPopUp2){
                        // scope.savePopup1 = true;
                        // if(scope.savePopup1)
                          scope.savedDataSetting();
                        if(scope.unitModal){
                          scope.closeUnitModal(scope.unitModal)
                        }
                      } else{
                          // console.log('something went wrong');
                          setHeaderText();
                          $rootScope.searchItem = true;
                          toastMessage("something went wrong.", 2000);
                          scope.dataReceived = true;
                          document.getElementById("my-float-inv").style.pointerEvents = "auto";
                      }
                    // }else {
                    //   toastMessage("Something went wrong!", 2000);
                    // }
                }

                scope.addPopup1 = function(){
                  scope.sendUnitConfig = []
                  // console.log(scope.current_selected)
                  scope.current_selected.invItemId = scope.current_selected.selectedInvItemId ? scope.current_selected.selectedInvItemId.supItemId : []
                  // console.log('current_selected: ',scope.current_selected)
                  // console.log(scope.sendUnitConfig)
                  if(scope.current_selected.isNA){
                    scope.sendUnitConfig = {
                      "supItemIds": scope.current_selected.supItemIds,
                      "supplierId": scope.current_selected.supplierId,
                      "invItemId": [],
                      "name": scope.current_selected.supItems,
                      "measurement": scope.current_selected.measurementId,
                      "price": scope.current_selected.supplierItemPrice,
                      "isUnknown": scope.current_selected.isUnknown,
                      "isNA" : true
                    }
                  } else{
                    scope.sendUnitConfig = {
                      "supItemIds": scope.current_selected.supItemIds,
                      "supplierId": scope.current_selected.supplierId,
                      "invItemId": scope.current_selected.selectedInvItemId.supItemId,
                      "name": scope.current_selected.supItems,
                      "measurement": scope.current_selected.measurementId,
                      "category": scope.current_selected.selectedInvItemId.category,
                      "par": scope.current_selected.selectedInvItemId.par,
                      "price": scope.current_selected.supplierItemPrice,
                      "isUnknown": scope.current_selected.isUnknown,
                      "isNA" : false
                    }
                  }
                  scope.dataReceived = false;
                  CommonService.postInvMapping(mapandConfigRes,scope.sendUnitConfig);
                }
                var saveMeasurementRes = function(data,status){
                  // console.log(data,status);
                  // scope.savePopup1 = false;
                  // if(status == 200){
                    scope.savedDataSetting();
                  // }else {
                  //   scope.dataReceived = true;
                  //   toastMessage("Something went wrong!", 2000);
                  // }
                }
                scope.addPopup2 = function(){
                  // console.log('addPopup2')
                  scope.sendConvFactor = []
                  // console.log(scope.current_selected)
                  scope.current_selected.invItemId = scope.current_selected.selectedInvItemId ? scope.current_selected.selectedInvItemId.supItemId : []
                  // console.log(scope.sendConvFactor)
                    scope.sendConvFactor = {
                      "measurement_id" : scope.current_selected.conv_measurement_id,
                      "supplier_id" : scope.current_selected.supplierId,
                      "supplier_item_id" : scope.current_selected.supItemIds,
                      "inventory_item_id" : scope.current_selected.selectedInvItemId.supItemId,
                      "convertion_factor" : parseFloat(scope.current_selected.convertion_factor)
                    }
                  // console.log(scope.sendConvFactor)
                  if(scope.unitModal){
                    scope.closeUnitModal(scope.unitModal)
                  }
                  scope.dataReceived = false;
                  CommonService.postMeasurementData(saveMeasurementRes,scope.sendConvFactor);
                }
                scope.getItemFromServer = function(){
                  inventoryHomeSvc.fetchInventoryItems().then(function (data) {
                    // if(data.status == 200){
                        scope.invDataResponseHandler(data.data);
                        var findItemId = _.find(data.data.supItems, function(sup) {
                          return sup.supItemAlias == scope.invItem.name;
                        });
                        // console.log(findItemId)
                        if(findItemId){
                          scope.current_selected.selectedInvItemId =  {"supItemId":findItemId.supItemId,"supItemAlias":scope.invItem.name};
                          scope.current_selected.isUpdated = true;
                          scope.current_selected.isNA = false;
                          scope.openUnitModal();
                          $timeout(function() {
                            // console.log('remove div')
                            var elmn = angular.element( document.querySelector( '.slider-pager' ) );
                            elmn.remove();
                          }, 20);
                        }
                      // }else {
                      //   toastMessage("Something went wrong!", 2000);
                      // }
                    scope.dataReceived = true;
                  });
                }
                scope.openForm = function() {
                  scope.invItem = {
                    "name": "",
                    "category": "",
                    "measurement": "",
                    "price": null,
                    "par": null,
                    "supplier_id": "",
                    "status": "active",
                    "minorCategory": "",
                    "pnlCategory": ""
                  }
                  scope.openModal();
                }
                function invRes(invData) {
                  // if (invData.status == 200) {
                    scope.getItemFromServer();
                    scope.closeModal();
                    $rootScope.refresh = true;
                    scope.dataReceived = false;
                  // } else {
                  //   scope.closeModal();
                  //   toastMessage("Something goes wrong", 1200);
                  // }
                }



                scope.addInventoryItem = function() {
                  // console.log('ToBeMapped addInventoryItem: ');
                  if(!scope.invItem.par){
                    scope.invItem.par = 0;
                  }
                  scope.match = false;
                  scope.matchName = '';
                  // var matchCategories = _.find(scope.editInv.supItems, function(categories) {
                  //   if(categories.unit){
                  //     return categories.unit == scope.invItem.measurement && ((categories.supItemAlias).toUpperCase() == (scope.invItem.name).toUpperCase());
                  //   }
                  // });
                  // console.log(matchCategories);
                  // // console.log(scope.match,scope.matchName,scope.matchUnit)
                  // if(matchCategories){
                  //   var confirmPopup = $ionicPopup.alert({
                  //     title: 'Add Inventory Item',
                  //     okType:'button-bal',
                  //     template: '<center>There is an other item with the same name and unit ,<br/> Please choose different unit!</center>',
                  //   });
                  var matchCategories = _.each(scope.editInv.supItems, function(categories) {
                    if(categories.supItemAlias){
                        if(((categories.supItemAlias).toUpperCase() == (scope.invItem.name).toUpperCase()) && ((categories.category).toUpperCase()==(scope.invItem.category).toUpperCase() )){
                          // if(((catName.ingredient_alias_name).toUpperCase() == ($scope.invItem.name).toUpperCase())){
                          scope.match = true;
                          scope.matchName = categories.supItemAlias;
                        }
                    }
                  });
                  // console.log(scope.match,scope.matchName)
                  if(scope.match){
                    var confirmPopup = $ionicPopup.alert({
                      title: 'Add Inventory Item',
                      okType:'button-bal',
                      template: '<center>There is an other item with the same name ,<br/> Please add different name!</center>',
                    });

                  } else{
                    // console.log('call api')
                    CommonService.addNewInvItem(invRes, scope.invItem);
                  }

                }
                scope.valueUpdated = function(value) {
                    // console.log('valueUpdated: ',value)
                    value = parseFloat(value);
                    // console.log(value)
                    scope.invItem.price = (isNaN(value)) ? '' : value.toFixed(2)
                };
                scope.toTwoDigit = function(value){
                    value = parseFloat(value);
                    scope.invItem.price = (isNaN(value)) ? '' : value.toFixed(2)
                }
                scope.toTwoDigitPar = function(parVal){
                    parVal = parseFloat(parVal);
                    scope.invItem.par = (isNaN(parVal)) ? '' : parVal.toFixed(2)
                }
                CommonService.fetchMeasurements(function(data) {
                  scope.measurements_list = [];
                  _.forEach(data.measurements, function(measurements) {
                    if (measurements.measurement_name != null && measurements.measurement_name != '') {
                      scope.measurements_list.push(measurements);
                    }
                  });
                });
                CommonService.fetchInventoryCategories(function(catData) {
                  scope.categories_list = [];
                  _.forEach(catData.categories, function(categories) {
                    if (categories.category != null && categories.category != '') {
                      scope.categories_list.push(categories.category);
                    }
                  });
                });
                scope.minor_categories_list = [];
                CommonService.fetchMinorCategories(function(minorCatData) {
                  scope.minor_categories_list = minorCatData.data.minor_categories;
                });

                scope.pnl_categories_list = [];
                CommonService.fetchPnlCategories(function(pnlCatData) {
                  scope.pnl_categories_list = pnlCatData.pl_cat;
                });
                scope.shoutLoudUnit = function(newUnit, oldUnit){
                  // console.log(newUnit,oldUnit);
                };
                scope.shoutLoud = function(newValue, oldValue){
                  // console.log('scope.current_selected: ',scope.current_selected)
                  if(newValue.supItemAlias == 'Create New Inventory Item'){
                    // console.log('create new inventory item popup.....')
                    scope.openForm();
                  }
                  else if(scope.current_selected.isUnknown && scope.current_selected.measurementId == ''){
                    // console.log('unknown supplier popup1')
                    scope.current_selected.isNA = false;
                    scope.current_selected.isUpdated = true;
                    scope.current_selected.selectedInvItemId = newValue ;
                    scope.openUnitModal();
                    $timeout(function() {
                      // console.log('remove div')
                      var elmn = angular.element( document.querySelector( '.slider-pager' ) );
                      elmn.remove();
                    }, 20);
                  }
                  else{
                    scope.current_selected.isNA = false;
                    scope.current_selected.isUpdated = true;
                    scope.current_selected.selectedInvItemId = newValue ;
                    // console.log(scope.current_selected)
                    scope.addPopup1()
                  }
                };

                scope.shoutReset = function(){
                  console.log("value was reset!");
                };
                var toastMessage = function (message_text, duration) {
                  if (typeof duration === 'undefined') duration = 1500;
                  $ionicLoading.show({
                      template: message_text,
                      noBackdrop: true,
                      duration: duration
                  });
                };
                scope.setUnitConfig = function(inv, type, index){
                  $timeout(function(){
                    let myBtn = document.querySelectorAll('#unitConfig');
                    let btnLength = ((myBtn.length)-1);
                     angular.element(myBtn[btnLength]).triggerHandler('click');
                  },200);
                };
                scope.setInventory = function(inv, type, index){
                  var clicked ;
                  if(type == 1) {
                    scope.my_map = 'inventory_'+type+index;
                    clicked = scope.my_map;
                  } else {
                    scope.my_maps = 'inventory_'+type+index;
                    clicked = scope.my_maps;
                  }
                  scope.current_selected = inv;
                  scope.current_selected.actualSupPrice = inv.supplierItemPrice;
                  if(!inv.isNA){
                    $timeout(function(){
                       angular.element(document.querySelectorAll('#'+clicked)).triggerHandler('click');
                    },200);
                  }
                }

                function getAllDatas(){
                  var promises = [ CommonService.fetchSupplierItems()];
                  $q.all(promises).then((values) => {
                    // console.log(values);
                      scope.invDataResponseHandler(scope.items);
                      scope.supplierDataResponseHandler(values[0]);
                  });
                }
                getAllDatas()

                scope.detectNA = function(item,index){
                  // console.log(item)
                  item.isShowing = (!item.saved && item.supItems && !item.isNA && (!item.invItemId || item.invItemId.length == 0)) ? true : false;
                  if(item.isNA){
                    scope.desableBg = true;
                    item.selectedInvItemId = "";
                    item.isUpdated = true;

                    item.bg = "ivory";
                    item.color = "#eee"

                    scope.current_selected = item;

                    scope.addPopup1()
                  } else{

                    item.bg = "#eee";
                    item.color = "black"
                  }
                }


              scope.errorReporting = function () {
                  // console.log('errorReporting: ',scope.current_selected)
                  var item = scope.current_selected;
                  ErrorReportingServiceOne.showErrorReportForm({
                      'page': 'inventory',
                      'component': item.supItems,
                      'modalName' : false
                  }, {
                      'page': 'inventory',
                      'component': 'ingredient name'
                  }) //TODO change component key to component_type in API
                  .then(function (result) {
                      //                                        console.log(result)
                  });
              };


              scope.showReportPopover = function ($event) {
                  $event.preventDefault();
                  $event.stopPropagation();
                  scope.errorReportPopover.show($event)
              }
              $rootScope.$on('set_search_map', function (event) {
                scope.searchText = $rootScope.data.searchText
                // console.log('scope.searchText: ',scope.searchText)
              });
              $rootScope.$on('inventory_mapped', function (event) {
                scope.dataReceived = false;
                $rootScope.moveToBeMapped = false;
                getAllDatas()
              });
            }
        };
    };
    ToBeMapped.$inject = ['CommonService','$q','$timeout','$ionicLoading','$rootScope','$ionicFilterBar','$ionicModal','inventoryItemsSvc','inventoryHomeSvc','$ionicPopup','$ionicSlideBoxDelegate','$window','$ionicPopover','ErrorReportingServiceOne'];
    projectCostByte.directive('toBeMapped', ToBeMapped)
})();
projectCostByte.directive('isFocused', function($timeout) {
  return {
    scope: { trigger: '&isFocused' },
    link: function(scope, element) {
        if(scope.trigger()) {
          $timeout(function() {
            element[0].focus();
            element[0].click();
          });
        }
    }
  };
});
