(function () {
    projectCostByte.controller('SettingsLandingCtrl', SettingsLandingCtrl);

    SettingsLandingCtrl.$inject = ['Utils', '$q', '$scope', '$rootScope', '$state', '$timeout', 'SettingsManagerService'];

    function SettingsLandingCtrl(Utils, $q, $scope, $rootScope, $state, $timeout, SettingsManagerService) {

        $scope.navBarTitle.showToggleButton = true;
        $scope.showPage = false;

        SettingsManagerService.getSettingsManagerLandingPage().then(function(settingscategories){
            console.log(settingscategories)
            $scope.showPage = true;
            $scope.settingscategories = settingscategories;

            // [
            //     {label : "Manage Labor", description: "", link : 'app.laborManager' },
            //     {label : "Manage Users", description: "" , link : 'app.userManager'},
            //     {label : "Change Password", description: "" , link : 'app.userChangePw'},
            //     {label : "Manage Payment", description: "", link: 'app.payment'},
            //     {label : "About us", description: "", link: 'app.aboutusManager'},
            //     {label : "Switch Business", description: "", link: 'app.switchBusiness'}
            // ]
        })
    }
})();
