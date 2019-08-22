(function () {
    'use strict';
    projectCostByte.filter('dollarDiff', dollarDiff);

    function dollarDiff () {
        return function(input) {

            let displayDiff = Math.abs(input).toFixed(2)
                .toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")

            if (input >= 0) {
                return '+$' + displayDiff;
            } else {
                return '-$' + displayDiff;
            }

        };
    }
})();
