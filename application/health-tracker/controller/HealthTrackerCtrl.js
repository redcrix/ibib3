(function() {
    projectCostByte.controller('HealthTrackerCtrl', healthTrackerCtrl);

    healthTrackerCtrl.$inject = ['$q','$scope', 'HealthTrackerService', '$state', 'CommonConstants', 'CommonService', 'ionicDatePicker', '$ionicActionSheet', '$ionicHistory', '$timeout'];

    function healthTrackerCtrl($q,$scope, HealthTrackerService, $state, CommonConstants, CommonService, ionicDatePicker, $ionicActionSheet, $ionicHistory,   $timeout) {
      $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
          viewData.enableBack = true;
                });

      var toTitleCase = function (str)
          {
            return str.replace(/\w\S*/g, function(txt)
            {
              return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            });
          }

        $scope.resetData = function() {
            $scope.healthTrackerData = {
                dates: [],
                salesData: [[],[]],
                foodSalesData: [[],[]],
                profitData: [[],[]],
                foodCost: [[],[]],
                liquorCost: [[],[]],
                labourCost: [[],[]],
                profitsTitle: "Profits",
                salesTitle: "Sales",
                foodSalesTitle: "Food Sales",
                foodCostTitle: "Food cost",
                liquorCostTitle: "Liquor cost",
                laborCostTitle: "Labor cost",
                salesSeriesLabels: chartSeriesLabels(),
                foodSalesSeriesLabels: chartSeriesLabels(),
                profitSeriesLabels: chartSeriesLabels(),
                foodCostSeriesLabels: chartSeriesLabels(),
                liquorCostSeriesLabels: chartSeriesLabels(),
                laborCostSeriesLabels: chartSeriesLabels(),
            };
        }


        // $scope.salesGraph = true;
        // $scope.foodGraph = false;
        // $scope.costGraph = false;


        $scope.salesClickHandler = function() {
            //            $ionicSideMenuDelegate.toggleLeft();
            // $scope.salesGraph = true;
            // $scope.foodGraph = false;
            // $scope.costGraph = false;
            $state.go('app.health-tracker-tab.healthTracker');
        };
        $scope.labourClickHandler = function() {
            //            $ionicSideMenuDelegate.toggleLeft();
            // $scope.salesGraph = false;
            // $scope.foodGraph = true;
            // $scope.costGraph = false;
            $state.go('app.health-tracker-tab.healthTracker-labour');
        };

        $scope.cogsClickHandler = function() {
            //            $ionicSideMenuDelegate.toggleLeft();
            // $scope.salesGraph = false;
            // $scope.foodGraph = false;
            // $scope.costGraph = true;
            $state.go('app.health-tracker-tab.healthTracker-cogs');
        };


        $scope.myGoBack = function() {
//                            console.log("c b b");
            $timeout(function(){$ionicHistory.goBack();},5)
//                            $window.history.back();
        };



        //On click of individual chart.
        /*$scope.chartClickHandler = function(chartType) {
            //If the clicked chart is profit
            HealthTrackerService.setChartData($scope.healthTrackerData);
            $state.go('app.healthTrackerDetail', {chartType: chartType});
        }*/


        //On health tracker init handler
        $scope.onHealthTrackerInitHandler = function() {
          $scope.timePeriod = 'DAILY';
          $scope.PeriodDisplay = toTitleCase('DAILY');
            $scope.$broadcast('HT_BUSY');
            $scope.navBarTitle.showToggleButton = true;
            $scope.resetData();
            //$scope.fetchLatestWeekDate();
            $scope.daily();
            var frequencyText = "Latest Date";
            $scope.textDisplay= function(){
                  return frequencyText;
                }
        }
        $scope.fetchLatestWeekDate = function(){
        CommonService.fetchLatestDate(dateResponseHandler, new Date(2016, 6, 1), new Date())
        $scope.fetchHealthTrackerData();
      }
        $scope.showPeriod = function(){
           var hideSheet = $ionicActionSheet.show({
            buttons: [{ text: 'Daily' },
                      { text: 'Weekly' }],
            titleText: '<h4>Select Period</h4>',
            cancelText: 'Cancel',
            cancel: function () {
            },
            buttonClicked: function (index) {
                if (index == '0') {
                  $scope.daily();
                  $scope.timePeriod = 'DAILY'
                  $scope.PeriodDisplay = toTitleCase('DAILY');
                  var frequencyText = "Latest Date";
                  $scope.textDisplay= function(){
                        return frequencyText;
                        }
                }
                if (index == '1') {
                  $scope.timePeriod = 'WEEKLY';
                  $scope.PeriodDisplay = toTitleCase('WEEKLY');
                  var frequencyText = "Week Ending with";
                  $scope.textDisplay= function(){
                        return frequencyText;
                        }
                  $scope.fetchHealthTrackerData();
                }
               hideSheet();
            }
        });
        }

        var rHandler = function(dates) {
          $scope.datesDisabled = [];
          for (var i = 0; i < dates.length; i++)
          {
            $scope.datesDisabled.push(new Date(dates[i]));
          }
            }

        var dateResponseHandler = function(date) {
          //console.log(date);
          var temp = new Date(date)
          if($scope.timePeriod == 'DAILY'){
          $scope.latestDate = ((temp.getMonth() + 1) + '/' + temp.getDate() + '/' +  temp.getFullYear());
          CommonService.setSelectedDate(temp);
          $scope.fetchHealthTrackerData();
          }
          else if($scope.timePeriod == 'WEEKLY'){
          if(temp.getDay() == 0)
          $scope.latestDate = ((temp.getMonth() + 1) + '/' + temp.getDate() + '/' +  temp.getFullYear());
          else {
            var first = temp.getDate() - temp.getDay();
            selectedDate = new Date(temp.setDate(first));
          $scope.latestDate = ((selectedDate.getMonth() + 1) + '/' + selectedDate.getDate() + '/' +  selectedDate.getFullYear());
            }
            CommonService.setSelectedDate(new Date(date));
            $scope.fetchHealthTrackerData();
          //$scope.fetchHealthTrackerData();
              }
            }

        $scope.daily = function () {
          CommonService.fetchDisabledDates(rHandler, new Date(2016, 6, 1), new Date());
          CommonService.fetchLatestDate(dateResponseHandler, new Date(2016, 6, 1), new Date());
                }

        $scope.openDatePicker = function(){
          $scope.inputDate = CommonService.getSelectedDate();
          if($scope.timePeriod == 'WEEKLY'){
              $scope.datepickerObject = {
                callback: function (val) {  //Mandatory
                  var selectedDate = new Date(val);
                  $scope.latestDate = ((selectedDate.getMonth() + 1) + '/' + selectedDate.getDate() + '/' +  selectedDate.getFullYear());
                  CommonService.setSelectedDate(selectedDate);
                  $scope.fetchHealthTrackerData();
                  },
                  disabledDates:[],
                  from: new Date(2016, 6, 1), //Optional
                  to: new Date(), //Optional
                  inputDate: $scope.inputDate,      //Optional
                  mondayFirst: true,          //Optional
                  disableWeekdays: [1,2,3,4,5,6],       //Optional
                  closeOnSelect: false,       //Optional
                  templateType: 'popup'       //Optional
                };
          }else if ($scope.timePeriod == 'DAILY') {
            $scope.datepickerObject = {
              callback: function (val) {  //Mandatory
              var selectedDate = new Date(val);
              //console.log(selectedDate);
              $scope.latestDate = ((selectedDate.getMonth() + 1) + '/' + selectedDate.getDate() + '/' +  selectedDate.getFullYear());
              CommonService.setSelectedDate(selectedDate);
              $scope.fetchHealthTrackerData();
                },
              disabledDates:$scope.datesDisabled,
              from: new Date(2016, 6, 1), //Optional
              to: new Date(), //Optional
              inputDate: $scope.inputDate,      //Optional
              mondayFirst: true,          //Optional
              disableWeekdays: [],       //Optional
              closeOnSelect: false,       //Optional
              templateType: 'popup'       //Optional
            };
          }

            ionicDatePicker.openDatePicker($scope.datepickerObject);
          };

          // $scope.labels1 = ["January", "February", "March", "April", "May", "June", "July"];
          // $scope.series = ['Series A', 'Series B'];
          // $scope.data = [
          //   [65, 59, 80, 81, 56, 55, 40],
          //   [28, 48, 40, 19, 86, 27, 90]
          // ];
          // $scope.onClick = function (points, evt) {
          //   console.log(points, evt);
          // };
          // $scope.datasetOverride = [{ yAxisID: 'y-axis-1' }, { yAxisID: 'y-axis-2' }];
          // $scope.options = {
          //   scales: {
          //     yAxes: [
          //       {
          //         id: 'y-axis-1',
          //         type: 'linear',
          //         display: true,
          //         position: 'left'
          //       },
          //       {
          //         id: 'y-axis-2',
          //         type: 'linear',
          //         display: true,
          //         position: 'right'
          //       }
          //     ]
          //   }
          // };


        function chartSeriesLabels() {
            // TODO - the method returns the array based on user settings, user selected date.
            // for example the series label can say "Benchmark - last week" or "Benchmark - last month" or "Benchmark - last year"
            // this depends on the config/ setting
            return ["Current", "Benchmark"]
        }

        //Response handler for fetchHealthTrackerProfitDataActual
        // var hTActualSalesDataResponseHandler = function(dates, sales) {
        $scope.hTActualSalesDataResponseHandler = function(dates, sales) {
          $scope.healthTrackerData.dates = CommonService.transformDatesForAxis(dates);
          $scope.healthTrackerData.salesData[0]=sales;
          // console.log(JSON.stringify($scope.healthTrackerData.salesData));
          // console.log(($scope.healthTrackerData.dates));
        }

        //Response handler for fetchHealthTrackerProfitDatBenchMark
        var hTBenchMarkSalesDataResponseHandler = function(dates, sales) {
            $scope.healthTrackerData.salesData[1]=sales;
            //console.log(dates);
            //console.log(sales);
               $scope.$broadcast('HT_FREE');
        }

        // var hTActualFoodSalesDataResponseHandler = function(dates, food_sales) {
        $scope.hTActualFoodSalesDataResponseHandler = function(dates, food_sales) {

          $scope.healthTrackerData.dates = CommonService.transformDatesForAxis(dates);
          $scope.healthTrackerData.foodSalesData[0]=food_sales;
        }

        //Response handler for fetchHealthTrackerProfitDatBenchMark
        var hTBenchMarkFoodSalesDataResponseHandler = function(dates, food_sales) {
           $scope.healthTrackerData.foodSalesData[1]=food_sales;
           $scope.$broadcast('HT_FREE');
        }

        //Response handler for fetchHealthTrackerProfitDataActual
        var hTActualProfitDataResponseHandler = function(dates, profits) {
            $scope.healthTrackerData.dates = CommonService.transformDatesForAxis(dates);
            $scope.healthTrackerData.profitData[0]=profits;
        }

        //Response handler for fetchHealthTrackerProfitDatBenchMark
        var hTBenchMarkProfitDataResponseHandler = function(dates, profits) {
            $scope.healthTrackerData.profitData[1]=profits;
        }

        //Response handler for fetchHealthTrackerFoodCostDataActual
        // var hTActualFoodCostDataResponseHandler = function(dates, foodCosts) {
        $scope.hTActualFoodCostDataResponseHandler = function(dates, foodCosts) {
            $scope.healthTrackerData.dates = CommonService.transformDatesForAxis(dates);
            $scope.healthTrackerData.foodCost[0]=foodCosts;
        }

        //Response handler for fetchHealthTrackerFoodCostDataBenchMark
        var hTBenchMarkFoodCostDataResponseHandler = function(dates, foodCosts) {
            $scope.healthTrackerData.foodCost[1]=foodCosts;
        }

        //Response handler for fetchHealthTrackerLiquorCostDataActual
        var hTActualLiquorCostDataResponseHandler = function(dates, liquorCosts) {
            $scope.healthTrackerData.dates = CommonService.transformDatesForAxis(dates);
            $scope.healthTrackerData.liquorCost[0]=liquorCosts;
          }

        //Response handler for fetchHealthTrackerProfitDatBenchMark
        var hTBenchMarkLiquorCostDataResponseHandler = function(dates, liquorCosts) {
            $scope.healthTrackerData.liquorCost[1]=liquorCosts;
        }

        //Response handler for fetchHealthTrackerLabourCostDataActual
        var hTActualLabourCostDataResponseHandler = function(dates, laborCosts) {
            $scope.healthTrackerData.dates = CommonService.transformDatesForAxis(dates);
            $scope.healthTrackerData.labourCost[0]=laborCosts;
            }

        //Response handler for fetchHealthTrackerLabourCostDataBenchMark
        var hTBenchMarkLabourCostDataResponseHandler = function(dates, laborCosts) {
            $scope.healthTrackerData.labourCost[1]=laborCosts;
            }

        //Method used to call all the http requests for fetching health tracker data
        $scope.fetchHealthTrackerData = function() {
            $scope.$broadcast('HT_BUSY');
            // //http request for fetching actual sales data
            // HealthTrackerService.fetchHealthTrackerSalesDataActual(hTActualSalesDataResponseHandler, $scope.timePeriod);

            //http request for fetching benchmark sales data
            HealthTrackerService.fetchHealthTrackerSalesDataBenchMark(hTBenchMarkSalesDataResponseHandler, $scope.timePeriod);

            // //http request for fetching actual Foodsales data
            // HealthTrackerService.fetchHealthTrackerFoodSalesDataActual(hTActualFoodSalesDataResponseHandler, $scope.timePeriod);

            //http request for fetching benchmark Foodsales data
            HealthTrackerService.fetchHealthTrackerFoodSalesDataBenchMark(hTBenchMarkFoodSalesDataResponseHandler, $scope.timePeriod);

            //http request for fetching actual profit data
            HealthTrackerService.fetchHealthTrackerProfitDataActual(hTActualProfitDataResponseHandler, $scope.timePeriod);

            //http request for fetching benchmark profit data
            HealthTrackerService.fetchHealthTrackerProfitDataBenchMark(hTBenchMarkProfitDataResponseHandler, $scope.timePeriod);

            // //http request for fetching actual food cost
            // HealthTrackerService.fetchHealthTrackerFoodCostDataActual(hTActualFoodCostDataResponseHandler, $scope.timePeriod);

            //http request for fetching benchmark food cost
            HealthTrackerService.fetchHealthTrackerFoodCostDataBenchMark(hTBenchMarkFoodCostDataResponseHandler, $scope.timePeriod);

            //http request for fetching actual liquor cost
            HealthTrackerService.fetchHealthTrackerLiquorCostDataActual(hTActualLiquorCostDataResponseHandler, $scope.timePeriod);

            //http request for fetching benchmark liquor cost
            HealthTrackerService.fetchHealthTrackerLiquorCostDataBenchMark(hTBenchMarkLiquorCostDataResponseHandler, $scope.timePeriod);

            //http request for fetching actual labour cost
            HealthTrackerService.fetchHealthTrackerLabourCostDataActual(hTActualLabourCostDataResponseHandler, $scope.timePeriod);

            //http request for fetching benchmark Labour cost
            HealthTrackerService.fetchHealthTrackerLabourCostDataBenchMark(hTBenchMarkLabourCostDataResponseHandler, $scope.timePeriod);
            // $scope.$broadcast('HT_BUSY');



            var promises = [HealthTrackerService.fetchHealthTrackerSalesDataActual($scope.timePeriod),
                            HealthTrackerService.fetchHealthTrackerFoodSalesDataActual($scope.timePeriod),
                            HealthTrackerService.fetchHealthTrackerFoodCostDataActual($scope.timePeriod),
                            ];
            $q.all(promises).then((values) => {
              $scope.hTActualSalesDataResponseHandler(values[0].dates,values[0].values);
              $scope.hTActualFoodSalesDataResponseHandler(values[1].dates,values[1].values);
              $scope.hTActualFoodCostDataResponseHandler(values[2].dates,values[2].values);
            });



        }


        $scope.$on('HT_BUSY', function (event) {

              $scope.spinnerHide = false;
          });

         $scope.$on('HT_FREE', function (event) {
                $scope.spinnerHide = true;
            });

        //Things to take care when the state is navigated to app.healthTracker
        $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
            if (toState.name == "app.healthTracker") {
                  }
        });
    }
})();
