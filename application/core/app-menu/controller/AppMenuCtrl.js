(function() {
  'use strict'
  projectCostByte.controller('AppMenuCtrl', appMenuCtrl);

  appMenuCtrl.$inject = ['$scope', '$state', '$location', '$ionicSideMenuDelegate',
    '$rootScope', 'CommonService', 'CommonConstants', 'Utils', '$cordovaCamera', '$stateParams',
    'MarginOptimizerServiceOne', 'MenuEngineeringServiceOne', '$ionicPopup', '$ionicModal', '$window', 'LaborOptimizerService', 'PAndLChartsService','appModalService'
  ];

  function appMenuCtrl($scope, $state, $location, $ionicSideMenuDelegate, $rootScope,
    CommonService, CommonConstants, Utils, $cordovaCamera, $stateParams, MarginOptimizerServiceOne, MenuEngineeringServiceOne, $ionicPopup, $ionicModal,
    $window, LaborOptimizerService, PAndLChartsService,appModalService) {

    $rootScope.previousState;
    $rootScope.currentState;
    $rootScope.isChagesExist = false;
    var modal_shown = true;
    $rootScope.$on('$stateChangeSuccess', function(ev, to, toParams, from, fromParams) {
      $rootScope.previousState = from.name;
      $rootScope.currentState = to.name;
      if ($rootScope.currentState == 'app.calendarRefresh') {
        $scope.datepickerObject.inputDate = new Date(CommonService.getSelectedDate());
      }
      // console.log('Previous state:' + $rootScope.previousState)
      // console.log('Current state:' + $rootScope.currentState)

    });
    $scope.canShowLogo = false;
    var isIPad = ionic.Platform.isIPad();
    var isIOS = ionic.Platform.isIOS();
    var isAndroid = ionic.Platform.isAndroid();
    var devicePlatform = isIPad || isIOS ? 'ios' : isAndroid ? 'android' : 'unknown';


    /************ set submenu******************/
    CommonService.appMenuGetSideMenu(function(sideMenuGroups) {
      $scope.overviewGroups = sideMenuGroups;
      // console.log(sideMenuGroups);
      // console.log("main group");
      // console.log(JSON.stringify($scope.overviewGroups));
      // $scope.overviewGroups.push({
      //   "items": [{
      //     "classFn": "sideMenuActive('/reports')",
      //     "clickFn": "reportsClickHandler()",
      //     "icon": "icon ion-connection-bars",
      //     "name": "Reports",
      //     "platform": "browser",
      //     "uisref": "app.reports"
      //   }],
      //   "mainIcon": "",
      //   "name": "Support Tools",
      //   "show": false
      // })
      _.some($scope.overviewGroups, function(group) {

        if(group.name=="Support Tools" && (ionic.Platform.platform() == 'android' || ionic.Platform.platform() == 'ios')){
          group.showOnWeb = false;
        } else {
          group.showOnWeb = true;
        }
        // console.log(JSON.stringify(group));
        // if(group.name == "Support Tools"){
        //       group.items.push({
        //           "clickFn": "weekPriceChangeClickHandler()",
        //           "name": "Weekly Price Change",
        //           "platform": "",
        //           "uisref": "app.weekPriceChange",
        //           "classFn": "sideMenuActive('/weekPriceChange')",
        //           "icon": "icon ion-pricetags"
        //         });
        // }
        // if(group.name == "Menu Insights"){
        //     group.items.push({
        //         "clickFn": "modManagerClickHandler()",
        //         "name": "Mod Manager",
        //         "platform": "",
        //         "uisref": "app.modManager",
        //         "classFn": "sideMenuActive('/modManager')",
        //         "icon": "icon ion-ios-lightbulb"
        //     },{
        //         "clickFn": "prepManagerClickHandler()",
        //         "name": "Prep Manager",
        //         "platform": "",
        //         "uisref": "app.prepManager",
        //         "classFn": "sideMenuActive('/prepManager')",
        //         "icon": "icon ion-ios-lightbulb"
        //     })
        // }
        // if(group.name == "Support Tools") {
        //     group.items.push(
        //       {
        //      "classFn": "sideMenuActive('/invoiceEntry')",
        //      "clickFn": "invoiceEntryClickHandler()",
        //      "icon": "icon ion-cash",
        //      "name": "Invoice Entry",
        //      "platform": "",
        //      "uisref": "app.invoiceEntry"
        //     })
        //   }

        _.forEach(group.items, function(item, index) {

          if ((devicePlatform == 'android' || devicePlatform == 'ios') && (item.name == "Inventory Tool" ||item.name =="Price/Recipe cost tracking")) {
            group.items.splice(index, 1);
          }
        })
        let index = _.findIndex(group.items, function(sub) {
          // console.log(sub);
          return sub.platform == 'browser';
        });

        if (index > -1 && devicePlatform != 'unknown') {
          // console.log("new splicing" + index);
          $scope.canShowLogo = false;
          group.items.splice(index, 1);
        }
      });
      // console.log($scope.overviewGroups);

      // setting shown group by current state if required
      if (_.findIndex($scope.overviewGroups, ['show', true]) === -1) {

        let groupIndexShownByCurrentState = _.findIndex($scope.overviewGroups, function(group) {
          return _.some(group.items, function(sub) {

            // console.log("inside side menu");
            // console.log(group.items);
            // console.log(sub);
            // console.log($state);
            // console.log($state.current.name);
            return ($state.current.name.substr(0, sub.uisref.length) === sub.uisref)
          });
        });
        if (groupIndexShownByCurrentState !== -1) {
          $scope.overviewGroups[groupIndexShownByCurrentState].show = true;
        }

      }
      preloadTemplates();

    });


    function preloadTemplates() {
      let templatesToLoad = [
        {
          name: 'inventoryConfigModifierTemplate',
          path: 'application/inventory-management/directives/config-modifier/inventory-config-modifier.html'
        },
        {
          name: 'errorReportingPopOver',
          path: 'application/error-reporting/reportPopover.html'
        },
        {
          name: 'errorReportingTemplate',
          path: 'application/error-reporting/errorReportingPopupView.html'
        },
        {
          name: 'inventoryAddQuantityTemplate',
          path: 'application/inventory-management/directives/add-quantity/add-quantity.html'
        },
        {
          name: 'inventoryChangePriceTemplate',
          path: 'application/inventory-management/directives/change-price/change-price.html'
        },
        {
          name: 'inventoryProductCategory',
          path: 'application/inventory-management/directives/product-category/product-category.html'
        },
        {
          name: 'inventoryProductItem',
          path: 'application/inventory-management/directives/product-Item/product-item.html'
        },
        {
          name: 'searchSelect',
          path: 'application/core/shared-components/common/directive/searchSelect.html'
        },
        //new inv changes
        // {
        // name: 'inventoryConfigModifierTemplate',
        // path: 'application/inventory-management-new/directives/config-modifier/inventory-config-modifier.html'
        // },
        // {
        //   name: 'inventoryAddQuantityTemplate',
        //   path: 'application/inventory-management-new/directives/add-quantity/add-quantity.html'
        // },
        // {
        //   name: 'inventoryChangePriceTemplate',
        //   path: 'application/inventory-management-new/directives/change-price/change-price.html'
        // },
        // {
        //   name: 'inventoryProductCategory',
        //   path: 'application/inventory-management-new/directives/product-category/product-category.html'
        // },
        // {
        //   name: 'inventoryProductItem',
        //   path: 'application/inventory-management-new/directives/product-Item/product-item.html'
        // },
      ];
      _.each(templatesToLoad, function(template) {
        Utils.preLoadTemplate(template.name, template.path)
      })
    }


    /** if given group is the selected group, deselect it
     *  else, select the given group
     */
    $scope.toggleGroup = function(group) {
      // console.log(group);
      let clickedGroupShow = angular.copy(group.show);
      _.each($scope.overviewGroups, function(o) {
        _.set(o, ['show'], false)
      });
      group.show = !clickedGroupShow;
    };
    $scope.isGroupShown = function(group) {
      return group.show;
    };


    /************ set submenu******************/


    var fetchStoresResponseHandler = function(stores, current_store) {
      $scope.stores = stores;
      // console.log($scope.stores);
      for (var i = 0; i < stores.length; i++) {
        if (current_store == stores[i]['business_store_id']) {
          // $scope.selectedStore = $scope.currentBusiness ? $scope.currentBusiness.name : stores[i].name;
          $scope.selectedStore = stores[i];
          // console.log($scope.selectedStore);
          $scope.loginData = [];
          $scope.loginData = JSON.parse(localStorage.getItem('login'));
          // let loginDatas = {
          //   "businessId": $scope.selectedStore.business_id,
          //   "businessName": $scope.selectedStore.name,
          //   "businessStoreId": $scope.selectedStore.business_store_id
          // }

          $scope.loginData.businessId = $scope.selectedStore.business_id;
          $scope.loginData.businessName = $scope.selectedStore.name;
          $scope.loginData.businessStoreId = $scope.selectedStore.business_store_id;
          // console.log($scope.loginData);
          localStorage.setItem('login',JSON.stringify($scope.loginData));

          CommonService.changeStore(current_store);
          Utils.setLocalValue('current_store', current_store)
        }
      }
      // console.log($scope.selectedStore);

    }

    var fetchStoresReloadResponseHandler = function(stores, current_store) {

      var local_current_store = Utils.getLocalValue('current_store', '0')

      if (current_store.toString() == local_current_store) {

        var current_state = $state.current;

        //                $state.go('app.dashboard.tasks');

        $state.go(current_state, $stateParams, {
          reload: true,
          inherit: false
        });
        return;
      } else {
        //                console.log(current_store + ' ******* ' + local_current_store)
        //                console.log('checking current store again')
        CommonService.fetchStoresByBusiness(fetchStoresReloadResponseHandler);
      }
    }

    var fetchStores = function(responseHandler) {
      console.log('stores---------------------')
      CommonService.fetchStoresByBusiness(responseHandler);
    }

    fetchStores(fetchStoresResponseHandler);

    $scope.storeChanged = function(selectedStore) {
      console.log('store change', selectedStore.business_store_id)
      CommonService.changeStore(selectedStore.business_store_id);
      $ionicSideMenuDelegate.toggleLeft();
      Utils.setLocalValue('current_store', selectedStore.business_store_id)
      CommonService.fetchStoresByBusiness(fetchStoresReloadResponseHandler);
      //             $state.go($rootScope.currentState);

    }



    //Setting the selected side menu as active
    $scope.sideMenuActive = function(path) {
      if ($location.path().substr(0, path.length) === path || (($location.path().substr(0, path.length)).includes('/compose-in') && path == '/inventoryManager')) {
        return 'side-menu-selection-active';
      } else {
        return '';
      }
    }

    $scope.healthTrackerClickHandler = function() {
      console.log("healthTrackerClickHandler");
      $ionicSideMenuDelegate.toggleLeft();
      // $state.go('app.healthTracker');
      $state.go('app.health-tracker-tab.healthTracker');
    }

    //        $scope.costingoptimizerClickHandler = function() {
    //            $ionicSideMenuDelegate.toggleLeft();
    //            $state.go('app.costingoptimizer');
    //        };

    // $scope.documentUploadClickHandler = function() {
    //     $ionicSideMenuDelegate.toggleLeft();
    //     $state.go('app.invoices.trackings');
    // }

    $scope.marginoptimizerClickHandler = function() {
      console.log("marginoptimizerClickHandler");
      $ionicSideMenuDelegate.toggleLeft();
      $state.go('app.marginoptimizer.Food');
    };

    $scope.marginoptimizer2ClickHandler = function() {
      if (!$rootScope.isChagesExist) {
        $ionicSideMenuDelegate.toggleLeft();
        $state.go('app.marginoptimizer2.' + MarginOptimizerServiceOne.fetchSelectedMenuType('key'));
      }else {
        $ionicSideMenuDelegate.toggleLeft();
        $rootScope.discardChangesFrom.name = 'marginoptimizer2ClickHandler';
        $rootScope.discardChangesFrom.value = 'app.marginoptimizer2.';
        if (modal_shown) {
            modal_shown = appModalService.show('application/invoice-tracking/view/configConfirmation.html', 'ConfigConfirmationCtrl',$rootScope.discardChangesFrom)
        }
        return modal_shown
      }
    };

    $scope.menuengineeringClickHandler = function() {
      if(!$rootScope.isChagesExist) {
        // console.log("$rootScope.isChagesExist",$rootScope.isChagesExist)
        $ionicSideMenuDelegate.toggleLeft();
        $state.go('app.menuengineering.' + MenuEngineeringServiceOne.fetchSelectedMenuType('key'));
      }else {
        $ionicSideMenuDelegate.toggleLeft();
        $rootScope.discardChangesFrom.name = 'menuengineeringClickHandler';
        $rootScope.discardChangesFrom.value = 'app.menuengineering.';
        if (modal_shown) {
            modal_shown = appModalService.show('application/invoice-tracking/view/configConfirmation.html', 'ConfigConfirmationCtrl',$rootScope.discardChangesFrom)
        }
        return modal_shown
      }
    };

    $scope.MenuPerformanceoptimizerClickHandler = function() {
      $ionicSideMenuDelegate.toggleLeft();
      $state.go('app.MenuPerformanceoptimizer.Food');
    };

    //        $scope.taskmanagerClickHandler = function() {
    //            $ionicSideMenuDelegate.toggleLeft();
    //            $state.go('app.taskmanager');
    //        };

    $scope.dashboardClickHandler = function() {
      if(!$rootScope.isChagesExist) {
        $ionicSideMenuDelegate.toggleLeft();
        $state.go('app.dashboard.summary');
      }else {
        $ionicSideMenuDelegate.toggleLeft();
        $rootScope.discardChangesFrom.name = 'dashboardClickHandler';
        $rootScope.discardChangesFrom.value = 'app.dashboard.summary';
        if (modal_shown) {
            modal_shown = appModalService.show('application/invoice-tracking/view/configConfirmation.html', 'ConfigConfirmationCtrl',$rootScope.discardChangesFrom)
        }
        return modal_shown
      }
    };

    $scope.plTrackerClickHandler = function() {
      if(!$rootScope.isChagesExist) {
        $ionicSideMenuDelegate.toggleLeft();
        $state.go('app.plTracker');
      }else {
        $ionicSideMenuDelegate.toggleLeft();
        $rootScope.discardChangesFrom.name = 'plTrackerClickHandler';
        $rootScope.discardChangesFrom.value = 'app.plTracker';
        if (modal_shown) {
            modal_shown = appModalService.show('application/invoice-tracking/view/configConfirmation.html', 'ConfigConfirmationCtrl',$rootScope.discardChangesFrom)
        }
        return modal_shown
      }
    };

    $scope.wastageClickHandler = function() {
      $ionicSideMenuDelegate.toggleLeft();
      $state.go('app.wastage');
    }

    $scope.laborOptimizerClickHandler = function() {
      if(!$rootScope.isChagesExist) {
        $ionicSideMenuDelegate.toggleLeft();
        $state.go('app.laborOptimizer.' + LaborOptimizerService.fetchSelectedLaborType());
      }else {
        $ionicSideMenuDelegate.toggleLeft();
        $rootScope.discardChangesFrom.name = 'laborOptimizerClickHandler';
        $rootScope.discardChangesFrom.value = 'app.laborOptimizer.';
        if (modal_shown) {
            modal_shown = appModalService.show('application/invoice-tracking/view/configConfirmation.html', 'ConfigConfirmationCtrl',$rootScope.discardChangesFrom)
        }
        return modal_shown
      }
    }

    $scope.pAndLChartsClickHandler = function() {
      $ionicSideMenuDelegate.toggleLeft();
      $state.go('app.pAndLCharts.' + PAndLChartsService.fetchSelectedPAndLType());
    }

    $scope.documentUploadClickHandler = function() {
      if(!$rootScope.isChagesExist) {
        $ionicSideMenuDelegate.toggleLeft();
        $state.go('app.invoices.summary');
      }else {
        $ionicSideMenuDelegate.toggleLeft();
        $rootScope.discardChangesFrom.name = 'documentUploadClickHandler';
        $rootScope.discardChangesFrom.value = 'app.invoices.summary';
        if (modal_shown) {
            modal_shown = appModalService.show('application/invoice-tracking/view/configConfirmation.html', 'ConfigConfirmationCtrl',$rootScope.discardChangesFrom)
        }
        return modal_shown
      }
    }

    $scope.uploadClickHandler = function() {
      if(!$rootScope.isChagesExist) {
        $ionicSideMenuDelegate.toggleLeft();
        $state.go('app.uploads');
      }else {
        $ionicSideMenuDelegate.toggleLeft();
        $rootScope.discardChangesFrom.name = 'uploadClickHandler';
        $rootScope.discardChangesFrom.value = 'app.uploads';
        if (modal_shown) {
            modal_shown = appModalService.show('application/invoice-tracking/view/configConfirmation.html', 'ConfigConfirmationCtrl',$rootScope.discardChangesFrom)
        }
        return modal_shown
      }
    }

    $scope.operationsClickHandler = function() {
      if(!$rootScope.isChagesExist) {
        $ionicSideMenuDelegate.toggleLeft();
        $state.go('app.operations');
      }else {
        $ionicSideMenuDelegate.toggleLeft();
        $rootScope.discardChangesFrom.name = 'operationsClickHandler';
        $rootScope.discardChangesFrom.value = 'app.operations';
        if (modal_shown) {
            modal_shown = appModalService.show('application/invoice-tracking/view/configConfirmation.html', 'ConfigConfirmationCtrl',$rootScope.discardChangesFrom)
        }
        return modal_shown
      }
      
    }

    $scope.reportsClickHandler = function() {
      $ionicSideMenuDelegate.toggleLeft();
      $state.go('app.reports');
    }

    $scope.paymentClickHandler = function() {
      $ionicSideMenuDelegate.toggleLeft();
      $state.go('app.payment');
    }

    $scope.showCalendar = function() {
      //$scope.navBarTitle.showDateButton = false;
      $state.go('app.calendardate');
    }

    $scope.purchaseOptimizerClickHandler = function() {
      $ionicSideMenuDelegate.toggleLeft();
      $state.go('app.Purchaseoptimizer.Food');
    }

    $scope.purchaseOrdersClickHandler = function() {
      $ionicSideMenuDelegate.toggleLeft();
      $state.go('app.purchaseOrders');
    }

    $scope.promotionOptimizerClickHandler = function() {
      $ionicSideMenuDelegate.toggleLeft();
      $state.go('app.promotionOptimizer');
    }
    $scope.inventoryManagerClickHandler = function() {
      if(!$rootScope.isChagesExist) {
        $ionicSideMenuDelegate.toggleLeft();
        // $state.href("/drafts");
        // $state.href('app.inventoryManager.drafts', {}, {absolute: false});
        $state.go('app.inventoryManager');
        // $state.go('app.inventoryManager.drafts');
      }else {
        $ionicSideMenuDelegate.toggleLeft();
        $rootScope.discardChangesFrom.name = 'inventoryManagerClickHandler';
        $rootScope.discardChangesFrom.value = 'app.inventoryManager';
        if (modal_shown) {
            modal_shown = appModalService.show('application/invoice-tracking/view/configConfirmation.html', 'ConfigConfirmationCtrl',$rootScope.discardChangesFrom)
        }
        return modal_shown
      }
    }
    // $scope.inventoryManagerNewClickHandler = function() {
    //   console.log("inside new inv manager");
    //   $ionicSideMenuDelegate.toggleLeft();
    //   $state.go('app.inventoryManagerNew');
    // }
    // $scope.inventoryListManagerClickHandler = function() {
    //   $ionicSideMenuDelegate.toggleLeft();
    //   // $state.href("/drafts");
    //   // $state.href('app.inventoryManager.drafts', {}, {absolute: false});
    //   $state.go('app.inventoryListManager');
    //   // $state.go('app.inventoryManager.drafts');
    // }
    $scope.orgDashboardClickHandler = function() {
      if(!$rootScope.isChagesExist) {
        $ionicSideMenuDelegate.toggleLeft();
        // $state.href("/drafts");
        // $state.href('app.inventoryManager.drafts', {}, {absolute: false});
        $state.go('app.orgDashboard');
        // $state.go('app.inventoryManager.drafts');
      }else {
        $ionicSideMenuDelegate.toggleLeft();
        $rootScope.discardChangesFrom.name = 'orgDashboardClickHandler';
        $rootScope.discardChangesFrom.value = 'app.orgDashboard';
        if (modal_shown) {
            modal_shown = appModalService.show('application/invoice-tracking/view/configConfirmation.html', 'ConfigConfirmationCtrl',$rootScope.discardChangesFrom)
        }
        return modal_shown
      }
    }
    $scope.orderingClickHandler = function() {
      $ionicSideMenuDelegate.toggleLeft();
      $state.go('app.ordering');
    }
    $scope.settingsManagerClickHandler = function() {
      $scope.shownGroup = null;
      $ionicSideMenuDelegate.toggleLeft();
      $state.go('app.settingsManager');
    }
    $scope.aboutusClickHandler = function() {
      $scope.shownGroup = null;
      $ionicSideMenuDelegate.toggleLeft();
      $state.go('app.aboutusManager');
    }

    $scope.settingsClickHandler = function() {
      $ionicSideMenuDelegate.toggleLeft();
      $state.go('app.settings');
    }
    $scope.weekPriceChangeClickHandler = function() {
      if(!$rootScope.isChagesExist) {
        $ionicSideMenuDelegate.toggleLeft();
        $state.go('app.weekPriceChange');
      }else {
        $ionicSideMenuDelegate.toggleLeft();
        $rootScope.discardChangesFrom.name = 'weekPriceChangeClickHandler';
        $rootScope.discardChangesFrom.value = 'app.weekPriceChange';
        if (modal_shown) {
            modal_shown = appModalService.show('application/invoice-tracking/view/configConfirmation.html', 'ConfigConfirmationCtrl',$rootScope.discardChangesFrom)
        }
        return modal_shown
      }
    }
    $scope.invoiceEntryClickHandler = function() {
      if(!$rootScope.isChagesExist) {
        $ionicSideMenuDelegate.toggleLeft();
        $state.go('app.invoiceManager');
      }else {
        $ionicSideMenuDelegate.toggleLeft();
        $rootScope.discardChangesFrom.name = 'invoiceEntryClickHandler';
        $rootScope.discardChangesFrom.value = 'app.invoiceManager';
        if (modal_shown) {
            modal_shown = appModalService.show('application/invoice-tracking/view/configConfirmation.html', 'ConfigConfirmationCtrl',$rootScope.discardChangesFrom)
        }
        return modal_shown
      }
    }

    $scope.modManagerClickHandler = function() {
      if(!$rootScope.isChagesExist) {
        $ionicSideMenuDelegate.toggleLeft();
        $state.go('app.modManager');
      }else {
        $ionicSideMenuDelegate.toggleLeft();
        $rootScope.discardChangesFrom.name = 'modManagerClickHandler';
        $rootScope.discardChangesFrom.value = 'app.modManager';
        if (modal_shown) {
            modal_shown = appModalService.show('application/invoice-tracking/view/configConfirmation.html', 'ConfigConfirmationCtrl',$rootScope.discardChangesFrom)
        }
        return modal_shown
      }
    };
    $scope.prepManagerClickHandler = function() {
      if(!$rootScope.isChagesExist) {
        $ionicSideMenuDelegate.toggleLeft();
        $state.go('app.prepManager');
      }else {
        $ionicSideMenuDelegate.toggleLeft();
        $rootScope.discardChangesFrom.name = 'prepManagerClickHandler';
        $rootScope.discardChangesFrom.value = 'app.prepManager';
        if (modal_shown) {
            modal_shown = appModalService.show('application/invoice-tracking/view/configConfirmation.html', 'ConfigConfirmationCtrl',$rootScope.discardChangesFrom)
        }
        return modal_shown
      }
    };
    $scope.inventoryToolClickHandler = function() {
      if(!$rootScope.isChagesExist) {
        $ionicSideMenuDelegate.toggleLeft();
        $state.go('app.inventoryTool');
      }else {
        $ionicSideMenuDelegate.toggleLeft();
        $rootScope.discardChangesFrom.name = 'inventoryToolClickHandler';
        $rootScope.discardChangesFrom.value = 'app.inventoryTool';
        if (modal_shown) {
            modal_shown = appModalService.show('application/invoice-tracking/view/configConfirmation.html', 'ConfigConfirmationCtrl',$rootScope.discardChangesFrom)
        }
        return modal_shown
      }
    }
    $scope.recipeCostTrackingClickHandler = function() {
      if(!$rootScope.isChagesExist) {
        $ionicSideMenuDelegate.toggleLeft();
        $state.go('app.recipeCostTracking');
      }else {
        $ionicSideMenuDelegate.toggleLeft();
        $rootScope.discardChangesFrom.name = 'recipeCostTrackingClickHandler';
        $rootScope.discardChangesFrom.value = 'app.recipeCostTracking';
        if (modal_shown) {
            modal_shown = appModalService.show('application/invoice-tracking/view/configConfirmation.html', 'ConfigConfirmationCtrl',$rootScope.discardChangesFrom)
        }
        return modal_shown
      }
    }


    var datePickerCallback = function(val) {

      if (typeof(val) === 'undefined') {
      } else {
        CommonService.setSelectedDate(val);
        $scope.datepickerObject.inputDate = new Date(CommonService.getSelectedDate());
        //$state.go('app.calendarRefresh');
        refreshDateChange();
      }
    };

    $scope.logout = function() {

      // // $scope.logoutPopup.show();
      // A confirm dialog

      var confirmPopup = $ionicPopup.confirm({
        title: 'Attention!',
        template: '<center>Are you sure you want to logout?</center> '
      });
      confirmPopup.then(function(res) {
        if (res) {
          // Utils.setLocalValue('sessionId', "");
          Utils.setLocalValue('fcmToken', "");
          Utils.setLocalValue('isFCMPushEnabled', "");

          Utils.clearSession().then(function() {
            Utils.setLocalValue('reload', 1);
            $state.go('login');
            // .then(function(){
            // $window.location.reload(true);
            // });

          });

        } else {

          // $state.go($rootScope.currentState);
        }
      });
    };

    var getInputDate = CommonService.getSelectedDate();

    $scope.datepickerObject = {
      titleLabel: 'Select Date', //Optional
      todayLabel: 'Today', //Optional
      closeLabel: 'Close', //Optional
      setLabel: 'Set', //Optional
      setButtonType: 'app-theme-text', //Optional
      todayButtonType: 'app-theme-text', //Optional
      closeButtonType: 'app-theme-text', //Optional
      inputDate: new Date(CommonService.getSelectedDate()), //Optional
      mondayFirst: true, //Optional
      disabledDates: disabledDates, //Optional
      weekDaysList: CommonConstants.WEEK_DAYS_LIST, //Optional
      monthList: CommonConstants.MONTHS_LIST, //Optional
      templateType: 'modal', //Optional
      showTodayButton: 'true', //Optional
      modalHeaderColor: 'bar app-theme-color app-theme-text', //Optional
      modalFooterColor: 'bar app-theme-color', //Optional
      from: new Date(2012, 8, 2), //Optional
      to: new Date(2018, 8, 25), //Optional
      callback: function(val) { //Mandatory
        datePickerCallback(val);
      },
      dateFormat: 'MM/dd/yyyy', //Optional
      closeOnSelect: false, //Optional
    };

    $scope.navBarTitle = {
      'showToggleButton': true,
      'showDateButton': true
    };

    var disabledDates = [
      new Date()
    ];

    function refreshDateChange() {
      switch ($state.$current.name) {
        case 'app.healthTracker':
          $scope.$broadcast("HT_DATECHANGE_EVENT");
          break;
        case 'app.healthTrackerDetail':
          $scope.$broadcast("HT_DETAILS_DATECHANGE_EVENT");
          break;
        case 'app.plTracker':
          $scope.$broadcast("PL_DATECHANGE_EVENT");
          break;
        case 'app.wastage':
          $scope.$broadcast("WASTAGE_DATECHANGE_EVENT");
          break;
      }
    }


    $rootScope.$on('Business_Switched', function(evnt) {
      // that.showLoader = true;
      // console.log('Business_Switched event called');
      fetchStores(fetchStoresResponseHandler);
    })

  }
})();
