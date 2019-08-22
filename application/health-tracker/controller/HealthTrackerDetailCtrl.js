(function() {
    'use strict';

    projectCostByte.controller('HealthTrackerDetailCtrl', healthTrackerDetailCtrl);

    healthTrackerDetailCtrl.$inject = ['$scope','HealthTrackerDetailService','CommonService','$state', '$stateParams', 'CommonConstants', '$ionicNavBarDelegate'];

    function healthTrackerDetailCtrl($scope, HealthTrackerDetailService, CommonService, $state, $stateParams, CommonConstants, $ionicNavBarDelegate) {

        $scope.showCalendar = function() {
            $scope.navBarTitle.showDateButton = false;
            $state.go('app.calendardate');
        }

        var chartTitleByType = {
            "total_sales": "Sales",
            "food_sales" : "food_sales",
            "profits": "Profits",
            "food_cost": "Food cost",
            "liquor_cost": "Liquor cost",
            "labor_cost": "Labor cost"
        }

        $scope.initializeProfitView = function() {
            $scope.healthTrackerTitle = "Details";
            $scope.navBarTitle.showToggleButton = false;

            $scope.chartData = [];
            $scope.chartDates = [];
            $scope.chartItems = [];
            $scope.seriesLabels = ["Selected date"];
            $scope.chartTitle = chartTitleByType[$stateParams.chartType];

        //$ionicNavBarDelegate.showBackButton(true);
            fetchHealthTrackerRangeData();
            fetchHealthTrackerChartData();
        }

        //Things to take care when the state is navigated to app.healthTracker
        $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
            if (fromState.name != toState.name) {
                if (toState.name == "app.healthTrackerDetail") {
                    //$scope.initializeProfitView();
                    //$scope.fetchHealthTrackerProfitRangeData();
                }
            }
        })

        //Response handler for fetchHealthTrackerProfitRangeData
        var rangeDataResponseHandler = function(rangeDataItems) {
            $scope.chartItems = rangeDataItems;
        }

        //Used to fetch health trackers profit range data
        function fetchHealthTrackerRangeData() {
            HealthTrackerDetailService.fetchHealthTrackerRangeDataForField(rangeDataResponseHandler, $stateParams.chartType);
        }

        var requestChartDataResponseHandler = function(dates, chartData) {
            $scope.chartDates = CommonService.transformDatesForChartLegend(dates);
            $scope.chartData.push(chartData);
            console.log($scope.chartData);
        }

        function fetchHealthTrackerChartData() {
            var startDate = CommonService.healthTrackerStartDate(false);
            var endDate = CommonService.healthTrackerEndDate(false);
            CommonService.fetchDailyStatsForField(requestChartDataResponseHandler, $stateParams.chartType, startDate, endDate);
        }

        $scope.$on('HT_DETAILS_DATECHANGE_EVENT',function(event){
            $scope.initializeProfitView();
        });
    }

})();
