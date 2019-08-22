(function () {
    var MapInventory = function (CommonService,$q,$timeout,$ionicLoading,$ionicFilterBar,$rootScope) {
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
            templateUrl: 'application/inventory-management/directives/map-inventory/map-inventory.html',
            link: function (scope, ele, attr, controllers) {

                scope.map = true;
                scope.mapped = false;
                scope.dataReceived = false;
                scope.invDataReceived = false;
                scope.itemCount = 0;
                // console.log('inv maping...', scope.item)
                // scope.bar.showSearchButton = true;


                // scope.invDataResponseHandler = function(invItems) {
                //   // console.log(invItems);
                //   if(invItems){
                //     scope.inventoryItems = invItems.supItems;

                //     scope.editInv = {
                //       supItems : invItems.supItems,
                //       supItem: null
                //     };
                //   }
                //   // console.log(scope.editInv);
                // }

                scope.toBeMapClick = function(){

                  scope.map = true;
                  scope.mapped = false;
                  scope.dataReceived = false;
                  $rootScope.data.searchText = '';
                  $rootScope.$broadcast('set_search_map')
                  // $rootScope.searchItem = false;
                  $rootScope.searchItem = true;
                  $rootScope.showSearchBtn = true;
                  console.log($rootScope.moveToBeMapped)
                  if($rootScope.moveToBeMapped)
                    $rootScope.$broadcast('inventory_mapped');
                  $timeout(function () {
                    scope.dataReceived = true;
                  }, 400);
                }

                scope.mappedClick = function(){

                  scope.mapped = true;
                  scope.map = false;
                  scope.dataReceived = false;
                  $rootScope.data.searchText = '';
                  $rootScope.$broadcast('set_search_mapped')
                  // $rootScope.searchItem = false;
                  $rootScope.searchItem = true;
                  $rootScope.showSearchBtn = true;
                  $timeout(function () {
                    scope.dataReceived = true;
                  }, 400);
                }
                // var set_type ;
                // // scope.$on('floating-menu:open', function(){
                // // console.log('floating-menu open');
                // scope.mapItems = function(){
                //     console.log("I was also triggererd!");
                //     var element = angular.element(document.querySelectorAll('#my-float-inv'));
                //     // console.log(element)
                //     scope.dataReceived = false;
                //     element[0].style.pointerEvents = 'none';
                //     if(scope.map)
                //       set_type = 1;
                //     if(scope.mapped)
                //       set_type = 2;
                //     // console.log(set_type);
                //     scope.saveMappedData(set_type);
                // }
                // // $timeout(function(){
                // //   var element = angular.element(document.querySelectorAll('#my-float-inv'));
                // //   element[0].onclick = function(){
                // //       console.log("I was also triggererd!");
                // //       scope.dataReceived = false;
                // //       element[0].style.pointerEvents = 'none';
                // //       if(scope.map)
                // //         set_type = 1;
                // //       if(scope.mapped)
                // //         set_type = 2;
                // //       // console.log(set_type);
                // //       scope.saveMappedData(set_type);
                // //   }
                // // },1000);


                // scope.setArray = function(originalItems , type = "default"){

                //   if(type == "default" || type == 2) {
                //    scope.supplierItems = _.filter(originalItems,  function(supplier){
                //     // console.log(supplier);
                //     if(supplier.supItems && (!supplier.invItemId || supplier.invItemId.length == 0)){
                //       supplier.saved = false;
                //       supplier.isUpdated = false;
                //     }
                //     return supplier.supItems && (!supplier.invItemId || supplier.invItemId.length == 0)
                //     })
                //   }

                //   if(type == "default" || type == 1) {



                //      scope.supplierItemsMapped = _.filter(originalItems,  function(supplier){
                //       var val;

                //       if(supplier.supItems && (supplier.invItemId && supplier.invItemId.length>0)){
                //         supplier.saved = true;
                //         supplier.isUpdated = false;

                //         var findItem = _.each(supplier.invItemId, function(data) {
                //           if(scope.editInv){
                //              _.find(scope.editInv.supItems,function(invList){
                //                 if(data == invList.supItemId){
                //                    val = invList;
                //                 }
                //             });
                //           }
                //         });
                //         // console.log(val);
                //         supplier.selectedInvItemId = val;
                //       }
                //       return supplier.supItems && (supplier.invItemId && supplier.invItemId.length>0)
                //     })
                //   }
                // }


                // CommonService.fetchInvItems(invDataResponseHandler);
                // scope.wholeSupplier = [];
                // scope.supplierDataResponseHandler = function(supplierItemsData) {
                //   // console.log(supplierItemsData);


                //   scope.dataReceived = true;

                //   var my_supplier = supplierItemsData.supItems;

                //   scope.originalItems = my_supplier;

                //   scope.setArray(my_supplier);

                // };
                // CommonService.fetchSupplierItems(supplierDataResponseHandler);


                // scope.shoutLoud = function(newValue, oldValue){
                //   // console.log("changed from " + JSON.stringify(oldValue) + " to " + JSON.stringify(newValue));
                //   scope.current_selected.NA = false;
                //   scope.current_selected.isUpdated = true;
                //   scope.current_selected.selectedInvItemId = newValue ;
                // };

                // scope.shoutReset = function(){
                //   console.log("value was reset!");
                // };

                // var toastMessage = function (message_text, duration) {
                //   if (typeof duration === 'undefined') duration = 1500;
                //   $ionicLoading.show({
                //       template: message_text,
                //       noBackdrop: true,
                //       duration: duration
                //   });
                // };

                // scope.setInventory = function(inv, type, index){
                //   // scope.invDataReceived = false;

                //   // console.log(inv,type,index);
                //   var clicked ;
                //   if(type == 1) {
                //     scope.my_map = 'inventory_'+type+index;
                //     clicked = scope.my_map;
                //   } else {
                //     scope.my_maps = 'inventory_'+type+index;
                //     clicked = scope.my_maps;
                //   }


                //   scope.current_selected = inv;

                //   console.log(clicked);

                //   $timeout(function(){
                //      angular.element(document.querySelectorAll('#'+clicked)).triggerHandler('click');
                //   },200);

                // }


                // var promises = [ CommonService.fetchSupplierItems()];
                // // var promises = [DocumentSelectionService.fetchPurchaseTrend()];
                // $q.all(promises).then((values) => {
                //     // console.log(values);
                //     // console.log(values[0].values);
                //     scope.invDataResponseHandler(scope.items);
                //     scope.supplierDataResponseHandler(values[0]);

                // });

                // scope.detectNA = function(item){
                //   if(item.NA){
                //     item.selectedInvItemId = "";
                //     item.isUpdated = true;
                //   }
                // }

                // scope.saveMappedData = function(type){
                //   var result =[];
                //   console.log(type);

                //   var datas = type == 1 ? _.filter(scope.supplierItems,function(itm){ return !itm.saved}) : _.filter(scope.supplierItemsMapped,function(itm){ return itm.saved}) ;
                //   // var otherDatas = type == 2 ? _.filter(scope.supplierItems,function(itm){ return !itm.saved}) : _.filter(scope.supplierItemsMapped,function(itm){ return itm.saved}) ;
                //   result = _.filter(datas,function(supplier){
                //       // console.log(supplier);
                //       // console.log(supplier.selectedInvItemId);
                //       if(supplier.invItemId)
                //           supplier.invItemId = supplier.invItemId.length ? supplier.invItemId : [];
                //       else
                //           supplier.invItemId = [];

                //       if(supplier.NA && type ==2 ){
                //         supplier.invItemId = []
                //         // supplier.isUpdated = true;
                //       } else if(supplier.selectedInvItemId) {
                //         var checkInv = _.find(supplier.supItemIds,function(inv){
                //           return inv == supplier.selectedInvItemId.supItemId;
                //         });
                //         if(!checkInv){
                //           // console.log(supplier.selectedInvItemId.supItemId)
                //           // supplier.invItemId.push(supplier.selectedInvItemId.supItemId)
                //           supplier.invItemId =[];
                //           supplier.invItemId.push(supplier.selectedInvItemId.supItemId)
                //           // supplier.isUpdated = true;
                //         }
                //       }
                //       return supplier.isUpdated;
                //   });
                //   // console.log(result);

                //   var mapInvResponse = function(getMapInv){
                //     if(getMapInv.success){
                //       _.forEach(result, function(value) {
                //         // console.log(value.invItemId)
                //         value.isUpdated = false;
                //         if(value.invItemId.length){
                //           value.saved = true;
                //         } else{
                //           value.saved = false;
                //         }
                //         _.forEach(scope.originalItems, function(supplier) {
                //           if(supplier.supItemIds == value.supItemIds) {
                //             supplier.saved = value.saved;
                //             supplier.invItemId = value.invItemId;
                //             supplier.NA = supplier.invItemId ? false : true;
                //             supplier.isUpdated = value.isUpdated;
                //             // console.log("match " ,supplier.supItemIds ,value.supItemIds);
                //           }
                //         });
                //       });

                //       scope.setArray(scope.originalItems, type);
                //       toastMessage("Inventories mapped.", 4000);
                //       scope.dataReceived = true;
                //       document.getElementById("my-float-inv").style.pointerEvents = "auto";
                //     } else{
                //       console.log('something went wrong');
                //       toastMessage("something went wrong.", 2000);
                //       scope.dataReceived = true;
                //       document.getElementById("my-float-inv").style.pointerEvents = "auto";
                //     }
                //   }

                //   // console.log(JSON.stringify(result))
                //   if(result.length){
                //     CommonService.postInvMapping(mapInvResponse,result);
                //   } else{
                //     console.log('nothing to map');
                //     toastMessage("oops! nothing to map.", 2000);
                //     scope.dataReceived = true;
                //     document.getElementById("my-float-inv").style.pointerEvents = "auto";
                //   }
                // }


                $rootScope.$on('search_map', function (event) {
                  // console.log(scope.map)
                  if(scope.map)
                    $rootScope.$broadcast('set_search_map')
                  if(scope.mapped)
                    $rootScope.$broadcast('set_search_mapped')
                });



            }
        };
    };
    MapInventory.$inject = ['CommonService','$q','$timeout','$ionicLoading','$ionicFilterBar','$rootScope'];
    projectCostByte.directive('mapInventory', MapInventory)
})();
