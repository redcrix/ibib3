(function() {
    'use strict'
    projectCostByte.controller('WastageDetailCtrl', wastageDetailCtrl);

    wastageDetailCtrl.$inject = ['$scope', 'CommonService', 'WastageDetailService', '$state', '$stateParams','CommonConstants','$http'];

    function wastageDetailCtrl($scope, CommonService, WastageDetailService, $state, $stateParams, CommonConstants, $http) {

      $scope.resetData = function() {
          $scope.wastageDetailData = {
              dates: [],
              foodData: [],
              chartData: [],
              chartDates: [],
              foodWastageTitle: "Wastage Detail",
              foodWastageSeriesLabels: chartSeriesLabels()
            };
          }
        function chartSeriesLabels() {
                    return ["Last six months"]
                }

        $scope.initializeView = function() {
            $scope.navBarTitle.showToggleButton = true;
            $scope.item = $stateParams.id;
        //  $scope.number = $stateParams.id;
            //console.log($state);
            //console.log($scope.item);
            $scope.navBarTitle.showToggleButton = false;
            $scope.resetData();
            $scope.fetchWastageDetailData();



        /*    var data = {
                "chartData" : [[723.70, 545.10, 618.80, 630.40, 652.60, 535.00], [723.70, 545.10, 618.80, 630.40, 652.60, 535.00]],
                "chartDates" : ["Jan 2016", "Feb 2016", "March 2016","Apr 2015", "May 2015", "Jun 2015"],
                "chartFoodItems" : [ {"detail": [{"name": "Chicken", "time": "Current", "amount": "$180", "change": "+2.5%"},
                    {"name": "Beef", "time": "Current", "amount": "$100", "change": "+2.5%"},
                    {"name": "Bread", "time": "Current", "amount": "$190", "change": "+2.5%"},
                    {"name": "Onion","time": "Current", "amount": "$170", "change": "+2.5%"}]},
                    {"detail": [{"name": "Chicken", "time": "1 month ago", "amount": "$134", "change": "+4.3%"},
                                {"name": "Beef", "time": "1 month ago", "amount": "$154", "change": "+4.3%"},
                                {"name": "Bread", "time": "1 month ago", "amount": "$114", "change": "+4.3%"},
                                {"name": "Onion", "time": "1 month ago", "amount": "$124", "change": "+4.3%"}]},
                    {"detail": [{"name": "Chicken", "time": "3 months ago", "amount": "$121", "change": "-0.3%"},
                                {"name": "Beef", "time": "3 months ago", "amount": "$131", "change": "-0.3%"},
                                {"name": "Bread", "time": "3 months ago", "amount": "$111", "change": "-0.3%"},
                                {"name": "Onion", "time": "3 months ago", "amount": "$141", "change": "-0.3%"}]},
                    {"detail": [{"name": "Chicken", "time": "Last Year", "amount": "$100", "change": "-0.3%"},
                                {"name": "Beaf", "time": "Last Year", "amount": "$200", "change": "-0.3%"},
                                {"name": "Bread", "time": "Last Year", "amount": "$150", "change": "-0.3%"},
                                {"name": "Onion", "time": "Last Year", "amount": "$170", "change": "-0.3%"}]}],
                "chartLiquorItems" : [ {"detail": [{"name": "Margarita", "time": "Current", "amount": "$100", "change": "+2.0%"},
                                    {"name": "Blood Mary", "time": "Current", "amount": "$50", "change": "+1.5%"},
                                    {"name": "Mojito", "time": "Current", "amount": "$30", "change": "-0.5%"},
                                    {"name": "Pina Colado","time": "Current", "amount": "$70", "change": "-1.5%"}]},
                  {"detail": [{"name": "Margarita", "time": "1 month ago", "amount": "$34", "change": "-2.5%"},
                                {"name": "Blood Mary", "time": "1 month ago", "amount": "$54", "change": "+1.3%"},
                                {"name": "Mojito", "time": "1 month ago", "amount": "$14", "change": "+3.0%"},
                                {"name": "Pina Colado", "time": "1 month ago", "amount": "$24", "change": "+4.0%"}]},
                  {"detail": [{"name": "Margarita", "time": "3 months ago", "amount": "$21", "change": "-0.3%"},
                                {"name": "Blood Mary", "time": "3 months ago", "amount": "$31", "change": "-0.8%"},
                                {"name": "Mojito", "time": "3 months ago", "amount": "$11", "change": "1.7%"},
                                {"name": "Pina Colado", "time": "3 months ago", "amount": "$41", "change": "2.1%"}]},
                  {"detail": [{"name": "Margarita", "time": "Last Year", "amount": "$80", "change": "-2.7%"},
                                {"name": "Blood Mary", "time": "Last Year", "amount": "$20", "change": "-2.3%"},
                                {"name": "Mojito", "time": "Last Year", "amount": "$50", "change": "3.3%"},
                                {"name": "Pina Colado", "time": "Last Year", "amount": "$70", "change": "4.3%"}]}],
                "wastageFoodItems" : [{"rank": 1, "name": "Chicken", "amount": "$180", "change": "+2.5"},
                                    {"rank": 2, "name": "Beef", "amount": "$100", "change": "+2.1"},
                                    {"rank": 3, "name": "Bread", "amount": "$190", "change": "-0.6"}],
                "wastageLiquorItems" : [{"rank": 1, "name": "Crown Royal", "amount": "$10", "change": "+0.5"},
                                      {"rank": 2, "name": "Blood Mary", "amount": "$50", "change": "+2.0"},
                                      {"rank": 3, "name": "Mojito", "amount": "$30", "change": "-1.3"}],
                "tableFoodTitle" : [{"id":1, "name":"Chicken"},{"id":2, "name":"Beef"},{"id":3, "name":"Bread"}],
                "tableLiquorTitle" : [{"id":1, "name":"Margarita"},{"id":2, "name":"Blood Mary"},{"id":3, "name":"Mojito"}]
            };

            $scope.chartData = [data.chartData[0]];
            $scope.chartDates = data.chartDates;
            $scope.chartItems = data.chartFoodItems;
            $scope.tableFoodTitle = data.tableFoodTitle;
            $scope.tableLiquorTitle = data.tableLiquorTitle;

            $scope.seriesLabels = ["Wastage in dollar amount"];
            $scope.chartTitle = "Trend Last 6 months"; */
}
      var wastageDetailDataResponseHandler = function(dates, food) {
                $scope.wastageDetailData.dates = CommonService.transformDatesForChartLegend(dates);
                $scope.wastageDetailData.foodData.push(food);
                $scope.wastageDetailData.chartData = $scope.wastageDetailData.foodData;
                $scope.wastageDetailData.chartDates = $scope.wastageDetailData.dates;
                console.log($scope.wastageDetailData.foodData);
            }

      $scope.fetchWastageDetailData = function() {
              WastageDetailService.fetchWastageForDetail(wastageDetailDataResponseHandler, $scope.item);
        }

        $scope.$on('WASTAGEDETAIL_DATECHANGE_EVENT',function(event){
            $scope.initializeView();
        });

    }

})();
