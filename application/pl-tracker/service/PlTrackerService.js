(function() {
    'use strict';

    projectCostByte.factory('PlTrackerService', plTrackerService);

    plTrackerService.$inject = ['CommonService', '$q'];

    function plTrackerService(CommonService, $q) {

        var fieldNames = ["profits", "food_cost", "liquor_cost", "labor_cost", "fixed_cost"];

        var plTrackerFactory = {
            fetchSelectedDateData: fetchSelectedDateData,
            fetchBenchmarkData: fetchBenchmarkData,
            fetchPandLData: fetchPandLData,
            fetchPeriodList:fetchPeriodList,
            fetchPeriodWeeksWithData: fetchPeriodWeeksWithData,
            fetchPeriodWeeks: fetchPeriodWeeks,
            fetchPnLItems: fetchPnLItems,
            fetchPnlInvItems: fetchPnlInvItems
        };

        function getStartDateStringForMonthOfDate(date) {
            var monthStartDate = angular.copy(date);
            monthStartDate.setDate(1);
            return CommonService.changeDateFormat(monthStartDate);
        }

        function getEndDateStringForMonthOfDate(date) {
            var monthEndDate = angular.copy(date);
            monthEndDate.setMonth(monthEndDate.getMonth() + 1);
            monthEndDate.setDate(0);
            return CommonService.changeDateFormat(monthEndDate);
        }

        function fetchSelectedDateData(responseHandler) {
            var selectedDate = CommonService.getSelectedDate();
            fetchDataForMonthWithDate(selectedDate, responseHandler);
        }

        function fetchPandLData(responseHandler, frequencyDetail) {
            CommonService.fetchPandLDetailsData(responseHandler, frequencyDetail);
        }

        function fetchPeriodList(responseHandler) {
            CommonService.fetchPeriodListData(responseHandler);
        }


        function fetchPeriodWeeksWithData() {
            return $q(function(resolve, reject){
                let responseHandler = function(period_weeks) {
                    resolve(period_weeks.periodList)
                };

                CommonService.pandLfetchPeriodWeeksWithData(responseHandler);
            })
        }

        function fetchPeriodWeeks() {
            return $q(function(resolve, reject){
                let responseHandler = function(period_weeks) {
                    resolve(period_weeks.periodList)
                };

                CommonService.pandLfetchPeriodWeeks(responseHandler);
            })
        }

        function getLastMonthDate(date) {
            var lastMonthDate = angular.copy(CommonService.getSelectedDate());
            lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
            return lastMonthDate;
        }

        function fetchBenchmarkData(responseHandler) {
            var benchmarkDate = getLastMonthDate();
            fetchDataForMonthWithDate(benchmarkDate, responseHandler);
        }

        function fetchDataForMonthWithDate(date, responseHandler) {
            var responseHandlerWrapper = function(dates, rangeData) {
                if (!rangeData) {
                    return;
                }

                var values = [];

                for (var i = 0; i < fieldNames.length; i++) {
                    var amount = parseFloat(rangeData[fieldNames[i]][0]);
                    var value = {name: fieldNames[i], amount: amount};
                    values.push(value);
                }

                responseHandler(values);
            }

            var dateRange = [
                {start_date: getStartDateStringForMonthOfDate(date), end_date: getEndDateStringForMonthOfDate(date)}
            ];

            CommonService.fetchDailyStatsSumForRangesForField(responseHandlerWrapper, dateRange, fieldNames.join("|"));
        }

        function fetchPnLItems (){
            return $q(function (resolve, reject) {
                CommonService.fetchPnLSupplierItemsNew(function (data) {
                    resolve(data);
                });
             });
        }
        function fetchPnlInvItems (){
            return $q(function (resolve, reject) {
                CommonService.fetchPnLInvItems(function (data) {
                    resolve(data);
                });
             });
        }
        

        return plTrackerFactory;
    }

})();
