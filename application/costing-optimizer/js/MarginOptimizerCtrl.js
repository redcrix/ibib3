(function () {
    projectCostByte.controller('MarginOptimizerCtrl', marginOptimizerCtrl);
    marginOptimizerCtrl.$inject = ['$scope', 'MarginOptimizerService', '$state', 'CommonConstants', 'CommonService', '$ionicActionSheet'

        , '$rootScope', 'Utils', '$ionicListDelegate', '$ionicPopup', '$ionicScrollDelegate'

        , 'DashboardTasksService', '$ionicLoading', '$ionicModal', '$stateParams', '$ionicNavBarDelegate'];
    var marginOptimizerData, menuChangeCaught;

    function marginOptimizerCtrl($scope, MarginOptimizerService, $state, CommonConstants, CommonService, $ionicActionSheet, $rootScope, Utils, $ionicListDelegate, $ionicPopup, $ionicScrollDelegate, DashboardTasksService, $ionicLoading, $ionicModal, $stateParams, $ionicNavBarDelegate) {
//       $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
//            viewData.enableBack = true;
//            $ionicNavBarDelegate.showBar(true);
//
//        });
//       $scope.$on('$ionicView.enter', function(e,viewData) {
//            $ionicNavBarDelegate.showBar(true);
//            viewData.enableBack = true;
//        });

        $scope.init = function(){
            $scope.pageTitle = "Margin Optimizer";
        }

            //click handlers
        $scope.FoodtabClickHandler = function () {
            $state.go('app.marginoptimizer.Food');
        };
        $scope.LiquortabClickHandler = function () {
            $state.go('app.marginoptimizer.Liquor');
        };
        $scope.mopresetData = function () {
                if (marginOptimizerData === undefined) {
                    //                console.log('mopresetData');
                    marginOptimizerData = {
                        selected_menu: '',
                        menus: [],
                        current_store: ''
                    };
                }
            }
            //On Margin Optimizer init handler
        $scope.onMarginOptimizerInitHandler = function () {
                //            console.log('onMarginOptimizerInitHandler')
             $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
            viewData.enableBack = true;
            $ionicNavBarDelegate.showBar(true);

        });
                $scope.navBarTitle.showToggleButton = true;
                fetchSortingButtons();
                $scope.mopresetData();
                $scope.menu_click = false;
//                console.log(marginOptimizerData);
                if (marginOptimizerData.menus.length == 0 || marginOptimizerData.current_store != Utils.getLocalValue('current_store', '0')) {
                    fetchMenus();
                } else {
                    fetchMenuData();
                }
            }
            //On Margin Optimizer Section view init handler
        $scope.onSectionInit = function () {
                //            console.log('onMarginOptimizerInitHandler')
                 $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
            viewData.enableBack = true;
//            $ionicNavBarDelegate.showBar(true);

        });
                $scope.navBarTitle.showToggleButton = false;
                //            console.log($state.params.section_id)
                fetchSectionData($state.params.section_id);
                fetchSortingButtons();
            }
            //On Margin Optimizer Menu item init handler
        $scope.onMenuItemInit = function () {
         $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
            viewData.enableBack = true;
//            $ionicNavBarDelegate.showBar(true);

        });
            //            console.log('onMarginOptimizerInitHandler')
            $scope.navBarTitle.showToggleButton = false;
            //            console.log($state.params.menuitem_id)
            fetchMenuItemData($state.params.menuitem_id);
        }
        $scope.CategoryExists = function (category_name) {
                if (angular.isDefined($scope.categories)) {
                    //                console.log('has categories')
                    if (angular.isDefined($scope.categories[category_name])) {
                        //                    console.log('has '+ category_name + 'category')
                        return true;
                    }
                }
                //            console.log('does not have '+ category_name + 'category')
                return false;
            }
            // function to add decision
        $scope.decide = function (decision_source, decision_type, item, affected_name) {
                var add_task = true;
                var disable_confirmation_popup_tasks = Utils.getLocalValue('disable_confirmation_popup_tasks', false)
                if (!disable_confirmation_popup_tasks) {
                    $scope.popupnoshow = {};
                    var confirmPopup = $ionicPopup.confirm({
                        scope: $scope,
                        title: 'Add Task',
                        template: '<div>Are you sure you want to ' + decision_type + ' of ' + affected_name + '?</div>' +
                            //                                        '<label class="checkbox"><input type="checkbox">Do not ask me again</label>'
                            '<div class="row checkbox"><div class="col col-20"><input type="checkbox" ng-model="popupnoshow.pref"></div><div class="col" style="padding-top: 10px">Do not ask me again</div></div>'
                    });
                    confirmPopup.then(function (user_response) {
                        if ($scope.popupnoshow.pref) Utils.setLocalValue('disable_confirmation_popup_tasks', true);
                        add_task = user_response;
                        if (add_task) {
                            //                       this_decision = create_decision(decision_source, decision_type, item_name);
                            //                       decisionStoreFactory.set_decision(this_decision);
                            addTask(decision_source, decision_type, item, affected_name);
                            toastMessage("Task added : " + decision_type + " of " + affected_name, 800)
                        }
                    });
                } else {
                    if (add_task) {
                        //                   this_decision = create_decision(decision_source, decision_type, item_name);
                        //                   decisionStoreFactory.set_decision(this_decision);
                        addTask(decision_source, decision_type, item, affected_name);
                        toastMessage("Task added : " + decision_type + " of " + affected_name, 1200);
                    }
                }
                $ionicListDelegate.closeOptionButtons();
            }

        var fetchSortingButtons = function(){
//            console.log("sorting buttons fetch")
            MarginOptimizerService.fetchSortingButtons(fetchSortingButtonsRH);
        }

        var fetchSortingButtonsRH = function(sortingButtons){
            $scope.filterButtons = sortingButtons;
            //  function to return the selected filter button sorting option
            $scope.userSortingClass = function () {
                for (var i = 0; i < $scope.filterButtons.length; i++) {
                    if ($scope.filterButtons[i].clicked) {
                        return $scope.filterButtons[i].sortClass
                    }
                }
                return $scope.filterButtons[0].sortClass
            }
        }

            //Response handler for fetching Menus
        var fetchMenusResponseHandler = function (menus) {
                //            console.log(menus)
                marginOptimizerData.current_store = Utils.getLocalValue('current_store', '0');
                if (menus.length > 0) {
                    marginOptimizerData.menus = menus;
                    if (marginOptimizerData.selected_menu == '') {
                        marginOptimizerData.selected_menu = menus[0]['menu_key'];
                    }
                    // fetch category data on menu change
                    fetchMenuData();
                } else {
                    $scope.menu_name = "No Data"
                    $scope.menu_cost_percent = 0
                    $scope.$broadcast('MOP_FREE');
                }
            }
            //Response handler for fetching Menu Data
        var fetchMenuDataResponseHandler = function (menu_data) {
            //            if (menu_data.length>0){

            var foodDataInMenu = angular.isDefined(menu_data.Food);
            var liquorDataInMenu = angular.isDefined(menu_data.Liquor);
            var stateToGo = 'app.marginoptimizer.Food';
            if (!foodDataInMenu && liquorDataInMenu){
                stateToGo = 'app.marginoptimizer.Liquor';
            }

            if ($rootScope.currentState == stateToGo){
                setMenuData(menu_data, false);
            }
            else{
            $state.go(stateToGo).then(function(){
//                console.log("state changed to " + stateToGo);
                setMenuData(menu_data, true);
                $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
                    viewData.enableBack = true;
                });
            })}
        }

        var setMenuData = function(menu_data, forceRefresh){
            $scope.navBarTitle.showToggleButton = true;
            var selected_menu_index = getIndexIfObjWithOwnAttr(marginOptimizerData.menus, 'menu_key', marginOptimizerData.selected_menu)
            $scope.menu_name = marginOptimizerData.menus[selected_menu_index]['menu_name']
            $scope.menu_cost_percent = marginOptimizerData.menus[selected_menu_index]['menu_cost_percent']
            $scope.categories = menu_data
            if (forceRefresh){
                $state.reload();
            }
            $scope.$broadcast('MOP_FREE');
        }
        $ionicModal.fromTemplateUrl('application/costing-optimizer/view/ingredient_supplier_modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal = modal;
        });
        // click handler for ingredient suppliers
        $scope.openModal = function (ingredient) {
                //            console.log(ingredient)
                ingredient = JSON.parse(ingredient)
                fetchIngredientSuppliers(ingredient)
            }
            //Response handler for fetching Section Data
        var fetchSectionDataResponseHandler = function (section_data) {
                //            console.log(section_data)
                $scope.section = section_data
                $scope.$broadcast('MOP_FREE');
            }
            //Response handler for fetching Menu Item Data
        var fetchMenuItemDataResponseHandler = function (menuitem_data) {
                //                console.log(menuitem_data)
                $scope.menuitem = menuitem_data
                $scope.toggleGroup = function (group) {
                    group.show = !group.show;
                    $ionicScrollDelegate.resize();
                };
                $scope.isGroupShown = function (group) {
                    return group.show;
                };
                $scope.competitor_pricing = {
                    show: false
                };
                $scope.average_price = averageOf(menuitem_data.competitor_items, 'competitor_item_price')
                $scope.total_ingredients_cost = sumOf(menuitem_data.ingredients, 'ingredient_cost')
                $scope.total_ingredients_costchange = sumOf(menuitem_data.ingredients, 'ingredient_costchange')
                $scope.$broadcast('MOP_FREE');
            }
            //Response handler for fetching Section Data
        var fetchIngredientSuppliersResponseHandler = function (ingredient_data) {
                $scope.receipeitemoptions = ingredient_data
                $scope.modal.show();
                $scope.$broadcast('MOP_FREE');
            }
            // get index of object in list
        var getIndexIfObjWithOwnAttr = function (array, attr, value) {
            for (var i = 0; i < array.length; i++) {
                if (array[i].hasOwnProperty(attr) && array[i][attr] === value) {
                    return i;
                }
            }
            return -1;
        }
        var averageOf = function (data, key) {
            if (angular.isUndefined(data) && angular.isUndefined(key)) {
                return 0;
            } else {
                var sum = 0;
                var itemscount = 0;
                angular.forEach(data, function (value) {
                    sum = sum + value[key];
                    itemscount += 1;
                });
                return sum / itemscount;
            }
        }
        var sumOf = function (data, key) {
            if (angular.isUndefined(data) && angular.isUndefined(key)) {
                return 0;
            } else {
                var sum = 0;
                //                var itemscount = 0;
                angular.forEach(data, function (value) {
                    sum = sum + value[key];
                    //                    itemscount += 1;
                });
                return sum;
            }
        }
        var addTask = function (source_name, decision, item, affected_name) {
            task = create_task(source_name, decision, item, affected_name)
            DashboardTasksService.addTask(addTaskResponseHandler, task)
        }
        var create_task = function (source_name, decision, item, affected_name) {
            return {
                'item_name': affected_name,
                'decision': decision,
                'source_name': source_name,
                'source': item.reference_key,
                'source_link': 'app.marginoptimizermenuitem({menuitem_id:"' + item.reference_key + '"})'
            }
        }
        var addTaskResponseHandler = function (res) {
                //            console.log(res)
            }
            // decision object creation helper
        var create_decision = function (source, decisiontype, item_name) {
            return {
                'startdate': '',
                'completeddate': '',
                'expiredate': '',
                'pending': false,
                'action': decisiontype,
                'source': source,
                'tracked_items': [{
                    "Name": item_name,
                    "$Impact": 0,
                }]
            }
        }
        var fetchMenus = function () {
            //http request for fetching menus
            $scope.$broadcast('MOP_BUSY');
            MarginOptimizerService.fetchMenus(fetchMenusResponseHandler);
        }
        var fetchMenuData = function () {
            $scope.$broadcast('MOP_BUSY');
            //http request for fetching menu data
            MarginOptimizerService.fetchMenuData(fetchMenuDataResponseHandler, marginOptimizerData.selected_menu);
        }
        var fetchSectionData = function (section_id) {
            $scope.$broadcast('MOP_BUSY');
            //http request for fetching section data
            MarginOptimizerService.fetchSectionData(fetchSectionDataResponseHandler, section_id);
        }
        var fetchMenuItemData = function (menuitem_id) {
            $scope.$broadcast('MOP_BUSY');
            //http request for fetching section data
            MarginOptimizerService.fetchMenuItemData(fetchMenuItemDataResponseHandler, menuitem_id);
        }
        var fetchIngredientSuppliers = function (ingredient) {
            $scope.$broadcast('MOP_BUSY');
            //http request for fetching section data
            MarginOptimizerService.fetchIngredientSuppliers(fetchIngredientSuppliersResponseHandler, ingredient);
        }
        $scope.$on('MO_MENU_CHANGE', function (event) {
            if (!menuChangeCaught) {fetchMenuData();}
            menuChangeCaught = true;

        });
        $scope.$on('MOP_BUSY', function (event) {
            $scope.spinnerhide = false;
        });
        $scope.$on('MOP_FREE', function (event) {
            $scope.spinnerhide = true;
        });
        // Triggered on a menu button click
        $scope.showMenus = function () {
            $scope.menu_click = true;
            var menus = marginOptimizerData.menus;
            var action_sheet_definition = {
                buttons: [], //         destructiveText: 'Delete',
                titleText: '<h4>Select Menu</h4>',
                cancelText: 'Cancel',
                cancel: function () {
                    // add cancel code..
                    $scope.menu_click = false;
                },
                buttonClicked: function (index) {
                    //                                            console.log(index)
                    var selected_menu = menus[index]['menu_key'];
                    // change menu here
                    if (marginOptimizerData.selected_menu != selected_menu) {
                        marginOptimizerData.selected_menu = selected_menu;
                        menuChangeCaught = false;
                        $scope.$broadcast('MO_MENU_CHANGE');
                        $ionicScrollDelegate.scrollTop();
                        $scope.menu_click = false;
                    }
                    hideSheet();
                }
            }
            for (var i = 0; i < menus.length; i++) {
                action_sheet_definition.buttons.push({
                    'text': menus[i]['menu_name']
                        //                                                    +'('+  menus[i]['date']+')'
                })
            }
            // Show the action sheet
            var hideSheet = $ionicActionSheet.show(action_sheet_definition);
        }
        var toastMessage = function (message_text, duration) {
            if (typeof duration === 'undefined') duration = 1500;
            $ionicLoading.show({
                template: message_text,
                noBackdrop: true,
                duration: duration
            });
        }
    }
})();
