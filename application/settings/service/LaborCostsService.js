(function(){
   'use strict';

   projectCostByte.factory('LaborCostsService', laborCostsService);

   laborCostsService.$inject = ['CommonService'];

   function laborCostsService(CommonService) {
      var laborCostListFactory = {
          fetchLaborCostList: fetchLaborCostList,
          fetchLaborCostDetailService: fetchLaborCostDetailService,
          fetchLaborCostValue: fetchLaborCostValue,
          pushLaborCostValue: pushLaborCostValue
           };

    var defaultDate = function() {
       var endDate = angular.copy(CommonService.getSelectedDate());
       return CommonService.changeDateFormat(endDate);
    }

    function fetchLaborCostList(responseHandler) {
      var startDate = defaultDate();
      var endDate = CommonService.getPreviousDates(defaultDate(),'month',1);
      //var num_item = 25;
      CommonService.fetchLaborCostList(responseHandler, startDate, endDate);
      }

      function fetchLaborCostValue(responseHandler) {
          var startDate = defaultDate();
          var endDate = CommonService.getPreviousDates(defaultDate(),'month',1);
          var num_item = 25;
        CommonService.fetchLaborCostValue(responseHandler, startDate, endDate);
        }

      function fetchLaborCostDetailService(responseHandler, item_id) {
          var startDate = defaultDate();
          var endDate = CommonService.getPreviousDates(defaultDate(),'month',12);
          var id = item_id;
          CommonService.fetchLaborCostDetail(responseHandler, startDate, endDate, id);
        }

    function pushLaborCostValue(result, item_id, date) {
              var id = item_id;
            CommonService.pushLaborCostValue(result, id, date);
          }

    return laborCostListFactory;
   }

})();
