(function() {
  'use strict';
  projectCostByte.controller('SummaryCtrl', summaryCtrl);

  summaryCtrl.$inject = ['$q', '$scope', '$state', 'CommonService', 'HealthTrackerService', 'PlTrackerService', 'Utils', '$timeout', '$window', 'PromotionOptimizerService',
    '$ionicScrollDelegate', 'ionicDatePicker', '$ionicActionSheet', '$ionicPopover', '$ionicModal', 'ErrorReportingServiceOne', '$rootScope', '$ionicPopup', 'inventoryHomeSvc', '$ionicLoading'
  ];


  function summaryCtrl($q, $scope, $state, CommonService, HealthTrackerService, PlTrackerService, Utils, $timeout, $window, PromotionOptimizerService,
    $ionicScrollDelegate, ionicDatePicker, $ionicActionSheet, $ionicPopover, $ionicModal, ErrorReportingServiceOne, $rootScope, $ionicPopup, inventoryHomeSvc, $ionicLoading) {

    let fetchDisabledDatesRH = function(dates) {
      $scope.datesDisabled = _.transform(dates, function(result, aDate) {
        result.push(new Date(aDate));
      });

    };

    var toastMessage = function(message_text, duration) {
      if (typeof duration === 'undefined') duration = 1500;
      $ionicLoading.show({
        template: message_text,
        noBackdrop: true,
        duration: duration,
      });
    };

    $scope.summaryData = {};
    $scope.actualStatsData = HealthTrackerService.fetchHealthTrackerSalesSummaryDataActual;
    $scope.banchMarkStatsData = HealthTrackerService.fetchHealthTrackerSalesSummaryDataBenchMark;

    $scope.dataCards = [{
        name: 'Sales',
        // getActualFunc: HealthTrackerService.fetchHealthTrackerSalesSummaryDataActual,
        // getBenchmarkFunc: HealthTrackerService.fetchHealthTrackerSalesSummaryDataBenchMark,

        dataFilter: 'currency',
        diffFilter: 'currency',
        clickDestination: 'app.health-tracker-tab.healthTracker'
      },
      {
        name: 'Food Sales',
        // getActualFunc: HealthTrackerService.fetchHealthTrackerFoodSalesSummaryDataActual,
        // getBenchmarkFunc: HealthTrackerService.fetchHealthTrackerFoodSalesSummaryDataBenchMark,
        dataFilter: 'currency',
        diffFilter: 'currency',
        clickDestination: 'app.health-tracker-tab.healthTracker'
      },
      {
        name: 'Beverage Sales',
        // getActualFunc: HealthTrackerService.fetchHealthTrackerBeverageSummarySalesActual,
        // getBenchmarkFunc: HealthTrackerService.fetchHealthTrackerBeverageSummarySalesBenchmark,
        dataFilter: 'currency',
        diffFilter: 'currency',
        clickDestination: 'app.health-tracker-tab.healthTracker'
      },
      {
        name: 'Beer Sales',
        // getActualFunc: HealthTrackerService.fetchHealthTrackerBeerSummarySalesActual,
        // getBenchmarkFunc: HealthTrackerService.fetchHealthTrackerBeerSummarySalesBenchmark,
        dataFilter: 'currency',
        diffFilter: 'currency',
        clickDestination: 'app.health-tracker-tab.healthTracker'
      },
      {
        name: 'Wine Sales',
        // getActualFunc: HealthTrackerService.fetchHealthTrackerWineSummarySalesActual,
        // getBenchmarkFunc: HealthTrackerService.fetchHealthTrackerWineSummarySalesBenchmark,
        dataFilter: 'currency',
        diffFilter: 'currency',
        clickDestination: 'app.health-tracker-tab.healthTracker'
      },
      {
        name: 'Spirit Sales',
        // getActualFunc: HealthTrackerService.fetchHealthTrackerSpiritSummarySalesActual,
        // getBenchmarkFunc: HealthTrackerService.fetchHealthTrackerSpiritSummarySalesBenchmark,
        dataFilter: 'currency',
        diffFilter: 'currency',
        clickDestination: 'app.health-tracker-tab.healthTracker'
      },
      {
        name: 'Food Cost',
        // getActualFunc: HealthTrackerService.fetchHealthTrackerFoodCostSummaryDataActual,
        // getBenchmarkFunc: HealthTrackerService.fetchHealthTrackerFoodCostSummaryDataBenchMark,
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

    $scope.newDataCardsPairs = [
      [0, 1],
      [2, 3],
      [4]
    ];

    $scope.$on('$ionicView.beforeEnter', function(event, viewData) {
      viewData.enableBack = true;
    });
    var setPandYdata = function(periodDataList) {
      console.log(' **** setPandYdata ****');
      $scope.periodList = [];
      $scope.yearList = [];
      var unique = {};
      var temp = "";
      var insertIndex = 0;
      for (var i = 0; i < periodDataList.length; i++) {
        if (!unique[periodDataList[i].year]) {
          $scope.yearList.push({
            text: periodDataList[i].year,
            selected: periodDataList[i].selected
          });
          unique[periodDataList[i].year] = periodDataList[i];
        }
        if (angular.isDefined($rootScope.globalSelectedYear)) {
          temp = $rootScope.globalSelectedYear;
        } else if (periodDataList[i].selected) {
          temp = periodDataList[i].year;
          $rootScope.globalSelectedYear = temp;
          $rootScope.globalSelectedPeriod = periodDataList[i];
        }
      }
      for (var i = 0; i < $scope.yearList.length; i++) {
        if ($scope.yearList[i].text === temp) {
          $scope.yearList[i].selected = true;
          for (var j = 0; j < periodDataList.length; j++) {
            if (temp === periodDataList[j].year) {
              $scope.periodList[insertIndex] = periodDataList[j];
              insertIndex++
            }
          }
        }
      }
      if (angular.isDefined($scope.periodList)) {
        _.each($scope.periodList, function(p) {
          if (p.text == $rootScope.globalSelectedPeriod.text) {
            p.selected = true;
          }
        })
      }
    }
    $scope.initializeView = function() {
      $scope.pageTitle = "My Dashboard";
      $scope.$broadcast('DBSUMMARY_BUSY');
      $scope.timePeriod = "DAILY";
      $scope.periodSelectionSel = 'Period';
      $scope.navBarTitle.showToggleButton = true;
      $scope.fetchLatestDateRH = function(date) {
        console.log("date", date);
        $scope.latestDate = date;
        CommonService.setSelectedDate(new Date(date));
        fetchHealthTrackerDataOld($scope.timePeriod);
        PlTrackerService.fetchPeriodWeeksWithData()
          .then(function(periodListWithData) {
            // console.log(periodListWithData);
            $scope.completePeriodList = periodListWithData;
            setPandYdata(periodListWithData);
            // $timeout(setWeeksFilterButtons, 1);
          });

      };

      $scope.latestDate = moment.utc().startOf("day").format('MM/DD/YYYY');

      let nowDate = new Date();
      let pastDate = new Date(nowDate.setMonth(nowDate.getMonth() - 6));
      CommonService.fetchLatestDate($scope.fetchLatestDateRH, pastDate, new Date());
      CommonService.fetchDisabledDates(fetchDisabledDatesRH, new Date(2016, 6, 1), new Date());
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


    };

    $scope.showModal = function() {
      // console.log(animation);
      $ionicModal.fromTemplateUrl('application/task-manager/view/overview_new.html', {
        scope: $scope,
        // animation: 'animated fadeInDown',
        hideDelay: 500
      }).then(function(modal) {
        $scope.modal = modal;
        $scope.modal.show();
      });
    };

    $scope.hideModal = function() {
      $scope.modal.hide();
      // Note that $scope.$on('destroy') isn't called in new ionic builds where cache is used
      // It is important to remove the modal to avoid memory leaks
      $scope.modal.remove();

      // reset data
      $scope.initializeViewOverView();

    }

    let actualDataRH = function(dates, values, key) {
      // console.log('actualDataRH: ',key);
      return $q(function(resolve, reject) {
        // $scope.summaryData['actual_' + key] = values[0];
        let combinedKey = 'total' + key.replace(/ /g, '');
        let totalActualVal = _.filter(values, function(o, k) {
          // console.log(k,o);
          return k == combinedKey;
        });
        $scope.summaryData['actual_' + key] = parseFloat(totalActualVal[0]).toFixed(2);
        // console.log($scope.summaryData);
        resolve(true);
      });
    };

    let benchmarkDataRH = function(dates, benchmarkValues, key) {
      return $q(function(resolve, reject) {
        // $scope.summaryData['benchmark_' + key] = benchmarkValues[0];
        // $scope.summaryData['diff_' + key] = $scope.summaryData['actual_' + key] - benchmarkValues[0];
        let combinedKey = 'total' + key.replace(/ /g, '');
        let totalBenchmarkVal = _.filter(benchmarkValues, function(o, k) {
          return k == combinedKey;
        });
        $scope.summaryData['benchmark_' + key] = totalBenchmarkVal[0];
        $scope.summaryData['diff_' + key] = $scope.summaryData['actual_' + key] - totalBenchmarkVal[0];
        resolve(true);
      });
    };

    $scope.showPeriod = function() {
      let hideSheet = $ionicActionSheet.show({
        buttons: [{
            text: 'Daily'
          },
          {
            text: 'Weekly'
          }
        ],
        titleText: '<h4>Select Period</h4>',
        cancelText: 'Cancel',
        cancel: function() {},
        buttonClicked: function(index) {
          $scope.$broadcast('DBSUMMARY_BUSY');
          if (index == '0') {
            $scope.timePeriod = 'DAILY';
          }
          if (index == '1') {
            $scope.timePeriod = 'WEEKLY';
          }
          CommonService.fetchLatestDate($scope.fetchLatestDateRH, new Date(2016, 6, 1), new Date());

          hideSheet();
        }
      });
    };



    var fetchHealthTrackerDataOld = function(timePeriod) {
      $scope.$broadcast('DBSUMMARY_BUSY');
      console.log("timePeriod", timePeriod,$scope.latestDate);
      let promises_actual = [];
      let promises_benchmark = [];
      let promises_order = [];
      if (timePeriod.includes('PERIOD')) {
        promises_actual.push($scope.actualStatsData(timePeriod, $scope.actualDate));
        promises_benchmark.push($scope.banchMarkStatsData($scope.benchmarkPeriod, $scope.benchmarkDate));
      } else {
        promises_actual.push($scope.actualStatsData(timePeriod, $scope.latestDate));
        promises_benchmark.push($scope.banchMarkStatsData(timePeriod, $scope.latestDate));
      }
      _.forEach($scope.dataCards, function(card) {
        promises_order.push(card.name)
      });

      // _.forEach($scope.dataCards, function(card) {
      //   if(timePeriod.includes('PERIOD')){
      //     // console.log(card);
      //     promises_actual.push(card.getActualFunc(timePeriod, $scope.actualDate));
      //     promises_benchmark.push(card.getBenchmarkFunc($scope.benchmarkPeriod, $scope.benchmarkDate));
      //     promises_order.push(card.name)
      //   }else{
      //     promises_actual.push(card.getActualFunc(timePeriod, $scope.latestDate));
      //     promises_benchmark.push(card.getBenchmarkFunc(timePeriod, $scope.latestDate));
      //     promises_order.push(card.name)
      //   }
      // });

      // $q.all(promises_actual).then(function(actualValues) {
      //   console.log(actualValues);
      //   let actualRHs = [];
      //   _.forEach(promises_order, function(cardKey, orderIndex) {
      //     actualRHs.push(actualDataRH(actualValues[orderIndex].dates, actualValues[orderIndex].values, cardKey))
      //   });
      //   $q.all(actualRHs).then(function(actualFinishes) {
      //     $q.all(promises_benchmark).then(function(benchmarkValues) {
      //       let benchmarkRHs = [];
      //       _.forEach(promises_order, function(cardKey, orderIndex) {
      //         benchmarkRHs.push(benchmarkDataRH(benchmarkValues[orderIndex].dates, benchmarkValues[orderIndex].values, cardKey))
      //       });
      //       $q.all(benchmarkRHs).then(function(benchmarkFinishes) {
      //         $scope.$broadcast('DBSUMMARY_FREE');
      //       })
      //     })
      //   })
      // });

      $q.all(promises_actual).then(function(actualValues) {
        // console.log(actualValues);
        let actualRHs = [];
        _.forEach(promises_order, function(cardKey, orderIndex) {
          // console.log(cardKey, orderIndex);
          actualRHs.push(actualDataRH(actualValues[0].dates, actualValues[0].values, cardKey));
        });
        $q.all(actualRHs).then(function(actualFinishes) {
          $q.all(promises_benchmark).then(function(benchmarkValues) {
            let benchmarkRHs = [];
            _.forEach(promises_order, function(cardKey, orderIndex) {
              benchmarkRHs.push(benchmarkDataRH(benchmarkValues[0].dates, benchmarkValues[0].values, cardKey))

            });
            $q.all(benchmarkRHs).then(function(benchmarkFinishes) {
              console.log();
              $scope.$broadcast('DBSUMMARY_FREE');
            })
          })
        })
      });


    };

    // var fetchHealthTrackerData = function(timePeriod) {
    //   $scope.$broadcast('DBSUMMARY_BUSY');

    //   let promises_actual = [];
    //   let promises_benchmark = [];
    //   let promises_order = [];
    //   _.forEach($scope.newDataCards, function(card) {
    //     // console.log(card.name, card.WeeklyOnly);
    //     if ($scope.timePeriod == "WEEKLY") {
    //       card.visible = true;
    //     } else if ($scope.timePeriod == "DAILY" && !card.WeeklyOnly) {
    //       card.visible = true;
    //     }
    //     // console.log(card);
    //     promises_actual.push(card.getActualFunc(timePeriod, $scope.latestDate));
    //     promises_benchmark.push(card.getBenchmarkFunc(timePeriod, $scope.latestDate));
    //     promises_order.push(card.name)
    //   });
    //   // console.log(promises_actual);
    //   $q.all(promises_actual).then(function(actualValues) {
    //     // console.log(actualValues);
    //     let actualRHs = [];
    //     _.forEach(promises_order, function(cardKey, orderIndex) {
    //       actualRHs.push(actualDataRH(actualValues[orderIndex].dates, actualValues[orderIndex].values, cardKey))
    //     });
    //     $q.all(actualRHs).then(function(actualFinishes) {
    //       $q.all(promises_benchmark).then(function(benchmarkValues) {
    //         let benchmarkRHs = [];
    //         _.forEach(promises_order, function(cardKey, orderIndex) {
    //           benchmarkRHs.push(benchmarkDataRH(benchmarkValues[orderIndex].dates, benchmarkValues[orderIndex].values, cardKey))
    //         });
    //         $q.all(benchmarkRHs).then(function(benchmarkFinishes) {
    //           $scope.$broadcast('DBSUMMARY_FREE');
    //         })
    //       })
    //     })
    //   });


    // };

    $scope.$on('DBSUMMARY_BUSY', function(event) {
      $scope.spinnerHide = false;
      // $scope.spinnerShow = true;
      var el = angular.element(document.querySelectorAll('#my-sales-export'));
      el[0].style.display = "none";
    });

    $scope.$on('DBSUMMARY_FREE', function(event) {
      $scope.spinnerHide = true;
      var el = angular.element(document.querySelectorAll('#my-sales-export'));
      el[0].style.display = "block";
      // console.log($scope.summaryData);
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

    $scope.check = function(business) {
      var returnFlag = _.find($scope.businesses, function(obj) {
        return obj.business_id === business.business_id && obj.business_name === business.business_name && obj.selected;
      })
      return returnFlag;
    }

    $scope.switch = function(sel) {
      // console.log($scope.businesses, sel);
      var switchDone = false;
      angular.forEach($scope.businesses, function(b, index) {
        if (b.business_id === sel.business_id && b.business_name === sel.business_name && !b.selected) {
          console.log(b);
          b.selected = true;
          switchDone = true;
          Utils.setLocalValue('sessionId', b.session_id);
        } else {
          b.selected = false;
        }
        if (index + 1 == $scope.businesses.length) {
          console.log(switchDone);
          if (switchDone) {
            console.log(" business");
            Utils.setLocalValue('businesses', JSON.stringify($scope.businesses));
            // REFRESH APP
            Utils.refreshApp().then(function() {
              $state.go('app.dashboard.summary').then(function() {
                $window.location.reload(true);
              });
            });
          } else {
            console.log("same business");
          }
        }
      });
    };



    $scope.initializeViewOverView = function() {
      $scope.$broadcast('DBSUMMARY_BUSY_OverView');
      $scope.pageTitleOverView = "Overview";
      $scope.periodSelection = 'Period';
      $scope.businesses = JSON.parse(Utils.getLocalValue('businesses'));

      let responseHandler = function(businessListData) {
        // console.log(businessListData);
        $scope.businessList = businessListData.businesses;

        PlTrackerService.fetchPeriodWeeks()
          .then(function(periodListData) {
            console.log("periodListData", periodListData);
            $scope.periodList = periodListData;
            // $scope.originalPeriodList = periodListData;
            $scope.headerShow = true;
            $timeout(setWeeksFilterButtonsOverView, 1);
          });

      };
      CommonService.fetchBusinesses(responseHandler);
    };


    let actualDataRHOverView = function(datas, key) {
      return $q(function(resolve, reject) {
        // console.log(datas, key);
        $scope.overViewData[datas.business_id + ":" + datas.field] = datas.values;
        resolve(true);
      });
    };

    // $scope.dataCardsOverView = [{
    //     name: 'Sales',
    //     getFunc: HealthTrackerService.fetchOverviewData,
    //     dataFilter: 'currency',
    //     diffFilter: 'currency',
    //     field: 'TOTAL_SALES',
    //     clickDestination: 'app.health-tracker-tab.healthTracker'
    //   },
    //   {
    //     name: 'Profit After Prime',
    //     getFunc: HealthTrackerService.fetchOverviewData,
    //     dataFilter: 'currency',
    //     diffFilter: 'currency',
    //     field: 'AFTER_PRIME_PROFIT',
    //     clickDestination: 'app.health-tracker-tab.healthTracker'
    //   },
    //   {
    //     name: 'Food Cost',
    //     getFunc: HealthTrackerService.fetchOverviewData,
    //     dataFilter: 'shortPercent',
    //     diffFilter: 'shortPercent',
    //     field: 'FOOD_COST',
    //     reverseDiffColor: true,
    //     clickDestination: 'app.health-tracker-tab.healthTracker-cogs'
    //   },
    //   {
    //     name: 'Labor Cost',
    //     getFunc: HealthTrackerService.fetchOverviewData,
    //     dataFilter: 'shortPercent',
    //     diffFilter: 'shortPercent',
    //     field: 'TOTAL_LABOR_COST',
    //     reverseDiffColor: true,
    //     clickDestination: 'app.health-tracker-tab.healthTracker-cogs'
    //   }
    // ];

    $scope.dataCardsPairsOverView = [
      [0],
      [1],
      [2],
      [3]
    ];

    $scope.periodDetailSelectionOverView = function(showDates) {
      if (angular.isDefined($scope.periodList)) {
        let selectedPeriod = _.find($scope.periodList, ['selected', true]);
        if (showDates) {
          return selectedPeriod.text + ' (' + selectedPeriod.year + ')';
        } else {
          return selectedPeriod.label;
        }
      }
      return ""
    }
    // var responseHandlerNew = function(data){
    //   console.log("res data",data);
    // }

    var fetchHealthTrackerDataOverView = function(timePeriod) {
      $scope.$broadcast('DBSUMMARY_BUSY_OverView');
      console.log("timePeriod", timePeriod);
      // CommonService.dashboardNewApi(responseHandlerNew,timePeriod);
      let promises_actual = [];
      // let promises_benchmark = [];
      let promises_order = [];

      _.forEach($scope.businessList, function(business) {
        // console.log(business);
        // _.forEach($scope.dataCardsOverView, function(card) {
        //   promises_actual.push(card.getFunc(timePeriod, card.field, business.business_store_id, business.business_id));
        //   // promises_benchmark.push(card.getBenchmarkFunc(timePeriod, $scope.latestDate));
        //   promises_order.push(card.name)
        // });
      });

      $q.all(promises_actual).then(function(actualValues) {
        let actualRHs = [];
        _.forEach(promises_order, function(cardKey, orderIndex) {
          // console.log(actualValues);
          actualRHs.push(actualDataRHOverView(actualValues[orderIndex], cardKey))
        });
        $q.all(actualRHs).then(function(actualFinishes) {
          console.log("finish");

          // $q.all(promises_benchmark).then(function (benchmarkValues) {
          //     let benchmarkRHs = [];
          //     _.forEach(promises_order, function (cardKey, orderIndex) {
          //         benchmarkRHs.push(benchmarkDataRH(benchmarkValues[orderIndex].dates, benchmarkValues[orderIndex].values, cardKey))
          //     });
          //     $q.all(benchmarkRHs).then(function (benchmarkFinishes) {
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
      // console.log($scope.overViewData);
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
          // console.log(selectedWeekButton, $scope.filterButtons[selectedWeekButton]);

          $scope.filterbuttonclickOverView(selectedWeekButton);
          console.log("selectedWeekButton", selectedWeekButton);
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
      // console.log($scope.filterButtons[filterbuttonindex].periodWeekTag);
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

    $scope.showPeriodDates = false;
    $scope.showPeriodSelect = function() {
      $scope.showPeriodDates = true;
      if ($scope.periodSelectionSel === 'Period') {
        var hideSheet = $ionicActionSheet.show({
          buttons: $scope.periodList,
          titleText: '<h4><center>Select Period</center></h4>',
          cancelText: 'Cancel',
          cancel: function() {},
          buttonClicked: function(index) {
            _.each($scope.periodList, function(p, pIndex) {
              if (index === pIndex) {
                console.log(index, p);
                p.selected = true;
                $rootScope.globalSelectedPeriod = p;
                $rootScope.globalSelectedPeriodIndex = undefined;
                $scope.actualDate = moment(new Date(p.startDate * 1000)).format('MM/DD/YYYY');
                if ($scope.periodList[index - 1]) {
                  $scope.benchmarkDate = moment(new Date($scope.periodList[index - 1].endDate * 1000)).format('MM/DD/YYYY');
                  $scope.benchmarkPeriod = $scope.periodList[index - 1].periodTag;
                } else {
                  $scope.benchmarkDate = $scope.latestDate;
                  $scope.benchmarkPeriod = p.periodTag;
                }
                console.log($scope.actualDate, $scope.benchmarkDate);
                $scope.selectedPeriodForExport = p.periodTag;

                // console.log($scope.benchmarkPeriod);
                fetchHealthTrackerDataOld(p.periodTag);
                // $timeout(setWeeksFilterButtons, 1);
              } else {
                p.selected = false;
              }
            });
            return true;
          }
        });
      }
      var myEl = angular.element(document.querySelector('.action-sheet-group'));
      myEl.css('overflow-y', 'scroll');
      myEl.css('max-height', (window.innerHeight - 50) + 'px');
      // myEl.css('max-width', (window.innerWidth - 120) + 'px');
    };
    $scope.periodDetailSelection = function() {
      // console.log('*************** periodDetailSelection *************');
      if (angular.isDefined($scope.periodList)) {
        var selectedPeriod = {};
        _.each($scope.periodList, function(p, pIndex) {
          if (angular.isDefined($rootScope.globalSelectedPeriod) && p.text == $rootScope.globalSelectedPeriod.text) {
            // console.log('*** if ****');
            p = $rootScope.globalSelectedPeriod;
            // console.log(p);
            selectedPeriod = p;
          } else if (!angular.isDefined($rootScope.globalSelectedPeriod)) {
            // console.log('**** else ****');
            if (pIndex == $scope.periodList[$scope.periodList.length - 1]) {
              // console.log('*** else if ****');
              p.selected = true
              $rootScope.globalSelectedPeriod = p;
              // console.log(p);
              selectedPeriod = p;
            }
          }
        })
        // console.log(selectedPeriod.text);
        $scope.selectedPeriodForExport = selectedPeriod.periodTag;
        return selectedPeriod.text;
      }
      return ""
    }

    function getUserEmailId() {
      return $q(function(resolve, reject) {
        CommonService.getUserDefaullEmailId(function(emailIdData) {
          resolve(emailIdData.data.emailId);
        })
      })
    }

    getUserEmailId().then(function(userEmailId) {
      $scope.userEmailId = userEmailId;
    });

    $scope.exportFilters = [{
        "id": 1,
        "name": "Daily"
      },
      {
        "id": 2,
        "name": "Weekly"
      },
      {
        "id": 3,
        "name": "Period"
      },
      {
        "id": 4,
        "name": "Date Range"
      }
    ];

    $scope.setFilter = function(item) {
      console.log(item.name);
      $scope.selectedExportData.latestDate = $scope.latestDate;
      if (item.name == "Period") {
        console.log('*** if ****');
        $scope.selectedExportData.type = $scope.selectedPeriodForExport;
      } else {
        $scope.selectedExportData.type = item.name;
      }
      var myElement = angular.element(document.querySelector('#filter-list_' + item.id));
      myElement.addClass('inventory-item-selected');
      _.forEach($scope.exportFilters, function(value) {
        if (value.id != item.id) {
          var otherElement = angular.element(document.querySelector('#filter-list_' + value.id));
          otherElement.removeClass('inventory-item-selected');
        }
      });
      var elForm = angular.element(document.querySelectorAll('.myExportForm'));
      if (item.name == "Date Range") {
        $scope.showRange = true;
        elForm[0].style.height = "450px";
        elForm[0].style.overflowY = "scroll";
      } else {
        $scope.showRange = false;
        elForm[0].style.height = "250px";
        elForm[0].style.overflowY = "scroll";
      }
    }
    $scope.openDatePickerFilter = function(type) {
      var datepickerObject = {
        callback: function(val) { //Mandatory
          // console.log(val);
          if (type == "startDate") {
            $scope.selectedExportData.startDatetimeValue = new Date(val);
            $scope.startFilterDate = val;
          } else {
            $scope.selectedExportData.endDatetimeValue = new Date(val);
            $scope.endFilterDate = val;
          }
        },
        disabledDates: [],
        from: new Date(2016, 6, 1), //Optional
        to: new Date(), //Optional
        inputDate: new Date(), //Optional
        mondayFirst: true, //Optional
        disableWeekdays: [], //Optional
        closeOnSelect: false, //Optional
        templateType: 'popup' //Opional
      }
      ionicDatePicker.openDatePicker(datepickerObject);
    }
    $scope.openPrompt = function() {
      $scope.selectedFilter = "";
      $scope.showRange = false;
      $scope.selectedExportData = {};
      $scope.selectedExportData.startDatetimeValue = new Date();
      $scope.selectedExportData.endDatetimeValue = new Date();
      $scope.selectedExportData.userEmailId = $scope.userEmailId;
      $scope.selectedExportData.userEmailIdNew = '';
      var confirmPopup = $ionicPopup.show({
        scope: $scope,
        template: `<form name="exportForm" style="overflow-y: scroll;" class="myExportForm">
                      <ion-list>
                          <div class="card" style="margin:unset;">
                              <div ng-repeat="item in exportFilters track by $index" class="card" style="margin: 0px 0px;">
                                <ion-item ng-click="setFilter(item)" id="filter-list_{{item.id}}" style="border: 0;padding: 3%;border-bottom: 1px solid lightgray;">
                                    <span>{{item.name}}<span>
                                </ion-item>
                                <div ng-if="showRange && item.name=='Date Range'">
                                  <ion-list>
                                    <div class="card" style="margin:unset;">
                                      <ion-item style="padding:0px 10px 5px 10px;">
                                      <div class="row" style="font-size:80%;">Start Date:</div>
                                      <div class="row inventory-text-left" ng-click="openDatePickerFilter('startDate')" style="padding: 5px; background: lightgray;margin-bottom: 10px;" >
                                          {{selectedExportData.startDatetimeValue| date: "MM/dd/yyyy"}}
                                      </div>
                                      <div class="row" style="font-size:80%;">End Date:</div>
                                      <div class="row inventory-text-left" ng-click="openDatePickerFilter('endDate')" style="padding: 5px; background: lightgray;" >
                                          {{selectedExportData.endDatetimeValue| date: "MM/dd/yyyy"}}
                                      </div>
                                      </ion-item>
                                    </div>
                                  </ion-list>
                                </div>
                              </div>
                            </div>
                    </ion-list>
                    <div style="margin-right: 35%;margin-top: 3%;font-weight: 350;">Enter alternative email</div>
                    <div class="smaller" style="margin-bottom: 20%;">
                    <input type="text" name="exportNewEmail" style="padding:5px;" placeholder="{{ selectedExportData.userEmailId }}" ng-model="selectedExportData.userEmailIdNew" required/>
                    </div>
                </form>`,
        title: 'Export data',
        subTitle: 'Select filter',
        cssClass: 'text-center popup-export',
        buttons: [{
            text: 'Cancel'
          },
          {
            text: '<b>Send</b>',
            type: 'button-bal',
            onTap: function(e) {
              e.preventDefault();
              var pattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
              $scope.selectedExportData.userEmailId = !$scope.selectedExportData.userEmailIdNew ? $scope.selectedExportData.userEmailId : $scope.selectedExportData.userEmailIdNew;
              $scope.startFilterDate = moment($scope.startFilterDate ? $scope.startFilterDate : new Date($scope.selectedExportData.startDatetimeValue)).format('MM/DD/YYYY');
              $scope.endFilterDate = moment($scope.endFilterDate ? $scope.endFilterDate : new Date($scope.selectedExportData.endDatetimeValue)).format('MM/DD/YYYY');

              $scope.selectedExportData.userEmailIdNew = !$scope.selectedExportData.userEmailIdNew ? $scope.selectedExportData.userEmailId : $scope.selectedExportData.userEmailIdNew;


              $scope.selectedExportData.userEmailId = !$scope.selectedExportData.userEmailIdNew ? $scope.selectedExportData.userEmailId : (pattern.test($scope.selectedExportData.userEmailIdNew) ? $scope.selectedExportData.userEmailIdNew : $scope.selectedExportData.userEmailId);
              // $scope.selectedExportData.userEmailId = (pattern.test($scope.selectedExportData.userEmailIdNew) ? $scope.selectedExportData.userEmailIdNew : $scope.selectedExportData.userEmailId);
              // $scope.selectedExportData.userEmailIdNew = !$scope.selectedExportData.userEmailIdNew ? $scope.selectedExportData.userEmailId : $scope.selectedExportData.userEmailIdNew;
              $scope.selectedExportData.userEmailIdNew = $scope.selectedExportData.userEmailId;

              if (!$scope.selectedExportData.userEmailId) {
                toastMessage("Email is required");
              } else if (!pattern.test($scope.selectedExportData.userEmailId)) {
                toastMessage("Please Enter Valid Email");
              } else if (!$scope.selectedExportData.type) {
                toastMessage("Please select a filter");
              } else if ($scope.selectedExportData.type == "Date Range" && moment($scope.endFilterDate).isBefore($scope.startFilterDate)) {
                toastMessage("Please select valid end date.");
              } else {
                //
                $scope.selectedExportData.startDatetimeValue = moment($scope.selectedExportData.startDatetimeValue).format('MM/DD/YYYY');
                $scope.selectedExportData.endDatetimeValue = moment($scope.selectedExportData.endDatetimeValue).format('MM/DD/YYYY');
                //
                // console.log($scope.selectedExportData);
                // new Date(nowDate.setMonth(nowDate.getMonth() - 6));
                inventoryHomeSvc.exportSales($scope.selectedExportData).then(function(data, status) {
                  $scope.selectedExportData.userEmailId = $scope.userEmailId;
                  confirmPopup.close();
                  if (data.data.success) {
                    toastMessage("<span style='position: relative;bottom: 20px;'>Sales export request sent! </br> You will be receiving email shortly.</span>");
                  }
                });

              }
            }
          }
        ]
      });
    };

    var pandlRHandlerOverView = function(data) {

      if (angular.isDefined(data.data_list)) {
        $scope.pandlData = data.data_list;
        console.log(data.data_list);
      } else {
        $scope.pandlData = [];
        $scope.noData = true;
      }

      $scope.spinnerHideOverView = true;

    };


    $scope.$on('PL_DATECHANGE_EVENT', function(event) {
      $scope.initializeViewOverView();
    });

  }

  // function overviewCtrl($q, $scope, $parse, CommonService, HealthTrackerService, PlTrackerService, $ionicActionSheet, Utils, $state, $timeout) {
  //
  //
  // }

})();
