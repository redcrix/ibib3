(function () {
    var InventoryViewCtrl = function ($q, $scope, $state, $ionicFilterBar, $ionicActionSheet, inventoryItemsSvc, inventoryHomeSvc, orderingHomeSvc, ionicDatePicker, $ionicLoading, $ionicPopup, $ionicScrollDelegate, CommonService,$timeout,$ionicModal,$rootScope,inventoryService,$ionicHistory,PlTrackerService) {
        var that = this;
        var filterBarInstance;
        that.categorieViews = {
            "PRODUCT_CATEGORY": 'ingredient_category',
            "LOCATION": 'location'
        };
        that.categoryText = {
            "PRODUCT_CATEGORY": 'Ingredient Category',
            "LOCATION": 'Location'
        };

        this.rowSize = {
            name: 30,
            price: 17,
            qty: 10,
            units: 15,
            value: 20,
        };

        $timeout(function() {
          var element = angular.element(document.querySelectorAll('#my-back-btn'));
          if(element.length){

                element.removeClass('hide');

          }

        }, 1000);

        if(!inventoryService.getSelectedGroupBy())
            inventoryService.setSelectedGroupBy("ingredient_category");

        /* backdrop of floating buttons */

        // var everywhere = angular.element(window.document+":not('#floating-menu')");
        var clicked;
        var everywhere = angular.element(window.document);

        $scope.$on('floating-menu:open', function() {
          console.log('open');
          clicked = true;
          everywhere.bind('click', function(event) {
            // console.log(event.target.className == "icon menu-icon ion-arrow-left-c");
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

        $scope.optionVal = true;
        $scope.$on('floating-menu:close', function() {
          console.log('close');
          clicked = false;
        });

        this.fullList = [];
        this.fullGroupedList = [];
        this.items = [];
        var refreshItemsFromServer = function () {
            inventoryItemsSvc.getIngredients(that.inventoryId).then(function (data) {
                that.inventory_status = data.inventory_status;
                if (angular.isDefined(data.last_updated_at)) {
                    setSaveStatusMessage("Last saved on " + data.last_updated_at, "save-status-green")
                } else {
                    setSaveStatusMessage("-", "save-status-blank")
                }
                that.isLocationAvailable = data.isLocationAvailable;
                inventoryItemsSvc.groupIngredients(that.inventoryId)
                    .then(function (groupedList) {
                        // console.log(groupedList)
                        _.forEach(groupedList, function (group) {
                            group.ingredients = _.filter(group.ingredients, function (ingredient) {
                                return !isNaN(ingredient.quantity);
                            })
                        });
                        that.items = groupedList;
                        var quantity;
                        var price;
                        that.showLoader = false;
                        _.forEach(that.items,function(item){
                          _.forEach(item.ingredients,function(data){
                            $scope.draftId = data.draft_id;
                          })
                        })
                        // console.log("that.items",that.items)
                        _.forEach(that.items,function(item) {
                          item.totalValue = item.ingredients
                              .map(function (ele) {
                                  return ele.ingredient_price * ele.quantity;
                              }).reduce(function (prev, cur) {
                                  // var newPrev = isNaN(prev) ? prev : parseFloat(prev);
                                  // var newCur = isNaN(cur) ? cur : parseFloat(cur);
                                  return prev + cur;
                              }, 0);
                            _.forEach(item.ingredients,function(cat) {
                                  if(cat.quantity) {
                                    // console.log("cat",cat)
                                    quantity = (cat.quantity);
                                    price = (cat.ingredient_price);
                                    cat.ingValue = quantity * price;
                                  } else {
                                    cat.ingValue  = 0;
                                  }
                             })
                        })
                    })


            }, function (data) {
                toastMessage("Unable to load. Please check your connection.");
            });
        };

        // let fetchDisabledDatesRH = function(dates) {
        //   $scope.datesDisabled = _.transform(dates, function(result, aDate) {
        //     result.push(new Date(aDate));
        //   });

        // };

        this.init = function () {
            $scope.navBarTitle.showToggleButton = false; // to show back button in header bar
            that.showLoader = true;
            that.inventoryId = $state.params.inventory;
            $scope.periodSelectionSel = 'Period';
            that.inventory_name = $state.params.inventory_name;
            inventoryService.setSelectedInv($state.params.inventory_name);
            that.store_id = $state.params.store_id;

           that.currentView = "PRODUCT_CATEGORY";

            inventoryItemsSvc.setGroupingOption("PRODUCT_CATEGORY")
            if ($state.params.hasOwnProperty('group_by_field')) {
                if (_.has(that.categorieViews, [$state.params.group_by_field])) {
//                    console.log($state.params.group_by_field)
                    inventoryItemsSvc.setGroupingOption($state.params.group_by_field)
                }
            }


            $q.all([inventoryHomeSvc.fetchStores(), inventoryHomeSvc.getInventories(), inventoryHomeSvc.getTotalValue()]).then(function (data) {
                that.stores = data[0];
                $scope.selectedStore = that.stores[0];
            });


            inventoryItemsSvc.setGroupingOption("PRODUCT_CATEGORY");
            if ($state.params.hasOwnProperty('group_by_field')) {
                if ((_.indexOf(_.keys(that.categorieViews), $state.params.group_by_field)) != -1) {
                    inventoryItemsSvc.setGroupingOption($state.params.group_by_field)
                }
            }

            getUserEmailId().then(function (userEmailId) {
              that.userEmailId = userEmailId;
              $scope.userEmailId = userEmailId;
            });

            // console.log('**********************************');
            // console.log(inventoryService.getSelectedGroupBy(),that.inventoryId,inventoryService.getInventoryId());
            //
            // console.log($ionicHistory.viewHistory());

            if(!$ionicHistory.viewHistory().forwardView)
              // console.log($ionicHistory.viewHistory().backView.stateName);
              // if($ionicHistory.viewHistory().backView.stateName == "app.inventoryManager.submitted" )
                inventoryService.setSelectedGroupBy("ingredient_category");
              else if(inventoryService.getSelectedGroupBy() == "ingredient_category" && that.inventoryId == inventoryService.getInventoryId())
                inventoryService.setSelectedGroupBy("ingredient_category");
              else if(inventoryService.getSelectedGroupBy() == "quantity_to_par_group" && that.inventoryId == inventoryService.getInventoryId())
                inventoryService.setSelectedGroupBy("quantity_to_par_group");

              $scope.fetchLatestDateRH = function(date) {
                var datepickerObject = {
                callback: function(val) { //Mandatory
                  let selectedDate = new Date(val);
                    $scope.latestDate = new Date(val)
                    $scope.latestWeek = new Date(val)
                  CommonService.setSelectedDate(selectedDate);
                },
                
              };
                CommonService.setSelectedDate(new Date(date));
                PlTrackerService.fetchPeriodWeeksWithData()
                .then(function (periodListWithData) {
                    // console.log(periodListWithData);
                    $scope.completePeriodList = periodListWithData;
                    setPandYdata(periodListWithData);
                    // $timeout(setWeeksFilterButtons, 1);
                });

              };
              

              $scope.latestDate = moment.utc().startOf("day").format('MM/DD/YYYY');
              $scope.latestWeek = moment.utc().startOf("day").format('MM/DD/YYYY');

              let nowDate = new Date();
              let pastDate = new Date(nowDate.setMonth(nowDate.getMonth() - 6));
              CommonService.fetchLatestDate($scope.fetchLatestDateRH, pastDate, new Date());
              // CommonService.fetchDisabledDates(fetchDisabledDatesRH, new Date(2016, 6, 1), new Date());

            refreshItemsFromServer();

        };
        $scope.periodDetailSelection = function () {
    // console.log('*************** periodDetailSelection *************');
        if (angular.isDefined($scope.periodList)) {
            var selectedPeriod = {};
            _.each($scope.periodList, function(p, pIndex) {
                if(angular.isDefined($rootScope.globalSelectedPeriod) && p.text == $rootScope.globalSelectedPeriod.text) {
                    // console.log('*** if ****');
                    p = $rootScope.globalSelectedPeriod;
                    // console.log(p);
                    selectedPeriod = p;
                } else if(!angular.isDefined($rootScope.globalSelectedPeriod)) {
                  // console.log('**** else ****');
                    if(pIndex == $scope.periodList[$scope.periodList.length - 1]) {
                      // console.log('*** else if ****');
                        p.selected = true
                        $rootScope.globalSelectedPeriod = p;
                        // console.log(p);
                        selectedPeriod = p;
                    }
                }
            })
            // console.log(selectedPeriod.text);
            $scope.selectedPeriodForExport = selectedPeriod.periodTag;
            $scope.selectedExportData.period = selectedPeriod.periodTag;
            return selectedPeriod.text;
        }
        return ""
  }
        var setPandYdata = function(periodDataList) {
          console.log(' **** setPandYdata ****');
            $scope.periodList = [];
            $scope.yearList = [];
            var unique = {};
            var temp = "";
            var insertIndex = 0;
            for(var i=0; i < periodDataList.length; i++) {
                if (!unique[periodDataList[i].year]) {
                    $scope.yearList.push({text:periodDataList[i].year, selected:periodDataList[i].selected});
                    unique[periodDataList[i].year] = periodDataList[i];
                }
                if(angular.isDefined($rootScope.globalSelectedYear)) {
                    temp = $rootScope.globalSelectedYear;
                } else if(periodDataList[i].selected) {
                    temp = periodDataList[i].year;
                    $rootScope.globalSelectedYear = temp;
                    $rootScope.globalSelectedPeriod = periodDataList[i];
                }
            }
            for(var i=0; i < $scope.yearList.length; i++) {
                if($scope.yearList[i].text === temp) {
                    $scope.yearList[i].selected = true;
                    for(var j=0; j < periodDataList.length; j++) {
                        if(temp === periodDataList[j].year) {
                            $scope.periodList[insertIndex] = periodDataList[j];
                            insertIndex ++
                        }
                    }
                }
            }
            if(angular.isDefined($scope.periodList)) {
                _.each($scope.periodList, function(p){
                    if(p.text == $rootScope.globalSelectedPeriod.text) {
                        p.selected = true;
                    }
                })
            }
        }

        this.showSortingActionsheet = function () {
            var hideSheet = $ionicActionSheet.show({
                buttons: [{
                    text: 'Par value'
                }, {
                    text: 'Default'
                },{
                  text: 'Minor Category'
                }],
                titleText: 'Select grouping',
                cancelText: 'Cancel',
                cancel: function () {
                },
                buttonClicked: function (index) {

                    inventoryItemsSvc.getGroupingOption().then(function (currentView) {
                        inventoryService.setInventoryId(that.inventoryId);
                        if (index == 0 && currentView !== "PAR") {
                          console.log(' ****** PAR ******');
                          inventoryService.setSelectedGroupBy('quantity_to_par_group');
                            that.showLoader = true;
                            removeSearch();
                            inventoryItemsSvc.setGroupingOption('PAR');
                            $scope.$broadcast('GROUPBYPARVALUE');
                            that.editMode = 'view';
                            inventoryItemsSvc.groupIngredients(that.inventoryId)
                                .then(function (groupedList) {
                                    _.forEach(groupedList, function (group) {
                                        group.ingredients = _.filter(group.ingredients, function (ingredient) {
                                            return !isNaN(ingredient.quantity);
                                        })
                                    });

                                    that.items = groupedList;
                                    that.totalValue = that.items
                                        .map(function (ele) {
                                            return ele.totalValue;
                                        })
                                        .reduce(function (prev, cur) {
                                            return prev + cur;
                                        }, 0);
                                    _.forEach(that.items,function(item) {
                                        item.totalValue = item.ingredients
                                            .map(function (ele) {
                                              return ele.ingredient_price * ele.quantity;
                                            }).reduce(function (prev, cur) {
                                              // var newPrev = isNaN(prev) ? prev : parseFloat(prev);
                                              // var newCur = isNaN(cur) ? cur : parseFloat(cur);
                                            return prev + cur;
                                          }, 0);
                                        _.forEach(item.ingredients,function(cat) {
                                            if(cat.quantity) {
                                                // console.log("cat",cat)
                                                quantity = (cat.quantity);
                                                price = (cat.ingredient_price);
                                                cat.ingValue = quantity * price;
                                            }else {
                                                cat.ingValue  = 0;
                                            }
                                         })
                                    })
                                    that.showLoader = false;
                                })
                        } else if (index == 1 && currentView !== $state.params.group_by_field) {
                          console.log(' **** DEFAULT *******');
                          inventoryService.setSelectedGroupBy('ingredient_category');
                            that.showLoader = true;
                            removeSearch();
                            inventoryItemsSvc.setGroupingOption($state.params.group_by_field);
                            $scope.$broadcast('NOTGROUPBYPARVALUE');
                            that.editMode = 'view';
                            refreshItemsFromServer();
                        }else if(index == 2 && currentView.identifier !== "MinorCategory" ){
                          console.log('minor category group');
                          inventoryService.setSelectedGroupBy('minor_category');
                          $scope.parDir= false;
                          that.showLoader = true;
                          removeSearch();
                          inventoryItemsSvc.setGroupingOption('MinorCategory')
                          $scope.$broadcast('NOTGROUPBYPARVALUE');
                          that.editMode = 'view';
                          refreshItemsFromServer();
                        }
                        else {

                        }
                        hideSheet();
                        return true;
                    })
                }
            });
        };

        var removeSearchStatus = false;
        var removeSearch = function () {
            removeSearchStatus = true;
            if (!angular.isUndefined(filterBarInstance)) {
                filterBarInstance();
                _.forEach(that.items, function (inventoryGroup) {
                    _.forEach(inventoryGroup.ingredients, function (ingredient) {
                        ingredient.searchHidden = false;

                    })
                })


            }

        };

        function getUserEmailId() {
            return $q(function (resolve, reject) {
                CommonService.getUserDefaullEmailId(function (emailIdData) {
                    resolve(emailIdData.data.emailId);
                })
            })
        }


        this.openPrompt = function() {

          // getUserEmailId().then(function (userEmailId) {
          $scope.emailData = {};
          $scope.emailData.userEmailId = that.userEmailId;
          $scope.emailData.userEmailIdNew = '';
          var confirmPopup = $ionicPopup.show({
            scope: $scope,
            template: `<form></form><div class="smaller">
                                       <input type="text" name="exportNewEmail" placeholder="{{ emailData.userEmailId }}" ng-model="emailData.userEmailIdNew" required/>
                                   </div></form>`,
            title: 'Export data',
            subTitle: 'Enter alternate email id',
            cssClass: 'text-center popup-export',
            buttons: [{
                text: 'Cancel'
              },
              {
                text: '<b>Send</b>',
                type: 'button-bal',
                onTap: function(e) {
                  e.preventDefault();
                  var pattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
                  $scope.emailData.userEmailId = !$scope.emailData.userEmailIdNew ? $scope.emailData.userEmailId : $scope.emailData.userEmailIdNew;
                  $scope.emailData.userEmailIdNew = !$scope.emailData.userEmailIdNew ? $scope.emailData.userEmailId : $scope.emailData.userEmailIdNew;


            $scope.emailData.userEmailId = !$scope.emailData.userEmailIdNew ? $scope.emailData.userEmailId : (pattern.test($scope.emailData.userEmailIdNew) ? $scope.emailData.userEmailIdNew : $scope.emailData.userEmailId);
              // $scope.selectedExportData.userEmailId = (pattern.test($scope.selectedExportData.userEmailIdNew) ? $scope.selectedExportData.userEmailIdNew : $scope.selectedExportData.userEmailId);
              // $scope.selectedExportData.userEmailIdNew = !$scope.selectedExportData.userEmailIdNew ? $scope.selectedExportData.userEmailId : $scope.selectedExportData.userEmailIdNew;
            $scope.emailData.userEmailIdNew = $scope.emailData.userEmailId;
                  if (!$scope.emailData.userEmailId) {
                    toastMessage("Email is required");
                  } else if (!pattern.test($scope.emailData.userEmailId)) {
                    toastMessage("Please Enter Valid Email");
                  } else {
                    inventoryHomeSvc.exportInventory(that.inventoryId, $scope.emailData.userEmailId).then(function(data) {
                      confirmPopup.close();
                      if (data.status == 200) {
                        toastMessage("<span style='position: relative;bottom: 20px;'>Inventory export request sent! </br> You will be receiving email shortly.</span>");
                      }
                    });
                  }
                }
              }
            ]
          });
          // confirmPopup.then(function(emailId) {
          //     console.log(emailId);
          //     if (emailId) {
          //             // console.log(emailId);
          //             // console.log('You are sure ' + that.inventoryId);
          //             // inventoryHomeSvc.exportInventory(that.inventoryId, emailId).then(function(data) {
          //                 // console.log(data);
          //                 // if (data.status == "success")
          //                     toastMessage("Inventory export request sent! You will be receiving email shortly.");
          //             // });
          //     } else {
          //         // console.log('You are not sure');
          //     }
          // });
          // });
        };
        $scope.downloadType = ['CSV','PDF'];
      this.openVarianceReport = function() {
        $scope.selectedFilter = "";
        $scope.showRange = false;
        $scope.selectedExportData = {};
        $scope.selectedExportData.startDatetimeValue = new Date();
        $scope.selectedExportData.endDatetimeValue = new Date();
        $scope.selectedExportData.userEmailId = $scope.userEmailId;
        $scope.selectedExportData.userEmailIdNew = '';
          var confirmPopup = $ionicPopup.show({
            scope: $scope,
            template: `
            <form name="exportForm" class="myExportForm">
              <ion-list>
                <div class="card" style="margin:unset;">
                    <div class ="row" ng-click="setFilter('Daily',1)" id="filter-list_{{1}}" style="border: 0;padding: 3%;border-bottom: 1px solid lightgray;">
                        <div class ="col col-center"><span>Daily<span></div>
                        </div>
                        <div class = "row" ng-if ="dailyClick" style="border: 0;padding: 3%;border-bottom: 1px solid lightgray;">
                          <div class="col col-center no-vertical-padding">
                            <div style="font-size: 80%;" >
                            {{latestDate}}
                            </div>
                          </div>
                          <div class="col col-center no-vertical-padding">
                            <button class="button button-clear icon-right ion-ios-calendar-outline app-theme-text2" ng-click="openDatePicker('Daily')" style="float: right;"></button>
                          </div>
                    </div>
                    <div class ="row" ng-click="setFilter('Weekly',2)" id="filter-list_{{2}}" style="border: 0;padding: 3%;border-bottom: 1px solid lightgray;">
                        <div class ="col col-center"><span>Weekly<span></div>
                        </div>
                        <div class = "row" ng-if ="weeklyClick" style="border: 0;padding: 3%;border-bottom: 1px solid lightgray;">
                          <div class="col col-center no-vertical-padding">
                            <div style="font-size: 80%;" >
                            {{latestWeek}}
                            </div>
                          </div>
                          <div class="col col-center no-vertical-padding">
                            <button class="button button-clear icon-right ion-ios-calendar-outline app-theme-text2" ng-click="openDatePicker('Weekly')" style="float: right;"></button>
                          </div>
                    </div>
                    <div class ="row" ng-click="setFilter('Period',3)" id="filter-list_{{3}}" style="border: 0;padding: 3%;border-bottom: 1px solid lightgray;">
                        <div class="col col-center"><span>Period<span></div>
                        </div>
                        <div class = "row" ng-if ="periodClick" style="border: 0;padding: 3%;border-bottom: 1px solid lightgray;">
                          <div class="icon-right ion-arrow-down-b col col-center" ng-click="showPeriodSelect();$event.stopPropagation();" style="font-weight:bold;font-size: 80%;margin-top: 2%;">
                            {{ periodDetailSelection() }}
                          </div>
                        </div>
                    <div class ="row " ng-click="setFilter('DateRange',4)" id="filter-list_{{4}}" style="border: 0;padding: 3%;border-bottom: 1px solid lightgray;">
                       <div class="col ceneter"> Date Range</div>
                    </div>
                    <div ng-if="showRange">
                      <ion-list>
                        <div class="card" style="margin:unset;">
                          <ion-item style="padding:0px 10px 5px 10px;">
                          <div class="row" style="font-size:80%;">Start Date:</div>
                          <div class="row inventory-text-left" ng-click="openDatePickerFilter('startDate')" style="padding: 5px; background: lightgray;margin-bottom: 10px;" >
                              {{selectedExportData.startDatetimeValue| date: "MM/dd/yyyy"}}
                          </div>
                          <div class="row" style="font-size:80%;">End Date:</div>
                          <div class="row inventory-text-left" ng-click="openDatePickerFilter('endDate')" style="padding: 5px; background: lightgray;" >
                              {{selectedExportData.endDatetimeValue| date: "MM/dd/yyyy"}}
                          </div>
                          </div>
                        </div>
                      </ion-list>
                    </div>
                    <div class ="row" style="border: 0;padding: 3%;border-bottom: 1px solid lightgray;">
                        <div class ="col col-center"<span>Export Type</span></div>
                        <div class="col col-center">
                          <select class="unit-select-box add-ing-select col" ng-model = "selectedExportData.selectedType" style="font-size:12px;">
                            <option value="" ng-hide="optionVal"></option>
                            <option ng-repeat ="opt in downloadType">{{opt}}</option>
                          </select>
                        </div>
                    </div>
                  </div>
            </ion-list>
                    <div style="margin-right: 35%;margin-top: 3%;font-weight: 350;">Email address :</div>
                    <div class="smaller" style="margin-bottom: 20%;">
                    <input type="text" name="exportNewEmail" style="padding:5px;" placeholder="{{ selectedExportData.userEmailId }}" ng-model="selectedExportData.userEmailIdNew" required/>
                    </div>
                </form>`,
            title: 'Variance Report',
            subTitle: 'Select Filter',
            cssClass: 'text-center popup-export',
            buttons: [{
                text: 'Cancel'
              },
              {
                text: '<b>Send</b>',
                type: 'button-bal',
                onTap: function(e) {
                  e.preventDefault();
                  var pattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
                  $scope.selectedExportData.userEmailId = !$scope.selectedExportData.userEmailIdNew ? $scope.selectedExportData.userEmailId : $scope.selectedExportData.userEmailIdNew;
                  $scope.startFilterDate = moment($scope.startFilterDate ? $scope.startFilterDate : new Date($scope.selectedExportData.startDatetimeValue)).format('MM/DD/YYYY');
                  $scope.endFilterDate = moment($scope.endFilterDate ? $scope.endFilterDate : new Date($scope.selectedExportData.endDatetimeValue)).format('MM/DD/YYYY');
                  $scope.selectedExportData.userEmailIdNew = !$scope.selectedExportData.userEmailIdNew ? $scope.selectedExportData.userEmailId : $scope.selectedExportData.userEmailIdNew;
                  $scope.selectedExportData.userEmailId = !$scope.selectedExportData.userEmailIdNew ? $scope.selectedExportData.userEmailId : (pattern.test($scope.selectedExportData.userEmailIdNew) ? $scope.selectedExportData.userEmailIdNew : $scope.selectedExportData.userEmailId);
                  $scope.selectedExportData.userEmailIdNew = $scope.selectedExportData.userEmailId;
                  if (!$scope.selectedExportData.userEmailId ) {
                    toastMessage("Email is required");
                  } else if (!pattern.test($scope.selectedExportData.userEmailId)) {
                    toastMessage("Please Enter Valid Email");
                  } else if (!$scope.selectedExportData.type) {
                    toastMessage("Please select a filter");
                  } else if (!$scope.selectedExportData.selectedType) {
                    toastMessage("Please select export type");
                  } else if ($scope.selectedExportData.type == "DateRange" && moment($scope.endFilterDate).isBefore($scope.startFilterDate)) {
                    toastMessage("Please select valid end date.");
                  } else {
                    $scope.selectedExportData.startDatetimeValue = moment($scope.selectedExportData.startDatetimeValue).format('MM/DD/YYYY');
                    $scope.selectedExportData.endDatetimeValue = moment($scope.selectedExportData.endDatetimeValue).format('MM/DD/YYYY');
                    if($scope.selectedExportData.type == 'Daily'){
                      var serviceRequestData ={
                        "startDate"  : $scope.selectedExportData.latestDate,
                        "endDate"    : $scope.selectedExportData.latestDate,
                        "filter"     : $scope.selectedExportData.selectedType,
                        "isDate"     : true,
                        "email"      : $scope.selectedExportData.userEmailIdNew,
                        "draftId"    : $scope.draftId,
                        "dateRange"  : ""
                      }
                    }else if($scope.selectedExportData.type == 'Weekly'){
                      var serviceRequestData ={
                        "startDate"  : $scope.selectedExportData.finalDate,
                        "endDate"    : $scope.selectedExportData.latestWeek,
                        "filter"     : $scope.selectedExportData.selectedType,
                        "isDate"     : true,
                        "email"      : $scope.selectedExportData.userEmailIdNew,
                        "draftId"    : $scope.draftId,
                        "dateRange"  : ""
                      }
                    }else if($scope.selectedExportData.type == 'Period'){
                      var serviceRequestData ={
                        "startDate"  : "",
                        "endDate"    : "",
                        "filter"     : $scope.selectedExportData.selectedType,
                        "isDate"     : false,
                        "email"      : $scope.selectedExportData.userEmailIdNew,
                        "draftId"    : $scope.draftId,
                        "dateRange"  : $scope.selectedExportData.period
                      }
                    }else{
                      var serviceRequestData ={
                        "startDate"  : $scope.selectedExportData.startDatetimeValue,
                        "endDate"    : $scope.selectedExportData.endDatetimeValue,
                        "filter"     : $scope.selectedExportData.selectedType,
                        "isDate"     : true,
                        "email"      : $scope.selectedExportData.userEmailIdNew,
                        "draftId"    : $scope.draftId,
                        "dateRange"  : ""
                      }
                    }
                    
                    CommonService.varianceReport(function(data){
                       $scope.selectedExportData.userEmailId = $scope.userEmailId;
                        confirmPopup.close();
                        $scope.dailyClick = false;
                        $scope.weeklyClick = false;
                        $scope.periodClick = false;
                        if (data.data.response) {
                          toastMessage("<span style='position: relative;bottom: 20px;'>Sales export request sent! </br> You will be receiving email shortly.</span>");
                        }
                    },serviceRequestData)
                  }
                }
              }
            ]
          });
          
        };

      $scope.openDatePickerFilter = function(type){
        var datepickerObject = {
          callback: function (val) {  //Mandatory
            // console.log(val);
            if(type == "startDate"){
              $scope.selectedExportData.startDatetimeValue = new Date(val);
              $scope.startFilterDate = val;
            }
            else{
              $scope.selectedExportData.endDatetimeValue = new Date(val);
              $scope.endFilterDate = val;
          }
        },
          disabledDates:[],
          from: new Date(2016, 6, 1), //Optional
          to: new Date(), //Optional
          inputDate: new Date(),      //Optional
          mondayFirst: true,          //Optional
          disableWeekdays: [],       //Optional
          closeOnSelect: false,       //Optional
          templateType: 'popup'       //Opional
        }
        ionicDatePicker.openDatePicker(datepickerObject);
      }

  $scope.showPeriodSelect = function () {

      $scope.showPeriodDates = true;
      if ($scope.periodSelectionSel === 'Period') {
          var hideSheet = $ionicActionSheet.show({
              buttons: $scope.periodList,
              titleText: '<h4><center>Select Period</center></h4>',
              cancelText: 'Cancel',
              cancel: function () {
              },
              buttonClicked: function (index) {
                  _.each($scope.periodList, function (p, pIndex) {
                      if (index === pIndex) {
                          p.selected = true;
                          $rootScope.globalSelectedPeriod = p;
                          $rootScope.globalSelectedPeriodIndex = undefined;
                          $scope.actualDate = moment(new Date(p.startDate*1000)).format('MM/DD/YYYY');
                          if($scope.periodList[index-1]){
                            $scope.benchmarkDate = moment(new Date($scope.periodList[index-1].endDate*1000)).format('MM/DD/YYYY');
                            $scope.benchmarkPeriod = $scope.periodList[index-1].periodTag;
                          }else{
                            $scope.benchmarkDate = $scope.latestDate;
                            $scope.benchmarkPeriod = p.periodTag;
                          }
                          $scope.selectedPeriodForExport = p.periodTag;
                          $scope.selectedExportData.period = p.periodTag;
                          // console.log($scope.benchmarkPeriod);
                          // $timeout(setWeeksFilterButtons, 1);
                      } else {
                          p.selected = false;
                      }
                  });
                  return true;
              }
          });
      }
      var myEl = angular.element(document.querySelector('.action-sheet-group'));
      // myEl.css('overflow-y', 'scroll');
      myEl.css('max-height', (window.innerHeight - 50) + 'px');
      // myEl.css('max-width', (window.innerWidth - 120) + 'px');
  };
  $scope.exportFilters = [
    {"id":1,"name": "Daily"},
    {"id":2,"name": "Weekly"},
    {"id":3,"name": "Period"},
    {"id":4,"name": "DateRange"}
  ];
   $scope.setFilter = function(item,id){
    $scope.selectedExportData.latestDate = $scope.latestDate;
    $scope.selectedExportData.latestWeek = $scope.latestWeek;
    if(item == "Period"){
      $scope.selectedExportData.period = $scope.selectedPeriodForExport;
    }
    $scope.selectedExportData.type = item; 
    var myElement = angular.element( document.querySelector( '#filter-list_'+id ) );
    myElement.addClass('inventory-item-selected');
    _.forEach($scope.exportFilters, function(value) {
      if(value.id != id){
        var otherElement = angular.element( document.querySelector( '#filter-list_'+value.id ) );
        otherElement.removeClass('inventory-item-selected');
      }
    });
    if(item == "Daily"){
      $scope.dailyClick = true;
    }else{
      $scope.dailyClick = false;
    }
    if(item == "Weekly"){
      $scope.weeklyClick = true;
    }else{
      $scope.weeklyClick = false;
    }
    if(item == "Period"){
      $scope.periodClick = true;
    }else{
      $scope.periodClick = false;
    }
    var elForm = angular.element(document.querySelectorAll('.myExportForm'));
    if(item == "DateRange"){
      $scope.showRange = true;
      elForm[0].style.height = "450px";
      // elForm[0].style.overflowY = "scroll";
    }else {
      $scope.showRange = false;
      elForm[0].style.height = "250px";
      // elForm[0].style.overflowY = "scroll";
  }
  }

        $scope.openDatePicker = function(type) {
          $scope.inputDate = CommonService.getSelectedDate();
          var datepickerObject = {
            callback: function(val) { //Mandatory
              let selectedDate = new Date(val);
              if(type == 'Daily'){
                $scope.latestDate = ((selectedDate.getMonth() + 1) + '/' + selectedDate.getDate() + '/' + selectedDate.getFullYear());
                $scope.selectedExportData.latestDate = $scope.latestDate;
              }else if(type == 'Weekly'){
                $scope.latestWeek = ((selectedDate.getMonth() + 1) + '/' + selectedDate.getDate() + '/' + selectedDate.getFullYear());
                $scope.selectedExportData.latestWeek = $scope.latestWeek;
                var lastDate = selectedDate;
                var date = new Date(val);
                date.setDate(date.getDate() - 7);
                var finalDate = date.getDate()+'/'+ (date.getMonth()+1) +'/'+date.getFullYear();
                $scope.selectedExportData.finalDate = finalDate;
              }
              CommonService.setSelectedDate(selectedDate);
            },
            disabledDates: [],
            from: new Date(2016, 6, 1), //Optional
            to: new Date(), //Optional
            inputDate: new Date(), //Optional
            mondayFirst: true, //Optional
            disableWeekdays: [], //Optional
            closeOnSelect: false, //Optional
            templateType: 'popup'
          };
          if ($scope.timePeriod == 'DAILY') {
            datepickerObject.disableWeekdays = [];
          }
          ionicDatePicker.openDatePicker(datepickerObject);
        };
        this.showFilterBar = function () {
            var search_fields = ['ingredient_alias_name', 'ingredient_category', 'ingredient_name', 'supplier_name', 'location'];

            filterBarInstance = $ionicFilterBar.show({
                items: that.items,
                debounce: true,
                update: function (filteredItems, filterText) {
                    //console.log(_.sumBy(filteredItems, function(o) { return o.ingredients.length; }))
                    if (angular.isDefined(filterText)) {
                        _.forEach(filteredItems, function (inventoryGroup) {
                            _.forEach(inventoryGroup.ingredients, function (ingredient) {
                                var keepIngredient = false;
                                _.forEach(search_fields, function (search_field) {
                                    var textToSearch = _.get(ingredient, search_field, "");
                                    if (textToSearch != "") {
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
                    } else {
                        if (removeSearchStatus) {
                            removeSearchStatus = false;
                            return
                        }
                        _.forEach(filteredItems, function (inventoryGroup) {
                            _.forEach(inventoryGroup.ingredients, function (ingredient) {
                                ingredient.searchHidden = false;

                            })
                        });
                        

                    }
                    that.items = filteredItems

                },
            });
        };


        this.updatedList = function () {
            that.fullGroupedList = angular.merge(that.fullGroupedList, that.items);
            that.fullList = _.flattenDeep(that.fullGroupedList.map(function (cat) {
                return cat.ingredients;
            }));
            return that.fullList;
        };

        $rootScope.$on('product-category-value-updated', function (evt, data) {
          // console.log('product-category-value-updated***');
            that.totalValue = that.items
            //                .filter(function (ele) {
            //                return ele.totalValue !== undefined && ele.totalValue !== null;
            //                })
                .map(function (ele) {
                    return ele.totalValue;
                })
                .reduce(function (prev, cur) {
                    return prev + cur;
                }, 0);
        });

        var setSaveStatusMessage = function (message, level, appendMessage) {
            if (angular.isUndefined(appendMessage)) {
                appendMessage = false;
            }
            if (!appendMessage) {
                that.saveStatus = [];
            }
            that.saveStatus.push({
                text: message,
                level: level
            })
        };


        $scope.$on('$destroy', function () {

        });

        $scope.$on('ReSizeScroll', function (evt) {
            $timeout(function () {
                $ionicScrollDelegate.resize();
            }, 0)
        });


        var toastMessage = function (message_text, duration) {
            if (typeof duration === 'undefined') duration = 2000;
            $ionicLoading.show({
                template: message_text,
                noBackdrop: true,
                duration: duration
            });
        };


        this.showOrderPopup = function () {
            $scope.data = {};
            $scope.data.datetimeValue = new Date();
            // An elaborate, custom popup
            that.openStoresSheet = function () {
                var hideSheet = $ionicActionSheet.show({
                    buttons: that.stores.map(function (ele) {
                        return {
                            text: ele.store_name
                        }
                    }),
                    titleText: 'Select store',
                    cancelText: 'Cancel',
                    cancel: function () {

                    },
                    buttonClicked: function (index) {
                        $scope.selectedStore = that.stores[index];
                        //hideSheet();
                        return true;
                    }
                });
            };

            this.openDatePicker = function () {
                var datepickerObject = {
                    callback: function (val) { //Mandatory
                        $scope.data.datetimeValue = new Date(val);
                    },
                    disabledDates: [],
                    from: new Date(2016, 6, 1), //Optional
                    to: new Date(), //Optional
                    inputDate: new Date(), //Optional
                    mondayFirst: true, //Optional
                    disableWeekdays: [], //Optional
                    closeOnSelect: false, //Optional
                    templateType: 'popup' //Opional
                };
                ionicDatePicker.openDatePicker(datepickerObject);
            };

            var myPopup = $ionicPopup.show({
                template: '<input placeholder="Order Name" type="text" ng-model="data.name"/>' +
                '<div>time:</div><div class="item" ng-click= "ctrl.openDatePicker()">{{data.datetimeValue| date: "yyyy-MM-dd"}}</div>' +
                '<div ng-if="ctrl.stores.length>0" id="dropdown-container"><div style="margin-top: 10px">selected Store: </div> <div style="font-style:italic; padding: 5px; background: lightgray; text-align: center;">{{selectedStore.store_name}}</div></div>',
                title: 'Add new Order',
                subTitle: '',
                scope: $scope,
                buttons: [{
                    text: 'Cancel'
                }, {
                    text: '<b>Add</b>',
                    type: 'button-positive',
                    onTap: function (e) {
                        if (!$scope.data.name) {
                            e.preventDefault();
                        } else {
                            return $scope.data;
                        }
                    }
                }]
            });


            myPopup.then(function (res) {
                //  console.log(res);
                if (!!res && !!res.name) {
                    var requestPayload = {
                        "name_given": res.name,
                        "date_of_creation": Math.floor(res.datetimeValue.getTime() / 1000).toString(),
                        store_id: $scope.selectedStore.store_id
                    };
                    //  console.log(requestPayload);
                    orderingHomeSvc.createOrdering(requestPayload).then(function (data) {
                        //  orderingHomeSvc.passInventoryDetails(requestPayload, data.draft_id);
                        toastMessage("Order successfully created");
                        setTimeout(function () {
                            $state.go("app.composeOrdering", {
                                inventory: data.draft_id,
                                store_id: $scope.selectedStore.store_id,
                                inventory_name: $scope.data.name,
                                date_of_creation: $scope.data.datetimeValue
                            });
                        },2000);
                    });
                }

            });

            setTimeout(function () {
                document.querySelector('#dropdown-container').addEventListener('click', function () {
                    $scope.$apply(function () {
                        that.openStoresSheet();
                    })
                });
            }, 50);
        };

        $scope.isDraft=false;
        this.createOrderClicked = function (evt) {
            //             $timeout(function () {
            // //                $ionicTabsDelegate.select(1);
            //                 $ionicTabsDelegate.$getByHandle('inventoryTabs').select(1);
            //             }, 0);
            that.showOrderPopup();
        };
        $scope.ingredient_ids = [];
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
          console.log('closeModal')
          $scope.summary_modal.hide();
        };
        this.openInventorySummary = function(){
          // console.log('openInventorySummary');
          $scope.openSummaryModal();
          _.each(this.items,function(getIngredients){
            // console.log("getIngredients",getIngredients.ingredients);
            var myIngredients = _.find(getIngredients.ingredients, function(ingredient) {
              if(_.indexOf($scope.ingredient_ids, ingredient.inventory_item_id) == -1 && ingredient.inventory_item_id && ingredient.quantity!= undefined && ingredient.quantity > 0)
                $scope.ingredient_ids.push(ingredient.inventory_item_id)
            });

          })
          // console.log("$scope.ingredient_ids",$scope.ingredient_ids);
          // console.log("that.inventoryId",$scope.ingredient_ids);
          if($scope.summaryDataReceived) {
            $scope.summaryDataReceived = false;
            CommonService.getInventorySummary(responseHandler,$scope.ingredient_ids,that.inventoryId,$scope.isDraft);
          }
        }

    var responseHandler = function(datas,status){
        // console.log("datas",datas);
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
          $scope.summaryDataReceived = true;
          toastMessage("Something went wrong!", 1200);
        }

      };
       $scope.summaryDataReceived = false;
      var calculateSummaryValue = function(source,type){
        var total = 0;
        _.filter(source, function(o) {
            if((o.pnlCategory).toUpperCase() == (type).toUpperCase()){
              total += o.myCalculatedData;
            }

        })
        return total;
      }
       $scope.summaryDataReceived = true;

    };


    InventoryViewCtrl.$inject = ['$q', '$scope', '$state', '$ionicFilterBar', '$ionicActionSheet', 'inventoryItemsSvc', 'inventoryHomeSvc', 'orderingHomeSvc', 'ionicDatePicker', '$ionicLoading', '$ionicPopup', '$ionicScrollDelegate', 'CommonService','$timeout','$ionicModal','$rootScope','inventoryService','$ionicHistory','PlTrackerService'];
    projectCostByte.controller('InventoryViewCtrl', InventoryViewCtrl);
})();
