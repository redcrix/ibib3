// (function () {
//     var InactiveItems = function ($scope,$rootScope,$state,$ionicPlatform,CommonService,$q,$timeout,$ionicLoading,$ionicFilterBar) {
(function () {
    var InactiveItems = function (CommonService,$q,$timeout,$ionicLoading,$ionicFilterBar,$rootScope,$ionicPlatform) {
        return {
            restrict: 'E',
            // replace: true,
            scope: {
              bar : '=',
              // items: '='
            },
            bindToController: {
                // item: '&'
            },
            controller: function () {

            },
            controllerAs: 'ctrl',
            templateUrl: 'application/inventory-management/inactive-items.html',
            link: function ($scope, ele, attr, controllers) {
                $rootScope.headerTitleINV="Inventory Manager";
                // scope.navBarTitle.showToggleButton = false;
                console.log('inactive page....')
                $rootScope.inactiveLocked = false;
                $scope.active = false;
                $scope.inactiveTabClick = function(){
                  $scope.active = false;
                }
                $scope.activeTabClick = function(){
                  $scope.active = true;
                }


                var toastMessage = function (message_text, duration) {
                  if (typeof duration === 'undefined') duration = 1500;
                  $ionicLoading.show({
                      template: message_text,
                      noBackdrop: true,
                      duration: duration
                  });
                };

                $scope.activeList={};
                $scope.activeList.ingredients=[];
                var responseHandler = function(data) {
                  // console.log("new api data",data);
                  $scope.categoryWithActiveIngredients = [];
                  $scope.categoryWithInactiveIngredients = [];

                  if(angular.isDefined(data.active_list) && _.keys(data.active_list).length) {
                    _.each(data.active_list, function(value, key) {
                      if(key){
                        _.each(value, function(item) {
                          item.active = true;
                        });
                        $scope.categoryWithActiveIngredients.push({"name": key, "ingredients" : value});
                        $scope.activeList=$scope.categoryWithActiveIngredients;
                        console.log("ingredients values ",$scope.activeList.ingredients);
                      }
                    })
                    $scope.spinnerShow = true;
                    $scope.activeDataReceived = true;

                  } else {
                    $scope.spinnerShow = true;
                    $scope.activeDataNotReceived=true;
                  }
                  // console.log(_.keys(data.inactive_list).length);
                  // console.log(angular.isDefined(data.inactive_list));
                  $scope.inActiveList=[]
                  if(angular.isDefined(data.inactive_list) && _.keys(data.inactive_list).length) {
                    _.each(data.inactive_list, function(value, key) {
                      if(key){
                        _.each(value, function(item) {
                          item.active = false;
                        })
                        $scope.categoryWithInactiveIngredients.push({"name": key, "ingredients" : value});
                        $scope.inActiveList=$scope.categoryWithInactiveIngredients;
                      }
                    })
                    $scope.spinnerShow = true;
                    $scope.inactiveDataReceived = true;
                  } else {
                    $scope.spinnerShow = true;
                    console.log($scope.inActiveList)
                    if($scope.inActiveList.length == 0)
                    $scope.inactiveDataNotReceived=true;
                  }
                }
                CommonService.fetchInactiveListData(responseHandler);
                if (!_.has($scope.activeList, ['isExpanded'])) {
                    $scope.activeList.isExpanded = false;
                }
                // console.log($scope.activeList)
                $scope.toggleGroup = function (group) {
                  // console.log("toggleGroup : ", group);
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
                $scope.$on('finishedCategoryItemsRender', function (ngRepeatFinishedEvent) {
                  // console.log("finishedCategoryItemsRender : ", ngRepeatFinishedEvent);
                  var renderedIngredient = _.find($scope.activeList,function(item){
                    return item.isExpanded == true;
                  });
                  renderedIngredient.spinnerShow = false;
                  $scope.spinnerShow = true;
                  $scope.activeDataReceived=true;
                });
                $scope.$on('finishedCategoryItemsRenderInactive', function (ngRepeatFinishedEvent) {
                  // console.log("renderedIngredientinactive",$scope.inActiveList);
                  var renderedIngredientinactive =_.find($scope.inActiveList,function(item){
                    return item.isExpanded == true;
                  });
                  renderedIngredientinactive.spinnerShow = false;
                  $scope.spinnerShow = true;
                  $scope.inactiveDataReceived = true;
                });
                // function inactiveItemHandler(inActiveItems){
                //   console.log("inActiveItems",inActiveItems);
                //   $scope.spinnerShow = true;
                //   $scope.inactiveDataReceived = false;
                //   $scope.activeDataReceived = false;
                //   // $scope.items = inActiveItems.supItems
                //   $scope.items = _.forEach(inActiveItems.supItems, function(value) {
                //     // console.log(value.invItemId)
                //     value.status = true;
                //     value.active = false;
                //   });
                // }

                // CommonService.fetchInactiveItems(inactiveItemHandler);
                var checkActive = []

                $scope.mapItems = function(){
                  $scope.inactiveDataNotReceived = false;
                  $scope.activeDataNotReceived = false;
                  // console.log("mapItems",item);
                  // console.log("I was also triggererd!");
                  // var element = angular.element(document.querySelectorAll('#my-float-inv'));
                  // $scope.spinnerShow = false;
                  // element[0].style.pointerEvents = 'none';
                  // console.log($scope.items)
                  // checkActive = _.filter($scope.items,function(item){
                  //   return item.active == true;
                  // });
                  var finalList = [];
                  _.each($scope.selectedItems, function(item) {
                    var ingredient = {};
                    ingredient.inventory_category = item.ingredientInventoryCategory;
                    ingredient.inventory_id = item.inventoryItemId;
                    if(item.active){
                      ingredient.ingredient_status = "active";
                    } else {
                      ingredient.ingredient_status = "inactive";
                    }
                    finalList.push(ingredient);
                  })
                  // console.log("map to be saved : ", finalList, $scope.selectedItems);
                  $scope.saveData(finalList);
                }

                // $timeout(function(){
                //   var element = angular.element(document.querySelectorAll('#my-float-inv'));
                //   element[0].onclick = function(){
                //       console.log("I was also triggererd!");
                //       $scope.spinnerShow = false;
                //       element[0].style.pointerEvents = 'none';
                //       console.log($scope.items)
                //       checkActive = _.filter($scope.items,function(item){
                //         return item.active == true;
                //       });
                //       $scope.saveData()
                //       // $scope.saveMappedData(set_type);

                //   }
                // },1000);

                var invResponse = function(getInv){
                    // console.log(JSON.stringify(checkActive))

                    if(getInv.success){
                      _.forEach(checkActive, function(value) {
                        // console.log(value.invItemId)
                        value.active = false;
                        value.status = false;
                      });

                      console.log('**********************************************',$scope.active);
                      if($scope.active)
                        toastMessage("Items Inactivated.", 4000);
                      else
                        toastMessage("Items Activated.", 4000);
                      $scope.activeDataReceived = false;
                      $scope.inactiveDataReceived = false;
                      $scope.spinnerShow = false;
                      $scope.selectedItems=[];
                      CommonService.fetchInactiveListData(responseHandler);
                      document.getElementById("my-float-inv").style.pointerEvents = "auto";
                    } else{
                      toastMessage("something went wrong.", 2000);
                      $scope.spinnerShow = true;
                      $scope.inactiveDataReceived = true;
                      $scope.activeDataReceived = true;
                      document.getElementById("my-float-inv").style.pointerEvents = "auto";
                    }
                  }

                $scope.saveData = function(selectedItems){
                  // console.log(JSON.stringify(checkActive))
                  if(angular.isDefined(selectedItems) && selectedItems.length > 0){
                    // console.log(result);
                    // CommonService.postInactiveActive(invResponse,selectedItems);
                    CommonService.updateIngredientStatus(invResponse,selectedItems);
                  } else{
                    console.log('nothing to do');
                    toastMessage("oops! nothing do.", 4000);
                    $scope.spinnerShow = true;
                    $scope.inactiveDataReceived = true;
                    $scope.activeDataReceived = true;
                    document.getElementById("my-float-inv").style.pointerEvents = "auto";
                  }
                }
                $scope.selectedItems = [];
                $scope.isActive = false;
                $scope.isInActive = false;
                $scope.inactiveClick = function(selectedItem) {
                  if($scope.isActive) {
                    while($scope.selectedItems.length > 0) {
                      $scope.selectedItems[$scope.selectedItems.length - 1].active = true;
                      $scope.selectedItems.pop();
                    }
                    $scope.isActive = false;
                  }
                  $scope.isInActive = true;
                  // console.log("selectedItem : ",selectedItem);
                  selectedItem.active = !selectedItem.active;
                  var checkItem = _.find($scope.selectedItems, function(item) {
                    return selectedItem.supplierItemId === item.supplierItemId
                  })
                  if(angular.isDefined(checkItem) && !selectedItem.active) {
                    $scope.selectedItems.splice(_.findIndex($scope.selectedItems, { supplierItemId: checkItem.supplierItemId }), 1);
                  } else {
                    $scope.selectedItems.push(selectedItem);
                  }
                  // else if(!angular.isDefined(checkItem)){
                  //   $scope.selectedItems.push(selectedItem);
                  // }
                  // console.log("all items : ", $scope.selectedItems);
                }


               $scope.activeClick =  function(selectedItem) {
                  if($scope.isInActive) {
                    while($scope.selectedItems.length > 0) {
                      $scope.selectedItems[$scope.selectedItems.length - 1].active = false;
                      $scope.selectedItems.pop();
                    }
                    $scope.isInActive = false;
                  }
                  $scope.isActive = true;
                  // console.log("selectedItem : ",selectedItem);
                  selectedItem.active = !selectedItem.active;
                  var checkItem = _.find($scope.selectedItems, function(item) {
                    return selectedItem.supplierItemId === item.supplierItemId
                  })
                  if(angular.isDefined(checkItem) && selectedItem.active) {
                    $scope.selectedItems.splice(_.findIndex($scope.selectedItems, { supplierItemId: checkItem.supplierItemId }), 1);
                  } else {
                    $scope.selectedItems.push(selectedItem);
                  }
                  // console.log("all items : ", $scope.selectedItems);
                }

                $scope.$on('check_lock', function (event,data) {
                  checkTrue = _.find($scope.items,function(item){
                    return item.active == true;
                  });
                  // $scope.dataReceived=false;
                  // $scope.spinnerShow = false;
                  // console.log('******** ',checkTrue);
                  if(checkTrue) {
                        // console.log(data);
                        $rootScope.$broadcast('lock',data);
                  } else {
                        $rootScope.$broadcast('lock','');
                  }
                });

                $rootScope.$on('search_inactive_list', function (event) {
                  $scope.searchText = $rootScope.data.searchText
                  // console.log('scope.searchText: ',$scope.searchText)
                });
            }
        };
    };
    InactiveItems.$inject = ['CommonService','$q','$timeout','$ionicLoading','$ionicFilterBar','$rootScope','$ionicPlatform'];
    projectCostByte.directive('inactiveItems', InactiveItems)
})();
