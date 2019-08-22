(function () {
    var productCategory = function ($rootScope,$scope, $ionicScrollDelegate, $ionicPopup, $timeout, $ionicActionSheet, $ionicListDelegate, appModalService, CommonService,$state,inventoryService) {
        return {
            restrict: 'E',
            replace: true,
            scope: {
              categoryData: '=',
              mode: '=',
              filterView: '=',
              lastName: '=',
              allCatData: '=',
              // minorCatList: '='
            },
            bindToController: {
                categoryData: '=categoryData',
                mode: '=mode',
                filterView: '=filterView',
                lastName: '=lastName',
                allCatData: '=allCatData'
            },
            controller: function ($scope,appModalService,$timeout,$ionicListDelegate,$state,inventoryService,CommonService) {
                // $scope.fetchMinorCategoriesres = function(res){
                //   console.log(res.minor_categories);
                //     // $rootScope.$emit('minorList',res.minor_categories)
                //     $timeout(function() {
                //       $rootScope.minorcatList = res.minor_categories;
                //     }, 0);
                //
                // }
                // CommonService.fetchMinorCategories($scope.fetchMinorCategoriesres);

                // console.log($scope.minorCatList);
                // console.log($scope.categoryData.ingredients);
                // _.forEach($scope.categoryData.ingredients,function(item){
                //   // console.log(item);
                //         item.minor_categories =$scope.minorCatList;
                // })
                // console.log("$scope.categoryData",$scope.categoryData)
                $scope.hasMoreData = true;
                $scope.showIngredients = [];
                $scope.newcategoryData = $scope.categoryData;
                // console.log("$scope.newcategoryData",$scope.newcategoryData)
                $scope.getMore = function() {
                    // console.log("get more");
                    var currTBMICount = $scope.count;
                    for(var i=currTBMICount; i<currTBMICount+10; i++) {
                        if(i<$scope.newcategoryData.ingredients.length) {
                            $scope.showIngredients.push($scope.newcategoryData.ingredients[i]);
                            $scope.count++;
                            $scope.hasMoreData = true;
                            // console.log("has data");
                        } else {
                            // console.log("has no data");
                            $scope.hasMoreData = false;
                            return;
                        }
                    }
                    // if($scope.showIngredients.length < $scope.newcategoryData.ingredients.length) {
                    //     $scope.getMore();
                    // }
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                }
                // $scope.loadInfiniteData = function() {
                //     $scope.getMore();
                //     $scope.$broadcast('scroll.infiniteScrollComplete');
                // }
                if($scope.newcategoryData.ingredients.length == 0){
                      $scope.no =0;
                    }else if($scope.newcategoryData.ingredients.length == 1){
                      $scope.no = 1;
                    }else if($scope.newcategoryData.ingredients.length == 2){
                      $scope.no = 2;
                    }else if($scope.newcategoryData.ingredients.length == 3){
                      $scope.no = 3;
                    }else if($scope.newcategoryData.ingredients.length == 4){
                      $scope.no = 4;
                    }else if($scope.newcategoryData.ingredients.length == 5){
                      $scope.no = 5;
                    }else if($scope.newcategoryData.ingredients.length == 6){
                      $scope.no = 6;
                    }else if($scope.newcategoryData.ingredients.length == 7){
                      $scope.no = 7;
                    }else if($scope.newcategoryData.ingredients.length == 8){
                      $scope.no = 8;
                    }else if($scope.newcategoryData.ingredients.length == 9){
                      $scope.no = 9;
                    }else{
                      $scope.no=10;
                    }
                    // console.log("showTBMI", scope.showTBMI, scope.toBeMappedItems);
                    $scope.count=0;
                    for(var i=0; i<$scope.no; i++) {
                      $scope.showIngredients.push($scope.newcategoryData.ingredients[i]);
                      $scope.count++;
                    }
                    if($scope.newcategoryData.ingredients.length >10){
                    $scope.getMore();
                  }
             
                $rootScope.$on('start_search_inv',function(evn,data) {
                    $scope.searchText = data;
                    // console.log("$scope.searchText",$scope.searchText)
                })
                // console.log("$scope.newcategoryData",$scope.newcategoryData)
                // $rootScope.allCatData = $scope.allCatData;
                $scope.$on('MinorCatSelect', function (item) {
                    $scope.groupminor = inventoryService.getSelectedGroupBy();
                    if($scope.groupminor == 'minor_category'){
                    $scope.minorcat=false;
                    }else{
                    $scope.minorcat=true;
                    }
                });
                inventoryService.setAllCatData($scope.allCatData);
                if($scope.groupminor == 'minor_category'){
                $scope.minorcat=false;
                }else{
                $scope.minorcat=true;
                }
//                 $scope.$watch('categoryData', function(val){
//               //    console.log('watch:');
//                   val.totalValue = val.ingredients.filter(function (ele) {
//                       return ele.ingredient_price !== undefined && ele.ingredient_status == "active" && ele.ingredient_price !== null && ele.quantity !== undefined && ele.quantity !== null && !isNaN(ele.quantity);
//                   }).map(function (ele) {
//                       return ele.ingredient_price * ele.quantity;
//                   }).reduce(function (prev, cur) {
//                       // var newPrev = isNaN(prev) ? prev : parseFloat(prev);
//                       // var newCur = isNaN(cur) ? cur : parseFloat(cur);
//                       return prev + cur;
//                   }, 0);
// //                  console.log("Total val: ", val.totalValue);

//                   $scope.newcategoryData = val;

//                   // console.log("new ",$scope.newcategoryData);
//                 })

                if (!_.has($scope.categoryData, ['isExpanded'])) {
                    $scope.categoryData.isExpanded = false;
                }

                $scope.categoryData.quantityValidationPassed = true;
                this.updateCategoryValue = function (config) {
                     // console.log('updateCategoryValue-----------')
                     // console.log($scope.categoryData)
                    // $scope.categoryData.totalValue = $scope.categoryData.ingredients.filter(function (ele) {
                    //     return ele.ingredient_price !== undefined && ele.ingredient_status == "active" && ele.ingredient_price !== null && ele.quantity !== undefined && ele.quantity !== null && !isNaN(ele.quantity);
                    // }).map(function (ele) {
                    //     return ele.ingredient_price * ele.quantity;
                    // }).reduce(function (prev, cur) {
                    //     // var newPrev = isNaN(prev) ? prev : parseFloat(prev);
                    //     // var newCur = isNaN(cur) ? cur : parseFloat(cur);
                    //     return prev + cur;
                    // }, 0);
                   // console.log("Total val: "+ $scope.categoryData.totalValue);
                    if (angular.isDefined(config)) {
                        $scope.categoryData.quantityValidationPassed = !_.some($scope.categoryData.ingredients, {
                            'quantityValidationPassed': false
                        });
                    }
                    // console.log($scope.categoryData,config);
                    $rootScope.$emit('product-category-value-updated', {
                        id: $scope.categoryData.id,
                        value: $scope.categoryData.totalValue,
                        config: config
                    });
                };
                $scope.updateIngredientList = function (data) {
                    $scope.$emit('product-ingredient-updated', {
                        id: data.id,
                        unit: data.quantity_units,
                        config: data.config
                    });
                }
                var modal_shown = false;
                $scope.editConfig = function (item, focusItem) {
                  // console.log('editttt configggg----');
                    item.selectedBackGround = "inventory-item-selected";
                    // $timeout(function(){
                      $rootScope.$broadcast('INVENTORYITEMSELECTED', item.inventory_item_id)
                    // });
                    item.focusItem = focusItem;
                    // console.log($scope.categoryData)
                    // console.log($scope.allCatData)
                    var newObj = {
                        'single': $scope.categoryData.ingredients,
                        'all': $scope.allCatData
                    }
                    var modalClose = showConfigModal(newObj);

                    $timeout($ionicListDelegate.closeOptionButtons());
                    modalClose.then(function (response) {
                        // console.log('close*****************',response)
                        modal_shown = false;
                        if (response.config_saved) {
                            // console.log('***89898******');
                            let new_config = response.new_config;
                            // console.log(new_config);
                            //   item.ingredient_alias_name = new_config.supplierItemAliasName;
                            //   item.par = new_config.par;
                            //   item.ingredient_category = new_config.ingredientInventoryCategory;
                            //   item.quantity_units_id = new_config.inventoryMeasurementId;
                            //   item.quantity_units = new_config.measurementName;
                            //   item.ingredient_price = new_config.inventoryMeasurementUnitPrice;
                            //   item.quantity = item.quantity * new_config.computedConversionFactor;
                            //   item.stageQuantity = item.quantity.toFixed(2);
                            //   item.active = new_config.active;
                            //   console.log(item);
                            $rootScope.$emit('NEWSUPPLIERITEMCONFIGUPDATED', response.new_config)
                        }
                    })
                };
                var showConfigModal = function (item) {
                    // console.log("modal item : ", item);
                    if (!modal_shown) {
                        modal_shown = appModalService.show('application/inventory-management/directives/config-modifier/inventory-config-modifier.html', 'configModifierCtrl', item)
                        // modal_shown = appModalService.show('inventoryConfigModifierTemplate', 'configModifierCtrl', item)
                    }
                    return modal_shown
                };
                $scope.addQuantity = function (item) {
                    // console.log('addQuantity*********',item)
                    item.selectedBackGround = "inventory-item-selected";
                    // $timeout(function(){
                      $rootScope.$broadcast('INVENTORYITEMSELECTED', item.inventory_item_id)
                    // });
                    var itemCopy = angular.copy(item);
                    // console.log(item);
                    var modalClose = showAddQuantityModal(item);
                    $timeout($ionicListDelegate.closeOptionButtons());
                    modalClose.then(function (response) {
                        modal_shown = false;
                        // console.log("response : ", parseFloat(response.new_quantity.convertedAddedQuantity), itemCopy);
                        // console.log(response.new_quantity);
                        if (response.quantity_added) {
                            response.new_quantity.convertedAddedQuantity = parseFloat(response.new_quantity.convertedAddedQuantity)
                            // console.log(itemCopy.stageQuantity);
                            if (angular.isDefined(itemCopy.stageQuantity)) {
                                itemCopy.stageQuantity = parseFloat(item.stageQuantity) + parseFloat(response.new_quantity.convertedAddedQuantity);
                                // response.new_quantity.convertedAddedQuantity = parseFloat(response.new_quantity.convertedAddedQuantity)+parseFloat(item.stageQuantity)
                            } else {
                                itemCopy.stageQuantity = response.new_quantity.convertedAddedQuantity;
                            }
                            // console.log("response.new_quantity,item",response.new_quantity,item)
                            $scope.$broadcast('INVENTORYQUANTITYADDED', response.new_quantity,item)
                        }
                    })
                };
                var showAddQuantityModal = function (item) {
                    if (!modal_shown) {
                        // modal_shown = appModalService.show('inventoryAddQuantityTemplate', 'inventoryAddQuantityCtrl', item)
                        modal_shown = appModalService.show('application/inventory-management/directives/add-quantity/add-quantity.html', 'inventoryAddQuantityCtrl', item)
                    }
                    return modal_shown
                };
                this.editUnits = function (item,focusItem) {
                    item.selectedBackGround = "inventory-item-selected";
                    // $timeout(function(){
                      $rootScope.$broadcast('INVENTORYITEMSELECTED', item.inventory_item_id)
                    // });
                    item.focusItem = focusItem;
                    // console.log($scope.categoryData);
                    // console.log($scope.allCatData);
                    var newObj = {
                        'single': $scope.categoryData.ingredients,
                        'all': $scope.allCatData
                    }
                    var modalClose = showEditUnitsModal(newObj);
                    $timeout($ionicListDelegate.closeOptionButtons());
                    modalClose.then(function (response) {
                        modal_shown = false;
                    })
                };
                var showEditUnitsModal = function (item) {
                    // console.log("insdie units " + modal_shown);
                    // console.log(item);
                    if (!modal_shown) {
                        // modal_shown = appModalService.show('inventoryChangePriceTemplate', 'inventoryChangePriceCtrl', item)
                        // console.log("showing edit price modal");
                        modal_shown = appModalService.show('application/inventory-management/directives/change-units/change-units.html', 'inventoryChangeUnitsCtrl', item)
                    }
                    return modal_shown
                }
                this.editUnitPrice = function (item,reqConfig) {
                    item.selectedBackGround = "inventory-item-selected";
                    // $timeout(function(){
                      $rootScope.$broadcast('INVENTORYITEMSELECTED', item.inventory_item_id)
                    // });
                    // console.log("showing edit price modal");
                    var modalClose = showEditPriceModal(item);
                    modalClose.then(function (response) {
                        modal_shown = false;
                        // console.log(response);
                        if (response.unitprice_changed) {

                            // console.log(item);
                            // if (angular.isDefined(item.stageQuantity)){
                            //     item.stageQuantity += response.new_quantity.convertedAddedQuantity;
                            // }else{
                            //     item.stageQuantity = response.new_quantity.convertedAddedQuantity;
                            // }

                            $scope.$emit('INVENTORYUNITPRICECHANGED', response.new_price)
                            // this.updateCategoryValue(reqConfig);
                        }
                    })
                };
                var showEditPriceModal = function (item) {
                    // console.log("insdie edit price " + modal_shown);
                    // console.log(item);
                    if (!modal_shown) {
                        // modal_shown = appModalService.show('inventoryChangePriceTemplate', 'inventoryChangePriceCtrl', item)
                        // console.log("showing edit price modal");
                        modal_shown = appModalService.show('application/inventory-management/directives/change-price/change-price.html', 'inventoryChangePriceCtrl', item)
                    }
                    return modal_shown
                }
                $scope.showItems = function(itemCate){
                    // console.log(itemCate);
                    // $rootScope.catItemList = itemCate;
                    // $rootScope.mode = $scope.mode;
                    // $rootScope.filterView = $scope.filterView;

                    inventoryService.setCatItems(itemCate);
                    inventoryService.setMode($scope.mode);
                    inventoryService.setFilterView($scope.filterView);
                    // inventoryService.setStatusMsg($scope.filterView);

                    $state.go('app.inventoryItems');
                }

            },
            controllerAs: 'ctrl',
            templateUrl: 'application/inventory-management/directives/product-category/product-category.html',
            // templateUrl: 'inventoryProductCategory',
            link: function (scope, ele, attr, controllers) {

                var testQuantity = function (quantityVal) {
                    if (_.isNull(quantityVal)) {
                        return true;
                    }
                    return /^[0-9.]+$/.test(quantityVal);
                };
                controllers.scope = scope;
                controllers.updateCategoryValue();
                $rootScope.$on('SHOW_PAR_GROUP', function() {
                  // console.log('SHOW_PAR_GROUP')
                  controllers.updateCategoryValue();
                });
                scope.reData = {};
                $scope.isCalulated = false;
                $rootScope.$on('calculatedPrice',function(evnt,data) {
                    $scope.isCalulated = true;
                    _.forEach(data,function(item) {
                        if(!item.isExpanded) {
                            scope.toggleGroupItem(item);
                            // console.log("item",item)
                        }
                    })
                })
                scope.toggleGroupItem = function(group) {
                    // console.log("group",group)
                    if(!group.isExpanded){
                        scope.showItemsLoading = true;
                      }
                    group.isExpanded = !group.isExpanded;
                    scope.showItemsLoading = false; // search fixed
                    if($scope.isCalulated){
                        $scope.newcategoryData = group;
                    }else{
                        $scope.newcategoryData = $scope.categoryData;
                    }
                }
                scope.toggleGroup = function (group) {
                    // console.log("group",group)
                    $scope.newcategoryData = $scope.categoryData;
                    scope.reData = angular.copy(group);
                    $rootScope.groupData = group;
                    // console.log("scope.reData",scope.reData);
                    // $timeout(function () {
                      if(!group.isExpanded){
                        scope.showItemsLoading = true;
                      }
                      // $rootScope.$broadcast('checkforExpanded',group);
                    // },1)
                    // scope.$emit('GROUPTOGGLED', {
                    //     expanded: !group.isExpanded,
                    //     num: group.ingredients.length
                    // });
                    // $timeout(function () {
                        group.isExpanded = !group.isExpanded;
                        scope.showItemsLoading = false; // search fixed
                    // },1)


                };
                $rootScope.$on('supliernamechange',function(){
                    scope.showItemsLoading = true;
                    scope.toggleGroup(scope.reData);
                    // console.log("scope.categoryData",scope.categoryData)
                    $timeout(function(){
                        scope.showItemsLoading = false;
                    },500)

                })

                scope.$on('finishedCategoryItemsRender', function (ngRepeatFinishedEvent) {
                    scope.showItemsLoading = false;
                });

                var modal_shown = false;
                // controllers.editConfig = function (item, focusItem) {
                //     item.selectedBackGround = "inventory-item-selected";
                //     // $timeout(function(){
                //       $rootScope.$broadcast('INVENTORYITEMSELECTED', item.inventory_item_id)
                //     // });
                //     item.focusItem = focusItem;
                //     console.log(scope.categoryData)
                //     console.log(scope.allCatData)
                //     var newObj = {
                //         'single': scope.categoryData.ingredients,
                //         'all': scope.allCatData
                //     }
                //     var modalClose = showConfigModal(newObj);
                //     // var modalClose = showConfigModal($scope.allCatData);
                //     // var modalClose = showConfigModal(item);
                //     $timeout($ionicListDelegate.closeOptionButtons());
                //     modalClose.then(function (response) {
                //         console.log('close*****************',response)
                //         modal_shown = false;
                //         if (response.config_saved) {
                //             scope.$emit('SUPPLIERITEMCONFIGUPDATED', response.new_config)
                //         }
                //
                //     })
                //
                // };
                //
                //
                // var showConfigModal = function (item) {
                //
                //     console.log("modal item : ", item);
                //
                //     if (!modal_shown) {
                //
                //         modal_shown = appModalService.show('application/inventory-management/directives/config-modifier/inventory-config-modifier.html', 'configModifierCtrl', item)
                //         // modal_shown = appModalService.show('inventoryConfigModifierTemplate', 'configModifierCtrl', item)
                //
                //     }
                //     return modal_shown
                //
                // };


                // controllers.addQuantity = function (item) {
                //     // console.log('addQuantity*********',item)
                //     item.selectedBackGround = "inventory-item-selected";
                //     // $timeout(function(){
                //       $rootScope.$broadcast('INVENTORYITEMSELECTED', item.inventory_item_id)
                //     // });
                //     var itemCopy = angular.copy(item);
                //     var modalClose = showAddQuantityModal(item);
                //     $timeout($ionicListDelegate.closeOptionButtons());
                //     modalClose.then(function (response) {
                //         modal_shown = false;
                //         console.log("response : ", response, itemCopy);
                //         if (response.quantity_added) {
                //             if (angular.isDefined(itemCopy.stageQuantity)) {
                //                 itemCopy.stageQuantity = parseFloat(item.stageQuantity) + parseFloat(response.new_quantity.convertedAddedQuantity);
                //             } else {
                //                 itemCopy.stageQuantity = response.new_quantity.convertedAddedQuantity;
                //             }
                //             scope.$broadcast('INVENTORYQUANTITYADDED', response.new_quantity,item)
                //         }
                //
                //     })
                //
                // };


                // controllers.editUnitPrice = function (item,reqConfig) {
                //     item.selectedBackGround = "inventory-item-selected";
                //     // $timeout(function(){
                //       $rootScope.$broadcast('INVENTORYITEMSELECTED', item.inventory_item_id)
                //     // });
                //     console.log("showing edit price modal");
                //     var modalClose = showEditPriceModal(item);
                //     modalClose.then(function (response) {
                //         modal_shown = false;
                //         console.log(response);
                //         if (response.unitprice_changed) {
                //
                //             console.log(item);
                //             // if (angular.isDefined(item.stageQuantity)){
                //             //     item.stageQuantity += response.new_quantity.convertedAddedQuantity;
                //             // }else{
                //             //     item.stageQuantity = response.new_quantity.convertedAddedQuantity;
                //             // }
                //
                //             scope.$emit('INVENTORYUNITPRICECHANGED', response.new_price)
                //             controllers.updateCategoryValue(reqConfig);
                //
                //         }
                //
                //     })
                //
                // };
                // controllers.editUnits = function (item,focusItem) {
                //     item.selectedBackGround = "inventory-item-selected";
                //     // $timeout(function(){
                //       $rootScope.$broadcast('INVENTORYITEMSELECTED', item.inventory_item_id)
                //     // });
                //     item.focusItem = focusItem;
                //     console.log(this.categoryData);
                //     console.log(this.allCatData);
                //     var newObj = {
                //         'single': this.categoryData.ingredients,
                //         'all': this.allCatData
                //     }
                //     var modalClose = showEditUnitsModal(newObj);
                //     $timeout($ionicListDelegate.closeOptionButtons());
                //     modalClose.then(function (response) {
                //         modal_shown = false;
                //
                //     })
                // };

                // var showAddQuantityModal = function (item) {
                //     if (!modal_shown) {
                //         // modal_shown = appModalService.show('inventoryAddQuantityTemplate', 'inventoryAddQuantityCtrl', item)
                //         modal_shown = appModalService.show('application/inventory-management/directives/add-quantity/add-quantity.html', 'inventoryAddQuantityCtrl', item)
                //     }
                //     return modal_shown
                // };

                // var showEditPriceModal = function (item) {
                //     console.log("insdie edit price " + modal_shown);
                //     console.log(item);
                //
                //     if (!modal_shown) {
                //         // modal_shown = appModalService.show('inventoryChangePriceTemplate', 'inventoryChangePriceCtrl', item)
                //         console.log("showing edit price modal");
                //         modal_shown = appModalService.show('application/inventory-management/directives/change-price/change-price.html', 'inventoryChangePriceCtrl', item)
                //     }
                //     return modal_shown
                // }

                // var showEditUnitsModal = function (item) {
                //     console.log("insdie units " + modal_shown);
                //     console.log(item);
                //     if (!modal_shown) {
                //         // modal_shown = appModalService.show('inventoryChangePriceTemplate', 'inventoryChangePriceCtrl', item)
                //         console.log("showing edit price modal");
                //         modal_shown = appModalService.show('application/inventory-management/directives/change-units/change-units.html', 'inventoryChangeUnitsCtrl', item)
                //     }
                //     return modal_shown
                // }

                $rootScope.$on('INVENTORYITEMSELECTED', function(event, itemSelected){
                    // console.log("caught item select")
                    _.each(controllers.categoryData.ingredients, function(ingredient){
                        if(ingredient.inventory_item_id !== itemSelected){
                            ingredient.selectedBackGround = "";
                        }
                    })
                })
                $rootScope.$on('category-value-updated', function (evt, data,name) {
                  if(controllers.categoryData.name == name)
                    controllers.updateCategoryValue(data);
                });
                $rootScope.$on('edit-configuration', function (evt, data) {
                  // console.log(controllers.categoryData.name);
                  // console.log(data.ingredient_category);
                  if(controllers.categoryData.name == data.ingredient_category)
                    controllers.scope.editConfig(data);
                });


                // $rootScope.$on('UPDATE_TOTAL', function() {
                //     console.log('UPDATE_TOTAL',controllers.categoryData)
                //     controllers.categoryData.totalValue = controllers.categoryData.ingredients.filter(function (ele) {
                //         return ele.ingredient_price !== undefined && ele.ingredient_status == "active" && ele.ingredient_price !== null && ele.quantity !== undefined && ele.quantity !== null && !isNaN(ele.quantity);
                //     }).map(function (ele) {
                //         return ele.ingredient_price * ele.quantity;
                //     }).reduce(function (prev, cur) {
                //         // var newPrev = isNaN(prev) ? prev : parseFloat(prev);
                //         // var newCur = isNaN(cur) ? cur : parseFloat(cur);
                //         return prev + cur;
                //     }, 0);
                //     console.log("Total val: "+ controllers.categoryData.totalValue);
                // });

            }
        };
    };
    productCategory.$inject = ['$rootScope', '$ionicScrollDelegate', '$ionicPopup', '$timeout', '$ionicActionSheet', '$ionicListDelegate', 'appModalService', 'CommonService','$state','inventoryService'];
    projectCostByte.directive('productCategory', productCategory);
})();
