(function() {
  'use strict';
    
  projectCostByte.factory('supportToolService', supportToolService);

  supportToolService.$inject = ['CommonService', '$q'];

  function supportToolService(CommonService, $q) {

    var fieldNames = ["profits", "food_cost", "liquor_cost", "labor_cost", "fixed_cost"];

    var supportToolFactory = {
      fetchAllBusiness: fetchAllBusiness,
      fetchAllSupplier:fetchAllSupplier,
      fetchAllMeasurements:fetchAllMeasurements,
      fetchPriceTrackData: fetchPriceTrackData,
      sendWeeklyPriceChangeData: sendWeeklyPriceChangeData,
      saveDRAFT:saveDRAFT
    };

  
    function fetchAllBusiness(details) {
      return $q(function(resolve, reject) {
        function resHandler(data) {
          resolve(data);
        }
        CommonService.fetchAllBusinessList(resHandler,details);
      });
    }

    function fetchAllSupplier(details) {
      return $q(function(resolve, reject) {
        function resHandler(data) {
          resolve(data);
        }
        CommonService.fetchAllSupplier(resHandler,details);
      });
    }

    function fetchAllMeasurements(details) {
      return $q(function(resolve, reject) {
        function resHandler(data) {
          resolve(data);
        }
        CommonService.fetchAllMeasurements(resHandler,details);
      });
    }


    function fetchPriceTrackData(details) {
      return $q(function(resolve, reject) {
        function resHandler(data) {
          resolve(data);
        }
        CommonService.fetchAllPriceTrackData(resHandler,details);
      });
    }
    function sendWeeklyPriceChangeData(details) {
      return $q(function(resolve, reject) {
        function resHandler(data) {
          resolve(data);
        }
        CommonService.exportWeeklyPriceChangeData(resHandler,details);
      });
    }

    function saveDRAFT(details) {
      return $q(function(resolve, reject) {
        function resHandler(data) {
          resolve(data);
        }
        CommonService.exportDRAFT(resHandler,details);
      });
    }





    return supportToolFactory;
  }

})();
