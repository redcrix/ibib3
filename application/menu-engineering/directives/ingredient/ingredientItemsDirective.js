(function () {
    'use strict';

    projectCostByte.directive('menuengineeringingredientitem', menuengineeringingredientitem);
    menuengineeringingredientitem.$inject = ['Utils', '$ionicListDelegate', '$timeout', 'DashboardTasksService', '$ionicLoading', '$ionicPopup','TaskCreationServiceOne'];

    projectCostByte.directive('menuengineeringingredientlist', menuengineeringingredientlist);
    menuengineeringingredientlist.$inject = ['Utils'];

    projectCostByte.directive('ingredientdetaileditems', ingredientdetaileditems);
    ingredientdetaileditems.$inject = ['$ionicScrollDelegate', 'MenuEngineeringService'];

    function menuengineeringingredientitem(Utils, $ionicListDelegate, $timeout, DashboardTasksService, $ionicLoading, $ionicPopup, TaskCreationServiceOne) {
        return {
            restrict: 'E',
            templateUrl: 'application/menu-engineering/directives/ingredient/ingredientItemDirective.html',
//            template: ingredientItemTemplate,
            scope: {
                ingredient: '=',
                ifeven: '=',
            },
            link: function (scope, element, attribute) {

                function addTask(source_name, decision, item, affected_name) {
                    var task = create_task(source_name, decision, item, affected_name)

                    DashboardTasksService.addTask(addTaskResponseHandler, task)
                    toastMessage("Task added : " + decision + " of " + affected_name, 1200)
                }

                function create_task(source_name, decision, item, affected_name) {
                    return {
                        'item_name': affected_name,
                        'decision': decision,
                        'source_name': source_name,
                        'source': JSON.stringify(item),
                        'source_link': `app.menuengineeringmenuitem({sectionName:'` + item.sectionName + `',
                                          menuName:'` + item.menuName + `',
                                          categoryName:'` + item.categoryName + `',
                                          itemName:'` + item.itemName + `', })`
                    }
                }

                var addTaskResponseHandler = function (res) {
//                                console.log(res)
                }

                function confirmPopup(decision_type, affected_name) {

                    return $ionicPopup.confirm({
                        scope: scope,
                        title: 'Add Task',
                        template: '<div>Are you sure you want to ' + decision_type + ' of ' + affected_name + '?</div>' +
                            '<div class="row checkbox"><div class="col col-20"><input type="checkbox" ng-model="popupnoshow.pref"></div><div class="col" style="padding-top: 10px">Do not ask me again</div></div>'
                    });
                }

                var toastMessage = function (message_text, duration) {
                        if (typeof duration === 'undefined') duration = 1500;
                        $ionicLoading.show({
                            template: message_text,
                            noBackdrop: true,
                            duration: duration
                        });
                    }
                    // function to add decision
                // scope.decide = function (decision_source, decision, item) {
                //     var affected_name = item.ingredientName;
                //     var disable_confirmation_popup_tasks = Utils.getLocalValue('disable_confirmation_popup_tasks', false)
                //     if (!disable_confirmation_popup_tasks) {
                //         scope.popupnoshow = {};
                //         confirmPopup(decision, affected_name).then(function (user_response) {
                //             if (scope.popupnoshow.pref) {
                //                 Utils.setLocalValue('disable_confirmation_popup_tasks', true);
                //             }
                //             if (user_response) {
                //                 addTask(decision_source, decision, item, affected_name);
                //             }
                //         });
                //     } else {
                //         addTask(decision_source, decision, item, affected_name);
                //     }
                //     $ionicListDelegate.closeOptionButtons();
                // }

                scope.decide = function (item) {
                    // var affected_name = item.menuItemName;
                    // var disable_confirmation_popup_tasks = Utils.getLocalValue('disable_confirmation_popup_tasks', false)
                    // if (!disable_confirmation_popup_tasks) {
                    //     scope.popupnoshow = {};
                    //     confirmPopup(decision, affected_name).then(function (user_response) {
                    //         if (scope.popupnoshow.pref) {
                    //             Utils.setLocalValue('disable_confirmation_popup_tasks', true);
                    //         }
                    //         if (user_response) {
                    //             addTask(decision_source, decision, item, affected_name);
                    //             // scope.taskCreation();
                    //         }
                    //     });
                    // } else {
                    //     addTask(decision_source, decision, item, affected_name);
                    //     // scope.taskCreation();
                    // }



                    // console.log(affected_name);
                    // $rootScope.taskData = {
                    //     "decision_source": decision_source,
                    //     "decision": decision,
                    //     "item": item,
                    //     "affected_name": affected_name
                    // };
                    scope.taskCreation(item);
                    $ionicListDelegate.closeOptionButtons();
                };

                var task_modal_shown = false;
                scope.taskCreation = function (items) {
                    if (!task_modal_shown) {
                        task_modal_shown = TaskCreationServiceOne.showTaskCreateForm({
                            // 'page': 'Menu Engineering',
                            'page': 'create task',
                            'component': items.ingredientName,
                            'item': items,
                            'type':'ingredient',
                            'modalName' : scope.errorReportPopover
                        }, {
                            'page': 'Menu Engineering',
                            'component': 'Menu Recipe'
                        }); //TODO change component key to component_type in API

                        task_modal_shown.then(function (result) {
                            // console.log(result)
                            task_modal_shown = false;
                        });
                    }
                };


            }
        }
    };

    function menuengineeringingredientlist(Utils) {
        return {
            restrict: 'E',
            templateUrl: 'application/menu-engineering/directives/ingredient/ingredientListDirective.html',
            scope: {
                ingredients: '=',
            },
            link: function (scope, element, attribute) {

                    scope.isRecipeZero=function(){
                        if (!angular.isUndefined(scope.ingredients)){
                            if (scope.ingredients.length>0){
                                if(scope.ingredients[0]['ingredientName'].toLowerCase() != "no ingredients found"){
                                    return false;
                                }

                            }
                        }
                        return true;
                    }

                    scope.totalingredientscost = function () {

                        return Utils.sumOf(scope.ingredients, "ingredientCost");
                    }

                    scope.totalingredientscostchange = function () {
                        return Utils.sumOf(scope.ingredients, "ingredientCostChange");
                    }



            }
        }
    };


    function ingredientdetaileditems($ionicScrollDelegate, MenuEngineeringService) {
        return {
            restrict: 'E',
            templateUrl: 'application/menu-engineering/directives/ingredient/ingredientDetailsDirective.html',
            scope: {
                ingredient: '=',
                getdataoninit: '=',
                ifeven: '=',
            },
            link: function (scope, element, attribute) {


                if (!(angular.isUndefined(scope.getdataoninit))) {
                    if (scope.getdataoninit) {
                        if (!(angular.isUndefined(scope.ingredient))) {
                            fetchDetailedIngredientData(scope.ingredient.ingredient_id);
                        }
                    }
                }

                scope.toggleGroup = function (group) {
                    if (!angular.isUndefined(group)) {
                        group.show = !group.show;
                        $ionicScrollDelegate.resize();
                    }
                };

                scope.isGroupShown = function (group) {
                    if (angular.isUndefined(group)) {
                        return false;
                    } else {
                        return group.show;
                    }
                };

                scope.getIngredientData = function () {
                    if (angular.isUndefined(scope.ingredientDataGroup)) {
                        //                        console.log("fetching detailed info : " + scope.item.reference_key);
                        fetchDetailedIngredientData(scope.ingredient.ingredient_id)
                    } else {
                        scope.toggleGroup(scope.ingredientDataGroup);
                    }
                };

                var sumOf = function (data, key) {
                    if (angular.isUndefined(data) && angular.isUndefined(key)) {
                        return 0;
                    } else {
                        var sum = 0;
                        angular.forEach(data, function (value) {
                            sum = sum + value[key];
                        });
                        return sum;
                    }
                }

                function fetchDetailedIngredientData(ingredient_id) {

                    scope.$broadcast('MOP_BUSY');
                    //http request for fetching detailed ingredients data
                    MenuEngineeringService.fetchDetailedIngredientData(fetchDetailedIngredientDataResponseHandler, ingredient_id);
                }
                //Response handler for fetching Menu Item price and cost Data
                function fetchDetailedIngredientDataResponseHandler(ingredient_detailed_data) {

                    var ingredientDataTotal = {
                        'name': "Total",
                        'sales': 0,
                        'ingredientQuantity': sumOf(ingredient_detailed_data, 'ingredientQuantity'),
                    };
                    scope.ingredientDataGroup = {
                        'show': true,
                        'ingredientData': ingredient_detailed_data,
                        'ingredientDataTotal': ingredientDataTotal
                    };
                    scope.$broadcast('MOP_FREE');
                }

            }
        }
    };

})();
