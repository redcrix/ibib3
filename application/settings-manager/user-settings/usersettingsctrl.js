(function () {
    projectCostByte.controller('UserSettingsCtrl', UserSettingsCtrl);

    UserSettingsCtrl.$inject = ['UserManagerService', 'Utils', '$q', '$scope', '$rootScope', '$state', '$timeout', '$ionicActionSheet','CommonService','$ionicLoading'];

    function UserSettingsCtrl(UserManagerService, Utils, $q, $scope, $rootScope, $state, $timeout, $ionicActionSheet,CommonService,$ionicLoading) {

        $scope.navBarTitle.showToggleButton = false;

        var fetchUsers = function () {
            UserManagerService.fetchUsersByBusiness().then(function (usersData) {
            // console.log(usersData)
                $scope.users = usersData.users;
                setSaveStatus("Last edited on "+ formatDate(usersData.lastUpdated), "save-status-green");
                $scope.$broadcast('HIDEBUSY');
            })
        }

        $scope.init = function(){
            $scope.pageTitle = "User Settings";
        }
        $scope.initPw = function(){
            $scope.pageTitle = "Change Password";
        }

        var fetchStores = function (responseHandler) {
            $scope.$broadcast('SHOWBUSY');
            UserManagerService.fetchStoresByBusiness(responseHandler);
        }

        $scope.createUser = function () {
            UserManagerService.createUser().then(function (newUserID) {
            // console.log(newUserID)
                $state.go('app.userDetails', {
                    userID: newUserID.user_id
                })
            });
        }
        var toastMessage = function(message_text, duration) {
            if (typeof duration === 'undefined') duration = 2000;
            $ionicLoading.show({
                template: message_text,
                noBackdrop: true,
                duration: duration
            });
        }
        var changePwdResHandler = function(response){
            // console.log(response)
            if(response.success && response.isValid){
                toastMessage('Your Password has been successfully updated!')
                $state.go('app.settingsManager');
            } else if(!response.isValid){
                toastMessage('Old Password is incorrect!')
            } else if (!response.success){
                toastMessage('Password not Updated!')
            } else{
                toastMessage('Something went wrong!')
            }
        }
        $scope.saveChangePw = function(userPw){
            // console.log(userPw)
            CommonService.changeUserPwd(changePwdResHandler,userPw.oldPw,userPw.newPw);
        }

        var fetchStoresResponseHandler = function (stores, current_store) {
            //                console.log(stores)
            $scope.stores = stores;
            updateSelectedStore(stores, current_store);
            fetchUsers();
        }

        var updateSelectedStore = function (stores, current_store) {
            $scope.storeSelected = _.find(stores, {
                business_store_id: current_store
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



        $scope.showStores = function () {
            $scope.dropdown_click = true;
            var stores = $scope.stores;
            var action_sheet_definition = {
                buttons: stores,
                //         destructiveText: 'Delete',
                titleText: '<h4>Select Store</h4>',
                cancelText: 'Cancel',
                cancel: function () {
                    // add cancel code..
                    $scope.dropdown_click = false;
                },
                buttonClicked: function (index) {
                    // change store here
                    UserManagerService.changeSelectedStore(index, updateSelectedStore);
                    $scope.dropdown_click = false;
                    hideSheet();
                }
            }

            // Show the action sheet
            var hideSheet = $ionicActionSheet.show(action_sheet_definition);
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

        fetchStores(fetchStoresResponseHandler);

    }
    var compareTo = function() {
        return {
            require: "ngModel",
            scope: {
                otherModelValue: "=compareTo"
            },
            link: function(scope, element, attributes, ngModel) {
                
                ngModel.$validators.compareTo = function(modelValue) {
                    // console.log('**********')
                    // console.log(modelValue)
                    // console.log(scope.otherModelValue)
                    // if(modelValue == scope.otherModelValue || (modelValue == undefined && scope.otherModelValue))
                    //         return true;
                    return modelValue == scope.otherModelValue || (modelValue == undefined && scope.otherModelValue);
                };
     
                scope.$watch("otherModelValue", function() {
                    ngModel.$validate();
                });
            }
        };
    };
    projectCostByte.directive("compareTo", compareTo);

})();
