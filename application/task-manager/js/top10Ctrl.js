(function () {
    'use strict';
    projectCostByte.controller('top10Ctrl', top10Ctrl);

    top10Ctrl.$inject = ['$scope', 'CommonService', '$ionicScrollDelegate', 'ionicDatePicker',
        '$ionicActionSheet', '$ionicPopover', 'ErrorReportingServiceOne', 'Utils', '$timeout'];

    function top10Ctrl($scope, CommonService, $ionicScrollDelegate, ionicDatePicker,
                       $ionicActionSheet, $ionicPopover, ErrorReportingServiceOne, Utils, $timeout) {

        $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
            viewData.enableBack = true;
        });

        $scope.filterButtons = [{
            'label': 'Top Sales',
            'filter_tag': 'top_sales',
            'style': 'button-calm',
            'clicked': true,
            'sortClass': '-item_sales'
        }, {
            'label': 'Low Sales',
            'filter_tag': 'low_sales',
            'style': 'button-calm',
            'clicked': false,
            'sortClass': 'item_sales'
        }, {
            'label': 'High Cost',
            'filter_tag': 'high_cost',
            'style': 'button-calm',
            'clicked': false,
            'sortClass': '-menu_cost_percent'
        },];

        //  function to return the selected filter button sorting option
        $scope.userSortingClass = function () {
            return _.get(_.find($scope.filterButtons, ['clicked', true]), 'sortClass')
        };

        var timePeriodOptions = [
            {
                key: "DAILY",
                label: "Daily",
                prefix: "Top 5 of ",
                selected: true,
                disableWeekdays: []
            },
            {
                key: "LAST_7_DAYS",
                label: "Weekly",
                prefix: "Top 5 of  ",
                selected: false,
                disableWeekdays: [1, 2, 3, 5, 4, 6]
            }];


        $scope.selectedTimePeriod = function (key) {
            if (angular.isUndefined(key)) {
                key = 'key';
            }
            return _.get(_.find(timePeriodOptions, ['selected', true]), key)
        };

        let fetchDisabledDatesRH = function (dates) {
            $scope.datesDisabled = _.transform(dates, function (result, aDate) {
                result.push(new Date(aDate));
            });

        };


        $scope.initializeView = function () {
            // console.log('initializeView ');

            $scope.navBarTitle.showToggleButton = true;
            $scope.menuData = [];
            $scope.price = [];
            $scope.topSales_dict = [];
            $scope.costPer_dict = [];
            $scope.final_dict = [];
            $scope.response_counter = 0;

            fetchDatesAndData();
            $scope.request_counter = 0;
            Utils.setHeaderTitle("My Dashboard");

            
            $scope.latestDate = moment.utc().startOf("day").format('MM/DD/YYYY');
            // CommonService.fetchDisabledDates(fetchDisabledDatesRH, new Date(2016, 6, 1), new Date());

        };

        var disabledDatesRH = function (dates) {
            $scope.datesDisabled = _.transform(dates, function (result, dateString) {
                let disableDate = new Date(dateString);
                result.push(disableDate)
            });

        };

        var dateResponseHandler = function (dateString) {
            $scope.latestDate = dateString;
            CommonService.setSelectedDate(new Date(dateString));
            fetchAllMenuData();
        };


        var fetchAllMenuDataResponseHandler = function (menuData) {
            _.each(menuData, function (menuItem) {
//                menuItem.menu_cost_percent = (menuItem.base_cost / menuItem.base_price) * 100;
                if(menuItem.base_cost && menuItem.base_price ){
                    menuItem.menu_cost_percent = (menuItem.base_cost / menuItem.base_price) * 100;
                } else {
                    menuItem.menu_cost_percent = 0;
                }
                if (menuData.menu_cost_percent === 0) {
                    menuData.menu_cost_percent = "COST INFORMATION NOT AVAILABLE";
                }
            });
            if (angular.isDefined(menuData)) {
                $scope.menuData = menuData;
            } else {
                $scope.menuData = [];
            }


            $scope.$broadcast('TOP5_FREE');
        };

        $scope.showReportPopover = function ($event, name) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.myClick = name;
            $scope.errorReportPopover.show($event)
        };

        $ionicPopover.fromTemplateUrl('application/error-reporting/reportPopover.html', {
            scope: $scope
        })
            .then(function (popover) {
                $scope.errorReportPopover = popover;
                $scope.errorReporting = function () {
                    $scope.errorReportPopover.hide();
                    // var item = $scope.myClick;
                    // console.log(item);
                    ErrorReportingServiceOne.showErrorReportForm(
                        {
                            'page': 'Dashboard-Top5',
                            'component': $scope.myClick,
                            'modalName': $scope.errorReportPopover
                        },
                        {
                            'page': 'Dashboard-Top5',
                            'component': 'Sales Item'
                        }) //TODO change component key to component_type in API
                        .then(function (result) {
                            //                                        console.log(result)
                        });
                }
            });


        $scope.showPeriod = function () {
            var hideSheet = $ionicActionSheet.show({
                buttons: _.map(timePeriodOptions, function (o) {
                    return {'text': o.label}
                }),
                titleText: '<h4>Select Period</h4>',
                cancelText: 'Cancel',
                cancel: function () {
                },
                buttonClicked: function (index) {
                    _.each(timePeriodOptions, function (t) {
                        t.selected = false
                    });
                    timePeriodOptions[index].selected = true;
                    fetchDatesAndData();
                    hideSheet();
                }
            });
        };

        var fetchDatesAndData = function () {
            CommonService.fetchMarginOptimizerlatestDate(dateResponseHandler, $scope.selectedTimePeriod(), new Date());
            CommonService.fetchMarginOptimizerDisabledDates(disabledDatesRH, $scope.selectedTimePeriod(), new Date(2016, 6, 1), new Date());
        };

        $scope.openDatePicker = function () {
            let datePickerObject = {
                callback: function (val) {  //Mandatory
                    let selectedDate = new Date(val);
                    $scope.latestDate = CommonService.changeDateFormat(selectedDate);
                    CommonService.setSelectedDate(selectedDate);
                    $timeout(function () {
                        fetchAllMenuData();
                    }, 5)

                },
                disabledDates: $scope.datesDisabled,
                from: new Date(2016, 6, 1), //Optional
                to: new Date(), //Optional
                inputDate: CommonService.getSelectedDate(),      //Optional
                mondayFirst: true,          //Optional
                disableWeekdays: _.get(_.find(timePeriodOptions, ['selected', true]), 'disableWeekdays'),  //Optional
                closeOnSelect: false,       //Optional
                templateType: 'popup'       //Optional
            };


            ionicDatePicker.openDatePicker(datePickerObject);
        };


        var fetchAllMenuData = function () {
            $scope.$broadcast('TOP5_BUSY');
            CommonService.fetchMarginOptimizerAllMenusData(fetchAllMenuDataResponseHandler,
                $scope.selectedTimePeriod());
        };

        $scope.$on('TOP5_BUSY', function (event) {
            $scope.spinnerHide = false;

        });

        $scope.$on('TOP5_FREE', function (event) {
            $scope.spinnerHide = true;
            $timeout(function () {
                $ionicScrollDelegate.resize();
            }, 5)
        });


    }

})();




