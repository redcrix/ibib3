(function () {
    projectCostByte.controller('inventoryAddQuantityCtrl', inventoryAddQuantityCtrl);

    inventoryAddQuantityCtrl.$inject = ['$q', '$scope', '$state', '$stateParams', '$timeout', 'inventoryItemsSvc', '$rootScope', 'parameters', 'CommonService','$ionicModal','$ionicSlideBoxDelegate','$ionicLoading'];

    function inventoryAddQuantityCtrl($q, $scope, $state, $stateParams, $timeout, inventoryItemsSvc, $rootScope, parameters, CommonService, $ionicModal, $ionicSlideBoxDelegate,$ionicLoading) {
        $scope.selectUnit = true;
        $scope.dataReceived = false;
        $scope.itemChanged = false;
        $scope.isQuantityChanged = false;
        $scope.isUnitChanged = false;
        $scope.quantities = {addedQuantity : 0,
                             convertedAddedQuantity : 0};
        var convertionFactor = 1;
        var supplierItemConfig = null;
        $scope.actualUnit =null;
        var selectedUnit = null;
        $scope.showPlus = false;

        $scope.supplier_id = parameters.supplier_id;
        $scope.ingName = parameters.ingredient_alias_name;

        var calculateAddedQuantity = function () {
          // console.log("value",value)
          if($scope.isQuantityChanged && !$scope.isUnitChanged) {
            $scope.quantities.convertedAddedQuantity = $scope.quantities.addedQuantity;
          }
          if($scope.isUnitChanged) {
            $scope.selectedConvUnit.actualConversionFactor = $scope.selectedConvUnit.actualConversionFactor == 0 ?1 :parseFloat($scope.selectedConvUnit.actualConversionFactor)
            $scope.selectedConvUnit.conversionFactor = $scope.selectedConvUnit.conversionFactor == 0 ?1 :parseFloat($scope.selectedConvUnit.conversionFactor)
          }  
          if($scope.isUnitChanged && $scope.isQuantityChanged){
            // console.log("$scope.quantities.convertedAddedQuantity",value.actualConversionFactor,value.conversionFactor,$scope.selectedConvUnit.actualConversionFactor/$scope.selectedConvUnit.conversionFactor,$scope.selectedConvUnit.actualConversionFactor\$scope.selectedConvUnit.conversionFactor,$scope.quantities.addedQuantity)
            $scope.quantities.convertedAddedQuantity =  (($scope.selectedConvUnit.actualConversionFactor/$scope.selectedConvUnit.conversionFactor)*$scope.quantities.addedQuantity).toFixed(2);
          // console.log("$scope.quantities.convertedAddedQuantity",$scope.quantities.convertedAddedQuantity)
          }
        };


        $scope.addButtonText = 'Add Quantity';
        $scope.addButtonColor = 'app-theme-color';

        $scope.selectedOrDummy = function (unitOption) {
            let buttonStyle = '';

            buttonStyle = buttonStyle + 'button-bal ';
            if (!unitOption.selected) {
                buttonStyle = buttonStyle + 'button-out ';
            }
            return buttonStyle;
        };
        // console.log(parameters)
        $scope.getCurrentConfig = function(){
          // console.log('getCurrentConfig...');
          inventoryItemsSvc.getsupplierItemConfig(parameters.supplier_id, parameters.supplier_item_id,parameters.inventory_item_id,parameters.ingredient_category)
              .then(function (supplierItemCurrentConfigResponse) {

                  supplierItemConfig = supplierItemCurrentConfigResponse;
                  $scope.isItemMapped = supplierItemCurrentConfigResponse.units_options.isItemMapped;
                  if (angular.isDefined(supplierItemConfig.units_options)) {
                      $scope.setUnitOptions = []
                      _.forEach(supplierItemConfig.units_options.units, function (eachUnits) {
                          var checkUnit = _.find($scope.setUnitOptions, function(obj) {
                              // return obj.measurementName == eachUnits.measurementName;
                              return obj.measurementId == eachUnits.measurementId;

                          });

                          if(!checkUnit){
                              if(eachUnits.measurementName != '#NA')
                                  $scope.setUnitOptions.push(eachUnits)
                          }
                      });
                      $scope.unitsOptions = $scope.setUnitOptions;

                      $scope.unitsOptions = _.sortBy($scope.unitsOptions, function (unitOption) {
                          return unitOption.conversionFactor * -1;
                      });
                      // console.log($scope.unitsOptions);
                      $scope.actualUnit = _.find($scope.unitsOptions, ['measurementId', supplierItemConfig.supplier_item.inventoryMeasurementId]);

                      // console.log($scope.actualUnit);

                      _.each($scope.unitsOptions, function (unitOption) {
                          unitOption.label = unitOption.measurementName;
                          unitOption.selected = false;
                          if (angular.isDefined($scope.actualUnit)) {
                              if ($scope.actualUnit.measurementId !== unitOption.measurementId) {
                                  unitOption.actualConversionFactor = $scope.actualUnit.conversionFactor;
                                  unitOption.unitConversionText = _.round($scope.actualUnit.conversionFactor, 2) + '\u202F' + $scope.actualUnit.measurementName +
                                      " = " + _.round(unitOption.conversionFactor, 2) + '\u202F' + unitOption.measurementName;
                              } else {
                                  unitOption.unitConversionText = "  -  "
                              }
                          }
                      });


                      if($scope.supplier_id != 'S130')
                        if($scope.actualUnit)
                            $scope.actualUnit.selected = true;
                      selectedUnit = $scope.actualUnit;
                  }else{
                      $scope.unitsOptions = [{
                          conversionFactor: 1,
                          label: parameters.quantity_units,
                          measurementId: parameters.quantity_units_id,
                          measurementName: parameters.quantity_units,
                          selected: true,
                          unitConversionText: "  -  "
                      }]
                      $scope.actualUnit = $scope.unitsOptions[0];
                      selectedUnit = $scope.actualUnit;
                  }

                  let chunkLength = 2;
                  if ($scope.unitsOptions.length > 4) {
                      chunkLength = 3;
                  }
                  $scope.unitOptionsChunks = _.chunk($scope.unitsOptions, chunkLength);

                  $scope.dataReceived = true;

                  // console.log($scope.addUnitModal);
                  if($scope.addUnitModal){
                    $scope.addUnitModal.hide();
                  }

              })
              .catch(function(){
                  console.log('error in config')
              });
        }
        $scope.getCurrentConfig();
        $scope.unitOptionClick = function (unitOption) {
            if (!unitOption.selected){
                // console.log('units changed')
                _.forEach($scope.unitsOptions, function (unitOpt) {
                    unitOpt.selected = false;
                });
                $scope.itemChanged = true;
                unitOption.selected = true;
                $scope.isUnitChanged = true;
                selectedUnit = unitOption;
                $scope.selectedConvUnit = unitOption;
                calculateAddedQuantity();
            }
        };


        // used when user cancels
        $scope.closeModalCtrl = function (result) {
            // console.log('cancel edi config');
            $scope.closeModal({
                'modal': 'closed',
                'quantity_added': false
            })
        };

        var toastMessage = function (message_text, duration) {
            if (typeof duration === 'undefined') duration = 2000;
            $ionicLoading.show({
                template: message_text,
                noBackdrop: true,
                duration: duration
            });
        }

        var testQuantity = function(quantityVal) {
            if (_.isNull(quantityVal)) {
                return false;
            }
            return /^[0-9.]+$/.test(quantityVal);
        }
        $scope.unitChanged = function(){
          console.log("unitchanged");
          $scope.itemChanged = true;
        }
        $scope.quantityChangeFn = function (value) {
          $scope.itemChanged = true;
          $scope.isQuantityChanged = true;
            value = parseFloat(value);
            // console.log(value)
            $scope.quantities.addedQuantity = (isNaN(value)) ? '' : parseFloat("" +value.toFixed(2) )
            // console.log($scope.quantities.addedQuantity);
            // console.log(testQuantity($scope.quantities.addedQuantity));
            if (testQuantity($scope.quantities.addedQuantity)){
                calculateAddedQuantity()
            } else {
                $scope.quantities.convertedAddedQuantity = 0.00;
            }


        }

        var addConfirmed = false
        $scope.confirmAdd = function(){
          if($scope.itemChanged){
            if (!addConfirmed){
                addConfirmed = true;
                // console.log('adding new quantity to existing quantity')
                $scope.addButtonText = 'Adding quantity...';
                $scope.addButtonColor = 'app-theme-color-transparent';
                $scope.quantities.parameters = parameters;
                // console.log("scope.quantities",$scope.quantities)
                $scope.closeModal({
                    'modal': 'closed',
                    'quantity_added': true,
                    'new_quantity': $scope.quantities
                })
            }
          }else{
            toastMessage("Oops! nothing to do")
          }

        }
    fetchAndFilterNewUnits(parameters);
    //add unit code
    $scope.addUnit=function() {
        // console.log("parameters",parameters);
        $ionicModal.fromTemplateUrl('application/inventory-management/directives/add-quantity/addUnit.html', {
        scope: $scope,
        animation: 'slide-in-up',
        backdropClickToClose: false
      }).then(function(modal) {
        $scope.addUnitModal = modal;
        $scope.baseUnit = parameters.measurementNameStage;
        // fetchAndFilterNewUnits(parameters);

        $scope.addUnitModal.show();
        $ionicSlideBoxDelegate.enableSlide(false);
      });
    };
    $scope.closeAddUnitModal = function(model) {
      // console.log('closeUnitPopup2Modal')
      // $scope.showPlus = false;
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
      $scope.showLoader = false;
        // console.log("supplier details : ", supplier);
        $scope.selectedSupplier = supplier;
        var supplierDetails = {}
        supplierDetails.supplierId = supplier.supplierId;
        supplierDetails.supplierItemId = supplier.supplierItemId;
        // console.log("supplier.supplierId :",supplier.supplierId);

        var getMeasurementCallback = function(data) {
          // console.log("getMeasurementData : ",data);
          // console.log("unit_options" in data.data);

          $scope.newUnitList = [];
          var baseUnitsToFilter = []
          $scope.baseUnitsToShow = data.data.base_units
          _.forEach(data.data.base_units, function(unit) {
            baseUnitsToFilter.push(unit.base_unit);
          });
          // console.log("baseUnits : ", baseUnitsToFilter);
          if("unit_options" in data.data && "base_units" in data.data){
            $scope.showPlus = true;
            $scope.newUnitList = data.data.unit_options.filter(item => !baseUnitsToFilter.includes(item))
          }

          $scope.showLoader = true;
          // console.log("$scope.newUnitLis : ", $scope.newUnitLis);
        };
        CommonService.getMeasurementDataQty(getMeasurementCallback, parameters);
    }

    $scope.saveUnitData = function(newUnitData) {
        // console.log("newUnitData : ", newUnitData);
        $scope.selectedSupplier
        var baseConversionFactor
        _.forEach($scope.baseUnitsToShow, function(baseUnit) {
            if(baseUnit.base_unit == newUnitData.baseUnit)
                baseConversionFactor = baseUnit.base_convertion_factor
        });
        var newSupplierUnit = {
            "global_ingredient_id" : $scope.selectedSupplier.globalIngredientId,
            "supplier_id" : $scope.selectedSupplier.supplier_id,
            "supplier_item_id" : $scope.selectedSupplier.supplier_item_id,
            "new_unit" : newUnitData.unit,
            "new_conversion_factor" : newUnitData.conversionFactor,
            "base_unit" : newUnitData.baseUnit,
            "base_conversion_factor" : baseConversionFactor
        }
        function suppUnitResponseHandler(data) {
            // console.log("suppUnitResponseHandler : ", data);
            $scope.addUnitModal.hide();
        }
        $scope.dataReceived = false;
        CommonService.postMeasurementConvData(suppUnitResponseHandler, newSupplierUnit);
        $timeout(function(){
          $scope.getCurrentConfig();
        },700);

    }

    }
})();