(function () {
    'use strict';
    projectCostByte.directive('ingredientContent', ingredientContent);

    ingredientContent.$inject = ['$state','$ionicHistory', '$timeout', '$ionicPopover', 'ErrorReportingServiceOne','$ionicFilterBar','$rootScope','$ionicListDelegate','TaskCreationServiceOne'];

    function  ingredientContent ($state,$ionicHistory, $timeout, $ionicPopover, ErrorReportingServiceOne,$ionicFilterBar,$rootScope,$ionicListDelegate,TaskCreationServiceOne) {
        return {
            restrict: 'E',
              templateUrl: 'application/mod-manager/directives/ingredient-content.html',
//            template: sectionTemplate,
            scope: {
                items: '=',
                type: '='
            },
            link: function (scope, element, attribute) {
                // console.log('directive called.......')
                // console.log(JSON.stringify(scope.items))
                scope.withoutRecipes = [];
                scope.withRecipes = []
                scope.displayItems = []
                // let filterBarInstance;
                // scope.searchItem = true;
                // scope.showSearchBtn = true;
                scope.data ={
                    searchText : ""
                }
                //  scope.toggle = false;
                // console.log(scope.items)

                scope.lastView = $ionicHistory.viewHistory().forwardView;
                if(scope.lastView){
                    console.log(scope.lastView.stateId.indexOf('mod'))
                    if(scope.lastView.stateId.indexOf('mod') != -1){
                        console.log('coming from mod page')
                        // console.log($rootScope.modToggle);
                        scope.toggle = ($rootScope.modToggle == 'true') ? true : false;
                    } else {
                        console.log('coming from other page')
                        $rootScope.modToggle = false;
                        scope.toggle = false;
                    }
                } else {
                    scope.toggle = false;
                }

                function checkTopggle(toggleVal){
                    console.log('checkTopggle ', toggleVal)
                    if(toggleVal){
                        scope.displayItems = _.filter(scope.items, function(o) {
                            return !o.mod_cost;
                        });
                    } else{
                        scope.displayItems = _.filter(scope.items, function(o) {
                            return o.mod_cost;
                        });
                    }
                }
                checkTopggle(scope.toggle)
                // scope.displayItems = _.filter(scope.items, function(o) {
                //     return o.mod_cost;
                // });



                scope.$watch('data.searchText', function(newVal) {
                    scope.searchIngredient = scope.data.searchText
                }, true);
                scope.closeSearch = function(){
                    scope.searchItem = true;
                    scope.data.searchText = '';
                }
                scope.detectToggle = function(chkToggle){
                    checkTopggle(chkToggle)
                }
                scope.gotoModDetail = function(selectedItem){
                    // console.log(selectedItem)
                    var myElement = angular.element( document.querySelector( '#mod-list_'+selectedItem.mod_id ) );
                    //console.log(myElement)
                    myElement.addClass('inventory-item-selected');
                    $state.go('app.modDetail',{ 'modName':selectedItem.mod_name,'modId': selectedItem.mod_id,'modCost':selectedItem.mod_cost,'modToggle':scope.toggle})

                }
                scope.errorReporting = function () {
                    scope.errorReportPopover.hide();
                    var item = scope.displayItems;
                    // console.log("item: ",item);
                    ErrorReportingServiceOne.showErrorReportForm({
                        'page': 'Mod Manager',
                        'component': scope.mySelectedItem.mod_name,
                        'modalName' : scope.errorReportPopover
                    }, {
                        'page': 'Mod Manager',
                        'component': 'Ingredient Name'
                    }) //TODO change component key to component_type in API
                        .then(function (result) {
                            //                                        console.log(result)
                        });
                };

                $ionicPopover.fromTemplateUrl('application/error-reporting/reportPopover.html', {
                    scope: scope
                })
                    .then(function (popover) {
                        scope.errorReportPopover = popover;
                    });

                scope.showReportPopover = function ($event,item) {
                    scope.mySelectedItem = item;
                    $event.preventDefault();
                    $event.stopPropagation();
                    scope.errorReportPopover.show($event)
                }
                var task_modal_shown = false;
                scope.taskCreation = function (items) {
                    if (!task_modal_shown){
                    task_modal_shown = TaskCreationServiceOne.showTaskCreateForm({
                        // 'page': 'Menu Performance',
                        'page': 'create task',
                        'component': items.mod_name,
                        'item': items,
                        'name': items.mod_name,
                        'cost': items.mod_cost,
                        // 'price': items.ingredientCost,
                        'type': 'menu',
                        'modalName' : scope.errorReportPopover
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
                scope.decide = function (item) {
                    scope.taskCreation(item);
                    $ionicListDelegate.closeOptionButtons();
                };

                //

            }
        }
    }
})();
