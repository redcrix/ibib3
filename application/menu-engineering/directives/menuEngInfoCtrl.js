(function () {
    projectCostByte.controller('menuEngInfoCtrl', menuEngInfoCtrl);

    menuEngInfoCtrl.$inject = ['$q', '$scope', '$state','$ionicLoading', '$stateParams', '$timeout', 'inventoryItemsSvc', '$rootScope', 'parameters', 'CommonService', '$ionicPopup', '$ionicSlideBoxDelegate'];

    function menuEngInfoCtrl($q, $scope, $state,$ionicLoading, $stateParams, $timeout, inventoryItemsSvc, $rootScope, parameters, CommonService, $ionicPopup, $ionicSlideBoxDelegate) {
        $scope.label=parameters;
        if(parameters == "Stars"){
            $scope.info = "High sales and high margins heroes!";
        }else if(parameters == "Workhorses"){
            $scope.info = "High sales but low margins. Tweak the dish!";
        }else if(parameters == "Puzzles"){
            $scope.info = "High margins but low sales. Market it!";
        }else if(parameters == "Problems"){
            $scope.info ="Low sales and low margins. Revamp or remove!";
        }else {
            $scope.info = "All sales and margins"
        }

    	$scope.closeModalCtrl = function (result) {
            // console.log('cancel edi config')
            $scope.closeModal({
                'modal': 'closed',
                'config_saved': false
            })
        }
	}
})();