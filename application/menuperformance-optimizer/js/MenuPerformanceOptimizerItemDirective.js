(function () {
    'use strict';
    projectCostByte.directive('menuperformanceitem', function () {
        return {
            restrict: 'E'
            , templateUrl: 'application/menuperformance-optimizer/view/item-view.html'
            , scope: {
                item: '='
                , detaillink: '='
                , userperformanceclass: '='
                , maxsales: '='
                , ifeven: '='
            , }
            , link: function (scope, element, attribute) {

            }
        }
    });
    projectCostByte.directive('menuperformanceitemlist', function () {
        return {
            restrict: 'E'
            , templateUrl: 'application/menuperformance-optimizer/view/itemlist-view.html'
            , scope: {
                section: '='
                , hidemore: '='
                , itemdisplaylimit: '='
                , userperformanceclass: '='
                , filterperformanceclass: '='
            , }
            , link: function (scope, element, attribute) {
//                                console.log(scope.userPerformanceClass)
            }
        }
    });
})();