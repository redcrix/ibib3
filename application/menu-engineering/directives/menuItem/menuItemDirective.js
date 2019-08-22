(function() {
  'use strict';

  projectCostByte.directive('menuengineeringmenuitem', menuengineeringmenuitem);

  menuengineeringmenuitem.$inject = ['MenuEngineeringServiceOne', 'Utils', '$ionicListDelegate', '$timeout', 'DashboardTasksService', 'TaskCreationServiceOne', '$ionicLoading', '$ionicPopup', '$state', '$filter', 'Logger', '$rootScope', '$ionicPopover', 'ErrorReportingServiceOne', 'appModalService'];

  function menuengineeringmenuitem(MenuEngineeringServiceOne, Utils, $ionicListDelegate, $timeout, DashboardTasksService, TaskCreationServiceOne, $ionicLoading, $ionicPopup, $state, $filter, Logger, $rootScope, $ionicPopover, ErrorReportingServiceOne, appModalService) {

    return {
      restrict: 'E',
      templateUrl: 'application/menu-engineering/directives/menuItem/menuItemDirective.html',
      //            template: menuItemTemplate,
      scope: {
        item: '=',
        detaillink: '=',
        userperformanceclass: '=',
        ifeven: '=',
        getdataoninit: '=',
        showdetails: '=',
      },
      link: function(scope, element, attribute) {

        scope.priceicon = MenuEngineeringServiceOne.getIcon("price");
        scope.quantityicon = MenuEngineeringServiceOne.getIcon("quantity");
        scope.iconedPrice = $filter('currency')(getBasePrice())

        if (scope.item.hasOwnProperty('unitSales')) {
          scope.iconedQuantity = $filter('number')(scope.item.unitSales, 0);
        } else {
          scope.iconedQuantity = $filter('number')(scope.item.dollarSales / getBasePrice(), 0);
        }

        scope.showCoversion = function(item) {
          console.log("showing conversion");
          modal_shown = appModalService.show('application/menu-engineering/directives/menuItem/conversionFactor.html', 'conversionFactorCtrl', item)

          return modal_shown

        }


        scope.goToItem = function(item) {
          //                    Logger.info("Menu Optimizer: Clicked Menu item link")
          var item = scope.item;
          var myElement = angular.element(document.querySelector('#menu-list_' + item.menuItem));
          // console.log(myElement)
          myElement.addClass('inventory-item-selected');
          if (scope.detaillink) {
            $timeout(function() {
              // console.log(item);
              $state.go(
                // 'app.menuengineeringmenuitem',
                'app.marginoptimizermenuitem2', {
                  sectionName: item.sectionName,
                  category: item.category,
                  menuType: item.menuType,
                  menuItem: item.menuItem,
                  recipeId: item.recipeId
                })
            }, 100)

          }
        }

        scope.getIcon = function(iconType) {
          return MenuEngineeringServiceOne.getIcon(iconType);
        }

        function getBasePrice() {
          var item = scope.item
          var price = item.menuItemAveragePrice
          if (item.hasOwnProperty('basePrice')) {
            price = item.basePrice;
          } else if (item.hasOwnProperty('menuItemBasePrice')) {
            price = item.menuItemBasePrice;
          }
          return price;
        }

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
                                          category:'` + item.category + `',
                                          menuType:'` + item.menuType + `',
                                          menuItem:'` + item.menuItem + `', })`
          }
        }

        var addTaskResponseHandler = function(res) {
          //            console.log(res)
        }

        function confirmPopup(decision_type, affected_name) {

          return $ionicPopup.confirm({
            scope: scope,
            title: 'Add Task',
            template: '<div>Are you sure you want to ' + decision_type + ' of ' + affected_name + '?</div>' +
              '<div class="row checkbox"><div class="col col-20"><input type="checkbox" ng-model="popupnoshow.pref"></div><div class="col" style="padding-top: 10px">Do not ask me again</div></div>'
          });
        }

        var toastMessage = function(message_text, duration) {
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
            // return appModalService.show('application/menu-engineering/directives/menuItem/config-optimizer.html', 'configOptimizerMenuEnggCtrl', item)
            modal_shown = appModalService.show('application/menu-engineering/directives/menuItem/config-optimizer.html', 'configOptimizerMenuEnggCtrl', item)
          }
          return modal_shown

        }


        // function to add decision
        // scope.decide = function (decision_source, decision, item) {
        //     var affected_name = item.menuItemName;
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
        // function to add decision
        scope.decide = function(item) {
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
        scope.taskCreation = function(task_items) {
          if (!task_modal_shown) {
            var item = scope.item;
            // console.log("item: ", item);
            console.log("task_items: ", task_items);
            task_modal_shown = TaskCreationServiceOne.showTaskCreateForm({
              // 'page': 'Menu Engineering',
              'page': 'create task',
              'component': item.menuItemName,
              'item': task_items,
              'name': task_items.menuItemName,
              'cost': task_items.costPercent,
              'price': task_items.basePrice,
              'type': 'menu',
              'modalName': scope.errorReportPopover
            }, {
              'page': 'Menu Engineering',
              'component': 'Menu Item'
            }); //TODO change component key to component_type in API
            task_modal_shown.then(function(result) {
              // console.log(result)
              task_modal_shown = false;
            });
          }
        };

        scope.errorReporting = function() {
          scope.errorReportPopover.hide();
          var item = scope.myClick;
          // console.log(item);
          ErrorReportingServiceOne.showErrorReportForm({
              'page': 'menuengineering',
              'component': item,
              'modalName': scope.errorReportPopover
            }, {
              'page': 'menuengineering',
              'component': 'menu item'
            }) //TODO change component key to component_type in API
            .then(function(result) {
              //                                        console.log(result)
            });


        }

        $ionicPopover.fromTemplateUrl('application/error-reporting/reportPopover.html', {
            scope: scope
          })
          .then(function(popover) {
            scope.errorReportPopover = popover;
          });

        scope.showReportPopover = function($event, name) {
          $event.preventDefault();
          $event.stopPropagation();
          scope.myClick = name;
          scope.errorReportPopover.show($event)
        }
        //
        //                $rootScope.$on('MENUENGGFILTERCHANGE', function (event) {
        //                    // fetch appropriate data
        //                    $timeout(function(){
        //
        ////                    console.log("caught filter change in item directive")
        //                    console.log(scope.item.menuItemName + ":" + scope.item.showItem)
        ////                    MenuEngineeringServiceOne.getActiveFilters().then(function (activeFilters){
        ////                        console.log(activeFilters)
        ////                        if (_.includes(activeFilters, scope.item.menuEngineeringFilterTag)){
        ////                            console.log(scope.item.menuEngineeringFilterTag)
        ////                            scope.showItem = true;
        ////                        }else{
        ////                            scope.showItem = false;
        ////                        }
        ////
        ////
        ////
        ////
        //                    }, 10)
        ////                    })
        //
        //
        //                });

      }
    }
  };
})();
