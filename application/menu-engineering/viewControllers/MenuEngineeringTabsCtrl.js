(function () {
    projectCostByte.controller('MenuEngineeringTabsCtrl', MenuEngineeringTabsCtrl);

    MenuEngineeringTabsCtrl.$inject = ['Utils', '$q', '$scope', '$rootScope', '$state', '$timeout', '$ionicTabsDelegate', 'MenuEngineeringServiceOne', '$filter', '$ionicActionSheet','CommonService','$ionicPopup','$ionicLoading'];

    function MenuEngineeringTabsCtrl(Utils, $q, $scope, $rootScope, $state, $timeout, $ionicTabsDelegate, MenuEngineeringServiceOne, $filter, $ionicActionSheet,CommonService,$ionicPopup,$ionicLoading) {

        var foodStateName = 'app.menuengineering.Food';
        var liquorStateName = 'app.menuengineering.Liquor';
        $scope.ExportData=true;
         $rootScope.$on('exportbuttontext',function(eve,data){
           console.log("exportbuttontext",data)
             if(data == 'ALL'){
                 $scope.ExportData = false;
             }else{
                 $scope.ExportData = true;
             }
        })
//        function setHiddenTabs(foodTabExists, liquorTabExists) {
//            $scope.hideFoodTab = !foodTabExists;
//            $scope.hideLiquorTab = !liquorTabExists;
//        }
//
//        var getCategoriesList = function () {
//            MenuEngineeringServiceOne.fetchMenus(fetchCategoriesRH);
//        }
//
//        function fetchCategoriesRH(menuList) {
//
//            var selectedIndex = Utils.getIndexIfObjWithOwnAttr(menuList, 'selected', true);
//            var categories = menuList[selectedIndex]['categories'];
//            var foodTabExists = Utils.getIndexIfObjWithOwnAttr(categories, 'categoryName', 'Food') >= 0;
//            var liquorTabExists = Utils.getIndexIfObjWithOwnAttr(categories, 'categoryName', 'Liquor') >= 0;
//
//            if (foodTabExists && liquorTabExists) {
//                if (!$state.includes(foodStateName)) {
//                    $state.go(foodStateName).then(function () {
////                        $ionicTabsDelegate.select(1);
//                        setHiddenTabs(foodTabExists, liquorTabExists)
//                    });
//                }
//
//            } else if (foodTabExists) {
//                if (!$state.includes(foodStateName)) {
//                    $state.go(foodStateName).then(function () {
//                        $ionicTabsDelegate.select(0);
//                        setHiddenTabs(foodTabExists, liquorTabExists)
//                    });
//                }
//            } else if (liquorTabExists) {
//                if (!$state.includes(liquorStateName)) {
//                    $state.go(liquorStateName).then(function () {
//                        $ionicTabsDelegate.select(1);
//                        setHiddenTabs(foodTabExists, liquorTabExists)
//                    });
//                }
//            }
//
//            setHiddenTabs(foodTabExists, liquorTabExists)
//
//        }

        $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
            viewData.enableBack = true;
        });
        $scope.$on('ButtonText',function(eve,data){
            console.log("data emit",data);
        })
        var toastMessage = function(message_text, duration) {
          if (typeof duration === 'undefined') duration = 1500;
          $ionicLoading.show({
            template: message_text,
            noBackdrop: true,
            duration: duration,
          });
        };
        getUserEmailId().then(function(userEmailId) {
              $scope.userEmailId = userEmailId;
            });
        function getUserEmailId() {
              return $q(function(resolve, reject) {
                CommonService.getUserDefaullEmailId(function(emailIdData) {
                  resolve(emailIdData.data.emailId);
                })
              })
              }
           $scope.openPrompt = function() {

            $scope.emailData = {};
            $scope.emailData.userEmailId = $scope.userEmailId;
            $scope.emailData.userEmailIdNew ="";
            var confirmPopup = $ionicPopup.show({
              scope: $scope,
              template: `<form name="nw" novalidate><div class="smaller">
                                         <input type="email" name="email" placeholder="{{ emailData.userEmailId }}" ng-model="emailData.userEmailIdNew" required/>
                                      <p ng-if="showError" class="errror" style="color:red">Please enter a Valid E-mail id.</p>
                                     <span style="color:red" ng-show="nw.email.$dirty && nw.email.$invalid">
                                     <span ng-show="nw.email.$error.email">Invalid email address.</span>
                                      </span>
                                      </div>
                                      </form>`,
              title: 'Export data',
              subTitle: 'Enter alternate email id',
              cssClass: 'text-center popup-export',
              attr: 'ng-disabled="!emailData.userEmailIdNew"',
              buttons: [{
                  text: 'Cancel'
                },
                {
                  text: '<b>Send</b>',
                  type: 'button-bal',
                  onTap: function(e) {
                    var pattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

                    $scope.emailData.userEmailId = !$scope.emailData.userEmailIdNew ? $scope.emailData.userEmailId : $scope.emailData.userEmailIdNew;
                    $scope.emailData.userEmailIdNew = !$scope.emailData.userEmailIdNew ? $scope.emailData.userEmailId : $scope.emailData.userEmailIdNew;
                    $scope.emailData.userEmailId = !$scope.emailData.userEmailIdNew ? $scope.emailData.userEmailId : (pattern.test($scope.emailData.userEmailIdNew) ? $scope.emailData.userEmailIdNew : $scope.emailData.userEmailId);
                     $scope.emailData.userEmailIdNew = $scope.emailData.userEmailId;
                     if (!$scope.emailData.userEmailId ) {
                          toastMessage("Email is required");
                        } else if (!pattern.test($scope.emailData.userEmailId)) {
                          toastMessage("Please Enter Valid Email");
                        } else {
                        console.log($scope.emailData.userEmailId);
                        CommonService.exportRecipeData($scope.exportRecipeRes,$scope.emailData.userEmailId);
                        
                      }
                  }
                }
              ]
            });
          };

          $scope.exportRecipeRes= function(data) {
                          // confirmPopup.close();////
            if(data.status == 200){
            if (data.data.success === true) {
              toastMessage("<span style='position: relative;bottom: 20px;'>Recipe export request sent! </br> You will be receiving email shortly.</span>");
            }
          } else if (data.status == 503){
            toastMessage("Oops something went wrong",2000);
          }
        }

        /* backdrop of floating buttons */

        // var everywhere = angular.element(window.document+":not('#floating-menu')");
        var clicked;
        var everywhere = angular.element(window.document);

        $scope.$on('floating-menu:open', function() {
          console.log('open');
          clicked = true;
          everywhere.bind('click', function(event) {
            // console.log(event.target.className == "icon menu-icon ion-arrow-left-c");
            var el = angular.element(document.querySelectorAll('#floating-menu'));
            if (el[0].className === 'active') {
              if (clicked) {
                el.removeClass('active');
                el.triggerHandler('click');
              }
            }
          });
        });

        $scope.$on('floating-menu:close', function() {
          console.log('close');
          clicked = false;
        });

        $scope.onMenuEngineeringTabsInitHandler = function () {

            $scope.pageTitle = "Menu Engineering";
            // alert($scope.pageTitle);
            //        console.log('menu engg init')
                     if ($state.includes(liquorStateName)) {
            //                console.log($state.current.name)
                        $timeout(MenuEngineeringServiceOne.setSelectedMenuType("Liquor"))
                    }else if($state.includes(foodStateName)){
            //                console.log($state.current.name)
                        $timeout(MenuEngineeringServiceOne.setSelectedMenuType("Food"))
                    }

            $scope.navBarTitle.showToggleButton = true;
            $timeout(function(){
              // console.log('MENUENGG_TAB_CHANGE init');
//                console.log('broadcast init tab change')
                $rootScope.$broadcast("MENUENGG_TAB_CHANGE","Food");
            })

        }





        //click handlers
        $scope.FoodtabClickHandler = function () {
          $rootScope.$broadcast('MENUENGGSHOWSPINNER');
            $state.go(foodStateName).then(function(){
                MenuEngineeringServiceOne.setSelectedMenuType("Food")
                Utils.setHeaderTitle("Menu Engineering")
                // console.log('MENUENGG_TAB_CHANGE food');
                $rootScope.$broadcast("MENUENGG_TAB_CHANGE","Food");
            });
        };
        $scope.LiquortabClickHandler = function () {
          $rootScope.$broadcast('MENUENGGSHOWSPINNER');
            $state.go(liquorStateName).then(function(){
                MenuEngineeringServiceOne.setSelectedMenuType("Liquor");
                Utils.setHeaderTitle("Menu Engineering")
                // console.log('MENUENGG_TAB_CHANGE liquor');
                $rootScope.$broadcast("MENUENGG_TAB_CHANGE","Liquor");
            });
        };


        $scope.showGroupBy = function(){
            //get group by keys
            MenuEngineeringServiceOne.getGroupByKeys().then(function(groupByKeys, currentGroupingIndex){
                var action_sheet_definition = {
                        buttons: [], //         destructiveText: 'Delete',
                        titleText: '<h4>Select field to group by</h4>',
                        cancelText: 'Cancel',
                        cancel: function () {
                        },
                        buttonClicked: function (index ,data) {
                            if (currentGroupingIndex != index) {
                                MenuEngineeringServiceOne.changeGrouping(index).then(function(newGroupingIndex){
                                    $rootScope.$broadcast("MENUENGG_GROUPING_CHANGE");
                                });
                            }
                            hideSheet();
                        }
                }


                _.forEach(groupByKeys, function(groupByKey) {
                    action_sheet_definition.buttons.push({
                        'text': $filter('titleCase')(groupByKey.displayKey)
                    })
                })
                // Show the action sheet
                var hideSheet = $ionicActionSheet.show(action_sheet_definition);


            });



        }
        $scope.showSortBy = function(){
            //get sort by keys
            MenuEngineeringServiceOne.getSortByKeys().then(function(sortByKeys, currentSortingIndex){
                var action_sheet_definition = {
                        buttons: [], //         destructiveText: 'Delete',
                        titleText: '<h4>Select field to sort by</h4>',
                        cancelText: 'Cancel',
                        cancel: function () {
                        },
                        buttonClicked: function (index) {
                            if (currentSortingIndex != index) {
                                MenuEngineeringServiceOne.changeSorting(index).then(function(newSortingIndex){
                                    $rootScope.$broadcast("MENUENGG_SORTING_CHANGE");
                                });
                            }
                            hideSheet();
                        }
                }


                _.forEach(sortByKeys, function(sortByKey) {
                    action_sheet_definition.buttons.push({
                        'text': $filter('titleCase')(sortByKey.displayKey) + (sortByKey.direction>0 ? ' : Low to High' : ' : High to Low')
                    })
                })
                // Show the action sheet
                var hideSheet = $ionicActionSheet.show(action_sheet_definition);


            });



        }



        $scope.$on('MENUENGG_MENU_CHANGE', function (event) {
            // navigate to appropriate category tab
//            getCategoriesList();
        });



    }
})();
