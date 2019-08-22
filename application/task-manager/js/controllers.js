angular.module('costbyte.tmcontrollers', [])
    //taskmanagerCtrl
    .controller('dashboardCtrl', function($scope, $state) {
        let businessData = localStorage.getItem('businesses');
       //  console.log(JSON.parse(businessData))
       // console.log(JSON.parse(businessData).length);
       $scope.overViewVisible = JSON.parse(businessData).length > 1 ? true : false;

        $scope.alertsClickHandler = function() {
            //            $ionicSideMenuDelegate.toggleLeft();
            $state.go('app.dashboard.alerts');
        };
        $scope.tasksClickHandler = function() {
            //            $ionicSideMenuDelegate.toggleLeft();
            $state.go('app.dashboard.tasks');
        };
        $scope.trackersClickHandler = function() {
            //            $ionicSideMenuDelegate.toggleLeft();
            $state.go('app.dashboard.trackers');
        };

        $scope.summaryClickHandler = function() {
            //            $ionicSideMenuDelegate.toggleLeft();
            $state.go('app.dashboard.summary');
        };

        $scope.overviewClickHandler = function() {
            //            $ionicSideMenuDelegate.toggleLeft();
            $state.go('app.dashboard.overview');
        };
      



        $scope.top10ClickHandler = function() {
            //            $ionicSideMenuDelegate.toggleLeft();
            $state.go('app.dashboard.top10');
        };


        //On dashboard init handler
        $scope.dashboardinit = function() {
            $scope.navBarTitle.showToggleButton = true;
        }


    })
    .controller('taskmanagerCtrl', function($scope, decisionStoreFactory, $ionicListDelegate) {
        $scope.buttons = {
            'ShowDelete': false,
        };
        //        $scope.DeleteTask=function(index){
        //                $scope.decisions.splice(index, 1);
        //                newdecisionstore = JSON.parse(JSON.stringify($scope.decisions));
        //                var len = newdecisionstore.length;
        //                for (var i = 0; i < len; i++) {
        //                    for (var j = 0; j < newdecisionstore[i].tracked_items.length; j++) {
        //                        newdecisionstore[i]['$Impact'] = 0;
        //                    }
        //                }
        //                decisionStoreFactory.updatedecisionStore(newdecisionstore)
        //        }
        $scope.decisions = decisionStoreFactory.getdecisionStore();
        var len = $scope.decisions.length
        for (var i = 0; i < len; i++) {
            for (var j = 0; j < $scope.decisions[i].tracked_items.length; j++) {
                if ($scope.decisions[i].tracked_items[j]["Name"] == 'Ground Turkey' && $scope.decisions[i]['action'] == 'Change Supplier') {
                    $scope.decisions[i]['$Impact'] = 852
                } else {
                    $scope.decisions[i]['$Impact'] = RandomInt(100, 500)
                }
            }
        }

        $scope.toggledone = function(itemindex) {
                //            console.log(itemindex)
                newdecisionstore = JSON.parse(JSON.stringify($scope.decisions));
                newdecisionstore[itemindex].pending = !newdecisionstore[itemindex].pending;
                var len = newdecisionstore.length;
                for (var i = 0; i < len; i++) {
                    for (var j = 0; j < newdecisionstore[i].tracked_items.length; j++) {
                        newdecisionstore[i]['$Impact'] = 0;
                    }
                }
                decisionStoreFactory.updatedecisionStore(newdecisionstore)

                $scope.decisions = newdecisionstore

                $ionicListDelegate.closeOptionButtons();
            }
            //        console.log($scope.decisions)
    })
    .controller('trackerCtrl', function($scope) {
        $scope.buttons = {
            'ShowDelete': false
        };
        $scope.items = [{
            'name': 'Beef Burger',
            'source': 'Margin Optimizer',
            'property': 'Margin',
            'punit': '$',
            'tunit': '',
            'value': RandomNum(1, 3),
            'change': RandomNum(-1, 0)
        }, {
            'name': "Almond & Butterscotch Pudding",
            'source': 'Margin Optimizer',
            'property': 'Cost',
            'punit': '$',
            'tunit': '',
            'value': RandomNum(3, 7),
            'change': RandomNum(-2, -1)
        }, {
            'name': "Chicken Breasts",
            'source': 'Wastage Optimizer',
            'property': 'Wastage',
            'punit': '',
            'tunit': ' lb',
            'value': RandomNum(50, 100),
            'change': RandomInt(5, 10)
        }, {
            'name': "Roast Rib of Scottish Beef",
            'source': 'Margin Optimizer',
            'property': 'Margin',
            'punit': '$',
            'tunit': '',
            'value': RandomNum(1, 3),
            'change': RandomNum(0, 1)
        }, {
            'name': 'Beef Patty',
            'source': 'Inventory Optimizer',
            'property': 'Inventory',
            'punit': '',
            'tunit': ' ct',
            'value': RandomNum(100, 150),
            'change': RandomInt(10, 30)
        }, ]
    })

.controller('alertsCtrl', function($scope, $ionicListDelegate) {
    $scope.init = function(){
        $scope.pageTitle = "Alerts";
    }
    $scope.buttons = {
        'ShowDelete': false,
        'listCanSwipe': true,
    };
    $scope.items = [{
        'name': "Turkey Burger",
        'actiontaken': false,
        'flcategory': 'Food',
        'category': 'Burgers',
        'itemid': 'ID6576',
    }]
    $scope.toggledone = function(itemindex) {
        $scope.items[itemindex].actiontaken = !$scope.items[itemindex].actiontaken;
        $ionicListDelegate.closeOptionButtons();
    }
});

function RandomNum(min, max) {
    return roundToTwo(Math.random() * (max - min + 1)) + min;
}

function roundToTwo(num) {
    return +(Math.round(num + "e+2") + "e-2");
}

function RandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
