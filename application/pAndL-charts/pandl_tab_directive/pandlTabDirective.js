(function () {
    // 'use strict';
    projectCostByte.directive('pandlchartstab', pandlchartstab);
    pandlchartstab.$inject = ['$q','$rootScope', '$state', 'Utils', '$ionicScrollDelegate', 'PAndLChartsService',
        '$timeout', '$ionicActionSheet', 'CommonService', 'ionicDatePicker', 'ErrorReportingServiceOne',
        '$ionicPopover'];

    function pandlchartstab($q, $rootScope, $state, Utils, $ionicScrollDelegate, PAndLChartsService,
                            $timeout, $ionicActionSheet, CommonService, ionicDatePicker, ErrorReportingServiceOne,
                            $ionicPopover) {
        return {
            restrict: 'E',
            templateUrl: 'application/pAndL-charts/pandl_tab_directive/pandlTabView.html',
            scope: {
                pAndLType: '=',
            },
            link: function (scope, element, attribute) {
                // console.log(scope.pAndLType)


                var tab_types = ['SALES', 'LABOR_COST', 'COGS', 'PRIME_COST', 'PROFIT_AFTER_PRIME']
                scope.spinnerHide = false;
                scope.laborType = "P & L";

                var dateRangeOptions = [
                    {
                        display: 'Period',
                        key: 'PERIOD',
                        headerText: 'Period-wise History ',
                        selected: false
                    },
                    {
                        display: 'Week',
                        key: 'PERIOD_WEEK', headerText: 'Week-wise History ',
                        selected: true
                    },
                    {
                        display: 'Month',
                        key: 'MONTH', headerText: 'Month-wise History ',
                        selected: false
                    }
                ];

                
                scope.labels = ["January", "February", "March", "April", "May", "June", "July"];
                  scope.series = ['Series A', 'Series B'];
                  scope.data = [
                    [65, 59, 80, 81, 56, 55, 40],
                    [28, 48, 40, 19, 86, 27, 90]
                  ];
                  scope.onClick = function (points, evt) {
                    // console.log(points, evt);
                  };
                // scope.$on('chart-create', function (evt, chart) {
                //     console.log(chart);
                // });
                  scope.datasetOverride = [{ yAxisID: 'y-axis-1' }, { yAxisID: 'y-axis-2' }];
                  scope.options = {
                    scales: {
                      yAxes: [
                        {
                          id: 'y-axis-1',
                          type: 'linear',
                          display: true,
                          position: 'left'
                        },
                        {
                          id: 'y-axis-2',
                          type: 'linear',
                          display: true,
                          position: 'right'
                        }
                      ]
                    }
                  };

                scope.myChartArray = [] ; 
                var myChart;
                var myCharts = [];

                function asyncArray(datas, value) {
                  // perform some asynchronous operation, resolve or reject the promise when appropriate.
                  return $q(function(resolve, reject) {
                        var newArray = []; 
                        _.forEach(datas, function(fdatas,fdIndex) {
                            newArray.push({
                                "xvalues": moment(fdatas).format("MM/DD"),
                                "yvalues": value.data.yvalues[fdIndex],
                                "y2values": value.data.y2perc[fdIndex],
                            }); 
                        });
                        resolve(newArray);
                  });
                }

                

                // window.onload = function () { FF8A80
                scope.showMultiGraph = function(graphArray){                                 
                    // console.log(graphArray);   
                    update = false;
                    if(myCharts.length) {
                        console.log("creating chart");
                        // angular.forEach(myCharts, function(ch, index){
                        //     // ch.chart.destroy();
                        //     // var myEl = angular.element( document.querySelector( '#chartContainer_'+index));
                        //     // myEl.style = '';
                        //     // myEl.style = '';
                        //     // myEl.height = 0;
                        //     // myEl.width = 0;
                        // });
                        update = true;                    
                        // myCharts[1].destroy();
                        // myCharts[2].destroy();
                        // myCharts[3].destroy();
                        // myCharts[4].destroy();
                        // myCharts[5].destroy();
                    }

                    // setTimeout(function(){ 
                        console.log("start execution ...");
                        
                        _.forEach(graphArray, function(value,index) {
                            // console.log(document.getElementById('chartContainer_'+index));
                              // console.log(value);      
                            _.forEach(value.data, function(datas,dIndex) {
                                if(dIndex == "xvalues"){
                              
                                    var promise = asyncArray(datas, value);
                                    promise.then(function(newArray) {
                                          
                                        newArray.sort(function(a,b){
                                            return new Date(a.xvalues) - new Date(b.xvalues) 
                                        }) 
                                        
                                        if(update) {
                                            // console.log(myCharts[index]);
                                            if(myCharts[index]) {
                                                var newData = {
                                                      labels: _.map(newArray, 'xvalues'),
                                                      datasets: [
                                                      {
                                                       type: 'line', fill: false, lineTension: 0,
                                                       label: 'Percentage Value',
                                                       data: _.map(newArray, 'y2values'),
                                                       yAxisID: 'y-axis-2',
                                                       borderColor: '#FF7F75',
                                                       backgroundColor: '#FF7F75',
                                                       borderWidth: 2,

                                                      },
                                                      {
                                                       type: 'bar', 
                                                       label: 'Dollar value',
                                                       data: _.map(newArray, 'yvalues'),
                                                       yAxisID: 'y-axis-1',
                                                       borderColor: '#369EAD',
                                                       backgroundColor: '#79CEE8',
                                                       borderWidth: 2
                                                      }
                                                      
                                                      ]
                                                };

                                                

                                                myCharts[index].config.data = newData;
                                                // myCharts[index].config.options = newOptions;                                            
                                                myCharts[index].update();
                                                // console.log("chart updated ...");
                                                // console.log(myCharts[index]);  
                                            }
                                        } else {
                                            var ctx = document.getElementById('chartContainer_'+scope.pAndLType+index);
                                            myChart = new Chart(ctx, {
                                                type: 'bar',
                                                data: {
                                                  labels: _.map(newArray, 'xvalues'),
                                                  datasets: [
                                                  {
                                                   type: 'line', fill: false, lineTension: 0,
                                                   label: 'Percentage Value',
                                                   data: _.map(newArray, 'y2values'),
                                                   yAxisID: 'y-axis-2',
                                                   borderColor: '#FF7F75',
                                                   backgroundColor: '#FF7F75',
                                                   borderWidth: 2,

                                                  },
                                                  {
                                                   type: 'bar', 
                                                   label: 'Dollar value',
                                                   data: _.map(newArray, 'yvalues'),
                                                   yAxisID: 'y-axis-1',
                                                   borderColor: '#369EAD',
                                                   backgroundColor: '#79CEE8',
                                                   borderWidth: 2
                                                  }
                                                  
                                                  ]
                                                },
                                                options: {
                                                    scales: {
                                                       yAxes:
                                                       [
                                                        {
                                                            scaleLabel: { display: true, labelString: '' },
                                                            position: 'left', id: 'y-axis-1',type: 'linear',
                                                            ticks: { // Include a dollar sign in the ticks
                                                                beginAtZero: true,
                                                                callback: function(value, index, values) {
                                                                    // return '$' + value;
                                                                    return  ' $' + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                                                } 
                                                            }
                                                        },
                                                        {
                                                            scaleLabel: { display: true, labelString: '' },
                                                            position: 'right', id: 'y-axis-2',type: 'linear',
                                                            ticks: { 
                                                                min: 0, 
                                                                beginAtZero: true, 
                                                                max: 100, 
                                                                callback: function(value, index, values) {
                                                                    
                                                                    return  value + ' %';
                                                                } 
                                                            },
                                                            gridLines: { display: false }
                                                        }
                                                        
                                                       ]
                                                    },

                                                    legend: {
                                                        display: true,
                                                        labels: {
                                                            fontColor: 'rgb(255, 99, 132)'
                                                        },
                                                        position: 'bottom'  
                                                    },
                                                    title: {
                                                        display: true,
                                                        text: value.statName
                                                    }
                                                  
                                                }
                                            }); 
                                            // console.log(myChart);   
                                            myCharts.push(myChart);
                                        }
                                    }, function(reason) {
                                      console.log('Failed: ' + reason);
                                    });
                                }
                            });

                        });
                    // }, 100);
                }


                scope.dateRange = function (key) {
                    return _.get(_.find(dateRangeOptions, 'selected'), key)
                };


                scope.textDisplay = function () {
                    if (angular.isDefined(scope.latestDate)) {
                        return _.get(_.find(dateRangeOptions, 'selected'), 'headerText')
                        // + scope.latestDate;
                    }
                    else {
                        return ''
                    }
                };

                scope.showPeriod = function () {
                    
                    var hideSheet = $ionicActionSheet.show({
                        buttons: _.transform(dateRangeOptions, function (result, tpo) {
                            result.push({text: tpo.display})
                        }),
                        titleText: '<h4>Select Period</h4>',
                        cancelText: 'Cancel',
                        cancel: function () {
                        },
                        buttonClicked: function (index) {
                          scope.spinPeriod = false;                          
                            _.each(dateRangeOptions, function (tpo) {
                                tpo.selected = false;
                            });
                            dateRangeOptions[index].selected = true;
                            getChartData();
                            scope.myChartArray = [];
                            hideSheet();
                        }
                    });
                };


                function transform_xlabels(x_labels_actual, prefix) {
                    return _.transform(x_labels_actual, function (result, v) {
                        // console.log(v)
                        result.push(
                            _.replace(v.slice(prefix.length + 1), new RegExp("_", "g"), "/"))
                    });

                }

                // scope.chartSeriesLabels = ["Last 7 Days"];
                scope.chartSeriesLabels = [];
                scope.graphArray = [];
                var receivedChartDataCount = 0;
                var getChartDataRH = function (data, chartDefinitionIndex) {
                    // console.log('***** data ***** ',data, chartDefinitionIndex);
                    // console.log('set chart data for :' + chartDefinitionIndex);
                    
                    receivedChartDataCount += 1;
                    if (angular.isDefined(data.xvalues) && angular.isDefined(data.yvalues)) {
                        // scope.chartDefinitions[chartDefinitionIndex].chartDates = transform_xlabels(data.xvalues,
                        //     scope.dateRange('key'));
                        scope.chartDefinitions[chartDefinitionIndex].chartDates = data.xvalues
                        scope.chartDefinitions[chartDefinitionIndex].chartData = [data.yvalues];
                    } else {
                        scope.chartDefinitions[chartDefinitionIndex].chartDates = [];
                        scope.chartDefinitions[chartDefinitionIndex].chartData = [[]];
                    }
                    scope.chartDefinitions[chartDefinitionIndex].chartTitle = scope.chartDefinitions[chartDefinitionIndex].statNameAlias;
                    // console.log(scope.chartDefinitions[chartDefinitionIndex].chartTitle, scope.chartDefinitions[chartDefinitionIndex].chartDates.length, scope.chartDefinitions[chartDefinitionIndex].chartData[0].length)
                    scope.chartDefinitions[chartDefinitionIndex].dataReceived = true;

                        // console.log('chartDefinitionIndex: ',chartDefinitionIndex)
                        scope.graphArray.push({
                            'statName' : data.statName,
                            'data':data,
                            'index':chartDefinitionIndex
                        });


                    if (receivedChartDataCount >= scope.chartDefinitions.length) {

                        scope.spinnerHide = true;
                        scope.spinPeriod = true;
                        // *************************************** Multi axis *************************************
                            // console.log(scope.graphArray);
                            $timeout(function(){
                                scope.graphArray = _.orderBy(scope.graphArray, ['index'],['asc']);
                                scope.showMultiGraph(scope.graphArray);
                            });
                        // *************************************** Multi axis *************************************
                        
                        
                    }

                };


                function getChartData() {
                    let pAndLType = scope.pAndLType;
                    let tp = scope.dateRange('key');
                    scope.graphArray = [];
                    // scope.spinnerHide = false;
                    if (_.includes(tab_types, pAndLType)) {
                        receivedChartDataCount = 0;
                        _.each(scope.chartDefinitions, function (chartDefiniton, chartDefintionIndex) {
                            chartDefiniton.dataReceived = false;
                            $timeout(function () {
                                PAndLChartsService.getChartData(tp, pAndLType, chartDefiniton['statName'])
                                    .then(function (data) {
                                        getChartDataRH(data, chartDefintionIndex)
                                    },function(rsn){
                                        scope.spinnerHide = true;
                                        scope.spinPeriod = true;
                                    });
                            });
                        })

                    }
                }


                scope.openDatePicker = function () {
                    scope.inputDate = PAndLChartsService.getSelectedDate();
                    scope.datepickerObject = {
                        callback: function (val) {  //Mandatory
                            var selectedDate = new Date(val);
                            scope.latestDate = ((selectedDate.getMonth() + 1) + '/' + selectedDate.getDate() + '/' + selectedDate.getFullYear());
                            PAndLChartsService.setSelectedDate(selectedDate);
                            getChartData();
                        },
                        disabledDates: [],
                        from: new Date(2016, 6, 1),
                        to: new Date(),
                        inputDate: scope.inputDate,
                        mondayFirst: true,
                        disableWeekdays: [1,2,3,4,5,6],    
                        closeOnSelect: false,
                        templateType: 'popup'
                    };

                    // if (scope.dateRange('key') === 'WEEKLY') {
                    //     // scope.datepickerObject.disableWeekday = [1, 2, 3, 5, 4, 6];
                    //     scope.datepickerObject.disableWeekday = [];
                    // } else if (scope.dateRange('key') === 'DAILY') {
                    //     scope.datepickerObject.disabledDates = [];
                    // }
                    ionicDatePicker.openDatePicker(scope.datepickerObject);
                };


                function setChartDefinitions() {
                    let pAndLType = scope.pAndLType;
                    PAndLChartsService.getChartDefinitions(pAndLType).then(function (chartDefinitions) {
                        scope.chartDefinitions = chartDefinitions;
                        // console.log(scope.chartDefinitions);
                        getChartData();
                    })
                }


                function setDateRangeOptions() {
                    let pAndLType = scope.pAndLType;
                    PAndLChartsService.getDateRangeOptions(pAndLType).then(function (dateRanges) {
                        dateRangeOptions = dateRanges;
                        setChartDefinitions();
                    })
                }


                var onInit = function () {
                    // console.log("pandl tab onInit")
                    // let headerTitle = 'P & L: ' + _.startCase(_.toLower(_.replace(scope.pAndLType, '_', ' ')))
                    let headerTitle = 'P & L Trends'
                    Utils.setHeaderTitle(headerTitle)
                    let selectedDate = PAndLChartsService.getSelectedDate();
                    scope.latestDate = ((selectedDate.getMonth() + 1) + '/' + selectedDate.getDate() + '/' + selectedDate.getFullYear());
                    setDateRangeOptions();

                }


                onInit();

            }
        }
    }
})();
