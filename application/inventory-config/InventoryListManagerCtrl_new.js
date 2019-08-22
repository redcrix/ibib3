(function () {
projectCostByte.controller('InventoryListManagerCtrl_new', InventoryListManagerCtrl_new);

InventoryListManagerCtrl_new.$inject = ['$q', '$scope', '$state', '$stateParams', '$ionicLoading', '$ionicPopup', '$ionicModal', '$timeout', 
'$ionicTabsDelegate', 'CommonService','$window','$ionicSlideBoxDelegate','$rootScope','$ionicFilterBar','$ionicPopover','ErrorReportingServiceOne'];

function InventoryListManagerCtrl_new($q, $scope, $state, $stateParams, $ionicLoading, $ionicPopup, $ionicModal, $timeout, $ionicTabsDelegate,
	CommonService,$window,$ionicSlideBoxDelegate,$rootScope,$ionicFilterBar,$ionicPopover,ErrorReportingServiceOne){
/*
	$scope.gridOptions = {
				enableFiltering: true,
				expandableRowTemplate: 'application/inventory-config/inventoryListView.html',
			//subGridVariable will be available in subGrid scope
			expandableRowScope: {
				subGridVariable: 'subGridScopeVariable'
			}
		};

$scope.gridOptions.columnDefs = [
{ name: 'category' }
];


$scope.gridOptions.onRegisterApi = function(gridApi){
      $scope.gridApi = gridApi;
      console.log("ggg");
      console.log($scope.gridApi.grid.rowsProcessors);
      console.log($scope.gridApi.grid);
      console.log($scope.gridApi); 
      // $scope.gridApi.grid.gridHeight =  $scope.gridApi.grid.rows.length * $scope.gridApi.grid.headerHeight + 100;
      // console.log($scope.gridApi.grid.colums);
      // console.log($scope.gridApi.grid.headerHeight);
      // console.log($scope.gridApi.grid.gridHeight );
      //$scope.gridApi.core.handleWindowResize();
    };
*/
$scope.completeDataSet = [];
$scope.gridApi = [];
$scope.getServerData = function() {

	CommonService.fetchInventoryItemInfoWeb(function(data) {
		console.log("fetch other data");
		console.log(data);
            $scope.getInventoryItemInfoWeb = data.inventoryInfo;
            if($scope.getInventoryItemInfoWeb.pl_cat.indexOf('NA') == -1) {
                $scope.getInventoryItemInfoWeb.pl_cat.unshift('NA'); 
            }
            console.log($scope.getInventoryItemInfoWeb);
    });
	
	CommonService.fetchInventoryItemsWeb(function(data) {
		console.log('1st check',data.data);
		$scope.categoryList = [];
		$scope.inventoryList = data.data.inventory_list;
		$scope.plCategoryList = data.data.PnL_category;

		angular.forEach($scope.inventoryList, function(value, key){
			$scope.completeDataSet = $scope.completeDataSet.concat(value);
			$scope.categoryList.push(key);
            	//console.log($scope.completeDataSet);
            });
		$scope.categoryListData  = [];	
		angular.forEach($scope.inventoryList, function(value, key){
			$scope.categoryListData.push({category: key, invData:$scope.inventoryList[key]});
		});

		console.log("start");
		$scope.gridOptions = {
			enableFiltering: true,
			expandableRowTemplate: 'application/inventory-config/inventoryListView.html',
			onRegisterApi: function (gridApi) {
				$scope.gridApi = gridApi;
				gridApi.core.on.renderingComplete($scope, function() {
			        //code to execute
			        console.log("inside register");
				
				console.log($scope.categoryList.length);
				$scope.gridApi.grid.gridHeight =  $scope.categoryList.length * $scope.gridApi.grid.headerHeight + 100;
				console.log($scope.gridApi);
			    });
			}
		}

		for(i = 0; i < $scope.categoryListData.length; i++){
			var invListData = $scope.categoryListData[i].invData;

			for(j = 0; j < invListData.length; j++){

				$scope.categoryListData[i].subGridOptions = {
					showGridFooter: true,
					enableFiltering: true,
					columnDefs: 
					[
					{ name: 'item_name', width: '15%'},
					{ name: 'units', width: '15%' },
					{ name: 'unit_price',  width: '10%' },
					{ name: 'price_change',  width: '10%' },
					{ name: 'par', width: '10%' },
					{ name: 'categoryActive', width: '10%', grouping: { groupPriority: 0 }},
					{ name: 'tags', width: '8%'},
					{ name: 'Auto_update', width: '10%'},
					{ name: 'active', width: '10%'}
					],
					data: invListData,
					expandableRowTemplate: 'application/inventory-config/supplierListView.html',
					onRegisterApi: function (gridApi) {
					//	$scope.gridApi = gridApi;
					//	$scope.gridApi.core.handleWindowResize();
						// console.log("this is grid");
						// console.log($scope.gridApi);
						// console.log(invListData);
						// $scope.minRowHeight = invListData.length;

						gridApi.expandable.on.rowExpandedStateChanged($scope, function (row) {
							console.log(row);
							if (row.isExpanded) {
								row.entity.subGridOptions = {
									showGridFooter: true,
									enableFiltering: true,
									columnDefs: [
									{ name: 'supp_name'},
									{ name: 'item_num'},
									{ name: 'desc'},
									{ name: 'unit'},
									{ name: 'unit_price'},
									{ name: 'purchase_date'},
									{ name: 'billing_units'},
									{ name: 'billing_price'},
									]};
									var invId = [];
									invId.push(row.entity.inv_item_id);
									console.log("row id");
									console.log(invId);
									CommonService.fetchSupplierItemWeb(function(response){
										console.log("supplier response is");
										console.log(response.data.data);
										row.entity.subGridOptions.data = response.data.data;
									}, invId); 
									// $http.get('/data/100.json')
									// 		.then(function(response) {
									// 				row.entity.subGridOptions.data = response.data;
									// 		});
								}
							});
					}
				}
				$scope.categoryListData[i].subGridOptions.height = $scope.categoryListData[i].subGridOptions.length * 20 + 30;
			}
		}



		$scope.gridOptions.data = $scope.categoryListData;
		
		console.log("last");
		console.log($scope.gridApi);
	});
};


        // Add Inventory Item
        $ionicModal.fromTemplateUrl('add-inventory-item-modal.html', {
            scope: $scope,
            animation: 'slide-in-up',
            backdropClickToClose: false
            }).then(function(modal) {
            $scope.modal = modal;
        });
        $scope.openModal = function() {
            console.log("step2");
            $scope.modal.show();
        };

        $scope.closeModal = function(model) {
          console.log('closeModal')
          //$scope.form.addInvItem.$setPristine();
          //$scope.form.addInvItem.$setUntouched();
          $scope.modal.hide();
        };
        // Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function() {
          $scope.modal.remove();
        });
        // Execute action on hide modal
        $scope.$on('modal.hidden', function() {
          // Execute action
        });
        // Execute action on remove modal
        $scope.$on('modal.removed', function() {
          // Execute action
        });
        $scope.invItemNull = function(){
            $scope.invItem = {
            "name": "",
            "category": "",
            "pl_cat": "",
            "supplier_id": "",
            "measurement": "",
            "price": "",
            "par": "",
            "status":"active"
            }
            console.log('Check_Inviitem',$scope.invItem);
        };        
        $scope.addInvItem = function() {
            $scope.invItemNull();
            $scope.addDuplicate = false;
            $scope.addPopTitle = 'Add New Inventory Item';
            $scope.openModal();
        }

function invSupplierDataResponseHandler(invSupdata) {
	if (invSupdata.status == 200) {
		$scope.supplierDataList = invSupdata.data.data;
		console.log('Supplier Data' , $scope.supplierDataList)
	} else {
		toastMessage("Something goes wrong", 1500);
	}
}  
$scope.fetchSupplierDetails = function(invId){
	console.log("fetching supplier details"+ invId);
   //      if(expanded){
   	CommonService.fetchSupplierItemWeb(invSupplierDataResponseHandler, invId);       
     //   }
 }


 $scope.getServerData();

         var toastMessage = function(message_text, duration) {
          if (typeof duration === 'undefined') duration = 1500;
          $ionicLoading.show({
            template: message_text,
            noBackdrop: true,
            duration: duration,
          });
        };

         function invRes(invData) {
          if (invData.status == 200) {
            $scope.getServerData();
            $scope.closeModal();
            toastMessage("Your inventory item has been successfully added.", 5000);
          } else {
            $scope.closeModal();
            toastMessage("Something goes wrong", 1500);
          }
        } 
        function invResdata(invData) {
            console.log(invData.data.data);
            $scope.spinnerhide = true;
            if (invData.status == 200) {
               $scope.rowCollection = invData.data.data;
               $scope.displayedCollection = $scope.rowCollection;
               $scope.checkDupCategory();
               $scope.addSupRowCollection();
               toastMessage("Your inventory items has been successfully updated", 1500);
            } else {
            toastMessage("Something goes wrong", 1500);
            }
        }  

         $scope.addInventoryItem = function() {
            $scope.match = false;
            if($scope.addDuplicate) {
                $scope.dupUpdate[0].item_name =  $scope.invItem.name;
                $scope.dupUpdate[0].inv_cat =  $scope.invItem.category;
                $scope.dupUpdate[0].pl_cat =  $scope.invItem.pl_cat;
                $scope.dupUpdate[0].units =  $scope.invItem.measurement;
                $scope.dupUpdate[0].unit_price =  $scope.invItem.price;
                $scope.dupUpdate[0].item_name =  $scope.invItem.name;
                $scope.dupUpdate[0].par =  $scope.invItem.par;
                $scope.dupUpdate[0].duplicate =  true;
                if($scope.dupUpdate[0].pl_cat == 'NA'){
                    $scope.dupUpdate[0].pl_cat = "";
                }
                var str = $scope.dupUpdate[0].item_name+", "+ $scope.dupUpdate[0].inv_cat+", Par Value = "+$scope.dupUpdate[0].par;
                for(var i=1; i<$scope.dupUpdate.length; i++){
                    str += "<br />"+$scope.dupUpdate[i].item_name+", "+$scope.dupUpdate[i].inv_cat+", Par Value = "+$scope.dupUpdate[i].par;
                    if($scope.dupUpdate[i].inv_cat == $scope.dupUpdate[0].inv_cat){
                        $scope.match = true;
                    }
                    if($scope.dupUpdate[i].pl_cat == 'NA'){
                        $scope.dupUpdate[i].pl_cat = "";
                    }   
                } 
                $scope.dupUpdate = $scope.dupUpdate.map(({categories, ...rest}) => rest);
                $scope.dupUpdate = $scope.dupUpdate.map(({tags, ...rest}) => rest);
                $scope.dupUpdate = $scope.dupUpdate.map(({price_change, ...rest}) => rest);
                $scope.dupUpdate = $scope.dupUpdate.map(({categoryActive, ...rest}) => rest);
                $scope.dupUpdate = $scope.dupUpdate.map(({active, ...rest}) => rest);
                $scope.dupUpdate = $scope.dupUpdate.map(({supp_inv, ...rest}) => rest);
                console.log('Update:', $scope.dupUpdate); 
                //for (var key in $scope.rowCollection){
                //    $scope.rowCollection[key].forEach(function (row) {
                //        if (row.inv_item_id == $scope.dupUpdate[0].inv_item_id){
                //            if(row.categoryActive == $scope.dupUpdate[0].inv_cat){
                //                $scope.match = true;
                //            }  
                //        }
                //    });              
                //} 
                if($scope.match){
                    var confirmPopup = $ionicPopup.alert({
                      title: 'Add Duplicate Inventory Item',
                      okType:'button-bal',
                      template: '<center>Cannot have duplicate items within the same inventory category.<br/> Please select different category!</center>',
                    });     
                } else{
                    var confirmPopupAdd = $ionicPopup.confirm({
                        title: 'Add Duplicate Inventory Item',
                        template: 'Are you sure? This change will affect the following inventory items:<br/>'+ str
                    });
                    confirmPopupAdd.then(function(res) {
                        if(res) {
                            CommonService.updateInventoryListItemWeb(invResdata, $scope.dupUpdate[0]);
                            $scope.closeModal();
                            $scope.spinnerhide = false;        
                        } else {
                        }
                    });
                }
            }else {
                for(var i=0; i<$scope.getInventoryItemInfoWeb.item_name.length; i++){
                    if (($scope.getInventoryItemInfoWeb.item_name[i]).toUpperCase() === ($scope.invItem.name).toUpperCase()) {
                       $scope.match = true;
                    }
                }
                if($scope.match){
                    var confirmPopup = $ionicPopup.alert({
                      title: 'Add Inventory Item',
                      okType:'button-bal',
                      template: '<center>There is an other item with the same name ,<br/> Please add different name!</center>',
                    });     
                } else{
                    if($scope.invItem.pl_cat == 'NA'){
                       $scope.invItem.pl_cat = "";
                    }
                    CommonService.addInvItemInfo(invRes, $scope.invItem);
                }
                             
            }
        }
        //Add Inventory Item end

}

})();
