(function() {
  'use strict';

  projectCostByte.directive('marginoptimizeringredientitem', marginoptimizeringredientitem);
  marginoptimizeringredientitem.$inject = ['Utils', '$ionicListDelegate', '$timeout', 'DashboardTasksService', '$ionicLoading', '$ionicPopup', 'MarginOptimizerServiceOne', 'TaskCreationServiceOne', '$q', '$rootScope', '$ionicScrollDelegate', '$ionicPopover', 'ErrorReportingServiceOne', 'appModalService', 'menuPerformanceService', 'CommonService'];

  projectCostByte.directive('marginoptimizeringredientlist', marginoptimizeringredientlist);
  marginoptimizeringredientlist.$inject = ['Utils', 'MarginOptimizerServiceOne', '$rootScope', '$ionicScrollDelegate', 'CommonService', '$timeout', '$ionicLoading', 'menuPerformanceService', '$ionicPopup'];

  projectCostByte.directive('ingredientdetaileditems', ingredientdetaileditems);
  ingredientdetaileditems.$inject = ['$ionicScrollDelegate', 'MarginOptimizerService'];

  projectCostByte.directive('limitTo', limitTo);
  limitTo.$inject = ['$ionicLoading', '$rootScope'];

  function marginoptimizeringredientitem(Utils, $ionicListDelegate, $timeout, DashboardTasksService, $ionicLoading, $ionicPopup, MarginOptimizerServiceOne, TaskCreationServiceOne, $q, $rootScope, $ionicScrollDelegate, $ionicPopover, ErrorReportingServiceOne, appModalService, menuPerformanceService, CommonService) {
    return {
      restrict: 'E',
      templateUrl: 'application/margin-optimizer/directives/ingredient/ingredientItemDirective.html',
      // templateUrl: 'menuPerformanceIngredientItemTemplate',
      // template: ingredientItemTemplate,
      scope: {
        ingredients: '=',
        ifeven: '=',
        itemparams: '=',
        unitlist: '=',
        inglist: '=',
      },
      link: function(scope, element, attribute) {
        scope.$root.locationAccepted = true;
        $rootScope.qtyUpdated = false;
        scope.optval = true;
        $rootScope.$on('iseditmodeon',function(evnt){
          scope.ingredient.isItemExpanded = false
        })
        scope.ingredient = angular.copy(scope.ingredients);
        scope.ingItemIdList = []
        scope.ingredient.isItemExpanded = false;
        _.forEach(scope.inglist, function(ing) {
          // ing.isItemExpanded = false;
          ing.portion = ing.ingredientQuantity;
          ing.unit = ing.ingredientUnit;
          scope.ingItemIdList.push(ing.ingredientId)
          // ing.isDelete = false;

        });

        function arrUnique(arr) {
          var cleaned = [];
          arr.forEach(function(itm) {
            var unique = true;
            cleaned.forEach(function(itm2) {
              if (_.isEqual(itm, itm2)) unique = false;
            });
            if (unique) cleaned.push(itm);
          });
          return cleaned;
        }

        scope.setSupplier = function(supplier) {
          // console.log('=============== setSupplier =============');
          _.forEach(scope.inglist, function(ing, i) {
            ing.supList = [];
            ing.buttonColor = false;

            _.forEach(supplier, function(sup, j) {
              if (ing.ingredientId == sup.Inv_item_id) {
                // console.log(i);
                ing.supList.push(sup);
                ing.buttonColor = true;
                ing.supList = arrUnique(ing.supList)
              }
            });

          });
          // console.log(scope.inglist);
          // console.log(scope.moddatagroup.modData);
          if (scope.moddatagroup.modData.length != 0) {
            _.forEach(scope.moddatagroup.modData, function(mod) {
              mod.supList = [];
              _.forEach(supplier, function(sup, j) {
                if (mod.ingredientId == sup.Inv_item_id) {
                  // console.log(i);
                  mod.supList.push(sup);
                  mod.buttonColor = true;
                  mod.supList = arrUnique(mod.supList)
                }
              });
              // console.log(supplier);
            })
          }
        }

        // scope.setSupplier(scope.supplierlist)
        scope.fetchSupplier = function() {
          console.log('------------ ********** fetchSupplierItemWeb ******** -----------');
          CommonService.fetchSupplierItemWeb(function(response) {
            scope.supllierList = response.data.data;
            scope.setSupplier(scope.supllierList);
          }, scope.ingItemIdList);
        }
        // scope.qtyUpdatedIng = [];
        // scope.editMode = false;

        // console.log(scope.ingredients);
        // scope.fetchSupplier();
        if (ionic.Platform.platform() != 'android' && ionic.Platform.platform() != 'ios') $rootScope.showIds = true;

        var toastMessage = function(message_text, duration) {
          if (typeof duration === 'undefined') duration = 2000;
          $ionicLoading.show({
            template: message_text,
            noBackdrop: true,
            duration: duration
          });
        }
        scope.toggleGrp = function(grp) {
          grp.isItemExpanded = !grp.isItemExpanded;
          console.log("grp",angular.copy(grp))
        }

        function addTask(source_name, decision, item, affected_name) {
          var task = create_task(source_name, decision, item, affected_name)

          DashboardTasksService.addTask(addTaskResponseHandler, task)
          toastMessage("Task added : " + decision + " of " + affected_name, 1200)
        }

        scope.deleteIngList = [];
        scope.deleteIngOrPrep = function(ingredient) {
          // console.log(ingredient,scope.itemparams.recipeId);
          // ingredient.isDelete = true;

          var confirmPopup = $ionicPopup.confirm({
            title: 'Delete Item',
            template: 'Do you want to delete the item ?',
            okText: "Ok",
            okType: "button-balanced",
          });
          confirmPopup.then(function(res) {
            if (res) {
              // console.log(scope.inglist);
              $rootScope.$broadcast('DELETEINGFROMLIST', ingredient.ingredientId, scope.inglist);
            } else {}
            // $ionicListDelegate.closeOptionButtons();
          });


        }

        function pushAndUpdateIng(qty, value, recipeId) {
          // console.log(value);
          scope.existLocal.push({
            "portion": qty,
            "ingredientName": value.ingredientName,
            "ingredientId": value.ingredientId,
            "unit": value.ingredientUnit,
            // "recipeId": recipeId,
            "ingredientType": value.ingredientType
            // "ingredientGroupId": value.menuItem
          });
          // console.log(scope.existLocal);
          menuPerformanceService.setIngList(scope.existLocal);
        }

        function digits_count(n) {
          var count = 0;
          if (n > 0) ++count;

          while (n / 10 >= 1) {
            n /= 10;
            ++count;
          }

          return count;
        }

        scope.ingQtyUpdated = function(value) {
          // console.log('ingQtyUpdated: ', value);
          // $rootScope.disableSave = false;
          let noLength = digits_count(value.ingredientQuantity);
          // console.log('noLength: ', noLength);
          if (noLength > 4) {
            $rootScope.disableSave = true;
            toastMessage('Portion should be minimum of four digits.');
          } else if (value.ingredientQuantity < 0) {
            value.ingredientQuantity = null;
            toastMessage("Portion cannot be a negative value.", 2000);
            $rootScope.disableSave = true;
          } else if (noLength == 0) {
            toastMessage('Portion should not be blank or zero.');
            $rootScope.disableSave = true;
          } else {
            $rootScope.disableSave = false;
            $rootScope.objUpdated = true;
            // console.log($rootScope.objUpdated);
            let ingQty = parseFloat(value.ingredientQuantity);
            // console.log(ingQty);
            scope.ingredient.ingredientQuantity = (isNaN(ingQty)) ? null : parseFloat(ingQty.toFixed(4));
            let updatedQty = scope.ingredient.ingredientQuantity;
            // scope.ingredient.ingredientUnit
            scope.existLocal = menuPerformanceService.getIngList(scope.qtyUpdatedIng);
            if (scope.existLocal.length) {
              // console.log(scope.existLocal);
              let exist = _.findIndex(scope.existLocal, function(o) {
                return o.ingredientId == value.ingredientId;
              });
              // console.log(exist);
              if (exist >= 0) {
                scope.existLocal.shift(exist);
                // console.log(scope.existLocal);
                if (updatedQty != null) pushAndUpdateIng(scope.ingredient.ingredientQuantity, value, scope.itemparams.recipeId);
              } else {
                if (updatedQty != null) pushAndUpdateIng(scope.ingredient.ingredientQuantity, value, scope.itemparams.recipeId);
              }

            } else {
              if (updatedQty != null) pushAndUpdateIng(scope.ingredient.ingredientQuantity, value, scope.itemparams.recipeId);
            }
            if (scope.existLocal.length) {
              $rootScope.qtyUpdated = true;
            }
          }
        }

        function fetchMenuItemIngredientsList(ingList) {
          // console.log(scope.inglist);
          // scope.ingredientList = ingList.ingredients.ingredients[0];
          scope.unitList = ingList.units;


          // console.log(scope.unitList);
          // let matchName = _.filter(scope.ingredientList, function(ing) {
          //   return ing.ingredientName == "Create New Ingredient"
          // })
          // // console.log(matchName);
          // if (matchName.length == 0) {
          //   scope.ingredientList.unshift({
          //     'ingredientId': "",
          //     'ingredientName': "Create New Ingredient",
          //   });
          // }
        }
        // MarginOptimizerServiceOne.getIngredientList(fetchMenuItemIngredientsList);

        function create_task(source_name, decision, item, affected_name) {
          return {
            'item_name': affected_name,
            'decision': decision,
            'source_name': source_name,
            'source': JSON.stringify(item),
            'source_link': `app.marginoptimizermenuitem2({sectionName:'` + item.sectionName + `',
                                          menuName:'` + item.menuName + `',
                                          categoryName:'` + item.categoryName + `',
                                          itemName:'` + item.itemName + `', })`
          }
        }

        var addTaskResponseHandler = function(res) {
          // console.log(res)
        }
        var modal_shown = false;
        scope.showCoversion = function(item) {
          var modal_shown = false;
          // console.log("showCoversion called");
          if (!modal_shown) {
            // console.log("showing conversion");
            modal_shown = appModalService.show('application/menu-engineering/directives/menuItem/conversionFactor.html', 'conversionFactorCtrl', item)
          }
          return modal_shown

        }

        function confirmPopup(decision_type, affected_name) {

          return $ionicPopup.confirm({
            scope: scope,
            title: 'Add Task',
            template: '<div>Are you sure you want to ' + decision_type + ' of ' + affected_name + '?</div>' +
              '<div class="row checkbox"><div class="col col-20"><input type="checkbox" ng-model="popupnoshow.pref"></div><div class="col" style="padding-top: 10px">Do not ask me again</div></div>'
          });
        }

        var toastMessage = function(message_text, duration) {
          if (typeof duration === 'undefined') duration = 1500;
          $ionicLoading.show({
            template: message_text,
            noBackdrop: true,
            duration: duration
          });
        }
        // function to add decision
        // scope.decide = function (decision_source, decision, item) {
        //     var affected_name = item.ingredientName;
        //     var disable_confirmation_popup_tasks = Utils.getLocalValue('disable_confirmation_popup_tasks', false)
        //     if (!disable_confirmation_popup_tasks) {
        //         scope.popupnoshow = {};
        //         confirmPopup(decision, affected_name).then(function (user_response) {
        //             if (scope.popupnoshow.pref) {
        //                 Utils.setLocalValue('disable_confirmation_popup_tasks', true);
        //             }
        //             if (user_response) {
        //                 addTask(decision_source, decision, item, affected_name);
        //             }
        //         });
        //     } else {
        //         addTask(decision_source, decision, item, affected_name);
        //     }
        //     $ionicListDelegate.closeOptionButtons();
        // }

        scope.decide = function(item) {
          // var affected_name = item.menuItemName;
          // var disable_confirmation_popup_tasks = Utils.getLocalValue('disable_confirmation_popup_tasks', false)
          // if (!disable_confirmation_popup_tasks) {
          //     scope.popupnoshow = {};
          //     confirmPopup(decision, affected_name).then(function (user_response) {
          //         if (scope.popupnoshow.pref) {
          //             Utils.setLocalValue('disable_confirmation_popup_tasks', true);
          //         }
          //         if (user_response) {
          //             addTask(decision_source, decision, item, affected_name);
          //             // scope.taskCreation();
          //         }
          //     });
          // } else {
          //     addTask(decision_source, decision, item, affected_name);
          //     // scope.taskCreation();
          // }


          // console.log(affected_name);
          // $rootScope.taskData = {
          //     "decision_source": decision_source,
          //     "decision": decision,
          //     "item": item,
          //     "affected_name": affected_name
          // };
          scope.taskCreation(item);
          $ionicListDelegate.closeOptionButtons();
        };

        var task_modal_shown = false;
        scope.taskCreation = function(items) {
          if (!task_modal_shown) {
            task_modal_shown = TaskCreationServiceOne.showTaskCreateForm({
              // 'page': 'Menu Performance',
              'page': 'create task',
              'component': items.ingredientName,
              'item': items,
              'name': items.ingredientName,
              'cost': items.unitCost,
              'price': items.ingredientCost,
              'type': 'ingredient',
              'portionUnit': items.ingredientUnit,
              'modalName': scope.errorReportPopover
            }, {
              'page': 'Menu Performance',
              'component': 'Menu Recipe'
            }); //TODO change component key to component_type in API

            task_modal_shown.then(function(result) {
              // console.log(result)
              task_modal_shown = false;
            });
          }
        };


        // scope.$on('ENTERINGREDIENTEDITMODE', function (event, menuItemSelection) {
        //     // get INGREDIENT to edit
        //     scope.menuItemSelection = menuItemSelection;
        //     MarginOptimizerServiceOne.getMenuIngredientToEdit(fetchMenuItemIngredientToEditRH,
        //         menuItemSelection,
        //         scope.ingredient);
        //
        // })


        // var fetchMenuItemIngredientToEditRH = function (ingredientEditData) {
        //     $timeout(function () {
        //         ingredientEditData.stageIngredientQuantity = angular.copy(ingredientEditData.ingredientQuantity);
        //         ingredientEditData.stageQuantityValidation = testQuantity(ingredientEditData.stageIngredientQuantity)
        //         scope.ingredientEdit = ingredientEditData;
        //         // console.log(scope.ingredientEdit)
        //     });
        //     $timeout(function () {
        //         scope.editMode = true;
        //     });
        // }


        scope.$on('EXITEDITMODE', function(event) {
          // exit from edit mode
          // console.log('exit from edit mode')
          scope.resetIngredientQuantity()
          scope.editMode = false;
        })
        let ingredients = []
        scope.$on('SAVEANDEXITEDITMODE', function(event) {
          // exit from edit mode
          // console.log('.....SAVEANDEXITEDITMODE......',scope.moddatagroup);

          // "ingredients" : [
          //   { "ingredientId" : "INV248", "unit" : "cup", "portion" : 10, "ingredientName" : "Test", "recipeId" : "RECIPE43" }]


          // if(scope.moddatagroup){
          //   let updated = _.find(scope.moddatagroup.modData, function (grp) {
          //     return grp.isUpdated;
          //   });
          //   if(updated){
          //     updated.ingredientUnit = updated.current_selected_unit;
          //     console.log(updated);
          //   }
          // }

          // if (scope.ingredientEdit.stageQuantityValidation) {
          //     // console.log('save changes and exit from edit mode')
          //     scope.ingredientEdit.ingredientQuantity = scope.ingredientEdit.stageIngredientQuantity
          //     scope.$emit('SAVEINGREDIENTS')
          //     scope.editMode = false;
          // } else {
          //
          //     toastMessage('Please correct invalid quantities before saving.')
          //     $timeout(function () {
          //         scope.$emit('RESETSAVEINGREDIENTSCOUNTER')
          //     });
          // }

        });


        scope.resetIngredientQuantity = function() {
          scope.ingredientEdit.stageIngredientQuantity = scope.ingredientEdit.ingredientQuantity;
          scope.validateQuantity()
        }

        var toastMessage = function(message_text, duration) {
          if (typeof duration === 'undefined') duration = 2000;
          $ionicLoading.show({
            template: message_text,
            noBackdrop: true,
            duration: duration
          });
        }


        function updateDisplayIngredient() {
          return $q(function(resolve, reject) {
            var ingredient = scope.ingredient;
            var ingredientEdit = scope.ingredientEdit;
            if (ingredientEdit.stageIngredientQuantity != null) {
              // if (ingredient.ingredientQuantity!=null){
              var unitCost = ingredient.unitCost;
              // console.log("unitCost : "+ unitCost)
              scope.ingredient.ingredientCost = unitCost * ingredientEdit.stageIngredientQuantity;
              scope.ingredient.ingredientQuantity = ingredientEdit.stageIngredientQuantity;
              // console.log('New ingredint cost: '+ scope.ingredient.ingredientCost )
              // }
            }

            resolve(true)
          })
        }

        var testQuantity = function(quantityVal) {
          if (_.isNull(quantityVal)) {
            return false;
          }
          return /^[0-9.]+$/.test(quantityVal);
        }

        scope.validateQuantity = function() {
          // console.log('Validation fired')
          var ingredientEdit = scope.ingredientEdit;
          var validationStatus = testQuantity(ingredientEdit.stageIngredientQuantity)
          var wasFailedFlag = !ingredientEdit.stageQuantityValidation

          if (validationStatus) {
            updateDisplayIngredient().then(function(res) {
              if (res) {
                MarginOptimizerServiceOne.updateTotalIngredientCost(scope.menuItemSelection)
                  .then(function(updatedMenuItem) {

                    // console.log('Updated menu item callback')
                    $rootScope.$broadcast('UPDATEMENUITEMCOST', updatedMenuItem)
                    // console.log(res2)
                  })
              }
            })

          } else {
            $timeout(function() {
              scope.ingredientEdit.validationPassedHighlight = 'validation-failed-highlight';
            }, 0)
          }

          scope.ingredientEdit.stageQuantityValidation = validationStatus;
          // console.log(wasFailedFlag, validationStatus)
          if (wasFailedFlag) {
            $timeout(function() {
              scope.ingredientEdit.validationPassedHighlight = "validation-pass-green";
            }, 0)
            $timeout(function() {
              scope.ingredientEdit.validationPassedHighlight = "";
            }, 1000)
          }
        }

        // scope.togglerMessage = ' Detailed Price & Cost Info '
        if (!(angular.isUndefined(scope.getdataoninit))) {
          if (scope.getdataoninit) {
            if (!(angular.isUndefined(scope.item))) {
              fetchDetailedModsData(scope.item.menuItem);
            }
          }
        }

        scope.toggleGroup = function(group) {
          console.log('toggleGroup called..')
          $timeout(function() {
            if (!group.isExpanded) {
              scope.showItemsLoading = true;
            }
            // console.log(scope.showItemsLoading)
          }, 10)

          $timeout(function() {
            if (!angular.isUndefined(group)) {
              group.show = !group.show;
              scope.showItemsLoading = false; // search fixed
              $ionicScrollDelegate.resize();
            }
            // console.log(scope.showItemsLoading)
          }, 10)

        };

        scope.isGroupShown = function(group) {
          // console.log(group);
          if (angular.isUndefined(group)) {
            return false;
          } else {
            return group.show;
          }
        };
        scope.moddatagroup = {
              'show': false,
              'modsAvailable': false,
              'modData': [],
              'modDataTotal': null
            };
        scope.getModdata = function(type) {
          // console.log(scope.ingredient);
          console.log('------------------ getModdata -----------');
          // console.log(scope.moddatagroup.show);
          if (type === "PREP") {
        //    fetchDetailedModsData(scope.ingredient.ingredientId);
            if (angular.isUndefined(scope.moddatagroup)) {
              scope.toggleGroup(scope.moddatagroup);
              // console.log("inside undefined");
              // fetchDetailedModsData(scope.ingredient.ingredientId)
            } else {
              if (!scope.moddatagroup.show)
                fetchDetailedModsData(scope.ingredient.ingredientId)
              else
                scope.moddatagroup.show = !scope.moddatagroup.show;
            }
          } else {
            scope.moddatagroup = {
              'show': false,
              'modsAvailable': false,
              'modData': [],
              'modDataTotal': null
            };
          }
        };

        function fetchDetailedModsData(menuitem_id) {
          // console.log(menuitem_id);
          scope.togglerMessage = ' Fetching Data... ';
          scope.$broadcast('MOP_BUSY');
          MarginOptimizerServiceOne.getSelectedRecipeIngredientsNew(fetchMenuItemIngredientsRH, menuitem_id);
        }

        var sumOf = function(data, key) {
          if (angular.isUndefined(data) && angular.isUndefined(key)) {
            return 0;
          } else {
            var sum = 0;
            angular.forEach(data, function(value) {
              sum = sum + value[key];
            });
            return sum;
          }
        };
        //Response handler for fetching Menu Item price and cost Data
        function fetchMenuItemIngredientsRH(menuitem_mods_data) {
          // console.log('fetchMenuItemIngredientsRH****', menuitem_mods_data);
          // console.log(menuitem_mods_data);
          if (menuitem_mods_data.length > 0) {
            //console.log(menuitem_mods_data)
            var modDataTotal = {
              'name': 'Total'
            };
            for (var i = 0; i < menuitem_mods_data.length; i++) {
              menuitem_mods_data[i]['globalModQuantity'] = parseInt(menuitem_mods_data[i]['globalModQuantity']);
            }

            var fieldNames = ['ingredientCost']
            _.forEach(fieldNames, function(fieldName) {
              modDataTotal[fieldName] = sumOf(menuitem_mods_data, fieldName);
            });


            // console.log(menuitem_mods_data);
            scope.moddatagroup = {
              'show': true,
              'modsAvailable': true,
              'modData': menuitem_mods_data.items,
              'modDataTotal': modDataTotal,
              'unit_list': menuitem_mods_data.unit_list
            };
            $ionicScrollDelegate.resize();
            scope.$broadcast('MOP_FREE');
            // scope.togglerMessage = ' Detailed Price & Cost Info '
          } else {
            scope.moddatagroup = {
              'show': true,
              'modsAvailable': false,
              'modData': menuitem_mods_data.items,
              'modDataTotal': null,
              'unit_list': menuitem_mods_data.unit_list
            };
            // scope.togglerMessage = ' Detailed Price & Cost Info not available '
          }
          if (scope.moddatagroup.modData.length) {
            _.forEach(scope.moddatagroup.modData, function(grp) {
              grp.isUpdated = false;
              grp.current_selected_unit = grp.ingredientUnit;
              // console.log(grp.ingredientCost);
              scope.ingItemIdList.push(grp.ingredientId);
              grp.ingredientCost = parseFloat(grp.ingredientCost.toFixed(4));
            });
          }
          scope.fetchSupplier();
          // console.log(scope.moddatagroup);
        }




        // scope.isEditIngGroupShown = function (group,ingDataLength) {
        //   console.log(ingDataLength,$rootScope.ingCnt);
        //   if(ingDataLength == $rootScope.ingCnt)
        //     $rootScope.$broadcast('MOP_FREE');
        //     if (angular.isUndefined(group)) {
        //         return false;
        //     } else {
        //         return group.show;
        //     }
        // };

        // function fetchMenuItemEditIngredientsRH(menuitem_mods_data) {
        //   // console.log('fetchMenuItemEditIngredientsRH****',menuitem_mods_data);
        //     // console.log(menuitem_mods_data);
        //     if (menuitem_mods_data.length > 0) {
        //         //console.log(menuitem_mods_data)
        //         var modDataTotal = {
        //             'name': 'Total'
        //         };
        //         for (var i = 0; i < menuitem_mods_data.length; i++) {
        //             menuitem_mods_data[i]['globalModQuantity'] = parseInt(menuitem_mods_data[i]['globalModQuantity']);
        //         }
        //
        //         var fieldNames = ['ingredientCost']
        //         _.forEach(fieldNames, function (fieldName) {
        //             modDataTotal[fieldName] = sumOf(menuitem_mods_data, fieldName);
        //         });
        //
        //         scope.moddatagroup = {
        //             'show': true,
        //             'modsAvailable': true,
        //             'modData': menuitem_mods_data.items,
        //             'modDataOptions': menuitem_mods_data.items,
        //             'ingredient_list': menuitem_mods_data.ingredient_list,
        //             'modDataTotal': modDataTotal
        //         };
        //         $ionicScrollDelegate.resize();
        //         // $rootScope.$broadcast('MOP_FREE');
        //         // scope.togglerMessage = ' Detailed Price & Cost Info '
        //         // scope.isGroupShown(scope.moddatagroup)
        //     } else {
        //         scope.moddatagroup = {
        //             'show': true,
        //             'modsAvailable': false,
        //             'modData': menuitem_mods_data.items,
        //             'modDataOptions': menuitem_mods_data.items,
        //             'ingredient_list': menuitem_mods_data.ingredient_list,
        //             'modDataTotal': null
        //         };
        //         // scope.isGroupShown(scope.moddatagroup)
        //         // scope.togglerMessage = ' Detailed Price & Cost Info not available '
        //
        //     }
        //     // console.log(scope.moddatagroup);
        //     if(scope.moddatagroup.modData.length){
        //       _.forEach(scope.moddatagroup.modData, function (grp) {
        //         // console.log(grp);
        //         // grp.selectedItemId =  grp;
        //         grp.isUpdated = false;
        //       });
        //     }
        //
        //       // console.log(scope.ingDataLength,$rootScope.ingCnt);
        //       // if(scope.ingDataLength == $rootScope.ingCnt)
        //       //   $rootScope.$broadcast('MOP_FREE');
        // }
        //
        // scope.current_selected = {};
        // scope.shoutLoud = function(newValue, oldValue){
        //   // console.log('scope.current_selected: ',scope.current_selected)
        //   console.log('oldValue: ',oldValue);
        //   console.log('newValue: ',newValue);
        //
        //   scope.current_selected.selectedItemId = newValue ;
        // };

        // scope.setItem = function(item, index){
        //   var clicked ;
        //   // console.log(item);
        //   scope.my_map = 'item_'+index;
        //   clicked = scope.my_map;
        //   scope.current_selected = item;
        //     $timeout(function(){
        //        angular.element(document.querySelectorAll('#'+clicked)).triggerHandler('click');
        //     },200);
        // }

        scope.itemEdited = function(item) {
          // console.log(item);
          item.isUpdated = true;
          $rootScope.isEditMode = true;
          scope.ingredientId = item.ingredientId;
        }

        // scope.$on('ENTEREDITMODE', function (event, menuItemSelection,ingDataLength) {
        //   // console.log(ingDataLength);
        //   scope.allowEditIng = true;
        //   scope.ingDataLength = ingDataLength;
        //   $rootScope.ingCnt++;
        //
        //   MarginOptimizerServiceOne.fetchMarginOptimizerMenuItemEditIngredientsV2(fetchMenuItemEditIngredientsRH, scope.ingredient.ingredientId);
        // });

        scope.errorReporting = function() {
          scope.errorReportPopover.hide();
          var item = scope.ingredient;
          // console.log("item: ",item);
          ErrorReportingServiceOne.showErrorReportForm({
              'page': 'Recipe',
              'component': item.ingredientName,
              'modalName': scope.errorReportPopover
            }, {
              'page': 'Recipe',
              'component': 'Ingredient Name'
            }) //TODO change component key to component_type in API
            .then(function(result) {
              //                                        console.log(result)
            });
        };

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
      }
    }
  };

  function marginoptimizeringredientlist(Utils, MarginOptimizerServiceOne, $rootScope, $ionicScrollDelegate, CommonService, $timeout, $ionicLoading, menuPerformanceService, $ionicPopup) {
    return {
      restrict: 'E',
      templateUrl: 'application/margin-optimizer/directives/ingredient/ingredientListDirective.html',
      scope: {
        ingredients: '=',
        menuitemlist: '=',
        itemparams: '='
        // editmode: '=',
      },
      link: function(scope, element, attribute) {
        // console.log("scope.ingredients",scope.ingredients);

        scope.ingItemIdList = [];
        _.forEach(scope.ingredients, function(ing) {
          ing.portion = ing.ingredientQuantity;
          ing.unit = ing.ingredientUnit;
          // ing.isDelete = false;
          scope.ingItemIdList.push(ing.ingredientId)

        });
        // console.log(scope.ingItemIdList);
        scope.editModeOn = false;
        $rootScope.isEditMode = false;
        scope.recipeid = scope.itemparams.recipeId;
        scope.menuitem = scope.itemparams.menuItem;
        scope.unitListLoaded = false;
        $rootScope.showIds = false;
        $rootScope.listSpinnerHide = false;
        // console.log(scope.recipeid, scope.menuitem, $rootScope.showIds);

        var toastMessage = function(message_text, duration) {
          if (typeof duration === 'undefined') duration = 2000;
          $ionicLoading.show({
            template: message_text,
            noBackdrop: true,
            duration: duration
          });
        }
        // console.log('------------ ********** fetchSupplierItemWeb ******** -----------');
        CommonService.fetchSupplierItemWeb(function(response) {
          scope.supllierList = response.data.data;
          scope.isSupplierListLoaded = true;
          scope.$broadcast('isItemsLoaded');
          _.forEach(scope.ingredients, function(ing, i) {
            ing.supList = [];
            _.forEach(response.data.data, function(sup, j) {
              if (ing.ingredientId == sup.Inv_item_id) {
                ing.supList.push(sup);
              }
            });
          });
        }, scope.ingItemIdList);


        scope.$on('RESETSAVEINGREDIENTSCOUNTER', function(event) {
          scope.saveEventCounter = 0;
        });
        $rootScope.unit_current_selected = {};
        scope.setSelectedUnit = function() {
          // console.log('setSelectedUnit.....');
          $rootScope.unit_current_selected.measurement_unit = '';
        }

        // console.log(ionic.Platform.platform());
        if (ionic.Platform.platform() != 'android' && ionic.Platform.platform() != 'ios') $rootScope.showIds = true;
        scope.isIos = ionic.Platform.platform() == 'ios' ? true : false;

        scope.$on('SAVEINGREDIENTS', function(event) {
          scope.saveEventCounter = scope.saveEventCounter + 1;

          if (scope.saveEventCounter == scope.ingredientsToEdit.length) {
            // set edited menu item ingredients
            MarginOptimizerServiceOne.setMenuRecipeIngredients(function(saveResponse) {
                if (_.has(saveResponse, ['saveSuccess'])) {
                  if (_.get(saveResponse, ['saveSuccess'])) {
                    scope.$emit('IngredientsSavedSuccessfully')
                    // $rootScope.$broadcast('updateMenuItemByRecipeEdit');
                  } else {
                    scope.$emit('IngredientsNotSaved')
                  }
                } else {
                  scope.$emit('IngredientsNotSaved')
                }
              },
              scope.ingredientsToEdit);
          }
        });

        // CommonService.fetchMeasurements(function(data) {
        //   scope.measurements_list = [];
        //   _.forEach(data.measurements, function(measurements) {
        //     if (measurements.measurement_name != null && measurements.measurement_name != '') {
        //       scope.measurements_list.push(measurements);
        //     }
        //   });
        // });
        function arrUnique(arr) {
          var cleaned = [];
          arr.forEach(function(itm) {
            var unique = true;
            cleaned.forEach(function(itm2) {
              if (_.isEqual(itm, itm2)) unique = false;
            });
            if (unique) cleaned.push(itm);
          });
          return cleaned;
        }
        scope.$on('isItemsLoaded',function(evnt) {
          if(scope.isUnitListLoaded && scope.isSupplierListLoaded) {
            scope.unitListLoaded = true;
          }
        })
        function fetchMenuItemIngredientsList(ingList) {
          $rootScope.listSpinnerHide = true;
          scope.ingredientList = ingList.ingredients.ingredients[0];
          scope.unitList = ingList.units;
          scope.isUnitListLoaded = true;
          scope.$broadcast('isItemsLoaded');
          // scope.unitListLoaded = true;

          // _.forEach(scope.ingredients,function(item){
          //   scope.unitList.push(item.unit)
          // })
          scope.unitList = arrUnique(scope.unitList);
          // let matchName = _.filter(scope.ingredientList, function(ing) {
          //   return ing.ingredientName == "Create New Ingredient"
          // })
          // // console.log(matchName);
          // if (matchName.length == 0) {
          //   scope.ingredientList.unshift({
          //     'ingredientId': "",
          //     'ingredientName': "Create New Ingredient",
          //   });
          // }
        }

        MarginOptimizerServiceOne.getIngredientList(fetchMenuItemIngredientsList);

        scope.isRecipeZero = function() {
          if (!angular.isUndefined(scope.ingredients)) {
            // console.log(scope.ingredients);
            if (scope.ingredients.length > 0) {
              if (scope.ingredients[0]['ingredientName'].toLowerCase() != "no ingredients found") {
                return false;
              }
              $rootScope.isEditMode = true;
            } else {
              // $rootScope.isEditMode = false;
            }
          }
          return true;
        };

        scope.totalingredientscost = Utils.sumOf(scope.ingredients, "ingredientCost");

        $rootScope.updateCost = function() {
          $rootScope.$broadcast('MOP_BUSY');
          scope.showItemsLoading = false;
          scope.updateCostArray = [];
          _.forEach(scope.ingredients, function(item) {
            scope.updateCostArray.push({
              "ingredientId": item.ingredientId,
              "ingredientName": item.ingredientName,
              "ingredientType": item.ingredientType,
              "portion": item.ingredientQuantity,
              "unit": item.unit
            })
          })
          scope.existLocal = menuPerformanceService.getIngList(scope.qtyUpdatedIng);
          // console.log("update called",scope.current_selected_list,scope.ingredients,scope.existLocal);
          // menuPerformanceService.getUpdatedIngList(scope.ingredients, scope.existLocal).then(function(list) {
          //   var totalList = list.concat(scope.current_selected_list);
          //   console.log("llltt",totalList);

          // })
          if (scope.current_selected_list) {
            _.forEach(scope.current_selected_list, function(item) {
              scope.updateCostArray.push(item);
            })
          }
          if (scope.existLocal) {
            _.forEach(scope.existLocal, function(data) {
              _.forEach(scope.updateCostArray, function(item) {
                if (data.ingredientId == item.ingredientId) {
                  item.portion = data.portion;
                  item.unit = data.unit;
                }
              })
            })
          }
          scope.priceCalArray = [];
          _.forEach(scope.updateCostArray, function(item) {
            scope.priceCalArray.push({
              "recipeIngredientId": item.ingredientId,
              "recipeIngredientName": item.ingredientName,
              "recipeIngredientType": item.ingredientType,
              "measurementId": item.unit,
              "portionSize": item.portion
            })
          })
          // console.log("price",scope.priceCalArray)
          var serviceRequest = {
            "menuId": scope.menuitem,
            "ingredients": scope.priceCalArray
          }
          CommonService.getTotalCost(function(data) {
            $rootScope.$broadcast('MOP_FREE');
            // console.log("data",data);
            scope.showItemsLoading = true;
            toastMessage("Cost successfully updated.", 3000);

            scope.totalingredientscost = Utils.sumOf(data.data.ingredients, "ingredientCost");
          }, serviceRequest)
        }
        scope.totalingredientscostchange = function() {
          return Utils.sumOf(scope.ingredients, "ingredientCostChange");
        };

        scope.current_selected = {};
        scope.newIng = [];
        scope.sameIngExist = false;
        scope.shoutLoud = function(newValue, oldValue) {
          // console.log(newValue, oldValue);
          scope.current_selected.ingredientName = newValue.ingredientName == "Create New Ingredient" ? "" : newValue.ingredientName;
          scope.current_selected.ingredientId = newValue.ingredientId;
          scope.current_selected.ingredientType = newValue.IngredientType;



          // console.log(scope.ingredients);
          let ingExist = _.find(scope.ingredients, function(ing) {
            return (ing.ingredientName).toUpperCase() == (newValue.ingredientName).toUpperCase();
          });
          let ingExistNewList = _.find(scope.current_selected_list, function(ing) {
            return (ing.ingredientName).toUpperCase() == (newValue.ingredientName).toUpperCase();
          });

          // console.log(ingExist);
          // console.log(ingExistNewList);
          if (ingExist || ingExistNewList) {
            ingExist = [];
            ingExistNewList = [];
            toastMessage('Ingredient already exists.');
            scope.sameIngExist = true;
          } else {
            scope.sameIngExist = false;
            $rootScope.selectedItem.ingredientName = newValue.ingredientName;
            $rootScope.selectedItem.ingredientId = newValue.ingredientId;
            $rootScope.selectedItem.ingredientType = newValue.IngredientType;
            // console.log("$rootScope.selectedItem",$rootScope.selectedItem);
          }

        };
        scope.setIngredient = function(item, type, index) {
          angular.element(document.querySelectorAll('#my_recipe_ing')).triggerHandler('click');
          // item.ingredientName = scope.current_selected.ingredientName;
          // console.log(item);
          // console.log($rootScope.showIds);
          $rootScope.selectedItem = item;
        }

        scope.expandAddIng = false;
        $rootScope.showFloatingBtn = true;
        scope.current_selected_list = [];

        scope.addRow = false;
        scope.addIngClick = function() {
          // scope.expandAddIng = !scope.expandAddIng;
          $rootScope.objUpdated = true;
          scope.addRow = true;
          // $rootScope.showFloatingBtn = false;

          scope.addNewRow = {
            'ingredientName': '',
            'portion': '',
            'unit': '',
          }
          // console.log(scope.current_selected_list);
          let aboveRow = parseInt(scope.current_selected_list.length - 1);
          // console.log(aboveRow);
          if (aboveRow != -1) {
            // console.log(scope.current_selected_list[aboveRow]);
            if (scope.current_selected_list[aboveRow].ingredientName == '') toastMessage('Please set proper value for name.');
            else if (scope.sameIngExist) toastMessage('Ingredient already exists.');
            else if (scope.current_selected_list[aboveRow].portion == '' || scope.current_selected_list[aboveRow].portion == 0) toastMessage('Please set proper value for portion.');
            else if (scope.current_selected_list[aboveRow].unit == '') toastMessage('Please set proper value for unit.');
            else scope.current_selected_list.push(scope.addNewRow);
          } else {
            scope.current_selected_list.push(scope.addNewRow);
          }
        }
        if (!$rootScope.$$listenerCount['DISCARDNEWINGLIST']) {
          $rootScope.$on('DISCARDNEWINGLIST', function(event, ingredientId, list) {
            console.log('------- DISCARDNEWINGLIST --------');
            scope.current_selected_list = [];
          })
        }

        function digits_count(n) {
          var count = 0;
          if (n > 0) ++count;

          while (n / 10 >= 1) {
            n /= 10;
            ++count;
          }

          return count;
        }

        scope.addIngUpdated = function(value) {
          if (value > 0) {
            value = parseFloat(value.toFixed(4));
          }
          if (scope.current_selected_list) {
            _.forEach(scope.current_selected_list, function(item) {
              item.portion = parseFloat(item.portion.toFixed(4));
            })
          }
          let noLength = digits_count(value);
          // console.log('noLength: ',noLength);
          if (noLength > 4) {
            toastMessage('Portion should be minimum of four digits.');
            $rootScope.disableSave = true;
          } else if (value < 0) {
            value = null;
            toastMessage("Portion cannot be a negative value.", 2000);
            $rootScope.disableSave = true;
          } else if (noLength == 0) {
            toastMessage('Portion should not be blank or zero.');
            $rootScope.disableSave = true;
          } else {
            $rootScope.disableSave = false;
            value = parseFloat(value.toFixed(4));
            scope.current_selected.portion = (isNaN(value)) ? 0 : parseFloat(value.toFixed(4))
          }
        };

        function checkPortionZero(existLocal) {
          let qty = _.filter(existLocal, function(o) {
            return o.portion == 0;
          });
          return qty;
        }

        scope.$on('SAVENEWINGREDIENT', function(event) {
          // console.log('_________________SAVENEWINGREDIENT: ',scope.ingredients);
          // scope.current_selected.measurement_unit = $rootScope.unit_current_selected.measurement_unit;
          scope.newIng = [];
          scope.newIng.push({
            'portion': scope.current_selected.portion,
            'ingredientName': scope.current_selected.ingredientName,
            'ingredientId': scope.current_selected.ingredientId,
            'unit': scope.current_selected.measurement_unit,
            // 'recipeId': scope.recipeid,
            // 'ingredientGroupId': scope.itemparams.menuItem,
            'ingredientType': scope.current_selected.IngredientType
          })

          // send all items to backend while updating qty
          scope.existLocal = menuPerformanceService.getIngList(scope.qtyUpdatedIng);
          // console.log(scope.current_selected_list);

          // if both qtyupdate && addNewIng
          if (scope.current_selected_list.length && $rootScope.qtyUpdated) {
            scope.existLocal = menuPerformanceService.getIngList(scope.qtyUpdatedIng);
            // if (!scope.newIng[0].ingredientName) {
            //   toastMessage("Please select Ingredient Name")
            // } else if (!scope.newIng[0].portion) {
            //   toastMessage("Please set proper value for portion.")
            // } else if (!scope.newIng[0].unit) {
            //   toastMessage("Please select unit.")
            // } else {

            menuPerformanceService.getUpdatedIngList(scope.ingredients, scope.existLocal).then(function(list) {
              // list.push(scope.newIng[0]);
              var totalList = list.concat(scope.current_selected_list);
              // console.log("lll",totalList);
              let checkZero = checkPortionZero(totalList);
              let checkUnit = _.find(scope.current_selected_list, function(ing) {
                return ing.unit == '';
              })
              let checkName = _.find(scope.current_selected_list, function(ing) {
                return ing.ingredientName == '';
              })
              if (checkZero.length > 0) {
                toastMessage("Please set proper value for portion.")
              } else if (checkUnit) {
                toastMessage("Please set proper value for unit.")
              } else if (checkName) {
                toastMessage("Please set proper value for name.")
              } else {
                $rootScope.$broadcast('MOP_BUSY');
                CommonService.updateIngredient(function(resIng) {
                  if (resIng.success) {
                    $rootScope.$emit('ING_ADDED_OR_UPDATED', scope.itemparams);
                    menuPerformanceService.setIngList([]);
                  } else {
                    $rootScope.$broadcast('MOP_FREE');
                    toastMessage("Sorry! your ingredient is not added.")
                  }
                }, totalList, scope.itemparams.recipeId, scope.itemparams.menuItem)
                
              }
            })



            // }

          } else if ($rootScope.qtyUpdated) { // else if qty update
            // scope.existLocal = menuPerformanceService.getIngList(scope.qtyUpdatedIng);
            // console.log(finalIngList);
            menuPerformanceService.getUpdatedIngList(scope.ingredients, scope.existLocal).then(function(list) {
              // scope.updatedList = list;
              let checkZero = checkPortionZero(list)
              if (checkZero.length > 0) {
                toastMessage("Please set proper value for portion.")
              } else {
                $rootScope.$broadcast('MOP_BUSY');
                // console.log(list);
                CommonService.updateIngredient(function(resIng) {
                  if (resIng.success) {
                    $rootScope.$emit('ING_ADDED_OR_UPDATED', scope.itemparams);
                    menuPerformanceService.setIngList([]);
                  } else {
                    $rootScope.$broadcast('MOP_FREE');
                    toastMessage("Sorry! your ingredient is not added.")
                  }
                }, list, scope.itemparams.recipeId, scope.itemparams.menuItem)
              }
            });

          } else if (scope.current_selected_list.length) { // else if newIng
            // console.log(scope.newIng[0]);
            let checkZero = checkPortionZero(scope.current_selected_list);
            let checkUnit = _.find(scope.current_selected_list, function(ing) {
              return ing.unit == '';
            })
            let checkName = _.find(scope.current_selected_list, function(ing) {
              return ing.ingredientName == '';
            })
            if (checkZero.length > 0) {
              toastMessage("Please set proper value for portion.")
            } else if (checkUnit) {
              toastMessage("Please set proper value for unit.")
            } else if (checkName) {
              toastMessage("Please set proper value for name.")
            } else {
              $rootScope.$broadcast('MOP_BUSY');
              menuPerformanceService.getUpdatedIngList(scope.ingredients, scope.existLocal).then(function(list) {
                // list.concat(scope.current_selected_list);
                var totalList = list.concat(scope.current_selected_list);
                // console.log("kkk",totalList);
                CommonService.updateIngredient(function(resIng) {
                  if (resIng.success) {
                    $rootScope.$emit('ING_ADDED_OR_UPDATED', scope.itemparams);
                    menuPerformanceService.setIngList([]);
                  } else {
                    $rootScope.$broadcast('MOP_FREE');
                    toastMessage("Sorry! your ingredient is not added.")
                  }
                }, totalList, scope.itemparams.recipeId, scope.itemparams.menuItem)
              });


            }
          } else {
            console.log('nothing to do......');
            toastMessage("Nothing to do.")
          }

        });


        scope.deleteMenuIng = function(item) {
          var confirmPopup = $ionicPopup.confirm({
            title: 'Delete Item',
            template: 'Do you want to delete the item ?',
            okText: "Ok",
            okType: "button-balanced",
          });
          confirmPopup.then(function(res) {
            if (res) {
              // scope.editModeOn = false;
              // $rootScope.isEditMode = false;
              let sliceItem = _.findIndex(scope.current_selected_list, function(o) {
                return (o.ingredientName).toUpperCase() == (item.ingredientName).toUpperCase();
              });
              scope.current_selected_list.splice(sliceItem, 1);
            }
          });
        }


        if (!$rootScope.$$listenerCount['DELETEINGFROMLIST']) {
          $rootScope.$on('DELETEINGFROMLIST', function(event, ingredientId, list) {
            // console.log('--------------------DELETEINGFROMLIST',ingredientId,list);
            scope.ingredients = list;
            // console.log(scope.ingredients);
            let sliceItem = _.findIndex(scope.ingredients, function(o) {
              return o.ingredientId == ingredientId;
            });
            // console.log(sliceItem);
            scope.ingredients.splice(sliceItem, 1);

            let itemToDelete = [];
            itemToDelete = _.filter(scope.ingredients, function(del) {
              return del.ingredientId != ingredientId;
            });
            // console.log(itemToDelete);
            toastMessage("Ingredient deleted successfully.")
            $rootScope.$broadcast('deleteIngItem');
            scope.editModeOn = false;
            $rootScope.isEditMode = false;
            // $rootScope.$broadcast('MOP_BUSY');
            CommonService.updateIngredient(function(resIng) {
              if (resIng.success) {
                // console.log("Ingredient deleted successfully.");
                // scope.ingredients.splice(sliceItem, 1);
                // toastMessage("Ingredient deleted successfully.")
                // $rootScope.$broadcast('MOP_FREE');
                // toastMessage("Ingredient deleted successfully.")
              } else {
                // $rootScope.$broadcast('MOP_FREE');
                toastMessage("Sorry! your ingredient is not deleted.");
                $rootScope.$broadcast('MOP_FREE');
              }
            }, itemToDelete, scope.itemparams.recipeId, scope.itemparams.menuItem)
          });
        }
        $rootScope.$on('allowEditIngredients', function(event) {
          // get INGREDIENT to edit
          scope.$root.locationAccepted = false;
          scope.editModeOn = true;
          $rootScope.isEditMode = true;
          scope.current_selected_list = [];
          // scope.ingredient
          // window.scrollTo(0,document.body.scrollHeight);
          _.forEach(scope.ingredients,function(item) {
            // if(item.isItemExpanded) {
            $rootScope.$broadcast('iseditmodeon')
              
            // }
          })
          // console.log('allowEditIngredients',scope.ingredients)

        })
      }
    }
  };


  function ingredientdetaileditems($ionicScrollDelegate, MarginOptimizerService) {
    return {
      restrict: 'E',
      templateUrl: 'application/margin-optimizer/directives/ingredient/ingredientDetailsDirective.html',
      scope: {
        ingredient: '=',
        getdataoninit: '=',
        ifeven: '=',
      },
      link: function(scope, element, attribute) {


        if (!(angular.isUndefined(scope.getdataoninit))) {
          if (scope.getdataoninit) {
            if (!(angular.isUndefined(scope.ingredient))) {
              fetchDetailedIngredientData(scope.ingredient.ingredient_id);
            }
          }
        }

        scope.toggleGroup = function(group) {
          if (!angular.isUndefined(group)) {
            group.show = !group.show;
            $ionicScrollDelegate.resize();
          }
        };

        scope.isGroupShown = function(group) {
          if (angular.isUndefined(group)) {
            return false;
          } else {
            return group.show;
          }
        };

        scope.getIngredientData = function() {
          if (angular.isUndefined(scope.ingredientDataGroup)) {
            // console.log("fetching detailed info : " + scope.item.reference_key);
            fetchDetailedIngredientData(scope.ingredient.ingredient_id)
          } else {
            scope.toggleGroup(scope.ingredientDataGroup);
          }
        };

        var sumOf = function(data, key) {
          if (angular.isUndefined(data) && angular.isUndefined(key)) {
            return 0;
          } else {
            var sum = 0;
            angular.forEach(data, function(value) {
              sum = sum + value[key];
            });
            return sum;
          }
        }

        function fetchDetailedIngredientData(ingredient_id) {

          scope.$broadcast('MOP_BUSY');
          //http request for fetching detailed ingredients data
          MarginOptimizerService.fetchDetailedIngredientData(fetchDetailedIngredientDataResponseHandler, ingredient_id);
        }

        //Response handler for fetching Menu Item price and cost Data
        function fetchDetailedIngredientDataResponseHandler(ingredient_detailed_data) {

          var ingredientDataTotal = {
            'name': "Total",
            'sales': 0,
            'ingredientQuantity': sumOf(ingredient_detailed_data, 'ingredientQuantity'),
          };
          scope.ingredientDataGroup = {
            'show': true,
            'ingredientData': ingredient_detailed_data,
            'ingredientDataTotal': ingredientDataTotal
          };
          scope.$broadcast('MOP_FREE');
        }

      }
    }
  };

  function digits_count(n) {
    var count = 0;
    if (n > 0) ++count;

    while (n / 10 >= 1) {
      n /= 10;
      ++count;
    }

    return count;
  }

  function limitTo($ionicLoading, $rootScope) {
    return {
      restrict: "A",
      link: function(scope, elem, attrs) {
        console.log('limitTo---------------');
        // $rootScope.disableSave = false;
        var limit = parseInt(attrs.limitTo);
        angular.element(elem).on("keypress", function(e) {
          let input = digits_count(this.value);
          if (input == limit) {
            e.preventDefault();
            $ionicLoading.show({
              template: 'Portion should be minimum of four digits.',
              noBackdrop: true,
              duration: 2000
            });
            // $rootScope.disableSave = true;
          }
        });
      }
    }
  };

  projectCostByte.directive('customDropDown', ['$ionicModal', '$ionicGesture', '$timeout', '$rootScope', 'inventoryService', function($ionicModal, $ionicGesture, $timeout, $rootScope, inventoryService) {
    return {
      restrict: 'E',
      scope: {
        options: "=",
        optionSelected: "="
        // list: "="
      },
      controller: function($scope, $element, $attrs) {
        $scope.searchSelect = {
          title: $attrs.title || "Search",
          // keyProperty: $attrs.keyProperty,
          // valueProperty: $attrs.valueProperty,
          templateUrl: $attrs.templateUrl || 'application/core/shared-components/common/directive/customDropDown.html',
          animation: $attrs.animation || 'slide-in-up',
          option: null,
          // searchvalue: "",
          // enableSearch: $attrs.enableSearch ? $attrs.enableSearch == "true" : true
        };
        $scope.data = {
          "searchValue": ""
        }
        $scope.searchCat = "";
        $ionicGesture.on('tap', function(e) {
          // if(!!$scope.searchSelect.keyProperty && !!$scope.searchSelect.valueProperty){
          //   if ($scope.optionSelected) {
          //     $scope.searchSelect.option = $scope.optionSelected[$scope.searchSelect.keyProperty];
          //   }
          // }
          // else{
          //   $scope.searchSelect.option = $scope.optionSelected;
          // }
          $scope.OpenModalFromTemplate($scope.searchSelect.templateUrl);
        }, $element);
        // $scope.setSelected = [];
        $scope.saveOption = function(newValue) {
          // console.log('saveOption', newValue);
          $rootScope.my_current_selected = {}
          //
          // $rootScope.$broadcast('setSelectedVal',newValue);

          // var CatValue=newValue.split("::");
          $rootScope.selectedUnit = newValue;
          $rootScope.unit_current_selected.measurement_unit = newValue;
          // $rootScope.my_current_selected.measurement_unit = newValue;
          // inventoryService.setPnlMapSelected($rootScope.current_selected)
          $scope.searchSelect.searchvalue = "";
          $scope.modal.remove();
        };



        $scope.clearSearch = function() {
          console.log('clearSearch......');
          $scope.data.searchValue = "";
          // $scope.searchSelect.searchvalue = "";
        };

        $scope.closeModal = function() {
          $scope.data.searchValue = "";
          $scope.modal.remove();
        };
        $scope.$on('$destroy', function() {
          if ($scope.modal) {
            $scope.modal.remove();
          }
        });
        $scope.$watch('data.searchValue', function(newVal) {
          // console.log('searchValue items....',newVal);
          $scope.searchCat = newVal;
        }, true);

        $scope.OpenModalFromTemplate = function(templateUrl) {
          $ionicModal.fromTemplateUrl(templateUrl, {
            scope: $scope,
            animation: $scope.searchSelect.animation
          }).then(function(modal) {
            $scope.modal = modal;
            $scope.modal.show();
          });
        };
      }
    };
  }]);

})();
