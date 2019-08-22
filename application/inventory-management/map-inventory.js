(function () {
    var MapInventory = function ($scope,$rootScope,$state,$ionicPlatform,CommonService,$q,$timeout,$ionicLoading,$ionicFilterBar) {
                $rootScope.headerTitleINV="";
                $rootScope.searchItem = true;
                $scope.map = true;
                $scope.mapped = false;
                $scope.dataReceived = false;
                $scope.invDataReceived = false;
                $scope.itemCount = 0;
                console.log('inv maping...')
                // $scope.bar.showSearchButton = true;

                $scope.navBarTitle.showToggleButton = false;

                // $rootScope.$ionicGoBack = function(backCount) {
                //     console.log('Previous state:' + $rootScope.previousState)
                //     console.log('Current state:' + $rootScope.currentState)
                //     if($rootScope.previousState == 'app.inventoryManager.config'){
                //       console.log('if********')
                //       $scope.navBarTitle.showToggleButton = true;
                //       console.log($scope.navBarTitle.showToggleButton)
                //     }
                //     window.history.back();
                // };

                // $ionicPlatform.onHardwareBackButton(function (event) {
                //   event.preventDefault();
                //   event.stopPropagation();
                //   if($rootScope.previousState == 'app.inventoryManager.config')
                //     $scope.navBarTitle.showToggleButton = true;
                // })


                $scope.invDataResponseHandler = function(invItems) {
                  // console.log(invItems.supItems);
                  $scope.inventoryItems = invItems.supItems;

                  $scope.editInv = {
                    supItems : invItems.supItems,
                    supItem: null
                  };
                  // console.log($scope.editInv);
                }

                $scope.toBeMapClick = function(){

                  $scope.map = true;
                  $scope.mapped = false;
                  // $scope.dataReceived = false;
                  // $timeout(function () {
                  //   $scope.dataReceived = true;
                  // }, 400);
                }

                $scope.mappedClick = function(){

                  $scope.mapped = true;
                  $scope.map = false;
                  $scope.dataReceived = false;

                  $timeout(function () {
                    $scope.dataReceived = true;
                  }, 400);
                }
                var set_type ;
                // $scope.$on('floating-menu:open', function(){
                  // console.log('floating-menu open');
                $timeout(function(){
                  var element = angular.element(document.querySelectorAll('#my-float-inv'));
                  element[0].onclick = function(){
                      console.log("I was also triggererd!");
                      $scope.dataReceived = false;
                      element[0].style.pointerEvents = 'none';
                      if($scope.map)
                        set_type = 1;
                      if($scope.mapped)
                        set_type = 2;
                      // console.log(set_type);
                      $scope.saveMappedData(set_type);
                  }
                },1000);

                // $timeout(function(){
                //   var eleSearch = angular.element(document.querySelectorAll('.inv-map-search'));
                //   eleSearch[0].onclick = function(){
                //       console.log("Search also triggererd!");
                //       $scope.showFilterBar();
                //   }
                // },1000);


                // console.log('element: ',element[0]);

                  // angular.element(document.querySelectorAll('.ion-android-checkmark-circle')).triggerHandler('click');
                // });
                // console.log($scope.editInv.supItems)
                $scope.setArray = function(originalItems , type = "default"){
                  if(type == "default" || type == 2) {
                   $scope.supplierItems = _.filter(originalItems,  function(supplier){
                    // console.log(supplier);
                    if(supplier.supItems && (!supplier.invItemId || supplier.invItemId.length == 0)){
                      supplier.saved = false;
                      supplier.isUpdated = false;
                    }
                    return supplier.supItems && (!supplier.invItemId || supplier.invItemId.length == 0)
                    })
                  }

                  if(type == "default" || type == 1) {
                     $scope.supplierItemsMapped = _.filter(originalItems,  function(supplier){
                      var val;
                      if(supplier.supItems && (supplier.invItemId && supplier.invItemId.length>0)){
                        supplier.saved = true;
                        supplier.isUpdated = false;
                        var findItem = _.each(supplier.invItemId, function(data) {
                           _.find($scope.editInv.supItems,function(invList){
                              if(data == invList.supItemId){
                                 val = invList;
                              }
                          });
                        });
                        // console.log(val);
                        supplier.selectedInvItemId = val;
                      }
                      return supplier.supItems && (supplier.invItemId && supplier.invItemId.length>0)
                    })
                  }
                }


                // CommonService.fetchInvItems(invDataResponseHandler);
                $scope.wholeSupplier = [];
                $scope.supplierDataResponseHandler = function(supplierItemsData) {
                  console.log('supplierDataResponseHandler...');
                  $scope.dataReceived = true;
                  // if(supplierItemsData.status == 200){
                    var my_supplier = supplierItemsData.data.supItems;
                    $scope.originalItems = my_supplier;
                    $scope.setArray(my_supplier);
                  // } else {
                  //     toastMessage("Something went wrong!", 2000);
                  // }
                };
                // CommonService.fetchSupplierItems(supplierDataResponseHandler);


                $scope.shoutLoud = function(newValue, oldValue){
                  // console.log("changed from " + JSON.stringify(oldValue) + " to " + JSON.stringify(newValue));
                  $scope.current_selected.NA = false;
                  $scope.current_selected.isUpdated = true;
                  $scope.current_selected.selectedInvItemId = newValue ;
                };

                $scope.shoutReset = function(){
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

                $scope.setInventory = function(inv, type, index){
                  // $scope.invDataReceived = false;

                  // console.log(inv,type,index);
                  var clicked ;
                  if(type == 1) {
                    $scope.my_map = 'inventory_'+type+index;
                    clicked = $scope.my_map;
                  } else {
                    $scope.my_maps = 'inventory_'+type+index;
                    clicked = $scope.my_maps;
                  }


                  $scope.current_selected = inv;

                  // console.log(clicked);

                  $timeout(function(){
                     angular.element(document.querySelectorAll('#'+clicked)).triggerHandler('click');
                  },200);

                }


                // var promises = [ CommonService.fetchSupplierItems()];

                // $q.all(promises).then((values) => {
                //     // console.log(values);
                //     // console.log(values[0].values);
                //     $scope.invDataResponseHandler($scope.items);
                //     $scope.supplierDataResponseHandler(values[0]);

                // });
                var promises = [CommonService.fetchInvItems(),
                            CommonService.fetchSupplierItems(),

                            ];
                // var promises = [DocumentSelectionService.fetchPurchaseTrend()];
                $q.all(promises).then((values) => {
                    console.log(values);
                    // console.log(values[0].values);
                    $scope.invDataResponseHandler(values[0]);
                    $scope.supplierDataResponseHandler(values[1]);

                });


                $scope.detectNA = function(item){
                  if(item.NA){
                    item.selectedInvItemId = "";
                    item.isUpdated = true;
                  }
                }

                $scope.saveMappedData = function(type){
                  var result =[];
                  console.log(type);

                  var datas = type == 1 ? _.filter($scope.supplierItems,function(itm){ return !itm.saved}) : _.filter($scope.supplierItemsMapped,function(itm){ return itm.saved}) ;
                  // var otherDatas = type == 2 ? _.filter($scope.supplierItems,function(itm){ return !itm.saved}) : _.filter($scope.supplierItemsMapped,function(itm){ return itm.saved}) ;
                  result = _.filter(datas,function(supplier){
                      // console.log(supplier);
                      // console.log(supplier.selectedInvItemId);
                      if(supplier.invItemId)
                          supplier.invItemId = supplier.invItemId.length ? supplier.invItemId : [];
                      else
                          supplier.invItemId = [];

                      if(supplier.NA && type ==2 ){
                        supplier.invItemId = []
                        // supplier.isUpdated = true;
                      } else if(supplier.selectedInvItemId) {
                        var checkInv = _.find(supplier.supItemIds,function(inv){
                          return inv == supplier.selectedInvItemId.supItemId;
                        });
                        if(!checkInv){
                          // console.log(supplier.selectedInvItemId.supItemId)
                          // supplier.invItemId.push(supplier.selectedInvItemId.supItemId)
                          supplier.invItemId =[];
                          supplier.invItemId.push(supplier.selectedInvItemId.supItemId)
                          // supplier.isUpdated = true;
                        }
                      }
                      return supplier.isUpdated;
                  });
                  // console.log(result);

                  var mapInvResponse = function(getMapInv,status){
                    // if(status == 200){
                      if(getMapInv.success){
                        _.forEach(result, function(value) {
                          value.isUpdated = false;
                          if(value.invItemId.length){
                            value.saved = true;
                          } else{
                            value.saved = false;
                          }
                          _.forEach($scope.originalItems, function(supplier) {
                            if(supplier.supItemIds == value.supItemIds) {
                              supplier.saved = value.saved;
                              supplier.invItemId = value.invItemId;
                              supplier.NA = supplier.invItemId ? false : true;
                              supplier.isUpdated = value.isUpdated;
                              // console.log("match " ,supplier.supItemIds ,value.supItemIds);
                            }
                          });
                        });

                        $scope.setArray($scope.originalItems, type);
                        toastMessage("Inventories mapped.", 4000);
                        $scope.dataReceived = true;
                        document.getElementById("my-float-inv").style.pointerEvents = "auto";
                      } else{
                        console.log('something went wrong');
                        toastMessage("something went wrong.", 2000);
                        $scope.dataReceived = true;
                        document.getElementById("my-float-inv").style.pointerEvents = "auto";
                      }
                    // }else {
                    //   toastMessage("Something went wrong!", 2000);
                    // }
                  }


                  if(result.length){
                    // console.log(result);
                    CommonService.postInvMapping(mapInvResponse,result);
                  } else{
                    console.log('nothing to map');
                    toastMessage("oops! nothing to map.", 2000);
                    $scope.dataReceived = true;
                    document.getElementById("my-float-inv").style.pointerEvents = "auto";
                  }
                }
                var removeSearchStatus = false;
                // $scope.searchToBeMApped = function(){
                //   console.log('searchToBeMApped')
                //   // console.log($scope.supplierItems)
                //   // $scope.supplierItems = items;
                //   console.log($scope.map)
                //   var passArray = $scope.map ? $scope.supplierItems : $scope.supplierItemsMapped;
                //   var search_fields = ['supItems','supplier'];

                //   console.log(passArray)
                //   filterBarInstance = $ionicFilterBar.show({
                //     items: passArray,
                //     debounce: true,
                //     update: function(filteredItems, filterText) {
                //       console.log(filteredItems)
                //       //                    console.log(_.sumBy(filteredItems, function(o) { return o.ingredients.length; }))
                //       if (angular.isDefined(filterText)) {
                //         _.forEach(filteredItems, function(supItemGroup) {
                //           _.forEach(supItemGroup.ingredients, function(supItemss) {
                //             var keepIngredient = false;
                //             _.forEach(search_fields, function(search_field) {
                //               var textToSearch = _.get(supItemss, search_field, "");
                //               console.log(textToSearch)
                //               if (textToSearch != "") {
                //                 if (textToSearch.toLowerCase().indexOf(filterText.toLowerCase()) != -1) {
                //                   keepIngredient = true
                //                 }
                //               }
                //               if (keepIngredient) {
                //                 supItemss.searchHidden = false;
                //               } else {
                //                 supItemss.searchHidden = true;
                //               }
                //             })
                //           })

                //         })
                //       } else {
                //         console.log('removed')
                //         if (removeSearchStatus) {
                //           removeSearchStatus = false;
                //           return
                //         }

                //         _.forEach(filteredItems, function(supItemGroup) {
                //           _.forEach(supItemGroup.ingredients, function(supItemss) {
                //             supItemss.searchHidden = false;

                //           })
                //         })
                //         // console.log(_.sumBy(filteredItems, function(o) {
                //         //     return o.ingredients.length;
                //         // }))

                //       }

                //       // myArray = filteredItems;
                //       // var mySelect = $scope.map ? $scope.supplierItems = myArray : $scope.supplierItemsMapped =myArray;
                //       if($scope.map){
                //         $scope.supplierItems = filteredItems;

                //       }
                //       else{
                //         $scope.supplierItemsMapped = filteredItems;

                //       }

                //     },
                //   });
                // }
                $scope.searchToBeMApped = function(){
                  console.log('searchToBeMApped',$scope.supplierItems)
                  var search_fields = ['supItems','supplier'];

                  filterBarInstance = $ionicFilterBar.show({
                    items: $scope.supplierItems,
                    debounce: true,
                    update: function(filteredItems, filterText) {
                      //                    console.log(_.sumBy(filteredItems, function(o) { return o.ingredients.length; }))
                      if (angular.isDefined(filterText)) {
                        _.forEach(filteredItems, function(supItemGroup) {
                          _.forEach(supItemGroup.ingredients, function(supItemss) {
                            var keepIngredient = false;
                            _.forEach(search_fields, function(search_field) {
                              var textToSearch = _.get(supItemss, search_field, "");
                              if (textToSearch != "") {
                                if (textToSearch.toLowerCase().indexOf(filterText.toLowerCase()) != -1) {
                                  keepIngredient = true
                                }
                              }
                              if (keepIngredient) {
                                supItemss.searchHidden = false;
                              } else {
                                supItemss.searchHidden = true;
                              }
                            })
                          })

                        })
                      } else {
                        if (removeSearchStatus) {
                          removeSearchStatus = false;
                          return
                        }
                        _.forEach(filteredItems, function(supItemGroup) {
                          _.forEach(supItemGroup.ingredients, function(supItemss) {
                            supItemss.searchHidden = false;

                          })
                        })
                        // console.log(_.sumBy(filteredItems, function(o) {
                        //     return o.ingredients.length;
                        // }))

                      }
                      $scope.supplierItems = filteredItems

                    },
                  });
                }
                $scope.searchMApped = function(){
                  console.log('searchMApped',$scope.supplierItemsMapped)
                  var search_fields = ['supItems','supplier'];

                  filterBarInstance = $ionicFilterBar.show({
                    items: $scope.supplierItemsMapped,
                    debounce: true,
                    update: function(filteredItems, filterText) {
                      //                    console.log(_.sumBy(filteredItems, function(o) { return o.ingredients.length; }))
                      if (angular.isDefined(filterText)) {
                        _.forEach(filteredItems, function(supItemGroup) {
                          _.forEach(supItemGroup.ingredients, function(supItemss) {
                            var keepIngredient = false;
                            _.forEach(search_fields, function(search_field) {
                              var textToSearch = _.get(supItemss, search_field, "");
                              if (textToSearch != "") {
                                if (textToSearch.toLowerCase().indexOf(filterText.toLowerCase()) != -1) {
                                  keepIngredient = true
                                }
                              }
                              if (keepIngredient) {
                                supItemss.searchHidden = false;
                              } else {
                                supItemss.searchHidden = true;
                              }
                            })
                          })

                        })
                      } else {
                        if (removeSearchStatus) {
                          removeSearchStatus = false;
                          return
                        }
                        console.log(filteredItems)
                        _.forEach(filteredItems, function(supItemGroup) {
                          _.forEach(supItemGroup.ingredients, function(supItemss) {
                            supItemss.searchHidden = false;

                          })
                        })
                        // console.log(_.sumBy(filteredItems, function(o) {
                        //     return o.ingredients.length;
                        // }))

                      }
                      $scope.supplierItemsMapped = filteredItems

                    },
                  });
                }
                $scope.showFilterBar = function() {
                  if($scope.map){
                    // myArray = $scope.map ? $scope.supplierItems : $scope.supplierItemsMapped;
                    $scope.searchToBeMApped();
                  }

                  if($scope.mapped)
                    $scope.searchMApped()
                };


    };
    MapInventory.$inject = ['$scope','$rootScope','$state','$ionicPlatform','CommonService','$q','$timeout','$ionicLoading','$ionicFilterBar'];
    projectCostByte.controller('mapInventory', MapInventory)
})();
