(function() {
    var orderingHomeSvc = function($q, $timeout, CommonService) {
        var getOrdering = function() {
            return $q(function(resolve, reject) {
                CommonService.fetchOrdering(function(data) {
                    // console.log(data);
                    var groupdData = _.groupBy(data.data.ordering_list, 'ordering_status') || {
                        draft: [],
                        submitted: []
                    };
                    groupdData.draft = (!groupdData.draft) ? [] : groupdData.draft;
                    groupdData.draft = _.orderBy(groupdData.draft, ['ordering_date', 'name'], ['desc', 'asc']);
                    groupdData.submitted = (!groupdData.submitted) ? [] : groupdData.submitted;
                    groupdData.submitted = _.orderBy(groupdData.submitted, ['ordering_date', 'name'], ['desc', 'asc']);
                    resolve(groupdData);
                });
            });
        };

        var fetchStores = function() {
            return $q(function(resolve, reject) {
                CommonService.fetchStores(function(data) {
                    var stores = [];
                    if (!!data && data.business_stores) {
                        stores = data.business_stores;
                    }
                    resolve(stores);
                });
            });
        };
        var passTotalValue = function(value, draft) {
            this.totalValue = value;
            this.draft_id = draft;
        };

        var getTotalValue = function() {
            var that = this;
            var data = [];
            data.total_value = that.totalValue;
            data.draftId = that.draft_id;
            return $q(function(resolve, reject) {
                resolve(data)
            });
        };

        var createOrdering = function(payload) {
            return $q(function(resolve, reject) {
                CommonService.createOrdering(function(data) {
                    resolve(data.data);
                }, payload);
            });
        };

        var updateOrdering = function(payload) {
            return $q(function(resolve, reject) {
                CommonService.updateOrdering(function(data) {
                    resolve(data);
                }, payload);
            });
        };

        var deleteOrdering = function(payload) {
            return $q(function(resolve, reject) {
                CommonService.deleteOrdering(function(data) {
                    resolve(data.data);
                }, payload);
            });
        };
        return {
            fetchStores: fetchStores,
            getOrdering: getOrdering,
            createOrdering: createOrdering,
            deleteOrdering: deleteOrdering,
            getTotalValue: getTotalValue,
            passTotalValue: passTotalValue,
            updateOrdering: updateOrdering
        }
    };
    orderingHomeSvc.$inject = ['$q', '$timeout', 'CommonService'];
    projectCostByte.factory('orderingHomeSvc', orderingHomeSvc);
})();
