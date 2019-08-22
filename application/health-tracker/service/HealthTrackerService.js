(function() {
  'use strict';

  projectCostByte.factory('HealthTrackerService', healthTrackerService);

  healthTrackerService.$inject = ['$q', 'CommonService'];

  function healthTrackerService($q, CommonService) {

    var healthTrackerFactory = {
      fetchHealthTrackerSalesDataActual: fetchHealthTrackerSalesDataActual,
      fetchHealthTrackerSalesDataBenchMark: fetchHealthTrackerSalesDataBenchMark,
      fetchHealthTrackerFoodSalesDataActual: fetchHealthTrackerFoodSalesDataActual,
      fetchHealthTrackerFoodSalesDataBenchMark: fetchHealthTrackerFoodSalesDataBenchMark,
      fetchHealthTrackerProfitDataActual: fetchHealthTrackerProfitDataActual,
      fetchHealthTrackerProfitDataBenchMark: fetchHealthTrackerProfitDataBenchMark,
      fetchHealthTrackerFoodCostDataActual: fetchHealthTrackerFoodCostDataActual,
      fetchHealthTrackerFoodCostDataBenchMark: fetchHealthTrackerFoodCostDataBenchMark,

      fetchHealthTrackerBeerSales: fetchHealthTrackerBeerSales,
      fetchHealthTrackerWineSales: fetchHealthTrackerWineSales,
      fetchHealthTrackerSpiritSales: fetchHealthTrackerSpiritSales,
      fetchHealthTrackerBeverageSales: fetchHealthTrackerBeverageSales,

      fetchHealthTrackerLiquorCostDataActual: fetchHealthTrackerLiquorCostDataActual,
      fetchHealthTrackerLiquorCostDataBenchMark: fetchHealthTrackerLiquorCostDataBenchMark,
      fetchHealthTrackerLabourCostDataActual: fetchHealthTrackerLabourCostDataActual,
      fetchHealthTrackerLabourCostDataBenchMark: fetchHealthTrackerLabourCostDataBenchMark,

      fetchHealthTrackerLabourCostSummaryDataActual: fetchHealthTrackerLabourCostSummaryDataActual,
      fetchHealthTrackerLabourCostSummaryDataBenchMark: fetchHealthTrackerLabourCostSummaryDataBenchMark,


      getChartData: getChartData,
      setChartData: setChartData,
      fetchHealthTrackerSalesSummaryDataBenchMark: fetchHealthTrackerSalesSummaryDataBenchMark,
      fetchHealthTrackerSalesSummaryDataActual: fetchHealthTrackerSalesSummaryDataActual,
      fetchHealthTrackerPrimeProfitDataBenchMark: fetchHealthTrackerPrimeProfitDataBenchMark,
      fetchHealthTrackerPrimeProfitDataActual: fetchHealthTrackerPrimeProfitDataActual,

      fetchHealthTrackerFoodSalesSummaryDataActual: fetchHealthTrackerFoodSalesSummaryDataActual,
      fetchHealthTrackerFoodSalesSummaryDataBenchMark: fetchHealthTrackerFoodSalesSummaryDataBenchMark,
      fetchHealthTrackerFoodCostSummaryDataActual: fetchHealthTrackerFoodCostSummaryDataActual,
      fetchHealthTrackerFoodCostSummaryDataBenchMark: fetchHealthTrackerFoodCostSummaryDataBenchMark,
      fetchHealthTrackerBeerSummarySalesActual: fetchHealthTrackerBeerSummarySalesActual,
      fetchHealthTrackerBeerSummarySalesBenchmark: fetchHealthTrackerBeerSummarySalesBenchmark,


      fetchHealthTrackerWineSummarySalesActual: fetchHealthTrackerWineSummarySalesActual,
      fetchHealthTrackerWineSummarySalesBenchmark: fetchHealthTrackerWineSummarySalesBenchmark,
      fetchHealthTrackerSpiritSummarySalesActual: fetchHealthTrackerSpiritSummarySalesActual,
      fetchHealthTrackerSpiritSummarySalesBenchmark: fetchHealthTrackerSpiritSummarySalesBenchmark,
      fetchHealthTrackerBeverageSummarySalesActual: fetchHealthTrackerBeverageSummarySalesActual,
      fetchHealthTrackerBeverageSummarySalesBenchmark: fetchHealthTrackerBeverageSummarySalesBenchmark,
      // Overview
      fetchOverviewData: fetchOverviewData,
      fetchSummaryHistoryData: fetchSummaryHistoryData,
      fetchOrgDashboardSummaryData: fetchOrgDashboardSummaryData,

    };

    var chartData = {};

    function getChartData() {
      return chartData;
    }

    function setChartData(value) {
      chartData = value;
    }

    function fetchDailyStatsForSelectedDate(fieldName, isBenchmark, timePeriod, responseHandler) {
      // console.log('fieldName: ',fieldName);
      // console.log('isBenchmark: ',isBenchmark);
      // console.log('timePeriod: ',timePeriod);
      // console.log('responseHandler: ',responseHandler);

      var startDate = CommonService.healthTrackerStartDate(isBenchmark, timePeriod);
      var endDate = CommonService.healthTrackerEndDate(isBenchmark, timePeriod);

      // console.log("timePeriod---: ",timePeriod);
      // console.log("startDate: ",startDate);
      // console.log("endDate: ",endDate);
      var responseHandlers = function(data1, data2) {
        responseHandler(data1, data2);
      }
      //console.log(startDate);
      //console.log(endDate);
      //CommonService.fetchDailyStatsForField(responseHandler, fieldName, startDate, endDate);
      CommonService.fetchDailyStatsForAttr(responseHandlers, fieldName, startDate, endDate, timePeriod);
    }

    function fetchDailyStatsForSelectedSummaryFirstDate(fieldName, isBenchmark, timePeriod, latestDate, responseHandler) {
      // console.log('fieldName1 : ',fieldName);
      // console.log('isBenchmark1 : ',isBenchmark);
      // console.log('timePeriod1 : ',timePeriod);
      // console.log('responseHandler1 : ',responseHandler);

      // var startDate = CommonService.summaryStartDate(isBenchmark, timePeriod);
      // var endDate = CommonService.summaryEndDate(isBenchmark, timePeriod);

      var endDate = latestDate;
      // console.log('first endDate**: ',endDate);

      var responseHandlers = function(data1, data2) {
        responseHandler(data1, data2);
      }

      CommonService.fetchDailyStatsSummaryForFirstAttr(responseHandlers, fieldName, endDate, timePeriod);
    }

    function fetchDailyStatsForSelectedSummarySecondDate(fieldName, isBenchmark, timePeriod, latestDate, responseHandler) {
      // console.log('fieldName2 : ',fieldName);
      // console.log('isBenchmark2 : ',isBenchmark);
      // console.log('timePeriod2 : ',timePeriod);
      // console.log('responseHandler2 : ',responseHandler);

      // var startDate = CommonService.summaryStartDate(isBenchmark, timePeriod);
      // var endDate = CommonService.summaryEndDate(isBenchmark, timePeriod);
      if (timePeriod == 'DAILY') {
        var endDate = moment(latestDate).subtract(1, 'days').format('MM/DD/YYYY')
      } else if (timePeriod == 'WEEKLY') {
        var endDate = moment(latestDate).subtract(6, 'days').format('MM/DD/YYYY')
      } else if (timePeriod.includes('PERIOD')) {
        var endDate = latestDate;
      }

      // console.log("timePeriod---: ",timePeriod);
      // console.log("startDate: ",startDate);
      // console.log("second endDate**: ",endDate);
      var responseHandlers = function(data1, data2) {
        responseHandler(data1, data2);
      }
      //console.log(startDate);
      //console.log(endDate);
      //CommonService.fetchDailyStatsForField(responseHandler, fieldName, startDate, endDate);
      CommonService.fetchDailyStatsSummaryForSecondAttr(responseHandlers, fieldName, endDate, timePeriod);
    }

    // function fetchHealthTrackerSalesDataActual(hTActualSalesDataResponseHandler, timePeriod) {
    //   fetchDailyStatsForSelectedDate(hTActualSalesDataResponseHandler, 'totalSales', false, timePeriod);
    // }
    function fetchHealthTrackerSalesDataActual(timePeriod) {
      // console.log(timePeriod);
      var q = $q.defer();
      fetchDailyStatsForSelectedDate('totalSales', false, timePeriod, function(data1, data2) {
        // console.log('totalSales::::: ');
        // console.log(data1, data2);
        var data = {
          dates: data1,
          values: data2
        }
        q.resolve(data);
      });
      return q.promise;
    }

    function fetchHealthTrackerSalesDataBenchMark(hTBenchMarkSalesDataResponseHandler, timePeriod) {
      fetchDailyStatsForSelectedDate('totalSales', true, timePeriod, hTBenchMarkSalesDataResponseHandler);
    }

    function fetchHealthTrackerSalesSummaryDataActual(timePeriod, latestDate) {
      // console.log(timePeriod);
      var q = $q.defer();
      fetchDailyStatsForSelectedSummaryFirstDate('totalSales', false, timePeriod, latestDate, function(data1, data2) {
        // console.log('totalSales::::: ');
        // console.log(data1, data2);
        var data = {
          dates: data1,
          values: data2
        }
        // console.log(data);
        q.resolve(data);
      });
      return q.promise;
    }

    function fetchHealthTrackerPrimeProfitDataActual(timePeriod, latestDate) {
      // console.log(timePeriod);
      var q = $q.defer();
      fetchDailyStatsForSelectedSummaryFirstDate('afterPrimeProfit', false, timePeriod, latestDate, function(data1, data2) {
        // console.log('totalSales::::: ');
        // console.log(data1, data2);
        var data = {
          dates: data1,
          values: data2
        }
        q.resolve(data);
      });
      return q.promise;
    }

    function fetchHealthTrackerSalesSummaryDataBenchMark(timePeriod, latestDate) {
      // console.log(timePeriod);
      var q = $q.defer();
      fetchDailyStatsForSelectedSummarySecondDate('totalSales', true, timePeriod, latestDate, function(data1, data2) {
        // console.log('totalSales::::: ');
        // console.log(data1, data2);
        var data = {
          dates: data1,
          values: data2
        }
        q.resolve(data);
      });
      return q.promise;
    }

    function fetchHealthTrackerPrimeProfitDataBenchMark(timePeriod, latestDate) {
      // console.log(timePeriod);
      var q = $q.defer();
      fetchDailyStatsForSelectedSummarySecondDate('afterPrimeProfit', true, timePeriod, latestDate, function(data1, data2) {
        // console.log('totalSales::::: ');
        // console.log(data1, data2);
        var data = {
          dates: data1,
          values: data2
        }
        q.resolve(data);
      });
      return q.promise;
    }

    function fetchHealthTrackerFoodSalesSummaryDataActual(timePeriod, latestDate) {
      // console.log("totalFoodSales***************: ",timePeriod);
      var q = $q.defer();
      fetchDailyStatsForSelectedSummaryFirstDate('totalFoodSales', false, timePeriod, latestDate, function(data1, data2) {
        // console.log("totalFoodSales***************: ");
        // console.log(data1, data2);
        var data = {
          dates: data1,
          values: data2
        }
        q.resolve(data);
      });
      return q.promise;
    }

    function fetchHealthTrackerFoodSalesSummaryDataBenchMark(timePeriod, latestDate) {
      // console.log("totalFoodSales***************: ",timePeriod);
      var q = $q.defer();
      fetchDailyStatsForSelectedSummarySecondDate('totalFoodSales', false, timePeriod, latestDate, function(data1, data2) {
        // console.log("totalFoodSales***************: ");
        // console.log(data1, data2);
        var data = {
          dates: data1,
          values: data2
        }
        q.resolve(data);
      });
      return q.promise;
    }

    function fetchHealthTrackerBeerSummarySalesActual(timePeriod, latestDate) {
      // console.log(timePeriod);
      var q = $q.defer();
      fetchDailyStatsForSelectedSummaryFirstDate('totalBeerSales', false, timePeriod, latestDate, function(data1, data2) {
        // console.log(data1, data2);
        var data = {
          dates: data1,
          values: data2
        }
        q.resolve(data);
      });
      return q.promise;
    }

    function fetchHealthTrackerBeerSummarySalesBenchmark(timePeriod, latestDate) {
      // console.log(timePeriod);
      var q = $q.defer();
      fetchDailyStatsForSelectedSummarySecondDate('totalBeerSales', true, timePeriod, latestDate, function(data1, data2) {
        // console.log(data1, data2);
        var data = {
          dates: data1,
          values: data2
        }
        q.resolve(data);
      });
      return q.promise;
    }

    function fetchHealthTrackerWineSummarySalesActual(timePeriod, latestDate) {
      // console.log(timePeriod);
      var q = $q.defer();
      fetchDailyStatsForSelectedSummaryFirstDate('totalWineSales', false, timePeriod, latestDate, function(data1, data2) {
        // console.log(data1, data2);
        var data = {
          dates: data1,
          values: data2
        }
        q.resolve(data);
      });
      return q.promise;
    }

    function fetchHealthTrackerWineSummarySalesBenchmark(timePeriod, latestDate) {
      // console.log(timePeriod);
      var q = $q.defer();
      fetchDailyStatsForSelectedSummarySecondDate('totalWineSales', true, timePeriod, latestDate, function(data1, data2) {
        // console.log(data1, data2);
        var data = {
          dates: data1,
          values: data2
        }
        q.resolve(data);
      });
      return q.promise;
    }

    function fetchHealthTrackerSpiritSummarySalesActual(timePeriod, latestDate) {
      var q = $q.defer();
      fetchDailyStatsForSelectedSummaryFirstDate('totalSpiritSales', false, timePeriod, latestDate, function(data1, data2) {
        // console.log(data1, data2);
        var data = {
          dates: data1,
          values: data2
        }
        q.resolve(data);
      });
      return q.promise;
    }

    function fetchHealthTrackerSpiritSummarySalesBenchmark(timePeriod, latestDate) {
      // console.log(timePeriod);
      var q = $q.defer();
      fetchDailyStatsForSelectedSummarySecondDate('totalSpiritSales', false, timePeriod, latestDate, function(data1, data2) {
        // console.log(data1, data2);
        var data = {
          dates: data1,
          values: data2
        }
        q.resolve(data);
      });
      return q.promise;
    }

    function fetchHealthTrackerBeverageSummarySalesActual(timePeriod, latestDate) {
      // console.log(timePeriod);
      var q = $q.defer();
      fetchDailyStatsForSelectedSummaryFirstDate('totalBeverageSales', false, timePeriod, latestDate, function(data1, data2) {
        // console.log(data1, data2);
        var data = {
          dates: data1,
          values: data2
        }
        q.resolve(data);
      });
      return q.promise;
    }

    function fetchHealthTrackerBeverageSummarySalesBenchmark(timePeriod, latestDate) {
      // console.log(timePeriod);
      var q = $q.defer();
      fetchDailyStatsForSelectedSummarySecondDate('totalBeverageSales', false, timePeriod, latestDate, function(data1, data2) {
        // console.log(data1, data2);
        var data = {
          dates: data1,
          values: data2
        }
        q.resolve(data);
      });
      return q.promise;
    }

    function fetchHealthTrackerFoodCostSummaryDataActual(timePeriod, latestDate) {
      // console.log(timePeriod);
      var q = $q.defer();
      fetchDailyStatsForSelectedSummaryFirstDate('totalFoodCost', false, timePeriod, latestDate, function(data1, data2) {
        // console.log('totalFoodCost::::::::: ');
        // console.log(data1, data2);
        var data = {
          dates: data1,
          values: data2
        }
        q.resolve(data);
      });
      return q.promise;
    }

    function fetchHealthTrackerFoodCostSummaryDataBenchMark(timePeriod, latestDate) {
      // console.log(timePeriod);
      var q = $q.defer();
      fetchDailyStatsForSelectedSummarySecondDate('totalFoodCost', false, timePeriod, latestDate, function(data1, data2) {
        // console.log('totalFoodCost::::::::: ');
        // console.log(data1, data2);
        var data = {
          dates: data1,
          values: data2
        }
        q.resolve(data);
      });
      return q.promise;
    }


    //  function fetchHealthTrackerFoodSalesDataActual(hTActualFoodSalesDataResponseHandler, timePeriod) {
    //       fetchDailyStatsForSelectedDate(hTActualFoodSalesDataResponseHandler, 'totalFoodSales', false, timePeriod);
    //   }

    function fetchHealthTrackerFoodSalesDataActual(timePeriod) {
      // console.log("totalFoodSales***************: ",timePeriod);
      var q = $q.defer();
      fetchDailyStatsForSelectedDate('totalFoodSales', false, timePeriod, function(data1, data2) {
        // console.log("totalFoodSales***************: ");
        // console.log(data1, data2);
        var data = {
          dates: data1,
          values: data2
        }
        q.resolve(data);
      });
      return q.promise;
    }


    // function fetchHealthTrackerBeerSales(hTActualBeerSalesDataResponseHandler, timePeriod) {
    //     fetchDailyStatsForSelectedDate(hTActualBeerSalesDataResponseHandler, 'totalBeerSales', false, timePeriod);
    // }
    function fetchHealthTrackerBeerSales(timePeriod) {
      // console.log(timePeriod);
      var q = $q.defer();
      fetchDailyStatsForSelectedDate('totalBeerSales', false, timePeriod, function(data1, data2) {
        // console.log(data1, data2);
        var data = {
          dates: data1,
          values: data2
        }
        q.resolve(data);
      });
      return q.promise;
    }

    // function fetchHealthTrackerWineSales(hTActualWineSalesDataResponseHandler, timePeriod) {
    //     fetchDailyStatsForSelectedDate(hTActualWineSalesDataResponseHandler, 'totalWineSales', false, timePeriod);
    // }
    function fetchHealthTrackerWineSales(timePeriod) {
      // console.log(timePeriod);
      var q = $q.defer();
      fetchDailyStatsForSelectedDate('totalWineSales', false, timePeriod, function(data1, data2) {
        // console.log(data1, data2);
        var data = {
          dates: data1,
          values: data2
        }
        q.resolve(data);
      });
      return q.promise;
    }

    // function fetchHealthTrackerSpiritSales(hTActualSpiritSalesDataResponseHandler, timePeriod) {
    //     fetchDailyStatsForSelectedDate(hTActualSpiritSalesDataResponseHandler, 'totalSpiritSales', false, timePeriod);
    // }
    function fetchHealthTrackerSpiritSales(timePeriod) {
      // console.log(timePeriod);
      var q = $q.defer();
      fetchDailyStatsForSelectedDate('totalSpiritSales', false, timePeriod, function(data1, data2) {
        // console.log(data1, data2);
        var data = {
          dates: data1,
          values: data2
        }
        q.resolve(data);
      });
      return q.promise;
    }

    // function fetchHealthTrackerBeverageSales(hTActualBeverageSalesDataResponseHandler, timePeriod) {
    //     fetchDailyStatsForSelectedDate(hTActualBeverageSalesDataResponseHandler, 'totalBeverageSales', false, timePeriod);
    // }
    function fetchHealthTrackerBeverageSales(timePeriod) {
      // console.log(timePeriod);
      var q = $q.defer();
      fetchDailyStatsForSelectedDate('totalBeverageSales', false, timePeriod, function(data1, data2) {
        // console.log(data1, data2);
        var data = {
          dates: data1,
          values: data2
        }
        q.resolve(data);
      });
      return q.promise;
    }


    function fetchHealthTrackerFoodSalesDataBenchMark(hTBenchMarkFoodSalesDataResponseHandler, timePeriod) {
      fetchDailyStatsForSelectedDate('totalFoodSales', true, timePeriod, hTBenchMarkFoodSalesDataResponseHandler);
    }


    function fetchHealthTrackerProfitDataActual(hTActualProfitDataResponseHandler, timePeriod) {
      fetchDailyStatsForSelectedDate('totalProfits', false, timePeriod, hTActualProfitDataResponseHandler);
    }

    function fetchHealthTrackerProfitDataBenchMark(hTBenchMarkProfitDataResponseHandler, timePeriod) {
      fetchDailyStatsForSelectedDate('totalProfits', true, timePeriod, hTBenchMarkProfitDataResponseHandler);
    }

    // function fetchHealthTrackerFoodCostDataActual(hTActualFoodCostDataResponseHandler, timePeriod) {
    //     fetchDailyStatsForSelectedDate('totalFoodCost', false, timePeriod,hTActualFoodCostDataResponseHandler);
    // }
    function fetchHealthTrackerFoodCostDataActual(timePeriod) {
      // console.log(timePeriod);
      var q = $q.defer();
      fetchDailyStatsForSelectedDate('totalFoodCost', false, timePeriod, function(data1, data2) {
        // console.log('totalFoodCost::::::::: ');
        // console.log(data1, data2);
        var data = {
          dates: data1,
          values: data2
        }
        q.resolve(data);
      });
      return q.promise;
    }



    function fetchHealthTrackerLabourCostSummaryDataActual(timePeriod, latestDate) {
      // console.log(timePeriod);
      var q = $q.defer();
      fetchDailyStatsForSelectedSummaryFirstDate('totalFoodCost', false, timePeriod, latestDate, function(data1, data2) {
        // console.log('totalFoodCost::::::::: ');
        // console.log(data1, data2);
        var data = {
          dates: data1,
          values: data2
        }
        q.resolve(data);
      });
      return q.promise;
    }

    function fetchHealthTrackerLabourCostSummaryDataBenchMark(timePeriod, latestDate) {
      // console.log(timePeriod);
      var q = $q.defer();
      fetchDailyStatsForSelectedSummarySecondDate('totalFoodCost', false, timePeriod, latestDate, function(data1, data2) {
        // console.log('totalFoodCost::::::::: ');
        // console.log(data1, data2);
        var data = {
          dates: data1,
          values: data2
        }
        q.resolve(data);
      });
      return q.promise;
    }


    function fetchHealthTrackerFoodCostDataBenchMark(hTBenchMarkFoodCostDataResponseHandler, timePeriod) {
      fetchDailyStatsForSelectedDate('totalFoodCost', true, timePeriod, hTBenchMarkFoodCostDataResponseHandler);
    }
    // function fetchIngrediantsPrices(hTBenchMarkFoodCostDataResponseHandler, timePeriod) {
    //     fetchDailyStatsForSelectedDate('totalFoodCost', true, timePeriod,hTBenchMarkFoodCostDataResponseHandler);
    // }


    function fetchHealthTrackerLiquorCostDataActual(hTActualLiquorCostDataResponseHandler, timePeriod) {
      fetchDailyStatsForSelectedDate('totalLiquorCost', false, timePeriod, hTActualLiquorCostDataResponseHandler);
    }

    function fetchHealthTrackerLiquorCostDataBenchMark(hTBenchMarkLiquorCostDataResponseHandler, timePeriod) {
      fetchDailyStatsForSelectedDate('totalLiquorCost', true, timePeriod, hTBenchMarkLiquorCostDataResponseHandler);
    }



    function fetchHealthTrackerLabourCostDataActual(hTActualLabourCostDataResponseHandler, timePeriod) {
      fetchDailyStatsForSelectedDate('totalLaborCost', false, timePeriod, hTActualLabourCostDataResponseHandler);
    }

    function fetchHealthTrackerLabourCostDataBenchMark(hTBenchMarkLabourCostDataResponseHandler, timePeriod) {
      fetchDailyStatsForSelectedDate('totalLaborCost', true, timePeriod, hTBenchMarkLabourCostDataResponseHandler);
    }


    function fetchOverviewStatsForSelectedSummary(fieldName, timePeriod,  store_id, business_id, responseHandler) {
      var responseHandlers = function(data) {
        responseHandler(data);
      }
      CommonService.fetchSummaryCardDetailForField(responseHandlers, timePeriod , fieldName , business_id , store_id);
    }

    function fetchOverviewStatsHistoryForSelectedSummary(timePeriod,  store_id, business_id, responseHandler) {
      var responseHandlers = function(data) {
        responseHandler(data);
      }

      CommonService.fetchSummaryCardHistoryDetails(responseHandlers, timePeriod , business_id , store_id);
    }

     function fetchSummaryHistoryData(period,  store_id, business_id){

      var q = $q.defer();
      fetchOverviewStatsHistoryForSelectedSummary(period, store_id, business_id, function(data) {

        var data = {
          values: data.summary_history_list,
          business_id: business_id
        }
        q.resolve(data);
      });
      return q.promise;
    }

    function fetchOrgDashboardSummaryDataList(timePeriod, responseHandler) {
      var responseHandlers = function(data) {
        responseHandler(data);
      }

      CommonService.fetchOrgDashboardSummaryData(responseHandlers, timePeriod);
    }

    function fetchOrgDashboardSummaryData(period){
      var q = $q.defer();
      fetchOrgDashboardSummaryDataList(period, function(data) {
        console.log("complete data");
        console.log(data);
        var data = {
          values: data.summary_history_list,
          business_id: business_id
        }
        q.resolve(data);
      });
      return q.promise;
    }

    function fetchOverviewData(period, field , store_id, business_id) {
      var q = $q.defer();
      fetchOverviewStatsForSelectedSummary(field, period, store_id, business_id, function(data) {
        var data = {
          field : data.field,
          values: data.value,
          business_id: business_id,
          budgetValue: data.budgetValue
        }
        q.resolve(data);
      });
      return q.promise;
    }

    return healthTrackerFactory;
  }

})();
