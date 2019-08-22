(function () {
    projectCostByte.controller('MenuPerformanceOptimizerCtrl', MenuPerformanceOptimizerCtrl);
    MenuPerformanceOptimizerCtrl.$inject = ['$scope', 'MenuPerformanceOptimizerService', '$state', 'CommonConstants', 'CommonService', '$ionicActionSheet'
                                    , '$rootScope', 'Utils', '$ionicListDelegate', '$ionicPopup', '$ionicScrollDelegate'
                                    , 'DashboardTasksService', '$ionicLoading'];
    var MenuPerformanceOptimizerData;

    function MenuPerformanceOptimizerCtrl($scope, MenuPerformanceOptimizerService, $state, CommonConstants, CommonService, $ionicActionSheet, $rootScope, Utils, $ionicListDelegate, $ionicPopup, $ionicScrollDelegate, DashboardTasksService, $ionicLoading) {
        $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
            viewData.enableBack = true;
        });
        //////
        /////dummy values
        $scope.dummysaleschange = 500;
        $scope.dummysales = 2300;
        $scope.dummysalesratio = 75;
        $scope.dummysaleschangeratio = 55;
        $scope.performanceData = {
                'sales': [[5000, 4500, 4750, 3000, 5000, 4500, 4750, 3500], [4700, 4900, 5000, 4500, 4750, 4850, 4000, 3900], ]
                , 'labels': ["January", "February", "March", "April", "May", "June", "July"]
                , 'series': ['Sales Performance', 'Benchmark Sales']
            , }
            /////
            /////
            //click handlers
        $scope.filterbuttons = [
            {
                'label': 'Top Sales'
                , 'performanceclass': 'top_sales'
                , 'style': 'button-balanced'
                , 'clicked': true
            }
            , {
                'label': 'Low Sales'
                , 'performanceclass': 'low_sales'
                , 'style': 'button-assertive'
                , 'clicked': false
            }
//            , {
//                'label': 'Big Change'
//                , 'performanceclass': 'big_change'
//                , 'style': 'button-positive'
//                , 'clicked': false
//            }
         , ]

        $scope.userPerformanceClass = "top_sales"

        $scope.filterPerformanceClass = function(element){
//            console.log($scope.userPerformanceClass)
            if(element.performanceclass.hasOwnProperty($scope.userPerformanceClass)){
            return true}else{return false}
        }

        $scope.filterbuttonclick = function (filterbuttonindex) {
            for (var i = 0; i < $scope.filterbuttons.length; i++) {
                if (i == filterbuttonindex) {
                    $scope.filterbuttons[i].clicked = !($scope.filterbuttons[i].clicked);
                    if(!$scope.filterbuttons[i].clicked){
                        $scope.userPerformanceClass = "all";
                    }else{
                        $scope.userPerformanceClass =$scope.filterbuttons[i].performanceclass
                    }
                }
                else {
                    $scope.filterbuttons[i].clicked = false;
                }


            }

        }
        $scope.FoodtabClickHandler = function () {
            $state.go('app.MenuPerformanceoptimizer.Food');
        };
        $scope.LiquortabClickHandler = function () {
            $state.go('app.MenuPerformanceoptimizer.Liquor');
        };
        $scope.mopresetData = function () {
                if (MenuPerformanceOptimizerData === undefined) {
                    //                console.log('mopresetData');
                    MenuPerformanceOptimizerData = {
                        selected_menu: ''
                        , menus: []
                    };
                }
            }
            //On MenuPerformance Optimizer init handler
        $scope.onMenuPerformanceOptimizerInitHandler = function () {
                //            console.log('onMenuPerformanceOptimizerInitHandler')
                $scope.navBarTitle.showToggleButton = true;
                $scope.mopresetData();
                $scope.menu_click = false;
                if (MenuPerformanceOptimizerData.menus.length == 0) {
                    fetchMenus();
                }
                else {
                    fetchMenuData();
                }
            }
            //On MenuPerformance Optimizer Section view init handler
        $scope.onSectionInit = function () {
                //            console.log('onMenuPerformanceOptimizerInitHandler')
                $scope.navBarTitle.showToggleButton = false;
                //            console.log($state.params.section_id)
                fetchSectionData($state.params.section_id);
            }
            //On MenuPerformance Optimizer Menu item init handler
        $scope.onMenuItemInit = function () {
            //            console.log('onMenuPerformanceOptimizerInitHandler')
            $scope.navBarTitle.showToggleButton = false;
            //            console.log($state.params.menuitem_id)
            fetchMenuItemData($state.params.menuitem_id);
        }
        $scope.CategoryExists = function (category_name) {
                if ("categories" in $scope) {
                    //                console.log('has categories')
                    if (category_name in $scope.categories) {
                        //                    console.log('has '+ category_name + 'category')
                        return 'ng-show'
                    }
                }
                //            console.log('does not have '+ category_name + 'category')
                return 'ng-hide'
            }
            // function to add decision
        $scope.decide = function (decision_source, decision_type, item, affected_name) {
                var add_task = true;
                var disable_confirmation_popup_tasks = Utils.getLocalValue('disable_confirmation_popup_tasks', false)
                if (!disable_confirmation_popup_tasks) {
                    $scope.popupnoshow = {};
                    var confirmPopup = $ionicPopup.confirm({
                        scope: $scope
                        , title: 'Add Task'
                        , template: '<div>Are you sure you want to ' + decision_type + ' of ' + affected_name + '?</div>' +
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
                }
                else {
                    if (add_task) {
                        //                   this_decision = create_decision(decision_source, decision_type, item_name);
                        //                   decisionStoreFactory.set_decision(this_decision);
                        addTask(decision_source, decision_type, item, affected_name);
                        toastMessage("Task added : " + decision_type + " of " + affected_name, 1200);
                    }
                }
                $ionicListDelegate.closeOptionButtons();
            }
            //Response handler for fetching Menus
        var fetchMenusResponseHandler = function (menus) {
                //            console.log(menus)
                if (menus.length > 0) {
                    MenuPerformanceOptimizerData.menus = menus;
                    if (MenuPerformanceOptimizerData.selected_menu == '') {
                        //                    for(var menuindex = 0; menuindex<menus.length; menuindex++ ){
                        //                        if (menus[menuindex].menu_name == 'SPECIAL'){
                        //                            MenuPerformanceOptimizerData.selected_menu = menus[menuindex]['menu_key'];
                        //                        }
                        //
                        //                    }
                        MenuPerformanceOptimizerData.selected_menu = menus[0]['menu_key']
                    }
                    // fetch category data on menu change
                    fetchMenuData();
                }
                else {
                    $scope.menu_name = "No Data"
                    $scope.menu_cost_percent = 0
                    $scope.$broadcast('MOP_FREE');
                }
            }
            //Response handler for fetching Menu Data
        var fetchMenuDataResponseHandler = function (menu_data) {
                //            if (menu_data.length>0){
                var selected_menu_index = getIndexIfObjWithOwnAttr(MenuPerformanceOptimizerData.menus, 'menu_key', MenuPerformanceOptimizerData.selected_menu)
                $scope.menu_name = MenuPerformanceOptimizerData.menus[selected_menu_index]['menu_name']
                $scope.menu_cost_percent = MenuPerformanceOptimizerData.menus[selected_menu_index]['menu_cost_percent']
//                console.log(menu_data)
                $scope.categories = menu_data
                //console.log($scope.categories.Food.sections[0].menu_items[0].sales);
//console.log($scope.categories.Food.sections[0].menu_items[0].item_name);
                $scope.$broadcast('MOP_FREE');
            }
            //Response handler for fetching Section Data
        var fetchSectionDataResponseHandler = function (section_data) {
                //            console.log(section_data)
                $scope.section = section_data

                $scope.$broadcast('MOP_FREE');
            }
            //Response handler for fetching Menu Item Data
        var fetchMenuItemDataResponseHandler = function (menuitem_data) {
                //            console.log(menuitem_data)
                $scope.menuitem = menuitem_data
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
        var addTask = function (source_name, decision, item, affected_name) {
            task = create_task(source_name, decision, item, affected_name)
            DashboardTasksService.addTask(addTaskResponseHandler, task)
        }
        var create_task = function (source_name, decision, item, affected_name) {
            return {
                'item_name': affected_name
                , 'decision': decision
                , 'source_name': source_name
                , 'source': item.reference_key
                , 'source_link': 'app.MenuPerformanceoptimizermenuitem({menuitem_id:"' + item.reference_key + '"})'
            }
        }
        var addTaskResponseHandler = function (res) {
                //            console.log(res)
            }
            // decision object creation helper
        var create_decision = function (source, decisiontype, item_name) {
            return {
                'startdate': ''
                , 'completeddate': ''
                , 'expiredate': ''
                , 'pending': false
                , 'action': decisiontype
                , 'source': source
                , 'tracked_items': [{
                    "Name": item_name
                    , "$Impact": 0
                , }]
            }
        }
        var fetchMenus = function () {
            //http request for fetching menus
            $scope.$broadcast('MOP_BUSY');
            MenuPerformanceOptimizerService.fetchMenus(fetchMenusResponseHandler);
        }
        var fetchMenuData = function () {
            $scope.$broadcast('MOP_BUSY');
            //http request for fetching menu data
            MenuPerformanceOptimizerService.fetchMenuData(fetchMenuDataResponseHandler, MenuPerformanceOptimizerData.selected_menu);
                  }
        var fetchSectionData = function (section_id) {
            $scope.$broadcast('MOP_BUSY');
            //http request for fetching section data
            MenuPerformanceOptimizerService.fetchSectionData(fetchSectionDataResponseHandler, section_id);
        }
        var fetchMenuItemData = function (menuitem_id) {
            $scope.$broadcast('MOP_BUSY');
            //http request for fetching section data
            MenuPerformanceOptimizerService.fetchMenuItemData(fetchMenuItemDataResponseHandler, menuitem_id);
        }
        $scope.$on('MO_MENU_CHANGE', function (event) {
            fetchMenuData();
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
            var menus = MenuPerformanceOptimizerData.menus;
            var action_sheet_definition = {
                buttons: [], //         destructiveText: 'Delete',
                titleText: '<h4>Select Menu</h4>'
                , cancelText: 'Cancel'
                , cancel: function () {
                    // add cancel code..
                    $scope.menu_click = false;
                }
                , buttonClicked: function (index) {
                    //                                            console.log(index)
                    var selected_menu = menus[index]['menu_key'];
                    // change menu here
                    if (MenuPerformanceOptimizerData.selected_menu != selected_menu) {
                        MenuPerformanceOptimizerData.selected_menu = selected_menu;
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
                template: message_text
                , noBackdrop: true
                , duration: duration
            });
        }
    }
})();
