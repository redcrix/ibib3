(function () {
    var plCategory = function ($rootScope, $ionicScrollDelegate,  $state) {
        return {
            restrict: 'E',
            templateUrl: 'application/pl-tracker/directives/pl-category/pl-category.html',
            replace: false,
            scope: {
                categoryData: '='
            },
            bindToController: {
                categoryData: '=categoryData',
            },
            controller: function () {
            },
            controllerAs: 'ctrl',
            link: function (scope, ele, attr, controllers) {

                scope.categoryData.list = !scope.categoryData.list ? [{"item_name":"empty","variance":0,"percentage":0,"budget":0,"value":0}] : scope.categoryData.list;
                // console.log("scope.categoryData",scope.categoryData);
                // if(scope.categoryData.name=="Total Prime Cost"||scope.categoryData.name=="Profit After Prime"){
                //     scope.expandbutton=true;
                //     console.log("scope.expandbutton",scope.expandbutton);
                // }else{
                //     scope.expandbutton=false;
                //     console.log("scope.expandbutton",scope.expandbutton);
                // }
                var sublist = ele.parent()[0].querySelector('.sub-list');
                // console.log(sublist);
                var once = function (seconds, callback) {
                    var counter = 0;
                    var time = window.setInterval(function () {
                        counter++;
                        if (counter >= seconds) {
                            callback();
                            window.clearInterval(time);
                        }
                    }, 450);
                };
                var slideDown = function (elem) {
                    elem.style.maxHeight = elem.scrollHeight + 'px';
                    once(1, function () {
                        elem.style.overflow = '';
                    });
                    scope.$emit('ReSizeScroll');
//                    $ionicScrollDelegate.resize();
                };
                var slideUp = function (elem) {
                    elem.style.maxHeight = '0';
                    once(1, function () {
                        elem.style.overflow = 'hidden';
                    });
                    scope.$emit('ReSizeScroll');
//                    $ionicScrollDelegate.resize();
                };

                scope.toggleList = function () {
                    if(scope.categoryData.name=="PRIME COST"||scope.categoryData.name=="Profit After Prime"){
                     scope.expandbutton=false;
                }else{
                    scope.expandbutton=true;
                    var expandButton = ele[0].querySelector('[data-expand]');
                    if (expandButton.classList.contains('ion-ios-plus-outline')) {
                        slideDown(sublist);
                    } else {
                        slideUp(sublist);
                    }
                    expandButton.classList.toggle('ion-ios-minus-outline');
                    expandButton.classList.toggle('ion-ios-plus-outline');
                }
                };
                scope.toggleList(); // by default slideup

                scope.goToPAndLCharts = function (item) {
                    $state.go(item.ui_click_destination).then(function () {
                        console.log('navigated to ' + item.ui_click_destination);
                    });
                };
            }
        };
    };
    plCategory.$inject = ['$rootScope', '$ionicScrollDelegate','$state'];
    projectCostByte.directive('plCategory', plCategory);
})();
