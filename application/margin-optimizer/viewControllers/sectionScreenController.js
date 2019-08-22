(function () {
    projectCostByte.controller('sectionScreenCtrl', sectionScreenCtrl);

    sectionScreenCtrl.$inject = ['$q', '$scope', '$state', '$stateParams', '$timeout', '$ionicTabsDelegate', 'MarginOptimizerServiceOne'];

    function sectionScreenCtrl($q, $scope, $state, $stateParams, $timeout, $ionicTabsDelegate, MarginOptimizerServiceOne) {



        var fetchSectionData = function () {
            return MarginOptimizerServiceOne.getSelectedSectionData($stateParams);
        }




        var fetchSortingButtons = function () {
            //            console.log("sorting buttons fetch")
            MarginOptimizerServiceOne.fetchSortingButtons(fetchSortingButtonsRH);
        }

        var fetchSortingButtonsRH = function (sortingButtons) {

            $scope.filterButtons = sortingButtons;
            //  function to return the selected filter button sorting option
            $scope.userSortingClass = function () {
                for (var i = 0; i < $scope.filterButtons.length; i++) {
                    if ($scope.filterButtons[i].clicked) {
                        return $scope.filterButtons[i].sortClass
                    }
                }
                return $scope.filterButtons[0].sortClass
            }


            //               
        }

        $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
            viewData.enableBack = true;
        });


        $scope.navBarTitle.showToggleButton = false;
        fetchSortingButtons();

        fetchSectionData().then(function (sectionData) {
//            console.log(sectionData)
            $scope.section = sectionData;
            $scope.spinnerHide = true;

        })






    }
})();