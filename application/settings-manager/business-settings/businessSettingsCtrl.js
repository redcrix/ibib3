(function () {
    projectCostByte.controller('BusinessSettingsCtrl', BusinessSettingsCtrl);

    BusinessSettingsCtrl.$inject = ['Utils', '$scope' ,'$state', '$window','$rootScope'];

    function BusinessSettingsCtrl(Utils, $scope, $state, $window, $rootScope) {

        $scope.navBarTitle.showToggleButton = false;
        $scope.businesses = JSON.parse(Utils.getLocalValue('businesses'));

        $scope.init = function(){
            $scope.pageTitle = "Business Settings";
        }

        $scope.switch = function (sel) {

            angular.forEach($scope.businesses, function (b, index){
                if(b.session_id === sel.session_id) {
                    b.selected = true;
                    // b.name = b.business_name;
                    Utils.setLocalValue('sessionId', sel.session_id);
                    Utils.setLocalValue('currentBusiness', JSON.stringify(b));
                } else {
                    b.selected = false;
                }
            });

            // console.log(JSON.stringify($scope.businesses));
            Utils.setLocalValue('businesses', JSON.stringify($scope.businesses));
            // REFRESH APP
            Utils.refreshApp().then(function(){
                $state.go('app.dashboard.summary').then(function(){
                    // $window.location.reload(true);
                    $rootScope.$broadcast('Business_Switched');
                });
            });
        };

        // var updateSelectedStore = function (stores, current_store) {
        //     $scope.storeSelected = _.find(stores, {
        //         business_store_id: current_store
        //     });
        // }
    }
})();
