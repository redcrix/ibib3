(function() {
  projectCostByte.controller('menuItemScreenCtrl', menuItemScreenCtrl);

  menuItemScreenCtrl.$inject = ['$q', '$scope', '$state', '$stateParams', '$timeout', '$ionicTabsDelegate', 'MarginOptimizerServiceOne', '$ionicPopup', 'Utils', '$rootScope', 'menuPerformanceService', '$ionicPopup', 'CommonService', '$ionicLoading'];

  function menuItemScreenCtrl($q, $scope, $state, $stateParams, $timeout, $ionicTabsDelegate, MarginOptimizerServiceOne, $ionicPopup, Utils, $rootScope, menuPerformanceService, $ionicPopup, CommonService, $ionicLoading) {

    // $scope.mode = false;
    $scope.isEditMode = false;
    // console.log($stateParams);
    $scope.recipeId = $stateParams.recipeId;
    $scope.menuItem = $stateParams.menuItem;
    $scope.itemParams = $stateParams;
    // console.log($scope.itemParams);
    function preloadTemplates() {
      let templatesToLoad = [{
          name: 'application/margin-optimizer/directives/menuItem/menuItemDirective.html',
          path: 'application/margin-optimizer/directives/menuItem/menuItemDirective.html'
        },
        {
          name: 'application/margin-optimizer/directives/ingredient/ingredientItemDirective.html',
          path: 'application/margin-optimizer/directives/ingredient/ingredientItemDirective.html'
        },
      ];
      _.each(templatesToLoad, function(template) {
        Utils.preLoadTemplate(template.name, template.path)
      })
    }
    preloadTemplates();
    $scope.getMenuItemList = menuPerformanceService.getMenuItemsList();
    // console.log($scope.getMenuItemList);
    // function to fetch menuItem Data
    var fetchMenuItemData = function(menuItemData) {
      return MarginOptimizerServiceOne.getSelectedMenuItemData(fetchMenuItemDataRH, menuItemData);
    }
    var fetchFreshMenuItemData = function(menuItemData) {
      return MarginOptimizerServiceOne.getSelecteFreshdMenuItemData(fetchFreshMenuItemDataRH, menuItemData);
    }

    fetchFreshMenuItemDataRH = function(menuItemData, selectedData) {
      // console.log(menuItemData);
      $scope.item = menuItemData;
      // console.log("selectedData",selectedData,menuItemData);
      fetchFreshMenuItemIngredients(selectedData);
      // console.log($scope.item);
    }
    var fetchMenuItemDataRH = function(menuItemData) {
      // console.log("menuItemData",menuItemData);
      $scope.item = menuItemData;
      // console.log($scope.item);
    }

    $scope.goToTask = function() {
      $state.go('app.dashboard.tasks');
    }
    $scope.allowEdit = function() {
      $rootScope.$broadcast('allowEditIngredients');
    }

    // function to fetch Ingredients of menuItem
    var fetchMenuItemIngredients = function(itemData) {
      return MarginOptimizerServiceOne.getSelectedMenuIngredients(fetchMenuItemIngredientsRH, itemData);
    }
    var fetchFreshMenuItemIngredients = function(itemData) {
      // console.log("itemData",itemData)
      return MarginOptimizerServiceOne.getSelectedFreshMenuIngredients(fetchFreshMenuItemIngredientsRH, itemData);
    }
    $scope.refreshScreen = function() {
      $scope.spinnerHide = false;
      refreshScreenMenueng($stateParams);
    }
    var refreshScreenMenueng = function(itemdata) {
      return MarginOptimizerServiceOne.getRefreshScreenMenuIngredients(fetchMenuItemIngredientsRefreshDataRH, itemdata,$scope.recipeId);
    }

    let discardIngredient = []
    var fetchMenuItemIngredientsRefreshDataRH = function(ingredientsData) {
      // $scope.ingredients = _.sortBy(ingredientsData, [function(o) { return -1* o.ingredientCost; }]);

      $scope.ingredients = ingredientsData;
      // console.log("1",$scope.ingredients);
      discardIngredient = angular.copy(ingredientsData)
      $scope.ingredientsDataLength = ingredientsData.length;
      $timeout(function() {
        $scope.spinnerHide = true;
        // $scope.isEditMode = $scope.ingredientsDataLength ? false : true;
        $scope.isEditMode = false;
      }, 500)

    }
    var fetchMenuItemIngredientsRH = function(ingredientsData) {
      // $scope.ingredients = _.sortBy(ingredientsData, [function(o) { return -1* o.ingredientCost; }]);
      $scope.ingredients = ingredientsData;
      $rootScope.oldIngredient = angular.copy(ingredientsData);
      discardIngredient = angular.copy(ingredientsData)
      $scope.ingredientsDataLength = ingredientsData.length;
      $timeout(function() {
        $scope.spinnerHide = true;
        // $scope.isEditMode = $scope.ingredientsDataLength ? false : true;
        $scope.isEditMode = false;
      }, 500)

    }
    var fetchFreshMenuItemIngredientsRH = function(ingredientsData) {
      // $scope.ingredients = _.sortBy(ingredientsData, [function(o) { return -1* o.ingredientCost; }]);
      if($rootScope.oldIngredient.length != ingredientsData.length) {
        $scope.ingredients = ingredientsData;
        $rootScope.oldIngredient = angular.copy($scope.ingredients)
        discardIngredient = angular.copy(ingredientsData)
        $scope.ingredientsDataLength = ingredientsData.length;
        $timeout(function() {
          $scope.spinnerHide = true;
          // $scope.isEditMode = $scope.ingredientsDataLength ? false : true;
          $scope.isEditMode = false;
        }, 500)
      }

    }



    var toastMessage = function(message_text, duration) {
      if (typeof duration === 'undefined') duration = 1500;
      $ionicLoading.show({
        template: message_text,
        noBackdrop: true,
        duration: duration,
      });
    };
    getUserEmailId().then(function(userEmailId) {
      $scope.userEmailId = userEmailId;
    });

    function getUserEmailId() {
      return $q(function(resolve, reject) {
        CommonService.getUserDefaullEmailId(function(emailIdData) {
          resolve(emailIdData.data.emailId);
        })
      })
    }
    $scope.openPrompt = function() {

      $scope.emailData = {};
      $scope.emailData.userEmailId = $scope.userEmailId;
      $scope.emailData.userEmailIdNew = "";
      var confirmPopup = $ionicPopup.show({
        scope: $scope,
        template: `<form name="nw" novalidate><div class="smaller">
                                         <input type="email" name="email" placeholder="{{ emailData.userEmailId }}" ng-model="emailData.userEmailIdNew" required/>
                                      <p ng-if="showError" class="errror" style="color:red">Please enter a Valid E-mail id.</p>
                                     <span style="color:red" ng-show="nw.email.$dirty && nw.email.$invalid">
                                     <span ng-show="nw.email.$error.email">Invalid email address.</span>
                                      </span>
                                      </div>
                                      </form>`,
        title: 'Export data',
        subTitle: 'Enter alternate email id',
        cssClass: 'text-center popup-export',
        attr: 'ng-disabled="!emailData.userEmailIdNew"',
        buttons: [{
            text: 'Cancel'
          },
          {
            text: '<b>Send</b>',
            type: 'button-bal',
            onTap: function(e) {
              var pattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

              $scope.emailData.userEmailId = !$scope.emailData.userEmailIdNew ? $scope.emailData.userEmailId : $scope.emailData.userEmailIdNew;
              $scope.emailData.userEmailIdNew = !$scope.emailData.userEmailIdNew ? $scope.emailData.userEmailId : $scope.emailData.userEmailIdNew;
              $scope.emailData.userEmailId = !$scope.emailData.userEmailIdNew ? $scope.emailData.userEmailId : (pattern.test($scope.emailData.userEmailIdNew) ? $scope.emailData.userEmailIdNew : $scope.emailData.userEmailId);
              $scope.emailData.userEmailIdNew = $scope.emailData.userEmailId;
              if (!$scope.emailData.userEmailId) {
                toastMessage("Email is required");
              } else if (!pattern.test($scope.emailData.userEmailId)) {
                toastMessage("Please Enter Valid Email");
              } else {
                CommonService.exportRecipeData($scope.exportRecipeRes, $scope.emailData.userEmailId, $scope.item.menuItem);

              }
            }
          }
        ]
      });
    };

    $scope.exportRecipeRes = function(data) {
      // confirmPopup.close();////
      if (data.status == 200) {
        if (data.data.success === true) {
          toastMessage("<span style='position: relative;bottom: 20px;'>Inventory export request sent! </br> You will be receiving email shortly.</span>");
        }
      } else if (data.status == 503) {
        toastMessage("Oops something went wrong", 2000);
      }
    }


    // $scope.editMode = function() {
    // console.log("Toggle edit mode")
    // $scope.mode = !$scope.mode;
    // if($scope.mode)
    // fetchMenuItemIngredientsEdit();
    // }

    // $scope.updateRecipe = function(ingredients) {
    // console.log("updated data =>", ingredients)
    // var items = [];
    // angular.forEach(ingredients, function(main, ind){
    // if(main.ingredientIndex && main.ingredientId){
    // items.push({
    // "ingredientType": main.ingredientType,
    // "ingredientQuantity": main.ingredientQuantity,
    // "recipeId": main.recipeId,
    // "ingredientId": main.ingredientId,
    // "referenceId": main.referenceId,
    // "ingredientIndex": main.ingredientIndex,
    // "kind": main.kind
    // });
    // }
    // // if(ind +1 == ingredients.length){
    // console.log(items);
    // $scope.mode = false;
    // MarginOptimizerServiceOne.setMenuRecipeIngredients(responseEdit, items);
    // }
    // });




    // }

    // var fetchMenuItemIngredientsEditRH = function(ingredientsData) {
    // $scope.ingredientsedit = ingredientsData;
    // // // $scope.$broadcast('EditIngredients', ingredientsData);
    // //// console.log(ingredientsData);
    // $scope.spinnerHide = true;
    // }


    // var fetchMenuItemIngredientsEdit = function() {
    // return MarginOptimizerServiceOne.getSelectedMenuIngredientsEdit(fetchMenuItemIngredientsEditRH, $stateParams);
    // }


    // var responseEdit = function(ingredientResp) {
    // console.log("Resp ==>",ingredientResp);
    // fetchMenuItemIngredients();
    // }

    // $scope.isEditMode = false;

    var confirmation_popup = function(title, template) {
      var q = $q.defer();
      var confirmPopup = $ionicPopup.confirm({
        title: title,
        template: template,
        buttons: [{
            text: 'Cancel'
          },
          {
            text: '<b>Yes</b>',
            type: 'button-bal',
            onTap: function(e) {
              return true;
            }
          }
        ]
      });
      confirmPopup.then(function(res) {
        if (res) {
          // console.log('You are sure');
        } else {
          // console.log('You are not sure');
        }
        q.resolve(res)

      });

      return q.promise;
    }


    $scope.toggleEditMode = function(prompt) {
      $rootScope.ingCnt = 0;
      if (prompt.prompt_confirmation) {
        confirmation_popup('Confirm exiting ingredient edit mode',
          'Are you sure you want exit without saving changes?').then(function(confirmed) {
          if (confirmed) {
            $scope.$broadcast('EXITEDITMODE')
            $scope.isEditMode = false;
          } else {
            console.log('do nothing')
          }
        })
      } else {
        // console.log('Entering Edit mode')
        $scope.isEditMode = true;
        $scope.$broadcast('ENTEREDITMODE', $stateParams, $scope.ingredientsDataLength)
      }
    }

    $scope.updateRecipe = function() {

      // confirmation_popup('Confirm saving modified ingredients',
      //     'Are you sure you want save changes?').then(function (confirmed) {
      //     if (confirmed) {
      //         // $scope.$broadcast('SAVEANDEXITEDITMODE')
      $scope.$broadcast('SAVENEWINGREDIENT')
      // if($rootScope.qtyUpdated)
      //   $rootScope.$broadcast('UPDATEINGREDIENT')
      $scope.isEditMode = false;
      // } else {
      //     console.log('do nothing')
      // }
      // })

    }
    // $scope.$watchCollection('ingredients', function(firstTeamArray) {
    //   console.log("change to the first team! ", (firstTeamArray));
    // });
    $scope.discardChanges = function() {
      // $scope.isEditMode = false;
      // console.log('---------- DISCARDINGCHANGE ---------',$scope.ingredients,discardIngredient);
      // console.log('$rootScope.objUpdated: ',$rootScope.objUpdated);

      if($rootScope.objUpdated){
        var confirmPopup = $ionicPopup.confirm({
          title: 'Discard changes',
          template: 'Are you sure you want to discard all changes?',
          okText: "Ok",
          okType: "button-balanced",
        });
        confirmPopup.then(function(res) {
          if (res) {
            // console.log(scope.inglist);
            $rootScope.isEditMode = false;
            $scope.ingredients = angular.copy(discardIngredient);
            $rootScope.$broadcast('DISCARDNEWINGLIST');
          }
        });
      } else {
        toastMessage("Nothing to discard.");
        $rootScope.isEditMode = false;
      }

    }

    $rootScope.$on('deleteIngItem', function(evnt) {
      $scope.isEditMode = false;
    })
    // On screen Init
    $scope.$on('$ionicView.beforeEnter', function(event, viewData) {
      viewData.enableBack = true;
    });
    $scope.$on('IMPORT_RECIPE', function(event, selectedMenuItem) {
      // console.log('*****IMPORT_RECIPE******',selectedMenuItem);
      $scope.spinnerHide = false;
      fetchMenuItemData(selectedMenuItem);
      fetchMenuItemIngredients(selectedMenuItem);
    });

    if (!$rootScope.$$listenerCount['ING_ADDED_OR_UPDATED']) {
      $rootScope.$on('ING_ADDED_OR_UPDATED', function(event, selectedMenuItem) {
        // console.log('*****ING_ADDED******',selectedMenuItem);
        $scope.spinnerHide = false;
        fetchFreshMenuItemData(selectedMenuItem);
        // fetchFreshMenuItemIngredients(selectedMenuItem);
      });
    }

    // $rootScope.$on('ING_ADDED', function (event, selectedMenuItem) {
    //     console.log('*****ING_ADDED******',selectedMenuItem);
    //     $scope.spinnerHide = false;
    //     fetchFreshMenuItemData(selectedMenuItem);
    //     fetchFreshMenuItemIngredients(selectedMenuItem);
    // });
    $rootScope.$on('MOP_BUSY', function(event) {
      // console.log('************ MOP_BUSY *********');
      $scope.spinnerHide = false;
    });
    $rootScope.$on('MOP_FREE', function(event) {
      // console.log('************ MOP_FREE *********');
      $scope.spinnerHide = true;
    });


    $scope.onMenuItemInit = function() {
      $scope.spinnerHide = false;
      $scope.navBarTitle.showToggleButton = false;
      fetchMenuItemData($stateParams);
      fetchMenuItemIngredients($stateParams);

    }






  }
})();
