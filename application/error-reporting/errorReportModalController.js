(function () {
    projectCostByte.controller('errorModalCtrl', errorModalCtrl);

    errorModalCtrl.$inject = ['$q', '$scope', '$state', '$stateParams', '$timeout', 'ErrorReportingServiceOne', '$rootScope', 'parameters', 'CommonService', 'Utils', '$ionicLoading','$ionicPlatform'];

    function errorModalCtrl($q, $scope, $state, $stateParams, $timeout, ErrorReportingServiceOne, $rootScope, parameters, CommonService, Utils, $ionicLoading, $ionicPlatform) {

        $scope.dataReceived = false;
        $scope.sendButtonColor = 'app-theme-color';
        $scope.sendButtonText = 'Send Error Report';
        // $scope.openModal()

        $scope.errorReport = {
            'selected_error': '',
            'selectedStore': null,
            'comments': null
        };

        $scope.stores = [];


        CommonService.fetchStores(function (data) {
            if (!!data && data.business_stores) {
                var local_current_store = Utils.getLocalValue('current_store', '0');
//        console.log(data.business_stores)
                $scope.stores = data.business_stores;
                if (_.find($scope.stores, ['store_id', local_current_store])) {
                    $scope.errorReport.selectedStore = local_current_store;
                } else {
                    $scope.errorReport.selectedStore = $scope.stores[0].store_id;
                }
            }
        });

        var paramNew = {
            component: parameters.component,
            page: parameters.page
        };


        $scope.reportedItem = angular.copy(paramNew);
        // console.log($scope.reportedItem)
        // console.log(parameters.modalName);
        $scope.myModal = parameters.modalName;
        ErrorReportingServiceOne.fetchCannedErrorMessages(parameters.messages_filter)
            .then(function (messagesData) {
                _.each(messagesData, function (message) {
                    message.selected = false;
                })

                $scope.cannedErrorOptions = messagesData

                $scope.dataReceived = true;
            })

        $scope.selectError = function (selectedIndex) {
            _.each($scope.cannedErrorOptions, function (message) {
                message.selected = false;
            })
            $scope.cannedErrorOptions[selectedIndex].selected = true;
            $scope.errorReport.selected_error = $scope.cannedErrorOptions[selectedIndex]
        }

        var toastMessage = function (message_text, duration) {
            if (typeof duration === 'undefined') duration = 1500;
            $ionicLoading.show({
                template: message_text,
                noBackdrop: true,
                duration: duration
            });
        };


        $scope.sendErrorReport = function () {
            console.log('Sending error report');


            if ($scope.errorReport.selected_error) {

                if ($scope.errorReport.selected_error.error_message === 'Custom' && !$scope.errorReport.comments) {
                    toastMessage("Description is required", 1200);
                } else if ($scope.errorReport.selected_error.error_message === 'Units is Incorrect' && !$scope.errorReport.comments) {
                    toastMessage("Please enter correct Unit", 1200);
                } else if (($scope.errorReport.selected_error.error_message === 'Price is incorrect' || $scope.errorReport.selected_error.error_message === 'Price is Incorrect') && !$scope.errorReport.comments) {
                      toastMessage("Price is Incorrect", 1200);
                } else {

                    $scope.sendButtonText = '   Sending Error Report...';
                    $scope.sendButtonColor = 'app-theme-color-transparent';

                    // console.log($scope);
                    // console.log("parameters: ", parameters);
                    // console.log('$scope.errorReport.selected_error: ', $scope.errorReport.selected_error);
                    let errorReport = $scope.errorReport.selected_error;

                    ErrorReportingServiceOne.userErrorReport(parameters.page, parameters.component, $scope.errorReport.selectedStore,
                        errorReport.error_message, $scope.errorReport.comments,
                        errorReport.error_id)
                        .then(function () {
                            console.log('error saved');
                            ErrorReportingServiceOne.showConfirmation()
                                .then(function (res) {
                                    console.log('Thank you for reporting the error');
                                    if($scope.myModal)
                                        $scope.myModal.hide();
                                    $scope.closeModal({'modal': 'closed', 'report': 'sent'});
                                });
                        })
                }
            } else {
                toastMessage("No reason is selected", 1200);
            }
        };

        // $ionicPlatform.registerBackButtonAction(function (event) {
        //     alert($state.current.name);
        //     // alert("i am here");
        //     console.log('closeModal');
        //     $scope.myModal.hide();
        //     $scope.closeModal({'modal': 'closed', 'report': 'not sent'})
        //
        // }, 100);

        // Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function() {
            // $scope.myModal.remove();
            // alert("$destroy");
        });
        // Execute action on hide modal
        $scope.$on('modal.hidden', function() {
            // Execute action
            if($scope.myModal)
                $scope.myModal.hide();
            $scope.closeModal({'modal': 'closed', 'report': 'not sent'})
            // alert("hidden");
        });
        // Execute action on remove modal
        $scope.$on('modal.removed', function() {
            // Execute action
            // alert("removed");
        });


        $scope.closeModalCtrl = function () {
            console.log('closeModal');
            if($scope.myModal)
                $scope.myModal.hide();
            $scope.closeModal({'modal': 'closed', 'report': 'not sent'})
        }
    }
})();
