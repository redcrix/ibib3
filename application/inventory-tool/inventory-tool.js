(function() {
  'use strict';
  projectCostByte.controller('InventoryToolCtrl', inventoryToolCtrl);

  inventoryToolCtrl.$inject = ['$q', '$scope', 'CommonService', '$ionicLoading', '$ionicModal', '$ionicPopup', '$ionicFilterBar', '$filter', '$timeout'];

  function inventoryToolCtrl($q, $scope, CommonService, $ionicLoading, $ionicModal, $ionicPopup, $ionicFilterBar, $filter, $timeout) {
    $scope.showLoader = false;
    $scope.optionval = true;
    $scope.showLoaderCol = false;
    $scope.searchText = "";
    $scope.ingredientsData = [];
    $scope.ingredients = [];
    $scope.newData = [];
    $scope.oldData = [];
    $scope.text = {}; 
    $scope.originalData = [];
    $scope.ingredientsDatalength = true;
    var serviceRequestData = {};
    var catItem = {};
    $scope.isSaveChanges = false;
      $scope.mappingItem =false;
    $scope.searchText = function(searchItem) {
      $scope.text.searchData = $scope.newModelVal;
      if($scope.text.searchData != undefined){
        if($scope.text.searchData !=''){
      $scope.showLoaderCol = false;
      $timeout(function() {
        if ($scope.text.searchData != null || $scope.text.searchData != '' || $scope.text.searchData.length > 0) {
          $scope.ingredientsData = $filter('filter')($scope.ingredients, $scope.text.searchData);
          $scope.showLoaderCol = true;
        } else {
          $scope.ingredientsData = $filter('filter')($scope.ingredientsData, $scope.text.searchData);
        }
      }, 400)}}
      $scope.originalData = $scope.ingredientsData;

    };
    $scope.change = function (value) {
      $scope.newModelVal = value .trim();
      // setTimeout(function() {}, 10);
      // $timeout(function(){
      //    $scope.text.searchData= value.trim();
      //  },800)
    }

    $scope.toggleGrp = function(grp){
      grp.isExpanded = !grp.isExpanded;
      // console.log($scope.supllierList);
    }



    $scope.invstatus = ['active', 'inactive'];
    $scope.response = function(data) {
      $scope.datas = data.inv_data;
      $scope.catList = data.categoryList;
      $scope.$applyAsync();
      $scope.init();
    }
    $scope.priceChange = function(value, category) {
      $scope.isSaveChanges = true;
      // console.log("float value is" + value);
      value = parseFloat(value);
      // console.log(value)
      _.forEach($scope.ingredientsData, function(item) {
        if (item.inv_item_id == category.inv_item_id) {
          item.price = (isNaN(value)) ? '0' : value.toFixed(2)
        }
      })
    }
    $scope.parChange = function(value, category) {
      // console.log("float value is" + value);
      $scope.isSaveChanges = true;
      value = parseFloat(value);
      // console.log(value)
      _.forEach($scope.ingredientsData, function(item) {
        if (item.inv_item_id == category.inv_item_id) {
          item.par = (isNaN(value)) ? '0' : value.toFixed(2)
        }
      })
    }
    $scope.statusChange = function(){
      $scope.isSaveChanges = true;
    }
    $scope.pnlcatChange = function(){
      $scope.isSaveChanges = true;
    }
    $scope.minorcatChange = function(){
      $scope.isSaveChanges = true;
    }
    
    

    CommonService.fetchInvClientItems($scope.response);
    $scope.init = function() {
      // console.log("init called")
      $scope.showLoaderCol = true;
      $scope.showLoader = true;
      _.forEach($scope.datas, function(item) {
        if(item.inventoryName  == ''){
          item.inventoryName ="Unknown"
        }
        if (item.inventoryName != '') {
          $scope.ingredients.push(item);
        }
      })
      $scope.categories = [];

      _.forEach($scope.ingredients, function(item) {
        if ($scope.categories.indexOf(item.category) == -1) {
          catItem = {
            "category": item.category
          }
          $scope.categories.push(catItem);
        }
      })

      function arrUnique(arr) {
        var cleaned = [];
        arr.forEach(function(itm) {
          var unique = true;
          cleaned.forEach(function(itm2) {
            if (_.isEqual(itm, itm2)) unique = false;
          });
          if (unique) cleaned.push(itm);
        });
        return cleaned;
      }
      $scope.simpleList = ['test1', 'test2', 'test3', 'test4', 'test5', 'test6'];
      $scope.categories = arrUnique($scope.categories);
      if($scope.selectedCategory && $scope.selectedItemIdx) {
        $scope.selectedItem($scope.selectedCategory, $scope.selectedItemIdx);
      } else {
        _.forEach($scope.categories, function(item, iIndex) {
          var itemNumber = "showSelected" + iIndex.toString();
          if (iIndex == 0) {
            $scope[itemNumber] = "showBackground";
          } else {
            $scope[itemNumber] = "";
          }
        })
        $scope.ingredientsData = [];
        $scope.invItemIdList = [];
        _.forEach($scope.ingredients, function(item) {

          if (($scope.catList[0].toLowerCase() == item.category.toLowerCase() )&& item.inventoryName != '') {
            item.isExpanded = false;
            $scope.ingredientsData.push(item);
            $scope.invItemIdList.push(item.inv_item_id);
            // console.log(item);
          }
        })

        $scope.fetchSupplier();
      }
      $scope.searchData = $scope.ingredientsData;
      $scope.initComplete = true;
      $scope.$applyAsync();

    }

    $scope.fetchSupplier = function(){
      // console.log($scope.invItemIdList);
      function arrUnique(arr) {
        var cleaned = [];
        arr.forEach(function(itm) {
          var unique = true;
          cleaned.forEach(function(itm2) {
            if (_.isEqual(itm, itm2)) unique = false;
          });
          if (unique) cleaned.push(itm);
        });
        return cleaned;
      }
      CommonService.fetchSupplierItemWeb(function(response){
        // console.log("supplier response is");
        $scope.supllierList = response.data.data;
        // console.log($scope.supllierList);
        _.forEach($scope.ingredientsData,function(ing,i){
          ing.supList = [];
          ing.buttonColor = false;
          _.forEach($scope.supllierList,function(sup,j){
            if(ing.inv_item_id == sup.Inv_item_id){
              // console.log(i);
              ing.supList.push(sup);
              ing.buttonColor = true;
              ing.supList = arrUnique(ing.supList)
            }
          });

        });
        // console.log($scope.ingredientsData);

      }, $scope.invItemIdList);
    }

    $scope.selectedItemCheck=false;
    $scope.selectedItem = function(data, index) {
      $scope.showLoaderCol = true;
      $scope.invItemIdList = [];
      $scope.selectedItemCheck=true;
      $scope.showSelected = true;
      $scope.text.searchData='';
      $scope.selectedItemCat = data;
      $scope.selectedItemIndex = index;
      if($scope.mappingItem){
        toastMessage("Please save supplier changes ",2000)
      }else {
      _.forEach($scope.catList, function(item, iIndex) {
        var itemNumber = "showSelected" + iIndex.toString();
        if (iIndex == index) {
          $scope[itemNumber] = "showBackground";
        } else {
          $scope[itemNumber] = "";
        }
      })
      $scope.ingredientsData = [];
      _.forEach($scope.ingredients, function(item) {
        if(item.inventoryName == ''){
          item.inventoryName = 'Unknown'
        }
        if ((data.toLowerCase() == item.category.toLowerCase()) && item.inventoryName != '') {
          $scope.ingredientsData.push(item);
          $scope.invItemIdList.push(item.inv_item_id);
        }
      })
      $scope.fetchSupplier();
      $scope.searchData = $scope.ingredientsData;
    }
      if($scope.ingredientsData.length == 0){
        $scope.ingredientsDatalength = false;
      }
    }
    $scope.$watch('ingredients', function(newval, oldval) {
      // console.log("watch called",newval)
      $scope.newData = newval;
      $scope.oldData = oldval;
    }, true)
    $scope.$watch('text.searchData', function(value) {
      $scope.showLoaderCol = true;
      if (!value || value.lenght == 0) {
        $scope.showLoaderCol = false;
        $timeout(function() {
          if($scope.selectedItemCat && $scope.selectedItemIndex){
            $scope.selectedItem($scope.selectedItemCat, $scope.selectedItemIndex);
          }else{
            if($scope.catList) {
              var itemIndex = 0;
              var itemcategory = $scope.catList[0]
              $scope.selectedItem(itemcategory,itemIndex)
            }
          }

          $scope.showLoaderCol = true;
        }, 300)
      }
    }, true);
    var toastMessage = function(message_text, duration) {
      if (typeof duration === 'undefined') duration = 2000;
      $ionicLoading.show({
        template: message_text,
        noBackdrop: true,
        duration: duration
      });
    }
    $scope.nameChange = function(item) {
      $scope.checkData = false;
      $scope.isSaveChanges = true;

    }
    $scope.checkData = false;
    $scope.saveChanges = function() {
      // $scope.showLoaderCol = false;
      $scope.selectedInv =[];
      serviceRequestData = {
        inv_data: $scope.newData
      }
      var serviceReqDataMapping ={
        "category" : $scope.currentSelected.category,
        "inv_ids"  : $scope.resultDataArray
      }
      _.forEach($scope.newData, function(item) {
        if (item.inventoryName == '') {
          $scope.checkData = true;
        }
      })
      if ($scope.isSaveChanges) {
        if($scope.mappingItem){
          $scope.showLoaderCol = false;
          CommonService.postMultiSupplierDetails(function(data) {
            if(data.data.success == true){
              CommonService.fetchInvClientItems($scope.response);
              toastMessage("mapping successfully done",3000);
              $scope.mappingItem = false;
            }
          },serviceReqDataMapping)
        }
        if ($scope.checkData) {
          toastMessage("please enter inventory name", 2000);
          $scope.showLoaderCol = true;
        } else {
          $scope.isSaveChanges = false;
          $scope.showLoader = false;
          CommonService.saveInvToolChanges(invToolRes, serviceRequestData);
          $scope.ingredients = []
        }
      } else {
        $scope.showLoaderCol = true;
        toastMessage("Oops! nothing to change", 2500);
      }
      // $scope.$applyAsync();
    }
    var invToolRes = function(data) {
      if (data.data.response == true) {
        // $scope.showLoaderCol = false;
        $scope.selectedCategory = $scope.selectedItemCat;
        $scope.selectedItemIdx = $scope.selectedItemIndex;
        if($scope.newCategory){
          _.forEach($scope.ingredientsData,function(val){
            if(val.rank > $scope.newCategory.rank) {
              $scope.reorderDataItem = {};
              $scope.reorderDataItem.category = val.category;
              $scope.reorderDataItem.inv_item_id = val.inv_item_id;
              $scope.reorderDataItem.rank = val.rank - 1;
              return false;
            }
          })
          CommonService.reOrderItems(function(data) {
            if(data.data.response == true){
              // CommonService.fetchInvClientItems($scope.response);
              toastMessage("Item reordered successfully ",2000);
              CommonService.fetchInvClientItems($scope.response);
              $scope.$applyAsync();
            }else{
                toastMessage("Something went wrong !")
              }
          },$scope.reorderDataItem)
        } else {
          CommonService.fetchInvClientItems($scope.response);
          toastMessage("successfully changes saved", 2500);
        }
      }
    }
    $scope.changeCategory = function(data,index){
      $scope.newCategory = data;
      $scope.isSaveChanges = true;
    }
    $scope.unitsChange = function(){
      $scope.isSaveChanges = true;
    }
    $scope.pnl_categories_list = [];
    CommonService.fetchPnlCategories(function(data) {
      $scope.pandlCateories = data.pl_cat;
      $scope.pnl_categories_list = data.pl_cat;
    })
    
    CommonService.getsupplier(function(data) {
      // console.log("supplier data",data);
      $scope.supplierList = data.supItems;
      $scope.supplierUnits = data.units;
    })
    $scope.selectedInv = [];
    $scope.setIngredient = function(item, type, index) {
      // console.log("called",item);
      $scope.isinvDuplicate = false;
      if($scope.selectedInv.lenght == 0) {
        $scope.isinvDuplicate = false;
      }
      // console.log("$scope.selectedInv",$scope.selectedInv,$scope.ingredientsData)
      if($scope.selectedInv) {
          _.forEach($scope.selectedInv,function(invId) {
            if(item.inv_item_id == invId) {
              // console.log("item")
              $scope.isinvDuplicate = true;
            }
          })
      }
      // console.log("$scope.isinvDuplicate",$scope.isinvDuplicate)
      if(!$scope.isinvDuplicate) {
        angular.element(document.querySelectorAll('#my_recipe_ing')).triggerHandler('click');
        $scope.currentSelected = item;
      }else {
        toastMessage("Already supplier selected for mapping",2000);
      }
      

    }
    $scope.currentSelectedItem = '';
    $scope.currentActiveLIst = []
    $scope.resultDataArray = [];
    
    $scope.shoutLoud = function(newvalue,oldvalue){
      $scope.isDuplicate = false;
      $scope.isSaveChanges = true;
      $scope.mappingItem =true;
      $scope.currentActiveItem = {
            'isActive' :true,
            'isDeleted' :false,
            'supplierId':newvalue.supplierId,
            'supplierItemId':newvalue.supItemIds,
            'supplierItemName ':newvalue.supItems,
            'supplierName':newvalue.supplier
          }
      _.forEach($scope.ingredientsData,function(item) {
        if(item.inv_item_id == $scope.currentSelected.inv_item_id) {
          _.forEach(item.supList,function(supp) {
            if($scope.currentActiveItem.supplierItemId == supp.item_num) {
              $scope.isDuplicate = true;
            }
          })
          if(!$scope.isDuplicate) {
            item.supList.push({
              'supp_name' :newvalue.supplier,
              'unit' :newvalue.measurementId,
              'invoice_num':newvalue.invoiceNum,
              'billing_units':newvalue.measurementId,
              'billling_price ':newvalue.supplierItemPrice,
              'Inv_item_id':$scope.currentSelected.inv_item_id,
              'item_num' :newvalue.supItemIds,
              'supplier_id' :newvalue.supplierId
            })
            $scope.selectedInv.push($scope.currentSelected.inv_item_id)

          }else {
            toastMessage("Supplier already exist")
          }
          
          _.forEach(item.supList,function(supp){
            $scope.currentActiveLIst.push({
              'isActive' :true,
              'isDeleted' :false,
              'supplierId':supp.supplier_id,
              'supplierItemId':supp.item_num,
              'supplierItemName ':supp.desc,
              'supplierName':supp.supp_name
            })
          })
        }
      })
      _.forEach($scope.currentActiveLIst,function(item){
        if(item.supplierId != $scope.currentActiveItem.supplierId){
          item.isActive = false;
        }
      })
      if(!$scope.isDuplicate) {
        $scope.resultDataArray.push({
           "inv_id"     :$scope.currentSelected.inv_item_id,
           "isNew"      : true,
           "newItem"    : $scope.currentActiveItem,
           "activeItems": $scope.currentActiveLIst
        })
      }
      $scope.currentActiveLIst = [];
        // console.log("$scope.resultDataArray",$scope.resultDataArray);
    }  

    CommonService.fetchMeasurements(function(data) {
      $scope.measurementUnits = data.measurements;
      $scope.measurements_list = [];
      _.forEach(data.measurements, function(measurements) {
        if (measurements.measurement_name != null && measurements.measurement_name != '') {
          $scope.measurements_list.push(measurements);

        }

      });
    })
    CommonService.fetchInventoryCategories(fetchInventoryCategoriesres);
    $scope.Allcategories=[];
    function fetchInventoryCategoriesres(data) {
      // $scope.Allcategories = data.categories;
      $scope.categories_list = [];
      _.forEach(data.categories, function(categories) {
        if (categories.category != null && categories.category != '') {
          $scope.categories_list.push(categories.category);
          $scope.Allcategories.push(categories);
        }

      });
    }
    $scope.minor_categories_list = [];
    CommonService.fetchMinorCategories(function(data) {
      $scope.minorcategories = data.data.minor_categories;
      $scope.minor_categories_list = data.data.minor_categories;
    })

    $scope.openForm = function() {
      $scope.invItem = {
        "name": "",
        "category": "",
        "measurement": "",
        "price": null,
        "par": null,
        "supplier_id": "",
        "status": "active",
        "minorCategory": "",
        "pnlCategory": ""
      }

      $scope.openModal();

    }
    $scope.form = {
      addInvItem: {}
    };

    $ionicModal.fromTemplateUrl('add-inventory-item-modal.html', {
      scope: $scope,
      animation: 'slide-in-up',
      backdropClickToClose: false
    }).then(function(modal) {
      $scope.modal = modal;
    });
    $scope.openModal = function() {
      $scope.modal.show();
    };
    $scope.closeModal = function(model) {
      $scope.form.addInvItem.$setPristine();
      $scope.form.addInvItem.$setUntouched();
      $scope.modal.hide();
    };

    $scope.addInventoryItem = function() {
      if (!$scope.invItem.par) {
        $scope.invItem.par = 0;
      }
      $scope.match = false;
      $scope.matchName = '';
      var matchCategories = _.find($scope.ingredients, function(catName) {
        if(catName.inventoryName != undefined) {
          if (((catName.inventoryName).toLowerCase() == ($scope.invItem.name).toLowerCase()) && (catName.category == $scope.invItem.category)) {
            $scope.match = true;
          }
        }
      });

      if ($scope.match) {
        var confirmPopup = $ionicPopup.show({
          title: 'Add Inventory Item',
          buttons: [{
            text: 'Ok',
            type: 'button-bal myClass'
          }],
          template: '<center>There is an other item with the same name ,<br/> Please add different name!</center>',
        });

      } else {
        $scope.closeModal();
        CommonService.addNewInvItem(invRes, $scope.invItem);
      }

    }

    function invRes(invData) {
      if (invData.status == 200) {
        toastMessage("Your inventory item has been successfully added.", 1200);
        $scope.showLoader = false;
        $scope.showLoaderCol = false;
        CommonService.fetchInvClientItems($scope.response);
      } else {
        $scope.closeModal();
        toastMessage("Something goes wrong", 1200);
      }
    }
    var filterBarInstance;
    var removeSearchStatus = false;
    $scope.showFilterBarInvTool = function() {
      var search_fields = ['inventoryName', 'category', 'units', 'PnLCatgeory', 'minorCategory', 'status'];

      filterBarInstance = $ionicFilterBar.show({
        items: $scope.searchData,
        debounce: true,
        update: function(filteredItems, filterText) {
          if (angular.isDefined(filterText) && filterText.length > 0) {
            _.forEach(filteredItems, function(invItem) {
              var keepRecipeItem = false;
              _.forEach(search_fields, function(search_field) {
                var textToSearch = _.get(invItem, search_field, "");
                if (textToSearch != "") {
                  if (textToSearch.toLowerCase().indexOf(filterText.toLowerCase()) != -1) {
                    if (textToSearch.toLowerCase().includes(filterText.toLowerCase())) {
                      keepRecipeItem = true

                    }
                  }
                }
                if (keepRecipeItem) {
                  invItem.searchHidden = false;
                } else {
                  invItem.searchHidden = true;
                }
              })


            })
            $scope.ingredientsData = filteredItems
          } else {
            $scope.ingredientsData = filteredItems;
            if (removeSearchStatus) {
              removeSearchStatus = false;
              return
            }
            _.forEach(filteredItems, function(invItem) {

              invItem.searchHidden = false;

            })
          }
        },
        cancel: function() {
          $scope.ingredientsData = $scope.searchData;
        }
      });
    };

    function addLocationRes(locationData) {
      if (locationData.status == 200) {
        toastMessage("Your location has been successfully added.", 1200);
        $scope.showLoader = false;
        $scope.showLoaderCol = false;
        CommonService.fetchInvClientItems($scope.response);
        $scope.location={};
        $scope.form.addNewLocation.locationName.$touched = false;
      } else {
        $scope.closeModal();
        toastMessage("Something goes wrong", 1200);
      }
    }
    $scope.locationName=false;
    $scope.addNewLocation = function() {
      // $scope.match = false;
      $scope.matchName = '';
      if($scope.location.category ==''){
        $scope.locationName=true;
      }
      // console.log($scope.categories);
      var matchCategories = _.find($scope.catList, function(catName) {
        // console.log(catName);
        // if ((catName.category).toLowerCase() == ($scope.location.category).toLowerCase()) {
        //   $scope.match = true;
        // }
        return ((catName).toLowerCase() == ($scope.location.category).toLowerCase());
      });

      if (matchCategories) {
        var confirmPopup = $ionicPopup.show({
          title: 'Add Location',
          buttons: [{
            text: 'Ok',
            type: 'button-bal myClass'
          }],
          template: '<center>There is an other location with the same name ,<br/> Please add different name!</center>',
        });
      } else {
        if($scope.locationName == true){
          toastMessage("please enter location name",3000)
        }else{
          // console.log("inside scoe");
          // console.log($scope.location);
          CommonService.addNewLocationWeb(addLocationRes, $scope.location);
          $scope.closeLocaionModal();
          
        }
      }

    }

    $scope.deleteSupplierItem = function(item) {
      var confirmPopup = $ionicPopup.confirm({
            template: 'Do you want to remove the mapping of this supplier item',
            cancelText:"No",
            cancelType: "button-popupColorCancel",
            okText: "Yes",
            okType: "button-popupColor",
            cssClass: 'my-popup',
          });
          confirmPopup.then(function(res) {
            if (res) {
              $scope.showLoaderCol = false;
              var serviceReqData ={
                "supplier_id" : item.supplier_id,
                "supplier_item_id"  : item.item_num,
                "inventory_item_id"  : item.Inv_item_id
               }
              CommonService.deleteSupplierItemINV(function(data) {
                function arrUnique(arr) {
                  var cleaned = [];
                  arr.forEach(function(itm) {
                    var unique = true;
                    cleaned.forEach(function(itm2) {
                      if (_.isEqual(itm, itm2)) unique = false;
                    });
                    if (unique) cleaned.push(itm);
                  });
                  return cleaned;
                }
                if(data.response){
                  CommonService.fetchSupplierItemWeb(function(response){
                    // console.log("supplier response is");
                    $scope.supllierList = response.data.data;
                    // console.log($scope.supllierList);
                    _.forEach($scope.ingredientsData,function(ing,i){
                      ing.supList = [];
                      ing.buttonColor = false;
                      _.forEach($scope.supllierList,function(sup,j){
                        if(ing.inv_item_id == sup.Inv_item_id){
                          // console.log(i);
                          ing.supList.push(sup);
                          ing.buttonColor = true;
                          ing.supList = arrUnique(ing.supList)
                        }
                      });

                    });
                    $scope.showLoaderCol = true;
                    // console.log($scope.ingredientsData);

                  }, $scope.invItemIdList);
                  toastMessage("Supplier item deleted successfully")
                }
              },serviceReqData)
            } else {
              $ionicListDelegate.closeOptionButtons();
            }
            // $ionicListDelegate.closeOptionButtons();
          });
      
    }
    $scope.closeLocaionModal = function(){
      $scope.addLocationModal.hide();
      $scope.location={};
      $scope.form.addNewLocation.locationName.$touched = false;
    }

    $scope.addLocationModal = $ionicModal.fromTemplate(`<ion-modal-view  class="my-invTool-modal-web">
        <ion-header-bar style="background-color: #F5F5F5;">
            <div class="col col-90"><h1 class="text-center add-inv-header-name">Add New Location</h1></div>
            <div class="col col-10" ng-click="closeLocaionModal()"><i class="icon ion-close"></i></div>
        </ion-header-bar>
        <hr style="border-top: 10px solid #f8f8f8;margin-top: 12%">
      <ion-content style="overflow: auto;">
        <form name="form.addNewLocation" ng-submit="addNewLocation()" novalidate style="padding: 10px;">
              <div class="row add-inv-name-div">
                  <input placeholder="Location Name" name="locationName" class="add-inv-name" type="text" ng-model="location.category" ng-maxlength="15" ng-change="locationCange(location.category)" required/>
              </div>
              <p ng-show="form.addNewLocation.locationName.$error.required && form.addNewLocation.locationName.$touched" class="help-block error">Location Name is required.</p>
              <p ng-show="form.addNewLocation.locationName.$error.maxlength" class="help-block error">Location Name is too long</p>
              <div class="popup-buttons">
                  <button type="button" class="button button-default " ng-class="button-default" ng-click="closeLocaionModal()">Cancel</button>
                  <button type="submit" class="button button-bal " ng-disabled="form.addNewLocation.$invalid" ><b>Add</b></button>
              {{form.addNewLocation.$touched}}</div>
          </form>
      </ion-content>
      </ion-modal-view>`, {
      scope: $scope,
      animation: 'slide-in-up',
      backdropClickToClose: false
    });
    $scope.location = {
      "category": "",
    }
    $scope.openAddLocationModal = function() {
      $scope.addLocationModal.show();
    };
    $scope.locationCange = function(){
      $scope.locationName = false;
    }
    $scope.reorderData=[];
    $scope.rankChange = function(value){
      $scope.isSaveChanges = true;
      $scope.selectedCategory = $scope.selectedItemCat;
      $scope.selectedItemIdx = $scope.selectedItemIndex;
      $scope.reorderDataItem={
        "category":value.category,
        "inv_item_id":value.inv_item_id,
        "rank":value.rank
      }
      if(value.rank != ""){
        CommonService.reOrderItems(function(data) {
              if(data.data.response == true){
              toastMessage("Item reordered successfully ",2000);
              $scope.ingredients =[];
              CommonService.fetchInvClientItems($scope.response);
              }else{
                toastMessage("Something went wrong !")
              }
            },$scope.reorderDataItem)
      }else{
        toastMessage("Please enter rank",2000)
      }
    }
    // $scope.reOrder = function(){
    //   _.forEach($scope.ingredientsData,function(item){
    //     $scope.reorderData.push({"category":item.category,"inv_item_id":item.inv_item_id,"rank":item.rank
    //     })
    //   })
    //   console.log("$scope.reorderData",$scope.reorderData)
    // }


  }

projectCostByte.directive('draggableCategory',draggableCategory)
draggableCategory.$inject = ['$rootScope'];
  function draggableCategory($rootScope){
  return {
    link:function(scope,elem,attr){
      elem[0].ondragstart = function(event){
        $rootScope.chosenItemCat = scope.category;
      };
    }
  };
};
projectCostByte.directive('draggrbleContainers',draggrbleContainers)
draggrbleContainers.$inject = ['$rootScope','CommonService','$ionicLoading'];
  function draggrbleContainers($rootScope,CommonService,$ionicLoading){
  return {
      link:function(scope,elem,attr){
        elem[0].ondrop = function(event){
          event.preventDefault();
          let selectedIndex = scope.catList.indexOf($rootScope.chosenItemCat);
          let newPosition = scope.catList.indexOf(scope.category);
          if(selectedIndex > -1) {
            scope.$parent.catList.splice(selectedIndex,1);
            scope.$parent.catList.splice(newPosition,0,$rootScope.chosenItemCat);
            scope.$apply();
          }
          scope.reorderCatData=
          {"category":$rootScope.chosenItemCat,"rank":newPosition+1
          }
          var toastMessage = function(message_text, duration) {
            if (typeof duration === 'undefined') duration = 2000;
            $ionicLoading.show({
              template: message_text,
              noBackdrop: true,
              duration: duration
            });
          }
          CommonService.reOrderCategory(function(data) {
            if(data.data.response == true){
            toastMessage("Category reordered successfully ",2000);
            CommonService.fetchInvClientItems($scope.response);
            }else{
              toastMessage("Something went wrong !")
            }
          },scope.reorderCatData)
        };
        elem[0].ondragover = function(event){
          event.preventDefault();

        };
      }
    };
};

projectCostByte.directive('draggableItem',draggableItem)
draggableItem.$inject = ['$rootScope'];
  function draggableItem($rootScope){
  return {
    link:function(scope,elem,attr){
      elem[0].ondragstart = function(event){
        $rootScope.chosenItem = scope.category;

      };
    }
  };
};
projectCostByte.directive('draggrbleContainer',draggrbleContainer)
draggrbleContainer.$inject = ['$rootScope','CommonService','$ionicLoading'];
  function draggrbleContainer($rootScope,CommonService,$ionicLoading){
  return {
      link:function(scope,elem,attr){
        elem[0].ondrop = function(event){
          event.preventDefault();
          let selectedIndex = scope.ingredientsData.indexOf($rootScope.chosenItem);
          let newPosition = scope.ingredientsData.indexOf(scope.category);
          var rank = $rootScope.chosenItem.rank;
          $rootScope.chosenItem.rank = scope.category.rank;
          scope.category.rank = rank;
          scope.invId = angular.copy(scope.category.inv_item_id);
          if(selectedIndex > -1) {
            scope.$parent.ingredientsData.splice(selectedIndex,1);
            scope.$parent.ingredientsData.splice(newPosition,0,$rootScope.chosenItem);
            scope.$apply();
          }
          scope.reorderData=
          {"category":$rootScope.chosenItem.category,"inv_item_id":$rootScope.chosenItem.inv_item_id,"rank":$rootScope.chosenItem.rank
          }
          var toastMessage = function(message_text, duration) {
            if (typeof duration === 'undefined') duration = 2000;
            $ionicLoading.show({
              template: message_text,
              noBackdrop: true,
              duration: duration
            });
          }
          if($rootScope.chosenItem.inv_item_id != scope.invId){
              CommonService.reOrderItems(function(data) {
                if(data.data.response == true){
                toastMessage("Item reordered successfully ",2000);
                scope.ingredientsData.sort(function(a, b) {
                  return parseFloat(a.rank) - parseFloat(b.rank);
                });
                }else{
                  toastMessage("Something went wrong !")
                }
              },scope.reorderData)
          }
        };
        elem[0].ondragover = function(event){
          event.preventDefault();

        };
      }
    };
};
projectCostByte.directive('restrictField', function () {
    return {
        restrict: 'AE',
        scope: {
            restrictField: '='
        },
        link: function (scope) {
          // this will match spaces, tabs, line feeds etc
          // you can change this regex as you want
          var regex = /\s/g;

          scope.$watch('restrictField', function (newValue, oldValue) {
              if (newValue != oldValue && regex.test(newValue)) {
                scope.restrictField = newValue.replace(regex, '');
              }
          });
        }
    };
  });
})();
