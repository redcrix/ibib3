(function () {
    'use strict';
    projectCostByte.directive('marginoptimizertab', marginoptimizertab);
    marginoptimizertab.$inject = ['$rootScope', '$state' ,'Utils', '$ionicScrollDelegate', 'MarginOptimizerServiceOne',
    '$timeout', '$filter', '$ionicNavBarDelegate','$ionicFilterBar'];

    function marginoptimizertab($rootScope, $state, Utils, $ionicScrollDelegate, MarginOptimizerServiceOne,
        $timeout, $filter, $ionicNavBarDelegate,$ionicFilterBar) {
        return {
            restrict: 'E',
            templateUrl: 'application/margin-optimizer/directives/tab/tabView.html',
            scope: {
                menutype: '='
            },
            link: function (scope, element, attribute) {

                var initMPtab = function(){
                    scope.pageTitle = "Margin Optimizer";
                    $timeout(function(){


                        $ionicNavBarDelegate.title('Menu Performance')
                        $ionicNavBarDelegate.showBar(true)
                    }, 5)
                }

                var fetchMenuData = function () {
                    $rootScope.$broadcast('MENUOPTSHOWSPINNER');
                    // console.log(fetchMenuDataRH);
                    return MarginOptimizerServiceOne.getSelectedMenuData(fetchMenuDataRH);
                }

                var fetchMenuDataRH = function (sectionsData) {
                    // console.log('sectionsData: ',sectionsData);
                    scope.sections = sectionsData;
                    scope.searchData=scope.sections;
                    // console.log("scope.sections",scope.sections);
                    $rootScope.$broadcast('MENUOPTHIDESPINNER');
                }

                var filterBarInstance;
                var removeSearchStatus = false;
                $rootScope.showFilterBarMenuperformance = function(){
                    console.log('********** showFilterBar ********');
                  //console.log("that.item in filter : ", that.items);
                  var search_fields = ['menuItemName', 'sectionName','groupDisplayName'];

                  filterBarInstance = $ionicFilterBar.show({
                    items: scope.searchData,
                    debounce: true,
                    update: function(filteredItems, filterText) {
                      if (angular.isDefined(filterText) && filterText.length > 0) {
                        _.forEach(filteredItems, function(recipesGroup) {
                          _.forEach(recipesGroup.menuItems, function(recipeItem) {
                            var keepRecipeItem = false;
                            _.forEach(search_fields, function(search_field) {
                              var textToSearch = _.get(recipeItem, search_field, "");
                              if (textToSearch != "") {
                                if (textToSearch.toLowerCase().indexOf(filterText.toLowerCase()) != -1) {
                                      keepRecipeItem = true

                                }
                              }
                              if (keepRecipeItem) {
                                recipeItem.searchHidden = false;
                              } else {
                                recipeItem.searchHidden = true;
                              }
                            })
                          })

                        })
                        scope.sections = filteredItems
                      } else {

                        scope.sections = filteredItems;
                        if (removeSearchStatus) {
                          removeSearchStatus = false;
                          return
                        }
                        _.forEach(filteredItems, function(recipesGroup) {
                          _.forEach(recipesGroup.menuItems, function(recipeItem) {
                            recipeItem.searchHidden = false;
                          })
                        })
                      }
                    },
                    cancel: function() {
                      scope.sections = scope.searchData;
                    }
                  });
                };
                var fetchSortingButtons = function () {
                    //            console.log("sorting buttons fetch")
                    MarginOptimizerServiceOne.fetchSortingButtons(fetchSortingButtonsRH);
                }

                var fetchSortingButtonsRH = function (sortingButtons) {

                    scope.filterButtons = sortingButtons;
                    //  function to return the selected filter button sorting option
                    scope.userSortingClass = function () {
                        for (var i = 0; i < scope.filterButtons.length; i++) {
                            if (scope.filterButtons[i].clicked) {
                                return scope.filterButtons[i].sortClass
                            }
                        }
                        return scope.filterButtons[0].sortClass
                    }



                }


//                scope.$on('MOP2_TAB_CHANGE', function (event) {
//
//                    // fetch appropriate data
//                    $timeout(function(){
//                        if ($state.includes('app.marginoptimizer2.'+scope.menutype)) {
//    //                        console.log("caught menu change in TabDirective")
//                            fetchMenuData()
//                        }
//                    })
//                });

                scope.$on('MOP2_MENU_CHANGE', function (event) {
//                    console.log("caught menu change in TabDirective before state check")
                    // fetch appropriate data
                    $timeout(function(){
                        if ($state.includes('app.marginoptimizer2.'+scope.menutype)) {
//                            console.log("caught menu change in TabDirective")
                            fetchMenuData()
                        }
                    })
                });

                scope.$on('MENUOPT_GROUPING_CHANGE', function (event) {
                    // fetch appropriate data
                    $timeout(function () {
                        if ($state.includes('app.marginoptimizer2.' + scope.menutype)) {
//                            console.log("caught grouping change in TabDirective")
                            fetchMenuData()
                        }
                    })
                });

                function hideBusySpinner(hideSpinner){
                    scope.spinnerHide = hideSpinner;
                }

                scope.$on('MENUOPTSHOWSPINNER', function (event) {

                    if ($state.includes('app.marginoptimizer2.' + scope.menutype)) {
                        $timeout(hideBusySpinner(false));
                    }
                })

                scope.$on('MENUOPTHIDESPINNER', function (event) {
                    if ($state.includes('app.marginoptimizer2.' + scope.menutype)) {
                        $timeout(hideBusySpinner(true));
                    }
                })

                initMPtab();
                fetchSortingButtons();



            }
        }
    }
})();
