(function(){
   'use strict';

   projectCostByte.factory('FixedCostService', fixedCostService);

   fixedCostService.$inject = ['CommonService'];

   function fixedCostService(CommonService) {
      var fixedCostListFactory = {
          fetchFixedCostList: fetchFixedCostList,
          fetchFixedCostDetailService: fetchFixedCostDetailService,
          fetchFixedCostValue: fetchFixedCostValue,
          pushFixedCostValueService: pushFixedCostValueService
           };

    var defaultDate = function() {
       var endDate = angular.copy(CommonService.getSelectedDate());
       return CommonService.changeDateFormat(endDate);
    }

    function fetchFixedCostList(responseHandler) {
        var num_item = 25;
      CommonService.fetchFixedCostList(responseHandler, num_item);
      }

      function fetchFixedCostValue(responseHandler) {
          var startDate = defaultDate();
          var endDate = CommonService.getPreviousDates(defaultDate(),'month',1);
          var num_item = 25;
        CommonService.fetchFixedCostValue(responseHandler, startDate, endDate, num_item);
        }

      function fetchFixedCostDetailService(responseHandler, item_id) {
          var startDate = defaultDate();
          var endDate = CommonService.getPreviousDates(defaultDate(),'month',12);
          var id = item_id;
          CommonService.fetchFixedCostDetail(responseHandler, startDate, endDate, id);
        }

    function pushFixedCostValueService(result, item_id, date) {
              var id = item_id;
            CommonService.pushFixedCostValueService(result, id, date);
          }

    return fixedCostListFactory;
   }

})();
