(function () {
    'use strict';

    projectCostByte.controller('modDetailCtrl', modDetailCtrl);

    modDetailCtrl.$inject = ['$q', '$scope', '$state', '$stateParams', '$timeout', '$ionicTabsDelegate', 'MarginOptimizerServiceOne', '$ionicPopup', 'Utils','$rootScope','$ionicPopover','CommonService','$ionicScrollDelegate','ErrorReportingServiceOne','$ionicListDelegate','TaskCreationServiceOne'];

    function modDetailCtrl($q, $scope, $state, $stateParams, $timeout, $ionicTabsDelegate, MarginOptimizerServiceOne, $ionicPopup, Utils,$rootScope,$ionicPopover,CommonService,$ionicScrollDelegate,ErrorReportingServiceOne,$ionicListDelegate,TaskCreationServiceOne) {
                
                $scope.modItems = $state.params;
                // console.log($scope.modItems)
                $scope.gotList = false;
 
                $rootScope.modToggle = $scope.modItems.modToggle;
                
                function fetchIngredientsRHW(getIngRes){
                    $scope.gotList = true;
                    $scope.ingList = getIngRes;
                    
                    
                    _.forEach($scope.ingList, function(value) {
                        value.moddatagroup = {
                            'show': false,
                            'modsAvailable': false,
                            'modData': [],
                            'modDataTotal': null
                        };
                    });
                    // console.log($scope.ingList)
                }
                // fetchModItemIngredients 
                CommonService.fetchModItemIngredients(fetchIngredientsRHW,{
                        menuItem: $scope.modItems.modId 
                });
                $scope.isRecipeZero = function () {
                    // console.log($scope.ingList)
                    if (!angular.isUndefined($scope.ingList)) {
                        if ($scope.ingList.length > 0) {
                            if ($scope.ingList[0]['ingredientName'].toLowerCase() != "no ingredients found") {
                                return false;
                            }

                        }
                    }
                    return true;
                };
                $scope.onMenuItemDetailInit = function () {
                    $scope.navBarTitle.showToggleButton = false;
                }
                $scope.totalingredientscost = function () {

                    return Utils.sumOf($scope.ingList, "ingredientCost");
                };
                $scope.isGroupShown = function (group) {
                    if (angular.isUndefined(group)) {
                        return false;
                    } else {
                        return group.show;
                    }
                };
                $scope.toggleGroup = function (group) {
                    // console.log(group)
                    if (!angular.isUndefined(group)) {
                        group.show = !group.show;
                        $ionicScrollDelegate.resize();
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
                function fetchMenuItemIngredientsRH(menuitem_mods_data) {
                    // console.log(menuitem_mods_data);
                    let matchIngId = _.findIndex($scope.ingList, function(o) { 
                        return o.ingredientId == $scope.selectedIngId; 
                    });
                    if (menuitem_mods_data.length > 0) {
                        //console.log(menuitem_mods_data)
                        var modDataTotal = {
                            'name': 'Total'
                        };
                        for (var i = 0; i < menuitem_mods_data.length; i++) {
                            menuitem_mods_data[i]['globalModQuantity'] = parseInt(menuitem_mods_data[i]['globalModQuantity']);
                        }

                        var fieldNames = ['ingredientCost']
                        _.forEach(fieldNames, function (fieldName) {
                            // console.log(fieldName)
                            modDataTotal[fieldName] = sumOf(menuitem_mods_data, fieldName);
                        });

                        // $scope.moddatagroup = {
                        //     'show': true,
                        //     'modsAvailable': true,
                        //     'modData': menuitem_mods_data,
                        //     'modDataTotal': modDataTotal
                        // };
                        
                        $scope.ingList[matchIngId].moddatagroup = {
                            'show': true,
                            'modsAvailable': true,
                            'modData': menuitem_mods_data,
                            'modDataTotal': modDataTotal
                        };
                        // console.log(matchIngId)
                        $ionicScrollDelegate.resize();
                        $scope.$broadcast('MOP_FREE');
                        // scope.togglerMessage = ' Detailed Price & Cost Info '
                    } else {
                        // $scope.moddatagroup = {
                        //     'show': true,
                        //     'modsAvailable': false,
                        //     'modData': menuitem_mods_data,
                        //     'modDataTotal': null
                        // };
                        $scope.ingList[matchIngId].moddatagroup = {
                            'show': true,
                            'modsAvailable': false,
                            'modData': menuitem_mods_data,
                            'modDataTotal': null
                        };
                        // scope.togglerMessage = ' Detailed Price & Cost Info not available '

                    }
                }
                function fetchDetailedModsData(menuitem_id) {
                    // console.log(menuitem_id);
                    $scope.togglerMessage = ' Fetching Data... ';
                    $scope.$broadcast('MOP_BUSY');
                    MarginOptimizerServiceOne.getSelectedRecipeIngredients(fetchMenuItemIngredientsRH, menuitem_id);
                }
                $scope.getModdata = function (type) {
                    // console.log(type)
                    $scope.selectedIngId = type.ingredientId;
                    // console.log($scope.moddatagroup);
                    if (type.ingredientType === "PREP") {
                        // console.log(angular.isUndefined(type.moddatagroup))
                        if (angular.isUndefined(type.moddatagroup)) {
                            // console.log(type)
                            $scope.toggleGroup(type.moddatagroup);                            
                        } else {
                            if(!type.moddatagroup.show)
                                fetchDetailedModsData(type.ingredientId)
                            else
                                type.moddatagroup.show = !type.moddatagroup.show;
                        }
                    } else {
                        type.moddatagroup = {
                            'show': false,
                            'modsAvailable': false,
                            'modData': [],
                            'modDataTotal': null
                        };
                    }
                };
                $scope.errorReporting = function () {
                    $scope.errorReportPopover.hide();
                    var item = $scope.ingList;
                    // console.log("item: ",item);
                    ErrorReportingServiceOne.showErrorReportForm({
                        'page': 'Prep Manager',
                        'component': item.ingredientName,
                        'modalName' : $scope.errorReportPopover
                    }, {
                        'page': 'Prep Manager',
                        'component': 'Ingredient Name'
                    }) //TODO change component key to component_type in API
                        .then(function (result) {
                            //                                        console.log(result)
                        });
                };

                $ionicPopover.fromTemplateUrl('application/error-reporting/reportPopover.html', {
                    scope: $scope
                })
                    .then(function (popover) {
                        $scope.errorReportPopover = popover;
                    });

                $scope.showReportPopover = function ($event) {
                    $event.preventDefault();
                    $event.stopPropagation();
                    $scope.errorReportPopover.show($event)
                }
                var task_modal_shown = false;
                $scope.taskCreation = function (items) {
                    if (!task_modal_shown){
                    task_modal_shown = TaskCreationServiceOne.showTaskCreateForm({
                        // 'page': 'Menu Performance',
                        'page': 'create task',
                        'component': items.ingredientName,
                        'item': items,
                        'name': items.ingredientName,
                        'cost': items.unitCost,
                        'price': items.ingredientCost,
                        'type': 'ingredient',
                        'portionUnit': items.ingredientUnit,
                        'modalName' : $scope.errorReportPopover
                    }, {
                        'page': 'Mod Manager',
                        'component': 'Menu Recipe'
                    }); //TODO change component key to component_type in API

                    task_modal_shown.then(function (result) {
                            // console.log(result)
                            task_modal_shown = false;
                        });
                    }
                };
                $scope.decide = function (item) {                    
                    $scope.taskCreation(item);
                    $ionicListDelegate.closeOptionButtons();
                };
                
                // ******************************************************************************************

                
            
    };

})();
