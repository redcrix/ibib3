(function () {
    'use strict';
    projectCostByte.directive('ingredientPrepContent', ingredientPrepContent);

    ingredientPrepContent.$inject = ['$state','$ionicHistory', '$timeout', '$ionicPopover', 'ErrorReportingServiceOne','$ionicFilterBar','$rootScope','$ionicListDelegate','TaskCreationServiceOne','$ionicModal','CommonService','$ionicPopup','$ionicLoading'];

    function  ingredientPrepContent ($state, $ionicHistory ,$timeout, $ionicPopover, ErrorReportingServiceOne,$ionicFilterBar,$rootScope,$ionicListDelegate,TaskCreationServiceOne,$ionicModal,CommonService,$ionicPopup,$ionicLoading) {
        return {
            restrict: 'E',
              templateUrl: 'application/prep-manager/directives/ingredient-content.html',
//            template: sectionTemplate,
            scope: {
                items: '=',
                type: '='
            },
            link: function (scope, element, attribute) {
                // console.log(scope.items)
                scope.withoutRecipes = [];
                scope.withRecipes = []
                scope.displayItems = []
                let yieldUnit;
                // let filterBarInstance;
                // scope.searchItem = true;
                // scope.showSearchBtn = true;
                scope.data ={
                    searchText : ""
                }
                  function arrUnique(arr) {
                    var cleaned = [];
                    arr.forEach(function(itm) {
                        var unique = true;
                        cleaned.forEach(function(itm2) {
                            if (_.isEqual(itm, itm2)) unique = false;
                        });
                        if (unique)  cleaned.push(itm);
                    });
                    return cleaned;
                }
                scope.items = arrUnique(scope.items);
              //  var setToggle = localStorage.getItem('prepToggle');
                // console.log(setToggle)

               // scope.toggle = false;
              // scope.toggle = (setToggle == "true") ? true : false;

               scope.lastView = $ionicHistory.viewHistory().forwardView;
                if(scope.lastView){
                    if(scope.lastView.stateId.indexOf('prep') != -1){
                        console.log('coming from prep page')
                        // console.log($rootScope.prepToggle);
                        scope.toggle = ($rootScope.prepToggle == 'true') ? true : false;
                    } else {
                        console.log('coming from other page')
                        $rootScope.prepToggle = false;
                        scope.toggle = false;
                    }
                } else {
                    scope.toggle = false;
                }

                $rootScope.$on('prepresult',function(evnt,data){
                    scope.items = data;
                    checkTopggle(scope.toggle);
                })
               function checkTopggle(toggleVal){
                 // console.log(toggleVal);
                    if(toggleVal){
                        scope.displayItems = _.filter(scope.items, function(o) {
                            yieldUnit = o.yield_unit.split("-");
                            o.yield_unit = yieldUnit[0];
                            return !o.unit_cost;
                        });

                    } else{
                        scope.displayItems = _.filter(scope.items, function(o) {
                            yieldUnit = o.yield_unit.split("-");
                            o.yield_unit = yieldUnit[0];
                            return o.unit_cost;
                        });
                    }
                    // console.log(scope.displayItems);

                }
                checkTopggle(scope.toggle)


              /*  scope.displayItems = _.filter(scope.items, function(o) {
                    yieldUnit = o.yield_unit.split("-");
                    o.yield_unit = yieldUnit[0];
                    return o.unit_cost;
                }); */
                // scope.withRecipes = _.filter(scope.items, function(o) {
                //     return o.mod_cost;
                // });
                // console.log(scope.displayItems)



                // scope.showFilterBar = function() {
                    // console.log('showFilterBar')
                    // // $scope.showSearchData = true;
                    // var search_fields = ['mod_id','mod_name'];

                    //   filterBarInstance = $ionicFilterBar.show({
                    //     items: scope.items,
                    //     debounce: true,
                    //     update: function(filteredItems, filterText) {
                    //         // console.log(filterText)
                    //         // if (angular.isDefined(filterText)) {
                    //         //     _.forEach(filteredItems, function (inventoryGroup) {
                    //         //         _.forEach(inventoryGroup.ingredients, function (ingredient) {
                    //         //             var keepIngredient = false;
                    //         //             _.forEach(search_fields, function (search_field) {
                    //         //                 var textToSearch = _.get(ingredient, search_field, "");
                    //         //                 if (textToSearch != "") {
                    //         //                     if (textToSearch.toLowerCase().indexOf(filterText.toLowerCase()) != -1) {
                    //         //                         keepIngredient = true
                    //         //                     }
                    //         //                 }
                    //         //                 if (keepIngredient) {
                    //         //                     ingredient.searchHidden = false;
                    //         //                 } else {
                    //         //                     ingredient.searchHidden = true;
                    //         //                 }
                    //         //             })
                    //         //         })

                    //         //     })
                    //         // }
                    //         // else {
                    //            console.log(filteredItems)
                    //             scope.items = filteredItems

                    //         // }


                    //     }
                    // });
                // };
                scope.$watch('data.searchText', function(newVal) {
                    // console.log('search.....',newVal)
                    // $rootScope.$broadcast('search_text')
                    scope.searchIngredient = scope.data.searchText
                    // console.log('scope.searchIngredient: ',scope.searchIngredient)
                }, true);
                scope.closeSearch = function(){
                    // $rootScope.searchItem = false;
                    scope.searchItem = true;
                    // $rootScope.showSearchBtn = true;
                    scope.data.searchText = '';
                }
                scope.detectToggle = function(chkToggle){
                    // console.log("ch",chkToggle)
                    checkTopggle(chkToggle)
                }
                    // console.log(chkToggle)
                    // scope.toggle = !chkToggle
                  /*  if(chkToggle){
                        scope.displayItems = _.filter(scope.items, function(o) {
                            yieldUnit = o.yield_unit.split("-");
                            o.yield_unit = yieldUnit[0];
                            return !o.unit_cost;
                        });

                    } else{
                        scope.displayItems = _.filter(scope.items, function(o) {
                            yieldUnit = o.yield_unit.split("-");
                            o.yield_unit = yieldUnit[0];
                            return o.unit_cost;
                        });
                    } */
        var original = scope.prepItem;
        $ionicModal.fromTemplateUrl('add-prep-item-modal.html', {
          scope: scope,
          animation: 'slide-in-up',
          backdropClickToClose: false
        }).then(function(modal) {
          scope.modal = modal;
        });
        scope.openModal = function() {
          scope.modal.show();
          scope.form.addPrepItem.prepName.$touched = false;
          scope.form.addPrepItem.yieldUnit.$touched = false;
          scope.form.addPrepItem.yieldQuantity.$touched = false;
          scope.form.addPrepItem.yieldQuantity.$invalid = false;
          scope.form.addPrepItem.prepName.$invalid = false;
          scope.form.addPrepItem.yieldUnit.$invalid = false;
        };
        scope.closeModal = function(model) {
          scope.modal.hide();
          scope.form.addPrepItem.prepName.$touched = false;
          scope.form.addPrepItem.yieldUnit.$touched = false;
          scope.form.addPrepItem.yieldQuantity.$touched = false;
          scope.form.addPrepItem.yieldQuantity.$invalid = false;
          scope.form.addPrepItem.prepName.$invalid = false;
          scope.form.addPrepItem.yieldUnit.$invalid = false;
          // console.log(scope.form.addPrepItem)
        };
        CommonService.fetchIngredientPrepItems(function(data) {
              scope.yieldUnitList = data.yieldUnit;
            });

        scope.openForm = function() {
            
          scope.prepItem = {
            "name": "",
            "yieldUnit": "",
            "yieldQuantity": ""
          }

          scope.openModal();

        }
        scope.form = {
          addPrepItem: {}
        };
        $rootScope.$on('prepItemEdit',function(evnt,data){
            _.forEach(scope.items,function(selectedItem){
                if(selectedItem.prep_id == data.ingredientId){
                    var myElement = angular.element( document.querySelector( '#prep-list_'+selectedItem.prep_id ) );
                    myElement.addClass('inventory-item-selected');
                    $state.go('app.prepDetail',{ 'prepName':selectedItem.prep_name,'prepId': selectedItem.prep_id,'prepCost':selectedItem.total_cost,'prepToggle':scope.toggle,'prepUnitCost':selectedItem.unit_cost,'yield_qty':selectedItem.yield_qty,'yield_unit':selectedItem.yield_unit})
                }
            })
        })
        
        var toastMessage = function(message_text, duration) {
          if (typeof duration === 'undefined') duration = 2000;
          $ionicLoading.show({
            template: message_text,
            noBackdrop: true,
            duration: duration
          });
        }
        scope.addPrepItems = function(){
            var serviceRequestData = { "prepName" : scope.prepItem.name,
             "yieldQuantity" : parseFloat(scope.prepItem.yieldQuantity).toFixed(4),
              "yieldMeasurement" : scope.prepItem.yieldUnit }
            scope.match = false;
              scope.matchName = '';
              var matchName = _.find(scope.items, function(catName) {
                if(catName.prep_name != undefined) {
                  if (((catName.prep_name).toLowerCase() == (scope.prepItem.name).toLowerCase())) {
                    scope.match = true;
                  }
                }
              });
              if (scope.match) {
                var confirmPopup = $ionicPopup.show({
                  title: 'Add Prep Item',
                  buttons: [{
                    text: 'Ok',
                    type: 'button-bal myClass'
                  }],
                  template: '<center>There is an other item with the same name ,<br/> Please add different name!</center>',
                });

              } else {
                scope.closeModal();
                scope.prepItem={};
                scope.form.addPrepItem.prepName.$touched = false;
                scope.form.addPrepItem.yieldUnit.$touched = false;
                scope.form.addPrepItem.yieldQuantity.$touched = false;
                CommonService.addNewPrepItem(function(data) {
                    if(data.data.success == true){
                        $rootScope.$broadcast('CreatedPrepItem');
                        toastMessage("Successfully added prep item",2000)
                        checkTopggle(scope.toggle)
                    }else{
                        toastMessage("Something went wrong",2000);
                    }
                },serviceRequestData)
              }



        }

                scope.gotoModDetail = function(selectedItem){
                    var myElement = angular.element( document.querySelector( '#prep-list_'+selectedItem.prep_id ) );
                    myElement.addClass('inventory-item-selected');
                    $state.go('app.prepDetail',{ 'prepName':selectedItem.prep_name,'prepId': selectedItem.prep_id,'prepCost':selectedItem.total_cost,'prepToggle':scope.toggle,'prepUnitCost':selectedItem.unit_cost,'yield_qty':selectedItem.yield_qty,'yield_unit':selectedItem.yield_unit})
                }
                scope.errorReporting = function () {
                    scope.errorReportPopover.hide();
                    var item = scope.displayItems;
                    ErrorReportingServiceOne.showErrorReportForm({
                        'page': 'Prep Manager',
                        'component': scope.mySelectedItem.prep_name,
                        'modalName' : scope.errorReportPopover
                    }, {
                        'page': 'Prep Manager',
                        'component': 'Ingredient Name'
                    }) //TODO change component key to component_type in API
                        .then(function (result) {
                            //                                        console.log(result)
                        });

                };

                $ionicPopover.fromTemplateUrl('application/error-reporting/reportPopover.html', {
                    scope: scope
                })
                    .then(function (popover) {
                        scope.errorReportPopover = popover;
                    });

                scope.showReportPopover = function ($event,item) {
                    scope.mySelectedItem = item;
                    $event.preventDefault();
                    $event.stopPropagation();
                    scope.errorReportPopover.show($event)
                }
                var task_modal_shown = false;
                scope.taskCreation = function (items) {
                    if (!task_modal_shown){
                    task_modal_shown = TaskCreationServiceOne.showTaskCreateForm({
                        // 'page': 'Menu Performance',
                        'page': 'create task',
                        'component': items.prep_name,
                        'item': items,
                        'name': items.prep_name,
                        'cost': items.unit_cost,
                        // 'price': items.ingredientCost,
                        'type': 'menu',
                        'modalName' : scope.errorReportPopover
                    }, {
                        'page': 'Prep Manager',
                        'component': 'Menu Recipe'
                    }); //TODO change component key to component_type in API

                    task_modal_shown.then(function (result) {
                            // console.log(result)
                            task_modal_shown = false;
                        });
                    }
                };
                scope.decide = function (item) {
                    scope.taskCreation(item);
                    $ionicListDelegate.closeOptionButtons();
                };

            }
        }
    }
})();
