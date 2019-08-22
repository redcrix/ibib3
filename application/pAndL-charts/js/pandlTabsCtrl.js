(function () {
    projectCostByte.controller('PAndLChartsTabsCtrl', pAndLChartsTabsCtrl);

    pAndLChartsTabsCtrl.$inject = ['$scope', '$state', '$timeout', '$ionicTabsDelegate', 'PAndLChartsService', '$ionicHistory', 'Utils', '$rootScope'];

    function pAndLChartsTabsCtrl($scope, $state, $timeout, $ionicTabsDelegate, PAndLChartsService, $ionicHistory, Utils, $rootScope) {

        var tabDefinitions = [
            {
                stateName: 'app.pAndLCharts.sales',
                index: 0,
                key: 'SALES'
            },
            {
                stateName: 'app.pAndLCharts.cost',
                index: 1,
                key: 'LABOR_COST'
            },
            {
                stateName: 'app.pAndLCharts.cogs',
                index: 2,
                key: 'COGS'
            },
            {
                stateName: 'app.pAndLCharts.primecost',
                index: 3,
                key: 'PRIME_COST'
            },
            // {
            //     stateName: 'app.pAndLCharts.profitafterprime',
            //     index: 4,
            //     key: 'PROFIT_AFTER_PRIME'
            // }
        ];

        $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
            viewData.enableBack = true;
        });


        $scope.onPAndLChartsTabsInitHandler = function () {
            _.each(tabDefinitions, function (tabDefiniton) {
                if ($state.includes(tabDefiniton.stateName)) {
                    $timeout(PAndLChartsService.setSelectedPAndLType(tabDefiniton.key))
                }
            });
            $scope.navBarTitle.showToggleButton = false;
        };

        $scope.myGoBack = function () {
//                            console.log("c b b");
            $timeout(function () {
                console.log("going back")
                // $ionicHistory.goBack();
                window.history.back();  
                // $state.go($rootScope.goBackState)
            }, 5);
//                            $window.history.back();
//             console.log($rootScope.previousState)
//
        };

        //click handlers
        $scope.tabClickHandler = function (tabName) {
            let clickedTab = _.find(tabDefinitions, ['key', tabName]);
            $state.go(clickedTab.stateName).then(function () {
                    PAndLChartsService.setSelectedPAndLType(tabName)
                    // console.log("pandl tab onInit:" + tabName)
                    // let headerTitle = 'P & L: ' + _.startCase(_.toLower(_.replace(tabName, '_', ' ')))
                    let headerTitle = 'P & L Trends'
                    Utils.setHeaderTitle(headerTitle)
                }
            );
        };


    }
})();
