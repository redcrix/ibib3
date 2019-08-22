(function () {
    'use strict'
    projectCostByte.controller('ConfigConfirmationCtrl', ConfigConfirmationCtrl);

    ConfigConfirmationCtrl.$inject = ['$q', '$scope', '$state', '$filter', '$location', '$ionicSideMenuDelegate',
        '$rootScope', 'CommonService', 'CommonConstants', 'Utils', '$cordovaCamera', '$cordovaFileTransfer',
        'DocumentSelectionService', '$ionicLoading', '$ionicActionSheet', '$ionicModal', '$window','PlTrackerService','$timeout',
        '$stateParams','$ionicPopup','appModalService','parameters'
    ];

    function ConfigConfirmationCtrl($q, $scope, $state, $filter, $location, $ionicSideMenuDelegate, $rootScope,
        CommonService, CommonConstants, Utils, $cordovaCamera, $cordovaFileTransfer,
        DocumentSelectionService, $ionicLoading, $ionicActionSheet, $ionicModal, $window,PlTrackerService,$timeout,$stateParams,$ionicPopup,appModalService,parameters) {

        // console.log("$state$state$state",parameters)
        $scope.closeModalCtrl = function (result) {
            $scope.closeModal({
                'modal': 'closed'
            })
        }
        $scope.saveChanges = function() {
            // $scope.save();
            $scope.closeModal({
                'modal': 'closed'
            })
            $rootScope.$emit('saveChangesClled')
        }
        $scope.discardChanges = function() {
            $scope.closeModal({
                'modal': 'closed'
            })
            // console.log("$rootScope.discardChangesFrom",$rootScope.discardChangesFrom)
            $rootScope.isChagesExist = false;
            $rootScope.$emit('discardChangesFromClled',$rootScope.discardChangesFrom)
            // if($rootScope.discardChangesFrom.name == 'filterbuttonclick') {
            //     $scope.filterbuttonclick($rootScope.discardChangesFrom.value);
            // }
            
        }

    }
})();