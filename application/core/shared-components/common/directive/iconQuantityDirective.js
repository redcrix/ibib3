(function () {
    'use strict';

    projectCostByte.directive('iconquantity', function () {
        return {
            restrict: 'E',
            templateUrl: 'application/core/shared-components/common/directive/iconQuantityView.html',
            scope: {
                iconname: '=',
                iconsize: '=',
                quantity: '=',
                quantitytext: '=',
                showtext: '=',

            },
            link: function (scope, element, attribute) {

                scope.quantitytextDisplay= function(){
                    if(scope.showtext){
                        return scope.quantitytext;

                    }else{
                        return "&nbsp";
                    }
                }

            }
        }
    });
})();