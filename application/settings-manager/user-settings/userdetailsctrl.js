(function () {
    projectCostByte.controller('UserDetailsCtrl', UserDetailsCtrl);

    UserDetailsCtrl.$inject = ['UserManagerService', 'Utils', '$q', '$scope', '$rootScope', '$state', '$stateParams', '$timeout', '$ionicActionSheet', '$ionicScrollDelegate', '$ionicLoading'];

    function UserDetailsCtrl(UserManagerService, Utils, $q, $scope, $rootScope, $state, $stateParams, $timeout, $ionicActionSheet, $ionicScrollDelegate, $ionicLoading) {
        $scope.navBarTitle.showToggleButton = false;


        // user details to be displayed


         function getSkeleton(skeletonKey){
            UserManagerService.getSkeleton(skeletonKey).then(function(skeletonResponse){
                if(skeletonKey=='UserSettingsUserDetails'){
                    $scope.userDetails = skeletonResponse;
                }else if(skeletonKey=='UserSettingsJobRoleDetails'){
                    $scope.storeDetails = skeletonResponse;
                }

            })
        }
        $scope.init = function(){
            $scope.pageTitle = "User Details";
        }


        var fetchAllDropDownOptions = function () {
//            console.log($stateParams.userID)
            $scope.$broadcast('SHOWBUSY');
            UserManagerService.fetchAllDropDownOptions($stateParams.userID, 'all').then(function (ddoptions) {
                $scope.dropDownOptions = ddoptions;
                fetchUserData();
            })
        }

        var fetchUserData = function () {
            UserManagerService.fetchUser($stateParams.userID).then(function (user) {
//                console.log(user)
                $scope.user = user;
                setSaveStatus("Last edited on "+formatDate(user.updated_on), 'save-status-neutral')
                $scope.$broadcast('HIDEBUSY');
            })
        }


        $scope.saveClick = function () {
            setSaveStatus("Saving..." , 'save-status-neutral')
            UserManagerService.saveUser($stateParams.userID).then(function (saveResponse) {
//                console.log(saveResponse)
                if(saveResponse.saved){
                    setSaveStatus(saveResponse.message, 'save-status-green')
                }else{
                    setSaveStatus(saveResponse.message, 'save-status-red')
                    appendSaveStatus('Last saved on ' + formatDate(saveResponse.lastUpdated), 'save-status-green')
                }
            })
        }

        $scope.addStoreClick = function () {
            UserManagerService.addUserJobRoles($stateParams.userID).then(function (storeAddResponse) {
                if (storeAddResponse.store_added) {
                    $timeout($ionicScrollDelegate.scrollBottom(true), 0);
                } else {
                    toastMessage(storeAddResponse.message)
                }
            })


        }

        $scope.storeSelectionRefresh = function () {
            UserManagerService.refreshStoresDropDown($stateParams.userID)
        }

        $scope.deleteStore = function (storeToDelete) {
//            _.pullAllBy($scope.user.stores, [storeToDelete]);
            storeToDelete.deleted = true;
            UserManagerService.refreshStoresDropDown($stateParams.userID)
        }

        var toastMessage = function (message_text, duration) {
            if (typeof duration === 'undefined') duration = 2000;
            $ionicLoading.show({
                template: message_text,
                noBackdrop: true,
                duration: duration
            });
        }

        var setSaveStatus = function (message, message_level) {
            $scope.saveStatus = [{
                text: message,
                level: message_level
                }]
        }

        var appendSaveStatus = function (message, message_level) {
            $scope.saveStatus.push({
                text: message,
                level: message_level
            })
        }

        function formatDate(date_epoch) {
            var dateOptions = {
                hour: "2-digit",
                minute: "2-digit",
                day: "numeric",
                month: "short"
            };
            var lastSavedtime = new Date(parseInt(date_epoch) * 1000);
            return lastSavedtime.toLocaleString("en-US", dateOptions);
        }

        $scope.$on('SHOWBUSY', function (event) {
            $scope.spinnerHide = false;
        });
        $scope.$on('HIDEBUSY', function (event) {
            $scope.spinnerHide = true;
        });


        //on init
        getSkeleton('UserSettingsUserDetails')
        getSkeleton('UserSettingsJobRoleDetails')
        fetchAllDropDownOptions(); // gets dropdown options of many properties and stores in service

//        $scope.consoleshow = function (item){
//            console.log(item)
//        }

    }
})();
