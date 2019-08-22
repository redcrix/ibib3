(function () {
    'use strict';

    projectCostByte.directive('slideBoxSelector', slideBoxSelector);

    slideBoxSelector.$inject = ['Utils', '$timeout', '$state', '$filter', 'Logger', '$rootScope', '$ionicSlideBoxDelegate'];

    function slideBoxSelector(Utils, $timeout,  $state, $filter, Logger,  $rootScope, $ionicSlideBoxDelegate) {
        return {
            restrict: 'E',
            templateUrl: 'application/inventory-management/directives/slideBoxSelector/slideBoxSelectorView.html',
            scope: {
                sliderOptions: '=',
                sliderIndex: '=',
                slideChangeBroadcast: '='
            },
            link: function (scope, element, attribute) {

                if(angular.isUndefined(scope.sliderIndex)){
                    scope.sliderIndex =  0;
                }

                scope.nextSlide = function() {
                    $timeout(function(){
                        scope.sliderIndex = (scope.sliderIndex + 1) % scope.sliderOptions.length;
                        scope.slideChangeFn()
                    })
                };

                scope.prevSlide = function() {
                    $timeout(function(){
                        if (scope.sliderIndex === 0){
                            scope.sliderIndex = scope.sliderOptions.length;
                        }
                        scope.sliderIndex =  (scope.sliderIndex - 1) % scope.sliderOptions.length;
                        scope.slideChangeFn()
                    })


                }

                scope.slideChangeFn = function () {
                    if(angular.isDefined(scope.slideChangeBroadcast)){
                        $timeout(function(){scope.$emit(scope.slideChangeBroadcast, scope.sliderIndex)}, 100);
                    }
                    
                }

            }

        }
    };

})();
