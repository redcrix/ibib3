(function() {
    var CartView = function($state, $ionicFilterBar, $ionicActionSheet, orderingItemsSvc, $ionicLoading, $ionicPopup, $ionicScrollDelegate,$timeout,$rootScope,orderingService,$q,orderingHomeSvc) {
        return {
            restrict: 'E',
            // replace: true,
            scope: {
              orderingitemid: '=',
              orderingitemname: '=',
              cart: '='
            },
            bindToController: {
                item: '&',
            },
            controller: function() {

            },
            controllerAs: 'ctrl',
            templateUrl: 'application/ordering/cart-view.html',
            link: function($scope, ele, attr, controllers) {
                // controllers.Item = controllers.item();
                // controllers.Item.total_value_of_ordering = controllers.Item.total_value_of_ordering != 0 ? parseFloat(controllers.Item.total_value_of_ordering).toFixed(2) : 0;
                // // console.log(controllers.Item.total_value_of_ordering);
                //
                // controllers.Item.date = new Date(parseInt(controllers.Item.ordering_date, 10) * 1000).formatForPeprOrdering();
                // console.log('******************* directive cart called ***************************');
                // console.log($scope.orderingitemid,$scope.orderingitemname);

                var filterBarInstance;
                $scope.categorieViews = {
                    "PRODUCT_CATEGORY": 'ingredient_category',
                    "Last_Purchase": 'last_updated_converted_date',
                    "Supplier": 'supplier_name'
                };
                $scope.categoryText = {
                    "PRODUCT_CATEGORY": 'Ingredient Category',
                    "Last_Purchase": 'last_updated_at',
                    "Supplier": 'Supplier'
                };
                $scope.currentView = "PRODUCT_CATEGORY";
                $scope.rowSize = {
                    // name: 30,
                    // last: 15,
                    // value: 13,
                    // par: 10,
                    // qih: 10,
                    // order: 13,

                    name: 32,
                    last: 12,
                    value: 20,
                    par: 15,
                    qih: 9,
                    order: 15,
                }


                $scope.showLoader = true;
                $scope.fullList = [];
                $scope.fullGroupedList = [];
                $scope.cartItems = [];
                $scope.showEmpty = false;
                function filterItems(getItems){
                  console.log(getItems);
                  if($scope.cart){
                    $scope.cartItems = _.forEach(getItems, function(value) {
                      value.ingredients = _.filter(value.ingredients, function(ing) {
                          return ing.quantity > 0;
                      });
                      return value;
                    });
                  }else {
                    $scope.cartItems = _.forEach(getItems, function(value) {
                      value.ingredients = _.filter(value.ingredients, function(ing) {
                        if(ing.quantity < ing.par){
                          ing.showRecommended = true;
                          // return ing.quantity < ing.par;

                        }
                        return ing;
                      });
                      return value;
                    });
                  }
                  console.log($scope.cartItems);
                  // $scope.getRecommendedGroup = orderingService.getrecommendedItems();
                  $scope.getRecommendedGroup = localStorage.getItem("recommendedGroup") ? JSON.parse(localStorage.getItem("recommendedGroup")) : [];
                  // console.log($scope.getRecommendedGroup);
                  _.forEach($scope.cartItems, function(ing) {
                    _.forEach(ing.ingredients, function(value) {
                      // console.log(value.inv_item_id);
                      if(value.inv_item_id){
                        let available = _.findIndex($scope.getRecommendedGroup,['inv_item_id',value.inv_item_id.toString()]);
                        // console.log(available);
                        if(available >= 0){
                            value.fromRecommended = true;
                            }
                        }
                    });
                  });
                  // console.log($scope.cartItems);
                  $scope.showEmpty =  _.find($scope.cartItems, function(ing) {
                    return ing.ingredients.length;
                  }) ? false : true;

                }



                // $scope.setDraftItems = function(data){
                //   _.forEach(data, function(value) {
                //       value.last_updated_converted_date = new Date(parseInt(value.last_updated_at, 10)*1000).toLocaleDateString("en-US");
                //   });
                //   $scope.fullList = data.filter(function(product) {
                //       return !isNaN(product.quantity);
                //   });
                //
                //   $scope.isLocationAvailable = _.unionBy($scope.fullList, "location").map(function(ele) {
                //       return ele.location;
                //   }).filter(function(ele) {
                //       return !!ele
                //   }).length > 0;
                //   let setItems = $scope.groupIngredients($scope.categorieViews[$scope.currentView], $scope.fullList);
                //   filterItems(setItems)
                //   $scope.showLoader = false;
                // }
                $scope.setDraftItems = function(data){
                  _.forEach(data.ingredients, function(value) {
                      value.last_updated_converted_date = new Date(parseInt(value.last_updated_at, 10)*1000).toLocaleDateString("en-US");
                  });
                  if (angular.isDefined(data.last_updated_at)) {
                      $scope.saveStatus = [{
                          text: "Last saved on " + data.last_updated_at,
                          level: "save-status-green"
                      }];
                  } else {
                      $scope.saveStatus = [{
                          text: "-",
                          level: "save-status-blank"
                      }];
                  }
                  if($scope.cart){
                    $scope.fullList = data.ingredients.filter(function(product) {
                        return !isNaN(product.quantity);
                    });
                  } else {
                    // $scope.fullList = data.ingredients.filter(function(product) {
                    //       return product.quantity < product.par;
                    // });
                    let localRecommended = localStorage.getItem("recommendedDatas") ? JSON.parse(localStorage.getItem("recommendedDatas")) : [];
                    // console.log(localRecommended);
                        let recommendedList = [];
                     _.forEach(localRecommended, function(value,i) {
                        recommendedList = _.filter(data.ingredients,function(ing){
                            let available = _.findIndex($scope.fullList,['ingredient_alias_name',ing.ingredient_alias_name.toString()]);
                            if(available < 0 && ing.ingredient_alias_name == value.ingredient_alias_name){
                              $scope.fullList.push(ing);
                            }
                            // return ing.ingredient_alias_name == value.ingredient_alias_name;
                        });
                     });


                  }
                  // console.log($scope.fullList);
                  $scope.ordering_status = data.ordering_status;
                  $scope.isLocationAvailable = _.unionBy($scope.fullList, "location").map(function(ele) {
                      return ele.location;
                  }).filter(function(ele) {
                      return !!ele
                  }).length > 0;
                  $scope.groupIngredients($scope.categorieViews[$scope.currentView], $scope.fullList).then(function(setItems){
                    // console.log(setItems);
                    filterItems(setItems)
                    $scope.showLoader = false;
                  });

                }



                $scope.orderingId = $scope.orderingitemid;
                $scope.ordering_name = $scope.orderingitemname;

                function getLatestDraftItems(orderingId){
                  // if($rootScope.stageQtyChanged){
                  orderingItemsSvc.getIngredients(orderingId).then(function(data) {
                      // console.log($scope.cart);
                      $scope.setDraftItems(data);
                  });
                }
                getLatestDraftItems($scope.orderingId);

                $scope.selectGrouping = function() {
                    var hideSheet = $ionicActionSheet.show({
                        buttons: [{
                            text: 'Category'
                        }, {
                            text: 'Last purchse date'
                        }, {
                            text: 'Supplier'
                        }],
                        titleText: 'Select store',
                        cancelText: 'Cancel',
                        cancel: function() {},
                        buttonClicked: function(index) {
                            switch (index) {
                                case 0:
                                    $scope.currentView = "PRODUCT_CATEGORY";
                                    break;
                                case 1:
                                    $scope.currentView = 'Last_Purchase';
                                    break;
                                case 2:
                                    $scope.currentView = 'Supplier';
                                    break;
                                default:
                                    $scope.currentView = "PRODUCT_CATEGORY";
                                    break;
                            }
                            //                    $scope.fullGroupedList = $scope.groupIngredients($scope.categorieViews[$scope.currentView], $scope.fullList);
                            // console.log($scope.categorieViews);
                              // console.log( $scope.fullList);
                            // let setItems = $scope.groupIngredients($scope.categorieViews[$scope.currentView], $scope.fullList);
                            $scope.groupIngredients($scope.categorieViews[$scope.currentView], $scope.fullList).then(function(setItems){
                              // console.log(setItems);
                              filterItems(setItems)
                              hideSheet();
                              return true;
                            });
                            // filterItems(setItems);
                            // hideSheet();
                            // return true;
                        }
                    });
                };

                $scope.groupIngredients = function(currentView, data) {
                  return $q(function(resolve, reject) {
                    var categories = _.groupBy(data, currentView);
                    $scope.fullGroupedList = _.map(categories, function(cat) {
                        let titleName = cat[0][currentView] ? cat[0][currentView] : "UNMAPPED";
                        // console.log(cat);
                        return {
                            name: titleName,
                            ingredients: cat,
                            type: currentView,
                            //                    rank : _.reduce(cat, function(memo, ingredient){ return memo + ingredient.rank; }, 0)/(cat.length)
                            rank: _.get(cat, '[0].rank') // category rank = minimum of(ingredient ranks in category)
                        }
                    });
                    $scope.fullGroupedList = _.sortBy($scope.fullGroupedList, 'rank');
                    // console.log($scope.fullGroupedList);
                    resolve(angular.copy($scope.fullGroupedList));
                  });
                }


                $scope.showFilterBar = function() {
                    filterBarInstance = $ionicFilterBar.show({
                        items: $scope.cartItems,
                        update: function(filteredItems, filterText) {
                            $scope.cartItems = filteredItems;
                            // console.log($scope.cartItems);
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

                $scope.updatedList = function() {
                    $scope.fullGroupedList = angular.merge($scope.fullGroupedList, $scope.cartItems);
                    $scope.fullList = _.flattenDeep($scope.fullGroupedList.map(function(cat) {
                        return cat.ingredients;
                    }));
                    let filtered = _.filter($scope.fullList, function(ing) {
                      return ing.quantity > 0;
                    });
                    return filtered;
                };
                $scope.updatedItemQtyList = function() {
                    $scope.fullGroupedList = angular.merge($scope.fullGroupedList, $scope.cartItems);
                    $scope.fullList = _.flattenDeep($scope.fullGroupedList.map(function(cat) {
                        return cat.ingredients;
                    }));
                    // let filtered = _.filter($scope.fullList, function(ing) {
                    //   return ing.quantity > 0;
                    // });
                    return $scope.fullList;
                };

                $scope.submitOrdering = function() {
                 //   $scope.showLoader = true;
                    var confirmPopup = $ionicPopup.confirm({
                        title: 'Order Submit',
                        template: 'Do you want to submit Order ?'
                    });
                    // orderingItemsSvc.postIngredients($scope.updatedList(), $scope.ordering_status).then(function() {

                            orderingItemsSvc.setDraftSavedTime($scope.orderingId);

                            confirmPopup.then(function(res) {
                                if (res) {
                                     $scope.showLoader = true;
                                     $scope.ordering_status = 'submitted';
                                     // console.log($scope.updatedList());
                                     orderingItemsSvc.postIngredients($scope.updatedList(), $scope.ordering_status).then(
                                        function() {
                                            $state.go('app.ordering');
                                        },
                                        function(errorResponse) {
                                          // console.log(errorResponse);
                                          //   toastMessage(errorResponse)
                                            var lastSavedtime = orderingItemsSvc.getDraftSavedTime($scope.orderingId);
                                            // $scope.showLoader = false;
                                            // $scope.saveStatus = [{
                                            //     text: "Submit failed. ",
                                            //     level: "save-status-red"
                                            // }];
                                            toastMessage('Submit failed. Remove errors and resubmit.');
                                            $timeout(function() {
                                              // $state.go('app.composeOrdering', {
                                              //     ordering: $scope.orderingId
                                              // }).then(function() {
                                              //     $scope.showLoader = false;
                                              // });
                                              $state.go('app.draftTabs', {
                                                  ordering: $scope.orderingId
                                              }).then(function() {
                                                  $scope.showLoader = false;
                                              });

                                            }, 1500)
                                            // if (lastSavedtime != "") {
                                            //     $scope.saveStatus.push({
                                            //         text: "Last saved on " + lastSavedtime,
                                            //         level: "save-status-green"
                                            //     })
                                            // }
                                        }
                                    );
                                }
                                // else {
                                //   // toastMessage('Not submitted.')
                                //   // $timeout(function() {
                                //   //   $state.go('app.draftTabs', {
                                //   //       ordering: $scope.orderingId
                                //   //   }).then(function() {
                                //   //       $scope.showLoader = false;
                                //   //   });
                                //   // }, 1500)
                                // }
                            });
                        // },
                        // function(errorResponse) {
                        //   console.log(errorResponse);
                        //     toastMessage('Submit failed. Remove errors and resubmit.')
                        //     // $scope.saveStatus = [{
                        //     //     text: "Submit failed. Remove errors and resubmit.",
                        //     //     level: "save-status-red"
                        //     // }];
                        //
                        // }
                    // );

                };

                $scope.$on('get_fresh_cart', function(event,orderingId) {
                  // console.log('EVENT-------',orderingId);
                  $scope.showLoader = true;
                  getLatestDraftItems(orderingId);
                });

                $scope.$on('set_cart_item_grouping', function(event) {
                  // console.log('set_cart_item_grouping event called-------');
                  $scope.selectGrouping();
                });

                //

                $scope.$on('product-category-value-updated', function(evt, data) {
                    $scope.totalValue = $scope.cartItems
                        //                .filter(function (ele) {
                        //                return ele.totalValue !== undefined && ele.totalValue !== null;
                        //                })
                        .map(function(ele) {
                            return ele.totalValue;
                        })
                        .reduce(function(prev, cur) {
                            return prev + cur;
                        }, 0);
                });

                var checkForFailedQuantities = function() {
                    var failedQuantitesFound = false;
                    for (var i = 0; i < $scope.cartItems.length; i++) {
                        for (var j = 0; j < $scope.cartItems[i].ingredients.length; j++) {
                            var ingredient = $scope.cartItems[i].ingredients[j]
                            if (ingredient.quantity != ingredient.stageQuantity) {
                                failedQuantitesFound = true;
                                break;
                            }
                        }
                        if (failedQuantitesFound) {
                            break;
                        }
                    }
                    if (failedQuantitesFound) {
                        $scope.saveStatus.push({
                            text: ".",
                            level: "save-status-green"
                        })
                        $scope.saveStatus.push({
                            text: "Invalid entries were ignored.",
                            level: "save-status-red"
                        })
                    }
                }

                $rootScope.$on('recommended-category-value-updated', function(evt, data) {
                  // console.log($scope.cartItems);

                      $scope.totalValue = $scope.cartItems.filter(function(ele) {
                          return ele.totalValue !== undefined && ele.totalValue !== null;
                      }).map(function(ele) {
                          return ele.totalValue;
                      }).reduce(function(prev, cur) {
                          return prev + cur;
                      }, 0);

                    orderingHomeSvc.passTotalValue($scope.totalValue, $scope.orderingId);
                    if (!!data && !!data.config && data.config.makeServerRequest) {
                        $scope.saveStatus = [{
                            text: "Saving...",
                            level: "save-status-neutral"
                        }];
                        orderingItemsSvc.postIngredients($scope.updatedList(), $scope.ordering_status).then(function() {
                            orderingItemsSvc.setDraftSavedTime($scope.orderingId);
                            $scope.saveStatus = [{
                                text: "All Changes saved to Pepr",
                                level: "save-status-green"
                            }];
                            checkForFailedQuantities();
                        }, function(errorResponse) {
                            toastMessage(errorToastMessage)
                            var lastSavedtime = orderingItemsSvc.getDraftSavedTime($scope.orderingId);
                            $scope.saveStatus = [{
                                text: "Autosave failed. ",
                                level: "save-status-red"
                            }];
                            if (lastSavedtime != "") {
                                $scope.saveStatus.push({
                                    text: "Last saved on " + lastSavedtime,
                                    level: "save-status-green"
                                })
                            }
                        });
                    }
                });

                $scope.$on('$destroy', function() {

                });

                $scope.$on('ReSizeScroll', function(evt) {
                    $timeout(function() {
                        $ionicScrollDelegate.resize();
                    }, 0)
                });

            }

        };
    };
    CartView.$inject = ['$state', '$ionicFilterBar', '$ionicActionSheet', 'orderingItemsSvc', '$ionicLoading', '$ionicPopup', '$ionicScrollDelegate','$timeout','$rootScope','orderingService','$q','orderingHomeSvc'];
    projectCostByte.directive('cartView', CartView)
})();
