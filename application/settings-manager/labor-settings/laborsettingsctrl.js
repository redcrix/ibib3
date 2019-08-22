(function () {
    projectCostByte.controller('LaborSettingsCtrl', LaborSettingsCtrl);

    LaborSettingsCtrl.$inject = ['Utils', '$q', '$scope', '$rootScope', '$state', '$timeout', 'PayManagerService'];

    function LaborSettingsCtrl(Utils, $q, $scope, $rootScope, $state, $timeout, PayManagerService) {

        $scope.navBarTitle.showToggleButton = false;
        $scope.saveStatus = []

        function getSkeleton(skeletonKey){
            PayManagerService.getSkeleton(skeletonKey).then(function(skeletonResponse){
                if(skeletonKey=='LaborPaySettings'){
                    $scope.laborSettingsSkeletons = skeletonResponse;
                }
            })
        }
        $scope.init = function(){
            $scope.pageTitle = "Labor Settings";
        }

        function getLaborSettings(){
            $scope.$broadcast('SHOWBUSY');
            PayManagerService.getLaborSettings().then(function(laborSettings){
    //            console.log(laborSettings)

                $scope.laborSettings = laborSettings;
                $scope.$broadcast('HIDEBUSY');
            })
        }

        $scope.saveClick = function(){
            // console.log($scope.laborSettings)

            PayManagerService.setLaborSettings()
                .then(function(saveResponse){
                    if(saveResponse.saved){
                        $scope.saveStatus= [{text:"All changes saved to Pepr.",
                                            level: "save-status-green"
                                            },{
                                            text: "Last saved on " + formatDate(saveResponse.lastUpdated),
                                            level: "save-status-green"
                        }]
                    }else{
                        $scope.saveStatus= [{text:"Save Failed.",
                                            level: "save-status-red"
                                            },{
                                            text: " Last saved on " + formatDate(saveResponse.lastUpdated),
                                            level: "save-status-green"
                        }]

                    }
                })

        }

        function formatDate(date_epoch){
            var dateOptions = { hour: "2-digit", minute: "2-digit", day: "numeric", month: "short"};
            var lastSavedtime = new Date(parseInt(date_epoch) * 1000);
            return lastSavedtime.toLocaleString("en-US", dateOptions);
        }

        $scope.$on('SHOWBUSY', function (event) {
            $scope.spinnerHide = false;
        });
        $scope.$on('HIDEBUSY', function (event) {
            $scope.spinnerHide = true;
        });


        // on init
        getSkeleton('LaborPaySettings');
        getLaborSettings();

    }
})();