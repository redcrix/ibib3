(function () {
    projectCostByte.controller('invSupDetailsCtrl', invSupDetailsCtrl);

    invSupDetailsCtrl.$inject = ['$q', '$scope', '$state','$ionicLoading', '$stateParams', '$timeout', 'inventoryItemsSvc', '$rootScope', 'parameters', 'CommonService', '$ionicPopup', '$ionicSlideBoxDelegate'];

    function invSupDetailsCtrl($q, $scope, $state,$ionicLoading, $stateParams, $timeout, inventoryItemsSvc, $rootScope, parameters, CommonService, $ionicPopup, $ionicSlideBoxDelegate) {
        $scope.dataReceived=false;
        $scope.data=parameters;
        $scope.newSupplierList=[];
        $scope.activeSupplierList=[];
        $scope.invSuplierDetailsRes = function(res){
            $scope.activeSupplierList = res.supplier_items.activeItems[0];
            _.forEach(res.supplier_items.newItems[0],function(item){
                if(item.supplierName != "" && item.supplierItemName!= ""){
                    $scope.newSupplierList.push(item);
                }
            })
            _.forEach($scope.activeSupplierList,function(item){
                if(item.isActive == true){
                    $scope.selectedItem = item.supplierName+"::"+item.supplierItemName;
                }
            })
            if($scope.activeSupplierList.length <=0){
              $scope.invData =true;
            }else{
              $scope.invData =false;
            }
            $scope.dataReceived=true;
              function arrUnique(arr) {
                var cleaned = [];
                arr.forEach(function(itm) {
                    var unique = true;
                    cleaned.forEach(function(itm2) {
                        if (_.isEqual(itm, itm2)) unique = false;
                    });
                    if (unique)  cleaned.push(itm);
                });
                return cleaned;
            }
            $scope.newSupplierList = arrUnique($scope.newSupplierList);
            $scope.activeSupplierList = arrUnique($scope.activeSupplierList);
        }

        $scope.addNewSupplier = function(item) {
          // console.log("item",item)
          var itemVal = [];
          itemVal = item.split("::");
            _.forEach($scope.newSupplierList,function(data,index){
                if(data.supplierName == itemVal[0] && data.supplierItemName == itemVal[1]){
                    $scope.activeSupplierList.push(data);
                  $scope.invData =false;

                }
            })
            for(var  i=0;i<$scope.activeSupplierList.length;i++){
                for(var j=0;j<$scope.newSupplierList.length;j++){
                    if($scope.activeSupplierList[i].supplierName == $scope.newSupplierList[j].supplierName){
                        $scope.newSupplierList.splice(j,1);
                        break;
                    }
                }
            }
            // _.forEach($scope.activeSupplierList,function(data){
            //     _.forEach($scope.newSupplierList,function(item,index){
            //         console.log("dtat ",data.supplierName,item.supplierName);
            //         if(data.supplierName == item.supplierName){
            //             $scope.newSupplierList.splice(index,1);
            //            return;
            //         }
            //     })
            // })
        }
        $scope.removesupplier = function(item){
          var itemVal = [];
          itemVal = item.split("::");
             for(var  i=0;i<$scope.activeSupplierList.length;i++){
                    if($scope.activeSupplierList[i].supplierName == itemVal[0] && $scope.activeSupplierList[i].supplierItemName == itemVal[1]){
                        $scope.newSupplierList.push($scope.activeSupplierList[i]);
                        $scope.activeSupplierList.splice(i,1);

                        break;
                }
            }
            //  _.forEach($scope.activeSupplierList,function(data,index){
            //     if(data.supplierName == item.ingredient_alias_name){
            //         $scope.activeSupplierList.splice(index,1);
            //         $scope.newSupplierList.push(data);
            //         $scope.data.ingredient_alias_name=$scope.activeSupplierList[0].supplierName;
            //     }
            // })
        }
        $scope.currentMappingItem='';
        CommonService.getSupplierDetails($scope.invSuplierDetailsRes,$scope.data.inventory_item_id,$scope.data.ingredient_category)
        $scope.currentMapping = function(item){
          var itemVal = [];
          itemVal = item.split(":");
            $scope.currentMappingItem = itemVal[0];
        }
        $scope.activeMapItem={}
        $scope.confirmSave = function(){
            if($scope.currentMappingItem !=''){
           _.forEach($scope.activeSupplierList,function(item){
               if(item.supplierName == $scope.currentMappingItem){
                   item.isActive=true;
                   item.isDeleted = false;
                   $scope.activeMapItem=item;
               }else{
                   item.isActive=false;
                   item.isDeleted = false;
               }
           })
           $scope.resultData = {
               "inv_id"     :$scope.data.inventory_item_id,
               "category"   :$scope.data.ingredient_category,
               "isNew"      : true,
               "newItem"    : $scope.activeMapItem,
               "activeItems": $scope.activeSupplierList
           }
           $scope.postres= function(res){
               if(res.data.success == true){
                   toastMessage("mapping successfully done",3000);
                   $rootScope.$emit('invSupDetails')

               }
               $scope.closeModal({
                        'modal': 'closed',
                    })
               if(res.status == 503){
                   toastMessage("something went wrong");
               }
               // console.log("postres ",res)
           }
           CommonService.postSupplierDetails($scope.postres,$scope.resultData);
           }else{
               toastMessage("Oops nothing to do")
           }
        }
        var toastMessage = function(message_text, duration) {
            if (typeof duration === 'undefined') duration = 2000;
            $ionicLoading.show({
                template: message_text,
                noBackdrop: true,
                duration: duration
            });
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
