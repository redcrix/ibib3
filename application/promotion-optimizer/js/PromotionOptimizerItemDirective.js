(function () {
    'use strict';
    projectCostByte.directive('promotionitem', function () {
        return {
            restrict: 'E'
            , templateUrl: 'application/promotion-optimizer/view/PromotionItemView.html'
            , scope: {
                promotion: '='
                , detaillink: '='
                , maxsales: '='
                , ifeven: '='

             }
            , link: function (scope, element, attribute) {
//                console.log(scope.ifeven)
            }

        }
    });
    projectCostByte.directive('candidateitem', function () {
        return {
            restrict: 'E'
            , templateUrl: 'application/promotion-optimizer/view/CandidateItemView.html'
            , scope: {
                candidate: '='
                , detaillink: '='
                , ifeven: '='

             }
            , link: function (scope, element, attribute) {
//                                console.log('single ' + scope.maxsales)
            }

        }
    });
    projectCostByte.directive('promotionitemlist', function () {
        return {
            restrict: 'E'
            , templateUrl: 'application/promotion-optimizer/view/PromotionListView.html'
            , scope: {
                items: '='
                , hidemore: '='
                , itemdisplaylimit: '='
                , maxsales: '='
                , cardheader: '@'
             }
            , link: function (scope, element, attribute) {
//                                console.log('list ' + scope.maxsales)
            }
        }
    });
    projectCostByte.directive('candidateitemlist', function () {
        return {
            restrict: 'E'
            , templateUrl: 'application/promotion-optimizer/view/CandidateListView.html'
            , scope: {
                items: '='
                , hidemore: '='
                , itemdisplaylimit: '='
                , cardheader: '@'
            , }
            , link: function (scope, element, attribute) {
//                                console.log(scope.userPerformanceClass)
            }
        }
    });
})();