(function () {
    var plItem = function ($timeout,$ionicModal,$rootScope,CommonService){
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            scope:{selectedPeriodWeek:'=selectedPeriodWeek'},
            require: ["^?plCategory", "plItem"],
            bindToController: {
                nodeData: '=nodeData',
                selectedPeriodWeek:'=selectedPeriodWeek',
            },
            controller: function () {
                this.rowSize ={
                    name : 25,
                    price :35,
                    qty : 19,
                    units :7,
                    value :19,
                    budget: 20
                }
            },
            controllerAs: 'ctrl',
            templateUrl: 'application/pl-tracker/directives/pl-item/pl-item.html',
            link: function(scope, ele, attr, controllers) {
                var periodWeek=$rootScope.selectedPeriodWeek;
                scope.spinnerHide=false;
                // console.log("periodWeek",periodWeek);
                // console.log("controllers",controllers[0].categoryData.name);
                if(controllers[0].categoryData.name!=='COGS'){
                    scope.datareceived=true;
                    scope.isCogsData = false;
                }else{
                    scope.isCogsData = true;
                    scope.datareceived=false;
                }
               
                var obj={
                        "Invoices": [
                          {
                        "statValue": 0,
                        "invoiceId": "05-915877718"
                        },
                          {
                        "statValue": 80.3,
                        "invoiceId": "183622384"
                        }
                        ],
                        "Ending_inventory": 0,
                        "Starting_inventory": 0,
                        "Food_cost": 80.3,
                        } 
                scope.cogsData={};
               var fetchCogsItems= function(details){
                var invInfo = {}
                    invInfo.dateRange = $rootScope.selectedPeriodWeek;
                    invInfo.item_name = details.item_name;
                    var response =function(data){
                        console.log("data",data);
                        scope.cogsData=data;
                        scope.spinnerHide=true;
                    }
                    CommonService.getCogsItems(response, invInfo);
               }
            scope.showItemSummary= function(item) { 
                    console.log(controllers[0]);
                    scope.name=item.item_name;
                    console.log("showItemSummary : ",item);
                    fetchCogsItems(item);
                    $timeout(function() {
                        $ionicModal.fromTemplateUrl('application/pl-tracker/directives/pl-item/cogs.html', {
                            scope: scope,
                            animation: 'slide-in-up',
                            backdropClickToClose: false
                        }).then(function(modal) {         
                            scope.categoryModal = modal;
                            console.log(controllers[1].nodeData);
                            scope.categoryModal.show();
                        });
                    }, 10);
                } 

                scope.closeCategoryModal = function(model) {
                  console.log('closeUnitPopup2Modal')
                  scope.locationAccepted = true;
                  scope.categoryModal.hide();
                };
                
            }
        };
    };
    plItem.$inject = ['$timeout','$ionicModal','$rootScope','CommonService'];
    projectCostByte.directive('plItem', plItem);
})();
