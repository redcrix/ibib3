(function() {
    'use strict';

    projectCostByte.factory('PromotionOptimizerService', PromotionOptimizerService);

    PromotionOptimizerService.$inject = ['CommonService'];

    function PromotionOptimizerService(CommonService) {

        var PromotionOptimizerFactory = {
                fetchPromotionData : fetchPromotionData,

        }

        function fetchPromotionData(responseHandler, PromotionDataType){
            CommonService.fetchPromotionData(responseHandler, PromotionDataType)
        }

        return PromotionOptimizerFactory;
    }

})();
