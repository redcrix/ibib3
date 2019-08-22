(function () {
    projectCostByte.controller('conversionFactorCtrl', conversionFactorCtrl);

    conversionFactorCtrl.$inject = ['$q', '$scope', '$state','$ionicLoading', '$stateParams', '$timeout', 'inventoryItemsSvc', '$rootScope', 'parameters', 'CommonService', '$ionicPopup', '$ionicSlideBoxDelegate'];

    function conversionFactorCtrl($q, $scope, $state,$ionicLoading, $stateParams, $timeout, inventoryItemsSvc, $rootScope, parameters, CommonService, $ionicPopup, $ionicSlideBoxDelegate) {
    	console.log("menu parameters",parameters);
        $scope.convdata=true;
        $scope.coversionData = [];
        $scope.data=parameters;
        
        $scope.recipeValue=$scope.data.ingredientQuantity;
        $scope.dataReceived = false;
         var getCoversion = function(items){
             $scope.getCoversionData = items.data;
            // console.log("items",items);
            $scope.supplierName=items.data.supplierName;
            if($scope.supplierName == "N/A" ||$scope.supplierName =='' ){
            $scope.data.ingredientSupplierName='UnMapped'
        }
            $scope.coversionData=items.data.conv_units.conv;
            _.forEach($scope.coversionData,function(item){
                $scope.valueUnit=item.val;
            })
            
            _.forEach($scope.coversionData,function(value,index){
                _.forEach($scope.getCoversionData.pack,function(item){
                        if(item.includes(value.item_name)){
                           $scope.coversionData[index].conversion_unit_list= $scope.getCoversionData.pack.concat($scope.getCoversionData.pieces,$scope.getCoversionData.volume,$scope.getCoversionData.weight);
                            // console.log("pack units",$scope.coversionData.conversion_unit_list);
                        }
                    })
                     _.forEach($scope.getCoversionData.pieces,function(item){
                                if(item.includes(value.item_name)){
                                   $scope.coversionData[index].conversion_unit_list= $scope.getCoversionData.weight;
                                    // console.log("pices units",$scope.coversionData.conversion_unit_list);
                                }
                            })
                    _.forEach($scope.getCoversionData.weight,function(item){
                        if(item.includes(value.item_name)){
                           $scope.coversionData[index].conversion_unit_list= $scope.getCoversionData.volume.concat($scope.getCoversionData.pieces);
                           // console.log("weight",$scope.coversionData.conversion_unit_list);
                           
                        }
                    })
                    _.forEach($scope.getCoversionData.volume,function(item){
                        if(item.includes(value.item_name)){
                           $scope.coversionData[index].conversion_unit_list = $scope.recipe;
                           // console.log("volume",$scope.coversionData.conversion_unit_list);
                           
                        }
                    })
            })
            _.forEach($scope.coversionData,function(item){
                $scope.recipeValue *= item.val;
                // console.log("$scope.recipeValue",$scope.recipeValue)
                if(item.unit == ''){
                    $scope.currentVal=true;
                }else{
                    $scope.currentVal=false;
                }
            })
            $scope.dataReceived = true;  
        }

         
        $scope.changeUnit = function(unit,item,rowNum){
            // console.log("change unit",unit,item,rowNum);
            var totalItems = $scope.coversionData.length;
            var toBeremoved = totalItems - rowNum + 1;
            $scope.coversionData.splice(rowNum+1,toBeremoved);
            _.forEach($scope.coversionData,function(item){
                if(item.unit === ''){
                    $scope.currentVal=true;
                }else{
                    $scope.currentVal=false;
                }
            })
            $scope.recipeValue=$scope.data.ingredientQuantity;
            _.forEach($scope.coversionData,function(value){
                if(value.val != undefined){
                    $scope.recipeValue *= value.val;
                }
            })
        }
        
        $scope.changeUnitValue= function(item){
            $scope.recipeValue=$scope.data.ingredientQuantity;
          _.forEach($scope.coversionData,function(dataVal){
                 if(dataVal.item_name == item.item_name){
                     dataVal.val=item.val;
                 }
            })
            _.forEach($scope.coversionData,function(value){
                if(value.val != undefined){
                $scope.recipeValue *= value.val;
                }
            })
            // console.log("item",item)
        }

        var service = function(data){            
            // console.log("data",data);
            CommonService.getCoversionFactor(getCoversion,data.ingredientId);

        }
       service($scope.data);

    	$scope.conversion_unit_list = [];
        	


    	_.forEach($scope.conversion_unit_list, function(item) {
                    if(item.selected === true) {
                        $scope.selectedConversionFactory = item.key;

                        // console.log("$scope.selectedConversionFactory",$scope.selectedConversionFactory,item)
                    }
                });
        $scope.recipe = [$scope.data.ingredientUnit];
        // console.log("$scope.recipe",$scope.recipe);
        var toastMessage = function (message_text, duration) {
                if (typeof duration === 'undefined') duration = 1500;
                $ionicLoading.show({
                    template: message_text,
                    noBackdrop: true,
                    duration: duration
                });
              };
    	$scope.addUnit = function() {
    		// $scope.sampleData
    		// console.log("add unit called")
    		var arrLength = $scope.coversionData.length - 1;
    		// console.log("arrLength",arrLength);
			if(arrLength != -1) {
				var lastItem = $scope.coversionData[arrLength];
                // console.log("lastitem",lastItem);        
				var addItem = {}
				if(lastItem.unit && lastItem.unit != "" && lastItem.val != null) {
                    if(lastItem.unit == $scope.data.ingredientUnit){
                        toastMessage("selected unit is recipe unit , please select different unit to continue conversion",4000);
                    }else{
					    addItem.item_name = lastItem.unit; 
                        addItem.unit='';
					    $scope.coversionData.push(addItem);
                    }
                   
                    // console.log("$scope.coversionData",$scope.coversionData);
				}else{
                    toastMessage("please enter conversion details",4000)
                }
			}
             _.forEach($scope.coversionData,function(value,index){
                    _.forEach($scope.getCoversionData.pack,function(item){
                        if(item.includes(value.item_name)){
                           $scope.coversionData[index].conversion_unit_list= $scope.getCoversionData.pack.concat($scope.getCoversionData.pieces,$scope.getCoversionData.volume,$scope.getCoversionData.weight);
                            // console.log("pack units",$scope.coversionData.conversion_unit_list);
                        }
                    })
                     _.forEach($scope.getCoversionData.pieces,function(item){
                                if(item.includes(value.item_name)){
                                   $scope.coversionData[index].conversion_unit_list= $scope.getCoversionData.weight;
                                    // console.log("pices units",$scope.coversionData.conversion_unit_list);
                                }
                            })
                    _.forEach($scope.getCoversionData.weight,function(item){
                        if(item.includes(value.item_name)){
                           $scope.coversionData[index].conversion_unit_list= $scope.getCoversionData.volume;
                           // console.log("weight",$scope.coversionData.conversion_unit_list);
                           
                        }
                    })
                    _.forEach($scope.getCoversionData.volume,function(item){
                        if(item.includes(value.item_name)){
                           $scope.coversionData[index].conversion_unit_list = $scope.recipe;
                           // console.log("volume",$scope.coversionData.conversion_unit_list);
                           
                        }
                    })
                })
             _.forEach($scope.coversionData,function(item){
                if(item.unit == ''){
                    $scope.currentVal=true;
                }else{
                    $scope.currentVal=false;
                }
            })
    	}

    	$scope.closeModalCtrl = function (result) {
            // console.log('cancel edi config')
            $scope.closeModal({
                'modal': 'closed',
                'config_saved': false
            })
        }
	}
})();