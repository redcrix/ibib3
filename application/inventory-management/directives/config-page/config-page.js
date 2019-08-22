(function () {
    var ConfigPage = function ($scope,$rootScope,CommonService,$q,$timeout,$ionicLoading,$ionicFilterBar,inventoryHomeSvc,PlTrackerService) {

              $scope.init = function(){
                $scope.navBarTitle.showToggleButton = true;
              }
              console.log('config.....')
              $scope.inactive = false;
              $scope.map_inventory = true;
              $scope.changeScreen = false;
              // $rootScope.searchItem = false;
              $scope.headerTitleINV ="";
              $rootScope.searchItem = true;
              $rootScope.showSearchBtn = true;
              $rootScope.data ={
                searchText : ""
              }
              // $timeout(function() {

              // }, 500);


              $scope.filterButtons = [{
                  'label': 'Map Inventoy Items',
                  'filter_tag': 'map_inventoy_items',
                  'style': 'button-positive',
                  'clicked': true,
                  // 'sortClass': '-dollarSales',
                  // 'icon': 'ion-trophy'
                  }, {
                  'label': 'Inactive - Active Items',
                  'filter_tag': 'inactive_active_items',
                  'style': 'button-positive',
                  'clicked': false,
                  // 'sortClass': 'dollarSales',
                  // 'icon': 'ion-arrow-graph-down-right'
                  },
                  {
                  'label': 'P&L Config',
                  'filter_tag': 'pnl_configuration',
                  'style': 'button-positive',
                  'clicked': false,
                  // 'sortClass': '-costPercent',
                  // 'icon': 'ion-alert'
                  }
                  ]

              var toastMessage = function (message_text, duration) {
                if (typeof duration === 'undefined') duration = 1500;
                $ionicLoading.show({
                    template: message_text,
                    noBackdrop: true,
                    duration: duration
                });
              };
              $scope.filterbuttonclick = function (filterbuttonindex) {
                  $timeout(function() {
                    for (var i = 0; i < $scope.filterButtons.length; i++) {
                      if (i == filterbuttonindex) {
                            $scope.filterButtons[i].clicked = true;
                      } else {
                          $scope.filterButtons[i].clicked = false;
                      }
                    }
                  }, 100);
              }

          inventoryHomeSvc.fetchInventoryItems().then(function (data) {
            // console.log(data);
            $scope.changeScreen = true;
            // if(data.status == 200){
              $scope.invItems = data.data;
            // } else {
            //   toastMessage("Something went wrong!", 2000);
            // }
          });

          var selectedTab = '';

          $rootScope.$on('lock', function (event,data) {
              // console.log("final lock",data);
               _.each($scope.filterButtons,function(itm){
                  if(itm.filter_tag == data)
                    itm.isLocked = true;
                  else
                    itm.isLocked = false;
               });
          });

          function getPnLItems(){
              // console.log('getPnLItems')
              PlTrackerService.fetchPnlInvItems().then(function (data) {
                // console.log(data)
                  $rootScope.$broadcast('loader_unset');
                  $scope.pnLItems = data;
                  // console.log('$scope.pnLItems: ',$scope.pnLItems)
                  $scope.invConfig = "invConfig";
                  // console.log('from inv config')
                  $rootScope.$broadcast('pnl_mapped',data);
              });
          }
          $rootScope.$on('pnl_to_inv_map', function (event) {
              // console.log('pnl_to_inv_map event ...');
              $rootScope.$broadcast('loader_set');


              getPnLItems()
          });


          $scope.changeTab = function(){
            // console.log('******************************');
            let headerSet = angular.element(document.querySelectorAll('.title-center'))
            $timeout(function() {
                selectedTab = _.find($scope.filterButtons,function(itm){
                  return itm.clicked == true;
                })
                // console.log(selectedTab.filter_tag)
                if(selectedTab.filter_tag == 'inactive_active_items'){
                  $rootScope.headerTitleINV="Inventory Manager";
                  $scope.inactive = true;
                  $scope.map_inventory = false;
                  $scope.pnl_config = false;
                  $rootScope.data.searchText = '';
                  $rootScope.$broadcast('search_inactive_list')
                  $rootScope.searchItem = false;
                  $rootScope.showSearchBtn = true;


                  headerSet[0].style.left = "44px";
                  headerSet[0].style.right = "44px";
                  headerSet[1].style.left = "44px";
                  headerSet[1].style.right = "44px";

                }
                if(selectedTab.filter_tag == 'map_inventoy_items'){
                  $scope.headerTitleINV="";
                  $scope.map_inventory = true;
                  $scope.inactive = false;
                  $scope.pnl_config = false;
                  $rootScope.data.searchText = '';
                  // $rootScope.$broadcast('set_search_map')
                  // $rootScope.searchItem = false;
                  $rootScope.searchItem = true;
                  $rootScope.showSearchBtn = true;

                  headerSet[0].style.left = "44px";
                  headerSet[0].style.right = "90px";
                  headerSet[1].style.left = "44px";
                  headerSet[1].style.right = "90px";
                }
                if(selectedTab.filter_tag == 'pnl_configuration'){
                  $scope.headerTitleINV="";
                  $scope.pnl_config = true;
                  $scope.inactive = false;
                  $scope.map_inventory = false;
                  getPnLItems();
                  $rootScope.data.searchText = '';

                  // $rootScope.searchItem = false;
                  $rootScope.searchItem = true;
                  $rootScope.showSearchBtn = true;

                  headerSet[0].style.left = "44px";
                  headerSet[0].style.right = "90px";
                  headerSet[1].style.left = "44px";
                  headerSet[1].style.right = "90px";
                }
            }, 200);

            $scope.$broadcast('check_lock','map_inventoy_items');
            // console.log('$rootScope.inactiveLocked: ',$rootScope.inactiveLocked)


          }
          // $scope.$on('MENUENGGFILTERCHANGE', function (event) {
          //   console.log('*** track ****')
          //   selectedTab = _.find($scope.filterButtons,function(itm){
          //     return itm.clicked == true;
          //   })
          //   // console.log(selectedTab)
          //   if(selectedTab.filter_tag == 'inactive_active_items'){
          //     $scope.inactive = true;
          //     $scope.map_inventory = false;
          //   }
          //   if(selectedTab.filter_tag == 'map_inventoy_items'){
          //     $scope.map_inventory = true;
          //     $scope.inactive = false;
          //   }

          // });
          // $scope.data.filterText

          $scope.$watch('data.searchText', function(newVal) {
            // console.log('searchText items....',newVal)
            if($scope.map_inventory)
              $rootScope.$broadcast('search_map')
            if($scope.inactive)
              $rootScope.$broadcast('search_inactive_list')
            if($scope.pnl_config)
              $rootScope.$broadcast('start_search')
          }, true);

          $scope.closeSearch = function(){
            // $rootScope.searchItem = false;
            $rootScope.searchItem = true;
            $rootScope.showSearchBtn = true;
            $rootScope.data.searchText = '';
          }


          $scope.showSearchBar = function(){
            // console.log('showSearchBar.........',$scope.map_inventory)
            $rootScope.searchItem = true;
            $rootScope.showSearchBtn = false;
            // if($scope.map_inventory)
            //   $rootScope.$broadcast('search_map')
          }



    };
    ConfigPage.$inject = ['$scope','$rootScope','CommonService','$q','$timeout','$ionicLoading','$ionicFilterBar','inventoryHomeSvc','PlTrackerService'];
    projectCostByte.controller('configPageCtrl', ConfigPage)
})();
