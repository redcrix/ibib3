(function() {
    var orderingProductCategory = function($rootScope, $ionicScrollDelegate, $ionicPopup, $timeout, $ionicActionSheet) {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            bindToController: {
                categoryData: '=categoryData',
                mode: '=mode',
                type: '=type'
            },
            controller: function($rootScope) {
                // console.log(this.categoryData);

                this.categoryData.quantityValidationPassed = true;
                this.updateCategoryValue = function(config) {
                  // console.log(this.categoryData);

                  if($rootScope.qtyRecommended){
                    let moveToCart = _.filter(this.categoryData.ingredients, function(value) {
                        // return value.stageQuantity >= value.par;
                        return value.stageQuantity > 0;
                    });
                    // console.log(moveToCart);
                    this.setRecommendedGroup = localStorage.getItem("recommendedGroup") ? JSON.parse(localStorage.getItem("recommendedGroup")) : [];
                    let that = this;
                    // console.log(this.setRecommendedGroup);
                    _.forEach(moveToCart, function(item,i) {
                      item.showRecommended = false;

                      // console.log(that.setRecommendedGroup,item.inv_item_id.toString());
                      let available = _.findIndex(that.setRecommendedGroup,['inv_item_id',item.inv_item_id.toString()]);
                      // console.log(available);
                      if(available < 0){
                        that.setRecommendedGroup.push({
                          'draft_id': item.draft_id,
                          'inv_item_id': item.inv_item_id
                        })
                        // console.log(that.setRecommendedGroup);
                        // orderingService.setrecommendedItems(that.setRecommendedGroup);
                        localStorage.setItem("recommendedGroup",JSON.stringify(that.setRecommendedGroup));
                      }

                    });
                  }


                  if(this.categoryData){
                    this.categoryData.totalValue = this.categoryData.ingredients.filter(function(ele) {
                        return ele.ingredient_price !== undefined && ele.ingredient_price !== null && ele.quantity !== undefined && ele.quantity !== null && !isNaN(ele.quantity);
                    }).map(function(ele) {
                        return ele.ingredient_price * ele.quantity;
                    }).reduce(function(prev, cur) {
                        return prev + cur;
                    }, 0);

                    if (angular.isDefined(config)) {
                        this.categoryData.quantityValidationPassed = !_.some(this.categoryData.ingredients, {
                            'quantityValidationPassed': false
                        });
                        //                        if(this.categoryData.quantityValidationPassed){
                        //                            console.log(" category passed validation")
                        //                        }else{
                        //                            console.log("category failed validation")
                        //                        }
                    }
                    // console.log('$rootScope.qtyRecommended: ',$rootScope.qtyRecommended);
                    if($rootScope.qtyRecommended){
                      $rootScope.$emit('recommended-category-value-updated', {
                          id: this.categoryData.id,
                          value: this.categoryData.totalValue,
                          config: config,
                      });
                    } else {
                      this.scope.$emit('product-category-value-updated', {
                          id: this.categoryData.id,
                          value: this.categoryData.totalValue,
                          config: config
                      });
                    }

                }
              }

                // $rootScope.$on('ORDERINGFILTER', function (event) {
                //     console.log('ORDERINGFILTER');

                // });
            },
            controllerAs: 'ctrl',
            templateUrl: 'application/ordering/directives/ordering-product-category/ordering-product-category.html',
            link: function(scope, ele, attr, controllers) {
                var testQuantity = function(quantityVal) {
                    if (_.isNull(quantityVal)) {
                        return true;
                    }
                    return /^[0-9.]+$/.test(quantityVal);
                }
                var sublist = ele.parent()[0].querySelector('.sub-list');

                sublist.style.overflow = "hidden";
                sublist.style.maxHeight = '0';
                controllers.scope = scope;

                controllers.updateCategoryValue();

                scope.updateIngredientList = function(requested_data) {
                    var data = requested_data;
                    scope.$emit('product-ingredient-updated', {
                        data: data
                    });
                }

                scope.showUnitsPopup = function(ingredients) {

                    scope.units = [{
                        $$hashKey: "object:2837",
                        date: "1481760000",
                        draft_id: "5114273848098816",
                        ingredient_alias_name: "Peeled Tomatillo",
                        ingredient_category: "Produce",
                        ingredient_id: "ING161",
                        ingredient_name: "Fresh Peeled Tomatillo",
                        ingredient_price: 1.3,
                        location: "Pantry",
                        quantity: 5,
                        quantity_units: "Box",
                        quantity_units_id: "# - bx - box",
                        supplier_id: "S1",
                        supplier_item_id: "82002S",
                        supplier_name: "Roins Food Distribution",
                        value: 6.5
                    }, {
                        $$hashKey: "object:2838",
                        date: "1481760000",
                        draft_id: "5114273848098816",
                        ingredient_alias_name: "Peeled Tomatillo",
                        ingredient_category: "Produce",
                        ingredient_id: "ING161",
                        ingredient_name: "Fresh Peeled Tomatillo",
                        ingredient_price: 1.3,
                        location: "Pantry",
                        quantity: 5,
                        quantity_units: "pieces",
                        quantity_units_id: "# - pc - pieces",
                        supplier_id: "S1",
                        supplier_item_id: "82002S",
                        supplier_name: "Roins Food Distribution",
                        value: 6.5
                    }, {
                        $$hashKey: "object:2839",
                        date: "1481760000",
                        draft_id: "5114273848098816",
                        ingredient_alias_name: "Peeled Tomatillo",
                        ingredient_category: "Produce",
                        ingredient_id: "ING161",
                        ingredient_name: "Fresh Peeled Tomatillo",
                        ingredient_price: 1.3,
                        location: "Pantry",
                        quantity: 5,
                        quantity_units: "kg",
                        quantity_units_id: "# - kg - kilograms",
                        supplier_id: "S1",
                        supplier_item_id: "82002S",
                        supplier_name: "Roins Food Distribution",
                        value: 6.5
                    }, {
                        $$hashKey: "object:2835",
                        date: "1481760000",
                        draft_id: "5114273848098816",
                        ingredient_alias_name: "Peeled Tomatillo",
                        ingredient_category: "Produce",
                        ingredient_id: "ING161",
                        ingredient_name: "Fresh Peeled Tomatillo",
                        ingredient_price: 1.3,
                        location: "Pantry",
                        quantity: 5,
                        quantity_units: "gms",
                        quantity_units_id: "# - gm - grams",
                        supplier_id: "S1",
                        supplier_item_id: "82002S",
                        supplier_name: "Roins Food Distribution",
                        value: 6.5
                    }]
                    scope.openUnitsSheet = function() {
                        var hideSheet = $ionicActionSheet.show({
                            buttons: scope.units.map(function(ele) {
                                //console.log(ele.quantity_units);
                                return {
                                    text: ele.quantity_units
                                }
                            }),
                            titleText: 'Select Units',
                            cancelText: 'Cancel',
                            cancel: function() {},
                            buttonClicked: function(index) {
                                scope.selectedUnit = scope.units[index];
                                return true;
                            }
                        });
                    };

                    var unitsPopup = $ionicPopup.show({
                        template: '<div ng-if="units.length>0" id="dropdown-container"><div style="margin-top: 10px">selected Unit: </div> <div style="font-style:italic; padding: 5px; background: lightgray; text-align: center;">{{selectedUnit.quantity_units}}</div></div>',
                        title: 'Select Unit for',
                        subTitle: ingredients.ingredient_name,
                        scope: scope,
                        buttons: [{
                            text: 'Cancel'
                        }, {
                            text: '<b>Submit</b>',
                            type: 'button-balanced',
                        }]
                    });

                    setTimeout(function() {
                        document.querySelector('#dropdown-container').addEventListener('click', function() {
                            scope.$apply(function() {
                                scope.openUnitsSheet();
                            })
                        });
                    }, 50);

                    unitsPopup.then(function() {
                        var requestPayload = {
                            index: scope.selectedUnit
                        };
                        scope.updateIngredientList(requestPayload);
                    });
                };

                scope.showQuantityPopup = function(item) {
                    scope.data = {};
                    var quantityPopup = $ionicPopup.show({
                        template: '<input type="quantity" ng-model="data.quantity">',
                        title: 'Enter Adiitional Quantity',
                        scope: scope,
                        buttons: [{
                            text: 'Cancel'
                        }, {
                            text: '<b>Save</b>',
                            type: 'button-balanced',
                            onTap: function(e) {
                                if (!scope.data.quantity) {
                                    e.preventDefault();
                                } else {
                                    return scope.data.quantity;
                                }
                            }
                        }]
                    });
                    quantityPopup.then(function(res) {
                        var validationStatus = testQuantity(res);
                        if (validationStatus) {
                            item.stageQuantity += parseFloat(res);
                            item.quantity += parseFloat(res);
                            controllers.updateCategoryValue({
                                makeServerRequest: true
                            });
                        }
                        quantityPopup.close();
                    });
                }

                scope.changeUnit = function(ingredient) {
                    var unitsDataResponseHandler = function(data) {
                            scope.customUnitsData = data;
                        }
                        //  CommonService.fetchUnits(unitsDataResponseHandler, ingredient.supplier_id, ingredient.supplier_item_id, ingredient.draft_id, ingredient.ingredient_id);
                    scope.showUnitsPopup(ingredient);
                };

                scope.addQuantity = function(item) {
                    scope.showQuantityPopup(item);
                }

                scope.toggleGroup = function(group) {
                    if (scope.isGroupShown(group)) {
                        scope.shownGroup = null;
                    } else {
                        scope.shownGroup = group;
                    }
                };

                scope.isGroupShown = function(group) {
                    return scope.shownGroup === group;
                };
                $rootScope.$on('ORDERITEMSELECTED', function(event, itemSelected){
                    // console.log(controllers.categoryData.ingredients)
                    _.each(controllers.categoryData.ingredients, function(ingredient){
                      // console.log(ingredient.ingredient_id);
                        if(ingredient.inv_item_id !== itemSelected){
                            ingredient.selectedBackGround = "";
                        }
                    })
                })
            }
        };
    };
    orderingProductCategory.$inject = ['$rootScope', '$ionicScrollDelegate', '$ionicPopup', '$timeout', '$ionicActionSheet'];
    projectCostByte.directive('orderingProductCategory', orderingProductCategory);
})();
