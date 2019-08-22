(function() {
  'use strict';

  projectCostByte.factory('CommonService', commonService);

  commonService.$inject = ['CommonConstants', 'Utils', '$timeout', '$q'];

  function commonService(CommonConstants, Utils, $timeout, $q) {

    var that = this;

    var commonFactory = {
      setSelectedDate: setSelectedDate,
      getSelectedDate: getSelectedDate,
      changeDateFormat: changeDateFormat,
      strToDate: strToDate,
      getPreviousDates: getPreviousDates,
      healthTrackerStartDate: healthTrackerStartDate,
      healthTrackerEndDate: healthTrackerEndDate,
      transformDatesForChartLegend: transformDatesForChartLegend,
      transformDatesForAxis: transformDatesForAxis,
      fetchDailyStatsSumForRangesForField: fetchDailyStatsSumForRangesForField,
      fetchDailyStatsForField: fetchDailyStatsForField,
      fetchDailyStatsForFields: fetchDailyStatsForFields,
      fetchSummaryCardDetailForField: fetchSummaryCardDetailForField,
      fetchDailyStatsSumForRangesForFields: fetchDailyStatsSumForRangesForFields,
      fetchStoresByBusiness: fetchStoresByBusiness,
      changeStore: changeStore,
      fetchPromotionData: fetchPromotionData,
      fetchMarginOptimizerMenus: fetchMarginOptimizerMenus,
      fetchMarginOptimizerProperties: fetchMarginOptimizerProperties,
      fetchMarginOptimizerMenuData: fetchMarginOptimizerMenuData,
      fetchMarginOptimizerSectionData: fetchMarginOptimizerSectionData,
      fetchMarginOptimizerMenuItemData: fetchMarginOptimizerMenuItemData,
      fetchMarginOptimizerModsData: fetchMarginOptimizerModsData,
      fetchMarginOptimizerIngredientSuppliers: fetchMarginOptimizerIngredientSuppliers,
      fetchMarginOptimizerSortingButtons: fetchMarginOptimizerSortingButtons,
      fetchSummaryCardHistoryDetails: fetchSummaryCardHistoryDetails,
      fetchOrgDashboardSummaryData: fetchOrgDashboardSummaryData,
      //            fetchMenuEngineeringFilterButtons: fetchMenuEngineeringFilterButtons,
      DashboardfetchTasks: DashboardfetchTasks,
      DashboardaddTask: DashboardaddTask,
      DashboardtoggleTask: DashboardtoggleTask,
      fetchTasksTemplateForTaskDetail: fetchTasksTemplateForTaskDetail,
      fetchMenuPerformanceOptimizerMenus: fetchMenuPerformanceOptimizerMenus,
      fetchMenuPerformanceOptimizerProperties: fetchMenuPerformanceOptimizerProperties,
      fetchMenuPerformanceOptimizerMenuData: fetchMenuPerformanceOptimizerMenuData,
      fetchMenuPerformanceOptimizerSectionData: fetchMenuPerformanceOptimizerSectionData,
      fetchMenuPerformanceOptimizerMenuItemData: fetchMenuPerformanceOptimizerMenuItemData,
      fetchPurchaseOptimizerData: fetchPurchaseOptimizerData,
      createIngredientsPurchaseOrder: createIngredientsPurchaseOrder,
      fetchWastageForRangesDetail: fetchWastageForRangesDetail,
      fetchWastageForRangesForField: fetchWastageForRangesForField,
      fetchWastageForRangesForTable: fetchWastageForRangesForTable,
      fetchOrders: fetchOrders,
      fetchInventories: fetchInventories,
      createInventory: createInventory,
      deleteInventory: deleteInventory,
      fetchStores: fetchStores,
      fetchIngredients: fetchIngredients,
      postIngredients: postIngredients,
      fetchOrdering: fetchOrdering,
      createOrdering: createOrdering,
      updateOrdering: updateOrdering,
      deleteOrdering: deleteOrdering,
      fetchOrderingIngredients: fetchOrderingIngredients,
      postOrderingIngredients: postOrderingIngredients,
      fetchMarginOptimizerAllMenusData: fetchMarginOptimizerAllMenusData,
      fetchMarginOptimizerlatestDate: fetchMarginOptimizerlatestDate,
      fetchMarginOptimizerDisabledDates: fetchMarginOptimizerDisabledDates,
      fetchMarginOptimizerMenusV2: fetchMarginOptimizerMenusV2,
      fetchMarginOptimizerMenuDataV2: fetchMarginOptimizerMenuDataV2,
      fetchMarginOptimizerMenuItemIngredientsV2: fetchMarginOptimizerMenuItemIngredientsV2,
      fetchMarginOptimizerMenuItemIngredientsEditV2: fetchMarginOptimizerMenuItemIngredientsEditV2,
      updateMarginOptimizerMenuItemIngredientsEditV2: updateMarginOptimizerMenuItemIngredientsEditV2,
      updateMarginOptimizerMenuItemByRecipeEdit: updateMarginOptimizerMenuItemByRecipeEdit,
      fetchDailyStatsForAttr: fetchDailyStatsForAttr,
      // fetchMarginOptimizerAllMenusData: fetchMarginOptimizerAllMenusData,
      sendLoggerMessage: sendLoggerMessage,
      fetchDisabledDates: fetchDisabledDates,
      fetchLatestDate: fetchLatestDate,
      fetchSuppliers: fetchSuppliers,
      fetchMeasurements: fetchMeasurements,
      fetchInventoryCategories: fetchInventoryCategories,
      fetchSuppliersInvoices: fetchSuppliersInvoices,
      fetchForceSuppliersInvoices: fetchForceSuppliersInvoices,
      fetchInvoiceTracking: fetchInvoiceTracking,
      fetchInvoicePurchaseTrend: fetchInvoicePurchaseTrend,
      createInvoice: createInvoice,
      updateInvoiceDue: updateInvoiceDue,
      updateInvoiceImage: updateInvoiceImage,
      fetchInvoiceDetails: fetchInvoiceDetails,
      updateInventory: updateInventory,
      deleteCacheEntriesWithServiceRequestPath: deleteCacheEntriesWithServiceRequestPath,
      getSettingsManagerLandingPage: getSettingsManagerLandingPage,
      settingsManagerGetLaborSettings: settingsManagerGetLaborSettings,
      settingsManagerSetLaborSettings: settingsManagerSetLaborSettings,
      settingsManagerGetEmployees: settingsManagerGetEmployees,
      settingsManagerSetEmployees: settingsManagerSetEmployees,
      settingsManagerGetEmployeePayHistory: settingsManagerGetEmployeePayHistory,
      settingsManagerSetEmployeePayHistory: settingsManagerSetEmployeePayHistory,
      settingsManagerGetUsers: settingsManagerGetUsers,
      settingsManagerSetUser: settingsManagerSetUser,
      settingsManagerAddUser: settingsManagerAddUser,
      settingsManagerAddUserJobRoles: settingsManagerAddUserJobRoles,
      settingsManagerGetDropDownOptions: settingsManagerGetDropDownOptions,
      settingsManagerGetUserJobRoles: settingsManagerGetUserJobRoles,
      SettingsManagerGetSkeleton: SettingsManagerGetSkeleton,
      fetchPandLDetailsData: fetchPandLDetailsData,
      postUserErrorReport: postUserErrorReport,
      fetchCannedErrorMessages: fetchCannedErrorMessages,
      fetchTaskMessages: fetchTaskMessages,
      setModifiedsupplierItemConfig: setModifiedsupplierItemConfig,
      getsupplierItemConfig: getsupplierItemConfig,
      saveCustomSupplierItemField: saveCustomSupplierItemField,
      inventorySaveModifiedIngredientPrice: inventorySaveModifiedIngredientPrice,
      fetchLaborForSummaryTable: fetchLaborForSummaryTable,
      fetchLaborForRangesForField: fetchLaborForRangesForField,
      fetchLaborForRoleTable: fetchLaborForRoleTable,
      fetchLaborForEmployeeTable: fetchLaborForEmployeeTable,
      fetchLatestLaborDate: fetchLatestLaborDate,
      fetchDisabledLaborDates: fetchDisabledLaborDates,
      exportInventory: exportInventory,
      fetchPeriodListData: fetchPeriodListData,
      pandLfetchPeriodWeeksWithData: pandLfetchPeriodWeeksWithData,
      pandLfetchPeriodWeeks: pandLfetchPeriodWeeks,
      fetchBusinesses: fetchBusinesses,
      fetchUnits: fetchUnits,
      fetchIngrediantsList: fetchIngrediantsList,
      fetchIngredientsData: fetchIngredientsData,
      fetchDailyStatsSummaryForFirstAttr: fetchDailyStatsSummaryForFirstAttr,
      fetchDailyStatsSummaryForSecondAttr: fetchDailyStatsSummaryForSecondAttr,
      // summaryStartDate: summaryStartDate,
      // summaryEndDate: summaryEndDate
      getUserDefaullEmailId: getUserDefaullEmailId,
      appMenuGetSideMenu: appMenuGetSideMenu,
      getsupplierItemConfigEdit: getsupplierItemConfigEdit,
      setModifiedMenuItemConfig: setModifiedMenuItemConfig,
      pAndLChartsGetChartData: pAndLChartsGetChartData,
      pAndLChartsGetChartDefinitions: pAndLChartsGetChartDefinitions,
      pAndLChartsGetDateRangeOptions: pAndLChartsGetDateRangeOptions,
      addNewInvItem: addNewInvItem,
      registerDevice: registerDevice,
      fetchInvItems: fetchInvItems,
      fetchInvItemsNew: fetchInvItemsNew,
      fetchSupplierItems: fetchSupplierItems,
      fetchPnLSupplierItems: fetchPnLSupplierItems,
      fetchPnLSupplierItemsNew: fetchPnLSupplierItemsNew,
      postInvMapping: postInvMapping,
      postPnLMapping: postPnLMapping,
      changeUserPwd: changeUserPwd,
      getInventorySummary: getInventorySummary,
      fetchInactiveItems: fetchInactiveItems,
      postInactiveActive: postInactiveActive,
      //Web Inventory
      fetchInventoryItemsWeb: fetchInventoryItemsWeb,
      fetchInventoryItemInfoWeb: fetchInventoryItemInfoWeb,
      addInvItemInfo: addInvItemInfo,
      updateInventoryListItemWeb: updateInventoryListItemWeb,
      getsupplier: getsupplier,
      fetchSupplierItemWeb: fetchSupplierItemWeb,
      updateSuppInvItm: updateSuppInvItm,
      getMeasurementData: getMeasurementData,
      postMeasurementConvData: postMeasurementConvData,
      getMeasurementDataQty: getMeasurementDataQty,
      fetchPnLInvItems: fetchPnLInvItems,
      postInvPnLMapping: postInvPnLMapping,
      deleteSupplierItemWeb: deleteSupplierItemWeb,
      postMeasurementData: postMeasurementData,
      getItemSummary: getItemSummary,
      fetchPurchaseSummary: fetchPurchaseSummary,
      postInvoiceDetails: postInvoiceDetails,
      searchInvoiceDetails: searchInvoiceDetails,
      getCogsItems: getCogsItems,
      getModIngredients: getModIngredients,
      getPrepIngredients: getPrepIngredients,
      fetchModItemIngredients: fetchModItemIngredients,
      fetchOrgData: fetchOrgData,
      fetchInactiveListData: fetchInactiveListData,
      updateIngredientStatus: updateIngredientStatus,
      fetchOldTaskMessagesRequest: fetchOldTaskMessagesRequest,
      fetchInvoiceConfigSuplierItems: fetchInvoiceConfigSuplierItems,
      fetchUnitsInv: fetchUnitsInv,
      editSubmittedDraft: editSubmittedDraft,
      fetchMinorCategories: fetchMinorCategories,
      fetchPnlCategories: fetchPnlCategories,
      exportSalesData: exportSalesData,
      fetchMarginOptimizerMenuItemEditIngredientsV2: fetchMarginOptimizerMenuItemEditIngredientsV2,
      updateMinorCategory: updateMinorCategory,
      getSupplierDetails: getSupplierDetails,
      getCoversionFactor: getCoversionFactor,
      exportInvoice: exportInvoice,
      exportRecipeData: exportRecipeData,
      postSupplierDetails: postSupplierDetails,
      fetchInvClientItems: fetchInvClientItems,
      saveInvToolChanges: saveInvToolChanges,
      addNewLocationWeb: addNewLocationWeb,
      reOrderItems: reOrderItems,
      reOrderCategory: reOrderCategory,
      fetchIngredientPrepItems: fetchIngredientPrepItems,
      savePrepChanges: savePrepChanges,
      deletePrepItem: deletePrepItem,
      fetchAddIngredients: fetchAddIngredients,
      addMoreIng: addMoreIng,
      updateIngredient: updateIngredient,
      addNewPrepItem: addNewPrepItem,
      updateIngredientYieldUnit: updateIngredientYieldUnit,
      getTotalCost: getTotalCost,
      varianceReport: varianceReport,
      refreshScreenApi: refreshScreenApi,
      getRegenerateSummaryChanges: getRegenerateSummaryChanges,
      fetchAllBusinessList: fetchAllBusinessList,
      fetchAllSupplier:fetchAllSupplier,
      fetchAllMeasurements:fetchAllMeasurements,
      fetchAllPriceTrackData: fetchAllPriceTrackData,
      exportWeeklyPriceChangeData: exportWeeklyPriceChangeData,
      deleteSupplierItemINV: deleteSupplierItemINV,
      postMultiSupplierDetails: postMultiSupplierDetails,
      getPriceRecipeDetails: getPriceRecipeDetails,
      getCalculatePriceOfINv: getCalculatePriceOfINv,
      exportDRAFT:exportDRAFT,
      // dashboardNewApi: dashboardNewApi
    };

    var responseCache = {};

    function sendRequestIfNotPresentInCache(serviceRequestPath, serviceRequestData, serviceRequestType,
      serviceResponseHandler, serviceRequestHeaders) {

      var paramNames = [];
      for (var paramName in serviceRequestData) {
        paramNames.push(paramName);
      }
      paramNames.sort();
      var queryString = "";
      for (var index = 0; index < paramNames.length; index++) {
        queryString = queryString + "&" + paramNames[index] + "=" + serviceRequestData[paramNames[index]];
      }
      var cacheKey = serviceRequestPath + queryString;

      cacheKey += "&dateOfRequest=" + (new Date()).toISOString().substring(0, 10);
      if (responseCache[cacheKey]) {
        $timeout(function() {
          serviceResponseHandler(responseCache[cacheKey]);
        });
        return;
      }
      var serviceResponseHandlerWrapper = function(response) {
        responseCache[cacheKey] = response;
        serviceResponseHandler(response);
      }
      Utils.executeCostByteWebService(serviceRequestPath, serviceRequestData,
        serviceRequestType, serviceResponseHandlerWrapper, serviceRequestHeaders);
    }

    function deleteCacheEntriesWithServiceRequestPath(serviceRequestPath) {
      // console.log(serviceRequestPath)
      // console.log(responseCache)
      var keysToBeDeleted = [];
      for (var cacheKey in responseCache) {
        if (cacheKey.startsWith(serviceRequestPath)) {
          keysToBeDeleted.push(cacheKey);
        }
      }
      //  console.log(keysToBeDeleted)
      for (var index = 0; index < keysToBeDeleted.length; index++) {
        delete responseCache[keysToBeDeleted[index]];
      }
      // console.log(responseCache)
    }
    //  var selectedDate = new Date(new Date() - 24*60*60*1000))
    var selectedDate = new Date()

    function setSelectedDate(value) {
      //console.log(value);
      selectedDate = value;
    }

    function getSelectedDate() {
      //console.log(selectedDate);
      return selectedDate;
    }

    function changeDateFormat(date) {
      var dd = date.getDate();
      var mm = date.getMonth() + 1; //January is 0!
      var yyyy = date.getFullYear();
      if (dd < 10) {
        dd = '0' + dd
      }
      if (mm < 10) {
        mm = '0' + mm
      }
      var returnedDate = mm + '/' + dd + '/' + yyyy;
      return returnedDate.toString();
    }

    function strToDate(dateStr) {
      const [month, day, year] = dateStr.split("/")
      return new Date(year, month - 1, day)
    }

    function getPreviousDates(dateValue, type, changeValue) {
      var changedDate = new Date(dateValue);
      switch (type) {
        case 'day':
          changedDate.setDate(changedDate.getDate() - changeValue);
          break;
        case 'month':
          changedDate.setMonth(changedDate.getMonth() - changeValue);
          break;
        case 'year':
          changedDate.setFullYear(changedDate.getFullYear() - changeValue);
          break;
        default:
          changedDate = new Date(dateValue);
      }
      return changeDateFormat(changedDate);
    }

    function getRequestHeaders() {
      return {
        "isb-session-id": Utils.getLocalValue('sessionId')
      };
    }

    function healthTrackerStartDate(isBenchmark, timePeriod) {
      var startDate = angular.copy(getSelectedDate());
      //console.log(startDate);
      if (timePeriod == 'WEEKLY') {
        var first = startDate.getDate() - startDate.getDay();
        if (startDate.getDay() == 0) {
          var start_Date = first - 62;
        } else {
          var start_Date = first - 55;
        }
        var x = new Date(startDate.setDate(start_Date));
        var firstday = x;
        if (isBenchmark) {
          var y = x.getDate();
          var firstday = new Date(x.setDate(y - 28)); // TODO - make this (7) a config/setting
        }
        return changeDateFormat(firstday);
      }
      if (timePeriod == 'DAILY') {
        if (isBenchmark) {
          //  var startDate = angular.copy(getSelectedDate());
          var first = startDate.getDate() - 15;
          var firstday = new Date(startDate.setDate(first)); // TODO - make this (7) a config/setting
          //console.log(firstday);
        } else {
          var start_Date = startDate.getDate() - 7;
          var firstday = new Date(startDate.setDate(start_Date));
          //   console.log(firstday);
        }
        return changeDateFormat(firstday);
      }
    }

    function healthTrackerEndDate(isBenchmark, timePeriod) {
      var endDate = angular.copy(getSelectedDate());
      //console.log(endDate);
      if (timePeriod == 'WEEKLY') {
        if (endDate.getDay() == 0)
          var first = endDate.getDate() - endDate.getDay() - 0;
        else
          var first = endDate.getDate() - endDate.getDay() + 0;
        var firstday = new Date(endDate.setDate(first));
        //console.log(firstday);
        if (isBenchmark) {
          var endDate = angular.copy(getSelectedDate());
          var firstday = new Date(endDate.setDate(first - 28)); // TODO - make this (7) a config/setting
        }
        return changeDateFormat(firstday);
      }
      if (timePeriod == 'DAILY') {
        if (isBenchmark) {
          //  var endDate = angular.copy(getSelectedDate());
          var first = endDate.getDate();
          var lastday = new Date(endDate.setDate(first - 8)); // TODO - make this (7) a config/setting
          //console.log(lastday);
        } else {
          var lastday = endDate;
          //  console.log(lastday);
        }
        //  console.log(lastday);
        return changeDateFormat(lastday);
      }
    }

    function transformDatesForChartLegend(dates) {
      // TODO - this method depends on whether the chart is a daily or a monthly chart
      var legendDates = [];

      for (var i = 0; i < dates.length; i++) {
        var date = dates[i];
        var dateComps = date.split("/");
        var mm = parseInt(dateComps[0]) - 1;
        var dd = dateComps[1];
        if (dd == undefined) {
          legendDates.push(date);
        } else {
          //legendDates.push(dd + " " + CommonConstants.MONTHS_LIST[mm]); PB-607 and PB-385
          legendDates.push(mm + "/" + dd); //PB-607 and PB-385
        }
      }
      return legendDates;
    }

    function transformDatesForAxis(dates) {
      // TODO - this method depends on whether the chart is a daily or a monthly chart
      var legendDates = [];

      for (var i = 0; i < dates.length; i++) {
        var date = dates[i];
        var dateComps = date.split("/");
        var mm = parseInt(dateComps[0]);
        var dd = dateComps[1];
        if (dd == undefined) {
          legendDates.push(date);
        } else {
          //legendDates.push(dd + " " + CommonConstants.MONTHS_LIST[mm]); PB-607 and PB-385
          legendDates.push(mm + "/" + dd); //PB-607 and PB-385
        }
      }
      return legendDates;
    }

    function fetchDisabledDates(responseHandler, startDate, endDate) {
      var serviceRequestType = 'GET';
      var serviceRequestData = {
        start_date: changeDateFormat(startDate),
        end_date: changeDateFormat(endDate)
      };
      var responseHandlerWrapper = function(response) {
        if (angular.isDefined(response.data)) {
          //console.log(response.data.dates);
          responseHandler(response.data.dates)
        }
      }

      Utils.executeCostByteWebService('get_disabled_dates', serviceRequestData,
        serviceRequestType, responseHandlerWrapper, getRequestHeaders());
    }

    // function dashboardNewApi(responseHandler, dateRange) {
    //   var serviceRequestType = 'POST';
    //   var serviceRequestData = {
    //     frequency_selection:"PERIOD_WEEK_8_3_2018"
    //   };
    //   var responseHandlerWrapper = function(response) {
    //     if (angular.isDefined(response.data)) {
    //       //console.log(response.data.dates);
    //       responseHandler(response.data)
    //     }
    //   }

    //   Utils.executeCostByteWebService('get_summary_card_detail', serviceRequestData,
    //     serviceRequestType, responseHandlerWrapper, getRequestHeaders());
    // }

    function fetchDisabledLaborDates(responseHandler, startDate, endDate) {
      var serviceRequestType = 'GET';
      var serviceRequestData = {
        start_date: changeDateFormat(startDate),
        end_date: changeDateFormat(endDate)
      };
      var responseHandlerWrapper = function(response) {
        if (angular.isDefined(response.data)) {
          //console.log(response.data.dates);
          responseHandler(response.data.dates)
        }
      }

      Utils.executeCostByteWebService('get_disabled_labor_dates', serviceRequestData,
        serviceRequestType, responseHandlerWrapper, getRequestHeaders());
    }

    function fetchIngredientPrepItems(responseHandler) {
      var serviceRequestType = 'GET';
      var serviceRequestData = {};
      var responseHandlerWrapper = function(response) {
        if (angular.isDefined(response.data)) {
          //console.log(response.data.dates);
          responseHandler(response.data)
        }
      }

      sendRequestIfNotPresentInCache('get_add_ingredients', serviceRequestData,
        serviceRequestType, responseHandlerWrapper, getRequestHeaders());

      // Utils.executeCostByteWebService('get_add_ingredients', serviceRequestData,
      //   serviceRequestType, responseHandlerWrapper, getRequestHeaders());
    }



    function fetchLaborForSummaryTable(responseHandler, startDate, endDate, timePeriod) {
      var serviceRequestType = 'GET';
      var serviceRequestData = {
        end_date: endDate,
        start_date: startDate,
        time_period: timePeriod,
      };

      var responseHandlerWrapper = function(response) {
        if (angular.isDefined(response.data)) {
          responseHandler(response.data)
        }
      }

      Utils.executeCostByteWebService('get_labor_data_table', serviceRequestData,
        serviceRequestType, responseHandlerWrapper, getRequestHeaders());
    }

    function fetchLaborForRangesForField(responseHandler, startDate, endDate, timePeriod, dataToGet) {
      var serviceRequestType = 'GET';
      var serviceRequestData = {
        end_date: endDate,
        start_date: startDate,
        time_period: timePeriod,
        tag_id: dataToGet
      };
      var responseHandlerWrapper = function(response) {
        //console.log(response.data);
        if (angular.isDefined(response.data)) {
          responseHandler(response.data)
        }
      }

      Utils.executeCostByteWebService('get_labor_data_graph', serviceRequestData,
        serviceRequestType, responseHandlerWrapper, getRequestHeaders());
    }

    function fetchLaborForRoleTable(responseHandler, startDate, endDate, timePeriod) {
      var serviceRequestType = 'GET';
      var serviceRequestData = {
        end_date: endDate,
        start_date: startDate,
        time_period: timePeriod,
      };

      var responseHandlerWrapper = function(response) {
        if (angular.isDefined(response.data)) {
          responseHandler(response.data)
        }
      }

      Utils.executeCostByteWebService('get_labor_data_role', serviceRequestData,
        serviceRequestType, responseHandlerWrapper, getRequestHeaders());
    }

    function fetchLaborForEmployeeTable(responseHandler, startDate, endDate, timePeriod) {
      var serviceRequestType = 'GET';
      var serviceRequestData = {
        end_date: endDate,
        start_date: startDate,
        time_period: timePeriod,
      };
      var responseHandlerWrapper = function(response) {
        //console.log(response.data);
        if (angular.isDefined(response.data)) {
          responseHandler(response.data)
        }
      }

      Utils.executeCostByteWebService('get_labor_data_employee', serviceRequestData,
        serviceRequestType, responseHandlerWrapper, getRequestHeaders());
    }


    function fetchPandLDetailsData(responseHandler, frequencyDetail) {
      var serviceRequestType = 'GET';
      var serviceRequestData = {
        frequency_selection: frequencyDetail
      };
      var responseHandlerWrapper = function(response) {
        if (angular.isDefined(response.data)) {
          //  console.log(response.data.data_list);
          responseHandler(response.data)
        }
      }

      Utils.executeCostByteWebService('get_pandl_details', serviceRequestData,
        serviceRequestType, responseHandlerWrapper, getRequestHeaders());
    }


    function getCoversionFactor(responseHandler, ingredientId) {
      var serviceRequestType = 'GET';
      var serviceRequestData = {
        recipe_ingredient_id: ingredientId
      };
      var responseHandlerWrapper = function(response) {
        if (angular.isDefined(response.data)) {
          //  console.log(response.data.data_list);
          responseHandler(response.data)
        }
      }
      deleteCacheEntriesWithServiceRequestPath('fetch_measurement_unit_recipe');
      sendRequestIfNotPresentInCache('fetch_measurement_unit_recipe', serviceRequestData,
        serviceRequestType, responseHandler, getRequestHeaders());
      // Utils.executeCostByteWebService('fetch_measurement_unit_recipe', serviceRequestData,
      //   serviceRequestType, responseHandlerWrapper, getRequestHeaders());
    }

    function fetchPeriodListData(responseHandler) {
      var serviceRequestType = 'GET';
      var serviceRequestData = {};
      var responseHandlerWrapper = function(response) {
        if (angular.isDefined(response.data)) {
          //  console.log(response.data);
          responseHandler(response.data)
        }
      }

      Utils.executeCostByteWebService('get_period_list', serviceRequestData,
        serviceRequestType, responseHandlerWrapper, getRequestHeaders());
    }

    function pandLfetchPeriodWeeksWithData(responseHandler) {
      var serviceRequestType = 'GET';
      var serviceRequestData = {};
      var responseHandlerWrapper = function(response) {
        if (angular.isDefined(response.data)) {
          //  console.log(response.data);
          responseHandler(response.data)
        }
      }

      sendRequestIfNotPresentInCache('get_period_weeks_with_data', serviceRequestData,
        serviceRequestType, responseHandlerWrapper, getRequestHeaders());
    }

    function getSupplierDetails(responseHandler, invid, category) {
      var serviceRequestType = 'GET';
      var serviceRequestData = {
        'inv_id': invid,
        'category': category
      };
      var responseHandlerWrapper = function(response) {
        if (angular.isDefined(response.data)) {
          //  console.log(response.data);
          responseHandler(response.data)
        }
      }

      deleteCacheEntriesWithServiceRequestPath('get_supplier_items_for_inventory')
      sendRequestIfNotPresentInCache('get_supplier_items_for_inventory', serviceRequestData,
        serviceRequestType, responseHandlerWrapper, getRequestHeaders());

    }

    function fetchOrgData(responseHandler, period) {
      var serviceRequestType = 'GET';
      var serviceRequestData = {
        frequency_selection: period
      };
      var responseHandlerWrapper = function(response) {
        if (angular.isDefined(response.data)) {
          // console.log("Common service response : ", response.data);
          responseHandler(response.data)
        }
      }

      Utils.executeCostByteWebService('get_pandl_stat_org_data', serviceRequestData,
        serviceRequestType, responseHandlerWrapper, getRequestHeaders());
    }

    function fetchInactiveListData(responseHandler) {
      var serviceRequestType = 'GET';
      var serviceRequestData = {};
      var responseHandlerWrapper = function(response) {
        if (angular.isDefined(response.data)) {
          // console.log("Common service response : ", response.data);
          responseHandler(response.data)
        }
      }

      Utils.executeCostByteWebService('get_inventory_active_inactive_items', serviceRequestData,
        serviceRequestType, responseHandlerWrapper, getRequestHeaders());
    }

    function fetchBusinesses(responseHandler) {
      var serviceRequestType = 'GET';
      var serviceRequestData = {};

      var responseHandlerWrapper = function(response) {
        responseHandler(response.data);
      }
      // Utils.executeCostByteWebService('get_businesses', serviceRequestData,
      //   serviceRequestType, responseHandlerWrapper, getRequestHeaders());
      sendRequestIfNotPresentInCache('get_businesses', serviceRequestData,
        serviceRequestType, responseHandlerWrapper, getRequestHeaders());
    }

    function pandLfetchPeriodWeeks(responseHandler) {
      var serviceRequestType = 'GET';
      var serviceRequestData = {};
      var responseHandlerWrapper = function(response) {
        if (angular.isDefined(response.data)) {
          //  console.log(response.data);
          responseHandler(response.data)
        }
      }

      Utils.executeCostByteWebService('get_period_weeks', serviceRequestData,
        serviceRequestType, responseHandlerWrapper, getRequestHeaders());
    }

    function fetchLatestLaborDate(responseHandler, startDate, endDate, timePeriod) {
      var serviceRequestType = 'GET';
      var serviceRequestData = {
        start_date: changeDateFormat(startDate),
        end_date: changeDateFormat(endDate),
        time_period: timePeriod
      };
      var responseHandlerWrapper = function(response) {
        if (angular.isDefined(response.data)) {
          //  console.log(response.data);
          responseHandler(response.data.l_date)
        }
      }

      Utils.executeCostByteWebService('get_latest_labor_date', serviceRequestData,
        serviceRequestType, responseHandlerWrapper, getRequestHeaders());
    }

    function fetchLatestDate(responseHandler, startDate, endDate) {
      var serviceRequestType = 'GET';
      var serviceRequestData = {
        start_date: changeDateFormat(startDate),
        end_date: changeDateFormat(endDate)
      };
      var responseHandlerWrapper = function(response) {
        if (angular.isDefined(response.data)) {
          responseHandler(response.data.l_date)
        }
      }
      Utils.executeCostByteWebService('get_latest_date', serviceRequestData,
        serviceRequestType, responseHandlerWrapper, getRequestHeaders());
    }

    function fetchDailyStatsForAttr(responseHandler, fieldName, startDate, endDate, timePeriod) {
      // field names
      // total_sales, food_sales, food_cost, liquor_sales, liquor_cost, labor_cost, fixed_cost, profits, breakeven_sales, other_sales
      var serviceRequestType = 'GET';
      var serviceRequestData = {
        end_date: endDate,
        start_date: startDate,
        time_period: timePeriod,
        dsfields: fieldName
      };

      var responseHandlerWrapper = function(response) {
        if (response.data.meta.success) {
          if (angular.isDefined(response.data)) {
            //console.log(response.data);
            responseHandler(response.data.dates, response.data.values[0].values)
          }
        }
      }

      sendRequestIfNotPresentInCache('get_daily_stats_data', serviceRequestData,
        serviceRequestType, responseHandlerWrapper, getRequestHeaders());

    }

    function fetchDailyStatsSummaryForFirstAttr(responseHandler, fieldName, endDate, timePeriod) {
      // field names
      // total_sales, food_sales, food_cost, liquor_sales, liquor_cost, labor_cost, fixed_cost, profits, breakeven_sales, other_sales

      var serviceRequestType = 'GET';
      var serviceRequestData = {
        end_date: endDate,
        // start_date: startDate,
        time_period: timePeriod,
        // dsfields: fieldName
      };
      var responseHandlerWrapper = function(response) {
        // console.log(response);
        // if (response.data.meta.success) {
        //   if (angular.isDefined(response.data)) {
        //     responseHandler(response.data.dates, response.data.values[0].values)
        //   }
        // }
        responseHandler(response.data.date, response.data.values);
      }

      sendRequestIfNotPresentInCache('get_daily_stats_data_for_dashboard', serviceRequestData,
        serviceRequestType, responseHandlerWrapper, getRequestHeaders());

      // Utils.executeCostByteWebService('get_daily_stats_data', serviceRequestData,
      //     serviceRequestType, responseHandlerWrapper, getRequestHeaders());
    }

    function fetchDailyStatsSummaryForSecondAttr(responseHandler, fieldName, startDate, timePeriod) {
      // field names
      // total_sales, food_sales, food_cost, liquor_sales, liquor_cost, labor_cost, fixed_cost, profits, breakeven_sales, other_sales
      var serviceRequestType = 'GET';
      var serviceRequestData = {
        // end_date: endDate,
        end_date: startDate,
        time_period: timePeriod,
        // dsfields: fieldName
      };
      var responseHandlerWrapper = function(response) {
        // if (response.data.meta.success) {
        //   if (angular.isDefined(response.data)) {
        //     responseHandler(response.data.dates, response.data.values[0].values)
        //   }
        // }
        responseHandler(response.data.date, response.data.values);
      }

      sendRequestIfNotPresentInCache('get_daily_stats_data_for_dashboard', serviceRequestData,
        serviceRequestType, responseHandlerWrapper, getRequestHeaders());

      // Utils.executeCostByteWebService('get_daily_stats_data', serviceRequestData,
      //     serviceRequestType, responseHandlerWrapper, getRequestHeaders());
    }

    function fetchDailyStatsForField(responseHandler, fieldName, startDate, endDate) {
      var serviceRequestType = 'GET';
      var serviceRequestData = {
        end_date: endDate,
        start_date: startDate,
        time_period: 'WEEKLY',
        dsfields: fieldName
      };

      var responseHandlerWrapper = function(response) {
        if (response.data.meta.success) {
          if (angular.isDefined(response.data)) {
            responseHandler(response.data.dates, response.data.values[0].values)
          }
        }
      }

      sendRequestIfNotPresentInCache('get_daily_stats', serviceRequestData,
        serviceRequestType, responseHandlerWrapper, getRequestHeaders());
    }

    function fetchSummaryCardHistoryDetails(rangeDataResponseHandler, period, business_id, store_id) {
      var serviceRequestType = 'POST';
      var serviceRequestData = {
        "frequency_selection": period,
        "business_id": business_id,
        "business_store_id": store_id
      };

      var rangeHistoryDataResponseHandler = function(response) {
        if (response.data) {
          // if (angular.isDefined(response.data)) {
          rangeHistoryDataResponseHandler(response.data);
          return;
          // }
        }
        // rangeDataResponseHandler([], {});
      }
      Utils.executeCostBytePostWebService('get_summary_history', serviceRequestData,
        serviceRequestType, rangeHistoryDataResponseHandler, getRequestHeaders());
    }

    function fetchOrgDashboardSummaryData(responseHandler, period) {
      // field names
      // total_sales, food_sales, food_cost, liquor_sales, liquor_cost, labor_cost, fixed_cost, profits, breakeven_sales, other_sales
      var serviceRequestType = 'GET';
      var serviceRequestData = {
        frequency_selection: period,
      };
      // console.log('fetchDailyStatsSummaryForSecondAttr startDate: ',startDate);
      // console.log('endDate: ',endDate);

      var responseHandlerWrapper = function(response) {
        if (response.data.meta.success) {
          if (angular.isDefined(response.data)) {
            responseHandler(response.data.dates, response.data.values[0].values)
          }
        }
      }

      sendRequestIfNotPresentInCache('get_pandl_stat_org_data', serviceRequestData,
        serviceRequestType, responseHandlerWrapper, getRequestHeaders());
    }

    function fetchSummaryCardDetailForField(rangeDataResponseHandler, period, fieldName, business_id, store_id) {
      /*var serviceRequestType = 'POST';
      var serviceRequestData = {
        "frequency_selection": period,
        "type": fieldName,
        "business_id": business_id,
        "business_store_id": store_id
      };*/
      var serviceRequestType = 'GET';
      var serviceRequestData = {};

      var rangeDataResponseHandlerWrapper = function(response) {
        if (response.data) {
          // if (angular.isDefined(response.data)) {
          rangeDataResponseHandler(response.data);
          return;
          // }
        }
        // rangeDataResponseHandler([], {});
      }

      sendRequestIfNotPresentInCache('get_summary_card_detail', serviceRequestData,
        serviceRequestType, responseHandlerWrapper, getRequestHeaders());
      /*Utils.executeCostBytePostWebService('get_summary_card_detail', serviceRequestData,
        serviceRequestType, rangeDataResponseHandlerWrapper, getRequestHeaders());*/

    }


    function fetchDailyStatsSumForRangesForField(rangeDataResponseHandler, dateRanges, fieldName) {
      var serviceRequestType = 'POST';
      var serviceRequestData = {
        time_ranges: dateRanges,
        dsfields: fieldName
      };

      var rangeDataResponseHandlerWrapper = function(response) {
        if (response.data.meta.success) {
          if (angular.isDefined(response.data)) {
            var values = {};
            response.data.values.forEach(function(fieldData) {
              values[fieldData.field] = fieldData.values;
            });
            rangeDataResponseHandler(response.data.dates, values);
            return;
          }
        }
        rangeDataResponseHandler([], {});
      }

      Utils.executeCostBytePostWebService('get_daily_stats_sum_for_ranges', serviceRequestData,
        serviceRequestType, rangeDataResponseHandlerWrapper, getRequestHeaders());
    }

    //--------------------------------
    function editSubmittedDraft(draft_id, responseHandler) {
      var serviceRequestType = 'POST';
      var serviceRequestData = {
        'draft_id': draft_id
      };

      var responseHandlerWrapper = function(response) {
        console.log(response)
        responseHandler(response.data)
      }
      deleteCacheEntriesWithServiceRequestPath('get_inventory_list');
      deleteCacheEntriesWithServiceRequestPath('get_ingredients_for_inventory');
      Utils.executeCostBytePostWebService('post_inventory_submitted_draft', serviceRequestData,
        serviceRequestType, responseHandlerWrapper, getRequestHeaders());
    }
    //---------------------------------------


    function addNewInvItem(ResponseHandler, invData) {
      var serviceRequestType = 'POST';

      // var serviceRequestData = {
      //     'task_id': task_id,
      //     'property': property
      // };
      deleteCacheEntriesWithServiceRequestPath('get_ingredients_for_inventory')
      deleteCacheEntriesWithServiceRequestPath('get_ingredients_for_ordering')
      //deleteCacheEntriesWithServiceRequestPath('post_ingredient_data')
      Utils.executeCostBytePostWebService('post_ingredient_data', invData,
        serviceRequestType, ResponseHandler, getRequestHeaders());
    }

    function addNewLocationWeb(ResponseHandler, location) {
      var serviceRequestType = 'POST';

      deleteCacheEntriesWithServiceRequestPath('get_ingredients_for_inventory')
      deleteCacheEntriesWithServiceRequestPath('get_client_inventory_data')
      Utils.executeCostBytePostWebService('add_category', location,
        serviceRequestType, ResponseHandler, getRequestHeaders());
    }



    function postInvoiceDetails(ResponseHandler, invoiceDetails) {
      var serviceRequestType = 'POST';
      Utils.executeCostBytePostWebService('post_invoice_details', invoiceDetails,
        serviceRequestType, ResponseHandler, getRequestHeaders());
    }

    function registerDevice(ResponseHandler, deviceData) {
      var serviceRequestType = 'POST';

      // var serviceRequestData = {
      //     'task_id': task_id,
      //     'property': property
      // };

      Utils.executeCostBytePostWebService('push_notification_register', deviceData,
        serviceRequestType, ResponseHandler, getRequestHeaders());
    }

    function fetchWastageForRangesForField(rangeDataResponseHandler, startDate, endDate) {
      var serviceRequestType = 'GET';
      var serviceRequestData = {
        start_date: startDate,
        end_date: endDate

      };

      var responseHandlerWrapper = function(response) {
        if (response.data.meta.success) {
          if (angular.isDefined(response.data)) {
            rangeDataResponseHandler(response.data.dates, response.data.values)
          }
        }
      }

      sendRequestIfNotPresentInCache('get_wastage_data', serviceRequestData,
        serviceRequestType, responseHandlerWrapper, getRequestHeaders());
    }

    function fetchWastageForRangesDetail(rangeDataResponseHandler, startDate, endDate, field) {
      var serviceRequestType = 'GET';
      var serviceRequestData = {
        start_date: startDate,
        end_date: endDate,
        ingredient_id: field
      };

      var responseHandlerWrapper = function(response) {
        if (response.data.meta.success) {
          if (angular.isDefined(response.data)) {
            // console.log(response.data);
            rangeDataResponseHandler(response.data.dates, response.data.values)
          }
        }
      }

      sendRequestIfNotPresentInCache('get_wastage_data_detail', serviceRequestData,
        serviceRequestType, responseHandlerWrapper, getRequestHeaders());
    }

    function fetchWastageForRangesForTable(rangeDataResponseHandler, startDate, endDate) {
      var serviceRequestType = 'GET';
      var serviceRequestData = {
        start_date: startDate,
        end_date: endDate
      };

      var responseHandlerWrapper = function(response) {
        if (response.data.meta.success) {
          if (angular.isDefined(response.data)) {
            var dataItems = [{
              name: response.data.ingredient_id[0],
              amount: response.data.values[0]
            }, {
              name: response.data.ingredient_id[1],
              amount: response.data.values[1]
            }, {
              name: response.data.ingredient_id[2],
              amount: response.data.values[2]
            }, {
              name: response.data.ingredient_id[3],
              amount: response.data.values[3]
            }, {
              name: response.data.ingredient_id[4],
              amount: response.data.values[4]
            }];
            rangeDataResponseHandler(dataItems)
          }
        }
      }

      sendRequestIfNotPresentInCache('get_wastage_data_table', serviceRequestData,
        serviceRequestType, responseHandlerWrapper, getRequestHeaders());
    }

    function fetchDailyStatsForFields(responseHandler, fieldNames, startDate, endDate) {
      fetchDailyStatsForField(responseHandler, fieldNames.join("|"), startDate, endDate);
    }

    function fetchDailyStatsSumForRangesForFields(rangeDataResponseHandler, dateRanges, fieldNames) {
      fetchDailyStatsSumForRangesForField(rangeDataResponseHandler, dateRanges, fieldNames.join("|"));
    }


    function fetchMarginOptimizerAllMenusData(responseHandler, setTimePeriod) {


      var serviceRequestType = 'GET';
      var serviceRequestData = {
        date: changeDateFormat(getSelectedDate()),
        dateRange: setTimePeriod
      };


      var responseHandlerWrapper = function(response) {
        responseHandler(response.data.value)
      }

      sendRequestIfNotPresentInCache('get_margin_optimizer_all_menu_data', serviceRequestData,
        serviceRequestType, responseHandlerWrapper, getRequestHeaders());
    }

    function fetchMarginOptimizerlatestDate(responseHandler, dateRange, endDate) {
      var serviceRequestType = 'GET';
      var serviceRequestData = {
        dateRange: dateRange,
        targetDate: changeDateFormat(endDate)
      };
      var responseHandlerWrapper = function(response) {
        if (angular.isDefined(response.data)) {
          responseHandler(response.data.latestDate)
        }
      }

      Utils.executeCostByteWebService('get_margin_optimizer_latest_date', serviceRequestData,
        serviceRequestType, responseHandlerWrapper, getRequestHeaders());
    }

    function fetchMarginOptimizerDisabledDates(responseHandler, dateRange, startDate, endDate) {
      var serviceRequestType = 'GET';
      var serviceRequestData = {
        dateRange: dateRange,
        startDate: changeDateFormat(startDate),
        endDate: changeDateFormat(endDate),
      };
      var responseHandlerWrapper = function(response) {
        if (angular.isDefined(response.data)) {
          //console.log(response.data.dates);
          responseHandler(response.data.disabledDates)
        }
      }

      Utils.executeCostByteWebService('get_margin_optimizer_disabled_dates', serviceRequestData,
        serviceRequestType, responseHandlerWrapper, getRequestHeaders());
    }


    function fetchMarginOptimizerMenus(responseHandler) {
      var serviceRequestType = 'GET';
      var serviceRequestData = {};

      var responseHandlerWrapper = function(response) {
        responseHandler(JSON.parse(response.data.value))
      }

      sendRequestIfNotPresentInCache('get_margin_optimizer_menus_keys', serviceRequestData,
        serviceRequestType, responseHandlerWrapper, getRequestHeaders());
    }

    function fetchMarginOptimizerSortingButtons(responseHandler) {
      var serviceRequestType = 'GET';
      var serviceRequestData = {};

      var responseHandlerWrapper = function(response) {
        responseHandler(JSON.parse(response.data.value))
      }

      sendRequestIfNotPresentInCache('get_margin_optimizer_sorting_buttons', serviceRequestData,
        serviceRequestType, responseHandlerWrapper, getRequestHeaders());
    }

    function fetchMarginOptimizerProperties(responseHandler, request_definition) {
      var serviceRequestType = 'GET';
      var serviceRequestData = request_definition;

      var responseHandlerWrapper = function(response) {
        responseHandler(JSON.parse(response.data.value))
      }

      sendRequestIfNotPresentInCache('get_margin_optimizer_data', serviceRequestData,
        serviceRequestType, responseHandlerWrapper, getRequestHeaders());
    }

    function fetchMarginOptimizerMenuData(responseHandler, request_definition) {
      var base_url = CommonConstants.REQUEST_BASE_URL_V1
      var serviceRequestType = 'GET';
      var serviceRequestData = request_definition;

      var responseHandlerWrapper = function(response) {
        responseHandler(JSON.parse(response.data.value))
      }

      sendRequestIfNotPresentInCache('get_margin_optimizer_menu_data', serviceRequestData,
        serviceRequestType, responseHandlerWrapper, getRequestHeaders());
    }

    function fetchMarginOptimizerSectionData(responseHandler, request_definition) {
      var serviceRequestType = 'GET';
      var serviceRequestData = request_definition;

      var responseHandlerWrapper = function(response) {
        responseHandler(JSON.parse(response.data.value))
      }

      sendRequestIfNotPresentInCache('get_margin_optimizer_section_data', serviceRequestData,
        serviceRequestType, responseHandlerWrapper, getRequestHeaders());
    }

    function fetchMarginOptimizerMenuItemData(responseHandler, request_definition) {
      var serviceRequestType = 'GET';
      var serviceRequestData = request_definition;

      var responseHandlerWrapper = function(response) {
        responseHandler(JSON.parse(response.data.value))
      }

      sendRequestIfNotPresentInCache('get_margin_optimizer_menuitem_data', serviceRequestData,
        serviceRequestType, responseHandlerWrapper, getRequestHeaders());
    }

    function fetchMarginOptimizerModsData(responseHandler, request_definition) {
      var serviceRequestType = 'GET';
      var serviceRequestData = request_definition;

      var responseHandlerWrapper = function(response) {
        if (!response.data.hasOwnProperty('items')) {
          response.data.items = [];
        }
        //                console.log(response.data.items)
        responseHandler(response.data.items)
      }

      Utils.executeCostByteWebService('get_margin_optimizer_mods_data', serviceRequestData,
        serviceRequestType, responseHandlerWrapper, getRequestHeaders());
    }

    function fetchMarginOptimizerIngredientSuppliers(responseHandler, ingredient) {
      var serviceRequestType = 'GET';
      var serviceRequestData = {
        'ingredient_id': ingredient.ingredient_id
      };

      var responseHandlerWrapper = function(response) {
        ingredient.suppliers = response.data.suppliers;
        responseHandler(ingredient)
      }
      sendRequestIfNotPresentInCache('get_ingredient_suppliers', serviceRequestData,
        serviceRequestType, responseHandlerWrapper, getRequestHeaders());
    }

    function DashboardaddTask(ResponseHandler, task) {
      var serviceRequestType = 'POST';
      var serviceRequestData = {
        'data': task
      };

      Utils.executeCostBytePostWebService('dashboard_add_task', serviceRequestData,
        serviceRequestType, ResponseHandler, getRequestHeaders());
    }

    function DashboardtoggleTask(ResponseHandler, task_id, property) {
      var serviceRequestType = 'POST';
      var serviceRequestData = {
        'task_id': task_id,
        'property': property
      };

      Utils.executeCostBytePostWebService('dashboard_toggle_task', serviceRequestData,
        serviceRequestType, ResponseHandler, getRequestHeaders());
    }

    function DashboardfetchTasks(responseHandler) {
      var serviceRequestType = 'GET';
      var serviceRequestData = {};

      var responseHandlerWrapper = function(response) {
        responseHandler(JSON.parse(response.data.tasks))
      }

      Utils.executeCostByteWebService('dashboard_get_tasks', serviceRequestData,
        serviceRequestType, responseHandlerWrapper, getRequestHeaders());
    }

    function fetchTasksTemplateForTaskDetail(responseHandler, taskKey) {
      var serviceRequestType = 'GET';
      var serviceRequestData = {
        'taskKey': taskKey
      };

      var responseHandlerWrapper = function(response) {
        responseHandler(JSON.parse(response.data.value))
      }

      Utils.executeCostByteWebService('get_task_detail_template', serviceRequestData,
        serviceRequestType, responseHandlerWrapper, getRequestHeaders());
    }

    function fetchStoresByBusiness(responseHandler) {
      var serviceRequestType = 'GET';
      var serviceRequestData = {};

      var responseHandlerWrapper = function(response) {
        responseHandler(JSON.parse(response.data.stores), response.data.current_store);
      }

      // sendRequestIfNotPresentInCache('get_stores_by_businessid', serviceRequestData,
      //   serviceRequestType, responseHandlerWrapper, getRequestHeaders());
      Utils.executeCostByteWebService('get_stores_by_businessid', serviceRequestData,
        serviceRequestType, responseHandlerWrapper, getRequestHeaders());
    }

    function changeStore(new_store_id) {
      var serviceRequestType = 'POST';
      var serviceRequestData = {
        'new_store_id': new_store_id
      };

      var responseHandlerWrapper = function(response) {}

      Utils.executeCostBytePostWebService('set_store_of_business', serviceRequestData,
        serviceRequestType, responseHandlerWrapper, getRequestHeaders());
    }

    function fetchPromotionData(responseHandler, PromotionDataType) {
      var serviceRequestType = 'GET';
      var serviceRequestData = {
        'promotion_data_type': PromotionDataType
      };

      var responseHandlerWrapper = function(response) {
        responseHandler(JSON.parse(response.data.promotion_data), PromotionDataType);
      }

      sendRequestIfNotPresentInCache('get_promotion_data', serviceRequestData,
        serviceRequestType, responseHandlerWrapper, getRequestHeaders());
    }

    function fetchMenuPerformanceOptimizerMenus(responseHandler) {
      var serviceRequestType = 'GET';
      var serviceRequestData = {};

      var responseHandlerWrapper = function(response) {
        responseHandler(JSON.parse(response.data.value))
      }

      sendRequestIfNotPresentInCache('get_margin_optimizer_menus_keys', serviceRequestData,
        serviceRequestType, responseHandlerWrapper, getRequestHeaders());
    }


    function fetchMenuPerformanceOptimizerProperties(responseHandler, request_definition) {
      var serviceRequestType = 'GET';
      var serviceRequestData = request_definition;

      var responseHandlerWrapper = function(response) {
        responseHandler(JSON.parse(response.data.value))
      }

      sendRequestIfNotPresentInCache('get_margin_optimizer_data', serviceRequestData,
        serviceRequestType, responseHandlerWrapper, getRequestHeaders());
    }

    function fetchMenuPerformanceOptimizerMenuData(responseHandler, request_definition) {
      var serviceRequestType = 'GET';
      var serviceRequestData = request_definition;

      var responseHandlerWrapper = function(response) {
        responseHandler(JSON.parse(response.data.value))
        //console.log(response.data.value);
      }

      sendRequestIfNotPresentInCache('get_menuperformance_menu_data', serviceRequestData,
        serviceRequestType, responseHandlerWrapper, getRequestHeaders());
    }

    function fetchMenuPerformanceOptimizerSectionData(responseHandler, request_definition) {
      var serviceRequestType = 'GET';
      var serviceRequestData = request_definition;

      var responseHandlerWrapper = function(response) {
        responseHandler(JSON.parse(response.data.value))
      }

      sendRequestIfNotPresentInCache('get_menuperformance_section_data', serviceRequestData,
        serviceRequestType, responseHandlerWrapper, getRequestHeaders());
    }

    function fetchMenuPerformanceOptimizerMenuItemData(responseHandler, request_definition) {
      var serviceRequestType = 'GET';
      var serviceRequestData = request_definition;

      var responseHandlerWrapper = function(response) {
        responseHandler(JSON.parse(response.data.value))
      }

      sendRequestIfNotPresentInCache('get_margin_optimizer_menuitem_data', serviceRequestData,
        serviceRequestType, responseHandlerWrapper, getRequestHeaders());
    }

    function fetchPurchaseOptimizerData(ingredientCount, responseHandler) {
      var serviceRequestType = 'GET';
      var serviceRequestData = {
        ingredient_count: ingredientCount
      };

      var responseHandlerWrapper = function(response) {
        responseHandler(response.data)
      }

      sendRequestIfNotPresentInCache('get_purchase_optimizer_data', serviceRequestData,
        serviceRequestType, responseHandlerWrapper, getRequestHeaders());
    }

    function createIngredientsPurchaseOrder(responseHandler, orderData) {
      //sends order data to backend
      var orderDataJson = JSON.stringify(orderData)
      var serviceRequestType = 'POST';
      var serviceRequestData = orderData;

      var responseHandlerWrapper = function(response) {
        responseHandler()
      }

      Utils.executeCostBytePostWebService('create_ingredients_purchase_order', serviceRequestData,
        serviceRequestType, responseHandlerWrapper, getRequestHeaders());
    }

    function fetchOrders(responseHandler) {
      var responseHandlerWrapper = function(response) {
        responseHandler(response.data.orders);
      }
      sendRequestIfNotPresentInCache('get_purchase_orders', {}, 'GET', responseHandlerWrapper, getRequestHeaders());
    }

    function fetchInventories(responseHandler) {
      var serviceRequestType = 'GET';
      var serviceRequestData = {};

      var responseHandlerWrapper = function(response) {
        // console.log(response);
        responseHandler(response)
      };
      Utils.executeCostByteWebService('get_inventory_list', serviceRequestData,
        serviceRequestType, responseHandlerWrapper, getRequestHeaders());
      // var responseHandlerWrapper = function(response) {
      //   responseHandler(response);
      // };
      // Utils.executeCostBytePostWebService('get_inventory_list', {}, 'GET', responseHandlerWrapper, getRequestHeaders());
    }

    function createInventory(responseHandler, requestPayload) {
      var payload = JSON.stringify(requestPayload)
      var serviceRequestType = 'POST';
      var serviceRequestData = payload;

      var responseHandlerWrapper = function(response) {
        responseHandler(response);
      };

      deleteCacheEntriesWithServiceRequestPath('get_inventory_list');
      Utils.executeCostBytePostWebService('create_inventory', serviceRequestData,
        serviceRequestType, responseHandlerWrapper, getRequestHeaders());
    }


    function updateInventory(responseHandler, requestPayload) {
      var payload = JSON.stringify(requestPayload)
      var serviceRequestType = 'POST';
      var serviceRequestData = payload;

      var responseHandlerWrapper = function(response) {
        responseHandler(response);
      };

      //  deleteCacheEntriesWithServiceRequestPath('get_inventory_list');
      Utils.executeCostBytePostWebService('update_inventory_details', serviceRequestData,
        serviceRequestType, responseHandlerWrapper, getRequestHeaders());
    }

    function deleteInventory(responseHandler, requestPayload) {
      var payload = JSON.stringify(requestPayload);
      var serviceRequestType = 'POST';
      var serviceRequestData = payload;

      var responseHandlerWrapper = function(response) {
        responseHandler(response);
      };

      deleteCacheEntriesWithServiceRequestPath('get_inventory_list');
      Utils.executeCostBytePostWebService('delete_inventory', serviceRequestData,
        serviceRequestType, responseHandlerWrapper, getRequestHeaders());
    }

    function fetchOrdering(responseHandler) {
      var responseHandlerWrapper = function(response) {
        responseHandler(response);
      };
      Utils.executeCostBytePostWebService('get_ordering_list', {}, 'GET', responseHandlerWrapper, getRequestHeaders());
    }

    function createOrdering(responseHandler, requestPayload) {
      var payload = JSON.stringify(requestPayload)
      var serviceRequestType = 'POST';
      var serviceRequestData = payload;

      var responseHandlerWrapper = function(response) {
        responseHandler(response);
      };

      deleteCacheEntriesWithServiceRequestPath('get_ordering_list');
      Utils.executeCostBytePostWebService('create_ordering', serviceRequestData,
        serviceRequestType, responseHandlerWrapper, getRequestHeaders());
    }


    function updateOrdering(responseHandler, requestPayload) {
      var payload = JSON.stringify(requestPayload)
      var serviceRequestType = 'POST';
      var serviceRequestData = payload;

      var responseHandlerWrapper = function(response) {
        responseHandler(response);
      };

      //  deleteCacheEntriesWithServiceRequestPath('get_inventory_list');
      Utils.executeCostBytePostWebService('update_ordering_details', serviceRequestData,
        serviceRequestType, responseHandlerWrapper, getRequestHeaders());
    }

    function deleteOrdering(responseHandler, requestPayload) {
      var payload = JSON.stringify(requestPayload);
      var serviceRequestType = 'POST';
      var serviceRequestData = payload;

      var responseHandlerWrapper = function(response) {
        responseHandler(response);
      };

      deleteCacheEntriesWithServiceRequestPath('get_ordering_list');
      Utils.executeCostBytePostWebService('delete_ordering', serviceRequestData,
        serviceRequestType, responseHandlerWrapper, getRequestHeaders());
    }

    function fetchStores(responseHandler) {
      var serviceRequestType = 'GET';

      var responseHandlerWrapper = function(response) {
        responseHandler(response.data)
      };

      sendRequestIfNotPresentInCache('get_stores', {},
        serviceRequestType, responseHandlerWrapper, getRequestHeaders());
    }

    function exportSalesData(responseHandler, data) {
      // console.log(data);

      var serviceRequestType = 'GET';
      var serviceRequestData;
      if (data.type == "Date Range") {
        serviceRequestData = {
          start_date: data.startDatetimeValue,
          end_date: data.endDatetimeValue,
          user_email: data.userEmailId
        };
      } else if (data.type == "Daily" || data.type == "Weekly") {
        var dateRange = data.type == "Weekly" ? "LAST_7_DAYS" : data.type;
        serviceRequestData = {
          date_range: dateRange.toUpperCase(),
          user_email: data.userEmailId,
          start_date: data.latestDate
        };
      } else {
        var dateRange = data.type;
        serviceRequestData = {
          date_range: dateRange.toUpperCase(),
          user_email: data.userEmailId,
        };
      }
      // console.log(serviceRequestData);
      var responseHandlerWrapper = function(response) {
        responseHandler(response)
      };
      Utils.executeCostByteWebService('daily_stats_data_email', serviceRequestData,
        serviceRequestType, responseHandlerWrapper, getRequestHeaders());
    }

    function exportInventory(responseHandler, draftId, emailId) {
      var serviceRequestType = 'GET';
      var serviceRequestData = {
        draftId: draftId,
        emailId: emailId
      };

      var responseHandlerWrapper = function(response) {
        // console.log(response.status);
        responseHandler(response)
      };
      Utils.executeCostByteWebService('send_inventory_email', serviceRequestData,
        serviceRequestType, responseHandlerWrapper, getRequestHeaders());
    }

    function varianceReport(responseHandler, serviceRequstData) {
      var serviceRequestType = 'GET';
      var serviceRequestData = serviceRequstData

      var responseHandlerWrapper = function(response) {
        // console.log(response.status);
        responseHandler(response)
      };
      Utils.executeCostByteWebService('send_varience_report', serviceRequestData,
        serviceRequestType, responseHandlerWrapper, getRequestHeaders());
    }

    function getPriceRecipeDetails(responseHandler, serviceRequstData) {
      var serviceRequestType = 'GET';
      var serviceRequestData = serviceRequstData

      var responseHandlerWrapper = function(response) {
        if (!response.data.hasOwnProperty('items')) {
          response.data.items = [];
        }
        responseHandler(response.data.items)
        // responseHandler(response)
      };
      Utils.executeCostByteWebService('get_price_tracking_approval_data', serviceRequestData,
        serviceRequestType, responseHandlerWrapper, getRequestHeaders());
    }

    function exportRecipeData(responseHandlerRes, user_email, menuitem) {
      console.log("menuitem", menuitem)
      var serviceRequestType = 'POST';
      if (menuitem == undefined) {
        var serviceRequestData = {
          'user_email': user_email
        };
      } else {
        var serviceRequestData = {
          'user_email': user_email,
          'menuItemId': menuitem
        };
      }
      var responseHandlerWrapper = function(response) {
        responseHandlerRes(response);
      }
      Utils.executeCostBytePostWebService('export_recipe_data_mail', serviceRequestData,
        serviceRequestType, responseHandlerWrapper, getRequestHeaders());
    }

    function exportInvoice(responseHandlerRes, date_range, user_email) {
      var serviceRequestType = 'POST';
      var serviceRequestData = {
        'date_range': date_range,
        'user_email': user_email
      };
      var responseHandlerWrapper = function(response) {
        responseHandlerRes(response);
      }
      Utils.executeCostBytePostWebService('export_invoice_details', serviceRequestData,
        serviceRequestType, responseHandlerWrapper, getRequestHeaders());
    }

    function postMultiSupplierDetails(responseHandlerRes, resultarray) {
      var serviceRequestType = 'POST';
      var serviceRequestData = resultarray;
      var responseHandlerWrapper = function(response) {
        responseHandlerRes(response);
      }
      deleteCacheEntriesWithServiceRequestPath('get_ingredients_for_inventory')
      Utils.executeCostBytePostWebService('save_inventory_supplier_changes_multi', serviceRequestData,
        serviceRequestType, responseHandlerWrapper, getRequestHeaders());
    }
    function postSupplierDetails(responseHandlerRes, resultarray) {
      var serviceRequestType = 'POST';
      var serviceRequestData = resultarray;
      var responseHandlerWrapper = function(response) {
        responseHandlerRes(response);
      }
      Utils.executeCostBytePostWebService('save_inventory_supplier_changes', serviceRequestData,
        serviceRequestType, responseHandlerWrapper, getRequestHeaders());
    }

    function getCogsItems(responseHandler, invInfo) {
      var serviceRequestType = 'GET';
      var serviceRequestData = {
        dateRange: invInfo.dateRange,
        statName: invInfo.item_name
      };

      var responseHandlerWrapper = function(response) {
        // console.log(response);
        responseHandler(response.data)
      };
      Utils.executeCostByteWebService('get_pandl_cogs_breakout_details', serviceRequestData,
        serviceRequestType, responseHandlerWrapper, getRequestHeaders());
    }

    function fetchUnits(responseHandler, supplier_id, supplier_item_id) {
      var serviceRequestType = 'GET';
      var serviceRequestData = {
        supplierId: supplier_id,
        supplierItemId: supplier_item_id
      };

      var responseHandlerWrapper = function(response) {
        responseHandler(response.data)
      };

      sendRequestIfNotPresentInCache('get_supplier_item_units', serviceRequestData,
        serviceRequestType, responseHandlerWrapper, getRequestHeaders());
    }

    function fetchUnitsInv(responseHandler, supplier_id, supplier_item_id) {
      var serviceRequestType = 'GET';
      var serviceRequestData = {
        supplierId: supplier_id,
        supplierItemId: supplier_item_id
      };

      var responseHandlerWrapper = function(response) {
        responseHandler(response.data)
      };

      sendRequestIfNotPresentInCache('get_units', serviceRequestData,
        serviceRequestType, responseHandlerWrapper, getRequestHeaders());
    }

    function fetchIngredients(responseHandler, draftId, force_fetch) {
      var serviceRequestType = 'GET';
      var serviceRequestData = {
        draft_id: draftId
      };

      var responseHandlerWrapper = function(response) {
        responseHandler(response.data, response.status)
      };

      //            console.log(force_fetch)
      if (angular.isUndefined(force_fetch)) {
        force_fetch = false;
      }

      if (force_fetch) {
        //                console.log('Force fetching ingredients')
        deleteCacheEntriesWithServiceRequestPath('get_ingredients_for_inventory')
      }
      sendRequestIfNotPresentInCache('get_ingredients_for_inventory', serviceRequestData,
        serviceRequestType, responseHandlerWrapper, getRequestHeaders());
    }

    function postIngredients(responseHandler, requestPayload) {
      var payload = JSON.stringify(requestPayload);
      var serviceRequestType = 'POST';
      var serviceRequestData = payload;

      var responseHandlerWrapper = function(response) {
        responseHandler(response);
      };
      deleteCacheEntriesWithServiceRequestPath('get_inventory_list');
      deleteCacheEntriesWithServiceRequestPath('get_ingredients_for_inventory');
      deleteCacheEntriesWithServiceRequestPath('get_inventory_list');
      Utils.executeCostBytePostWebService('post_inventory_data', serviceRequestData,
        serviceRequestType, responseHandlerWrapper, getRequestHeaders());
    }

    function getInventorySummary(responseHandler, invIds, inventoryId, isDraft) {
      // var payload = JSON.stringify(requestPayload);
      var sendIds = {
        'getIds': invIds,
        'draft_id': inventoryId,
        'isDraft': isDraft
      }
      var serviceRequestType = 'POST';
      var serviceRequestData = sendIds;
      // console.log(JSON.stringify(sendIds))
      var serviceResponseHandlerWrapper = function(response) {
        console.log("summary response");
        // console.log(response)
        responseHandler(response.data, response.status);
      };

      Utils.executeCostBytePostWebService('get_inventory_summary_data', sendIds,
        serviceRequestType, serviceResponseHandlerWrapper, getRequestHeaders());

    }

    function fetchOrderingIngredients(responseHandler, draftId, force_fetch) {
      var serviceRequestType = 'GET';
      var serviceRequestData = {
        draft_id: draftId
      };

      var responseHandlerWrapper = function(response) {
        responseHandler(response.data)
      };

      //            console.log(force_fetch)
      if (angular.isUndefined(force_fetch)) {
        force_fetch = false;
      }
      // console.log(force_fetch);
      if (force_fetch) {
        //                console.log('Force fetching ingredients')
        deleteCacheEntriesWithServiceRequestPath('get_ingredients_for_ordering')
      }
      sendRequestIfNotPresentInCache('get_ingredients_for_ordering', serviceRequestData,
        serviceRequestType, responseHandlerWrapper, getRequestHeaders());
    }

    function postOrderingIngredients(responseHandler, requestPayload) {
      var payload = JSON.stringify(requestPayload);
      var serviceRequestType = 'POST';
      var serviceRequestData = payload;

      var responseHandlerWrapper = function(response) {
        responseHandler(response);
      };
      deleteCacheEntriesWithServiceRequestPath('get_ordering_list');
      deleteCacheEntriesWithServiceRequestPath('get_ingredients_for_ordering');
      deleteCacheEntriesWithServiceRequestPath('get_ordering_list');
      Utils.executeCostBytePostWebService('post_ordering_data', serviceRequestData,
        serviceRequestType, responseHandlerWrapper, getRequestHeaders());
    }

    function fetchMarginOptimizerMenusV2(responseHandler, menuType) {
      var serviceRequestType = 'GET';
      var serviceRequestData = {
        //                "menuType": menuType
      };

      var responseHandlerWrapper = function(response) {
        if (!response.data.hasOwnProperty('items')) {
          response.data.items = [];
        }
        responseHandler(response.data.items)
      }

      sendRequestIfNotPresentInCache('fetch_margin_optimizer_categories', serviceRequestData,
        serviceRequestType, responseHandlerWrapper, getRequestHeaders());
    }

    // function fetchAddIngredients(responseHandler) {
    //   console.log('***************** fetchAddIngredients *************');
    //   var serviceRequestType = 'GET';
    //
    //
    //   var responseHandlerWrapper = function(response) {
    //     // if (!response.data.hasOwnProperty('items')) {
    //     //   response.data.items = [];
    //     // }
    //     // responseHandler(response.data.items)
    //   }
    //
    //   sendRequestIfNotPresentInCache('get_add_ingredients', {},
    //     serviceRequestType, responseHandlerWrapper, getRequestHeaders());
    // }
    function fetchAddIngredients(responseHandler) {
      var serviceRequestType = 'GET';

      var responseHandlerWrapper = function(response) {
        // console.log(response);
        responseHandler(response.data)
      };

      sendRequestIfNotPresentInCache('get_add_ingredients', {},
        serviceRequestType, responseHandlerWrapper, getRequestHeaders());
    }



    function fetchMarginOptimizerMenuDataV2(responseHandler, request_definition) {
      var serviceRequestType = 'GET';
      var serviceRequestData = request_definition;

      var responseHandlerWrapper = function(response) {
        if (!response.data.hasOwnProperty('items')) {
          response.data.items = [];
        }
        responseHandler(response.data.items)
      }

      // sendRequestIfNotPresentInCache('fetch_margin_optimizer_sections', serviceRequestData,
      //   serviceRequestType, responseHandlerWrapper, getRequestHeaders());
      Utils.executeCostByteWebService('fetch_margin_optimizer_sections', serviceRequestData,
        serviceRequestType, responseHandlerWrapper, getRequestHeaders());
    }

    function fetchMarginOptimizerMenuItemIngredientsV2(responseHandler, request_definition) {
      var serviceRequestType = 'GET';
      var serviceRequestData = request_definition;

      var responseHandlerWrapper = function(response) {
        if (!response.data.hasOwnProperty('items')) {
          response.data.items = [];
        }
        // console.log(response);
        responseHandler(response.data)
      }

      sendRequestIfNotPresentInCache('get_menu_recipe_ingredients', serviceRequestData,
        serviceRequestType, responseHandlerWrapper, getRequestHeaders());
    }

    function fetchMarginOptimizerMenuItemEditIngredientsV2(responseHandler, request_definition) {
      var serviceRequestType = 'GET';
      var serviceRequestData = request_definition;

      var responseHandlerWrapper = function(response) {
        if (!response.data.hasOwnProperty('items')) {
          response.data.items = [];
        }
        responseHandler(response.data)
      }

      sendRequestIfNotPresentInCache('get_menu_recipe_ingredients', serviceRequestData,
        serviceRequestType, responseHandlerWrapper, getRequestHeaders());
    }

    function fetchMarginOptimizerMenuItemIngredientsEditV2(responseHandler, request_definition) {
      var serviceRequestType = 'GET';
      var serviceRequestData = request_definition;

      var responseHandlerWrapper = function(response) {
        if (!response.data.hasOwnProperty('items')) {
          response.data.items = [];
        }
        // console.log(response.data.items)
        responseHandler(response.data.items)

      }

      deleteCacheEntriesWithServiceRequestPath('get_menu_recipe_ingredients');
      sendRequestIfNotPresentInCache('get_menu_recipe_ingredients', serviceRequestData,
        serviceRequestType, responseHandlerWrapper, getRequestHeaders());
    }

    function updateIngredientStatus(inactiveResponseHandler, resultData) {
      var serviceRequestType = 'POST';
      var serviceRequestData = {
        data: resultData
      };

      var responseHandler = function(response) {
        // console.log(response);
        inactiveResponseHandler(response.data);
      }

      // deleteCacheEntriesWithServiceRequestPath('get_all_inv_items');
      // deleteCacheEntriesWithServiceRequestPath('get_inv_sup_items');
      deleteCacheEntriesWithServiceRequestPath('get_ingredients_for_inventory');
      Utils.executeCostBytePostWebService('update_inventory_status', serviceRequestData,
        serviceRequestType, responseHandler, getRequestHeaders());
    }

    function addNewPrepItem(ResponseHandler, serviceRequestData) {
      var serviceRequestType = 'POST';
      var serviceRequestData = serviceRequestData;
      var responseHandler = function(response) {
        ResponseHandler(response);
      }
      deleteCacheEntriesWithServiceRequestPath('get_prep_recipe_cost');
      deleteCacheEntriesWithServiceRequestPath('get_add_ingredients');
      Utils.executeCostBytePostWebService('create_prep', serviceRequestData,
        serviceRequestType, ResponseHandler, getRequestHeaders());
    }


    function updateMarginOptimizerMenuItemIngredientsEditV2(responseHandler, datas) {
      var serviceRequestType = 'POST';
      var serviceRequestData = {
        'items': datas,
      };

      var responseHandlerWrapper = function(response) {
        responseHandler(response.data)
      }

      Utils.executeCostBytePostWebService('set_menu_recipe_ingredients', serviceRequestData,
        serviceRequestType, responseHandlerWrapper, getRequestHeaders());
    }

    function updateMarginOptimizerMenuItemByRecipeEdit(responseHandler, menuItem) {
      var serviceRequestType = 'POST';
      var serviceRequestData = menuItem;

      var responseHandlerWrapper = function(response) {
        responseHandler(response.data)
      }

      Utils.executeCostBytePostWebService('set_updated_menu_item_cost', serviceRequestData,
        serviceRequestType, responseHandlerWrapper, getRequestHeaders());
    }

    function addMoreIng(responseHandler, menuItem) {
      var serviceRequestType = 'POST';
      var serviceRequestData = {
        "ingredients": menuItem
      }

      var responseHandlerWrapper = function(response) {
        responseHandler(response.data)
      }

      deleteCacheEntriesWithServiceRequestPath('get_menu_recipe_ingredients');
      deleteCacheEntriesWithServiceRequestPath('fetch_margin_optimizer_sections');

      Utils.executeCostBytePostWebService('post_add_ingredients', serviceRequestData,
        serviceRequestType, responseHandlerWrapper, getRequestHeaders());
    }
    function deleteSupplierItemINV(responseHandler, servicereq) {
      var serviceRequestType = 'POST';
      var serviceRequestData = servicereq

      var responseHandlerWrapper = function(response) {
        responseHandler(response.data)
      }

      // deleteCacheEntriesWithServiceRequestPath('get_menu_recipe_ingredients');
      // deleteCacheEntriesWithServiceRequestPath('fetch_margin_optimizer_sections');

      Utils.executeCostBytePostWebService('delete_supplier_item_from_inventory_item', serviceRequestData,
        serviceRequestType, responseHandlerWrapper, getRequestHeaders());
    }


    function updateIngredient(responseHandler, menuItem, recipeId, ingredientGroupId) {
      var serviceRequestType = 'POST';
      var serviceRequestData = {
        "ingredients": menuItem,
        "recipeId": recipeId,
        "ingredientGroupId": ingredientGroupId
      }

      var responseHandlerWrapper = function(response) {
        responseHandler(response.data)
      }

      deleteCacheEntriesWithServiceRequestPath('get_menu_recipe_ingredients');
      deleteCacheEntriesWithServiceRequestPath('fetch_margin_optimizer_sections');

      Utils.executeCostBytePostWebService('update_ingredient', serviceRequestData,
        serviceRequestType, responseHandlerWrapper, getRequestHeaders());
    }


    function sendLoggerMessage(message, messageType) {
      var serviceRequestType = 'POST';
      var serviceRequestData = {
        'message': message,
        'messageType': messageType
      };

      var responseHandler = function(response) {};
      Utils.executeCostBytePostWebService('logger', serviceRequestData,
        serviceRequestType, responseHandler, getRequestHeaders());
    }

    function getSettingsManagerLandingPage(responseHandler) {
      var serviceRequestType = 'GET';
      var serviceRequestData = {};

      var responseHandlerWrapper = function(response) {
        responseHandler(response.data.settingsEntries)
      }

      Utils.executeCostByteWebService('get_settings_manager_landing_page', serviceRequestData,
        serviceRequestType, responseHandlerWrapper, getRequestHeaders());
    }

    function settingsManagerGetLaborSettings(responseHandler) {
      var serviceRequestType = 'GET';
      var serviceRequestData = {};

      var responseHandlerWrapper = function(response) {
        responseHandler(response.data.laborsettings)
      }

      Utils.executeCostByteWebService('get_overall_labor_settings', serviceRequestData,
        serviceRequestType, responseHandlerWrapper, getRequestHeaders());
    }

    function settingsManagerSetLaborSettings(responseHandler, settingsData) {
      var serviceRequestType = 'POST';
      var serviceRequestData = {
        laborsettings: settingsData
      };

      var responseHandlerWrapper = function(response) {
        responseHandler(response.data)
      }

      Utils.executeCostBytePostWebService('set_overall_labor_settings', serviceRequestData,
        serviceRequestType, responseHandlerWrapper, getRequestHeaders());
    }


    function settingsManagerGetEmployees(responseHandler) {
      var serviceRequestType = 'GET';
      var serviceRequestData = {};

      var responseHandlerWrapper = function(response) {
        responseHandler(response.data)
      }

      Utils.executeCostByteWebService('get_employees_by_business', serviceRequestData,
        serviceRequestType, responseHandlerWrapper, getRequestHeaders());
    }

    function settingsManagerSetEmployees(responseHandler, updatedEmployees) {
      var serviceRequestType = 'POST';
      var serviceRequestData = {
        'employees': updatedEmployees
      };

      var responseHandlerWrapper = function(response) {
        responseHandler(response.data)
      }

      Utils.executeCostBytePostWebService('set_employees_by_business', serviceRequestData,
        serviceRequestType, responseHandlerWrapper, getRequestHeaders());
    }


    function settingsManagerGetEmployeePayHistory(responseHandler, userID, userJobRoleID) {
      var serviceRequestType = 'GET';
      var serviceRequestData = {
        'user_id': userID,
        'user_jobrole_id': userJobRoleID
      };

      var responseHandlerWrapper = function(response) {
        responseHandler(response.data)
      }

      Utils.executeCostByteWebService('get_pay_history_by_user', serviceRequestData,
        serviceRequestType, responseHandlerWrapper, getRequestHeaders());
    }

    function settingsManagerSetEmployeePayHistory(responseHandler, updatedPayHistory) {
      var serviceRequestType = 'POST';
      var serviceRequestData = updatedPayHistory;

      var responseHandlerWrapper = function(response) {
        responseHandler(response.data)
      }

      Utils.executeCostBytePostWebService('set_pay_history_by_user', serviceRequestData,
        serviceRequestType, responseHandlerWrapper, getRequestHeaders());
    }


    function settingsManagerGetUsers(responseHandler) {
      var serviceRequestType = 'GET';
      var serviceRequestData = {};

      var responseHandlerWrapper = function(response) {
        responseHandler(response.data)
      }

      Utils.executeCostByteWebService('get_users_by_business', serviceRequestData,
        serviceRequestType, responseHandlerWrapper, getRequestHeaders());
    }

    function settingsManagerSetUser(responseHandler, userData) {
      var serviceRequestType = 'POST';
      var serviceRequestData = userData;

      var responseHandlerWrapper = function(response) {
        responseHandler(response.data)
      }
      Utils.executeCostBytePostWebService('set_user_data', serviceRequestData,
        serviceRequestType, responseHandlerWrapper, getRequestHeaders());

    }

    function settingsManagerAddUser(responseHandler) {
      var serviceRequestType = 'GET';
      var serviceRequestData = {};

      var responseHandlerWrapper = function(response) {
        responseHandler(response.data)
      }

      Utils.executeCostByteWebService('add_user_by_business', serviceRequestData,
        serviceRequestType, responseHandlerWrapper, getRequestHeaders());
    }

    function settingsManagerGetUserJobRoles(responseHandler, userID) {
      var serviceRequestType = 'GET';
      var serviceRequestData = {
        'user_id': userID
      };

      var responseHandlerWrapper = function(response) {
        responseHandler(response.data)
      }

      Utils.executeCostByteWebService('get_userjobroles_by_user', serviceRequestData,
        serviceRequestType, responseHandlerWrapper, getRequestHeaders());
    }


    function settingsManagerAddUserJobRoles(responseHandler, userID) {
      var serviceRequestType = 'GET';
      var serviceRequestData = {
        'user_id': userID
      };

      var responseHandlerWrapper = function(response) {
        responseHandler(response.data)
      }

      Utils.executeCostByteWebService('add_userjobroles_by_user', serviceRequestData,
        serviceRequestType, responseHandlerWrapper, getRequestHeaders());
    }

    function settingsManagerGetDropDownOptions(responseHandler, userID, field_name) {
      var serviceRequestType = 'GET';
      var serviceRequestData = {
        'user_id': userID,
        'field_name': field_name
      };

      var responseHandlerWrapper = function(response) {
        responseHandler(JSON.parse(response.data.options))
      }
      Utils.executeCostByteWebService('get_field_options_by_fieldname', serviceRequestData,
        serviceRequestType, responseHandlerWrapper, getRequestHeaders());
    }

    function SettingsManagerGetSkeleton(responseHandler, skeletonKey) {
      var serviceRequestType = 'GET';
      var serviceRequestData = {
        'skeletonKey': skeletonKey
      };

      var responseHandlerWrapper = function(response) {
        responseHandler(JSON.parse(response.data.skeleton))
      }
      Utils.executeCostByteWebService('get_template_skeleton', serviceRequestData,
        serviceRequestType, responseHandlerWrapper, getRequestHeaders());
    }

    function fetchSuppliers(responseHandler) {
      var serviceRequestType = 'GET';

      var responseHandlerWrapper = function(response) {
        responseHandler(response.data)
      };

      sendRequestIfNotPresentInCache('get_suppliers_details', {},
        serviceRequestType, responseHandlerWrapper, getRequestHeaders());
    }

    function fetchMeasurements(responseHandler) {
      var serviceRequestType = 'GET';

      var responseHandlerWrapper = function(response) {
        responseHandler(response.data)
      };

      sendRequestIfNotPresentInCache('get_all_measurements', {},
        serviceRequestType, responseHandlerWrapper, getRequestHeaders());
    }

    function fetchInventoryCategories(responseHandler) {
      var serviceRequestType = 'GET';

      var responseHandlerWrapper = function(response) {
        responseHandler(response.data)
      };

      sendRequestIfNotPresentInCache('get_all_categories', {},
        serviceRequestType, responseHandlerWrapper, getRequestHeaders());
    }

    function fetchMinorCategories(responseHandler) {
      console.log('fetchMinorCategories-----------------------------------------------------');
      var serviceRequestType = 'GET';

      var responseHandlerWrapper = function(response) {
        // console.log(response);
        responseHandler(response.data)
      };
      deleteCacheEntriesWithServiceRequestPath('get_minor_categories');
      Utils.executeCostBytePostWebService('get_minor_categories', {},
        serviceRequestType, responseHandler, getRequestHeaders());

      // sendRequestIfNotPresentInCache('get_minor_categories', {},
      //   serviceRequestType, responseHandlerWrapper, getRequestHeaders());
    }

    function fetchPnlCategories(responseHandler) {
      var serviceRequestType = 'GET';

      var responseHandlerWrapper = function(response) {
        responseHandler(response.data)
      };

      sendRequestIfNotPresentInCache('get_p_l_categories', {},
        serviceRequestType, responseHandlerWrapper, getRequestHeaders());
    }



    function fetchSuppliersInvoices(responseHandler) {
      var serviceRequestType = 'GET';

      var responseHandlerWrapper = function(response) {
        responseHandler(response.data)
      };

      sendRequestIfNotPresentInCache('get_supplier_invoices', {},
        serviceRequestType, responseHandlerWrapper, getRequestHeaders());
    }

    function fetchForceSuppliersInvoices(responseHandler) {
      var serviceRequestType = 'GET';

      var responseHandlerWrapper = function(response) {
        responseHandler(response.data)
      };
      deleteCacheEntriesWithServiceRequestPath('get_supplier_invoices');
      sendRequestIfNotPresentInCache('get_supplier_invoices', {},
        serviceRequestType, responseHandlerWrapper, getRequestHeaders());
    }

    function createInvoice(requestPayload, responseHandler) {
      var payload = JSON.stringify(requestPayload)
      var serviceRequestType = 'POST';
      var serviceRequestData = payload;

      var responseHandlerWrapper = function(response) {
        responseHandler(response);
      };

      deleteCacheEntriesWithServiceRequestPath('get_supplier_invoices');
      Utils.executeCostBytePostWebService('add_supplier_invoice', serviceRequestData,
        serviceRequestType, responseHandlerWrapper, getRequestHeaders());
    }

    function fetchInvoiceTracking(responseHandler, selectedPeriod) {
      //console.log("fetchInvoiceTracking : ", offset);
      var serviceRequestType = 'GET';
      var serviceRequestData = {
        'date_range': selectedPeriod
      };
      var responseHandlerWrapper = function(response) {
        // console.log("fetchInvoiceTracking",response.data);
        responseHandler(response.data)
      };

      Utils.executeCostByteWebService('get_invoice_tracking', serviceRequestData,
        serviceRequestType, responseHandlerWrapper, getRequestHeaders());

      // sendRequestIfNotPresentInCache('get_invoice_tracking', serviceRequestData,
      //   serviceRequestType, responseHandlerWrapper, getRequestHeaders());
    }

    function fetchPurchaseSummary(responseHandler, selectedPeriod) {
      //console.log("fetchInvoiceTracking : ", offset);
      var serviceRequestType = 'GET';
      var serviceRequestData = {
        'date_range': selectedPeriod
      };
      var responseHandlerWrapper = function(response) {
        // console.log("fetchPurchaseSummary",response.data);
        responseHandler(response.data)
      };

      Utils.executeCostByteWebService('get_purchase_summary_data', serviceRequestData,
        serviceRequestType, responseHandlerWrapper, getRequestHeaders());

      // sendRequestIfNotPresentInCache('get_invoice_tracking', serviceRequestData,
      //   serviceRequestType, responseHandlerWrapper, getRequestHeaders());
    }

    function fetchInvoicePurchaseTrend(responseHandler) {
      var serviceRequestType = 'GET';

      var responseHandlerWrapper = function(response) {
        responseHandler(response.data)
      };

      sendRequestIfNotPresentInCache('get_purchase_trend', {},
        serviceRequestType, responseHandlerWrapper, getRequestHeaders());
    }


    function updateInvoiceDue(ResponseHandler, invoice_id, property) {
      var serviceRequestType = 'POST';
      var serviceRequestData = {
        'invoice_id': invoice_id,
        'status': property
      };
      deleteCacheEntriesWithServiceRequestPath('get_invoice_tracking');
      Utils.executeCostBytePostWebService('post_invoice_due_status', serviceRequestData,
        serviceRequestType, ResponseHandler, getRequestHeaders());
    }


    function updateInvoiceImage(ResponseHandler, invoice_id, property) {
      var serviceRequestType = 'POST';
      var serviceRequestData = {
        'image_id': invoice_id,
      };
      deleteCacheEntriesWithServiceRequestPath('get_supplier_invoices');
      Utils.executeCostBytePostWebService('post_invoice_image_status', serviceRequestData,
        serviceRequestType, ResponseHandler, getRequestHeaders());
    }


    function fetchInvoiceDetails(ResponseHandler, invoice_id, supplier_id) {
      var serviceRequestType = 'GET';
      var serviceRequestData = {
        'invoice_id': invoice_id,
        'supplier_id': supplier_id
      };
      Utils.executeCostByteWebService('get_invoice_details', serviceRequestData,
        serviceRequestType, ResponseHandler, getRequestHeaders());
    }

    function searchInvoiceDetails(ResponseHandler, invoice_id) {
      var serviceRequestType = 'GET';
      var serviceRequestData = {
        'invoice_id': invoice_id,
      };
      Utils.executeCostByteWebService('get_invoice_tracking', serviceRequestData,
        serviceRequestType, ResponseHandler, getRequestHeaders());
    }

    function postUserErrorReport(responseHandler, error_report) {
      var serviceRequestType = 'POST';
      var serviceRequestData = error_report;
      Utils.executeCostBytePostWebService('post_user_reported_error', serviceRequestData,
        serviceRequestType, responseHandler, getRequestHeaders());
    }

    function fetchCannedErrorMessages(responseHandler, messages_filter) {
      var serviceRequestType = 'GET';
      var serviceRequestData = messages_filter;

      deleteCacheEntriesWithServiceRequestPath('fetch_canned_error_messages');
      sendRequestIfNotPresentInCache('fetch_canned_error_messages', serviceRequestData,
        serviceRequestType, responseHandler, getRequestHeaders());
    }

    function fetchTaskMessages(responseHandler, messages_filter) {
      var serviceRequestType = 'GET';
      var serviceRequestData = messages_filter;

      deleteCacheEntriesWithServiceRequestPath('fetch_task_creation_messages');
      sendRequestIfNotPresentInCache('fetch_task_creation_messages', serviceRequestData,
        serviceRequestType, responseHandler, getRequestHeaders());
    }

    function fetchOldTaskMessagesRequest(resHandler, old_messages_filter) {
      var serviceRequestType = 'GET';
      var serviceRequestData = old_messages_filter;

      deleteCacheEntriesWithServiceRequestPath('task_list_api');
      sendRequestIfNotPresentInCache('task_list_api', serviceRequestData,
        serviceRequestType, resHandler, getRequestHeaders());
    }

    function setModifiedsupplierItemConfig(responseHandler, new_config) {
      var serviceRequestType = 'POST';
      var serviceRequestData = new_config;
      deleteCacheEntriesWithServiceRequestPath('get_supplier_item_current_config');
      Utils.executeCostBytePostWebService('set_modified_supplier_item_config', serviceRequestData,
        serviceRequestType, responseHandler, getRequestHeaders());
    }

    function updateMinorCategory(responseHandler, ingredients) {
      var serviceRequestType = 'POST';
      var serviceRequestData = {
        "minor_categorys": ingredients
      };
      Utils.executeCostBytePostWebService('update_minor_category', serviceRequestData,
        serviceRequestType, responseHandler, getRequestHeaders());
    }

    function getsupplierItemConfig(responseHandler, supplier_item_query) {
      var serviceRequestType = 'GET';
      var serviceRequestData = supplier_item_query;

      Utils.executeCostByteWebService('get_supplier_item_current_config', serviceRequestData,
        serviceRequestType, responseHandler, getRequestHeaders());

    }

    function getMeasurementData(responseHandler, supplierDetails) {
      var serviceRequestType = 'GET';
      var serviceRequestData = {
        supplierId: supplierDetails.supplierId,
        supplierItemId: supplierDetails.supplierItemId
      };
      // console.log("supplierDetails.supplierId",supplierDetails.supplierId);

      Utils.executeCostByteWebService('get_measurement_data', serviceRequestData,
        serviceRequestType, responseHandler, getRequestHeaders());

    }

    function getMeasurementDataQty(responseHandler, supplierDetails) {
      var serviceRequestType = 'GET';
      var serviceRequestData = {
        supplierId: supplierDetails.supplier_id,
        supplierItemId: supplierDetails.supplier_item_id
      };
      // console.log("supplierDetails.supplierId",supplierDetails.supplierId);

      Utils.executeCostByteWebService('get_measurement_data', serviceRequestData,
        serviceRequestType, responseHandler, getRequestHeaders());

    }

    function saveCustomSupplierItemField(responseHandler, new_field_value) {
      var serviceRequestType = 'POST';
      var serviceRequestData = new_field_value;

      Utils.executeCostBytePostWebService('save_custom_supplier_item_field', serviceRequestData,
        serviceRequestType, responseHandler, getRequestHeaders());
    }


    function inventorySaveModifiedIngredientPrice(responseHandler, new_config) {
      var serviceRequestType = 'POST';
      var serviceRequestData = new_config;

      Utils.executeCostBytePostWebService('change_price_supplier_item', serviceRequestData,
        serviceRequestType, responseHandler, getRequestHeaders());
    }


    function fetchIngrediantsList(dateRange,getSubscriptionCallback) {
      var responseHandlerWrapper = function(response) {
        getSubscriptionCallback(response.data);
      };

      var serviceRequestType = 'GET';
      var serviceRequestData = {'dateRange': dateRange};
      console.log(serviceRequestData);
      sendRequestIfNotPresentInCache('get_ingredients', serviceRequestData,
        serviceRequestType, responseHandlerWrapper, getRequestHeaders());
    }


    function fetchInvItems() {
      var q = $q.defer();
      var responseHandlerWrapper = function(response) {
        // getInvSupplierCallback(response.data);
        q.resolve(response.data);

      };

      var serviceRequestType = 'GET';
      var serviceRequestData = {};

      sendRequestIfNotPresentInCache('get_all_inv_items', serviceRequestData,
        serviceRequestType, responseHandlerWrapper, getRequestHeaders());
      return q.promise;

      // fetchDailyStatsForSelectedSummaryFirstDate('totalSales', false, timePeriod,latestDate, function(data1, data2){
      //     // console.log('totalSales::::: ');
      //     // console.log(data1, data2);
      //     var data = {
      //         dates : data1,
      //         values : data2
      //     }

      // });
    }

    function fetchInvItemsNew(responseHandler) {
      var serviceRequestType = 'GET';
      var serviceRequestData = {};

      var responseHandlerWrapper = function(response) {
        responseHandler(response);
      }

      Utils.executeCostByteWebService('get_all_inv_items', serviceRequestData,
        serviceRequestType, responseHandlerWrapper, getRequestHeaders());
    }

    function fetchSupplierItems() {
      var q = $q.defer();
      var responseHandlerWrapper = function(response) {
        // getSupplierItemCallback(response.data);
        q.resolve(response);

      };

      var serviceRequestType = 'GET';
      var serviceRequestData = {};

      Utils.executeCostByteWebService('get_inv_sup_items', serviceRequestData,
        serviceRequestType, responseHandlerWrapper, getRequestHeaders());

      return q.promise;
    }

    function fetchPnLSupplierItems() {
      var q = $q.defer();
      var responseHandlerWrapper = function(response) {
        // getSupplierItemCallback(response.data);
        q.resolve(response.data);

      };

      var serviceRequestType = 'GET';
      var serviceRequestData = {};

      Utils.executeCostByteWebService('get_pandl_supplier_item', serviceRequestData,
        serviceRequestType, responseHandlerWrapper, getRequestHeaders());
      return q.promise;
    }

    function fetchInactiveItems(responseHandler) {
      var q = $q.defer();
      var responseHandlerWrapper = function(response) {
        responseHandler(response.data);
      }

      var serviceRequestType = 'GET';
      var serviceRequestData = {};

      Utils.executeCostByteWebService('get_inactive_inventory_items', serviceRequestData,
        serviceRequestType, responseHandlerWrapper, getRequestHeaders());
      return q.promise;
    }


    function fetchPnLSupplierItems() {
      var q = $q.defer();
      var responseHandlerWrapper = function(response) {
        // getSupplierItemCallback(response.data);
        q.resolve(response.data);

      };

      var serviceRequestType = 'GET';
      var serviceRequestData = {};

      Utils.executeCostByteWebService('get_pandl_supplier_item', serviceRequestData,
        serviceRequestType, responseHandlerWrapper, getRequestHeaders());
      return q.promise;
    }

    function fetchPnLSupplierItemsNew(responseHandler) {
      var serviceRequestType = 'GET';
      var serviceRequestData = {};

      var responseHandlerWrapper = function(response) {
        responseHandler(response.data);
      }

      Utils.executeCostByteWebService('get_pandl_supplier_item', serviceRequestData,
        serviceRequestType, responseHandlerWrapper, getRequestHeaders());
    }

    function fetchInvoiceConfigSuplierItems(responseHandler, date_range) {
      var serviceRequestType = 'GET';
      var serviceRequestData = {
        'date_range': date_range
      };

      var responseHandlerWrapper = function(response) {
        responseHandler(response.data);
        // console.log("fetchInvoiceConfigSuplierItems",response);
      }

      // sendRequestIfNotPresentInCache('get_purchase_tracking_details', serviceRequestData,
      //   serviceRequestType, responseHandlerWrapper, getRequestHeaders());
      Utils.executeCostByteWebService('get_purchase_tracking_details', serviceRequestData,
        serviceRequestType, responseHandlerWrapper, getRequestHeaders());
    }

    function fetchPnLInvItems(responseHandler) {
      var serviceRequestType = 'GET';
      var serviceRequestData = {};

      var responseHandlerWrapper = function(response) {
        responseHandler(response.data);
      }

      Utils.executeCostByteWebService('get_inv_manager_PandL_category', serviceRequestData,
        serviceRequestType, responseHandlerWrapper, getRequestHeaders());
    }

    function fetchAllBusinessList(responseHandler, datas) {
      var serviceRequestType = 'GET';
      // console.log(datas);
      var serviceRequestData = {
        'username': datas.username,
        'password': datas.password
      };

      var responseHandlerWrapper = function(response) {
        responseHandler(response.data);
      }

      sendRequestIfNotPresentInCache('get_businesses_support_tool', serviceRequestData,
        serviceRequestType, responseHandlerWrapper, getRequestHeaders());
    }

    function fetchAllSupplier(responseHandler, datas) {
      var serviceRequestType = 'GET';
      // console.log(datas);
      var serviceRequestData = {
        'username': datas.username,
        'password': datas.password
      };

      var responseHandlerWrapper = function(response) {
        responseHandler(response.data);
      }

      sendRequestIfNotPresentInCache('get_suppliers_details', serviceRequestData,
        serviceRequestType, responseHandlerWrapper, getRequestHeaders());
    }

    function fetchAllMeasurements(responseHandler, datas) {
      var serviceRequestType = 'GET';
      // console.log(datas);
      var serviceRequestData = {
        'username': datas.username,
        'password': datas.password
      };

      var responseHandlerWrapper = function(response) {
        responseHandler(response.data);
      }

      sendRequestIfNotPresentInCache('get_all_measurements', serviceRequestData,
        serviceRequestType, responseHandlerWrapper, getRequestHeaders());
    }

    function exportWeeklyPriceChangeData(responseHandler, datas) {
      var serviceRequestType = 'GET';
      // console.log(datas);
      // var serviceRequestData = {
      //   'dateRange': datas.username,
      //   'email': datas.password
      // };
      //
      var responseHandlerWrapper = function(response) {
        responseHandler(response.data);
      }

      sendRequestIfNotPresentInCache('export_weekly_price_change_report', datas,
        serviceRequestType, responseHandlerWrapper, getRequestHeaders());
    }

    function exportDRAFT(responseHandler, datas) {
      var serviceRequestType = 'POST';
      // console.log(datas);
      // var serviceRequestData = {
      //   'dateRange': datas.username,
      //   'email': datas.password
      // };
      //
      var responseHandlerWrapper = function(response) {
        responseHandler(response.data);
      }

      sendRequestIfNotPresentInCache('post_invoice_data', datas,
        serviceRequestType, responseHandlerWrapper, getRequestHeaders());
    }

    function fetchAllPriceTrackData(responseHandler, datas) {
      var serviceRequestType = 'GET';
      // var serviceRequestData = {
      //   'username': datas.username,
      //   'password': datas.password
      // };
      //
      var responseHandlerWrapper = function(response) {
        responseHandler(response.data);
      }

      sendRequestIfNotPresentInCache('get_dateRange_price_differences', datas,
        serviceRequestType, responseHandlerWrapper, getRequestHeaders());
    }



    function fetchIngredientsData(ingId, timePeriod, latestDate, getIngCallback) {

      var responseHandlerWrapper = function(response) {
        // console.log(response);
        getIngCallback(response.data);
      };
      var startDate = healthTrackerStartDate(false, timePeriod);
      // var endDate = healthTrackerEndDate(false, timePeriod);
      var endDate = latestDate;

      // console.log('startDate: ',startDate);
      // console.log('endDate: ',endDate);
      var serviceRequestType = 'GET';
      var serviceRequestData = {
        'ingredient_id': ingId,
        'start_date': startDate,
        'end_date': endDate
      };

      Utils.executeCostByteWebService('get_ingredient_prices', serviceRequestData,
        serviceRequestType, responseHandlerWrapper, getRequestHeaders());
    }

    // function fetchIngredientsData(hTIngredeintsDataResponseHandler,ingId, timePeriod) {
    //     fetchDailyStatsForSelectedDate(ingId, true, timePeriod,hTIngredeintsDataResponseHandler);
    // }

    // function fetchIngredientsData(ingId,timePeriod,getIngCallback) {
    //
    //     var responseHandlerWrapper = function(response) {
    //         // console.log(response);
    //         getIngCallback(response.data);
    //     };
    //     var startDate = healthTrackerStartDate(false, timePeriod);
    //     var endDate = healthTrackerEndDate(false, timePeriod);
    //     // console.log('startDate: ',startDate);
    //     // console.log('endDate: ',endDate);
    //    var serviceRequestType = 'GET';
    //     var serviceRequestData = {
    //         'ingredient_id' : ingId,
    //         'start_date': startDate,
    //         'endDate': endDate
    //     };
    //
    //    Utils.executeCostByteWebService('get_ingredient_prices', serviceRequestData,
    //         serviceRequestType, responseHandlerWrapper, getRequestHeaders());
    // }

    // function fetchIngredientsData(hTIngredeintsDataResponseHandler,ingId, timePeriod) {
    //     fetchDailyStatsForSelectedDate(ingId, true, timePeriod,hTIngredeintsDataResponseHandler);
    // }

    function getsupplierItemConfigEdit(supId, responseHandler) {
      // console.log('getsupplierItemConfigEdit');
      var serviceData = {
        'menu_item_id': supId
      }
      var serviceRequestType = 'GET';

      var responseHandlerWrapper = function(response) {
        // console.log(response);
        responseHandler(response.data);
      };

      sendRequestIfNotPresentInCache('get_margin_optimizer_menu_item_config', serviceData,
        serviceRequestType, responseHandlerWrapper, getRequestHeaders());
    }

    function setModifiedMenuItemConfig(new_config, responseHandler) {
      var serviceRequestType = 'POST';
      var serviceRequestData = new_config;

      Utils.executeCostBytePostWebService('set_margin_optimizer_menu_item_config', serviceRequestData,
        serviceRequestType, responseHandler, getRequestHeaders());
    }

    function getsupplierItemConfigEdit(supId, responseHandler) {
      // console.log('getsupplierItemConfigEdit');
      var serviceData = {
        'menu_item_id': supId
      }
      var serviceRequestType = 'GET';

      var responseHandlerWrapper = function(response) {
        // console.log(response);
        responseHandler(response.data);
      };

      sendRequestIfNotPresentInCache('get_margin_optimizer_menu_item_config', serviceData,
        serviceRequestType, responseHandlerWrapper, getRequestHeaders());
    }

    function setModifiedMenuItemConfig(new_config, responseHandler) {
      var serviceRequestType = 'POST';
      var serviceRequestData = new_config;

      Utils.executeCostBytePostWebService('set_margin_optimizer_menu_item_config', serviceRequestData,
        serviceRequestType, responseHandler, getRequestHeaders());
    }

    function getsupplierItemConfigEdit(supId, responseHandler) {
      // console.log('getsupplierItemConfigEdit');
      var serviceData = {
        'menu_item_id': supId
      }
      var serviceRequestType = 'GET';

      var responseHandlerWrapper = function(response) {
        // console.log(response);
        responseHandler(response.data);
      };

      sendRequestIfNotPresentInCache('get_margin_optimizer_menu_item_config', serviceData,
        serviceRequestType, responseHandlerWrapper, getRequestHeaders());
    }

    function setModifiedMenuItemConfig(new_config, responseHandler) {
      var serviceRequestType = 'POST';
      var serviceRequestData = new_config;

      Utils.executeCostBytePostWebService('set_margin_optimizer_menu_item_config', serviceRequestData,
        serviceRequestType, responseHandler, getRequestHeaders());
    }

    function appMenuGetSideMenu(responseHandler) {
      var serviceRequestType = 'GET';

      var responseHandlerWrapper = function(response) {
        responseHandler(response.data.sideMenuGroups)
      };

      sendRequestIfNotPresentInCache('get_app_side_menu_groups', {},
        serviceRequestType, responseHandlerWrapper, getRequestHeaders());
    }

    function getUserDefaullEmailId(responseHandler) {
      var serviceRequestType = 'GET';
      var serviceRequestData = {};
      var responseHandlerWrapper = function(response) {
        responseHandler(response)
      };
      sendRequestIfNotPresentInCache('get_user_emailid', {},
        serviceRequestType, responseHandlerWrapper, getRequestHeaders());

      // Utils.executeCostByteWebService('get_user_emailid', serviceRequestData,
      //   serviceRequestType, responseHandler, getRequestHeaders());

    }

    function pAndLChartsGetChartData(responseHandler, chartDataRequest) {
      let serviceRequestType = 'GET';

      let responseHandlerWrapper = function(response) {
        responseHandler(response.data)
      };

      sendRequestIfNotPresentInCache('get_pandl_chart_data', chartDataRequest,
        serviceRequestType, responseHandlerWrapper, getRequestHeaders());
    }

    function pAndLChartsGetChartDefinitions(responseHandler, pAndLType) {
      let serviceRequestType = 'GET';

      let responseHandlerWrapper = function(response) {
        responseHandler(response.data.chartDefinitions)
      };

      sendRequestIfNotPresentInCache('get_pandl_chart_definitions', {
          statCategoryName: pAndLType
        },
        serviceRequestType, responseHandlerWrapper, getRequestHeaders());
    }


    function pAndLChartsGetDateRangeOptions(responseHandler, pAndLType) {
      let serviceRequestType = 'GET';

      let responseHandlerWrapper = function(response) {
        responseHandler(response.data.dateRangeOptions)
      };

      sendRequestIfNotPresentInCache('get_pandl_date_range_options', {
          statCategoryName: pAndLType
        },
        serviceRequestType, responseHandlerWrapper, getRequestHeaders());
    }

    function updateSuppInvItm(updSuppInvItm, resultData) {
      var serviceRequestType = 'POST';
      var serviceRequestData = resultData;

      var responseHandler = function(response) {
        // console.log(response);
        updSuppInvItm(response.data);
      }
      Utils.executeCostBytePostWebService('post_measurement_unit_data', serviceRequestData,
        serviceRequestType, responseHandler, getRequestHeaders());

    }

    function postInvMapping(invDataResponseHandler, resultData) {
      var serviceRequestType = 'POST';
      var serviceRequestData = {
        "ingredients": resultData
      };

      var responseHandler = function(response) {
        // console.log(response);
        invDataResponseHandler(response.data, response.status);
      }

      deleteCacheEntriesWithServiceRequestPath('get_all_inv_items');
      deleteCacheEntriesWithServiceRequestPath('get_inv_sup_items');
      deleteCacheEntriesWithServiceRequestPath('get_ingredients_for_inventory')
      deleteCacheEntriesWithServiceRequestPath('get_ingredients_for_ordering')
      Utils.executeCostBytePostWebService('post_inv_mapping_data', serviceRequestData,
        serviceRequestType, responseHandler, getRequestHeaders());
    }

    function fetchInvClientItems(invDataResponseHandler) {
      var serviceRequestType = 'GET';
      var serviceRequestData = {};

      var responseHandler = function(response) {
        // console.log(response);
        invDataResponseHandler(response.data, response.status);
      }

      deleteCacheEntriesWithServiceRequestPath('get_client_inventory_data');
      Utils.executeCostBytePostWebService('get_client_inventory_data', serviceRequestData,
        serviceRequestType, responseHandler, getRequestHeaders());
    }

    function saveInvToolChanges(ResponseHandler, serviceRequestData) {
      var serviceRequestType = 'POST';
      var serviceRequestData = serviceRequestData;
      var responseHandler = function(response) {
        // console.log(response);
        ResponseHandler(response);
      }
      deleteCacheEntriesWithServiceRequestPath('get_client_inventory_data');
      Utils.executeCostBytePostWebService('post_client_inventory_data', serviceRequestData,
        serviceRequestType, ResponseHandler, getRequestHeaders());
    }

    function reOrderItems(ResponseHandler, serviceRequestData) {
      var serviceRequestType = 'POST';
      var serviceRequestData = serviceRequestData;
      var responseHandler = function(response) {
        // console.log(response);
        ResponseHandler(response);
      }
      deleteCacheEntriesWithServiceRequestPath('get_client_inventory_data');
      Utils.executeCostBytePostWebService('update_inventory_category_rank', serviceRequestData,
        serviceRequestType, ResponseHandler, getRequestHeaders());
    }

    function savePrepChanges(ResponseHandler, serviceRequestData) {
      var serviceRequestType = 'POST';
      var serviceRequestData = serviceRequestData;
      var responseHandler = function(response) {
        ResponseHandler(response);
      }
      deleteCacheEntriesWithServiceRequestPath('get_menu_recipe_ingredients');
      Utils.executeCostBytePostWebService('update_ingredient', serviceRequestData,
        serviceRequestType, ResponseHandler, getRequestHeaders());
    }

    function getTotalCost(ResponseHandler, serviceRequestData) {
      var serviceRequestType = 'POST';
      var serviceRequestData = serviceRequestData;
      var responseHandler = function(response) {
        ResponseHandler(response);
      }
      deleteCacheEntriesWithServiceRequestPath('get_menu_recipe_ingredients');
      Utils.executeCostBytePostWebService('get_updated_recipe_cost', serviceRequestData,
        serviceRequestType, ResponseHandler, getRequestHeaders());
    }

    function updateIngredientYieldUnit(ResponseHandler, serviceRequestData) {
      var serviceRequestType = 'POST';
      var serviceRequestData = serviceRequestData;
      var responseHandler = function(response) {
        ResponseHandler(response);
      }
      deleteCacheEntriesWithServiceRequestPath('get_menu_recipe_ingredients');
      deleteCacheEntriesWithServiceRequestPath('get_prep_recipe_cost');
      Utils.executeCostBytePostWebService('update_ingredient_yield_unit', serviceRequestData,
        serviceRequestType, ResponseHandler, getRequestHeaders());
    }

    function deletePrepItem(ResponseHandler, serviceRequestData) {
      var serviceRequestType = 'POST';
      var serviceRequestData = serviceRequestData;
      var responseHandler = function(response) {
        ResponseHandler(response);
      }
      deleteCacheEntriesWithServiceRequestPath('get_menu_recipe_ingredients');
      Utils.executeCostBytePostWebService('delete_ingredients', serviceRequestData,
        serviceRequestType, ResponseHandler, getRequestHeaders());
    }

    function reOrderCategory(ResponseHandler, serviceRequestData) {
      var serviceRequestType = 'POST';
      var serviceRequestData = serviceRequestData;
      var responseHandler = function(response) {
        // console.log(response);
        ResponseHandler(response);
      }
      deleteCacheEntriesWithServiceRequestPath('get_client_inventory_data');
      Utils.executeCostBytePostWebService('update_category_rank', serviceRequestData,
        serviceRequestType, ResponseHandler, getRequestHeaders());
    }

    function postMeasurementData(invDataResponseHandler, resultData) {
      var serviceRequestType = 'POST';
      // var serviceRequestData = {
      //     ingredients: resultData
      // };

      var responseHandler = function(response) {
        // console.log(response);
        invDataResponseHandler(response.data, response.status);
      }

      deleteCacheEntriesWithServiceRequestPath('get_all_inv_items');
      deleteCacheEntriesWithServiceRequestPath('get_inv_sup_items');

      Utils.executeCostBytePostWebService('post_measurement_unit_data', resultData,
        serviceRequestType, responseHandler, getRequestHeaders());
    }


    function getsupplier(responsesupplier) {
      var serviceRequestType = 'GET';
      var serviceRequestData = {};
      var responseHandler = function(response) {
        // console.log("getsupplier response : ", response);
        responsesupplier(response.data);
      }

      Utils.executeCostBytePostWebService('get_inv_sup_items', serviceRequestData,
        serviceRequestType, responseHandler, getRequestHeaders());
    }

    function getCalculatePriceOfINv(responsesupplier,draft_id) {
      var serviceRequestType = 'GET';
      var serviceRequestData = draft_id
      var responseHandler = function(response) {
        // console.log("getsupplier response : ", response);
        responsesupplier(response.data);
      }

      Utils.executeCostByteWebService('get_draft_category_summary', serviceRequestData,
        serviceRequestType, responseHandler, getRequestHeaders());
    }

    function postInactiveActive(inactiveResponseHandler, resultData) {
      var serviceRequestType = 'POST';
      var serviceRequestData = {
        itemIds: resultData
      };

      var responseHandler = function(response) {
        // console.log(response);
        inactiveResponseHandler(response.data);
      }

      // deleteCacheEntriesWithServiceRequestPath('get_all_inv_items');
      // deleteCacheEntriesWithServiceRequestPath('get_inv_sup_items');
      deleteCacheEntriesWithServiceRequestPath('get_ingredients_for_inventory');
      Utils.executeCostBytePostWebService('post_inactive_active', serviceRequestData,
        serviceRequestType, responseHandler, getRequestHeaders());
    }

    function postPnLMapping(pNlDataResponseHandler, resultData) {
      var serviceRequestType = 'POST';
      // var serviceRequestData = {
      //     pnlItems: resultData
      // };

      var responseHandler = function(response) {
        // console.log(response);
        pNlDataResponseHandler(response.data);
      }

      Utils.executeCostBytePostWebService('post_PnL_mapping_data', resultData,
        serviceRequestType, responseHandler, getRequestHeaders());
    }

    function postInvPnLMapping(pNlDataResponseHandler, resultData) {
      var serviceRequestType = 'POST';
      // var serviceRequestData = {
      //     pnlItems: resultData
      // };

      var responseHandler = function(response) {
        // console.log(response);
        pNlDataResponseHandler(response.data);
      }
      deleteCacheEntriesWithServiceRequestPath('get_add_ingredients');
      deleteCacheEntriesWithServiceRequestPath('get_inv_manager_PandL_category');
      Utils.executeCostBytePostWebService('update_business_supplier_item_config_PandL_category', resultData,
        serviceRequestType, responseHandler, getRequestHeaders());
    }


    function changeUserPwd(responseHandler, oldPwd, newPwd) {
      var serviceRequestType = 'POST';
      var serviceRequestData = {
        oldPwd: oldPwd,
        password: newPwd
      };
      // console.log(serviceRequestData)
      var responseHandlerWrapper = function(response) {
        responseHandler(response.data)
      }

      Utils.executeCostBytePostWebService('user_change_pwd', serviceRequestData,
        serviceRequestType, responseHandlerWrapper, getRequestHeaders());
    }


    function fetchInventoryItemsWeb(responseHandler) {
      var serviceRequestType = 'GET';

      var responseHandlerWrapper = function(response) {
        responseHandler(response.data)
      };

      sendRequestIfNotPresentInCache('get_inventory_list_items_web', {},
        serviceRequestType, responseHandlerWrapper, getRequestHeaders());
    }

    function fetchInventoryItemInfoWeb(responseHandler) {
      var serviceRequestType = 'GET';

      var responseHandlerWrapper = function(response) {
        responseHandler(response.data)
      };

      sendRequestIfNotPresentInCache('get_inventory_item_info_web', {},
        serviceRequestType, responseHandlerWrapper, getRequestHeaders());
    }

    function addInvItemInfo(ResponseHandler, invData) {
      var serviceRequestType = 'POST';

      deleteCacheEntriesWithServiceRequestPath('get_ingredients_for_inventory')
      Utils.executeCostBytePostWebService('post_ingredient_data', invData,
        serviceRequestType, ResponseHandler, getRequestHeaders());
    }

    function updateInventoryListItemWeb(ResponseHandler, invData) {
      var serviceRequestType = 'POST';
      var serviceRequestData = {
        'updateInventoryItem': invData
      };

      Utils.executeCostBytePostWebService('update_inventory_list_item_web', serviceRequestData,
        serviceRequestType, ResponseHandler, getRequestHeaders());
    }

    function fetchSupplierItemWeb(ResponseHandler, invData) {
      var serviceRequestType = 'POST';
      var serviceRequestData = {
        'inv_data': invData
      };
      var responseHandlerWrapper = function(response) {
        responseHandler(response.data)
      };
      Utils.executeCostBytePostWebService('get_supplier_items_for_inv_item_web', serviceRequestData,
        serviceRequestType, ResponseHandler, getRequestHeaders());
    }

    function deleteSupplierItemWeb(ResponseHandler, invData) {
      var serviceRequestType = 'POST';
      var serviceRequestData = invData;
      var responseHandlerWrapper = function(response) {
        responseHandler(response.data)
      };
      Utils.executeCostBytePostWebService('delete_supplier_item_from_inventory_item', serviceRequestData,
        serviceRequestType, ResponseHandler, getRequestHeaders());
    }

    function postMeasurementConvData(responseHandler, suppUnitData) {
      var serviceRequestType = 'POST';
      var serviceRequestData = suppUnitData;
      deleteCacheEntriesWithServiceRequestPath('get_supplier_item_current_config');
      Utils.executeCostBytePostWebService('post_measurement_conv_data', serviceRequestData,
        serviceRequestType, responseHandler, getRequestHeaders());
    }

    function getItemSummary(responseHandler, invData) {
      // console.log("invData",invData);
      var serviceRequestType = 'GET';
      var serviceRequestData = {
        inventory_item_id: invData.invItemId,
        draft_id: invData.draftId,
        category: invData.category,
        is_draft: invData.is_draft

      };
      // console.log("inventory_item_id");
      // console.log(serviceRequestData);

      Utils.executeCostByteWebService('get_item_summary', serviceRequestData,
        serviceRequestType, responseHandler, getRequestHeaders());
    }

    function getModIngredients(responseHandler) {
      var serviceRequestType = 'GET';
      var serviceRequestData = {};
      var responseHandlerWrapper = function(response) {
        // console.log(response)
        if (angular.isDefined(response.data)) {
          //  console.log(response.data);
          responseHandler(response.data)
        }
      }

      sendRequestIfNotPresentInCache('get_mod_cost', serviceRequestData,
        serviceRequestType, responseHandlerWrapper, getRequestHeaders());
    }

    function getPrepIngredients(responseHandler, reqval) {
      var serviceRequestType = 'GET';
      var serviceRequestData = {};
      var responseHandlerWrapper = function(response) {
        // console.log(response)
        if (angular.isDefined(response.data)) {
          //  console.log(response.data);
          responseHandler(response.data)
        }
      }

      sendRequestIfNotPresentInCache('get_prep_recipe_cost', serviceRequestData,
        serviceRequestType, responseHandlerWrapper, getRequestHeaders());

      // Utils.executeCostByteWebService('get_prep_recipe_cost', serviceRequestData,
      //   serviceRequestType, responseHandlerWrapper, getRequestHeaders());
    }

    function fetchModItemIngredients(responseHandler, request_definition) {
      var serviceRequestType = 'GET';
      var serviceRequestData = request_definition;

      var responseHandlerWrapper = function(response) {
        if (!response.data.hasOwnProperty('items')) {
          response.data.items = [];
        }
        responseHandler(response.data.items)
      }
      Utils.executeCostByteWebService('get_menu_recipe_ingredients', serviceRequestData,
        serviceRequestType, responseHandlerWrapper, getRequestHeaders());
      // sendRequestIfNotPresentInCache('get_menu_recipe_ingredients', serviceRequestData,
      //   serviceRequestType, responseHandlerWrapper, getRequestHeaders());
    }

    function getRegenerateSummaryChanges(responseHandler, dateRange) {
      var serviceRequestType = 'GET';
      var serviceRequestData = {
        'date_range': dateRange
      };
      var responseHandlerWrapper = function(response) {
        // console.log(response)
        if (angular.isDefined(response.data)) {
          //  console.log(response.data);
          responseHandler(response.data)
        }
      }
      deleteCacheEntriesWithServiceRequestPath('get_purchase_summary_data');
      Utils.executeCostByteWebService('refresh_purchase_summary', serviceRequestData,
        serviceRequestType, responseHandlerWrapper, getRequestHeaders());
    }

    function refreshScreenApi(responseHandler, recipeId, groupId) {
      var serviceRequestType = 'GET';
      var serviceRequestData = {
        "recipeId": recipeId,
        "ingredientGroupId": groupId
      }
      var responseHandlerWrapper = function(response) {
        if (!response.data.hasOwnProperty('items')) {
          response.data.items = [];
        }
        responseHandler(response.data.items)
      }
      Utils.executeCostByteWebService('refresh_recipe', serviceRequestData,
        serviceRequestType, responseHandlerWrapper, getRequestHeaders());
      // sendRequestIfNotPresentInCache('get_menu_recipe_ingredients', serviceRequestData,
      //   serviceRequestType, responseHandlerWrapper, getRequestHeaders());
    }


    return commonFactory;
  }
})();
