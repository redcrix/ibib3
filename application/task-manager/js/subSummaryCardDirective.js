(function () {
    'use strict';
    projectCostByte.directive('subsummarycard', subsummarycard);
    subsummarycard.inject = ['$filter', '$ionicPopover', 'ErrorReportingServiceOne','$ionicScrollDelegate','$q','CommonService'];

    function subsummarycard($filter, $ionicPopover, ErrorReportingServiceOne,$ionicScrollDelegate,$q,CommonService) {
        return {
            restrict: 'E',
            // require: 'summaryCard',
            templateUrl: 'application/task-manager/view/subSummaryCardView.html',
            scope: {
                subCardName: '=',
                subCardData: '=',
                subCardDiff: '=',
                subCardDataFilter: '=',
                subCardDiffFilter: '=',
                reverseDiffColor: '=',
                clickDestination: '=',
                subDataCards: '=',
                subCardIcon:'='
            },

            // link: function (scope, element, attribute) {
            link: { post: function (scope, element, attribute) {
                console.log('subCardData: ',scope.subCardData);
                // console.log('scope.subCardDataFilter: ',scope.subCardDataFilter);

                scope.subCardDataDisplay = scope.subCardData;
                if (angular.isDefined(scope.subCardDataFilter)) {
                    // console.log('******************* if ************');
                    scope.subCardDataDisplay = $filter(scope.subCardDataFilter)(scope.subCardData)

                }
                // console.log('scope.subCardDiff: ',scope.subCardDiff);
                scope.subCardDiffDisplay = scope.subCardDiff;
                console.log('scope.subCardDiffDisplay ',scope.subCardDiffDisplay);
                if (angular.isDefined(scope.subCardDiffFilter)) {
                    scope.subCardDiffDisplay = $filter(scope.subCardDiffFilter)(Math.abs(scope.subCardDiff));
                    if (scope.subCardDiff!==0) {
                        scope.subCardDiffDisplay = (scope.subCardDiff > 0 ? "+"  : "-") + scope.subCardDiffDisplay;
                    }
                }

                scope.colorReverser = 1;
                // console.log("scope.reverseDiffColor: ",scope.reverseDiffColor);
                if (angular.isDefined(scope.reverseDiffColor)) {
                    if (scope.reverseDiffColor) {
                        scope.colorReverser = -1;
                    }
                }



                // console.log("final "+scope.subDataCards);

                // initialize popover for error reporting
                $ionicPopover.fromTemplateUrl('application/error-reporting/reportPopover.html', {
                    scope: scope
                })
                    .then(function (popover) {
                        scope.errorReportPopover = popover;
                        scope.errorReporting = function () {
                            scope.errorReportPopover.hide();
                            ErrorReportingServiceOne.showErrorReportForm(
                                {
                                    'page': 'dashboard-summary',
                                    'component': scope.errorReportClickName,
                                    'modalName' : scope.errorReportPopover
                                },
                                {
                                    'page': 'dashboard-summary',
                                    'component': scope.errorReportClickName
                                }) //TODO change component key to component_type in API
                                .then(function (result) {

                                });
                        }
                    });

                scope.showReportPopover = function ($event, name) {
                    $event.preventDefault();
                    $event.stopPropagation();
                    scope.errorReportClickName = name;
                    scope.errorReportPopover.show($event);
                };

                // scope.subSummaryData = [];
                // let actualDataRH = function (dates, values, key) {
                //     // console.log('dates: ',dates);
                //     // console.log('values: ',values);
                //     // console.log('key: ',key);
                //     return $q(function (resolve, reject) {
                //         scope.subSummaryData['actual_' + key] = values[0];
                //         console.log('scope.subSummaryData: ',scope.subSummaryData);
                //         console.log('scope.subSummaryData: ',scope.subSummaryData);
                //         resolve(true);
                //     });
                // };
                //
                // let benchmarkDataRH = function (dates, benchmarkValues, key) {
                //     return $q(function (resolve, reject) {
                //         scope.subSummaryData['benchmark_' + key] = benchmarkValues[0];
                //         scope.subSummaryData['diff_' + key] = scope.subSummaryData['actual_' + key] - benchmarkValues[0];
                //         resolve(true);
                //     });
                // };
                //
                // var fetchHealthTrackerData = function (timePeriod) {
                //     // console.log('*** fetchHealthTrackerData ***',scope.childCard);
                //     scope.$broadcast('DBSUMMARY_BUSY');
                //
                //     let promises_actual = [];
                //     let promises_benchmark = [];
                //     let promises_order = [];
                //     _.forEach(scope.subDataCards, function (card) {
                //         // console.log('card: ',card);
                //         promises_actual.push(card.getActualFunc(timePeriod, scope.latestDate));
                //         promises_benchmark.push(card.getBenchmarkFunc(timePeriod, scope.latestDate));
                //         promises_order.push(card.name)
                //     });
                //
                //     $q.all(promises_actual).then(function (actualValues) {
                //         // console.log('actualValues: ',actualValues);
                //         let actualRHs = [];
                //         // console.log('promises_order: ',promises_order);
                //         _.forEach(promises_order, function (cardKey, orderIndex) {
                //             // console.log('cardKey: ',cardKey);
                //             // console.log('orderIndex: ',orderIndex);
                //             actualRHs.push(actualDataRH(actualValues[orderIndex].dates, actualValues[orderIndex].values, cardKey))
                //         });
                //         $q.all(actualRHs).then(function (actualFinishes) {
                //             $q.all(promises_benchmark).then(function (benchmarkValues) {
                //                 let benchmarkRHs = [];
                //                 _.forEach(promises_order, function (cardKey, orderIndex) {
                //                     console.log('cardKey: ',cardKey);
                //                     console.log('orderIndex: ',orderIndex);
                //                     benchmarkRHs.push(benchmarkDataRH(benchmarkValues[orderIndex].dates, benchmarkValues[orderIndex].values, cardKey))
                //                 });
                //                 $q.all(benchmarkRHs).then(function (benchmarkFinishes) {
                //                     scope.$broadcast('DBSUMMARY_FREE');
                //                 })
                //             })
                //         })
                //     });
                //
                //
                // };
                //
                // let fetchLatestDateRH = function (date) {
                //     console.log('fetchLatestDateRH');
                //     scope.latestDate = date;
                //     CommonService.setSelectedDate(new Date(date));
                //     fetchHealthTrackerData(scope.timePeriod);
                //
                // };
                // let fetchDisabledDatesRH = function (dates) {
                //     scope.datesDisabled = _.transform(dates, function (result, aDate) {
                //         result.push(new Date(aDate));
                //     });
                //
                // };
                //
                // scope.latestDate = moment.utc().startOf("day").format('MM/DD/YYYY');
                //
                // let nowDate = new Date();
                // let pastDate = new Date(nowDate.setMonth(nowDate.getMonth() - 6));
                // CommonService.fetchLatestDate(fetchLatestDateRH, pastDate, new Date());
                // CommonService.fetchDisabledDates(fetchDisabledDatesRH, new Date(2016, 6, 1), new Date());



                }
            }
        };
    }

})();