(function () {
    projectCostByte.controller('InventoryListManagerCtrl', InventoryListManagerCtrl);

    InventoryListManagerCtrl.$inject = ['$q', '$scope', '$state', '$stateParams', '$ionicLoading', '$ionicPopup', '$ionicModal', '$timeout', 
    '$ionicTabsDelegate', 'CommonService','$window','$ionicSlideBoxDelegate','$rootScope','$ionicFilterBar','$ionicPopover','ErrorReportingServiceOne', '$compile'];

    function InventoryListManagerCtrl($q, $scope, $state, $stateParams, $ionicLoading, $ionicPopup, $ionicModal, $timeout, $ionicTabsDelegate,
     CommonService,$window,$ionicSlideBoxDelegate,$rootScope,$ionicFilterBar,$ionicPopover,ErrorReportingServiceOne, $compile ){

    //check code
        $scope.sortType     = ''; // set the default sort type
        $scope.sortReverse  = false;  // set the default sort order
        $scope.searchAll   = '';     // set the default search/filter term
        $scope.rowCollection = [];
        $scope.adddeactive = 'active'; 
        $scope.getInventoryItemInfoWeb = [];
        $scope.spinnerhide = false;
        $scope.inv_data = [];
        $scope.SupplierItems = [];
        $scope.addDuplicate = false;
        $scope.addPopTitle = '';
        $scope.lastIndex = 0;
        $scope.lastIndexes = [];
        $scope.setLastIndex = function(len){
          $scope.lastIndex = $scope.lastIndex + len*1;
          $scope.lastIndexes.push($scope.lastIndex);
        }
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
        var toastMessage = function(message_text, duration) {
          if (typeof duration === 'undefined') duration = 1500;
          $ionicLoading.show({
            template: message_text,
            noBackdrop: true,
            duration: duration,
          });
        };
        $scope.addSupRowCollection = function() {
            console.log($scope.rowCollection);
            for (var key in $scope.rowCollection){
                console.log("collection length")
                console.log(key);
                $scope.rowCollection[key].forEach(function (row) {
                  //  console.log(key);
                 //   console.log(row);
                    if(! row.supp_inv ){
                        row.supp_inv = []   
                    }
                  //  row.supp_inv = []

                  if (row.inv_item_id == $scope.supItemWeb[0].Inv_item_id ){
                    console.log("outside for loop");
                    console.log($scope.supItemWeb.length);
                        for(var i=0; i<$scope.supItemWeb.length; i++){
                            console.log("inside for loop");
                           // console.log(row);
                            // console.log($scope.supItemWeb.length);
                            console.log($scope.supItemWeb[i]);
                           // console.log(row.supp_inv.length);
                            var is_present = false;
                            if(row.supp_inv.length > 0){
                                for( var j=0;j < row.supp_inv.length; j++){
                                    if(row.supp_inv[j].supplier_id == $scope.supItemWeb[i].supplier_id && row.supp_inv[j].item_num == $scope.supItemWeb[i].item_num){
                                        console.log("already present");
                                        is_present = true;
                                        break;
                                    }
                                    console.log(row.supp_inv[j]);
                                }
                            }
                            if(!is_present){
                                row.supp_inv.push($scope.supItemWeb[i]);     
                            }
                            
                            // var is_present = false;
                            // for( var i=0;i < row.supp_inv.length; i++){
                            //     console.log("inside another loop");
                            //     console.log(row.supp_inv[i]);
                            //     if(row.supp_inv[i].supplier_id == $scope.supItemWeb[i].supplier_id){
                            //         console.log("already is_present");
                            //         is_present = true;
                            //         break;
                            //     }
                            // }
                            // if(!is_present){
                            //     row.supp_inv.push($scope.supItemWeb[i]) ;          
                            // }
                            // if(!($scope.supItemWeb[i] in row.supp_inv)){
                            //     row.supp_inv.push($scope.supItemWeb[i]) ;          
                            // }
                        }     
                  }
                    // for(var i=0; i<$scope.supItemWeb.length; i++){
                    //     if (row.inv_item_id == $scope.supItemWeb[i].Inv_item_id ){
                    //         //row.supp_inv[i] = $scope.supItemWeb[i]; 
                    //         console.log("inside for loop");
                    //         console.log(row);
                    //         console.log($scope.supItemWeb[i])
                    //         row.supp_inv.push($scope.supItemWeb[i]) ;       
                    //     }    
                    // }
                });              
            }
            $scope.displayedCollection = $scope.rowCollection;    

        };

        // $scope.newList = [];
        //     // Generate initial model
        //     for (var i = 1; i <= 3; ++i) {
        //         $scope.newList.push({label: "Item A" + i});
        //     //    $scope.models.lists.B.push({label: "Item B" + i});
        //     } 
        //     console.log("new listt");
        //     console.log($scope.newList);


        // $scope.reorderItems = function (indexes){
        //     console.log("inside reorder");
        //     console.log(indexes);
        // }

        /*
            Response handler for fetching supplier details given an inventory item
        */
        $scope.invIdToSupDetailsMap = {}
        function supplierDetailsForInvIdResp(invSupdata){
            if (invSupdata.status == 200) {
                var supplierDataForInvItem = invSupdata.data.data;
                $scope.supItemWeb = invSupdata.data.data;
                console.log("supplier details");
                console.log($scope.supItemWeb);
              //  $scope.invIdToSupDetailsMap[invSupdata.invItemId] += $scope.supItemWeb
                $scope.updateSupplierItemsListView(supplierDataForInvItem, invSupdata.invItemId);
                //  $scope.updateSuppliersUI();
                //  console.log('Total data' ,$scope.rowCollection);
               //toastMessage("Your inventory items has been successfully updated", 5000);
            } else {
                toastMessage("Something went wrong", 1500);
            }
        }

        function invSupdata(invSupdata) {
          if (invSupdata.status == 200) {
            console.log("sup data");
            console.log(invSupdata);
               $scope.supItemWeb = invSupdata.data.data;
               console.log('Supplier Data' , $scope.supItemWeb)
                $scope.addSupRowCollection();
                console.log('Total data' ,$scope.rowCollection);
               //toastMessage("Your inventory items has been successfully updated", 5000);
            } else {
            toastMessage("Something goes wrong", 1500);
            }
        }   
        $scope.checkDupCategory = function() {
            //TODO:anirudh
            // for (var key in $scope.rowCollection){
            //     $scope.rowCollection[key].forEach(function (row) {
            //         if(row.pl_cat.indexOf('NA') == -1) {
            //             row.pl_cat.unshift('NA'); 
            //         }
            //         if(row.tags == '') {
            //             row.tags = 'NA'; 
            //         }
            //         if($scope.inv_data.indexOf(row.inv_item_id) == -1) {
            //             $scope.inv_data.unshift(row.inv_item_id); 
            //         }
            //     });              
            // }
            // $scope.displayedCollection = $scope.rowCollection;      
        };

        function readDataFromFile(){
            console.log("inside read form file");
            var file = "./inv_data.json";
            var rawFile = new XMLHttpRequest();
            rawFile.open("GET", file, false);
            rawFile.onreadystatechange = function ()
            {
                if(rawFile.readyState === 4)
                {
                    if(rawFile.status === 200 || rawFile.status == 0)
                    {
                        var allText = rawFile.responseText;
                        alert(allText);
                    }
                }
            }
            rawFile.send(null);
        }


        $scope.displayedCollection = {};
        $scope.displayedCollectionss = {};
        $scope.getServerData = function() {
            CommonService.fetchInventoryItemInfoWeb(function(data) {
        //   $scope.getInventoryItemInfoWeb = data.inventoryInfo;
             $scope.getInventoryItemInfoWeb = readDataFromFile();
            // if($scope.getInventoryItemInfoWeb.pl_cat.indexOf('NA') == -1) {
            //     $scope.getInventoryItemInfoWeb.pl_cat.unshift('NA'); 
            // }
            console.log("other data");
            console.log(data);
            console.log($scope.getInventoryItemInfoWeb);
            $scope.categoryList = data.inventoryInfo.category;

            CommonService.fetchInventoryItemsWeb(function(data) {
                console.log('1st check',data.data);
             //   $scope.displayedCollection = [];
                
                $scope.inventoryList = data.data.inventory_list;
                console.log("inv list");
                console.log($scope.inventoryList);
                $scope.plCategoryList = data.data.PnL_category;
                angular.forEach($scope.categoryList, function(key){
            //        console.log(key);
           //         console.log($scope.inventoryList[key]);
                    $scope.displayedCollection[key] = $scope.inventoryList[key];
                  //  console.log($scope.inventoryList[key].keys);
                });
                $scope.rowCollection = $scope.displayedCollection;//angular.copy(data.data);
               // $scope.displayedCollection = angular.copy(data.data);
           //     console.log($scope.rowCollection);
                // angular.forEach($scope.displayedCollection, function(value, key){
                //     console.log(key);
                //     console.log(value);
                // });
            //    $scope.checkDupCategory(); 
          // console.log("new data");
          //  console.log($scope.displayedCollectionss);
                $scope.models = {
                    selected: null,
                 //   list: $scope.displayedCollection
                };
            //    console.log('Supplier invData' , $scope.inv_data)
              //  CommonService.fetchSupplierItemWeb(invSupdata, $scope.inv_data);
                $scope.spinnerhide = true;
            });
             });
        };

        $scope.getServerData();

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

        $scope.editRow = function(row){
            console.log("inside edit")
            row.editMode = true;
        }
        $scope.cancelEdit = function(row){
            console.log("inside cancel");
            row.editMode = false;
        }
        $scope.addInvItem = function() {
            $scope.invItemNull();
            $scope.addDuplicate = false;
            $scope.addPopTitle = 'Add New Inventory Item';
            $scope.openModal();
        }
        $scope.addDuplicateItem = function(index) {
            $scope.invItemNull();
            $scope.dupUpdate =[];
            $scope.addPopTitle = 'Add Duplicate Inventory Item';
            for (var key in $scope.rowCollection){
                $scope.rowCollection[key].forEach(function (row) {
                    if (row.inv_item_id == index.inv_item_id){
                        $scope.dupUpdate.splice(row,0,JSON.parse(angular.toJson(row))); 
                    }
                });
            }
            $scope.dupUpdate.splice(index,0,JSON.parse(angular.toJson(index)));
            $scope.addDuplicate = true;
            $scope.invItem.name = index.item_name;
            $scope.invItem.category = index.categoryActive; 
            $scope.invItem.pl_cat = index.tags;
            $scope.invItem.supplier_id = "";
            $scope.invItem.measurement = index.units;      
            $scope.invItem.price = index.unit_price;
            $scope.invItem.par = index.par;
            $scope.invItem.status = index.active;
            $scope.dupUpdate[0].inv_status =  $scope.dupUpdate[0].active;
            delete $scope.dupUpdate[0].id;
            for(var i=1; i<$scope.dupUpdate.length; i++){
                $scope.dupUpdate[i].inv_cat =  $scope.dupUpdate[i].categoryActive;
                $scope.dupUpdate[i].inv_status =  $scope.dupUpdate[i].active;   
                $scope.dupUpdate[i].pl_cat =   $scope.dupUpdate[i].tags;     
            } 
            $scope.openModal();
        }
        
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
                $scope.categoryList = data.data.category;
                $scope.inventoryList = data.data.inventory_list;
                $scope.plCategoryList = data.data.PnL_category;
                angular.forEach($scope.categoryList, function(key){
            //        console.log(key);
           //         console.log($scope.inventoryList[key]);
                    $scope.displayedCollection[key] = $scope.inventoryList[key];
                });
                $scope.rowCollection = $scope.displayedCollection;
                $scope.checkDupCategory();
            //   ak: $scope.addSupRowCollection();
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
        //Update Inventory Item
        $scope.updateInvItem = function() {
            $scope.spinnerhide = false;
            $scope.samecat = false;
            $scope.itemNamenull = false;
            var newArray =[];
            var checkDuplicateCat =[];
            var updateInventory = JSON.parse(JSON.stringify($scope.rowCollection));

            for (var key in updateInventory){
                updateInventory[key].forEach(function (rowcat) {
                    checkDuplicateCat.push(rowcat);
                    if (rowcat.editMode) {
                        newArray.push(rowcat);
                    }
                });              
            }
            newArray.forEach(function (rownew) {
                if(rownew.item_name == '' || rownew.item_name == null){
                    $scope.itemNamenull = true;          
                }
                checkDuplicateCat.forEach(function (inrow) {
                    if(rownew.inv_item_id == inrow.inv_item_id && rownew.categoryActive == inrow.categoryActive && rownew.id != inrow.id){
                        $scope.samecat = true;
                        console.log(rownew, inrow);
                    }
                });  
                rownew.inv_cat = rownew.categoryActive;                   
                rownew.inv_status = rownew.active;
                rownew.duplicate = false;
                if (rownew.tags == 'NA'){
                    rownew.pl_cat='';
                }else{
                    rownew.pl_cat= rownew.tags;
                    console.log('Check pl catagory',rownew.tags);
                }                
            }); 
            if(newArray.length > 0){
                if($scope.itemNamenull){
                    var confirmPopup = $ionicPopup.alert({
                      title: 'Inventory Item Blank',
                      okType:'button-bal',
                      template: '<center>Inventory Item field cannot be blank</center>',
                    });
                    $scope.spinnerhide = true;
                }
                else if($scope.samecat){
                    var confirmPopup = $ionicPopup.alert({
                      title: 'Save Inventory Item',
                      okType:'button-bal',
                      template: '<center>Cannot have duplicate items within the same inventory category.<br/> Please select different category!</center>',
                    });
                    $scope.spinnerhide = true;
                }else{
                    newArray = newArray.map(({categories, ...rest}) => rest);
                    newArray = newArray.map(({tags, ...rest}) => rest);
                    newArray = newArray.map(({price_change, ...rest}) => rest);
                    newArray = newArray.map(({categoryActive, ...rest}) => rest);
                    newArray = newArray.map(({active, ...rest}) => rest);
                    newArray = newArray.map(({supp_inv, ...rest}) => rest);
                    newArray = newArray.map(({editMode, ...rest}) => rest);
                    newArray = newArray.map(({editData, ...rest}) => rest);
                    console.log('Test After chane',newArray);          
                    CommonService.updateInventoryListItemWeb(invResdata, newArray);
                }                
            }else{
                $scope.spinnerhide = true;
            }
        }
        function delSupRes(invData) {
            console.log('post delete ',invData);
          if (invData.status == 200) {
            $scope.getServerData();
            toastMessage("Your Supplier item has been successfully deleted.", 1500);
          } else {
            toastMessage("Something goes wrong", 1500);
            $scope.spinnerhide = true;
          }
        } 
        $scope.deleteSupplierItem = function(index) {
            console.log("inside delete supp item");
            console.log(index);
            $scope.spinnerhide = false;
            $scope.delSup ={};
            $scope.delSup.supplier_id =  index.supplier_id;
            $scope.delSup.supplier_item_id =  index.item_num;
            $scope.delSup.inventory_item_id =  index.Inv_item_id;
            console.log($scope.delSup);
            CommonService.deleteSupplierItemWeb(delSupRes, $scope.delSup);
        }


        $scope.categoryCollapse = function(key){
            if(key != null && key != ''){
                $scope.categoryCollapseValue = ($scope.categoryCollapseValue==key)?-1:key;
            }else{

            }
        }
        $scope.expandSuppliers = true;
        $scope.isCollapsed = true;
        $scope.expandAll = function (expanded) {
            $scope.$broadcast('onExpandAll', {expanded: expanded});
        };

        $scope.editUser = function(categoryActive, index) {
            console.log("inside edit user");
           // return false;
           console.log(categoryActive);
           console.log(index);
           //console.log(JSON.stringify(row));
           //row.editMode = true;
          // row.editData = angular.copy(row);
        };
        $scope.cancel = function(row) {
            row.editMode = false;
            //$scope.getServerData();
            delete row.editData;
        };

        //popup code

        this.slide = this.select = function(to, speed) {
      // cancel slideshow
      stop();

      slide(to, speed);
    };
    $scope.openUnitPopup2Modal = function() {
      $scope.convertion_factor='';
      $scope.NewmeasurementId='';
      $ionicModal.fromTemplateUrl('application/inventory-config/Inv-config-popup2.html', {
        scope: $scope,
        animation: 'slide-in-up',
        // focusFirstInput: true,
        backdropClickToClose: false
      }).then(function(modal) {         
        $scope.unitPopup2Modal = modal;
        $scope.unitPopup2Modal.show();
        $ionicSlideBoxDelegate.enableSlide(false);
        console.log($ionicSlideBoxDelegate.currentIndex());
        
      });
    };
    $scope.closeUnitPopup2Modal = function(model) {
      console.log('closeUnitPopup2Modal')
      // scope.addInvItem.$setPristine();
      // scope.addInvItem.$setUntouched();
      $scope.locationAccepted = true;
      
      $scope.unitPopup2Modal.hide();

    };
    CommonService.fetchMeasurements(function(data) {
      console.log("data",data);
      $scope.measurements_list = [];
      _.forEach(data.measurements, function(measurements) {
        if (measurements.measurement_name != null && measurements.measurement_name != '') {
          $scope.measurements_list.push(measurements);
        }
      });
    });
    function responsesupplier(data)
    {
        $scope.supplierNamesList = [];
        console.log(data);
        angular.forEach(data.supItems, function(key){

             if ($scope.supplierNamesList.indexOf(key.supplier) == -1) {
                    $scope.supplierNamesList.push(key.supplier);
            }
        });
        console.log("supplier list");
        console.log($scope.supplierNamesList);
        supplierNames(data);
    }
    CommonService.getsupplier(responsesupplier);
  
     var supplierNames = function(invItems) {
              if(invItems){                
                $scope.supplierItems = invItems.supItems;
                $scope.editInv = {
                  supItems : [],
                  supItem: null
                };
                // $scope.editInv.supItems.push({supItemId: "", supItemAlias: "Create New Inventory Item"});
                _.find($scope.supplierItems,function(inv){
                  $scope.editInv.supItems.push(inv);
                });
                
                
               

              }
          }

    $scope.openUnitModal = function() {
      $ionicModal.fromTemplateUrl('application/inventory-config/invConfigPopupView.html', {
        scope: $scope,
        animation: 'slide-in-up',
        backdropClickToClose: false
      }).then(function(modal) {
        $scope.unitModal = modal;
        $scope.unitModal.show();
        $ionicSlideBoxDelegate.enableSlide(false);
        console.log("poopup1 : ", $scope.current_selected)
        console.log($ionicSlideBoxDelegate.currentIndex())
        
      });
      
    };
    $scope.closeUnitModal = function(model) {
      console.log('closeModal')
      $scope.locationAccepted = true;
      $scope.unitModal.hide();

    };

    $scope.checkSupUnit = function(newValue, oldValue, inv_item){
      console.log("$scope.current_selected.isUnknown",newValue.isUnknown);
      console.log("$scope.current_selected.measurementId",newValue.measurementId);
      console.log("newValue",newValue,"oldValue",oldValue);
      console.log("inv_item: ", inv_item);
      $scope.current_selected = newValue;
      var d = new Date(parseInt(newValue.date) * 1000),
        yyyy = d.getFullYear(),
        mm = ('0' + (d.getMonth() + 1)).slice(-2),
        dd = ('0' + d.getDate()).slice(-2)
      $scope.current_selected.date = mm + "/" + dd + "/" + yyyy;
      $scope.current_selected.invItemId = inv_item.inv_item_id;
      $scope.current_selected.category = inv_item.categoryActive;
      $scope.current_selected.name = inv_item.item_name;
      $scope.current_selected.par = inv_item.par;
      $scope.current_selected.isNA =inv_item.isNA;
      if(newValue.isUnknown==true && newValue.measurementId == ''){
        $scope.openUnitModal();
        $timeout(function() {
          console.log('remove div')
          var myEl = angular.element( document.querySelector( '.slider-pager' ) );
          console.log('myEl: ',myEl)
          myEl[myEl.length - 1].hidden = true;
          myEl[myEl.length - 1].style.display = 'inline-flex'
          var elmn = angular.element( document.querySelector( '.slider-pager' ) );
          elmn.remove();
        }, 20);
      } 
      else {
        $scope.saveMappedData(undefined)
      }
    };

    $scope.setMapping = function(current_selected) {
      console.log("setMapping data : ", current_selected);
      $scope.current_selected.measurementId = current_selected.unit; 
      var unitData = {"measurement_id":current_selected.unit,
      "supplier_id":current_selected.supplierId,
      "supplier_item_id":current_selected.supItemIds,
      "inventory_item_id":current_selected.invItemId,
      "convertion_factor":current_selected.convertion_factor
    };
      console.log("unitData",unitData);
      var updateSupplierUnit = function(response) {
          console.log("updateSupplierUnit response : ", response);
          if(response.success) {
            toastMessage("convertion_factor is added");
          } else {
            toastMessage("convertion_factor is not added, please try again");
          }
          $scope.unitPopup2Modal.hide();
      }
      CommonService.updateSuppInvItm(updateSupplierUnit,unitData);
  //    CommonService.fetchSupplierItemWeb(invSupdata, $scope.inv_data);
    }

    $scope.getSupplierDetails = function(invItemId){

    }

    $scope.updateInventoryItemsListView = function(categoryId, invListData){
        console.log("update invData with data");
        console.log(categoryId);
        //console.log(invListData);

        var $newDiv = '';
        angular.forEach(invListData, function(invData){
            var params = JSON.stringify(invData);
            var invItemId = invData.inv_item_id;
            $newDiv += '<ion-item class="row_values row " style="margin-right: 0px;margin-bottom:7px;color: #76a8e1;font-size: 11px;">\
                            <div class="rcorners col"  ng-class="">\
                                <div class="row" style="margin: 0px;padding: 0px;">\
                                    <div class="col small"><button type="button" class="btn btn-info btn-circle"  data-ng-click="fetchSupplierDetails('+$scope.expandSuppliers+', '+invItemId+');" expand><i class="glyphicon" ng-class='+$scope.expandSuppliers+' ? glyphicon-plus : glyphicon-minus"></i></button></div>\
                                    <div class="col small" ng-click="editUser('+invData.categoryActive+',$index)"><span ng-hide="'+invData.editMode+'">'+invData.item_name +'</span></div>\
                                    </div>\
                            </div>\
                            <ion-reorder-button class="ion-navicon"\
                                                on-reorder="moveItem(invData, $fromIndex, $toIndex)">\
                            </ion-reorder-button>\
                        </ion-item>';
        });
        var compiled_div = $compile($newDiv)($scope);
        var target = document.getElementById(categoryId);
        var id = "#"+categoryId ;
        //remove existing items under div as it creates duplicates whenever the supplier items are fetched
        if($(id).length){
      //      $(id).remove();    
        }
        console.log(target);
        angular.element(target).prepend(angular.element(compiled_div));
    }

    $scope.updateSupplierItemsListView = function(supplierData, invItemId){
        console.log("update supp with data");
        var newDiv = '';
        angular.forEach(supplierData, function(newSupplierInfo){
            newDiv += '<div class="row_values row rcornersBlue" style="margin-right: 0px;margin-bottom:7px;color: #76a8e1;font-size: 11px;">\
                                            <div class="col col-40">'+newSupplierInfo.desc +'<div><span>'+newSupplierInfo.supp_name+'</span>:<span>'+newSupplierInfo.item_num+'</span></div></div>\
                                            <div class="col col-10">'+newSupplierInfo.unit+'</div>\
                                            <div class="col col-5">'+newSupplierInfo.unit_price.toFixed(2)+'</div>\
                                            <div class="col col-10">'+newSupplierInfo.purchase_date+'</div>\
                                            <div class="col col-10">'+newSupplierInfo.invoice_num+'</div>\
                                            <div class="col col-10">'+newSupplierInfo.billing_units+'</div>\
                                            <div class="col col-10">'+newSupplierInfo.billing_price+'</div>\
                                            <div class="col col-5" ><button type="button" class="btn btn-danger btn-circle-small" ng-click=deleteSupplierItem('+newSupplierInfo+')><i class="glyphicon glyphicon-minus"></i></button></div>\
                                      </div>';
        });
        var target = document.getElementById(invItemId);
        var id = "#"+invItemId +' '+ ".row_values";
        //remove existing items under div as it creates duplicates whenever the supplier items are fetched
        if($(id).length){
            $(id).remove();    
        }
        console.log(target);
        angular.element(target).prepend(angular.element(newDiv));
    }

    $scope.saveMappedData = function(selected) {
      console.log(" save mappedData $scope.current_selected : ", $scope.current_selected);
      var finalResult = {
                "supItemIds": $scope.current_selected.supItemIds,
                "invItemId": $scope.current_selected.invItemId,
                "supplierId": $scope.current_selected.supplierId,
                "measurement": (selected != undefined) ? selected.unit : $scope.current_selected.measurementId,
                "isUnknown" : $scope.current_selected.isUnknown,
                "isNA" : $scope.current_selected.isNA}

      console.log("finalResult : ", finalResult,JSON.stringify(finalResult));
      
      var mapInvSuppData = function(response) {
        console.log("mapInvSuppData response : ", response);
        if(response.isPopUp2) {
          $ionicSlideBoxDelegate.slide(1, 150);
          $scope.unitPopup2Modal.hide();
        } else{
          CommonService.fetchSupplierItemWeb(supplierDetailsForInvIdResp, $scope.current_selected.invItemId);
        //  $scope.updateSupplierItemsList(finalResult);
        //  $scope.unitModal.hide();
        }
      }
      CommonService.postInvMapping(mapInvSuppData,finalResult);
    }

    /*
        Fetch supplier items when the + icon is clicked for supplier Items
    */
    $scope.fetchSupplierDetails = function(expanded, invItemId){
        console.log("inside fetch supp");
        if(expanded){
            CommonService.fetchSupplierItemWeb(supplierDetailsForInvIdResp, invItemId);       
        }
    }


     $scope.fetchInventoryListDetails = function(expanded, category, row){
        if(!expanded){
             $scope.updateInventoryItemsListView(category, row);
        }
    }
    
    $scope.data = {
    showReorder: false
  };

  $scope.itemList = [
    { id: 0 },
    { id: 1 },
    { id: 2 },
    { id: 3 }]

      $scope.moveItem = function(item, fromIndex, toIndex) {

        console.log("moving itemmm");
        console.log(item);
        console.log(fromIndex);
         console.log(toIndex);
        // console.log(item.categoryActive);
        // console.log($scope.displayedCollection[item.categoryActive]);
       $scope.displayedCollection[item.categoryActive].splice(fromIndex, 1);
       $scope.displayedCollection[item.categoryActive].splice(toIndex, 0, item);
  };


    $scope.setUnit = function(){
                  console.log('setUnit ------------------')
                  $ionicSlideBoxDelegate.slide(1, 150)
                }

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

    $scope.openPopover = function() {
        ErrorReportingServiceOne.showErrorReportForm({
                'page': 'InventoryList Manager',
                'component': 'Price Wrong',
                'modalName' : $scope.unitModal
            }, {
                'page': 'InventoryListManager',
                'component': 'Price Wrong'
            }) 
            .then(function (result) {
            });

       };

       $scope.drag = function (ev) {
            ev.dataTransfer.setData("text", ev.target.id);
        }

        $scope.drop = function (ev) {
            ev.preventDefault();
            var data = ev.dataTransfer.getData("text");
            ev.target.appendChild(document.getElementById(data));
        }
   
    }

    // projectCostByte.directive('expand', function () {
    //     console.log("directive to call expand");
    //     return {
    //         restrict: 'A',
    //         controller: ['$scope', function ($scope) {
    //             $scope.$on('onExpandAll', function (event, args) {
    //                 $scope.expanded = args.expanded;
    //             });
    //         }]
    //     };
    // });
        
})();
