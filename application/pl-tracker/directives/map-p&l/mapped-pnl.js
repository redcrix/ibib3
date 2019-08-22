(function () {
    var MappedPnlSection = function ($q,CommonService,$ionicLoading,$timeout,$rootScope) {
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
            templateUrl: 'application/pl-tracker/directives/map-p&l/mapped-pnl.html',
            link: function (scope, ele, attr, controllers) {

              scope.first = 0;
              scope.dataReceived = false;
              $rootScope.$broadcast('loader_set');
              scope.hasMoreData = true;


              scope.incFirst = function(){
                scope.first = 1;
              }


              scope.mappedItems = [];
              scope.showMI = [];
              scope.minorCategories =[];

              scope.setInventoryOption = function(inv){
                console.log('*****')
                $rootScope.current_selected = inv;
                // $timeout(function(){
                //    angular.element(document.querySelectorAll('#pnLCat')).triggerHandler('click');
                // },200);
              }


              scope.PnLOptionClick = function (pnLOption,item,id) {
                item.isUpdated = true;
                let union = _.union(item.PnLOptionsChunks[0], item.PnLOptionsChunks[1]);
                let pnlcat = false;
                _.each(union, function(opt,i) {
                  opt.selected = (opt.id == id) ? !opt.selected : false;
                  opt.buttonStyle = opt.selected ? "button-bal" : "button-out";
                  if(opt.selected)
                    pnlcat  = pnLOption.name;

                  if(union.length == i+1){
                    item.profitAndLossCategory = pnlcat ? pnlcat : '';
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
 //----------------------------------------------------------------------------------------------------



                //     scope.shoutLoud = function(newValue , oldValue){
                //       var CatValue=newValue.split("::");
                //       scope.current_selected.isUpdated=true;
                //       scope.current_selected.selectedOption = newValue;
                //       scope.current_selected.minorCategory= CatValue[1];
                //       scope.current_selected.profitAndLossCategory = CatValue[0];
                //       $rootScope.$broadcast('mappedItems_to_mapped',scope.mappedItems);
                //     };



                //     scope.shoutReset = function(){
                // };
                scope.minorCategories =$rootScope.minorCategories;
                scope.groupedList = [];
                _.forEach(scope.minorCategories, function(value,i) {
                    scope.groupedList.push({
                      "name": i,
                      "optionList": value
                    })
                });



                scope.invDataResponseHandler = function(invItems,supItemValues) {

                  scope.supplierDataResponseHandler(supItemValues);
                }

                scope.mappedClick = function(){

                  scope.mapped = true;
                  scope.map = false;
                  scope.dataReceived = false;

                  $timeout(function () {
                    scope.dataReceived = true;
                  }, 400);
                }

                scope.wholeSupplier = [];
                scope.supplierDataResponseHandler = function(supplierItemsData) {


                  var my_supplier = supplierItemsData.supItems;

                  scope.originalItems = my_supplier;

                  scope.setArray(my_supplier);

                };
              let headerSet;
              let myEl;
              function setHeaderText(){
                headerSet = angular.element(document.querySelectorAll('.show-search-inv'))
                headerSet[0].style.display = "flex";
                myEl = angular.element( document.querySelector( '.show-search-inv' ) );
                myEl.removeClass('ng-cloak');
              }
                  scope.fetchItem = [];
                  var mapPnLResponse = function(getMapPnL){
                    scope.dataReceived=false;
                    _.forEach(scope.fetchItem, function(value) {
                      value.selectedOption.selected = false;
                      value.selectedOption = [];
                        value.selectedOption[0] = (value.minorCategory).toUpperCase();
                        value.selectedOption[1] = (value.profitAndLossCategory).toUpperCase();
                    });
                    if(getMapPnL.success || getMapPnL.response){
                      // if(scope.map){
                        _.forEach(scope.fetchItem, function(value) {
                            if(value.profitAndLossCategory == ''){
                              var index = scope.showMI.indexOf(value);
                              scope.showMI.splice(index, 1);
                          }
                        });
                      setHeaderText();
                      $rootScope.searchItem = true;
                      toastMessage("P&L item mapped.", 4000);
                      $rootScope.data.searchText = '';
                      $rootScope.showSearchBtn = true;
                      scope.dataReceived = true;
                      $rootScope.$broadcast('loader_unset');
                      document.getElementById("my-float-pnl").style.pointerEvents = "auto";
                      $rootScope.$broadcast('pnl_to_map');
                    } else{

                      _.forEach(scope.fetchItem, function(value) {
                          value.saved = false;
                      });
                      setHeaderText();
                      $rootScope.searchItem = true;
                      toastMessage("something went wrong.", 2000);
                      scope.dataReceived = true;
                      $rootScope.$broadcast('loader_unset');
                      document.getElementById("my-float-pnl").style.pointerEvents = "auto";
                    }
                  }
                  var serviceRequestData = {}
                scope.mappedTrueClick = function(){
                  var element = angular.element(document.querySelectorAll('#my-float-pnl'));
                  scope.dataReceived = false;
                  $rootScope.$broadcast('loader_set');
                  element[0].style.pointerEvents = 'none';

                  var finalItems = scope.showMI;

                  scope.fetchItem = _.filter(finalItems,  function(supplier){
                      return supplier.isUpdated;
                    // }
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
                    toastMessage("oops! nothing to map.", 2000);
                    scope.dataReceived = true;
                    $rootScope.$broadcast('loader_unset');
                    document.getElementById("my-float-pnl").style.pointerEvents = "auto";
                  }

                }


              var isLoading = true;
              $rootScope.$on('pnl_end', function (event) {
                  isLoading = true;
              });
              var isSearchOn = false;

              

              scope.$watch('items', function(newVal) {

                  $timeout(function () {
                      $rootScope.$broadcast('loader_unset');

                  //   }
                  },1000);
                  if(scope.from == "invConfig"){
                    scope.invConfig = true;
                  }
                  if(scope.from == "pnlConfig"){
                    scope.invConfig = false;
                  }
                  // console.log("watchFunction in MI", newVal, isLoading);

                   if(newVal) {
                    // scope.supplierDataResponseHandler(newVal);
                    scope.mappedItems = [];
                    scope.mappedItems = newVal;
                    //console.log(scope.mappedItems)
                    if(scope.mappedItems.length){
                      // scope.incFirst();
                      isLoading = false;
                    }
                    _.forEach(scope.mappedItems, function(value) {
                      value.isUpdated = false;
                    });
                    while(scope.showMI.length > 0) {
                      scope.showMI.pop();
                    }
                    scope.count=0;
                    // console.log("showMI",scope.showMI);

                    for(var i=0; i<10; i++) {
                      scope.showMI.push(scope.mappedItems[i]);
                      scope.count++;
                    }
                  }
               }, true);

              scope.getMore = function() {
                if(!isSearchOn) {
                  // console.log("Give me more MI!!!", scope.mappedItems.length);
                  var currMICount = scope.count;
                  for(var i=currMICount; i<currMICount+10; i++) {
                    if(i<scope.mappedItems.length) {
                      scope.showMI.push(scope.mappedItems[i]);
                      scope.count++;
                      scope.hasMoreData = true;
                    } else {
                      scope.hasMoreData = false;
                      return;
                    }
                  }
                } else {
                  // console.log("Give me more search!!!", scope.showAllFilteredMI.length);
                  var currSearchCount = scope.searchCount;
                  for(var i=currSearchCount; i<currSearchCount+10; i++) {
                    if(i<scope.showAllFilteredMI.length) {
                      scope.showFilteredMI.push(scope.showAllFilteredMI[i]);
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
                scope.dataReceived = true;
              }

              scope.getItemHeight = function(item, index) {
                //Make evenly indexed items be 10px taller, for the sake of example
                return (index % 2) === 0 ? 50 : 60;
              };

              scope.selectedOrDummy = function (pnlOption,item) {
                let buttonStyle = '';

                buttonStyle = buttonStyle + 'button-bal ';
                if (pnlOption.name !== item.selectedOption.name) {
                    buttonStyle = buttonStyle + 'button-out ';
                }
                return buttonStyle;
              };

              scope.getClass = function(first,second,item, callback){
                let mts = 'button button-small button-out';
                if(first == second)
                    mts = 'button button-small button-bal';
                return mts;

              }

              $rootScope.$on('mapped_clicked', function (event) {
                scope.dataReceived = false;
                scope.searchText = "";
                $rootScope.$broadcast('loader_set');
              });
              var length = 0;
              var timer = null;
              $rootScope.$on('set_search_mapped', function (event) {
                // console.log("search event called", $rootScope.data.searchText);
                scope.showFilteredMI = []
                scope.showFilteredMI.length = 0;
                // console.log("showFilteredMI size ", scope.showFilteredMI.length);
                scope.searchText = $rootScope.data.searchText
                if(scope.searchText) {
                  // console.log("searchText is not empty", scope.searchText);
                  isSearchOn = true;
                  clearTimeout(timer);
                  timer = setTimeout(startSearch, 1000);
                } else {
                  isSearchOn = false;
                  scope.showFilteredMI = [];
                  scope.showFilteredMI.length = 0;
                  scope.getMore();
                }
              });
              var startSearch = function() {
                // console.log("startSearch called after 1 second");
                scope.showAllFilteredMI = scope.mappedItems.filter(item => item.supItemAlias.toLowerCase().includes(scope.searchText.toLowerCase()));
                // console.log("showFilteredMI", scope.showAllFilteredMI);
                scope.searchCount=0;
                scope.initialCount = 10;
                if(scope.showAllFilteredMI.length < 11) {
                  scope.initialCount = scope.showAllFilteredMI.length;
                }
                for(var i=0; i<scope.initialCount; i++) {
                  scope.showFilteredMI.push(scope.showAllFilteredMI[i]);
                  scope.searchCount++;
                }
                scope.$apply();
              }
              $rootScope.$on('mapped_dataReceived', function (event,flg) {
                  scope.dataReceived = flg;
              });

            }
        };

    };

    MappedPnlSection.$inject = ['$q','CommonService','$ionicLoading','$timeout','$rootScope'];
    projectCostByte.directive('mappedPnlSection', MappedPnlSection);

})();
