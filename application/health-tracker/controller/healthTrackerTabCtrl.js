(function () {

    projectCostByte.controller('healthTrackerTabCtrl', healthTrackerTabCtrl);

    healthTrackerTabCtrl.$inject = ['$q', '$scope', 'HealthTrackerService', '$state', 'CommonConstants', '$rootScope',
        'CommonService', 'ionicDatePicker', '$ionicActionSheet', '$timeout', '$ionicHistory'];

    function healthTrackerTabCtrl($q, $scope, HealthTrackerService, $state, CommonConstants, $rootScope,
                                  CommonService, ionicDatePicker, $ionicActionSheet, $timeout, $ionicHistory) {
        // .controller('healthTrackerTabCtrl', function($scope, $state) {

        $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
            viewData.enableBack = true;
        });

        $scope.salesClickHandler = function () {
            //            $ionicSideMenuDelegate.toggleLeft();
            // $scope.salesGraph = true;
            // $scope.foodGraph = false;
            // $scope.costGraph = false;
            $state.go('app.health-tracker-tab.healthTracker');
        };
        $scope.labourClickHandler = function () {
            //            $ionicSideMenuDelegate.toggleLeft();
            // $scope.salesGraph = false;
            // $scope.foodGraph = true;
            // $scope.costGraph = false;
            $state.go('app.health-tracker-tab.healthTracker-labour');
        };

        $scope.cogsClickHandler = function () {
            //            $ionicSideMenuDelegate.toggleLeft();
            // $scope.salesGraph = false;
            // $scope.foodGraph = false;
            // $scope.costGraph = true;
            $state.go('app.health-tracker-tab.healthTracker-cogs');
        };


        $scope.myGoBack = function () {
//                            console.log("c b b");
            $timeout(function () {
                console.log("going back")
                $ionicHistory.goBack();
                // $state.go($rootScope.previousState)
            }, 5)
//                            $window.history.back();
        };


    }
})();



