(function () {
        projectCostByte.controller('PayHistoryCtrl', PayHistoryCtrl);

        PayHistoryCtrl.$inject = ['PayManagerService', 'Utils', '$q', '$scope', '$rootScope', '$state', '$stateParams', '$timeout', '$ionicActionSheet', 'ionicDatePicker', '$ionicListDelegate'];

        function PayHistoryCtrl(PayManagerService, Utils, $q, $scope, $rootScope, $state, $stateParams, $timeout, $ionicActionSheet, ionicDatePicker, $ionicListDelegate) {
            $scope.navBarTitle.showToggleButton = false;

            function getEmployeePayHistory(){
                $scope.$broadcast('SHOWBUSY');
                PayManagerService.getEmployeeByUseID($stateParams).then(function(employeeData){
                    $scope.employee = employeeData;
                })

                PayManagerService.getEmployeePayHistory($stateParams).then(function(payHistoryData){
    //                console.log(payHistoryData)
                    $scope.payHistory = payHistoryData.pay_history
                     setSaveStatus("Last edited on " + payHistoryData.dateText , "save-status-green");
                     $scope.$broadcast('HIDEBUSY');

                })
            }

            $scope.saveClick = function (){
                   setSaveStatus('Saving...', 'save-status-neutral')
                   PayManagerService.setEmployeePayHistory($stateParams).then(function(saveResponse){
                       if(saveResponse.saved){
                            setSaveStatus("All changes saved to Pepr.","save-status-green");
                        }else{
                            setSaveStatus("Save Failed.","save-status-red");
                            if(saveResponse.hasOwnProperty('lastUpdated')){
                                appendSaveStatus("Last saved on " + saveResponse.dateText, "save-status-green");
                            }

                        }

                   })
            }

            $scope.change_date = function (salary_on_date){
//                console.log(salary_on_date)
                $scope.datepickerObject = {
                  callback: function (val) {  //Mandatory
                      salary_on_date.salary_date =  val/1000
                      $ionicListDelegate.closeOptionButtons();
                    },
                  inputDate: new Date(parseInt(salary_on_date.salary_date) *1000),      //Optional
                  mondayFirst: true,          //Optional
                  disableWeekdays: [],       //Optional
                  closeOnSelect: false,       //Optional
                  templateType: 'popup'       //Optional
                };


            ionicDatePicker.openDatePicker($scope.datepickerObject);
            $ionicListDelegate.closeOptionButtons();
            }

            $scope.deleteStore = function(salary_on_date){
                salary_on_date.deleted = true;
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

        $scope.$on('SHOWBUSY', function (event) {
            $scope.spinnerHide = false;
        });
        $scope.$on('HIDEBUSY', function (event) {
            $scope.spinnerHide = true;
        });

        // on init
        getEmployeePayHistory();


    }
})();
