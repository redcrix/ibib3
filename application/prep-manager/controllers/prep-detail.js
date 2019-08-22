(function() {
  'use strict';

  projectCostByte.controller('prepDetailCtrl', prepDetailCtrl);

  prepDetailCtrl.$inject = ['$q', '$ionicHistory', '$scope', '$state', '$stateParams', '$timeout', '$ionicTabsDelegate', 'MarginOptimizerServiceOne', '$ionicPopup', 'Utils', '$rootScope', '$ionicPopover', 'CommonService', '$ionicScrollDelegate', 'ErrorReportingServiceOne', '$ionicListDelegate', 'TaskCreationServiceOne', '$ionicLoading'];

  function prepDetailCtrl($q, $ionicHistory, $scope, $state, $stateParams, $timeout, $ionicTabsDelegate, MarginOptimizerServiceOne, $ionicPopup, Utils, $rootScope, $ionicPopover, CommonService, $ionicScrollDelegate, ErrorReportingServiceOne, $ionicListDelegate, TaskCreationServiceOne, $ionicLoading) {
    $scope.navBarTitle.showToggleButton = false;
    $rootScope.prepItems = {};
    $scope.prepName = $state.params.prepName;
    $rootScope.prepItems = $state.params;
    // console.log($rootScope.prepItems);
    $scope.navButon = true;
    $scope.gotList = false;
    $scope.optionval = true;
    $scope.dataRecieved = false;
    $scope.costRecieved= false;
    $scope.prepItemDisabled = true;
    $scope.isEditmode = false;
    $scope.prepItemSaveDisabled = true;
    $scope.navBarTitle.showToggleButton = false;
    $scope.recipeid ='';
    $scope.showIds = false;
    $scope.changeItem = false;
    $rootScope.prepItems.yield_qty = parseFloat($rootScope.prepItems.yield_qty);
    $rootScope.prepItems.prepCost = parseFloat($rootScope.prepItems.prepCost).toFixed(4);
    $rootScope.prepItems.prepUnitCost = parseFloat($rootScope.prepItems.prepUnitCost).toFixed(4);
    
    $scope.goBack = function() {
      $ionicHistory.goBack();
    }
    if (angular.isUndefined($scope.prepNames)) {
        CommonService.fetchIngredientPrepItems(function(data) {
          $scope.prepNames = [];
          $scope.ingredientList = [];
          _.forEach(data.ingredients.ingredients[0], function(item) {
            if (item.ingredientId != 'N/A' && item.ingredientId != '') {
              $scope.prepNames.push(item);
              $scope.ingredientList.push(item);
            }
          })
          $scope.units = data.units;
          $scope.yieldUnits = data.yieldUnit;
          
        });
      }

      CommonService.fetchModItemIngredients(fetchIngredientsRHW, {
          menuItem: $scope.prepItems.prepId
        });           
    // CommonService.getPrepIngredients(function(data){
    //    $scope.mainData = data.value;
    //    _.forEach($scope.mainData,function(item){
    //      if($state.params.prepId == item.prep_id){
    //        $scope.prepItems = item;
    //        $scope.prepItems.prepToggle = $state.params.prepToggle;
    //         $scope.prepItems.yield_qty = parseFloat($scope.prepItems.yield_qty);
    //         $scope.prepItems.total_cost = parseFloat($scope.prepItems.total_cost).toFixed(2);
    //         $scope.prepItems.unit_cost = parseFloat($scope.prepItems.unit_cost).toFixed(2);
    //      }
    //    })
       
    // })
    
    // localStorage.setItem('prepToggle',$scope.prepItems.prepToggle)
    /*  $rootScope.$ionicGoBack = function(){
          console.log('go back')
          $ionicHistory.goBack()
      } */
if (ionic.Platform.platform() != 'android' && ionic.Platform.platform() != 'ios') $scope.showIds = true;
      function checkNumberFieldLength(elem){
        if (elem.value.length > 4) {
                elem.value = elem.value.slice(0,4);
            }
        }

    $rootScope.prepToggle = $rootScope.prepItems.prepToggle;

    $scope.quantityChange = function(value ,event){
      $scope.changeItem = true;
      $scope.prepItemSaveDisabled  = false;
      var maxLength =4;
      if(value.ingredientQuantity != null){
          var editedValue = value.ingredientQuantity.toString()
          if (value.ingredientQuantity.toString().length > maxLength && !editedValue.includes('.')){
            if(editedValue[4] != '.'){
              value.ingredientQuantity=parseFloat(value.ingredientQuantity.toString().slice(0, maxLength))
              toastMessage("Portion should be minimum of four digits.",2000);
            }
          }
          value.ingredientQuantity = parseFloat(value.ingredientQuantity.toFixed(4));
      }

      if(value.ingredientQuantity == null ) {
            $scope.prepItemSaveDisabled = true;
            toastMessage("Portion should not be blank or zero.",2000)
        }else if(value.ingredientQuantity == 0){
            $scope.prepItemSaveDisabled = true;
            toastMessage("Portion should not be blank or zero",2000);
        } else if(value.ingredientQuantity < 0) {
            value.ingredientQuantity = null;
            $scope.prepItemSaveDisabled = true;
            toastMessage("Portion cannot be a negative value.",2000);
        }
    }

    $scope.yieldquantityChange = function(value ,event){
      $scope.yieldChange = true;
      $scope.changeItem = true;
      $scope.prepItemSaveDisabled  = false;
      var maxLength =4;
      if(value.yield_qty != null){
          var editedValue = value.yield_qty.toString()
          if (value.yield_qty.toString().length > maxLength && !editedValue.includes('.')){
            if(editedValue[4] != '.'){
              value.yield_qty=parseFloat(value.yield_qty.toString().slice(0, maxLength))
              toastMessage("Yield quantity should be minimum of four digits.",2000);
            }
          }
          value.yield_qty = parseFloat(value.yield_qty.toFixed(4));
      }

      if(value.yield_qty == null ) {
            $scope.prepItemSaveDisabled = true;
            toastMessage("Yield quantity should not be blank or zero.",2000)
        }else if(value.yield_qty == 0){
            $scope.prepItemSaveDisabled = true;
            toastMessage("Yield quantity should not be blank or zero",2000);
        } else if(value.yield_qty < 0) {
            value.yield_qty = null;
            $scope.prepItemSaveDisabled = true;
            toastMessage("Yield quantity cannot be a negative value.",2000);
        }
    }

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

    $scope.$watch('ingList', function(newval, oldval) {
      // console.log("gg",newval,oldval)
      $scope.newItems = newval;
      $scope.newData = [];
      $scope.oldData = oldval;
      // console.log("$scope.oldData",$scope.oldData)
      _.forEach($scope.newItems, function(item) {
        $scope.newData.push({
          "ingredientId": item.ingredientId,
          "unit": item.ingredientUnit,
          "ingredientName": item.ingredientName,
          "portion": item.ingredientQuantity,
          "ingredientType": item.ingredientType
        })
      })
      _.forEach($scope.newItems, function(item) {
        _.forEach($scope.prepNames, function(data) {
          if (item.ingredientName == data.ingredientName) {
            item.ingredientId = data.ingredientId;
            item.ingredientType = data.IngredientType;
          }
        })
      })
       _.forEach($scope.newData, function(item) {
        _.forEach($scope.prepNames, function(data) {
          if (item.ingredientName == data.ingredientName) {
            item.ingredientId = data.ingredientId;
            item.ingredientType = data.IngredientType;
          }
        })
      })
    }, true)
      var discardList=[];
    function fetchIngredientsRHW(getIngRes) {
      $scope.prepItemDisabled = true;
      $scope.prepItemSaveDisabled = true;
      $scope.newPrepName = false;
      $scope.isEditmode = false;
      $scope.ingList = [];
      $scope.oldData = [];
      $scope.ingItemIdList  =[];
      _.forEach(getIngRes, function(item) {
        // console.log(item);
        if (item.ingredientId != 'N/A' && item.ingredientId != '') {
          if(item.ingredientType != "PREP"){
            item.isExpanded = false;
          }
          $scope.ingList.push(item);
          $scope.ingItemIdList.push(item.ingredientId);
          $scope.recipeid = item.recipeId;
        }

      })
      $scope.ingList = arrUnique($scope.ingList);
      $scope.oldingList = angular.copy($scope.ingList);
      discardList = angular.copy($scope.ingList);
      $scope.fetchSupplier();
      $scope.totalingredientscost = Utils.sumOf($scope.ingList, "ingredientCost");
      $scope.gotList = true;
      $scope.dataRecieved = true; 
      $scope.costRecieved = true;
      _.forEach($scope.ingList, function(value) {
        value.moddatagroup = {
          'show': false,
          'modsAvailable': false,
          'modData': [],
          'modDataTotal': null
        };
        value.moddatagroup.modData =[];
      });
      // console.log("mod",$scope.ingList)
    }
    $scope.toggleGrp = function(grp){
      // console.log($scope.ingList,grp);
      grp.isExpanded = !grp.isExpanded;
      // console.log($scope.ingList);
    }
    

    $scope.addNewIngredient = function() {
      $scope.prepItemSaveDisabled = true;
      $scope.changeItem = true;
      $scope.newItem = {
        "ingredientCost": 0,
        "ingredientCostChange": 0,
        "ingredientId": "",
        "ingredientName": "",
        "ingredientQuantity": '',
        "ingredientSupplierId": "",
        "ingredientSupplierName": "",
        "ingredientType": "",
        "ingredientUnit": "",
        "ingredientUnitName": "",
        "ingredientYieldQuantity": 0,
        "ingredientYieldQuantityMeasurementId": "",
        "inventoryUnit": "",
        "inventoryUnitPrice": 0,
        "recipeId": $scope.recipeid,
        "isnewPortion" : true
      }
      if($scope.ingList.length == 0) {
        $scope.ingList.push($scope.newItem);
      }
      if ($scope.ingList[$scope.ingList.length - 1].ingredientName != '' && $scope.ingList[$scope.ingList.length - 1].ingredientName != '' && $scope.ingList[$scope.ingList.length - 1].ingredientQuantity !='' && $scope.ingList[$scope.ingList.length - 1].ingredientUnit != '') {
        $scope.ingList.push($scope.newItem);
        $scope.newPortion = true;

      } else if($scope.ingList[$scope.ingList.length - 1].ingredientName == '' ){
        toastMessage("Please set proper value for name.", 2000);
      }else if($scope.ingList[$scope.ingList.length - 1].ingredientQuantity == '' ){
        toastMessage("Please set proper value for portion.", 2000);
      }else if($scope.ingList[$scope.ingList.length - 1].ingredientUnit == '' ){
        toastMessage("Please set proper value for unit.", 2000);
      }
    }

    $scope.newPrepName = false;
    $scope.changeName = function(item, index) {
      $scope.prepItemSaveDisabled = false;
          $scope.newPrepName = false;
      _.forEach($scope.oldData, function(data) {
        if (data.ingredientName == item) {
          // console.log("44")
          $scope.newPrepName = true;
          $scope.prepItemSaveDisabled = true;
          toastMessage("Ingredient already exists.", 3000);
        }
      })

      _.forEach(angular.copy($scope.ingList), function(ingre, ind) {

        if (ind == index) {
          _.forEach($scope.prepNames, function(data) {
            if (data.ingredientName == item) {
              ingre.ingredientName = data.ingredientName;
              ingre.ingredientId = data.ingredientId;
              ingre.ingredientType = data.IngredientType;
            }
          })
        }
      })
    }
    $scope.checkForDelete = false;
    $scope.deleteItem = function(item,index) {
      
      _.forEach($scope.newData,function(data,ind){
        if(index == ind){
          $scope.newData.splice(ind,1);
        }
      })
      var serviceRequestData = {
        "ingredients": $scope.newData,
        "recipeId": $scope.recipeid,
        "ingredientGroupId": $rootScope.prepItems.prepId
      }
      _.forEach($scope.oldingList, function(data) {
        if (data.ingredientId == item.ingredientId) {
          $scope.checkForDelete = true;
        }
      })
      // if($scope.checkForDelete){
      var confirmPopup = $ionicPopup.confirm({
            title: 'Delete Item',
            template: 'Do you want to delete the item ?'
        });
        confirmPopup.then(function(res) {
            if(res) {
              $scope.gotList = false;
              $scope.dataRecieved = false;
              $scope.prepItemDisabled = true;
              // if ($scope.checkForDelete) {
               CommonService.savePrepChanges(function(data){
                if(data.data.success){
                    
                    CommonService.fetchModItemIngredients(fetchIngredientsRHW,{
                        menuItem: $rootScope.prepItems.prepId
                    });
                    toastMessage("Item deleted successfully",2000)
                    $scope.oldData = [];
                }else{
                    toastMessage("something went wrong",2000)
                    $scope.gotList = true;
                    $scope.dataRecieved = true;
                    $scope.ingList = $scope.oldingList;
                }
            },serviceRequestData)

            // } else {
            //   toastMessage("Before delete please add item", 2000)
            // }
            } else {
            }
            $ionicListDelegate.closeOptionButtons();
        });
      // }else{
      //   toastMessage("Before delete please add item", 2000)
      // }
      
    }
    $scope.discardPrepChanges = function() {
      if($scope.changeItem) {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Discard changes',
            template: 'Are you sure you want to discard all changes?',
            okText: "Ok",
            okType: "button-balanced",
          });
          confirmPopup.then(function(res) {
            if (res) {
              $scope.prepItemDisabled = true;
              $scope.prepItemSaveDisabled = true;
              $scope.isEditmode = false;
              $scope.ingList = discardList;
              discardList = angular.copy($scope.ingList);
            } else {
              $ionicListDelegate.closeOptionButtons();
            }
            // $ionicListDelegate.closeOptionButtons();
          });
        }else {
          toastMessage("nothing to discard",3000);
          $scope.prepItemDisabled = true;
          $scope.prepItemSaveDisabled = true;
          $scope.isEditmode = false;
        }
      
    }

    $scope.editPrep = function() {
      $scope.prepItemDisabled = false;
      $scope.prepItemSaveDisabled = false;
      $scope.isEditmode = true;
      // console.log('$scope.ingList',$scope.ingList)
      _.forEach($scope.ingList,function(item) {
        item.isExpanded = false;
        if(item.moddatagroup){
          _.forEach(item.moddatagroup.modData,function(data) {
            data.isExpanded = false;
          })
        }
        // item.moddatagroup = undefined;
        // $scope.isGroupShown(item);
      })

    }
    // $scope.checkSavingItem = true;
    $scope.confirmSave = function() {
      // console.log("$scope.newPrepName",$scope.newPrepName)
        if($scope.yieldChange){
          // console.log($scope.prepItems);
          let yieldData = {
            "recipeId" : $scope.recipeid,
            "ingredientGroupId": $rootScope.prepItems.prepId,
            "recipeYieldQuantity": $rootScope.prepItems.yield_qty,
            "recipeYieldMeasurementId" : $rootScope.prepItems.yield_unit
          }
          // console.log(yieldData);
          if(yieldData.recipeYieldQuantity == 0 || !yieldData.recipeYieldQuantity){
            toastMessage("Please set proper value for yield quantity.",2000)
          }else {
            toastMessage("Saving ...",4000);
            $scope.gotList = false;
            $scope.dataRecieved = false;
            CommonService.updateIngredientYieldUnit(function(data){
                // console.log(data);
                if(data.status == 200){
                    $scope.gotList = true;
                    $scope.dataRecieved = true;
                    $scope.prepItemDisabled = true;
                    $scope.prepItemSaveDisabled = true;
                    $scope.isEditmode = false;

                    // console.log('fire event----');
                    // $rootScope.$broadcast('REFRESH_PREP_MENUS');
                    toastMessage("changes saved successfully",2000)
                    $scope.changeItem = false;
                    $scope.yieldChange = false;
                }else{
                    toastMessage("something went wrong",2000)
                    $scope.gotList = true;
                    $scope.dataRecieved = true;
                }
            },yieldData)
          }
        }


      $scope.prepItemDisabled = true;
      // toastMessage("Saving ...",4000)

      var serviceRequestData = {
        "ingredients": $scope.newData,
        "recipeId": $scope.recipeid,
        "ingredientGroupId": $rootScope.prepItems.prepId
      }

      _.forEach(serviceRequestData.ingredients, function(item) {
        if (item.unit == '' || item.portion == 0 || item.portion == null) {
          $scope.checkSavingItem = false;
          $scope.prepItemSaveDisabled = true;
        }
        
      })
      function checkPortionZero(existLocal){
        let qty =  _.filter(existLocal,function(o){
          return (o.portion == 0 || o.portion == null);
        });
        return qty;
      }
      // console.log($scope.oldData,$scope.checkSavingItem)
      if ($scope.changeItem) {
        if ($scope.checkSavingItem) {
          if (!$scope.newPrepName) {
                toastMessage("Saving ...",4000)
                $scope.gotList = false;
                $scope.dataRecieved = false;
              CommonService.savePrepChanges(function(data){
                  if(data.data.success){
                      $scope.gotList = false;
                      $scope.dataRecieved = false;
                      CommonService.fetchModItemIngredients(fetchIngredientsRHW,{
                          menuItem: $rootScope.prepItems.prepId
                      });
                      CommonService.getPrepIngredients(function(data){
                         $scope.mainData = data.value;
                         _.forEach($scope.mainData,function(item){
                           if($state.params.prepId == item.prep_id){
                             $rootScope.prepItems.prepId = item.prep_id;
                             $rootScope.prepItems.prepName = item.prep_name;
                             $rootScope.prepItems.prepCost = item.total_cost;
                             $rootScope.prepItems.prepUnitCost = item.unit_cost;
                             $rootScope.prepItems.yield_unit = item.yield_unit;
                             $rootScope.prepItems.yield_qty = item.yield_qty;
                             $rootScope.prepItems.prepToggle = false;

                           }
                         })           
                      })
                      toastMessage("changes saved successfully",2000)
                      $scope.newPortion = false;
                      $scope.oldData = [];
                      $scope.changeItem = false;
                      $scope.yieldChange = false;
                  }else{
                      toastMessage("something went wrong",2000)
                      $scope.gotList = true;
                      $scope.dataRecieved = true;
                  }
              },serviceRequestData)

          } else {
            toastMessage("Ingredient already exists.", 3000)
          }

        } else {
          _.forEach($scope.ingList, function(item) {
       
          if(item.ingredientName == '' ){
          toastMessage("Please set proper value for name.", 2000);
          }else if(item.ingredientQuantity == '' ){
            toastMessage("Please set proper value for portion.", 2000);
          }else if(item.ingredientUnit == '' ){
            toastMessage("Please set proper value for unit.", 2000);
          }
      })
          $scope.checkSavingItem = true;
          $scope.prepItemDisabled = false;
          $scope.prepItemSaveDisabled = false;
          $scope.isEditmode = true;

        }
      } else if(!$scope.yieldChange){
        toastMessage("Oops! nothing to do ");
          $scope.prepItemDisabled = true;
          $scope.prepItemSaveDisabled = true;
          $scope.isEditmode = false;
      }
    }
    $scope.editItem = function(item) {
      $rootScope.$broadcast('prepItemEdit',item)
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
        // $scope.isSuplistLoaded = true;
        // console.log($scope.supllierList);
        _.forEach($scope.ingList,function(ing,i){
          ing.supList = [];
          ing.buttonColor = false;
          if(ing.moddatagroup.modData){
            _.forEach(ing.moddatagroup.modData,function(mod){
              mod.supList = [];
              _.forEach($scope.supllierList,function(sup,j){
                if(mod.ingredientId == sup.Inv_item_id){
                  // console.log(i);
                  mod.supList.push(sup);
                  mod.buttonColor = true;
                  mod.supList = arrUnique(mod.supList)
                }
              });
            })
          }
          _.forEach($scope.supllierList,function(sup,j){
            if(ing.ingredientId == sup.Inv_item_id){
              // console.log(i);
              ing.supList.push(sup);
              ing.buttonColor = true;
              ing.supList = arrUnique(ing.supList)
            }
          });

        });
        // console.log($scope.ingredientsData);

      }, $scope.ingItemIdList);
    }


    var toastMessage = function(message_text, duration) {
      if (typeof duration === 'undefined') duration = 2000;
      $ionicLoading.show({
        template: '<div class="item-text-wrap" style="overflow-wrap: break-word; word-wrap: break-word;width:100%;height:10%;hyphens: auto;">'+message_text+'</div>',
        noBackdrop: true,
        duration: duration
      });
    }

    $scope.itemChanged = function() {}
    $scope.isRecipeZero = function() {
      if (!angular.isUndefined($scope.ingList)) {
        if ($scope.ingList.length > 0) {
          if ($scope.ingList[0]['ingredientName'].toLowerCase() != "no ingredients found") {
            return false;
          }

        }
      }
      return true;

    };
    $scope.onMenuItemDetailInit = function() {
      $scope.navBarTitle.showToggleButton = false;
    }
    
    $scope.updateCost = function(){
      $scope.dataRecieved = false;
      $scope.priceCalArray =[];
      _.forEach($scope.newItems,function(item){
        $scope.priceCalArray.push({
          "recipeIngredientId":item.ingredientId,
          "recipeIngredientName":item.ingredientName,
          "recipeIngredientType":item.ingredientType,
          "measurementId":item.ingredientUnit,
          "portionSize":item.ingredientQuantity
        })
      })
      var serviceRequest ={
        "menuId":$rootScope.prepItems.prepId,
        "ingredients":$scope.priceCalArray
      }
      CommonService.getTotalCost(function(data){
         // console.log("data",data);
         toastMessage("Cost successfully updated.", 3000);
         $scope.totalingredientscost = Utils.sumOf(data.data.ingredients, "ingredientCost");
         $scope.dataRecieved = true;
      },serviceRequest)
    }
    $scope.isGroupShown = function(ingredient) {
      var group = ingredient.moddatagroup;

      if (angular.isUndefined(group)) {
        return false;
      } else {
        return group.show;
      }
    };


    $scope.toggleGroup = function(group) {
      if (!angular.isUndefined(group)) {
        group.show = !group.show;
        $ionicScrollDelegate.resize();
      }
    };
    var sumOf = function(data, key) {
      if (angular.isUndefined(data) && angular.isUndefined(key)) {
        return 0;
      } else {
        var sum = 0;
        angular.forEach(data, function(value) {
          sum = sum + value[key];
        });
        return sum;
      }
    }

    function fetchMenuItemIngredientsRH(menuitem_mods_data) {
      // console.log("menuitem_mods_data",menuitem_mods_data)
      _.forEach(menuitem_mods_data,function(item){

      })
      let matchIngId = _.findIndex($scope.ingList, function(o) {
        return o.ingredientId == $scope.selectedIngId;
      });
      if (menuitem_mods_data.length > 0) {
        //console.log(menuitem_mods_data)
        var modDataTotal = {
          'name': 'Total'
        };
        for (var i = 0; i < menuitem_mods_data.length; i++) {
          menuitem_mods_data[i]['globalModQuantity'] = parseInt(menuitem_mods_data[i]['globalModQuantity']);
        }

        var fieldNames = ['ingredientCost']
        _.forEach(fieldNames, function(fieldName) {
          // console.log(fieldName)
          modDataTotal[fieldName] = sumOf(menuitem_mods_data, fieldName);
        });

        // $scope.moddatagroup = {
        //     'show': true,
        //     'modsAvailable': true,
        //     'modData': menuitem_mods_data,
        //     'modDataTotal': modDataTotal
        // };

        $scope.ingList[matchIngId].moddatagroup = {
          'show': true,
          'modsAvailable': true,
          'modData': menuitem_mods_data,
          'modDataTotal': modDataTotal
        };
        // console.log(matchIngId)
        $ionicScrollDelegate.resize();
        $scope.$broadcast('MOP_FREE');
        // scope.togglerMessage = ' Detailed Price & Cost Info '
      } else {
        // $scope.moddatagroup = {
        //     'show': true,
        //     'modsAvailable': false,
        //     'modData': menuitem_mods_data,
        //     'modDataTotal': null
        // };
        $scope.ingList[matchIngId].moddatagroup = {
          'show': true,
          'modsAvailable': false,
          'modData': menuitem_mods_data,
          'modDataTotal': null
        };
        // scope.togglerMessage = ' Detailed Price & Cost Info not available '

      }
    }

    function fetchDetailedModsData(menuitem_id) {
      // console.log(menuitem_id);
      $scope.togglerMessage = ' Fetching Data... ';
      $scope.$broadcast('MOP_BUSY');
      MarginOptimizerServiceOne.getSelectedRecipeIngredients(fetchMenuItemIngredientsRH, menuitem_id);
    }
    $scope.getModdata = function(type) {
      // console.log(type)
      $scope.selectedIngId = type.ingredientId;
      // console.log($scope.moddatagroup);
      if (type.ingredientType === "PREP") {
        // console.log(angular.isUndefined(type.moddatagroup))
        if (angular.isUndefined(type.moddatagroup)) {
          // console.log(type)
          $scope.toggleGroup(type.moddatagroup);
        } else {
          if (!type.moddatagroup.show)
            fetchDetailedModsData(type.ingredientId)
          else
            type.moddatagroup.show = !type.moddatagroup.show;
        }
      } else {
        type.moddatagroup = {
          'show': false,
          'modsAvailable': false,
          'modData': [],
          'modDataTotal': null
        };
      }
    };


    $scope.errorReporting = function() {
      $scope.errorReportPopover.hide();
      var item = $scope.ingList;
      // console.log("item: ",item);
      ErrorReportingServiceOne.showErrorReportForm({
          'page': 'Prep Manager',
          'component': item.ingredientName,
          'modalName': $scope.errorReportPopover
        }, {
          'page': 'Prep Manager',
          'component': 'Ingredient Name'
        }) //TODO change component key to component_type in API
        .then(function(result) {
          //                                        console.log(result)
        });
    };

    $ionicPopover.fromTemplateUrl('application/error-reporting/reportPopover.html', {
        scope: $scope
      })
      .then(function(popover) {
        $scope.errorReportPopover = popover;
      });

    $scope.showReportPopover = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.errorReportPopover.show($event)
    }
    var task_modal_shown = false;
    $scope.taskCreation = function(items) {
      if (!task_modal_shown) {
        task_modal_shown = TaskCreationServiceOne.showTaskCreateForm({
          // 'page': 'Menu Performance',
          'page': 'create task',
          'component': items.ingredientName,
          'item': items,
          'name': items.ingredientName,
          'cost': items.unitCost,
          'price': items.ingredientCost,
          'type': 'ingredient',
          'portionUnit': items.ingredientUnit,
          'modalName': $scope.errorReportPopover
        }, {
          'page': 'Prep Manager',
          'component': 'Menu Recipe'
        }); //TODO change component key to component_type in API

        task_modal_shown.then(function(result) {
          // console.log(result)
          task_modal_shown = false;
        });
      }
    };
    $scope.decide = function(item) {
      $scope.taskCreation(item);
      $ionicListDelegate.closeOptionButtons();
    };
    // ******************************************************************************************

    function digits_count(n) {
      var count = 0;
      if (n >= 1) ++count;

      while (n / 10 >= 1) {
        n /= 10;
        ++count;
      }

      return count;
    }
    $scope.isExisting = false;
    $scope.shoutLoud = function(newValue, oldValue) {
      $scope.changeItem = true;
      // console.log("new",newValue,$scope.newItems,oldValue)
      _.forEach($scope.newItems,function(item,index){
        if(item.ingredientId == $scope.selectedItem.ingredientId){
          // console.log("oooo",item);
          $scope.newItems[index].ingredientName = newValue.ingredientName;
          $scope.newItems[index].ingredientType = newValue.ingredientType;
          $scope.newItems[index].ingredientId = newValue.ingredientId;
        }
          
          _.forEach($scope.oldData, function(data,ind) {
            // console.log(index,ind,data.ingredientName,item.ingredientName)
           if(data.ingredientName == item.ingredientName && index == ind){
             // console.log("item",index,ind)
             $scope.newItems[index].ingredientName =item.ingredientName;
             $scope.newItems[index].ingredientType = item.ingredientType;
             $scope.newItems[index].ingredientId = item.ingredientId;
             $scope.isExisting = true;
           }
          if (data.ingredientName == item.ingredientName && index != ind) {
             // console.log("item4",index,ind)
             if($scope.oldData.length != $scope.newItems.length){
              $scope.newItems[index].ingredientName ='';
              $scope.newItems[index].ingredientType = '';
              $scope.newItems[index].ingredientId = '';
            }else{
              $scope.newItems[index].ingredientName =$scope.oldData[index].ingredientName;
              $scope.newItems[index].ingredientType = $scope.oldData[index].ingredientType;
              $scope.newItems[index].ingredientId = $scope.oldData[index].ingredientId;
            }
            // console.log("666")
              $scope.newPrepName = true;
              $scope.prepItemSaveDisabled = true;
              toastMessage("Ingredient already exists.", 3000);
          }
        })
          if($scope.newPrepName == false){
          // item.ingredientName = newValue.ingredientName;
          // item.ingredientType = newValue.ingredientType;
          // item.ingredientId = newValue.ingredientId;
          $scope.changeName(newValue.ingredientName,index)
        }
        
      })
      
    };
    $scope.closeModel = function(value,hj,hjk){
      var selectmodal =angular.element(document.querySelectorAll('#my_recipe_ing'));
      // console.log("value",value,selectmodal.innerHTML)
    }
    $scope.setIngredient = function(ingre, type, index) {
      $scope.selectedItem = ingre;
      angular.element(document.querySelectorAll('#my_recipe_ing')).triggerHandler('click');
    }
    $scope.yieldqty = function(item){
      $scope.yieldChange = true;
      $scope.changeItem = true;
    }
    $scope.ingQtyUpdated = function(value) {
      $scope.changeItem = true;
      $scope.prepItemSaveDisabled = false;
      // console.log('ingQtyUpdated: ', value);

      // console.log(value.ingredientQuantity);
      $scope.disableSave = false;
      let noLength = digits_count(value.ingredientQuantity);
      // console.log('noLength: ',noLength);
      // console.log(value.ingredientQuantity);
      if (noLength > 4) {
        toastMessage('Portion should be minimum of four digits.');
        // $scope.prepItemDisabled = true;
      } else {
        // $scope.prepItemDisabled = false;
        let ingQty = parseFloat(value.ingredientQuantity);
        // console.log(ingQty);
        value.ingredientQuantity = (isNaN(ingQty)) ? null : parseFloat(ingQty.toFixed(4));
      }
    }

    $scope.toggleGroup = function(group) {
      if (!angular.isUndefined(group)) {
        group.show = !group.show;
        $ionicScrollDelegate.resize();
      }
    };
    var sumOf = function(data, key) {
      if (angular.isUndefined(data) && angular.isUndefined(key)) {
        return 0;
      } else {
        var sum = 0;
        angular.forEach(data, function(value) {
          sum = sum + value[key];
        });
        return sum;
      }
    }

    function fetchMenuItemIngredientsRH(menuitem_mods_data) {
      // console.log("22",menuitem_mods_data);
      let matchIngId = _.findIndex($scope.ingList, function(o) {
        return o.ingredientId == $scope.selectedIngId;
      });
      if (menuitem_mods_data.length > 0) {
        //console.log(menuitem_mods_data)
        var modDataTotal = {
          'name': 'Total'
        };
        for (var i = 0; i < menuitem_mods_data.length; i++) {
          menuitem_mods_data[i]['globalModQuantity'] = parseInt(menuitem_mods_data[i]['globalModQuantity']);
        }

        var fieldNames = ['ingredientCost']
        _.forEach(fieldNames, function(fieldName) {
          // console.log(fieldName)
          modDataTotal[fieldName] = sumOf(menuitem_mods_data, fieldName);
        });

        // $scope.moddatagroup = {
        //     'show': true,
        //     'modsAvailable': true,
        //     'modData': menuitem_mods_data,
        //     'modDataTotal': modDataTotal
        // };

        $scope.ingList[matchIngId].moddatagroup = {
          'show': true,
          'modsAvailable': true,
          'modData': menuitem_mods_data,
          'modDataTotal': modDataTotal
        };
        // console.log(matchIngId)
        $ionicScrollDelegate.resize();
        $scope.$broadcast('MOP_FREE');
        // scope.togglerMessage = ' Detailed Price & Cost Info '
      } else {
        // $scope.moddatagroup = {
        //     'show': true,
        //     'modsAvailable': false,
        //     'modData': menuitem_mods_data,
        //     'modDataTotal': null
        // };
        $scope.ingList[matchIngId].moddatagroup = {
          'show': true,
          'modsAvailable': false,
          'modData': menuitem_mods_data,
          'modDataTotal': null
        };
        // scope.togglerMessage = ' Detailed Price & Cost Info not available '

      }
      _.forEach($scope.ingList,function(item){
        if(item.moddatagroup.modData.length != 0){
          _.forEach(item.moddatagroup.modData,function(mod){
            $scope.ingItemIdList.push(mod.ingredientId)
          })
        }
      })
      // console.log("calledff",$scope.ingList)
      $scope.fetchSupplier();
    }

    function fetchDetailedModsData(menuitem_id) {
      // console.log(menuitem_id);
      $scope.togglerMessage = ' Fetching Data... ';
      $scope.$broadcast('MOP_BUSY');
      MarginOptimizerServiceOne.getSelectedRecipeIngredients(fetchMenuItemIngredientsRH, menuitem_id);
    }
    $scope.getModdata = function(type) {
      // console.log(type)
      $scope.selectedIngId = type.ingredientId;
      // console.log($scope.moddatagroup);
      if (type.ingredientType === "PREP") {
        // console.log(angular.isUndefined(type.moddatagroup))
        if (angular.isUndefined(type.moddatagroup)) {
          // console.log(type)
          $scope.toggleGroup(type.moddatagroup);
        } else {
          if (!type.moddatagroup.show)
            fetchDetailedModsData(type.ingredientId)
          else
            type.moddatagroup.show = !type.moddatagroup.show;
        }
      } else {
        type.moddatagroup = {
          'show': false,
          'modsAvailable': false,
          'modData': [],
          'modDataTotal': null
        };
      }
    };
    $scope.errorReporting = function() {
      $scope.errorReportPopover.hide();
      var item = $scope.ingList;
      // console.log("item: ",item);
      ErrorReportingServiceOne.showErrorReportForm({
          'page': 'Prep Manager',
          'component': item.ingredientName,
          'modalName': $scope.errorReportPopover
        }, {
          'page': 'Prep Manager',
          'component': 'Ingredient Name'
        }) //TODO change component key to component_type in API
        .then(function(result) {
          //                                        console.log(result)
        });
    };

    $ionicPopover.fromTemplateUrl('application/error-reporting/reportPopover.html', {
        scope: $scope
      })
      .then(function(popover) {
        $scope.errorReportPopover = popover;
      });

    $scope.showReportPopover = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.errorReportPopover.show($event)
    }
    var task_modal_shown = false;
    $scope.taskCreation = function(items) {
      if (!task_modal_shown) {
        task_modal_shown = TaskCreationServiceOne.showTaskCreateForm({
          // 'page': 'Menu Performance',
          'page': 'create task',
          'component': items.ingredientName,
          'item': items,
          'name': items.ingredientName,
          'cost': items.unitCost,
          'price': items.ingredientCost,
          'type': 'ingredient',
          'portionUnit': items.ingredientUnit,
          'modalName': $scope.errorReportPopover
        }, {
          'page': 'Prep Manager',
          'component': 'Menu Recipe'
        }); //TODO change component key to component_type in API

        task_modal_shown.then(function(result) {
          // console.log(result)
          task_modal_shown = false;
        });
      }
    };
    $scope.decide = function(item) {
      $scope.taskCreation(item);
      $ionicListDelegate.closeOptionButtons();
    };

    $scope.refreshScreenPrep = function() {
      $scope.gotList = false;
      $scope.dataRecieved = false; 
      $scope.costRecieved = false;
      CommonService.refreshScreenApi(fetchIngredientsRHW,$scope.recipeid,$rootScope.prepItems.prepId)
    }
    // ******************************************************************************************


  };
  projectCostByte.directive('customDropDown', ['$ionicModal', '$ionicGesture', '$timeout', '$rootScope', 'inventoryService', function($ionicModal, $ionicGesture, $timeout, $rootScope, inventoryService) {
    return {
      restrict: 'E',
      scope: {
        options: "=",
        optionSelected: "="
        // list: "="
      },
      controller: function($scope, $element, $attrs) {
        $scope.searchSelect = {
          title: $attrs.title || "Search",
          // keyProperty: $attrs.keyProperty,
          // valueProperty: $attrs.valueProperty,
          templateUrl: $attrs.templateUrl || 'application/core/shared-components/common/directive/customDropDown.html',
          animation: $attrs.animation || 'slide-in-up',
          option: null,
          // searchvalue: "",
          // enableSearch: $attrs.enableSearch ? $attrs.enableSearch == "true" : true
        };
        $scope.data = {
          "searchValue": ""
        }
        $scope.searchCat = "";
        $ionicGesture.on('tap', function(e) {
          // if(!!$scope.searchSelect.keyProperty && !!$scope.searchSelect.valueProperty){
          //   if ($scope.optionSelected) {
          //     $scope.searchSelect.option = $scope.optionSelected[$scope.searchSelect.keyProperty];
          //   }
          // }
          // else{
          //   $scope.searchSelect.option = $scope.optionSelected;
          // }
          $scope.OpenModalFromTemplate($scope.searchSelect.templateUrl);
        }, $element);
        // $scope.setSelected = [];
        $scope.saveOption = function(newValue) {
          // console.log('saveOption', newValue);
          $rootScope.my_current_selected = {}
          //
          // $rootScope.$broadcast('setSelectedVal',newValue);

          // var CatValue=newValue.split("::");
          $rootScope.selectedUnit = newValue;
          $rootScope.unit_current_selected.measurement_unit = newValue;
          // $rootScope.my_current_selected.measurement_unit = newValue;
          // inventoryService.setPnlMapSelected($rootScope.current_selected)
          $scope.searchSelect.searchvalue = "";
          $scope.modal.remove();
        };



        $scope.clearSearch = function() {
          console.log('clearSearch......');
          $scope.data.searchValue = "";
          // $scope.searchSelect.searchvalue = "";
        };

        $scope.closeModal = function() {
          $scope.data.searchValue = "";
          $scope.modal.remove();
        };
        $scope.$on('$destroy', function() {
          if ($scope.modal) {
            $scope.modal.remove();
          }
        });
        $scope.$watch('data.searchValue', function(newVal) {
          // console.log('searchValue items....',newVal);
          $scope.searchCat = newVal;
        }, true);

        $scope.OpenModalFromTemplate = function(templateUrl) {
          $ionicModal.fromTemplateUrl(templateUrl, {
            scope: $scope,
            animation: $scope.searchSelect.animation
          }).then(function(modal) {
            $scope.modal = modal;
            $scope.modal.show();
          });
        };
      }
    };
  }]);


})();
