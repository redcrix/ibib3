(function(){
   'use strict';

   projectCostByte.factory('WastageService', wastageService);

   wastageService.$inject = ['CommonService'];

   function wastageService(CommonService) {
      var wastageFactory = {
          fetchWastageForTable: fetchWastageForTable,
          fetchWastageForSelectedDate: fetchWastageForSelectedDate,
          fetchWastageForDetail: fetchWastageForDetail,
          getChartData: getChartData,
          setChartData: setChartData
      };

      var chartData = {};

      function getChartData() {
          return chartData;
      }

      function setChartData(value) {
          chartData = value;
      }

      var defaultDate = function() {
         var endDate = angular.copy(CommonService.getSelectedDate());
         return CommonService.changeDateFormat(endDate);
      }

    function fetchWastageForTable(responseHandler) {
        var startDate = defaultDate();
        var endDate = CommonService.getPreviousDates(defaultDate(),'month',1);
        CommonService.fetchWastageForRangesForTable(responseHandler, startDate, endDate);
      }

    function fetchWastageForSelectedDate(responseHandler) {
      var endDate = defaultDate();
      var startDate = CommonService.getPreviousDates(defaultDate(),'month',1);
      CommonService.fetchWastageForRangesForField(responseHandler, startDate, endDate);
    }

    function fetchWastageForDetail(responseHandler, fieldName) {
      var endDate = defaultDate();
      var startDate = CommonService.getPreviousDates(defaultDate(),'month',1);
      CommonService.fetchWastageForRangesDetail(responseHandler, startDate, endDate, fieldName);
    }

      return wastageFactory;
   }

})();
