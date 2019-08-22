(function () {
    'use strict';

    projectCostByte.factory('PAndLChartsService', pAndLChartsService);

    pAndLChartsService.$inject = ['$q', 'CommonService'];

    function pAndLChartsService($q, CommonService) {
        var pAndLChartsFactory = {
            setSelectedDate : setSelectedDate,
            getSelectedDate : getSelectedDate,
            getChartData: getChartData,
            fetchSelectedPAndLType: fetchSelectedPAndLType,
            setSelectedPAndLType: setSelectedPAndLType,
            getChartDefinitions: getChartDefinitions,
            getDateRangeOptions: getDateRangeOptions,
        };

        var PAndLChartsData = {};

        PAndLChartsData.selectedPAndLTypeOptions = ['sales', 'cost', 'cogs', 'primecost', 'profitafterprime'];


        PAndLChartsData.selectedDate = new Date()

        function setSelectedDate(value) {
            //console.log(value);
            PAndLChartsData.selectedDate = value;
        }

        function getSelectedDate() {
            //console.log(selectedDate);
            return PAndLChartsData.selectedDate;
        }


        function fetchSelectedPAndLType() {

            if (!PAndLChartsData.hasOwnProperty('selectedPAndLType')) {
                setSelectedPAndLType();
            }

            return PAndLChartsData.selectedPAndLType;

        }

        function setSelectedPAndLType(pAndLType) {
            if (angular.isUndefined(pAndLType)) {
                if (!PAndLChartsData.hasOwnProperty('selectedPAndLType')) {
                    PAndLChartsData.selectedPAndLType = PAndLChartsData.selectedPAndLTypeOptions[0];
                }
            } else {
                if (_.includes(PAndLChartsData.selectedPAndLTypeOptions, pAndLType)) {
                    PAndLChartsData.selectedPAndLType = pAndLType;
                } else {
                    PAndLChartsData.selectedPAndLType = PAndLChartsData.selectedPAndLTypeOptions[0];
                }
            }
        }

        function getChartData(timePeriod, pAndLType,chartType) {
            return $q(function(resolve, reject) {

                // let chartData = {
                //     'values': [155, 521, 415, 635],
                //     'dates': [
                //         "06/11/2017",
                //         "06/12/2017",
                //         "06/13/2017",
                //         "06/14/2017"]
                // };

                let rhWrapper = function(chartData){
                    resolve(chartData)
                }


                let chartDataRequest = {endDate : getSelectedDate().getTime(),
                    statCategoryName:pAndLType,
                    statName: chartType,
                    dateRange: timePeriod
                }

                CommonService.pAndLChartsGetChartData(rhWrapper, chartDataRequest)


            })
        }


        function getChartDefinitions(pAndLType){
            return $q(function(resolve, reject) {

                let rhWrapper = function(definitions){
                    resolve(definitions)
                };

                CommonService.pAndLChartsGetChartDefinitions(rhWrapper, pAndLType)

            })
        }

        function getDateRangeOptions(pAndLType){
            return $q(function(resolve, reject) {

                let rhWrapper = function(options){
                    resolve(options)
                };

                CommonService.pAndLChartsGetDateRangeOptions(rhWrapper, pAndLType)

            })
        }

        return pAndLChartsFactory;
    }

})();
