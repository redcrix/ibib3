(function () {
    var InvoiceListItem = function (appModalService) {
        return {
            restrict: 'E',
            replace: true,
            scope: {
              item: '='
            },
            // bindToController: {
            //     item: '&'
            // },
            controller: function () {

            },
            // controllerAs: 'ctrl',
            templateUrl: 'application/supportTools/directives/invoice-list-item/invoice-list-item.html',
            link: function (scope, ele, attr, controllers) {
                // Item = item();
                console.log('--------------------------------');
                // console.log(scope.item);

                // Item.totalAmount = _.round((Item.total_value_of_inventory), 2)
                // Item.date = new Date(parseInt(Item.inventory_date, 10)*1000).formatForPeprInventory();
                // Item.date = moment(controllers.Item.date).format("ddd MMM DD YYYY");
                // // console.log(moment(controllers.Item.date).format("ddd MMM DD YYYY"));


            }
        };
    };
    InvoiceListItem.$inject = ['appModalService'];
    projectCostByte.directive('invoiceListItem', InvoiceListItem)
})();
