(function () {
    'use strict';
    projectCostByte.filter('makePositive', makePositive);

    function makePositive () {
        return function(num) {
           return Math.abs(num);
        }
    }
})();

