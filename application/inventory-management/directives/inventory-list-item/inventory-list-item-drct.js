(function () {
    var InventoryListItem = function (appModalService) {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            bindToController: {
                item: '&'
            },
            controller: function () {

            },
            controllerAs: 'ctrl',
            templateUrl: 'application/inventory-management/directives/inventory-list-item/inventory-list-item.html',
            link: function (scope, ele, attr, controllers) {
                scope.Item = controllers.item();
                //console.log(controllers.Item);
                scope.Item.total_value_of_inventory = _.round((scope.Item.total_value_of_inventory), 2)
                scope.Item.date = new Date(parseInt(scope.Item.inventory_date, 10)*1000).formatForPeprInventory();
                scope.Item.date = moment(scope.Item.date).format("ddd MMM DD YYYY");
                // console.log(moment(controllers.Item.date).format("ddd MMM DD YYYY"));
                

            }
        };
    };
    InventoryListItem.$inject = ['appModalService'];
    projectCostByte.directive('inventoryListItem', InventoryListItem)
})();
