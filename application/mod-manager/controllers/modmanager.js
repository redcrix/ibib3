(function () {
    'use strict';
    projectCostByte.controller('ModmanagerCtrl', modmanagerCtrl);

    modmanagerCtrl.$inject = ['$scope','$state', '$timeout', '$ionicPopover', 'ErrorReportingServiceOne','CommonService','$rootScope'];

    function  modmanagerCtrl ($scope,$state, $timeout, $ionicPopover, ErrorReportingServiceOne,CommonService,$rootScope) {
                $scope.gotList = false;
                $rootScope.searchItem = true;
                // $rootScope.showSearchBtn = true;
                // $rootScope.data ={
                //     searchText : ""
                // }


                function ingList(getIngList){
                    $scope.gotList = true;                    
                    $scope.myIngList = getIngList.value;
                    // console.log($scope.myIngList)
                }
                CommonService.getModIngredients(ingList)

                $scope.onMenuItemInit = function () {
                    $scope.navBarTitle.showToggleButton = true;
                }
                // $scope.$watch('data.searchText', function(newVal) {
                //     // console.log('search.....',newVal)
                //     $rootScope.$broadcast('search_text')
                // }, true);
                // $scope.closeSearch = function(){
                //     // $rootScope.searchItem = false;
                //     $rootScope.searchItem = true;
                //     // $rootScope.showSearchBtn = true;
                //     $rootScope.data.searchText = '';
                // }

                
            
        
    }
})();
