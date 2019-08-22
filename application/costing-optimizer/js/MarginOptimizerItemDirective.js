(function () {
    'use strict';
    projectCostByte.directive('marginoptimizeritem', function () {
        return {
            restrict: 'E',
            templateUrl: 'application/costing-optimizer/view/item-view.html',
            scope: {
                item: '=',
                detaillink: '=',
                userperformanceclass: '=',
                ifeven: '=',
            },
            link: function (scope, element, attribute) {}
        }
    });
    projectCostByte.directive('marginoptimizeritemlist', function () {
        return {
            restrict: 'E',
            templateUrl: 'application/costing-optimizer/view/itemlist-view.html',
            scope: {
                section: '=',
                hidemore: '=',
                itemdisplaylimit: '=',
                userperformanceclass: '=',
                filterperformanceclass: '=',
                sortingclass: '=',
            },
            link: function (scope, element, attribute) {}
        }
    });
//    projectCostByte.directive('marginoptimizertab', function () {
//        return {
//            restrict: 'E',
//            templateUrl: 'application/costing-optimizer/view/tab-view.html',
//            scope: {
//                category: '=',
//                spinnerhide: '=',
//                tabname: '=',
//                menu_name: '=',
//                menu_cost_percent: '=',
//            },
//            link: function (scope, element, attribute) {}
//        }
//    });
    projectCostByte.directive('marginoptimizersupplierlist', function () {
        return {
            restrict: 'E',
            templateUrl: 'application/costing-optimizer/view/supplierlist-view.html',
            scope: {
                suppliers: '=',
            },
            link: function (scope, element, attribute) {}
        }
    });
})();