(function() {
  var inventoryItemsCtrl = function($scope, $state,$rootScope,$timeout,$ionicModal,CommonService,$ionicPopover,ErrorReportingServiceOne,$ionicLoading,appModalService,$ionicListDelegate,inventoryService,$ionicFilterBar,$ionicScrollDelegate,$ionicNavBarDelegate) {


    $scope.navBarTitle.showToggleButton = false;
    $scope.showItemsLoading = false;

    // $scope.$on('$ionicView.beforeLeave', function(e) {
    //   console.log(' beforeLeave.......')
    //     $ionicNavBarDelegate.showBar(true);
    //     // $ionicNavBarDelegate.showBackButton(true);
    // });
    // $scope.$on('$ionicView.afterLeave', function(e) {
    //   console.log(' afterLeave.......')
    //     $ionicNavBarDelegate.showBar(false);
    // });

    // console.log('********',inventoryService.getCatItems());
    console.log(inventoryService.getMode())
    $scope.newcategoryData = inventoryService.getCatItems();
    $scope.updatedItems = $scope.newcategoryData.ingredients;
    $scope.inventoryName = inventoryService.getSelectedInv();
    $scope.mode = inventoryService.getMode();
    $scope.filterView = inventoryService.getFilterView();
    $scope.saveStatus = inventoryService.getStatusMsg();
    // console.log($scope.saveStatus);
    // console.log($scope.newcategoryData.name);
    // console.log($scope.newcategoryData.ingredients);
    $timeout(function(){
      $scope.showItemsLoading = true;
    },1000);
    $scope.checkName = false;
    if($scope.newcategoryData.name == "Items without inventory" || $scope.newcategoryData.name == "Items above Par value" || $scope.newcategoryData.name == "Items ready for ordering")
      $scope.checkName = true;
    var isParGrouping = false;
    var saveOnValidationFail = true;

     $scope.rowSize = {
                    name: 30,
                    price: 17,
                    qty: 12,
                    units: 14,
                    value: 18,
                }




    $scope.$on('BUSY', function (event) {
        $scope.spinnerShow = true;
    });

    $scope.$on('FREE', function (event) {
        $scope.spinnerShow = false;
    });

    var toTitleCase = function(str) {
        return str.replace(/\w\S*/g, function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    }

    _.forEach($scope.newcategoryData.ingredients, function(nodeData) {
        nodeData.ingredient_price_display = nodeData.ingredient_price;
        if (nodeData.ingredient_price_display <0){
            nodeData.ingredient_price_display =0;
        }


        nodeData.quantityValidationPassed = true;
        console.log(nodeData.quantity);
        nodeData.calculated_price = (nodeData.quantity && nodeData.ingredient_price) ? parseFloat(nodeData.quantity * nodeData.ingredient_price).toFixed(2) : 0 ;
        nodeData.stageQuantity = parseFloat(nodeData.quantity).toFixed(2);
        $scope.validationPassedHighlight = "";
        // $scope.supplier_item_updated_at = new Date(parseInt(nodeData.date, 10) * 1000).toLocaleDateString("en-US");
        nodeData.supplier_item_updated_at_items = new Date(nodeData.date*1000).formatForPeprInventory();
        nodeData.supplier_item_updated_at_items = moment(nodeData.supplier_item_updated_at_items).format("MM/DD/YYYY");
        $scope.supplier_name = toTitleCase(nodeData.supplier_name);
        // console.log($scope.supplier_name);
    });



    $scope.setFocusToInput = function(item) {
        return $timeout(function() {
            item.selectedBackGround = "inventory-item-selected";
            $timeout(function(){
              $scope.$broadcast('item-selected', item.inventory_item_id)
            });

        }, 0)
    }

    // _.forEach($scope.newcategoryData, function(nodeData) {
    //     nodeData.ingredient_price_display = nodeData.ingredient_price;
    //     nodeData.quantityValidationPassed = true;
    //     if (nodeData.ingredient_price_display <0){
    //         nodeData.ingredient_price_display =0;
    //     }
    //     nodeData.stageQuantity = nodeData.quantity;
    //
    // });


    function fetchItemSummary(invDetails) {
        $scope.$broadcast('BUSY');
        var invInfo = {}
        invInfo.invItemId = invDetails.inventory_item_id;
        invInfo.draftId = invDetails.draft_id;
        $scope.spinnerHide = true;
        var getMeasurementCallback = function(data) {
          // console.log("anirudh data : ",data);
          if(data.data.item_summary){
            $scope.$broadcast('FREE');
            $scope.dataReceived = true;
              $scope.invItemName = data.data.item_summary.inventory_name;
              $scope.price = data.data.item_summary.price;
              $scope.unit = data.data.item_summary.unit;
              $scope.totalQuantity = data.data.item_summary.total.total_quantity;
              $scope.totalValue = data.data.item_summary.total.total_value;
              $scope.categories = data.data.item_summary.categories;
               // console.log("categories");
               // console.log($scope.categories);
           }else{
            $scope.$broadcast('FREE');
            $scope.dataReceivederr=true
            $scope.dataReceived = false;

           }
        };
        // console.log('summ details');
        // console.log(invInfo);
        CommonService.getItemSummary(getMeasurementCallback, invInfo);
    }
    var toastMessage = function(message_text, duration) {
      if (typeof duration === 'undefined') duration = 1500;
      $ionicLoading.show({
        template: message_text,
        noBackdrop: true,
        duration: duration,
      });
    };

    $scope.showItemSummary=function(item) {
        $scope.$broadcast('BUSY');
        $scope.dataReceivederr=false;
        console.log("node data");
        console.log(item);
       // console.log("parameters",parameters);
        $ionicModal.fromTemplateUrl('application/item-summary/itemSummaryPopover.html', {
          scope: $scope,
          animation: 'slide-in-up',
          backdropClickToClose: false
        }).then(function(modal) {
          $scope.itemSummaryModal = modal;

          // console.log('in then');
          // console.log(item.nodeData);
          // console.log('modal');
          // console.log(modal);
          fetchItemSummary(item);
          $scope.itemSummaryModal.show();
          //ionicSlideBoxDelegate.enableSlide(false);
        });
    }
    $scope.closeItemSummaryModal = function(model) {
      console.log('closeUnitPopup2Modal')
      $scope.locationAccepted = true;
      $scope.itemSummaryModal.hide();
    };



    var testQuantity = function(quantityVal) {
        if (_.isNull(quantityVal)) {
            return true;
        }
        return /^[0-9.]+$/.test(quantityVal);
    }

    var quantityValidated = function(nodeData) {
        console.log(nodeData.stageQuantity)
        var validationStatus = testQuantity(nodeData.stageQuantity)
        var wasFailedFlag = !nodeData.quantityValidationPassed
        console.log(validationStatus)
        nodeData.quantityValidationPassed = validationStatus;


        if (!validationStatus) {
            //                        console.log("failed validation")
            $timeout(function() {
                $scope.newcategoryData.validationPassedHighlight = 'validation-failed-highlight';
            }, 0)

        } else {
            console.log("passed validation")
            // $scope.newcategoryData.nodeData.quantity = $scope.newcategoryData.nodeData.stageQuantity;

            if (isNaN(nodeData.quantity)) {
                nodeData.quantity_to_par_group = "Items without inventory"
            }else{
                nodeData.quantity_to_par_group = nodeData.quantity > nodeData.par ? 'Items above Par value' : 'Items ready for ordering';
            }
            if (!isParGrouping && (nodeData.quantity < nodeData.par)) {
                $timeout(function() {
                    $scope.newcategoryData.parValueHighlight = 'highlight-quantity';
                }, 0)
            } else {
                $timeout(function() {
                    $scope.newcategoryData.parValueHighlight = '';
                }, 0)
            }

            if (wasFailedFlag) {
                $timeout(function() {
                    $scope.newcategoryData.validationPassedHighlight = "validation-pass-green";
                }, 0)
                $timeout(function() {
                    $scope.newcategoryData.validationPassedHighlight = "";
                }, 1000)
            }
        }
        return validationStatus;
    }

    $scope.valueUpdated = function(reqConfig,item) {
        let value = parseFloat(item.stageQuantity);
        item.stageQuantity = (isNaN(value)) ? null : parseFloat(value.toFixed(2))
        item.quantity = (isNaN(value)) ? null : parseFloat(value.toFixed(2));
        item.calculated_price = parseFloat(item.quantity * item.ingredient_price).toFixed(2);
        // console.log(item);
        // console.log(item.stageQuantity,item.quantity);
        if (angular.isDefined(reqConfig.makeServerRequest)) {
            quantityValidated(item);
        }
        if (saveOnValidationFail) {
            // controllers[0].updateCategoryValue(reqConfig); inventoryService.getCatItems()
            $rootScope.$emit('category-value-updated',reqConfig,inventoryService.getCatItems().name);
        }
    };
    $scope.qtyUpdated = function(reqConfig,item,convertedQty) {
        let value = parseFloat(convertedQty);
        item.stageQuantity = (isNaN(value)) ? null : parseFloat(value.toFixed(2))
        item.quantity = (isNaN(value)) ? null : parseFloat(value.toFixed(2))
        console.log(item.stageQuantity,item.quantity);
        if (angular.isDefined(reqConfig.makeServerRequest)) {
            quantityValidated(item);
        }
        if (saveOnValidationFail) {
            // controllers[0].updateCategoryValue(reqConfig);
            $rootScope.$emit('category-value-updated',reqConfig,inventoryService.getCatItems().name);
        }
    };


      var error_modal_shown = false;
      $scope.errorReporting = function() {
          $scope.errorReportPopover.hide();
          var item = $scope.selectedItemReport;
          if (!error_modal_shown) {
              error_modal_shown = ErrorReportingServiceOne.showErrorReportForm({
                  'page': 'Inventory',
                  'component': item.ingredient_alias_name,
                  'modalName' : $scope.errorReportPopover
              }, {
                  'page': 'Inventory',
                  'component': 'Ingredient Name'
              }) //TODO change component key to component_type in API

              error_modal_shown.then(function (result) {
                      //                                        console.log(result)
                      error_modal_shown = false;
              });
          }
      }



      $ionicPopover.fromTemplateUrl('application/error-reporting/reportPopover.html', {
              scope: $scope
          })
          .then(function(popover) {
              $scope.errorReportPopover = popover;
          });

      $scope.showReportPopover = function($event,item) {
          $scope.selectedItemReport = item;
          $event.preventDefault();
          $event.stopPropagation();
          $scope.errorReportPopover.show($event)
      }

      // $scope.editConfig = function(item){
      //   $rootScope.$emit('edit-configuration',item);
      // }

      var modal_shown = false;
      var showConfigModal = function (item) {
          console.log("modal item : ", item);
          if (!modal_shown) {
              modal_shown = appModalService.show('application/inventory-management/directives/config-modifier/inventory-config-modifier.html', 'configModifierCtrl', item)
              // modal_shown = appModalService.show('inventoryConfigModifierTemplate', 'configModifierCtrl', item)
          }
          return modal_shown
      };


      $scope.editConfig = function (item, focusItem) {
        // console.log('editttt configggg----',item);
          item.selectedBackGround = "inventory-item-selected";
          // $timeout(function(){
            $scope.$broadcast('item-selected', item.inventory_item_id)

          // });
          item.focusItem = focusItem;
//
          var newObj = {
              'single': $scope.newcategoryData.ingredients,
              'all': inventoryService.getAllCatData()
          }
          var modalClose = showConfigModal(newObj);

          $timeout($ionicListDelegate.closeOptionButtons());
          modalClose.then(function (response) {
              modal_shown = false;
              if (response.config_saved) {

                  let new_config = response.new_config;
                  $timeout(function() {
                    checkStatusOptionAndShowToastMsg(new_config)
                  })
                    item.ingredient_alias_name = new_config.supplierItemAliasName;
                    item.par = new_config.par;
                    item.ingredient_category = new_config.ingredientInventoryCategory;
                    item.quantity_units_id = new_config.inventoryMeasurementId;
                    item.quantity_units = new_config.measurementName;
                    item.ingredient_price = new_config.inventoryMeasurementUnitPrice;
                    item.ingredient_price_display = new_config.inventoryMeasurementUnitPrice;
                    item.quantity = item.quantity * new_config.computedConversionFactor;
                    item.stageQuantity = item.quantity.toFixed(2);
                    // item.active = new_config.active;
                    console.log(item.stageQuantity);
                    if(new_config.ingredientStatus == "inactive"){
                        item.active = (new_config.active == true || new_config.active == undefined) ? true : false;
                        item.ingredient_status = "inactive";
                    }
                  // $rootScope.$emit('NEWSUPPLIERITEMCONFIGUPDATED', response.new_config)
                  $rootScope.$broadcast('new-product-ingredient-updated', {
                    config: {
                      makeServerRequest: true
                    }
                  })
              }
          })
      };


      var checkStatusOptionAndShowToastMsg = function(new_config) {
        // console.log(new_config)
        if (_.has(new_config, ['ingredientStatus'])) {
          let selected_status_option = _.get(new_config, ['ingredientStatus']);
          // console.log(selected_status_option)
          if (selected_status_option === 'inactive') {
            //                    //console.log(_.get(new_config, [ 'globalIngredientName'])+" will be removed from the next inventory.")
            // var changed_names = _.chain(changed_items)
            //   .map('ingredient_alias_name')
            //   .uniq()
            //   .join(', ')
            //   .value();
            // // //console.log(changed_items);
            // if (_.some(changed_items, function(changed_item) {
            //     return changed_item.quantity !== null;
            //   })) {
            //   toastMessage(changed_names + " shall be removed from the next inventory", 3000)
            // } else {
              toastMessage(new_config.supplierItemAliasName + " shall be removed from current and future inventory", 3000)
            // }


          }


        }

      }
      //

      var showAddQuantityModal = function (item) {
          if (!modal_shown) {
              // modal_shown = appModalService.show('inventoryAddQuantityTemplate', 'inventoryAddQuantityCtrl', item)
              modal_shown = appModalService.show('application/inventory-management/directives/add-quantity/add-quantity.html', 'inventoryAddQuantityCtrl', item)
          }
          return modal_shown
      };

      $scope.addQuantity = function (item) {
          console.log('addQuantity*********',item)
          item.selectedBackGround = "inventory-item-selected";
          // $timeout(function(){
            $scope.$broadcast('item-selected', item.inventory_item_id)
          // });
          var itemCopy = angular.copy(item);
          var modalClose = showAddQuantityModal(item);
          $timeout($ionicListDelegate.closeOptionButtons());
          modalClose.then(function (response) {
              modal_shown = false;
              console.log("response : ", response, itemCopy);
              if (response.quantity_added) {
                  if (angular.isDefined(itemCopy.stageQuantity)) {
                      itemCopy.stageQuantity = parseFloat(item.stageQuantity) + parseFloat(response.new_quantity.convertedAddedQuantity);
                  } else {
                      itemCopy.stageQuantity = response.new_quantity.convertedAddedQuantity;
                  }
                  // console.log(response.new_quantity,item);
                  // // scope.$broadcast('INVENTORYQUANTITYADDED', response.new_quantity,item)
                  // console.log((isNaN(item.stageQuantity) || item.stageQuantity == null || item.stageQuantity === ''));

                  let qtyToAdd = parseFloat((isNaN(item.stageQuantity) || item.stageQuantity == null || item.stageQuantity === '') ? 0 : (parseFloat(item.stageQuantity).toFixed(2)));
                  // console.log(qtyToAdd)
                  // console.log('saving to server',response.new_quantity.convertedAddedQuantity,qtyToAdd)

                  response.new_quantity.convertedAddedQuantity += qtyToAdd;
                  console.log(response.new_quantity.convertedAddedQuantity);
                  $scope.qtyUpdated({ makeServerRequest: true },item,response.new_quantity.convertedAddedQuantity)
              }

          })

      };

      var showEditPriceModal = function (item) {
          console.log("insdie edit price " + modal_shown);
          // console.log(item);
          if (!modal_shown) {
              // modal_shown = appModalService.show('inventoryChangePriceTemplate', 'inventoryChangePriceCtrl', item)
              console.log("showing edit price modal");
              modal_shown = appModalService.show('application/inventory-management/directives/change-price/change-price.html', 'inventoryChangePriceCtrl', item)
          }
          return modal_shown
      }

      $scope.editUnitPrice = function (item,reqConfig) {
          item.selectedBackGround = "inventory-item-selected";
          // $timeout(function(){
            $rootScope.$broadcast('item-selected', item.inventory_item_id)
          // });
          console.log("showing edit price modal");
          var modalClose = showEditPriceModal(item);
          modalClose.then(function (response) {
              modal_shown = false;
              // console.log(response);
              if (response.unitprice_changed) {
                  // console.log(item);
                  // $scope.$emit('INVENTORYUNITPRICECHANGED', response.new_price)
                  // console.log(response.new_price);
                  $timeout(function() {
                    checkStatusOptionAndShowToastMsg(response.new_price)
                  })

                  item.ingredient_price = response.new_price.ingredient_price;
                  item.ingredient_price_display = response.new_price.ingredient_price;
                  // this.updateCategoryValue(reqConfig);
                  $rootScope.$emit('category-value-updated',reqConfig,inventoryService.getCatItems().name);
              }
          })
      };

      $scope.showEditConfigPrice = function(reqConfig,item){
        if($scope.mode == 'edit'){
            // var item = controllers[1].nodeData;
            $scope.editUnitPrice(item,reqConfig, 'unitPrice')
        }
      }

      var showEditUnitsModal = function (item) {
          console.log("insdie units " + modal_shown);
          console.log(item);
          if (!modal_shown) {
              // modal_shown = appModalService.show('inventoryChangePriceTemplate', 'inventoryChangePriceCtrl', item)
              console.log("showing edit price modal");
              modal_shown = appModalService.show('application/inventory-management/directives/change-units/change-units.html', 'inventoryChangeUnitsCtrl', item)
          }
          return modal_shown
      }

      $scope.editUnits = function (item,focusItem) {
          item.selectedBackGround = "inventory-item-selected";
          // $timeout(function(){
            $rootScope.$broadcast('item-selected', item.inventory_item_id)
          // });
          // item.focusItem = focusItem;

          var newObj = {
              'single': $scope.newcategoryData.ingredients,
              'all': inventoryService.getAllCatData()
          }
          var modalClose = showEditUnitsModal(newObj);
          $timeout($ionicListDelegate.closeOptionButtons());
          modalClose.then(function (response) {
            // console.log(response);
              modal_shown = false;
              if(response.data){
                // console.log(item.stageQuantity,response.data.computedConversionFactor);
                item.quantity = parseFloat((item.stageQuantity * response.data.computedConversionFactor).toFixed(2));
                // console.log(item.quantity);
                item.stageQuantity = item.quantity;
                item.ingredient_price_display = response.data.inventoryMeasurementUnitPrice;
                item.calculated_price = (item.quantity && item.ingredient_price) ? parseFloat(item.quantity * item.ingredient_price).toFixed(2) : 0;
                // console.log(item);
              }

          })
      };

      $scope.showEditUnits = function(reqConfig,item){
          if($scope.mode == 'edit'){
              // var item = controllers[1].nodeData;
              $scope.editUnits(item,reqConfig, 'measurementUnit')
          }

      }


      $scope.showFilterBar = function() {
        console.log('**** items....showFilterBar ****');
        //console.log("that.item in filter : ", that.items);
        var search_fields = ['ingredient_alias_name', 'ingredient_category', 'ingredient_name', 'supplier_name', 'location'];

        filterBarInstance = $ionicFilterBar.show({
          items: $scope.updatedItems,
          debounce: true,
          update: function(filteredItems, filterText) {
            if (angular.isDefined(filterText) && filterText.length > 0) {
              _.forEach(filteredItems, function(inventoryGroup) {
                _.forEach(inventoryGroup.ingredients, function(ingredient) {
                  var keepIngredient = false;
                  _.forEach(search_fields, function(search_field) {
                    var textToSearch = _.get(ingredient, search_field, "");
                    if (textToSearch != "") {
                      if (textToSearch.toLowerCase().indexOf(filterText.toLowerCase()) != -1) {
                        keepIngredient = true
                      }
                    }
                    if (keepIngredient) {
                      ingredient.searchHidden = false;
                    } else {
                      ingredient.searchHidden = true;
                    }
                  })
                })

              })
              //console.log(filteredItems)
              $scope.newcategoryData.ingredients = filteredItems
              console.log('********');
              // $window.scrollTo(0, 0);
              // $window.scrollTo(0, angular.element(document.querySelector( '.item' ) ).offsetTop);
              $ionicScrollDelegate.scrollTop();
            } else {
              $scope.newcategoryData.ingredients = $scope.updatedItems;
              // if (removeSearchStatus) {
              //   removeSearchStatus = false;
              //   return
              // }
              _.forEach(filteredItems, function(inventoryGroup) {
                _.forEach(inventoryGroup.ingredients, function(ingredient) {
                  ingredient.searchHidden = false;

                })
              })
            }
          },
          cancel: function() {
            $scope.newcategoryData.ingredients = $scope.updatedItems;
          }
        });
      };

      $scope.$on('item-selected', function(event,itemId) {
        _.each($scope.newcategoryData.ingredients, function(ingredient){
            if(ingredient.inventory_item_id !== itemId){
                ingredient.selectedBackGround = "";
            }
        })
      });




      $scope.$on('GROUPBYPARVALUE', function(event) {
          //                         controllers[1].mode = 'view';
          isParGrouping = true
      })
      $scope.$on('NOTGROUPBYPARVALUE', function(event) {

          //                     console.log('not group by par caught in prd item drct')
          //                         controllers[1].mode = 'edit';
          isParGrouping = false
      })
      $rootScope.$on('LASTSAVEDSTATUS', function(event,data) {
        // console.log('LASTSAVEDSTATUS: ',data);
        $scope.saveStatus = data;
      });




    // *********************************************************************









    // ********************************************************************




  };

  inventoryItemsCtrl.$inject = ['$scope', '$state','$rootScope','$timeout','$ionicModal','CommonService','$ionicPopover','ErrorReportingServiceOne','$ionicLoading','appModalService','$ionicListDelegate','inventoryService','$ionicFilterBar','$ionicScrollDelegate','$ionicNavBarDelegate'];
  projectCostByte.controller('inventoryItemsCtrl', inventoryItemsCtrl);



})();
