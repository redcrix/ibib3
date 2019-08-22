(function() {
    'use strict';

    projectCostByte.controller('SettingsCtrl', settingsCtrl);

    settingsCtrl.$inject = ['$scope', 'CommonService', '$state', '$stateParams', 'CommonConstants','$http', 'decisionStoreFactory'];

    function settingsCtrl($scope, CommonService, $state, $stateParams, CommonConstants, $http, decisionStoreFactory) {
    $scope.navBarTitle.showToggleButton = true;

    $scope.documentUploadClickHandler = function() {
              $state.go('app.documentUpload');
    }

    $scope.fixedCostsClickHandler = function() {
              $state.go('app.fixedCosts');
    }

    $scope.laborCostsClickHandler = function() {
              $state.go('app.laborCosts');
        }

    }

})();
