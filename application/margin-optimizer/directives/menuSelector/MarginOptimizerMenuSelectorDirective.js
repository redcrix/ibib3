(function() {
  //    'use strict';
  var menuSelectorTemplate = `
        <ion-header-bar  class="mrginptimizer-header" style="width:100%;"
            class="bar bar-subheader app-theme-color-level2 app-theme-text-level2 has-header" has-header="true">
            <div class="row" ng-if="showMenu" on-tap="showMenus()">
<div class="col col-50 text-dark-gray" style="font-size:large;" on-hold="showReportPopover($event, 'Menu Category')">{{ selectedMenuName | titleCase}}
                    <i class="icon" ng-class="menu_click? 'ion-arrow-up-b':'ion-arrow-down-b'"></i>
                </div>
                <div ng-if="selectedMenuCostPercent*100>0" class="col text-dark-gray" on-hold="showReportPopover($event, 'Menu Category Aggregated Cost')">{{ selectedCategory }} Cost : {{ (selectedMenuCostPercent*100) | number:2}}%
                </div>
                <div ng-if="selectedMenuCostPercent*100<=0" class="col small-info text-dark-gray" on-hold="showReportPopover($event, 'Menu Category Aggregated Cost')"> Cost information unavailable
                </div>
            </div>
        </ion-header-bar>`;
  projectCostByte.directive('menuselector', menuselector);
  menuselector.$inject = ['$state', '$q', 'Utils', '$rootScope', '$ionicActionSheet', '$ionicScrollDelegate', 'MarginOptimizerServiceOne', '$filter', '$timeout', 'ErrorReportingServiceOne', '$ionicPopover', '$window'];

  function menuselector($state, $q, Utils, $rootScope, $ionicActionSheet, $ionicScrollDelegate, MarginOptimizerServiceOne, $filter, $timeout, ErrorReportingServiceOne, $ionicPopover, $window) {
    return {
      restrict: 'E',
      template: menuSelectorTemplate,
      scope: {

      },
      link: function(scope, element, attribute) {

        var foodStateName = 'app.marginoptimizer2.Food';
        var liquorStateName = 'app.marginoptimizer2.Liquor';

        scope.menutype = function() {
          return MarginOptimizerServiceOne.fetchSelectedMenuType('key');
        }

        var getMenuList = function() {
          MarginOptimizerServiceOne.fetchMenus(fetchMenusRH);
        }
        scope.showMenu = false;

        function fetchMenusRH(menusList) {
          if (menusList) {
            scope.showMenu = true;
            var selectedIndex = _.findIndex(menusList, 'selected');
            scope.selectedMenuName = menusList[selectedIndex]["categoryNameDisplay"];
            scope.selectedMenuCostPercent = menusList[selectedIndex]["costPercent"];
          }

          scope.showMenus = function() {
            scope.menu_click = true;
            var menus = menusList;
            var action_sheet_definition = {
              buttons: [], //         destructiveText: 'Delete',
              titleText: '<h4>Select Menu</h4>',
              cancelText: 'Cancel',
              cancel: function() {
                // add cancel code..
                scope.menu_click = false;
              },
              buttonClicked: function(index) {
                // change menu here
                if (selectedIndex != index) {
                  MarginOptimizerServiceOne.changeSelectedMenu(index, fetchMenusRH);
                  //                                    $rootScope.$broadcast('MOP2_MENU_CHANGE');
                  scope.menu_click = false;
                }
                hideSheet();
              }
            }
            for (var i = 0; i < menus.length; i++) {
              action_sheet_definition.buttons.push({
                'text': $filter('titleCase')(menus[i]["categoryNameDisplay"])
                //                                                    +'('+  menus[i]['date']+')'
              })
            }
            // Show the action sheet
            var hideSheet = $ionicActionSheet.show(action_sheet_definition);
            var myEl = angular.element(document.querySelector('.action-sheet-group'));
            myEl.css('overflow-y', 'scroll');
            myEl.css('max-height', ($window.innerHeight - 90) + 'px');
          }

          $timeout(function() {
            //                        console.log('broadcast menu change from menu selector')
            $rootScope.$broadcast('MOP2_MENU_CHANGE');
          })

        }

        scope.errorReporting = function() {
          var reportedComponent = scope.reportedComponent;
          scope.errorReportPopover.hide();
          var item = scope.item;
          ErrorReportingServiceOne.showErrorReportForm({
              'page': 'Menu Performance',
              'component': reportedComponent,
              'modalName': scope.errorReportPopover
            }, {
              'page': 'Menu Performance',
              'component': reportedComponent
            })
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

        scope.showReportPopover = function($event, component) {
          scope.errorReportPopover.show($event)
          scope.reportedComponent = component
        }



        // on selector init
        //                getMenuList();

        scope.$on('MOP2_TAB_CHANGE', function(event, type) {
          getMenuList();
          // scope.selectedCategory = scope.menutype() + " "
          scope.selectedCategory = type + " "

        });
        scope.selectedCategory = scope.menutype() + " "

      }
    }
  }
})();
