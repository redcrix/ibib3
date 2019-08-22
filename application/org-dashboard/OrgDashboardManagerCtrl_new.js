(function() {
  'use strict';
  projectCostByte.controller('OrgDashboardManagerCtrl', OrgDashboardManagerCtrl);

  OrgDashboardManagerCtrl.$inject = ['$q', '$scope', '$state', 'CommonService', 'HealthTrackerService', 'PlTrackerService', 'Utils', '$timeout', '$window', 'PromotionOptimizerService',
    '$ionicScrollDelegate', 'ionicDatePicker', '$ionicActionSheet', '$ionicPopover', '$ionicModal', 'ErrorReportingServiceOne'
  ];


  function OrgDashboardManagerCtrl($q, $scope, $state, CommonService, HealthTrackerService, PlTrackerService, Utils, $timeout, $window,PromotionOptimizerService,
    $ionicScrollDelegate, ionicDatePicker, $ionicActionSheet, $ionicPopover, $ionicModal, ErrorReportingServiceOne) {

    let fetchLatestDateRH = function(date) {
      $scope.latestDate = date;
      CommonService.setSelectedDate(new Date(date));
      fetchHealthTrackerDataOld($scope.timePeriod);

    };
    let fetchDisabledDatesRH = function(dates) {
      $scope.datesDisabled = _.transform(dates, function(result, aDate) {
        result.push(new Date(aDate));
      });

    };

    $scope.summaryData = { 
        name: 'Sales',
        getActualFunc: HealthTrackerService.fetchOrgDashboardSummaryData
      };

    $scope.dataCards = [{
        name: 'Sales',
        getActualFunc: HealthTrackerService.fetchHealthTrackerSalesSummaryDataActual,
        getBenchmarkFunc: HealthTrackerService.fetchHealthTrackerSalesSummaryDataBenchMark,
        dataFilter: 'currency',
        diffFilter: 'currency',
        clickDestination: 'app.health-tracker-tab.healthTracker'
      },
      {
        name: 'Food Sales',
        getActualFunc: HealthTrackerService.fetchHealthTrackerFoodSalesSummaryDataActual,
        getBenchmarkFunc: HealthTrackerService.fetchHealthTrackerFoodSalesSummaryDataBenchMark,
        dataFilter: 'currency',
        diffFilter: 'currency',
        clickDestination: 'app.health-tracker-tab.healthTracker'
      },
      {
        name: 'Beverage Sales',
        getActualFunc: HealthTrackerService.fetchHealthTrackerBeverageSummarySalesActual,
        getBenchmarkFunc: HealthTrackerService.fetchHealthTrackerBeverageSummarySalesBenchmark,
        dataFilter: 'currency',
        diffFilter: 'currency',
        clickDestination: 'app.health-tracker-tab.healthTracker'
      },
      {
        name: 'Beer Sales',
        getActualFunc: HealthTrackerService.fetchHealthTrackerBeerSummarySalesActual,
        getBenchmarkFunc: HealthTrackerService.fetchHealthTrackerBeerSummarySalesBenchmark,
        dataFilter: 'currency',
        diffFilter: 'currency',
        clickDestination: 'app.health-tracker-tab.healthTracker'
      },
      {
        name: 'Wine Sales',
        getActualFunc: HealthTrackerService.fetchHealthTrackerWineSummarySalesActual,
        getBenchmarkFunc: HealthTrackerService.fetchHealthTrackerWineSummarySalesBenchmark,
        dataFilter: 'currency',
        diffFilter: 'currency',
        clickDestination: 'app.health-tracker-tab.healthTracker'
      },
      {
        name: 'Spirit Sales',
        getActualFunc: HealthTrackerService.fetchHealthTrackerSpiritSummarySalesActual,
        getBenchmarkFunc: HealthTrackerService.fetchHealthTrackerSpiritSummarySalesBenchmark,
        dataFilter: 'currency',
        diffFilter: 'currency',
        clickDestination: 'app.health-tracker-tab.healthTracker'
      },
      {
        name: 'Food Cost',
        getActualFunc: HealthTrackerService.fetchHealthTrackerFoodCostSummaryDataActual,
        getBenchmarkFunc: HealthTrackerService.fetchHealthTrackerFoodCostSummaryDataBenchMark,
        dataFilter: 'shortPercent',
        diffFilter: 'shortPercent',
        reverseDiffColor: true,
        clickDestination: 'app.health-tracker-tab.healthTracker-cogs'
      },
    ];
    $scope.dataCardsPairs = [
      [0, 1],
      [2, 3],
      [4, 5],
      [6]
    ];

    $scope.newDataCards = [{
        mainName: 'Sales',
        mainIcon: 'ion-social-usd',
        reverseDiffColor: false,
        WeeklyOnly: false,
        Daily: true,
        name: 'Sales',
        getActualFunc: HealthTrackerService.fetchHealthTrackerSalesSummaryDataActual,
        getBenchmarkFunc: HealthTrackerService.fetchHealthTrackerSalesSummaryDataBenchMark,
        dataFilter: 'currency',
        diffFilter: 'currency',
        clickDestination: 'app.health-tracker-tab.healthTracker',
        childData: [{
            name: 'Food Sales',
            getActualFunc: HealthTrackerService.fetchHealthTrackerFoodSalesSummaryDataActual,
            getBenchmarkFunc: HealthTrackerService.fetchHealthTrackerFoodSalesSummaryDataBenchMark,
            dataFilter: 'currency',
            diffFilter: 'currency',
            childIcon: 'ion-social-usd',
            clickDestination: 'app.health-tracker-tab.healthTracker'
          },
          {
            name: 'Beverage Sales',
            getActualFunc: HealthTrackerService.fetchHealthTrackerBeverageSummarySalesActual,
            getBenchmarkFunc: HealthTrackerService.fetchHealthTrackerBeverageSummarySalesBenchmark,
            dataFilter: 'currency',
            diffFilter: 'currency',
            childIcon: 'ion-social-usd',
            clickDestination: 'app.health-tracker-tab.healthTracker'
          },
          {
            name: 'Beer Sales',
            getActualFunc: HealthTrackerService.fetchHealthTrackerBeerSummarySalesActual,
            getBenchmarkFunc: HealthTrackerService.fetchHealthTrackerBeerSummarySalesBenchmark,
            dataFilter: 'currency',
            diffFilter: 'currency',
            childIcon: 'ion-social-usd',
            clickDestination: 'app.health-tracker-tab.healthTracker'
          },
          {
            name: 'Wine Sales',
            getActualFunc: HealthTrackerService.fetchHealthTrackerWineSummarySalesActual,
            getBenchmarkFunc: HealthTrackerService.fetchHealthTrackerWineSummarySalesBenchmark,
            dataFilter: 'currency',
            diffFilter: 'currency',
            childIcon: 'ion-social-usd',
            clickDestination: 'app.health-tracker-tab.healthTracker'
          },
          {
            name: 'Spirit Sales',
            getActualFunc: HealthTrackerService.fetchHealthTrackerSpiritSummarySalesActual,
            getBenchmarkFunc: HealthTrackerService.fetchHealthTrackerSpiritSummarySalesBenchmark,
            dataFilter: 'currency',
            diffFilter: 'currency',
            childIcon: 'ion-social-usd',
            clickDestination: 'app.health-tracker-tab.healthTracker'
          }
        ]
      },
      {
        mainName: 'Cogs',
        mainIcon: 'icon ion-arrow-graph-up-right',
        dataFilter: 'shortPercent',
        diffFilter: 'shortPercent',
        reverseDiffColor: true,
        WeeklyOnly: false,
        Daily: true,
        getActualFunc: HealthTrackerService.fetchHealthTrackerFoodCostSummaryDataActual,
        getBenchmarkFunc: HealthTrackerService.fetchHealthTrackerFoodCostSummaryDataBenchMark,
        name: 'Food Cost',
        childData: [{
          name: 'Food Cost',
          getActualFunc: HealthTrackerService.fetchHealthTrackerFoodCostSummaryDataActual,
          getBenchmarkFunc: HealthTrackerService.fetchHealthTrackerFoodCostSummaryDataBenchMark,
          dataFilter: 'shortPercent',
          diffFilter: 'shortPercent',
          childIcon: 'icon ion-arrow-graph-up-right',
          reverseDiffColor: true,
          clickDestination: 'app.health-tracker-tab.healthTracker-cogs'
        }]
      },
      {
        mainName: 'Labor Cost',
        mainIcon: 'ion-man',
        dataFilter: 'shortPercent',
        diffFilter: 'shortPercent',
        reverseDiffColor: true,
        WeeklyOnly: false,
        Daily: true,
        getActualFunc: HealthTrackerService.fetchHealthTrackerLabourCostSummaryDataActual,
        getBenchmarkFunc: HealthTrackerService.fetchHealthTrackerLabourCostSummaryDataBenchMark,
        name: 'Combined Labor',
        childData: [{
          name: 'Labor Cost',
          getActualFunc: HealthTrackerService.fetchHealthTrackerLabourCostSummaryDataActual,
          getBenchmarkFunc: HealthTrackerService.fetchHealthTrackerLabourCostSummaryDataBenchMark,
          dataFilter: 'shortPercent',
          diffFilter: 'shortPercent',
          childIcon: 'ion-man',
          reverseDiffColor: true,
          clickDestination: 'app.health-tracker-tab.healthTracker-cogs'
        }]
      },
      {
        mainName: 'Theoritical Cogs',
        mainIcon: 'icon ion-arrow-graph-up-right',
        dataFilter: 'shortPercent',
        diffFilter: 'shortPercent',
        reverseDiffColor: true,
        WeeklyOnly: true,
        Daily: true,
        getActualFunc: HealthTrackerService.fetchHealthTrackerFoodCostSummaryDataActual,
        getBenchmarkFunc: HealthTrackerService.fetchHealthTrackerFoodCostSummaryDataBenchMark,
        name: 'Food Cost',
        childData: [{
          name: 'Food Cost',
          getActualFunc: HealthTrackerService.fetchHealthTrackerFoodCostSummaryDataActual,
          getBenchmarkFunc: HealthTrackerService.fetchHealthTrackerFoodCostSummaryDataBenchMark,
          dataFilter: 'shortPercent',
          diffFilter: 'shortPercent',
          childIcon: 'icon ion-arrow-graph-up-right',
          reverseDiffColor: true,
          clickDestination: 'app.health-tracker-tab.healthTracker-cogs'
        }]
      },
      {
        mainName: 'Prime Profit',
        mainIcon: 'icon ion-arrow-graph-up-right',
        dataFilter: 'shortPercent',
        diffFilter: 'shortPercent',
        reverseDiffColor: true,
        WeeklyOnly: true,
        Daily: true,
        // getActualFunc: HealthTrackerService.fetchHealthTrackerPrimeProfitDataBenchMark,
        // getBenchmarkFunc: HealthTrackerService.fetchHealthTrackerPrimeProfitDataBenchMark,
        getActualFunc: HealthTrackerService.fetchHealthTrackerFoodCostSummaryDataActual,
        getBenchmarkFunc: HealthTrackerService.fetchHealthTrackerFoodCostSummaryDataBenchMark,
        name: 'Food Cost',
        childData: [{
          name: 'Food Cost',
          getActualFunc: HealthTrackerService.fetchHealthTrackerFoodCostSummaryDataActual,
          getBenchmarkFunc: HealthTrackerService.fetchHealthTrackerFoodCostSummaryDataBenchMark,
          dataFilter: 'shortPercent',
          diffFilter: 'shortPercent',
          childIcon: 'icon ion-arrow-graph-up-right',
          reverseDiffColor: true,
          clickDestination: 'app.health-tracker-tab.healthTracker-cogs'
        }]
      }
    ];
    $scope.newDataCardsPairs = [
      [0, 1],
      [2, 3],
      [4]
    ];

    $scope.$on('$ionicView.beforeEnter', function(event, viewData) {
      viewData.enableBack = true;
    });

    

    let actualDataRH = function(dates, values, key) {
      return $q(function(resolve, reject) {
        $scope.summaryData['actual_' + key] = values[0];
        resolve(true);
      });
    };

    let benchmarkDataRH = function(dates, benchmarkValues, key) {
      return $q(function(resolve, reject) {
        $scope.summaryData['benchmark_' + key] = benchmarkValues[0];
        $scope.summaryData['diff_' + key] = $scope.summaryData['actual_' + key] - benchmarkValues[0];
        resolve(true);
      });
    };

  

    $scope.openDatePicker = function() {
      $scope.inputDate = CommonService.getSelectedDate();
      var datepickerObject = {
        callback: function(val) { //Mandatory
          console.log(val);
          let selectedDate = new Date(val);
          $scope.latestDate = ((selectedDate.getMonth() + 1) + '/' + selectedDate.getDate() + '/' + selectedDate.getFullYear());
          CommonService.setSelectedDate(selectedDate);
          fetchHealthTrackerDataOld($scope.timePeriod);
        },
        disabledDates: [],
        from: new Date(2016, 6, 1), //Optional
        to: new Date(), //Optional
        inputDate: $scope.inputDate, //Optional
        mondayFirst: true, //Optional
        disableWeekdays: [1, 2, 3, 5, 4, 6], //Optional
        closeOnSelect: false, //Optional
        templateType: 'popup' //Optional
      };
      console.log($scope.datesDisabled);
      if ($scope.timePeriod == 'DAILY') {
        datepickerObject.disabledDates = $scope.datesDisabled;
        datepickerObject.disableWeekdays = [];
      }
      ionicDatePicker.openDatePicker(datepickerObject);
    };

    var fetchHealthTrackerDataOld = function(timePeriod) {
      $scope.$broadcast('DBSUMMARY_BUSY');

      let promises_actual = [];
      let promises_benchmark = [];
      let promises_order = [];
      _.forEach($scope.dataCards, function(card) {
        promises_actual.push(card.getActualFunc(timePeriod, $scope.latestDate));
        promises_benchmark.push(card.getBenchmarkFunc(timePeriod, $scope.latestDate));
        promises_order.push(card.name)
      });

      $q.all(promises_actual).then(function(actualValues) {
        let actualRHs = [];
        _.forEach(promises_order, function(cardKey, orderIndex) {
          actualRHs.push(actualDataRH(actualValues[orderIndex].dates, actualValues[orderIndex].values, cardKey))
        });
        $q.all(actualRHs).then(function(actualFinishes) {
          $q.all(promises_benchmark).then(function(benchmarkValues) {
            let benchmarkRHs = [];
            _.forEach(promises_order, function(cardKey, orderIndex) {
              benchmarkRHs.push(benchmarkDataRH(benchmarkValues[orderIndex].dates, benchmarkValues[orderIndex].values, cardKey))
            });
            $q.all(benchmarkRHs).then(function(benchmarkFinishes) {
              $scope.$broadcast('DBSUMMARY_FREE');
            })
          })
        })
      });


    };

    var fetchOrgSummaryData = function(timePeriod){
      $scope.$broadcast('DBSUMMARY_BUSY');
      let promises_actual = [];
      let promises_actual = [];
      _.forEach($scope.summaryData, function(card) {
          // console.log(card.name, card.WeeklyOnly);
           console.log(card);
          promises_actual.push(card.getActualFunc(timePeriod));
      });
    }

    var fetchHealthTrackerData = function(timePeriod) {
      $scope.$broadcast('DBSUMMARY_BUSYy');

      let promises_actual = [];
      let promises_benchmark = [];
      let promises_order = [];
      _.forEach($scope.newDataCards, function(card) {
        // console.log(card.name, card.WeeklyOnly);
        if ($scope.timePeriod == "WEEKLY") {
          card.visible = true;
        } else if ($scope.timePeriod == "DAILY" && !card.WeeklyOnly) {
          card.visible = true;
        }
        // console.log(card);
        promises_actual.push(card.getActualFunc(timePeriod, $scope.latestDate));
        promises_benchmark.push(card.getBenchmarkFunc(timePeriod, $scope.latestDate));
        promises_order.push(card.name)
      });
      // console.log(promises_actual);
      $q.all(promises_actual).then(function(actualValues) {
        // console.log(actualValues);
        let actualRHs = [];
        _.forEach(promises_order, function(cardKey, orderIndex) {
          actualRHs.push(actualDataRH(actualValues[orderIndex].dates, actualValues[orderIndex].values, cardKey))
        });
        $q.all(actualRHs).then(function(actualFinishes) {
          $q.all(promises_benchmark).then(function(benchmarkValues) {
            let benchmarkRHs = [];
            _.forEach(promises_order, function(cardKey, orderIndex) {
              benchmarkRHs.push(benchmarkDataRH(benchmarkValues[orderIndex].dates, benchmarkValues[orderIndex].values, cardKey))
            });
            $q.all(benchmarkRHs).then(function(benchmarkFinishes) {
              $scope.$broadcast('DBSUMMARY_FREE');
            })
          })
        })
      });


    };

    $scope.$on('DBSUMMARY_BUSY', function(event) {
      $scope.spinnerHide = false;
      // $scope.spinnerShow = true;
    });

    $scope.$on('DBSUMMARY_FREE', function(event) {
      $scope.spinnerHide = true;
  //    console.log($scope.summaryData);
      // $scope.spinnerShow = false;
      $ionicScrollDelegate.resize();
    });



    // overViewData

    $scope.overViewData = {};

    $scope.subHeaderTextOverView = function() {

      let frequencyText = ""
      if (angular.isDefined($scope.periodList)) {
        frequencyText = _.capitalize($scope.periodDetailSelectionOverView(true));
      }
      return frequencyText;
    };

        

     $scope.showWeekOverView = function() {
        console.log("inside show week overview");
        console.log($scope.filterButtons);
        console.log($scope.periodList);
         var hideSheet = $ionicActionSheet.show({
            buttons: $scope.filterButtons,
            titleText: '<h4>Select Week </h4>',
            cancelText: 'Cancel',
            cancel: function() {},
            buttonClicked: function(index) {
              _.each($scope.filterButtons, function(p, pIndex) {
                console.log("inside each");
                console.log(p);
                console.log(pIndex);
                if (index === pIndex) {
                  p.selected = true;
                  $timeout(setWeeksFilterButtonsOverView, 1);
                } else {
                  p.selected = false;
                }
              });

              //hideSheet();
              return true;
            }
          });
        var myE2 = angular.element(document.querySelector('.action-sheet-group'));
        myE2.css('overflow-y', 'scroll');
        myE2.css('max-height', (window.innerHeight - 50) + 'px');
        myE2.css('max-width', (window.innerWidth - 120) + 'px');
    };


    $scope.weekDetailSelectionOverView = function () {
          if (angular.isDefined($scope.filterButtons)) {
              let selectedWeek = _.find($scope.filterButtons, ['selected', true]);
              return selectedWeek.label + '(' + selectedWeek.dateLabel + ')';
          }
          return ""
    }


     $scope.showYear = function() {
        var hideYearSheet = $ionicActionSheet.show({
            buttons: $scope.yearList,
            titleText: '<h3><center>Select a Year</center></h3>',
            cancelText: 'Cancel',
            cancel: function () {
            },
            buttonClicked: function (index) {
                _.each($scope.yearList, function (y, yIndex) {
                    if (index === yIndex) {
                        y.selected = true;
                        setPeriodData(y);
                        $timeout(setWeeksFilterButtonsOverView, 1);
                    } else {
                        y.selected = false;
                    }
                });
                return true;
            }
        });
        var myE2 = angular.element(document.querySelector('.action-sheet-group'));
        myE2.css('overflow-y', 'scroll');
        myE2.css('max-height', (window.innerHeight - 50) + 'px');
        myE2.css('max-width', (window.innerWidth - 120) + 'px');
    };
    $scope.showWeek = function() {
        var hideYearSheet = $ionicActionSheet.show({
            buttons: $scope.filterButtons,
            titleText: '<h3><center>Select a Week</center></h3>',
            cancelText: 'Cancel',
            cancel: function () {
            },
            buttonClicked: function (index) {
                _.each($scope.filterButtons, function (w, wIndex) {
                    if (index === wIndex) {
                        w.selected = true;
                        $scope.filterbuttonclickOverView(wIndex);
                    } else {
                        w.selected = false;
                    }
                });
                return true;
            }
        });
        var myE2 = angular.element(document.querySelector('.action-sheet-group'));
        myE2.css('overflow-y', 'scroll');
        myE2.css('max-height', (window.innerHeight - 50) + 'px');
        myE2.css('max-width', (window.innerWidth - 120) + 'px');
    };
    var setPandYdata = function(periodDataList) {
            $scope.periodList = [];
            $scope.yearList = [];
            $scope.weekList = [];
            console.log("peiod data list");
            console.log(periodDataList);
            var unique = {};
            var temp = "";
            var insertIndex = 0;

            for(var i=0; i < periodDataList.length; i++) {
                if (!unique[periodDataList[i].year]) {
                    $scope.yearList.push({text:periodDataList[i].year, selected:periodDataList[i].selected});
                    unique[periodDataList[i].year] = periodDataList[i];
                }
                if(periodDataList[i].selected)
                    temp = periodDataList[i].year;
            }
            for(var i=0; i < $scope.yearList.length; i++) {
                if($scope.yearList[i].text === temp) {
                    $scope.yearList[i].selected = true;
                    for(var j=0; j < periodDataList.length; j++) {
                        if(temp === periodDataList[j].year) {
                            $scope.periodList[insertIndex] = periodDataList[j];
                            
                            if($scope.periodList[insertIndex].selected == true){
                              $scope.weekList = $scope.periodList[insertIndex].periodWeeks;
                            }
                            insertIndex ++;
                        }
                    }
                }
            }
            console.log($scope.weekList);
        }

        $scope.yearDetailSelection = function () {
            if (angular.isDefined($scope.yearList)) {
                let selectedYear = _.find($scope.yearList, ['selected', true]);
                return selectedYear.text;
            }
            return ""
        }

        $scope.weekSelection = function () {
          console.log("$scope.filterButtons in weekSelection : ", $scope.filterButtons);
            if (angular.isDefined($scope.filterButtons)) {
                let selectedWeek = _.find($scope.filterButtons, ['selected', true]);
                return selectedWeek.text;
            }
            return ""
        }

        var setPeriodData = function(yearData) {
            $scope.periodList = [];
            for(var i=0; i < $scope.completePeriodList.length; i++) {
                if(yearData.text === $scope.completePeriodList[i].year) {
                    $scope.periodList.push($scope.completePeriodList[i]);
                }
            }
            if(!(_.find($scope.periodList, ['selected', true])))  {
                $scope.periodList[$scope.periodList.length - 1].selected = true;
            }

            console.log("setting period data");
            console.log($scope.periodList);
        }

    $scope.check = function(business){
        var returnFlag = _.find($scope.businesses, function(obj) {
            return obj.business_id === business.business_id && obj.business_name === business.business_name && obj.selected;
        })
        return returnFlag;
    }

    $scope.switch = function (sel) {
        // console.log($scope.businesses, sel);
        var switchDone = false;
        angular.forEach($scope.businesses, function (b, index){
            if(b.business_id === sel.business_id && b.business_name === sel.business_name && !b.selected) {
                console.log(b);
                b.selected = true;
                switchDone = true;
                Utils.setLocalValue('sessionId', b.session_id);
            } else {
                b.selected = false;
            }
            if(index+1 == $scope.businesses.length){
              console.log(switchDone);
              if(switchDone) {
                console.log(" business");
                Utils.setLocalValue('businesses', JSON.stringify($scope.businesses));
                // REFRESH APP
                Utils.refreshApp().then(function(){
                    $state.go('app.dashboard.summary').then(function(){
                        $window.location.reload(true);
                    });
                });
              } else {
                console.log("same business");
              }
            }
        });
    };

    $scope.initializeDashboardView = function() {
      console.log("initializeViewOverView calling ......")
      $scope.$broadcast('DBSUMMARY_BUSY');
      $scope.periodSelection = 'Period';
      $scope.spinnerHide = false;
      $scope.navBarTitle.showToggleButton = false;
      $scope.navBarTitle.showToggleButton = true;
      $scope.businesses = JSON.parse(Utils.getLocalValue('businesses'));

      let responseHandler = function(businessListData) {
        console.log(businessListData);
        $scope.businessList = businessListData.businesses;

        PlTrackerService.fetchPeriodWeeks()
          .then(function(periodListWithData) {
            // $scope.periodList = periodListData;
            // $scope.originalPeriodList = periodListData;
            $scope.headerShow = true;
            $scope.config = false;
            // $timeout(setWeeksFilterButtonsOverView, 1);

            $scope.completePeriodList = periodListWithData;
                    setPandYdata(periodListWithData);
                    $timeout(setWeeksFilterButtonsOverView, 1);
          });

      };
      CommonService.fetchBusinesses(responseHandler);
    };


    let actualDataRHOverView = function(datas, key) {
      return $q(function(resolve, reject) {
        // console.log(datas, key);
        $scope.overViewData[datas.business_id + ":" + datas.field] = datas.values;
        $scope.overViewData[datas.business_id + ":" + datas.field + ":budget" ] = datas.budgetValue;
        for(var key in $scope.overViewData) {
          console.log(key + "===" + $scope.overViewData[key])
        }
        console.log("final values");
        console.log($scope.overViewData);
        resolve(true);
      });
    };


    $scope.dataCardsOverView = [{
        name: 'Sales',
        getFunc: HealthTrackerService.fetchOverviewData,
        dataFilter: 'currency',
        diffFilter: 'currency',
        field: 'TOTAL_SALES',
        clickDestination: 'app.health-tracker-tab.healthTracker'
      },
      {
        name: 'Profit After Prime',
        getFunc: HealthTrackerService.fetchOverviewData,
        dataFilter: 'currency',
        diffFilter: 'currency',
        field: 'AFTER_PRIME_PROFIT',
        clickDestination: 'app.health-tracker-tab.healthTracker'
      },
      {
        name: 'Food Cost',
        getFunc: HealthTrackerService.fetchOverviewData,
        dataFilter: 'shortPercent',
        diffFilter: 'shortPercent',
        field: 'FOOD_COST',
        reverseDiffColor: true,
        clickDestination: 'app.health-tracker-tab.healthTracker-cogs'
      },
      {
        name: 'Labor Cost',
        getFunc: HealthTrackerService.fetchOverviewData,
        dataFilter: 'shortPercent',
        diffFilter: 'shortPercent',
        field: 'TOTAL_LABOR_COST',
        reverseDiffColor: true,
        clickDestination: 'app.health-tracker-tab.healthTracker-cogs'
      },
      {
        name: 'Cogs Cost',
        getFunc: HealthTrackerService.fetchOverviewData,
        dataFilter: 'shortPercent',
        diffFilter: 'shortPercent',
        field: 'TOTAL_COGS_COST',
        reverseDiffColor: true,
        clickDestination: 'app.health-tracker-tab.healthTracker-cogs'
      }
    ];


    $scope.dataCardsPairsOverView = [
      [0],
      [1],
      [2],
      [3],
      [4]
    ];

    $scope.periodDetailSelectionOverView = function(showDates) {
      if (angular.isDefined($scope.periodList)) {
        let selectedPeriod = _.find($scope.periodList, ['selected', true]);
        if (showDates) {
           // return selectedPeriod.text;
            return selectedPeriod.text + ' (' + selectedPeriod.year + ')';
        } else {
            return selectedPeriod.text;
        }
      }
      return ""
    }

    $scope.chartData = [];
    

    //Response handler for fetchHealthTrackerProfitDatBenchMark
   //  var summaryHistoryResponseHandler = function(data) {
   //    console.log("summary responseHandler");
   //    $scope.chartData[data.business_id] = data.summary_history_list.summary_hist_data
   // //   $scope.overViewData[datas.business_id + ":" + datas.field] = datas.values;
   //  //  console.log(data);
   //      console.log($scope.chartData);
   //  }

   

    var fetchHealthTrackerDataOverView = function(timePeriod) {
      $scope.$broadcast('DBSUMMARY_BUSY_OverView');
      //console.log("calling DBSUMMARY_BUSY_OverView");
      let promises_actual = [];
      let promise_history = [];
      // let promises_benchmark = [];
      let promises_order = [];
       _.forEach($scope.businessList, function(business) {
     //    HealthTrackerService.fetchOverviewStatsHistoryForSelectedSummary(timePeriod,  business.business_store_id, business.business_id, summaryHistoryResponseHandler);
       });

      _.forEach($scope.businessList, function(business) {
    //     console.log($scope.businessList);
   //      console.log($scope.dataCardsOverView);

        _.forEach($scope.dataCardsOverView, function(card) {
          //console.log("calling promise push");
          //console.log(card);
          promises_actual.push(card.getFunc(timePeriod, card.field, business.business_store_id, business.business_id));
          // promises_benchmark.push(card.getBenchmarkFunc(timePeriod, $scope.latestDate));
          promises_order.push(card.name)
        });

       //   console.log("fetch summary hist");

          promise_history.push(HealthTrackerService.fetchSummaryHistoryData(timePeriod,  business.business_store_id, business.business_id));
      //    console.log(promise_history);
      });


      $q.all(promise_history).then(function(data){
        console.log("inside promise history");
        console.log(data);
        
        for (var i = 0; i < data.length; i++) { 
       //     $scope.chartData[data[i].business_id] = data[i].values;
            $scope.chartData[data[i].business_id] = [];
            for ( var j = 0; j < data[i].values.length; j ++){
              //console.log('sales');
              // console.log(data[i].values[j].summary_hist_data);
              //console.log(data[i].business_id + "===" +data[i].values[j].date_range_type + "===="+ data[i].values[j].summary_hist_data.total_sales);
              $scope.chartData[data[i].business_id][data[i].values[j].date_range_type] = data[i].values[j].summary_hist_data.total_sales;
            }
        }
        console.log("char data");
        console.log($scope.chartData);

      });

      $q.all(promises_actual).then(function(actualValues) {
        let actualRHs = [];
        _.forEach(promises_order, function(cardKey, orderIndex) {
          //console.log("actual values");
         //  console.log(actualValues);
          actualRHs.push(actualDataRHOverView(actualValues[orderIndex], cardKey));

        });
        $q.all(actualRHs).then(function(actualFinishes) {
          console.log("finish");
          console.log($scope.overViewData);
          // $q.all(promises_benchmark).then(function (benchmarkValues) {
          //     let benchmarkRHs = [];
          //     _.forEach(promises_order, function (cardKey, orderIndex) {
          //         benchmarkRHs.push(benchmarkDataRH(benchmarkValues[orderIndex].dates, benchmarkValues[orderIndex].values, cardKey))
          //     });
          //     $q.all(benchmarkRHs).then(function (benchmarkFinishes) {
          
          console.log("calculating cumulative again");  
          $scope.cuml_sales = $scope.cuml_cogs = $scope.cuml_com_labour = $scope.cuml_prime_profit = 0;  
          $scope.cuml_com_labour_sum = $scope.cuml_cogs_sum =$scope.cuml_prime_profit_sum =0;
          angular.forEach($scope.businesses, function (business, index){

            $scope.cuml_sales += $scope.overViewData[business.business_id+ ":" +$scope.dataCardsOverView[0].field];
            // if($scope.cuml_sales == 0){
            //   $scope.cuml_sales = -1;
            // }
            $scope.cuml_prime_profit_sum += $scope.overViewData[business.business_id+ ":" +$scope.dataCardsOverView[1].field];
            $scope.cuml_prime_profit = ($scope.cuml_prime_profit_sum*100)/$scope.cuml_sales;

            $scope.cuml_cogs_sum += $scope.overViewData[business.business_id+ ":" +$scope.dataCardsOverView[4].field];
            $scope.cuml_cogs = ($scope.cuml_cogs_sum *100 )/$scope.cuml_sales;

            $scope.cuml_com_labour_sum += $scope.overViewData[business.business_id+ ":" +$scope.dataCardsOverView[3].field];
            $scope.cuml_com_labour = ($scope.cuml_com_labour_sum*100)/$scope.cuml_sales;
            

        });
          console.log("total sales" +$scope.cuml_sales );
          console.log("total cogs" +$scope.cuml_cogs_sum );
          console.log("total labor" +$scope.cuml_com_labour_sum );
          console.log("total prime" +$scope.cuml_prime_profit_sum );
          $scope.$broadcast('DBSUMMARY_FREE_OverView');
          // })
          // })
        })
      });
    };

    $scope.$on('DBSUMMARY_BUSY_OverView', function(event) {
      $scope.spinnerHideOverView = false;
    });

    $scope.$on('DBSUMMARY_FREE_OverView', function(event) {
      $scope.spinnerHideOverView = true;
      console.log("overview present");
    //  console.log($scope.chartData);
      console.log($scope.overViewData);
      // $ionicScrollDelegate.resize();
    });

    $scope.periodClickHandlerOverView = function() {
      $scope.periodSelection = 'Period';
      $scope.headerShow = true;

    };

    $scope.configClickHandlerOverView = function() {
      $scope.periodSelection = 'Config';
      $scope.headerShow = false;

    };

    var convertDatesRangeToLabelOverView = function(startDate, endDate) {
      let start = new Date(startDate * 1000),
        end = new Date(endDate * 1000);
      return (start.getMonth() + 1) + '/' + start.getDate() + " - " + (end.getMonth() + 1) + '/' + end.getDate();
    }

    var setWeeksFilterButtonsOverView = function(periodItem) {
      return $q(function(resolve, reject) {
        if (angular.isDefined($scope.periodList)) {
          let periodItem = _.find($scope.periodList, ['selected', true]);
          let buttons = _.transform(periodItem.periodWeeks, function(result, periodWeek, index) {
            periodWeek.style = '';
            result.push(periodWeek)
          });
          let selectedWeekButton = _.findIndex(buttons, ['selected', true]);
          if (selectedWeekButton === -1) {
            selectedWeekButton = 0;
          }
          $scope.filterButtons = buttons;
          _.each($scope.filterButtons, function(button, index) {
            if($scope.filterButtons[index].week != 0)
              $scope.filterButtons[index].text = "Week " + $scope.filterButtons[index].week;
            else
              $scope.filterButtons[index].text = "Total Month";
            });
          // console.log(selectedWeekButton, $scope.filterButtons[selectedWeekButton]);

          $scope.filterbuttonclickOverView(selectedWeekButton);
          resolve(true)
        }

      })

    };


    $scope.filterbuttonclickOverView = function(filterbuttonindex) {
      $scope.spinnerHideOverView = false;
      _.each($scope.filterButtons, function(button, index) {
        if (index === filterbuttonindex) {
          button.selected = true;
        } else {
          button.selected = false;
        }
      });
      console.log($scope.filterButtons[filterbuttonindex].periodWeekTag);
      fetchHealthTrackerDataOverView($scope.filterButtons[filterbuttonindex].periodWeekTag);
      // fetchPandLData($scope.filterButtons[filterbuttonindex].periodWeekTag)
    };


    $scope.rowSize = {
      // name: 35,
      name: 50,
      price: 15,
      qty: 19,
      units: 7,
      value: 19
    };


    $scope.showPeriodOverView = function() {
      if ($scope.periodSelection === 'Period') {

        var hideSheet = $ionicActionSheet.show({
          buttons: $scope.periodList,
          titleText: '<h4>Select Period </h4>',
          cancelText: 'Cancel',
          cancel: function() {},
          buttonClicked: function(index) {
            _.each($scope.periodList, function(p, pIndex) {
              if (index === pIndex) {
                p.selected = true;
                $timeout(setWeeksFilterButtonsOverView, 1);
              } else {
                p.selected = false;
              }
            });

            //hideSheet();
            return true;
          }
        });
      }

      var myEl = angular.element(document.querySelector('.action-sheet-group'));
      // console.log(myEl);
      myEl.css('overflow-y', 'scroll');
      myEl.css('max-height', (window.innerHeight - 50) + 'px');
    };

    var pandlRHandlerOverView = function(data) {

      if (angular.isDefined(data.data_list)) {
        $scope.pandlData = data.data_list;
     //   console.log(data.data_list);
      } else {
        $scope.pandlData = [];
        $scope.noData = true;
      }

      $scope.spinnerHideOverView = true;

    };

    $scope.$on('PL_DATECHANGE_EVENT', function(event) {
      $scope.initializeDashboardView();
    });

    $scope.graphData = true;
   
    $scope.labels = ['a','b','c','d'];

  }

  function getColor(balance){
      console.log("inside get color");
       return balance > 0 ? "green" : "red";
    };
  // function overviewCtrl($q, $scope, $parse, CommonService, HealthTrackerService, PlTrackerService, $ionicActionSheet, Utils, $state, $timeout) {
  //
  //
  // }

})();
