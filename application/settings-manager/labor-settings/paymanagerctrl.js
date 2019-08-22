(function () {
        projectCostByte.controller('PayManagerCtrl', PayManagerCtrl);

        PayManagerCtrl.$inject = ['PayManagerService', 'Utils', '$q', '$scope', '$rootScope', '$state', '$timeout', '$ionicActionSheet'];

        function PayManagerCtrl(PayManagerService, Utils, $q, $scope, $rootScope, $state, $timeout, $ionicActionSheet) {

            var fetchEmployees = function (responseHandler) {
                PayManagerService.fetchEmployeesByBusiness(responseHandler);

            }

            var fetchEmployeesResponseHandler = function (employeesData) {
                console.log(employeesData)
                $scope.employees = employeesData.employees;
                setSaveStatus("Last edited on " + employeesData.dateText, "save-status-neutral");
                $scope.$broadcast('HIDEBUSY');
            }
            $scope.init = function(){
                $scope.pageTitle = "Pay Manager";
            }

            $scope.filterEmployees = function(storeID){
                var selectedStoreID = $scope.storeSelected.business_store_id;
                if(selectedStoreID == 'all' || selectedStoreID == storeID){
                    return true;
                }
                return false;


            }


            var fetchStores = function (responseHandler) {
                $scope.$broadcast('SHOWBUSY');
                PayManagerService.fetchStoresByBusiness(responseHandler);
            }

            var fetchStoresResponseHandler = function (stores, current_store) {
//                console.log(stores)
                $scope.stores = stores;
                updateSelectedStore(stores, current_store);
                fetchEmployees(fetchEmployeesResponseHandler);
            }

            var updateSelectedStore = function(stores, current_store){
                $scope.storeSelected = _.find(stores, { business_store_id: current_store });
            }

            $scope.saveClick = function (){
                setSaveStatus("Saving...","save-status-neutral");
                PayManagerService.saveUpdatedEmployees().then(function(saveResponse){
                    if(saveResponse.saved){
                        setSaveStatus("All changes saved to Pepr.","save-status-green");
                    }else{
                        setSaveStatus("Save Failed.","save-status-red");
                        if(saveResponse.hasOwnProperty('dateText')){
                            appendSaveStatus("Last saved on " + saveResponse.dateText, "save-status-green");
                        }

                    }
                });
            }

            var setSaveStatus = function(message, message_level){
                $scope.saveStatus= [{
                    text: message,
                    level: message_level
                }]
            }

            var appendSaveStatus =  function(message, message_level){
                $scope.saveStatus.push({
                    text: message,
                    level: message_level
                })
            }


            $scope.showStores = function () {
                $scope.dropdown_click = true;
                var stores = $scope.stores ;
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
                        PayManagerService.changeSelectedStore(index, updateSelectedStore);
                        $scope.dropdown_click = false;
                        hideSheet();
                    }
                }
                
                // Show the action sheet
                var hideSheet = $ionicActionSheet.show(action_sheet_definition);
            }


//            $scope.salaryUpdated = function(){
//                console.log("value updated")
//                PayManagerService.mergeUpdatedEmployees($scope.employees);
//            }

            $scope.$on('SHOWBUSY', function (event) {
                $scope.spinnerHide = false;
            });
            $scope.$on('HIDEBUSY', function (event) {
                $scope.spinnerHide = true;
            });

            //on init
            $scope.navBarTitle.showToggleButton = false;
            fetchStores(fetchStoresResponseHandler);




        }
})();
