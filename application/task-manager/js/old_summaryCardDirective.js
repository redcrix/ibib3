(function() {
  'use strict';
  projectCostByte.directive('summarycard', summarycard);
  summarycard.inject = ['$filter', '$ionicPopover', 'ErrorReportingServiceOne'];

  function summarycard($filter, $ionicPopover, ErrorReportingServiceOne) {
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
      },
      link: function(scope, element, attribute) {
        scope.cardDataDisplay = scope.cardData;
        if (angular.isDefined(scope.cardDataFilter)) {
          scope.cardDataDisplay = $filter(scope.cardDataFilter)(scope.cardData)

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


      }
    };
  }
})();
