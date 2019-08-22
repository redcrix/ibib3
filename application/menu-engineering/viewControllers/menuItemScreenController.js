(function () {
    projectCostByte.controller('MenuEngineeringMenuItemScreenCtrl', menuItemScreenCtrl);

    menuItemScreenCtrl.$inject = ['$q', '$scope', '$state', '$stateParams', '$timeout', '$ionicTabsDelegate', 'MenuEngineeringServiceOne'];

    function menuItemScreenCtrl($q, $scope, $state, $stateParams, $timeout, $ionicTabsDelegate, MenuEngineeringServiceOne) {



        $scope.getMenuItemList = menuPerformanceService.getMenuItemsList();
        $scope.itemParams = $stateParams;
        // function to fetch menuItem Data
        var fetchMenuItemData = function () {
            return MenuEngineeringServiceOne.getSelectedMenuItemData(fetchMenuItemDataRH, $stateParams);
        }

        var fetchMenuItemDataRH = function (menuItemData) {
            $scope.item = menuItemData;
        }

        // function to fetch Ingredients of menuItem
        var fetchMenuItemIngredients = function () {
            return MenuEngineeringServiceOne.getSelectedMenuIngredients(fetchMenuItemIngredientsRH, $stateParams);
        }

        var fetchMenuItemIngredientsRH = function (ingredientsData) {
            $scope.ingredients = ingredientsData;
            $scope.spinnerHide = true;
        }

        // On screen Init
        $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
            viewData.enableBack = true;
        });


        $scope.onMenuItemInit = function () {
            $scope.spinnerHide = false;
            $scope.navBarTitle.showToggleButton = false;
            fetchMenuItemData();
            fetchMenuItemIngredients();

        }






    }
})();
