(function(){
   'use strict';

   projectCostByte.factory('LaborOptimizerService', laborOptimizerService);

   laborOptimizerService.$inject = ['CommonService'];

   function laborOptimizerService(CommonService) {
      var laborFactory = {
          fetchLaborForSummaryTable: fetchLaborForSummaryTable,
          fetchLaborForSelectedDate: fetchLaborForSelectedDate,
          fetchLaborForRoleTable: fetchLaborForRoleTable,
          fetchLaborForEmployeeTable: fetchLaborForEmployeeTable,
          getChartData: getChartData,
          setChartData: setChartData,
          fetchSelectedLaborType: fetchSelectedLaborType,
          setSelectedLaborType: setSelectedLaborType,


      };

      var chartData = {};
      var laborSummaryData = {};
      laborSummaryData.selectedLaborTypeOptions = ['summary', 'role', 'employee'];

       function fetchSelectedLaborType() {

           if (!laborSummaryData.hasOwnProperty('selectedLaborType')) {
               setSelectedLaborType();
           }

           return laborSummaryData.selectedLaborType;

       }

       function setSelectedLaborType(laborType) {
           if (angular.isUndefined(laborType)){
               if (!laborSummaryData.hasOwnProperty('selectedLaborType')){
                   laborSummaryData.selectedLaborType = laborSummaryData.selectedLaborTypeOptions[0];
               }
           }else{
               if (_.includes(laborSummaryData.selectedLaborTypeOptions, laborType)){
                   laborSummaryData.selectedLaborType = laborType;
               }else{
                   laborSummaryData.selectedLaborType = laborSummaryData.selectedLaborTypeOptions[0];
               }
           }
       }
      
      function getChartData() {
          return chartData;
      }

      function setChartData(value) {
          chartData = value;
      }

    function fetchLaborForSummaryTable(summaryResponseHandler, timePeriod) {
        var startDate = CommonService.healthTrackerStartDate(false, timePeriod);
        var endDate = CommonService.healthTrackerEndDate(false, timePeriod);
        CommonService.fetchLaborForSummaryTable(summaryResponseHandler, startDate, endDate, timePeriod);
      }

    function fetchLaborForSelectedDate(graphResponseHandler, timePeriod,dataToGet) {
      var startDate = CommonService.healthTrackerStartDate(false, timePeriod);
      var endDate = CommonService.healthTrackerEndDate(false, timePeriod);
      CommonService.fetchLaborForRangesForField(graphResponseHandler, startDate, endDate, timePeriod,dataToGet);
    }

    function fetchLaborForRoleTable(roleResponseHandler, timePeriod) {
      var startDate = CommonService.healthTrackerStartDate(false, timePeriod);
      var endDate = CommonService.healthTrackerEndDate(false, timePeriod);
      CommonService.fetchLaborForRoleTable(roleResponseHandler, startDate, endDate, timePeriod);
    }

    function fetchLaborForEmployeeTable(EmployeeResponseHandler, timePeriod) {
      var startDate = CommonService.healthTrackerStartDate(false, timePeriod);
      var endDate = CommonService.healthTrackerEndDate(false, timePeriod);
      CommonService.fetchLaborForEmployeeTable(EmployeeResponseHandler, startDate, endDate, timePeriod);
    }

      return laborFactory;
   }

})();
