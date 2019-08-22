(function () {
    'use strict';

    projectCostByte.directive('marginoptimizermenuitem', marginoptimizermenuitem);

    marginoptimizermenuitem.$inject = ['MarginOptimizerServiceOne', 'Utils', '$ionicListDelegate', '$timeout', 'DashboardTasksService', '$ionicLoading', '$ionicPopup', '$state', '$filter', 'Logger',
        'ErrorReportingServiceOne', 'TaskCreationServiceOne', '$ionicPopover', '$rootScope','appModalService','menuPerformanceService'];

    function marginoptimizermenuitem(MarginOptimizerServiceOne, Utils, $ionicListDelegate, $timeout, DashboardTasksService, $ionicLoading, $ionicPopup, $state, $filter, Logger,
                                     ErrorReportingServiceOne, TaskCreationServiceOne, $ionicPopover, $rootScope,appModalService,menuPerformanceService) {
        return {
            restrict: 'E',
            templateUrl: 'application/margin-optimizer/directives/menuItem/menuItemDirective.html',
            // templateUrl: 'menuPerformanceMenuItem',
            //            template: menuItemTemplate,
            scope: {
                item: '=',
                detaillink: '=',
                userperformanceclass: '=',
                ifeven: '=',
                getdataoninit: '=',
                showdetails: '=',
                menuitemlist: '=',
            },
            link: function (scope, element, attribute) {
                // console.log(scope.item);
                // console.log(scope.menuitemlist);

                scope.updatedByRecipeEdit = false;


                var toastMessage = function(message_text, duration) {
                  if (typeof duration === 'undefined') duration = 1500;
                  $ionicLoading.show({
                    template: message_text,
                    noBackdrop: true,
                    duration: duration,
                  });
                };

                $rootScope.$on('updateMenuItemByRecipeEdit', function (event) {
                    if (scope.updatedByRecipeEdit) {
                        MarginOptimizerServiceOne.updateMenuItemByRecipeEdit(scope.item)
                            .then(function (saveResponse) {
                                if (_.has(saveResponse, ['saveSuccess'])) {
                                    // console.log("Menu item saved: " + saveResponse.saveSuccess)
                                }
                            })
                    }
                })

                $rootScope.$on('UPDATEMENUITEMCOST', function (event, updatedMenuItem) {
                    //                    if($state.includes('app.marginoptimizermenuitem2')){
                    if (scope.item.menuItem == updatedMenuItem.menuItem) {
                        console.log('new menu item cost received');
                        //                    console.log(updatedMenuItem)
                        scope.updatedByRecipeEdit = true
                        scope.item = updatedMenuItem;
                    }
                    //                    }
                })

                scope.$watch('item', function (newVal) {
                    if (newVal) {


                        scope.priceicon = MarginOptimizerServiceOne.getIcon("price");
                        scope.quantityicon = MarginOptimizerServiceOne.getIcon("quantity");

                        var getBasePrice = function () {
                            var item = scope.item
                            var price = item.menuItemAveragePrice
                            if (item.hasOwnProperty('basePrice')) {
                                price = item.basePrice;
                            } else if (item.hasOwnProperty('menuItemBasePrice')) {
                                price = item.menuItemBasePrice;
                            }
                            return price;
                        }

                        var basePrice = getBasePrice();

                        scope.iconedPrice = $filter('currency')(basePrice)

                        if (scope.item.hasOwnProperty('unitSales')) {
                            scope.iconedQuantity = $filter('number')(scope.item.unitSales, 0);
                        } else {
                            scope.iconedQuantity = $filter('number')(scope.item.dollarSales / basePrice, 0);
                        }

                        scope.goToItem = function (item) {
                          // console.log(scope.menuitemlist);
                          menuPerformanceService.setMenuItemsList(scope.menuitemlist);
                            //                    Logger.info("Menu Optimizer: Clicked Menu item link")
                            var item = scope.item;
                            var myElement = angular.element( document.querySelector( '#menu-list_'+item.menuItem) );
                            // console.log(item)
                           myElement.addClass('inventory-item-selected');
                            if (scope.detaillink) {
                                $timeout(function () {
                                $state.go('app.marginoptimizermenuitem2', {
                                    sectionName: item.sectionName,
                                    category: item.category,
                                    menuType: item.menuType,
                                    menuItem: item.menuItem,
                                    recipeId: item.recipeId
                                })
                            },100)
                            }
                        }

                        scope.getIcon = function (iconType) {
                            return MarginOptimizerServiceOne.getIcon(iconType);
                        }


                        var addTask = function (source_name, decision, item, affected_name) {
                            var task = create_task(source_name, decision, item, affected_name)

                            DashboardTasksService.addTask(addTaskResponseHandler, task)
                            toastMessage("Task added : " + decision + " of " + affected_name, 1200)
                        };

                        // var create_task = function(source_name, decision, item, affected_name) {
                        //     return {
                        //         'item_name': affected_name,
                        //         'decision': decision,
                        //         'source_name': source_name,
                        //         'source': JSON.stringify(item),
                        //         'source_link': `app.marginoptimizermenuitem2({sectionName:'` + item.sectionName + `',
                        //                           category:'` + item.category + `',
                        //                           menuType:'` + item.menuType + `',
                        //                           menuItem:'` + item.menuItem + `', })`
                        //     }
                        // }
                        var create_task = function (source_name, decision, item, affected_name) {
                            return {
                                'item_name': affected_name,
                                'decision': decision,
                                'source_name': source_name,
                                'source': JSON.stringify(item),
                                'source_link': "app.marginoptimizermenuitem2({sectionName:'" + item.sectionName + "', category:'" + item.category + "',menuType:'" + item.menuType + "',menuItem:'" + item.menuItem + "', })"
                            }
                        };

                        var addTaskResponseHandler = function (res) {
                            console.log(res)
                        };

                        var confirmPopup = function (decision_type, affected_name) {
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

                        var modal_shown = false;
                        //for config edit
                        scope.editConfig = function(item, focusItem) {
                            // console.log('item: ',item);
                            // console.log('focusItem: ',focusItem);
                            item.focusItem = focusItem;
                            var modalClose = showConfigModal(item)
                            $timeout($ionicListDelegate.closeOptionButtons())
                            modalClose.then(function(response) {
                            //console.log(response);
                                modal_shown = false;
                                if (response.config_saved) {
                                    scope.$emit('SUPPLIERITEMCONFIGUPDATED', response.new_config)
                                }

                            })

                        }

                        var showConfigModal = function(item) {
                            if (!modal_shown) {
                                // return appModalService.show('application/inventory-management/directives/config-modifier/inventory-config-modifier.html', 'configModifierCtrl', item)
                                // return appModalService.show('application/margin-optimizer/directives/menuItem/config-optimizer.html', 'configOptimizerCtrl', item)
                                modal_shown = appModalService.show('application/margin-optimizer/directives/menuItem/config-optimizer.html', 'configOptimizerCtrl', item)
                            }
                            return modal_shown
                        }



                        // function to add decision
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
                            if (!task_modal_shown){
                                var item = scope.item;
                                // console.log("item: ", item);
                                // console.log("items: ", items);
                                task_modal_shown = TaskCreationServiceOne.showTaskCreateForm({
                                    // 'page': 'Menu Performance',
                                    'page': 'create task',
                                    'component': item.menuItemName,
                                    'item': items,
                                    'name': items.menuItemName,
                                    'cost': items.costPercent,
                                    'price': items.basePrice,
                                    'type': 'menu',
                                    'modalName' : scope.errorReportPopover
                                }, {
                                    'page': 'Menu Performance',
                                    'component': 'Menu Item'
                                }) //TODO change component key to component_type in API

                                task_modal_shown.then(function (result) {
                                    console.log(result)
                                    task_modal_shown = false;
                                });
                            }
                        };

                        scope.errorReporting = function () {
                            scope.errorReportPopover.hide();
                            var item = scope.item;
                            // console.log("item: ",item);
                            ErrorReportingServiceOne.showErrorReportForm({
                                'page': 'Menu Performance',
                                'component': item.menuItemName,
                                'modalName' : scope.errorReportPopover
                            }, {
                                'page': 'Menu Performance',
                                'component': 'Menu Item'
                            }) //TODO change component key to component_type in API
                                .then(function (result) {
                                    //                                        console.log(result)
                                });
                        };


                        // $ionicPopover.fromTemplateUrl('application/error-reporting/reportPopover.html', {
                        $ionicPopover.fromTemplateUrl('application/error-reporting/reportPopover.html', {
                            scope: scope
                        })
                            .then(function (popover) {
                                scope.errorReportPopover = popover;
                            });

                        scope.showReportPopover = function ($event) {
                            $event.preventDefault();
                            $event.stopPropagation();
                            scope.errorReportPopover.show($event)
                        }
                        scope.current_selected = {};
                        scope.importRecipeData = function(selectedMenuItem){
                          // console.log(selectedMenuItem);
                          if(selectedMenuItem && !selectedMenuItem.hasOwnProperty('$$hashKey')){
                            // console.log(selectedMenuItem);
                            selectedMenuItem = JSON.parse(selectedMenuItem);
                            scope.set_selected = {
                              'category': selectedMenuItem.category,
                              'menuItem': selectedMenuItem.menuItem,
                              'menuType': selectedMenuItem.menuType,
                              'sectionName': selectedMenuItem.sectionName,
                            };
                            scope.$emit('IMPORT_RECIPE', scope.set_selected);
                          } else {
                            toastMessage("Please select item name.", 1200);
                          }
                        }

                    }
                }, true);
            }

        }
    };

})();
