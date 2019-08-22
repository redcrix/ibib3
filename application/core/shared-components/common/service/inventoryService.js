(function() {
  'use strict';

  projectCostByte.service('inventoryService', inventoryService);
  inventoryService.$inject = ['$timeout', '$q'];

  function inventoryService(CommonConstants, Utils, $timeout, $q) {
     var catItems = '';
     var mode = '';
     var selectedInv = '';
     var filterView = '';
     var allCatData = '';
     var msg = '';
     var inventoryId = '';
     var groupBy = '';
     var mapSelected = [];
     return {
         setCatItems:function(value){
             catItems = value;
         },
         getCatItems:function(){
             return catItems;
         },
         setMode:function(value){
             mode = value;
         },
         getMode:function(){
             return mode;
         },
         setSelectedInv:function(value){
             selectedInv = value;
         },
         getSelectedInv:function(){
             return selectedInv;
         },
         setFilterView:function(value){
             filterView = value;
         },
         getFilterView:function(){
             return filterView;
         },
         setAllCatData:function(value){
             allCatData = value;
         },
         getAllCatData:function(){
             return allCatData;
         },
         setStatusMsg:function(value){
             msg = value;
         },
         getStatusMsg:function(){
             return msg;
         },
         setInventoryId:function(value){
             inventoryId = value;
         },
         getInventoryId:function(){
             return inventoryId;
         },
         setSelectedGroupBy:function(value){
             groupBy = value;
         },
         getSelectedGroupBy:function(){
             return groupBy;
         },
         setPnlMapSelected:function(value){
           if(!value){
             mapSelected = [];
           } else {
             mapSelected.push(value);
           }

         },
         getPnlMapSelected:function(){
             return mapSelected;
         },
     };
  }
})();
