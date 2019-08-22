(function () {
    'use strict';
    projectCostByte.directive('marginoptimizersection', marginoptimizersection);

    marginoptimizersection.$inject = ['$state', '$timeout', '$ionicPopover', 'ErrorReportingServiceOne','$rootScope'];

    function  marginoptimizersection ($state, $timeout, $ionicPopover, ErrorReportingServiceOne,$rootScope) {
        return {
            restrict: 'E',
              templateUrl: 'application/margin-optimizer/directives/section/sectionDirective.html',
//            template: sectionTemplate,
            scope: {
                section: '=',
                hidemore: '=',
                itemdisplaylimit: '=',
//                userperformanceclass: '=',
//                filterperformanceclass: '=',
                sortingclass: '=',
            },
            link: function (scope, element, attribute) {
                scope.displayItems = [];
                scope.menuItemList = [];
                var itemdisplaylimits = [3,scope.section.menuItems.length];
                var expansionIcons = [ 'ion-chevron-down' , 'ion-chevron-up'];
                // scope.displayItems = scope.section;
                // console.log(scope.displayItems.menuItems)
                // console.log(ionic.Platform.platform())
                if(ionic.Platform.platform() == "android" || ionic.Platform.platform() == "ios"){
                    scope.displayItems = scope.section.menuItems;

                }else{
                    scope.displayItems = _.filter(scope.section.menuItems, function(o) {
                        return !o.baseCost;
                    });
                }
                // console.log(scope.displayItems);
                _.forEach(scope.displayItems, function(value) {
                  scope.menuItemList.push({
                    'category': value.category,
                    'menuItem': value.menuItem,
                    'menuItemName': value.menuItemName,
                    'menuType': value.menuType,
                    'sectionName': value.sectionName
                  })
                });
                // console.log(scope.menuItemList);


                scope.expansionIconClass = 'ion-chevron-down'
                scope.goToSectionScreen = function(){
                    var item = scope.section;
                    if(!scope.hidemore){
                         $state.go('app.marginoptimizersection2', {sectionName: item.sectionName
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

                scope.errorReporting = function(){
                var reportedComponent = scope.reportedComponent;
                scope.errorReportPopover.hide();
                var item = scope.item;
                ErrorReportingServiceOne.showErrorReportForm({'page':'Menu Performance', 'component': reportedComponent , 'modalName' : scope.errorReportPopover},
                                                            {'page':'Menu Performance', 'component': reportedComponent })
                                    .then(function (result) {
//                                        console.log(result)
                                     });


                }



                 $ionicPopover.fromTemplateUrl('application/error-reporting/reportPopover.html',
                 {scope: scope})
                .then(function(popover) {
                    scope.errorReportPopover = popover;
                });

                scope.showReportPopover = function($event, component){
                    $event.preventDefault();
                    $event.stopPropagation();
                    scope.errorReportPopover.show($event)
                    scope.reportedComponent = component
                }

                $rootScope.$on('search_menu_per_ing', function (event) {
                  scope.searchmenuPerText = $rootScope.data.searchmenuPerIng
                  // console.log('scope.searchmenuPerText: ',scope.searchmenuPerText)
                });
                $rootScope.$on('detect_toggle', function (event,chkToggle) {
                    console.log(chkToggle)
                    if(chkToggle){
                        scope.displayItems = _.filter(scope.section.menuItems, function(o) {
                            return !o.baseCost;
                        });

                    } else{
                        scope.displayItems = _.filter(scope.section.menuItems, function(o) {
                            return o.baseCost;
                        });
                        // console.log(scope.displayItems)
                    }
                });


            }
        }
    }
})();
