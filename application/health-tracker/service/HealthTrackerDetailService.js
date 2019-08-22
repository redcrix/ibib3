(function(){
   'use strict';

   projectCostByte.factory('HealthTrackerDetailService', healthTrackerDetailService);

   healthTrackerDetailService.$inject = ['CommonService'];

   function healthTrackerDetailService(CommonService) {
      var healthTrackerProfitFactory = {
         fetchHealthTrackerRangeDataForField: fetchHealthTrackerRangeDataForField
      };

      var defaultDate = function() {
         var endDate = angular.copy(CommonService.getSelectedDate());
         return CommonService.changeDateFormat(endDate);
      }

      function fetchHealthTrackerRangeDataForField(rangeDataResponseHandler, fieldName) {
            var rangeDataResponseHandlerWrapperHandler = function(dates, rangeData) {
               if (!rangeData || !rangeData[fieldName]) {
                  return;
               }

               var fieldDataValues = rangeData[fieldName];

               for (var i = 0; i < fieldDataValues.length; i++) {
                  fieldDataValues[i] = "$" + fieldDataValues[i];
               }

               for (var i = 0; i < fieldDataValues.length; i++) {
                  if (fieldDataValues[i] == '$0')
                  fieldDataValues[i] = "NA";
               }

               console.log(fieldDataValues[3]);

               var rangeDataItems = [
                  {name: "Current", amount: fieldDataValues[0]},
                  {name: "1 month ago", amount: fieldDataValues[1]},
                  {name: "3 months ago", amount: fieldDataValues[2]},
                  {name: "Last year", amount: fieldDataValues[3]}
               ];

               rangeDataResponseHandler(rangeDataItems);
            }

            var dateRanges = [
               {
                  start_date: defaultDate(),
                  end_date: defaultDate()
               },
               {
                  start_date: CommonService.getPreviousDates(defaultDate(),'month',1),
                  end_date: CommonService.getPreviousDates(defaultDate(),'month',1)
               },
               {
                  start_date: CommonService.getPreviousDates(defaultDate(),'month',3),
                  end_date: CommonService.getPreviousDates(defaultDate(),'month',3)
               },
               {
                  start_date: CommonService.getPreviousDates(defaultDate(),'year',1),
                  end_date: CommonService.getPreviousDates(defaultDate(),'year',1)
               }
            ];

            CommonService.fetchDailyStatsSumForRangesForField(rangeDataResponseHandlerWrapperHandler, dateRanges, fieldName);
      }

      return healthTrackerProfitFactory;
   }

})();
