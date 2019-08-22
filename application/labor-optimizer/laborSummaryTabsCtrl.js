(function () {
    projectCostByte.controller('LaborSummaryTabsCtrl', LaborSummaryTabsCtrl);

    LaborSummaryTabsCtrl.$inject = ['$scope', '$state', '$timeout', '$ionicTabsDelegate', 'LaborOptimizerService', 'Utils'];

    function LaborSummaryTabsCtrl($scope, $state, $timeout, $ionicTabsDelegate, LaborOptimizerService, Utils) {

        var tabDefinitions = [
            {
                stateName: 'app.laborOptimizer.summary',
                index: 0,
                key: 'summary'
            },
            {
                stateName: 'app.laborOptimizer.role',
                index: 1,
                key: 'role'
            },
            {
                stateName: 'app.laborOptimizer.employee',
                index: 2,
                key: 'employee'
            }
        ];


        $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
            viewData.enableBack = true;
        });


        $scope.onLaborSummaryTabsInitHandler = function () {
            _.each(tabDefinitions, function (tabDefiniton) {
                if ($state.includes(tabDefiniton.stateName)) {

                    $timeout(LaborOptimizerService.setSelectedLaborType(tabDefiniton.key))
                }
                $scope.navBarTitle.showToggleButton = true;
            });
        };


        //click handlers
        $scope.tabClickHandler = function (tabName) {
            let clickedTab = _.find(tabDefinitions, ['key', tabName]);
            $state.go(clickedTab.stateName).then(function () {
                    LaborOptimizerService.setSelectedLaborType(tabName)
                    Utils.setHeaderTitle('Labor Summary')
                }
            );
        };


    }
})();
