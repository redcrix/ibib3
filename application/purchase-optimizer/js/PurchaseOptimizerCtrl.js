(function () {
    projectCostByte.controller('PurchaseOptimizerCtrl', purchaseOptimizerCtrl);
    purchaseOptimizerCtrl.$inject = ['$scope', 'PurchaseOptimizerService', '$state', 'CommonConstants', 'CommonService', '$ionicActionSheet'
                                    , '$rootScope', 'Utils', '$ionicListDelegate', '$ionicPopup', '$ionicScrollDelegate'
                                    , 'DashboardTasksService', '$ionicLoading', '$stateParams', '$ionicHistory'];
    var PurchaseOptimizerData;

    function purchaseOptimizerCtrl($scope, PurchaseOptimizerService, $state, CommonConstants,
    CommonService, $ionicActionSheet, $rootScope, Utils, $ionicListDelegate, $ionicPopup, $ionicScrollDelegate,
    DashboardTasksService, $ionicLoading, $stateParams, $ionicHistory) {
        $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
            viewData.enableBack = true;
        });

        $scope.onOrderPageInit = function(){
            $scope.pageTitle = "Purchase Optimizer";
        }

        //click handlers
        $scope.filterbuttons = [
            {
                'label': 'High Impact',
                'performanceclass': 'high_impact',
                'style': 'button-balanced',
                'clicked': false
            }
            , {
                'label': 'Big Change',
                'performanceclass': 'big_change',
                'style': 'button-positive',
                'clicked': false
            }
         , ]

        $scope.userPerformanceClass = "all"
        $scope.filterPerformanceClass = function(element) {
            if(element.performanceclass.hasOwnProperty($scope.userPerformanceClass)) {
                return true;
            } else {
                return false;
            }
        }

        $scope.filterbuttonclick = function(filterbuttonindex) {
            for (var i = 0; i < $scope.filterbuttons.length; i++) {
                if (i == filterbuttonindex) {
                    $scope.filterbuttons[i].clicked = !($scope.filterbuttons[i].clicked);
                    if(!$scope.filterbuttons[i].clicked) {
                        $scope.userPerformanceClass = "all";
                    } else {
                        $scope.userPerformanceClass =$scope.filterbuttons[i].performanceclass
                    }
                } else {
                    $scope.filterbuttons[i].clicked = false;
                }
            }
        }

        $scope.FoodtabClickHandler = function() {
            $state.go('app.Purchaseoptimizer.Food');
        };

        $scope.LiquortabClickHandler = function() {
            $state.go('app.Purchaseoptimizer.Liquor');
        };

        $scope.getOrder = function() {
            $scope.$broadcast('NEW_ORDER_BUSY');
            var categoryName = $state.current.name.split(".").pop();
            var orderData = $scope.categories[categoryName];
            createNewOrder(createNewOrderResponseHandler, orderData);
        }

        $scope.mopresetData = function() {
            if (PurchaseOptimizerData === undefined) {
                PurchaseOptimizerData = {
                    'ingredients': [],
                    'orderToSend': false
                };
            }
        }

        //On Purchase Optimizer init handler
        $scope.onPurchaseOptimizerInitHandler = function() {
            $scope.pageHeading = "Purchase Optimizer";
            $scope.navBarTitle.showToggleButton = true;
            $scope.mopresetData();
            if (PurchaseOptimizerData.ingredients.length == 0) {
                fetchIngredients();
            }
        }

        var sendOrderResponseHandler = function() {
            toastMessage('Order Confirmed!')
            PurchaseOptimizerData.orderToSend = false;
        }

        var sendOrder  = function() {
            var myPopup = $ionicPopup.show({
                template: '<input id="purchase_order_name_id" type="text" ng-model="test">',
                title: 'Enter order name',
                subTitle: '',
                scope: $scope,
                buttons: [
                    {
                        text: 'Cancel'
                    },
                    {
                        text: '<b>Create</b>',
                        type: 'button-positive',
                        onTap: function(e) {
                            var orderName = document.getElementById('purchase_order_name_id').value;
                            //console.log(orderName);
                            if (!orderName) {
                                e.preventDefault();
                            } else {
                                return orderName;
                            }
                        }
                    }
                ]
            });

            myPopup.then(function(res) {
                if (res) {
                    $scope.orderName = res;
                    var orderData = {'order_name': $scope.orderName, 'ingredients': $scope.ingredientsData}
                    PurchaseOptimizerService.makeOrder(sendOrderResponseHandler, orderData);
                }
            });
        }

        var createNewOrderResponseHandler = function(ingredientsData) {
            if (ingredientsData.length > 0){
                PurchaseOptimizerData.orderToSend = true;
                $scope.ingredientsData = ingredientsData;
                if (PurchaseOptimizerData.orderToSend){
                    //console.log("new order free");
                    sendOrder();
                }
            }else{
                toastMessage('No item selected to order')
            }
        }

        var createNewOrder = function(responseHandler, orderData) {
            var selectedIngredients = [];
            var ingredients = orderData.sections[0].ingredients;
            for (var ingredientIndex = 0; ingredientIndex < ingredients.length; ingredientIndex++) {
                var ingredient = ingredients[ingredientIndex];
                if (ingredient['to_order']) {
                    var selectedSupplier;
                    for (var supplierIndex = 0; supplierIndex < ingredient.suppliers.length; supplierIndex++) {
                        var supplier = ingredient.suppliers[supplierIndex];
                        if (supplier['current']) {
                            selectedSupplier = {'name': supplier['name'], 'id': supplier['id'], 'price': parseFloat(supplier['price'])};
                            break;
                        }
                    }
                    if (selectedSupplier) {
                        var selectedIngredient = {'id': ingredient['id'], 'name': ingredient['name'], 'supplier': selectedSupplier};
                        selectedIngredients.push(selectedIngredient);
                    }
                }
            }
            console.log("calling responseHandler");
            responseHandler(selectedIngredients);
        }

        $scope.CategoryExists = function(categoryName) {
            if ("categories" in $scope) {
                if (categoryName in $scope.categories) {
                    return 'ng-show'
                }
            }
            return 'ng-hide'
        }

        var fetchIngredientsResponseHandler = function(ingredient_data) {
                $scope.categories = {'Food': {'sections': [ingredient_data]}};
                console.log(JSON.stringify($scope.categories));
                $scope.$broadcast('MOP_FREE');
            }

        // get index of object in list
        var getIndexIfObjWithOwnAttr = function(array, attr, value) {
            for (var i = 0; i < array.length; i++) {
                if (array[i].hasOwnProperty(attr) && array[i][attr] === value) {
                    return i;
                }
            }
            return -1;
        }

        var fetchIngredients = function() {
            //http request for fetching menus
            $scope.$broadcast('MOP_BUSY');
            PurchaseOptimizerService.fetchIngredients(30, fetchIngredientsResponseHandler);
        }

        var makeOrder = function (order_data) {
        }

        $scope.$on('MOP_BUSY', function(event) {
            $scope.spinnerhide = false;
        });

        $scope.$on('MOP_FREE', function(event) {
            $scope.spinnerhide = true;
        });

        $scope.$on('NEW_ORDER_FREE', function(event) {

        });

        var toastMessage = function(message_text, duration) {
            if (typeof duration === 'undefined') duration = 1500;
            $ionicLoading.show({
                template: message_text,
                noBackdrop: true,
                duration: duration
            });
        }
    }
})();
