(function() {
    var OrderingListSubmitItem = function() {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            bindToController: {
                item: '&'
            },
            controller: function() {

            },
            controllerAs: 'ctrl',
            templateUrl: 'application/ordering/directives/ordering-list-submit-item/ordering-list-submit-item.html',
            link: function(scope, ele, attr, controllers) {
                controllers.Item = controllers.item();
                //console.log(controllers.Item);
                //controllers.Item.total_value_of_ordering = controllers.Item.total_value_of_ordering.toFixed(2)
                //console.log(controllers.Item.actual_food_cost_percentage);
                if (controllers.Item.actual_food_cost_percentage == undefined) {
                    controllers.Item.actual_food_cost_percentage = " In Process"
                }
                if (controllers.Item.wastage == undefined) {
                    controllers.Item.wastage = "In Process"
                }
                controllers.Item.date = new Date(parseInt(controllers.Item.ordering_date, 10) * 1000).toDateString();
            }
        };
    };
    OrderingListSubmitItem.$inject = [];
    projectCostByte.directive('orderingListSubmitItem', OrderingListSubmitItem)
})();
