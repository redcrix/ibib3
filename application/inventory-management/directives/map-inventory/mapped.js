(function () {
    var MappedTab = function (CommonService,$q,$timeout,$ionicLoading,$ionicFilterBar,$rootScope,$ionicFilterBar,$ionicModal,inventoryItemsSvc,inventoryHomeSvc,$ionicPopup,$ionicSlideBoxDelegate,$window,$ionicPopover,ErrorReportingServiceOne) {
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
            templateUrl: 'application/inventory-management/directives/map-inventory/mapped.html',
            link: function (scope, ele, attr, controllers) {

                scope.mapped = false;
                scope.dataReceived = false;
                scope.invDataReceived = false;
                scope.itemCount = 0;
                $rootScope.moveToBeMapped = false;
                console.log('inv maping...')

              scope.invDataResponseHandler = function(invItems,supItemValues) {
                // console.log(supItemValues.status);
                // if(supItemValues.status == 200){
                  if(invItems){
                    scope.inventoryItems = invItems.supItems;
                    scope.editInv = {
                      supItems : [{supItemId: "", supItemAlias: "Create New Inventory Item"}],
                      supItem: null
                    };
                    _.find(scope.inventoryItems,function(inv){
                      scope.editInv.supItems.push(inv);
                    });
                    // scope.editInv = {
                    //   supItems : invItems.supItems,
                    //   supItem: null
                    // };
                  }
                  scope.supplierDataResponseHandler(supItemValues.data);
                // }else {
                //   toastMessage("Something went wrong!", 2000);
                // }
              }
              scope.mappedClick = function(){
                scope.mapped = true;
                scope.map = false;
                scope.dataReceived = false;
                $timeout(function () {
                  scope.dataReceived = true;
                }, 400);
              }

              scope.setArray = function(originalItems){
                scope.supplierItemsMapped = _.filter(originalItems,  function(supplier){
                    var val;
                    scope.validSup = false;
                    if(supplier.isNA){
                      supplier.bg = "ivory";
                      supplier.color = "#eee";
                    } else{
                      supplier.bg = "#eee";
                      supplier.color = "black";
                    }
                    if((supplier.isNA && supplier.supItems) || (supplier.supItems && (supplier.invItemId && supplier.invItemId.length>0))){
                      supplier.saved = true;
                      supplier.isUpdated = false;
                      supplier.convertion_factor = "";
                      supplier.conv_measurement_id = "";
                      supplier.selected_measurement_id = "";
                      var findItem = _.each(supplier.invItemId, function(data) {
                        if(data.match("INV")) {
                          scope.validSup = true;
                        }
                        if(scope.editInv){
                           _.find(scope.editInv.supItems,function(invList){
                              if(data == invList.supItemId){
                                 val = invList;
                              }
                          });
                        }
                      });
                      supplier.selectedInvItemId = val;
                    }
                    // if(supplier.supItemIds == "5352265"){
                    //   console.log((supplier.isNA) || (supplier.supItems && (supplier.invItemId && supplier.invItemId.length>0) && scope.validSup))
                    // }
                    return (supplier.isNA) || (supplier.supItems && (supplier.invItemId && supplier.invItemId.length>0) && scope.validSup);
                })
                // console.log(scope.supplierItemsMapped.length);
              }
              // CommonService.fetchInvItems(invDataResponseHandler);
              scope.wholeSupplier = [];
              scope.supplierDataResponseHandler = function(supplierItemsData) {
                scope.dataReceived = true;
                var my_supplier = supplierItemsData.supItems;
                scope.originalItems = my_supplier;
                scope.setArray(my_supplier);
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
                $ionicSlideBoxDelegate.slide(1, 150)
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
                  console.log($ionicSlideBoxDelegate.currentIndex())
                });
              };
              scope.closeUnitModal = function(datas) {
                // console.log('closeModal',datas)
                // scope.addInvItem.$setPristine();
                // scope.addInvItem.$setUntouched();
                datas.measurementId = '';
                // datas.supplierItemPrice = 0.0;
                datas.supplierItemPrice = scope.current_selected.actualSupPrice;
                scope.locationAccepted = true;
                scope.unitModal.hide();
              };
              scope.priceClick = function(getItem){
             // scope.priceClick = function(getItem,$event){
                  console.log('priceClick: ')
                  scope.locationAccepted = false;
                  // scope.showReportPopover($event);
              //   scope.errorReporting()
              }
              scope.savedDataSetting = function(){
                console.log('savedDataSetting')
                scope.current_selected.saved = true;
                // console.log(scope.current_selected)
                _.forEach(scope.originalItems, function(supplier,index) {
                    if(supplier.supItemIds == scope.current_selected.supItemIds) {
                      supplier.saved = true;
                      supplier.isUpdated = scope.current_selected.isUpdated;
                      supplier.invItemId = scope.current_selected.NA ? [] :scope.current_selected.invItemId;
                    }
                    if(index+1 == scope.originalItems.length){
                      console.log('if')
                      scope.setArray(scope.originalItems);
                      // if(scope.savePopup1){
                        scope.setSuccess();
                      // }
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
                $rootScope.moveToBeMapped = true;
                $rootScope.data.searchText = '';
                $rootScope.$broadcast('set_search_mapped')
                // $rootScope.searchItem = false;
                $rootScope.showSearchBtn = true;
                document.getElementById("my-float-inv").style.pointerEvents = "auto";
                // console.log('set broadcast*******')
                $rootScope.$broadcast('inventory_to_map');
              }

              var mapandConfigRes = function(getMapInv,status){
                // scope.savePopup1 = false;
                scope.dataReceived = true;
                // if(status == 200){
                  if(getMapInv.response.isPopUp2){
                    console.log("show popup2")

                    scope.setUnit();
                  } else if(!getMapInv.response.isPopUp2){
                    // scope.savePopup1 = true;
                    // if(scope.savePopup1)
                      scope.savedDataSetting();

                    if(scope.unitModal){
                      scope.closeUnitModal(scope.unitModal)
                    }
                  } else{
                      console.log('something went wrong');
                      setHeaderText();
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
                scope.current_selected.invItemId = scope.current_selected.selectedInvItemId ? scope.current_selected.selectedInvItemId.supItemId : []
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
                    "invItemId": scope.current_selected.selectedInvItemId.supItemId ? scope.current_selected.selectedInvItemId.supItemId : [],
                    "name": scope.current_selected.supItems,
                    "measurement": scope.current_selected.measurementId,
                    "category": scope.current_selected.selectedInvItemId.category,
                    "par": scope.current_selected.selectedInvItemId.par,
                    "price": scope.current_selected.supplierItemPrice,
                    "isUnknown": scope.current_selected.isUnknown,
                    "isNA" : false
                  }
                }
                // console.log(scope.sendUnitConfig)
                // console.log(scope.unitModal)
                // if(scope.unitModal){
                //   scope.closeUnitModal(scope.unitModal)
                // }
                scope.dataReceived = false;
                CommonService.postInvMapping(mapandConfigRes,scope.sendUnitConfig);
              }
              var saveMeasurementRes = function(data,status){
                // scope.savePopup1 = false;
                // if(status == 200){
                  scope.savedDataSetting();
                // }else {
                //   scope.dataReceived = true;
                //   toastMessage("Something went wrong!", 2000);
                // }
              }
              scope.addPopup2 = function(){
                console.log('addPopup2')
                scope.sendConvFactor = []
                console.log(scope.current_selected)
                scope.current_selected.invItemId = scope.current_selected.selectedInvItemId ? scope.current_selected.selectedInvItemId.supItemId : []
                // console.log('current_selected: ',scope.current_selected)
                console.log(scope.sendConvFactor)
                  scope.sendConvFactor = {
                    "measurement_id" : scope.current_selected.conv_measurement_id,
                    "supplier_id" : scope.current_selected.supplierId,
                    "supplier_item_id" : scope.current_selected.supItemIds,
                    "inventory_item_id" : scope.current_selected.selectedInvItemId.supItemId,
                    "convertion_factor" : parseFloat(scope.current_selected.convertion_factor)
                  }
                console.log(scope.sendConvFactor)
                // console.log(scope.unitModal)
                if(scope.unitModal){
                  scope.closeUnitModal(scope.unitModal)
                }
                scope.dataReceived = false;
                CommonService.postMeasurementData(saveMeasurementRes,scope.sendConvFactor);
              }

              // // Cleanup the modal when we're done with it!
              // scope.$on('$destroy', function() {
              //   scope.modal.remove();
              // });
              // // Execute action on hide modal
              // scope.$on('modal.hidden', function() {
              //   // Execute action
              // });
              // // Execute action on remove modal
              // scope.$on('modal.removed', function() {
              //   // Execute action
              // });
              scope.findItemId = []
              scope.setItemFromServer = function(){
                inventoryHomeSvc.fetchInventoryItems().then(function (data) {
                  // if(data.status == 200){
                      if (scope.invItem) {
                          scope.findItemId = _.find(data.data.supItems, function(sup) {
                            return sup.supItemAlias == scope.invItem.name;
                          });
                          scope.current_selected.selectedInvItemId =  {"supItemId":scope.findItemId.supItemId,"supItemAlias":scope.invItem.name};
                          scope.current_selected.isUpdated = true;
                          scope.dataReceived = true;
                          scope.current_selected.isNA = false;

                          scope.openUnitModal();
                          $timeout(function() {
                            console.log('remove div')
                            var elmn = angular.element( document.querySelector( '.slider-pager' ) );
                            elmn.remove();
                          }, 20);
                      }
                    // }else {
                    //   scope.dataReceived = true;
                    //   toastMessage("Something went wrong!", 2000);
                    // }
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
                  scope.setItemFromServer();
                  scope.closeModal();
                  $rootScope.refresh = true;
                  scope.dataReceived = false;
                // } else {
                //   scope.closeModal();
                //   toastMessage("Something goes wrong", 1200);
                // }
              }
              scope.addInventoryItem = function() {
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
                // if(matchCategories){
                //   var confirmPopup = $ionicPopup.alert({
                //     title: 'Add Inventory Item',
                //     okType:'button-bal',
                //     template: '<center>There is an other item with the same name and unit ,<br/> Please choose different unit!</center>',
                //   });
                var matchCategories = _.each(scope.editInv.supItems, function(categories) {
                  if(categories.supItemAlias){
                    // _.find(categories.ingredients, function(catName) {
                      if(((categories.supItemAlias).toUpperCase() == (scope.invItem.name).toUpperCase()) && ((categories.category).toUpperCase()==(scope.invItem.category).toUpperCase() )){
                        // if(((catName.ingredient_alias_name).toUpperCase() == ($scope.invItem.name).toUpperCase())){
                        scope.match = true;
                        scope.matchName = categories.supItemAlias;
                      }
                    // });
                  }
                });
                if(scope.match){
                  var confirmPopup = $ionicPopup.alert({
                    title: 'Add Inventory Item',
                    okType:'button-bal',
                    template: '<center>There is an other item with the same name ,<br/> Please add different name!</center>',
                  });
                } else{
                  console.log('call api')
                  CommonService.addNewInvItem(invRes, scope.invItem);
                }
              }
              scope.valueUpdated = function(value) {
                  value = parseFloat(value);
                  console.log(value)
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

              scope.shoutLoud = function(newValue, oldValue){
                if(newValue.supItemAlias == 'Create New Inventory Item'){
                  console.log('create new inventory item popup.....')
                  scope.openForm();
                }
                else if(scope.current_selected.isUnknown && scope.current_selected.measurementId == ''){
                  console.log('unknown supplier popup1')
                  scope.current_selected.isNA = false;
                  scope.current_selected.isUpdated = true;
                  scope.current_selected.selectedInvItemId = newValue ;
                  scope.openUnitModal();
                  $timeout(function() {
                    console.log('remove div')
                    var elmn = angular.element( document.querySelector( '.slider-pager' ) );
                    elmn.remove();
                  }, 20);
                }
                else{
                  scope.current_selected.isNA = false;
                  scope.current_selected.isUpdated = true;
                  scope.current_selected.selectedInvItemId = newValue ;
                  scope.findItemId = []
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

              scope.setInventory = function(inv, type, index){
                // scope.invDataReceived = false;
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

              scope.getItemFromServer = function(supItemValues){
                console.log('*************** getItemFromServer ************');
                inventoryHomeSvc.fetchInventoryItems().then(function (data) {
                  // if(data.status == 200){
                    scope.invDataResponseHandler(data.data,supItemValues);
                  // }else {
                  //   scope.dataReceived = true;
                  //   toastMessage("Something went wrong!", 2000);
                  // }
                });
              }

              function getAllDatas(){
                console.log('getAllDatas from mapped')
                var promises = [ CommonService.fetchSupplierItems()];
                // var promises = [DocumentSelectionService.fetchPurchaseTrend()];
                $q.all(promises).then((values) => {
                    console.log($rootScope.refresh)
                    if($rootScope.refresh){
                      console.log('if********')
                      scope.getItemFromServer(values[0]);
                    }
                    else{
                      console.log('else*****')
                      scope.invDataResponseHandler(scope.items,values[0]);
                    }
                    // scope.supplierDataResponseHandler(values[0]);
                });
              }
              getAllDatas();

              scope.detectNA = function(item){
                if(item.isNA){
                  item.selectedInvItemId = "";
                  item.isUpdated = true;

                  item.bg = "ivory";
                  item.color = "#eee"
                  scope.current_selected = item;

                  scope.addPopup1()
                } else{
                  item.selectedInvItemId = "";
                  item.isUpdated = true;

                  item.bg = "#eee";
                  item.color = "black"

                  scope.current_selected = item;

                  scope.addPopup1()
                }
              }

              scope.errorReporting = function () {
                  console.log('errorReporting: ',scope.current_selected)
                  // scope.errorReportPopover.hide();
                  var item = scope.current_selected;
                  ErrorReportingServiceOne.showErrorReportForm({
                      'page': 'inventory',
                      'component': item.supItems,
                      'modalName' : false
                  }, {
                      'page': 'inventory',
                      'component': 'ingredient name'
                  }) //todo change component key to component_type in API
                  .then(function (result) {
                      //console.log(result)
                  });
              };


              scope.showReportPopover = function ($event) {
                  $event.preventDefault();
                  $event.stopPropagation();
                  scope.errorReportPopover.show($event)
              }

              $rootScope.$on('set_search_mapped', function (event) {
                scope.searchText = $rootScope.data.searchText
                // console.log('scope.searchText: ',scope.searchText)
              });

              $rootScope.$on('inventory_to_map', function (event) {
                console.log('catch broadcast *****')
                scope.dataReceived = false;
                getAllDatas()
              });
            }
        };
    };
    MappedTab.$inject = ['CommonService','$q','$timeout','$ionicLoading','$ionicFilterBar','$rootScope','$ionicFilterBar','$ionicModal','inventoryItemsSvc','inventoryHomeSvc','$ionicPopup','$ionicSlideBoxDelegate','$window','$ionicPopover','ErrorReportingServiceOne'];
    projectCostByte.directive('mappedTab', MappedTab)
})();
