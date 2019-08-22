(function () {
    'use strict';
    projectCostByte.directive('menuengineeringsection', menuengineeringsection);

    menuengineeringsection.$inject = ['$state','$rootScope', '$timeout', 'MenuEngineeringServiceOne'];

    function  menuengineeringsection ($state, $rootScope, $timeout, MenuEngineeringServiceOne) {
        return {
            restrict: 'E',
              templateUrl: 'application/menu-engineering/directives/section/sectionDirective.html',
//            template: sectionTemplate,
            scope: {
                section: '=',
                hidemore: '=',
                itemdisplaylimit: '=',
//                userperformanceclass: '=',
                filterclass: '=',
                sortingclass: '=',
            },
            link: function (scope, element, attribute) {
                var itemdisplaylimits = [3,scope.section.menuItems.length];
                var expansionIcons = [ 'ion-chevron-down' , 'ion-chevron-up'];
                scope.expansionIconClass = 'ion-chevron-down'
                scope.goToSectionScreen = function(){
                    var item = scope.section;
                    if(!scope.hidemore){
                         $state.go('app.menuengineeringsection', {sectionName: item.sectionName
                                                                , category: item.category
                                                                , menuType: item.menuType })
                    }
                }

                scope.toggleDisplayItemsLimit = function(){

                    if(!scope.hidemore){

                        var indexOfNextLevel = (itemdisplaylimits.indexOf(scope.itemdisplaylimit)+1)%itemdisplaylimits.length
                        scope.expansionIconClass = expansionIcons[indexOfNextLevel]
                        scope.itemdisplaylimit = itemdisplaylimits[indexOfNextLevel]
                    }
                }

                scope.greaterThan = function (prop, val) {
                    return function (item) {
                        return item[prop] >= val;
                    }
                }




            }
        }
    }
})();
