(function() {
  //    'use strict';
  var menuSelectorTemplate = `
        <ion-header-bar  style="width:100%"
            class="bar bar-subheader app-theme-color-level2 app-theme-text-level2 has-header" has-header="true">
            <div class="row" ng-if="showMenu" ng-click="showMenus()">
                <div class="col col-50" style="font-size:large;">{{ selectedMenuName | titleCase}}
                    <i class="icon" ng-class="menu_click? 'ion-arrow-up-b':'ion-arrow-down-b'"></i>
                </div>
                <div style="padding: 3px 0 0 0;" ng-if="selectedMenuCostPercent*100>0" class="col">{{ selectedCategory }} Cost : {{ (selectedMenuCostPercent*100) | number:2}}%
                </div>
                <div ng-if="selectedMenuCostPercent*100<=0" class="col small-info"> Cost information unavailable
                </div>
            </div>
        </ion-header-bar>`;
  projectCostByte.directive('menuengineeringmenuselector', menuselector);
  menuselector.$inject = ['$state', '$q', 'Utils', '$rootScope', '$ionicActionSheet', '$ionicScrollDelegate', 'MenuEngineeringServiceOne', '$filter', '$window', '$timeout'];

  function menuselector($state, $q, Utils, $rootScope, $ionicActionSheet, $ionicScrollDelegate, MenuEngineeringServiceOne, $filter, $window, $timeout) {
    return {
      restrict: 'E',
      template: menuSelectorTemplate,
      scope: {

      },
      link: function(scope, element, attribute) {

        var foodStateName = 'app.menuengineering.Food';
        var liquorStateName = 'app.menuengineering.Liquor';

        scope.menutype = function() {
          return MenuEngineeringServiceOne.fetchSelectedMenuType('key');
        }

        var getMenuList = function() {
          MenuEngineeringServiceOne.fetchMenus(fetchMenusRH);
        }
        scope.showMenu = false;
        function fetchMenusRH(menusList) {
          // console.log(menusList);
          if(menusList){
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
              buttonClicked: function(index,data) {
                // change menu here
                if(data.text == 'All')
                {
                  console.log("all called")
                  $rootScope.$emit('exportbuttontext',data)
                }
                console.log("index",index,data.text);
                $rootScope.$emit('ButtonText',data)
                if (selectedIndex != index) {
                  MenuEngineeringServiceOne.changeSelectedMenu(index, fetchMenusRH);
                  //                                    $rootScope.$broadcast('MENUENGG_MENU_CHANGE');
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
            // console.log(myEl);
            myEl.css('overflow-y', 'scroll');
            myEl.css('max-height', ($window.innerHeight - 50) + 'px');
          }


          $timeout(function() {
            //                        console.log('broadcast menu change from menu selector')
            $rootScope.$broadcast('MENUENGG_MENU_CHANGE');
          })


        }


        // on selector init
        //                getMenuList();

        scope.$on('MENUENGG_TAB_CHANGE', function(event,type) {
          // console.log('*********** MENUENGG_TAB_CHANGE *******',type);
          // if ($state.includes('app.menuengineering.' + scope.menutype())) {
          //   getMenuList();
          //   scope.selectedCategory = scope.menutype() + " "
          // }
          if ($state.includes('app.menuengineering.' + type)) {
            getMenuList();
            scope.selectedCategory = type + " "
          }

        });
        scope.selectedCategory = scope.menutype() + " "

      }
    }
  }
})();
