(function () {
    var MapPnL = function ($q,CommonService,$ionicLoading,$timeout,$rootScope,PlTrackerService,inventoryService) {
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
            templateUrl: 'application/pl-tracker/directives/map-p&l/map-pnl.html',
            link: function (scope, ele, attr, controllers) {


              scope.dataReceived = false;
              scope.mainDataReceived = false;
              scope.mainMappedDataReceived = false;
              scope.toBeMappedItems = [];
              scope.mappedItems = [];
              scope.map = true;
              
              scope.toBeMapClick = function(){
                scope.map = true;
                scope.dataReceived = false;
                $rootScope.$broadcast('loader_set');
                $timeout(function () {
                  scope.dataReceived = true;
                  $rootScope.$broadcast('loader_unset');
                }, 1000);
                if(scope.invConfig)
                  $rootScope.$broadcast('pnl_to_inv_map')
                else
                  $rootScope.$broadcast('pnl_to_map')

                $rootScope.data.searchText = '';
                $rootScope.searchItem = true;
                $rootScope.showSearchBtn = true;
                $rootScope.$broadcast('to_be_mapped_clicked')
              }
              var toastMessage = function (message_text, duration) {
                if (typeof duration === 'undefined') duration = 1500;
                $ionicLoading.show({
                    template: message_text,
                    noBackdrop: true,
                    duration: duration
                });
              };

                scope.mappedClick = function(){
                  // scope.mapped = true;
                  $rootScope.data.searchText = '';
                  $rootScope.searchItem = true;
                  $rootScope.showSearchBtn = true;

                  scope.map = false;
                  scope.mainMappedDataReceived = false;
                  $rootScope.$broadcast('loader_set');
                  $timeout(function () {
                    scope.mainMappedDataReceived = true;
                    $rootScope.$broadcast('loader_unset');
                  }, 1000);
                  if(scope.invConfig)
                    $rootScope.$broadcast('pnl_to_inv_map')
                  else {
                    $rootScope.$broadcast('pnl_to_map')
                    // console.log("mapped clicked")
                  }

                  $rootScope.$broadcast('mapped_clicked')
                }
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
                     _.forEach(scope.fetchItem, function(value) {
                      value.selectedOption.selected = false;
                      value.selectedOption = [];
                        value.selectedOption[0] = (value.minorCategory).toUpperCase();
                        value.selectedOption[1] = (value.profitAndLossCategory).toUpperCase();
                        // profitAndLossCategory
                        value.selectedOption = (value.profitAndLossCategory).toUpperCase() +'::'+ (value.minorCategory).toUpperCase();
                    });
                    // console.log(scope.fetchItem);
                    if(getMapPnL.success || getMapPnL.response){
                      console.log('***** 3 *****');
                      toastMessage("P&L item mapped.", 4000);
                      setHeaderText();
                      $rootScope.searchItem = true;
                      $rootScope.data.searchText = '';
                      $rootScope.showSearchBtn = true;
                      PlTrackerService.fetchPnLItems().then(function (data) {
                          // console.log("new pnLItems", data)
                          scope.pnLItems = data;
                          scope.pnlConfig = "pnlConfig";
                          scope.supplierDataResponseHandler(data);
                          isLoading = false;
                      });
                      $rootScope.$broadcast('pnl_to_map');
                    document.getElementById("my-float-pnl").style.pointerEvents = "auto";
                    } else {
                      setHeaderText();
                      toastMessage("something went wrong.", 2000);
                      scope.dataReceived = true;
                      $rootScope.$broadcast('loader_unset');
                      document.getElementById("my-float-pnl").style.pointerEvents = "auto";
                    }

                  }
                  var serviceRequestData = {}
                scope.save = function(){
                  // console.log('save mapping');
                  var element = angular.element(document.querySelectorAll('#my-float-pnl'));
                  scope.dataReceived = false;
                  scope.mainMappedDataReceived=false;
                  $rootScope.$broadcast('loader_set');
                  element[0].style.pointerEvents = 'none';
                  // $rootScope.$on('toBeMappedItems_to_mapped', function (event,data) {
                  //   scope.toBeMappedItems=data;
                  // });
                  // $rootScope.$on('mappedItems_to_mapped', function (event,data) {
                  //   scope.mappedItems=data;
                  // });
                  // var finalItems = scope.mappedItems.concat(scope.toBeMappedItems);
                  // // console.log(finalItems);
                  //  scope.fetchItem = _.filter(finalItems,  function(supplier){
                  //     var returnElement;
                  //     if(supplier.isUpdated) {
                  //         returnElement = supplier.isUpdated;
                  //     }
                  //     return returnElement;
                  // });
                  // // console.log(scope.fetchItem);
                  // console.log('get selected data: ',inventoryService.getPnlMapSelected());
                  scope.fetchItem = inventoryService.getPnlMapSelected();
                  if(scope.fetchItem.length){
                      serviceRequestData = {
                          pnlItems: scope.fetchItem
                      };
                      CommonService.postPnLMapping(mapPnLResponse,serviceRequestData);
                      inventoryService.setPnlMapSelected(false);
                  } else{
                    console.log('*****4');
                    toastMessage("oops! nothing to map.", 2000);
                    scope.dataReceived = true;
                    $rootScope.$broadcast('loader_unset');
                    document.getElementById("my-float-pnl").style.pointerEvents = "auto";
                  }

                }

              scope.supplierDataResponseHandler = function(getSupItems){
                console.log('supplierDataResponseHandler.....');
                if(scope.map){
                  $rootScope.$broadcast('loader_unset');
                } else {
                  // console.log('************** else *************');
                  $timeout(function () {
                    // $rootScope.$broadcast('loader_unset');
                    scope.mainMappedDataReceived = true;
                  },2000);
                }

                scope.dataReceived = true;
                scope.supplierItems = [];
                scope.toBeMappedItems = [];
                scope.mappedItems = [];
                $rootScope.minorCategories=[];
                $rootScope.minorCategories=getSupItems.minor_categories;
                $rootScope.$broadcast('pnl_minorCategories',$rootScope.minorCategories);
                _.each(getSupItems.supItems,function(data){
                    var pushData = _.find(scope.supplierItems, function(o) {
                        if(o.supItemAlias == data.supItemAlias && o.supplier == data.supplier && data.tableType != "UnknownBusinessSupplierItemsData"){
                          return true;
                        }
                    });
                    if(!pushData){
                      scope.supplierItems.push(data);
                    }
                });
                scope.toBeMappedItems = [];
                scope.mappedItems = []; 
                var checkItem = _.each(scope.supplierItems,  function(supplier){
                  //console.log(scope.toBeMappedItems)
                  var pushData = _.find(scope.toBeMappedItems, function(o) {
                        // return o.supItemAlias == supplier.supItemAlias && o.supplier == supplier.supplier;
                        return o.supItemId == supplier.supItemId;
                  });
                  //console.log(pushData)
                  //console.log(scope.mappedItems)
                  var pushMappedData = _.find(scope.mappedItems, function(o) {
                        // return o.supItemAlias == supplier.supItemAlias && o.supplier == supplier.supplier;
                        return o.supItemId == supplier.supItemId;
                  });
                  //console.log(pushMappedData)
                  var cnt = _.sumBy(scope.supplierItems, function(o) { return o.supItemAlias == supplier.supItemAlias && o.supplier == supplier.supplier && o.supItemId == supplier.supItemId ? 1 : 0; });
                  // console.log(cnt)
                  if(supplier.profitAndLossCategory == "" || supplier.minorCategory == ""){
                        scope.toBeMappedItems.push(supplier);
                        if(scope.toBeMappedItems.length<=0){
                            scope.dataNotReceived=true;
                        }
                    } else {
                      supplier.selectedOption = "";
                      // profitAndLossCategory
                      if(supplier.minorCategory)
                        supplier.selectedOption = (supplier.profitAndLossCategory).toUpperCase()+'::'+(supplier.minorCategory).toUpperCase();
                      else
                        supplier.selectedOption = "none"
                        // let index = _.findIndex(options, function(opt) {
                        //   return opt.name === data.selectedOption.name;
                        // });
                        scope.mappedItems.push(supplier);
                    }
                  // if(supplier.supItemAlias != "" && (supplier.profitAndLossCategory == "" || supplier.profitAndLossCategory == "NONE") && !pushData){
                  //   scope.toBeMappedItems.push(supplier);
                  // }
                  // //console.log(supplier.supItemAlias != "" && supplier.profitAndLossCategory != "" &&  supplier.profitAndLossCategory != "NONE" && !pushMappedData)
                  // if(supplier.supItemAlias != "" && supplier.profitAndLossCategory != "" && supplier.profitAndLossCategory != "NONE" && !pushMappedData){
                  //   supplier.selectedOption = "";
                  //   // profitAndLossCategory
                  //   if(supplier.minorCategory && supplier.minorCategory!='')
                  //     supplier.selectedOption = (supplier.profitAndLossCategory).toUpperCase()+'::'+(supplier.minorCategory).toUpperCase();
                  //   else
                  //     supplier.selectedOption = "NONE"
                  //   if(cnt == 1) {
                  //     scope.mappedItems.push(supplier);
                  //   }
                  //   // console.log(scope.mappedItems);
                  // }

                })
                scope.toBeMappedItems = _.filter(scope.toBeMappedItems,function(toMap){
                  return toMap.supItemAlias
                })
                // console.log('tobemapped: ',scope.toBeMappedItems);
                // console.log(JSON.stringify(scope.toBeMappedItems));
              }




              scope.supplierDataInvItemResponseHandler = function(getSupItems){

                scope.dataReceived = true;
                scope.supplierItems = [];
                scope.toBeMappedItems = [];
                scope.mappedItems = [];

                _.each(getSupItems.supItems,function(supData){
                    var pushData = _.find(scope.supplierItems, function(o) {
                        if(o.inventory_item_id == supData.inventory_item_id){
                          return true;
                        }
                    });

                    if(!pushData){
                      scope.supplierItems.push(supData);
                    }
                });

                _.each(scope.supplierItems,function(data){

                  let options =[
                    {"id":0,"name":"FOOD","selected":false,"buttonStyle":"button-out"},
                    {"id":1,"name":"BEVERAGE","selected":false,"buttonStyle":"button-out"},
                    {"id":2,"name":"SUPPLIES","selected":false,"buttonStyle":"button-out"},
                    {"id":3,"name":"BEER","selected":false,"buttonStyle":"button-out"},
                    {"id":4,"name":"SPIRITS","selected":false,"buttonStyle":"button-out"},
                    {"id":5,"name":"WINE","selected":false,"buttonStyle":"button-out"}
                  ];
                  if(data.profitAndLossCategory == ""){
                    scope.toBeMappedItems.push(data);
                  } else {
                    data.selectedOption = {};
                    // data.selectedOption.selected = true;
                    data.selectedOption.name = (data.profitAndLossCategory).toUpperCase();

                    let index = _.findIndex(options, function(opt) {
                      return opt.name === data.selectedOption.name;
                    });



                    options[index].selected = true;
                    options[index].buttonStyle = 'button-bal';


                    data.PnLOptionsChunks = _.chunk(options, 3);

                    scope.mappedItems.push(data);
                  }

                });

              }
              var isLoading = true;
              $rootScope.$on('pnl_mapped', function (event,data) {
                  // scope.supplierDataResponseHandler(data);
                  isLoading = true;
                  scope.items = data;

              });


              scope.$watch('items', function(newVal) {
                  if(scope.from == "invConfig"){
                    // scope.setHead = {
                    //   'top':'15px';
                    // }
                    scope.invConfig = true;
                    scope.headTitle1 = "To Be Categorised";
                    scope.headTitle2 = "Categorised";
                    // pnl-map-tabs.tab-nav


                  }
                  if(scope.from == "pnlConfig"){
                    // scope.setHead = {
                    //   'top':'0px';
                    // }
                    // scope.invConfig = false;
                    scope.headTitle1 = "To Be Mapped";
                    scope.headTitle2 = "Mapped";

                  }
                   if(newVal && isLoading) {
                    $rootScope.$broadcast('pnl_end');
                    if(scope.invConfig)
                      scope.supplierDataInvItemResponseHandler(newVal);
                    else
                      scope.supplierDataResponseHandler(newVal);
                    isLoading = false;
                  }
              }, true);

              // scope.pAndLItems =[
              //     {"id":1,"name":"FOOD","selected":false,"buttonStyle":"button-out"},
              //     {"id":2,"name":"BEVERAGE","selected":false,"buttonStyle":"button-out"},
              //     {"id":3,"name":"SUPPLIES","selected":false,"buttonStyle":"button-out"},
              //     {"id":4,"name":"BEER","selected":false,"buttonStyle":"button-out"},
              //     {"id":5,"name":"SPIRITS","selected":false,"buttonStyle":"button-out"},
              //     {"id":6,"name":"WINE","selected":false,"buttonStyle":"button-out"}
              // ];
              // var chunkLength = 3;
              // if (scope.pAndLItems.length > 3) {
              //   chunkLength = 3;
              // }
              // scope.PnLOptionsChunks = _.chunk(scope.pAndLItems, chunkLength);

              $rootScope.$on('loader_unset', function (event) {
                // getAllDatas()
                scope.mainDataReceived = true;
                scope.mainMappedDataReceived = true;
                if(scope.map)
                  $rootScope.$broadcast('to_be_mapped_dataReceived',true);
                else
                  $rootScope.$broadcast('mapped_dataReceived',true);
              });
              $rootScope.$on('loader_set', function (event) {
                // getAllDatas()
                scope.mainDataReceived = false;
                scope.mainMappedDataReceived = false;
                if(scope.map)
                  $rootScope.$broadcast('to_be_mapped_dataReceived',false);
                else
                  $rootScope.$broadcast('mapped_dataReceived',false);

              });
              $rootScope.$on('start_search', function (event) {
                if(scope.map)
                  $rootScope.$broadcast('set_search_map')
                else
                  $rootScope.$broadcast('set_search_mapped')
              });

            }
        };
    };
    MapPnL.$inject = ['$q','CommonService','$ionicLoading','$timeout','$rootScope','PlTrackerService','inventoryService'];
    projectCostByte.directive('mapPandl', MapPnL)

})();
