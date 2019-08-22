(function() {
  'use strict';
  projectCostByte.directive('summarycard', summarycard);
  summarycard.inject = ['$filter', '$ionicPopover', 'ErrorReportingServiceOne', '$ionicScrollDelegate', '$q', 'CommonService'];

  function summarycard($filter, $ionicPopover, ErrorReportingServiceOne, $ionicScrollDelegate, $q, CommonService) {
    return {
      restrict: 'E',
      templateUrl: 'application/task-manager/view/summaryCardView.html',
      scope: {
        cardName: '=',
        cardData: '=',
        cardDiff: '=',
        cardDataFilter: '=',
        cardDiffFilter: '=',
        reverseDiffColor: '=',
        clickDestination: '=',
        cardIcon: '=',
        childCard: '='
      },
      // link: function (scope, element, attribute) {
      link: {
        post: function(scope, element, attribute) {
          var sublist = element.parent()[0].querySelector('.sub-list');
          var once = function(seconds, callback) {
            var counter = 0;
            var time = window.setInterval(function() {
              counter++;
              if (counter >= seconds) {
                callback();
                window.clearInterval(time);
              }
            }, 450);
          };

          var slideDown = function(elem) {
            elem.style.maxHeight = elem.scrollHeight + 'px';
            once(1, function() {
              elem.style.overflow = '';
            });
            scope.$emit('ReSizeScroll');
            //                    $ionicScrollDelegate.resize();
          };
          var slideUp = function(elem) {
            elem.style.maxHeight = '0';
            once(1, function() {
              elem.style.overflow = 'hidden';
            });
            scope.$emit('ReSizeScroll');
            //                    $ionicScrollDelegate.resize();
          };

          scope.toggleList = function() {
            console.log('***************** toggleList ************');
            var expandButton = element[0].querySelector('[data-expand]');
            // console.log('expandButton: ',expandButton);
            if (expandButton.classList.contains('ion-chevron-down')) {
              slideDown(sublist);
              scope.down = true;
            } else {
              slideUp(sublist);
              scope.down = false;
            }
            expandButton.classList.toggle('ion-chevron-up');
            expandButton.classList.toggle('ion-chevron-down');
          };
          // scope.toggleList();









          // link: function (scope, element, attribute) {
          scope.cardDataDisplay = scope.cardData;
          // console.log('scope.cardDataDisplay: ',scope.cardDataDisplay);
          // console.log('scope.cardDataFilter: ',scope.cardDataFilter);
          if (angular.isDefined(scope.cardDataFilter)) {
            // console.log('******************* if ***************');
            scope.cardDataDisplay = $filter(scope.cardDataFilter)(scope.cardData)
            // console.log('scope.cardDataDisplayIN: ',scope.cardDataDisplay);
          }

          scope.cardDiffDisplay = scope.cardDiff;
          if (angular.isDefined(scope.cardDiffFilter)) {
            scope.cardDiffDisplay = $filter(scope.cardDiffFilter)(Math.abs(scope.cardDiff));
            if (scope.cardDiff !== 0) {
              scope.cardDiffDisplay = (scope.cardDiff > 0 ? "+" : "-") + scope.cardDiffDisplay;
            }
          }

          scope.colorReverser = 1;
          // console.log("scope.reverseDiffColor: ",scope.reverseDiffColor);
          if (angular.isDefined(scope.reverseDiffColor)) {
            if (scope.reverseDiffColor) {
              scope.colorReverser = -1;
            }
          }


          let fetchLatestDateRH = function(date) {
            // console.log('fetchLatestDateRH');
            scope.latestDate = date;
            CommonService.setSelectedDate(new Date(date));
            fetchHealthTrackerData(scope.timePeriod);

          };
          let fetchDisabledDatesRH = function(dates) {
            scope.datesDisabled = _.transform(dates, function(result, aDate) {
              result.push(new Date(aDate));
            });

          };



          scope.$broadcast('DBSUMMARY_BUSY');
          scope.timePeriod = "DAILY";
          // scope.navBarTitle.showToggleButton = true;

          scope.latestDate = moment.utc().startOf("day").format('MM/DD/YYYY');

          let nowDate = new Date();
          let pastDate = new Date(nowDate.setMonth(nowDate.getMonth() - 6));
          CommonService.fetchLatestDate(fetchLatestDateRH, pastDate, new Date());
          CommonService.fetchDisabledDates(fetchDisabledDatesRH, new Date(2016, 6, 1), new Date());






          // initialize popover for error reporting
          $ionicPopover.fromTemplateUrl('application/error-reporting/reportPopover.html', {
              scope: scope
            })
            .then(function(popover) {
              scope.errorReportPopover = popover;
              scope.errorReporting = function() {
                scope.errorReportPopover.hide();
                ErrorReportingServiceOne.showErrorReportForm({
                    'page': 'dashboard-summary',
                    'component': scope.errorReportClickName,
                    'modalName': scope.errorReportPopover
                  }, {
                    'page': 'dashboard-summary',
                    'component': scope.errorReportClickName
                  }) //TODO change component key to component_type in API
                  .then(function(result) {

                  });
              }
            });

          scope.showReportPopover = function($event, name) {
            $event.preventDefault();
            $event.stopPropagation();
            scope.errorReportClickName = name;
            scope.errorReportPopover.show($event);
          };






          scope.groups = [{

              title: '',
              penjelasan: "<span>Here is the description of Place 1</span>",
              contents: [{
                line: "WHY?"
              }]
            },

          ];

          /* if given group is the selected group, deselect it else, select the given group */
          scope.toggleGroup = function(group) {
            if (scope.isGroupShown(group)) {
              scope.shownGroup = null;
            } else {
              scope.shownGroup = group;
            }
          };

          scope.isGroupShown = function(group) {
            // console.log('group: ',group);
            return scope.shownGroup === group;
          };





          scope.summaryData = [];
          let actualDataRH = function(dates, values, key) {
            // console.log('dates: ',dates);
            // console.log('values: ',values);
            // console.log('key: ',key);
            return $q(function(resolve, reject) {
              scope.summaryData['actual_' + key] = values[0];
              scope.childCard.summary = scope.summaryData;
              // console.log('scope.summaryData: ',scope.summaryData);
              resolve(true);
            });
          };

          let benchmarkDataRH = function(dates, benchmarkValues, key) {
            return $q(function(resolve, reject) {
              scope.summaryData['benchmark_' + key] = benchmarkValues[0];
              scope.summaryData['diff_' + key] = scope.summaryData['actual_' + key] - benchmarkValues[0];
              scope.childCard.summary = scope.summaryData;
              // console.log('scope.summaryData: ',scope.summaryData);
              resolve(true);
            });
          };







          var fetchHealthTrackerData = function(timePeriod) {
            // console.log('*** fetchHealthTrackerData ***',scope.childCard);
            scope.$broadcast('DBSUMMARY_BUSY');

            let promises_actual = [];
            let promises_benchmark = [];
            let promises_order = [];
            _.forEach(scope.childCard, function(card) {
              // console.log('card: ',card);
              promises_actual.push(card.getActualFunc(timePeriod, scope.latestDate));
              promises_benchmark.push(card.getBenchmarkFunc(timePeriod, scope.latestDate));
              promises_order.push(card.name)
            });

            $q.all(promises_actual).then(function(actualValues) {
              // console.log('actualValues: ',actualValues);
              let actualRHs = [];
              // console.log('promises_order: ',promises_order);
              _.forEach(promises_order, function(cardKey, orderIndex) {
                // console.log('cardKey: ',cardKey);
                // console.log('orderIndex: ',orderIndex);
                actualRHs.push(actualDataRH(actualValues[orderIndex].dates, actualValues[orderIndex].values, cardKey))
              });
              $q.all(actualRHs).then(function(actualFinishes) {
                $q.all(promises_benchmark).then(function(benchmarkValues) {
                  let benchmarkRHs = [];
                  _.forEach(promises_order, function(cardKey, orderIndex) {
                    // console.log('cardKey: ',cardKey);
                    // console.log('orderIndex: ',orderIndex);
                    benchmarkRHs.push(benchmarkDataRH(benchmarkValues[orderIndex].dates, benchmarkValues[orderIndex].values, cardKey))
                  });
                  $q.all(benchmarkRHs).then(function(benchmarkFinishes) {
                    scope.$broadcast('DBSUMMARY_FREE');
                  })
                })
              })
            });


          };


          scope.$on('DBSUMMARY_BUSY', function(event) {
            scope.spinnerHide = false;
            // $scope.spinnerShow = true;
          });

          scope.$on('DBSUMMARY_FREE', function(event) {
            scope.spinnerHide = true;
            // $scope.spinnerShow = false;
            $ionicScrollDelegate.resize();
          });







        }
      }
    };
  }
})();
