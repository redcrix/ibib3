(function () {
    projectCostByte.controller('inventoryChangePriceCtrl', inventoryChangePriceCtrl);

    inventoryChangePriceCtrl.$inject = ['$q', '$scope', '$state', '$stateParams', '$timeout', 'inventoryItemsSvc', '$rootScope', 'parameters', 'CommonService', '$ionicLoading', '$ionicPopup'];

    function inventoryChangePriceCtrl($q, $scope, $state, $stateParams, $timeout, inventoryItemsSvc, $rootScope, parameters, CommonService, $ionicLoading, $ionicPopup) {

        $scope.dataReceived = false;
        // console.log(parameters);
        $scope.configModifierItem = parameters;

        $scope.configModifierItem.ingredient_price_stage = parseFloat($scope.configModifierItem.ingredient_price);
        $scope.configModifierItem.ingredient_price_stage = parseFloat($scope.configModifierItem.ingredient_price_stage).toFixed(2);
        console.log("$scope.configModifierItem.ingredient_price_stage",$scope.configModifierItem.ingredient_price_stage)

        $scope.changePriceButtonColor = 'app-theme-color';
        $scope.changePriceButtonText = 'Change Price';

        // used when user cancels
        $scope.closeModalCtrl = function (result) {
            console.log('cancel edi config');
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
        };

        var testQuantity = function (quantityVal) {
            if (_.isNull(quantityVal)) {
                return false;
            }
            return /^[0-9.]+$/.test(quantityVal);
        };


        $scope.editUnitPriceFn = function (actionType) {
            if (actionType === 'set') {
                if (angular.isDefined($scope.configModifierItem.ingredient_price_stage) && $scope.configModifierItem.ingredient_price_stage !== 0) {
                    //$scope.configModifierItem.supplierItemAliasNameStage = $scope.configModifierItem.supplierItemAliasNameStage;
                    $scope.configModifierItem.ingredient_price_display = $scope.configModifierItem.ingredient_price_stage;
                } else {
                    $scope.configModifierItem.ingredient_price = $scope.configModifierItem.ingredient_price_stage;
                    toastMessage('Item price cannot be left empty')
                }
                $scope.measurementUnitsFocus = false;
            } else if (actionType === 'edit') {
                $scope.configModifierItem.ingredient_price_stage = parseFloat($scope.configModifierItem.ingredient_price_stage).toFixed(2);
                // $scope.configModifierItem.inventoryMeasurementUnitPriceStage = $scope.configModifierItem.inventoryMeasurementUnitPrice;
                $scope.measurementUnitsFocus = true;
            } else if (actionType === 'cancel') {
                $scope.configModifierItem.ingredient_price_stage = $scope.configModifierItem.ingredient_price;
                $scope.measurementUnitsFocus = false;
            }

            $scope.editUnitPrice = !$scope.editUnitPrice;

        };
        $scope.disableSave = false;
        $scope.toTwoDigit = function(value){
            console.log("float value is" + value);
            value = parseFloat(value);
            console.log(value)
        //    $scope.configModifierItem.ingredient_price_stage = (isNaN(value)) ? '' : value.toFixed(2);
            console.log($scope.configModifierItem.ingredient_price_stage);
            // if(!$scope.configModifierItem.ingredient_price_stage || $scope.configModifierItem.ingredient_price_stage <=0){
            //   $scope.disableSave = true;
            //   toastMessage("Invalid Price.")
            // } else {
            //   $scope.disableSave = false;
            // }
            $scope.disableSave = false;
        }


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
                    // // console.log('You are sure');
                } else {
                    // // console.log('You are not sure');
                }
                q.resolve(res)

            });

            return q.promise;
        };


        $scope.confirmChangePrice = function () {
          console.log($scope.configModifierItem.ingredient_price_stage);
          var value = parseFloat($scope.configModifierItem.ingredient_price_stage)
          $scope.configModifierItem.ingredient_price_stage = (isNaN(value)) ? 0 : value.toFixed(2);
            confirmation_popup('Confirm Price Change',
                'Are you sure you want to save the new price to the supplier item configuration?')
                .then(function (confirmed) {
                    if (confirmed) {
                        console.log('Changing unit Price of ingredient');
                        $scope.changePriceButtonText = '    Changing price ...';
                        $scope.changePriceButtonColor = 'app-theme-color-transparent';
                        $scope.editUnitPriceFn("set")
                        sendChangedPrice()
                    } else {
                        $scope.changePriceButtonColor = 'app-theme-color'
                    }
                })
        };


        var changePriceConfirmed = false;
        var sendChangedPrice = function () {

            $scope.configModifierItem.ingredient_price = $scope.configModifierItem.ingredient_price_stage;

            if (!changePriceConfirmed) {
                changePriceConfirmed = true;
                console.log($scope.configModifierItem);
                inventoryItemsSvc.saveModifiedIngredientPrice($scope.configModifierItem)
                    .then(function (response) {
                        if (response.success) {
                            $scope.closeModal({
                                'modal': 'closed',
                                'unitprice_changed': true,
                                'new_price': $scope.configModifierItem
                            })
                        } else {
                            $scope.changePriceButtonText = 'Change Price';
                            $scope.changePriceButtonColor = 'app-theme-color';
                            toastMessage("Change price failed. Please try again or cancel.")
                        }

                    });


            }

        };


        $scope.editUnitPriceFn('edit');
        $scope.dataReceived = true;

    }

    projectCostByte.directive('realTimeCurrency', function ($filter, $locale) {
        var decimalSep = $locale.NUMBER_FORMATS.DECIMAL_SEP;
        var toNumberRegex = new RegExp('[^0-9\\' + decimalSep + ']', 'g');
        var trailingZerosRegex = new RegExp('\\' + decimalSep + '0+$');
        var filterFunc = function (value) {
            return $filter('currency')(value);
        };

        function getCaretPosition(input){
            if (!input) return 0;
            if (input.selectionStart !== undefined) {
                return input.selectionStart;
            } else if (document.selection) {
                // Curse you IE
                input.focus();
                var selection = document.selection.createRange();
                selection.moveStart('character', input.value ? -input.value.length : 0);
                return selection.text.length;
            }
            return 0;
        }

        function setCaretPosition(input, pos){
            if (!input) return 0;
            if (input.offsetWidth === 0 || input.offsetHeight === 0) {
                return; // Input's hidden
            }
            if (input.setSelectionRange) {
                input.focus();
                input.setSelectionRange(pos, pos);
            }
            else if (input.createTextRange) {
                // Curse you IE
                var range = input.createTextRange();
                range.collapse(true);
                range.moveEnd('character', pos);
                range.moveStart('character', pos);
                range.select();
            }
        }

        function toNumber(currencyStr) {
            return parseFloat(currencyStr.replace(toNumberRegex, ''), 10);
        }

        return {
            restrict: 'A',
            require: 'ngModel',
            link: function postLink(scope, elem, attrs, modelCtrl) {
                modelCtrl.$formatters.push(filterFunc);
                modelCtrl.$parsers.push(function (newViewValue) {
                    var oldModelValue = modelCtrl.$modelValue;
                    var newModelValue = toNumber(newViewValue);
                    modelCtrl.$viewValue = filterFunc(newModelValue);
                    var pos = getCaretPosition(elem[0]);
                    elem.val(modelCtrl.$viewValue);
                    var newPos = pos + modelCtrl.$viewValue.length -
                                       newViewValue.length;
                    if ((oldModelValue === undefined) || isNaN(oldModelValue)) {
                        newPos -= 3;
                    }
                    setCaretPosition(elem[0], newPos);
                    return newModelValue;
                });
            }
        };
    });
})();
