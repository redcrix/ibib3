(function () {
    projectCostByte.controller('configOptimizerMenuEnggCtrl', configOptimizerMenuEnggCtrl);

    configOptimizerMenuEnggCtrl.$inject = ['$q', '$scope', '$state', '$stateParams', '$timeout', 'inventoryItemsSvc', '$rootScope', 'parameters', 'CommonService', '$ionicPopup', '$ionicSlideBoxDelegate'];

    function configOptimizerMenuEnggCtrl($q, $scope, $state, $stateParams, $timeout, inventoryItemsSvc, $rootScope, parameters, CommonService, $ionicPopup, $ionicSlideBoxDelegate) {


        $scope.dataReceived = false;

        // $scope.openModal();
        // console.log('enter configOptimizerCtrl');
        // console.log(parameters);
        $scope.configSliders = {};



        $scope.$on('config-category-changed', function (event, dataIndex) {
            // $scope.configModifierItem.ingredientInventoryCategory = $scope.categoryOptions[dataIndex].label
        })
        $scope.$on('config-menuItem-changed', function (event, dataIndex) {
            // $scope.configModifierItem.ingredientInventoryCategory = $scope.categoryOptions[dataIndex].label
        })


        $scope.saveButtonText = 'Save Configuration';
        $scope.saveButtonColor = 'app-theme-color';

        CommonService.getsupplierItemConfigEdit(parameters.menuItem,function(res){

                // categoryOptions
                $scope.categoryOptions = res.menuCategoryOptions;
                // console.log('$scope.categoryOptions: '+JSON.stringify($scope.categoryOptions));
                // console.log('parameters.category: ',parameters.category);
                $scope.configSliders.categorySlider = _.findIndex($scope.categoryOptions, ['key' ,parameters.category]);
                // console.log('$scope.configSliders.categorySlider: ',$scope.configSliders.categorySlider);

                // menuSectionOptions
                var myArray = [];
                var checkItem = _.each(res.menuSectionOptions,  function(options){
                  var cnt = _.sumBy(myArray, function(o) { return o.label.toUpperCase() == options.label.toUpperCase() || o.label.toLowerCase() == options.label.toLowerCase() ? 1 : 0; });
                  if(!cnt && options.label) {
                    myArray.push(options);
                  }
                });
                console.log(myArray.length)
                $scope.menuSectionOptions = myArray;
                // $scope.menuSectionOptions = res.menuSectionOptions;
                // console.log('$scope.menuSectionOptions: '+JSON.stringify($scope.menuSectionOptions));
                $scope.configSliders.menuSectionSlider = _.findIndex($scope.menuSectionOptions, ['label' ,parameters.sectionName]);
                // console.log('parameters.sectionName: ',parameters.sectionName);
                // console.log('$scope.configSliders.menuSectionSlider: ',$scope.configSliders.menuSectionSlider);

                // menuType
                $scope.menuTypeOptions = res.menuTypeOptions;
                // console.log('$scope.menuTypeOptions: '+JSON.stringify($scope.menuTypeOptions));
                $scope.configSliders.menuTypeSlider = _.findIndex($scope.menuTypeOptions, ['key' ,parameters.menuType]);


                $scope.globalMenuItemId = parameters.menuItem;
                $scope.name = parameters.menuItemName;

                $scope.dataReceived = true;
        })

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

        $scope.confirmSave = function () {
            $scope.catModified = false;
            $scope.menuSectionModified = false;
            if($scope.configSliders.categorySlider != _.findIndex($scope.categoryOptions, ['key' ,parameters.category])){
                $scope.categoryOptions[$scope.configSliders.categorySlider].selected = true;
                // $scope.categoryOptions[_.findIndex($scope.categoryOptions, ['key' ,parameters.category])].selected = false;
                for(var i=0; i<$scope.categoryOptions.length; i++){
                    if($scope.configSliders.categorySlider != i){
                        $scope.categoryOptions[i].selected = false;
                    }
                }

                $scope.catModified = true;
            }

            if($scope.configSliders.menuSectionSlider != _.findIndex($scope.menuSectionOptions, ['label' ,parameters.sectionName])){
                $scope.menuSectionOptions[$scope.configSliders.menuSectionSlider].selected = true;
                // $scope.menuSectionOptions[_.findIndex($scope.menuSectionOptions, ['label' ,parameters.sectionName])].selected = false;
                for(var i=0; i<$scope.menuSectionOptions.length; i++){
                    if($scope.configSliders.menuSectionSlider != i){
                        $scope.menuSectionOptions[i].selected = false;
                    }
                }

                $scope.menuSectionModified = true;
            }
            // console.log('$scope.catModified: ',$scope.catModified);
            // console.log('$scope.menuSectionModified: ',$scope.menuSectionModified);
            if($scope.catModified || $scope.menuSectionModified){
                confirmation_popup('Confirm Configuration Changes',
                    'Are you sure you want to save the changes to the supplier item configuration?')
                    .then(function (confirmed) {
                        if (confirmed) {
                            $scope.saveButtonText = '   Saving...';
                            $scope.saveButtonColor = 'app-theme-color2'
                            sendConfigMod()
                        }else{
                            $scope.saveButtonColor = 'app-theme-color'
                        }
                    })
            }else {
                var modificationPopup = $ionicPopup.confirm({
                    title: 'Attention!',
                    template: '<center>There is nothing to change</center>',
                    buttons: [

                        {
                            text: '<b>Ok</b>',
                            type: 'button-bal',
                            onTap: function (e) {
                                return true;
                            }
                        }
                    ]
                });
            }
        };

        var sendConfigMod = function () {
            console.log('Sending config modification');

            var sendModified = {
                "menuSectionOptions": $scope.menuSectionOptions,
                "menuTypeOptions": $scope.menuTypeOptions,
                "menuCategoryOptions": $scope.categoryOptions,
                "globalMenuItemId": $scope.globalMenuItemId,
                "name": $scope.name
            }
            // console.log('sendModified: '+JSON.stringify(sendModified));
            CommonService.setModifiedMenuItemConfig(sendModified,function(modificationDone){
                // console.log('modificationDone: ',modificationDone);

                if(modificationDone.status == 200){
                    console.log('config saved');
                    $scope.saveButtonText = ' '+$scope.saveButtonText+'.';
                    $scope.closeModal({
                        'modal': 'closed',
                        'config_saved': true,
                        'new_config': sendModified
                    })
                }
            });
        };


        // used when user cancels
        $scope.closeModalCtrl = function (result) {
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



    }
})();
