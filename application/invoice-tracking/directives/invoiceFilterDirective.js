(function() {
  'use strict';

  var invoiceselectorTemplate = `<ion-header-bar  style="width:100%;" ng-style="{'top': currentStateNew == 'app.uploads' ? '44px' : '0px'}"
              class="bar bar-header app-theme-color-level2 app-theme-text-level2 has-header" id="page-head" has-header="true">


              <div class="button icon-right ion-arrow-down-b col-20" ng-click="showYear()" style="font-weight:bold;">
                  {{ yearDetailSelection() }}
              </div>
              <div class="button icon-right ion-arrow-down-b col-80" ng-click="showPeriod()" style="font-weight:bold;">
                {{ periodDetailSelection() }}
              </div>
          </ion-header-bar>
            <ion-tabs class="tabs-icon-top tabs-color-active-balanced">
                <ion-tab>
                    <div class="bar bar-subheader item-text-wrap" style="padding:10px">
                        <div class="button-bar" style="background-color:#fff;">
                            <div ng-repeat="filterbutton in filterButtons track by $index"
                               style="text-overflow: inherit; max-width:{{ filterbutton.max_width }}"
                               class="button button-bal no-horizontal-padding"
                               ng-class="filterbutton.selected ? '' : 'button-out'"
                               ng-click="filterbuttonclick($index)">
                                <span style="vertical-align: sub; padding:10px;text-wrap:normal;font-size: x-small; font-weight: 500;">{{filterbutton.label}} <br/> {{filterbutton.dateLabel}}</span></div>
                        </div>
                    </div>
                </ion-tab>
            </ion-tabs>`;

  projectCostByte.directive('invoiceselector', invoiceselector);
  invoiceselector.$inject = ['$state', '$q', 'Utils', '$rootScope', '$ionicActionSheet', '$ionicScrollDelegate', '$filter', '$window', 'DocumentSelectionService', '$timeout', 'PlTrackerService'];

  function invoiceselector($state, $q, Utils, $rootScope, $ionicActionSheet, $ionicScrollDelegate, $filter, $window, DocumentSelectionService, $timeout, PlTrackerService) {
    return {
      restrict: 'E',
      template: invoiceselectorTemplate,
      scope: {

      },
      link: function(scope, rootScope, element, attribute) {
        var supplierListData;


        function getSupplierList() {
          DocumentSelectionService.fetchSuppliers().then(function(suppliers) {
            //DocumentSelectionService.fetchSuppliers(function(suppliers){
            //   console.log(suppliers);
            supplierListData = suppliers;

            fetchSuppliersResponseHandler(suppliers);
            // $rootScope.$broadcast('suppliers', $scope.supplierList);
          });
        }

        $rootScope.$on('suppliersPageUpdate', function(event) {
          if (supplierListData)
            fetchSuppliersResponseHandler(supplierListData);
        });
        scope.currentStateNew = $rootScope.currentState;

        //                $rootScope.$on('GETSELECTEDSUPPLIER', function(event){
        //                    var selectedIndex = Utils.getIndexIfObjWithOwnAttr(customSupplier, 'selected', true);
        //                    scope.selectedSupplierName = customSupplier[selectedIndex]["supplier_alias_name"];
        //                    $timeout(function(){$rootScope.$emit('UPDATEINVOICE1',scope.selectedSupplierName)});
        //
        //                });
        // $rootScope.$on('$stateChangeSuccess', function(ev, to, toParams, from, fromParams) {
        //     $rootScope.previousState = from.name;
        //     $rootScope.currentState = to.name;
        //     if ($rootScope.currentState == 'app.calendarRefresh') {
        //         $scope.datepickerObject.inputDate = new Date(CommonService.getSelectedDate());
        //     }
        //     console.log('Previous state:' + $rootScope.previousState)
        //     console.log('Current state:' + $rootScope.currentState)

        // });
        // console.log('Current state******:' + $rootScope.currentState)
        // if($rootScope.currentState == "app.uploads"){
        //     // header-item
        //     console.log('if**********');
        //     scope.headBar = document.getElementsByClassName("bar-header");
        //     console.log('scope.headBar: ',scope.headBar);
        //     scope.headBarHeight = (scope.headBar[0].offsetHeight)+"px";
        //     console.log('scope.headBarHeight: ',scope.headBarHeight);
        //     $timeout(function(){
        //         console.log(document.getElementById("page-head"));
        //         console.log(document.getElementById("page-head").style.top);
        //         document.getElementById("page-head").style.top = scope.headBarHeight;
        //         console.log(document.getElementById("page-head").style.top);
        //     },100);

        // }



        function fetchSuppliersResponseHandler(supplierList) {
          var customSupplier = [];

          angular.forEach(supplierList, function(datas, index) {
            if (index == 0) {
              customSupplier.push({
                "supplier_alias_name": "All",
                "selected": true
              })
            }
            if (datas.supplier_alias_name !== "VOID" && datas.supplier_alias_name !== "") {
              datas.selected = false;
              customSupplier.push(datas);
            }
          });

          var selectedIndex = Utils.getIndexIfObjWithOwnAttr(customSupplier, 'selected', true);
          // scope.selectedSupplierName = customSupplier[selectedIndex]["supplier_alias_name"];
          scope.selectedSupplierName = $rootScope.filteredSup ? $rootScope.filteredSup : customSupplier[selectedIndex]["supplier_alias_name"];
          //console.log(scope.selectedSupplierName);
          //scope.$emit('SUPPLIER',scope.selectedSupplierName);
          $timeout(function() {
            $rootScope.$emit('UPDATEINVOICE1', scope.selectedSupplierName)
          });

          scope.showMenus = function() {
            scope.menu_click = true;
            var suppliers = customSupplier;


            // .action-sheet-group{
            //       overflow: scroll;
            //       max-height: 400px;
            // }

            var action_sheet_definition = {
              buttons: [], //         destructiveText: 'Delete',
              titleText: '<h4>Select Supplier</h4>',
              cancelText: 'Cancel',
              cancel: function() {
                // add cancel code..
                // console.log("here");
                scope.menu_click = false;
              },
              buttonClicked: function(index) {
                // change menu here
                // console.log(selectedIndex,index);
                // if (selectedIndex != index) {
                // console.log(index);
                scope.selectedSupplierName = customSupplier[index].supplier_alias_name;
                // console.log('scope.selectedSupplierName2 list: ',scope.selectedSupplierName);
                $timeout(function() {
                  $rootScope.$emit('UPDATEINVOICE1', scope.selectedSupplierName)
                });
                scope.menu_click = false;
                customSupplier[selectedIndex]["selected"] = false;
                // }

                hideSheet();
              }
            }
            for (var i = 0; i < suppliers.length; i++) {
              action_sheet_definition.buttons.push({
                'text': $filter('titleCase')(suppliers[i]["supplier_alias_name"])
                //                                                    +'('+  menus[i]['date']+')'
              })
            }
            // Show the action sheet
            var hideSheet = $ionicActionSheet.show(action_sheet_definition);
            var myEl = angular.element(document.querySelector('.action-sheet-group'));
            // console.log(myEl);
            myEl.css('overflow-y', 'scroll');
            myEl.css('max-height', ($window.innerHeight - 50) + 'px');
          }

        }


        // on selector init
        $timeout(getSupplierList, 0);

        scope.periodDetailSelection = function () {
            if (angular.isDefined(scope.periodList)) {
                var selectedPeriod = {};
                // console.log("scope.periodList in invFilterDir", scope.periodList);
                _.each(scope.periodList, function(p, pIndex) {
                  // console.log($rootScope.globalSelectedPeriod,p.text,$rootScope.globalSelectedPeriod.text);
                    if(angular.isDefined($rootScope.globalSelectedPeriod) && p.text == $rootScope.globalSelectedPeriod.text) {
                        // console.log("period selected index match for ", pIndex);
                        p = $rootScope.globalSelectedPeriod;
                        selectedPeriod = p;
                    } else if(!angular.isDefined($rootScope.globalSelectedPeriod)) {
                        if(pIndex == scope.periodList[scope.periodList.length - 1]) {
                            p.selected = true
                            $rootScope.globalSelectedPeriod = p;
                            selectedPeriod = p;
                        }
                    }
                    // console.log("selectedPeriod : ", selectedPeriod);
                })
                // console.log(selectedPeriod);
                return selectedPeriod.text;
            }
            return ""
        }
        var setPeriodData = function(yearData) {
            scope.periodList = [];
            for(var i=0; i < scope.completePeriodList.length; i++) {
                if(yearData.text === scope.completePeriodList[i].year) {
                    // console.log("scope.completePeriodList[i] : ", scope.completePeriodList[i]);
                    scope.periodList.push(scope.completePeriodList[i]);
                }
            }
            // console.log("scope.periodList in setPeriodData is : ", scope.periodList);
            if(angular.isDefined($rootScope.globalSelectedPeriod)) {
                _.each(scope.periodList, function(p, pIndex) {
                    if(p.text === $rootScope.globalSelectedPeriod.text) {
                        p.selected = true;
                    }
                })
            } else if (!(_.find(scope.periodList, ['selected', true])))  {
                // console.log("$scope.periodList not selected",scope.periodList);
                scope.periodList[scope.periodList.length - 1].selected = true;
                $rootScope.globalSelectedPeriod = scope.periodList[scope.periodList.length - 1];
            } else {
                let periodSelected = _.find(scope.periodList, ['selected', true]);
                $rootScope.globalSelectedPeriod = periodSelected;
            }
        }
        var setPandYdata = function(periodDataList) {
            scope.periodList = [];
            scope.yearList = [];
            var unique = {};
            var temp = "";
            var insertIndex = 0;
            for(var i=0; i < periodDataList.length; i++) {
                if (!unique[periodDataList[i].year]) {
                    scope.yearList.push({text:periodDataList[i].year, selected:periodDataList[i].selected});
                    unique[periodDataList[i].year] = periodDataList[i];
                }
                if(angular.isDefined($rootScope.globalSelectedYear)) {
                    temp = $rootScope.globalSelectedYear;
                } else if(periodDataList[i].selected) {
                    temp = periodDataList[i].year;
                    // console.log("default selected period : ", periodDataList[i]);
                    $rootScope.globalSelectedYear = temp;
                    $rootScope.globalSelectedPeriod = periodDataList[i];
                }
            }
            for(var i=0; i < scope.yearList.length; i++) {
                if(scope.yearList[i].text === temp) {
                    // console.log("scope.yearList[i].text : ", scope.yearList[i].text);
                    scope.yearList[i].selected = true;
                    for(var j=0; j < periodDataList.length; j++) {
                        if(temp === periodDataList[j].year) {
                            scope.periodList[insertIndex] = periodDataList[j];
                            insertIndex ++
                        }
                    }
                    // console.log("scope.periodList in loop : ", scope.periodList)
                }
            }
            if(angular.isDefined(scope.periodList)) {
                _.each(scope.periodList, function(p){
                    if(p.text == $rootScope.globalSelectedPeriod.text) {
                        p.selected = true;
                    }
                })
            }
        }
        scope.showPeriod = function () {
          // console.log(scope.periodList);
            if (scope.periodSelection === 'Period') {
                var hideSheet = $ionicActionSheet.show({
                    buttons: scope.periodList,
                    titleText: '<h4><center>Select Period</center></h4>',
                    cancelText: 'Cancel',
                    cancel: function () {
                    },
                    buttonClicked: function (index) {
                        _.each(scope.periodList, function (p, pIndex) {
                            if (index === pIndex) {
                                p.selected = true;
                                $rootScope.globalSelectedPeriod = p;
                                $rootScope.globalSelectedPeriodIndex = undefined;
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
            var myEl = angular.element(document.querySelector('.action-sheet-group'));
            myEl.css('overflow-y', 'scroll');
            myEl.css('max-height', (window.innerHeight - 50) + 'px');
            // myE1.css('max-width', (window.innerWidth - 120) + 'px');
        };
        var initializeView = function () {
            console.log("filter initializeView called");
            scope.periodSelection = 'Period';
            // $scope.periodDetailSelection = '';
            scope.headerShow = true;
            scope.config = false;
            PlTrackerService.fetchPeriodWeeksWithData()
                .then(function (periodListWithData) {
                    // $scope.periodList = periodListWithData;
                    // $timeout(setWeeksFilterButtons, 1);
                    scope.completePeriodList = periodListWithData;
                    setPandYdata(periodListWithData);
                    $timeout(setWeeksFilterButtons, 1);
                });
                console.log("$rootScope.checkForDisable")
             _.forEach($rootScope.checkForDisable,function(item,index) {
                $rootScope.checkForDisable[index].isDisable = false;
            })

        };

        initializeView();
        scope.yearDetailSelection = function () {
            if (angular.isDefined(scope.yearList)) {
                let selectedYear = _.find(scope.yearList, ['selected', true]);
                return selectedYear.text;
            }
            return ""
        }
        scope.showYear = function() {
            var hideYearSheet = $ionicActionSheet.show({
                buttons: scope.yearList,
                titleText: '<h4><center>Select a Year</center></h4>',
                cancelText: 'Cancel',
                cancel: function () {
                },
                buttonClicked: function (index) {
                    _.each(scope.yearList, function (y, yIndex) {
                        if (index === yIndex) {
                            y.selected = true;
                            // console.log("showYear : ", y);
                            $rootScope.globalSelectedYear = y.text;
                            $rootScope.globalSelectedPeriod = undefined;
                            $rootScope.globalSelectedPeriodIndex = undefined;
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

        var setWeeksFilterButtons = function (periodItem) {
            return $q(function (resolve, reject) {
                // console.log("scope.periodList in setWeeksFilterButtons is : ", scope.periodList);
                if (angular.isDefined(scope.periodList)) {
                    let periodItem = _.find(scope.periodList, ['selected', true]);
                    let buttons = _.transform(periodItem.periodWeeks, function (result, periodWeek, index) {
                        periodWeek.style = '';
                        result.push(periodWeek)
                    });
                    let selectedWeekButton = _.findIndex(buttons, ['selected', true]);
                    // console.log("$rootScope.globalSelectedPeriodIndex in setWeeksFilterButtons : ", $rootScope.globalSelectedPeriodIndex);
                    if(angular.isDefined($rootScope.globalSelectedPeriodIndex)) {
                        selectedWeekButton = $rootScope.globalSelectedPeriodIndex
                    } else if (selectedWeekButton === -1) {
                        selectedWeekButton = 0;
                        $rootScope.globalSelectedPeriodIndex = selectedWeekButton;
                    }
                    scope.filterButtons = buttons;
                    // console.log("scope.filterButtons in setWeeksFilterButtons is : ", scope.filterButtons);
                    scope.filterbuttonclick(selectedWeekButton);
                    resolve(true)
                }

            })

        };
        $rootScope.checkForDisable=[];
        scope.isDuplicate = false;
        scope.filterbuttonclick = function (filterbuttonindex) {
            console.log("filterbuttonclick")
            if($rootScope.refreshSummary){
                $rootScope.regenerateSummary = false;
            }
            $rootScope.invoiceData.searchText = '';
            scope.spinnerHide = false;
            _.each(scope.filterButtons, function (button, index) {
                if (index === filterbuttonindex) {
                    $rootScope.globalSelectedPeriodIndex = index;
                    button.selected = true;
                } else {
                    button.selected = false;
                }
            });
            if($rootScope.checkForDisable.length == 0) {
                $rootScope.checkForDisable.push({'periodWeek' :scope.filterButtons[filterbuttonindex].periodWeekTag,'isDisable':false})
            } else if($rootScope.checkForDisable){
                _.forEach($rootScope.checkForDisable,function(item){
                    if(item.periodWeek.includes(scope.filterButtons[filterbuttonindex].periodWeekTag)) {
                        scope.isDuplicate = true;
                    }
                })
                if(!scope.isDuplicate){
                    $rootScope.checkForDisable.push({'periodWeek' :scope.filterButtons[filterbuttonindex].periodWeekTag,'isDisable':false})
                }
            }
            // console.log("called",$rootScope.regenerateSummary)
            _.forEach($rootScope.checkForDisable,function(item,index) {
                if(item.isDisable == true && scope.filterButtons[filterbuttonindex].periodWeekTag == item.periodWeek){
                    $rootScope.regenerateSummary = true;
                    // console.log("called")
                }
            })
            
            // console.log("calling filterbuttonclick year, period, index: ", $rootScope.globalSelectedYear, $rootScope.globalSelectedPeriod, $rootScope.globalSelectedPeriodIndex);
            scope.$emit('GETINVOICEFORPERIOD', scope.filterButtons[filterbuttonindex].periodWeekTag)
            scope.$emit('GETINVOICEFORPERIODConfigSummary', scope.filterButtons[filterbuttonindex].periodWeekTag)
            // fetchPandLData($scope.filterButtons[filterbuttonindex].periodWeekTag)
        };

        scope.periodClickHandler = function () {
            scope.periodSelection = 'Period';
            scope.headerShow = true;
            scope.config = false;
            rootScope.showSearchBtn = false;
        };



      }
    }
  }
})();
