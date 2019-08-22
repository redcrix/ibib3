(function() {
  'use strict';

  projectCostByte.service('orderingService', orderingService);
  orderingService.$inject = ['$timeout', '$q'];

  function orderingService(CommonConstants, Utils, $timeout, $q) {
     var draftItems = [];
     // var recommendedItems = [];

     return {
         setDraftItems:function(value){
             draftItems = value;
         },
         getDraftItems:function(){
             return draftItems;
         },
         // setrecommendedItems:function(value){
         //     recommendedItems = value;
         //     console.log("From service: ",recommendedItems);
         // },
         // getrecommendedItems:function(){
         //   console.log("Get from Service: ",recommendedItems);
         //     return recommendedItems;
         // },

     };
  }
})();
