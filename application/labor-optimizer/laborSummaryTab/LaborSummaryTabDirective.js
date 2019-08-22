(function () {
    'use strict';
    projectCostByte.directive('laborsummarytab', laborsummarytab);
    laborsummarytab.$inject = ['$rootScope', '$state', 'Utils', '$ionicScrollDelegate', 'LaborOptimizerService',
        '$timeout', '$ionicActionSheet', 'CommonService', 'ionicDatePicker', 'ErrorReportingServiceOne',
        '$ionicPopover', '$ionicNavBarDelegate'];

    function laborsummarytab($rootScope, $state, Utils, $ionicScrollDelegate, LaborOptimizerService,
                             $timeout, $ionicActionSheet, CommonService, ionicDatePicker, ErrorReportingServiceOne,
                             $ionicPopover, $ionicNavBarDelegate) {
        return {
            restrict: 'E',
            templateUrl: 'application/labor-optimizer/laborSummaryTab/LaborSummaryTabView.html',
            scope: {
                laborType: '=',
            },
            link: function (scope, element, attribute) {
                $rootScope.searchItem = false;
                var initLStab = function(){
                    $timeout(function(){
                        $ionicNavBarDelegate.title('Labor Summary')
                        $ionicNavBarDelegate.showBar(true)
                        $rootScope.searchItem = false;
                    }, 5)

                }
                scope.spinnerHide = true;
                scope.showData=true;
                scope.chartIndex = 0;

                var timePeriodOptions = [
                    {
                        display: 'Daily',
                        key: 'DAILY',
                        headerText: 'Summary of ',
                        selected: true
                    },
                    {
                        display: 'Weekly',
                        key: 'WEEKLY', headerText: 'Week of ',
                        selected: false
                    }
                ];


                scope.timePeriod = function (key) {
                    return _.get(_.find(timePeriodOptions, 'selected'), key)
                };


                scope.textDisplay = function () {
                    if (angular.isDefined(scope.latestDate)) {
                        return _.get(_.find(timePeriodOptions, 'selected'), 'headerText') + scope.latestDate;
                    }
                    else {
                        return ''
                    }
                };

                scope.showPeriod = function () {
                    scope.showChart = false;
                    var hideSheet = $ionicActionSheet.show({
                        buttons: _.transform(timePeriodOptions, function (result, tpo) {
                            result.push({text: tpo.display})
                        }),
                        titleText: '<h4>Select Period</h4>',
                        cancelText: 'Cancel',
                        cancel: function () {
                        },
                        buttonClicked: function (index) {
                            // console.log('setttttttt',scope.laborType,scope.showData)
                            // if(!scope.showData)
                                setTableData();

                            scope.selectedItem = _.filter(scope.tableData,  function(selectedData){
                                return selectedData.selected;
                            })
                            // console.log(scope.selectedItem);


                            if(scope.selectedItem.length)
                                LaborOptimizerService.fetchLaborForSelectedDate(chartDataRH, timePeriodOptions[index].key, scope.selectedItem[0].tag_id);




                            _.each(timePeriodOptions, function (tpo) {
                                tpo.selected = false;
                            });
                            timePeriodOptions[index].selected = true;

                            hideSheet();
                        }
                    });
                };


                function setHeaders() {
                    if (scope.laborType === 'Summary') {
                        scope.headerItems = [{
                            label: 'Item Description',
                            specialStyle: 'text-align: left;',
                            col_width: 'col-67'
                        },
                            {label: 'Salary', specialStyle: '', col_width: 'col-33'}]
                    } else if (scope.laborType === 'Role') {
                        scope.headerItems = [{label: 'Role', specialStyle: 'text-align: left;', col_width: 'col-67'},
                            {label: 'Salary', specialStyle: '', col_width: 'col-33'}]
                    } else if (scope.laborType === 'Employee') {
                        scope.headerItems = [{
                            label: 'Employee',
                            specialStyle: 'text-align: left;',
                            col_width: 'col-67'
                        },
                            {label: 'Salary', specialStyle: '', col_width: 'col-33'}]
                    } else {
                        scope.headerItems = [{label: 'Item', specialStyle: 'text-align: left;', col_width: 'col-67'},
                            {label: 'Value', specialStyle: '', col_width: 'col-33'}]
                    }
                }

                function select_row_item(item) {
                    _.each(scope.tableData, function (row) {
                        row.selected = false;
                    });
                    item.selected = true
                }

                scope.showMultiGraph = function(graphArray){
                    // console.log('scope.showData: ',scope.showData)
                    var newArray = [];
                    if(scope.showData){

                        _.forEach(graphArray.dates, function(fdatas,fdIndex) {
                            // console.log("dates ",fdatas);
                            newArray.push({
                                "xvalues": moment(fdatas).format("MM/DD"),
                                "yvalues": graphArray.values[fdIndex],
                                "y2values": graphArray.perc_values[fdIndex],
                            });
                            // console.log("newArray: ",newArray);
                            if(fdIndex+1 == graphArray.dates.length){
                                // console.log(newArray);
                                // newArray.sort(function(a,b){
                                //     return new Date(a.xvalues) - new Date(b.xvalues)
                                // })


                                var ctx = document.getElementById('chartContainer_'+scope.chartIndex);

                                $timeout(function(){
                                    // console.log(ctx.height);
                                    // console.log(ctx.style.height);
                                    scope.setChartDivHeight = ctx.style.height;

                                },5);


                                // console.log(newArray)

                                var myChart = new Chart(ctx, {
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
                                            text: scope.chartTitle
                                        }

                                    }
                                });

                            }
                        });
                    }
                }



                // scope.chartSeriesLabels = ["Last 7 Days"];
                scope.chartSeriesLabels = [];
                var chartDataRH = function (data) {
                    // console.log('**** data *** ',data);
                    scope.showChart = true;
                    $timeout(function(){
                        scope.showMultiGraph(data);
                    },100);
                    scope.chartDates = CommonService.transformDatesForChartLegend(data.dates);
                    scope.chartData = [data.values];
                    scope.spinnerHide = true;

                    // console.log('scope.spinnerHide: ',scope.spinnerHide);
                    $timeout(function(){
                        scope.navBar = document.getElementsByClassName("bar-header");
                        scope.navBarHeight = scope.navBar[0].offsetHeight;
                        // console.log('navBarHeight: ',scope.navBarHeight);
                        scope.subHeadBar = document.getElementsByClassName("bar-subheader");
                        // console.log("scope.subHeadBar: ",scope.subHeadBar);
                        if(scope.subHeadBar[scope.subHeadBar.length-1])
                            scope.subHeadBarHeight = scope.subHeadBar[scope.subHeadBar.length-1].offsetHeight;
                        // console.log('subHeadBarHeight: ',scope.subHeadBarHeight);
                        scope.chartBar = document.getElementsByClassName("chart-div");
                        // console.log(scope.chartBar[scope.chartBar.length-1])
                        if(scope.chartBar[scope.chartBar.length-1])
                            scope.chartBarHeight = scope.chartBar[scope.chartBar.length-1].offsetHeight;
                        // console.log('chartBarHeight: ',scope.chartBarHeight);
                        scope.tblHeadBar = document.getElementsByClassName("tbl-head");
                        if(scope.tblHeadBar[scope.tblHeadBar.length-1])
                            scope.tblHeadHeight = scope.tblHeadBar[scope.tblHeadBar.length-1].offsetHeight;
                        // console.log('tblHeadHeight: ',scope.tblHeadHeight);
                        scope.totalHeight = (scope.navBarHeight + scope.subHeadBarHeight + scope.chartBarHeight + scope.tblHeadHeight)+"px";
                        // console.log('totalHeight: ',scope.totalHeight);
                        // console.log(document.getElementById("chartTblHead"));
                        // var setHeight = angular.element(document.getElementById("chartTblHead"));
                        // document.getElementById("chartTblHead").style.top = scope.totalHeight;

                        // setHeight.css('top','400px');
                        scope.setContentHeight = scope.totalHeight;

                    },100);

                };

                scope.change_chart = function (item) {
                    scope.showChart = false;
                    // console.log(item);
                    $timeout(function () {
                        select_row_item(item);
                    });
                    scope.chartTitle = "Graph For " + item.name;

                    LaborOptimizerService.fetchLaborForSelectedDate(chartDataRH, scope.timePeriod('key'), item.tag_id);

                };


                function setTableDataRH(tableResponse) {
                    console.log(tableResponse)
                    // scope.spinnerHide = true;
                    if (angular.isDefined(tableResponse.result) && tableResponse.result.length>0){
                        scope.tableData = tableResponse.result;
                        scope.showData=true;

                        scope.change_chart(scope.tableData[0])
                    }else{
                        scope.spinnerHide = true;
                        scope.showData=false;
                        scope.showChart=false;

                    }

                }


                function setTableData() {
                  scope.spinnerHide = false;
                    if (scope.laborType === 'Summary') {
                        scope.chartIndex = 0;
                        LaborOptimizerService.fetchLaborForSummaryTable(setTableDataRH, scope.timePeriod('key'));
                    } else if (scope.laborType === 'Role') {
                        scope.chartIndex = 1;
                        LaborOptimizerService.fetchLaborForRoleTable(setTableDataRH, scope.timePeriod('key'));
                    } else if (scope.laborType === 'Employee') {
                        scope.chartIndex = 2;
                        LaborOptimizerService.fetchLaborForEmployeeTable(setTableDataRH, scope.timePeriod('key'));

                    } else {
                        scope.tableData = [];
                    }
                }


                scope.openDatePicker = function () {
                    scope.inputDate = CommonService.getSelectedDate();
                    scope.datepickerObject = {
                        callback: function (val) {  //Mandatory
                            var selectedDate = new Date(val);
                            scope.latestDate = ((selectedDate.getMonth() + 1) + '/' + selectedDate.getDate() + '/' + selectedDate.getFullYear());
                            CommonService.setSelectedDate(selectedDate);
                            setTableData();
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

                    if (scope.timePeriod('key') === 'WEEKLY') {
                        scope.datepickerObject.disableWeekday = [1, 2, 3, 5, 4, 6];
                    } else if (scope.timePeriod('key') === 'DAILY') {
                        scope.datepickerObject.disabledDates = scope.datesDisabled;
                    }
                    ionicDatePicker.openDatePicker(scope.datepickerObject);
                };



                var disabledDatesRH = function (dates) {
                    scope.datesDisabled = _.transform(dates, function (result, dateValue) {
                        result.push(new Date(dateValue));
                    });

                };

                var dateResponseHandler = function (date) {
                    scope.latestDate = date;
                    CommonService.setSelectedDate(new Date(date));
                    setTableData();
                };

                function fetchLaborData(){
                    scope.spinnerHide = false;

                    let tp = scope.timePeriod('key');
                    if (tp=='DAILY'){
                        CommonService.fetchDisabledLaborDates(disabledDatesRH, new Date(2016, 12, 1),
                            new Date(), tp);
                    }
                    CommonService.fetchLatestLaborDate(dateResponseHandler, new Date(2016, 12, 1),
                        new Date(), tp);

                }

                function onInit() {
                    initLStab();
                    setHeaders();
                    fetchLaborData();
                }



                onInit();

            }
        }
    }
})();
