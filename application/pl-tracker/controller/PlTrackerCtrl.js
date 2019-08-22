(function () {
    projectCostByte.controller('PlTrackerCtrl', plTrackerCtrl);

    plTrackerCtrl.$inject = ['$scope', '$parse', 'PlTrackerService', 'Utils', '$ionicNavBarDelegate', '$ionicActionSheet', '$state', '$q', '$timeout','$rootScope','$cordovaFile','$ionicPopup','$ionicLoading'];

    function plTrackerCtrl($scope, $parse, PlTrackerService, Utils, $ionicNavBarDelegate, $ionicActionSheet, $state, $q, $timeout,$rootScope,$cordovaFile,$ionicPopup,$ionicLoading) {

        $scope.periodSelectionTitle = 'Profit and Loss Tracker';
        $scope.showPlus = true;
        $scope.subHeaderText = function () {

            let frequencyText = ""
            if (angular.isDefined($scope.periodList)) {
                frequencyText = _.capitalize($scope.periodDetailSelection(true));
            }
            return frequencyText;
        };

        var setPandYdata = function(periodDataList) {
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
                if(periodDataList[i].selected)
                    temp = periodDataList[i].year;
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
        }

        var setPeriodData = function(yearData) {
            $scope.periodList = [];
            for(var i=0; i < $scope.completePeriodList.length; i++) {
                if(yearData.text === $scope.completePeriodList[i].year) {
                    $scope.periodList.push($scope.completePeriodList[i]);
                }
            }
            if(!(_.find($scope.periodList, ['selected', true])))  {
                $scope.periodList[$scope.periodList.length - 1].selected = true;
            }
        }

        $scope.initializeView = function () {


            // $scope.periodDetailSelection = '';
            $scope.headerShow = true;
            $scope.config = false;
            PlTrackerService.fetchPeriodWeeksWithData()
                .then(function (periodListWithData) {
                    // $scope.periodList = periodListWithData;
                    // $timeout(setWeeksFilterButtons, 1);
                    $scope.completePeriodList = periodListWithData;
                    setPandYdata(periodListWithData);
                    $timeout(setWeeksFilterButtons, 1);
                });


        };




        $scope.periodDetailSelection = function (showDates) {
            if (angular.isDefined($scope.periodList)) {
                let selectedPeriod = _.find($scope.periodList, ['selected', true]);
                if (showDates) {
                    return selectedPeriod.text;
                } else {
                    return selectedPeriod.label;
                }
            }
            return ""
        }

        $scope.yearDetailSelection = function () {
            if (angular.isDefined($scope.yearList)) {
                let selectedYear = _.find($scope.yearList, ['selected', true]);
                return selectedYear.text;
            }
            return ""
        }

        // $scope.monthClickHandler = function () {
        //     $scope.periodSelection = 'Monthly';
        //     $scope.periodDetailSelection = 'Jan';
        //     $scope.periodDetailSelection_tag = 'MONTH_1';
        //     $scope.pandlTag = $scope.periodDetailSelection_tag.concat("_" + moment().utc().year());
        //     $scope.initData = false;
        //     fetchPandLData($scope.pandlTag);
        //
        // };

        $scope.periodClickHandler = function () {
            $scope.periodSelectionTitle = 'Profit and Loss Tracker';
            $scope.periodSelection = 'Period';
            $scope.headerShow = true;
            $scope.config = false;
            $rootScope.showSearchBtn = false;
            $scope.showPlus = true;
            $rootScope.searchItem = false;
        };

        $scope.configClickHandler = function () {
            $scope.periodSelectionTitle='';
            $scope.periodSelection = 'Config';
            $scope.headerShow = false;
            $scope.config = true;
            // $rootScope.showSearchBtn = true;
            $rootScope.searchItem = true;
            $scope.showPlus = false;

        };
        $rootScope.data={
            'searchText':''
        }
        $scope.showSearchBar = function(){
            $rootScope.showSearchBtn = false;
            $rootScope.searchItem = true;
        }
        $scope.$watch('data.searchText', function(newVal) {
            $rootScope.$broadcast('start_search')
        }, true);

        $scope.closeSearch = function(){
            // $rootScope.searchItem = false;
            $rootScope.searchItem = true;
            $rootScope.showSearchBtn = true;
            $rootScope.data.searchText = '';
        }
        var convertDatesRangeToLabel = function (startDate, endDate) {
            let start = new Date(startDate * 1000),
                end = new Date(endDate * 1000);
            return (start.getMonth() + 1) + '/' + start.getDate() + " - " + (end.getMonth() + 1) + '/' + end.getDate();
        }

        var setWeeksFilterButtons = function (periodItem) {
            return $q(function (resolve, reject) {
                if (angular.isDefined($scope.periodList)) {
                    let periodItem = _.find($scope.periodList, ['selected', true]);
                    let buttons = _.transform(periodItem.periodWeeks, function (result, periodWeek, index) {
                        periodWeek.style = '';
                        result.push(periodWeek)
                    });
                    let selectedWeekButton = _.findIndex(buttons, ['selected', true]);
                    if (selectedWeekButton === -1) {
                        selectedWeekButton = 0;
                    }
                    $scope.filterButtons = buttons;
                    $scope.filterbuttonclick(selectedWeekButton);
                    resolve(true)
                }

            })

        };


        $scope.filterbuttonclick = function (filterbuttonindex) {
            $scope.spinnerHide = false;
            _.each($scope.filterButtons, function (button, index) {
                if (index === filterbuttonindex) {
                    button.selected = true;
                } else {
                    button.selected = false;
                }
            });
            $scope.selectedPeriodWeek=$scope.filterButtons[filterbuttonindex].periodWeekTag;
            fetchPandLData($scope.filterButtons[filterbuttonindex].periodWeekTag)
        };


        $scope.rowSize = {
            // name: 35,
            name: 50,
            price: 15,
            qty: 19,
            units: 7,
            value: 19
        };


        $scope.showPeriod = function () {
            if ($scope.periodSelection === 'Period') {
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
                                $timeout(setWeeksFilterButtons, 1);
                            } else {
                                p.selected = false;
                            }
                        });

                        //hideSheet();
                        return true;
                    }
                });
            }

            // if ($scope.periodSelection === 'Monthly') {
            //     var hideSheet = $ionicActionSheet.show({
            //         buttons: $scope.monthList,
            //         titleText: '<h4>Select a Month</h4>',
            //         cancelText: 'Cancel',
            //         cancel: function () {
            //         },
            //         buttonClicked: function (index) {
            //             //send index number
            //             $scope.periodDetailSelection = $scope.monthList[index - 1].text;
            //             $scope.pandlTag = $scope.periodDetailSelection.concat("_2017");
            //             $scope.initData = false;
            //             fetchPandLData($scope.pandlTag);
            //             //hideSheet();
            //             return true;
            //         }
            //     });
            // }
            var myEl = angular.element(document.querySelector('.action-sheet-group'));
            myEl.css('overflow-y', 'scroll');
            myEl.css('max-height', (window.innerHeight - 50) + 'px');
            myEl.css('max-width', (window.innerWidth - 120) + 'px');
        };

        $scope.showYear = function() {
            var hideYearSheet = $ionicActionSheet.show({
                buttons: $scope.yearList,
                titleText: '<h4><center>Select a Year</center></h4>',
                cancelText: 'Cancel',
                cancel: function () {
                },
                buttonClicked: function (index) {
                    _.each($scope.yearList, function (y, yIndex) {
                        if (index === yIndex) {
                            y.selected = true;
                            setPeriodData(y);
                            $timeout(setWeeksFilterButtons, 1);
                        } else {
                            y.selected = false;
                        }
                    });
                    return true;
                }
            });
            var myE2 = angular.element(document.querySelector('.action-sheet-group'));
            myE2.css('overflow-y', 'scroll');
            myE2.css('max-height', (window.innerHeight - 50) + 'px');
            myE2.css('max-width', (window.innerWidth - 120) + 'px');
        };
        var getCogsData= function(data)
        {

        }

        var pandlRHandler = function (data) {

            if (angular.isDefined(data.data_list)){
                $scope.pandlData = data.data_list;
                initializeExportData($scope.pandlData);
            }else{
                $scope.pandlData = [];
                $scope.noData = true;
            }

            $scope.spinnerHide = true;

        };

        var fetchPandLData = function (pandlTag) {
            $rootScope.selectedPeriodWeek=pandlTag;
            $scope.fileName = pandlTag;
            PlTrackerService.fetchPandLData(pandlRHandler, pandlTag);
        };

        $timeout(function() {
                  $rootScope.$emit('plItem', $scope.selectedPeriodWeek)
                });
        $scope.$on('PL_DATECHANGE_EVENT', function (event) {
            $scope.initializeView();
        });

        $scope.getPnLItems= function(){
            PlTrackerService.fetchPnLItems().then(function (data) {
                $scope.pnLItems = data;
                $scope.pnlConfig = "pnlConfig";
                $rootScope.$broadcast('pnl_mapped',data);
            });
        }
        $scope.getPnLItems();
        $rootScope.$on('pnl_to_map', function (event) {
            $scope.getPnLItems()
        });
        $rootScope.$on('pnl_to_mapped', function (event) {
            $scope.getPnLItems()
        });

        // $scope.goToPAndLCharts = function (item) {
        //     $state.go(item.ui_click_destination).then(function () {
        //     })
        // }
        var toastMessage = function(message_text, duration) {
          if (typeof duration === 'undefined') duration = 1500;
          $ionicLoading.show({
            template: message_text,
            noBackdrop: true,
            duration: duration,
          });
        };
        // Excel export start

        var initializeExportData = function(pandldata) {
            // Prepare Excel data:
            $scope.exportData = [];
            var rowNum = 0;
          // Headers:
            // $scope.exportData.push(["#", "Movie", "Actor"]);
            $scope.exportData.push(["Row number", "Item name", "Sub item Name",  "Sub item budget", "Sub item value", "Sub item variance", "Sub item percentage", "Total value", "Total percentage"]);
          // Data:
            _.each(pandldata, function(totalValue, tIndex) {
                _.each(totalValue.list, function(subValue, sIndex) {
                    if(sIndex == 0) {
                        $scope.exportData.push([++rowNum, totalValue.name, subValue.item_name, subValue.budget, "$"+subValue.value, subValue.variance, subValue.percentage+"%", "$"+totalValue.total_value, totalValue.percentage+"%"]);
                    } else {
                        $scope.exportData.push(["", "", subValue.item_name, subValue.budget, "$"+subValue.value, subValue.variance, subValue.percentage+"%", "", ""]);
                    }
                })
            });


        }
        $scope.confirmExport = function() {
                var confirmPopup = $ionicPopup.confirm({
                  title: 'Do you want to export '+$scope.fileName+' data as csv?',
                  cancelText: 'No',
                  okText: 'Yes',
                  okType:'button-bal'
                });
                confirmPopup.then(function(res) {
                  if (res) {
                    $scope.exportCSV();
                  }
                });
            }

        $scope.exportCSV = function (){
            var jsonObject = JSON.stringify($scope.exportData);
            var finalCSV = ConvertToCSV(jsonObject);
            $cordovaFile.writeFile(cordova.file.externalDataDirectory, $scope.fileName + '.csv', finalCSV, true).then(function(result){
                toastMessage('Export successful',5000);
            }, function(err) {
                toastMessage('Export failed',5000);
            })

        }


        function ConvertToCSV(objArray) {
            var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
            var str = '';

            for (var i = 0; i < array.length; i++) {
                var line = '';
                for (var index in array[i]) {
                    if (line != '') line += ','

                    line += array[i][index];
                }

                str += line + '\r\n';
            }

            return str;
        }


    }
    projectCostByte.directive("repeatEnd", function(){
        return {
            restrict: "A",
            link: function (scope, element, attrs) {
                if (scope.$last) {
                    scope.$eval(attrs.repeatEnd);
                }
            }
        };
    });


})();
