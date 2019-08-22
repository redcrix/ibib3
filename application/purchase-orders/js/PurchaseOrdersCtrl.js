(function () {
    projectCostByte.controller('PurchaseOrdersCtrl', purchaseOrdersCtrl);

    purchaseOrdersCtrl.$inject = ['$scope', 'DashboardTasksService', '$state', 'CommonConstants', 'CommonService', '$ionicActionSheet',
                                    '$rootScope', 'Utils', '$ionicListDelegate', '$ionicPopup', '$ionicScrollDelegate',
                                     '$ionicLoading'];


    function purchaseOrdersCtrl($scope, DashboardTasksService, $state, CommonConstants,
        CommonService, $ionicActionSheet, $rootScope, Utils, $ionicListDelegate,
        $ionicPopup, $ionicScrollDelegate, $ionicLoading) {

        $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
            viewData.enableBack = true;
        });


        $scope.buttons = {
            'ShowDelete': false,
        };

        $scope.showOrderDetails = function(index) {
            var order = $scope.orders[index];
            showDetails(order);
        }

        var showDetails = function(order) {
            var orderDetailsHTML = getOrderDetailsHTML(order);
            showAlertMessage(orderDetailsHTML);
        }

        var getOrderDetailsHTML = function(order) {
            var orderName = order.name;
            if (!orderName) {
                orderName = "";
            }
            var html = "<h4>" + orderName + "</h4>";
            html += "<table style='width: 100%;text-align: left;'><tr><th style='font-weight: bold;border-bottom: 1px solid #ddd;'>Ingredient</th>" +
             "<th style='font-weight: bold;border-bottom: 1px solid #ddd;'>Supplier</th>" +
              "<th style='font-weight: bold;border-bottom: 1px solid #ddd;'>Price</th></tr>";
            for (var i in order.ingredients) {
                var ingredient = order.ingredients[i];
                html += "<tr style='border-bottom: 1px solid #ddd;'><td style='border-bottom: 1px solid #ddd;'>" + ingredient.name + "</td>";
                html += "<td style='border-bottom: 1px solid #ddd;'>" + ingredient.supplier.name + "</td>";
                html += "<td style='border-bottom: 1px solid #ddd;'>$" + ingredient.supplier.price.toFixed(2) + "</td></tr>";
            }
            html += '</table>';
            return html;
        }

        //On Tasks init handler
        $scope.onPurchaseOrdersInit = function () {
            fetchOrders();
            $scope.orders = [{"name": "Test order 1"}, {"name": "Test order 2"}, {"name": "Test order 3"}];
        }

        var fetchOrdersResponseHandler = function(orders) {
            $scope.orders = orders;
        }

        var fetchOrders = function() {
            CommonService.fetchOrders(fetchOrdersResponseHandler);
        }

        var toastMessage = function(message_text, duration) {
            if (typeof duration === 'undefined') duration = 1500;
            $ionicLoading.show({
                template: message_text,
                noBackdrop: true,
                duration: duration
            });
        }

        var showAlertMessage = function(alertMessageText) {
            var alertPopup = $ionicPopup.alert({
                title: 'Order details',
                template: alertMessageText
            });

            alertPopup.then(function(res) {
            });
        }
    }

})();