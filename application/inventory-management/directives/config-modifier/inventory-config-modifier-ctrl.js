(function() {
  projectCostByte.controller('configModifierCtrl', configModifierCtrl);

  configModifierCtrl.$inject = ['$q', '$scope', '$state', '$stateParams', '$timeout', 'inventoryItemsSvc', '$rootScope', 'parameters', 'CommonService', '$ionicPopup', '$ionicSlideBoxDelegate', '$ionicLoading', '$ionicModal'];

  function configModifierCtrl($q, $scope, $state, $stateParams, $timeout, inventoryItemsSvc, $rootScope, parameters, CommonService, $ionicPopup, $ionicSlideBoxDelegate, $ionicLoading, $ionicModal) {
    $scope.selectUnit = true;
    $scope.dataReceived = false;
    // $scope.openModal();
    // console.log('enter configModifierCtrl');
    // console.log("parameters",parameters);
    $scope.configSliders = {};
    $scope.showPlus = false;
    $scope.unitPriceChange = function(item) {
      console.log(item.inventoryMeasurementUnitPriceStage);
      if (item.inventoryMeasurementUnitPriceStage == null) {
        toastMessage("Price should not be empty", 2000);
        $scope.saveButtonColor = 'app_theme_disabled_color';
        $scope.saveRestrict = true;
      } else if (item.inventoryMeasurementUnitPriceStage == 0) {
        toastMessage("price should not be zero", 2000);
        $scope.saveButtonColor = 'app_theme_disabled_color';
        $scope.saveRestrict = true;
      } else {
        $scope.saveButtonColor = 'app-theme-color-transparent';
        $scope.saveRestrict = false;
        item.inventoryMeasurementUnitPriceStage = parseFloat(item.inventoryMeasurementUnitPriceStage.toFixed(2));
      }
      console.log("item", item.inventoryMeasurementUnitPriceStage)
    }
    $scope.$on('config-units-changed', function(event, dataIndex) {
      let oldUnit = _.find($scope.unitsOptions, ['measurementId', $scope.configModifierItem.inventoryMeasurementId]);

      let newUnit = $scope.unitsOptions[dataIndex]

      if (angular.isDefined(oldUnit)) {

        $scope.unitConversionText = _.round(oldUnit.conversionFactor, 2) + oldUnit.measurementName +
          " = " + _.round(newUnit.conversionFactor, 2) + newUnit.measurementName;

        if (newUnit.measurementId === oldUnit.measurementId) {
          $scope.unitConversionText = null;
        }

        $scope.configModifierItem.inventoryMeasurementIdStage = newUnit.measurementId
        $scope.configModifierItem.measurementNameStage = newUnit.measurementName
        $scope.configModifierItem.computedConversionFactorStage = newUnit.conversionFactor / oldUnit.conversionFactor
        $scope.configModifierItem.inventoryMeasurementUnitPriceStage = $scope.configModifierItem.inventoryMeasurementUnitPrice / $scope.configModifierItem.computedConversionFactorStage
        $scope.configModifierItem.inventoryMeasurementUnitPriceStage = Math.round($scope.configModifierItem.inventoryMeasurementUnitPriceStage * 100) / 100
        $scope.configModifierItem.parStage = $scope.configModifierItem.par * $scope.configModifierItem.computedConversionFactorStage


        // $scope.configModifierItem.inventoryMeasurementUnitPrice = $scope.configModifierItem.inventoryMeasurementUnitPriceStage;
        // $scope.configModifierItem.par =  $scope.configModifierItem.parStage;


      } else {
        $scope.unitConversionText = "Current unit error";
      }


    })



    $scope.$on('config-category-changed', function(event, dataIndex) {
      $scope.configModifierItem.ingredientInventoryCategory = $scope.categoryOptions[dataIndex].label
    })


    $scope.saveButtonText = 'Save Configuration';
    $scope.saveButtonColor = 'app-theme-color';

    $scope.selectedOrDummy = function(unitOption) {
      let buttonStyle = '';



      // if (unitOption.measurementName === 'dummyButton'){
      //     buttonStyle = buttonStyle + 'button-clear ';
      //
      // }else{
      buttonStyle = buttonStyle + 'button-bal ';
      if (!unitOption.selected) {
        buttonStyle = buttonStyle + 'button-out ';
      }
      // }
      //
      // console.log(unitOption)
      // console.log(buttonStyle)
      return buttonStyle;
    }

    var setIngredient = function(controllerData) {
      var selectedIngredient = {};
      _.each(controllerData, function(ingredient) {
        if (ingredient.selectedBackGround != "") {
          selectedIngredient = ingredient;
        }
      })
      // selectedIngredient = parameters;
      // console.log(selectedIngredient)
      $scope.item_supplier_id = selectedIngredient.supplier_id;
      inventoryItemsSvc.getsupplierItemConfig(selectedIngredient.supplier_id, selectedIngredient.supplier_item_id, selectedIngredient.inventory_item_id, selectedIngredient.ingredient_category)
        .then(function(supplierItemCurrentConfigResponse) {

          $scope.locationOptions = supplierItemCurrentConfigResponse.location_options;
          $scope.categoryOptions = supplierItemCurrentConfigResponse.category_options;
          // console.log(supplierItemCurrentConfigResponse.supplier_item)
          $scope.oldCat = supplierItemCurrentConfigResponse.supplier_item.ingredientInventoryCategory;
          $scope.oldIngName = supplierItemCurrentConfigResponse.supplier_item.supplierItemAliasName;
          _.forEach($scope.categoryOptions, function(item) {
            if (item.selected === true) {
              $scope.selectedCategory = item.key;

            }
          })
          // console.log("categoryOptions : ", $scope.categoryOptions);
          let customCategoryOption = _.find($scope.categoryOptions, ['label', 'Custom']);
          if (customCategoryOption)
            customCategoryOption.template = '<input class="inventory-config-input" type="text" ng-model="customField.category">'

          $scope.statusOptions = supplierItemCurrentConfigResponse.status_options;

          // console.log(supplierItemCurrentConfigResponse.units_options)
          $scope.setUnitOptions = []
          _.forEach(supplierItemCurrentConfigResponse.units_options.units, function(eachUnits) {
            var checkUnit = _.find($scope.setUnitOptions, function(obj) {
              return obj.measurementName == eachUnits.measurementName;
            });

            if (!checkUnit) {
              $scope.setUnitOptions.push(eachUnits)
            }
          });
          // $scope.unitsOptions = supplierItemCurrentConfigResponse.units_options.units;
          $scope.unitsOptions = $scope.setUnitOptions;

          $scope.unitsOptions = _.sortBy($scope.unitsOptions, function(unitOption) {
            return unitOption.conversionFactor * -1;
          })

          $scope.configSliders.unitSlider = _.findIndex($scope.unitsOptions, ['measurementId',
            supplierItemCurrentConfigResponse.supplier_item.inventoryMeasurementId
          ]);


          let oldUnit = _.find($scope.unitsOptions, ['measurementId', supplierItemCurrentConfigResponse.supplier_item.inventoryMeasurementId]);

          _.each($scope.unitsOptions, function(unitOption) {
            unitOption.label = unitOption.measurementName;
            unitOption.selected = false;
            if (angular.isDefined(oldUnit)) {
              if (oldUnit.measurementId !== unitOption.measurementId) {
                unitOption.unitConversionText = _.round(oldUnit.conversionFactor, 2) + '\u202F' + oldUnit.measurementName +
                  " = " + _.round(unitOption.conversionFactor, 2) + '\u202F' + unitOption.measurementName;
              } else {
                unitOption.unitConversionText = "  -  "
              }
            }
          });
          if ($scope.configSliders.unitSlider >= 0) {
            // console.log("Selected Unit: " + $scope.unitsOptions[$scope.configSliders.unitSlider].measurementName)
            $scope.unitsOptions[$scope.configSliders.unitSlider].selected = true;
          } // set the current unit that  the supplier item uses



          let chunkLength = 2;
          if ($scope.unitsOptions.length > 4) {
            chunkLength = 3;
          }
          $scope.unitOptionsChunks = _.chunk($scope.unitsOptions, chunkLength);
          // _.each(_.times(
          //     chunkLength - $scope.unitOptionsChunks[$scope.unitOptionsChunks.length-1].length, String),
          // function(index){
          //     $scope.unitOptionsChunks[$scope.unitOptionsChunks.length-1].push({
          //         measurementName: 'dummyButton',
          //         selected: false,
          //         label :"  ",
          //         unitConversionText: "   "
          //     })
          // });

          // _.each($scope.unitsOptions, function(unitOption){
          //     unitOption.buttonStyle = selectedOrDummy(unitOption)
          // })

          // set the current category of the supplier item
          $scope.configSliders.categorySlider = _.findIndex($scope.categoryOptions, ['label',
            supplierItemCurrentConfigResponse.supplier_item.ingredientInventoryCategory
          ]);
          // console.log('$scope.configSliders.categorySlider: ',$scope.configSliders.categorySlider);
          // set supplier item as the configuration item
          $scope.configModifierItem = angular.copy(supplierItemCurrentConfigResponse.supplier_item);

          if (angular.isUndefined($scope.configModifierItem.ingredientInventoryLocationIds)) {
            $scope.configModifierItem.ingredientInventoryLocationIds = [];
          }
          if (angular.isUndefined($scope.configModifierItem.ingredientInventoryCategory)) {
            $scope.configModifierItem.ingredientInventoryCategory = "";
          }
          if (angular.isUndefined($scope.configModifierItem.par)) {
            $scope.configModifierItem.par = 0;
          }
          if (angular.isUndefined($scope.configModifierItem.ingredientStatus)) {
            $scope.configModifierItem.ingredientStatus = "active";
          }
          // console.log('$scope.configModifierItem: ',$scope.configModifierItem);
          // set supplier name from ingredient
          $scope.configModifierItem.supplier_name = selectedIngredient.supplier_name
          $scope.configModifierItem.draft_id = selectedIngredient.draft_id

          $scope.configModifierItem.measurementName = _.get(_.find($scope.unitsOptions,
              ['measurementId', $scope.configModifierItem.inventoryMeasurementId]),
            ['measurementName'])
          $scope.configModifierItem.computedConversionFactor = 1;

          // set stage variables
          let stageFields = ['supplierItemAliasNameStage', 'inventoryMeasurementIdStage', 'inventoryMeasurementUnitPriceStage',
            'computedConversionFactorStage', 'measurementNameStage', 'parStage'
          ]
          _.each(stageFields, function(stageField) {
            $scope.configModifierItem[stageField] = $scope.configModifierItem[stageField.substring(0, stageField.length - 5)]
          })

          _.each(['inventoryMeasurementUnitPriceStage'], function(stageField) {
            $scope.configModifierItem[stageField] = parseFloat($scope.configModifierItem[stageField].toFixed(6));
          })

          $scope.customField = {
            'location': "",
            'category': ""
          }

          if (selectedIngredient.focusItem === 'unitPrice') {
            $scope.editUnitPriceFn('edit')
          } else if (selectedIngredient.focusItem === 'aliasName') {
            $scope.editAliasNameFn('edit')
          }

          $scope.dataReceived = true;

        })
    }
    setTimeout(function() {
      setIngredient(parameters.single);
    }, 50);
    $scope.checkDuplicate = function(current_category) {
      $scope.isDuplicate = false;
      // $scope.duplicateCat = false;
      console.log(parameters.all)
      // if(current_category){

      _.find(parameters.all, function(ingredient) {
        if (ingredient.ingName.toLowerCase() == $scope.configModifierItem.supplierItemAliasNameStage.toLowerCase() && current_category == ingredient.category)
          $scope.isDuplicate = true;
      });
      // }
      // else{
      //     _.find(parameters.single, function(ingredient) {
      //         if(ingredient.ingredient_alias_name.toLowerCase() == $scope.configModifierItem.supplierItemAliasNameStage.toLowerCase())
      //             $scope.isDuplicate = true;
      //     });
      // }

      // console.log($scope.categoryOptions)
      if ($scope.isDuplicate == true) {
        // $scope.configModifierItem.supplierItemAliasNameStage = $scope.configModifierItem.supplierItemAliasName;
        // let ingredientInventoryCategory = _.find($scope.categoryOptions, function(o) { return o.selected; });
        // $scope.configModifierItem.ingredientInventoryCategory = ingredientInventoryCategory.key;
        // $scope.selectedCategory = ingredientInventoryCategory.key;
        toastMessage('Item name already exists with same category.');
        // console.log($scope.configModifierItem)
      }
      // else{
      //     $scope.configModifierItem.ingredientInventoryCategory = current_category;
      //     // $scope.selectedCategory = ingredientInventoryCategory.key;
      // }

    }
    $scope.$watch('configModifierItem', function(newval, oldval) {
      $scope.newData = [];
      $scope.oldData = oldval;
      // console.log("configModifierItem",$scope.oldData,newval)
    }, true)
    $scope.checkCat = false;
    $scope.checkForCustom = function(current_category) {
      $scope.itemModified = true
      // console.log("current_category : ", current_category);
      // $scope.checkDuplicate(current_category);
      console.log($scope.configModifierItem.ingredientInventoryCategory)
      console.log(current_category)
      if ($scope.configModifierItem.ingredientInventoryCategory == current_category)
        $scope.checkCat = false;
      else
        $scope.checkCat = true;
      $scope.configModifierItem.ingredientInventoryCategory = current_category;
      $scope.customCategorySelected();
    }
    // .error(function(e){
    //     console.log(e)
    //     $scope.dataReceived = true;
    // });

    $scope.locationOptionClick = function(locationOption) {
      locationOption.selected = !(locationOption.selected);
      $timeout(updateLocations());

    };

    var updateLocations = function() {
      $scope.configModifierItem.ingredientInventoryLocationIds = _.map(_.filter($scope.locationOptions, 'selected'), 'key');
      // console.log($scope.configModifierItem.ingredientInventoryLocationIds);
    };


    $scope.checkName = false;
    // $scope.checkChange = false;
    $scope.editAliasNameFn = function(actionType) {
      if (actionType === 'set') {
        // console.log($scope.configModifierItem)
        if (angular.isDefined($scope.configModifierItem.supplierItemAliasNameStage) && $scope.configModifierItem.supplierItemAliasNameStage != "") {
          // $scope.configModifierItem.supplierItemAliasNameStage = $scope.configModifierItem.supplierItemAliasNameStage;
          console.log($scope.configModifierItem.supplierItemAliasNameStage)
          console.log($scope.configModifierItem.supplierItemAliasName)
          if ($scope.configModifierItem.supplierItemAliasNameStage == $scope.configModifierItem.supplierItemAliasName)
            $scope.checkName = false;
          else
            $scope.checkName = true;
          // $scope.configModifierItem.supplierItemAliasNameStage = $scope.configModifierItem.supplierItemAliasName;
          // $scope.checkDuplicate($scope.configModifierItem.ingredientInventoryCategory);
        } else {
          $scope.configModifierItem.supplierItemAliasNameStage = $scope.configModifierItem.supplierItemAliasName;
          toastMessage('Item name cannot be empty')

        }
        $scope.aliasNameFocus = false;
      } else if (actionType === 'edit') {
        console.log('edit')

        // $scope.configModifierItem.supplierItemAliasNameStage = $scope.configModifierItem.supplierItemAliasName;
        $scope.aliasNameFocus = true;

      } else if (actionType === 'cancel') {
        $scope.configModifierItem.supplierItemAliasNameStage = $scope.configModifierItem.supplierItemAliasName;
        $scope.aliasNameFocus = false;
      }

      $scope.editAliasName = !$scope.editAliasName;

    }

    $scope.editUnitPriceFn = function(actionType) {
      if (actionType === 'set') {
        if (angular.isDefined($scope.configModifierItem.inventoryMeasurementUnitPriceStage) && $scope.configModifierItem.inventoryMeasurementUnitPriceStage != 0) {
          //$scope.configModifierItem.supplierItemAliasNameStage = $scope.configModifierItem.supplierItemAliasNameStage;
        } else {
          $scope.configModifierItem.inventoryMeasurementUnitPriceStage = $scope.configModifierItem.inventoryMeasurementUnitPrice;
          toastMessage('Item price cannot be left empty')
        }
        $scope.measurementUnitsFocus = false;
      } else if (actionType === 'edit') {
        _.each(['inventoryMeasurementUnitPriceStage'], function(stageField) {
          $scope.configModifierItem[stageField] = parseFloat($scope.configModifierItem[stageField].toFixed(6));
        })
        // $scope.configModifierItem.inventoryMeasurementUnitPriceStage = $scope.configModifierItem.inventoryMeasurementUnitPrice;
        $scope.measurementUnitsFocus = true;
      } else if (actionType === 'cancel') {
        $scope.configModifierItem.inventoryMeasurementUnitPriceStage = $scope.configModifierItem.inventoryMeasurementUnitPrice;
        $scope.measurementUnitsFocus = false;
      }

      $scope.editUnitPrice = !$scope.editUnitPrice;

    }

    // $scope.categoryOptionClick = function (categoryOption) {
    //     _.forEach($scope.categoryOptions, function (categoryOpt) {
    //         categoryOpt.selected = false;
    //     });

    //     categoryOption.selected = true;
    //     $scope.configModifierItem.ingredientInventoryCategory = categoryOption.key;
    // };


    $scope.statusOptionClick = function(statusOption) {

      if (statusOption.key === 'inactive') {
        confirmation_popup('Set Inactive Ingredient',
            'Are you sure you want to make the ingredient inactive? \nThe ingredient will be absent in future drafts.')
          .then(function(confirmed) {
            if (confirmed) {
              _.forEach($scope.statusOptions, function(statusOpt) {
                statusOpt.selected = false;
              });

              statusOption.selected = true;
              $scope.configModifierItem.ingredientStatus = statusOption.key;
            } else {

            }
          })
      } else {
        _.forEach($scope.statusOptions, function(statusOpt) {
          statusOpt.selected = false;
        });

        statusOption.selected = true;
        $scope.configModifierItem.ingredientStatus = statusOption.key;
      }


      // console.log($scope.configModifierItem);




    };

    $scope.unitOptionClick = function(unitOption) {
      _.forEach($scope.unitsOptions, function(unitOpt) {
        unitOpt.selected = false;
      });

      unitOption.selected = true;
      $scope.$broadcast('config-units-changed',
        _.findIndex($scope.unitsOptions, ['measurementId', unitOption.measurementId]))
      // console.log($scope.configModifierItem);
    };

    $scope.customLocationSelected = function() {
      if (angular.isDefined($scope.configModifierItem)) {
        if (angular.isDefined($scope.configModifierItem.ingredientInventoryLocationIds)) {
          // console.log("custom check " + $scope.configModifierItem.ingredientInventoryLocationIds);
          // console.log("custom found at " + $scope.configModifierItem.ingredientInventoryLocationIds.indexOf('Custom'));
          if ($scope.configModifierItem.ingredientInventoryLocationIds.indexOf('Custom') != -1) {
            $scope.customLocationFocus = true;
            return true;
          } else {
            $scope.customLocationFocus = false;
          }
        }
      }
      return false;
    };

    $scope.customCategorySelected = function() {
      if (angular.isDefined($scope.configModifierItem)) {
        if (angular.isDefined($scope.configModifierItem.ingredientInventoryCategory)) {
          if ($scope.configModifierItem.ingredientInventoryCategory == 'Custom') {
            $scope.customCategoryFocus = true;
            return true;
          } else {
            $scope.customCategoryFocus = false;
          }
        }
      }
      return false;
    };

    var confirmation_popup = function(title, template) {
      var q = $q.defer();
      var confirmPopup = $ionicPopup.confirm({
        title: title,
        template: template,
        buttons: [{
            text: 'Cancel'
          },
          {
            text: '<b>Yes</b>',
            type: 'button-bal',
            onTap: function(e) {
              return true;
            }
          }
        ]
      });
      confirmPopup.then(function(res) {
        if (res) {
          // // console.log('You are sure');
        } else {
          // // console.log('You are not sure');
        }
        q.resolve(res)

      });

      return q.promise;
    };

    // $scope.$watch('configModifierItem', function(newVal) {
    //     if($scope.checkName){
    //         $scope.checkChange = true;
    //         console.log('configModifierItem....',newVal)
    //     }


    // }, true);

    $scope.confirmSave = function() {
      // console.log($scope.configModifierItem.ingredientInventoryCategory)
      // console.log($scope.configModifierItem.supplierItemAliasNameStage)
      // console.log($scope.configModifierItem.supplierItemAliasName)
      if ($scope.configModifierItem.supplierItemAliasNameStage == $scope.configModifierItem.supplierItemAliasName)
        $scope.checkName = false;
      else
        $scope.checkName = true;
      console.log('$scope.checkName: ', $scope.checkName)
      console.log('$scope.checkCat: ', $scope.checkCat)
      $scope.isDuplicate = false;
      // console.log(parameters.all)
      if ($scope.checkName || $scope.checkCat) {
        _.find(parameters.all, function(ingredient) {
          if (ingredient.ingName.toLowerCase() == $scope.configModifierItem.supplierItemAliasNameStage.toLowerCase() && $scope.configModifierItem.ingredientInventoryCategory == ingredient.category) {

            $scope.isDuplicate = true;
          }
        });
      }
      if ($scope.oldData) {
        if ($scope.isDuplicate == true) {
          toastMessage('Item name already exists with same category.');
        } else {
          if ($scope.configModifierItem.supplierItemAliasNameStage && $scope.configModifierItem.supplierItemAliasNameStage != '') {
            console.log('do it...........')
            if ($scope.configModifierItem.inventoryMeasurementUnitPriceStage != null && $scope.configModifierItem.inventoryMeasurementUnitPriceStage != 0) {
              confirmation_popup('Confirm Configuration Changes',
                  'Are you sure you want to save the changes to the supplier item configuration?')
                .then(function(confirmed) {
                  if (confirmed) {
                    $scope.saveButtonText = '   Saving...';
                    $scope.saveButtonColor = 'app-theme-color-transparent'
                    sendConfigMod()
                  } else {
                    $scope.saveButtonColor = 'app-theme-color'
                  }
                })
            } else {
              toastMessage("price should not be zero and emtpy");
              $scope.saveRestrict = true;
              $scope.saveButtonColor = 'app_theme_disabled_color'
            }
          } else if ($scope.configModifierItem.supplierItemAliasNameStage == '') {
            console.log('empty name...........');
            toastMessage('Ingredient Name is required.')
          } else {
            console.log('long name...........');
            toastMessage('Ingredient Name is too long.')
          }
        }
      } else {
        toastMessage("Oops! nothing to do ")
      }

    };

    var sendConfigMod = function() {
      // console.log('SAVE $scope.configModifierItem: ',$scope.configModifierItem);
      // console.log($scope.oldCat)
      // console.log($scope.oldIngName)
      _.find(parameters.all, function(ingredient) {
        // console.log("ingredient",$scope.oldIngName,$scope.oldIngName)
        if( $scope.oldIngName != undefined && ingredient.ingName != undefined) {
          if (ingredient.ingName.toLowerCase() == $scope.oldIngName.toLowerCase() && $scope.oldCat == ingredient.category) {
            ingredient.ingName = $scope.configModifierItem.supplierItemAliasNameStage;
            ingredient.category = $scope.configModifierItem.ingredientInventoryCategory;
          }
        }
      });
      // console.log(parameters.all)
      // console.log('Sending config modification');
      if ($scope.customCategorySelected()) {
        $scope.configModifierItem.ingredientInventoryCategory = $scope.customField.category;
        // console.log($scope.customField.category);
        inventoryItemsSvc.saveCustomField('category', $scope.customField.category).then(function(response) {
          // console.log('saved new custom category');
          $scope.saveButtonText = ' ' + $scope.saveButtonText + '.';
        })
      }
      if ($scope.customLocationSelected()) {

        var custom_index = $scope.configModifierItem.ingredientInventoryLocationIds.indexOf('Custom');
        if (custom_index != -1) {
          // console.log('custom loction' + $scope.configModifierItem.ingredientInventoryLocationIds[custom_index]);
          $scope.configModifierItem.ingredientInventoryLocationIds[custom_index] = $scope.customField.location;
          // console.log('custom loction' + $scope.configModifierItem.ingredientInventoryLocationIds[custom_index]);
          // console.log($scope.customField.location);
          inventoryItemsSvc.saveCustomField('location', $scope.customField.location).then(function(response) {
            // console.log('saved new custom location');
            $scope.saveButtonText = ' ' + $scope.saveButtonText + '.';
          })
        }

      }

      // set staged fields to actual fields
      var stageFields = ['supplierItemAliasNameStage', 'inventoryMeasurementIdStage', 'inventoryMeasurementUnitPriceStage',
        'computedConversionFactorStage', 'measurementNameStage', 'parStage'
      ]
      _.each(stageFields, function(stageField) {
        $scope.configModifierItem[stageField.substring(0, stageField.length - 5)] = $scope.configModifierItem[stageField]
      })

      // console.log('SAVE $scope.configModifierItem: ',$scope.configModifierItem,console.log($scope.statusOptions));
      $scope.configModifierItem.active = $scope.statusOptions[1].selected ? true : false;
      // console.log('SAVE2222 $scope.configModifierItem: ',$scope.configModifierItem)

      inventoryItemsSvc.saveModifiedIngredientConfig({
          supplier_item: $scope.configModifierItem
        })
        .then(function(response) {
          // console.log('config saved',$scope.configModifierItem);
          $scope.saveButtonText = ' ' + $scope.saveButtonText + '.';
          $scope.closeModal({
            'modal': 'closed',
            'config_saved': true,
            'new_config': $scope.configModifierItem
          })
        })
    };


    // used when user cancels
    $scope.closeModalCtrl = function(result) {
      console.log('cancel edi config')
      $scope.closeModal({
        'modal': 'closed',
        'config_saved': false
      })
    }

    var toastMessage = function(message_text, duration) {
      if (typeof duration === 'undefined') duration = 2000;
      $ionicLoading.show({
        template: message_text,
        noBackdrop: true,
        duration: duration
      });
    }

    //add unit code
    $scope.addUnit = function(supplier) {
      // console.log("supplier",supplier);
      $ionicModal.fromTemplateUrl('application/inventory-management/directives/config-modifier/add_unit.html', {
        scope: $scope,
        animation: 'slide-in-up',
        backdropClickToClose: false
      }).then(function(modal) {
        $scope.addUnitModal = modal;
        $scope.baseUnit = supplier.measurementNameStage;
        // fetchAndFilterNewUnits(supplier);
        $scope.addUnitModal.show();
        $ionicSlideBoxDelegate.enableSlide(false);
      });
    };
    $scope.closeAddUnitModal = function(model) {
      console.log('closeUnitPopup2Modal')
      $scope.locationAccepted = true;
      $scope.addUnitModal.hide();
    };

    // CommonService.fetchMeasurements(function(data) {
    //   console.log("data",data);
    //   $scope.measurements_list = [];
    //   _.forEach(data.measurements, function(measurements) {
    //     if (measurements.measurement_name != null && measurements.measurement_name != '') {
    //       $scope.measurements_list.push(measurements);
    //     }
    //   });
    // });

    function fetchAndFilterNewUnits(supplier) {
      // console.log("supplier details : ", supplier);
      $scope.selectedSupplier = supplier;
      var supplierDetails = {}
      supplierDetails.supplierId = supplier.supplierId;
      supplierDetails.supplierItemId = supplier.supplierItemId;

      var getMeasurementCallback = function(data) {
        // console.log("getMeasurementData : ",data);
        $scope.newUnitList = [];
        var baseUnitsToFilter = []
        $scope.baseUnitsToShow = data.data.base_units
        _.forEach(data.data.base_units, function(unit) {
          baseUnitsToFilter.push(unit.base_unit);
        });
        // console.log("baseUnits : ", baseUnitsToFilter);
        if ("unit_options" in data.data && "base_units" in data.data) {
          $scope.showPlus = true;
          $scope.newUnitList = data.data.unit_options.filter(item => !baseUnitsToFilter.includes(item))
          // console.log("$scope.newUnitLis : ", $scope.newUnitList);
        }
        // $scope.newUnitList = data.data.unit_options.filter(item => !baseUnitsToFilter.includes(item))

      };
      CommonService.getMeasurementData(getMeasurementCallback, supplier);
    }
    fetchAndFilterNewUnits(parameters);

    $scope.saveUnitData = function(newUnitData) {
      // console.log("newUnitData : ", newUnitData);
      $scope.selectedSupplier
      var baseConversionFactor
      _.forEach($scope.baseUnitsToShow, function(baseUnit) {
        if (baseUnit.base_unit == newUnitData.baseUnit)
          baseConversionFactor = baseUnit.base_convertion_factor
      });
      var newSupplierUnit = {
        "global_ingredient_id": $scope.selectedSupplier.globalIngredientId,
        "supplier_id": $scope.selectedSupplier.supplierId,
        "supplier_item_id": $scope.selectedSupplier.supplierItemId,
        "new_unit": newUnitData.unit,
        "new_conversion_factor": newUnitData.conversionFactor,
        "base_unit": newUnitData.baseUnit,
        "base_conversion_factor": baseConversionFactor
      }

      function suppUnitResponseHandler(data) {
        // console.log("suppUnitResponseHandler : ", data);
        $scope.addUnitModal.hide();
      }
      CommonService.postMeasurementConvData(suppUnitResponseHandler, newSupplierUnit)
    }


  }

})();
