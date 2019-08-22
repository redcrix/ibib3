(function () {
    'use strict';
    projectCostByte.directive('menuengineeringtab', menuengineeringtab);
    menuengineeringtab.$inject = ['$rootScope', '$state', 'Utils', '$ionicScrollDelegate', 'MenuEngineeringServiceOne',
    '$timeout', '$ionicNavBarDelegate','$ionicFilterBar'];

    function menuengineeringtab($rootScope, $state, Utils, $ionicScrollDelegate, MenuEngineeringServiceOne,
        $timeout, $ionicNavBarDelegate,$ionicFilterBar) {
        return {
            restrict: 'E',
            templateUrl: 'application/menu-engineering/directives/tab/tabView.html',
            scope: {
                menutype: '='
            },
            link: function (scope, element, attribute) {

                var initMEtab = function(){
                    $timeout(function(){
                        $ionicNavBarDelegate.title('Menu Engineering')
                        $ionicNavBarDelegate.showBar(true)
                    }, 5)

                }
                var filterBarInstance;
                var removeSearchStatus = false;
                $rootScope.showFilterBarMenuEng = function(){
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
                                  if(textToSearch.toLowerCase().includes(filterText.toLowerCase()) ){
                                      keepRecipeItem = true

                                  }
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
                var removeSearch = function() {
                  removeSearchStatus = true;
                  if (!angular.isUndefined(filterBarInstance)) {
                    filterBarInstance()
                    _.forEach(scope.sections, function(recipesGroup) {
                      _.forEach(recipesGroup.menuItems, function(recipeItem) {
                        recipeItem.searchHidden = false;

                      })
                    })


                  }

                }
                var fetchMenuData = function () {
                    // console.log('**** MENUENGGSHOWSPINNER 1 *****');
                    $rootScope.$broadcast('MENUENGGSHOWSPINNER');
                    return MenuEngineeringServiceOne.getSelectedMenuData(fetchMenuDataRH);
                }

                var fetchMenuDataRH = function (sectionsData) {
                  console.log('fetchMenuDataRH************');
                    removeSearch();
                    scope.sections = sectionsData;
                    scope.searchData= scope.sections;
                    scope.$broadcast('MENUENGGFILTERCHANGE');
                    // $rootScope.$broadcast('MENUENGGHIDESPINNER');
                }


                var fetchSortingButtons = function () {
                    MenuEngineeringServiceOne.fetchSortingButtons(fetchSortingButtonsRH);
                }

                var fetchSortingButtonsRH = function (sortingButtons) {
                    scope.sortingButtons = sortingButtons;
                    //  function to return the selected filter button sorting option
                    scope.userSortingClass = function () {
                        return _.get(_.find(scope.sortingButtons, 'clicked'), 'sortClass')
                    }
                }
                var fetchFilterButtons = function () {
                    //            console.log("filter buttons fetch")
                    MenuEngineeringServiceOne.fetchFilterButtons(fetchFilterButtonsRH);
                }

                var fetchFilterButtonsRH = function (filterButtons) {
                    scope.filterButtons = filterButtons;
                    //  function to return the selected filter button filter option
                    scope.userFilterClass = function () {
                        var filters = []
                        _.forEach(scope.filterButtons, function (button) {
                            if (_.get(button, 'clicked')) {
                                filters.push(_.get(button, 'filter_tag', 'all'))
                            }

                        })

                        return _.get(_.find(scope.filterButtons, 'clicked'), 'filter_tag', 'all')
                    }
                }


//                scope.$on('MENUENGG_TAB_CHANGE', function (event) {
//                    // fetch appropriate data
//                    $timeout(function () {
//                        if ($state.includes('app.menuengineering.' + scope.menutype)) {
//                            console.log("caught tab change in TabDirective")
//                            fetchMenuData()
//                        }
//                    })
//                });
                scope.$on('MENUENGG_MENU_CHANGE', function (event) {
                    // fetch appropriate data
//                    console.log("caught menu change in TabDirective before state check")
                    $timeout(function () {
                        if ($state.includes('app.menuengineering.' + scope.menutype)) {
//                            console.log("caught menu change in TabDirective")
                            fetchMenuData()
                        }
                    })
                });

                scope.$on('MENUENGG_GROUPING_CHANGE', function (event) {
                    // fetch appropriate data
                    scope.spinTab = false;
                    $timeout(function () {
                        if ($state.includes('app.menuengineering.' + scope.menutype)) {
//                            console.log("caught grouping change in TabDirective")
                            fetchMenuData()
                        }
                    },100)
                });
                scope.$on('MENUENGG_SORTING_CHANGE', function (event) {
                    // fetch appropriate data
                    scope.spinTab = false;
                    $timeout(function () {
                        if ($state.includes('app.menuengineering.' + scope.menutype)) {
//                            console.log("caught sorting change in TabDirective")
                            fetchMenuData()
                        }
                    },100)
                });

                scope.$on('MENUENGGFILTERCHANGE', function (event) {
                    console.log('*** track ****')
                    scope.spinTab = false;
                    // fetch appropriate data
                    //                    scope.showSection = true;
                    if ($state.includes('app.menuengineering.' + scope.menutype)) {
                        $timeout(function () {scope.spinTab = true;
                            // console.log("caught filter change in tab directive")
                            MenuEngineeringServiceOne.getActiveFilters().then(function (activeFilters) {
                                if(activeFilters == 'ALL'){
                                    $rootScope.$emit('exportbuttontext','ALL')
                                }
                                var sections = scope.sections;
                                let shownSectionsCount = 0;
                                _.forEach(sections, function(section){
                                    var sectionItemsCount = 0;
                                    _.forEach(section.menuItems, function (menu_item) {
                                        if (_.includes(activeFilters, menu_item.menuEngineeringFilterTag) ||
                                        _.includes(activeFilters, 'ALL') || menu_item.menuEngineeringFilterTag == "ALL") {
                                            sectionItemsCount = sectionItemsCount + 1;
                                            menu_item.showItem = true;
                                        } else {
                                            menu_item.showItem = false;
                                        }
                                    })
                                    if (sectionItemsCount == 0) {
                                        section.showSection = false;
                                    } else {
                                        section.showSection = true;
                                        shownSectionsCount = shownSectionsCount +1;
                                    }
                                })
                                scope.showNoDataMessage = false;
                                if (shownSectionsCount ==0){
                                    scope.showNoDataMessage = true;
                                }


                            })
                        },100)
                    }


                });


                function hideBusySpinner(hideSpinner){
                  console.log('hideBusySpinner--------------');
                  // console.log('spinnerHide: ',hideSpinner);
                    scope.spinnerHide = hideSpinner;
                    scope.spinTab = hideSpinner;
                    console.log('--------------------------------',scope.spinTab);
                }

                scope.$on('MENUENGGSHOWSPINNER', function (event) {

                    if ($state.includes('app.menuengineering.' + scope.menutype)) {
//                        console.log('menu engg show spinner')
                        $timeout(hideBusySpinner(false));
                    }
                })

                scope.$on('MENUENGGHIDESPINNER', function (event) {
                  // console.log(scope.menutype);
                    if ($state.includes('app.menuengineering.' + scope.menutype)) {
//                        console.log('menu engg hide spinner')
                        $timeout(hideBusySpinner(true));
                    }
                })

                initMEtab();
                //               fetchSortingButtons();
                fetchFilterButtons();



            }
        }
    }
})();
