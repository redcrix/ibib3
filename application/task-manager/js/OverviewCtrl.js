(function() {
  'use strict';
  projectCostByte.controller('OverviewCtrl', overviewCtrl);

  overviewCtrl.$inject = ['$q', '$scope', '$parse', 'CommonService', 'HealthTrackerService', 'PlTrackerService', '$ionicActionSheet', 'Utils', '$state', '$timeout'];


  function overviewCtrl($q, $scope, $parse, CommonService, HealthTrackerService, PlTrackerService, $ionicActionSheet, Utils, $state, $timeout) {

    $scope.overViewData = {};

    $scope.subHeaderText = function() {

      let frequencyText = ""
      if (angular.isDefined($scope.periodList)) {
        frequencyText = _.capitalize($scope.periodDetailSelection(true));
      }
      return frequencyText;
    };

    var setPandYdata = function(periodDataList) {
        $scope.periodList = [];
        $scope.yearList = [];
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
                        insertIndex ++
                    }
                }
            }
        }
    }

    var setPeriodData = function(yearData) {
        $scope.periodList = [];
        for(var i=0; i < $scope.completePeriodList.length; i++) {
            if(yearData.text === $scope.completePeriodList[i].year) {
                $scope.periodList.push($scope.completePeriodList[i]);
            }
        }
        if(!(_.find($scope.periodList, ['selected', true])))  {
            console.log("$scope.periodList",$scope.periodList);
            $scope.periodList[$scope.periodList.length - 1].selected = true;
        }
    }



    $scope.initializeView = function() {
      $scope.$broadcast('DBSUMMARY_BUSY');
      $scope.pageTitle = "Overview";
      $scope.periodSelection = 'Period';
      $scope.headerShow = true;
      PlTrackerService.fetchPeriodWeeksWithData()
        .then(function(periodListData) {
          // $scope.periodList = periodListData;
          $scope.completePeriodList = periodListData;

          setPandYdata(periodListData);
          $timeout(setWeeksFilterButtons, 1);
        });
      let responseHandler = function(businessListData) {
        // console.log(businessListData);
        $scope.businessList = businessListData.businesses;
      };
      CommonService.fetchBusinesses(responseHandler);
    };


    let actualDataRH = function (datas, key) {
        return $q(function (resolve, reject) {
            // console.log(datas, key);
            $scope.overViewData[datas.business_id +":"+datas.field] = datas.values;
            resolve(true);
        });
    };

    $scope.dataCards = [
        {
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
        }
    ];

    $scope.dataCardsPairs = [[0],[1],[2],[3]];

    // $scope.periodDetailSelection = function(showDates) {
    //   if (angular.isDefined($scope.periodList)) {
    //     let selectedPeriod = _.find($scope.periodList, ['selected', true]);
    //     if (showDates) {
    //       return selectedPeriod.text + ' (' + selectedPeriod.year + ')';
    //     } else {
    //       return selectedPeriod.label;
    //     }
    //   }
    //   return ""
    // }


    $scope.periodDetailSelection = function (showDates) {
        if (angular.isDefined($scope.periodList)) {
            let selectedPeriod = _.find($scope.periodList, ['selected', true]);
            if (showDates) {
                return selectedPeriod.text;
            } else {
                return selectedPeriod.label;
            }
        }
        return ""
    }

    $scope.yearDetailSelection = function () {
        if (angular.isDefined($scope.yearList)) {
            let selectedYear = _.find($scope.yearList, ['selected', true]);
            return selectedYear.text;
        }
        return ""
    }



    var fetchHealthTrackerData = function (timePeriod) {
       $scope.$broadcast('DBSUMMARY_BUSY');

       let promises_actual = [];
       // let promises_benchmark = [];
       let promises_order = [];

       _.forEach($scope.businessList, function (business) {
         // console.log(business);
         _.forEach($scope.dataCards, function (card) {
             promises_actual.push(card.getFunc(timePeriod, card.field,  business.business_store_id, business.business_id ));
             // promises_benchmark.push(card.getBenchmarkFunc(timePeriod, $scope.latestDate));
             promises_order.push(card.name)
         });
       });

       $q.all(promises_actual).then(function (actualValues) {
           let actualRHs = [];
           _.forEach(promises_order, function (cardKey, orderIndex) {
               // console.log(actualValues);
               actualRHs.push(actualDataRH(actualValues[orderIndex], cardKey))
           });
           $q.all(actualRHs).then(function (actualFinishes) {
               // $q.all(promises_benchmark).then(function (benchmarkValues) {
               //     let benchmarkRHs = [];
               //     _.forEach(promises_order, function (cardKey, orderIndex) {
               //         benchmarkRHs.push(benchmarkDataRH(benchmarkValues[orderIndex].dates, benchmarkValues[orderIndex].values, cardKey))
               //     });
               //     $q.all(benchmarkRHs).then(function (benchmarkFinishes) {
                       $scope.$broadcast('DBSUMMARY_FREE');
                   // })
               // })
           })
       });
    };

    $scope.$on('DBSUMMARY_BUSY', function (event) {
        $scope.spinnerHide = false;
    });

    $scope.$on('DBSUMMARY_FREE', function (event) {
        $scope.spinnerHide = true;
        console.log($scope.overViewData);
        // $ionicScrollDelegate.resize();
    });


    $scope.periodClickHandler = function() {
      $scope.periodSelection = 'Period';
      $scope.headerShow = true;
    };

    $scope.configClickHandler = function() {
      $scope.periodSelection = 'Config';
      $scope.headerShow = false;
    };

    var convertDatesRangeToLabel = function(startDate, endDate) {
      let start = new Date(startDate * 1000),
        end = new Date(endDate * 1000);
      return (start.getMonth() + 1) + '/' + start.getDate() + " - " + (end.getMonth() + 1) + '/' + end.getDate();
    }

    // var setWeeksFilterButtons = function(periodItem) {
    //   return $q(function(resolve, reject) {
    //     if (angular.isDefined($scope.periodList)) {
    //       let periodItem = _.find($scope.periodList, ['selected', true]);
    //       let buttons = _.transform(periodItem.periodWeeks, function(result, periodWeek, index) {
    //         periodWeek.style = '';
    //         result.push(periodWeek)
    //       });
    //       let selectedWeekButton = _.findIndex(buttons, ['selected', true]);
    //       if (selectedWeekButton === -1) {
    //         selectedWeekButton = 0;
    //       }
    //       $scope.filterButtons = buttons;
    //       // console.log(selectedWeekButton, $scope.filterButtons[selectedWeekButton]);
    //
    //       $scope.filterbuttonclick(selectedWeekButton);
    //       resolve(true)
    //     }
    //
    //   })
    //
    // };
    //
    var setWeeksFilterButtons = function (periodItem) {
        return $q(function (resolve, reject) {
            if (angular.isDefined($scope.periodList)) {
                let periodItem = _.find($scope.periodList, ['selected', true]);
                let buttons = _.transform(periodItem.periodWeeks, function (result, periodWeek, index) {
                    periodWeek.style = '';
                    result.push(periodWeek)
                });
                let selectedWeekButton = _.findIndex(buttons, ['selected', true]);
                if (selectedWeekButton === -1) {
                    selectedWeekButton = 0;
                }
                $scope.filterButtons = buttons;
                $scope.filterbuttonclick(selectedWeekButton);
                resolve(true)
            }

        })

    };


    $scope.filterbuttonclick = function(filterbuttonindex) {
      $scope.spinnerHide = false;
      _.each($scope.filterButtons, function(button, index) {
        if (index === filterbuttonindex) {
          button.selected = true;
        } else {
          button.selected = false;
        }
      });
      console.log($scope.filterButtons[filterbuttonindex].periodWeekTag);
      fetchHealthTrackerData($scope.filterButtons[filterbuttonindex].periodWeekTag);
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


    // $scope.showPeriod = function() {
    //   if ($scope.periodSelection === 'Period') {
    //
    //     var hideSheet = $ionicActionSheet.show({
    //       buttons: $scope.periodList,
    //       titleText: '<h4>Select Period </h4>',
    //       cancelText: 'Cancel',
    //       cancel: function() {},
    //       buttonClicked: function(index) {
    //         _.each($scope.periodList, function(p, pIndex) {
    //           if (index === pIndex) {
    //             p.selected = true;
    //             $timeout(setWeeksFilterButtons, 1);
    //           } else {
    //             p.selected = false;
    //           }
    //         });
    //
    //         //hideSheet();
    //         return true;
    //       }
    //     });
    //   }
    //
    //   var myEl = angular.element(document.querySelector('.action-sheet-group'));
    //   // console.log(myEl);
    //   myEl.css('overflow-y', 'scroll');
    //   myEl.css('max-height', (window.innerHeight - 50) + 'px');
    // };

    $scope.showPeriod = function () {
        if ($scope.periodSelection === 'Period') {
            var hideSheet = $ionicActionSheet.show({
                buttons: $scope.periodList,
                titleText: '<h4><center>Select Period</center></h4>',
                cancelText: 'Cancel',
                cancel: function () {
                },
                buttonClicked: function (index) {
                    _.each($scope.periodList, function (p, pIndex) {
                        if (index === pIndex) {
                            p.selected = true;
                            $timeout(setWeeksFilterButtons, 1);
                        } else {
                            p.selected = false;
                        }
                    });

                    //hideSheet();
                    return true;
                }
            });
        }

        // if ($scope.periodSelection === 'Monthly') {
        //     var hideSheet = $ionicActionSheet.show({
        //         buttons: $scope.monthList,
        //         titleText: '<h4>Select a Month</h4>',
        //         cancelText: 'Cancel',
        //         cancel: function () {
        //         },
        //         buttonClicked: function (index) {
        //             //send index number
        //             $scope.periodDetailSelection = $scope.monthList[index - 1].text;
        //             $scope.pandlTag = $scope.periodDetailSelection.concat("_2017");
        //             $scope.initData = false;
        //             fetchPandLData($scope.pandlTag);
        //             //hideSheet();
        //             return true;
        //         }
        //     });
        // }
        var myEl = angular.element(document.querySelector('.action-sheet-group'));
        if(myEl) {
          myEl.css('overflow-y', 'scroll');
          myEl.css('max-height', (window.innerHeight - 50) + 'px');
          myE1.css('max-width', (window.innerWidth - 120) + 'px');
        }
    };

    $scope.showYear = function() {
        var hideYearSheet = $ionicActionSheet.show({
            buttons: $scope.yearList,
            titleText: '<h4><center>Select a Year</center></h4>',
            cancelText: 'Cancel',
            cancel: function () {
            },
            buttonClicked: function (index) {
                _.each($scope.yearList, function (y, yIndex) {
                    if (index === yIndex) {
                        y.selected = true;
                        setPeriodData(y);
                        $timeout(setWeeksFilterButtons, 1);
                    } else {
                        y.selected = false;
                    }
                });
                return true;
            }
        });
        var myE2 = angular.element(document.querySelector('.action-sheet-group'));
        if(myE2){
          myE2.css('overflow-y', 'scroll');
          myE2.css('max-height', (window.innerHeight - 50) + 'px');
          myE2.css('max-width', (window.innerWidth - 120) + 'px');
        }
    };


    var pandlRHandler = function(data) {

      if (angular.isDefined(data.data_list)) {
        $scope.pandlData = data.data_list;
        console.log(data.data_list);
      } else {
        $scope.pandlData = [];
        $scope.noData = true;
      }

      $scope.spinnerHide = true;

    };

    var fetchPandLData = function(pandlTag) {
      // console.log(pandlTag);
      // PlTrackerService.fetchPandLData(pandlRHandler, pandlTag);
    };


    $scope.$on('PL_DATECHANGE_EVENT', function(event) {
      $scope.initializeView();
    });

    // $scope.initializeView();

    // $scope.goToPAndLCharts = function (item) {
    //     $state.go(item.ui_click_destination).then(function () {
    //         console.log('navigated to ' + item.ui_click_destination)
    //     })
    // }


  }

})();
