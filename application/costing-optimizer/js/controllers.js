//var menuitems = [];
//var selected_menu = '';
//init_pref();
//
//angular.module('costbyte.copcontrollers', [])
//
//
//.controller('costingoptimizerCtrl', function($scope, MenuFactory, decisionStoreFactory, $ionicListDelegate, $ionicLoading, $ionicPopup,$ionicActionSheet) {
//    $scope.tabs = [{
//        'name': 'Food',
//        'icon': 'ion-android-restaurant'
//    }, {
//        'name': 'Liquor',
//        'icon': 'ion-android-bar'
//    }]
//
////    console.log(MenuFactory.get_menus())
//    var menus = ['BRUNCH MENU','CATERING MENU','GF MENU','MAIN MENU','SPECIAL'];
//
//
//    selected_menu = menus[0]
//    // Triggered on a button click, or some other target
//     $scope.showMenus = function() {
//
//        var action_sheet_definition = {
//                                         buttons: [],
//                                //         destructiveText: 'Delete',
//                                         titleText: '<h4>Select Menu</h4>',
//                                         cancelText: 'Cancel',
//                                         cancel: function() {
//                                              // add cancel code..
//                                            },
//                                         buttonClicked: function(index) {
////                                            console.log(index)
//                                            // change menu here
//                                            selected_menu = menus[index]
//                                            hideSheet();
//                                         }
//                                       }
//        for(var i=0;i<menus.length; i++){
//            action_sheet_definition.buttons.push({'text': menus[i]})
//        }
//       // Show the action sheet
//       var hideSheet = $ionicActionSheet.show(action_sheet_definition);
//      }
//
//
//    $scope.overallcosts = MenuFactory.overallcosts();
//    $scope.menucatogories = MenuFactory.menucatogories();
//
//
//
//    $scope.il = function(flcategory, mcategory) {
//
//        var catdata = MenuFactory.categorydata(flcategory, mcategory);
//        return catdata.il.filter(function(i) {
//            return i.redflag == "redflag"
//        });
//    }
//
//
//    $scope.decide = function(decisiontype, item_name) {
////        console.log(selected_menu)
//        var add_task = true;
//
//        var disable_confirmation_popup_tasks = JSON.parse(localStorage.preferences)['disable_confirmation_popup_tasks']
////        console.log('pref now' + disable_confirmation_popup_tasks)
//        if (!disable_confirmation_popup_tasks) {
//            $scope.popupnoshow = {};
//            var confirmPopup = $ionicPopup.confirm({
//                scope: $scope,
//                title: 'Add Task',
//                template: '<div>Are you sure you want to ' + decisiontype + ' of ' + item_name + '?</div>' +
//                    //                                        '<label class="checkbox"><input type="checkbox">Do not ask me again</label>'
//                    '<div class="row checkbox"><div class="col col-20"><input type="checkbox" ng-model="popupnoshow.pref"></div><div class="col" style="padding-top: 10px">Do not ask me again</div></div>'
//            });
//
//            confirmPopup.then(function(res) {
//                if ($scope.popupnoshow.pref) {
//                    preferences = JSON.parse(localStorage.preferences);
//                    preferences['disable_confirmation_popup_tasks'] = true;
//                    localStorage.preferences = JSON.stringify(preferences);
//                }
//
//                add_task = res;
//
//                if (add_task) {
////                    console.log('pref then' + disable_confirmation_popup_tasks)
//                    this_decision = create_decision_cop(decisiontype, item_name);
//                    decisionStoreFactory.set_decision(this_decision);
//                    $ionicListDelegate.closeOptionButtons();
////                    $ionicLoading.show({
////                        template: "Task added : " + decisiontype + " of " + item_name,
////                        noBackdrop: true,
////                        duration: 1500
////                    });
//                }
//            });
//        } else {
//
//            if (add_task) {
////                console.log('pref then' + disable_confirmation_popup_tasks)
//                this_decision = create_decision_cop(decisiontype, item_name);
//                decisionStoreFactory.set_decision(this_decision);
//                $ionicListDelegate.closeOptionButtons();
//                $ionicLoading.show({
//                    template: "Task added : " + decisiontype + " of " + item_name,
//                    noBackdrop: true,
//                    duration: 1500
//                });
//            }
//        }
//    }
//
//
//})
//
//.controller('costingoptimizercategoryCtrl', function($scope, $stateParams, $ionicNavBarDelegate, MenuFactory, decisionStoreFactory, $ionicListDelegate, $ionicLoading, $ionicPopup) {
//
//        var catdata = MenuFactory.categorydata($stateParams.flcategory, $stateParams.mcategory);
//        $scope.category = {
//            'category': $stateParams.mcategory,
//            'flcategory': $stateParams.flcategory,
//            'categorycost': catdata.categorycost
//        }
//        $scope.items = catdata.il;
//
//    $scope.decide = function(decisiontype, item_name) {
////        console.log(selected_menu);
//        var add_task = true;
//
//        var disable_confirmation_popup_tasks = JSON.parse(localStorage.preferences)['disable_confirmation_popup_tasks']
////        console.log('pref now' + disable_confirmation_popup_tasks)
//        if (!disable_confirmation_popup_tasks) {
//            $scope.popupnoshow = {};
//            var confirmPopup = $ionicPopup.confirm({
//                scope: $scope,
//                title: 'Add Task',
//                template: '<div>Are you sure you want to ' + decisiontype + ' of ' + item_name + '?</div>' +
//                    //                                        '<label class="checkbox"><input type="checkbox">Do not ask me again</label>'
//                    '<div class="row checkbox"><div class="col col-20"><input type="checkbox" ng-model="popupnoshow.pref"></div><div class="col" style="padding-top: 10px">Do not ask me again</div></div>'
//            });
//
//            confirmPopup.then(function(res) {
//                if ($scope.popupnoshow.pref) {
//                    preferences = JSON.parse(localStorage.preferences);
//                    preferences['disable_confirmation_popup_tasks'] = true;
//                    localStorage.preferences = JSON.stringify(preferences);
//                }
//
//                add_task = res;
//
//                if (add_task) {
////                    console.log('pref then' + disable_confirmation_popup_tasks)
//                    this_decision = create_decision_cop(decisiontype, item_name);
//                    decisionStoreFactory.set_decision(this_decision);
//                    $ionicListDelegate.closeOptionButtons();
////                    $ionicLoading.show({
////                        template: "Task added : " + decisiontype + " of " + item_name,
////                        noBackdrop: true,
////                        duration: 1500
////                    });
//                }
//            });
//        } else {
//
//            if (add_task) {
////                console.log('pref then' + disable_confirmation_popup_tasks)
//                this_decision = create_decision_cop(decisiontype, item_name);
//                decisionStoreFactory.set_decision(this_decision);
//                $ionicListDelegate.closeOptionButtons();
//                $ionicLoading.show({
//                    template: "Task added : " + decisiontype + " of " + item_name,
//                    noBackdrop: true,
//                    duration: 1500
//                });
//            }
//        }
//    }
//        $ionicNavBarDelegate.showBackButton(true);
//    })
//    .controller('costingoptimizermenuitemCtrl', function($scope, $stateParams, $ionicScrollDelegate, $ionicModal, $state, $ionicNavBarDelegate, MenuFactory, decisionStoreFactory, $ionicListDelegate, $ionicLoading,$ionicPopup) {
//        $ionicNavBarDelegate.showBackButton(true);
//        //    console.log($stateParams.menuitem)
//        $scope.item = MenuFactory.itemdata($stateParams.flcategory, $stateParams.mcategory, $stateParams.menuitem);
//        $scope.toggleGroup = function(group) {
//            group.show = !group.show;
//            $ionicScrollDelegate.resize();
//        };
//        $scope.isGroupShown = function(group) {
//            return group.show;
//        };
//        $scope.pricing = {
//            averageprice: 0,
//            competitors: get_competitors($stateParams.menuitem, $scope.item.price),
//            show: false
//        };
//
//        for (var i = 0; i < $scope.pricing.competitors.length; i++) {
//            $scope.pricing.averageprice += $scope.pricing.competitors[i].price
//        }
//        $scope.pricing.averageprice /= $scope.pricing.competitors.length;
//
//
//
//        $scope.receipe = {
//            'totalcost': 0,
//            'change': 0
//        }
//        $scope.receipeitems = give_receipe($stateParams.menuitem);
//
//        for (var i = 0; i < $scope.receipeitems.length; i++) {
//            $scope.receipe.totalcost += $scope.receipeitems[i].cost
//            $scope.receipe.change += $scope.receipeitems[i].change
//
//        }
//        //    console.log($scope.receipe)
//
//    $scope.decide = function(decisiontype, item_name) {
//        var add_task = true;
//
//        var disable_confirmation_popup_tasks = JSON.parse(localStorage.preferences)['disable_confirmation_popup_tasks']
////        console.log('pref now' + disable_confirmation_popup_tasks)
//        if (!disable_confirmation_popup_tasks) {
//            $scope.popupnoshow = {};
//            var confirmPopup = $ionicPopup.confirm({
//                scope: $scope,
//                title: 'Add Task',
//                template: '<div>Are you sure you want to ' + decisiontype + ' of ' + item_name + '?</div>' +
//                    //                                        '<label class="checkbox"><input type="checkbox">Do not ask me again</label>'
//                    '<div class="row checkbox"><div class="col col-20"><input type="checkbox" ng-model="popupnoshow.pref"></div><div class="col" style="padding-top: 10px">Do not ask me again</div></div>'
//            });
//
//            confirmPopup.then(function(res) {
//                if ($scope.popupnoshow.pref) {
//                    preferences = JSON.parse(localStorage.preferences);
//                    preferences['disable_confirmation_popup_tasks'] = true;
//                    localStorage.preferences = JSON.stringify(preferences);
//                }
//
//                add_task = res;
//
//                if (add_task) {
////                    console.log('pref then' + disable_confirmation_popup_tasks)
//                    this_decision = create_decision_cop(decisiontype, item_name);
//                    decisionStoreFactory.set_decision(this_decision);
//                    $ionicListDelegate.closeOptionButtons();
////                    $ionicLoading.show({
////                        template: "Task added : " + decisiontype + " of " + item_name,
////                        noBackdrop: true,
////                        duration: 1500
////                    });
//                }
//            });
//        } else {
//
//            if (add_task) {
////                console.log('pref then' + disable_confirmation_popup_tasks)
//                this_decision = create_decision_cop(decisiontype, item_name);
//                decisionStoreFactory.set_decision(this_decision);
//                $ionicListDelegate.closeOptionButtons();
//                $ionicLoading.show({
//                    template: "Task added : " + decisiontype + " of " + item_name,
//                    noBackdrop: true,
//                    duration: 1500
//                });
//            }
//        }
//    }
//        //    $scope.receipeitemedit = function(item){
//        //        alert('changing item'+item);
//        //         $state.go('/HomePage');
//        //    }
//
//        $ionicModal.fromTemplateUrl('my-modal.html', {
//                scope: $scope,
//                animation: 'slide-in-up'
//            })
//            .then(function(modal) {
//                $scope.modal = modal;
//            });
//
//        $scope.openModal = function(item) {
//            $scope.modal.show();
//
//            $scope.receipeitemoptions = {
//                'name': item,
//                'uom':get_uom(item),
//                suppliers: get_suppliers(item)
//            }
//
//
//        };
//        $scope.closeModal = function() {
//            $scope.modal.hide();
//
//        };
//        //Cleanup the modal when we're done with it!
//        $scope.$on('$destroy', function() {
//            $scope.modal.remove();
//        });
//        // Execute action on hide modal
//        $scope.$on('modal.hidden', function() {
//            // Execute action
//        });
//        // Execute action on remove modal
//        $scope.$on('modal.removed', function() {
//            // Execute action
//        });
//
//
//
//    })
//
//
//.controller('costingoptimizerreceipeCtrl', function($scope, $stateParams, $ionicNavBarDelegate, MenuFactory) {
//    $ionicNavBarDelegate.showBackButton(true);
//
//})
//
//
//.controller('marginoptimizertabsCtrl', function($scope, $state,$ionicNavBarDelegate,$ionicActionSheet) {
//
//           $scope.FoodtabClickHandler = function() {
//            $state.go('app.marginoptimizer.Food');};
//
//           $scope.LiquortabClickHandler = function() {
//            $state.go('app.marginoptimizer.Liquor');};
//
//            var menus = ['BRUNCH MENU','CATERING MENU','GF MENU','MAIN MENU','SPECIAL'];
//
//
//    selected_menu = menus[0]
//    // Triggered on a button click, or some other target
//     $scope.showMenus = function() {
//
//        var action_sheet_definition = {
//                                         buttons: [],
//                                //         destructiveText: 'Delete',
//                                         titleText: '<h4>Select Menu</h4>',
//                                         cancelText: 'Cancel',
//                                         cancel: function() {
//                                              // add cancel code..
//                                            },
//                                         buttonClicked: function(index) {
////                                            console.log(index)
//                                            // change menu here
//                                            selected_menu = menus[index]
//                                            hideSheet();
//                                         }
//                                       }
//        for(var i=0;i<menus.length; i++){
//            action_sheet_definition.buttons.push({'text': menus[i]})
//        }
//       // Show the action sheet
//       var hideSheet = $ionicActionSheet.show(action_sheet_definition);
//      }
//
//
//
//    $ionicNavBarDelegate.showBackButton(true);
//
//})
//
//.controller('FoodTabCtrl', function($scope, $state,$ionicNavBarDelegate) {
//
//
//
//    $ionicNavBarDelegate.showBackButton(true);
//
//})
//
//.controller('LiquorTabCtrl', function($scope, $state,$ionicNavBarDelegate) {
//
//
//     $ionicNavBarDelegate.showBackButton(true);
//
//})
//
////.controller('MyController', function($scope, $ionicModal) {
////
////})
//
//.filter('makePositive', function() {
//    return function(num) {
//        return Math.abs(num);
//    }
//})
//
//;
//
//// function for generating random price variation
//function randp(price) {
//    return price + RandomNum(-2, 2)
//}
//// function for selecting random restaurant
//function randrest() {
//    var rests = ["Tandoori Restaurant", "New China", "Andrew's Open Pit & Spirit", "Los Sombreros Taqueria", "Subway", "Dunkin' Donuts", "Countryside Saloon", "Au Bon Pain", "Portillo's Hot Dogs", "Barnelli's Pasta Bowl", "168 Chinese Restaurant", "Omega Restaurant & Bakery", "Niles Cabana", "Cid's Ma Mon Luk", "Ruchi Restaurant", "Wally's Restaurant", "Twin Dragon Restaurant", "Hay Caramba Mexican", "Lola's Diner", "blufish Sushi Bistro"]
//    return rests[Math.floor(Math.random() * rests.length)]
//}
//
//// Returns a random integer between min (included) and max (included)
//
//function RandomInt(min, max) {
//    return Math.floor(Math.random() * (max - min + 1)) + min;
//}
//// Returns a random number between min (included) and max (included)
//
//function RandomNum(min, max) {
//    return roundToTwo(Math.random() * (max - min + 1)) + min;
//}
////rounds
//function roundToTwo(num) {
//    return +(Math.round(num + "e+2") + "e-2");
//}
//
//function create_decision_cop(decisiontype, item_name) {
//
//    return {
//        'startdate': '',
//        'completeddate': '',
//        'expiredate': '',
//        'pending': false,
//        'action': decisiontype,
//        'source': 'Margin Optimizer',
//        'tracked_items': [{
//            "Name": item_name,
//            "$Impact": 0,
//        }]
//    }
//
//}
//
//
//function give_receipe(id) {
//    var actual_receipes = {
//        "ID6576": [{
//            "menu_id": "ID6576",
//            "cost": 2.45,
//            //   "name": "Turkey Burger Patty",
//            "name": "Ground Turkey",
//            "change": 0.3,
//            "portion": '8 Oz'
//        }, {
//            "menu_id": "ID6576",
//            "cost": 0.86,
//            "name": "Brioche Bun",
//            "change": 0.1,
//            "portion": '1 Pc'
//        }, {
//            "menu_id": "ID6576",
//            "cost": 0.15,
//            "name": "Lettuce",
//            "change": -0.01,
//            "portion": '1 Oz'
//        }, {
//            "menu_id": "ID6576",
//            "cost": 0.2,
//            "name": "Tomato",
//            "change": -0.02,
//            "portion": '1 Oz'
//        }, {
//            "menu_id": "ID6576",
//            "cost": 0.06,
//            "name": "Ketchup",
//            "change": 0.01,
//            "portion": '1.5 Oz'
//        }, {
//            "menu_id": "ID6576",
//            "cost": 0.05,
//            "name": "Mustard",
//            "change": 0.0,
//            "portion": '1.5 Oz'
//        }, {
//            "menu_id": "ID6576",
//            "cost": 0.51,
//            "name": "French Fries",
//            "change": 0.04,
//            "portion": '6 Oz'
//        }, {
//            "menu_id": "ID6576",
//            "cost": 0.35,
//            "name": "Coleslaw",
//            "change": 0.02,
//            "portion": '4 Oz'
//        }, {
//            "menu_id": "ID6576",
//            "cost": 0.21,
//            "name": "Pickle",
//            "change": -0.01,
//            "portion": '1 Pc'
//        }],
//        "ID2100": [{
//            "menu_id": "ID2100",
//            "cost": 3.15,
//            "name": "Hamburger Patty",
//            "change": -0.2
//        }, {
//            "menu_id": "ID2100",
//            "cost": 0.86,
//            "name": "Brioche Bun",
//            "change": 0.1
//        }, {
//            "menu_id": "ID2100",
//            "cost": 0.15,
//            "name": "Lettuce",
//            "change": -0.02
//        }, {
//            "menu_id": "ID2100",
//            "cost": 0.2,
//            "name": "Tomato",
//            "change": 0.03
//        }, {
//            "menu_id": "ID2100",
//            "cost": 0.06,
//            "name": "Ketchup",
//            "change": 0.0
//        }, {
//            "menu_id": "ID2100",
//            "cost": 0.05,
//            "name": "Mustard",
//            "change": 0.0
//        }],
//        "ID7163": [{
//            "menu_id": "ID7163",
//            "cost": 3.15,
//            "name": "Hamburger Patty",
//            "change": -0.2
//        }, {
//            "menu_id": "ID7163",
//            "cost": 0.95,
//            "name": "Pretzel Bun",
//            "change": 0.15
//        }, {
//            "menu_id": "ID7163",
//            "cost": 0.45,
//            "name": "Onion Rings",
//            "change": 0.0
//        }, {
//            "menu_id": "ID7163",
//            "cost": 0.2,
//            "name": "Chipotle Mayo",
//            "change": 0.02
//        }, {
//            "menu_id": "ID7163",
//            "cost": 0.35,
//            "name": "Mozzarella Cheese",
//            "change": 0.04
//        }]
//    };
//
//    var random_receipe = [
//    {
//        'id': 'RI10',
//        'name': 'Patty',
//        'cost': 2,
//        'change': -0.1,
//    }, {
//        'id': 'RI11',
//        'name': 'Bun',
//        'cost': 1,
//        'change': 0.2,
//    }, {
//        'id': 'RI12',
//        'name': 'Lettuce',
//        'cost': 0.5,
//        'change': 0.2,
//    }, {
//        'id': 'RI13',
//        'name': 'Tomato',
//        'cost': 0.5,
//        'change': -0.1,
//    }, {
//        'id': 'RI14',
//        'name': 'Sauce',
//        'cost': 0.05,
//        'change': 0.0,
//    }, ]
//
//    if (id in actual_receipes) {
//        //        console.log(actual_receipes[id])
//        return actual_receipes[id]
//    } else {
//        return random_receipe
//    }
//
//}
//
//function get_competitors(id, price) {
//    var actual_competitors = {
//        "ID6576": [{
//            "menu_id": "ID6576",
//            "price": 14.0,
//            "competitor": "Howells & Hood",
//            "name": "Turkey Burger"
//        }, {
//            "menu_id": "ID6576",
//            "price": 14.0,
//            "competitor": "Rockit Bar & Grill",
//            "name": "Turkey Burger"
//        }, {
//            "menu_id": "ID6576",
//            "price": 12.0,
//            "competitor": "Local 22",
//            "name": "The Mag Mile Turkey"
//        }],
//        "ID2100": [{
//            "menu_id": "ID2100",
//            "price": 14.0,
//            "competitor": "Public House",
//            "name": "The Burger"
//        }, {
//            "menu_id": "ID2100",
//            "price": 14.0,
//            "competitor": "Rockit Bar & Grill",
//            "name": "Black Angus Burger"
//        }, {
//            "menu_id": "ID2100",
//            "price": 12.0,
//            "competitor": "Local 22",
//            "name": "Cal 22's Classic Burger"
//        }],
//        "ID7163": [{
//            "menu_id": "ID7163",
//            "price": 14.0,
//            "competitor": "Howells & Hood",
//            "name": "H&H Burger"
//        }, {
//            "menu_id": "ID7163",
//            "price": 10.59,
//            "competitor": "Red Robin",
//            "name": "Prime Chophouse"
//        }]
//    };
//
//    if (id in actual_competitors) {
//        return actual_competitors[id]
//    } else {
//        var dummy_competitors = []
//        for (var i = 0; i < RandomInt(2, 5); i++) {
//            dummy_competitors.push({
//                'competitor': randrest(),
//                'price': randp(price)
//            });
//        }
//        return dummy_competitors
//    }
//
//}
//
//
//function init_pref() {
//
//    if (localStorage.preferences === undefined) {
//        preferences = {
//            'disable_confirmation_popup_tasks': false
//        };
//        localStorage.preferences = JSON.stringify(preferences);
//    } else {
//        if (localStorage.preferences.disable_confirmation_popup_tasks === undefined) {
//            preferences = JSON.parse(localStorage.preferences);
//            preferences['disable_confirmation_popup_tasks'] = false;
//            localStorage.preferences = JSON.stringify(preferences);
//        }
//    }
////    preferences['disable_confirmation_popup_tasks'] = false;
//}
//
//
//function get_uom(item){
//    actual_UOMS = {'Ground Turkey': '$/LB',
//                    }
//
//    if (item in actual_UOMS) {
//            return actual_UOMS[item]
//        } else {
//        return '$/LB'
//    }
//}
//
//function get_suppliers(item){
////    console.log(item)
//    actual_suppliers = {'Ground Turkey': [
//                                        {'supplier': 'Greco', 'price': 3.90, 'current': false},
//                                        {'supplier': 'Sysco', 'price': 4.90, 'current': true},
//                                        {'supplier': 'US Foods', 'price': 4.65, 'current': false},
//                                        ],
//                        }
//
//    if (item in actual_suppliers) {
//        return actual_suppliers[item]
//    } else {
//        var dummy_suppliers = []
//        var thisprice = RandomNum(2,5);
//        for (var i = 0; i < RandomInt(2, 3); i++) {
//            dummy_suppliers.push({'supplier': randsupplier(),
//                            'price': randps(thisprice), 'current': false});
//        }
//        dummy_suppliers[RandomInt(0,dummy_suppliers.length-1)].current=true;
//        return dummy_suppliers
//    }
//}
//
//function randsupplier() {
//    var supps = ['Greco', 'Grecian', 'Sysco', 'US Foods']
//    return supps[Math.floor(Math.random() * supps.length)]
//}
//
//// function for generating random price variation
//function randps(price) {
//    return price + RandomNum(-0.5, 0.5)
//}
