(function() {
    var OrderingListItem = function() {
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
            templateUrl: 'application/ordering/directives/ordering-list-item/ordering-list-item.html',
            link: function(scope, ele, attr, controllers) {
                controllers.Item = controllers.item();
                controllers.Item.total_value_of_ordering = controllers.Item.total_value_of_ordering != 0 ? parseFloat(controllers.Item.total_value_of_ordering).toFixed(2) : 0;
                // console.log(controllers.Item.total_value_of_ordering);

                controllers.Item.date = new Date(parseInt(controllers.Item.ordering_date, 10) * 1000).formatForPeprOrdering();
            }
        };
    };
    OrderingListItem.$inject = [];
    projectCostByte.directive('orderingListItem', OrderingListItem)
})();
