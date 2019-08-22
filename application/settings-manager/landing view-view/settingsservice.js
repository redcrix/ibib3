(function () {
    'use strict';

    projectCostByte.factory('SettingsManagerService', SettingsManagerService);

    SettingsManagerService.$inject = ['$q', 'CommonService', '$timeout', 'Utils'];

    function SettingsManagerService($q, CommonService, $timeout, Utils) {

        function getSettingsManagerLandingPage(){
            return $q(function(resolve, reject){

                let getSettingsManagerLandingPageRH = function(response){
                    resolve(response)
                };
                CommonService.getSettingsManagerLandingPage(getSettingsManagerLandingPageRH)
            })
        }


        var SettingsFactory = {
            getSettingsManagerLandingPage: getSettingsManagerLandingPage,
        };


        return SettingsFactory;
    }

})();
