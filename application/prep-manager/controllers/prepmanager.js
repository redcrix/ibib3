(function () {
    'use strict';
    projectCostByte.controller('PrepmanagerCtrl', prepmanagerCtrl);

    prepmanagerCtrl.$inject = ['$scope','$state', '$timeout', '$ionicPopover', 'ErrorReportingServiceOne','CommonService','$rootScope'];

    function  prepmanagerCtrl ($scope,$state, $timeout, $ionicPopover, ErrorReportingServiceOne,CommonService,$rootScope) {
                $rootScope.searchItem = true;
                $scope.gotList = false;
                $scope.reqval = false;
                // $rootScope.showSearchBtn = true;
                // $rootScope.data ={
                //     searchText : ""
                // }
                $scope.myIngList =[];

                function ingList(getIngList){
                    if(getIngList.value == undefined){
                        getIngList.value =[];
                    }
                    $scope.myIngList = getIngList.value;
                    $scope.gotList = true;
                    $rootScope.isloaded = true;
                    $rootScope.data = $scope.myIngList
                    $scope.reqval = true;
                    $rootScope.$emit('prepresult',$scope.myIngList)
                }
                
                    CommonService.getPrepIngredients(ingList)
                $rootScope.$on('CreatedPrepItem',function(evnt){
                    $scope.gotList = false;
                    CommonService.getPrepIngredients(ingList)
                })
                $scope.onPrepMenuItemInit = function () {
                    console.log("main page")
                    $scope.navBarTitle.showToggleButton = true;
                }
                // console.log($rootScope.$$listenerCount['REFRESH_PREP_MENUS']);
                // if(!$rootScope.$$listenerCount['REFRESH_PREP_MENUS']){
                //   $rootScope.$on('REFRESH_PREP_MENUS', function(event) {
                //     console.log('REFRESH_PREP_MENUS******************');
                //     // CommonService.getPrepIngredients(ingList);
                //   });
                // }

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
