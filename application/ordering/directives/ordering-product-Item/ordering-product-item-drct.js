(function () {
    var orderingProductItem = function ($timeout,$rootScope){
        return {
            restrict: 'E',
            replace: true,
            scope:{},
            require: ["^orderingProductCategory", "orderingProductItem"],
            bindToController: {
                nodeData: '=nodeData',
                mode: '='
            },
            controller: function () {
                this.rowSize ={
                    name : 30,
                    last :12,
                    value :12,
                    par : 12,
                    qih :12,
                    order :15,
                }

                this.nodeData.quantityValidationPassed = true;
                this.nodeData.stageQuantity = this.nodeData.quantity;
                this.validationPassedHighlight = "";
                this.supplier_item_updated_at = new Date(parseInt(this.nodeData.last_updated_at, 10)*1000).toLocaleDateString("en-US");
                // console.log(this.supplier_item_updated_at);
                var toTitleCase = function (str)
                {
                  if(str){
                    return str.replace(/\w\S*/g, function(txt)
                    {
                      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                    });
                  }
                }

                this.supplier_name = toTitleCase(this.nodeData.supplier_name);
//                console.log(this.supplier_name);
            },
            controllerAs: 'ctrl',
            templateUrl: 'application/ordering/directives/ordering-product-Item/ordering-product-item.html',
            link: function(scope, ele, attr, controllers) {

                var saveOnValidationFail =  true;
                var testQuantity = function(quantityVal){
                    if(_.isNull(quantityVal)){
                        return true;
                    }
                    return /^[0-9.]+$/.test(quantityVal);
                }
                var quantityValidated = function(){
                    var validationStatus = testQuantity(controllers[1].nodeData.stageQuantity)
                    var wasFailedFlag = !controllers[1].nodeData.quantityValidationPassed
//                    console.log(validationStatus)
                    controllers[1].nodeData.quantityValidationPassed = validationStatus;
                    if(!validationStatus){
                       console.log("failed validation")
                    }else{
//                        console.log("passed validation")
                        controllers[1].nodeData.quantity = controllers[1].nodeData.stageQuantity;
                        if(wasFailedFlag){
                            $timeout(function(){controllers[1].validationPassedHighlight = "validation-pass-green";},0)
                            $timeout(function(){controllers[1].validationPassedHighlight = ""; },1000)
                        }
                    }
                    return validationStatus;
                }

              controllers[1].valueUpdated = function (reqConfig,value) {
                    $rootScope.stageQtyChanged = true;
                    value = parseFloat(value);
                    // console.log("value after parseFloat : ", value);
                    this.nodeData.stageQuantity = (isNaN(value)) ? null : parseFloat(value.toFixed(2))
                    this.nodeData.quantity = (isNaN(value)) ? null : parseFloat(value.toFixed(2))

                    if(angular.isDefined(reqConfig)){
                      quantityValidated();
                    }
                    if(saveOnValidationFail){
                        controllers[0].updateCategoryValue(reqConfig);
                    }
              };

                // controllers[1].valueUpdated();

                 scope.setFocusToInput = function(){
                    return $timeout(function() {
                      console.log(controllers[1].nodeData.inv_item_id);
                        controllers[1].nodeData.selectedBackGround = "inventory-item-selected";
                        $timeout(function(){$rootScope.$broadcast('ORDERITEMSELECTED', controllers[1].nodeData.inv_item_id)});
                        // if (controllers[1].mode === 'edit' && controllers[1].filterView != 'PAR') {
                        //     var inputElement = ele.find('input')[0];
                        //     $timeout(function() {
                        //         inputElement.focus()
                        //     }, 0);
                        // }
                    }, 0)
                }


            }
        };
    };
    orderingProductItem.$inject = ['$timeout','$rootScope'];
    projectCostByte.directive('orderingProductItem', orderingProductItem);
})();
