(function() {
    'use strict';

    projectCostByte.factory('PurchaseOptimizerService', PurchaseOptimizerService);

    PurchaseOptimizerService.$inject = ['CommonService'];

    function PurchaseOptimizerService(CommonService) {

        var PurchaseOptimizerFactory = {
            fetchIngredients: fetchIngredients,
            makeOrder :makeOrder,
        };


        function fetchIngredients(ingredientCount, responseHandler) {
            CommonService.fetchPurchaseOptimizerData(ingredientCount, responseHandler);
        }


        function makeOrder(responseHandler, orderData){
            CommonService.createIngredientsPurchaseOrder(responseHandler, orderData);
        }
        
        return PurchaseOptimizerFactory;
    }

})();
