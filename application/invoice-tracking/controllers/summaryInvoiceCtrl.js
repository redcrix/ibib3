(function () {
    'use strict'
    projectCostByte.controller('InvoiceSummaryCtrl', InvoiceSummaryCtrl);

    InvoiceSummaryCtrl.$inject = ['$q', '$scope', '$state', '$filter', '$location', '$ionicSideMenuDelegate',
        '$rootScope', 'CommonService', 'CommonConstants', 'Utils', '$cordovaCamera', '$cordovaFileTransfer',
        'DocumentSelectionService', '$ionicLoading', '$ionicActionSheet', '$ionicModal', '$window','$timeout','$ionicPopup'

    ];

    function InvoiceSummaryCtrl($q, $scope, $state, $filter, $location, $ionicSideMenuDelegate, $rootScope,
        CommonService, CommonConstants, Utils, $cordovaCamera, $cordovaFileTransfer,
        DocumentSelectionService, $ionicLoading, $ionicActionSheet, $ionicModal, $window,$timeout,$ionicPopup) {

        $scope.$on('BUSY', function (event) {
            $scope.spinnerShow = true;
        });

        $scope.$on('FREE', function (event) {
            $scope.spinnerShow = false;
        });

        // $scope.spinnerShow = false;
        $scope.spinnerHide=true;

        Number.prototype.round = function(places) {
          return +(Math.round(this + "e+" + places)  + "e-" + places);
        }

        $scope.purchaseSummaryDataReceived;
        $scope.invoiceConfigDataReceived;

        $scope.$on('STOPSPINNER', function(event) {
            // if($scope.purchaseSummaryDataReceived && $scope.invoiceConfigDataReceived) {
            //     $scope.spinnerShow = false;
            // }
            if($scope.purchaseSummaryDataReceived) {
                // console.log("spin")
                $scope.spinnerShow = false;
            }
        })

        $scope.selectedPeriod = "";
        $scope.initializeSummary = function () {
            // console.log("init")
            $scope.showTabs=false;
            $scope.spinnerHide=true;
            $scope.graphData=true;
            $scope.graphDataSup=true;
            // $scope.graphDataMinor=true;
            $scope.$broadcast('BUSY');
            $scope.navBarTitle.showToggleButton = true;
            $scope.summaryFilterButtons = DocumentSelectionService.getButtons("FILTER");

            $scope.data = {};
            $scope.data.invoicesList = [];
            $scope.data.invoiceData = [];
            $scope.labels = [];
            $scope.datas = [];

            $scope.deviceWidth = $window.innerWidth;

            $rootScope.$broadcast('suppliersPageUpdate');

            // console.log("summary");
            $scope.$on('GETINVOICEFORPERIOD', function (event, period) {
                // console.log("GETINVOICEFORPERIOD in summaryInvoice : ", period);
                $rootScope.$broadcast('suppliersPageUpdate');
                $scope.showTabs=true;
                $scope.selectedPeriod = period;
                $scope.purchaseSummaryDataReceived = false;
                $scope.invoiceConfigDataReceived = false;
                $scope.isExportSummary = false;
                fetchInvoiceConfigItem(period);
                fetchPurchaseSummaryData(period);
                $scope.$broadcast('BUSY');
                // var spinnerInterval = setInterval(function() {
                //     console.log("checking if all data is loaded")
                //     if($scope.purchaseSummaryDataReceived && $scope.invoiceConfigDataReceived) {
                //         $scope.$broadcast('FREE');
                //         clearInterval(spinnerInterval);
                //     }
                // }, 1000);
            });
            $scope.$broadcast('BUSY');
            chatDataCategorySupplier();
        }
        var chatDataCategorySupplier = function(){
            if(!angular.isDefined(pieChartCanvas) || !angular.isDefined(pieChartCanvasSup) || !angular.isDefined(pieChartCanvasMinor)) {
                var categoryOptions = {

                title: {
                    display: true,
                    fontsize: 14,
                    text: 'Category'
                },

                  tooltips : {
                    callbacks: {
                        label: function(tooltipItem, data) {
                            return data['labels'][tooltipItem['index']] +' : $ ' + data['datasets'][0]['data'][tooltipItem['index']];
                        }
                    }
                  },
                    legend: {
                        display: true,
                        position: "bottom",
                        labels: {
                            fontColor: "#333",
                            fontSize: 10,
                            boxWidth: 15
                        }
                    }
                };
                var supplierOptions = categoryOptions;
                var minorOptions= categoryOptions;
                supplierOptions.title.text = "";
                minorOptions.title.text = "";
                if(angular.isDefined($scope.pieChart)) {
                    // console.log("called dest")
                    $scope.pieChart.destroy();
                }
                if(angular.isDefined($scope.pieChartSup)) {
                    $scope.pieChartSup.destroy();
                }
                if(angular.isDefined($scope.pieChartMinor)) {
                    $scope.pieChartMinor.destroy();
                }
                if($scope.categoryData) {
                    var pieChartCanvas = document.getElementById("pieChart");
                    $scope.pieChart = new Chart(pieChartCanvas, {
                      type: 'pie', // or doughnut
                      data: $scope.categoryData,
                      options: categoryOptions
                    });
                    $scope.pieChart.render();
                }
                if($scope.supplierData) {
                    var pieChartCanvasSup = document.getElementById("pieChartSup");
                    $scope.pieChartSup = new Chart(pieChartCanvasSup, {
                      type: 'pie', // or doughnut
                      data: $scope.supplierData,
                      options: supplierOptions
                    });
                    $scope.pieChartSup.render();
                }
                if($scope.minorData) {
                    // console.log("$scope.minorData",$scope.minorData)
                    var pieChartCanvasMinor = document.getElementById("pieChartMinor");
                    $scope.pieChartMinor = new Chart(pieChartCanvasMinor, {
                      type: 'pie', // or doughnut
                      data: $scope.minorData,
                      options: minorOptions
                    });
                    $scope.pieChartSup.render();
                }
            }

        }

        // var isDataLoaded = function() {
        //     console.log("checking if all data is loaded")
        //     if($scope.purchaseSummaryDataReceived && $scope.invoiceConfigDataReceived) {
        //         $scope.$broadcast('FREE');
        //         if(angular.isDefined(spinnerInterval))
        //             clearInterval(spinnerInterval);
        //     }
        // }

        var fetchPurchaseSummaryData = function(selectedPeriod) {
            var promises = [DocumentSelectionService.fetchPurchaseSummary(selectedPeriod)];
            $q.all(promises).then((values) => {
                fetchSupplierSummaryResponseHandler(values[0]);
            });
            
            // $scope.$broadcast('STOPSPINNER');
        }

        var fetchInvoiceConfigItem=function(selectedPeriod){
            DocumentSelectionService.fetchInvoiceConfigItems(selectedPeriod).then(function (data) {
                // $scope.pnLItems = data;
                // $scope.supplierDataResponseHandler(data);
                // $scope.graphData=true;
                // $scope.graphDataSup=true;
                // $scope.graphDataMinor=true;
                $scope.mappedData=[];
                $scope.unMappedData=[];
                $scope.invoiceConfigDataReceived = true;
                // $scope.$broadcast('STOPSPINNER');
                $scope.invouceConfigData = data;
                $scope.$broadcast('isDataReceived')

            });
            

        }
        $scope.$on('isDataReceived',function(evnt) {
            if($scope.invoiceConfigDataReceived && $scope.summaryDataReceived) {
                $scope.spinnerShow = false;
            }
        })

        if(!angular.isDefined($rootScope.supplierObject)) {
            $rootScope.supplierObject = [];
        }
        if(!angular.isDefined($rootScope.minorObject)) {
            $rootScope.minorObject = [];
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
        function isEmpty(obj) {
            for(var key in obj) {
                if(obj.hasOwnProperty(key))
                    return false;
            }
            return true;
        }

        var fetchSupplierSummaryResponseHandler = function(invoices) {
            // console.log("called",isEmpty(invoices.purchase_summary))
            $scope.summaryDataReceived = true;
            $scope.$broadcast('isDataReceived')
            if(isEmpty(invoices.purchase_summary)) {
                $scope.graphData=false;
                $scope.graphDataSup=false;
                $scope.graphDataMinor=false;
            }else {
            // console.log(invoices.purchase_summary);
            if(angular.isDefined(invoices.purchase_summary) && angular.isDefined(invoices.purchase_summary.pnl) && angular.isDefined(invoices.purchase_summary.minor_category)) {
                $scope.pnlTableData = [];
                var categoryLable = [];
                $scope.categoryLegendData = [];
                var categoryPrice = [];
                $scope.totalValue=0;
                // var allBGColor = [];
                $scope.unMappedPnlValue = 0;
                var index = 0;
                var allBGColor = ["#A3E4D7","#ABEBC6","#AED6F1","#F5B7B1","#D7BDE2"]
                var color = "#FF0000";
                var categoryBgColor = [];
                var minorCatObj = []; 
                var pnlCatObj = invoices.purchase_summary.pnl;
                _.forEach(pnlCatObj,function(data,index) {
                    // console.log("data",data);
                    if(data) {
                        if(data.statName == "OTHER" || data.statName == "") {
                            // console.log("data.statName pnl",data);
                            $scope.unMappedPnlValue += data.value;
                            pnlCatObj.splice(index,1)
                        }
                    }
                })
                if($scope.unMappedPnlValue > 0) {
                    pnlCatObj.push({'statName' :'OTHER','value' : $scope.unMappedPnlValue})
                    invoices.purchase_summary.pnl = pnlCatObj;
                }

                _.each(invoices.purchase_summary.pnl, function(invoice) {
                    if(invoice.statName != "*" && invoice.statName != "COGS") {
                        if(invoice.value > 0){
                            $scope.pnlTableData.push(invoice);
                            categoryLable.push(invoice.statName);
                            categoryPrice.push(invoice.value.round(1));
                            var categoryLegendObj = {};
                            categoryLegendObj.name = invoice.statName;
                            if(invoice.statName == "OTHER"){
                                categoryBgColor.push(color);
                            }else {
                                categoryBgColor.push(allBGColor[index++]);
                            }
                            $scope.categoryLegendData.push(categoryLegendObj);
                            $scope.totalValue +=invoice.value;
                        }
                    } 
                    // else if (invoice.statName == "OTHER" ) {
                    //     if(invoice.value > 0){
                    //         // $scope.pnlTableData.push(invoice);
                    //         categoryLable.push(invoice.statName);
                    //         categoryPrice.push(invoice.value.round(1));
                    //         var categoryLegendObj = {};
                    //         categoryLegendObj.name = invoice.statName;
                    //         categoryBgColor.push(color);
                    //         $scope.categoryLegendData.push(categoryLegendObj);
                    //         // $scope.totalValue +=invoice.value;
                    //     }
                    // }

                })
                $scope.pnlTableData = arrUnique($scope.pnlTableData);
                _.forEach(categoryLable,function(item,index) {
                    if(item == "OTHER") {
                         categoryLable[index] = "UNMAPPED"
                    }
                })
                _.forEach($scope.pnlTableData,function(item,index) {
                    if(item.statName == "OTHER") {
                         $scope.pnlTableData[index].statName = "UNMAPPED"
                    }
                })
                categoryLable = arrUnique(categoryLable);
                // categoryPrice = arrUnique(categoryPrice);
                var totaldata ={
                        "statName" : "Total",
                        "value" : $scope.totalValue
                    }
                $scope.pnlTableData.push(totaldata);
                $scope.statName=totaldata.statName;
                $scope.value=totaldata.value;
                $scope.categoryData = {
                    datasets: [{
                        data: categoryPrice,
                        backgroundColor: categoryBgColor,
                        label: 'Category' // for legend
                    }],
                    labels: categoryLable
                };
                chatDataCategorySupplier();
                $scope.pieChart.data = $scope.categoryData;
                $scope.pieChart.update();
                $scope.graphData=true;
                $timeout(function() {
                    $scope.pieChart.resize();
                }, 500);
            } else {
                // console.log('called else')
              $scope.spinnerShow = false;
            }
            if(angular.isDefined(invoices.purchase_summary) && angular.isDefined(invoices.purchase_summary.suppliers)) {
                $scope.spinnerHide=true;
                $scope.supTableData = [];
                var supplierLable = [];
                var supplierPrice = [];
                $scope.totalSupValue=0;
                // var supplierBgColor = [];
                $scope.supplierLegendData = [];
                var index = 0;
                var supplierColors = [];
                // var allBgColors = ["#A3E4D7","#ABEBC6","#AED6F1","#F5B7B1","#D7BDE2","#D1F2EB","#A9DFBF"]
                _.each(invoices.purchase_summary.suppliers, function(invoice) {
                    if(!invoice.statName == "" && invoice.value> 0 && invoice.statName != "OTHER" && invoice.statName != "*") {
                        $scope.supTableData.push(invoice);
                        supplierLable.push(invoice.statName);
                        supplierPrice.push(invoice.value.round(0));
                        $scope.totalSupValue +=invoice.value;
                        // var randomColor = "#000000".replace(/0/g,function(){return (~~(Math.random()*16)).toString(16);});
                        $scope.supplierLegendObj = {};
                        $scope.supplierLegendObj.name = invoice.statName;
                        if(invoice.statName == "OTHER" || invoice.statName == "*"){
                          $scope.supplierLegendObj.color = "#FF0000";
                        }else{
                            var searchResult = _.find($rootScope.supplierObject, function(obj) {
                            return obj.name === $scope.supplierLegendObj.name
                            })
                            if(searchResult) {
                                $scope.supplierLegendObj.color = searchResult.color;
                            } else {
                                $scope.supplierLegendObj.color = getRandomColor();
                            }
                        }
                        
                        $scope.supplierLegendData.push({'name' : $scope.supplierLegendObj.name,'color' : $scope.supplierLegendObj.color});
                    }
                })
                $scope.supplierLegendData = arrUnique($scope.supplierLegendData);
                $scope.supTableData = arrUnique($scope.supTableData);
                _.forEach(supplierLable,function(item,index) {
                    if(item.statName == "OTHER") {
                         supplierLable[index].statName = "UNMAPPED"
                    }
                })
                _.forEach($scope.supTableData,function(item,index) {
                    if(item == "OTHER") {
                         $scope.supTableData[index] = "UNMAPPED"
                    }
                })
                supplierLable = arrUnique(supplierLable);
                // supplierPrice = arrUnique(supplierPrice);
                var totalSupdata ={
                        "statName" : "Total",
                        "value" : $scope.totalSupValue
                    }
                    $scope.supTableData.push(totalSupdata);
                    $scope.supstatName=totalSupdata.statName;
                    $scope.supvalue=totalSupdata.value;
                while ($rootScope.supplierObject.length > 0) {
                    $rootScope.supplierObject.pop();
                }
                _.each($scope.supplierLegendData, function(object) {
                    supplierColors.push(object.color);
                    $rootScope.supplierObject.push(object);
                })
                $scope.supplierData = {
                    datasets: [{
                        data: supplierPrice,
                        backgroundColor: supplierColors,
                        label: 'Supplier' // for legend
                    }],
                    labels: supplierLable
                };
                chatDataCategorySupplier();
                $scope.pieChartSup.data = $scope.supplierData;
                $scope.pieChartSup.update();
                // document.getElementById('js-legend').innerHTML = $scope.pieChartSup.generateLegend();
                $scope.graphDataSup=true;
                $timeout(function() {
                    $scope.pieChartSup.resize();
                }, 500);
            }
            if(angular.isDefined(invoices.purchase_summary) && angular.isDefined(invoices.purchase_summary.minor_category)) {
                $scope.spinnerHide=true;
                $scope.minorTableData = [];
                var minorLable = [];
                var minorPrice = [];
                $scope.totalMinorValue=0;
                $scope.minorLegendData = [];
                var index = 0;
                var minorColors = [];
                $scope.unMappedValue = 0;

                // var allBgColors = ["#A3E4D7","#ABEBC6","#AED6F1","#F5B7B1","#D7BDE2","#D1F2EB","#A9DFBF"]
                $scope.minorLegendObj = {};
                var minorCatObj = [];
                var minorCatObj = invoices.purchase_summary.minor_category;
                _.forEach(minorCatObj,function(data,index) {
                    if(data) {
                        if(data.statName == 'OTHER' || data.statName == "") {
                            $scope.unMappedValue += data.value;
                            minorCatObj.splice(index,1)
                        }
                    }
                })

                if($scope.unMappedValue > 0) {
                    minorCatObj.push({'statName' :'OTHER','value' : $scope.unMappedValue})
                    invoices.purchase_summary.minor_category = minorCatObj;
                }
                invoices.purchase_summary.minor_category = arrUnique(invoices.purchase_summary.minor_category)
                _.each(invoices.purchase_summary.minor_category, function(invoice) {
                    if(invoice.value >0 ) {
                        $scope.minorTableData.push(invoice);
                        minorLable.push(invoice.statName);
                        minorPrice.push(invoice.value.round(0));
                        $scope.totalMinorValue +=invoice.value;
                        // var randomColor = "#000000".replace(/0/g,function(){return (~~(Math.random()*16)).toString(16);});
                        $scope.minorLegendObj.name = invoice.statName;
                        if(invoice.statName == "OTHER" || invoice.statName == "*" || invoice.statName == ""){
                          $scope.minorLegendObj.color = "#FF0000";
                        }else{
                            var searchResult = _.find($rootScope.minorObject, function(obj) {
                            return obj.name === $scope.minorLegendObj.name
                            })
                            if(searchResult) {
                                $scope.minorLegendObj.color = searchResult.color;
                            } else {
                                $scope.minorLegendObj.color = getRandomColor();
                            }
                        }
                        
                        $scope.minorLegendData.push({'name' : $scope.minorLegendObj.name,'color' : $scope.minorLegendObj.color});
                    }
                })
                $scope.minorLegendData = arrUnique($scope.minorLegendData)
                $scope.minorTableData = arrUnique($scope.minorTableData);
                minorLable = arrUnique(minorLable);
                var unmappedMinor ={

                }
                _.forEach(minorLable,function(item,index) {
                    if(item == "OTHER") {
                         minorLable[index] = "UNMAPPED";
                    }
                })
                _.forEach($scope.minorTableData,function(item,index) {
                    if(item.statName == "OTHER") {
                         $scope.minorTableData[index].statName = "UNMAPPED";
                    }
                })
                // console.log("minorLable",minorLable)
                // minorPrice = arrUnique(minorPrice);
                var totalMinordata ={
                        "statName" : "Total",
                        "value" : $scope.totalMinorValue
                    }
                    $scope.minorTableData.push(totalMinordata);
                    $scope.minorstatName=totalMinordata.statName;
                    $scope.minorvalue=totalMinordata.value;
                while ($rootScope.minorObject.length > 0) {
                    $rootScope.minorObject.pop();
                }
                _.each($scope.minorLegendData, function(object) {
                    minorColors.push(object.color);
                    $rootScope.minorObject.push(object);
                })
                $scope.minorData = {
                    datasets: [{
                        data: minorPrice,
                        backgroundColor: minorColors,
                        label: 'Supplier' // for legend
                    }],
                    labels: minorLable
                };
                chatDataCategorySupplier();
                $scope.pieChartMinor.data = $scope.minorData;
                $scope.pieChartMinor.update();
                $scope.graphDataMinor=true;
                $timeout(function() {
                    $scope.pieChartMinor.resize();
                }, 500);
            }
        }
            $scope.purchaseSummaryDataReceived = true;
            if($scope.isExportSummary) {
                var confirmPopup = $ionicPopup.confirm({
                    template: 'Would you like to Export the Invoice Summary ?',
                    okText: "Ok",
                    okType: "button-balanced",
                });
                confirmPopup.then(function(res) {
                    if (res) {
                        $scope.openPrompt();
                    } else {}
                // $ionicListDelegate.closeOptionButtons();
                });

            }
        }

        function getRandomColor() {
            var letters = 'BCDEF'.split('');
            var color = '#';
            for (var i = 0; i < 6; i++ ) {
                color += letters[Math.floor(Math.random() * letters.length)];
            }
            return color;
        }



        $scope.ChartClickHandler = function () {
        };

        // gets invoices from server . run only once on init
        var fetchSheetData = function () {
            var promises = [DocumentSelectionService.fetchPurchaseTrend(), DocumentSelectionService.fetchSupplierInvoices()];
            $q.all(promises).then((values) => {
                fetchInvoicesResponseHandler(values[0])
                fetchInvoicesDueResponseHandler(values[1]);

            });
        }

        var fetchInvoicesResponseHandler = function (invoices) {

            $scope.purchase_trends = invoices.filter(function (inv) {
                return inv.supplier_name !== "VOID";
            });

            $scope.purchase_trends.visible = true;
            $scope.data.invoiceData = $scope.purchase_trends;
        }


        var fetchInvoicesDueResponseHandler = function (due) {
            $scope.data.invoicesList = due.filter(function (invs) {
                return invs.supplier_name !== "VOID" && invs.paid_or_not === false;
            });

            $scope.data.invoicesList.sort(function (a, b) {
                a = parseInt(a.date);
                b = parseInt(b.date);
                return a - b;
            });


            $scope.labels = ['labels'];

            $scope.datas = ['data2'];


            angular.forEach($scope.data.invoicesList, function (datas, index) {
                var dateString = moment.unix(datas.date).format("MM/DD/YYYY");

                if (moment(dateString).isBetween(moment().startOf('week').subtract(30, 'days'), moment().endOf('week'))) {

                    if ($scope.labels.length > 0) {

                        var flag = true;

                        angular.forEach($scope.labels, function (data, index) {
                            if (data == dateString) {
                                flag = false
                            }
                            if (index + 1 == $scope.labels.length) {
                                if (flag && $scope.labels.length) {
                                    dateString = dateString.replace(/^"(.*)"$/, '$1')
                                    $scope.labels.push(moment(dateString));
                                    $scope.datas.push(datas.total_cost);
                                }
                            }
                        });
                    }

                    if ($scope.data.invoicesList.length == index + 1) {


                        var chart = c3.generate({
                            data: {
                                x: 'labels',
                                columns: [
                                    $scope.labels,
                                    $scope.datas,
                                ]
                            },
                            zoom: {
                                enabled: true,
                                onzoom: function (domain) {
                                }
                            },
                            axis: {
                                x: {
                                    type: 'timeseries',
                                    tick: {
                                        format: '%m/%d/%Y',
                                    }
                                }
                            }
                        });

                        chart.zoom([moment().startOf('week'), moment().endOf('week')]);


                    }
                }
            });



            angular.forEach($scope.invoicesList, function (datas) {
                if ($scope.data.length < 110) {
                    $scope.data.push(datas.total_cost);
                    var dateString = moment.unix(datas.date).format("MM/DD/YYYY");

                    if ($scope.labels.length > 0) {
                        var flag = true;
                        angular.forEach($scope.labels, function (data, index) {
                            if (data == dateString) {
                                flag = false
                            }
                            if (index + 1 == $scope.labels.length) {
                                if (flag)
                                    $scope.labels.push(dateString);
                            }
                        });
                    } else {
                        $scope.labels.push(dateString);
                    }

                }
            });

            $scope.$broadcast('FREE');
        }


        $scope.filterbuttonclick = function (filterbuttonindex) {
            for (var i = 0; i < $scope.summaryFilterButtons.length; i++) {
                if (i == filterbuttonindex) {
                    $scope.summaryFilterButtons[i].clicked = true;

                    if ($scope.summaryFilterButtons[i].name == "purchase")
                        $scope.data.invoiceData = $scope.purchase_trends;
                    else
                        $scope.data.invoiceData = $scope.invoicesList;

                } else {
                    $scope.summaryFilterButtons[i].clicked = false;
                }
            }
        }

        $scope.showSortingActionsheet = function () {
            $ionicActionSheet.show({
                titleText: 'Sorting',
                buttons: DocumentSelectionService.getButtons("SORT"),
                // destructiveText: 'Delete',
                cancelText: 'Cancel',
                cancel: function () {
                    //                    console.log('CANCELLED');
                },
                buttonClicked: function (index) {
                    //                    console.log('BUTTON CLICKED', index);
                    DocumentSelectionService.setButtonClicked("SORT", index);
                    return true;
                },
            });
        };

        $scope.$on('UPDATEINVOICE', function (event) {
            // console.log("refresh data");
            $scope.data.invoiceData = [];
            DocumentSelectionService.fetchSupplierInvoices(function (due) {
                $scope.data.invoicesList = due.filter(function (invs) {
                    return invs.supplier_name !== "VOID" && invs.paid_or_not === false;
                });
                // console.log($scope.invoicesList);
                $scope.$apply(function () {
                    $scope.data.invoiceData = $scope.invoicesList;
                });
            });
        });

        var toastMessage = function (message_text, duration) {
            if (typeof duration === 'undefined') duration = 2000;
            $ionicLoading.show({
                template: message_text,
                noBackdrop: true,
                duration: duration
            });
        }

        $scope.regenrateRes = function(data){
            // console.log("data",data)
            if(data.response) {
                $rootScope.regenerateSummary = true;
                toastMessage("Summary updated successfully",3000);
                // if ($scope.dataInvoice === undefined) {
                    
                //     $scope.dataNotReceived = true;
                // }
                $scope.isExportSummary = true;
                fetchPurchaseSummaryData($scope.selectedPeriod);
                // console.log("$scope.selectedPeriod",$rootScope.checkForDisable,$scope.selectedPeriod)
                _.forEach($rootScope.checkForDisable,function(item,index) {
                    if($scope.selectedPeriod == item.periodWeek){
                        $rootScope.checkForDisable[index].isDisable = true;
                    }
                })
            }else {
                // console.log("rege else")
                $scope.spinnerShow = false;
                // if ($scope.dataInvoice === undefined) {
                //     $scope.dataNotReceived = true;
                // }
            }
        }

        $scope.regenerateSummaryChanges = function() {
            // console.log("called")
            $scope.purchaseSummaryDataReceived = false;
            $scope.spinnerShow = true;
            $scope.graphData = false;
            $scope.graphDataSup = false;
            $scope.graphDataMinor = false;
            // $scope.dataNotReceived = false;
            CommonService.getRegenerateSummaryChanges($scope.regenrateRes,$scope.selectedPeriod)

            // console.log("called",$rootScope.checkForDisable)
        }

        function getUserEmailId() {
            return $q(function(resolve, reject) {
                CommonService.getUserDefaullEmailId(function(emailIdData) {
                    resolve(emailIdData.data.emailId);
                })
            })
        }
        getUserEmailId().then(function(userEmailId) {
            $scope.userEmailId = userEmailId;
        });
           $scope.openPrompt = function() {

            $scope.emailData = {};
            $scope.emailData.userEmailId = $scope.userEmailId;
            $scope.emailData.userEmailIdNew ="";
             $scope.confirmPopup = $ionicPopup.show({
              scope: $scope,
              template: `<form name="nw" novalidate><div class="smaller">
                                         <input type="email" name="email" placeholder="{{ emailData.userEmailId }}" ng-model="emailData.userEmailIdNew" required/>
                                      <p ng-if="showError" class="errror" style="color:red">Please enter a Valid E-mail id.</p>
                                     <span style="color:red" ng-show="nw.email.$dirty && nw.email.$invalid">
                                     <span ng-show="nw.email.$error.email">Invalid email address.</span>
                                      </span>
                                      </div>
                                      </form>`,
              title: 'Export Invoice Summary',
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
                     if (!$scope.emailData.userEmailId ) {
                          toastMessage("Email is required");
                        } else if (!pattern.test($scope.emailData.userEmailId)) {
                          toastMessage("Please Enter Valid Email");
                        }
                     else {
                        // console.log($scope.emailData.userEmailId);
                        CommonService.exportInvoice($scope.exportInvoiceRes,$scope.selectedPeriod, $scope.emailData.userEmailId);

                      }

                  }
                }
              ]
            });
          };

        $scope.exportInvoiceRes= function(data) {
            if(data.status == 200){
                if (data.data.response === true) {
                    toastMessage("<span style='position: relative;bottom: 20px;'>Invoice export request sent! </br> You will be receiving email shortly.</span>",2000);
                    $scope.confirmPopup.close();
                }
            } else if (data.status == 503){
            }
        }


        $scope.configTab = function(){
            // console.log("called config",$scope.invouceConfigData)
            $rootScope.isFromStateParams = true;
            $state.go('app.invoices.config', {inputParams : $scope.invouceConfigData});
        }


    }

})();
