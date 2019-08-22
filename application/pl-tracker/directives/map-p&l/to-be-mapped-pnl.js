(function () {
    var ToBeMappedPnl = function ($q,CommonService,$ionicLoading,$timeout,$rootScope,$ionicModal,$ionicPopup,$ionicSlideBoxDelegate) {
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
            templateUrl: 'application/pl-tracker/directives/map-p&l/to-be-mapped-pnl.html',
            link: function (scope, ele, attr, controllers) {


              scope.dataReceived = false;
              $rootScope.$broadcast('loader_set');
              scope.toBeMappedItems = [];
              scope.showTBMI = [];
              scope.minorCategories =[];
              scope.map = true;
              scope.hasMoreData = true;

              scope.$on('pnl_minorCategories', function (event,items) {
                  scope.minorCategories =[];
                  scope.minorCategories=items;
                  setOptions(scope.minorCategories)
              });
              scope.setInventory = function(inv){
                $rootScope.current_selected = inv;
                // console.log($rootScope.current_selected)
                  // $timeout(function(){
                  //    angular.element(document.querySelectorAll('#pnlCat')).triggerHandler('click');
                  // },200);

              }
              scope.getItemHeight = function(id){
                // console.log(id+"_item");
                // console.log(document.getElementById(id+"_item_div"));
                // return 120;
                $timeout(function(){
                  // let getHeight = {};
                  var element = angular.element(document.getElementById(id.supItemId+"_item_div"));
                  // console.log(element);
                  // getHeight.height = element[0].offsetHeight;
                  // console.log(getHeight);
                  id.height = element[0].offsetHeight
                  // return getHeight;
                }, 700);
              }

              scope.getItemHeight = function(item, index) {
                //Make evenly indexed items be 10px taller, for the sake of example
                return (index % 2) === 0 ? 50 : 60;
              };

              scope.PnLOptionClick = function (pnLOption,item,id) {
                pnLOption.selected = !pnLOption.selected;
                item.isUpdated = true;
                item.profitAndLossCategory = (item.selectedName == pnLOption.name) ? '' : pnLOption.name;
                item.selectedName = (item.selectedName == pnLOption.name) ? '' : pnLOption.name;
              };
              scope.minorCategories =$rootScope.minorCategories;
              // console.log(scope.minorCategories)
              if(scope.minorCategories){
                setOptions(scope.minorCategories)
              }
              function setOptions(catList){
                scope.groupedList = [];
                _.forEach(catList, function(value,i) {
                    scope.groupedList.push({
                      "name": i,
                      "optionList": value
                    })
                });
              }

              $timeout(function(){
                 angular.element(document.querySelectorAll('pnl_new_map')).triggerHandler('click');
              },200);

              // scope.shoutLoud = function(newValue , oldValue){
              //   scope.current_selected.isUpdated=true;
              //   var CatValue=newValue.split("::");
              //   scope.current_selected.selectedOption = newValue;
              //   scope.current_selected.minorCategory= CatValue[1];
              //   scope.current_selected.profitAndLossCategory = CatValue[0];
              //   $rootScope.$broadcast('toBeMappedItems_to_mapped',scope.toBeMappedItems);
              // };



                // scope.shoutReset = function(){
                // };



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



                scope.wholeSupplier = [];
                scope.supplierDataResponseHandler = function(supplierItemsData) {

                  scope.dataReceived = true;

                  var my_supplier = supplierItemsData.supItems;

                  scope.originalItems = my_supplier;

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
              //---------------------------------------------------------------------------------------------------------------------------
                let headerSet;
                let myEl;
                function setHeaderText(){
                  headerSet = angular.element(document.querySelectorAll('.show-search-inv'))
                  headerSet[0].style.display = "flex";
                  myEl = angular.element( document.querySelector( '.show-search-inv' ) );
                  myEl.removeClass('ng-cloak');
                }
                var toastMessage = function (message_text, duration) {
                  if (typeof duration === 'undefined') duration = 1500;
                  $ionicLoading.show({
                      template: message_text,
                      noBackdrop: true,
                      duration: duration
                  });
                };


                scope.fetchItem = [];
                var mapPnLResponse = function(getMapPnL){
                  _.forEach(scope.fetchItem, function(value) {
                    value.selectedOption = [];
                    value.selectedOption.selected = false;
                    //this has to be checked with mapping item
                    value.selectedOption[0] = (value.minorCategory).toUpperCase();
                    value.selectedOption[1] = (value.profitAndLossCategory).toUpperCase();
                  });
                  if(getMapPnL.success || getMapPnL.response){
                    if(scope.map){
                      _.forEach(scope.fetchItem, function(value) {
                        var index = scope.showTBMI.indexOf(value);
                        // console.log("removing TBMI after mapping");
                        scope.showTBMI.splice(index, 1);
                        value.saved = true;
                        value.selectedOption = [];
                        value.selectedOption[0] = (value.minorCategory).toUpperCase();
                        value.selectedOption[1] = (value.profitAndLossCategory).toUpperCase();

                      });
                    }
                    setHeaderText();
                    $rootScope.searchItem = true;
                    toastMessage("P&L item mapped.", 4000);
                    $rootScope.data.searchText = '';
                    $rootScope.showSearchBtn = true;
                    $rootScope.$broadcast('loader_unset');
                    $timeout(function () {
                    scope.dataReceived = true;
                    }, 1000);
                    document.getElementById("my-float-pnl").style.pointerEvents = "auto";
                    $rootScope.$broadcast('pnl_to_map');
                  } else{
                    _.forEach(scope.fetchItem, function(value) {
                        value.saved = false;
                    });
                    setHeaderText();
                    $rootScope.searchItem = true;
                    toastMessage("something went wrong.", 2000);
                    $rootScope.$broadcast('loader_unset');
                    $timeout(function () {
                    scope.dataReceived = true;
                    }, 1000);
                    document.getElementById("my-float-pnl").style.pointerEvents = "auto";
                  }
                }

                var serviceRequestData = {}
                scope.toBemappedTrueClick = function(){
                    var element = angular.element(document.querySelectorAll('#my-float-pnl'));
                    scope.dataReceived = false;
                    $rootScope.$broadcast('loader_set');
                    element[0].style.pointerEvents = 'none';
                    var finalItems = scope.showTBMI
                    scope.fetchItem = _.filter(finalItems,  function(supplier){
                        return supplier.profitAndLossCategory;
                    })
                    scope.fetchItem = _.filter(finalItems,  function(supplier){
                        return supplier.minorCategory;
                    })
                    if(scope.fetchItem.length){

                      if(scope.invConfig){
                        serviceRequestData = {
                            PandL_Category: scope.fetchItem
                        };
                        CommonService.postInvPnLMapping(mapPnLResponse,serviceRequestData);
                      } else {
                        serviceRequestData = {
                            pnlItems: scope.fetchItem
                        };
                        CommonService.postPnLMapping(mapPnLResponse,serviceRequestData);
                      }
                    } else{
                      console.log('*****6');
                      toastMessage("oops! nothing to map.", 2000);
                      $rootScope.$broadcast('loader_unset');
                      $timeout(function () {
                      scope.dataReceived = true;
                      }, 1000);
                      document.getElementById("my-float-pnl").style.pointerEvents = "auto";
                    }
                }

              var isLoading = true;
              $rootScope.$on('pnl_end', function (event) {
                  isLoading = true;
              });

              var isSearchOn = false;

              scope.$watch('items', function(newVal) {
                // console.log(newVal);
                  if(scope.from == "invConfig"){
                    scope.invConfig = true;
                  }
                  if(scope.from == "pnlConfig"){
                    scope.toBeMappedItems = newVal;

                    if(scope.toBeMappedItems.length<=0){
                      $rootScope.$broadcast('loader_unset');
                      scope.dataNotReceived=true;
                    }
                    scope.invConfig = false;
                  }
                  // console.log("watchFunction in TBMI", newVal, isLoading);

                   if(newVal) {
                    scope.toBeMappedItems = [];
                    scope.toBeMappedItems = newVal;
                    if(scope.toBeMappedItems.length){
                      $rootScope.$broadcast('loader_unset');
                      $timeout(function () {
                        scope.dataReceived = true;
                      }, 1000);
                      isLoading = false;
                    }
                    while(scope.showTBMI.length > 0) {
                      scope.showTBMI.pop();
                    }
                    if(scope.toBeMappedItems.length == 0){
                      scope.no =0;
                    }else if(scope.toBeMappedItems.length == 1){
                      scope.no = 1;
                    }else if(scope.toBeMappedItems.length == 2){
                      scope.no = 2;
                    }else if(scope.toBeMappedItems.length == 3){
                      scope.no = 3;
                    }else if(scope.toBeMappedItems.length == 4){
                      scope.no = 4;
                    }else if(scope.toBeMappedItems.length == 5){
                      scope.no = 5;
                    }else if(scope.toBeMappedItems.length == 6){
                      scope.no = 6;
                    }else if(scope.toBeMappedItems.length == 7){
                      scope.no = 7;
                    }else if(scope.toBeMappedItems.length == 8){
                      scope.no = 8;
                    }else if(scope.toBeMappedItems.length == 9){
                      scope.no = 9;
                    }else{
                      scope.no=10;
                    }
                    // console.log("showTBMI", scope.showTBMI, scope.toBeMappedItems);
                    scope.count=0;
                    for(var i=0; i<scope.no; i++) {
                      scope.showTBMI.push(scope.toBeMappedItems[i]);
                      scope.count++;
                    }
                    if(scope.toBeMappedItems.length >10){
                    scope.getMore();
                  }
                  }
               }, true);

              scope.getMore = function() {
                if(!isSearchOn) {
                  // console.log("Give me more TBMI!!!", scope.toBeMappedItems.length);
                  var currTBMICount = scope.count;
                  for(var i=currTBMICount; i<currTBMICount+10; i++) {
                    if(i<scope.toBeMappedItems.length) {
                      scope.showTBMI.push(scope.toBeMappedItems[i]);
                      scope.count++;
                      scope.hasMoreData = true;
                    } else {
                      scope.hasMoreData = false;
                      return;
                    }
                  }
                } else {
                  // console.log("Give me more search!!!", scope.showAllFilteredTBMI.length);
                  var currSearchCount = scope.searchCount;
                  for(var i=currSearchCount; i<currSearchCount+10; i++) {
                    if(i<scope.showAllFilteredTBMI.length) {
                      scope.showFilteredTBMI.push(scope.showAllFilteredTBMI[i]);
                      scope.searchCount++;
                      scope.hasMoreData = true;
                    } else {
                      scope.hasMoreData = false;
                      return;
                    }
                  }
                }
                scope.$broadcast('scroll.refreshComplete');
                scope.$broadcast('scroll.infiniteScrollComplete');
              }

              scope.pAndLItems =[
                  {"id":1,"name":"FOOD","selected":false,"buttonStyle":"button-out"},
                  {"id":2,"name":"BEVERAGE","selected":false,"buttonStyle":"button-out"},
                  {"id":3,"name":"SUPPLIES","selected":false,"buttonStyle":"button-out"},
                  {"id":4,"name":"BEER","selected":false,"buttonStyle":"button-out"},
                  {"id":5,"name":"SPIRITS","selected":false,"buttonStyle":"button-out"},
                  {"id":6,"name":"WINE","selected":false,"buttonStyle":"button-out"}
              ];
              var chunkLength = 3;
              if (scope.pAndLItems.length > 3) {
                chunkLength = 3;
              }
              scope.PnLOptionsChunks = _.chunk(scope.pAndLItems, chunkLength);

              scope.setLoader = function(){
                $rootScope.$broadcast('loader_unset');
                $timeout(function () {
                  scope.dataReceived = true;
                }, 1000);
              }
              $rootScope.$on('to_be_mapped_clicked', function (event) {
                scope.searchText = "";
              });
              var length = 0;
              var timer = null;
              $rootScope.$on('set_search_map', function (event) {
                // console.log("search event called", $rootScope.data.searchText);
                scope.showFilteredTBMI = []
                scope.showFilteredTBMI.length = 0;
                // console.log("showFilteredTBMI size ", scope.showFilteredTBMI.length);
                scope.searchText = $rootScope.data.searchText
                if(scope.searchText) {
                  // console.log("searchText is not empty", scope.searchText);
                  isSearchOn = true;
                  clearTimeout(timer);
                  timer = setTimeout(startSearch, 1000);
                } else {
                  isSearchOn = false;
                  scope.showFilteredTBMI = [];
                  scope.showFilteredTBMI.length = 0;
                  scope.getMore();
                }
              });

              var startSearch = function() {
                // console.log("startSearch called after 1 second");
                scope.showAllFilteredTBMI = scope.toBeMappedItems.filter(item => item.supItemAlias.toLowerCase().includes(scope.searchText.toLowerCase()));
                // console.log("showFilteredTBMI", scope.showAllFilteredTBMI);
                scope.searchCount=0;
                scope.initialCount = 10;
                if(scope.showAllFilteredTBMI.length < 11) {
                  scope.initialCount = scope.showAllFilteredTBMI.length;
                }
                for(var i=0; i<scope.initialCount; i++) {
                  scope.showFilteredTBMI.push(scope.showAllFilteredTBMI[i]);
                  scope.searchCount++;
                }
                scope.$apply();
              }

              $rootScope.$on('to_be_mapped_dataReceived', function (event,flg) {
                scope.dataReceived = flg;
              });

            }
        };
    };
    ToBeMappedPnl.$inject = ['$q','CommonService','$ionicLoading','$timeout','$rootScope','$ionicModal','$ionicSlideBoxDelegate'];
    projectCostByte.directive('toBeMappedPnl', ToBeMappedPnl)
})();
