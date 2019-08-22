(function() {


    var productItem = function(inventoryService,$timeout, $ionicPopover, ErrorReportingServiceOne, $rootScope, $ionicModal, CommonService, $ionicScrollDelegate,appModalService) {

        return {
            restrict: 'E',
            replace: true,
            scope: {},
            require: ["^productCategory", "productItem"],
            bindToController: {
                nodeData: '=nodeData',
                mode: '=',
                filterView: '=filterView',
                // minorCatList: '='
            },
            controller: function($scope) {

                this.rowSize = {
                    name: 30,
                    price: 17,
                    qty: 12,
                    units: 14,
                    value: 18,
                    category:50,
                } // PB-664 : price: 15, qty: 15, units: 15,
                // console.log("this.nodedata",this.nodeData)
                this.nodeData.ingredient_price_display = this.nodeData.ingredient_price;
                if (this.nodeData.ingredient_price <0){
                    this.nodeData.ingredient_price =0;
                }
                 $scope.changeMinorUnit = function(currSelected,item){
                    // item.minor_category = minor_category;
                    $rootScope.$emit('minorresulteddata', item)
                }
                // console.log(this.nodeData);
                this.nodeData.quantityValidationPassed = true;
                this.value = ((this.nodeData.ingredient_price) * (this.nodeData.quantity) );
                this.value = isNaN(this.value) ? 0 : parseFloat(this.value.toFixed(2))
                // console.log("this.nodeData",this.nodeData);
                $rootScope.dataVal =[];
                // $rootScope.dataVal.push(this.nodeData);
                // this.nodeData.stageQuantity = (!isNaN(this.nodeData.quantity) && this.nodeData.quantity) ? this.nodeData.quantity.toFixed(2) : this.nodeData.quantity;

                this.nodeData.stageQuantity = this.nodeData.quantity;
                this.validationPassedHighlight = "";
                this.supplier_item_updated_at = new Date(parseInt(this.nodeData.date, 10) * 1000).toLocaleDateString("en-US");
                // this.nodeData.par = 5;
                // console.log(this.filterView, this.nodeData.par);
                var toTitleCase = function(str) {
                    return str.replace(/\w\S*/g, function(txt) {
                        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                    });
                }

                this.supplier_name = toTitleCase(this.nodeData.supplier_name);
                $rootScope.$on('minorlist',function(evnt,data){
                    scope.minorCategoryList=data;
                    // console.log("scope.minorCategoryList",scope.minorCategoryList)
                })

            },
            controllerAs: 'ctrl',
            templateUrl: 'application/inventory-management/directives/product-Item/product-item.html',
            // templateUrl: 'inventoryProductItem',
            link: function(scope, ele, attr, controllers) {
                scope.changeMinorUnit = function(currSelected,item){
                    // item.minor_category = minor_category;
                    $rootScope.$emit('minorresulteddata', item)
                }

               if(controllers[1].mode == 'edit'){
                   var currentview=inventoryService.getSelectedGroupBy();
                   if(currentview == 'minor_category'){
                       scope.minorCategoryItem=false;
                   }else{
                    scope.minorCategoryItem=true;
                   }
               }else{
                   scope.minorCategoryItem=true;
               }
                var isParGrouping = false;
                controllers[1].parValueHighlight = "";
                var saveOnValidationFail = true;
                scope.$on('BUSY', function (event) {
                    scope.spinnerShow = true;
                });
                var modal_shown= false;
                scope.showSupplierDetails= function(item){
                        modal_shown = appModalService.show('application/inventory-management/directives/inventory-list-item/invSupDetails.html', 'invSupDetailsCtrl', item)
                    return modal_shown
                }
                scope.resultedList=[]

                scope.$on('FREE', function (event) {
                    scope.spinnerShow = false;
                });
                var testQuantity = function(quantityVal) {
                    // console.log(quantityVal)
                    if (_.isNull(quantityVal)) {
                        return true;
                    }
                    return /^[0-9.]+$/.test(quantityVal);
                }
                var quantityValidated = function() {
                    // console.log(controllers[1].nodeData.stageQuantity)
                    var validationStatus = testQuantity(controllers[1].nodeData.stageQuantity)
                    var wasFailedFlag = !controllers[1].nodeData.quantityValidationPassed
                    // console.log(validationStatus)
                    controllers[1].nodeData.quantityValidationPassed = validationStatus;


                    if (!validationStatus) {
                        //                        console.log("failed validation")
                        $timeout(function() {
                            controllers[1].validationPassedHighlight = 'validation-failed-highlight';
                        }, 0)

                    } else {
                        //                        console.log("passed validation")
                        // controllers[1].nodeData.quantity = controllers[1].nodeData.stageQuantity;

                        if (isNaN(controllers[1].nodeData.quantity)) {
                            controllers[1].nodeData.quantity_to_par_group = "Items without inventory"
                        }else{
                            controllers[1].nodeData.quantity_to_par_group = controllers[1].nodeData.quantity > controllers[1].nodeData.par ? 'Items above Par value' : 'Items ready for ordering';
                        }
                        if (!isParGrouping && (controllers[1].nodeData.quantity < controllers[1].nodeData.par)) {
                            $timeout(function() {
                                controllers[1].parValueHighlight = 'highlight-quantity';
                            }, 0)
                        } else {
                            $timeout(function() {
                                controllers[1].parValueHighlight = '';
                            }, 0)
                        }

                        if (wasFailedFlag) {
                            $timeout(function() {
                                controllers[1].validationPassedHighlight = "validation-pass-green";
                            }, 0)
                            $timeout(function() {
                                controllers[1].validationPassedHighlight = "";
                            }, 1000)
                        }
                    }
                    return validationStatus;
                }

                controllers[1].valueUpdated = function(reqConfig,value) {
                    console.log('reqConfig: ',reqConfig,value)
                    value = parseFloat(value);
                    // console.log('______________________________________________________: ',value);
                    this.nodeData.stageQuantity = (isNaN(value)) ? 0 : parseFloat(value.toFixed(2))
                    this.nodeData.quantity = (isNaN(value)) ? 0 : parseFloat(value.toFixed(2))
                    // console.log(this.nodeData.stageQuantity);
                    // this.nodeData.calculated_price = parseFloat(this.nodeData.quantity * this.nodeData.ingredient_price).toFixed(2);
                    if (angular.isDefined(reqConfig.makeServerRequest)) {
                        quantityValidated();
                    }
                    if (saveOnValidationFail) {
                        controllers[0].updateCategoryValue(reqConfig);
                    }

                };

                //                controllers[1].valueUpdated();

                //  scope.setFocusToInput = function(){
                //     return $timeout(function () {
                //         if(controllers[1].mode === 'edit'){
                //             var inputElement = ele.find('input')[0];
                //             $timeout(function(){inputElement.focus()}, 0);
                //         }
                //     },0)
                // }

                scope.setFocusToInput = function() {
                    return $timeout(function() {
                        controllers[1].nodeData.selectedBackGround = "inventory-item-selected";
                        $timeout(function(){$rootScope.$broadcast('INVENTORYITEMSELECTED', controllers[1].nodeData.inventory_item_id)});
                        // if (controllers[1].mode === 'edit' && controllers[1].filterView != 'PAR') {
                        //     var inputElement = ele.find('input')[0];
                        //     $timeout(function() {
                        //         inputElement.focus()
                        //     }, 0);
                        // }
                    }, 0)
                }
                scope.focusQty = function(){
                    scope.setFocusToInput()
                    if (controllers[1].mode === 'edit' && controllers[1].filterView != 'PAR') {
                        var inputElement = ele.find('input')[0];
                        $timeout(function() {
                            inputElement.focus()
                        }, 0);
                    }

                }

                scope.$on('GROUPBYPARVALUE', function(event) {
                    //                         controllers[1].mode = 'view';
                    isParGrouping = true
                })
                scope.$on('NOTGROUPBYPARVALUE', function(event) {

                    //                     console.log('not group by par caught in prd item drct')
                    //                         controllers[1].mode = 'edit';
                    isParGrouping = false
                })

                var error_modal_shown = false;
                scope.errorReporting = function() {
                    scope.errorReportPopover.hide();
                    var item = controllers[1].nodeData;
//                    console.log(item);
                    if (!error_modal_shown) {
                        error_modal_shown = ErrorReportingServiceOne.showErrorReportForm({
                            'page': 'Inventory',
                            'component': item.ingredient_alias_name,
                            'modalName' : scope.errorReportPopover
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
                        scope: scope
                    })
                    .then(function(popover) {
                        scope.errorReportPopover = popover;
                    });

                scope.showReportPopover = function($event) {
                    $event.preventDefault();
                    $event.stopPropagation();
                    scope.errorReportPopover.show($event)
                }

                scope.showEditConfigUnits = function(){
                    var item = controllers[1].nodeData;
                    controllers[0].editConfig(item, 'measurementUnit')
                }

                scope.showEditConfigPrice = function(reqConfig){
                    if(controllers[1].mode == 'edit'){
                        var item = controllers[1].nodeData;
                        // controllers[0].editConfig(item, 'unitPrice')
                        controllers[0].editUnitPrice(item,reqConfig, 'unitPrice')
                    }

                }
                scope.showEditUnits = function(reqConfig){
                    if(controllers[1].mode == 'edit'){
                        var item = controllers[1].nodeData;
                        controllers[0].editUnits(item,reqConfig, 'measurementUnit')
                    }

                }


                scope.showEditConfigAliasName = function(){
                    var item = controllers[1].nodeData;
                    controllers[0].editConfig(item, 'aliasName')
                }

                scope.$on('INVENTORYQUANTITYADDED', function (event , new_quantity, editedItem) {
                    // console.log('INVENTORYQUANTITYADDED*********************',new_quantity,editedItem)
                    var item = controllers[1].nodeData;

                    if (new_quantity.parameters.supplier_id === item.supplier_id && item.inventory_item_id == editedItem.inventory_item_id){
                      // console.log(new_quantity.parameters.supplier_item_id,item.supplier_item_id);
                        if (new_quantity.parameters.supplier_item_id === item.supplier_item_id){
                            // console.log('saving to server')
                            new_quantity.convertedAddedQuantity += (isNaN(controllers[1].nodeData.stageQuantity) || controllers[1].nodeData.stageQuantity == null || controllers[1].nodeData.stageQuantity === '') ? 0 : parseFloat(controllers[1].nodeData.stageQuantity.toFixed(2))
                            // console.log("item",new_quantity.convertedAddedQuantity,controllers[1].nodeData.stageQuantity);
                            controllers[1].valueUpdated({ makeServerRequest: true },new_quantity.convertedAddedQuantity)
                        }
                    }
                });

                scope.showItemSummary=function() {
                  console.log('showItemSummary*****');
                    scope.$broadcast('BUSY');
                    scope.dataReceivederr=false;

                    $ionicModal.fromTemplateUrl('application/item-summary/itemSummaryPopover.html', {
                    scope: scope,
                    animation: 'slide-in-up',
                    backdropClickToClose: false
                  }).then(function(modal) {
                    scope.itemSummaryModal = modal;

                    fetchItemSummary(controllers[1].nodeData);
                    scope.itemSummaryModal.show();
                    //ionicSlideBoxDelegate.enableSlide(false);
                  });
                }

                scope.closeItemSummaryModal = function(model) {
                  // console.log('closeUnitPopup2Modal')
                  scope.locationAccepted = true;
                  scope.itemSummaryModal.hide();
                };

                function fetchItemSummary(invDetails) {
                    scope.$broadcast('BUSY');

                   // $scope.selectedSupplier = supplier;
                    var invInfo = {}
                    invInfo.invItemId = invDetails.inventory_item_id;
                    invInfo.draftId = invDetails.draft_id;
                    // console.log(invDetails.quantity);
                    invInfo.category = invDetails.ingredient_category;
                    invInfo.is_draft = invDetails.quantity ? true : false;
                  //  console.log("supplier.supplierId :",supplier.supplierId);
                    scope.spinnerHide = true;
                    var getMeasurementCallback = function(data) {
                      if(data.data.item_summary){
                        scope.$broadcast('FREE');
                        scope.dataReceived = true;
                          scope.invItemName = data.data.item_summary.inventory_name;
                          scope.price = data.data.item_summary.price;
                          scope.unit = data.data.item_summary.unit;
                          scope.totalQuantity = data.data.item_summary.total.total_quantity;
                          scope.totalValue = data.data.item_summary.total.total_value;
                          scope.categories = data.data.item_summary.categories;
                       }else{
                        scope.$broadcast('FREE');
                        scope.dataReceivederr=true
                       scope.dataReceived = false;

                       }
                    };
                    // console.log('summ details',invInfo);
                    CommonService.getItemSummary(getMeasurementCallback, invInfo);
                }

            }
        };
    };

    function removeAccents(value) {
        return value
            .replace(/á/g, 'a')
            .replace(/é/g, 'e')
            .replace(/í/g, 'i')
            .replace(/ó/g, 'o')
            .replace(/ú/g, 'u');
    }

    projectCostByte.filter('ignoreAccents', function() {

        // Create the return function
        // set the required parameter name to **number**
        return function(data) {
            if(data != undefined)
            var text = removeAccents(data.toLowerCase());
            // console.log('text: ',text);
            return text
        }

    });
    projectCostByte.directive('stringToNumberDir', function() {
      return {
        require: 'ngModel',
        link: function(scope, element, attrs, ngModel) {
          ngModel.$parsers.push(function(value) {
            // console.log("parsers: ",parseFloat(value).toFixed(2));

            return parseFloat(value).toFixed(2)
            // return (!isNaN(value) && value) ? parseFloat(value) : value;
          });
          ngModel.$formatters.push(function(value) {
            // console.log("formatters: ",parseFloat(value));
            // return parseFloat(value);
            if(!isNaN(value) && value){
                // console.log("if formatters: ",parseFloat(value).toFixed(2));
                return parseFloat(value).toFixed(2)
            } else{
                // console.log('else formatters: ',value);
                return value;
            }
            // return (!isNaN(value) && value) ? parseFloat(value).toFixed(2) : value;
          });
        }
      };
    });

    projectCostByte.directive('stringToNumber', function() {
      return {
        require: 'ngModel',
        link: function(scope, element, attrs, ngModel) {
          ngModel.$parsers.push(function(value) {
            // console.log("parsers: ",value);

            return value;
            // return (!isNaN(value) && value) ? parseFloat(value) : value;
          });
          ngModel.$formatters.push(function(value) {
            // console.log("formatters: ",parseFloat(value));
            return parseFloat(value);
            // return (!isNaN(value) && value) ? parseFloat(value).toFixed(2) : value;
          });
        }
      };
    });
    projectCostByte.directive('convertToDecimal', function() {
      return {
        require: 'ngModel',
        link: function(scope, element, attrs, ngModel) {
          ngModel.$parsers.push(function(value) {
            // console.log(value)
            return value;
          });
          ngModel.$formatters.push(function(value) {
            // console.log(!isNaN(value),value)
            value = (!isNaN(value) && value) ? parseFloat(value) : value;
            // return (!isNaN(value) && value) ? value.toFixed(2) : value;
            return value ? value.toFixed(2) : value;
          });
        }
      };
    });

    projectCostByte.directive('convertToDecimalDir', function() {
      return {
        require: 'ngModel',
        link: function(scope, element, attrs, ngModel) {

          ngModel.$parsers.push(function (inputValue) {
            // console.log("inputValue",inputValue);
            inputValue = inputValue ? inputValue.toString() : null;
            // console.log("inputValue",inputValue);
            var transformedInput = inputValue ? inputValue.replace(/[^0-9.]/g, "") : null;

            // var value = parseFloat(transformedInput);
            var setVal = (isNaN(parseFloat(transformedInput))) ? '' : Math.ceil(parseFloat(transformedInput)) === parseFloat(transformedInput) ? transformedInput : parseFloat(transformedInput);
            // ngModel.$setViewValue(setVal.toString());
            console.log(setVal);
            ngModel.$setViewValue(setVal);
            ngModel.$render();



            return setVal;
          });
        element.bind("blur", function () {
            scope.$apply(function () {

                // element.val((isNaN(scope.invItem.price)) ? '' : parseFloat(scope.invItem.price).toFixed(2));
                ngModel.$setViewValue((isNaN(element[0].value)) ? '' : parseFloat(element[0].value).toFixed(2));
                ngModel.$render();
            });
        });

          // ngModel.$parsers.push(function(value) {
          //   console.log(value)
          //   return value;
          // });
          ngModel.$formatters.push(function(value) {

          });
        }
      };
    });
    projectCostByte.directive('convertParToDecimal', function() {
      return {
        require: 'ngModel',
        link: function(scope, element, attrs, ngModel) {

          ngModel.$parsers.push(function (inputValue) {
            // console.log("inputValue",inputValue);
            inputValue = (inputValue || inputValue==0) ? inputValue.toString() : null;
            // console.log("inputValue",inputValue);
            var transformedInput = inputValue ? inputValue.replace(/[^0-9.]/g, "") : null;

            // var value = parseFloat(transformedInput);
            var setVal = (isNaN(parseFloat(transformedInput))) ? '' : Math.ceil(parseFloat(transformedInput)) === parseFloat(transformedInput) ? transformedInput : parseFloat(transformedInput);
            // ngModel.$setViewValue(setVal.toString());
            console.log(setVal);
            ngModel.$setViewValue(setVal);
            ngModel.$render();



            return setVal;
          });
        element.bind("blur", function () {
            scope.$apply(function () {

                // element.val((isNaN(scope.invItem.price)) ? '' : parseFloat(scope.invItem.price).toFixed(2));
                ngModel.$setViewValue((isNaN(element[0].value)) ? '' : parseFloat(element[0].value).toFixed(2));
                ngModel.$render();
            });
        });

          // ngModel.$parsers.push(function(value) {
          //   console.log(value)
          //   return value;
          // });
          ngModel.$formatters.push(function(value) {

          });
        }
      };
    });
    projectCostByte.directive('convertParToDecimal', function() {
      return {
        require: 'ngModel',
        link: function(scope, element, attrs, ngModel) {

          ngModel.$parsers.push(function (inputValue) {
            // console.log("inputValue",inputValue);
            inputValue = (inputValue || inputValue==0) ? inputValue.toString() : null;
            // console.log("inputValue",inputValue);
            var transformedInput = inputValue ? inputValue.replace(/[^0-9.]/g, "") : null;

            // var value = parseFloat(transformedInput);
            var setVal = (isNaN(parseFloat(transformedInput))) ? '' : Math.ceil(parseFloat(transformedInput)) === parseFloat(transformedInput) ? transformedInput : parseFloat(transformedInput);
            // ngModel.$setViewValue(setVal.toString());
            console.log(setVal);
            ngModel.$setViewValue(setVal);
            ngModel.$render();



            return setVal;
          });
        element.bind("blur", function () {
            scope.$apply(function () {

                // element.val((isNaN(scope.invItem.price)) ? '' : parseFloat(scope.invItem.price).toFixed(2));
                ngModel.$setViewValue((isNaN(element[0].value)) ? '' : parseFloat(element[0].value).toFixed(2));
                ngModel.$render();
            });
        });

          // ngModel.$parsers.push(function(value) {
          //   console.log(value)
          //   return value;
          // });
          ngModel.$formatters.push(function(value) {

          });
        }
      };
    });
    projectCostByte.directive('validNumberDir', function() {
      return {
        require: '?ngModel',
        link: function(scope, element, attrs, ngModelCtrl) {
          if(!ngModelCtrl) {
            return;
          }

          ngModelCtrl.$parsers.push(function(val) {
            if (angular.isUndefined(val)) {
                var val = '';
            }
            // console.log(val)
            if(val){
                // console.log('if*******')
              val = val.toString();
              var clean = val.replace(/[^-0-9\.]/g, '');
              // console.log(clean)
              var negativeCheck = clean.split('-');
                    var decimalCheck = clean.split('.');

              if(!angular.isUndefined(negativeCheck[1])) {
                  negativeCheck[1] = negativeCheck[1].slice(0, negativeCheck[1].length);
                  clean =negativeCheck[0] + '-' + negativeCheck[1];
                  if(negativeCheck[0].length > 0) {
                    clean =negativeCheck[0];
                  }

              }

              if(!angular.isUndefined(decimalCheck[1])) {
                  decimalCheck[1] = decimalCheck[1].slice(0,2);
                  clean =decimalCheck[0] + '.' + decimalCheck[1];
              }

              if (val !== clean) {
                ngModelCtrl.$setViewValue(clean);
                ngModelCtrl.$render();
              }
            }
            // console.log(parseFloat(clean).toFixed(2))
            return parseFloat(clean).toFixed(2);
          });

          element.bind('keypress', function(event) {
            if(event.keyCode === 32) {
              event.preventDefault();
            }
          });
        }
      };
    });
    projectCostByte.directive('validNumber', function() {
      return {
        require: '?ngModel',
        link: function(scope, element, attrs, ngModelCtrl) {
          if(!ngModelCtrl) {
            return;
          }

          ngModelCtrl.$parsers.push(function(val) {
            if (angular.isUndefined(val)) {
                var val = '';
            }
            // console.log(val)
            if(val){
              // console.log('if*******')
              val = val.toString();
              var clean = val.replace(/[^-0-9\.]/g, '');
              // console.log(clean)
              var negativeCheck = clean.split('-');
			        var decimalCheck = clean.split('.');

              if(!angular.isUndefined(negativeCheck[1])) {
                  negativeCheck[1] = negativeCheck[1].slice(0, negativeCheck[1].length);
                  clean =negativeCheck[0] + '-' + negativeCheck[1];
                  if(negativeCheck[0].length > 0) {
                  	clean =negativeCheck[0];
                  }

              }

              if(!angular.isUndefined(decimalCheck[1])) {
                  decimalCheck[1] = decimalCheck[1].slice(0,2);
                  clean =decimalCheck[0] + '.' + decimalCheck[1];
              }

              if (val !== clean) {
                ngModelCtrl.$setViewValue(clean);
                ngModelCtrl.$render();
              }
            }
            // console.log(clean)
            return clean;
          });

          element.bind('keypress', function(event) {
            if(event.keyCode === 32) {
              event.preventDefault();
            }
          });
        }
      };
    });
    // projectCostByte.directive('convertToDigit', function() {
    //   return {
    //     require: 'ngModel',
    //     link: function(scope, element, attrs, ngModel) {

    //       ngModel.$parsers.push(function (inputValue) {
    //         // console.log("inputValue",inputValue);
    //         var transformedInput = inputValue ? inputValue.replace(/[^0-9.]/g, "") : null;

    //         var setVal = (isNaN(parseFloat(transformedInput))) ? '' : Math.ceil(parseFloat(transformedInput)) === parseFloat(transformedInput) ? transformedInput : parseFloat(transformedInput);
    //         // console.log(setVal);
    //         ngModel.$setViewValue(setVal.toString());
    //         ngModel.$render();



    //         return setVal;
    //       });
    //     element.bind("blur", function () {
    //         scope.$apply(function () {

    //             ngModel.$setViewValue((isNaN(element[0].value)) ? 0 : parseFloat(element[0].value).toFixed(2));
    //             ngModel.$render();
    //         });
    //     });

    //       ngModel.$formatters.push(function(value) {

    //       });
    //     }
    //   };
    // });


    projectCostByte.directive('focusNext', function () {
        return {
            restrict: 'A',
            link: function ($scope, element, attrs) {
                var isIPad = ionic.Platform.isIPad();
                var isIOS = ionic.Platform.isIOS();
                var isAndroid = ionic.Platform.isAndroid();
                var devicePlatform = isIPad || isIOS ? 'ios' : isAndroid ? 'android' : 'unknown';
                // console.log("Device platform " + devicePlatform);

                element.bind('keydown', function(e) {
                  var code = e.keyCode || e.which;
                  if (code === 13) {
                    e.preventDefault();

                    //element.next()[0].focus();
                        var pageElements = document.querySelectorAll('input'),
                            element = e.srcElement
                            focusNext = false,
                            len = pageElements.length;
                        for (var i = 0; i < len; i++) {
                            var elem = pageElements[i];
                            if (focusNext) {
                                if (elem.style.display !== 'none') {
                                    elem.focus();
                                    // scrollTop

                                    if(devicePlatform === 'android' || devicePlatform === 'unknown') {
                                        var scroll = angular.element(elem).parent().parent().parent()[0];
                                        // console.log(scroll);
                                        // scroll.scrollIntoView(true);
                                        // $window.scrollBy(0, 100);
                                        $ionicScrollDelegate.scrollTo(0,100)
                                    }
                                    break;
                                }
                            } else if (elem === e.srcElement) {
                                focusNext = true;
                            }
                        }
                  }
                });
            }
        }
    });

    // projectCostByte.directive('testDir', function () {
    //   return {
    //       restrict: 'A',
    //       replace: false,
    //       scope: {},
    //       link: function (scope, element, attrs) {
    //           if (attrs.ngRepeat) {
    //               if (scope.$parent.$last) {
    //                   if (attrs.testDir !== '') {
    //                       if (typeof scope.$parent.$parent[attrs.testDir] === 'function') {
    //                           // Executes defined function
    //                           scope.$parent.$parent[attrs.testDir]();
    //                       } else {
    //                           // For watcher, if you prefer
    //                           scope.$parent.$parent[attrs.testDir] = true;
    //                       }
    //                   } else {
    //                       // If no value was provided than we will provide one on you controller scope, that you can watch
    //                       // WARNING: Multiple instances of this directive could yeild unwanted results.
    //                       scope.$parent.$parent.ngRepeatEnd = true;
    //                   }
    //               }
    //           } else {
    //               throw 'testDir: `ngRepeat` Directive required to use this Directive';
    //           }
    //       }
    //   };
    // });


    productItem.$inject = ['inventoryService','$timeout','$ionicPopover','ErrorReportingServiceOne', '$rootScope', '$ionicModal' , 'CommonService', '$ionicScrollDelegate','appModalService'];

    projectCostByte.directive('productItem', productItem);
})();
