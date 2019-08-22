(function () {
    var inventoryHomeSvc = function ($q, $timeout, CommonService) {
        var getInventories = function () {
          var groupdData = [];
            return $q(function (resolve, reject) {
                CommonService.fetchInventories(function (data) {
                    groupdData = _.groupBy(data.data.inventory_list, 'inventory_status') || { draft: [], submitted: [] };
                    groupdData.status = data.status;
                    groupdData.draft = (!groupdData.draft) ? [] : groupdData.draft;
                    groupdData.draft = _.orderBy(groupdData.draft, ['inventory_date', 'name'], ['desc', 'asc']);
                    groupdData.submitted = (!groupdData.submitted) ? [] : groupdData.submitted;
                    groupdData.submitted = _.orderBy(groupdData.submitted, ['inventory_date', 'name'], ['desc', 'asc']);

                    resolve(groupdData);
                });
            });
        };

        var fetchStores = function(){
            return $q(function (resolve, reject) {
                CommonService.fetchStores(function (data) {
                    var stores = [];
                    if(!!data && data.business_stores) {
                        stores = data.business_stores;
                    }
                    resolve(stores);
                });
            });
        };
       var passTotalValue = function(value, draft){
         // console.log('passTotalValue: ',value,draft);
         this.totalValue = value;
         this.draft_id = draft;
      };

      var passUnits = function(unit, draft){
        this.unit = unit;
        this.draft_id = draft;
          };

       var getTotalValue = function(){
         // var that = this;
         var data = [];
         // console.log(this.totalValue,this.draft_id);
         data.total_value = this.totalValue;
         data.draftId = this.draft_id;
         return $q(function (resolve, reject) {
           resolve(data)
         });
       };

       var fetchInventoryItems = function(){
         return $q(function (resolve, reject) {
            CommonService.fetchInvItemsNew(function (data) {
                // var datas = {};
                // if(data && data.supItems) {
                //     datas = data.supItems;
                // }
                // console.log(data);
                resolve(data);
            });
         });
       };

       var getUnit = function(){
         var that = this;
         var data = [];
         data.unit = that.unit;
         data.draftId = that.draft_id;
         return $q(function (resolve, reject) {
           resolve(data)
         });
                 };

        var createInventory = function (payload) {
            return $q(function (resolve, reject) {
                CommonService.createInventory(function (data) {
                    // console.log(data);
                    resolve(data);
                }, payload);
            });
        };

        var updateInventory = function (payload) {
            return $q(function (resolve, reject) {
                CommonService.updateInventory(function (data) {
                    resolve(data);
                }, payload);
            });
        };

        var deleteInventory = function (payload) {
            return $q(function (resolve, reject) {
                CommonService.deleteInventory(function (data) {
                    resolve(data.data);
                }, payload);
            });
        };

        var exportInventory = function(draftId, emailId) {
            return $q(function(resolve, reject) {
                CommonService.exportInventory(function(data) {
                    resolve(data);
                }, draftId, emailId);
            });
        };

        var exportSales = function(datas) {
            return $q(function(resolve, reject) {
                CommonService.exportSalesData(function(data) {
                    resolve(data);
                }, datas);
            });
        };

        return {
            fetchStores:fetchStores,
            getInventories: getInventories,
            createInventory: createInventory,
            deleteInventory: deleteInventory,
            getTotalValue: getTotalValue,
            passTotalValue:passTotalValue,
            updateInventory: updateInventory,
            exportInventory: exportInventory,
            fetchInventoryItems: fetchInventoryItems,
            exportSales: exportSales
        }
    };
    inventoryHomeSvc.$inject = ['$q', '$timeout', 'CommonService'];
    projectCostByte.factory('inventoryHomeSvc', inventoryHomeSvc);
})();
