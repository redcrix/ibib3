(function(){
   'use strict';

   projectCostByte.factory('WastageDetailService', wastageDetailService);

   wastageDetailService.$inject = ['CommonService'];

   function wastageDetailService(CommonService) {
      var wastageDetailFactory = {
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

function fetchWastageForDetail(responseHandler, name) {
  var endDate = defaultDate();
  var startDate = CommonService.getPreviousDates(defaultDate(),'month',1);
  CommonService.fetchWastageForRangesDetail(responseHandler, startDate, endDate, name);
}

return wastageDetailFactory;
}

})();
