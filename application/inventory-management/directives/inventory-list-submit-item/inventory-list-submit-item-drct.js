(function () {
    var InventoryListSubmitItem = function () {
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
            templateUrl: 'application/inventory-management/directives/inventory-list-submit-item/inventory-list-submit-item.html',
            link: function (scope, ele, attr, controllers) {
                controllers.Item = controllers.item();
                let total_value = parseFloat(controllers.Item.total_value_of_inventory);
                // console.log(controllers.Item.total_value_of_inventory);
                controllers.Item.total_value_of_inventory = total_value.toFixed(2);
              //console.log(controllers.Item.actual_food_cost_percentage);
              if (controllers.Item.actual_food_cost_percentage == undefined)
              {
                controllers.Item.actual_food_cost_percentage = " In Process"
              }
              if (controllers.Item.wastage == undefined)
              {
                controllers.Item.wastage = "In Process"
              }
               controllers.Item.date = new Date(parseInt(controllers.Item.inventory_date, 10)*1000).toDateString();
            }
        };
    };
    InventoryListSubmitItem.$inject = [];
    projectCostByte.directive('inventoryListSubmitItem', InventoryListSubmitItem)
})();
