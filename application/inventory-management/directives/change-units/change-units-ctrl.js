(function () {
    projectCostByte.controller('inventoryChangeUnitsCtrl', inventoryChangeUnitsCtrl);

    inventoryChangeUnitsCtrl.$inject = ['$q', '$scope', '$state', '$stateParams', '$timeout', 'inventoryItemsSvc', '$rootScope', 'parameters', 'CommonService', '$ionicLoading', '$ionicPopup','$ionicModal','appModalService','inventoryItemsSvc','$ionicSlideBoxDelegate'];

    function inventoryChangeUnitsCtrl($q, $scope, $state, $stateParams, $timeout, inventoryItemsSvc, $rootScope, parameters, CommonService, $ionicLoading, $ionicPopup,$ionicModal,appModalService,inventoryItemsSvc,$ionicSlideBoxDelegate) {
        $scope.spinnerShow=false;
        $scope.dataReceived = false;
        $scope.unitPrineNull=true;
        $scope.unitPrineNullv=false;
        $scope.changePriceButtonColor = 'app-theme-color';
        $scope.changePriceButtonText = 'Change Units';

        $scope.closeModalCtrl = function (result) {
            $scope.closeModal({
                'modal': 'closed',
                'unit_saved': false
            })
        };
        // CommonService.fetchUnitsInv(function(data) {
        //           $scope.measurements_list = [];
        //           _.forEach(data.units, function(measurements) {
        //             if (measurements.measurementName != null && measurements.measurementName != '') {
        //               $scope.measurements_list.push(measurements);
        //               if(parameters.quantity_units_id == measurements.measurementId) {
        //                 $scope.selectedUnit = measurements;
        //               }
        //             }
        //           });
        //           $scope.$broadcast('config-units-changed',
        //             _.findIndex($scope.measurements_list, ['measurementId', $scope.selectedUnit.measurementId]))
        //         },parameters.supplier_id,parameters.supplier_item_id);

        var setIngredient = function(controllerData) {
            var selectedIngredient = {};
            _.each(controllerData, function(ingredient) {
                if(ingredient.selectedBackGround != "") {
                    selectedIngredient = ingredient;
                }
            })
            $scope.item_supplier_id = selectedIngredient.supplier_id;
            inventoryItemsSvc.getsupplierItemConfig(selectedIngredient.supplier_id, selectedIngredient.supplier_item_id, selectedIngredient.inventory_item_id,selectedIngredient.ingredient_category)
            .then(function (supplierItemCurrentConfigResponse) {

                $scope.setUnitOptions = []
                $scope.isItemMapped = supplierItemCurrentConfigResponse.units_options.isItemMapped;
                _.forEach(supplierItemCurrentConfigResponse.units_options.units, function (eachUnits) {

                    var checkUnit = _.find($scope.setUnitOptions, function(obj) {
                        return obj.measurementName == eachUnits.measurementName;
                    });

                    if(!checkUnit){
                        $scope.setUnitOptions.push(eachUnits)
                    }
                });
                $scope.unitsOptions = $scope.setUnitOptions;
                $scope.unitsOptions = _.sortBy($scope.unitsOptions, function(unitOption){
                    return unitOption.conversionFactor * -1;
                })

                let oldUnit = _.find($scope.unitsOptions, ['measurementId', supplierItemCurrentConfigResponse.supplier_item.inventoryMeasurementId]);

                _.each($scope.unitsOptions, function(unitOption){
                    unitOption.label = unitOption.measurementName;
                    unitOption.selected = false;
                    if (angular.isDefined(oldUnit)) {
                        if (oldUnit.measurementId !== unitOption.measurementId) {
                            unitOption.unitConversionText = _.round(oldUnit.conversionFactor, 2) + '\u202F'+ oldUnit.measurementName +
                                " = " + _.round(unitOption.conversionFactor, 2) +  '\u202F'+ unitOption.measurementName;
                        }else{
                            unitOption.unitConversionText = "  -  "
                        }
                    }
                });
                $scope.measurements_list = [];
                  _.forEach($scope.unitsOptions, function(measurements) {
                    if (measurements.measurementName != null && measurements.measurementName != '') {
                      $scope.measurements_list.push(measurements);
                      if(selectedIngredient.quantity_units_id == measurements.measurementId) {
                        $scope.unitPrineNull=false;
                        // $scope.unitPrineNullv=true;
                        $scope.selectedUnit = measurements;
                      }
                    }
                  });
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
                // set supplier name from ingredient
                $scope.configModifierItem.supplier_name = selectedIngredient.supplier_name
                $scope.configModifierItem.draft_id = selectedIngredient.draft_id

                $scope.configModifierItem.measurementName = _.get(_.find($scope.unitsOptions,
                                                                ['measurementId', $scope.configModifierItem.inventoryMeasurementId]),
                                                                ['measurementName'])
                $scope.configModifierItem.computedConversionFactor = 1;

                // set stage variables
                let stageFields = ['supplierItemAliasNameStage', 'inventoryMeasurementIdStage', 'inventoryMeasurementUnitPriceStage',
                'computedConversionFactorStage', 'measurementNameStage', 'parStage']
                _.each(stageFields, function(stageField){
                    $scope.configModifierItem[stageField] = $scope.configModifierItem[stageField.substring(0,stageField.length-5)]
                })

                _.each(['inventoryMeasurementUnitPriceStage'], function(stageField) {
                    $scope.configModifierItem[stageField] = parseFloat($scope.configModifierItem[stageField].toFixed(6));
                })

                $scope.customField = {
                    'location': "",
                    'category': ""
                }

                if(selectedIngredient.focusItem === 'unitPrice'){
                    $scope.editUnitPriceFn('edit')
                }else if (selectedIngredient.focusItem === 'aliasName'){
                    $scope.editAliasNameFn('edit')
                }
                $scope.spinnerShow=true;
                $scope.dataReceived = true;

            })
        }
        setTimeout(function() {
            setIngredient(parameters.single);
        }, 50);

        $scope.addUnit=function(supplier) {
            $ionicModal.fromTemplateUrl('application/inventory-management/directives/config-modifier/add_unit.html', {
            scope: $scope,
            animation: 'slide-in-up',
            backdropClickToClose: false
          }).then(function(modal) {
            $scope.addUnitModal = modal;
            $scope.baseUnit = supplier.measurementNameStage;
            fetchAndFilterNewUnits(supplier);
            $scope.addUnitModal.show();
            $ionicSlideBoxDelegate.enableSlide(false);
          });
        };

        $scope.confirmSave = function(){
            confirmation_popup('Confirm Configuration Changes',
                        'Are you sure you want to save the changes to the Units')
                        .then(function (confirmed) {
                            if (confirmed) {
                                $scope.saveButtonText = '   Saving...';
                                $scope.saveButtonColor = 'app-theme-color-transparent'
                                sendConfigMod().then(function (datas) {
                                  $scope.closeModal({
                                      'modal': 'closed',
                                      'unit_saved': true,
                                      'data': datas
                                  })
                                });
                            }else{
                                $scope.saveButtonColor = 'app-theme-color'
                            }
                        })
        };

        var confirmation_popup = function (title, template) {
            var q = $q.defer();
            var confirmPopup = $ionicPopup.confirm({
                title: title,
                template: template,
                buttons: [
                    {
                        text: 'Cancel'
                    },
                    {
                        text: '<b>Yes</b>',
                        type: 'button-bal',
                        onTap: function (e) {
                            return true;
                        }
                    }
                ]
            });
            confirmPopup.then(function (res) {
                if (res) {
                } else {
                }
                q.resolve(res)

            });

            return q.promise;
        };

        var sendConfigMod = function(){
            var q = $q.defer();
            var stageFields = ['inventoryMeasurementIdStage', 'inventoryMeasurementUnitPriceStage',
            'computedConversionFactorStage', 'measurementNameStage', 'parStage']
            _.each(stageFields, function(stageField){
              // console.log('Before--------------: ',$scope.configModifierItem[stageField.substring(0,stageField.length-5)],$scope.configModifierItem[stageField]);
                $scope.configModifierItem[stageField.substring(0,stageField.length-5)] = $scope.configModifierItem[stageField]
                // console.log('After--------------: ',$scope.configModifierItem[stageField.substring(0,stageField.length-5)],$scope.configModifierItem[stageField]);

            })
            q.resolve($scope.configModifierItem);
            inventoryItemsSvc.saveModifiedIngredientConfig({
                supplier_item: $scope.configModifierItem
            }).then(function (response) {
                    $scope.saveButtonText = ' '+$scope.saveButtonText+'.';
                    // $scope.closeModal({
                    //     'modal': 'closed',
                    //     'unit_saved': true,
                    // })
                    if(response.success){
                      console.log('************** success ***********');
                        toastMessage("Units changed suceessfully",5000);
                        // console.log($scope.configModifierItem);
                        $rootScope.$emit('SUPPLIERITEMCONFIGUPDATEDUNit',$scope.configModifierItem );
                    }
                })
            return q.promise;
        }
        $scope.closeAddUnitModal = function(model) {
          $scope.locationAccepted = true;
          $scope.addUnitModal.hide();
          // showEditUnitsModal(parameters);
        };

        function fetchAndFilterNewUnits(supplier) {
        $scope.selectedSupplier = supplier;
        var supplierDetails = {}
        supplierDetails.supplierId = supplier.supplierId;
        supplierDetails.supplierItemId = supplier.supplierItemId;

        var getMeasurementCallback = function(data) {
                $scope.newUnitList = [];
                var baseUnitsToFilter = []
                $scope.baseUnitsToShow = data.data.base_units
                _.forEach(data.data.base_units, function(unit) {
                    baseUnitsToFilter.push(unit.base_unit);
                });
                $scope.newUnitList = data.data.unit_options.filter(item => !baseUnitsToFilter.includes(item))
            };
            CommonService.getMeasurementData(getMeasurementCallback, supplier);
        }
        var modal_shown=false;
        var showEditUnitsModal = function (item) {
                    if (!modal_shown) {
                        modal_shown = appModalService.show('application/inventory-management/directives/change-units/change-units.html', 'inventoryChangeUnitsCtrl', item)
                    }
                    return modal_shown
                }

          $scope.saveUnitData = function(newUnitData) {
        $scope.selectedSupplier
        var baseConversionFactor
        _.forEach($scope.baseUnitsToShow, function(baseUnit) {
            if(baseUnit.base_unit == newUnitData.baseUnit)
                baseConversionFactor = baseUnit.base_convertion_factor
        });
        var newSupplierUnit = {
            "global_ingredient_id" : $scope.selectedSupplier.globalIngredientId,
            "supplier_id" : $scope.selectedSupplier.supplierId,
            "supplier_item_id" : $scope.selectedSupplier.supplierItemId,
            "new_unit" : newUnitData.unit,
            "new_conversion_factor" : newUnitData.conversionFactor,
            "base_unit" : newUnitData.baseUnit,
            "base_conversion_factor" : baseConversionFactor
        }
        function suppUnitResponseHandler(data) {
            $scope.addUnitModal.hide();
            // showEditUnitsModal(parameters);
        }
        $scope.spinnerShow = false;
        $scope.dataReceived = false;
        CommonService.postMeasurementConvData(suppUnitResponseHandler, newSupplierUnit)
        $timeout(function(){
          setIngredient(parameters.single);
        },700);
    }

    $scope.unitOptionClick = function (selectedUnit, unitList) {
      // console.log('config-units-changed------------');
        $scope.$broadcast('config-units-changed',
            _.findIndex($scope.measurements_list, ['measurementId', selectedUnit.measurementId]))
    };



        $scope.$on('config-units-changed', function (event, dataIndex) {
            let oldUnit = _.find($scope.measurements_list, ['measurementId', $scope.configModifierItem.inventoryMeasurementId]);
            // console.log($scope.measurements_list);
            let newUnit = $scope.measurements_list[dataIndex]
            // console.log(newUnit,oldUnit);
            if (angular.isDefined(oldUnit)){

                $scope.unitConversionText = _.round(oldUnit.conversionFactor,  2) + oldUnit.measurementName +
                    " = " + _.round(newUnit.conversionFactor, 2) + newUnit.measurementName;

                if(newUnit.measurementId === oldUnit.measurementId){
                    $scope.unitConversionText = null;
                }
                $scope.configModifierItem.inventoryMeasurementId=newUnit.measurementId;
                $scope.configModifierItem.inventoryMeasurementIdStage = newUnit.measurementId
                $scope.configModifierItem.measurementNameStage = newUnit.measurementName
                $scope.configModifierItem.computedConversionFactorStage = newUnit.conversionFactor/oldUnit.conversionFactor
                $scope.configModifierItem.inventoryMeasurementUnitPriceStage = $scope.configModifierItem.inventoryMeasurementUnitPrice/$scope.configModifierItem.computedConversionFactorStage
                $scope.configModifierItem.inventoryMeasurementUnitPriceStage = Math.round($scope.configModifierItem.inventoryMeasurementUnitPriceStage * 100) / 100
                $scope.configModifierItem.parStage =  $scope.configModifierItem.par*$scope.configModifierItem.computedConversionFactorStage

            } else {
                $scope.unitConversionText = "Current unit error";
            }
            $scope.spinnerShow=true;
            $scope.dataReceived = true;


        })


        var toastMessage = function (message_text, duration) {
            if (typeof duration === 'undefined') duration = 2000;
            $ionicLoading.show({
                template: message_text,
                noBackdrop: true,
                duration: duration
            });
        };

        var testQuantity = function (quantityVal) {
            if (_.isNull(quantityVal)) {
                return false;
            }
            return /^[0-9.]+$/.test(quantityVal);
        };

        $scope.toTwoDigit = function(value){
            value = parseFloat(value);
            $scope.configModifierItem.ingredient_price_stage = (isNaN(value)) ? '' : value.toFixed(2)
        }

    }
})();