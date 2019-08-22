(function() {
  var InventoryComposeCtrl = function($q, $scope, $state, $ionicFilterBar, $ionicActionSheet, inventoryItemsSvc,
    $ionicLoading, $ionicPopup, $ionicScrollDelegate, $timeout, inventoryHomeSvc,
    ionicDatePicker, CommonService, Utils, DocumentSelectionService, $ionicModal, $filter, $ionicNavBarDelegate,$rootScope,inventoryService,$cordovaNetwork) {
    var that = this;
    var filterBarInstance;
    //console.log('inv list page')
    // $ionicNavBarDelegate.showBackButton(true);

    $timeout(function() {
      var element = angular.element(document.querySelectorAll('#my-back-btn'));
      if(element.length){

            element.removeClass('hide');

      }

    }, 1000);




    var DATE_OPTIONS = {hour: "2-digit", minute: "2-digit", day: "numeric", month: "short"};

    that.categorieViews = {
      "PRODUCT_CATEGORY": 'ingredient_category',
      "LOCATION": 'location',
      "PAR": 'par'

    };
    that.categoryText = {
      "PRODUCT_CATEGORY": 'Ingredient Category',
      "LOCATION": 'Location',
      "PAR": 'par'
    };
    // $scope.$on('$ionicView.beforeLeave', function(e) {
    //   console.log('beforeLeave******')
    //     $ionicNavBarDelegate.showBar(true);
    // });
    // $scope.$on('$ionicView.enter', function(e) {
    //   console.log('enter******')
    //     $ionicNavBarDelegate.showBar(true);
    // });
    $scope.groupminor = inventoryService.getSelectedGroupBy();
   if($scope.groupminor == 'minor_category'){
       $scope.Submit="Save";
       that.buttontext="Save"
   }else{
    $scope.Submit="Submit";
   }
    this.rowSize = {
      name: 30,
      price: 17,
      qty: 12,
      units: 14,
      value: 18,
      category:50,
    }

    /* backdrop of floating buttons */

    // var everywhere = angular.element(window.document+":not('#floating-menu')");
    var clicked;
    var everywhere = angular.element(window.document);

    $scope.$on('floating-menu:open', function() {
      //console.log('open');
      clicked = true;
      everywhere.bind('click', function(event) {
        // //console.log(event.target.className == "icon menu-icon ion-arrow-left-c");
        var el = angular.element(document.querySelectorAll('#floating-menu'));
        if(el.length){
          if (el[0].className === 'active') {
            if (clicked) {
              el.removeClass('active');
              el.triggerHandler('click');
            }
          }
        }
      });
    });

    $scope.$on('floating-menu:close', function() {
      //CommonService.getInventorySummary(responseHandler,$scope.ingredient_ids,that.inventoryId);
      //console.log('close');
      clicked = false;
    });

    this.fullList = [];
    this.fullGroupedList = [];
    this.items = [];
    this.editMode = 'edit';
    var errorToastMessage = "<span style=\"padding-top: -15px; font-weight: 500;\" class=\"redflag\">Error Occured. Report Sent.</span>";
    this.setCatIng = [];
    $scope.pushActive = function(groupedList,new_config){
      _.each(groupedList, function(categories) {
        // console.log(categories);
        // categories.isExpanded = false;
        if(new_config.ingredientStatus == "inactive"){
          _.find(categories.ingredients, function(ing) {
            if(new_config.inventoryItemId == ing.inventory_item_id ){
              ing.active = (new_config.active == true || new_config.active == undefined) ? true : false;
              ing.ingredient_status = "inactive";
            }
            // else{
            //   ing.active = true;
            // }
          });
        }
          // //console.log(categories);
          _.each(categories.ingredients, function(cat) {
              that.setCatIng.push({
                'category':categories.name,
                'ingName':cat.ingredient_alias_name
              })
          });

      });
      if(groupedList.status == 200){
        let ittr = 0;
        let uniqueArr = [];
        $scope.categoryList = [];
        // console.log($scope.minorCategories);
        that.items = _.each(groupedList, function(categories) {
          $scope.categoryList.push(categories.name)

          _.forEach(categories.ingredients,function(item){
              item.minor_categories =$scope.minorCategories;
          })

          uniqueArr = _.uniqBy(categories.ingredients,'ingredient_alias_name')
          //console.log(uniqueArr)
          groupedList[ittr].ingredients = uniqueArr;
          ittr++;

        });
        var quantity ;
        var price ;
        _.forEach(that.items,function(item) {
          // item.isExpanded = false;
          item.totalValue = item.ingredients.filter(function (ele) {
                      return ele.ingredient_price !== undefined && ele.ingredient_status == "active" && ele.ingredient_price !== null && ele.quantity !== undefined && ele.quantity !== null && !isNaN(ele.quantity);
                  }).map(function (ele) {
                      return ele.ingredient_price * ele.quantity;
                  }).reduce(function (prev, cur) {
                      // var newPrev = isNaN(prev) ? prev : parseFloat(prev);
                      // var newCur = isNaN(cur) ? cur : parseFloat(cur);
                      return prev + cur;
                  }, 0);
          _.forEach(item.ingredients,function(ing) {
            if(ing.quantity) {
              quantity = ing.quantity;
              price = ing.ingredient_price;
              ing.ingValue = quantity * price;
            }else {
              ing.ingValue  = 0;
            }
          })

        })
        //
        $scope.updatedItems = that.items;
        // console.log("that.items : ", that.items)
        // toastMessage
        $scope.spinnerShow = false;
        // $rootScope.$broadcast('UPDATE_TOTAL');
        // console.log(that.items);


        // var chunkLength = 2;
        // if (that.items.length > 2) {
        //   chunkLength = 2;
        // }
        // $scope.optionsChunks = _.chunk(that.items, chunkLength);

        // console.log($scope.optionsChunks)

        $scope.$evalAsync();
        // if($scope.parDir)
        //   $rootScope.$broadcast('SHOW_PAR_GROUP');
      }else {
        $scope.spinnerShow = false;
     //   toastMessage("Something went wrong!");
      }
    }
    $rootScope.$on('closeExpandedItem',function(evnt) {
      _.forEach(that.items,function(item) {
          item.isExpanded = false;
        })
    })

    $rootScope.$on('invSupDetails',function(evnt){
      that.showLoader = true;
      $scope.showItemsLoading = true;
      if(that.inventoryId) {
        // console.log("that.inventoryId",that.inventoryId)
        $timeout(function() {
          refreshItemsFromServer(true);
        },600)
        
      }
    })


    var refreshItemsFromServer = function(force_fetch, load_history, key) {
      $scope.spinnerShow = true;
      $scope.showItemsLoading=true;
      $scope.groupminor = inventoryService.getSelectedGroupBy();
      if($scope.groupminor == 'minor_category'){
         $scope.Submit="Save";
         $rootScope.minorCategorySelected=false;
      }else{
      $scope.Submit="Submit";
      $rootScope.minorCategorySelected=true;
      }
      if(force_fetch == 'minorcategory'){
        $rootScope.minorCategorySelected=false;
      }else{
        $rootScope.minorCategorySelected=true;
      }
      inventoryItemsSvc.getIngredients(that.inventoryId, force_fetch, load_history, key).then(function(data) {
        // console.log('refreshItemsFromServer *********')
        $scope.groupminor = inventoryService.getSelectedGroupBy();
      if($scope.groupminor == 'minor_category'){
         $scope.Submit="Save";
         $rootScope.minorCategorySelected=false;
      }else{
      $scope.Submit="Submit";
      $rootScope.minorCategorySelected=true;
      }

   //     console.log(data);
        that.inventory_status = data.inventory_status;
        if (angular.isDefined(data.last_updated_at)) {
          var lastSavedtime = (new Date(data.last_updated_at*1000)).toLocaleString("en-US", DATE_OPTIONS);
          setSaveStatusMessage("Last saved on " + lastSavedtime, "save-status-green")
        } else {
          setSaveStatusMessage("-", "save-status-blank")
        }
        that.isLocationAvailable = data.isLocationAvailable;
        inventoryItemsSvc.groupIngredients(that.inventoryId)
          .then(function(groupedList ,currentView) {
            $scope.pushActive(groupedList,[])
            // that.items = groupedList;
            that.showLoader = false;
            $scope.showItemsLoading=false;
            $scope.spinnerShow = false;
          })

      }, function(data) {
        // console.log("data",data)
        toastMessage("Unable to load. Please check your connection.");
        $scope.spinnerShow = false;
      });

    }
    this.init = function() {
      // console.log("init")
      $rootScope.minorCategorySelected=true;
      $scope.navBarTitle.showToggleButton = false; // to show back button in header bar

      that.showLoader = true;
      that.inventoryId = $state.params.inventory;
      $rootScope.inv_draft_id = that.inventoryId;
      that.inventory_name = $state.params.inventory_name;
      // $rootScope.selectedInv = $state.params.inventory_name;
      inventoryService.setSelectedInv($state.params.inventory_name);
      that.currentView = "PRODUCT_CATEGORY";
      that.store_id = $state.params.store_id;
      that.dateCreated = $state.params.date_of_creation;
      inventoryItemsSvc.setGroupingOption("PRODUCT_CATEGORY")
      inventoryService.setSelectedGroupBy('ingredient_category');
      inventoryService.setInventoryId(that.inventoryId);
      // console.log('*************',inventoryService.getSelectedGroupBy());
      if(!inventoryService.getSelectedGroupBy())
        inventoryService.setSelectedGroupBy("ingredient_category");

      if ($state.params.hasOwnProperty('group_by_field')) {
        if (_.has(that.categorieViews, [$state.params.group_by_field])) {
          // console.log($state.params.group_by_field)
          inventoryItemsSvc.setGroupingOption($state.params.group_by_field)
          // console.log("after grouping option")
        }
      }

      getUserEmailId().then(function(userEmailId) {
        that.userEmailId = userEmailId;
      });

      refreshItemsFromServer(false, $state.params.draft_history, $state.params.draft_history_key);
      // Utils.preLoadTemplate('inventoryConfigModifierTemplate', 'application/inventory-management/directives/config-modifier/inventory-config-modifier.html')
      var headerPart = angular.element( document.querySelector( '.title-center' ) );
      console.log(headerPart[0]);
      headerPart[0].style.left = "unset";
    };

    this.showPopup = function() {
      // console.log("show popup")
      $scope.data = {};
      $scope.data.datetimeValue = that.dateCreated;
      $scope.data.name = that.inventory_name;

      this.openDatePicker = function() {
        var datepickerObject = {
          callback: function(val) { //Mandatory
            $scope.data.datetimeValue = new Date(val);
          },
          disabledDates: [],
          from: new Date(2016, 6, 1), //Optional
          to: new Date(), //Optional
          inputDate: new Date($scope.data.datetimeValue), //Optional
          mondayFirst: true, //Optional
          disableWeekdays: [], //Optional
          closeOnSelect: false, //Optional
          templateType: 'popup' //Opional
        }
        ionicDatePicker.openDatePicker(datepickerObject);
      }

      // ^[a-zA-Z0-9]+$

      // "/^[A-z a-z 0-9]+$/i"
      $scope.checkValid = true;
      $scope.setValidity = function(status) {
        // console.log(status)
          $scope.checkValid = status;
      }
      var inventoryListEditPopup = $ionicPopup.show({
        template: `<form name="createInv">
                    <div>Name:</div>
                    <input placeholder={{data.name}}
                           type="text"
                           name="invName"
                           ng-pattern="/^[A-z a-z 0-9]+$/i"
                           ng-model="data.name" maxlength="30"
                           ng-change="setValidity(createInv.invName.$valid)"/>
                    <p ng-if="!checkValid" class="error" style=" color:red !important; text-align: center;margin-top: 5px;">Please enter name</p>
                    <div>Date:</div>
                    <div class="item" style="height: 30px;display: flex;align-items: center;" ng-click= "ctrl.openDatePicker()">{{data.datetimeValue| date: "yyyy-MM-dd"}}</div>
                    <div ng-if="ctrl.stores.length>0" id="dropdown-container"><div style="margin-top: 10px">selected Location: </div>
                    <div style="font-style:italic; padding: 5px; background: lightgray; text-align: center;">{{selectedStore.store_name}}</div>
                  </form>`,
        title: 'Edit Inventory',
        subTitle: '',
        scope: $scope,
        buttons: [{
          text: 'Cancel'
        }, {
          text: '<b>Save</b>',
          type: 'button-positive',
          attr: 'data-ng-disabled="!data.name"',
          onTap: function(e) {
            // console.log("$scope.data.name: ",$scope.data.name)
            if (!$scope.data.name) {
              //don't allow the user to close unless he enters wifi password
              e.preventDefault();
              $scope.checkValid = false;
            } else {
              $scope.checkValid = true;
              return $scope.data;
            }
          }
        }]

      });

      inventoryListEditPopup.then(function(res) {
        if (!!res && !!res.name) {
          var submitPayload = {
            "updated_name": res.name,
            "updated_date": Math.floor(res.datetimeValue.getTime() / 1000).toString(),
            "draft_id": that.inventoryId
          };

          inventoryHomeSvc.updateInventory(submitPayload).then(function(data) {
            if(data.status == 200){
              var updatedTime = (new Date()).toLocaleString("en-US", DATE_OPTIONS);
              setSaveStatusMessage("Last saved on " +  updatedTime, "save-status-green", false)
              inventoryItemsSvc.setDraftSavedTime(that.inventoryId);

              that.inventory_name = res.name;
              that.dateCreated = res.datetimeValue;
              toastMessage("Changes Saved!");
            } else  if(data.status == 503) {
         //     toastMessage("Oops Something went wrong!");
            }

          });
        }
      });
    }

    function getUserEmailId() {
      return $q(function(resolve, reject) {
        CommonService.getUserDefaullEmailId(function(emailIdData) {
          resolve(emailIdData.data.emailId);
        })
      })
    }

    this.openPrompt = function() {

      $scope.emailData = {};
      $scope.emailData.userEmailId = that.userEmailId;
      $scope.emailData.userEmailIdNew ="";
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

              // console.log($scope.emailData.userEmailIdNew);
              // console.log(!pattern.test($scope.emailData.userEmailIdNew));
              // if (!$scope.emailData.userEmailIdNew) {
              //   // e.preventDefault();
              //   // $scope.showError = true;
              // }
              if($scope.emailData.userEmailIdNew == undefined && !pattern.test($scope.emailData.userEmailIdNew)){
                toastMessage("Please Enter Valid Email");
              }
              else
              {
                // e.preventDefault();
                $scope.showError = false;

                $scope.emailData.userEmailIdNew = !$scope.emailData.userEmailIdNew ? that.userEmailId : $scope.emailData.userEmailIdNew;
                // console.log($scope.emailData.userEmailIdNew);
                //
                // console.log(!$scope.emailData.userEmailIdNew);
                $scope.emailData.userEmailId = !$scope.emailData.userEmailIdNew ? $scope.emailData.userEmailId : $scope.emailData.userEmailIdNew;
                //console.log($scope.emailData);
                // console.log($scope.emailData.userEmailId);
                //console.log(pattern.test($scope.emailData.userEmailId));
                if (!$scope.emailData.userEmailId) {
                  toastMessage("Email is required");
                } else if (!pattern.test($scope.emailData.userEmailId)) {
                  toastMessage("Please Enter Valid Email");
                } else {
                  // console.log($scope.emailData.userEmailId);
                  // // //console.log('You are sure ' + that.inventoryId);
                  inventoryHomeSvc.exportInventory(that.inventoryId, $scope.emailData.userEmailId).then(function(data,status) {
                    // console.log(data);
                    confirmPopup.close();
                    if(data.status == 200){
                      if (data.data.status === "success") {
                        toastMessage("<span style='position: relative;bottom: 20px;'>Inventory export request sent! </br> You will be receiving email shortly.</span>");
                      }
                    } else if (data.status == 503){
                     // toastMessage("Something went wrong!");
                    }
                  });
                }
             }
            }
          }
        ]
      });
      // confirmPopup.then(function(emailId) {
      //     //console.log(emailId);
      //     if (emailId) {
      //             // //console.log(emailId);
      //             // //console.log('You are sure ' + that.inventoryId);
      //             // inventoryHomeSvc.exportInventory(that.inventoryId, emailId).then(function(data) {
      //                 // //console.log(data);
      //                 // if (data.status == "success")
      //                     toastMessage("Inventory export request sent! You will be receiving email shortly.");
      //             // });
      //     } else {
      //         // //console.log('You are not sure');
      //     }
      // });
      // });
    };
    $scope.ingredient_ids = [];
    $scope.isDraft=true;

    var responseHandler = function(datas,status){
        // console.log('************************',status);
          //console.log("datas",datas);
          $scope.summaryDataReceived = true;
          if(status == 200){
            var uniqueItems = [];
            _.each(datas.calculatedDatas, function(item) {
              if(uniqueItems.indexOf(item.minorCategory) == -1) {
                uniqueItems.push(item.minorCategory);
              }
            })
            var finalMinorCatItems = [];
            var totalValueOfMinorCatItems = 0;
            _.each(uniqueItems, function(uItem) {
              var minCatItem = {};
              minCatItem.myCalculatedData = 0;
              _.each(datas.calculatedDatas, function(item) {
                if(uItem == item.minorCategory) {
                  minCatItem.style = item.style;
                  minCatItem.minorCategory = item.minorCategory;
                  minCatItem.myCalculatedData += item.myCalculatedData;
                }
              })
              totalValueOfMinorCatItems += minCatItem.myCalculatedData;
              if(minCatItem.minorCategory == '') {
                minCatItem.minorCategory = "Unmapped category";
              }
              finalMinorCatItems.push(minCatItem);
            })
            var totalData = {}
            totalData.minorCategory = "Total Inventory Value";
            totalData.style = 'font-weight: bold;'
            totalData.myCalculatedData = totalValueOfMinorCatItems;
            finalMinorCatItems.push(totalData);
            $scope.minorSummaryData = finalMinorCatItems;

            var sumFood = 0;
            var sumBeverage = 0;
            var sumBeer = 0;
            var sumWine = 0;
            var sumSpirits = 0;
            var sumSupplies = 0;

            sumFood = calculateSummaryValue(datas.calculatedDatas,'FOOD');
            sumBeverage = calculateSummaryValue(datas.calculatedDatas,'BEVERAGE');
            sumBeer = calculateSummaryValue(datas.calculatedDatas,'BEER');
            sumWine = calculateSummaryValue(datas.calculatedDatas,'WINE');
            sumSpirits = calculateSummaryValue(datas.calculatedDatas,'SPIRITS');
            sumSupplies = calculateSummaryValue(datas.calculatedDatas,'SUPPLIES');

            $scope.summaryData = [{
              'label' : 'FOOD',
              'value' : sumFood.toFixed(2),
              'style' : 'font-weight: none;'
            },
            {
              'label' : 'BEVERAGE',
              'value' : sumBeverage.toFixed(2),
              'style' : 'font-weight: none;'
            },
            {
              'label' : 'BEER',
              'value' : sumBeer.toFixed(2),
              'style' : 'font-weight: none;'
            },
            {
              'label' : 'WINE',
              'value' : sumWine.toFixed(2),
              'style' : 'font-weight: none;'
            },
            {
              'label' : 'SPIRITS',
              'value' : sumSpirits.toFixed(2),
              'style' : 'font-weight: none;'
            },
            {
              'label' : 'SUPPLIES',
              'value' : sumSupplies.toFixed(2),
              'style' : 'font-weight: none;'
            },
            {
              'label' : 'Total Inventory Value',
              'value' : parseFloat(sumFood+sumBeverage+sumBeer+sumWine+sumSpirits+sumSupplies).toFixed(2),
              'style' : 'font-weight: bold;'
            }
            ]
          }else {
         //   toastMessage("Something went wrong!", 1200);
          }

      };
      $scope.summaryDataReceived = false;

       var calculateSummaryValue = function(source,type){
        var total = 0;
        _.filter(source, function(o) {
            if(o.pnlCategory != undefined && type != undefined) {
            if((o.pnlCategory).toUpperCase() == (type).toUpperCase()){
              total += o.myCalculatedData;
            }
          }

        })
        // //console.log(total)
        return total;
      }
    $scope.summaryDataReceived = true;

    this.openInventorySummary = function(){
      // //console.log('openInventorySummary',this.items)
      $scope.openSummaryModal();
      _.each(this.items,function(getIngredients){
        //console.log("getIngredients.ingredients",getIngredients.ingredients);
        var myIngredients = _.find(getIngredients.ingredients, function(ingredient) {
          if(_.indexOf($scope.ingredient_ids, ingredient.inventory_item_id) == -1 && ingredient.inventory_item_id && ingredient.quantity!= undefined && ingredient.quantity > 0)
            $scope.ingredient_ids.push(ingredient.inventory_item_id)
        });

      })
      // //console.log(JSON.stringify($scope.ingredient_ids))

      // function calculateSummaryValue(source,type){
      //   var total = 0;
      //   _.filter(source, function(o) {
      //       if(o.pnlCategory == type){
      //         total += o.myCalculatedData;
      //       }

      //   })
      //   // //console.log(total)
      //   return total;
      // }
          // return $scope.sum_food;


      // var responseHandler = function(datas){
      //   // //console.log('****',datas)
      //   $scope.summaryDataReceived = true;
      //   var sumFood = 0;
      //   var sumBeverage = 0;
      //   var sumBeer = 0;
      //   var sumWine = 0;
      //   var sumSpirits = 0;
      //   var sumSupplies = 0;

      //   sumFood = calculateSummaryValue(datas.calculatedDatas,'FOOD');
      //   sumBeverage = calculateSummaryValue(datas.calculatedDatas,'BEVERAGE');
      //   sumBeer = calculateSummaryValue(datas.calculatedDatas,'BEER');
      //   sumWine = calculateSummaryValue(datas.calculatedDatas,'WINE');
      //   sumSpirits = calculateSummaryValue(datas.calculatedDatas,'SPIRITS');
      //   sumSupplies = calculateSummaryValue(datas.calculatedDatas,'SUPPLIES');

      //   // //console.log('FOOD',sumFood)
      //   // //console.log('BEVERAGE',sumBeverage)
      //   // //console.log('BEER',sumBeer)
      //   // //console.log('WINE',sumWine)
      //   // //console.log('SPIRITS',sumSpirits)
      //   // //console.log('SUPPLIES',sumSupplies)

      //   $scope.summaryData = [{
      //     'label' : 'FOOD',
      //     'value' : sumFood.toFixed(2),
      //     'style' : 'font-weight: none;'
      //   },
      //   {
      //     'label' : 'BEVERAGE',
      //     'value' : sumBeverage.toFixed(2),
      //     'style' : 'font-weight: none;'
      //   },
      //   {
      //     'label' : 'BEER',
      //     'value' : sumBeer.toFixed(2),
      //     'style' : 'font-weight: none;'
      //   },
      //   {
      //     'label' : 'WINE',
      //     'value' : sumWine.toFixed(2),
      //     'style' : 'font-weight: none;'
      //   },
      //   {
      //     'label' : 'SPIRITS',
      //     'value' : sumSpirits.toFixed(2),
      //     'style' : 'font-weight: none;'
      //   },
      //   {
      //     'label' : 'SUPPLIES',
      //     'value' : sumSupplies.toFixed(2),
      //     'style' : 'font-weight: none;'
      //   },
      //   {
      //     'label' : 'Total Inventory Value',
      //     'value' : parseFloat(sumFood+sumBeverage+sumBeer+sumWine+sumSpirits+sumSupplies).toFixed(2),
      //     'style' : 'font-weight: bold;'
      //   }
      //   ]

      // }
      if($scope.summaryDataReceived) {
        $scope.summaryDataReceived = false;
        CommonService.getInventorySummary(responseHandler,$scope.ingredient_ids,that.inventoryId,$scope.isDraft);
      }
    }
    DocumentSelectionService.fetchSuppliers().then(function(suppliers) {
      $scope.supplier_list = [];
      _.forEach(suppliers, function(value) {
        // if(value.supplier_name != null && value.supplier_name != ''){
        $scope.supplier_list.push(value);

        // }

      });
    });

    CommonService.fetchMeasurements(function(data) {
      $scope.measurements_list = [];
      _.forEach(data.measurements, function(measurements) {
        if (measurements.measurement_name != null && measurements.measurement_name != '') {
          $scope.measurements_list.push(measurements);

        }

      });
    });





    CommonService.fetchInventoryCategories(function(catData) {
      $scope.categories_list = [];
      _.forEach(catData.categories, function(categories) {
        if (categories.category != null && categories.category != '') {
          $scope.categories_list.push(categories.category);
        }

      });
    });
    $rootScope.minor_categories_list = [];
    CommonService.fetchMinorCategories(function(minorCatData) {
      $rootScope.minor_categories_list = minorCatData.data.minor_categories;
      // console.log("mini",$rootScope.minor_categories_list,minorCatData);
      $scope.minorCategories = minorCatData.data.minor_categories
      // console.log($scope.minorCategories);
    });

    $scope.pnl_categories_list = [];
    CommonService.fetchPnlCategories(function(pnlCatData) {
      $scope.pnl_categories_list = pnlCatData.pl_cat;
    });


    var toastMessage = function(message_text, duration) {
      if (typeof duration === 'undefined') duration = 1500;
      $ionicLoading.show({
        template: message_text,
        noBackdrop: true,
        duration: duration,
      });
    };

    $scope.form = {
      addInvItem: {}
    };


    $ionicModal.fromTemplateUrl('add-inventory-item-modal.html', {
      scope: $scope,
      animation: 'slide-in-up',
      backdropClickToClose: false
    }).then(function(modal) {
      $scope.modal = modal;
    });
    $scope.openModal = function() {
      $scope.modal.show();
    };
    $scope.closeModal = function(model) {
      //console.log('closeModal')
      $scope.form.addInvItem.$setPristine();
      $scope.form.addInvItem.$setUntouched();
      $scope.modal.hide();

    };
    // Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
      $scope.modal.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal.hidden', function() {
      // Execute action
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function() {
      // Execute action
    });

    this.openForm = function() {
      $scope.invItem = {
        "name": "",
        "category": "",
        "measurement": "",
        "price": null,
        "par": 0,
        "supplier_id": "",
        "status": "active",
        "minorCategory": "",
        "pnlCategory": ""
      }

      $scope.openModal();

    }
    function invRes(invData) {
      $scope.groupminor = inventoryService.getSelectedGroupBy();
      if($scope.groupminor == 'minor_category'){
         $scope.Submit="Save";
         $rootScope.minorCategorySelected=false;
      }else{
      $scope.Submit="Submit";
      $rootScope.minorCategorySelected=true;
      }

      // //console.log('invData: ',invData);
      if (invData.status == 200) {
        //$scope.closeModal();
        toastMessage("Your inventory item has been successfully added.", 1200);
        $scope.spinnerShow = true;
        $scope.showItemsLoading=true;
        setTimeout(refreshItemsFromServer(true), 0);
        // refreshItemsFromServer(true);
      } else {
        $scope.closeModal();
        toastMessage("Something goes wrong", 1200);
      }
    }

    $scope.addInventoryItem = function() {
    //  //console.log("here",);
    $scope.groupminor = inventoryService.getSelectedGroupBy();
      if($scope.groupminor == 'minor_category'){
         $scope.Submit="Save";
         $rootScope.minorCategorySelected=false;
      }else{
      $scope.Submit="Submit";
      $rootScope.minorCategorySelected=true;
      }
    if(!$scope.invItem.par){
      $scope.invItem.par = 0;
    }
      $scope.match = false;
      $scope.matchName = '';

      // var matchIngUnit = _.find(that.items, function(categories) {
      //     if(categories.name){
      //         var matchCategories =  _.find(categories.ingredients, function(catName) {
      //         // if(((catName.ingredient_alias_name).toUpperCase() == ($scope.invItem.name).toUpperCase()) && (catName.ingredient_category == $scope.invItem.category)){
      //         //   // if(((catName.ingredient_alias_name).toUpperCase() == ($scope.invItem.name).toUpperCase())){
      //         //   $scope.match = true;
      //         //   $scope.matchName = categories.name;
      //         // }
      //
      //         return (catName.quantity_units_id == $scope.invItem.measurement && ((catName.ingredient_alias_name).toUpperCase() == ($scope.invItem.name).toUpperCase()));
      //       });
      //       // console.log(matchCategories);
      //       return matchCategories;
      //     }
      // });
      // // console.log(matchIngUnit);
      // if(matchIngUnit){
      //   var confirmPopup = $ionicPopup.alert({
      //     title: 'Add Inventory Item',
      //     okType:'button-bal',
      //     template: '<center>There is an other item with the same name and unit ,<br/> Please choose different unit!</center>',
      //   });
      var matchCategories = _.each(that.items, function(categories) {
        if(categories.name){
          _.find(categories.ingredients, function(catName) {
            if(catName.ingredient_alias_name != undefined && $scope.invItem.name != undefined) {
            if(((catName.ingredient_alias_name).toUpperCase() == ($scope.invItem.name).toUpperCase()) && (catName.ingredient_category == $scope.invItem.category)){
              // if(((catName.ingredient_alias_name).toUpperCase() == ($scope.invItem.name).toUpperCase())){
              $scope.match = true;
              $scope.matchName = categories.name;
            }
          }
          });
        }
      });

      if($scope.match){
        var confirmPopup = $ionicPopup.show({
          title: 'Add Inventory Item',
          buttons: [
                    {text: 'Ok',
                     type: 'button-bal myClass'}],
          // template: '<center>Item with same name already exists in '+$scope.matchName+'</center>',
          template: '<center>There is an other item with the same name ,<br/> Please add different name!</center>',
        });

      } else{
        //console.log('call api')
        $scope.closeModal();
        CommonService.addNewInvItem(invRes, $scope.invItem);
      }

    }
    var removeSearchStatus = false;
    var removeSearch = function() {
      removeSearchStatus = true;
      //console.log("removeSearch : ", !angular.isUndefined(filterBarInstance));
      if (!angular.isUndefined(filterBarInstance)) {
        filterBarInstance()
        _.forEach(that.items, function(inventoryGroup) {
          _.forEach(inventoryGroup.ingredients, function(ingredient) {
            ingredient.searchHidden = false;

          })
        })


      }

    }

    $ionicModal.fromTemplateUrl('inv-summary-modal.html', {
      scope: $scope,
      animation: 'slide-in-up',
      backdropClickToClose: false
    }).then(function(modal) {
      $scope.summary_modal = modal;
    });
    $scope.openSummaryModal = function() {
      $scope.summary_modal.show();
    };
    $scope.closeSummaryModal = function(model) {
      //console.log('closeModal')
      $scope.summary_modal.hide();
    };
    $scope.headerItems = [
      {
          label1: 'Food',
          specialStyle: 'text-align: left;',
          col_width: 'col-67'
      },
      {
        label2: '$1,234',
        specialStyle: 'text-align: right;padding-right:5px;',
        col_width: 'col-67'
      },
      {
          label1: 'Food',
          specialStyle: 'text-align: left;',
          col_width: 'col-33'
      },
      {
        label2: '$1,234',
        specialStyle: 'text-align: right;padding-right:5px;',
        col_width: 'col-33'
      }
      ]
      // console.log("$state.params",$state.params)
      // console.log("this.minorCategoryselected1",$rootScope.minorCategoryselected);
      this.showEditMinorCategory = function(){

        // console.log("this.minorCategoryselected",$rootScope.minorCategoryselected);
        inventoryItemsSvc.getGroupingOption().then(function(currentView){
          if(currentView.identifier !== "MinorCategory" ){
              // console.log('minor category group');
              inventoryService.setSelectedGroupBy('minor_category');
              $scope.parDir= false;
              that.showLoader = true;
              removeSearch();
              inventoryItemsSvc.setGroupingOption('MinorCategory')
              that.editMode = 'edit';
              refreshItemsFromServer('minorcategory');
            }
            $rootScope.$broadcast('MinorCatSelect')
            $rootScope.minorCategoryselected=false;
            $scope.Category='Minor Category';
            $scope.Submit="Save";
            // $rootScope.minorcat=false;
            // hideSheet();
            return true;
        })
      }
    this.showSortingActionsheet = function() {
      $scope.parDir = false;
      var hideSheet = $ionicActionSheet.show({
        buttons: [{
          text: 'Par value'
        },{
          text: 'Default'
        }],
        titleText: 'Select grouping',
        cancelText: 'Cancel',
        cancel: function() {},
        buttonClicked: function(index) {
          inventoryItemsSvc.getGroupingOption().then(function(currentView) {
            // console.log("currnt view",currentView,index)
            if (index == 0 && currentView.identifier !== "PAR") {
              // console.log(' ****** PAR ******');
              inventoryService.setSelectedGroupBy('quantity_to_par_group');
              that.showLoader = true;
              removeSearch();
              inventoryItemsSvc.setGroupingOption('PAR')
              $scope.$broadcast('GROUPBYPARVALUE');
             // console.log($scope.$broadcast('GROUPBYPARVALUE'))
              that.editMode = 'edit';
              inventoryItemsSvc.groupIngredients(that.inventoryId)
                .then(function(groupedList) {
                  $scope.parDir = true;
                  // console.log(groupedList)
                  // that.items = groupedList;
                  $scope.pushActive(groupedList,[])
                  that.showLoader = false;
                })
                refreshItemsFromServer();
            } else if (index == 1 && currentView.key !== $state.params.group_by_field) {
              // console.log(' **** DEFAULT *******');
              inventoryService.setSelectedGroupBy('ingredient_category');
              $scope.parDir = false;
              that.showLoader = true;
              removeSearch();
              inventoryItemsSvc.setGroupingOption($state.params.group_by_field)
              //$scope.$broadcast('NOTGROUPBYPARVALUE');
              //console.log($scope.$broadcast('NOTGROUPBYPARVALUE'))
              that.editMode = 'edit';
              refreshItemsFromServer();
            }
            $rootScope.$broadcast('MinorCatSelect')
            //                else {
            ////                    //console.log("same button clicked");
            //                }
            hideSheet();
            return true;
          })
        }
      });
    }

    $scope.data ={
      searchText : ''
    }
    this.showFilterBarsea = function() {
      $scope.searchItem = true;
    }
    $scope.closeSearch = function(){
       $scope.data.searchText = '';
       $scope.searchItem = false;
    }
    $scope.clearSearch = function(){
       $scope.data.searchText = '';
       // $scope.searchItem = false;
    }
    $scope.$watch('data.searchText', function(newVal) {
      $scope.searchText = newVal;
              $rootScope.$broadcast('start_search_inv',newVal)
          }, true);
    this.showFilterBar = function() {
      // console.log('********** showFilterBar calling ********');
      //console.log("that.item in filter : ", that.items);
      var search_fields = ['ingredient_alias_name','minor_category','ingredient_category', 'ingredient_name', 'supplier_name', 'location'];

      filterBarInstance = $ionicFilterBar.show({
        items: $scope.updatedItems,
        debounce: true,
        update: function(filteredItems, filterText) {
          // console.log("filteredItems : ", filteredItems)
          if (angular.isDefined(filterText) && filterText.length > 0) {
            _.forEach(filteredItems, function(inventoryGroup) {
              _.forEach(inventoryGroup.ingredients, function(ingredient) {
                var keepIngredient = false;
                _.forEach(search_fields, function(search_field) {
                  var textToSearch = _.get(ingredient, search_field, "");
                  if (textToSearch != "" && textToSearch != undefined && filterText != undefined) {
                    if (textToSearch.toLowerCase().indexOf(filterText.toLowerCase()) != -1) {
                      keepIngredient = true
                    }
                  }
                  if (keepIngredient) {
                    ingredient.searchHidden = false;
                  } else {
                    ingredient.searchHidden = true;
                  }
                })
              })

            })

            that.items = filteredItems
            // console.log("that.items",that.items)
          } else {
            //console.log("else part : ", $scope.updatedItems);
            that.items = $scope.updatedItems;
            if (removeSearchStatus) {
              removeSearchStatus = false;
              return
            }
            _.forEach(filteredItems, function(inventoryGroup) {
              _.forEach(inventoryGroup.ingredients, function(ingredient) {
                ingredient.searchHidden = false;

              })
            })
          }
        },
        cancel: function() {
          //console.log("cancel is called : ", $scope.updatedItems);
          that.items = $scope.updatedItems;
        }
      });
    };

    $scope.submitInventory = function() {
      console.log("submit inventory called")
      var minorcatval =inventoryService.getSelectedGroupBy();

     if(minorcatval == 'minor_category'){
       if($scope.resultedarray.length == 0){
         toastMessage("Oops nothing to do",3000);
       }else{
       that.showLoader = true;
       inventoryItemsSvc.postIngredientsminor(that.inventoryId, that.inventory_status,$scope.resultedMinorCat).then(
            function() {
              toastMessage("Minor category updated successfully.", 2000);
              // $state.go('app.inventoryManager');
              $scope.resultedarray=[];
              refreshItemsFromServer('minorcategory');
              // that.showLoader = false;
            },
            function(errorResponse) {
              toastMessage(errorToastMessage)
              var lastSavedtime = inventoryItemsSvc.getDraftSavedTime(that.inventoryId);
              that.showLoader = false;
              setSaveStatusMessage("minor category update failed. ", "save-status-red")
              if (lastSavedtime != "") {
                lastSavedtime = (new Date(lastSavedtime*1000)).toLocaleString("en-US", DATE_OPTIONS);
                setSaveStatusMessage("Last saved on " + lastSavedtime, "save-status-green", true)
              }
            }
          );
       }

     }else{
       if(that.totalValue != 0){
      var confirmPopup = $ionicPopup.confirm({
        title: 'Inventory Submit',
        template: 'Do you want to submit Inventory?',
      });


      // inventoryItemsSvc.postIngredients(that.inventoryId, that.inventory_status).then(function() {
      //         that.showLoader = true;
      // inventoryItemsSvc.setDraftSavedTime(that.inventoryId);
      confirmPopup.then(function(res) {
        if (res) {
          that.showLoader = true;
          that.inventory_status = 'submitted';
          inventoryItemsSvc.postIngredients(that.inventoryId, that.inventory_status).then(

            function(res) {
              toastMessage("Inventory submitted successfully.", 2000);
/*            console.log("before popup");
              var resp = JSON.parse(res.config.data);
              var ing = resp['ingredients'];
              var recommendedIng = ing.filter(function (_ing) {
                console.log(_ing);
                if(_ing.hasOwnProperty('quantity') && (_ing.quantity < _ing.par)){
                    return _ing;
                }
              });
              // var recommendedIng = ing.map(function (_ing) {
              //   console.log(_ing);
              //   if(_ing.hasOwnProperty('quantity') && (_ing.quantity < _ing.par)){
              //       return _ing;
              //   }
              // });
              console.log("recommended")
              console.log(recommendedIng);
              let localRecommended = localStorage.getItem("recommendedDatas") ? JSON.parse(localStorage.getItem("recommendedDatas")) : [];
              console.log(localRecommended);
              if(recommendedIng.length){
                _.forEach(recommendedIng, function(ing,ind) {
                  // console.log(ing);
                  let available = _.findIndex(localRecommended,['ingredient_alias_name',ing.ingredient_alias_name.toString()]);
                  if(available < 0){
                    localRecommended.push({'ingredient_alias_name':ing.ingredient_alias_name});
                  }
                  localStorage.setItem("recommendedDatas",JSON.stringify(localRecommended));
                });
              }
              // console.log(recommendedIng.length,localRecommended);


              var purchaseOrderPopup = $ionicPopup.confirm({
                title: 'Recommended Items',
                okType:'button-bal',
                template: '<center>Pepr recommends '+ recommendedIng.length+' items to be ordered. <br/>Do you want to order them now</center>',
                buttons: [
                  {
                      text: '<b>NO</b>'
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
              console.log("after confirm");
              purchaseOrderPopup.then(function(res){
                if(res){
                  $state.go('app.ordering');
                }else{
                  $state.go('app.inventoryManager');
                }
              })
*/
            $state.go('app.inventoryManager');
            },
            function(errorResponse) {
              toastMessage(errorToastMessage)
              var lastSavedtime = inventoryItemsSvc.getDraftSavedTime(that.inventoryId);
              that.showLoader = false;
              setSaveStatusMessage("Submit failed. ", "save-status-red")
              if (lastSavedtime != "") {
                lastSavedtime = (new Date(lastSavedtime*1000)).toLocaleString("en-US", DATE_OPTIONS);
                setSaveStatusMessage("Last saved on " + lastSavedtime, "save-status-green", true)
              }
            }
          );
        }
        // else {
        //   // $state.go('app.composeInventory', {
        //   //     inventory: that.inventoryId
        //   // }).then(function() {
        //   that.showLoader = false;
        //   // });
        // }
      });
    }
  }
      //     },
      //     function(errorResponse) {
      //         toastMessage(errorToastMessage)
      //         setSaveStatusMessage("Submit failed. Remove errors and resubmit.", "save-status-red")
      //     }
      // );

    };
    $rootScope.$on('checkforExpanded',function(evnt,data) {
      // console.log("data",data)
      _.forEach(that.items,function(cat) {
        if(data.name == cat.name) {
          cat.isExpanded = data.isExpanded;
        }else {
          cat.isExpanded = false;
        }
      })
    });

    var checkForFailedQuantities = function() {
      var failedQuantitesFound = false;
      for (var i = 0; i < that.items.length; i++) {
        for (var j = 0; j < that.items[i].ingredients.length; j++) {
          var ingredient = that.items[i].ingredients[j]
          if (ingredient.quantity != ingredient.stageQuantity) {
            failedQuantitesFound = true;
            break;
          }
        }
        if (failedQuantitesFound) {
          break;
        }
      }
      if (failedQuantitesFound) {
        // setSaveStatusMessage(".", "save-status-green", true)
       // setSaveStatusMessage("Invalid entries were ignored.", "save-status-red", true)
      }
    }


    $scope.connectionLostWatcher = function() {
                     // console.log("checking lost connection : "+ inventoryItemsSvc.hasLostInternetConnection())
      return inventoryItemsSvc.hasLostInternetConnection();
    }

    $scope.$watch($scope.connectionLostWatcher,
      function backButtonActivator(newValue, oldValue) {
        // console.log("backButtonActivator",newValue, oldValue)
        if (!oldValue && newValue) {
          setSaveStatusMessage("Offline Mode.", "save-status-red")
        } else if (!newValue && oldValue) {
          setSaveStatusMessage("Back Online.", "save-status-green")
        }
      }
    );




    $rootScope.$on('product-category-value-updated', function(evt, data) {
      $rootScope.$broadcast('MinorCatSelect')
      // console.log('************ product-category-value-updated *******')
      inventoryItemsSvc.getGroupingOption().then(function(currentView) {
        if (currentView != "PAR") {
          // console.log(that.items);
          that.totalValue = that.items.filter(function(ele) {
            return ele.totalValue !== undefined && ele.totalValue !== null;
          }).map(function(ele) {
            return ele.totalValue;
          }).reduce(function(prev, cur) {
            return prev + cur;
          }, 0);
          // console.log(that.totalValue);
          inventoryHomeSvc.passTotalValue(that.totalValue, inventoryService.getInventoryId());
          if (!!data && !!data.config && data.config.makeServerRequest) {
            setSaveStatusMessage("Saving...", "save-status-neutral")
            $scope.summaryDataReceived = false;
            inventoryItemsSvc.postIngredients(inventoryService.getInventoryId(), that.inventory_status).then(function() {
            CommonService.getInventorySummary(responseHandler,$scope.ingredient_ids,inventoryService.getInventoryId(),$scope.isDraft);
              inventoryItemsSvc.setDraftSavedTime(inventoryService.getInventoryId());
              setSaveStatusMessage("All Changes saved to Pepr.", "save-status-green")
              checkForFailedQuantities();
            }, function(errorResponse) {
              toastMessage(errorToastMessage)
              var lastSavedtime = inventoryItemsSvc.getDraftSavedTime(inventoryService.getInventoryId());
              setSaveStatusMessage("Autosave failed. ", "save-status-red")
              if (lastSavedtime != "") {
                lastSavedtime = (new Date(lastSavedtime*1000)).toLocaleString("en-US", DATE_OPTIONS);
                setSaveStatusMessage("Last saved on " + lastSavedtime, "save-status-green", true)
              }
            });
          }
        }
      })
    });

    $scope.$on('product-ingredient-updated', function(evt, data) {
      //inventoryHomeSvc.passUnits(data.units, that.inventoryId);
      if (data.config.makeServerRequest) {
        setSaveStatusMessage("Saving...", "save-status-neutral")
        //  //console.log(that.items);
        //                      for (i=0; i< that.items.length; i++){
        //                        //console.log(that.items[0].ingredients[0].quantity_units);
        //                        for (j=0; j<that.items[i].ingredients.length; j++) {
        //                          if (that.items[i].ingredients[j].ingredient_id == data.id){
        //                            that.items[i].ingredients[j].quantity_units = data.unit;
        //                          };
        //                          //console.log(that.items[0].ingredients[0].quantity_units);
        //                        }
        //                      }

        inventoryItemsSvc.postIngredients(inventoryService.getInventoryId(), that.inventory_status).then(function() {
          inventoryItemsSvc.setDraftSavedTime(inventoryService.getInventoryId());
          setSaveStatusMessage("All Changes saved to Pepr.", "save-status-green");
          that.showLoader = false;
          // $scope.$broadcast('DRAFTSAVEDSUCCESSFULLY');
        }, function(errorResponse) {
          toastMessage(errorToastMessage)
          var lastSavedtime = inventoryItemsSvc.getDraftSavedTime(inventoryService.getInventoryId());
          setSaveStatusMessage("Autosave failed. ", "save-status-red")
          if (lastSavedtime != "") {
            lastSavedtime = (new Date(lastSavedtime*1000)).toLocaleString("en-US", DATE_OPTIONS);
            setSaveStatusMessage("Last saved on " + lastSavedtime, "save-status-green", true)
          }
        })
      }

      $rootScope.$broadcast('product-category-value-updated', {
        config: {
          makeServerRequest: false
        }
      })
    });
    $rootScope.$on('new-product-ingredient-updated', function(evt, data) {
      // console.log('**** new-product-ingredient-updated ***',);

      //inventoryHomeSvc.passUnits(data.units, that.inventoryId);
      if (data.config.makeServerRequest) {
        setSaveStatusMessage("Saving...", "save-status-neutral")

        inventoryItemsSvc.postIngredients(inventoryService.getInventoryId(), that.inventory_status).then(function() {
          inventoryItemsSvc.setDraftSavedTime(inventoryService.getInventoryId());
          setSaveStatusMessage("All Changes saved to Pepr.", "save-status-green");
          that.showLoader = false;
          // $scope.$broadcast('DRAFTSAVEDSUCCESSFULLY');
        }, function(errorResponse) {
          toastMessage(errorToastMessage)
          var lastSavedtime = inventoryItemsSvc.getDraftSavedTime(inventoryService.getInventoryId());
          setSaveStatusMessage("Autosave failed. ", "save-status-red")
          if (lastSavedtime != "") {
            lastSavedtime = (new Date(lastSavedtime*1000)).toLocaleString("en-US", DATE_OPTIONS);
            setSaveStatusMessage("Last saved on " + lastSavedtime, "save-status-green", true)
          }
        })
      }

      $rootScope.$broadcast('product-category-value-updated', {
        config: {
          makeServerRequest: false
        }
      })
      // inventoryItemsSvc.groupIngredients(inventoryService.getInventoryId())
      // .then(function(groupedList) {
      //   // console.log('test**********',groupedList)
      //   // // that.items = groupedList;
      //   // // //console.log($scope.update_config)
      //   // $scope.pushActive(groupedList,$scope.update_config)
      //   // // that.showLoader = false;
      // })
    });

    var setSaveStatusMessage = function(message, level, appendMessage) {
      if (angular.isUndefined(appendMessage)) {
        appendMessage = false;
      }
      if (!appendMessage) {
        that.saveStatus = [];
      }
      that.saveStatus.push({
        text: message,
        level: level
      });
      inventoryService.setStatusMsg(that.saveStatus);
      $rootScope.$emit('LASTSAVEDSTATUS', that.saveStatus)
    }
    $scope.resultedGroup = []
    $scope.calculatePrice = function() {
      that.showLoader = true;
      $scope.showItemsLoading = true;
      var servicereqData ={
        'draft_id' : that.inventoryId
      }
       CommonService.getCalculatePriceOfINv(function(data) {
          _.forEach(data.categories,function(cat) {
            _.forEach(that.items,function(ing) {
              if(cat.category_name != undefined && ing.name != undefined){
              if(cat.category_name.toLowerCase() == ing.name.toLowerCase()) {
                ing.totalValue = cat.value;
              }
            }
              _.forEach(ing.ingredients,function(cat) {
                if(cat.quantity) {
                  // console.log("cat",cat)
                  quantity = (cat.quantity);
                  price = (cat.ingredient_price);
                  cat.ingValue = quantity * price;
                } else {
                  cat.ingValue  = 0
                }
              })
            })
          })
          that.totalValue = that.items.filter(function(ele) {
              return ele.totalValue !== undefined && ele.totalValue !== null;
            }).map(function(ele) {
              return ele.totalValue;
            }).reduce(function(prev, cur) {
              return prev + cur;
            }, 0);
      that.showLoader = false;
      $scope.showItemsLoading = false;
      },servicereqData)

    }

    $scope.$on('$destroy', function() {

    });

    var checkStatusOptionAndShowToastMsg = function(new_config, changed_items) {
      //            //console.log(new_config)
      if (_.has(new_config, ['ingredientStatus'])) {
        let selected_status_option = _.get(new_config, ['ingredientStatus']);
        //                 //console.log(selected_status_option)
        if (selected_status_option === 'inactive') {
          //                    //console.log(_.get(new_config, [ 'globalIngredientName'])+" will be removed from the next inventory.")
          var changed_names = _.chain(changed_items)
            .map('ingredient_alias_name')
            .uniq()
            .join(', ')
            .value();
          // //console.log(changed_items);
          if (_.some(changed_items, function(changed_item) {
              return changed_item.quantity !== null;
            })) {
            toastMessage(changed_names + " shall be removed from the next inventory", 3000)
          } else {
            toastMessage(changed_names + " shall be removed from current and future inventory", 3000)
          }


        }


      }

    }

    var supplier_item_config_update_refresh = 0;

    // event defined in ../inventory-management/directives/product-category/product-category-drct.js
    // event called from ../inventory-management/directives/config-modifier/inventory-config-modifier-ctrl.js

    $scope.$on('SUPPLIERITEMCONFIGUPDATED', function(event, new_config) {
     // console.log('config update caught in compose ctrl');
      $scope.update_config = new_config;
      that.showLoader = true;
      $rootScope.editFlag = false;
      _.forEach(that.items, function(inventoryGroup,ind) {
          let changed_items = _.filter(inventoryGroup.ingredients, {
            // 'supplier_id': new_config.supplierId,
            // 'supplier_item_id': new_config.supplierItemId
            'inventory_item_id': new_config.inventoryItemId
          })
          // //console.log(changed_items)
          $timeout(function() {
            checkStatusOptionAndShowToastMsg(new_config, changed_items)
          })

        _.forEach(changed_items, function(changed_item,i) {

          changed_item.ingredient_alias_name = new_config.supplierItemAliasName;
          changed_item.par = new_config.par;
          changed_item.ingredient_category = new_config.ingredientInventoryCategory;
          changed_item.quantity_units_id = new_config.inventoryMeasurementId;
          changed_item.quantity_units = new_config.measurementName;
          changed_item.ingredient_price = new_config.inventoryMeasurementUnitPrice;
          changed_item.quantity = changed_item.quantity * new_config.computedConversionFactor;
          changed_items.active = new_config.active;


          if(changed_items.length == i+1){
            //console.log('if----------------------------')
            // $rootScope.$emit('EDITCONFIGDONE', new_config)
            inventoryItemsSvc.groupIngredients(new_config.inventoryItemId)
            .then(function(groupedList) {
              // console.log('test**********')
              // that.items = groupedList;
              // //console.log($scope.update_config)
              $scope.pushActive(groupedList,$scope.update_config)
              // that.showLoader = false;
            })
          }
        })


    })




      $scope.$broadcast('product-ingredient-updated', {
        config: {
          makeServerRequest: true
        }
      })
      supplier_item_config_update_refresh = supplier_item_config_update_refresh + 1
      $timeout(function() {
        inventoryItemsSvc.groupIngredients(that.inventoryId)
          .then(function(groupedList) {
            // //console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@',groupedList)
            // that.items = groupedList;
            // //console.log($scope.update_config)
            if($scope.update_config)
              $scope.pushActive(groupedList,$scope.update_config)
            else
              $scope.pushActive(groupedList,[])
            // that.showLoader = false;
          })
      })




    })

    $rootScope.$on('NEWSUPPLIERITEMCONFIGUPDATED', function(event, new_config) {
     // console.log('config update caught in compose ctrl',new_config);
      $scope.update_config = new_config;
      that.showLoader = true;
      $rootScope.editFlag = false;
      _.forEach(that.items, function(inventoryGroup,ind) {
          let changed_items = _.filter(inventoryGroup.ingredients, {
            // 'supplier_id': new_config.supplierId,
            // 'supplier_item_id': new_config.supplierItemId
            'inventory_item_id': new_config.inventoryItemId
          })
          // //console.log(changed_items)
          $timeout(function() {
            checkStatusOptionAndShowToastMsg(new_config, changed_items)
          })

        _.forEach(changed_items, function(changed_item,i) {
          // console.log("changed_item",changed_item)
          changed_item.ingredient_alias_name = new_config.supplierItemAliasName;
          changed_item.par = new_config.par;
          changed_item.ingredient_category = new_config.ingredientInventoryCategory;
          changed_item.quantity_units_id = new_config.inventoryMeasurementId;
          if(new_config.measurementName){
          changed_item.quantity_units = new_config.measurementName;}
          changed_item.ingredient_price = new_config.inventoryMeasurementUnitPrice;
          // changed_item.quantity = changed_item.quantity * new_config.computedConversionFactor;

          changed_item.quantity = changed_item.quantity * new_config.computedConversionFactor;
          changed_items.active = new_config.active;

          if(changed_items.length == i+1){
            //console.log('if----------------------------')
            // $rootScope.$emit('EDITCONFIGDONE', new_config)
            inventoryItemsSvc.groupIngredients(new_config.inventoryItemId)
            .then(function(groupedList) {
              // console.log('test**********')
              // that.items = groupedList;
              // console.log(groupedList)
              $scope.pushActive(groupedList,$scope.update_config)
              // that.showLoader = false;
            })
          }
        })


    })




      $scope.$broadcast('product-ingredient-updated', {
        config: {
          makeServerRequest: true
        }
      })
      supplier_item_config_update_refresh = supplier_item_config_update_refresh + 1
      $timeout(function() {
        inventoryItemsSvc.groupIngredients(that.inventoryId)
          .then(function(groupedList) {
            // //console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@',groupedList)
            // that.items = groupedList;
            // //console.log($scope.update_config)
            // console.log(groupedList);
            if($scope.update_config)
              $scope.pushActive(groupedList,$scope.update_config)
            else
              $scope.pushActive(groupedList,[])
            // that.showLoader = false;
          })
      })




    })

    $rootScope.$on('SUPPLIERITEMCONFIGUPDATEDUNit', function(event, new_config) {
      // console.log('config update caught in compose ctrl',new_config);
      $scope.update_config = new_config;
      that.showLoader = true;
      $rootScope.editFlag = false;
      _.forEach(that.items, function(inventoryGroup,ind) {
          let changed_items = _.filter(inventoryGroup.ingredients, {
            // 'supplier_id': new_config.supplierId,
            // 'supplier_item_id': new_config.supplierItemId
            'inventory_item_id': new_config.inventoryItemId
          })
          // //console.log(changed_items)
          $timeout(function() {
            checkStatusOptionAndShowToastMsg(new_config, changed_items)
          })

        _.forEach(changed_items, function(changed_item,i) {


          changed_item.ingredient_alias_name = new_config.supplierItemAliasName;
          changed_item.par = new_config.par;
          changed_item.ingredient_category = new_config.ingredientInventoryCategory;
          changed_item.quantity_units_id = new_config.inventoryMeasurementId;
          if(new_config.measurementName){
          changed_item.quantity_units = new_config.measurementName;}
          changed_item.ingredient_price = new_config.inventoryMeasurementUnitPrice;
          // console.log(changed_item.ingredient_price);
          // changed_item.quantity = changed_item.quantity * new_config.computedConversionFactor;
          changed_items.active = new_config.active;


          if(changed_items.length == i+1){
            //console.log('if----------------------------')
            // $rootScope.$emit('EDITCONFIGDONE', new_config)
            inventoryItemsSvc.groupIngredients(new_config.inventoryItemId)
            .then(function(groupedList) {
              //console.log('test**********')
              // that.items = groupedList;
              // //console.log($scope.update_config)
              // console.log('**** 5 ****');
              $scope.pushActive(groupedList,$scope.update_config)
              // that.showLoader = false;
            })
          }
        })


    })





      $scope.$broadcast('product-ingredient-updated', {
        config: {
          makeServerRequest: true
        }
      })
      supplier_item_config_update_refresh = supplier_item_config_update_refresh + 1
      $timeout(function() {
        inventoryItemsSvc.groupIngredients(that.inventoryId)
          .then(function(groupedList) {
            // //console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@',groupedList)
            // that.items = groupedList;
            // //console.log($scope.update_config)
            // console.log('**** 6 ****');
            if($scope.update_config)
              $scope.pushActive(groupedList,$scope.update_config)
            else
              $scope.pushActive(groupedList,[])
            // that.showLoader = false;
          })
      })




    })

    // event defined in ../inventory-management/directives/product-category/product-category-drct.js
    // event called from ..inventory-management/directives/change-price/change-price-ctrl.js
    $scope.$on('INVENTORYUNITPRICECHANGED', function(event, new_config) {
      //console.log('Price change caught in compose ctrl');
      // //console.log(new_config)
      // that.showLoader = true;
      _.forEach(that.items, function(inventoryGroup) {
        let changed_items = _.filter(inventoryGroup.ingredients, {
          // 'supplier_id': new_config.supplierId,
          // 'supplier_item_id': new_config.supplierItemId
          'inventory_item_id': new_config.inventory_item_id
        })
        // //console.log(changed_items)
        $timeout(function() {
          checkStatusOptionAndShowToastMsg(new_config, changed_items)
        })

        _.forEach(changed_items, function(changed_item) {
          changed_item.ingredient_price = new_config.ingredient_price;
          changed_item.ingredient_price_display = new_config.ingredient_price;
        })

      })

      $scope.$broadcast('product-ingredient-updated', {
        config: {
          makeServerRequest: true
        }
      })
      // supplier_item_config_update_refresh = supplier_item_config_update_refresh + 1
      // $timeout(function(){
      //     inventoryItemsSvc.groupIngredients(that.inventoryId)
      //         .then(function(groupedList) {
      //             that.items = groupedList;
      //             // that.showLoader = false;
      //         })
      // })




    })
    $scope.resultedarray=[];
    $scope.resultedMinorCat=[];
    $rootScope.$on('minorresulteddata', function(evt,data) {
      if($scope.resultedMinorCat.length <= 0){
        var temp={};
        temp.inv_id =data.inventory_item_id;
        temp.category= data.ingredient_category;
        temp.minor_category = data.minor_category;
        $scope.resultedMinorCat.push(temp);
      }
      _.forEach($scope.resultedMinorCat,function(item){
          if(item.inventory_item_id === data.inventory_item_id ){
            item.minor_category=data.minor_category;
          }else{
            var temp={};
            temp.inv_id =data.inventory_item_id;
            temp.category= data.ingredient_category;
            temp.minor_category = data.minor_category;
            $scope.resultedMinorCat.push(temp);
          }
        })
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
  $scope.resultedMinorCat = arrUnique($scope.resultedMinorCat);

   _.forEach(that.items,function(item){
     _.forEach(item.ingredients,function(value){
       $scope.resultedarray.push(value);

     })
   })
    });

    $scope.$on('DRAFTSAVEDSUCCESSFULLY', function(evt) {
      //            //console.log('DRAFTSAVEDSUCCESSFULLY event caught')
      $timeout(function() {
        if (supplier_item_config_update_refresh > 0) {
          // that.showLoader = true;
          supplier_item_config_update_refresh = supplier_item_config_update_refresh - 1;
          //                    //console.log('refreshing from server')
          $timeout(function() {
            toastMessage("Refreshing ingredients with modified configurations", 2000)
          })

          refreshItemsFromServer(true);
        }

      }, 0)

    })


    $scope.$on('ReSizeScroll', function(evt) {
      // //console.log('ReSizeScroll')
      $timeout(function() {
        $ionicScrollDelegate.resize();
      }, 0)
    });
    $scope.$on('GROUPTOGGLED', function(evt) {
      // //console.log('GROUPTOGGLED')
      $timeout(function() {
        $ionicScrollDelegate.resize();
      }, 0)
    });

    // var toastMessage = function(message_text, duration) {
    //     if (typeof duration === 'undefined') duration = 2000;
    //     $ionicLoading.show({
    //         template: message_text,
    //         noBackdrop: true,
    //         duration: duration
    //     });
    // }




    $scope.$on('ReSizeScroll', function(evt) {
      // //console.log('ReSizeScroll')
      $timeout(function() {
        $ionicScrollDelegate.resize();
      }, 0)
    });
    $scope.$on('GROUPTOGGLED', function(evt) {
      // //console.log('GROUPTOGGLED')
      $timeout(function() {
        $ionicScrollDelegate.resize();
      }, 0)
    });

    // var toastMessage = function(message_text, duration) {
    //     if (typeof duration === 'undefined') duration = 2000;
    //     $ionicLoading.show({
    //         template: message_text,
    //         noBackdrop: true,
    //         duration: duration
    //     });
    // }

    $scope.checkVal = function(val) {
      if (val) {
        // val = val.substring(1);
        // //console.log(val, isNaN(val));
        if (!isNaN(val)) {
          $scope.PriceError = false;
        } else
          $scope.PriceError = true;
      }

    }

    $scope.priceUpdated = function(value) {
      // console.log(value)
      value = parseFloat(value);
      // console.log(value);
      // if(isNaN(value)){
      //   //console.log('if')
      //   $scope.invItem.price = null;
      // }else{
      //   //console.log('else');
      //   $scope.invItem.price = value.toFixed(2);
      // }
      $scope.invItem.price = isNaN(value) ? null : value.toFixed(2);
      // console.log($scope.invItem.price)
    };

    $scope.parUpdated = function(value) {
      value = parseFloat(value);
      $scope.invItem.par = isNaN(value) ? null : value.toFixed(2);
    };
    // $scope.toTwoDigit = function(value){
    //     value = parseFloat(value);
    //     // //console.log(value)
    //     $scope.invItem.price = (isNaN(value)) ? '' : value.toFixed(2)
    // }


    // $scope.convert = function(val) {
    //   //console.log(val);
    //   $scope.invItem.price = val.substring(0, 1) == "$" ? "$" + val.substring(1) : "$" + val.substring(0);
    //   // var input = angular.element( document.querySelector( '#price-add-qa' ) );
    //   // //console.log(input)
    //   // //console.log($scope.invItem.price.length)
    //   // ctrl.focus();
    //   // ctrl.setSelectionRange($scope.invItem.price.length, $scope.invItem.price.length);
    //   // setCaretPosition(input, $scope.invItem.price.length);

    // }


  };
  projectCostByte.directive('transformTest', function() {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function(scope, element, attrs, ngModel) {

        if (ngModel) {

          // ngModel.$formatters.push(function (value) {
          //     //console.log(value)
          //     if(value)
          //         return '$ '+ value;
          // });

          ngModel.$parsers.push(function(value) {
            return value;
          });



        }
      }
    };
  });

  // projectCostByte.directive('customCurrency', ['$filter', function ($filter) {
  // return {
  //     require: 'ngModel',
  //     link: function (elem, $scope, attrs, ngModel) {
  //             //console.log(ngModel);
  //             ngModel.$formatters.push(function (val) {
  //                 return $filter('currency')(val)
  //             });
  //             ngModel.$parsers.push(function (val) {
  //                 return val.replace(/[\$,]/, '')
  //             });
  //         }
  //     }
  // }])

  InventoryComposeCtrl.$inject = ['$q', '$scope', '$state', '$ionicFilterBar', '$ionicActionSheet',
    'inventoryItemsSvc', '$ionicLoading', '$ionicPopup', '$ionicScrollDelegate', '$timeout', 'inventoryHomeSvc',
    'ionicDatePicker', 'CommonService', 'Utils', 'DocumentSelectionService', '$ionicModal', '$filter','$ionicNavBarDelegate','$rootScope','inventoryService','$cordovaNetwork'
  ];
  projectCostByte.controller('InventoryComposeCtrl', InventoryComposeCtrl);

  projectCostByte.directive('caret', function() {

    function setCaretPosition(elem, caretPos) {
        //console.log("length", caretPos);
        if (elem !== null) {
            if (elem.createTextRange) {
                var range = elem.createTextRange();
                range.move('character', caretPos);
                range.select();
            } else {
                if (elem.selectionStart) {
                    elem.focus();
                    elem.setSelectionRange(caretPos, caretPos);
                } else
                    elem.focus();
            }
        }
    }

    return {
        scope: {value: '=ngModel'},
        link: function(scope, element, attrs) {
          scope.$watch('value', function(newValue, oldValue) {
            if (newValue && newValue != oldValue) {
                val = element[0].value;
                element[0].value = val.substring(0, 1) == "$" ? "$" + val.substring(1) : "$" + val.substring(0);
                //console.log(val, element[0].value, element[0].value.length);
                setCaretPosition(element[0], element[0].value.length);
            }
          });
        }
    };
});

})();
