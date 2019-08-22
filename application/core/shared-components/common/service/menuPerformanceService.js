(function() {
  'use strict';

  projectCostByte.service('menuPerformanceService', menuPerformanceService);
  menuPerformanceService.$inject = ['CommonConstants','Utils','$timeout', '$q'];

  function menuPerformanceService(CommonConstants, Utils, $timeout, $q) {
     var menuItemsList = '';
     var ingList =[];
     var updatedIngList=[];
     return {
         setMenuItemsList:function(value){
             menuItemsList = value;
         },
         getMenuItemsList:function(){
             return menuItemsList;
         },
         setIngList:function(value){
             ingList = value;
         },
         getIngList:function(){
             return ingList;
         },
         getUpdatedIngList:function(main,sub){
           // console.log('getUpdatedIngList');
            return $q(function (resolve, reject) {
              let finalIngList = []
              if(sub.length){
                finalIngList = _.filter(main,function(ing){
                  _.filter(sub,function(localIng){
                    // console.log(ing.ingredientId, localIng.ingredientId);
                      if(ing.ingredientId == localIng.ingredientId){
                        ing.portion = localIng.portion;
                        // console.log(ing.portion);
                        ing.unit = localIng.unit
                      }
                      // else {
                      //   ing.portion = ing.ingredientQuantity;
                      //   ing.unit = ing.ingredientUnit;
                      // }
                  });
                  // console.log(ing);
                  return ing;
                });
              } else {
                finalIngList = _.filter(main,function(ing){
                  ing.portion = ing.ingredientQuantity;
                  ing.unit = ing.ingredientUnit;
                  return ing;
                });
              }
              // console.log(finalIngList);
              resolve(finalIngList);
            });
         },

     };
  }
})();
