(function () {
    'use strict';
    projectCostByte.filter('shortPercent', shortPercent);
    shortPercent.$inject = ['$filter']
    function shortPercent ($filter) {
        return function(input) {

            return $filter('number')(input, 2) + "%"

        };
    }
})();