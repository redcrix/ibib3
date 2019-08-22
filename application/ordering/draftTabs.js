(function () {
    var DraftTabs = function ($scope,$rootScope,CommonService,$q,$timeout,$ionicLoading,$ionicFilterBar,inventoryHomeSvc,$state,orderingItemsSvc) {

              // $scope.init = function(){
              $scope.navBarTitle.showToggleButton = false;
              $rootScope.stageQtyChanged = false;
              // }
              $scope.cart = false;
              $scope.draft_items = true;
              $scope.recommended = false;
              // $rootScope.searchItem = false;
              $scope.headerTitleINV ="";
              $rootScope.searchItem = true;
              $rootScope.showSearchBtn = true;
              $rootScope.data ={
                searchText : ""
              }

              $scope.orderingId = $state.params.ordering;
              $scope.ordering_name = $state.params.ordering_name;
              $scope.date_of_creation = $state.params.date_of_creation;
              $scope.store_id = $state.params.store_id;
              // $scope.store_id = $state.params.store_id;
              // console.log($scope.orderingId,$scope.ordering_name );
              $scope.dateCreated = $state.params.date_of_creation;

              $scope.filterButtons = [{
                  'label': 'Recommended',
                  'filter_tag': 'Recommended',
                  'style': 'button-positive',
                  'clicked': true,
                  // 'sortClass': '-dollarSales',
                  // 'icon': 'ion-trophy'
                  }, {
                  'label': 'Other Items',
                  'filter_tag': 'Other-Items',
                  'style': 'button-positive',
                  'clicked': false,
                  // 'sortClass': 'dollarSales',
                  // 'icon': 'ion-arrow-graph-down-right'
                  },
                  {
                  'label': 'Cart',
                  'filter_tag': 'Cart',
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

          $scope.setItemGrouping = function(){
            // console.log('------ setItemGrouping ------',$scope.recommended,$scope.draft_items,$scope.cart);
            if($scope.draft_items){
              $scope.$broadcast('set_draft_item_grouping');
            }else if($scope.cart || $scope.recommended){
              $scope.$broadcast('set_cart_item_grouping');
            }
          }



          $scope.changeTab = function(){
            // console.log('******************************');
            let headerSet = angular.element(document.querySelectorAll('.title-center'))
            $timeout(function() {
                selectedTab = _.find($scope.filterButtons,function(itm){
                  return itm.clicked == true;
                })
                // console.log(selectedTab.filter_tag)
                if(selectedTab.filter_tag == 'Other-Items'){
                  // console.log('Draft tab clicked.....');
                  $scope.headerTitleINV="Ordering";
                  $scope.draft_items = true;
                  $scope.recommended = false;
                  $scope.cart = false;
                  $rootScope.data.searchText = '';
                  // $rootScope.$broadcast('search_inactive_list')
                  $rootScope.searchItem = false;
                  $rootScope.showSearchBtn = true;
                  $rootScope.qtyRecommended = false;
                  $rootScope.cartSelected = false;

                  // headerSet[0].style.left = "44px";
                  // headerSet[0].style.right = "44px";
                  // headerSet[1].style.left = "44px";
                  // headerSet[1].style.right = "44px";

                }
                if(selectedTab.filter_tag == 'Cart'){
                  $scope.headerTitleINV="";
                  $scope.cart = true;
                  $scope.recommended = false;
                  $scope.draft_items = false;
                  $rootScope.data.searchText = '';
                  // $rootScope.$broadcast('set_search_map')
                  // $rootScope.searchItem = false;
                  $rootScope.searchItem = true;
                  $rootScope.showSearchBtn = true;
                  $rootScope.qtyRecommended = false;
                  // $rootScope.cartSelected = true;

                  if($rootScope.stageQtyChanged)
                    $scope.$broadcast('get_fresh_cart',$scope.orderingId)

                  // headerSet[0].style.left = "44px";
                  // headerSet[0].style.right = "90px";
                  // headerSet[1].style.left = "44px";
                  // headerSet[1].style.right = "90px";

                }
                if(selectedTab.filter_tag == 'Recommended'){
                  $scope.headerTitleINV="";
                  $scope.recommended = true;
                  $scope.cart = false;
                  $scope.draft_items = false;
                  // getPnLItems();
                  $rootScope.data.searchText = '';

                  // $rootScope.searchItem = false;
                  $rootScope.searchItem = true;
                  $rootScope.showSearchBtn = true;
                  $rootScope.qtyRecommended = true;
                  // $rootScope.cartSelected = false;

                  // headerSet[0].style.left = "44px";
                  // headerSet[0].style.right = "90px";
                  // headerSet[1].style.left = "44px";
                  // headerSet[1].style.right = "90px";
                }
            }, 200);

            $scope.$broadcast('check_lock','map_inventoy_items');
            // console.log('$rootScope.inactiveLocked: ',$rootScope.inactiveLocked)


          }


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
    DraftTabs.$inject = ['$scope','$rootScope','CommonService','$q','$timeout','$ionicLoading','$ionicFilterBar','inventoryHomeSvc','$state','orderingItemsSvc'];
    projectCostByte.controller('draftTabsPageCtrl', DraftTabs)
})();
