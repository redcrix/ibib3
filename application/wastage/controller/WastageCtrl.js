(function() {
    'use strict';

    projectCostByte.controller('WastageCtrl', wastageCtrl);

    wastageCtrl.$inject = ['$scope', 'CommonService', 'WastageService','$state', '$stateParams', 'CommonConstants','$http', 'decisionStoreFactory'];

    function wastageCtrl($scope, CommonService, WastageService, $state, $stateParams, CommonConstants, $http, decisionStoreFactory) {
    $scope.navBarTitle.showToggleButton = true;

    $scope.resetData = function() {
    $scope.dataItems = [];
    $scope.wastageData = {
        dates: [],
        chartData: [],
        chartLabels: [],
        foodData: [],
        liquorData: [],
        tableLiquorData: [],
        foodWastageTitle: "Food Wastage",
        liquorWastageTitle: "Liquor Wastage",
        foodWastageSeriesLabels: chartSeriesLabels(),
        liquorWastageSeriesLabels: chartSeriesLabels(),
    };
    }

/*      $scope.initializeView = function() {

        $scope.resetData();
        $scope.fetchWastageData();
        $scope.fetchWastageTableData();

        $scope.decide = function(decisiontype, item_name) {
              this.decision = create_decision(decisiontype, item_name);
              decisionStoreFactory.set_decision(this.decision);
            }
          }
      function chartSeriesLabels() {
                return ["Last month"]
            }
    var wastageDataResponseHandler = function(dates, food) {
              $scope.wastageData.dates = CommonService.transformDatesForChartLegend(dates);
              $scope.wastageData.foodData.push(food);
              $scope.wastageData.chartData = $scope.wastageData.foodData;
              $scope.wastageData.chartLabels = $scope.wastageData.dates;
              }

      $scope.fetchWastageData = function() {
                WastageService.fetchWastageForSelectedDate(wastageDataResponseHandler);
              }

          var wastageTableResponseHandler = function(items) {
                $scope.dataItems = items;
              }

      $scope.fetchWastageTableData = function() {
          WastageService.fetchWastageForTable(wastageTableResponseHandler);
        }*/
$scope.initializeView = function() {

        $scope.decide = function(decisiontype, item_name) {
              this.decision = create_decision(decisiontype, item_name);
              decisionStoreFactory.set_decision(this.decision);
            }

      function chartSeriesLabels() {
                return ["Last month"]
            }

         var data = {
                "chartData" : [[723.70, 545.10, 618.80, 630.40, 652.60, 535.00], [723.70, 545.10, 618.80, 630.40, 652.60, 535.00]],
                "chartDates" : ["Jan 2016", "Feb 2016", "March 2016","Apr 2015", "May 2015", "Jun 2015"],
                "chartFoodItems" : [ {"detail": [{"name": "Chicken", "time": "Current", "amount": "$180", "change": "2.5"},
                    {"name": "Beef", "time": "Current", "amount": "$100", "change": "2.5"},
                    {"name": "Bread", "time": "Current", "amount": "$190", "change": "2.5"},
                    {"name": "Onion","time": "Current", "amount": "$170", "change": "2.5"}]},
                    {"detail": [{"name": "Chicken", "time": "1 month ago", "amount": "$134", "change": "4.3"},
                                {"name": "Beef", "time": "1 month ago", "amount": "$154", "change": "4.3"},
                                {"name": "Bread", "time": "1 month ago", "amount": "$114", "change": "4.3"},
                                {"name": "Onion", "time": "1 month ago", "amount": "$124", "change": "4.3"}]},
                    {"detail": [{"name": "Chicken", "time": "3 months ago", "amount": "$121", "change": "-0.3"},
                                {"name": "Beef", "time": "3 months ago", "amount": "$131", "change": "-0.3"},
                                {"name": "Bread", "time": "3 months ago", "amount": "$111", "change": "-0.3"},
                                {"name": "Onion", "time": "3 months ago", "amount": "$141", "change": "-0.3"}]},
                    {"detail": [{"name": "Chicken", "time": "Last Year", "amount": "$100", "change": "-0.3"},
                                {"name": "Beaf", "time": "Last Year", "amount": "$200", "change": "-0.3"},
                                {"name": "Bread", "time": "Last Year", "amount": "$150", "change": "-0.3"},
                                {"name": "Onion", "time": "Last Year", "amount": "$170", "change": "-0.3"}]}],
                "chartLiquorItems" : [ {"detail": [{"name": "Margarita", "time": "Current", "amount": "$100", "change": "2.0"},
                                    {"name": "Blood Mary", "time": "Current", "amount": "$50", "change": "1.5"},
                                    {"name": "Mojito", "time": "Current", "amount": "$30", "change": "-0.5"},
                                    {"name": "Pina Colado","time": "Current", "amount": "$70", "change": "-1.5"}]},
                  {"detail": [{"name": "Margarita", "time": "1 month ago", "amount": "$34", "change": "-2.5"},
                                {"name": "Blood Mary", "time": "1 month ago", "amount": "$54", "change": "1.3"},
                                {"name": "Mojito", "time": "1 month ago", "amount": "$14", "change": "3.0"},
                                {"name": "Pina Colado", "time": "1 month ago", "amount": "$24", "change": "4.0"}]},
                  {"detail": [{"name": "Margarita", "time": "3 months ago", "amount": "$21", "change": "-0.3"},
                                {"name": "Blood Mary", "time": "3 months ago", "amount": "$31", "change": "-0.8"},
                                {"name": "Mojito", "time": "3 months ago", "amount": "$11", "change": "1.7"},
                                {"name": "Pina Colado", "time": "3 months ago", "amount": "$41", "change": "2.1"}]},
                  {"detail": [{"name": "Margarita", "time": "Last Year", "amount": "$80", "change": "-2.7"},
                                {"name": "Blood Mary", "time": "Last Year", "amount": "$20", "change": "-2.3"},
                                {"name": "Mojito", "time": "Last Year", "amount": "$50", "change": "3.3"},
                                {"name": "Pina Colado", "time": "Last Year", "amount": "$70", "change": "4.3"}]}],
                "wastageFoodItems" : [{"rank": 1, "name": "Chicken", "amount": "$180", "change": "+2.5"},
                                    {"rank": 2, "name": "Beef", "amount": "$100", "change": "+2.1"},
                                    {"rank": 3, "name": "Bread", "amount": "$190", "change": "-0.6"}],
                "wastageLiquorItems" : [{"rank": 1, "name": "Crown Royal", "amount": "$10", "change": "+0.5"},
                                      {"rank": 2, "name": "Blood Mary", "amount": "$50", "change": "+2.0"},
                                      {"rank": 3, "name": "Mojito", "amount": "$30", "change": "-1.3"}],
                "tableFoodTitle" : [{"id":1, "name":"Chicken"},{"id":2, "name":"Beef"},{"id":3, "name":"Bread"}],
                "tableLiquorTitle" : [{"id":1, "name":"Margarita"},{"id":2, "name":"Blood Mary"},{"id":3, "name":"Mojito"}]
            };

            $scope.chartData = [data.chartData[1]];
            $scope.chartDates = data.chartDates;
            $scope.chartFoodItems = data.wastageFoodItems;
            $scope.chartLiquorItems = data.wastageLiquorItems;
            $scope.seriesLabels = ["Wastage in dollar amount"];
            $scope.chartTitle = "Last 6 months";
}
        $scope.$on('WASTAGE_DATECHANGE_EVENT',function(event){
              $scope.initializeView();
        });
}
})();

function create_decision(decisiontype, item_name) {
    return {
        'startdate': 0,
        'completeddate': 0,
        'expiredate': 0,
        'pending': false,
        'action': decisiontype,
        'source': 'wastage',
        'tracked_items': [{
            "Name": item_name,
            "$Impact": 0,
        }]
    }
}
