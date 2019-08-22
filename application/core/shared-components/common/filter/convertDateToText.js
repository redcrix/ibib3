(function () {
    'use strict';
    projectCostByte.filter('convertDateToText', convertDateToText);

    function convertDateToText () {
        return function(intDateEpoch) {
          return formatDate(intDateEpoch);
        };
    }


    function formatDate(date_epoch){
        var dateOptions = { year: 'numeric', day: "numeric", month: "short"};
        var lastSavedtime = new Date(parseInt(date_epoch) * 1000);
        return lastSavedtime.toLocaleString("en-US", dateOptions);
    }


})();

