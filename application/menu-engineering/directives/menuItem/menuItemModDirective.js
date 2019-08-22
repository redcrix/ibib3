(function () {
    'use strict';

    projectCostByte.directive('detailedmenuitemsales', detailedmenuitemsales);
    detailedmenuitemsales.$inject = ['$ionicScrollDelegate', 'MenuEngineeringServiceOne'];

    function detailedmenuitemsales($ionicScrollDelegate, MenuEngineeringServiceOne) {
        return {
            restrict: 'E',
            templateUrl: 'application/menu-engineering/directives/menuItem/menuItemModDirective.html',
            scope: {
                item: '=',
                getdataoninit: '=',
                ifeven: '=',
            },
            link: function (scope, element, attribute) {


                if (!(angular.isUndefined(scope.getdataoninit))) {
                    if (scope.getdataoninit) {
                        if (!(angular.isUndefined(scope.item))) {
                            fetchDetailedModsData(scope.item.menuItem);
                        }
                    }
                }

                scope.toggleGroup = function (group) {
                    if (!angular.isUndefined(group)) {
                        group.show = !group.show;
                        $ionicScrollDelegate.resize();
                    }
                };

                scope.isGroupShown = function (group) {
                    if (angular.isUndefined(group)) {
                        return false;
                    } else {
                        return group.show;
                    }
                };

                scope.getModdata = function () {
                    if (angular.isUndefined(scope.moddatagroup)) {
                        fetchDetailedModsData(scope.item.menuItem)
                    } else {
                        scope.toggleGroup(scope.moddatagroup);
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

                function fetchDetailedModsData(menuitem_id) {

                    scope.$broadcast('MOP_BUSY');
                    //http request for fetching detailed mods data
                    MenuEngineeringServiceOne.fetchDetailedModsData(fetchDetailedModsDataResponseHandler, menuitem_id);
                }
                //Response handler for fetching Menu Item price and cost Data
                function fetchDetailedModsDataResponseHandler(menuitem_mods_data) {

                    if (menuitem_mods_data.length > 0) {
//                        console.log(menuitem_mods_data)
                        var modDataTotal = {
                            'name': 'Total',
                        };
                        for(var i=0; i<menuitem_mods_data.length; i++){
                            menuitem_mods_data[i]['globalModQuantity'] = parseInt(menuitem_mods_data[i]['globalModQuantity']);
                        }

                        var fieldNames = ['globalModPrice', 'globalModCost', 'globalModCostContribution', 'globalModPriceContribution', 'globalModQuantity']
                        angular.forEach(fieldNames, function (fieldName) {
                            modDataTotal[fieldName] = sumOf(menuitem_mods_data, fieldName);
                        });

                        scope.moddatagroup = {
                            'show': true,
                            'modsAvailable': true,
                            'modData': menuitem_mods_data,
                            'modDataTotal': modDataTotal
                        };
                        $ionicScrollDelegate.resize();
                        scope.$broadcast('MOP_FREE');
                    }else{
                        scope.moddatagroup = {
                            'show': true,
                            'modsAvailable': false,
                            'modData': menuitem_mods_data,
                            'modDataTotal': null
                        };
                    }
                }

            }
        }
    };

})();
