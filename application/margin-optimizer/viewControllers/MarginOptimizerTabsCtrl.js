(function () {
    projectCostByte.controller('MarginOptimizerTabsCtrl', MarginOptimizerTabsCtrl);

    MarginOptimizerTabsCtrl.$inject = ['Utils', '$q', '$scope', '$rootScope', '$state', '$timeout', '$ionicTabsDelegate', 'MarginOptimizerServiceOne', '$filter', '$ionicActionSheet'];

    function MarginOptimizerTabsCtrl(Utils, $q, $scope, $rootScope, $state, $timeout, $ionicTabsDelegate, MarginOptimizerServiceOne, $filter, $ionicActionSheet) {


        $rootScope.data ={
            searchmenuPerIng : ""
        }

        var foodStateName = 'app.marginoptimizer2.Food';
        var liquorStateName = 'app.marginoptimizer2.Liquor';
        function preloadTemplates(){
            return $q(function(resolve, reject){
                let templatesToLoad = [
                    {name: 'application/margin-optimizer/directives/menuItem/menuItemDirective.html', path: 'application/margin-optimizer/directives/menuItem/menuItemDirective.html'},
                    {name: 'application/margin-optimizer/directives/ingredient/ingredientItemDirective.html', path: 'application/margin-optimizer/directives/ingredient/ingredientItemDirective.html'},
                ];
                _.each(templatesToLoad, function(template){
                    Utils.preLoadTemplate(template.name, template.path)
                })

            })
        }
        preloadTemplates();
//        function setHiddenTabs(foodTabExists, liquorTabExists) {
//            $scope.hideFoodTab = !foodTabExists;
//            $scope.hideLiquorTab = !liquorTabExists;
//        }
//
//        var getCategoriesList = function () {
//            MarginOptimizerServiceOne.fetchMenus(fetchCategoriesRH);
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


        $scope.onMarginOptimizerTabsInitHandler = function () {
            $scope.pageTitle = "Menu Performance";
            if ($state.includes(liquorStateName)) {
//                console.log($state.current.name)
                $timeout(MarginOptimizerServiceOne.setSelectedMenuType("Liquor"));
            }else if($state.includes(foodStateName)){
//                console.log($state.current.name)
                $timeout(MarginOptimizerServiceOne.setSelectedMenuType("Food"));
            }


            $scope.navBarTitle.showToggleButton = true;
            $timeout(function(){
                $rootScope.$broadcast("MOP2_TAB_CHANGE","Food");
            })
        }
        //click handlers
        $scope.FoodtabClickHandler = function () {
            $rootScope.$broadcast('MENUOPTSHOWSPINNER');
            $state.go(foodStateName).then(function(){
                MarginOptimizerServiceOne.setSelectedMenuType("Food")
                Utils.setHeaderTitle("Menu Performance")
                $rootScope.$broadcast("MOP2_TAB_CHANGE","Food");
            });
        };
        $scope.LiquortabClickHandler = function () {
            $rootScope.$broadcast('MENUOPTSHOWSPINNER');
            $state.go(liquorStateName).then(function(){
                MarginOptimizerServiceOne.setSelectedMenuType("Liquor");
                Utils.setHeaderTitle("Menu Performance")
                $rootScope.$broadcast("MOP2_TAB_CHANGE","Liquor");
            }

            );
        };
        $scope.showGroupBy = function(){
            //get group by keys
            MarginOptimizerServiceOne.getGroupByKeys().then(function(groupByKeys, currentGroupingIndex){
                var action_sheet_definition = {
                        buttons: [], //         destructiveText: 'Delete',
                        titleText: '<h4>Select field to group by</h4>',
                        cancelText: 'Cancel',
                        cancel: function () {
                        },
                        buttonClicked: function (index) {
                            if (currentGroupingIndex != index) {
                                MarginOptimizerServiceOne.changeGrouping(index).then(function(newGroupingIndex){
                                    $rootScope.$broadcast("MENUOPT_GROUPING_CHANGE");
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


        $scope.toggle = true;

        $scope.$watch('data.searchmenuPerIng', function(newVal) {
            console.log('search.....',newVal)
            $rootScope.$broadcast('search_menu_per_ing')
            // scope.searchIngredient = scope.data.searchmenuPerIng
            // console.log('scope.searchIngredient: ',scope.searchIngredient)
        }, true);
        $scope.closeSearch = function(){
            // $rootScope.searchItem = false;
            $scope.searchItem = true;
            // $rootScope.showSearchBtn = true;
            $scope.data.searchmenuPerIng = '';
        }
        $scope.detectToggle = function(chkToggle){
            console.log(chkToggle)
            $rootScope.$broadcast('detect_toggle',chkToggle)
        }

        $scope.$on('MOP2_MENU_CHANGE', function (event) {
            // navigate to appropriate category tab
//            getCategoriesList();
        });



    }
})();
