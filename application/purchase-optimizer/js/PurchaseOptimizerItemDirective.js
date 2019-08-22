(function () {
    'use strict';
    projectCostByte.directive('purchaseitem', function() {
        return {
            restrict: 'E',
            templateUrl: 'application/purchase-optimizer/view/item-view.html',
            scope: {
                item: '=',
                detaillink: '=',
                userperformanceclass: '=',
                maxsales: '=',
                ifeven: '='
            },
            link: function(scope, element, attribute) {
                scope.orderIngredient = function() {
                    scope.item.to_order =! (scope.item.to_order);
                }
            }
        }
    });

    projectCostByte.directive('purchaseitemlist', function() {
        return {
            restrict: 'E',
            templateUrl: 'application/purchase-optimizer/view/itemlist-view.html',
            scope: {
                section: '=',
                hidemore: '=',
                itemdisplaylimit: '='
            },
            link: function(scope, element, attribute) {
            }
        }
    });

    projectCostByte.directive('supplierlist', function() {
        return {
            restrict: 'E',
            templateUrl: 'application/purchase-optimizer/view/supplierlist-view.html',
            scope: {
                suppliers: '=',
                toorder: '='
            },
            link: function(scope, element, attribute) {
                scope.make_current = function(supplier_index) {
                    for (var i = 0; i < scope.suppliers.length; i++) {
                        if (i == supplier_index) {
                            scope.suppliers[i]['current'] = true;
                        } else {
                            scope.suppliers[i]['current'] = false;
                        }
                    }

                }
            }
        }
    });
})();