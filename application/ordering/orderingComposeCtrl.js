
(function() {
    var orderingcompose = function($q, $state, $ionicFilterBar, $ionicActionSheet, orderingItemsSvc, $ionicLoading, $ionicPopup, $ionicScrollDelegate, $timeout, orderingHomeSvc, ionicDatePicker,inventoryItemsSvc,$ionicHistory,orderingService,$rootScope) {
        return {
            restrict: 'E',
            // replace: true,
            scope: {
              orderingitemid: '=',
              orderingitemname: '=',
              storeid: '=',
              dateofcreation: '='
            },
            bindToController: {
                item: '&',
            },
            controller: function() {

            },
            controllerAs: 'ctrl',
            templateUrl: 'application/ordering/ordering-compose.html',
            link: function($scope, ele, attr, controllers) {
              console.log(' ------------------ DIRECTIVE COMPOSE ------------- ');
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
                  name: 30,
                  last: 12,
                  value: 20,
                  par: 15,
                  qih: 7,
                  order: 15,

                  // name : 28,
                  // last :10,
                  // par : 13,
                  // qih :13,
                  // order :13,
                  // value :15,

              }
              $scope.showLoader = true;
              $scope.fullList = [];
              $scope.fullGroupedList = [];
              $scope.items = [];
              var errorToastMessage = "<span style=\"padding-top: -15px; font-weight: 500;\" class=\"redflag\">Error Occured. Report Sent.</span>";
              // $scope.init = function() {
                  // $scope.navBarTitle.showToggleButton = false; // to show back button in header bar
                  // $scope.orderingId = $state.params.ordering;
                  // $scope.ordering_name = $state.params.ordering_name;
                  // $scope.store_id = $state.params.store_id;
                  console.log('************** INIT COMPOSE **************');
                  $scope.orderingId = $scope.orderingitemid;
                  $scope.ordering_name = $scope.orderingitemname;
                  $scope.store_id = $scope.storeid;
                  $scope.dateCreated = $scope.dateofcreation;

                  orderingItemsSvc.getIngredients($scope.orderingId).then(function(data) {
                      orderingService.setDraftItems(data);
                      $scope.ordering_status = data.ordering_status;
                      _.forEach(data.ingredients, function(value) {
                        value.last_updated_converted_date = new Date(parseInt(value.last_updated_at, 10)*1000).toLocaleDateString("en-US");
                      });
                      //
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
                      $scope.fullList = data.ingredients;
                      // console.log($scope.fullList);
                      $scope.isLocationAvailable = _.unionBy($scope.fullList, "location").map(function(ele) {
                          return ele.location;
                      }).filter(function(ele) {
                          return !!ele
                      }).length > 0;
                      //                $scope.fullGroupedList = $scope.groupIngredients($scope.categorieViews[$scope.currentView], $scope.fullList);
                      $scope.items = $scope.groupIngredients($scope.categorieViews[$scope.currentView], $scope.fullList);
                      $scope.updatedItems = $scope.items;
                      $scope.showLoader = false;
                  });
              // };

              $scope.showPopup = function() {
                  $scope.data = {};
                  $scope.data.datetimeValue = $scope.dateCreated;
                  $scope.data.name = $scope.ordering_name;

                  $scope.openDatePicker = function() {
                      var datepickerObject = {
                          callback: function(val) { //Mandatory
                              $scope.data.datetimeValue = new Date(val);
                          },
                          disabledDates: [],
                          from: new Date(2016, 6, 1), //Optional
                          to: new Date(), //Optional
                          inputDate: new Date(), //Optional
                          mondayFirst: true, //Optional
                          disableWeekdays: [], //Optional
                          closeOnSelect: false, //Optional
                          templateType: 'popup' //Opional
                      }
                      ionicDatePicker.openDatePicker(datepickerObject);
                  }

                  var myPopup = $ionicPopup.show({
                      template: '<div>name:</div><input placeholder={{data.name}} type="text" ng-model="data.name"/>' +
                          '<div>time:</div><div class="item" ng-click= "ctrl.openDatePicker()">{{data.datetimeValue| date: "yyyy-MM-dd"}}</div>' +
                          '<div ng-if="ctrl.stores.length>0" id="dropdown-container"><div style="margin-top: 10px">selected Store: </div> <div style="font-style:italic; padding: 5px; background: lightgray; text-align: center;">{{selectedStore.store_name}}</div></div>',
                      title: 'Edit Ordering',
                      subTitle: '',
                      scope: $scope,
                      buttons: [{
                          text: 'Cancel'
                      }, {
                          text: '<b>Save</b>',
                          type: 'button-positive',
                          onTap: function(e) {
                              if (!$scope.data.name) {
                                  //don't allow the user to close unless he enters wifi password
                                  e.preventDefault();
                              } else {
                                  return $scope.data;
                              }
                          }
                      }]
                  });
                  myPopup.then(function(res) {
                      if (!!res && !!res.name) {
                          var submitPayload = {
                              "updated_name": res.name,
                              "updated_date": Math.floor(res.datetimeValue.getTime() / 1000).toString(),
                              "draft_id": $scope.orderingId
                          };
                          orderingHomeSvc.updateOrdering(submitPayload).then(function(data) {
                              $scope.ordering_name = res.name;
                              $scope.dateCreated = res.datetimeValue;
                          });
                      }
                  });
              }
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
                          // console.log(index);

                          // switch (index) {
                          //     case 0:
                          //         $scope.currentView = "PRODUCT_CATEGORY";
                          //         break;
                          //     case 1:
                          //         $scope.currentView = 'Last_Purchase';
                          //         break;
                          //     case 2:
                          //         $scope.currentView = 'Supplier';
                          //         break;
                          //     default:
                          //         $scope.currentView = "PRODUCT_CATEGORY";
                          //         break;
                          // }
                          hideSheet();
                          $scope.showLoader = true;
                          if(index == 0){
                              $scope.currentView = "PRODUCT_CATEGORY";
                          } else if(index == 1){
                              $scope.currentView = "Last_Purchase";

                          } else if(index == 2){
                              $scope.currentView = "Supplier";
                          }
                          // //$scope.fullGroupedList = $scope.groupIngredients($scope.categorieViews[$scope.currentView], $scope.fullList);
                          // // console.log($scope.categorieViews);
                          // // console.log( $scope.fullList);

                          $scope.items = $scope.groupIngredients($scope.categorieViews[$scope.currentView], $scope.fullList);
                          // // console.log($scope.items);

                          return true;
                      }
                  });
              };

              $scope.groupIngredients = function(currentView, data) {
                  var categories = _.groupBy(data, currentView);
                  $scope.fullGroupedList = _.map(categories, function(cat) {
                    // console.(cat);
                    let titleName = cat[0][currentView] ? cat[0][currentView] : "UNMAPPED";
                      return {
                          name: titleName,
                          ingredients: cat,
                          type: currentView,
                          //                    rank : _.reduce(cat, function(memo, ingredient){ return memo + ingredient.rank; }, 0)/(cat.length)
                          rank: _.get(cat, '[0].rank') // category rank = minimum of(ingredient ranks in category)
                      }
                  });
                  $scope.fullGroupedList = _.sortBy($scope.fullGroupedList, 'rank')
                  $scope.showLoader = false;
                  // $scope.items = angular.copy($scope.fullGroupedList);
                  return angular.copy($scope.fullGroupedList);
                  // return true;

              };

              // $scope.showFilterBar = function() {
              //   console.log('showFilterBar********');
              //     filterBarInstance = $ionicFilterBar.show({
              //         items: $scope.items,
              //         update: function(filteredItems, filterText) {
              //           console.log(filteredItems);
              //             $scope.items = filteredItems;
              //         }
              //     });
              // };

              var removeSearchStatus = false;
              var removeSearch = function() {
                removeSearchStatus = true;
                //console.log("removeSearch : ", !angular.isUndefined(filterBarInstance));
                if (!angular.isUndefined(filterBarInstance)) {
                  filterBarInstance()
                  _.forEach($scope.items, function(inventoryGroup) {
                    _.forEach(inventoryGroup.ingredients, function(ingredient) {
                      ingredient.searchHidden = false;

                    })
                  })
                }
              }

              $scope.showFilterBar = function() {
                //console.log("$scope.item in filter : ", $scope.items);
                var search_fields = ['ingredient_alias_name', 'ingredient_category', 'ingredient_name', 'supplier_name', 'location'];

                filterBarInstance = $ionicFilterBar.show({
                  items: $scope.updatedItems,
                  debounce: true,
                  update: function(filteredItems, filterText) {
                    if (angular.isDefined(filterText) && filterText.length > 0) {
                      _.forEach(filteredItems, function(inventoryGroup) {
                        _.forEach(inventoryGroup.ingredients, function(ingredient) {
                          var keepIngredient = false;
                          _.forEach(search_fields, function(search_field) {
                            // console.log(ingredient, search_field);
                            var textToSearch = _.get(ingredient, search_field, "");
                            if (textToSearch != "") {
                              if (textToSearch.toLowerCase().indexOf(filterText.toLowerCase()) != -1) {
                                keepIngredient = true
                              }
                            }
                            if (keepIngredient) {
                              ingredient.searchHidden = false;
                            } else {
                              ingredient.searchHidden = true;
                            }
                          })
                        })

                      })
                      //console.log(filteredItems)
                      $scope.items = filteredItems
                    } else {
                      //console.log("else part : ", $scope.items);
                      $scope.items = $scope.updatedItems;
                      if (removeSearchStatus) {
                        removeSearchStatus = false;
                        return
                      }
                      _.forEach(filteredItems, function(inventoryGroup) {
                        _.forEach(inventoryGroup.ingredients, function(ingredient) {
                          ingredient.searchHidden = false;

                        })
                      })
                    }
                  },
                  cancel: function() {
                    //console.log("cancel is called : ", $scope.items);
                    $scope.items = $scope.updatedItems;
                  }
                });
              };


              $scope.updatedList = function() {
                  $scope.fullGroupedList = angular.merge($scope.fullGroupedList, $scope.items);
                  $scope.fullList = _.flattenDeep($scope.fullGroupedList.map(function(cat) {
                      return cat.ingredients;
                  }));
                  return $scope.fullList;
              };

              $scope.submitOrdering = function() {
              var confirmPopup = $ionicPopup.confirm({
                      title: 'Order Submit',
                      template: 'Do you want to submit Order ?',
                  });
                  orderingItemsSvc.postIngredients($scope.updatedList(), $scope.ordering_status).then(function() {
                          $scope.showLoader = true;
                          orderingItemsSvc.setDraftSavedTime($scope.orderingId);

                          confirmPopup.then(function(res) {
                              if (res) {
                                   $scope.showLoader = true;
                                  $scope.ordering_status = 'submitted';
                                  orderingItemsSvc.postIngredients($scope.updatedList(), $scope.ordering_status).then(
                                      function() {
                                          $state.go('app.ordering');
                                      },
                                      function(errorResponse) {
                                          toastMessage(errorToastMessage)
                                          var lastSavedtime = orderingItemsSvc.getDraftSavedTime($scope.orderingId);
                                          $scope.showLoader = false;
                                          $scope.saveStatus = [{
                                              text: "Submit failed. ",
                                              level: "save-status-red"
                                          }];
                                          if (lastSavedtime != "") {
                                              $scope.saveStatus.push({
                                                  text: "Last saved on " + lastSavedtime,
                                                  level: "save-status-green"
                                              })
                                          }
                                      }
                                  );
                              } else {
                                  $state.go('app.composeOrdering', {
                                      ordering: $scope.orderingId
                                  }).then(function() {
                                      $scope.showLoader = false;
                                  });
                              }
                          });
                      },
                      function(errorResponse) {
                          toastMessage(errorToastMessage)
                          $scope.saveStatus = [{
                              text: "Submit failed. Remove errors and resubmit.",
                              level: "save-status-red"
                          }];

                      }
                  );

              };

              var checkForFailedQuantities = function() {
                  var failedQuantitesFound = false;
                  for (var i = 0; i < $scope.items.length; i++) {
                      for (var j = 0; j < $scope.items[i].ingredients.length; j++) {
                          var ingredient = $scope.items[i].ingredients[j]
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

              $scope.ionicGoBack = function(){
                $ionicHistory.goBack();
                // console.log($ionicHistory.viewHistory().backView.stateName);
                // console.log(window.history);
                // window.history.back();
                // $state.go($ionicHistory.viewHistory().backView.stateName);
              }

              $scope.$on('product-category-value-updated', function(evt, data) {
                // console.log(data);
                // console.log($scope.items);
                  $scope.totalValue = $scope.items.filter(function(ele) {
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

              var toastMessage = function(message_text, duration) {
                  if (typeof duration === 'undefined') duration = 2000;
                  $ionicLoading.show({
                      template: message_text,
                      noBackdrop: true,
                      duration: duration
                  });
              }

              $scope.onViewOrderTap = function() {
                  $scope.showLoader = true;
                  console.log($scope.orderingId,$scope.ordering_name)
                  $state.go('app.viewOrderCart', {
                      ordering: $scope.orderingId,
                      ordering_name: $scope.ordering_name
                  });
              };

              $scope.$on('set_draft_item_grouping', function(event) {
                console.log('set_draft_item_grouping event called-------');
                // $scope.showLoader = true;
                // getLatestDraftItems(orderingId);
                $scope.selectGrouping();
              });
              // *********************************************
            } //Link
      }
    };
    orderingcompose.$inject = ['$q', '$state', '$ionicFilterBar', '$ionicActionSheet', 'orderingItemsSvc', '$ionicLoading', '$ionicPopup', '$ionicScrollDelegate', '$timeout', 'orderingHomeSvc', 'ionicDatePicker','inventoryItemsSvc','$ionicHistory','orderingService','$rootScope'];
    projectCostByte.directive('orderingcompose', orderingcompose)
})();
