(function () {
    'use strict';

    projectCostByte.directive('errorreportingpopup', errorreportingpopup);

    errorreportingpopup.$inject = ['ErrorReportingServiceOne', 'Utils', '$timeout', '$ionicModal', '$state', '$filter', 'Logger', '$rootScope'];

    function errorreportingpopup(ErrorReportingServiceOne, Utils, $timeout, $ionicModal, $state, $filter, Logger, $rootScope) {
        return {
            restrict: 'E',
            replace: true,
//            templateUrl: 'application/error-reporting/',
            scope: {
                errorReporting : "="
            },
            link: function ($scope, element, attribute) {

                $ionicModal.fromTemplateUrl('application/error-reporting/errorReportingPopupView.html', {
                    scope: $scope.errorReporting,
                    animation: 'slide-in-up'
                }).then(function(modal) {
                    $scope.modal = modal
                });

                $scope.errorReporting.openModal = function() {
                    $scope.modal.show()
                };


            }
        }
    };
})();
